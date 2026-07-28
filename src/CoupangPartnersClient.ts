import { CoupangAuth } from './auth/CoupangAuth';
import { CoupangCredentials, SDKConfig } from './types/Config';
import { logger, LogLevel } from './utils/Logger';
import { ProductsAPI } from './api/ProductsAPI';
import { LinksAPI } from './api/LinksAPI';
import { ReportsAPI } from './api/ReportsAPI';
import {
  ProductSearchOptions,
  ProductSearchResponse,
  GoldBoxOptions,
  GoldBoxResponse,
  CoupangPLParams,
  CoupangPLResponse,
  RecommendationParams,
  RecommendationResponse,
  DeeplinkParams,
  DeeplinkResponse,
} from './types/Product';
import {
  ReportParams,
  ClickReportResponse,
  OrderReportResponse,
  CommissionReportResponse,
  CancelReportResponse,
} from './types/Report';

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
  private linksAPI: LinksAPI;
  private reportsAPI: ReportsAPI;

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
    this.linksAPI = new LinksAPI(this.auth, this.config.timeout);
    this.reportsAPI = new ReportsAPI(this.auth, this.config.timeout);

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
      this.linksAPI = new LinksAPI(this.auth, this.config.timeout);
      this.reportsAPI = new ReportsAPI(this.auth, this.config.timeout);
    }

    if (newConfig.timeout) {
      this.productsAPI = new ProductsAPI(this.auth, this.config.timeout);
      this.linksAPI = new LinksAPI(this.auth, this.config.timeout);
      this.reportsAPI = new ReportsAPI(this.auth, this.config.timeout);
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
    return '1.3.0';
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
   * Get GoldBox products (hot deals)
   *
   * @param options GoldBox options (subId, imageSize)
   * @returns Promise<GoldBoxResponse>
   *
   * @example
   * ```typescript
   * const response = await client.goldbox({
   *   subId: 'my-sub-id',
   *   imageSize: '230x230'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('GoldBox products:', response.data);
   * }
   * ```
   */
  async goldbox(options?: GoldBoxOptions): Promise<GoldBoxResponse> {
    return this.productsAPI.goldbox(options);
  }

  /**
   * Get GoldBox products with filtering options
   *
   * @param options GoldBox options (subId, imageSize)
   * @param filters Client-side filtering options
   * @returns Promise<GoldBoxResponse>
   *
   * @example
   * ```typescript
   * const response = await client.goldboxWithFilters({
   *   imageSize: '230x230'
   * }, {
   *   minPrice: 10000,
   *   maxPrice: 100000,
   *   rocketOnly: true
   * });
   * ```
   */
  async goldboxWithFilters(
    options?: GoldBoxOptions,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      categories?: string[];
      rocketOnly?: boolean;
      freeShippingOnly?: boolean;
    }
  ): Promise<GoldBoxResponse> {
    return this.productsAPI.goldboxWithFilters(options, filters);
  }

  /**
   * Get CoupangPL products
   *
   * @param options CoupangPL options (limit, subId, imageSize)
   * @returns Promise<CoupangPLResponse>
   *
   * @example
   * ```typescript
   * const response = await client.coupangPL({
   *   limit: 50,
   *   subId: 'my-sub-id',
   *   imageSize: '512x512'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('CoupangPL products:', response.data);
   * }
   * ```
   */
  async coupangPL(options?: CoupangPLParams): Promise<CoupangPLResponse> {
    return this.productsAPI.coupangPL(options);
  }

  /**
   * Get personalized recommendation products
   *
   * @param params Recommendation parameters (deviceId, subId, imageSize)
   * @returns Promise<RecommendationResponse>
   *
   * @example
   * ```typescript
   * const response = await client.recommendation({
   *   deviceId: 'your-adid-or-gaid',
   *   subId: 'my-tracking-id',
   *   imageSize: '512x512'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Recommendation products:', response.data);
   * }
   * ```
   */
  async recommendation(params: RecommendationParams): Promise<RecommendationResponse> {
    return this.productsAPI.recommendation(params);
  }

  /**
   * Convert Coupang URLs to partner affiliate links (deeplink)
   *
   * @param params Deeplink parameters (coupangUrls, subId)
   * @returns Promise<DeeplinkResponse>
   *
   * @example
   * ```typescript
   * const response = await client.deeplink({
   *   coupangUrls: [
   *     'https://www.coupang.com/vp/products/184614775'
   *   ],
   *   subId: 'my-sub-id'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Converted links:', response.data);
   * }
   * ```
   */
  async deeplink(params: DeeplinkParams): Promise<DeeplinkResponse> {
    return this.linksAPI.deeplink(params);
  }

  /**
   * Get daily click report
   * (일 별 클릭 수에 대한 정보. 일 별 실적은 매일 오후 15:00에 업데이트 됩니다)
   *
   * @param params Report parameters (startDate, endDate, subId, page)
   * @returns Promise<ClickReportResponse>
   *
   * @example
   * ```typescript
   * const response = await client.getClicksReport({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Click reports:', response.data);
   * }
   * ```
   */
  async getClicksReport(params: ReportParams): Promise<ClickReportResponse> {
    return this.reportsAPI.clicks(params);
  }

  /**
   * Get daily order report (상품 단위)
   * (일 별 주문 정보. 일 별 실적은 매일 오후 15:00에 업데이트 됩니다)
   *
   * @param params Report parameters (startDate, endDate, subId, page)
   * @returns Promise<OrderReportResponse>
   *
   * @example
   * ```typescript
   * const response = await client.getOrdersReport({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Order reports:', response.data);
   * }
   * ```
   */
  async getOrdersReport(params: ReportParams): Promise<OrderReportResponse> {
    return this.reportsAPI.orders(params);
  }

  /**
   * Get daily commission report
   * (일 별 수익 정보. 일 별 실적은 매일 오후 15:00에 업데이트 됩니다)
   *
   * @param params Report parameters (startDate, endDate, subId, page)
   * @returns Promise<CommissionReportResponse>
   *
   * @example
   * ```typescript
   * const response = await client.getCommissionReport({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Commission reports:', response.data);
   * }
   * ```
   */
  async getCommissionReport(params: ReportParams): Promise<CommissionReportResponse> {
    return this.reportsAPI.commission(params);
  }

  /**
   * Get daily cancel report
   * (일 별 취소 정보. 일 별 실적은 매일 오후 15:00에 업데이트 됩니다)
   *
   * @param params Report parameters (startDate, endDate, subId, page)
   * @returns Promise<CancelReportResponse>
   *
   * @example
   * ```typescript
   * const response = await client.getCancelsReport({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Cancel reports:', response.data);
   * }
   * ```
   */
  async getCancelsReport(params: ReportParams): Promise<CancelReportResponse> {
    return this.reportsAPI.cancels(params);
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
