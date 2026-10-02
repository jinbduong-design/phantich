import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Product, ProductEvaluation } from '../types/product';
import {
  buildEvaluationConfidence,
  calculateGrade,
  calculateOverallScore,
  generateDefaultEvaluation,
} from '../utils/evaluator';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onApplyAnalysis: (updatedEvaluation: ProductEvaluation) => void;
}

const clampScore = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(100, Math.round(parsed)));
};

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
    'Đọc giả định sản phẩm',
    'Kiểm tra khách hàng và pain point',
    'Kiểm tra giá và lựa chọn thay thế',
    'Xác định khoảng trống dữ liệu',
    'Tổng hợp điểm và hành động',
  ];

  const runAnalysis = async () => {
    setStatus('running');
    setCurrentStep(0);
    setErrorMessage('');

    const interval = window.setInterval(() => {
      setCurrentStep((previous) => (previous < steps.length - 1 ? previous + 1 : previous));
    }, 1000);

    try {
      const response = await fetch('/api/evaluate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      window.clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ (${response.status})`);
      }

      const data = await response.json();
      if (!data.success || !data.analysis) {
        throw new Error('Dữ liệu phân tích trả về không đúng định dạng');
      }

      const raw = data.analysis;
      const conservativeBaseline = generateDefaultEvaluation(product);

      const scores = {
        targetCustomerFit: clampScore(
          raw.scores?.targetCustomerFit,
          conservativeBaseline.scores.targetCustomerFit,
        ),
        painPointSolvability: clampScore(
          raw.scores?.painPointSolvability,
          conservativeBaseline.scores.painPointSolvability,
        ),
        pricingAndValue: clampScore(
          raw.scores?.pricingAndValue,
          conservativeBaseline.scores.pricingAndValue,
        ),
        competitiveMoat: clampScore(
          raw.scores?.competitiveMoat,
          conservativeBaseline.scores.competitiveMoat,
        ),
        marketScalability: clampScore(
          raw.scores?.marketScalability,
          conservativeBaseline.scores.marketScalability,
        ),
      };

      const overallScore = calculateOverallScore(scores);
      const ratingGrade = calculateGrade(overallScore);

      const inputConfidence = buildEvaluationConfidence(product);
      const requestedConfidence = clampScore(raw.confidence?.score, inputConfidence.score);
      // AI only sees the submitted product description here; it cannot create
      // real-world evidence. Keep confidence capped until validation data exists.
      const confidenceScore = Math.min(74, requestedConfidence);
      const confidence = {
        score: confidenceScore,
        level: (confidenceScore >= 50 ? 'Trung bình' : 'Thấp') as 'Trung bình' | 'Thấp',
        knownSignals:
          Array.isArray(raw.confidence?.knownSignals) && raw.confidence.knownSignals.length > 0
            ? raw.confidence.knownSignals
            : inputConfidence.knownSignals,
        unknowns:
          Array.isArray(raw.confidence?.unknowns) && raw.confidence.unknowns.length > 0
            ? raw.confidence.unknowns
            : inputConfidence.unknowns,
      };

      const parsedEval: ProductEvaluation = {
        overallScore,
        ratingGrade,
        verdict:
          raw.verdict ||
          'Đây là đánh giá giả thuyết. Cần bổ sung bằng chứng khách hàng và thị trường trước khi kết luận mạnh.',
        scores,
        confidence,
        personas: (raw.personas || []).map((persona: any, index: number) => ({
          id: `ai-p-${index}-${Date.now()}`,
          name: persona.name || 'Persona — giả thuyết',
          type: persona.type === 'Primary' ? 'Primary' : 'Secondary',
          role: persona.role || 'Chưa xác minh',
          demographics: persona.demographics || 'Chưa xác minh',
          fitScore: clampScore(persona.fitScore, 50),
          painPoints: persona.painPoints || [],
          goals: persona.goals || [],
          buyingTriggers: persona.buyingTriggers || [],
          objections: persona.objections || [],
          willingnessToPay: persona.willingnessToPay || 'Chưa xác minh',
          channels: persona.channels || [],
        })),
        swot: {
          strengths: raw.swot?.strengths || [],
          weaknesses: raw.swot?.weaknesses || [],
          opportunities: raw.swot?.opportunities || [],
          threats: raw.swot?.threats || [],
        },
        marketAnalysis: {
          tamSamSom:
            raw.marketAnalysis?.tamSamSom ||
            'Chưa đủ dữ liệu để ước tính TAM / SAM / SOM đáng tin cậy.',
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
    } catch (error: any) {
      window.clearInterval(interval);
      setErrorMessage(error.message || 'Không thể kết nối đến dịch vụ AI.');
      setStatus('error');
    }
  };

  const handleApplyFallback = () => {
    onApplyAnalysis(generateDefaultEvaluation(product));
    onClose();
  };

  const handleApplySuccess = () => {
    if (resultEvaluation) onApplyAnalysis(resultEvaluation);
    onClose();
  };

  useEffect(() => {
    if (isOpen) runAnalysis();
  }, [isOpen, product.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-3 backdrop-blur-xs sm:p-4">
      <div className="w-full max-w-lg space-y-5 rounded-xl border border-stone-200 bg-white p-4 shadow-xl sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-stone-900">AI thẩm định</h3>
            <p className="truncate text-sm text-stone-500">{product.name}</p>
          </div>
        </div>

        {status === 'running' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <div>
              <p className="text-sm font-semibold text-stone-900">{steps[currentStep]}</p>
              <p className="mt-1 text-xs text-stone-500">
                AI đang tách giả định khỏi dữ liệu đã biết.
              </p>
            </div>
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {status === 'success' && resultEvaluation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                <div className="text-xs text-stone-500">Điểm</div>
                <div className="mt-1 font-mono text-2xl font-bold text-stone-900">
                  {resultEvaluation.overallScore}
                </div>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                <div className="text-xs text-stone-500">Độ tin cậy</div>
                <div className="mt-1 font-mono text-2xl font-bold text-stone-900">
                  {resultEvaluation.confidence?.score ?? 0}%
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm leading-5 text-stone-700">{resultEvaluation.verdict}</p>
            </div>

            {(resultEvaluation.confidence?.unknowns?.length ?? 0) > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="text-xs font-semibold text-amber-800">Cần xác minh tiếp</div>
                <p className="mt-1 text-sm leading-5 text-amber-900">
                  {resultEvaluation.confidence?.unknowns.slice(0, 2).join(' · ')}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
              <button
                onClick={onClose}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
              >
                Đóng
              </button>
              <button
                onClick={handleApplySuccess}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <strong className="block font-semibold">AI chưa khả dụng</strong>
                <span>{errorMessage}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                <RefreshCw className="h-4 w-4" /> Thử lại
              </button>
              <button
                onClick={handleApplyFallback}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Dùng baseline
              </button>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <CheckCircle2 className="h-4 w-4" />
            Sẵn sàng phân tích
          </div>
        )}
      </div>
    </div>
  );
};
