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
