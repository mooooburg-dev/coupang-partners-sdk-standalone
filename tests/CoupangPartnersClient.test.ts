import { CoupangPartnersClient } from '../src/CoupangPartnersClient';

// Mock dependencies
jest.mock('../src/api/ProductsAPI');
jest.mock('node-fetch');

describe('CoupangPartnersClient', () => {
  const mockCredentials = {
    accessKey: 'test-access-key',
    secretKey: 'test-secret-key'
  };

  let client: CoupangPartnersClient;

  beforeEach(() => {
    client = new CoupangPartnersClient(mockCredentials, { debug: true });
  });

  describe('constructor', () => {
    it('should initialize with valid credentials', () => {
      expect(client).toBeInstanceOf(CoupangPartnersClient);
      expect(client.healthCheck()).toBe(true);
    });

    it('should merge config with defaults', () => {
      const customClient = new CoupangPartnersClient(mockCredentials, {
        timeout: 15000,
        debug: false
      });

      const config = customClient.getConfig();
      expect(config.timeout).toBe(15000);
      expect(config.debug).toBe(false);
    });
  });

  describe('generateSignature', () => {
    it('should generate HMAC signature', () => {
      const signature = client.generateSignature('GET', '/test/path');
      expect(signature).toMatch(/^CEA algorithm=HmacSHA256/);
      expect(signature).toContain('access-key=test-access-key');
      expect(signature).toContain('signed-date=');
      expect(signature).toContain('signature=');
    });
  });

  describe('updateConfig', () => {
    it('should update configuration', () => {
      client.updateConfig({
        timeout: 20000,
        debug: false
      });

      const config = client.getConfig();
      expect(config.timeout).toBe(20000);
      expect(config.debug).toBe(false);
    });

    it('should update credentials', () => {
      const newCredentials = {
        accessKey: 'new-access-key',
        secretKey: 'new-secret-key'
      };

      client.updateConfig({ credentials: newCredentials });
      expect(client.healthCheck()).toBe(true);
    });
  });

  describe('getConfig', () => {
    it('should return config without credentials', () => {
      const config = client.getConfig();
      expect(config).toHaveProperty('timeout');
      expect(config).toHaveProperty('debug');
      expect(config).not.toHaveProperty('credentials');
    });
  });

  describe('getVersion', () => {
    it('should return version string', () => {
      expect(client.getVersion()).toBe('1.3.0');
    });
  });

  describe('healthCheck', () => {
    it('should return true for valid credentials', () => {
      expect(client.healthCheck()).toBe(true);
    });

    it('should return false for missing credentials', () => {
      try {
        const invalidClient = new CoupangPartnersClient({
          accessKey: '',
          secretKey: ''
        });
        expect(invalidClient.healthCheck()).toBe(false);
      } catch (error) {
        // Expected to throw error for invalid credentials
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Invalid credentials');
      }
    });
  });

  describe('searchProducts', () => {
    it('should call ProductsAPI search method', async () => {
      const mockSearchResponse = {
        rCode: '0',
        rMessage: '',
        data: {
          landingUrl: 'https://test.com',
          productData: []
        }
      };

      // Mock the ProductsAPI
      const mockSearch = jest.fn().mockResolvedValue(mockSearchResponse);
      (client as any).productsAPI.search = mockSearch;

      const result = await client.searchProducts('test', { limit: 5 });

      expect(mockSearch).toHaveBeenCalledWith('test', { limit: 5 });
      expect(result).toEqual(mockSearchResponse);
    });
  });
});