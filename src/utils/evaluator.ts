import {
  CriterionBreakdown,
  DifferentiationProof,
  EvaluationBreakdown,
  EvaluationConfidence,
  EvaluationFactor,
  EvaluationScores,
  Product,
  ProductCategory,
  ProductEvidence,
  ProductEvaluation,
} from '../types/product';

export const EMPTY_EVIDENCE: ProductEvidence = {
  customerInterviews: 0,
  problemConfirmed: 0,
  solutionTests: 0,
  positiveOutcomes: 0,
  pricingTests: 0,
  priceAccepted: 0,
  payingCustomers: 0,
  repeatCustomers: 0,
  competitiveComparisons: 0,
  wonAgainstAlternative: 0,
  acquisitionTests: 0,
  repeatableChannels: 0,
  differentiationProof: 'none',
  notes: '',
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));

const countScore = (count: number, target: number) =>
  Math.round(clamp((Math.max(0, count) / target) * 100));

const ratioScore = (numerator: number, denominator: number) => {
  if (denominator <= 0) return 0;
  return Math.round(clamp((Math.min(Math.max(0, numerator), denominator) / denominator) * 100));
};

const factor = (
  label: string,
  score: number,
  weight: number,
  evidence: string,
  sufficient: boolean,
): EvaluationFactor => ({
  label,
  score: Math.round(clamp(score)),
  weight,
  evidence,
  sufficient,
});

const buildCriterion = (factors: EvaluationFactor[], missing: string[]): CriterionBreakdown => {
  const score = Math.round(
    factors.reduce((sum, item) => sum + item.score * item.weight, 0) /
      factors.reduce((sum, item) => sum + item.weight, 0),
  );

  const confidence = Math.round(
    factors.reduce(
      (sum, item) => sum + (item.sufficient ? 100 : Math.min(item.score, 50)) * item.weight,
      0,
    ) / factors.reduce((sum, item) => sum + item.weight, 0),
  );

  return { score, confidence, factors, missing };
};

const grossMarginTarget = (category: ProductCategory) => {
  switch (category) {
    case 'SaaS / B2B':
      return 70;
    case 'Công nghệ & IoT':
      return 35;
    case 'F&B & Ẩm thực':
      return 55;
    case 'Tiêu dùng & Thời trang':
      return 50;
    case 'EdTech & Đào tạo':
      return 60;
    case 'Sức khỏe & Y tế':
      return 50;
    case 'Dịch vụ & Tài chính':
      return 60;
    default:
      return 50;
  }
};

const differentiationScore = (proof: DifferentiationProof) => {
  switch (proof) {
    case 'measured':
      return 100;
    case 'customer-confirmed':
      return 75;
    case 'claim':
      return 35;
    case 'none':
    default:
      return 0;
  }
};

export function calculateOverallScore(scores: EvaluationScores): number {
  return Math.round(
    scores.targetCustomerFit * 0.25 +
      scores.painPointSolvability * 0.2 +
      scores.pricingAndValue * 0.2 +
      scores.competitiveMoat * 0.2 +
      scores.marketScalability * 0.15,
  );
}

export function calculateGrade(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 68) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

export function getGradeColor(grade: 'A+' | 'A' | 'B' | 'C' | 'D') {
  switch (grade) {
    case 'A+':
    case 'A':
      return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'B':
      return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'C':
      return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    default:
      return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
  }
}

