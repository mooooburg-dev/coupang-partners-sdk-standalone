/**
 * Coupang Partners API SDK
 *
 * @author mooooburg-dev
 * @version 1.0.0
 * @license MIT
 */

// Main client export
export { CoupangPartnersClient } from './CoupangPartnersClient';

// Authentication exports
export { CoupangAuth } from './auth/CoupangAuth';

// Type exports
export type { CoupangCredentials, SDKConfig } from './types/Config';
export type {
  Product,
  ProductSearchParams,
  ProductSearchResponse,
  ProductSearchOptions,
  GoldBoxProduct,
  GoldBoxParams,
  GoldBoxResponse,
  GoldBoxOptions,
  CoupangPLProduct,
  CoupangPLParams,
  CoupangPLResponse,
  RecommendationProduct,
  RecommendationParams,
  RecommendationResponse,
} from './types/Product';

// Utility exports
export { Logger, LogLevel } from './utils/Logger';

// Default export
export { CoupangPartnersClient as default } from './CoupangPartnersClient';
