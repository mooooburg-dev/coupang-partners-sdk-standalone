# Coupang Partners SDK 🛒

[![npm version](https://badge.fury.io/js/coupang-partners-sdk-standalone.svg)](https://badge.fury.io/js/coupang-partners-sdk-standalone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

쿠팡 파트너스 API를 쉽게 사용할 수 있도록 도와주는 TypeScript/JavaScript SDK입니다.

> 🧪 **코드 없이 먼저 테스트**하고 싶다면 → [Test Console 데모](https://cp-sdk-console.vercel.app)
> 📝 **연동 방법 & 개발 후기** → [쿠팡 파트너스 API 연동기 (블로그)](https://dev.drawyourmind.com/posts/coupang-partners-api-sdk/)

## ✨ 특징

- 🔐 **자동 인증**: HMAC SHA256 CEA 서명 자동 생성
- 📘 **TypeScript 지원**: 완전한 타입 안정성 제공
- 🚀 **다양한 API 지원**: 상품검색, GoldBox, CoupangPL, 딥링크, 리포트 API
- 🛡️ **향상된 에러 핸들링**: HTTP 에러, JSON 파싱 에러 자동 처리
- 🔄 **자동 재시도**: 네트워크 오류 시 자동 재시도 로직
- 📊 **상세 로깅**: 구조화된 로깅 시스템과 디버그 모드
- 🧪 **테스트 UI**: 실시간 API 테스트를 위한 웹 인터페이스 제공

## 📦 설치

```bash
npm install coupang-partners-sdk-standalone
```

```bash
yarn add coupang-partners-sdk-standalone
```

## 🚀 빠른 시작

### 기본 설정

```typescript
import { CoupangPartnersClient } from 'coupang-partners-sdk-standalone';

const client = new CoupangPartnersClient({
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key',
});
```

### 상품 검색

```typescript
// 키워드로 상품 검색
const searchResult = await client.searchProducts('아이폰', {
  limit: 10,
  imageSize: '230x230',
});

if (searchResult.rCode === '0') {
  const products = searchResult.data?.productData || [];
  console.log(`Found ${products.length} products`);

  products.forEach(product => {
    console.log(`${product.productName} - ₩${product.productPrice.toLocaleString()}`);
  });
}
```

### GoldBox 상품 조회

```typescript
// GoldBox 특가 상품 조회
const goldboxResult = await client.goldbox({
  subId: 'my-tracking-id',
  imageSize: '300x300',
});

if (goldboxResult.rCode === '0') {
  const products = goldboxResult.data || [];
  console.log(`Found ${products.length} GoldBox products`);
}
```

### CoupangPL 상품 조회

```typescript
// CoupangPL 상품 조회
const coupangplResult = await client.coupangPL({
  limit: 50,
  imageSize: '512x512',
  subId: 'my-tracking-id',
});

if (coupangplResult.rCode === '0') {
  const products = coupangplResult.data || [];
  console.log(`Found ${products.length} CoupangPL products`);
}
```

### 딥링크(Deeplink) 생성

```typescript
// 쿠팡 URL을 파트너스 제휴 링크로 변환
const deeplinkResult = await client.deeplink({
  coupangUrls: [
    'https://www.coupang.com/vp/products/184614775',
    'https://www.coupang.com/vp/products/123456789',
  ],
  subId: 'my-tracking-id', // 선택사항
});

if (deeplinkResult.rCode === '0') {
  const links = deeplinkResult.data || [];
  links.forEach(link => {
    console.log(`Original: ${link.originalUrl}`);
    console.log(`Shortened: ${link.shortenUrl}`);
    console.log(`Landing: ${link.landingUrl}`);
  });
}
```

### 리포트 조회

일 별 클릭/주문/수익/취소 실적을 조회합니다. (일 별 실적은 매일 오후 15:00에 업데이트 됩니다)

```typescript
// 클릭 리포트
const clicksResult = await client.getClicksReport({
  startDate: '20250701', // 필수, yyyyMMdd
  endDate: '20250731', // 필수, 시작일과의 차이가 30일 이내
  subId: 'my-tracking-id', // 선택사항
  page: 0, // 선택사항, 기본값 0 (페이지당 최대 1000개)
});

if (clicksResult.rCode === '0') {
  clicksResult.data?.forEach(report => {
    console.log(`${report.date}: ${report.click} clicks`);
  });
}

// 주문 리포트 (상품 단위)
const ordersResult = await client.getOrdersReport({
  startDate: '20250701',
  endDate: '20250731',
});

// 수익(커미션) 리포트
const commissionResult = await client.getCommissionReport({
  startDate: '20250701',
  endDate: '20250731',
});

// 취소 리포트
const cancelsResult = await client.getCancelsReport({
  startDate: '20250701',
  endDate: '20250731',
});
```

## 📚 사용 예제

### 필터링과 함께 GoldBox 사용

```typescript
// 클라이언트 사이드 필터링 적용
const filteredResult = await client.goldboxWithFilters(
  {
    imageSize: '230x230',
  },
  {
    minPrice: 10000, // 최소 1만원
    maxPrice: 100000, // 최대 10만원
    categories: ['패션'], // 패션 카테고리만
    rocketOnly: true, // 로켓배송만
    freeShippingOnly: false, // 무료배송 조건 없음
  }
);
```

### 고급 설정 옵션

```typescript
const client = new CoupangPartnersClient(
  {
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key',
  },
  {
    timeout: 15000, // 15초 타임아웃
    debug: true, // 디버그 모드 활성화
  }
);
```

### 설정 업데이트

```typescript
// 런타임에서 설정 변경
client.updateConfig({
  timeout: 20000,
  debug: false,
});

// 새 API 키로 업데이트
client.updateConfig({
  credentials: {
    accessKey: 'new-access-key',
    secretKey: 'new-secret-key',
  },
});
```

## 🧪 테스트 UI

SDK와 함께 제공되는 테스트 UI를 사용하여 실시간으로 API를 테스트할 수 있습니다.

### 테스트 UI 실행

```bash
# 테스트 프로젝트 클론 및 설정
git clone https://github.com/mooooburg-dev/coupang-partners-sdk-standalone.git
cd using-cp-sdk-test

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 실제 API 키 입력

# 개발 서버 실행
npm run dev
```

테스트 UI 기능:

- **3개 API 테스트**: 상품검색, GoldBox, CoupangPL
- **실시간 파라미터 조정**: 키워드, 결과 수, 이미지 크기 등
- **응답 데이터 시각화**: 상품 카드, 가격, 배송 옵션 표시
- **에러 처리**: 상세한 에러 메시지 및 처리 상태

## 📝 API 레퍼런스

### CoupangPartnersClient

#### Constructor

```typescript
new CoupangPartnersClient(credentials, config?)
```

**Parameters:**

- `credentials`: `CoupangCredentials` - API 인증 정보
- `config?`: `Partial<SDKConfig>` - 옵션 설정

#### Methods

| Method                 | Description                 | Parameters                                        | Returns                          |
| ---------------------- | --------------------------- | ------------------------------------------------- | -------------------------------- |
| `searchProducts()`     | 키워드 상품 검색            | `keyword: string, options?: ProductSearchOptions` | `Promise<ProductSearchResponse>` |
| `goldbox()`            | GoldBox 상품 조회           | `params?: GoldBoxParams`                          | `Promise<GoldBoxResponse>`       |
| `goldboxWithFilters()` | 필터링된 GoldBox 조회       | `params?: GoldBoxParams, filters?: FilterOptions` | `Promise<GoldBoxResponse>`       |
| `coupangPL()`          | CoupangPL 상품 조회         | `params?: CoupangPLParams`                        | `Promise<CoupangPLResponse>`     |
| `deeplink()`           | 딥링크 생성 (URL 변환)      | `params: DeeplinkParams`                          | `Promise<DeeplinkResponse>`      |
| `getClicksReport()`    | 일 별 클릭 리포트 조회      | `params: ReportParams`                            | `Promise<ClickReportResponse>`   |
| `getOrdersReport()`    | 일 별 주문 리포트 조회      | `params: ReportParams`                            | `Promise<OrderReportResponse>`   |
| `getCommissionReport()` | 일 별 수익 리포트 조회     | `params: ReportParams`                            | `Promise<CommissionReportResponse>` |
| `getCancelsReport()`   | 일 별 취소 리포트 조회      | `params: ReportParams`                            | `Promise<CancelReportResponse>`  |
| `generateSignature()`  | HMAC 서명 생성              | `method: string, url: string`                     | `string`                         |
| `updateConfig()`       | 설정 업데이트               | `config: Partial<SDKConfig>`                      | `void`                           |
| `getConfig()`          | 현재 설정 조회              | -                                                 | `Omit<SDKConfig, 'credentials'>` |
| `healthCheck()`        | 헬스 체크                   | -                                                 | `boolean`                        |

### 타입 정의

#### Product (검색)

```typescript
interface Product {
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
```

#### GoldBoxProduct

```typescript
interface GoldBoxProduct {
  categoryName: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  productId: number;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}
```

#### CoupangPLProduct

```typescript
interface CoupangPLProduct {
  categoryName: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  productId: number;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}
```

#### DeeplinkData

```typescript
interface DeeplinkData {
  originalUrl: string; // 원본 쿠팡 URL
  shortenUrl: string; // 단축된 제휴 링크
  landingUrl: string; // 랜딩 페이지 URL
}
```

#### DeeplinkParams

```typescript
interface DeeplinkParams {
  coupangUrls: string[]; // 변환할 쿠팡 URL 배열
  subId?: string; // 추적용 서브 ID (선택사항)
}
```

#### ReportParams (리포트 공통)

```typescript
interface ReportParams {
  startDate: string; // 필수, 시작일 (yyyyMMdd, 20181101 이상)
  endDate: string; // 필수, 종료일 (yyyyMMdd, 시작일과의 차이가 30일 이내)
  subId?: string; // 채널 아이디 (선택사항)
  page?: number; // 페이지 번호, 기본값 0 (페이지당 최대 1000개)
}
```

#### ClickReportData

```typescript
interface ClickReportData {
  date: string; // 일자 (yyyyMMdd)
  trackingCode: string;
  subId: string;
  addtag: string;
  ctag: string;
  click: number; // 클릭 수
}
```

#### OrderReportData

```typescript
interface OrderReportData {
  date: string; // 일자 (yyyyMMdd)
  trackingCode: string;
  subId: string;
  addtag: string;
  ctag: string;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number; // 수량
  gmv: number; // 거래액
  commissionRate: number; // 수수료율
  commission: number; // 수수료
  categoryName: string;
}
```

#### CommissionReportData

```typescript
interface CommissionReportData {
  date: string; // 일자 (yyyyMMdd)
  trackingCode: string;
  subId: string;
  commission: number; // 수수료
  click: number; // 클릭 수
  order: number; // 주문 수
  cancel: number; // 취소 수
  gmv: number; // 거래액
}
```

#### CancelReportData

```typescript
// 주문 리포트 필드 + 주문일
interface CancelReportData extends OrderReportData {
  orderDate: string; // 주문일 (yyyyMMdd)
}
```

#### API 응답 형식

```typescript
interface ApiResponse {
  rCode: string; // "0": 성공, 기타: 에러
  rMessage: string; // 응답 메시지
  data?: Product[]; // 상품 데이터 (API별로 다름)
}
```

#### 설정 옵션

```typescript
interface SDKConfig {
  credentials: CoupangCredentials;
  timeout?: number; // 기본값: 10000ms
  debug?: boolean; // 기본값: false
}

interface CoupangCredentials {
  accessKey: string;
  secretKey: string;
}
```

## 🔧 에러 처리

SDK는 다양한 에러 상황을 자동으로 처리합니다:

```typescript
try {
  const result = await client.searchProducts('키워드');
} catch (error) {
  if (error.message.includes('401')) {
    console.error('인증 실패: API 키를 확인하세요');
  } else if (error.message.includes('429')) {
    console.error('요청 한도 초과: 잠시 후 다시 시도하세요');
  } else if (error.message.includes('HTML error page')) {
    console.error('API 서버 오류: 서비스 점검 중일 수 있습니다');
  } else {
    console.error('알 수 없는 오류:', error.message);
  }
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

# CoupangPL API 테스트
npx ts-node examples/test-coupangpl.ts

# GoldBox API 테스트
npx ts-node examples/goldbox-api-test.ts
```

## 🛠️ 개발 명령어

```bash
# 개발 모드 (watch)
npm run dev

# TypeScript 컴파일
npm run build

# 코드 검사
npm run lint

# 코드 포맷팅
npm run format

# 패키지 준비
npm run prepublishOnly
```

## 📋 요구사항

- Node.js 16+
- TypeScript 4.5+ (개발 시)
- Coupang Partners API 인증 키

## 🔄 버전 히스토리

### v1.3.1

- 🐛 Cloudflare Workers 등 엣지 런타임에서 `deeplink()` 등 API 호출 시 발생하던 `Expected signal to be an instanceof AbortSignal` 에러 수정
- ⚡ 런타임에 네이티브 `fetch` / `AbortController`가 있으면(Node.js 18+, Cloudflare Workers, Deno, Bun 등) 이를 우선 사용하고, 없을 때만 `node-fetch` / `abort-controller`로 폴백 (별도 shim 불필요)

### v1.3.0

- ✨ 리포트 API 4종 추가 (클릭/주문/수익/취소)
  - `getClicksReport()` - 일 별 클릭 리포트
  - `getOrdersReport()` - 일 별 주문 리포트 (상품 단위)
  - `getCommissionReport()` - 일 별 수익 리포트
  - `getCancelsReport()` - 일 별 취소 리포트
- 🛡️ 리포트 파라미터 클라이언트 측 검증 (yyyyMMdd 형식, 30일 범위)

### v1.2.5

- 🔧 딥링크 API 응답 타입 수정 (shortUrl → shortenUrl, landingUrl 추가)
- 📚 README 타입 정의 및 예제 코드 업데이트

### v1.2.4

- 🐛 딥링크 API 엔드포인트 수정
- 🔧 README 타입 정의 수정 (shortenUrl → shortUrl)

### v1.2.3

- 📚 README 딥링크 API 문서 업데이트

### v1.2.2

- ✨ 딥링크(Deeplink) API 추가
- 🐛 버그 수정 및 안정성 개선

### v1.2.0

- ✨ CoupangPL API 추가
- 🛡️ 향상된 에러 처리 (HTML 응답, JSON 파싱 에러)
- 🧪 테스트 UI 제공
- 📚 README 전면 개편
- 📄 예제 파일 추가

### v1.0.0

- ✨ 상품 검색 API 지원
- ✨ GoldBox API 지원
- 📘 완전한 TypeScript 지원
- 🔐 HMAC SHA256 CEA 인증

## 📞 지원

- 🐛 버그 리포트: [GitHub Issues](https://github.com/mooooburg-dev/coupang-partners-sdk-standalone/issues)
- 💡 기능 요청: [GitHub Discussions](https://github.com/mooooburg-dev/coupang-partners-sdk-standalone/discussions)
- 📧 문의: mooooburg.dev@gmail.com

## 📜 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

---

<div align="center">
  <p>Made with ❤️ by mooooburg-dev</p>
  <p>
    <a href="https://github.com/mooooburg-dev/coupang-partners-sdk-standalone">⭐ Star on GitHub</a> |
    <a href="https://www.npmjs.com/package/coupang-partners-sdk-standalone">📦 NPM Package</a> |
    <a href="https://cp-sdk-console.vercel.app">🧪 Test Console</a> |
    <a href="https://dev.drawyourmind.com/posts/coupang-partners-api-sdk/">📝 Blog</a>
  </p>
</div>
