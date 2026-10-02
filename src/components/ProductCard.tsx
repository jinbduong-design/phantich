import React from 'react';
import { Product } from '../types/product';
import { getGradeColor } from '../utils/evaluator';
import { ArrowRight, Sparkles, Edit3, Trash2, Users, Layers, TrendingUp } from 'lucide-react';

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
  const { overallScore, ratingGrade, scores, personas } = product.evaluation;
  const gradeColor = getGradeColor(ratingGrade);
  const primaryPersona = personas.find((p) => p.type === 'Primary') || personas[0];

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white border rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-stone-900 ring-1 ring-stone-900 shadow-md'
          : 'border-stone-200 hover:border-stone-400 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Unboxed Metadata Header (No static pills) */}
        <div className="flex items-center justify-between text-xs text-stone-600 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{product.stage}</span>
          </div>

          {/* Overall Score Indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`font-mono font-bold text-sm ${gradeColor.text}`}>
              {overallScore}/100
            </span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}>
              Hạng {ratingGrade}
            </span>
          </div>
        </div>

        {/* Product Title & Tagline */}
        <h3 className="text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
          {product.tagline || product.description}
        </p>

        {/* Key Metrics Strip */}
        <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-stone-50 rounded-lg p-2">
            <span className="text-stone-600 block text-[10px] uppercase tracking-wider font-semibold">
              Fit Khách hàng
            </span>
            <span className="font-mono font-semibold text-stone-900 text-sm">
              {scores.targetCustomerFit}%
            </span>
          </div>
          <div className="bg-stone-50 rounded-lg p-2">
            <span className="text-stone-600 block text-[10px] uppercase tracking-wider font-semibold">
              Giải quyết đau
            </span>
            <span className="font-mono font-semibold text-stone-900 text-sm">
              {scores.painPointSolvability}%
            </span>
          </div>
          <div className="bg-stone-50 rounded-lg p-2">
            <span className="text-stone-600 block text-[10px] uppercase tracking-wider font-semibold">
              Hào cạnh tranh
            </span>
            <span className="font-mono font-semibold text-stone-900 text-sm">
              {scores.competitiveMoat}%
            </span>
          </div>
        </div>

        {/* Primary Persona Snapshot */}
        {primaryPersona && (
          <div className="mt-3 bg-stone-50/70 rounded-lg p-2.5 text-xs border border-stone-100">
            <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600 mb-1">
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span>Khách hàng mục tiêu chính:</span>
            </div>
            <p className="font-medium text-stone-800 line-clamp-1">
              {primaryPersona.name}
            </p>
            <p className="text-stone-600 text-[11px] mt-0.5 line-clamp-1">
              {primaryPersona.demographics}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onAiAnalyze}
            title="Thẩm định lại bằng AI Gemini"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Audit</span>
          </button>
          <button
            onClick={onEdit}
            title="Chỉnh sửa thông tin"
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Xóa sản phẩm"
            className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 font-medium text-stone-900 group-hover:translate-x-0.5 transition-transform">
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
