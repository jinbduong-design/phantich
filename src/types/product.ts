export type ProductCategory =
  | 'SaaS / B2B'
  | 'Công nghệ & IoT'
  | 'F&B & Ẩm thực'
  | 'Tiêu dùng & Thời trang'
  | 'EdTech & Đào tạo'
  | 'Sức khỏe & Y tế'
  | 'Dịch vụ & Tài chính'
  | 'Khác';

export type ProductStage =
  | 'Ý tưởng sơ khai'
  | 'MVP thử nghiệm'
  | 'Beta / Early Access'
  | 'Đã ra mắt thị trường'
  | 'Tăng trưởng mở rộng';

export interface TargetPersona {
  id: string;
  name: string;
  type: 'Primary' | 'Secondary';
  role?: string;
  demographics: string;
  fitScore: number; // 0 - 100
  painPoints: string[];
  goals: string[];
  buyingTriggers: string[];
  objections: string[];
  willingnessToPay: string;
  channels: string[];
}

export interface EvaluationScores {
  targetCustomerFit: number;      // 0 - 100 (25% weight)
  painPointSolvability: number;   // 0 - 100 (20% weight)
  pricingAndValue: number;        // 0 - 100 (20% weight)
  competitiveMoat: number;        // 0 - 100 (20% weight)
  marketScalability: number;      // 0 - 100 (15% weight)
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorItem {
  name: string;
  comparison: string;
  threatLevel: 'Cao' | 'Trung bình' | 'Thấp';
}

export interface RecommendationItem {
  area: string;
  action: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
}

export interface SimulatedReview {
  author: string;
  persona: string;
  rating: number; // 1 - 5
  comment: string;
  sentiment: 'Tích cực' | 'Trung lập' | 'Quan ngại';
}

export interface MarketAnalysis {
  tamSamSom: string;
  marketDrivers: string[];
  adoptionBarriers: string[];
}

export interface ProductEvaluation {
  overallScore: number; // 0 - 100
  ratingGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  verdict: string;
  scores: EvaluationScores;
  personas: TargetPersona[];
  swot: SwotAnalysis;
  marketAnalysis: MarketAnalysis;
  competitorMatrix: CompetitorItem[];
  recommendations: RecommendationItem[];
  simulatedReviews: SimulatedReview[];
  userNotes?: string;
  lastEvaluatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  stage: ProductStage;
  pricing: string;
  description: string;
  targetCustomerDescription: string;
  competitors: string;
  createdAt: string;
  updatedAt: string;
  evaluation: ProductEvaluation;
}
