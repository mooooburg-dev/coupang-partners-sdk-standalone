/**
 * Common report request parameters
 */
export interface ReportParams {
  /** 시작일, 형식: yyyyMMdd, 20181101 보다 같거나 커야 합니다. */
  startDate: string;
  /** 종료일, 형식: yyyyMMdd, 시작일과의 차이가 30일 보다 같거나 작아야 합니다. */
  endDate: string;
  /** 채널 아이디 */
  subId?: string;
  /** 페이지 번호. 기본 값은 0. 한 페이지에 최대 1000개의 결과 값이 존재합니다. */
  page?: number;
}

/**
 * Click report data structure
 */
export interface ClickReportData {
  date: string;
  trackingCode: string;
  subId: string;
  addtag: string;
  ctag: string;
  click: number;
}

/**
 * Click report API response structure
 */
export interface ClickReportResponse {
  rCode: string;
  rMessage: string;
  data?: ClickReportData[];
}

/**
 * Order report data structure (상품 단위)
 */
export interface OrderReportData {
  date: string;
  trackingCode: string;
  subId: string;
  addtag: string;
  ctag: string;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  gmv: number;
  commissionRate: number;
  commission: number;
  categoryName: string;
}

/**
 * Order report API response structure
 */
export interface OrderReportResponse {
  rCode: string;
  rMessage: string;
  data?: OrderReportData[];
}
