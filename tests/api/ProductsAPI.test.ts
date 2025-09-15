import { ProductsAPI } from '../../src/api/ProductsAPI';
import { CoupangAuth } from '../../src/auth/CoupangAuth';

// Mock node-fetch
jest.mock('node-fetch');
const mockFetch = require('node-fetch') as jest.MockedFunction<typeof fetch>;

describe('ProductsAPI', () => {
  let productsAPI: ProductsAPI;
  let mockAuth: CoupangAuth;

  beforeEach(() => {
    mockAuth = new CoupangAuth({
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key'
    });
    productsAPI = new ProductsAPI(mockAuth, 5000);

    // Clear all mocks
    mockFetch.mockClear();
  });

  describe('search', () => {
    it('should successfully search products', async () => {
      const mockResponse = {
        rCode: '0',
        rMessage: '',
        data: {
          landingUrl: 'https://test.com',
          productData: [
            {
              keyword: 'test',
              rank: 1,
              isRocket: false,
              isFreeShipping: false,
              productId: 123456,
              productImage: 'https://test.com/image.jpg',
              productName: 'Test Product',
              productPrice: 10000,
              productUrl: 'https://test.com/product'
            }
          ]
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
        text: jest.fn().mockResolvedValueOnce(''),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await productsAPI.search('test', {
        limit: 10,
        imageSize: '230x230'
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw error for empty keyword', async () => {
      await expect(productsAPI.search('')).rejects.toThrow('Keyword is required for product search');
      await expect(productsAPI.search('   ')).rejects.toThrow('Keyword is required for product search');
    });

    it('should handle API error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: jest.fn().mockResolvedValueOnce('Bad Request')
      } as any);

      await expect(productsAPI.search('test')).rejects.toThrow('API request failed: 400 Bad Request');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(productsAPI.search('test')).rejects.toThrow('Network error');
    });

    it('should use default options when not provided', async () => {
      const mockResponse = {
        rCode: '0',
        rMessage: '',
        data: { landingUrl: '', productData: [] }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      } as any);

      await productsAPI.search('test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('keyword=test&limit=10&imageSize=230x230&srpLinkOnly=false'),
        expect.any(Object)
      );
    });

    it('should apply custom options correctly', async () => {
      const mockResponse = {
        rCode: '0',
        rMessage: '',
        data: { landingUrl: '', productData: [] }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      } as any);

      await productsAPI.search('test keyword', {
        limit: 5,
        subId: 'test-sub-id',
        imageSize: '600x600',
        srpLinkOnly: true
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('keyword=test+keyword&limit=5&subId=test-sub-id&imageSize=600x600&srpLinkOnly=true'),
        expect.any(Object)
      );
    });
  });
});