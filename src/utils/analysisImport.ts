import {
  AnalysisMetric,
  Product,
  ProductAnalysis,
  ProductCategory,
  ProductPulseAnalysisImport,
  ProductStage,
} from '../types/product';
import { EMPTY_EVIDENCE, generateDefaultEvaluation } from './evaluator';
import { normalizeEconomics, normalizeMarketProfile, normalizeOperations } from './commercial';

const categories: ProductCategory[] = [
  'SaaS / B2B',
  'Công nghệ & IoT',
  'F&B & Ẩm thực',
  'Tiêu dùng & Thời trang',
  'Quà tặng & Decor',
  'EdTech & Đào tạo',
  'Sức khỏe & Y tế',
  'Dịch vụ & Tài chính',
  'Khác',
];

const stages: ProductStage[] = [
  'Ý tưởng sơ khai',
  'MVP thử nghiệm',
  'Beta / Early Access',
  'Đã ra mắt thị trường',
  'Tăng trưởng mở rộng',
];

const clamp = (value: unknown, fallback = 0) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
};

const cleanStrings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

const normalizeMetric = (metric: any, index: number): AnalysisMetric => ({
  key:
    typeof metric?.key === 'string' && metric.key.trim()
      ? metric.key.trim()
      : `metric-${index + 1}`,
  label:
    typeof metric?.label === 'string' && metric.label.trim()
      ? metric.label.trim()
      : `Chỉ số ${index + 1}`,
  score: clamp(metric?.score),
  confidence: clamp(metric?.confidence),
  weight:
    Number.isFinite(Number(metric?.weight)) && Number(metric.weight) > 0
      ? Number(metric.weight)
      : undefined,
  rationale:
    typeof metric?.rationale === 'string' ? metric.rationale.trim() : '',
  basis:
    metric?.basis === 'observed' || metric?.basis === 'researched'
      ? metric.basis
      : 'inferred',
});

const calculateAnalysisScore = (metrics: AnalysisMetric[], provided: unknown) => {
  if (metrics.length === 0) return clamp(provided);

  const weighted = metrics.filter((metric) => metric.weight && metric.weight > 0);
  if (weighted.length > 0) {
    const totalWeight = weighted.reduce((sum, metric) => sum + (metric.weight || 0), 0);
    if (totalWeight > 0) {
      return Math.round(
        weighted.reduce(
          (sum, metric) => sum + metric.score * (metric.weight || 0),
          0,
        ) / totalWeight,
      );
    }
  }

  return Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length);
};

export const isProductPulseAnalysisImport = (
  value: unknown,
): value is ProductPulseAnalysisImport => {
  const input = value as ProductPulseAnalysisImport;
  return Boolean(
    input &&
      input.schema === 'productpulse.analysis.v1' &&
      input.product &&
      typeof input.product.name === 'string' &&
      typeof input.product.description === 'string' &&
      input.analysis &&
      Array.isArray(input.analysis.metrics),
  );
};

export const normalizeProductAnalysis = (input: any): ProductAnalysis => {
  const metrics = Array.isArray(input?.metrics)
    ? input.metrics.map(normalizeMetric)
    : [];

  return {
    overallScore: calculateAnalysisScore(metrics, input?.overallScore),
    confidence: clamp(input?.confidence),
    summary: typeof input?.summary === 'string' ? input.summary.trim() : '',
    metrics,
    strengths: cleanStrings(input?.strengths),
    risks: cleanStrings(input?.risks),
    assumptions: cleanStrings(input?.assumptions),
    opportunities: cleanStrings(input?.opportunities),
    nextTests: cleanStrings(input?.nextTests),
    sources: Array.isArray(input?.sources)
      ? input.sources
          .filter((source: any) => source && typeof source.title === 'string')
          .map((source: any) => ({
            title: source.title.trim(),
            url: typeof source.url === 'string' ? source.url.trim() : undefined,
            type:
              source.type === 'image' ||
              source.type === 'web' ||
              source.type === 'user'
                ? source.type
                : 'other',
            note: typeof source.note === 'string' ? source.note.trim() : undefined,
          }))
      : [],
    generatedAt:
      typeof input?.generatedAt === 'string' && input.generatedAt
        ? input.generatedAt
        : new Date().toISOString(),
    generatedBy:
      typeof input?.generatedBy === 'string' ? input.generatedBy.trim() : undefined,
  };
};

export const productFromAnalysisImport = (
  input: ProductPulseAnalysisImport,
): Product => {
  const now = new Date().toISOString().split('T')[0];
  const category = categories.includes(input.product.category as ProductCategory)
    ? (input.product.category as ProductCategory)
    : 'Khác';
  const stage = stages.includes(input.product.stage as ProductStage)
    ? (input.product.stage as ProductStage)
    : 'Ý tưởng sơ khai';
  const evidence = { ...EMPTY_EVIDENCE };
  const analysis = normalizeProductAnalysis(input.analysis);
  const marketProfile = normalizeMarketProfile(input.market);
  const economics = normalizeEconomics(input.economics);
  const operations = normalizeOperations(input.operations);

  return {
    id: `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.product.name.trim(),
    tagline: input.product.tagline?.trim() || '',
    category,
    stage,
    pricing: input.product.pricingHypothesis?.trim() || '',
    description: input.product.description.trim(),
    targetCustomerDescription: input.product.targetCustomerHypothesis?.trim() || '',
    competitors: input.product.competitorsHypothesis?.trim() || '',
    evidence,
    analysis,
    marketProfile,
    economics,
    operations,
    createdAt: now,
    updatedAt: now,
    evaluation: generateDefaultEvaluation({ category, evidence }),
  };
};
