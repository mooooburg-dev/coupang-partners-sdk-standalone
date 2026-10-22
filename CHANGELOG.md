# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.2] - 2026-08-11

### Changed
- README: added support contact, test console and blog cross-links (published to npm)

## [1.3.1] - 2026-08-11

### Fixed
- `Expected signal to be an instanceof AbortSignal` error when calling APIs such as `deeplink()` on edge runtimes (Cloudflare Workers, etc.)

### Changed
- Prefer the runtime's native `fetch` / `AbortController` (Node.js 18+, Cloudflare Workers, Deno, Bun) and fall back to `node-fetch` / `abort-controller` only when unavailable — no shim required

## [1.3.0] - 2026-07-28

### Added
- Report APIs: `getClicksReport()`, `getOrdersReport()`, `getCommissionReport()`, `getCancelsReport()`
- Client-side validation of report parameters (`yyyyMMdd` format, 30-day range)

## [1.2.5] - 2025-12-20

### Fixed
- Deeplink response type (`shortUrl` → `shortenUrl`, added `landingUrl`)

## [1.2.4] - 2025-12-20

### Fixed
- Deeplink API endpoint

## [1.2.3] - 2025-12-20

### Changed
- README deeplink API documentation

## [1.2.2] - 2025-12-20

### Added
- Deeplink API (`deeplink()`) for converting Coupang URLs into affiliate links

### Changed
- Dependency updates

## [1.2.1] - 2025-11-23

### Added
- Personalized recommendation API (`recommendation()`)

## [1.2.0] - 2025-09-15

### Added
- CoupangPL API (`coupangPL()`)
- Product search API (`searchProducts()`)
- Web test UI and example scripts

### Changed
- Improved error handling for HTML error pages and JSON parse errors
- HTTP client switched from axios to node-fetch
- README rewritten

## [1.0.0] - 2025-09-11

### Added
- Initial release of Coupang Partners SDK
- HMAC SHA256 authentication with automatic signature generation
- GoldBox API integration with full TypeScript support
- Smart caching system with 30-minute cache duration
- Advanced product filtering (category, discount, price, rating)
- Automatic retry mechanism for failed requests
- Comprehensive error handling with specific error codes
- Debug logging support
- Health check functionality
- Multiple convenience methods:
  - `getProductsByCategory()`
  - `getProductsByDiscount()`
  - `getProductsByPriceRange()`
  - `getTopRatedProducts()`
  - `getHighDiscountProducts()`
- Cache management with `clearCache()` and `getCacheInfo()`
- Runtime configuration updates with `updateConfig()`
- Complete TypeScript type definitions
- Jest testing framework with comprehensive test coverage
- ESLint and Prettier integration for code quality
- Example scripts for basic and advanced usage
- Detailed README with API documentation

### Security
- Secure credential handling with validation
- No logging of sensitive information in production

### Performance
- Efficient caching to minimize API calls
- Request deduplication and rate limiting handling
- Optimized TypeScript compilation