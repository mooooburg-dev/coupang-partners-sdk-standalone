/**
 * Coupang Partners API Product Types
 */

export interface Product {
  /** 상품명 */
  productName: string;
  /** 현재 판매가 */
  productPrice: number;
  /** 상품 이미지 URL */
  productImage: string;
  /** 상품 링크 URL */
  productUrl: string;
  /** 원가 (할인 전 가격) */
  originalPrice?: number | null;
  /** 할인율 (%) */
  discount?: number | null;
  /** 카테고리명 */
  category?: string | null;
  /** 멤버십 혜택 여부 */
  isMembership?: boolean | null;
  /** 삼성카드 할인 여부 */
  isSamsungCard?: boolean | null;
  /** 특별 노트 (예: 신선과일, 프리미엄) */
  specialNote?: string | null;
  /** 추가 할인율 (%) */
  additionalDiscount?: number | null;
  /** 구매 가능 여부 */
  isAvailable?: boolean;
  /** 상품 평점 (0-5) */
  rating?: number | null;
  /** 리뷰 수 */
  reviewCount?: number | null;
  /** 마지막 업데이트 시간 */
  lastUpdated: string;
}

export interface GoldBoxResponse {
  /** 상품 데이터 배열 */
  data: any[];
  /** 응답 상태 코드 */
  statusCode?: string;
  /** 응답 메시지 */
  message?: string;
}

export interface ProductSearchOptions {
  /** 카테고리 필터 */
  category?: string;
  /** 최소 할인율 (%) */
  minDiscount?: number;
  /** 최대 가격 */
  maxPrice?: number;
  /** 최소 가격 */
  minPrice?: number;
  /** 결과 개수 제한 */
  limit?: number;
  /** 평점 필터 (이상) */
  minRating?: number;
}

export interface ApiError extends Error {
  /** HTTP 상태 코드 */
  statusCode?: number;
  /** API 응답 코드 */
  code?: string;
  /** 상세 오류 정보 */
  details?: any;
}