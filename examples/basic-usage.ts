/**
 * Basic usage example for Coupang Partners SDK
 * 
 * Run with: npm run example
 */

import { CoupangPartnersClient } from 'coupang-partners-sdk-standalone';

async function main() {
  // Replace with your actual credentials
  const client = new CoupangPartnersClient({
    accessKey: 'YOUR_ACCESS_KEY',
    secretKey: 'YOUR_SECRET_KEY'
  }, {
    debug: true // Enable debug logging
  });

  console.log('🚀 Coupang Partners SDK Example');
  console.log('==============================\n');

  try {
    // Health check
    console.log('1. Health Check...');
    const isHealthy = await client.healthCheck();
    console.log(`   Status: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}\n`);

    if (!isHealthy) {
      console.log('❌ SDK is not ready. Please check your credentials.');
      return;
    }

    // Get all GoldBox products
    console.log('2. Fetching all GoldBox products...');
    const allProducts = await client.getGoldBoxProducts();
    console.log(`   Found ${allProducts.length} products\n`);

    // Show first 3 products
    console.log('3. Sample products:');
    allProducts.slice(0, 3).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.productName}`);
      console.log(`      Price: ${product.productPrice.toLocaleString()}원`);
      console.log(`      Discount: ${product.discount || 0}%`);
      console.log(`      Rating: ${product.rating || 'N/A'}\n`);
    });

    // Get products by category
    console.log('4. Fetching products by category (과일)...');
    const fruitProducts = await client.getProductsByCategory('과일');
    console.log(`   Found ${fruitProducts.length} fruit products\n`);

    // Get high discount products
    console.log('5. Fetching high discount products (50%+)...');
    const discountProducts = await client.getHighDiscountProducts(50, 5);
    console.log(`   Found ${discountProducts.length} high discount products\n`);

    // Get top-rated products
    console.log('6. Fetching top-rated products...');
    const topRated = await client.getTopRatedProducts(4.0, 5);
    console.log(`   Found ${topRated.length} top-rated products\n`);

    // Cache information
    const cacheInfo = client.getCacheInfo();
    console.log('7. Cache Information:');
    console.log(`   Size: ${cacheInfo.size} products`);
    console.log(`   Last Update: ${cacheInfo.lastUpdate}`);
    console.log(`   Valid: ${cacheInfo.isValid}\n`);

    console.log('✅ Example completed successfully!');

  } catch (error) {
    console.error('❌ Error occurred:', error);
    
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
  }
}

// Run the example
main().catch(console.error);