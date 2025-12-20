/**
 * Product search request parameters
 */
export interface ProductSearchParams {
  keyword: string;
  limit?: number;
  subId?: string;
  imageSize?: string;
  srpLinkOnly?: boolean;
}

/**
 * Product data structure from Coupang API
 */
export interface Product {
  keyword: string;
  rank: number;
  isRocket: boolean;
  isFreeShipping: boolean;
  productId: number;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}

/**
 * Product search API response structure
 */
export interface ProductSearchResponse {
  rCode: string;
  rMessage: string;
  data?: {
    landingUrl: string;
    productData: Product[];
  };
}

/**
 * Product search options for client configuration
 */
export interface ProductSearchOptions {
  limit?: number;
  subId?: string;
  imageSize?: '72x72' | '120x120' | '230x230' | '300x300' | '600x600';
  srpLinkOnly?: boolean;
}

/**
 * GoldBox API request parameters
 */
export interface GoldBoxParams {
  subId?: string;
  imageSize?: '72x72' | '120x120' | '230x230' | '300x300' | '600x600';
}

/**
 * GoldBox product data structure
 */
export interface GoldBoxProduct {
  categoryName: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  productId: number;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}

/**
 * GoldBox API response structure
 */
export interface GoldBoxResponse {
  rCode: string;
  rMessage: string;
  data?: GoldBoxProduct[];
}

/**
 * GoldBox options for client configuration
 */
export interface GoldBoxOptions {
  subId?: string;
  imageSize?: '72x72' | '120x120' | '230x230' | '300x300' | '600x600';
}

/**
 * CoupangPL API request parameters
 */
export interface CoupangPLParams {
  limit?: number;
  subId?: string;
  imageSize?: '230x230' | '300x300' | '512x512';
}

/**
 * CoupangPL product data structure
 */
export interface CoupangPLProduct {
  categoryName: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  productId: number;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}

/**
 * CoupangPL API response structure
 */
export interface CoupangPLResponse {
  rCode: string;
  rMessage: string;
  data?: CoupangPLProduct[];
}

/**
 * Personalized recommendation API request parameters
 */
export interface RecommendationParams {
  deviceId: string;
  subId?: string;
  imageSize?: '230x230' | '300x300' | '512x512';
}

/**
 * Recommendation product data structure
 */
export interface RecommendationProduct {
  isRocket: boolean;
  productId: string;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}

/**
 * Personalized recommendation API response structure
 */
export interface RecommendationResponse {
  rCode: string;
  rMessage: string;
  data?: RecommendationProduct[];
}

/**
 * Deeplink API request parameters
 */
export interface DeeplinkParams {
  coupangUrls: string[];
  subId?: string;
}

/**
 * Deeplink data structure
 */
export interface DeeplinkData {
  originalUrl: string;
  shortenUrl: string;
  landingUrl: string;
}

/**
 * Deeplink API response structure
 */
export interface DeeplinkResponse {
  rCode: string;
  rMessage: string;
  data?: DeeplinkData[];
}
