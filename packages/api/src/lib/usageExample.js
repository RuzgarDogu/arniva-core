import { ApiClient } from '$lib';
import { toast } from '@ruzgardogu/utils'
export const Api = new ApiClient({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    suppressErrors: false, // Set to true if you don't want errors to throw,
    onNetworkError: (error) => {
      console.log("==================== NETOWRK ERROR ====================");
      console.log(error);
      console.log("========================================================");
      toast.danger(error.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
    logger: (message) => {
      // Either enhance console logging or send logs to a third-party service
      console.log("aaa", message);
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
    }
  });

