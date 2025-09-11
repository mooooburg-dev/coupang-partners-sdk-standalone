# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-11

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