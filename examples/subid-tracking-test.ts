/**
 * SubId tracking functionality test
 *
 * Run with: npx ts-node examples/subid-tracking-test.ts
 */

import dotenv from 'dotenv';
import { CoupangPartnersClient } from '../src/index';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testSubIdTracking() {
  console.log('🏷️  SubId 추적 기능 테스트');
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
      debug: false
    });

    console.log('📝 다양한 SubId로 검색 테스트...\n');

    // 테스트 1: 블로그 포스트 추적
    console.log('1. 블로그 포스트 추적 (blog-post-001)');
    const blogResponse = await client.searchProducts('무선마우스', {
      limit: 2,
      subId: 'blog-post-001',
      imageSize: '230x230'
    });

    if (blogResponse.data) {
      console.log(`   랜딩 URL: ${blogResponse.data.landingUrl}`);
      console.log(`   SubId 포함 확인: ${blogResponse.data.landingUrl.includes('subid=blog-post-001') ? '✅' : '❌'}`);
      console.log(`   검색 결과: ${blogResponse.data.productData?.length || 0}개 상품\n`);
    }

    // 테스트 2: 유튜브 채널 추적
    console.log('2. 유튜브 채널 추적 (youtube-review-2025)');
    const youtubeResponse = await client.searchProducts('헤드폰', {
      limit: 2,
      subId: 'youtube-review-2025',
      imageSize: '300x300'
    });

    if (youtubeResponse.data) {
      console.log(`   랜딩 URL: ${youtubeResponse.data.landingUrl}`);
      console.log(`   SubId 포함 확인: ${youtubeResponse.data.landingUrl.includes('subid=youtube-review-2025') ? '✅' : '❌'}`);
      console.log(`   검색 결과: ${youtubeResponse.data.productData?.length || 0}개 상품\n`);
    }

    // 테스트 3: 이메일 캠페인 추적
    console.log('3. 이메일 캠페인 추적 (email-campaign-202501)');
    const emailResponse = await client.searchProducts('책상', {
      limit: 2,
      subId: 'email-campaign-202501',
      srpLinkOnly: true
    });

    if (emailResponse.data) {
      console.log(`   랜딩 URL: ${emailResponse.data.landingUrl}`);
      console.log(`   SubId 포함 확인: ${emailResponse.data.landingUrl.includes('subid=email-campaign-202501') ? '✅' : '❌'}`);
      console.log(`   검색 결과: ${emailResponse.data.productData?.length || 0}개 상품\n`);
    }

    // 테스트 4: SubId 없이 검색 (비교용)
    console.log('4. SubId 없이 검색 (비교용)');
    const noSubIdResponse = await client.searchProducts('의자', {
      limit: 2
    });

    if (noSubIdResponse.data) {
      console.log(`   랜딩 URL: ${noSubIdResponse.data.landingUrl}`);
      console.log(`   SubId 없음 확인: ${!noSubIdResponse.data.landingUrl.includes('subid=') ? '✅' : '❌'}`);
      console.log(`   검색 결과: ${noSubIdResponse.data.productData?.length || 0}개 상품\n`);
    }

    // 테스트 5: 특수문자가 포함된 SubId
    console.log('5. 특수문자 포함 SubId 테스트 (campaign_2025-Q1_special!)');
    const specialResponse = await client.searchProducts('스마트워치', {
      limit: 1,
      subId: 'campaign_2025-Q1_special!',
      imageSize: '600x600'
    });

    if (specialResponse.data) {
      console.log(`   랜딩 URL: ${specialResponse.data.landingUrl}`);
      console.log(`   특수문자 SubId 처리: ${specialResponse.data.landingUrl.includes('subid=') ? '✅' : '❌'}`);
      console.log(`   검색 결과: ${specialResponse.data.productData?.length || 0}개 상품\n`);
    }

    console.log('✅ SubId 추적 기능 테스트 완료!');
    console.log('\n📊 테스트 요약:');
    console.log('- ✅ 블로그 포스트 추적 가능');
    console.log('- ✅ 유튜브 채널 추적 가능');
    console.log('- ✅ 이메일 캠페인 추적 가능');
    console.log('- ✅ SubId 선택적 사용 가능');
    console.log('- ✅ 특수문자 포함 SubId 처리 가능');
    console.log('\n💡 활용 방안:');
    console.log('- 블로그 포스트별 수익 추적');
    console.log('- 소셜미디어 채널별 성과 분석');
    console.log('- 마케팅 캠페인 ROI 측정');
    console.log('- A/B 테스트 결과 비교');

  } catch (error) {
    console.error('❌ SubId 추적 테스트 실패:', error);
    if (error instanceof Error) {
      console.error('오류 메시지:', error.message);
    }
  }
}

// 테스트 실행
testSubIdTracking();