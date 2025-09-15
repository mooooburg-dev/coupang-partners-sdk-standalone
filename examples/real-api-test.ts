/**
 * Real API test with actual credentials
 *
 * Run with: npx ts-node examples/real-api-test.ts
 */

import dotenv from 'dotenv';
import { CoupangPartnersClient } from '../src/index';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testRealAPI() {
  console.log('🚀 실제 쿠팡 파트너스 API 테스트');
  console.log('===============================================\n');

  const accessKey = process.env.ACCESS_KEY;
  const secretKey = process.env.SECRET_KEY;

  if (!accessKey || !secretKey) {
    console.error('❌ .env.local 파일에서 ACCESS_KEY 또는 SECRET_KEY를 찾을 수 없습니다.');
    return;
  }

  try {
    // 클라이언트 초기화
    const client = new CoupangPartnersClient({
      accessKey,
      secretKey
    }, {
      debug: true
    });

    console.log('1. 클라이언트 초기화 및 헬스체크...');
    const isHealthy = client.healthCheck();
    console.log(`   상태: ${isHealthy ? '✅ 정상' : '❌ 오류'}\n`);

    if (!isHealthy) {
      console.log('❌ 클라이언트 설정에 문제가 있습니다.');
      return;
    }

    // 테스트 1: 한글 키워드 검색
    console.log('2. 한글 키워드로 상품 검색 테스트...');
    console.log('   키워드: "노트북"');
    const koreanSearch = await client.searchProducts('노트북', {
      limit: 5,
      imageSize: '230x230',
      srpLinkOnly: false
    });

    console.log(`   응답 코드: ${koreanSearch.rCode}`);
    console.log(`   메시지: ${koreanSearch.rMessage}`);

    if (koreanSearch.data && koreanSearch.data.productData) {
      console.log(`   검색된 상품 수: ${koreanSearch.data.productData.length}`);
      console.log('   상품 목록:');
      koreanSearch.data.productData.forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.productName}`);
        console.log(`        가격: ₩${product.productPrice.toLocaleString()}`);
        console.log(`        순위: ${product.rank}`);
        console.log(`        로켓배송: ${product.isRocket ? '✅' : '❌'}`);
        console.log(`        무료배송: ${product.isFreeShipping ? '✅' : '❌'}`);
        console.log();
      });
    } else {
      console.log('   상품 데이터가 없습니다.');
    }
    console.log();

    // 테스트 2: 영어 키워드 검색
    console.log('3. 영어 키워드로 상품 검색 테스트...');
    console.log('   키워드: "smartphone"');
    const englishSearch = await client.searchProducts('smartphone', {
      limit: 3,
      imageSize: '300x300',
      srpLinkOnly: true
    });

    console.log(`   응답 코드: ${englishSearch.rCode}`);
    console.log(`   메시지: ${englishSearch.rMessage}`);

    if (englishSearch.data && englishSearch.data.productData) {
      console.log(`   검색된 상품 수: ${englishSearch.data.productData.length}`);
      console.log('   상품 목록 (간단):');
      englishSearch.data.productData.forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.productName.substring(0, 50)}...`);
        console.log(`        가격: ₩${product.productPrice.toLocaleString()}`);
      });
    }
    console.log();

    // 테스트 3: 다양한 옵션 테스트
    console.log('4. 다양한 검색 옵션 테스트...');
    console.log('   키워드: "커피", limit: 10, 큰 이미지');
    const optionSearch = await client.searchProducts('커피', {
      limit: 10,
      imageSize: '600x600',
      srpLinkOnly: false,
      subId: 'test-sub-id'
    });

    console.log(`   응답 코드: ${optionSearch.rCode}`);
    console.log(`   검색된 상품 수: ${optionSearch.data?.productData?.length || 0}`);
    console.log();

    // 테스트 4: 빈 결과 테스트
    console.log('5. 특이한 키워드 검색 테스트...');
    console.log('   키워드: "xyzabc123456"');
    const emptySearch = await client.searchProducts('xyzabc123456', {
      limit: 5
    });

    console.log(`   응답 코드: ${emptySearch.rCode}`);
    console.log(`   검색된 상품 수: ${emptySearch.data?.productData?.length || 0}`);
    console.log();

    console.log('✅ 모든 API 테스트가 성공적으로 완료되었습니다!');
    console.log('\n📊 테스트 결과:');
    console.log(`   - 한글 키워드: ${koreanSearch.data?.productData?.length || 0}개 상품`);
    console.log(`   - 영어 키워드: ${englishSearch.data?.productData?.length || 0}개 상품`);
    console.log(`   - 옵션 테스트: ${optionSearch.data?.productData?.length || 0}개 상품`);
    console.log(`   - 특이 키워드: ${emptySearch.data?.productData?.length || 0}개 상품`);

  } catch (error) {
    console.error('❌ API 테스트 중 오류 발생:', error);

    if (error instanceof Error) {
      console.error('   오류 메시지:', error.message);

      // API 응답 오류인 경우 추가 정보 출력
      if (error.message.includes('401')) {
        console.error('   💡 인증 오류: ACCESS_KEY 또는 SECRET_KEY를 확인해주세요.');
      } else if (error.message.includes('429')) {
        console.error('   💡 요청 제한: API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.message.includes('500')) {
        console.error('   💡 서버 오류: 쿠팡 API 서버에 일시적인 문제가 있을 수 있습니다.');
      }
    }
  }
}

// 테스트 실행
testRealAPI();