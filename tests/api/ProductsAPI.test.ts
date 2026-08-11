import { ProductsAPI } from '../../src/api/ProductsAPI';
import { CoupangAuth } from '../../src/auth/CoupangAuth';
import { GoldBoxResponse } from '../../src/types/Product';

// Mock the native global fetch (used by BaseAPI on Node 18+ / edge runtimes)
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

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
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockResponse)),
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
        json: jest.fn().mockResolvedValueOnce(mockResponse),
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockResponse))
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
        json: jest.fn().mockResolvedValueOnce(mockResponse),
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockResponse))
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

  describe('goldbox', () => {
    const mockGoldBoxResponse: GoldBoxResponse = {
      rCode: '0',
      rMessage: 'Successfully get products',
      data: [
        {
          categoryName: 'Fashion',
          isRocket: true,
          isFreeShipping: false,
          productId: 12345,
          productImage: 'https://example.com/image.jpg',
          productName: 'Test Product',
          productPrice: 29900,
          productUrl: 'https://example.com/product/12345',
        }
      ]
    };

    it('should get GoldBox products successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockGoldBoxResponse),
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockGoldBoxResponse)),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await productsAPI.goldbox();

      expect(result).toEqual(mockGoldBoxResponse);
      expect(result.rCode).toBe('0');
      expect(result.data).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should include subId in request when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockGoldBoxResponse),
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockGoldBoxResponse))
      } as any);

      await productsAPI.goldbox({ subId: 'test-sub-id' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('subId=test-sub-id'),
        expect.any(Object)
      );
    });

    it('should include imageSize in request when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockGoldBoxResponse),
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockGoldBoxResponse))
      } as any);

      await productsAPI.goldbox({ imageSize: '230x230' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('imageSize=230x230'),
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: jest.fn().mockResolvedValueOnce('Unauthorized')
      } as any);

      await expect(productsAPI.goldbox()).rejects.toThrow('API request failed: 401 Unauthorized');
    });
  });

  describe('goldboxWithFilters', () => {
    const mockGoldBoxResponse: GoldBoxResponse = {
      rCode: '0',
      rMessage: 'Successfully get products',
      data: [
        {
          categoryName: 'Fashion',
          isRocket: true,
          isFreeShipping: false,
          productId: 12345,
          productImage: 'https://example.com/image.jpg',
          productName: 'Test Product',
          productPrice: 29900,
          productUrl: 'https://example.com/product/12345',
        },
        {
          categoryName: 'Electronics',
          isRocket: false,
          isFreeShipping: true,
          productId: 67890,
          productImage: 'https://example.com/image2.jpg',
          productName: 'Another Product',
          productPrice: 59900,
          productUrl: 'https://example.com/product/67890',
        }
      ]
    };

    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockGoldBoxResponse),
        text: jest.fn().mockResolvedValue(JSON.stringify(mockGoldBoxResponse)),
        status: 200,
        statusText: 'OK'
      } as any);
    });

    it('should return unfiltered products when no filters provided', async () => {
      const result = await productsAPI.goldboxWithFilters();

      expect(result).toEqual(mockGoldBoxResponse);
      expect(result.data).toHaveLength(2);
    });

    it('should filter by minimum price', async () => {
      const result = await productsAPI.goldboxWithFilters({}, {
        minPrice: 50000,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data![0].productPrice).toBe(59900);
    });

    it('should filter by categories', async () => {
      const result = await productsAPI.goldboxWithFilters({}, {
        categories: ['Fashion'],
      });

      expect(result.data).toHaveLength(1);
      expect(result.data![0].categoryName).toBe('Fashion');
    });

    it('should filter by rocket only', async () => {
      const result = await productsAPI.goldboxWithFilters({}, {
        rocketOnly: true,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data![0].isRocket).toBe(true);
    });

    it('should apply multiple filters', async () => {
      const result = await productsAPI.goldboxWithFilters({}, {
        categories: ['Electronics'],
        freeShippingOnly: true,
        minPrice: 50000,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data![0].categoryName).toBe('Electronics');
      expect(result.data![0].isFreeShipping).toBe(true);
      expect(result.data![0].productPrice).toBe(59900);
    });

    it('should return empty array when no products match filters', async () => {
      const result = await productsAPI.goldboxWithFilters({}, {
        minPrice: 100000,
      });

      expect(result.data).toHaveLength(0);
    });
  });
});