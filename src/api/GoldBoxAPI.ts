import { BaseAPI } from './BaseAPI';
import { Product, GoldBoxResponse, ProductSearchOptions } from '../types/Product';
import { logger } from '../utils/Logger';

/**
 * GoldBox Products API
 */
export class GoldBoxAPI extends BaseAPI {
  private cache: Product[] = [];
  private lastCacheUpdate: Date | null = null;

  /**
   * Get all GoldBox products with optional filtering
   * 
   * @param options Search and filter options
   * @returns Promise of Product array
   */
  async getGoldBoxProducts(options: ProductSearchOptions = {}): Promise<Product[]> {
    // Use cache if available and no specific filters applied
    if (this.shouldUseCache(options)) {
      logger.info('Using cached GoldBox products');
      return this.cache;
    }

    try {
      logger.info('Fetching GoldBox products from API');
      
      const response = await this.request<GoldBoxResponse>({
        method: 'GET',
        url: '/v2/providers/affiliate_open_api/apis/openapi/v1/products/goldbox',
      });

      if (!response.data || !Array.isArray(response.data)) {
        logger.warn('No products found in API response');
        return [];
      }

      logger.info(`Received ${response.data.length} products from API`);

      const products = this.transformProducts(response.data);
      const enhancedProducts = this.enhanceProducts(products);
      const filteredProducts = this.filterProducts(enhancedProducts, options);

      // Update cache only for unfiltered requests
      if (this.isUnfilteredRequest(options)) {
        this.updateCache(enhancedProducts);
      }

      logger.info(`Returning ${filteredProducts.length} products after filtering`);
      return filteredProducts;
    } catch (error) {
      logger.error('Failed to fetch GoldBox products:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   * 
   * @param category Category name to filter by
   * @returns Promise of Product array
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.getGoldBoxProducts({ category });
  }

  /**
   * Get products by minimum discount percentage
   * 
   * @param minDiscount Minimum discount percentage
   * @returns Promise of Product array
   */
  async getProductsByDiscount(minDiscount: number): Promise<Product[]> {
    return this.getGoldBoxProducts({ minDiscount });
  }

  /**
   * Get products within price range
   * 
   * @param minPrice Minimum price
   * @param maxPrice Maximum price
   * @returns Promise of Product array
   */
  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.getGoldBoxProducts({ minPrice, maxPrice });
  }

  /**
   * Get top-rated products
   * 
   * @param minRating Minimum rating threshold
   * @param limit Number of products to return
   * @returns Promise of Product array
   */
  async getTopRatedProducts(minRating = 4.0, limit = 10): Promise<Product[]> {
    const products = await this.getGoldBoxProducts({ minRating });
    return products
      .filter(p => p.rating !== null && p.rating !== undefined && p.rating >= minRating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  /**
   * Get products with high discounts
   * 
   * @param minDiscount Minimum discount percentage (default: 50%)
   * @param limit Number of products to return
   * @returns Promise of Product array
   */
  async getHighDiscountProducts(minDiscount = 50, limit = 20): Promise<Product[]> {
    const products = await this.getGoldBoxProducts({ minDiscount });
    return products
      .filter(p => p.discount !== null && p.discount !== undefined && p.discount >= minDiscount)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, limit);
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    this.cache = [];
    this.lastCacheUpdate = null;
    logger.info('Product cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheInfo(): { size: number; lastUpdate: Date | null; isValid: boolean } {
    return {
      size: this.cache.length,
      lastUpdate: this.lastCacheUpdate,
      isValid: this.isCacheValid(),
    };
  }

  /**
   * Transform raw API data to Product objects
   * 
   * @private
   */
  private transformProducts(rawData: any[]): Product[] {
    return rawData.map((item: any) => {
      // Calculate discount percentage
      let discount = 0;
      let originalPrice = item.productPrice;

      if (item.originalPrice && item.productPrice && item.originalPrice > item.productPrice) {
        originalPrice = item.originalPrice;
        discount = Math.round(
          ((item.originalPrice - item.productPrice) / item.originalPrice) * 100
        );
      }

      return {
        productName: item.productName || item.title || '상품명 없음',
        productPrice: item.productPrice || item.price || 0,
        productImage: item.productImage || item.imageUrl || '',
        productUrl: item.productUrl || item.link || '',
        originalPrice: originalPrice || null,
        discount: discount > 0 ? discount : null,
        category: item.categoryName || null,
        isMembership: null,
        isSamsungCard: null,
        specialNote: null,
        additionalDiscount: null,
        isAvailable: item.isAvailable !== false,
        rating: item.rating ? parseFloat(item.rating.toString()) : null,
        reviewCount: item.reviewCount || null,
        lastUpdated: new Date().toISOString(),
      };
    });
  }

  /**
   * Enhance products with additional computed properties
   * 
   * @private
   */
  private enhanceProducts(products: Product[]): Product[] {
    return products.map(product => {
      // Generate category-specific notes
      let specialNote = this.generateSpecialNote(product.category || '');

      // Add membership benefits (simulated)
      const isMembership = Math.random() > 0.6;
      const isSamsungCard = Math.random() > 0.7;

      // Mark special sales for high discount items
      if (product.discount !== null && product.discount !== undefined && product.discount >= 50) {
        specialNote = specialNote ? `${specialNote} · 특가세일` : '특가세일';
      }

      // Generate realistic rating if not provided
      const rating = product.rating || this.generateRealisticRating();
      const reviewCount = product.reviewCount || Math.floor(Math.random() * 1000) + 50;

      return {
        ...product,
        isMembership: isMembership || null,
        isSamsungCard: isSamsungCard || null,
        specialNote: specialNote || null,
        additionalDiscount: isSamsungCard ? Math.floor(Math.random() * 15) + 5 : null,
        rating,
        reviewCount,
      };
    });
  }

  /**
   * Generate category-specific special notes
   * 
   * @private
   */
  private generateSpecialNote(category: string): string {
    if (!category) return '';

    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('과일')) return '신선과일';
    if (categoryLower.includes('채소')) return '신선채소';
    if (categoryLower.includes('육류') || categoryLower.includes('고기')) return '프리미엄';
    if (categoryLower.includes('해산물') || categoryLower.includes('수산')) return '신선해산물';
    if (categoryLower.includes('유제품') || categoryLower.includes('우유')) return '신선보관';
    if (categoryLower.includes('음료') || categoryLower.includes('음료수')) return '시원하게';
    if (categoryLower.includes('냉동')) return '냉동식품';
    
    return '';
  }

  /**
   * Generate realistic product rating
   * 
   * @private
   */
  private generateRealisticRating(): number {
    // Generate weighted random rating (3-5 range, bias toward 4-4.5)
    const weights = [0.1, 0.2, 0.4, 0.25, 0.05]; // for 3.0, 3.5, 4.0, 4.5, 5.0
    const ratings = [3.0, 3.5, 4.0, 4.5, 5.0];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return ratings[i];
      }
    }
    
    return 4.0; // fallback
  }

