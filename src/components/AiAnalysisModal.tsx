import React, { useState, useEffect } from 'react';
import { Product, ProductEvaluation } from '../types/product';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { calculateGrade, generateDefaultEvaluation } from '../utils/evaluator';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onApplyAnalysis: (updatedEvaluation: ProductEvaluation) => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  product,
  onApplyAnalysis,
}) => {
  if (!isOpen || !product) return null;

  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultEvaluation, setResultEvaluation] = useState<ProductEvaluation | null>(null);

  const steps = [
    'Phân tích định vị sản phẩm & tính năng cốt lõi...',
    'Xây dựng hồ sơ chân dung khách hàng mục tiêu (Primary & Secondary Personas)...',
    'Kiểm định độ nhạy giá, rào cản chuyển đổi & động lực mua hàng...',
    'Thiết lập ma trận SWOT & phân tích hào nước cạnh tranh...',
    'Tổng hợp bảng điểm 5 trụ cột và kết luận thẩm định...',
  ];

  const runAnalysis = async () => {
    setStatus('running');
    setCurrentStep(0);
    setErrorMessage('');

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/evaluate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ (${response.status})`);
      }

      const data = await response.json();
      if (!data.success || !data.analysis) {
        throw new Error('Dữ liệu phân tích trả về không đúng định dạng');
      }

      const raw = data.analysis;
      const scores = {
        targetCustomerFit: raw.scores?.targetCustomerFit ?? 85,
        painPointSolvability: raw.scores?.painPointSolvability ?? 85,
        pricingAndValue: raw.scores?.pricingAndValue ?? 80,
        competitiveMoat: raw.scores?.competitiveMoat ?? 75,
        marketScalability: raw.scores?.marketScalability ?? 80,
      };

      const overallScore = raw.overallScore ?? 82;
      const ratingGrade = calculateGrade(overallScore);

      const parsedEval: ProductEvaluation = {
        overallScore,
        ratingGrade,
        verdict: raw.verdict || 'Sản phẩm có tiềm năng tốt trên thị trường mục tiêu.',
        scores,
        personas: (raw.personas || []).map((p: any, i: number) => ({
          id: `ai-p-${i}-${Date.now()}`,
          name: p.name || 'Khách hàng tiềm năng',
          type: p.type === 'Primary' ? 'Primary' : 'Secondary',
          role: p.role || 'Người dùng',
          demographics: p.demographics || 'Nhân khẩu học chưa xác định',
          fitScore: p.fitScore ?? 85,
          painPoints: p.painPoints || [],
          goals: p.goals || [],
          buyingTriggers: p.buyingTriggers || [],
          objections: p.objections || [],
          willingnessToPay: p.willingnessToPay || 'Trung bình',
          channels: p.channels || [],
        })),
        swot: {
          strengths: raw.swot?.strengths || [],
          weaknesses: raw.swot?.weaknesses || [],
          opportunities: raw.swot?.opportunities || [],
          threats: raw.swot?.threats || [],
        },
        marketAnalysis: {
          tamSamSom: raw.marketAnalysis?.tamSamSom || 'Thị trường tiềm năng rộng lớn.',
          marketDrivers: raw.marketAnalysis?.marketDrivers || [],
          adoptionBarriers: raw.marketAnalysis?.adoptionBarriers || [],
        },
        competitorMatrix: raw.competitorMatrix || [],
        recommendations: raw.recommendations || [],
        simulatedReviews: raw.simulatedReviews || [],
        userNotes: product.evaluation.userNotes,
        lastEvaluatedAt: new Date().toLocaleDateString('vi-VN'),
      };

      setResultEvaluation(parsedEval);
      setStatus('success');
    } catch (err: any) {
      clearInterval(interval);
      console.warn('AI analysis error, fallback is ready:', err.message);
      setErrorMessage(err.message || 'Không thể kết nối đến dịch vụ AI.');
      setStatus('error');
    }
  };

  const handleApplyFallback = () => {
    // Generate high quality smart heuristic evaluation immediately
    const fallback = generateDefaultEvaluation(product);
    onApplyAnalysis(fallback);
    onClose();
  };

  const handleApplySuccess = () => {
    if (resultEvaluation) {
      onApplyAnalysis(resultEvaluation);
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      runAnalysis();
    }
  }, [isOpen, product.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Trợ lý AI Thẩm định Chuyên sâu
            </h3>
            <p className="text-xs text-stone-600">
              Đánh giá sản phẩm: <strong className="text-stone-900">{product.name}</strong>
            </p>
          </div>
        </div>

        {/* State: Running */}
        {status === 'running' && (
          <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-stone-900 transition-all">
                {steps[currentStep]}
              </p>
              <p className="text-[11px] text-stone-600">
                Mô hình Gemini 3.8 Flash đang phân tích dữ liệu ngành và phản ứng khách hàng...
              </p>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden max-w-xs">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* State: Success */}
        {status === 'success' && resultEvaluation && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Phân tích AI hoàn tất! Điểm tổng hợp mới: <strong>{resultEvaluation.overallScore}/100</strong> (Hạng {resultEvaluation.ratingGrade}).</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1 border border-stone-200">
              <span className="font-bold text-stone-900 block text-[11px] uppercase tracking-wider">
                Tóm lược Nhận định:
              </span>
              <p className="text-stone-700 leading-relaxed">
                {resultEvaluation.verdict}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-stone-50 rounded-md border border-stone-100 text-stone-700">
                <span className="text-stone-600 block text-[10px]">Chân dung tạo mới</span>
                <span className="font-bold text-stone-900">{resultEvaluation.personas.length} Personas</span>
              </div>
              <div className="p-2 bg-stone-50 rounded-md border border-stone-100 text-stone-700">
                <span className="text-stone-600 block text-[10px]">Lộ trình hành động</span>
                <span className="font-bold text-stone-900">{resultEvaluation.recommendations.length} Khuyến nghị</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Đóng
              </button>
              <button
                onClick={handleApplySuccess}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg shadow-sm"
              >
                Áp dụng Báo cáo Thẩm định Mới
              </button>
            </div>
          </div>
        )}

        {/* State: Error / Fallback available */}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Thông báo kết nối AI:</strong>
                <span>{errorMessage}</span>
                <p className="mt-1 text-amber-700 text-[11px]">
                  (Bạn có thể thêm GEMINI_API_KEY vào biến môi trường hoặc sử dụng ngay bộ thẩm định thuật toán tích hợp sẵn)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg border border-stone-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
              <button
                onClick={handleApplyFallback}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg shadow-sm"
              >
                Dùng Thẩm định Thuật toán Nâng cao
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
