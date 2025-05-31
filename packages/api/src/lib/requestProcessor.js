/** @typedef {import('./types').ApiConfig} ApiConfig */
/** @typedef {import('./types').ParamsObject} ParamsObject */
/** @typedef {import('./types').AbortControllerInfo} AbortControllerInfo */
/** @typedef {import('./types').ApiToken} ApiToken */
/** @typedef {import('./types').RequestOptions} RequestOptions */
/** @typedef {import('./types').RequestData} RequestData */

/**
 * Handles request preparation and modification
 */
class RequestProcessor {
  /**
   * Create a new request processor
   * @param {ApiConfig} config - API configuration
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Prepares the URL by normalizing path and handling parameters
   * @param {string} endpoint - The endpoint path with or without query string
   * @param {ParamsObject} params - Parameters to include in the query string
   * @param {ApiConfig} config - Configuration including baseUrl and paramsSerializer
   * @returns {string} The fully prepared URL
   */
  prepareUrl(endpoint, params = {}, config = this.config) {
    // Check if the endpoint is already an absolute URL (starts with http:// or https://)
    const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);
  
    // Extract any existing query parameters from the endpoint
    const [path, existingQuery] = endpoint.split('?');
  
    // Parse existing query parameters if any
    let mergedParams = { ...params };
    if (existingQuery) {
      const urlSearchParams = new URLSearchParams(existingQuery);
      urlSearchParams.forEach((value, key) => {
        // Use Object.prototype.hasOwnProperty.call instead of direct method access
        if (!Object.prototype.hasOwnProperty.call(mergedParams, key)) {
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
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {RequestOptions} options - User-provided options
 * @param {*} data - Request body data (for POST, PUT)
 * @param {ApiConfig} config - Configuration
 * @returns {{fetchOptions: Object, abortController: AbortController|null}} Prepared fetch options and abort controller
 */
  prepareOptions(method, options = {}, data = null, config = this.config) {
    const { token, headers: configHeaders, timeout, signal, debug } = config;

    // Create a new abort controller for this request if not provided
    const { abortController, effectiveSignal } = this.createAbortController(signal, timeout);

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
      signal: effectiveSignal,
      ...options
    };

    // Handle request body for non-GET methods
    if (data !== null && method !== 'GET' && method !== 'HEAD') {
      this.prepareRequestBody(fetchOptions, headers, data);
    }

    // Debug logging
    if (debug) {
      config.logger('Request options:', JSON.stringify(fetchOptions));
    }

    return { fetchOptions, abortController };
  }

  /**
   * Creates and configures an AbortController
   * @param {AbortSignal|null} existingSignal - Existing signal if provided
   * @param {number} timeout - Request timeout in ms
   * @returns {AbortControllerInfo} AbortController and effective signal
   */
  createAbortController(existingSignal, timeout) {
    // Use provided signal or create a new controller
    if (existingSignal) {
      return { 
        abortController: null, 
        effectiveSignal: existingSignal 
      };
    } 
    
    // Create a new abort controller
    const abortController = new AbortController();
    
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
    
    return { 
      abortController, 
      effectiveSignal: abortController.signal 
    };
  }

/**
 * Prepares the request body based on content type
 * @param {RequestInit} fetchOptions - Fetch options object to modify
 * @param {Object.<string, string>} headers - Request headers
 * @param {*} data - Request body data
 */
prepareRequestBody(fetchOptions, headers, data) {
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
    if (fetchOptions.headers) {
      if (fetchOptions.headers instanceof Headers) {
        // If it's a Headers object, use delete() method
        fetchOptions.headers.delete('Content-Type');
      } else if (Array.isArray(fetchOptions.headers)) {
        // If it's a header array, filter out Content-Type entries
        fetchOptions.headers = fetchOptions.headers.filter(
          ([key]) => key.toLowerCase() !== 'content-type'
        );
      } else if (typeof fetchOptions.headers === 'object') {
        // If it's a plain object, delete the property
        delete fetchOptions.headers['Content-Type'];
      }
    }
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

/**
 * Apply request interceptors to modify request options
 * @param {ApiConfig} requestConfig - Original request configuration
 * @param {RequestInit} fetchOptions - Original fetch options
 * @returns {Promise<{config: ApiConfig, options: RequestInit}>} - Modified configuration and fetch options
 */
  async applyRequestInterceptors(requestConfig, fetchOptions) {
    let config = { ...requestConfig };
    let options = { ...fetchOptions };

    // Apply registered request interceptors in sequence
    let requestInterceptors = requestConfig?.interceptors?.request;

    if(requestInterceptors) {
      for (const interceptor of requestInterceptors) {
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
            await interceptor.rejected(error instanceof Error ? error : new Error(String(error)));
          }
          throw error;
        }
      }
    }


    return { config, options };
  }

  /**
   * Helper to determine if an object is an options object
   * @param {unknown} obj - Object to check
   * @returns {boolean} - True if the object appears to be options
   */
  static isOptionsObject(obj) {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    
    // Check for common fetch/config options properties that are in RequestOptions
    return !!(
      'headers' in obj ||
      'method' in obj ||
      'mode' in obj ||
      'credentials' in obj ||
      'signal' in obj ||
      'config' in obj ||
      'cache' in obj ||
      'redirect' in obj ||
      'forceContentType' in obj
    );
  }

  /**
   * Helper method to normalize parameters for all request methods
   * @param {string} method - HTTP method (GET, POST, PUT, etc.)
   * @param {string} endpoint - API endpoint
   * @param {Array<any>} args - All arguments passed to the original method
   * @returns {{
   *   method: string,
   *   endpoint: string,
   *   params: Record<string, any>,
   *   data: RequestData,
   *   options: RequestOptions
   * }} - Normalized parameters
   */
  static normalizeParams(method, endpoint, args) {
    // Default return structure
    const result = /** @type {{ method: string, endpoint: string, params: Record<string, any>, data: RequestData, options: RequestOptions }} */ ({
      method,
      endpoint,
      params: {},
      data: null,
      options: {}
    });

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
          if (firstArg && RequestProcessor.isOptionsObject(firstArg)) {
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
        result.data = args[0]; // Remove || {} to allow null/undefined
      }

      // For remaining arguments
      if (args.length >= 2) {
        const secondArg = args[1];

        // Check if second argument is options
        if (secondArg && RequestProcessor.isOptionsObject(secondArg)) {
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
        if (thirdArg && RequestProcessor.isOptionsObject(thirdArg)) {
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
}

export default RequestProcessor;