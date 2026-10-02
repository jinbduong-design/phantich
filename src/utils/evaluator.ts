import {
  EvaluationConfidence,
  EvaluationScores,
  Product,
  ProductEvaluation,
  TargetPersona,
} from '../types/product';

export function calculateOverallScore(scores: EvaluationScores): number {
  const weighted =
    scores.targetCustomerFit * 0.25 +
    scores.painPointSolvability * 0.20 +
    scores.pricingAndValue * 0.20 +
    scores.competitiveMoat * 0.20 +
    scores.marketScalability * 0.15;

  return Math.round(weighted);
}

export function calculateGrade(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 68) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

export function getGradeColor(grade: 'A+' | 'A' | 'B' | 'C' | 'D'): {
  text: string;
  bg: string;
  border: string;
} {
  switch (grade) {
    case 'A+':
    case 'A':
      return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'B':
      return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'C':
      return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'D':
    default:
      return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
  }
}

const hasValue = (value?: string) => Boolean(value && value.trim().length >= 3);

export function buildEvaluationConfidence(
  product: Pick<
    Product,
    'description' | 'targetCustomerDescription' | 'pricing' | 'competitors' | 'stage'
  >,
): EvaluationConfidence {
  const knownSignals: string[] = [];
  const unknowns: string[] = [];

  if (hasValue(product.targetCustomerDescription)) {
    knownSignals.push('Đã mô tả khách hàng mục tiêu');
  } else {
    unknowns.push('Khách hàng mục tiêu chưa đủ rõ');
  }

  if (hasValue(product.description)) {
    knownSignals.push('Đã mô tả vấn đề và giải pháp');
  } else {
    unknowns.push('Vấn đề/giải pháp chưa có dữ liệu');
  }

  if (hasValue(product.pricing)) {
    knownSignals.push('Đã có giả định về giá');
  } else {
    unknowns.push('Chưa có giả định hoặc kiểm chứng mức giá');
  }

  if (hasValue(product.competitors)) {
    knownSignals.push('Đã xác định ít nhất một lựa chọn thay thế/đối thủ');
  } else {
    unknowns.push('Chưa xác định lựa chọn thay thế/đối thủ');
  }

  const maturityBonus =
    product.stage === 'Tăng trưởng mở rộng'
      ? 10
      : product.stage === 'Đã ra mắt thị trường'
        ? 8
        : product.stage === 'Beta / Early Access'
          ? 5
          : product.stage === 'MVP thử nghiệm'
            ? 3
            : 0;

  // Input completeness can support a medium-confidence baseline, but never
  // high confidence by itself. Real customer/market evidence should be added
  // in later validation versions.
  const score = Math.min(74, 20 + knownSignals.length * 11 + maturityBonus);
  const level: EvaluationConfidence['level'] =
    score >= 80 ? 'Cao' : score >= 50 ? 'Trung bình' : 'Thấp';

  return { score, level, knownSignals, unknowns };
}

