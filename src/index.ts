/**
 * Coupang Partners API SDK
 * 
 * @author Coupang Partners SDK Team
 * @version 1.0.0
 * @license MIT
 */

// Main client export
export { CoupangPartnersClient } from './CoupangPartnersClient';

// Authentication exports
export { CoupangAuth } from './auth/CoupangAuth';

// API exports
export { GoldBoxAPI } from './api/GoldBoxAPI';

// Type exports
export type { 
  CoupangCredentials, 
  SDKConfig, 
  RequestConfig 
} from './types/Config';

export type { 
  Product, 
  GoldBoxResponse, 
  ProductSearchOptions, 
  ApiError 
} from './types/Product';

// Utility exports
export { Logger, LogLevel } from './utils/Logger';

// Default export
export { CoupangPartnersClient as default } from './CoupangPartnersClient';