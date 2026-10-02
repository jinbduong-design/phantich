import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Product, ProductEvaluation, RecommendationItem } from '../types/product';
import { recalculateProduct } from '../utils/evaluator';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onApplyAnalysis: (updatedEvaluation: ProductEvaluation) => void;
}

interface AiResult {
  risks: string[];
  recommendations: RecommendationItem[];
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  product,
  onApplyAnalysis,
}) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<AiResult | null>(null);

  const runAnalysis = async () => {
    if (!product) return;

    setStatus('running');
    setErrorMessage('');
    setResult(null);

    try {
      const response = await fetch('/api/evaluate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ (${response.status})`);
      }

      const data = await response.json();
      if (!data.success || !data.analysis) {
        throw new Error('AI trả dữ liệu không hợp lệ');
      }

      setResult({
        risks: Array.isArray(data.analysis.risks) ? data.analysis.risks : [],
        recommendations: Array.isArray(data.analysis.recommendations)
          ? data.analysis.recommendations
          : [],
      });
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể kết nối AI.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen && product) runAnalysis();
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const applyRecommendations = () => {
    if (!result) return;

    const deterministic = recalculateProduct(product).evaluation;
    const existing = deterministic.recommendations;
    const merged = [...existing];

    result.recommendations.forEach((recommendation) => {
      const duplicate = merged.some(
        (item) =>
          item.area.trim().toLowerCase() === recommendation.area.trim().toLowerCase() &&
          item.action.trim().toLowerCase() === recommendation.action.trim().toLowerCase(),
      );
      if (!duplicate) merged.push(recommendation);
    });

    onApplyAnalysis({
      ...deterministic,
      recommendations: merged,
      userNotes: product.evaluation.userNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-3 backdrop-blur-xs sm:p-4">
      <div className="w-full max-w-lg space-y-5 rounded-xl border border-stone-200 bg-white p-4 shadow-xl sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">AI gợi ý kiểm chứng</h3>
            <p className="mt-0.5 text-sm text-stone-500">
              AI không được thay đổi điểm số.
            </p>
          </div>
        </div>

        {status === 'running' && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-stone-800">Đang tìm khoảng trống bằng chứng</p>
              <p className="mt-1 text-xs text-stone-500">
                Không tạo persona, review hay số liệu thị trường giả.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && result && (
          <div className="space-y-4">
            <section className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Rủi ro / giả định
              </h4>
              {result.risks.length === 0 ? (
                <p className="mt-2 text-sm text-stone-500">AI không phát hiện thêm rủi ro rõ ràng.</p>
              ) : (
                <ul className="mt-2 space-y-1.5 text-sm leading-5 text-stone-700">
                  {result.risks.map((risk) => (
                    <li key={risk}>• {risk}</li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Hành động đề xuất
              </h4>
              <div className="mt-2 space-y-2">
                {result.recommendations.map((rec, index) => (
                  <div key={`${rec.area}-${index}`} className="rounded-lg border border-stone-200 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-700">{rec.area}</span>
                      <span className="text-xs text-stone-400">{rec.priority}</span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-stone-800">{rec.action}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
              <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100">
                Đóng
              </button>
              <button
                onClick={applyRecommendations}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Thêm vào hành động
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <strong className="block">AI chưa khả dụng</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700"
              >
                <RefreshCw className="h-4 w-4" /> Thử lại
              </button>
              <button onClick={onClose} className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
