import defaultConfig from './defaultConfig.js';
import RequestProcessor from './requestProcessor.js';
import ResponseProcessor from './responseProcessor.js';
import ErrorHandler from './errorHandler.js';

/** @typedef {import('./types').ApiConfig} ApiConfig */
/** @typedef {import('./types').RequestOptions} RequestOptions */
/** @typedef {import('./types').ErrorResponse} ErrorResponse */
/** @typedef {import('./types').ParamsObject} ParamsObject */

/**
 * API Client for making HTTP requests
 */
class ApiClient {
    /**
     * Create a new API client instance
     * @param {Partial<ApiConfig>} config - Configuration options to override defaults
     */
    constructor(config = {}) {
        /** @type {ApiConfig} */
        this.config = { ...defaultConfig, ...config };
        this.abortControllers = new Map();
        
        // Initialize helper classes
        this.requestProcessor = new RequestProcessor(this.config);
        this.responseProcessor = new ResponseProcessor(this.config);
        this.errorHandler = new ErrorHandler(
            this.config, 
            this.config.debug, 
            this.config.logger
        );

        // Initialize interceptors
        this.interceptors = {
            request: {
                /**
                 * Add a request interceptor
                 * @param {(config: {config: ApiConfig, options: RequestInit}) => Promise<{config?: ApiConfig, options?: RequestInit}>} fulfilled - Function to process request
                 * @param {(error: Error) => Promise<any>} rejected - Function to handle errors
                 * @returns {number} - ID to use when removing the interceptor
                 */
                use: (fulfilled, rejected) => {
                    if(this.config?.interceptors?.request) {
                        this.config.interceptors.request.push({ fulfilled, rejected });
                        return this.config.interceptors.request.length - 1;
                    }
                    return -1;
                },
                /**
                 * Remove a request interceptor
                 * @param {number} id - ID of the interceptor to remove
                 */
                eject: (id) => {
                    if (id !== undefined && this.config?.interceptors?.request) {
                        this.config.interceptors.request.splice(id, 1);
                    }
                },
                /**
                 * Remove all request interceptors
                 */
                clear: () => {
                    if(this.config?.interceptors?.request) this.config.interceptors.request = [];
                }
            },
            response: {
                /**
                 * Add a response interceptor
                 * @param {(response: {data: any, response: Response, config: ApiConfig}) => Promise<{data?: any, response?: Response}>} fulfilled - Function to process response
                 * @param {(error: Error) => Promise<any>} rejected - Function to handle errors
                 * @returns {number} - ID to use when removing the interceptor
                 */
                use: (fulfilled, rejected) => {
                    if (this.config?.interceptors?.response) {
                        this.config.interceptors.response.push({ fulfilled, rejected });
                        return this.config.interceptors.response.length - 1;
                    }
                    return -1;
                },
                /**
                 * Remove a response interceptor
                 * @param {number} id - ID of the interceptor to remove
                 */
                eject: (id) => {
                    if (id !== undefined && this.config?.interceptors?.response) {
                        this.config.interceptors.response.splice(id, 1);
                    }
                },
                /**
                 * Remove all response interceptors
                 */
                clear: () => {
                    if(this.config?.interceptors?.response) this.config.interceptors.response = [];
                }
            }
        };
    }

    /**
     * Execute a request with retry mechanism
     * @private
     * @param {() => Promise<any>} requestFn - Function that performs the request
     * @param {ApiConfig} requestConfig - Request configuration
     * @param {number} retries - Number of retries remaining
     * @returns {Promise<any>} - Response data
     */
    async _executeWithRetry(requestFn, requestConfig, retries) {
        try {
            return await requestFn();
        } catch (error) {
            const { retry, retryDelay, retryCondition, debug, logger } = requestConfig;
    
            // Convert error to ErrorResponse if needed
            const errorToPass = error && typeof error === 'object' && 'status' in error 
                ? /** @type {ErrorResponse} */ (error) 
                : this.errorHandler.processNetworkError(
                    error instanceof Error ? error : new Error(String(error)), // Convert to Error if needed
                    '', // URL not available here
                    '', // Method not available here
                    {}, 
                    {}
                );
    
            // Check if we should retry
            if (retries > 0 && retryCondition(errorToPass)) {
                if (debug) {
                    logger(`Retrying request (${retry - retries + 1}/${retry}). Waiting ${retryDelay}ms...`);
                }
    
                // Wait for the specified delay
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
    
                // Try again with one less retry
                return this._executeWithRetry(requestFn, requestConfig, retries - 1);
            }
    
            // No more retries or condition not met - propagate the error
            throw error;
        }
    }

