import { CoupangAuth } from './auth/CoupangAuth';
import { GoldBoxAPI } from './api/GoldBoxAPI';
import { CoupangCredentials, SDKConfig } from './types/Config';
import { Product, ProductSearchOptions } from './types/Product';
import { logger, LogLevel } from './utils/Logger';

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
 * const products = await client.getGoldBoxProducts();
 * ```
 */
export class CoupangPartnersClient {
  private auth: CoupangAuth;
  private goldBoxAPI: GoldBoxAPI;
  private config: Required<SDKConfig>;

  constructor(credentials: CoupangCredentials, config: Partial<SDKConfig> = {}) {
    // Merge with default config
    this.config = {
      credentials,
      baseUrl: config.baseUrl || 'https://api-gateway.coupang.com',
      timeout: config.timeout || 10000,
      cacheDuration: config.cacheDuration || 30 * 60 * 1000, // 30 minutes
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      debug: config.debug || false,
    };

    // Set logger level based on debug mode
    if (this.config.debug) {
      logger.setLevel(LogLevel.DEBUG);
    }

    // Initialize components
    this.auth = new CoupangAuth(credentials);
    this.goldBoxAPI = new GoldBoxAPI(this.auth, this.config);

    logger.info('CoupangPartnersClient initialized successfully');
  }

  /**
   * Get all GoldBox products with optional filtering
   * 
   * @param options Search and filter options
   * @returns Promise of Product array
   * 
   * @example
   * ```typescript
   * // Get all products
   * const allProducts = await client.getGoldBoxProducts();
   * 
   * // Get filtered products
   * const filteredProducts = await client.getGoldBoxProducts({
   *   category: '과일',
   *   minDiscount: 30,
   *   maxPrice: 50000,
   *   limit: 10
   * });
   * ```
   */
  async getGoldBoxProducts(options?: ProductSearchOptions): Promise<Product[]> {
    return this.goldBoxAPI.getGoldBoxProducts(options);
  }

  /**
   * Get products by category
   * 
   * @param category Category name to filter by
   * @returns Promise of Product array
   * 
   * @example
   * ```typescript
   * const fruits = await client.getProductsByCategory('과일');
   * const electronics = await client.getProductsByCategory('전자제품');
   * ```
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.goldBoxAPI.getProductsByCategory(category);
  }

  /**
   * Get products by minimum discount percentage
   * 
   * @param minDiscount Minimum discount percentage
   * @returns Promise of Product array
   * 
   * @example
   * ```typescript
   * const highDiscountProducts = await client.getProductsByDiscount(50);
   * ```
   */
  async getProductsByDiscount(minDiscount: number): Promise<Product[]> {
    return this.goldBoxAPI.getProductsByDiscount(minDiscount);
  }

  /**
   * Get products within price range
   * 
   * @param minPrice Minimum price
   * @param maxPrice Maximum price
   * @returns Promise of Product array
   * 
   * @example
   * ```typescript
   * const affordableProducts = await client.getProductsByPriceRange(10000, 50000);
   * ```
   */
  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.goldBoxAPI.getProductsByPriceRange(minPrice, maxPrice);
  }

  /**
   * Get top-rated products
   * 
   * @param minRating Minimum rating threshold (default: 4.0)
   * @param limit Number of products to return (default: 10)
   * @returns Promise of Product array
   * 
   * @example
   * ```typescript
   * const topRated = await client.getTopRatedProducts(4.5, 20);
   * ```
   */
  async getTopRatedProducts(minRating = 4.0, limit = 10): Promise<Product[]> {
    return this.goldBoxAPI.getTopRatedProducts(minRating, limit);
  }

  /**
   * Get products with high discounts
   * 
   * @param minDiscount Minimum discount percentage (default: 50%)
   * @param limit Number of products to return (default: 20)
   * @returns Promise of Product array
   * 
   * @example
   * ```typescript
   * const deals = await client.getHighDiscountProducts(70, 15);
   * ```
   */
  async getHighDiscountProducts(minDiscount = 50, limit = 20): Promise<Product[]> {
    return this.goldBoxAPI.getHighDiscountProducts(minDiscount, limit);
  }

  /**
   * Clear cached data
   * 
   * @example
   * ```typescript
   * client.clearCache();
   * ```
   */
  clearCache(): void {
    this.goldBoxAPI.clearCache();
    logger.info('All caches cleared');
  }

  /**
   * Get cache status information
   * 
   * @returns Object containing cache information
   * 
   * @example
   * ```typescript
   * const cacheInfo = client.getCacheInfo();
   * console.log(`Cache has ${cacheInfo.size} products`);
   * ```
   */
  getCacheInfo(): { size: number; lastUpdate: Date | null; isValid: boolean } {
    return this.goldBoxAPI.getCacheInfo();
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
    
    this.goldBoxAPI.updateConfig(this.config);
    
    logger.info('SDK configuration updated');
  }

  /**
   * Get current SDK configuration
   * 
   * @returns Current configuration (credentials excluded for security)
   */
  getConfig(): Omit<Required<SDKConfig>, 'credentials'> {
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
   * Check if SDK is properly configured and can make requests
   * 
   * @returns Promise resolving to boolean indicating if SDK is ready
   * 
   * @example
   * ```typescript
   * const isReady = await client.healthCheck();
   * if (isReady) {
   *   console.log('SDK is ready to use');
   * }
   * ```
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try to make a simple request to verify connectivity
      await this.getGoldBoxProducts({ limit: 1 });
      logger.info('Health check passed');
      return true;
    } catch (error) {
      logger.error('Health check failed:', error);
      return false;
    }
  }
}