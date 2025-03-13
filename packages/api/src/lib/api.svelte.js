import defaultConfig from './defaultConfig.js';
import RequestProcessor from './requestProcessor.js';
import ResponseProcessor from './responseProcessor.js';
import ErrorHandler from './errorHandler.js';

/**
 * API Client for making HTTP requests
 */
class ApiClient {
    /**
     * Create a new API client instance
     * @param {Object} config - Configuration options to override defaults
     */
    constructor(config = {}) {
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
                use: (fulfilled, rejected) => {
                    this.config.interceptors.request.push({ fulfilled, rejected });
                    return this.config.interceptors.request.length - 1;
                },
                eject: (id) => {
                    if (id !== undefined) {
                        this.config.interceptors.request.splice(id, 1);
                    }
                },
                clear: () => {
                    this.config.interceptors.request = [];
                }
            },
            response: {
                use: (fulfilled, rejected) => {
                    this.config.interceptors.response.push({ fulfilled, rejected });
                    return this.config.interceptors.response.length - 1;
                },
                eject: (id) => {
                    if (id !== undefined) {
                        this.config.interceptors.response.splice(id, 1);
                    }
                },
                clear: () => {
                    this.config.interceptors.response = [];
                }
            }
        };
    }

    /**
     * Execute a request with retry mechanism
     * @private
     * @param {Function} requestFn - Function that performs the request
     * @param {Object} requestConfig - Request configuration
     * @param {number} retries - Number of retries remaining
     * @returns {Promise<any>} - Response data
     */
    async _executeWithRetry(requestFn, requestConfig, retries) {
        try {
            return await requestFn();
        } catch (error) {
            const { retry, retryDelay, retryCondition, debug, logger } = requestConfig;

            // Check if we should retry
            if (retries > 0 && retryCondition(error)) {
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
     * @param {Object} params - URL parameters
     * @param {Object} data - Request body data
     * @param {Object} options - Additional fetch options
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
                    if (error.handledByClient) {
                        // This error was already handled, just rethrow it
                        throw error;
                    }

                    // This is a TRUE network error (not an HTTP status error)
                    const networkError = this.errorHandler.processNetworkError(
                        error,
                        url,
                        method,
                        params,
                        finalFetchOptions.headers
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
            if (!error || error.handledByClient) {
                throw error;
            }

            // Handle aborted requests
            if (error && error.name === 'AbortError') {
                this.errorHandler.processAbortError(error);
            }
            // For any errors that haven't been handled yet
            else if (typeof requestConfig.onError === 'function') {
                error.handledByClient = true;
                requestConfig.onError(error);
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
     * @param {Function} hook - Hook function
     * @param {*} args - Arguments to pass to hook
     */
    _executeHook(hook, ...args) {
        if (typeof hook === 'function' && hook.toString() !== '() => {}') {
            hook(...args);
        }
    }

    /**
     * Create an HTTP method function (GET, POST, etc.)
     * @private
     * @param {string} method - HTTP method to create
     * @returns {Function} - Method function for the specified HTTP method
     */
    static _createMethod(method) {
        return async function (endpoint, ...args) {
            // Using instance method
            const normalized = this.requestProcessor.constructor.normalizeParams(method, endpoint, args);
            return this._request(
                normalized.method,
                normalized.endpoint,
                normalized.params,
                normalized.data,
                normalized.options
            );
        };
    }

    // Define all HTTP methods using the method creator
    get = ApiClient._createMethod('GET');
    post = ApiClient._createMethod('POST');
    put = ApiClient._createMethod('PUT');
    delete = ApiClient._createMethod('DELETE');
    patch = ApiClient._createMethod('PATCH');

    /**
     * Upload a file or multiple files
     * @param {string} endpoint - API endpoint
     * @param {Object} [files] - Object mapping field names to File objects or arrays of File objects
     * @param {Object} [extraData] - Additional form data to include
     * @param {Object|null} [paramsOrOptions] - URL parameters if object, or options if no params needed
     * @param {Object} [options] - Additional fetch options (optional if paramsOrOptions contains options)
     * @returns {Promise<any>} - Response data
     */
    async upload(endpoint, ...args) {
        const normalized = this.requestProcessor.constructor.normalizeParams('UPLOAD', endpoint, args);
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
     * @param {Object} requestsMap - Object mapping result names to API call promises
     * @returns {Object} - Object containing results with the same keys as the input object
     */
    all(requestsMap) {
        // Handle both array and object inputs
        if (Array.isArray(requestsMap)) {
            // Array input - use numbered properties
            const promises = requestsMap;
            return Promise.all(promises)
                .then((responses) => {
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