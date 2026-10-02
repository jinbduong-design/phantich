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

export type DifferentiationProof =
  | 'none'
  | 'claim'
  | 'customer-confirmed'
  | 'measured';

export interface ProductEvidence {
  customerInterviews: number;
  problemConfirmed: number;
  solutionTests: number;
  positiveOutcomes: number;
  pricingTests: number;
  priceAccepted: number;
  payingCustomers: number;
  repeatCustomers: number;
  competitiveComparisons: number;
  wonAgainstAlternative: number;
  acquisitionTests: number;
  repeatableChannels: number;
  grossMarginPct?: number;
  differentiationProof: DifferentiationProof;
  notes: string;
}

export interface TargetPersona {
  id: string;
  name: string;
  type: 'Primary' | 'Secondary';
  role?: string;
  demographics: string;
  fitScore: number;
  painPoints: string[];
  goals: string[];
  buyingTriggers: string[];
  objections: string[];
  willingnessToPay: string;
  channels: string[];
}

export interface EvaluationScores {
  targetCustomerFit: number;
  painPointSolvability: number;
  pricingAndValue: number;
  competitiveMoat: number;
  marketScalability: number;
}

export type EvaluationStatus = 'insufficient' | 'provisional' | 'validated';

export interface EvaluationFactor {
  label: string;
  score: number;
  weight: number;
  evidence: string;
  sufficient: boolean;
}

export interface CriterionBreakdown {
  score: number;
  confidence: number;
  factors: EvaluationFactor[];
  missing: string[];
}

export interface EvaluationBreakdown {
  targetCustomerFit: CriterionBreakdown;
  painPointSolvability: CriterionBreakdown;
  pricingAndValue: CriterionBreakdown;
  competitiveMoat: CriterionBreakdown;
  marketScalability: CriterionBreakdown;
}

export interface EvaluationConfidence {
  score: number;
  level: 'Thấp' | 'Trung bình' | 'Cao';
  knownSignals: string[];
  unknowns: string[];
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

export interface MarketAnalysis {
  tamSamSom: string;
  marketDrivers: string[];
  adoptionBarriers: string[];
}

export interface ProductEvaluation {
  overallScore: number;
  ratingGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  status: EvaluationStatus;
  verdict: string;
  scores: EvaluationScores;
  confidence: EvaluationConfidence;
  breakdown: EvaluationBreakdown;
  personas: TargetPersona[];
  swot: SwotAnalysis;
  marketAnalysis: MarketAnalysis;
  competitorMatrix: CompetitorItem[];
  recommendations: RecommendationItem[];
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
  evidence: ProductEvidence;
  createdAt: string;
  updatedAt: string;
  evaluation: ProductEvaluation;
}
