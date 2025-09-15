import { CoupangAuth } from './auth/CoupangAuth';
import { CoupangCredentials, SDKConfig } from './types/Config';
import { logger, LogLevel } from './utils/Logger';
import { ProductsAPI } from './api/ProductsAPI';
import { ProductSearchOptions, ProductSearchResponse } from './types/Product';

/**
 * Main Coupang Partners SDK Client
 *
 * @example
 * ```typescript
 * import { CoupangPartnersClient } from 'coupang-partners-sdk-standalone';
 *
 * const client = new CoupangPartnersClient({
 *   accessKey: 'your-access-key',
 *   secretKey: 'your-secret-key'
 * });
 *
 * const signature = client.generateSignature('GET', '/api/path');
 * ```
 */
export class CoupangPartnersClient {
  private auth: CoupangAuth;
  private config: Required<SDKConfig>;
  private productsAPI: ProductsAPI;

  constructor(credentials: CoupangCredentials, config: Partial<SDKConfig> = {}) {
    // Merge with default config
    this.config = {
      credentials,
      timeout: config.timeout || 10000,
      debug: config.debug || false,
    };

    // Set logger level based on debug mode
    if (this.config.debug) {
      logger.setLevel(LogLevel.DEBUG);
    }

    // Initialize components
    this.auth = new CoupangAuth(credentials);
    this.productsAPI = new ProductsAPI(this.auth, this.config.timeout);

    logger.info('CoupangPartnersClient initialized successfully');
  }

  /**
   * Generate HMAC signature for manual API calls (advanced usage)
   *
   * @param method HTTP method
   * @param url Request URL
   * @returns Authorization header value
   *
   * @example
   * ```typescript
   * const signature = client.generateSignature('GET', '/api/path');
   * ```
   */
  generateSignature(method: string, url: string): string {
    return this.auth.generateHmacSignature(method, url);
  }

  /**
   * Update SDK configuration
   *
   * @param newConfig New configuration options
   *
   * @example
   * ```typescript
   * client.updateConfig({
   *   timeout: 15000,
   *   debug: true
   * });
   * ```
   */
  updateConfig(newConfig: Partial<SDKConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.debug !== undefined) {
      logger.setLevel(newConfig.debug ? LogLevel.DEBUG : LogLevel.INFO);
    }

    if (newConfig.credentials) {
      this.auth.updateCredentials(newConfig.credentials);
      this.productsAPI = new ProductsAPI(this.auth, this.config.timeout);
    }

    if (newConfig.timeout) {
      this.productsAPI = new ProductsAPI(this.auth, this.config.timeout);
    }

    logger.info('SDK configuration updated');
  }

  /**
   * Get current SDK configuration
   *
   * @returns Current configuration (credentials excluded for security)
   */
  getConfig(): Omit<Required<SDKConfig>, 'credentials'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { credentials, ...publicConfig } = this.config;
    return publicConfig;
  }

  /**
   * Get SDK version
   *
   * @returns SDK version string
   */
  getVersion(): string {
    return '1.0.0';
  }

  /**
   * Search products by keyword
   *
   * @param keyword Search keyword
   * @param options Search options (limit, imageSize, etc.)
   * @returns Promise<ProductSearchResponse>
   *
   * @example
   * ```typescript
   * const response = await client.searchProducts('fashion', {
   *   limit: 10,
   *   imageSize: '230x230'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Found products:', response.data?.productData);
   * }
   * ```
   */
  async searchProducts(
    keyword: string,
    options?: ProductSearchOptions
  ): Promise<ProductSearchResponse> {
    return this.productsAPI.search(keyword, options);
  }

  /**
   * Check if SDK is properly configured
   *
   * @returns boolean indicating if SDK is ready
   *
   * @example
   * ```typescript
   * const isReady = client.healthCheck();
   * if (isReady) {
   *   console.log('SDK is ready to use');
   * }
   * ```
   */
  healthCheck(): boolean {
    try {
      // Basic configuration validation
      const hasCredentials =
        this.config.credentials &&
        this.config.credentials.accessKey &&
        this.config.credentials.secretKey;

      if (hasCredentials) {
        logger.info('Health check passed');
        return true;
      } else {
        logger.error('Health check failed: Missing credentials');
        return false;
      }
    } catch (error) {
      logger.error('Health check failed:', error);
      return false;
    }
  }
}