export function normalizeEvidence(input?: Partial<ProductEvidence>): ProductEvidence {
  return {
    ...EMPTY_EVIDENCE,
    ...(input || {}),
    customerInterviews: Math.max(0, Number(input?.customerInterviews || 0)),
    problemConfirmed: Math.max(0, Number(input?.problemConfirmed || 0)),
    solutionTests: Math.max(0, Number(input?.solutionTests || 0)),
    positiveOutcomes: Math.max(0, Number(input?.positiveOutcomes || 0)),
    pricingTests: Math.max(0, Number(input?.pricingTests || 0)),
    priceAccepted: Math.max(0, Number(input?.priceAccepted || 0)),
    payingCustomers: Math.max(0, Number(input?.payingCustomers || 0)),
    repeatCustomers: Math.max(0, Number(input?.repeatCustomers || 0)),
    competitiveComparisons: Math.max(0, Number(input?.competitiveComparisons || 0)),
    wonAgainstAlternative: Math.max(0, Number(input?.wonAgainstAlternative || 0)),
    acquisitionTests: Math.max(0, Number(input?.acquisitionTests || 0)),
    repeatableChannels: Math.max(0, Number(input?.repeatableChannels || 0)),
    grossMarginPct:
      input?.grossMarginPct === undefined || input?.grossMarginPct === null
        ? undefined
        : clamp(Number(input.grossMarginPct), 0, 100),
    differentiationProof: input?.differentiationProof || 'none',
    notes: input?.notes || '',
  };
}

