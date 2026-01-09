
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  stockName: string;
  stockCode: string;
  summary: string;
  companyInfo?: string; // 新增：公司概况
  sources: GroundingSource[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ChartDataPoint {
  time: string;
  price: number;
}
