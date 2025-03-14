import ErrorHandler from './errorHandler.js';

/** @typedef {import('./types').ApiConfig} ApiConfig */
/** @typedef {import('./types').ErrorResponse} ErrorResponse */
/** @typedef {import('./types').ApiResponse} ApiResponse */

/**
 * Processes API responses
 */
class ResponseProcessor {
  /**
   * Create a new response processor
   * @param {ApiConfig} config - API configuration
   */
  constructor(config) {
    this.config = config;
    this.errorHandler = new ErrorHandler(
      config, 
      config.debug, 
      config.logger
    );
  }

  /**
   * Process an API response
   * @param {Response} response - Fetch Response object
   * @param {ApiConfig} requestConfig - Request configuration
   * @returns {Promise<any>} Processed response data
   * @throws {ErrorResponse} If an error occurs and suppressErrors is false
   */
  async process(response, requestConfig = this.config) {
    const { dataKey, responseType, debug, jsonErrorResponse } = requestConfig;

    // Debug logging
    if (debug) {
      requestConfig.logger('Response:', response);
    }

    // Extract data based on specified response type
    const { data, isJson } = await this.extractData(response, responseType);

    // Handle JSON error responses with non-200 status codes
    if (!response.ok && isJson && data && typeof data === 'object' && jsonErrorResponse) {
      const errorObj = this.errorHandler.processJsonErrorResponse(response, data);
      return this.errorHandler.handleError(errorObj);
    }

    // Handle standard HTTP errors
    if (!response.ok) {
      const errorObj = this.errorHandler.processHttpError(response, data);
      return this.errorHandler.handleError(errorObj);
    }

        // Process successful response
    return this.processSuccessfulResponse(response, data, requestConfig, dataKey);
  }

  /**
   * Extract data from response based on content type
   * @param {Response} response - Fetch Response object
   * @param {'json'|'text'|'blob'|'arrayBuffer'} responseType - Type of response to extract
   * @returns {Promise<{data: any, isJson: boolean}>} Extracted data and type flag
   */
  async extractData(response, responseType) {
    let data;
    let isJson = false;

    // Parse response based on content type
    if (responseType === 'json' || !responseType) {
      try {
        data = await response.json();
        isJson = true;
      } catch (e) {
        data = null;
        if (e instanceof Error) {
          this.config.logger('JSON parse error:', e.message);
        } else {
          this.config.logger('JSON parse error:', String(e));
        }
      }
    } else if (responseType === 'text') {
      data = await response.text();
    } else if (responseType === 'blob') {
      data = await response.blob();
    } else if (responseType === 'arrayBuffer') {
      data = await response.arrayBuffer();
    }

    return { data, isJson };
  }

  /**
   * Process a successful response
   * @param {Response} response - Fetch Response object
   * @param {any} data - Parsed response data
   * @param {ApiConfig} config - API configuration
   * @param {string} [dataKey] - Optional key to extract from response
   * @returns {Promise<any>} Processed response data
   */
  async processSuccessfulResponse(response, data, config, dataKey) {
    // Extract specific data if dataKey is provided
    let processedData = data;
    
    if (dataKey && processedData && typeof processedData === 'object') {
      if (processedData[dataKey] !== undefined) {
        processedData = processedData[dataKey];
      } else {
        console.warn(`Data key "${dataKey}" not found in response: ${JSON.stringify(processedData)}`);
      }
    }
  
    // Apply response interceptors if available
    return this.applyResponseInterceptors(response, processedData, config);
  }

  /**
   * Apply response interceptors to modify response data
   * @param {Response} response - Original response object
   * @param {any} data - Processed response data
   * @param {ApiConfig} requestConfig - Request configuration
   * @returns {Promise<any>} - Modified response data
   */
  async applyResponseInterceptors(response, data, requestConfig) {
    let responseData = data;
    let responseObj = response;
    let config = requestConfig;

    // Apply registered response interceptors in sequence
    const requestConfigInterceptors = requestConfig?.interceptors?.response;
    if (requestConfigInterceptors) {
      for (const interceptor of requestConfigInterceptors) {
        try {
          if (typeof interceptor.fulfilled === 'function') {
            const result = await interceptor.fulfilled({
              data: responseData,
              response: responseObj,
              config
            });
            if (result && result.data !== undefined) {
              responseData = result.data;
            }
            if (result && result.response !== undefined) {
              responseObj = result.response;
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

    return responseData;
  }
}

export default ResponseProcessor;