export function buildEvaluationBreakdown(
  product: Pick<Product, 'category' | 'evidence'>,
): EvaluationBreakdown {
  const e = normalizeEvidence(product.evidence);

  const interviewStrength = countScore(e.customerInterviews, 15);
  const problemRate = ratioScore(e.problemConfirmed, e.customerInterviews);
  const payerStrength = countScore(e.payingCustomers, 10);
  const repeatRate = ratioScore(e.repeatCustomers, e.payingCustomers);

  const targetCustomerFit = buildCriterion(
    [
      factor(
        'Quy mô phỏng vấn',
        interviewStrength,
        0.2,
        `${e.customerInterviews} cuộc phỏng vấn`,
        e.customerInterviews >= 10,
      ),
      factor(
        'Tỷ lệ xác nhận vấn đề',
        problemRate,
        0.3,
        `${Math.min(e.problemConfirmed, e.customerInterviews)}/${e.customerInterviews || 0} xác nhận pain point`,
        e.customerInterviews >= 5,
      ),
      factor(
        'Khách hàng trả tiền',
        payerStrength,
        0.3,
        `${e.payingCustomers} khách đã trả tiền`,
        e.payingCustomers >= 3,
      ),
      factor(
        'Tỷ lệ quay lại',
        repeatRate,
        0.2,
        `${Math.min(e.repeatCustomers, e.payingCustomers)}/${e.payingCustomers || 0} khách quay lại`,
        e.payingCustomers >= 5,
      ),
    ],
    [
      ...(e.customerInterviews < 5 ? ['Cần ít nhất 5 phỏng vấn đúng phân khúc để đọc tỷ lệ pain point.'] : []),
      ...(e.payingCustomers < 3 ? ['Chưa có đủ tín hiệu khách hàng thực sự trả tiền.'] : []),
      ...(e.payingCustomers >= 3 && e.repeatCustomers === 0 ? ['Chưa có bằng chứng quay lại / mua lại.'] : []),
    ],
  );

  const solutionStrength = countScore(e.solutionTests, 10);
  const outcomeRate = ratioScore(e.positiveOutcomes, e.solutionTests);

  const painPointSolvability = buildCriterion(
    [
      factor(
        'Số lần thử giải pháp',
        solutionStrength,
        0.25,
        `${e.solutionTests} người/lần thử giải pháp`,
        e.solutionTests >= 5,
      ),
      factor(
        'Kết quả tích cực',
        outcomeRate,
        0.4,
        `${Math.min(e.positiveOutcomes, e.solutionTests)}/${e.solutionTests || 0} ghi nhận outcome tích cực`,
        e.solutionTests >= 5,
      ),
      factor(
        'Tín hiệu trả tiền',
        payerStrength,
        0.15,
        `${e.payingCustomers} khách trả tiền`,
        e.payingCustomers >= 3,
      ),
      factor(
        'Hành vi quay lại',
        repeatRate,
        0.2,
        `${Math.min(e.repeatCustomers, e.payingCustomers)}/${e.payingCustomers || 0} khách quay lại`,
        e.payingCustomers >= 5,
      ),
    ],
    [
      ...(e.solutionTests < 5 ? ['Chưa đủ lượt dùng thử để đánh giá giải pháp có tạo kết quả hay không.'] : []),
      ...(e.solutionTests >= 5 && e.positiveOutcomes === 0 ? ['Chưa ghi nhận outcome tích cực từ người dùng thử.'] : []),
    ],
  );

  const pricingStrength = countScore(e.pricingTests, 20);
  const acceptanceRate = ratioScore(e.priceAccepted, e.pricingTests);

  const pricingAndValue = buildCriterion(
    [
      factor(
        'Quy mô pricing test',
        pricingStrength,
        0.25,
        `${e.pricingTests} phản hồi/test giá`,
        e.pricingTests >= 10,
      ),
      factor(
        'Tỷ lệ chấp nhận giá',
        acceptanceRate,
        0.35,
        `${Math.min(e.priceAccepted, e.pricingTests)}/${e.pricingTests || 0} chấp nhận mức giá`,
        e.pricingTests >= 5,
      ),
      factor(
        'Khách hàng trả tiền',
        payerStrength,
        0.2,
        `${e.payingCustomers} khách đã trả tiền thực tế`,
        e.payingCustomers >= 3,
      ),
      factor(
        'Giá trị sau mua',
        repeatRate,
        0.2,
        `${Math.min(e.repeatCustomers, e.payingCustomers)}/${e.payingCustomers || 0} khách quay lại`,
        e.payingCustomers >= 5,
      ),
    ],
    [
      ...(e.pricingTests < 5 ? ['Chưa đủ pricing test để kết luận mức giá phù hợp.'] : []),
      ...(e.payingCustomers === 0 ? ['Chưa có giao dịch thật để kiểm chứng willingness-to-pay.'] : []),
    ],
  );

  const comparisonStrength = countScore(e.competitiveComparisons, 8);
  const winRate = ratioScore(e.wonAgainstAlternative, e.competitiveComparisons);
  const diffScore = differentiationScore(e.differentiationProof);

  const competitiveMoat = buildCriterion(
    [
      factor(
        'So sánh cạnh tranh thực tế',
        comparisonStrength,
        0.25,
        `${e.competitiveComparisons} tình huống so sánh trực tiếp`,
        e.competitiveComparisons >= 3,
      ),
      factor(
        'Tỷ lệ thắng lựa chọn khác',
        winRate,
        0.35,
        `${Math.min(e.wonAgainstAlternative, e.competitiveComparisons)}/${e.competitiveComparisons || 0} lần khách chọn sản phẩm`,
        e.competitiveComparisons >= 3,
      ),
      factor(
        'Bằng chứng khác biệt',
        diffScore,
        0.4,
        e.differentiationProof === 'measured'
          ? 'Khác biệt đã được đo bằng kết quả'
          : e.differentiationProof === 'customer-confirmed'
            ? 'Khác biệt được khách hàng xác nhận'
            : e.differentiationProof === 'claim'
              ? 'Mới là tuyên bố/giả thuyết'
              : 'Chưa có bằng chứng',
        e.differentiationProof === 'customer-confirmed' || e.differentiationProof === 'measured',
      ),
    ],
    [
      ...(e.competitiveComparisons < 3 ? ['Cần thêm tình huống khách hàng cân nhắc sản phẩm cùng lựa chọn thay thế.'] : []),
      ...(e.differentiationProof === 'none' || e.differentiationProof === 'claim'
        ? ['Điểm khác biệt chưa được khách hàng hoặc dữ liệu thực tế xác nhận.']
        : []),
    ],
  );

  const acquisitionStrength = countScore(e.acquisitionTests, 6);
  const channelStrength = countScore(e.repeatableChannels, 2);
  const payerScale = countScore(e.payingCustomers, 25);
  const marginTarget = grossMarginTarget(product.category);
  const marginScore =
    e.grossMarginPct === undefined ? 0 : Math.round(clamp((e.grossMarginPct / marginTarget) * 100));

  const marketScalability = buildCriterion(
    [
      factor(
        'Thử nghiệm kênh tăng trưởng',
        acquisitionStrength,
        0.25,
        `${e.acquisitionTests} thử nghiệm acquisition`,
        e.acquisitionTests >= 3,
      ),
      factor(
        'Kênh có tính lặp lại',
        channelStrength,
        0.3,
        `${e.repeatableChannels} kênh tạo khách lặp lại`,
        e.repeatableChannels >= 1,
      ),
      factor(
        'Quy mô khách trả tiền',
        payerScale,
        0.2,
        `${e.payingCustomers} khách trả tiền`,
        e.payingCustomers >= 10,
      ),
      factor(
        'Retention / mua lại',
        repeatRate,
        0.15,
        `${Math.min(e.repeatCustomers, e.payingCustomers)}/${e.payingCustomers || 0} khách quay lại`,
        e.payingCustomers >= 5,
      ),
      factor(
        'Biên gộp',
        marginScore,
        0.1,
        e.grossMarginPct === undefined
          ? 'Chưa nhập gross margin'
          : `${e.grossMarginPct}% gross margin; benchmark nội bộ ${marginTarget}% cho nhóm ngành`,
        e.grossMarginPct !== undefined,
      ),
    ],
    [
      ...(e.acquisitionTests < 3 ? ['Chưa thử đủ kênh để biết khả năng tăng trưởng có lặp lại.'] : []),
      ...(e.repeatableChannels < 1 ? ['Chưa có kênh acquisition nào chứng minh được tính lặp lại.'] : []),
      ...(e.grossMarginPct === undefined ? ['Chưa có gross margin để đánh giá economics khi scale.'] : []),
    ],
  );

  return {
    targetCustomerFit,
    painPointSolvability,
    pricingAndValue,
    competitiveMoat,
    marketScalability,
  };
}

