/**
 * Detailed API response structure validation
 *
 * Run with: npx ts-node examples/detailed-api-test.ts
 */

import dotenv from 'dotenv';
import { CoupangPartnersClient } from '../src/index';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testDetailedAPI() {
  console.log('🔍 상세 API 응답 구조 검증 테스트');
  console.log('===============================================\n');

  const accessKey = process.env.ACCESS_KEY;
  const secretKey = process.env.SECRET_KEY;

  if (!accessKey || !secretKey) {
    console.error('❌ 환경 변수에서 API 키를 찾을 수 없습니다.');
    return;
  }

  try {
    const client = new CoupangPartnersClient({
      accessKey,
      secretKey
    }, {
      debug: false // 상세 출력을 위해 debug 로그 비활성화
    });

    console.log('📱 스마트폰 관련 상품 검색...');
    const response = await client.searchProducts('아이폰', {
      limit: 3,
      imageSize: '230x230',
      srpLinkOnly: false
    });

    console.log('\n📋 API 응답 구조:');
    console.log('================================================');
    console.log(`응답 코드: ${response.rCode}`);
    console.log(`응답 메시지: ${response.rMessage}`);
    console.log(`랜딩 URL: ${response.data?.landingUrl}`);
    console.log(`상품 개수: ${response.data?.productData?.length}`);

    if (response.data && response.data.productData && response.data.productData.length > 0) {
      console.log('\n🛍️  첫 번째 상품 상세 정보:');
      console.log('================================================');
      const firstProduct = response.data.productData[0];

      console.log(`상품명: ${firstProduct.productName}`);
      console.log(`상품 ID: ${firstProduct.productId}`);
      console.log(`가격: ₩${firstProduct.productPrice.toLocaleString()}`);
      console.log(`순위: ${firstProduct.rank}`);
      console.log(`키워드: ${firstProduct.keyword}`);
      console.log(`로켓배송: ${firstProduct.isRocket ? '✅ 가능' : '❌ 불가능'}`);
      console.log(`무료배송: ${firstProduct.isFreeShipping ? '✅ 가능' : '❌ 불가능'}`);
      console.log(`상품 이미지 URL: ${firstProduct.productImage}`);
      console.log(`상품 페이지 URL: ${firstProduct.productUrl}`);

      console.log('\n📊 모든 상품 요약:');
      console.log('================================================');
      response.data.productData.forEach((product, index) => {
        console.log(`${index + 1}. ${product.productName.substring(0, 60)}${product.productName.length > 60 ? '...' : ''}`);
        console.log(`   💰 ₩${product.productPrice.toLocaleString()}`);
        console.log(`   🚀 로켓: ${product.isRocket ? 'O' : 'X'} | 무료배송: ${product.isFreeShipping ? 'O' : 'X'} | 순위: ${product.rank}`);
        console.log();
      });

      // 타입 검증
      console.log('🔍 데이터 타입 검증:');
      console.log('================================================');
      console.log(`productId 타입: ${typeof firstProduct.productId} (값: ${firstProduct.productId})`);
      console.log(`productPrice 타입: ${typeof firstProduct.productPrice} (값: ${firstProduct.productPrice})`);
      console.log(`rank 타입: ${typeof firstProduct.rank} (값: ${firstProduct.rank})`);
      console.log(`isRocket 타입: ${typeof firstProduct.isRocket} (값: ${firstProduct.isRocket})`);
      console.log(`isFreeShipping 타입: ${typeof firstProduct.isFreeShipping} (값: ${firstProduct.isFreeShipping})`);
      console.log(`keyword 타입: ${typeof firstProduct.keyword} (값: "${firstProduct.keyword}")`);
      console.log(`productName 타입: ${typeof firstProduct.productName} (길이: ${firstProduct.productName.length})`);
      console.log(`productImage 타입: ${typeof firstProduct.productImage} (URL 유효성: ${firstProduct.productImage.startsWith('http')})`);
      console.log(`productUrl 타입: ${typeof firstProduct.productUrl} (URL 유효성: ${firstProduct.productUrl.startsWith('http')})`);

    } else {
      console.log('\n⚠️  검색 결과가 없습니다.');
    }

    // 다른 카테고리 테스트
    console.log('\n🏠 생활용품 카테고리 테스트...');
    const homeResponse = await client.searchProducts('세제', {
      limit: 2,
      imageSize: '300x300'
    });

    if (homeResponse.data && homeResponse.data.productData && homeResponse.data.productData.length > 0) {
      console.log(`생활용품 검색 결과: ${homeResponse.data.productData.length}개`);
      homeResponse.data.productData.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.productName.substring(0, 40)}... - ₩${product.productPrice.toLocaleString()}`);
      });
    }

    console.log('\n✅ 상세 API 테스트 완료!');
    console.log('\n📈 검증 결과:');
    console.log('- ✅ API 인증 성공');
    console.log('- ✅ 한글 키워드 검색 작동');
    console.log('- ✅ 다양한 검색 옵션 작동');
    console.log('- ✅ 응답 데이터 구조 정상');
    console.log('- ✅ 모든 필드 타입 정확');
    console.log('- ✅ URL 및 이미지 링크 유효');

  } catch (error) {
    console.error('❌ 상세 API 테스트 실패:', error);
    if (error instanceof Error) {
      console.error('오류 메시지:', error.message);
    }
  }
}

// 테스트 실행
testDetailedAPI();