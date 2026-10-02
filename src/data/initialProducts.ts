import { Product } from '../types/product';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AI ContractGuard',
    tagline: 'Phần mềm rà soát hợp đồng & cảnh báo rủi ro pháp lý tự động cho doanh nghiệp',
    category: 'SaaS / B2B',
    stage: 'Beta / Early Access',
    pricing: '1.490.000đ / tháng (Gói SME) - 4.900.000đ / tháng (Gói Pro Doanh nghiệp)',
    description:
      'Nền tảng trí tuệ nhân tạo chuyên biệt phân tích các điều khoản hợp đồng mua bán, hợp tác kinh doanh, lao động và NDA. Tự động so sánh với quy định pháp luật Việt Nam hiện hành, phát hiện 100+ bẫy điều khoản bất lợi, tính toán mức phạt tiềm ẩn và gợi ý văn bản sửa đổi ngay lập tức.',
    targetCustomerDescription:
      'Chủ doanh nghiệp nhỏ và vừa (SME), Giám đốc điều hành, Trưởng phòng mua hàng và chuyên viên pháp chế nội bộ không có ngân sách thuê luật sư văn phòng thường trực.',
    competitors: 'Luật sư tư vấn truyền thống, Ironclad, Robin AI (quốc tế), mẫu hợp đồng miễn phí trên mạng',
    createdAt: '2026-09-15',
    updatedAt: '2026-10-01',
    evaluation: {
      overallScore: 89,
      ratingGrade: 'A',
      verdict:
        'AI ContractGuard đánh trúng "điểm đau" chí mạng của các doanh nghiệp SME: sợ ký nhầm hợp đồng gây thiệt hại tài chính nhưng không đủ chi phí thuê luật sư nội bộ. Mức độ phù hợp với khách hàng mục tiêu rất cao (92/100). Cần chú trọng tính bảo mật và cam kết pháp lý để phá bỏ rào cản tâm lý e ngại dữ liệu nhạy cảm.',
      scores: {
        targetCustomerFit: 92,
        painPointSolvability: 94,
        pricingAndValue: 88,
        competitiveMoat: 82,
        marketScalability: 90,
      },
      personas: [
        {
          id: 'persona-1-1',
          name: 'Đặng Tuấn Anh - Giám đốc Công ty Xuất Nhập Khẩu 25 nhân sự',
          type: 'Primary',
          role: 'CEO & Quyết định Ngân sách',
          demographics: '38 tuổi, Hà Nội / TP.HCM, doanh thu 15-40 tỷ/năm, thường xuyên ký 15-20 hợp đồng đối tác mỗi tháng.',
          fitScore: 95,
          painPoints: [
            'Từng bị đối tác phạt hợp đồng 80 triệu đồng do điều khoản giao hàng mơ hồ trong quá khứ',
            'Chi phí thuê văn phòng luật sư mỗi lần rà soát từ 3 - 5 triệu đồng và mất 2-3 ngày chờ đợi',
            'Bản thân không rành thuật ngữ pháp lý nhưng phải trực tiếp ký duyệt',
          ],
          goals: [
            'Có kết quả rà soát cảnh báo rủi ro trong vòng 5 phút trước khi đặt bút ký',
            'Tiết kiệm ít nhất 70% chi phí pháp lý định kỳ hằng tháng',
            'Tự tin đàm phán lại các điều khoản bất lợi với đối tác lớn',
          ],
          buyingTriggers: [
            'Trải nghiệm tải lên 1 hợp đồng cũ và AI tìm ra đúng lỗi đã từng bị phạt trong quá khứ',
            'Được bảo chứng về bảo mật dữ liệu theo chuẩn mã hóa ngân hàng',
            'Chi phí tháng tương đương 1 buổi ăn trưa tiếp khách',
          ],
          objections: [
            'Sợ lộ bí mật kinh doanh, giá cả và thông tin đối tác lên máy chủ',
            'Băn khoăn: "Nếu AI chỉ sai dẫn đến kiện tụng thì ai chịu trách nhiệm?"',
          ],
          willingnessToPay: 'Rất cao (Sẵn sàng trả 2 - 5 triệu/tháng nếu chứng minh bảo vệ được hợp đồng)',
          channels: ['Hiệp hội Doanh nhân trẻ', 'LinkedIn', 'Báo Doanh nhân & Pháp luật', 'Hội thảo SME'],
        },
        {
          id: 'persona-1-2',
          name: 'Phạm Minh Hạnh - Trưởng nhóm Mua hàng & Vận hành',
          type: 'Secondary',
          role: 'Người dùng trực tiếp (End User)',
          demographics: '29 tuổi, chuyên đàm phán hợp đồng nhà cung cấp, áp lực chỉ tiêu tiến độ và chi phí.',
          fitScore: 86,
          painPoints: [
            'Nhà cung cấp thường gửi hợp đồng dài 20-30 trang vào cuối ngày và ép ký gấp',
            'Mất hàng giờ đọc từng dòng chữ nhỏ, dễ hoa mắt bỏ sót điều khoản phạt',
          ],
          goals: [
            'Có tóm tắt trực quan các điểm chính: phạt cọc, tiến độ thanh toán, bất khả kháng',
            'Xuất file chỉnh sửa gợi ý để gửi lại nhà cung cấp ngay trong buổi sáng',
          ],
          buyingTriggers: [
            'Giao diện trực quan tô đỏ điều khoản nguy hiểm, tô vàng điều khoản cần thương lượng',
            'Tính năng xuất ghi chú Word/PDF sạch đẹp gửi nội bộ',
          ],
          objections: [
            'Sợ sếp không chịu phê duyệt chi phí phần mềm mới',
          ],
          willingnessToPay: 'Đề xuất sếp chi tiền từ quỹ đào tạo & công cụ phòng ban.',
          channels: ['Nhóm Quản trị Mua hàng Việt Nam', 'Facebook Group Logistics & Supply Chain'],
        },
      ],
      swot: {
        strengths: [
          'Huấn luyện trên dữ liệu án lệ và Bộ luật Dân sự, Thương mại Việt Nam thực tế',
          'Tốc độ phân tích dưới 60 giây cho hợp đồng 30 trang',
          'Giao diện Tiếng Việt 100% thân thiện, không dùng thuật ngữ AI phức tạp',
          'Tích hợp sẵn tính năng gợi ý điều khoản đàm phán thay thế (redline clauses)',
        ],
        weaknesses: [
          'Chưa có thương hiệu nhận diện lớn như các công ty công nghệ đa quốc gia',
          'Cần chứng chỉ bảo mật quốc tế ISO 27001 để thuyết phục các tập đoàn lớn',
          'Chưa hỗ trợ các loại hợp đồng đặc thù sâu như M&A chứng khoán phức tạp',
        ],
        opportunities: [
          'Việt Nam có hơn 900.000 doanh nghiệp vừa và nhỏ chưa có luật sư nội bộ',
          'Chính phủ đẩy mạnh chuyển đổi số và tuân thủ pháp lý doanh nghiệp',
          'Tiềm năng hợp tác với các sàn thương mại điện tử B2B và ngân hàng doanh nghiệp',
        ],
        threats: [
          'Các mô hình LLM lớn tự do có thể ngày càng thông minh hơn nếu người dùng tự dùng prompt',
          'Sự dè dặt ban đầu của khối doanh nghiệp truyền thống đối với AI pháp lý',
        ],
      },
      marketAnalysis: {
        tamSamSom: 'TAM Việt Nam ước tính 450 tỷ VNĐ/năm cho dịch vụ pháp chế SME. SAM khoảng 90 tỷ VNĐ cho phân khúc SME thành thị công nghệ. SOM mục tiêu đạt 1.500 doanh nghiệp trả phí trong 2 năm (18 tỷ VNĐ).',
        marketDrivers: [
          'Áp lực giảm chi phí vận hành cố định trong bối cảnh cạnh tranh khốc liệt',
          'Số lượng tranh chấp thương mại hợp đồng gia tăng mạnh sau đại dịch',
        ],
        adoptionBarriers: [
          'Tâm lý quen nhờ người quen hoặc luật sư quen xem qua loa',
          'E ngại về bảo mật dữ liệu bí mật hợp đồng kinh doanh',
        ],
      },
      competitorMatrix: [
        {
          name: 'Văn phòng Luật sư truyền thống',
          comparison: 'Độ uy tín cao và có trách nhiệm pháp nhân, nhưng chi phí đắt đỏ (3-10tr/hợp đồng) và mất 2-4 ngày làm việc.',
          threatLevel: 'Trung bình',
        },
        {
          name: 'Công cụ quốc tế (Ironclad, Robin AI)',
          comparison: 'Tính năng quy trình mạnh nhưng giá bằng USD quá cao ($300+/tháng) và không hiểu sâu luật pháp Việt Nam.',
          threatLevel: 'Thấp',
        },
        {
          name: 'ChatGPT / Claude bản miễn phí',
          comparison: 'Miễn phí nhưng rủi ro rò rỉ dữ liệu cao, không có khuôn khổ đối chiếu luật pháp chuyên sâu và không trích xuất bảng so sánh redline chuẩn.',
          threatLevel: 'Cao',
        },
      ],
      recommendations: [
        {
          area: 'Khách hàng mục tiêu',
          action: 'Tập trung mũi nhọn vào nhóm ngành Bất động sản F&B Nhượng quyền và Xuất nhập khẩu vì mật độ hợp đồng rủi ro cao nhất.',
          priority: 'Cao',
        },
        {
          area: 'Gỡ rào cản bảo mật',
          action: 'Công bố cam kết pháp lý "Zero-Data Retention" (Xóa hợp đồng khỏi bộ nhớ ngay sau khi phân tích xong nếu người dùng yêu cầu).',
          priority: 'Cao',
        },
        {
          area: 'Chiến lược Định giá',
          action: 'Cho phép quét 2 hợp đồng đầu tiên hoàn toàn miễn phí không cần nhập thẻ tín dụng để khách hàng trải nghiệm sự kinh ngạc (Aha Moment).',
          priority: 'Cao',
        },
        {
          area: 'Đối tác chiến lược',
          action: 'Hợp tác với các hiệp hội doanh nghiệp trẻ hoặc công ty cung cấp chữ ký số (VNPT, Viettel, BKAV) để phân phối kèm.',
          priority: 'Trung bình',
        },
      ],
      simulatedReviews: [
        {
          author: 'Lê Hoàng Nam (CEO Logistics Nam Hải)',
          persona: 'Chủ doanh nghiệp SME',
          rating: 5,
          comment: 'Quá ấn tượng! Quét thử hợp đồng thuê kho bãi phát hiện ngay bên cho thuê gài điều khoản tăng giá 15% mỗi năm mà mình đọc lướt không thấy. Tiết kiệm ngay vài trăm triệu.',
          sentiment: 'Tích cực',
        },
        {
          author: 'Võ Thị Thanh Thảo',
          persona: 'Pháp chế nội bộ',
          rating: 4,
          comment: 'Rất tiện lợi cho việc sơ lọc tài liệu ban đầu. Giảm được 60% thời gian đọc vỡ lòng. Mong app cập nhật thêm mẫu hợp đồng lao động mới nhất.',
          sentiment: 'Tích cực',
        },
        {
          author: 'Ngô Quốc Cường',
          persona: 'Kế toán trưởng',
          rating: 4,
          comment: 'Giá 1.5tr/tháng rất hợp lý cho doanh nghiệp. Tuy nhiên cần thêm tính năng phân quyền nhiều tài khoản nhân viên trong cùng công ty.',
          sentiment: 'Trung lập',
        },
      ],
      lastEvaluatedAt: '01/10/2026',
    },
  },
  {
    id: 'prod-2',
    name: 'ErgoRest SmartDesk',
    tagline: 'Bàn làm việc công thái học thông minh tích hợp radar theo dõi dáng ngồi & tự động điều chỉnh',
    category: 'Công nghệ & IoT',
    stage: 'Đã ra mắt thị trường',
    pricing: '9.800.000đ - 14.500.000đ (Bao gồm bàn + Cảm biến radar + App bảo hành 5 năm)',
    description:
      'Bàn nâng hạ tự động cao cấp trang bị cảm biến vi sóng radar mmWave không tiếp xúc. Tự động nhận diện tư thế người ngồi (gù lưng, lệch cổ, ngồi quá 60 phút liên tục), nhẹ nhàng rung báo nhắc nhở và tự động chuyển sang chế độ đứng theo lộ trình công thái học cá nhân hóa qua app.',
    targetCustomerDescription:
      'Lập trình viên, kỹ sư phần mềm, nhà sáng tạo nội dung, nhân viên văn phòng làm việc remote/hybrid thu nhập từ 25 triệu/tháng, bắt đầu gặp vấn đề thoái hóa đốt sống cổ hoặc đau thắt lưng.',
    competitors: 'Bàn nâng hạ Epione, Ergoto, IKEA Bekant, Xiaomi Smart Desk',
    createdAt: '2026-08-20',
    updatedAt: '2026-09-28',
    evaluation: {
      overallScore: 84,
      ratingGrade: 'A',
      verdict:
        'Sản phẩm đón đầu làn sóng chăm sóc sức khỏe chủ động (Wellness Tech) của giới tri thức trẻ. Sự kết hợp giữa phần cứng bền bỉ và cảm biến radar không cần đeo phụ kiện là điểm bán hàng độc nhất (USP). Cần chứng minh tính bền của motor và xây dựng cộng đồng người dùng tích cực.',
      scores: {
        targetCustomerFit: 88,
        painPointSolvability: 85,
        pricingAndValue: 80,
        competitiveMoat: 86,
        marketScalability: 80,
      },
      personas: [
        {
          id: 'persona-2-1',
          name: 'Trần Vũ Phong - Senior Backend Engineer (Remote)',
          type: 'Primary',
          role: 'Người mua & Sử dụng trực tiếp',
          demographics: '31 tuổi, TP.HCM, làm việc cho công ty công nghệ nước ngoài, thu nhập 55 triệu/tháng, ngồi máy tính 10-12 giờ/ngày.',
          fitScore: 92,
          painPoints: [
            'Bị đau mỏi vai gáy kinh niên, đã đi vật lý trị liệu nhiều lần nhưng tái phát do ngồi sai tư thế',
            'Từng mua bàn nâng hạ thường nhưng lười bấm nút nên suốt ngày chỉ ngồi một chỗ',
            'Không muốn phải đeo đồng hồ hay vòng tay lúc làm việc ở nhà vì vướng víu',
          ],
          goals: [
            'Tự động duy trì chu kỳ 45 phút ngồi - 15 phút đứng mà không cần canh giờ',
            'Không gian làm việc setup góc máy tối giản (clean desk aesthetic), thẩm mỹ cao',
            'Theo dõi chỉ số cải thiện tư thế theo tuần để có động lực sống khỏe',
          ],
          buyingTriggers: [
            'Xem video trải nghiệm setup thực tế trên YouTube của các tech YouTuber uy tín',
            'Cảm biến radar không gắn camera nên không sợ bị quay lén trong phòng riêng',
            'Chính sách dùng thử tại nhà 30 ngày đổi trả miễn phí',
          ],
          objections: [
            'Giá 12 triệu cao hơn gấp rưỡi các bàn nâng hạ phổ thông trên thị trường (7-8 triệu)',
            'Sợ motor hỏng sau 1-2 năm sử dụng',
          ],
          willingnessToPay: 'Sẵn sàng chi 10-15 triệu nếu bàn êm, bảo hành tại nhà trên 3 năm.',
          channels: ['Nhóm Nghiện Setup', 'Voz / Tinhte', 'YouTube Review Công nghệ', 'Threads'],
        },
        {
          id: 'persona-2-2',
          name: 'Nguyễn Bích Thủy - Quản lý Trải nghiệm Nhân viên (HR Lead công ty Tech)',
          type: 'Secondary',
          role: 'B2B Purchaser / Phúc lợi văn phòng',
          demographics: '34 tuổi, phụ trách văn phòng cho công ty 120 nhân sự trẻ.',
          fitScore: 78,
          painPoints: [
            'Nhân viên hay than phiền đau lưng, nghỉ ốm vặt ảnh hưởng tiến độ dự án',
            'Muốn tạo văn phòng hiện đại hấp dẫn nhân tài công nghệ gia nhập',
          ],
          goals: [
            'Gói mua sắm số lượng lớn chiết khấu tốt, hỗ trợ lắp đặt trọn gói',
            'Báo cáo tổng kết độ hài lòng nhân viên',
          ],
          buyingTriggers: ['Chính sách bảo trì định kỳ doanh nghiệp và hóa đơn VAT đầy đủ'],
          objections: ['Ngân sách văn phòng đầu năm có hạn'],
          willingnessToPay: 'Thương lượng chiết khấu theo lô 10-20 chiếc.',
          channels: ['LinkedIn Recruiter', 'Hội đồng Nhân sự Vietnam HR', 'Triển lãm Thiết bị Văn phòng'],
        },
      ],
      swot: {
        strengths: [
          'Công nghệ cảm biến radar mmWave không xâm phạm quyền riêng tư (không camera)',
          'Động cơ kép nâng hạ êm ái < 42dB, tải trọng 120kg',
          'Ứng dụng điều khiển kết nối Bluetooth/Wifi mượt mà, ghi nhận dữ liệu calo tiêu hao',
        ],
        weaknesses: [
          'Giá thành cao so với mặt bằng bàn văn phòng truyền thống',
          'Khối lượng nặng, chi phí logistics và lắp đặt cồng kềnh',
          'Người dùng phổ thông có thể chưa hiểu rõ lợi ích của radar mmWave so với bàn bấm nút cơ',
        ],
        opportunities: [
          'Xu hướng Work From Home và văn phòng công thái học bùng nổ tại các đô thị lớn',
          'Khả năng mở rộng hệ sinh thái ghế công thái học, đèn bàn thông minh đồng bộ',
        ],
        threats: [
          'Các thương hiệu bàn nâng hạ giá rẻ Trung Quốc bán phá giá trên Shopee/Lazada',
          'Lạm phát khiến người tiêu dùng cắt giảm chi tiêu đồ nội thất cao cấp',
        ],
      },
      marketAnalysis: {
        tamSamSom: 'Quy mô thị trường nội thất công thái học Việt Nam đạt 1.200 tỷ VNĐ và tăng trưởng 18%/năm. Phân khúc smart-desk cao cấp chiếm khoảng 150 tỷ VNĐ.',
        marketDrivers: [
          'Gia tăng các bệnh lý văn phòng và nhận thức sức khỏe sớm của thế hệ Millennial / Gen Z',
          'Trào lưu decor góc làm việc công nghệ chất lượng cao (Home Workspace)',
        ],
        adoptionBarriers: [
          'Rào cản giá ban đầu trên 10 triệu đồng',
          'Khách hàng muốn trải nghiệm trực tiếp trước khi mua nhưng thiếu showroom rộng khắp',
        ],
      },
      competitorMatrix: [
        {
          name: 'Epione / Ergoto bàn nâng hạ cơ',
          comparison: 'Thương hiệu phổ biến, giá mềm hơn 20-30%, nhưng người dùng phải tự nhớ bấm nút, tỷ lệ bỏ cuộc sau 1 tháng rất cao.',
          threatLevel: 'Cao',
        },
        {
          name: 'IKEA Bekant / Idasen',
          comparison: 'Thương hiệu quốc tế nhưng thiết kế cũ, không có tính năng thông minh nhắc nhở tư thế.',
          threatLevel: 'Trung bình',
        },
      ],
      recommendations: [
        {
          area: 'Trải nghiệm Khách hàng',
          action: 'Mở các pop-up booth trải nghiệm tại các Co-working Space lớn ở Hà Nội & TP.HCM (như Toong, Dreamplex) để khách ngồi thử trực tiếp.',
          priority: 'Cao',
        },
        {
          area: 'Chính sách Bán hàng',
          action: 'Triển khai chính sách trả góp 0% lãi suất qua thẻ tín dụng và chương trình "30 ngày dùng thử miễn phí tại nhà".',
          priority: 'Cao',
        },
        {
          area: 'Content & Tiếp thị',
          action: 'Tập trung sáng tạo video so sánh: "Bàn nâng hạ thường mua về để quên vs Bàn thông minh tự nhắc nhở chăm sóc cột sống".',
          priority: 'Trung bình',
        },
      ],
      simulatedReviews: [
        {
          author: 'Lâm Hoàng Triết (Software Architect)',
          persona: 'Kỹ sư công nghệ',
          rating: 5,
          comment: 'Đắt nhưng xắt ra miếng! Trước đây mình lười đứng lên lắm, từ ngày bàn tự rung nhẹ và nâng lên đúng giờ, lưng đỡ mỏi hẳn. Tiết kiệm tiền đi châm cứu.',
          sentiment: 'Tích cực',
        },
        {
          author: 'Đỗ Quỳnh Chi (Content Creator)',
          persona: 'Nhà sáng tạo nội dung',
          rating: 4,
          comment: 'Mặt bàn gỗ sồi rất đẹp và đầm, motor êm không nghe tiếng động. Trừ 1 sao vì hôm lắp đặt thợ đến trễ 30 phút.',
          sentiment: 'Tích cực',
        },
        {
          author: 'Vũ Mạnh Hùng',
          persona: 'Khách hàng phân vân giá',
          rating: 3,
          comment: 'Chức năng radar hay thật, nhưng giá gần 12 triệu thì vẫn hơi chát với đại đa số người làm văn phòng thông thường.',
          sentiment: 'Trung lập',
        },
      ],
      lastEvaluatedAt: '28/09/2026',
    },
  },
  {
    id: 'prod-3',
    name: 'NutsPure Healthy Bar',
    tagline: 'Thanh hạt năng lượng thuần tự nhiên từ nông sản sạch Việt Nam không đường tinh luyện',
    category: 'F&B & Ẩm thực',
    stage: 'MVP thử nghiệm',
    pricing: '28.000đ / thanh (35g) - 299.000đ / hộp 12 thanh',
    description:
      'Thanh ngũ cốc hạt dinh dưỡng cao cấp kết hợp macca Tây Nguyên, hạt sen Đồng Tháp, gạo lứt huyết rồng và mật hoa dừa tự nhiên. Giàu đạm thực vật, chất xơ hòa tan, chỉ số đường huyết GI thấp, tiện lợi thay thế bữa phụ cho người tập luyện và ăn kiêng lành mạnh.',
    targetCustomerDescription:
      'Phụ nữ văn phòng 22 - 38 tuổi, người tập gym/yoga/chạy bộ, người theo lối sống Healthy & Eat Clean tại các thành phố lớn.',
    competitors: 'Thanh hạt Play Nutrition, FitNuts, thanh năng lượng nhập khẩu Nature Valley, đồ ăn vặt truyền thống',
    createdAt: '2026-09-01',
    updatedAt: '2026-09-25',
    evaluation: {
      overallScore: 82,
      ratingGrade: 'A',
      verdict:
        'Sản phẩm đáp ứng trọn vẹn thị hiếu tiêu dùng lành mạnh đang bùng nổ tại Việt Nam. Điểm sáng là tận dụng nông sản đặc sản địa phương (mật hoa dừa, sen Đồng Tháp) tạo tính bản địa sâu sắc. Cần tối ưu kênh phân phối bán lẻ (Convenience Store / Gym) để đạt tần suất mua lại cao.',
      scores: {
        targetCustomerFit: 89,
        painPointSolvability: 82,
        pricingAndValue: 84,
        competitiveMoat: 74,
        marketScalability: 81,
      },
      personas: [
        {
          id: 'persona-3-1',
          name: 'Hoàng Mai Lan - Nhân viên Marketing & Tín đồ Yoga',
          type: 'Primary',
          role: 'Người tiêu dùng thường xuyên',
          demographics: '27 tuổi, Quận 1 TP.HCM, thu nhập 18 triệu/tháng, tập yoga 4 buổi/tuần, rất quan tâm đến bảng thành phần dinh dưỡng (Nutrition Facts).',
          fitScore: 94,
          painPoints: [
            'Bữa xế lúc 4h chiều hay bị đói và thèm trà sữa / bánh ngọt làm phá vỡ chế độ giữ dáng',
            'Các thanh năng lượng nhập khẩu quá ngọt gắt, nhiều đường siro bắp và chất bảo quản',
            'Không có thời gian tự chuẩn bị đồ ăn vặt lành mạnh ở nhà mang theo',
          ],
          goals: [
            'Có một món ăn vặt ngon miệng, no lâu, calo dưới 160 kcal không gây béo',
            'Ủng hộ sản phẩm nông sản sạch của người Việt có nguồn gốc rõ ràng',
          ],
          buyingTriggers: [
            'Vị ngọt thanh nhẹ tự nhiên từ mật hoa dừa, cắn giòn không bị dính răng',
            'Bao bì đẹp mắt, nhỏ gọn để vừa túi xách mang đi làm',
            'Được các huấn luyện viên Yoga / Fitness review tích cực',
          ],
          objections: [
            'Giá 28.000đ/thanh cao hơn bánh kẹo thông thường ngoài tiệm tạp hóa (10-15k)',
            'Sợ mua cả hộp ăn không hết bị ỉu do khí hậu nóng ẩm',
          ],
          willingnessToPay: 'Sẵn sàng mua 1-2 hộp mỗi tháng làm bữa phụ thường nhật.',
          channels: ['Instagram Foodie', 'TikTok Healthy Lifestyle', 'Phòng tập Yoga / Pilates', 'Cửa hàng Annam Gourmet'],
        },
      ],
      swot: {
        strengths: [
          'Công thức không đường tinh luyện, 100% nguyên liệu nông sản Việt cao cấp',
          'Vị ngọt dịu hợp khẩu vị người Á Đông, không ngọt khé cổ như thanh hạt phương Tây',
          'Hàm lượng chất xơ cao giúp tạo cảm giác no tự nhiên kéo dài 3-4 tiếng',
        ],
        weaknesses: [
          'Hạn sử dụng ngắn hơn (6 tháng) do không dùng chất bảo quản hóa học',
          'Chi phí nguyên liệu macca và mật hoa dừa nguyên chất khiến giá thành khó hạ xuống mức siêu rẻ',
        ],
        opportunities: [
          'Thị trường thực phẩm sức khỏe & ăn kiêng tăng trưởng trên 25% mỗi năm tại Việt Nam',
          'Hợp tác đưa vào quầy lễ tân các chuỗi phòng tập gym cao cấp (California, Elite) và chuỗi cà phê',
        ],
        threats: [
          'Rào cản gia nhập ngành F&B thanh hạt tương đối thấp, dễ bị các xưởng gia công nhái mẫu mã',
          'Cạnh tranh từ các ông lớn bánh kẹo truyền thống chuyển dịch sang mảng healthy',
        ],
      },
      marketAnalysis: {
        tamSamSom: 'Thị trường Healthy Snacks tại các đô thị Việt Nam ước đạt 2.500 tỷ VNĐ. Tệp khách hàng tập luyện thể thao và phụ nữ văn phòng chiếm 600 tỷ VNĐ.',
        marketDrivers: [
          'Xu hướng phòng ngừa bệnh chuyển hóa và ý thức vóc dáng ngày càng cao ở độ tuổi 20-40',
          'Thói quen mua sắm tiện lợi qua các nền tảng thương mại điện tử và siêu thị mini',
        ],
        adoptionBarriers: [
          'Khách hàng chưa thử chưa biết vị có hợp miệng hay không',
          'Độ phủ sóng tại các điểm bán vật lý ban đầu còn hạn chế',
        ],
      },
      competitorMatrix: [
        {
          name: 'Play Nutrition',
          comparison: 'Thương hiệu tiên phong nhận diện cao, nhưng vị ngọt còn đậm và bao bì phong cách thể thao nam tính.',
          threatLevel: 'Cao',
        },
        {
          name: 'Bánh hạt nhập khẩu (Nature Valley, Be-Kind)',
          comparison: 'Đắt đỏ (45-60k/thanh), ngọt gắt và hạn sử dụng lâu do vận chuyển biển xa.',
          threatLevel: 'Trung bình',
        },
      ],
      recommendations: [
        {
          area: 'Trải nghiệm Dùng thử',
          action: 'Phát mẫu thử (Sampling) kèm voucher giảm 20% tại các sự kiện chạy bộ Marathon và lớp học Yoga cuối tuần.',
          priority: 'Cao',
        },
        {
          area: 'Kênh Phân phối',
          action: 'Đưa sản phẩm vào các chuỗi cửa hàng tiện lợi như FamilyMart, GS25, Circle K khu vực văn phòng.',
          priority: 'Cao',
        },
        {
          area: 'Bao bì & Đóng gói',
          action: 'Bổ sung phiên bản hộp quà tặng hỗn hợp (Mix vị) để khách hàng dễ dàng trải nghiệm nhiều hương vị cùng lúc.',
          priority: 'Trung bình',
        },
      ],
      simulatedReviews: [
        {
          author: 'Bùi Phương Anh',
          persona: 'Tập Gym & Eat Clean',
          rating: 5,
          comment: 'Ăn ngon bất ngờ! Hạt macca với sen bùi béo, ngọt dịu từ mật dừa chứ không ngọt gắt đường. Chiều nào đói làm 1 thanh là tỉnh táo làm việc tiếp.',
          sentiment: 'Tích cực',
        },
        {
          author: 'Lê Tiến Dũng',
          persona: 'Chạy bộ phong trào',
          rating: 4,
          comment: 'Tiện bỏ túi quần lúc chạy trail dài. Không bị chảy dính như thanh sô-cô-la. Giá mềm thêm chút nữa thì hoàn hảo.',
          sentiment: 'Tích cực',
        },
      ],
      lastEvaluatedAt: '25/09/2026',
    },
  },
];
