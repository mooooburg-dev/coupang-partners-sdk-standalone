/**
 * Deeplink API test example
 *
 * Run with: npm run example:deeplink
 */

import { CoupangPartnersClient } from '../src/index';

async function testDeeplinkAPI() {
  console.log('🔗 Deeplink API Test');
  console.log('===============================================\n');

  try {
    // Initialize client
    const client = new CoupangPartnersClient(
      {
        accessKey: process.env.COUPANG_ACCESS_KEY || 'YOUR_ACCESS_KEY',
        secretKey: process.env.COUPANG_SECRET_KEY || 'YOUR_SECRET_KEY',
      },
      {
        debug: true,
      }
    );

    // Test deeplink conversion
    console.log('1. Converting Coupang URLs to affiliate links...\n');

    const response = await client.deeplink({
      coupangUrls: [
        'https://www.coupang.com/vp/products/184614775',
        'https://www.coupang.com/vp/products/123456789',
      ],
      subId: 'my-tracking-id',
    });

    console.log('Response:', JSON.stringify(response, null, 2));

    if (response.rCode === '0') {
      console.log('\n✅ Success! Converted links:');
      response.data?.forEach((link, index) => {
        console.log(`\n  ${index + 1}. Original: ${link.originalUrl}`);
        console.log(`     Short:   ${link.shortUrl}`);
      });
    } else {
      console.log(`\n❌ Error: ${response.rMessage}`);
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

// Run the test
testDeeplinkAPI();

