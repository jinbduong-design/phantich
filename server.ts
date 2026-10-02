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

  // AI Evaluation API endpoint
  app.post('/api/evaluate-ai', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm key vào mục Secrets.',
          fallbackAvailable: true
        });
      }

      const { product, action } = req.body;
      if (!product || !product.name) {
        return res.status(400).json({ error: 'Thông tin sản phẩm không hợp lệ.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Bạn là chuyên gia thẩm định sản phẩm và chiến lược thị trường (Senior Product Manager & Market Strategist).
Hãy phân tích sản phẩm sau đây và đưa ra đánh giá chuyên sâu bằng tiếng Việt dưới định dạng JSON hợp lệ.

Thông tin sản phẩm:
- Tên sản phẩm: ${product.name}
- Danh mục: ${product.category}
- Giai đoạn: ${product.stage}
- Mức giá dự kiến / Mô hình: ${product.pricing || 'Chưa xác định'}
- Mô tả & Tính năng cốt lõi: ${product.description}
- Khách hàng mục tiêu sơ bộ: ${product.targetCustomerDescription || 'Chưa chi tiết'}
- Đối thủ cạnh tranh chính: ${product.competitors || 'Chưa xác định'}

Yêu cầu output JSON CỰC KỲ CHI TIẾT VÀ CHÍNH XÁC theo cấu trúc sau (không kèm markdown ngoài JSON):
{
  "overallScore": number (từ 50 đến 98),
  "verdict": "string (Tóm tắt nhận định tổng quan 2-3 câu ngắn gọn sắc sảo)",
  "scores": {
    "targetCustomerFit": number (0-100),
    "painPointSolvability": number (0-100),
    "pricingAndValue": number (0-100),
    "competitiveMoat": number (0-100),
    "marketScalability": number (0-100)
  },
  "personas": [
    {
      "name": "string (ví dụ: Hoàng Minh - Trưởng phòng Vận hành SME)",
      "type": "Primary" | "Secondary",
      "demographics": "string (Độ tuổi, nghề nghiệp, thu nhập, nơi sống)",
      "fitScore": number (0-100),
      "painPoints": ["string", "string", "string"],
      "goals": ["string", "string"],
      "buyingTriggers": ["string", "string"],
      "objections": ["string", "string"],
      "willingnessToPay": "string (ví dụ: Cao, chấp nhận 2-5tr/tháng nếu giải quyết triệt để)",
      "channels": ["string", "string"]
    },
    {
      "name": "string (Persona thứ 2)",
      "type": "Secondary",
      "demographics": "string",
      "fitScore": number (0-100),
      "painPoints": ["string", "string"],
      "goals": ["string", "string"],
      "buyingTriggers": ["string", "string"],
      "objections": ["string", "string"],
      "willingnessToPay": "string",
      "channels": ["string", "string"]
    }
  ],
  "swot": {
    "strengths": ["string", "string", "string"],
    "weaknesses": ["string", "string", "string"],
    "opportunities": ["string", "string", "string"],
    "threats": ["string", "string", "string"]
  },
  "marketAnalysis": {
    "tamSamSom": "string (Ước lượng quy mô và cơ hội thị trường)",
    "marketDrivers": ["string", "string"],
    "adoptionBarriers": ["string", "string"]
  },
  "competitorMatrix": [
    {
      "name": "string (Đối thủ 1)",
      "comparison": "string (Điểm mạnh/yếu so với sản phẩm này)",
      "threatLevel": "Cao" | "Trung bình" | "Thấp"
    },
    {
      "name": "string (Đối thủ 2)",
      "comparison": "string",
      "threatLevel": "Cao" | "Trung bình" | "Thấp"
    }
  ],
  "recommendations": [
    {
      "area": "Khách hàng mục tiêu",
      "action": "string",
      "priority": "Cao" | "Trung bình" | "Thấp"
    },
    {
      "area": "Định giá & Đóng gói",
      "action": "string",
      "priority": "Cao" | "Trung bình" | "Thấp"
    },
    {
      "area": "Tính năng & Trải nghiệm",
      "action": "string",
      "priority": "Cao" | "Trung bình" | "Thấp"
    },
    {
      "area": "Chiến lược Tiếp cận (GTM)",
      "action": "string",
      "priority": "Cao" | "Trung bình" | "Thấp"
    }
  ],
  "simulatedReviews": [
    {
      "author": "string",
      "persona": "string",
      "rating": number (1-5),
      "comment": "string",
      "sentiment": "Tích cực" | "Trung lập" | "Quan ngại"
    },
    {
      "author": "string",
      "persona": "string",
      "rating": number (1-5),
      "comment": "string",
      "sentiment": "Tích cực" | "Trung lập" | "Quan ngại"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, analysis: parsed });
    } catch (err: any) {
      console.error('Gemini evaluation error:', err);
      return res.status(500).json({
        error: err.message || 'Lỗi khi phân tích bằng AI. Có thể dùng bộ đánh giá thuật toán tích hợp sẵn.'
      });
    }
  });

  // Setup Vite in dev mode or static files in production
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

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
