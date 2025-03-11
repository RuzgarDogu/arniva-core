import defaultConfig from './defaultConfig.js';

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
	}

	/**
	 * Prepares the URL by normalizing path and handling parameters
	 * @private
	 * @param {string} endpoint - The endpoint path with or without query string
	 * @param {Object} params - Parameters to include in the query string
	 * @param {Object} config - Configuration including baseUrl and paramsSerializer
	 * @returns {string} The fully prepared URL
	 */
	static _prepareUrl(endpoint, params = {}, config) {
		// Check if the endpoint is already an absolute URL (starts with http:// or https://)
		const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);

		// Extract any existing query parameters from the endpoint
		const [path, existingQuery] = endpoint.split('?');

		// Parse existing query parameters if any
		let mergedParams = { ...params };
		if (existingQuery) {
			const urlSearchParams = new URLSearchParams(existingQuery);
			urlSearchParams.forEach((value, key) => {
				// Only add if not already in params object
				if (!mergedParams.hasOwnProperty(key)) {
					mergedParams[key] = value;
				}
			});
		}

		// Generate query string from merged parameters
		const queryString = config.paramsSerializer(mergedParams);

		// If it's an absolute URL, use it directly (without baseUrl)
		if (isAbsoluteUrl) {
			return `${path}${queryString ? '?' + queryString : ''}`;
		}

		// Otherwise, normalize the relative path and combine with baseUrl
		const normalizedPath = path.replace(/^\/|\/$/g, '');
		return `${config.baseUrl}/${normalizedPath}${queryString ? '?' + queryString : ''}`;
	}

	/**
	 * Prepares request options with headers, credentials, etc.
	 * @private
	 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
	 * @param {Object} options - User-provided options
	 * @param {*} data - Request body data (for POST, PUT)
	 * @returns {Object} Prepared fetch options
	 */
	_prepareOptions(method, options = {}, data = null, config = this.config) {
		const { token, headers: configHeaders, timeout, signal, debug } = config;

		// Create a new abort controller for this request if not provided
		let abortController;
		if (signal) {
			// Use provided signal
			abortController = null;
		} else {
			// Create a new abort controller
			abortController = new AbortController();
			// Set timeout if specified
			if (timeout) {
				setTimeout(() => {
					abortController.abort('Request timeout');
					if (typeof this.config.onTimeout === 'function') {
						this.config.onTimeout();
					}
				}, timeout);
			}
		}

		// Prepare headers
		const headers = { ...configHeaders, ...options.headers };

		// Add authentication token if available
		if (token && token.value) {
			headers[token.key] = `${token.type} ${token.value}`;
		}

		// Prepare fetch options
		const fetchOptions = {
			method,
			headers,
			signal: signal || (abortController ? abortController.signal : undefined),
			...options
		};

		// Handle request body for non-GET methods
		if (data !== null && method !== 'GET' && method !== 'HEAD') {
			// Handle different content types
			const contentType = headers['Content-Type']?.toLowerCase();

			// For multipart/form-data, use FormData object
			if (contentType?.includes('multipart/form-data')) {
				// If data is already FormData, use it directly
				if (data instanceof FormData) {
					fetchOptions.body = data;
				} else {
					// Convert object to FormData
					const formData = new FormData();
					Object.entries(data).forEach(([key, value]) => {
						// Handle File objects specially
						if (value instanceof File) {
							formData.append(key, value, value.name);
						}
						// Handle arrays
						else if (Array.isArray(value)) {
							value.forEach((item) => formData.append(`${key}[]`, item));
						}
						// Handle everything else
						else {
							formData.append(key, value);
						}
					});
					fetchOptions.body = formData;
				}

				// Remove Content-Type header to let browser set it with boundary
				delete fetchOptions.headers['Content-Type'];
			}
			// For URL-encoded form data
			else if (contentType?.includes('application/x-www-form-urlencoded')) {
				fetchOptions.body = new URLSearchParams(data).toString();
			}
			// Default to JSON
			else {
				fetchOptions.body = JSON.stringify(data);
			}
		}

		// Debug logging
		if (debug) {
			this.config.logger('Request options:', fetchOptions);
		}

		return { fetchOptions, abortController };
	}

	/**
	 * Process the response, handle errors and extract data
	 * @private
	 * @param {Response} response - Fetch Response object
	 * @returns {Promise<any>} - Processed response data
	 */
	async _processResponse(response, config = this.config) {
		const { dataKey, responseType, debug, errorInterceptor } = config;

		// Debug logging
		if (debug) {
			this.config.logger('Response:', response);
		}

		// Handle errors
		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch (e) {
				errorData = {
					status: response.status,
					statusText: response.statusText
				};
			}

			// Create error object
			const error = new Error(`HTTP Error: ${response.status}`);
			error.status = response.status;
			error.data = errorData;

			// Call specific error handlers based on status code
			if (response.status === 401 && typeof this.config.onUnauthorized === 'function') {
				this.config.onUnauthorized(error);
			} else if (response.status === 429 && typeof this.config.onRateLimit === 'function') {
				this.config.onRateLimit(error);
			} else if (response.status >= 500 && typeof this.config.onServerError === 'function') {
				this.config.onServerError(error);
			} else if (response.status >= 400 && typeof this.config.onClientError === 'function') {
				this.config.onClientError(error);
			}

    // Apply error interceptor if provided
    const interceptedError = errorInterceptor(error);
    
    // Make logging more obvious with timestamps and unique identifiers
    const errorId = Math.random().toString(36).substring(2, 10);
    console.log(`===== ERROR ${errorId} START =====`);
    console.log("Error details:", {
      url: response.url,
      status: response.status,
      timestamp: new Date().toISOString(),
      errorMessage: interceptedError.message,
      errorData: interceptedError.data
    });
    
    // Call general error handler
    if (typeof config.onError === 'function') {
      console.log(`===== ERROR HANDLER CALLED ${errorId} =====`);
      config.onError(interceptedError);
      console.log(`===== ERROR HANDLER FINISHED ${errorId} =====`);
    }
    
    console.log(`===== ERROR ${errorId} END - NOW THROWING =====`);
    
    // Consider adding a slight delay to ensure logging completes
    // This is only for debugging - remove in production
    await new Promise(resolve => setTimeout(resolve, 50));
    
    throw interceptedError;
		}

		// Process successful response
		let data;

		// Handle different response types
		if (responseType === 'json') {
			data = await response.json();
		} else if (responseType === 'text') {
			data = await response.text();
		} else if (responseType === 'blob') {
			data = await response.blob();
		} else if (responseType === 'arrayBuffer') {
			data = await response.arrayBuffer();
		} else {
			data = await response.json();
		}
		// Extract specific data if dataKey is provided
		if (dataKey) {
			if (data[dataKey] !== undefined) {
				data = data[dataKey];
			} else {
				console.warn(`Data key "${dataKey}" not found in response: ${JSON.stringify(data)}`);
			}
		}

		return data;
	}

	/**
	 * Helper method to normalize parameters for all request methods
	 * @private
	 * @param {string} method - HTTP method (GET, POST, PUT, etc.)
	 * @param {string} endpoint - API endpoint
	 * @param {Array} args - All arguments passed to the original method
	 * @returns {Object} - Normalized parameters for _request method
	 */
	static _normalizeParams(method, endpoint, args) {
		// Default return structure
		const result = {
			method,
			endpoint,
			params: {},
			data: null,
			options: {}
		};

		// No arguments case
		if (args.length === 0) {
			return result;
		}

		// For GET/DELETE methods, we don't expect body data
		if (method === 'GET' || method === 'DELETE') {
			// Enhanced parameter detection for flexible ordering
			// Scan all arguments for a config object
			const configIndex = args.findIndex((arg) => arg && arg.config);
			if (configIndex !== -1) {
				// Found a config object - use it as options
				result.options = args[configIndex];

				// Remaining arguments must be params - merge them
				const params = {};
				args.forEach((arg, index) => {
					if (
						index !== configIndex &&
						typeof arg === 'object' &&
						arg !== null &&
						!Array.isArray(arg)
					) {
						Object.assign(params, arg);
					}
				});
				result.params = params;
			} else {
				// No config object found - use the original logic
				if (args.length >= 1) {
					const firstArg = args[0];
					const secondArg = args.length > 1 ? args[1] : {};

					// Detect if the first argument contains options properties
					if (firstArg && ApiClient._isOptionsObject(firstArg)) {
						result.options = firstArg;
						// If we have a second argument, it must be params
						if (args.length > 1) {
							result.params = secondArg;
						}
					} else {
						// First argument is params
						result.params = firstArg;
						// If we have a second argument, it's options
						if (args.length > 1) {
							result.options = secondArg;
						}
					}
				}
			}
		}
		// For POST/PUT/PATCH methods, we expect body data
		else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
			// First argument is always data for these methods
			if (args.length >= 1) {
				result.data = args[0] || {};
			}

			// For remaining arguments
			if (args.length >= 2) {
				const secondArg = args[1];

				// Check if second argument is options
				if (secondArg && ApiClient._isOptionsObject(secondArg)) {
					result.options = secondArg;
				} else {
					// Second argument is params
					result.params = secondArg;

					// If we have a third argument, it must be options
					if (args.length >= 3) {
						result.options = args[2] || {};
					}
				}
			}
		}
		// Special case for UPLOAD
		else if (method === 'UPLOAD') {
			// Handle files and form data creation
			const files = args.length >= 1 ? args[0] || {} : {};
			const extraData = args.length >= 2 ? args[1] || {} : {};

			// Create FormData
			const formData = new FormData();

			// Add files
			Object.entries(files).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					value.forEach((file) => formData.append(`${key}[]`, file, file.name));
				} else if (value instanceof File) {
					formData.append(key, value, value.name);
				}
			});

			// Add extra data
			Object.entries(extraData).forEach(([key, value]) => {
				formData.append(key, value);
			});

			result.data = formData;
			result.method = 'POST'; // Upload uses POST method

			// Handle optional params and options
			if (args.length >= 3) {
				const thirdArg = args[2];

				// Check if third argument is options
				if (thirdArg && ApiClient._isOptionsObject(thirdArg)) {
					result.options = {
						headers: { 'Content-Type': 'multipart/form-data' },
						...thirdArg
					};
				} else {
					// Third argument is params
					result.params = thirdArg;

					// If we have a fourth argument, it must be options
					if (args.length >= 4) {
						result.options = {
							headers: { 'Content-Type': 'multipart/form-data' },
							...args[3]
						};
					} else {
						// Default options
						result.options = {
							headers: { 'Content-Type': 'multipart/form-data' }
						};
					}
				}
			} else {
				// Default options
				result.options = {
					headers: { 'Content-Type': 'multipart/form-data' }
				};
			}
		}

		return result;
	}

	/**
	 * Helper to determine if an object is an options object
	 * @private
	 * @param {Object} obj - Object to check
	 * @returns {boolean} - True if the object appears to be options
	 */
	static _isOptionsObject(obj) {
		// Check for common fetch/config options properties
		return (
			obj &&
			(obj.headers ||
				obj.method ||
				obj.mode ||
				obj.credentials ||
				obj.signal ||
				obj.config ||
				obj.cache ||
				obj.redirect)
		);
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
      // Call onBefore hook if provided
      if (typeof requestConfig.onBefore === 'function') {
        requestConfig.onBefore({ method, endpoint, params, data, options: restOptions });
      }
      
      // Prepare URL and options
      const url = ApiClient._prepareUrl(endpoint, params, requestConfig);
      const { fetchOptions, abortController } = this._prepareOptions(
        method,
        restOptions,
        data,
        requestConfig
      );
      
      // Store abort controller if we created one
      if (abortController) {
        const requestId = Date.now().toString();
        this.abortControllers.set(requestId, abortController);
      }
      
      let response;
      try {
        // Make request - this is where CORS errors can happen
        response = await fetch(url, fetchOptions);
      } catch (networkError) {
        // Handle network errors (including CORS)
        console.error("Network error:", networkError);
        
        // Create a standardized error object
        const error = new Error('Network error: ' + networkError.message);
        error.originalError = networkError;
        error.type = 'network';
        error.isCors = networkError.message.includes('CORS');
        
        // Call network error handler
        if (typeof requestConfig.onNetworkError === 'function') {
          requestConfig.onNetworkError(error);
        }
        
        // Call general error handler
        if (typeof requestConfig.onError === 'function') {
          requestConfig.onError(error);
        }
        
        // If suppressErrors is true, return error object instead of throwing
        if (requestConfig.suppressErrors) {
          return { error, success: false };
        }
        
        throw error;
      }
      
      // Process response
      const result = await this._processResponse(response, requestConfig);
      
      // Call onAfter hook if provided
      if (typeof requestConfig.onAfter === 'function') {
        requestConfig.onAfter(result);
      }
      
      return result;
    } catch (error) {
      // This catches any errors not caught in the network error handling
      // Such as errors from _processResponse or other parts of the method
      
      // Handle aborted requests
      if (error.name === 'AbortError' && typeof requestConfig.onAbort === 'function') {
        requestConfig.onAbort(error);
      } 
      
      // Call general error handler if not already called
      if (!error.handledByClient && typeof requestConfig.onError === 'function') {
        error.handledByClient = true;
        requestConfig.onError(error);
      }
      
      throw error;
    } finally {
      // Call onFinally hook if provided
      if (typeof requestConfig.onFinally === 'function') {
        requestConfig.onFinally();
      }
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
			const normalized = ApiClient._normalizeParams(method, endpoint, args);
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
		const normalized = ApiClient._normalizeParams('UPLOAD', endpoint, args);
		return this._request(
			normalized.method,
			normalized.endpoint,
			normalized.params,
			normalized.data,
			normalized.options
		);
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
