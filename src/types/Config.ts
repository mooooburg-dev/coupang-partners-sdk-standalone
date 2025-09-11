/**
 * Coupang Partners SDK Configuration Types
 */

export interface CoupangCredentials {
  /** Coupang Partners Access Key */
  accessKey: string;
  /** Coupang Partners Secret Key */
  secretKey: string;
}

export interface SDKConfig {
  /** API 인증 정보 */
  credentials: CoupangCredentials;
  /** API 기본 URL (기본값: https://api-gateway.coupang.com) */
  baseUrl?: string;
  /** 요청 타임아웃 (밀리초, 기본값: 10000) */
  timeout?: number;
  /** 캐시 유지 시간 (밀리초, 기본값: 1800000 = 30분) */
  cacheDuration?: number;
  /** 자동 재시도 횟수 (기본값: 3) */
  retryAttempts?: number;
  /** 재시도 간격 (밀리초, 기본값: 1000) */
  retryDelay?: number;
  /** 디버그 모드 (기본값: false) */
  debug?: boolean;
}

export interface RequestConfig {
  /** HTTP 메서드 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 요청 URL */
  url: string;
  /** 요청 헤더 */
  headers?: Record<string, string>;
  /** 요청 바디 */
  data?: any;
  /** 쿼리 파라미터 */
  params?: Record<string, any>;
}
