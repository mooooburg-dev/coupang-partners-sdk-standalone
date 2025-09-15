import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import { CoupangAuth } from '../auth/CoupangAuth';
import { logger } from '../utils/Logger';

/**
 * Base API class with common functionality
 */
export abstract class BaseAPI {
  protected auth: CoupangAuth;
  protected baseUrl = 'https://api-gateway.coupang.com';
  protected timeout: number;

  constructor(auth: CoupangAuth, timeout = 10000) {
    this.auth = auth;
    this.timeout = timeout;
  }

  /**
   * Make HTTP request with authentication
   */
  protected async makeRequest<T>(
    method: string,
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);

    if (params && method === 'GET') {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    const fullPath = url.pathname + url.search;
    const authHeader = this.auth.getAuthorizationHeader(method, fullPath);

    logger.debug(`Making ${method} request to: ${fullPath}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url.toString(), {
        method,
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
        signal: controller.signal as any,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      logger.debug('API response received:', data);

      return data;
    } catch (error) {
      logger.error('API request error:', error);
      throw error;
    }
  }
}