export function buildEvaluationConfidence(
  product: Pick<Product, 'category' | 'evidence'>,
): EvaluationConfidence {
  const breakdown = buildEvaluationBreakdown(product);
  const criteria = Object.values(breakdown);
  const score = Math.round(criteria.reduce((sum, item) => sum + item.confidence, 0) / criteria.length);

  const e = normalizeEvidence(product.evidence);
  const knownSignals: string[] = [];
  const unknowns: string[] = [];

  if (e.customerInterviews > 0) knownSignals.push(`${e.customerInterviews} phỏng vấn khách hàng`);
  else unknowns.push('Chưa có phỏng vấn khách hàng');

  if (e.solutionTests > 0) knownSignals.push(`${e.solutionTests} lượt thử giải pháp`);
  else unknowns.push('Chưa có thử nghiệm giải pháp');

  if (e.pricingTests > 0) knownSignals.push(`${e.pricingTests} pricing test`);
  else unknowns.push('Chưa có pricing test');

  if (e.payingCustomers > 0) knownSignals.push(`${e.payingCustomers} khách trả tiền`);
  else unknowns.push('Chưa có khách trả tiền');

  if (e.competitiveComparisons > 0) knownSignals.push(`${e.competitiveComparisons} so sánh cạnh tranh thực tế`);
  else unknowns.push('Chưa có so sánh cạnh tranh thực tế');

  if (e.acquisitionTests > 0) knownSignals.push(`${e.acquisitionTests} thử nghiệm acquisition`);
  else unknowns.push('Chưa có thử nghiệm acquisition');

  if (e.grossMarginPct !== undefined) knownSignals.push(`Gross margin ${e.grossMarginPct}%`);
  else unknowns.push('Chưa có gross margin');

  return {
    score,
    level: score >= 70 ? 'Cao' : score >= 35 ? 'Trung bình' : 'Thấp',
    knownSignals,
    unknowns,
  };
}

