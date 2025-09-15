/**
 * GoldBox API usage example
 *
 * This example demonstrates how to use the GoldBox API to fetch hot deals
 * and apply various filtering options.
 *
 * Run with: npx ts-node examples/goldbox-api-test.ts
 */

import { CoupangPartnersClient } from '../src/index';

async function main() {
  console.log('🔥 Coupang GoldBox API Example');
  console.log('=============================\n');

  try {
    // Initialize the client with demo credentials
    console.log('1. Initializing Coupang Partners SDK...');
    const client = new CoupangPartnersClient({
      accessKey: 'demo-access-key',
      secretKey: 'demo-secret-key'
    }, {
      timeout: 15000,
      debug: true
    });

    console.log(`   SDK Version: ${client.getVersion()}`);
    console.log(`   Health Check: ${client.healthCheck() ? '✅ Ready' : '❌ Not Ready'}\n`);

    // Test 1: Basic GoldBox API call
    console.log('2. Getting GoldBox products (basic)...');
    try {
      const basicResponse = await client.goldbox({
        imageSize: '230x230',
        subId: 'goldbox-demo'
      });

      console.log(`   Response Code: ${basicResponse.rCode}`);
      console.log(`   Message: ${basicResponse.rMessage}`);

      if (basicResponse.data && basicResponse.data.length > 0) {
        console.log(`   Found ${basicResponse.data.length} GoldBox products:`);
        basicResponse.data.slice(0, 3).forEach((product, index) => {
          console.log(`     ${index + 1}. ${product.productName}`);
          console.log(`        Category: ${product.categoryName}`);
          console.log(`        Price: ₩${product.productPrice.toLocaleString()}`);
          console.log(`        Rocket: ${product.isRocket ? '🚀 Yes' : '❌ No'}`);
          console.log(`        Free Shipping: ${product.isFreeShipping ? '🚚 Yes' : '❌ No'}`);
        });
      }
      console.log();
    } catch (apiError) {
      console.log('   ⚠️  GoldBox API call failed (expected with demo credentials)');
      console.log(`   Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}\n`);
    }

    // Test 2: GoldBox with price filters
    console.log('3. Getting GoldBox products with price filters...');
    try {
      const filteredResponse = await client.goldboxWithFilters(
        {
          imageSize: '300x300',
          subId: 'goldbox-filtered-demo'
        },
        {
          minPrice: 10000,
          maxPrice: 100000,
          rocketOnly: false
        }
      );

      console.log(`   Response Code: ${filteredResponse.rCode}`);
      console.log(`   Message: ${filteredResponse.rMessage}`);

      if (filteredResponse.data) {
        console.log(`   Found ${filteredResponse.data.length} filtered products`);
        console.log(`   Price range: ₩10,000 - ₩100,000`);
      }
      console.log();
    } catch (apiError) {
      console.log('   ⚠️  Filtered GoldBox API call failed (expected with demo credentials)');
      console.log(`   Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}\n`);
    }

    // Test 3: GoldBox with category and shipping filters
    console.log('4. Getting GoldBox products with advanced filters...');
    try {
      const advancedResponse = await client.goldboxWithFilters(
        {
          imageSize: '120x120'
        },
        {
          categories: ['패션', '뷰티'],
          freeShippingOnly: true,
          rocketOnly: true,
          minPrice: 5000
        }
      );

      console.log(`   Response Code: ${advancedResponse.rCode}`);
      console.log(`   Message: ${advancedResponse.rMessage}`);

      if (advancedResponse.data) {
        console.log(`   Found ${advancedResponse.data.length} advanced filtered products`);
        console.log('   Filters applied:');
        console.log('     - Categories: 패션, 뷰티');
        console.log('     - Free Shipping: Required');
        console.log('     - Rocket Delivery: Required');
        console.log('     - Min Price: ₩5,000');

        if (advancedResponse.data.length > 0) {
          console.log('   Sample products:');
          advancedResponse.data.slice(0, 2).forEach((product, index) => {
            console.log(`     ${index + 1}. ${product.productName}`);
            console.log(`        Category: ${product.categoryName}`);
            console.log(`        Price: ₩${product.productPrice.toLocaleString()}`);
            console.log(`        🚀 Rocket + 🚚 Free Shipping`);
          });
        }
      }
      console.log();
    } catch (apiError) {
      console.log('   ⚠️  Advanced filtered GoldBox API call failed (expected with demo credentials)');
      console.log(`   Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}\n`);
    }

    // Test 4: Configuration updates
    console.log('5. Testing configuration updates...');
    const originalConfig = client.getConfig();
    console.log('   Original Config:');
    console.log(`     Timeout: ${originalConfig.timeout}ms`);
    console.log(`     Debug: ${originalConfig.debug}`);

    client.updateConfig({
      timeout: 20000,
      debug: false
    });

    const updatedConfig = client.getConfig();
    console.log('   Updated Config:');
    console.log(`     Timeout: ${updatedConfig.timeout}ms`);
    console.log(`     Debug: ${updatedConfig.debug}\n`);

    // Test 5: Error handling demo
    console.log('6. Demonstrating error handling...');
    try {
      // This will fail with demo credentials
      await client.goldbox({
        imageSize: '600x600',  // Valid image size
        subId: 'error-demo'
      });
    } catch (error) {
      console.log('   ✅ Error handling working correctly');
      console.log(`   Error type: ${error instanceof Error ? error.constructor.name : 'Unknown'}`);
      console.log(`   Error message: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }

    console.log('✅ GoldBox API example completed successfully!');
    console.log('\n💡 Key features demonstrated:');
    console.log('   • Basic GoldBox product retrieval');
    console.log('   • Price-based filtering');
    console.log('   • Category and shipping filters');
    console.log('   • Configuration management');
    console.log('   • Error handling');
    console.log('\n🔧 To test with real data:');
    console.log('   1. Replace demo credentials with your actual API keys');
    console.log('   2. Ensure you have valid Coupang Partners API access');
    console.log('   3. Run this example again');

  } catch (error) {
    console.error('❌ Unexpected error occurred:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the example
main().catch(console.error);