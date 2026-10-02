import React, { useState } from 'react';
import { Product } from '../types/product';
import { getGradeColor } from '../utils/evaluator';
import { ArrowLeftRight, Check, Trophy, Users, ShieldAlert, Zap } from 'lucide-react';

interface ProductComparisonProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onSelectProduct,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    products.slice(0, Math.min(3, products.length)).map((p) => p.id)
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([selectedIds[1], selectedIds[2], id]);
      }
    }
  };

  const comparedProducts = products.filter((p) => selectedIds.includes(p.id));

  // Determine highest score product
  const bestProduct = [...comparedProducts].sort(
    (a, b) => b.evaluation.overallScore - a.evaluation.overallScore
  )[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
              <ArrowLeftRight className="w-4 h-4 text-stone-500" />
              <span className="font-semibold uppercase tracking-wider">So sánh Đối đầu Trực quan</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Bảng So sánh Trọng số & Khả năng Thắng thầu Thị trường
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Chọn từ 2 đến 3 sản phẩm để so sánh trực diện các chỉ số thẩm định, tệp khách hàng mục tiêu, định giá và hào nước cạnh tranh.
            </p>
          </div>

          {/* Product selector buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-lg">
            {products.map((p) => {
              const isChecked = selectedIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleSelect(p.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparedProducts.map((p) => {
          const isWinner = bestProduct && bestProduct.id === p.id && comparedProducts.length > 1;
          const gradeColor = getGradeColor(p.evaluation.ratingGrade);
          const primaryPersona = p.evaluation.personas.find((per) => per.type === 'Primary') || p.evaluation.personas[0];

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between relative transition-all ${
                isWinner ? 'ring-2 ring-emerald-600 border-emerald-300' : 'border-stone-200'
              }`}
            >
              {isWinner && (
                <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Trophy className="w-3 h-3" />
                  <span>Điểm cao nhất</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Product Name & Score */}
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                    <span>{p.category}</span>
                    <span className="font-semibold">{p.stage}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">{p.name}</h3>
                  <div className="mt-3 flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-100">
                    <div>
                      <span className="text-[10px] text-stone-600 uppercase font-semibold block">
                        Tổng điểm
                      </span>
                      <span className="font-mono text-2xl font-black text-stone-900">
                        {p.evaluation.overallScore}/100
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}>
                      Hạng {p.evaluation.ratingGrade}
                    </span>
                  </div>
                </div>

                {/* Score breakdown rows */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                    5 Trụ cột Thẩm định:
                  </span>

                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-600">Khách hàng Mục tiêu (25%)</span>
                    <span className="font-mono font-semibold text-stone-900">
                      {p.evaluation.scores.targetCustomerFit}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-600">Giải quyết Điểm đau (20%)</span>
                    <span className="font-mono font-semibold text-stone-900">
                      {p.evaluation.scores.painPointSolvability}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-600">Định giá & Giá trị (20%)</span>
                    <span className="font-mono font-semibold text-stone-900">
                      {p.evaluation.scores.pricingAndValue}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-600">Hào nước Cạnh tranh (20%)</span>
                    <span className="font-mono font-semibold text-stone-900">
                      {p.evaluation.scores.competitiveMoat}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-600">Tiềm năng Mở rộng (15%)</span>
                    <span className="font-mono font-semibold text-stone-900">
                      {p.evaluation.scores.marketScalability}%
                    </span>
                  </div>
                </div>

                {/* Pricing & Business Model */}
                <div className="bg-stone-50 rounded-lg p-3 text-xs border border-stone-100">
                  <span className="font-semibold text-stone-800 block text-[11px] mb-0.5">
                    Mức giá đề xuất:
                  </span>
                  <p className="text-stone-700 font-medium">
                    {p.pricing || 'Chưa định giá cụ thể'}
                  </p>
                </div>

                {/* Target Persona Focus */}
                {primaryPersona && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-500" />
                      Persona Khách hàng Cốt lõi:
                    </span>
                    <p className="font-medium text-stone-900">
                      {primaryPersona.name}
                    </p>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {primaryPersona.demographics}
                    </p>
                  </div>
                )}

                {/* Strengths vs Threats Summary */}
                <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
                  <div>
                    <span className="font-semibold text-emerald-700 block text-[11px]">
                      Thế mạnh nổi trội nhất:
                    </span>
                    <p className="text-stone-700 line-clamp-2">
                      {p.evaluation.swot.strengths[0] || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-rose-700 block text-[11px]">
                      Rủi ro cần lưu tâm nhất:
                    </span>
                    <p className="text-stone-700 line-clamp-2">
                      {p.evaluation.swot.threats[0] || p.evaluation.swot.weaknesses[0] || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectProduct(p.id)}
                className="mt-6 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors"
              >
                Mở Bảng Thẩm định Chi tiết
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
