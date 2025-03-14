// Import types from our type definition file
/** @typedef {import('./types').ApiConfig} ApiConfig */
/** @typedef {import('./types').ParamsObject} ParamsObject */
/** @typedef {import('./types').ErrorResponse} ErrorResponse */

/**
 * Default configuration for API client
 * @type {ApiConfig}
 */
const defaultConfig = {
    // Base URL for API requests
    baseUrl: '',

    // Authentication token details
    token: null,

    // Keys to extract specific data from API responses
    dataKey: '',
    // Get error details from JSON response
    jsonErrorResponse: {
        messageKey: 'message',
        codeKey: 'code',
    },

    // Error handling and suppression
    suppressErrors: false, // Set to true if you don't want errors to block execution

    // Request lifecycle hooks and callbacks
    onError: () => {},
    onBefore: () => {},
    onAfter: () => {},
    onFinally: () => {},
    onAbort: () => {},
    onTimeout: () => {},
    onNetworkError: () => {},
    onServerError: () => {},
    onClientError: () => {},
    onUnauthorized: () => {},
    onRateLimit: () => {},
    onLoading: () => {},
    onNotFound: () => {},
    interceptors: {
        request: [],
        response: []
    },
    onApplicationError: () => {}, // New handler for application errors (when API returns error with 200 status)

    // Request & Response Handling
    timeout: 5000, // Timeout for requests in milliseconds
    headers: {
        'Content-Type': 'application/json'
    },
    forceContentType: false,
	/**
	 * Serialize parameters into URL query string
	 * @param {ParamsObject} params - Parameters to serialize
	 * @returns {string} URL-encoded query string
	 */
	paramsSerializer: (params) => {
		const searchParams = new URLSearchParams();
		
		// Convert params to string values and add to URLSearchParams
		for (const key in params) {
			const value = params[key];
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		}
		
		return searchParams.toString();
	},
    responseType: 'json',

    // Retry and Caching Options
    retry: 0, // Number of retries on failure (0 means no retry)
    retryDelay: 1000, // Milliseconds between retries
    /**
     * Determine if a request should be retried based on error status
     * @param {ErrorResponse} error - Error response object
     * @returns {boolean} Whether to retry the request
     */
    retryCondition: (error) => error.status >= 500, // Only retry on server errors by default

    cache: 'no-cache', // Cache mode ('default', 'no-cache', etc.)
    staleWhileRevalidate: false, // Enable/disable stale-while-revalidate caching

    // Request Abort & Cancellation
    signal: null, // Optional AbortSignal for canceling requests
    cancelToken: null, // Custom cancellation token implementation if needed

    // Logging & Debugging
    debug: false, // Enable detailed logging for debugging
    logger: console.log, // Custom logger function

    // Advanced Error Handling
    /**
     * Transform or log errors before handling
     * @param {ErrorResponse} error - Error object to transform
     * @returns {ErrorResponse} Transformed error object
     */
    errorInterceptor: (error) => error // Function to transform or log errors before throwing
};

export default defaultConfig;