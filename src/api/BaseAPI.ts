import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CoupangAuth } from '../auth/CoupangAuth';
import { SDKConfig } from '../types/Config';
import { ApiError } from '../types/Product';
import { logger } from '../utils/Logger';

/**
 * Base API client with authentication and error handling
 */
export class BaseAPI {
  protected httpClient!: AxiosInstance;
  protected auth: CoupangAuth;
  protected config: Required<SDKConfig>;

  constructor(auth: CoupangAuth, config: SDKConfig) {
    this.auth = auth;
    this.config = {
      credentials: config.credentials,
      baseUrl: config.baseUrl || 'https://api-gateway.coupang.com',
      timeout: config.timeout || 10000,
      cacheDuration: config.cacheDuration || 30 * 60 * 1000, // 30 minutes
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      debug: config.debug || false,
    };

    this.initializeHttpClient();
  }

  /**
   * Initialize axios HTTP client with interceptors
   * 
   * @private
   */
  private initializeHttpClient(): void {
    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': 'CoupangPartnersSDK/1.0.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.httpClient.interceptors.request.use(
      (config) => {
        const authHeaders = this.auth.getAuthorizationHeader(
          config.method?.toUpperCase() || 'GET',
          config.url || ''
        );
        
        Object.assign(config.headers || {}, authHeaders);

        if (this.config.debug) {
          logger.debug(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
          logger.debug('Request headers:', config.headers);
        }

        return config;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response) => {
        if (this.config.debug) {
          logger.debug(`Response received: ${response.status} ${response.statusText}`);
        }
        return response;
      },
      async (error) => {
        const apiError = this.createApiError(error);
        
        // Retry logic for certain errors
        if (this.shouldRetry(error) && error.config && !error.config.__retryCount) {
          return this.retryRequest(error);
        }

        logger.error('API request failed:', apiError.message);
        throw apiError;
      }
    );
  }

  /**
   * Make HTTP request with proper error handling
   * 
   * @protected
   */
  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.httpClient.request(config);
      return response.data;
    } catch (error) {
      // Error is already handled by interceptor
      throw error;
    }
  }

  /**
   * Create standardized API error
   * 
   * @private
   */
  private createApiError(error: any): ApiError {
    const apiError = new Error() as ApiError;
    
    if (error.response) {
      // Server responded with error status
      apiError.statusCode = error.response.status;
      apiError.message = this.getErrorMessage(error.response.status);
      apiError.details = error.response.data;
      
      switch (error.response.status) {
        case 401:
          apiError.code = 'AUTHENTICATION_FAILED';
          break;
        case 403:
          apiError.code = 'FORBIDDEN';
          break;
        case 429:
          apiError.code = 'RATE_LIMITED';
          break;
        case 500:
          apiError.code = 'INTERNAL_SERVER_ERROR';
          break;
        default:
          apiError.code = 'HTTP_ERROR';
      }
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error: Unable to connect to Coupang API';
      apiError.code = 'NETWORK_ERROR';
    } else {
      // Other error
      apiError.message = error.message || 'Unknown error occurred';
      apiError.code = 'UNKNOWN_ERROR';
    }

    return apiError;
  }

  /**
   * Get user-friendly error message
   * 
   * @private
   */
  private getErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 401:
        return 'Authentication failed. Please check your API credentials.';
      case 403:
        return 'Access forbidden. You may not have permission for this resource.';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `HTTP error ${statusCode}`;
    }
  }

  /**
   * Check if error should be retried
   * 
   * @private
   */
  private shouldRetry(error: any): boolean {
    if (!error.response) return true; // Network errors
    
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.response.status);
  }

  /**
   * Retry failed request
   * 
   * @private
   */
  private async retryRequest(error: any): Promise<any> {
    const config = error.config;
    config.__retryCount = config.__retryCount || 0;
    
    if (config.__retryCount >= this.config.retryAttempts) {
      throw error;
    }
    
    config.__retryCount += 1;
    
    logger.warn(`Retrying request (${config.__retryCount}/${this.config.retryAttempts})`);
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * config.__retryCount));
    
    return this.httpClient(config);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SDKConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.credentials) {
      this.auth.updateCredentials(newConfig.credentials);
    }
    
    if (newConfig.baseUrl || newConfig.timeout) {
      this.initializeHttpClient();
    }
    
    logger.info('API configuration updated');
  }
}