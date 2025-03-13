/**
 * Handles API error processing and callbacks
 */
class ErrorHandler {
  /**
   * Create a new error handler
   * @param {Object} config - Configuration with error callbacks
   * @param {boolean} debug - Whether to log debug information
   * @param {Function} logger - Logger function for debug information
   */
  constructor(config, debug = false, logger = console.log) {
    this.config = config;
    this.debug = debug;
    this.logger = logger;
  }

  /**
   * Process a JSON error response
   * @param {Response} response - Fetch Response object
   * @param {Object} data - Parsed response data
   * @returns {Object} Standardized error object
   */
  processJsonErrorResponse(response, data) {
    const { jsonErrorResponse } = this.config;
    
    const appError = {
      message: data[jsonErrorResponse.messageKey] || 'Unknown error',
      code: data[jsonErrorResponse.codeKey] || 'UNKNOWN_ERROR',
      status: response.status,
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

    this.logError('APPLICATION ERROR', appError);
    
    // Apply error interceptor if provided
    let interceptedError = appError;
    if (typeof this.config.errorInterceptor === 'function' && 
        this.config.errorInterceptor.toString() !== '() => {}') {
      interceptedError = this.config.errorInterceptor(appError);
      interceptedError.handledByClient = true;
    }
    
    // Call application error handler if provided
    if (typeof this.config.onApplicationError === 'function' && 
        this.config.onApplicationError.toString() !== '() => {}') {
      this.config.onApplicationError(interceptedError);
    } else if (typeof this.config.onError === 'function' && 
              this.config.onError.toString() !== '() => {}') {
      this.config.onError(interceptedError);
    }
    
    return interceptedError;
  }

  /**
   * Process HTTP error responses
   * @param {Response} response - Fetch Response object
   * @param {any} data - Parsed response data
   * @returns {Object} Standardized error object
   */
  processHttpError(response, data) {
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
      type: 'http',
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

    this.logError('HTTP ERROR', error);

    // Call specific error handlers based on status code
    let handledBySpecificHandler = this.callSpecificErrorHandler(error);

    // Apply error interceptor if provided
    let interceptedError = error;
    if (typeof this.config.errorInterceptor === 'function' && 
        this.config.errorInterceptor.toString() !== '() => {}') {
      interceptedError = this.config.errorInterceptor(error);
      interceptedError.handledByClient = true;
    }

    // Only call general error handler if no specific handler was called
    if (!handledBySpecificHandler && 
        typeof this.config.onError === 'function' && 
        this.config.onError.toString() !== '() => {}') {
      this.config.onError(interceptedError);
    }

    return interceptedError;
  }

  /**
   * Process network errors (not HTTP status errors)
   * @param {Error} error - Original error object
   * @param {string} url - Request URL
   * @param {string} method - Request method
   * @param {Object} params - Request params
   * @param {Object} headers - Request headers
   * @returns {Object} Standardized error object
   */
  processNetworkError(error, url, method, params, headers) {
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
        headers
      }
    };

    this.logError('NETWORK ERROR', networkError);

    // Call the network error handler specifically
    if (typeof this.config.onNetworkError === 'function' && 
        this.config.onNetworkError.toString() !== '() => {}') {
      this.config.onNetworkError(networkError);
    } else if (typeof this.config.onError === 'function' && 
              this.config.onError.toString() !== '() => {}') {
      this.config.onError(networkError);
    }

    return networkError;
  }

  /**
   * Process abort errors
   * @param {Error} error - Abort error
   * @returns {Object} Standardized error object
   */
  processAbortError(error) {
    if (typeof this.config.onAbort === 'function' && 
        this.config.onAbort.toString() !== '() => {}') {
      this.config.onAbort(error);
      error.handledByClient = true;
    }
    return error;
  }

  /**
   * Call specific error handlers based on HTTP status code
   * @param {Object} error - Error object
   * @returns {boolean} Whether a specific handler was called
   */
  callSpecificErrorHandler(error) {
    const { status } = error;
    let handledBySpecificHandler = false;

    if (status === 404 && 
        typeof this.config.onNotFound === 'function' && 
        this.config.onNotFound.toString() !== '() => {}') {
      this.config.onNotFound(error);
      handledBySpecificHandler = true;
    } else if (status === 401 && 
              typeof this.config.onUnauthorized === 'function' && 
              this.config.onUnauthorized.toString() !== '() => {}') {
      this.config.onUnauthorized(error);
      handledBySpecificHandler = true;
    } else if (status === 429 && 
              typeof this.config.onRateLimit === 'function' && 
              this.config.onRateLimit.toString() !== '() => {}') {
      this.config.onRateLimit(error);
      handledBySpecificHandler = true;
    } else if (status >= 500 && 
              typeof this.config.onServerError === 'function' && 
              this.config.onServerError.toString() !== '() => {}') {
      this.config.onServerError(error);
      handledBySpecificHandler = true;
    } else if (status >= 400 && status < 500 && 
              typeof this.config.onClientError === 'function' && 
              this.config.onClientError.toString() !== '() => {}') {
      this.config.onClientError(error);
      handledBySpecificHandler = true;
    }

    return handledBySpecificHandler;
  }

  /**
   * Create a throwable error from an error object
   * @param {Object} errorObj - Error object
   * @returns {Error} Throwable error
   */
  createThrowableError(errorObj) {
    const throwableError = new Error(errorObj.message);
    Object.assign(throwableError, errorObj);
    return throwableError;
  }

  /**
   * Log an error with a unique identifier
   * @param {string} type - Error type
   * @param {Object} error - Error details
   */
  logError(type, error) {
    if (this.debug) {
      const errorId = Math.random().toString(36).substring(2, 10);
      this.logger(`===== ${type} ${errorId} START =====`);
      this.logger('Error details:', error);
      this.logger(`===== ${type} ${errorId} END =====`);
    }
  }

  /**
   * Handle any error by returning or throwing based on configuration
   * @param {Object} errorObj - Error object
   * @throws {Error} If suppressErrors is false
   * @returns {Object} Error object if suppressErrors is true
   */
  handleError(errorObj) {
    if (this.config.suppressErrors) {
      return { error: errorObj, success: false };
    } else {
      throw this.createThrowableError(errorObj);
    }
  }
}

export default ErrorHandler;