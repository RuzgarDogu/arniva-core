import { ApiClient } from '$lib';
import { toast } from '@ruzgardogu/utils';

export const Api = new ApiClient({
	baseUrl: 'https://jsonplaceholder.typicode.com',
	suppressErrors: false, // Set to true if you don't want errors to throw,
	onApplicationError: (error) => {
		console.log('APPLICATION ERROR:', error);
		toast.warning(error.message);
	},

	// Network errors (CORS, no connection, etc)
	onNetworkError: (error) => {
		console.log('NETWORK ERROR:', error);
		toast.danger('Connection error: ' + error.message);
	},

	// Not found errors (404)
	onNotFound: (error) => {
		console.log('NOT FOUND:', error);
		toast.warning('Resource not found: ' + error.message);
	},

	// Other client errors (400-499 except those with specific handlers)
	onClientError: (error) => {
		console.log('CLIENT ERROR:', error);
		toast.warning('Request error: ' + error.message);
	},

	// Server errors (500+)
	onServerError: (error) => {
		console.log('SERVER ERROR:', error);
		toast.danger('Server error: ' + error.message);
	},

	// General fallback (will not be called if any specific handler above is used)
	onError: (error) => {
		console.log('GENERAL ERROR:', error);
		toast.danger('Error: ' + error.message);
	},
	onBefore: (requestInfo) => {
		console.log('Before request:', requestInfo.endpoint);
		// You can modify headers or other request properties here
	},
	onAfter: (result) => {
		console.log('After request:', result);
		// Process successful results
	},
	onFinally: () => {
		console.log('Request complete');
		// Cleanup operations, hide loading spinners, etc.
	},
	onLoading: (isLoading) => {
		console.log('Loading:', isLoading);
		// Show/hide loading spinners or other UI elements
	},
	logger: (a,b) => {
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@----", a,b);
	}, // Custom logger function
	errorInterceptor: (error) => {
        // Add a human-friendly message based on the error type
		console.log("errorInterceptor", error);
        if (error.status === 401) {
            error.extras.friendlyMessage = 'Your session has expired. Please log in again.';
        } else if (error.status === 403) {
            error.extras.friendlyMessage = 'You don\'t have permission to access this resource.';
        } else if (error.status === 404) {
            error.extras.friendlyMessage = 'We couldn\'t find what you\'re looking for.';
        } else if (error.status >= 500) {
            error.extras.friendlyMessage = 'Something went wrong on our server. Please try again later.';
        } else if (error.type === 'network') {
            error.extras.friendlyMessage = 'Connection problem. Please check your internet connection.';
        } else {
            error.extras.friendlyMessage = 'An unexpected error occurred.';
        }
        
        // Add a timestamp to all errors
        error.extras.interceptedAt = new Date().toISOString();
        
        // You could also log to an external service here
        console.error('Error intercepted:', error.extras.friendlyMessage);
        
        return error;
    },
});

Api.interceptors.request.use(
	async ({ config, options }) => {
		console.log('Request interceptor running...');
		options.headers = {
			...options.headers,
			'Accept': '*',
		};

		return { config, options };
	},
	(error) => {
		console.error('Request interceptor error:', error);
		return Promise.reject(error);
	}
);

// Add a response interceptor - will run after every response
Api.interceptors.response.use(
	async ({ data, response, config }) => {
		console.log('Response interceptor running...');

		// Example: Add metadata to all responses
		if (typeof data === 'object' && data !== null) {
			data._metadata = {
				timestamp: new Date().toISOString(),
				responseTime: response.headers.get('X-Response-Time'),
				endpoint: response.url
			};
		}

		return { data, response, config };
	},
	(error) => {
		console.error('Response interceptor error:', error);
		return Promise.reject(error);
	}
);
