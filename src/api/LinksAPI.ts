import { BaseAPI } from './BaseAPI';
import { CoupangAuth } from '../auth/CoupangAuth';
import { DeeplinkParams, DeeplinkResponse } from '../types/Product';
import { logger } from '../utils/Logger';

/**
 * Links API implementation for Coupang Partners
 */
export class LinksAPI extends BaseAPI {
  constructor(auth: CoupangAuth, timeout?: number) {
    super(auth, timeout);
  }

  /**
   * Convert Coupang URLs to partner affiliate links (deeplink)
   *
   * @param params Deeplink request parameters
   * @returns Promise<DeeplinkResponse>
   *
   * @example
   * ```typescript
   * const linksAPI = new LinksAPI(auth);
   * const response = await linksAPI.deeplink({
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
    const startTime = Date.now();

    try {
      if (!params.coupangUrls || params.coupangUrls.length === 0) {
        throw new Error('coupangUrls is required and must contain at least one URL');
      }

      logger.info('Converting Coupang URLs to affiliate links', {
        urlCount: params.coupangUrls.length,
        subId: params.subId,
      });

      const endpoint = '/v2/providers/affiliate_open_api/apis/openapi/products/deeplink';

      const requestBody: DeeplinkParams = {
        coupangUrls: params.coupangUrls,
        ...(params.subId && { subId: params.subId }),
      };

      const response = await this.makeRequest<DeeplinkResponse>(
        'POST',
        endpoint,
        undefined,
        requestBody
      );

      const duration = Date.now() - startTime;
      logger.info('Deeplink conversion completed successfully', {
        duration,
        convertedCount: response.data?.length || 0,
        rCode: response.rCode,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to convert Coupang URLs to affiliate links', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        params,
      });
      throw error;
    }
  }
}