function recommendationsFromEvidence(e: ProductEvidence) {
  const recs: ProductEvaluation['recommendations'] = [];

  if (e.customerInterviews < 10) {
    recs.push({
      area: 'Khách hàng',
      action: 'Phỏng vấn thêm khách hàng đúng phân khúc cho tới khi có tối thiểu 10 mẫu và ghi riêng số người xác nhận cùng pain point.',
      priority: 'Cao',
    });
  }
  if (e.solutionTests < 5) {
    recs.push({
      area: 'Giải pháp',
      action: 'Cho ít nhất 5 người dùng thử một workflow hoàn chỉnh và ghi outcome trước/sau thay vì chỉ hỏi cảm nhận.',
      priority: 'Cao',
    });
  }
  if (e.pricingTests < 5) {
    recs.push({
      area: 'Định giá',
      action: 'Chạy pricing test với mức giá cụ thể và ghi số người chấp nhận, không dùng câu hỏi “có mua không”.',
      priority: 'Cao',
    });
  }
  if (e.competitiveComparisons < 3) {
    recs.push({
      area: 'Cạnh tranh',
      action: 'Ghi ít nhất 3 tình huống khách cân nhắc sản phẩm cùng một lựa chọn thay thế và lý do họ chọn/bỏ.',
      priority: 'Trung bình',
    });
  }
  if (e.acquisitionTests < 3) {
    recs.push({
      area: 'Phân phối',
      action: 'Thử tối thiểu 3 kênh acquisition nhỏ, đo khách đủ chuẩn và khả năng lặp lại thay vì chỉ đo lượt xem.',
      priority: 'Trung bình',
    });
  }

  return recs;
}

export function generateDefaultEvaluation(
  product: Pick<Product, 'category'> & { evidence?: Partial<ProductEvidence> },
): ProductEvaluation {
  const evidence = normalizeEvidence(product.evidence);
  const breakdown = buildEvaluationBreakdown({ category: product.category, evidence });

  const scores: EvaluationScores = {
    targetCustomerFit: breakdown.targetCustomerFit.score,
    painPointSolvability: breakdown.painPointSolvability.score,
    pricingAndValue: breakdown.pricingAndValue.score,
    competitiveMoat: breakdown.competitiveMoat.score,
    marketScalability: breakdown.marketScalability.score,
  };

  const overallScore = calculateOverallScore(scores);
  const confidence = buildEvaluationConfidence({ category: product.category, evidence });
  const status =
    confidence.score >= 70 ? 'validated' : confidence.score >= 35 ? 'provisional' : 'insufficient';

  const verdict =
    status === 'insufficient'
      ? 'Chưa đủ bằng chứng để kết luận chất lượng sản phẩm. Điểm hiện tại chỉ phản ánh dữ liệu kiểm chứng đã nhập, không phải dự đoán thị trường.'
      : status === 'provisional'
        ? 'Đã có một số tín hiệu thực tế nhưng độ phủ bằng chứng còn thiếu. Có thể dùng điểm để định hướng thử nghiệm tiếp, chưa nên xem là kết luận.'
        : 'Dữ liệu đã phủ tương đối nhiều trụ cột. Tiếp tục theo dõi retention, economics và acquisition để giữ độ tin cậy của điểm số.';

  return {
    overallScore,
    ratingGrade: calculateGrade(overallScore),
    status,
    verdict,
    scores,
    confidence,
    breakdown,
    personas: [],
    swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    marketAnalysis: { tamSamSom: '', marketDrivers: [], adoptionBarriers: [] },
    competitorMatrix: [],
    recommendations: recommendationsFromEvidence(evidence),
    lastEvaluatedAt: new Date().toLocaleDateString('vi-VN'),
  };
}

export function recalculateProduct(product: Product): Product {
  const evidence = normalizeEvidence(product.evidence);
  const evaluation = generateDefaultEvaluation({ category: product.category, evidence });

  return {
    ...product,
    evidence,
    evaluation: {
      ...evaluation,
      personas: product.evaluation?.personas || [],
      swot: product.evaluation?.swot || evaluation.swot,
      marketAnalysis: product.evaluation?.marketAnalysis || evaluation.marketAnalysis,
      competitorMatrix: product.evaluation?.competitorMatrix || [],
      userNotes: product.evaluation?.userNotes,
    },
  };
}
