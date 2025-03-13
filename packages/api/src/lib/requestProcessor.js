/**
 * Handles request preparation and modification
 */
class RequestProcessor {
  /**
   * Create a new request processor
   * @param {Object} config - API configuration
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Prepares the URL by normalizing path and handling parameters
   * @param {string} endpoint - The endpoint path with or without query string
   * @param {Object} params - Parameters to include in the query string
   * @param {Object} config - Configuration including baseUrl and paramsSerializer
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
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {Object} options - User-provided options
   * @param {*} data - Request body data (for POST, PUT)
   * @param {Object} config - Configuration
   * @returns {Object} Prepared fetch options and abort controller
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
      config.logger('Request options:', fetchOptions);
    }

    return { fetchOptions, abortController };
  }

  /**
   * Creates and configures an AbortController
   * @param {AbortSignal} existingSignal - Existing signal if provided
   * @param {number} timeout - Request timeout in ms
   * @returns {Object} AbortController and effective signal
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
   * @param {Object} fetchOptions - Fetch options object to modify
   * @param {Object} headers - Request headers
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

  /**
   * Apply request interceptors to modify request options
   * @param {Object} requestConfig - Original request configuration
   * @param {Object} fetchOptions - Original fetch options
   * @returns {Promise<Object>} - Modified fetch options
   */
  async applyRequestInterceptors(requestConfig, fetchOptions) {
    let config = { ...requestConfig };
    let options = { ...fetchOptions };

    // Apply registered request interceptors in sequence
    for (const interceptor of requestConfig.interceptors.request) {
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
   * Helper to determine if an object is an options object
   * @param {Object} obj - Object to check
   * @returns {boolean} - True if the object appears to be options
   */
  static isOptionsObject(obj) {
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
   * Helper method to normalize parameters for all request methods
   * @param {string} method - HTTP method (GET, POST, PUT, etc.)
   * @param {string} endpoint - API endpoint
   * @param {Array} args - All arguments passed to the original method
   * @returns {Object} - Normalized parameters
   */
  static normalizeParams(method, endpoint, args) {
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
        result.data = args[0] || {};
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