export function generateDefaultEvaluation(
  product: Pick<
    Product,
    | 'name'
    | 'category'
    | 'stage'
    | 'pricing'
    | 'description'
    | 'targetCustomerDescription'
    | 'competitors'
  >,
): ProductEvaluation {
  const hasTarget = hasValue(product.targetCustomerDescription);
  const hasDescription = hasValue(product.description);
  const hasPricing = hasValue(product.pricing);
  const hasCompetitors = hasValue(product.competitors);

  // Conservative baseline: presence of text only establishes that an input
  // exists. It does not prove demand, willingness to pay or defensibility.
  const scores: EvaluationScores = {
    targetCustomerFit: hasTarget ? 58 : 36,
    painPointSolvability: hasDescription ? 56 : 36,
    pricingAndValue: hasPricing ? 52 : 34,
    competitiveMoat: hasCompetitors ? 48 : 32,
    marketScalability:
      product.stage === 'Tăng trưởng mở rộng'
        ? 62
        : product.stage === 'Đã ra mắt thị trường'
          ? 58
          : product.category === 'SaaS / B2B'
            ? 55
            : 50,
  };

  const overallScore = calculateOverallScore(scores);
  const ratingGrade = calculateGrade(overallScore);
  const confidence = buildEvaluationConfidence(product);

  const personas: TargetPersona[] = [
    {
      id: 'p-1',
      name: 'Người mua chính — cần xác minh',
      type: 'Primary',
      role: 'Decision Maker / Buyer',
      demographics: product.targetCustomerDescription || 'Chưa có mô tả đủ rõ.',
      fitScore: hasTarget ? 60 : 40,
      painPoints: ['Giả định pain point hiện dựa trên mô tả đầu vào, chưa phải bằng chứng phỏng vấn.'],
      goals: ['Xác định kết quả mà khách hàng thực sự sẵn sàng trả tiền để đạt được.'],
      buyingTriggers: ['Bằng chứng giá trị rõ ràng', 'Rủi ro thử nghiệm thấp'],
      objections: ['Chưa có bằng chứng đủ mạnh về nhu cầu và mức sẵn sàng chi trả.'],
      willingnessToPay: 'Chưa xác minh. Cần pricing test hoặc phỏng vấn có cấu trúc.',
      channels: ['Cần xác minh theo hành vi thật của phân khúc'],
    },
    {
      id: 'p-2',
      name: 'Người dùng trực tiếp — cần xác minh',
      type: 'Secondary',
      role: 'End User',
      demographics: 'Chưa đủ dữ liệu để xác định chính xác.',
      fitScore: 50,
      painPoints: ['Cần xác minh workflow và mức độ đau hiện tại.'],
      goals: ['Hoàn thành công việc nhanh hơn hoặc tốt hơn giải pháp hiện tại.'],
      buyingTriggers: ['Trải nghiệm dễ hiểu', 'Kết quả thấy được sớm'],
      objections: ['Chi phí chuyển đổi và thay đổi thói quen.'],
      willingnessToPay: 'Chưa xác minh.',
      channels: ['Cần nghiên cứu'],
    },
  ];

  const namedCompetitor = product.competitors?.split(',')[0]?.trim();

  return {
    overallScore,
    ratingGrade,
    confidence,
    verdict:
      confidence.level === 'Thấp'
        ? 'Đây mới là điểm baseline. Dữ liệu đầu vào chưa đủ để kết luận mạnh; ưu tiên xác minh khách hàng, mức giá và lựa chọn thay thế trước khi tăng điểm.'
        : 'Điểm hiện tại phản ánh giả định có cấu trúc, chưa phải bằng chứng thị trường. Hãy dùng phần còn thiếu dữ liệu để chọn thử nghiệm tiếp theo.',
    scores,
    personas,
    swot: {
      strengths: ['Đã có khung giả định ban đầu để bắt đầu kiểm chứng.'],
      weaknesses: ['Chưa có dữ liệu thực tế đủ mạnh để chứng minh nhu cầu, giá và lợi thế cạnh tranh.'],
      opportunities: ['Có thể tăng nhanh độ tin cậy bằng phỏng vấn, landing test và pricing test.'],
      threats: ['Đánh giá quá cao khi chưa có bằng chứng có thể dẫn tới đầu tư sai ưu tiên.'],
    },
    marketAnalysis: {
      tamSamSom: 'Chưa đủ dữ liệu nguồn để ước tính TAM / SAM / SOM đáng tin cậy.',
      marketDrivers: ['Cần bổ sung dữ liệu thị trường có nguồn và ngày cập nhật.'],
      adoptionBarriers: ['Chưa xác minh rào cản chuyển đổi, ngân sách và hành vi mua.'],
    },
    competitorMatrix: [
      {
        name: namedCompetitor || 'Lựa chọn thay thế hiện tại',
        comparison: 'Chưa đủ bằng chứng để kết luận vượt trội. Cần so sánh theo giá, outcome, switching cost và kênh phân phối.',
        threatLevel: 'Trung bình',
      },
    ],
    recommendations: [
      {
        area: 'Khách hàng',
        action: 'Phỏng vấn 5–10 người đúng phân khúc và ghi lại pain, workflow hiện tại, trigger mua và objection.',
        priority: 'Cao',
      },
      {
        area: 'Định giá',
        action: 'Chạy pricing test hoặc hỏi willingness-to-pay theo khoảng giá thay vì chỉ hỏi “có mua không”.',
        priority: 'Cao',
      },
      {
        area: 'Cạnh tranh',
        action: 'So sánh ít nhất 3 lựa chọn thay thế theo outcome, giá, thời gian triển khai và switching cost.',
        priority: 'Trung bình',
      },
    ],
    simulatedReviews: [
      {
        author: 'Giả lập',
        persona: 'Khách hàng mục tiêu',
        rating: 3,
        comment: 'Đây là phản hồi giả định để kiểm tra câu hỏi nghiên cứu, không được xem là review thật.',
        sentiment: 'Trung lập',
      },
    ],
    lastEvaluatedAt: new Date().toLocaleDateString('vi-VN'),
  };
}
