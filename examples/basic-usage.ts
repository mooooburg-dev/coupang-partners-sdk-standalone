/**
 * Basic usage example for Coupang Partners SDK
 *
 * Run with: npm run example
 */

import { CoupangPartnersClient, CoupangAuth } from '../src/index';

async function main() {
  console.log('🚀 Coupang Partners SDK Example');
  console.log('===============================================\n');

  try {
    // Replace with your actual credentials
    const client = new CoupangPartnersClient({
      accessKey: 'YOUR_ACCESS_KEY',
      secretKey: 'YOUR_SECRET_KEY'
    }, {
      debug: true // Enable debug logging
    });

    // 1. Health Check (configuration validation)
    console.log('1. Configuration Health Check...');
    const isHealthy = client.healthCheck();
    console.log(`   Status: ${isHealthy ? '✅ Valid Configuration' : '❌ Invalid Configuration'}\n`);

    if (!isHealthy) {
      console.log('❌ Configuration is invalid. Please check your credentials.');
      return;
    }

    // 2. Generate HMAC signature for API calls
    console.log('2. Generating HMAC signatures...');

    const testUrls = [
      { method: 'GET', url: '/v2/providers/affiliate_open_api/apis/openapi/v1/products/goldbox' },
      { method: 'GET', url: '/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink?coupangUrls=https://www.coupang.com/vp/products/123456' },
      { method: 'POST', url: '/v2/providers/affiliate_open_api/apis/openapi/v1/reports/order-report' }
    ];

    testUrls.forEach((testCase, index) => {
      const signature = client.generateSignature(testCase.method, testCase.url);
      console.log(`   ${index + 1}. ${testCase.method} ${testCase.url}`);
      console.log(`      Signature: ${signature.substring(0, 80)}...\n`);
    });

    // 3. Direct CoupangAuth usage
    console.log('3. Direct CoupangAuth usage...');
    const auth = new CoupangAuth({
      accessKey: 'YOUR_ACCESS_KEY',
      secretKey: 'YOUR_SECRET_KEY'
    });

    const authHeader = auth.getAuthorizationHeader('GET', '/test/path');
    console.log(`   Authorization Header: ${authHeader.Authorization.substring(0, 80)}...\n`);

    // 4. Configuration management
    console.log('4. Configuration Management...');
    const config = client.getConfig();
    console.log(`   Timeout: ${config.timeout}ms`);
    console.log(`   Debug Mode: ${config.debug}\n`);

    console.log('   Updating configuration...');
    client.updateConfig({
      timeout: 15000,
      debug: false
    });

    const updatedConfig = client.getConfig();
    console.log(`   Updated Timeout: ${updatedConfig.timeout}ms`);
    console.log(`   Updated Debug Mode: ${updatedConfig.debug}\n`);

    console.log('5. Products API - Search Products...');
    try {
      const searchResponse = await client.searchProducts('컴퓨터', {
        limit: 5,
        imageSize: '230x230',
        srpLinkOnly: false
      });

      console.log(`   Search Response Code: ${searchResponse.rCode}`);
      console.log(`   Message: ${searchResponse.rMessage}`);

      if (searchResponse.data && searchResponse.data.productData) {
        console.log(`   Found ${searchResponse.data.productData.length} products:`);
        searchResponse.data.productData.slice(0, 3).forEach((product: any, index: number) => {
          console.log(`     ${index + 1}. ${product.productName} - ₩${product.productPrice.toLocaleString()}`);
        });
      }
      console.log();
    } catch (apiError) {
      console.log('   ⚠️  Products API call failed (expected with demo credentials)');
      console.log(`   Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}\n`);
    }

    console.log('6. SDK Version Information...');
    console.log(`   Version: ${client.getVersion()}\n`);

    console.log('✅ SDK example completed successfully!');
    console.log('\n💡 Replace credentials with real ones to test actual API calls');

  } catch (error) {
    console.error('❌ Error occurred:', error);

    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
  }
}

// Run the example
main();