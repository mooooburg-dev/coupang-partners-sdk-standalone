/**
 * Jest setup file for Coupang Partners SDK tests
 */

// Set test timeout
jest.setTimeout(10000);

// Mock console.log for cleaner test output
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'debug').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});