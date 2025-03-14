/** @typedef {import('./types').ApiConfig} ApiConfig */
/** @typedef {import('./types').ErrorResponse} ErrorResponse */
/** @typedef {import('./types').RequestInfo} RequestInfo */
/** @typedef {import('./types').ResponseInfo} ResponseInfo */

/**
 * @typedef {Object.<string, any>} JsonData
 * Generic object with string keys and any values that we might get from API responses
 */

/**
 * Handles API error processing and callbacks
 */
class ErrorHandler {
  /**
   * Create a new error handler
   * @param {ApiConfig} config - Configuration with error callbacks
   * @param {boolean} debug - Whether to log debug information
   * @param {function(...*):void} logger - Logger function for debug information
   */
  constructor(config, debug = false, logger = console.log) {
    this.config = config;
    this.debug = debug;
    this.logger = logger;
  }

  /**
   * Ensure the error object has an extras property
   * @param {ErrorResponse} error - Error object to prepare
   * @returns {ErrorResponse} Error object with extras property
   * @private
   */
  _prepareError(error) {
    // Initialize the extras object if it doesn't exist
    if (!error.extras || typeof error.extras !== 'object') {
      error.extras = {};
    }
    return error;
  }

  /**
   * Process a JSON error response
   * @param {Response} response - Fetch Response object
   * @param {JsonData} data - Parsed response data
   * @returns {ErrorResponse} Standardized error object
   */
  processJsonErrorResponse(response, data) {
  // Use default values if jsonErrorResponse is undefined
  const messageKey = this.config.jsonErrorResponse?.messageKey || 'message';
  const codeKey = this.config.jsonErrorResponse?.codeKey || 'code';
  
  /** @type {ErrorResponse} */
  const appError = this._prepareError({
    message: data[messageKey] || 'Unknown error',
    code: data[codeKey] || 'UNKNOWN_ERROR',
    status: response.status,
    type: 'application',
    timestamp: new Date().toISOString(),
    handledByClient: true,
    requestUrl: response.url,
    response: {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()]),
      data: data
    },
    extras: {}
  });
  
    this.logError('APPLICATION ERROR', appError);
    
    // Apply error interceptor if provided
    let interceptedError = appError;
    if (typeof this.config.errorInterceptor === 'function' && 
        this.config.errorInterceptor.toString() !== '() => {}') {
      interceptedError = this.config.errorInterceptor(appError);
      interceptedError.handledByClient = true;
      // Make sure extras exists even after interceptor
      this._prepareError(interceptedError);
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
   * @param {JsonData} data - Parsed response data
   * @returns {ErrorResponse} Standardized error object
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
    /** @type {ErrorResponse} */
    const error = this._prepareError({
      message: errorMessage,
      extras: {},
      status: response.status,
      data: errorData,
      type: 'http',
      timestamp: new Date().toISOString(),
      handledByClient: true,
      requestUrl: response.url,
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        data: errorData
      }
    });
  
    this.logError('HTTP ERROR', error);
  
    // Call specific error handlers based on status code
    let handledBySpecificHandler = this.callSpecificErrorHandler(error);
  
    // Apply error interceptor if provided
    let interceptedError = error;
    if (typeof this.config.errorInterceptor === 'function' && 
        this.config.errorInterceptor.toString() !== '() => {}') {
      interceptedError = this.config.errorInterceptor(error);
      interceptedError.handledByClient = true;
      // Make sure extras exists even after interceptor
      this._prepareError(interceptedError);
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
   * @returns {ErrorResponse} Standardized error object
   */
  processNetworkError(error, url, method, params, headers) {
    /** @type {ErrorResponse} */
    const networkError = this._prepareError({
      message: 'Network error: ' + error.message,
      originalError: error,
      type: 'network',
      timestamp: new Date().toISOString(),
      url: url,
      status: 0,
      handledByClient: true,
      extras: {}, // Add the extras property here
      request: {
        url,
        method, 
        endpoint: url.split('/').pop() || '', // Extract endpoint from URL
        params: Object.keys(params).length > 0 ? params : undefined,
        headers
      }
    });
  
    this.logError('NETWORK ERROR', networkError);
  
    // Rest of the method...

  
    // Apply error interceptor if provided
    let interceptedError = networkError;
    if (typeof this.config.errorInterceptor === 'function' && 
        this.config.errorInterceptor.toString() !== '() => {}') {
      interceptedError = this.config.errorInterceptor(networkError);
      interceptedError.handledByClient = true;
      // Make sure extras exists even after interceptor
      this._prepareError(interceptedError);
    }
  
    // Call the network error handler specifically
    if (typeof this.config.onNetworkError === 'function' && 
        this.config.onNetworkError.toString() !== '() => {}') {
      this.config.onNetworkError(interceptedError);
    } else if (typeof this.config.onError === 'function' && 
              this.config.onError.toString() !== '() => {}') {
      this.config.onError(interceptedError);
    }
  
    return interceptedError;
  }

  /**
   * Process abort errors
   * @param {ErrorResponse} error - Abort error
   * @returns {ErrorResponse} Standardized error object
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
   * @param {ErrorResponse} error - Error object
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
   * @param {ErrorResponse} errorObj - Error object
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
   * @param {ErrorResponse} error - Error details
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
   * @param {ErrorResponse} errorObj - Error object
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