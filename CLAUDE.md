# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

커밋 메시지는 한글로 작성해줘. 커밋 메시지에 claude 관련 내용은 포함하지마.

## Development Commands

### Build & Development

- `npm run build` - Build the TypeScript source to `dist/` directory
- `npm run dev` - Start TypeScript compiler in watch mode for development
- `npm run example` - Run the basic usage example with ts-node

### Testing

- `npm test` - Run all tests using Jest
- `npm run test:watch` - Run tests in watch mode during development
- `npm run test:coverage` - Generate test coverage report

### Code Quality

- `npm run lint` - Run ESLint on all TypeScript files with auto-fix
- `npm run format` - Format code using Prettier

### Package Management

- `npm run prepublishOnly` - Pre-publish script that runs build and tests

## Architecture Overview

This is a Coupang Partners API SDK for Node.js/TypeScript, providing authenticated access to Coupang's affiliate product APIs.

### Core Architecture

- **CoupangPartnersClient** (`src/CoupangPartnersClient.ts`) - Main SDK entry point providing high-level methods
- **CoupangAuth** (`src/auth/CoupangAuth.ts`) - Handles HMAC SHA256 authentication with CEA algorithm format
- **GoldBoxAPI** (`src/api/GoldBoxAPI.ts`) - Implements GoldBox product retrieval with caching and filtering
- **BaseAPI** (`src/api/BaseAPI.ts`) - Abstract base class for API implementations with retry logic

### Key Components

- **Authentication**: Uses HMAC SHA256 signatures with datetime stamps in Coupang's CEA format
- **Caching**: 30-minute intelligent caching system for API responses to reduce API calls
- **Error Handling**: Comprehensive error handling for HTTP status codes (401, 429, etc.)
- **Filtering**: Client-side filtering by category, discount, price range, and ratings
- **Logging**: Structured logging system with debug mode support

### Data Flow

1. Client methods call GoldBoxAPI
2. GoldBoxAPI checks cache validity
3. If cache miss, makes authenticated API request via BaseAPI
4. Response is transformed, enhanced, and filtered
5. Results cached for future requests

### Type System

- `src/types/Config.ts` - SDK configuration and credentials interfaces
- `src/types/Product.ts` - Product data structures and API response types
- Full TypeScript support with exported types for consumers

### Testing Setup

- Jest with ts-jest preset
- Test files in `tests/` directory
- Setup file at `tests/setup.ts`
- Coverage excludes index.ts and .d.ts files

### Build Configuration

- TypeScript targeting ES2020 with CommonJS output
- Strict mode enabled with comprehensive type checking
- Source maps and declarations generated for npm package
- Output to `dist/` directory
