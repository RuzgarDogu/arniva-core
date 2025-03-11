import { ApiClient } from '$lib';

export const Api = new ApiClient({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    onNetworkError: (error) => {
        console.log("---------------------------------");
      if (error.isCors) {
        console.error('CORS error detected:', error.message);
      } else {
        console.error('Other network error:', error.message);
      }
    },
    onError: (error) => {
      console.error('General API error:', error);
    },
    suppressErrors: false // Set to true if you don't want errors to throw
  });

