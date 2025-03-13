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
	 * Apply request interceptors to modify request options
	 * @private
	 * @param {Object} requestConfig - Original request configuration
	 * @param {Object} fetchOptions - Original fetch options
	 * @returns {Promise<Object>} - Modified fetch options
	 */
	async _applyRequestInterceptors(requestConfig, fetchOptions) {
		let config = { ...requestConfig };
		let options = { ...fetchOptions };

		// Apply registered request interceptors in sequence
		for (const interceptor of this.config.interceptors.request) {
			try {
				if (typeof interceptor.fulfilled === 'function') {
					const result = await interceptor.fulfilled({ config, options });
					if (result) {
						config = result.config || config;
						options = result.options || options;
					}
				}
			} catch (error) {
				if (typeof interceptor.rejected === 'function') {
					await interceptor.rejected(error);
				}
				throw error;
			}
		}

		return { config, options };
	}

	/**
	 * Apply response interceptors to modify response data
	 * @private
	 * @param {Object} response - Original response object
	 * @param {Object} data - Processed response data
	 * @param {Object} requestConfig - Request configuration
	 * @returns {Promise<any>} - Modified response data
	 */
	async _applyResponseInterceptors(response, data, requestConfig) {
		let responseData = data;
		let responseObj = response;
		let config = requestConfig;

		// Apply registered response interceptors in sequence
		for (const interceptor of this.config.interceptors.response) {
			try {
				if (typeof interceptor.fulfilled === 'function') {
					const result = await interceptor.fulfilled({
						data: responseData,
						response: responseObj,
						config
					});
					if (result && result.data !== undefined) {
						responseData = result.data;
					}
					if (result && result.response !== undefined) {
						responseObj = result.response;
					}
				}
			} catch (error) {
				if (typeof interceptor.rejected === 'function') {
					await interceptor.rejected(error);
				}
				throw error;
			}
		}

		return responseData;
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
					if (
						typeof this.config.onTimeout === 'function' &&
						this.config.onTimeout.toString() !== '() => {}'
					) {
						this.config.onTimeout();
					}
				}, timeout);
			}
		}

		// Prepare headers
		const headers = { ...configHeaders, ...options.headers };

		if ((method === 'GET' || method === 'HEAD') && !options.forceContentType) {
			delete headers['Content-Type'];
		}
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
			config.logger('Response:', response);
		}

		let data;
		let isJson = false;

		// Parse response based on content type
		if (responseType === 'json' || !responseType) {
			try {
				data = await response.json();
				isJson = true;
			} catch (e) {
				data = null;
			}
		} else if (responseType === 'text') {
			data = await response.text();
		} else if (responseType === 'blob') {
			data = await response.blob();
		} else if (responseType === 'arrayBuffer') {
			data = await response.arrayBuffer();
		}

		// This handles the case where the API returns error data with non-200 status
		if (!response.ok && isJson && data && typeof data === 'object' && this.config.jsonErrorResponse) {
			// This is an application error returned with a non-200 status code
			const appError = {
				message: data[this.config.jsonErrorResponse.messageKey] || 'Unknown error',
				code: data[this.config.jsonErrorResponse.codeKey] || 'UNKNOWN_ERROR',
				status: response.status,
				// Mark as application error even though it came with non-200 status
				type: 'application',
				timestamp: new Date().toISOString(),
				handledByClient: true,
				request: {
					url: response.url,
					method: response.method
				},
				response: {
					status: response.status,
					statusText: response.statusText,
					headers: Object.fromEntries([...response.headers.entries()]),
					data: data
				}
			};
			if (debug) {
				const errorId = Math.random().toString(36).substring(2, 10);
				config.logger(`===== APPLICATION ERROR ${errorId} START =====`);
				config.logger('Error details:', appError);
				config.logger(`===== APPLICATION ERROR ${errorId} END =====`);
			}
		
			// Apply error interceptor if provided
			let interceptedError = appError;
			if (typeof errorInterceptor === 'function' && errorInterceptor.toString() !== '() => {}') {
				interceptedError = errorInterceptor(appError);
				interceptedError.handledByClient = true;
			}
		
			// Call application error handler if provided
			if (
				typeof config.onApplicationError === 'function' &&
				config.onApplicationError.toString() !== '() => {}'
			) {
				config.onApplicationError(interceptedError);
			} else if (typeof config.onError === 'function' && config.onError.toString() !== '() => {}') {
				config.onError(interceptedError);
			}
		
			// If suppressErrors is true, return error object instead of throwing
			if (config.suppressErrors) {
				return { error: interceptedError, success: false };
			} else {
				// Convert plain object to throwable Error with all properties
				const throwableError = new Error(interceptedError.message);
				Object.assign(throwableError, interceptedError);
				throw throwableError;
			}
		}

		// First, handle application-level errors that come with 200 status codes
		// Look for common error indicators in the response data
		if (data && typeof data === 'object' && data.code && data.message && response.ok) {
			// [Existing application error code for 200 responses]
			// ...existing code...
		}

		// Handle standard HTTP errors (non-2xx responses) that weren't handled as application errors above
		if (!response.ok) {
			let errorData = data;

			if (!errorData) {
				errorData = {
					status: response.status,
					statusText: response.statusText
				};
			}

			// Extract a message from the error data if possible
			let errorMessage = '';
			if (errorData && typeof errorData === 'object') {
				if (errorData.message) {
					errorMessage = errorData.message;
				} else if (errorData.error) {
					errorMessage = errorData.error;
				}
			}

			if (!errorMessage) {
				errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
			}

			// Create a standardized error object with more detail
			const error = {
				message: errorMessage,
				status: response.status,
				data: errorData,
				type: 'http', // This is a standard HTTP error
				timestamp: new Date().toISOString(),
				handledByClient: true,
				request: {
					url: response.url,
					method: response.method
				},
				response: {
					status: response.status,
					statusText: response.statusText,
					headers: Object.fromEntries([...response.headers.entries()]),
					data: errorData
				}
			};

			// Make logging more obvious with timestamps and unique identifiers
			if (debug) {
				const errorId = Math.random().toString(36).substring(2, 10);
				config.logger(`===== HTTP ERROR ${errorId} START =====`);
				config.logger('Error details:', error);
				config.logger(`===== HTTP ERROR ${errorId} END =====`);
			}

			// Call specific error handlers based on status code
			let handledBySpecificHandler = false;

			if (
				response.status === 404 &&
				typeof config.onNotFound === 'function' &&
				config.onNotFound.toString() !== '() => {}'
			) {
				config.onNotFound(error);
				handledBySpecificHandler = true;
			} else if (
				response.status === 401 &&
				typeof config.onUnauthorized === 'function' &&
				config.onUnauthorized.toString() !== '() => {}'
			) {
				config.onUnauthorized(error);
				handledBySpecificHandler = true;
			} else if (
				response.status === 429 &&
				typeof config.onRateLimit === 'function' &&
				config.onRateLimit.toString() !== '() => {}'
			) {
				config.onRateLimit(error);
				handledBySpecificHandler = true;
			} else if (
				response.status >= 500 &&
				typeof config.onServerError === 'function' &&
				config.onServerError.toString() !== '() => {}'
			) {
				config.onServerError(error);
				handledBySpecificHandler = true;
			} else if (
				response.status >= 400 &&
				response.status < 500 &&
				typeof config.onClientError === 'function' &&
				config.onClientError.toString() !== '() => {}'
			) {
				config.onClientError(error);
				handledBySpecificHandler = true;
			}

			// Apply error interceptor if provided
			let interceptedError = error;
			if (typeof errorInterceptor === 'function' && errorInterceptor.toString() !== '() => {}') {
				interceptedError = errorInterceptor(error);
				interceptedError.handledByClient = true;
			}

			// Only call general error handler if no specific handler was called
			if (
				!handledBySpecificHandler &&
				typeof config.onError === 'function' &&
				config.onError.toString() !== '() => {}'
			) {
				config.onError(interceptedError);
			}

			// If suppressErrors is true, return error object instead of throwing
			if (config.suppressErrors) {
				return { error: interceptedError, success: false };
			} else {
				// Convert plain object to throwable Error with all properties
				const throwableError = new Error(interceptedError.message);
				Object.assign(throwableError, interceptedError);
				throw throwableError;
			}
		}

		// Process successful response
		// Extract specific data if dataKey is provided
		if (dataKey && data && typeof data === 'object') {
			if (data[dataKey] !== undefined) {
				data = data[dataKey];
			} else {
				console.warn(`Data key "${dataKey}" not found in response: ${JSON.stringify(data)}`);
			}
		}

		// Apply response interceptors
		data = await this._applyResponseInterceptors(response, data, config);

		return data;
	}

	// ...existing code...

	async _request(method, endpoint, params = {}, data = null, options = {}) {
		const { config: tempConfig, ...restOptions } = options;
		const requestConfig = tempConfig ? { ...this.config, ...tempConfig } : this.config;

		try {
			// Call onBefore hook if provided
			if (
				typeof requestConfig.onBefore === 'function' &&
				requestConfig.onBefore.toString() !== '() => {}'
			) {
				requestConfig.onBefore({ method, endpoint, params, data, options: restOptions });
			}
			if (
				typeof requestConfig.onLoading === 'function' &&
				requestConfig.onLoading.toString() !== '() => {}'
			) {
				requestConfig.onLoading(true);
			}

			// Prepare URL and initial options
			const url = ApiClient._prepareUrl(endpoint, params, requestConfig);
			let { fetchOptions, abortController } = this._prepareOptions(
				method,
				restOptions,
				data,
				requestConfig
			);

			// Apply request interceptors
			const intercepted = await this._applyRequestInterceptors(requestConfig, fetchOptions);
			const finalRequestConfig = intercepted.config;
			const finalFetchOptions = intercepted.options;

			// Store abort controller if we created one
			if (abortController) {
				const requestId = Date.now().toString();
				this.abortControllers.set(requestId, abortController);
			}

			// Execute request with retry functionality
			// In your _request method, modify the makeRequest function:

			const makeRequest = async () => {
				try {
					// This will only throw for true network errors like CORS or no internet
					const response = await fetch(url, finalFetchOptions);

					// Process the response, which handles HTTP errors (4xx, 5xx)
					return await this._processResponse(response, finalRequestConfig);
				} catch (error) {
					// Check if this is a network error or an error already handled by _processResponse
					if (error.handledByClient) {
						// This error was already handled by _processResponse, just rethrow it
						throw error;
					}

					// This is a TRUE network error (not an HTTP status error)
					const networkError = {
						message: 'Network error: ' + error.message,
						originalError: error,
						type: 'network',
						timestamp: new Date().toISOString(),
						url: url,
						method: method,
						status: 0,
						handledByClient: true,
						request: {
							url,
							method,
							params: Object.keys(params).length > 0 ? params : undefined,
							headers: finalFetchOptions.headers
						}
					};

					// Log network error
					if (finalRequestConfig.debug) {
						const errorId = Math.random().toString(36).substring(2, 10);
						finalRequestConfig.logger(`===== NETWORK ERROR ${errorId} START =====`);
						finalRequestConfig.logger('Network error details:', networkError);
						finalRequestConfig.logger(`===== NETWORK ERROR ${errorId} END =====`);
					}

					// Call the network error handler specifically
					if (
						typeof finalRequestConfig.onNetworkError === 'function' &&
						finalRequestConfig.onNetworkError.toString() !== '() => {}'
					) {
						finalRequestConfig.onNetworkError(networkError);
					} else if (
						typeof finalRequestConfig.onError === 'function' &&
						finalRequestConfig.onError.toString() !== '() => {}'
					) {
						finalRequestConfig.onError(networkError);
					}

					// Return or throw based on suppressErrors setting
					if (finalRequestConfig.suppressErrors) {
						return { error: networkError, success: false };
					} else {
						const throwableError = new Error(networkError.message);
						Object.assign(throwableError, networkError);
						throw throwableError;
					}
				}
			};

			// Execute with retry if configured
			const result = await this._executeWithRetry(
				makeRequest,
				finalRequestConfig,
				finalRequestConfig.retry
			);

			// Call onAfter hook if provided
			if (
				typeof finalRequestConfig.onAfter === 'function' &&
				finalRequestConfig.onAfter.toString() !== '() => {}'
			) {
				finalRequestConfig.onAfter(result);
			}

			return result;
		} catch (error) {
			// If the error has already been handled by a specific handler, don't call onError again
			if (!error || error.handledByClient) {
				// Just re-throw without additional processing
				throw error;
			}

			// Handle aborted requests
			if (error && error.name === 'AbortError') {
				if (
					typeof requestConfig.onAbort === 'function' &&
					requestConfig.onAbort.toString() !== '() => {}'
				) {
					requestConfig.onAbort(error);
					error.handledByClient = true;
				}
			}
			// For any errors that haven't been handled yet
			else if (
				typeof requestConfig.onError === 'function' &&
				requestConfig.onError.toString() !== '() => {}'
			) {
				error.handledByClient = true;
				requestConfig.onError(error);
			}

			throw error;
		} finally {
			// Call onFinally hook if provided
			if (
				typeof requestConfig.onFinally === 'function' &&
				requestConfig.onFinally.toString() !== '() => {}'
			) {
				requestConfig.onFinally();
			}
			if (
				typeof requestConfig.onLoading === 'function' &&
				requestConfig.onLoading.toString() !== '() => {}'
			) {
				requestConfig.onLoading(false);
			}
		}
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
	// ...existing code...

	// ...existing code...

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