    /**
     * Make an HTTP request
     * @private
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {string} endpoint - API endpoint
     * @param {ParamsObject} params - URL parameters
     * @param {any} data - Request body data
     * @param {RequestOptions} options - Additional fetch options
     * @returns {Promise<any>} - Response data
     */
    async _request(method, endpoint, params = {}, data = null, options = {}) {
        const { config: tempConfig, ...restOptions } = options;
        const requestConfig = tempConfig ? { ...this.config, ...tempConfig } : this.config;

        try {
            // Call lifecycle hooks
            this._executeHook(requestConfig.onBefore, { method, endpoint, params, data, options: restOptions });
            this._executeHook(requestConfig.onLoading, true);

            // Prepare URL and initial options - using the instance method from requestProcessor
            const url = this.requestProcessor.prepareUrl(endpoint, params, requestConfig);
            let { fetchOptions, abortController } = this.requestProcessor.prepareOptions(
                method,
                restOptions,
                data,
                requestConfig
            );

            // Apply request interceptors
            const intercepted = await this.requestProcessor.applyRequestInterceptors(requestConfig, fetchOptions);
            const finalRequestConfig = intercepted.config;
            const finalFetchOptions = intercepted.options;

            // Store abort controller if we created one
            if (abortController) {
                const requestId = Date.now().toString();
                this.abortControllers.set(requestId, abortController);
            }

            // Define the actual request function
            const makeRequest = async () => {
                try {
                    // This will only throw for true network errors like CORS or no internet
                    const response = await fetch(url, finalFetchOptions);

                    // Process the response, which handles HTTP errors (4xx, 5xx)
                    return await this.responseProcessor.process(response, finalRequestConfig);
                } catch (error) {
                    // Check if this is a network error or an error already handled by _processResponse
                    if (error instanceof Error && 'handledByClient' in error && error.handledByClient) {
                        // This error was already handled, just rethrow it
                        throw error;
                    }

                    // This is a TRUE network error (not an HTTP status error)
                    const networkError = this.errorHandler.processNetworkError(
                        error instanceof Error ? error : new Error(String(error)),
                        url,
                        method,
                        params,
                        // Convert headers to plain object or use empty object if undefined
                        finalFetchOptions.headers ? Object.fromEntries(
                            finalFetchOptions.headers instanceof Headers 
                                ? finalFetchOptions.headers.entries() 
                                : Array.isArray(finalFetchOptions.headers)
                                    ? finalFetchOptions.headers
                                    : Object.entries(finalFetchOptions.headers)
                        ) : {}
                    );

                    return this.errorHandler.handleError(networkError);
                }
            };

            // Execute with retry if configured
            const result = await this._executeWithRetry(
                makeRequest,
                finalRequestConfig,
                finalRequestConfig.retry
            );

            // Call success lifecycle hook
            this._executeHook(finalRequestConfig.onAfter, result);

            return result;
        } catch (error) {
            // If the error has already been handled, just re-throw
            if (!error || (error instanceof Error && 'handledByClient' in error && error.handledByClient)) {
                throw error;
            }

            // Handle aborted requests
            if (error && error instanceof Error && error.name === 'AbortError') {
                // Convert AbortError to ErrorResponse before processing
                const abortErrorResponse = /** @type {ErrorResponse} */ ({
                    status: 499, // Custom status for canceled requests
                    message: error.message || 'Request aborted',
                    type: 'abort',
                    code: 'ABORT',
                    handledByClient: true,
                    timestamp: new Date().toISOString(),
                    originalError: error
                });
                this.errorHandler.processAbortError(abortErrorResponse);
            }
            // For any errors that haven't been handled yet
            else if (typeof requestConfig.onError === 'function') {
                // If it's an Error object with a handledByClient property
                if (error instanceof Error) {
                    // Create a proper ErrorResponse from the Error
                    const errorResponse = /** @type {ErrorResponse} */ ({
                        status: 0, // Unknown status
                        message: error.message,
                        type: 'network', // Default type for unknown errors
                        code: 'UNKNOWN_ERROR',
                        handledByClient: true,
                        timestamp: new Date().toISOString(),
                        originalError: error
                    });
                    requestConfig.onError(errorResponse);
                }
                // Otherwise pass the error as is - should be rare but handle it to be safe
                else {
                    // Create a generic ErrorResponse for non-Error objects
                    const errorResponse = /** @type {ErrorResponse} */ ({
                        status: 0,
                        message: String(error),
                        type: 'network',
                        code: 'UNKNOWN_ERROR',
                        handledByClient: true,
                        timestamp: new Date().toISOString()
                    });
                    requestConfig.onError(errorResponse);
                }
            }

            throw error;
        } finally {
            // Call final lifecycle hooks
            this._executeHook(requestConfig.onFinally);
            this._executeHook(requestConfig.onLoading, false);
        }
    }

    /**
     * Execute a hook function if it's not empty
     * @private
     * @param {Function|undefined} hook - Hook function
     * @param {...any} args - Arguments to pass to hook
     */
    _executeHook(hook, ...args) {
        if (typeof hook === 'function' && hook.toString() !== '() => {}') {
            hook(...args);
        }
    }

