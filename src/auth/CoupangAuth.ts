import crypto from 'crypto';
import moment from 'moment';
import { CoupangCredentials } from '../types/Config';
import { logger } from '../utils/Logger';

/**
 * Coupang Partners API Authentication Handler
 */
export class CoupangAuth {
  private credentials: CoupangCredentials;

  constructor(credentials: CoupangCredentials) {
    this.validateCredentials(credentials);
    this.credentials = credentials;
  }

  /**
   * Generate HMAC SHA256 signature for Coupang Partners API
   * 
   * @param method HTTP method (GET, POST, etc.)
   * @param url Request URL path with query parameters
   * @returns Authorization header value
   */
  generateHmacSignature(method: string, url: string): string {
    try {
      const parts = url.split(/\?/);
      const [path, query = ''] = parts;

      // Generate UTC timestamp in Coupang format
      const datetime = moment.utc().format('YYMMDD[T]HHmmss[Z]');
      
      // Create message for signing
      const message = datetime + method.toUpperCase() + path + query;
      
      logger.debug(`Generating HMAC signature for: ${method} ${path}`);
      logger.debug(`Message to sign: ${message}`);

      // Generate HMAC SHA256 signature
      const signature = crypto
        .createHmac('sha256', this.credentials.secretKey)
        .update(message)
        .digest('hex');

      // Return in Coupang CEA format
      return `CEA algorithm=HmacSHA256, access-key=${this.credentials.accessKey}, signed-date=${datetime}, signature=${signature}`;
    } catch (error) {
      logger.error('Failed to generate HMAC signature', error);
      throw new Error('Authentication signature generation failed');
    }
  }

  /**
   * Get authorization header for API requests
   * 
   * @param method HTTP method
   * @param url Request URL
   * @returns Object containing Authorization header
   */
  getAuthorizationHeader(method: string, url: string): { Authorization: string } {
    return {
      Authorization: this.generateHmacSignature(method, url)
    };
  }

  /**
   * Update credentials (useful for credential rotation)
   * 
   * @param credentials New credentials
   */
  updateCredentials(credentials: CoupangCredentials): void {
    this.validateCredentials(credentials);
    this.credentials = credentials;
    logger.info('Credentials updated successfully');
  }

  /**
   * Validate credentials format
   * 
   * @private
   */
  private validateCredentials(credentials: CoupangCredentials): void {
    if (!credentials.accessKey || !credentials.secretKey) {
      throw new Error('Invalid credentials: accessKey and secretKey are required');
    }

    if (typeof credentials.accessKey !== 'string' || typeof credentials.secretKey !== 'string') {
      throw new Error('Invalid credentials: accessKey and secretKey must be strings');
    }

    if (credentials.accessKey.length < 10 || credentials.secretKey.length < 10) {
      throw new Error('Invalid credentials: keys appear to be too short');
    }

    logger.debug('Credentials validation passed');
  }
}