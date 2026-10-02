import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.post('/api/evaluate-ai', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm key vào mục Secrets.',
          fallbackAvailable: true,
        });
      }

      const { product } = req.body;
      if (!product || !product.name) {
        return res.status(400).json({ error: 'Thông tin sản phẩm không hợp lệ.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Bạn là Product Researcher và Product Strategist. Hãy thẩm định sản phẩm bên dưới bằng tiếng Việt.

QUY TẮC BẮT BUỘC:
1. Chỉ coi thông tin người dùng cung cấp là dữ liệu đã biết. Không được biến suy đoán thành sự thật.
2. Không tự bịa TAM/SAM/SOM, thu nhập, willingness-to-pay, thị phần, tăng trưởng ngành hoặc số liệu đối thủ.
3. Nếu thiếu bằng chứng, ghi rõ "chưa xác minh" và giảm confidence; không bù bằng lời văn dài.
4. Điểm số phải được hiệu chỉnh bảo thủ:
   - 0-39: rất yếu / gần như chưa có bằng chứng
   - 40-59: giả định hợp lý nhưng chưa được kiểm chứng
   - 60-74: có tín hiệu tốt nhưng còn khoảng trống quan trọng
   - 75-89: chỉ dùng khi đầu vào có bằng chứng rõ
   - 90-100: không dùng nếu chỉ có mô tả ý tưởng
5. Phân biệt rõ score (chất lượng giả thuyết) và confidence (mức độ chắc chắn của dữ liệu).
6. Persona, SWOT, competitor và review mô phỏng phải được ghi theo hướng giả thuyết cần xác minh, không giả làm dữ liệu thật.
7. Khuyến nghị phải là hành động kiểm chứng cụ thể, ưu tiên việc giúp giảm uncertainty lớn nhất.
8. Trả về JSON hợp lệ, không markdown.

THÔNG TIN SẢN PHẨM:
- Tên: ${product.name}
- Danh mục: ${product.category}
- Giai đoạn: ${product.stage}
- Giá / mô hình: ${product.pricing || 'Chưa xác định'}
- Mô tả: ${product.description || 'Chưa có'}
- Khách hàng mục tiêu: ${product.targetCustomerDescription || 'Chưa xác định'}
- Đối thủ / lựa chọn thay thế: ${product.competitors || 'Chưa xác định'}

OUTPUT:
{
  "verdict": "1-2 câu, nói rõ cơ hội chính + uncertainty lớn nhất",
  "scores": {
    "targetCustomerFit": 0,
    "painPointSolvability": 0,
    "pricingAndValue": 0,
    "competitiveMoat": 0,
    "marketScalability": 0
  },
  "confidence": {
    "score": 0,
    "knownSignals": ["dữ liệu thực sự có trong input"],
    "unknowns": ["điều cần xác minh tiếp"]
  },
  "personas": [
    {
      "name": "Tên vai trò, thêm '— giả thuyết' nếu chưa xác minh",
      "type": "Primary",
      "role": "Buyer / User / Influencer",
      "demographics": "Chỉ ghi điều có thể suy ra an toàn; nếu không thì 'Chưa xác minh'",
      "fitScore": 0,
      "painPoints": ["..."],
      "goals": ["..."],
      "buyingTriggers": ["..."],
      "objections": ["..."],
      "willingnessToPay": "Chưa xác minh hoặc mô tả giả thuyết, không bịa con số",
      "channels": ["Kênh giả thuyết cần kiểm chứng"]
    }
  ],
  "swot": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "opportunities": ["..."],
    "threats": ["..."]
  },
  "marketAnalysis": {
    "tamSamSom": "Nếu không có dữ liệu nguồn: 'Chưa đủ dữ liệu để ước tính đáng tin cậy.'",
    "marketDrivers": ["..."],
    "adoptionBarriers": ["..."]
  },
  "competitorMatrix": [
    {
      "name": "...",
      "comparison": "Nêu điều đã biết và điều chưa xác minh",
      "threatLevel": "Cao"
    }
  ],
  "recommendations": [
    {
      "area": "...",
      "action": "Một thử nghiệm hoặc bước nghiên cứu cụ thể",
      "priority": "Cao"
    }
  ],
  "simulatedReviews": [
    {
      "author": "Giả lập",
      "persona": "...",
      "rating": 3,
      "comment": "Phản hồi giả thuyết để gợi ý câu hỏi nghiên cứu, không phải review thật.",
      "sentiment": "Trung lập"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, analysis: parsed });
    } catch (err: any) {
      console.error('Gemini evaluation error:', err);
      return res.status(500).json({
        error:
          err.message ||
          'Lỗi khi phân tích bằng AI. Có thể dùng bộ đánh giá thuật toán tích hợp sẵn.',
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
