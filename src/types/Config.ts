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
  /** 요청 타임아웃 (밀리초, 기본값: 10000) */
  timeout?: number;
  /** 디버그 모드 (기본값: false) */
  debug?: boolean;
}
