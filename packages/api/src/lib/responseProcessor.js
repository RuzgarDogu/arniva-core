import ErrorHandler from './errorHandler.js';

/**
 * Processes API responses
 */
class ResponseProcessor {
  /**
   * Create a new response processor
   * @param {Object} config - API configuration
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
   * @param {Object} requestConfig - Request configuration
   * @returns {Promise<any>} Processed response data
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
    return this.processSuccessfulResponse(response, data, dataKey, requestConfig);
  }

  /**
   * Extract data from response based on content type
   * @param {Response} response - Fetch Response object
   * @param {string} responseType - Type of response to extract
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
   * @param {string} dataKey - Optional key to extract from response
   * @param {Object} config - API configuration
   * @returns {Promise<any>} Processed response data
   */
  async processSuccessfulResponse(response, data, dataKey, config) {
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
   * @param {Object} response - Original response object
   * @param {Object} data - Processed response data
   * @param {Object} requestConfig - Request configuration
   * @returns {Promise<any>} - Modified response data
   */
  async applyResponseInterceptors(response, data, requestConfig) {
    let responseData = data;
    let responseObj = response;
    let config = requestConfig;

    // Apply registered response interceptors in sequence
    for (const interceptor of requestConfig.interceptors.response) {
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
          await interceptor.rejected(error);
        }
        throw error;
      }
    }

    return responseData;
  }
}

export default ResponseProcessor;