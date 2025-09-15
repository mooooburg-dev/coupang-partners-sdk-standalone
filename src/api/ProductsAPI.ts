import { BaseAPI } from './BaseAPI';
import { CoupangAuth } from '../auth/CoupangAuth';
import { ProductSearchParams, ProductSearchResponse, ProductSearchOptions } from '../types/Product';
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
}
