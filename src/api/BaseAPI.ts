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
    params?: Record<string, any>,
    body?: any
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

      const fetchOptions: any = {
        method,
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
        signal: controller.signal as any,
      };

      // Add body for POST, PUT, PATCH requests
      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url.toString(), fetchOptions);

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();

      // Check if response is empty
      if (!responseText.trim()) {
        logger.error('API returned empty response');
        throw new Error('API returned empty response');
      }

      // Check if response is HTML (error page)
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        logger.error('API returned HTML instead of JSON:', responseText.substring(0, 200));
        throw new Error('API returned HTML error page instead of JSON');
      }

      try {
        const data = JSON.parse(responseText) as T;
        logger.debug('API response received:', data);
        return data;
      } catch (parseError) {
        logger.error('Failed to parse JSON response:', responseText.substring(0, 500));
        throw new Error(
          `Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`
        );
      }
    } catch (error) {
      logger.error('API request error:', error);
      throw error;
    }
  }
}