    /** @typedef {import('./types').RequestData} RequestData */
    
    /**
     * Create an HTTP method function (GET, POST, etc.)
     * @private
     * @param {string} method - HTTP method to create
     * @returns {function(this: ApiClient, string, ...any[]): Promise<any>} - Method function for the specified HTTP method
     */
    static _createMethod(method) {
      /**
       * HTTP method function
       * @param {string} endpoint - API endpoint
       * @param {...any} args - Variable arguments (data, params, options)
       * @returns {Promise<any>}
       */
      return function(endpoint, ...args) {
        const normalized = RequestProcessor.normalizeParams(method, endpoint, args);
        return this._request(
          normalized.method,
          normalized.endpoint,
          normalized.params,
          normalized.data,
          normalized.options
        );
      };
    }
    
    // Define all HTTP methods using the method creator with proper JSDoc
    /**
     * Make a GET request
     * @method
     * @param {string} endpoint - API endpoint
     * @param {ParamsObject} [params] - URL parameters
     * @param {RequestOptions} [options] - Additional fetch options
     * @returns {Promise<any>}
     */
    get = ApiClient._createMethod('GET');
    
    /**
     * Make a POST request
     * @method
     * @param {string} endpoint - API endpoint
     * @param {RequestData} [data] - Request body data
     * @param {ParamsObject} [params] - URL parameters
     * @param {RequestOptions} [options] - Additional fetch options
     * @returns {Promise<any>}
     */
    post = ApiClient._createMethod('POST');
    
    /**
     * Make a PUT request
     * @method
     * @param {string} endpoint - API endpoint
     * @param {RequestData} [data] - Request body data
     * @param {ParamsObject} [params] - URL parameters
     * @param {RequestOptions} [options] - Additional fetch options
     * @returns {Promise<any>}
     */
    put = ApiClient._createMethod('PUT');
    
    /**
     * Make a DELETE request
     * @method
     * @param {string} endpoint - API endpoint
     * @param {ParamsObject} [params] - URL parameters
     * @param {RequestOptions} [options] - Additional fetch options
     * @returns {Promise<any>}
     */
    delete = ApiClient._createMethod('DELETE');
    
    /**
     * Make a PATCH request
     * @method
     * @param {string} endpoint - API endpoint
     * @param {RequestData} [data] - Request body data
     * @param {ParamsObject} [params] - URL parameters
     * @param {RequestOptions} [options] - Additional fetch options
     * @returns {Promise<any>}
     */
    patch = ApiClient._createMethod('PATCH');

    /**
     * Upload a file or multiple files
     * @param {string} endpoint - API endpoint
     * @param {Record<string, File|File[]>} [files] - Object mapping field names to File objects or arrays of File objects
     * @param {Record<string, any>} [extraData] - Additional form data to include
     * @param {ParamsObject|RequestOptions} [paramsOrOptions] - URL parameters if object, or options if no params needed
     * @param {RequestOptions} [options] - Additional fetch options (optional if paramsOrOptions contains options)
     * @returns {Promise<any>} - Response data
     */
    async upload(endpoint, files = {}, extraData = {}, paramsOrOptions = {}, options = {}) {
        // Using direct reference to static method
        const normalized = RequestProcessor.normalizeParams('UPLOAD', endpoint, [files, extraData, paramsOrOptions, options]);
        return this._request(
            normalized.method,
            normalized.endpoint,
            normalized.params,
            normalized.data,
            normalized.options
        );
    }

    /**
     * Execute multiple API requests in parallel with named results
     * @param {Record<string, Promise<any>>|Array<Promise<any>>} requestsMap - Object mapping result names to API call promises
     * @returns {Promise<Record<string, any>>} - Object containing results with the same keys as the input object
     */
    async all(requestsMap) {
        // Handle both array and object inputs
        if (Array.isArray(requestsMap)) {
            // Array input - use numbered properties
            const promises = requestsMap;
            return Promise.all(promises)
                .then((responses) => {
                    /** @type {Record<string, any>} */
                    const results = {};
                    responses.forEach((response, index) => {
                        results[`result${index + 1}`] = response;
                    });
                    return results;
                })
                .catch((error) => {
                    throw error;
                });
        } else {
            // Object input - preserve property names
            const keys = Object.keys(requestsMap);
            const promises = Object.values(requestsMap);
    
            return Promise.all(promises)
                .then((responses) => {
                    /** @type {Record<string, any>} */
                    const results = {};
                    keys.forEach((key, index) => {
                        results[key] = responses[index];
                    });
                    return results;
                })
                .catch((error) => {
                    throw error;
                });
        }
    }

    /**
     * Abort all pending requests
     * @param {string} reason - Reason for aborting
     */
    abortAll(reason = 'Request aborted by user') {
        this.abortControllers.forEach((controller) => {
            controller.abort(reason);
        });
        this.abortControllers.clear();
    }
}

export default ApiClient;