/**
 * @typedef {Object} ApiToken
 * @property {string} key - The header key for the authentication token
 * @property {string} value - The actual token value
 * @property {string} type - The token type (e.g., 'Bearer')
 */

/**
 * @typedef {Object} JsonErrorResponse
 * @property {string} messageKey - Key to extract error message from response
 * @property {string} codeKey - Key to extract error code from response
 */

/**
 * @typedef {Object} RequestInterceptor 
 * @property {(config: {config: ApiConfig, options: RequestInit}) => Promise<{config?: ApiConfig, options?: RequestInit}>} fulfilled - Function to process request before sending
 * @property {(error: Error) => Promise<any>} rejected - Function to handle request errors
 */

/**
 * @typedef {Object} ResponseInterceptor
 * @property {(response: {data: any, response: Response, config: ApiConfig}) => Promise<{data?: any, response?: Response}>} fulfilled - Function to process response after receiving
 * @property {(error: Error) => Promise<any>} rejected - Function to handle response errors
 */

/**
 * @typedef {Object} Interceptors
 * @property {Array<RequestInterceptor>} request - Request interceptors
 * @property {Array<ResponseInterceptor>} response - Response interceptors
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 * @property {number} status - HTTP status code
 * @property {'application'|'http'|'network'|'abort'} type - Error type
 * @property {string} timestamp - Timestamp when error occurred
 * @property {boolean} handledByClient - Whether error was handled by client
 * @property {string} [requestUrl] - URL of the request (legacy format)
 * @property {RequestInfo} [request] - Information about the request
 * @property {ResponseInfo} [response] - Information about the response (if available)
 * @property {Error} [originalError] - Original error object
 * @property {Object} [data] - Additional error data
 * @property {string} [url] - Request URL
 * @property {Object.<string, any>} extras - Additional custom properties
 */

/**
 * @typedef {Object} RequestInfo
 * @property {string} url - Request URL
 * @property {string} endpoint - API endpoint path (relative path)
 * @property {string} method - HTTP method
 * @property {Object} [params] - URL parameters
 * @property {Object} [data] - Request body data
 * @property {Object} [options] - Request options
 * @property {Object} [headers] - Request headers
 */

/**
 * @typedef {Object} ResponseInfo
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {Object} headers - Response headers
 * @property {*} data - Response data
 */

/**
 * @typedef {Object} ResponseResult
 * @property {any} data - Response data
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {Object} headers - Response headers
 * @property {string} url - Request URL
 */

/**
 * @callback BeforeRequestCallback
 * @param {RequestInfo} requestInfo - Information about the request
 * @returns {void}
 */

/**
 * @callback AfterRequestCallback
 * @param {ResponseResult} result - Result of the request
 * @returns {void}
 */

/**
 * @callback ErrorCallback
 * @param {ErrorResponse} error - Error object
 * @returns {void}
 */

/**
 * @callback ErrorInterceptorCallback
 * @param {ErrorResponse} error - Error object
 * @returns {ErrorResponse} - Modified error object
 */

/**
 * @callback LoadingCallback
 * @param {boolean} isLoading - Whether a request is in progress
 * @returns {void}
 */

/**
 * @callback FinallyCallback
 * @returns {void}
 */

/**
 * @typedef {Object.<string, string|number|boolean|null|undefined>} ParamsObject
 * An object with string keys and primitive values that can be serialized into query parameters
 */

/**
 * @typedef {Object} ApiConfig
 * @property {string} [baseUrl] - Base URL for API requests
 * @property {ApiToken|null} [token] - Authentication token details
 * @property {string} [dataKey] - Key to extract specific data from API responses
 * @property {JsonErrorResponse} [jsonErrorResponse] - Keys to extract error details from JSON response
 * @property {boolean} [suppressErrors] - Whether to suppress errors (return instead of throw)
 * 
 * @property {ErrorCallback} [onError] - Handler for all errors
 * @property {BeforeRequestCallback} [onBefore] - Handler called before request
 * @property {AfterRequestCallback} [onAfter] - Handler called after request completes
 * @property {FinallyCallback} [onFinally] - Handler called at the end of request lifecycle
 * @property {ErrorCallback} [onAbort] - Handler for aborted requests
 * @property {FinallyCallback} [onTimeout] - Handler for timeouts
 * @property {ErrorCallback} [onNetworkError] - Handler for network errors
 * @property {ErrorCallback} [onServerError] - Handler for server errors (5xx)
 * @property {ErrorCallback} [onClientError] - Handler for client errors (4xx)
 * @property {ErrorCallback} [onUnauthorized] - Handler for 401 responses
 * @property {ErrorCallback} [onRateLimit] - Handler for rate limit errors (429)
 * @property {LoadingCallback} [onLoading] - Handler for loading state changes
 * @property {ErrorCallback} [onApplicationError] - Handler for application errors (errors with 200 status)
 * @property {ErrorCallback} [onNotFound] - Handler for 404 responses
 * @property {Interceptors} [interceptors] - Request and response interceptors
 * 
 * @property {number} timeout - Request timeout in milliseconds
 * @property {Object.<string, string>} headers - Default request headers
 * @property {boolean} forceContentType - Whether to force Content-Type header on GET requests
 * @property {function(ParamsObject):string} paramsSerializer - Function to serialize URL parameters
 * @property {'json'|'text'|'blob'|'arrayBuffer'} responseType - Expected response type
 * 
 * @property {number} retry - Number of retry attempts on failure
 * @property {number} retryDelay - Delay between retry attempts in milliseconds
 * @property {function(ErrorResponse):boolean} retryCondition - Function to determine if a request should be retried
 * 
 * @property {string} cache - Cache mode for fetch requests
 * @property {boolean} staleWhileRevalidate - Whether to use stale-while-revalidate caching
 * 
 * @property {AbortSignal|null} signal - AbortSignal for request cancellation
 * @property {Object|null} cancelToken - Custom cancellation token
 * 
 * @property {boolean} debug - Whether to enable debug logging
 * @property {function(...*):void} logger - Logger function
 * 
 * @property {ErrorInterceptorCallback} [errorInterceptor] - Function to transform errors before handling
 */

/**
 * @typedef {Object} ApiResponse
 * @property {Response} response - The original Response object
 * @property {string} method - HTTP method used for the request
 * @property {*} data - Parsed response data
 * @property {string} url - Request URL
 */

/**
 * @typedef {Object} AbortControllerInfo
 * @property {AbortController|null} abortController - AbortController instance
 * @property {AbortSignal} effectiveSignal - Signal to use for the fetch request
 */

/**
 * @typedef {Object} RequestOptions
 * @property {Object.<string, string>} [headers] - Request headers
 * @property {string} [method] - HTTP method
 * @property {boolean} [forceContentType] - Whether to force Content-Type header on GET/HEAD requests
 * @property {'default'|'no-store'|'reload'|'no-cache'|'force-cache'|'only-if-cached'} [cache] - Cache mode
 * @property {'follow'|'error'|'manual'} [redirect] - Redirect mode
 * @property {'omit'|'same-origin'|'include'} [credentials] - Credentials mode
 * @property {'same-origin'|'no-cors'|'cors'} [mode] - CORS mode
 * @property {AbortSignal} [signal] - AbortSignal for request cancellation
 * @property {Object} [config] - Additional API configuration to override defaults
 */

export {};