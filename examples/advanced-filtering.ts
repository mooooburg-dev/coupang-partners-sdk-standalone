/**
 * Advanced filtering example for Coupang Partners SDK
 */

import { CoupangPartnersClient } from '../src';

async function advancedFilteringExample() {
  const client = new CoupangPartnersClient({
    accessKey: 'YOUR_ACCESS_KEY',
    secretKey: 'YOUR_SECRET_KEY'
  });

  console.log('🔍 Advanced Filtering Examples');
  console.log('=============================\n');

  try {
    // Complex filtering
    console.log('1. Complex filtering - Electronics under 100,000원 with 30%+ discount:');
    const electronicsDeals = await client.getGoldBoxProducts({
      category: '전자제품',
      maxPrice: 100000,
      minDiscount: 30,
      limit: 10
    });

    electronicsDeals.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.productName}`);
      console.log(`      Price: ${product.productPrice.toLocaleString()}원 (${product.discount}% off)`);
    });

    console.log(`\n   Total: ${electronicsDeals.length} products found\n`);

    // Price range filtering
    console.log('2. Price range filtering - Products between 20,000-50,000원:');
    const midRangeProducts = await client.getProductsByPriceRange(20000, 50000);
    console.log(`   Found ${midRangeProducts.length} products in this price range\n`);

    // High-rated affordable products
    console.log('3. High-rated affordable products - 4.5+ rating under 30,000원:');
    const qualityDeals = await client.getGoldBoxProducts({
      maxPrice: 30000,
      minRating: 4.5,
      limit: 5
    });

    qualityDeals.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.productName}`);
      console.log(`      Price: ${product.productPrice.toLocaleString()}원`);
      console.log(`      Rating: ${product.rating}⭐ (${product.reviewCount} reviews)`);
    });

    console.log('\n✅ Advanced filtering examples completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Category-specific searches
async function categoryExamples() {
  const client = new CoupangPartnersClient({
    accessKey: 'YOUR_ACCESS_KEY',
    secretKey: 'YOUR_SECRET_KEY'
  });

  console.log('\n📂 Category Examples');
  console.log('===================\n');

  const categories = ['과일', '육류', '음료', '유제품', '해산물'];

  try {
    for (const category of categories) {
      const products = await client.getProductsByCategory(category);
      console.log(`${category}: ${products.length} products`);
      
      if (products.length > 0) {
        const avgPrice = products.reduce((sum, p) => sum + p.productPrice, 0) / products.length;
        const avgDiscount = products
          .filter(p => p.discount !== null)
          .reduce((sum, p, _, arr) => sum + (p.discount! / arr.length), 0);
        
        console.log(`   Average Price: ${avgPrice.toLocaleString()}원`);
        console.log(`   Average Discount: ${avgDiscount.toFixed(1)}%`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run examples
Promise.all([
  advancedFilteringExample(),
  categoryExamples()
]).catch(console.error);