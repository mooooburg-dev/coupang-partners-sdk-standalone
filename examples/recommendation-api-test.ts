import { CoupangPartnersClient } from '../src/index';

async function testRecommendationAPI() {
  const client = new CoupangPartnersClient({
    accessKey: 'test-access-key',
    secretKey: 'test-secret-key'
  });

  try {
    console.log('Testing Recommendation API...');

    const response = await client.recommendation({
      deviceId: 'test-device-id-12345', // Example ADID/GAID
      subId: 'test-tracking-id',
      imageSize: '512x512'
    });

    console.log('Recommendation Response:', response);

    if (response.rCode === '0') {
      console.log(`✅ Success! Found ${response.data?.length || 0} recommended products`);

      response.data?.forEach((product, index) => {
        console.log(`${index + 1}. ${product.productName}`);
        console.log(`   Price: ₩${product.productPrice.toLocaleString()}`);
        console.log(`   Rocket: ${product.isRocket ? 'Yes' : 'No'}`);
        console.log(`   URL: ${product.productUrl}`);
        console.log('');
      });
    } else {
      console.log(`❌ API Error: ${response.rMessage}`);
    }
  } catch (error) {
    console.error('❌ Recommendation API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        console.log('💡 Tip: Please check your API credentials');
      } else if (error.message.includes('HTML error page')) {
        console.log('💡 Tip: API might be returning HTML instead of JSON - check endpoint');
      }
    }
  }
}

// Run the test
testRecommendationAPI();