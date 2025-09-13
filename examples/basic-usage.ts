/**
 * Basic usage example for Coupang Partners Authentication Library
 *
 * Run with: npm run example
 */

import { CoupangPartnersClient, CoupangAuth } from 'coupang-partners-sdk-standalone';

function main() {
  console.log('🚀 Coupang Partners Authentication Library Example');
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

    console.log('5. SDK Version Information...');
    console.log(`   Version: ${client.getVersion()}\n`);

    console.log('✅ Authentication library example completed successfully!');
    console.log('\n💡 You can now use these signatures in your HTTP requests to Coupang Partners API');

  } catch (error) {
    console.error('❌ Error occurred:', error);

    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
  }
}

// Run the example
main();