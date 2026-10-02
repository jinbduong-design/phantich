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
          error: 'GEMINI_API_KEY chưa được cấu hình.',
          fallbackAvailable: true,
        });
      }

      const { product } = req.body;
      if (!product?.name) {
        return res.status(400).json({ error: 'Thông tin sản phẩm không hợp lệ.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Bạn là Product Researcher. Nhiệm vụ của bạn KHÔNG PHẢI chấm điểm sản phẩm.
Điểm số của hệ thống được tính bằng engine xác định từ dữ liệu kiểm chứng thực tế.

Hãy đọc dữ liệu dưới đây và chỉ làm 2 việc:
1. Chỉ ra tối đa 5 rủi ro / giả định cần kiểm chứng tiếp.
2. Đề xuất tối đa 5 hành động kiểm chứng cụ thể.

QUY TẮC:
- Không tự tạo số liệu thị trường, TAM/SAM/SOM, doanh thu, tỷ lệ tăng trưởng, willingness-to-pay hoặc dữ liệu đối thủ.
- Không tạo persona giả, review giả hoặc lời chứng thực giả.
- Không nói một giả định là sự thật.
- Nếu dữ liệu chưa đủ, nói rõ dữ liệu nào đang thiếu.
- Hành động phải đo được: phỏng vấn bao nhiêu người, test gì, đo chỉ số nào.
- Không trả về score, grade, confidence hay dự đoán thành công.
- Trả JSON hợp lệ, không markdown.

SẢN PHẨM:
Tên: ${product.name}
Ngành: ${product.category}
Giai đoạn: ${product.stage}
Giá: ${product.pricing || 'Chưa có'}
Mô tả: ${product.description || 'Chưa có'}
Khách hàng mục tiêu: ${product.targetCustomerDescription || 'Chưa có'}
Đối thủ / cách thay thế: ${product.competitors || 'Chưa có'}

DỮ LIỆU KIỂM CHỨNG:
${JSON.stringify(product.evidence || {}, null, 2)}

OUTPUT:
{
  "risks": ["string"],
  "recommendations": [
    {
      "area": "Khách hàng | Giải pháp | Định giá | Cạnh tranh | Phân phối | Economics",
      "action": "string",
      "priority": "Cao | Trung bình | Thấp"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.15,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        analysis: {
          risks: Array.isArray(parsed.risks) ? parsed.risks.slice(0, 5) : [],
          recommendations: Array.isArray(parsed.recommendations)
            ? parsed.recommendations.slice(0, 5)
            : [],
        },
      });
    } catch (err: any) {
      console.error('Gemini analysis error:', err);
      return res.status(500).json({
        error: err.message || 'Không thể chạy AI analysis.',
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
