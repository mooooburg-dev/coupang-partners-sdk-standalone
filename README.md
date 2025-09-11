# Coupang Partners SDK 🛒

[![npm version](https://badge.fury.io/js/%40coupang-partners%2Fsdk.svg)](https://badge.fury.io/js/%40coupang-partners%2Fsdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

쿠팡 파트너스 API를 쉽게 사용할 수 있도록 도와주는 공식 TypeScript/JavaScript SDK입니다.

## ✨ 특징

- 🔐 **자동 인증**: HMAC SHA256 서명 자동 생성
- 📘 **TypeScript 지원**: 완전한 타입 안정성 제공
- 🚀 **스마트 캐싱**: 30분 캐시로 API 호출 최적화
- 🛡️ **에러 핸들링**: 401, 429 등 상태코드별 자동 처리
- 🔍 **고급 필터링**: 카테고리, 할인율, 가격별 필터링 지원
- 🔄 **자동 재시도**: 네트워크 오류 시 자동 재시도
- 📊 **상세 로깅**: 디버그 모드 지원

## 📦 설치

```bash
npm install @coupang-partners/sdk
```

```bash
yarn add @coupang-partners/sdk
```

## 🚀 빠른 시작

### 기본 설정

```typescript
import { CoupangPartnersClient } from '@coupang-partners/sdk';

const client = new CoupangPartnersClient({
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key'
});
```

### GoldBox 상품 조회

```typescript
// 모든 GoldBox 상품 조회
const products = await client.getGoldBoxProducts();
console.log(`Found ${products.length} products`);

// 첫 번째 상품 정보
if (products.length > 0) {
  const product = products[0];
  console.log(`${product.productName} - ${product.productPrice}원`);
}
```

## 📚 사용 예제

### 필터링 옵션

```typescript
// 복합 조건으로 상품 검색
const filteredProducts = await client.getGoldBoxProducts({
  category: '전자제품',        // 카테고리 필터
  minDiscount: 30,            // 최소 30% 할인
  maxPrice: 100000,           // 최대 10만원
  minRating: 4.0,             // 최소 평점 4.0
  limit: 20                   // 최대 20개 결과
});
```

### 카테고리별 조회

```typescript
// 과일 카테고리 상품
const fruits = await client.getProductsByCategory('과일');

// 전자제품 카테고리 상품
const electronics = await client.getProductsByCategory('전자제품');
```

### 할인 상품 조회

```typescript
// 50% 이상 할인 상품 (상위 10개)
const deals = await client.getHighDiscountProducts(50, 10);

// 특정 할인율 이상 상품
const discounted = await client.getProductsByDiscount(30);
```

### 가격대별 조회

```typescript
// 1만원~5만원 사이 상품
const affordable = await client.getProductsByPriceRange(10000, 50000);
```

### 평점 높은 상품

```typescript
// 평점 4.5 이상 상품 (상위 15개)
const topRated = await client.getTopRatedProducts(4.5, 15);
```

## 🛠️ 고급 사용법

### 설정 옵션

```typescript
const client = new CoupangPartnersClient({
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key'
}, {
  baseUrl: 'https://api-gateway.coupang.com',  // API 기본 URL
  timeout: 15000,                              // 요청 타임아웃 (15초)
  cacheDuration: 30 * 60 * 1000,              // 캐시 유지시간 (30분)
  retryAttempts: 3,                            // 재시도 횟수
  retryDelay: 1000,                            // 재시도 간격 (1초)
  debug: true                                  // 디버그 모드
});
```

### 캐시 관리

```typescript
// 캐시 정보 확인
const cacheInfo = client.getCacheInfo();
console.log(`Cache size: ${cacheInfo.size} products`);
console.log(`Last update: ${cacheInfo.lastUpdate}`);
console.log(`Is valid: ${cacheInfo.isValid}`);

// 캐시 삭제 (강제로 새 데이터 가져오기)
client.clearCache();
```

### 헬스 체크

```typescript
// SDK 상태 확인
const isHealthy = await client.healthCheck();
if (isHealthy) {
  console.log('✅ SDK is ready to use');
} else {
  console.log('❌ Please check your credentials');
}
```

### 설정 업데이트

```typescript
// 런타임에서 설정 변경
client.updateConfig({
  timeout: 20000,
  debug: false
});
```

## 📝 API 레퍼런스

### CoupangPartnersClient

#### Constructor
```typescript
new CoupangPartnersClient(credentials, config?)
```

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getGoldBoxProducts()` | GoldBox 상품 조회 | `options?` | `Promise<Product[]>` |
| `getProductsByCategory()` | 카테고리별 상품 조회 | `category: string` | `Promise<Product[]>` |
| `getProductsByDiscount()` | 할인율별 상품 조회 | `minDiscount: number` | `Promise<Product[]>` |
| `getProductsByPriceRange()` | 가격대별 상품 조회 | `minPrice: number, maxPrice: number` | `Promise<Product[]>` |
| `getTopRatedProducts()` | 고평점 상품 조회 | `minRating?: number, limit?: number` | `Promise<Product[]>` |
| `getHighDiscountProducts()` | 고할인 상품 조회 | `minDiscount?: number, limit?: number` | `Promise<Product[]>` |
| `clearCache()` | 캐시 삭제 | - | `void` |
| `getCacheInfo()` | 캐시 정보 조회 | - | `CacheInfo` |
| `healthCheck()` | 헬스 체크 | - | `Promise<boolean>` |

### Product 타입

```typescript
interface Product {
  productName: string;        // 상품명
  productPrice: number;       // 현재 판매가
  productImage: string;       // 상품 이미지 URL
  productUrl: string;         // 상품 링크 URL
  originalPrice?: number;     // 원가 (할인 전 가격)
  discount?: number;          // 할인율 (%)
  category?: string;          // 카테고리명
  isMembership?: boolean;     // 멤버십 혜택 여부
  isSamsungCard?: boolean;    // 삼성카드 할인 여부
  specialNote?: string;       // 특별 노트
  additionalDiscount?: number; // 추가 할인율 (%)
  isAvailable?: boolean;      // 구매 가능 여부
  rating?: number;            // 상품 평점 (0-5)
  reviewCount?: number;       // 리뷰 수
  lastUpdated: string;        // 마지막 업데이트 시간
}
```

### SearchOptions 타입

```typescript
interface ProductSearchOptions {
  category?: string;      // 카테고리 필터
  minDiscount?: number;   // 최소 할인율 (%)
  maxPrice?: number;      // 최대 가격
  minPrice?: number;      // 최소 가격
  limit?: number;         // 결과 개수 제한
  minRating?: number;     // 평점 필터 (이상)
}
```

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

## 📄 예제 실행

```bash
# 기본 사용 예제
npm run example

# 고급 필터링 예제 (별도로 실행)
npx ts-node examples/advanced-filtering.ts
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새 기능 브랜치를 만듭니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📞 지원

- 🐛 버그 리포트: [GitHub Issues](https://github.com/coupang-partners/coupang-partners-sdk/issues)
- 💡 기능 요청: [GitHub Discussions](https://github.com/coupang-partners/coupang-partners-sdk/discussions)
- 📧 문의: sdk@coupang.com

## 📜 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

---

<div align="center">
  <p>Made with ❤️ by Coupang Partners SDK Team</p>
  <p>
    <a href="https://github.com/coupang-partners/coupang-partners-sdk">⭐ Star on GitHub</a> |
    <a href="https://www.npmjs.com/package/@coupang-partners/sdk">📦 NPM Package</a>
  </p>
</div>