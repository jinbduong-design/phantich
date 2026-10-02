import { EvaluationScores, Product, ProductEvaluation, TargetPersona } from '../types/product';

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

export function getGradeColor(grade: 'A+' | 'A' | 'B' | 'C' | 'D'): { text: string; bg: string; border: string } {
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

export function generateDefaultEvaluation(
  product: Pick<Product, 'name' | 'category' | 'stage' | 'pricing' | 'description' | 'targetCustomerDescription' | 'competitors'>
): ProductEvaluation {
  // Compute initial scores based on completeness and category traits
  const descLen = (product.description || '').length;
  const targetLen = (product.targetCustomerDescription || '').length;
  const hasCompetitors = (product.competitors || '').trim().length > 0;
  const hasPricing = (product.pricing || '').trim().length > 0;

  const targetCustomerFit = Math.min(92, Math.max(65, 70 + Math.floor(targetLen / 15)));
  const painPointSolvability = Math.min(94, Math.max(68, 72 + Math.floor(descLen / 30)));
  const pricingAndValue = hasPricing ? 80 : 68;
  const competitiveMoat = hasCompetitors ? 76 : 64;
  const marketScalability = product.category === 'SaaS / B2B' ? 86 : 78;

  const scores: EvaluationScores = {
    targetCustomerFit,
    painPointSolvability,
    pricingAndValue,
    competitiveMoat,
    marketScalability,
  };

  const overallScore = calculateOverallScore(scores);
  const ratingGrade = calculateGrade(overallScore);

  const personas: TargetPersona[] = [
    {
      id: 'p-1',
      name: 'Nguyễn Văn Minh - Quản lý Vận hành / Ra quyết định chính',
      type: 'Primary',
      role: 'Decision Maker / Buyer',
      demographics: '30 - 45 tuổi, quản lý tại các doanh nghiệp vừa và nhỏ hoặc nhóm cấp tiến, thu nhập trung bình khá trở lên.',
      fitScore: 88,
      painPoints: [
        'Mất nhiều thời gian giải quyết quy trình thủ công hoặc công cụ rời rạc',
        'Chi phí triển khai giải pháp hiện hành trên thị trường quá cao hoặc cồng kềnh',
        'Thiếu công cụ chuẩn hóa giúp đồng bộ kết quả giữa các thành viên',
      ],
      goals: [
        'Tối ưu 40% thời gian xử lý công việc lặp lại',
        'Giảm thiểu tối đa lỗi phát sinh và chi phí ẩn',
        'Có báo cáo trực quan để báo cáo cấp trên hoặc đối tác',
      ],
      buyingTriggers: [
        'Được dùng thử (Free Trial/Demo) thấy hiệu quả tức thì',
        'Được chuyên gia trong ngành hoặc đồng nghiệp đáng tin cậy giới thiệu',
        'Chính sách giá rõ ràng, không chi phí phát sinh ẩn',
      ],
      objections: [
        'Lo ngại đội ngũ mất nhiều thời gian để thích nghi và chuyển đổi',
        'Đắn đo về tính bảo mật dữ liệu và độ bền vững lâu dài',
      ],
      willingnessToPay: 'Sẵn sàng chi trả mức giá đề xuất nếu chứng minh hoàn vốn ROI trong vòng 1-2 tháng.',
      channels: ['LinkedIn', 'Cộng đồng Chuyên môn Facebook', 'Google Search', 'Hội thảo / Sự kiện ngành'],
    },
    {
      id: 'p-2',
      name: 'Lê Thu Trang - Người thực thi trực tiếp',
      type: 'Secondary',
      role: 'End User / Advocate',
      demographics: '24 - 32 tuổi, chuyên viên thực hiện công việc hằng ngày, thành thạo công nghệ, coi trọng trải nghiệm mượt mà.',
      fitScore: 82,
      painPoints: [
        'Giao diện các công cụ cũ phức tạp, nhiều thao tác thừa gây ức chế',
        'Tốn thời gian tự mày mò xử lý khi gặp trục trặc',
      ],
      goals: [
        'Hoàn thành công việc nhanh, giao diện thân thiện, dễ nhìn',
        'Được hỗ trợ nhanh chóng khi có thắc mắc kỹ thuật',
      ],
      buyingTriggers: [
        'Trải nghiệm UX tinh gọn, hiện đại, không cần đọc hướng dẫn dày cộp',
        'Phím tắt hoặc luồng tự động giúp giải phóng sức lao động',
      ],
      objections: [
        'Sợ phần mềm mới phát sinh thêm việc báo cáo ngoài luồng',
      ],
      willingnessToPay: 'Thúc đẩy sếp hoặc công ty cấp ngân sách mua gói chuyên nghiệp.',
      channels: ['TikTok', 'YouTube Review', 'Nhóm Zalo / Telegram chuyên ngành'],
    },
  ];

  return {
    overallScore,
    ratingGrade,
    verdict: `Sản phẩm "${product.name}" sở hữu định vị rõ ràng và giải quyết bài toán thực tế. Cần tiếp tục làm sắc nét sự khác biệt trước các giải pháp thay thế và tối ưu hóa phễu chuyển đổi cho tệp khách hàng mục tiêu tiên phong.`,
    scores,
    personas,
    swot: {
      strengths: [
        'Giải quyết trực diện bài toán nhức nhối với cách tiếp cận tinh gọn',
        'Mô hình chi phí phù hợp, dễ tiếp cận hơn so với giải pháp lớn',
        'Tốc độ triển khai và khả năng thích ứng linh hoạt với thị trường',
      ],
      weaknesses: [
        'Thương hiệu còn mới, độ nhận diện chưa cao bằng các đối thủ lâu năm',
        'Nguồn lực chăm sóc khách hàng và đào tạo cần được mở rộng thêm',
        'Cần hoàn thiện thêm các tính năng tích hợp chuyên sâu',
      ],
      opportunities: [
        'Thị trường ngách chưa có đối thủ thống trị tuyệt đối với trải nghiệm tốt',
        'Xu hướng chuyển đổi số và nâng cấp tiêu dùng tăng mạnh tại Việt Nam & khu vực',
        'Khả năng mở rộng bán chéo hoặc nâng cấp gói dịch vụ giá trị gia tăng',
      ],
      threats: [
        'Đối thủ lớn có thể sao chép tính năng cốt lõi nếu không có rào cản độc quyền',
        'Khách hàng có thể trì hoãn chi tiêu khi kinh tế biến động',
      ],
    },
    marketAnalysis: {
      tamSamSom: 'TAM tiềm năng hàng triệu người dùng / doanh nghiệp tại Đông Nam Á. SOM mục tiêu chiếm 3-5% tệp khách hàng tiên phong trong 12 tháng đầu.',
      marketDrivers: [
        'Nhu cầu tự động hóa và nâng cao năng suất cá nhân / tổ chức ngày một khắt khe',
        'Sự sẵn sàng chi trả cho các sản phẩm chuyên biệt, thiết kế trải nghiệm xuất sắc',
      ],
      adoptionBarriers: [
        'Thói quen dùng giải pháp thủ công hoặc công cụ miễn phí có sẵn',
        'Thời gian tìm hiểu và cam kết của người mua ban đầu',
      ],
    },
    competitorMatrix: [
      {
        name: product.competitors ? product.competitors.split(',')[0].trim() : 'Các giải pháp truyền thống / Thủ công',
        comparison: 'Chậm chạp, chi phí cao hoặc rời rạc; sản phẩm của bạn vượt trội về tốc độ và chi phí tối ưu.',
        threatLevel: 'Trung bình',
      },
      {
        name: 'Công cụ quốc tế phổ biến',
        comparison: 'Nhiều tính năng nhưng thiếu sự thấu hiểu địa phương hóa và hỗ trợ trực tiếp.',
        threatLevel: 'Cao',
      },
    ],
    recommendations: [
      {
        area: 'Khách hàng mục tiêu',
        action: 'Tập trung toàn lực vào phân khúc Primary Persona trong giai đoạn đầu để đạt Product-Market Fit vững chắc trước khi mở rộng.',
        priority: 'Cao',
      },
      {
        area: 'Định giá & Đóng gói',
        action: 'Cung cấp gói dùng thử miễn phí hoặc bảo đảm hoàn tiền trong 14 ngày để gỡ bỏ rào cản tâm lý mua hàng ban đầu.',
        priority: 'Cao',
      },
      {
        area: 'Thông điệp truyền thông',
        action: 'Tập trung truyền thông vào kết quả cụ thể (ví dụ: "Tiết kiệm 5 giờ/tuần") thay vì chỉ liệt kê tính năng kỹ thuật.',
        priority: 'Trung bình',
      },
      {
        area: 'Rào cản cạnh tranh',
        action: 'Xây dựng cơ chế tích hợp dữ liệu hoặc cộng đồng người dùng trung thành để tạo hiệu ứng mạng lưới (Network Effect).',
        priority: 'Trung bình',
      },
    ],
    simulatedReviews: [
      {
        author: 'Trần Đăng Khoa',
        persona: 'Tech Early Adopter',
        rating: 5,
        comment: 'Sản phẩm trực quan, giải quyết đúng cái mình cần hằng ngày mà không bị rườm rà. Đáng giá từng đồng.',
        sentiment: 'Tích cực',
      },
      {
        author: 'Nguyễn Thị Bích Ngọc',
        persona: 'Quản lý Tài chính',
        rating: 4,
        comment: 'Rất tiềm năng! Nếu bổ sung thêm tính năng xuất báo cáo chuyên sâu và tích hợp linh hoạt hơn thì xuất sắc.',
        sentiment: 'Trung lập',
      },
      {
        author: 'Phạm Đức Huy',
        persona: 'Người dùng phổ thông',
        rating: 4,
        comment: 'Giao diện mượt mà, hỗ trợ nhiệt tình. Hy vọng mức giá duy trì ổn định không tăng quá nhanh sau đợt ra mắt.',
        sentiment: 'Tích cực',
      },
    ],
    lastEvaluatedAt: new Date().toLocaleDateString('vi-VN'),
  };
}
