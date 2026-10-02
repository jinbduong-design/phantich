import React from 'react';
import { ArrowRight, Edit3, Sparkles, Trash2 } from 'lucide-react';
import { Product } from '../types/product';
import { buildEvaluationConfidence, getGradeColor } from '../utils/evaluator';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAiAnalyze: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onAiAnalyze,
}) => {
  const { overallScore, ratingGrade, scores, status } = product.evaluation;
  const gradeColor = getGradeColor(ratingGrade);
  const confidence = product.evaluation.confidence ?? buildEvaluationConfidence(product);

  return (
    <article
      onClick={onSelect}
      className={`group cursor-pointer rounded-xl border bg-white p-4 transition-all sm:p-5 ${
        isSelected
          ? 'border-stone-900 ring-1 ring-stone-900'
          : 'border-stone-200 hover:border-stone-400 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-stone-500">
            {product.category} · {product.stage}
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-stone-900">
            {product.name}
          </h3>
        </div>

        <div className="shrink-0 text-right">
          {product.analysis ? (
            <>
              <div className="text-xs font-medium text-indigo-600">Analysis</div>
              <div className="font-mono text-lg font-bold text-indigo-950">
                {product.analysis.overallScore}
              </div>
              <div className="text-xs text-stone-500">tin cậy {product.analysis.confidence}%</div>
            </>
          ) : status === 'insufficient' ? (
            <>
              <div className="text-xs font-medium text-stone-500">Validation</div>
              <div className="text-sm font-semibold text-amber-700">Chưa đủ dữ liệu</div>
            </>
          ) : (
            <>
              <div className="text-xs font-medium text-stone-500">Validation</div>
              <div className={`font-mono text-lg font-bold ${gradeColor.text}`}>{overallScore}</div>
              <div className="text-xs text-stone-500">tin cậy {confidence.score}%</div>
            </>
          )}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-5 text-stone-600">
        {product.tagline || product.description}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {(product.analysis
          ? product.analysis.metrics.slice(0, 3).map((metric) => [metric.label, metric.score] as [string, number])
          : [
              ['Khách hàng', scores.targetCustomerFit],
              ['Nỗi đau', scores.painPointSolvability],
              ['Lợi thế', scores.competitiveMoat],
            ] as [string, number][]
        ).map(([label, value]) => (
          <div key={String(label)} className="rounded-lg bg-stone-50 px-2 py-2 text-center">
            <div className="truncate text-xs text-stone-500">{label}</div>
            <div className="mt-0.5 font-mono text-sm font-semibold text-stone-900">
              {value}
            </div>
          </div>
        ))}
      </div>

      {product.analysis && (
        <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
          <span>Validation</span>
          <span>
            {status === 'insufficient'
              ? 'chưa đủ dữ liệu'
              : `${overallScore}/100 · tin cậy ${confidence.score}%`}
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          <button
            onClick={onAiAnalyze}
            title="Phân tích lại bằng AI"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI
          </button>
          <button
            onClick={onEdit}
            title="Chỉnh sửa"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            title="Xóa"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-stone-700">
          Chi tiết <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </article>
  );
};
