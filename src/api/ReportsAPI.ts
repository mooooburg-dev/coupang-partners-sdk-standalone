import { BaseAPI } from './BaseAPI';
import { CoupangAuth } from '../auth/CoupangAuth';
import {
  ReportParams,
  ClickReportResponse,
  OrderReportResponse,
  CommissionReportResponse,
  CancelReportResponse,
} from '../types/Report';
import { logger } from '../utils/Logger';

/**
 * Reports API implementation for Coupang Partners
 */
export class ReportsAPI extends BaseAPI {
  constructor(auth: CoupangAuth, timeout?: number) {
    super(auth, timeout);
  }

  /**
   * Validate common report parameters (startDate, endDate)
   */
  private validateReportParams(params: ReportParams): void {
    if (!params.startDate || !params.endDate) {
      throw new Error('startDate and endDate are required');
    }

    const datePattern = /^\d{8}$/;
    if (!datePattern.test(params.startDate) || !datePattern.test(params.endDate)) {
      throw new Error('startDate and endDate must be in yyyyMMdd format');
    }

    const start = new Date(
      Number(params.startDate.slice(0, 4)),
      Number(params.startDate.slice(4, 6)) - 1,
      Number(params.startDate.slice(6, 8))
    );
    const end = new Date(
      Number(params.endDate.slice(0, 4)),
      Number(params.endDate.slice(4, 6)) - 1,
      Number(params.endDate.slice(6, 8))
    );

    if (end < start) {
      throw new Error('endDate must be greater than or equal to startDate');
    }

    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 30) {
      throw new Error('The difference between startDate and endDate must be 30 days or less');
    }
  }

  /**
   * Get daily click report
   *
   * @param params Report request parameters (startDate, endDate, subId, page)
   * @returns Promise<ClickReportResponse>
   *
   * @example
   * ```typescript
   * const reportsAPI = new ReportsAPI(auth);
   * const response = await reportsAPI.clicks({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Click reports:', response.data);
   * }
   * ```
   */
  async clicks(params: ReportParams): Promise<ClickReportResponse> {
    const startTime = Date.now();

    try {
      this.validateReportParams(params);

      logger.info('Fetching click report', {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const endpoint = '/v2/providers/affiliate_open_api/apis/openapi/reports/clicks';

      const response = await this.makeRequest<ClickReportResponse>('GET', endpoint, {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const duration = Date.now() - startTime;
      logger.info('Click report fetched successfully', {
        duration,
        recordCount: response.data?.length || 0,
        rCode: response.rCode,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to fetch click report', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        params,
      });
      throw error;
    }
  }

  /**
   * Get daily order report (상품 단위)
   *
   * @param params Report request parameters (startDate, endDate, subId, page)
   * @returns Promise<OrderReportResponse>
   *
   * @example
   * ```typescript
   * const reportsAPI = new ReportsAPI(auth);
   * const response = await reportsAPI.orders({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Order reports:', response.data);
   * }
   * ```
   */
  async orders(params: ReportParams): Promise<OrderReportResponse> {
    const startTime = Date.now();

    try {
      this.validateReportParams(params);

      logger.info('Fetching order report', {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const endpoint = '/v2/providers/affiliate_open_api/apis/openapi/reports/orders';

      const response = await this.makeRequest<OrderReportResponse>('GET', endpoint, {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const duration = Date.now() - startTime;
      logger.info('Order report fetched successfully', {
        duration,
        recordCount: response.data?.length || 0,
        rCode: response.rCode,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to fetch order report', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        params,
      });
      throw error;
    }
  }

  /**
   * Get daily commission report
   *
   * @param params Report request parameters (startDate, endDate, subId, page)
   * @returns Promise<CommissionReportResponse>
   *
   * @example
   * ```typescript
   * const reportsAPI = new ReportsAPI(auth);
   * const response = await reportsAPI.commission({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Commission reports:', response.data);
   * }
   * ```
   */
  async commission(params: ReportParams): Promise<CommissionReportResponse> {
    const startTime = Date.now();

    try {
      this.validateReportParams(params);

      logger.info('Fetching commission report', {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const endpoint = '/v2/providers/affiliate_open_api/apis/openapi/reports/commission';

      const response = await this.makeRequest<CommissionReportResponse>('GET', endpoint, {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const duration = Date.now() - startTime;
      logger.info('Commission report fetched successfully', {
        duration,
        recordCount: response.data?.length || 0,
        rCode: response.rCode,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to fetch commission report', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        params,
      });
      throw error;
    }
  }

  /**
   * Get daily cancel report
   *
   * @param params Report request parameters (startDate, endDate, subId, page)
   * @returns Promise<CancelReportResponse>
   *
   * @example
   * ```typescript
   * const reportsAPI = new ReportsAPI(auth);
   * const response = await reportsAPI.cancels({
   *   startDate: '20250701',
   *   endDate: '20250731'
   * });
   *
   * if (response.rCode === '0') {
   *   console.log('Cancel reports:', response.data);
   * }
   * ```
   */
  async cancels(params: ReportParams): Promise<CancelReportResponse> {
    const startTime = Date.now();

    try {
      this.validateReportParams(params);

      logger.info('Fetching cancel report', {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const endpoint = '/v2/providers/affiliate_open_api/apis/openapi/reports/cancels';

      const response = await this.makeRequest<CancelReportResponse>('GET', endpoint, {
        startDate: params.startDate,
        endDate: params.endDate,
        subId: params.subId,
        page: params.page,
      });

      const duration = Date.now() - startTime;
      logger.info('Cancel report fetched successfully', {
        duration,
        recordCount: response.data?.length || 0,
        rCode: response.rCode,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to fetch cancel report', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        params,
      });
      throw error;
    }
  }
}
