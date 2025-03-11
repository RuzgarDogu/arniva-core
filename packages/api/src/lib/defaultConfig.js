const defaultConfig = {
	// Base URL for API requests
	baseUrl: '',

	// Authentication token details
	token: {
		type: 'Bearer',
		key: 'Authorization',
		value: ''
	},

	// Keys to extract specific data from API responses
	dataKey: '',
	messageKey: '',
	codeKey: '',

	// Toast notifications and SvelteKit-specific options
	useDefaultToast: false,
	useSveltekitFetch: false,

	// Error handling and suppression
	suppressErrors: false,
	
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

	// Request & Response Handling
	timeout: 5000, // Timeout for requests in milliseconds
	headers: {
		'Content-Type': 'application/json'
	},
	paramsSerializer: (params) => new URLSearchParams(params).toString(),
	responseType: 'json',

	// Retry and Caching Options
	retry: 2, // Number of retries on failure
	cache: 'no-cache', // Cache mode ('default', 'no-cache', etc.)
	staleWhileRevalidate: false, // Enable/disable stale-while-revalidate caching

	// Request Abort & Cancellation
	signal: null, // Optional AbortSignal for canceling requests
	cancelToken: null, // Custom cancellation token implementation if needed

	// Logging & Debugging
	debug: false, // Enable detailed logging for debugging
	logger: console.log, // Custom logger function

	// Advanced Error Handling
	errorInterceptor: (error) => error // Function to transform or log errors before throwing
};

export default defaultConfig;
