import { BaseAPI } from './BaseAPI';
import { CoupangAuth } from '../auth/CoupangAuth';
import {
  ProductSearchParams,
  ProductSearchResponse,
  ProductSearchOptions,
  GoldBoxParams,
  GoldBoxResponse,
  CoupangPLParams,
  CoupangPLResponse,
} from '../types/Product';
import { logger } from '../utils/Logger';

/**
 * Products API implementation for Coupang Partners
 */
export class ProductsAPI extends BaseAPI {
  constructor(auth: CoupangAuth, timeout?: number) {
    super(auth, timeout);
  }

  /**
   * Search products using keyword
   *
   * @param keyword Search keyword (required)
   * @param options Search options (optional)
   * @returns Promise<ProductSearchResponse>
   *
   * @example
   * ```typescript
   * const productsAPI = new ProductsAPI(auth);
   * const response = await productsAPI.search('fashion', {
   *   limit: 10,
   *   imageSize: '230x230',
   *   srpLinkOnly: false
   * });
   * ```
   */
  async search(
    keyword: string,
    options: ProductSearchOptions = {}
  ): Promise<ProductSearchResponse> {
    if (!keyword || keyword.trim().length === 0) {
      throw new Error('Keyword is required for product search');
    }

    const params: ProductSearchParams = {
      keyword: keyword.trim(),
      limit: options.limit || 10,
      ...(options.subId && { subId: options.subId }),
      imageSize: options.imageSize || '230x230',
      srpLinkOnly: options.srpLinkOnly || false,
    };

    logger.info(`Searching products with keyword: "${keyword}"`);
    logger.debug('Search parameters:', params);

    try {
      const response = await this.makeRequest<ProductSearchResponse>(
        'GET',
        '/v2/providers/affiliate_open_api/apis/openapi/products/search',
        params
      );

      logger.info(`Found ${response.data?.productData?.length || 0} products`);
      return response;
    } catch (error) {
      logger.error('Product search failed:', error);
      throw error;
    }
  }

  /**
   * Get GoldBox products (hot deals)
   *
   * @param params GoldBox request parameters
   * @returns Promise<GoldBoxResponse>
   *
   * @example
   * ```typescript
   * const productsAPI = new ProductsAPI(auth);
   * const response = await productsAPI.goldbox({
   *   subId: 'my-sub-id',
   *   imageSize: '230x230'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('GoldBox products:', response.data);
   * }
   * ```
   */
  async goldbox(params: GoldBoxParams = {}): Promise<GoldBoxResponse> {
    const startTime = Date.now();

    try {
      logger.info('Getting GoldBox products', { params });

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (params.subId) {
        queryParams.append('subId', params.subId);
      }

      if (params.imageSize) {
        queryParams.append('imageSize', params.imageSize);
      }

      // Build full URL with query parameters
      const endpoint = '/v2/providers/affiliate_open_api/apis/openapi/products/goldbox';
      const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;

      const response = await this.makeRequest<GoldBoxResponse>('GET', url);

      const duration = Date.now() - startTime;
      logger.info('GoldBox products retrieved successfully', {
        duration,
        productCount: response.data?.length || 0,
        rCode: response.rCode,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to get GoldBox products', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        params,
      });
      throw error;
    }
  }

  /**
   * Get GoldBox products with filtering options
   *
   * @param params GoldBox request parameters
   * @param filters Optional client-side filters
   * @returns Promise<GoldBoxResponse>
   *
   * @example
   * ```typescript
   * const response = await productsAPI.goldboxWithFilters({
   *   imageSize: '230x230'
   * }, {
   *   minPrice: 10000,
   *   maxPrice: 100000,
   *   categories: ['패션']
   * });
   * ```
   */
  async goldboxWithFilters(
    params: GoldBoxParams = {},
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      categories?: string[];
      rocketOnly?: boolean;
      freeShippingOnly?: boolean;
    }
  ): Promise<GoldBoxResponse> {
    const response = await this.goldbox(params);

    if (!response.data || !filters) {
      return response;
    }

    // Apply client-side filters
    let filteredProducts = response.data;

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.productPrice >= (filters.minPrice ?? 0)
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.productPrice <= (filters.maxPrice ?? Number.MAX_SAFE_INTEGER)
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        (filters.categories ?? []).some(category => product.categoryName.includes(category))
      );
    }

    if (filters.rocketOnly) {
      filteredProducts = filteredProducts.filter(product => product.isRocket);
    }

    if (filters.freeShippingOnly) {
      filteredProducts = filteredProducts.filter(product => product.isFreeShipping);
    }

    return {
      ...response,
      data: filteredProducts,
    };
  }

  /**
   * Get CoupangPL products
   *
   * @param params CoupangPL request parameters
   * @returns Promise<CoupangPLResponse>
   *
   * @example
   * ```typescript
   * const productsAPI = new ProductsAPI(auth);
   * const response = await productsAPI.coupangPL({
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
  async coupangPL(params: CoupangPLParams = {}): Promise<CoupangPLResponse> {
    const startTime = Date.now();

    try {
      logger.info('Getting CoupangPL products', { params });

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      if (params.subId) {
        queryParams.append('subId', params.subId);
      }

      if (params.imageSize) {
        queryParams.append('imageSize', params.imageSize);
      }

      // Build full URL with query parameters
      const endpoint = '/v2/providers/affiliate_open_api/apis/openapi/products/coupangPL';
      const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;

      const response = await this.makeRequest<CoupangPLResponse>('GET', url);

      const duration = Date.now() - startTime;
      logger.info('CoupangPL products retrieved successfully', {
        duration,
        productCount: response.data?.length || 0,
        rCode: response.rCode,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to get CoupangPL products', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        params,
      });
      throw error;
    }
  }
}