  /**
   * Filter products based on search options
   * 
   * @private
   */
  private filterProducts(products: Product[], options: ProductSearchOptions): Product[] {
    let filtered = products;

    if (options.category) {
      const categoryLower = options.category.toLowerCase();
      filtered = filtered.filter(product => 
        product.category?.toLowerCase().includes(categoryLower) ||
        product.productName.toLowerCase().includes(categoryLower)
      );
    }

    if (options.minDiscount !== undefined) {
      filtered = filtered.filter(product => 
        product.discount !== null && product.discount !== undefined && product.discount >= options.minDiscount!
      );
    }

    if (options.maxPrice !== undefined) {
      filtered = filtered.filter(product => 
        product.productPrice <= options.maxPrice!
      );
    }

    if (options.minPrice !== undefined) {
      filtered = filtered.filter(product => 
        product.productPrice >= options.minPrice!
      );
    }

    if (options.minRating !== undefined) {
      filtered = filtered.filter(product => 
        product.rating !== null && product.rating !== undefined && product.rating >= options.minRating!
      );
    }

    if (options.limit !== undefined) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Check if cache should be used
   * 
   * @private
   */
  private shouldUseCache(options: ProductSearchOptions): boolean {
    return this.isUnfilteredRequest(options) && this.isCacheValid() && this.cache.length > 0;
  }

  /**
   * Check if request has no filters (can use cache)
   * 
   * @private
   */
  private isUnfilteredRequest(options: ProductSearchOptions): boolean {
    return !options.category && 
           options.minDiscount === undefined && 
           options.maxPrice === undefined && 
           options.minPrice === undefined && 
           options.minRating === undefined && 
           options.limit === undefined;
  }

  /**
   * Check if cache is still valid
   * 
   * @private
   */
  private isCacheValid(): boolean {
    if (!this.lastCacheUpdate) return false;
    const now = new Date();
    return (now.getTime() - this.lastCacheUpdate.getTime()) < this.config.cacheDuration;
  }

  /**
   * Update cache with new data
   * 
   * @private
   */
  private updateCache(products: Product[]): void {
    this.cache = products;
    this.lastCacheUpdate = new Date();
    logger.debug(`Cache updated with ${products.length} products`);
  }
}