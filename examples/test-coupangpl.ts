import { CoupangPartnersClient } from '../src/index';

async function testCoupangPL() {
  const client = new CoupangPartnersClient({
    accessKey: 'test-access-key',
    secretKey: 'test-secret-key'
  });

  try {
    console.log('Testing CoupangPL API...');

    const response = await client.coupangPL({
      limit: 10,
      subId: 'test-sub-id',
      imageSize: '512x512'
    });

    console.log('CoupangPL Response:', response);
  } catch (error) {
    console.error('CoupangPL Error:', error);
  }

  try {
    console.log('Testing Search API...');

    const searchResponse = await client.searchProducts('아이폰', {
      limit: 10,
      imageSize: '230x230'
    });

    console.log('Search Response:', searchResponse);
  } catch (error) {
    console.error('Search Error:', error);
  }
}

testCoupangPL();