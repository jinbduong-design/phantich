import React from 'react';
import { Product } from '../types/product';
import { getGradeColor } from '../utils/evaluator';
import { basisLabel, calculateUnitEconomics, normalizeMarketProfile, normalizeOperations } from '../utils/commercial';

interface PrintReportProps {
  product: Product;
}

export const PrintReport: React.FC<PrintReportProps> = ({ product }) => {
  const { evaluation } = product;
  const gradeColor = getGradeColor(evaluation.ratingGrade);
  const market = normalizeMarketProfile(product.marketProfile);
  const operations = normalizeOperations(product.operations);
  const unit = calculateUnitEconomics(product.economics);

  return (
    <div className="hidden print:block p-8 bg-white text-stone-900 max-w-4xl mx-auto font-sans leading-normal">
      {/* Print Header */}
      <div className="border-b-2 border-stone-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-stone-600 block mb-1">
            Báo cáo Thẩm định Sản phẩm & Khách hàng Mục tiêu
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {product.name}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {product.tagline || product.description}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-stone-600 block">Ngày lập báo cáo</span>
          <span className="text-sm font-semibold">{evaluation.lastEvaluatedAt || new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {product.analysis && (
        <div className="mb-6 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-indigo-700">
                Analysis Score
              </h3>
              <p className="mt-1 text-sm text-stone-700">{product.analysis.summary}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-3xl font-bold text-stone-900">
                {product.analysis.overallScore}
              </div>
              <div className="text-[10px] text-stone-600">
                confidence {product.analysis.confidence}%
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {product.analysis.metrics.slice(0, 6).map((metric) => (
              <div key={metric.key} className="rounded border border-stone-200 p-2">
                <div className="text-[10px] text-stone-600">{metric.label}</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-stone-900">
                  {metric.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-3 gap-3 text-[10px]">
        <div className="rounded border border-stone-200 p-3">
          <div className="font-bold uppercase text-stone-500">Thị trường</div>
          <div className="mt-1 text-xs font-semibold text-stone-900">{market.marketScope}</div>
          <div className="mt-0.5 text-stone-600">{market.customerSegment} · {market.ageMin ?? '?'}–{market.ageMax ?? '?'}</div>
          <div className="mt-0.5 text-stone-500">{basisLabel[market.basis]}</div>
        </div>
        <div className="rounded border border-stone-200 p-3">
          <div className="font-bold uppercase text-stone-500">Economics</div>
          <div className="mt-1 text-xs font-semibold text-stone-900">
            Cost {unit.baseUnitCost.toLocaleString('vi-VN')} {unit.economics.currency}
          </div>
          <div className="mt-0.5 text-stone-600">
            Giá bán {unit.economics.targetSellingPrice?.toLocaleString('vi-VN') || '—'} {unit.economics.currency}
          </div>
          <div className="mt-0.5 text-stone-500">
            Margin {unit.contributionMarginPct === undefined ? '—' : `${unit.contributionMarginPct.toFixed(1)}%`}
          </div>
        </div>
        <div className="rounded border border-stone-200 p-3">
          <div className="font-bold uppercase text-stone-500">Vận hành</div>
          <div className="mt-1 text-xs font-semibold text-stone-900">{operations.productionModel}</div>
          <div className="mt-0.5 text-stone-600">
            {operations.completionTimeHours === undefined ? 'Chưa có thời gian hoàn thiện' : `${operations.completionTimeHours} giờ / đơn`}
          </div>
          <div className="mt-0.5 text-stone-500">{operations.steps.length} bước quy trình</div>
        </div>
      </div>

      {/* Meta & Score Strip */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-stone-100 rounded-lg mb-6 text-xs">
        <div>
          <span className="text-stone-600 block text-[10px] uppercase font-bold">Danh mục</span>
          <span className="font-semibold text-stone-900">{product.category}</span>
        </div>
        <div>
          <span className="text-stone-600 block text-[10px] uppercase font-bold">Giai đoạn</span>
          <span className="font-semibold text-stone-900">{product.stage}</span>
        </div>
        <div>
          <span className="text-stone-600 block text-[10px] uppercase font-bold">Mức giá / Mô hình</span>
          <span className="font-semibold text-stone-900">{product.pricing || 'Chưa định giá'}</span>
        </div>
        <div>
          <span className="text-stone-600 block text-[10px] uppercase font-bold">Điểm Thẩm định</span>
          {evaluation.status === 'insufficient' ? (
            <span className="text-sm font-bold text-amber-700">Chưa đủ dữ liệu</span>
          ) : (
            <span className="text-base font-bold font-mono text-stone-900">
              {evaluation.overallScore}/100 (Hạng {evaluation.ratingGrade})
            </span>
          )}
          <span className="mt-1 block text-[10px] text-stone-600">
            Độ tin cậy: {evaluation.confidence.score}%
          </span>
        </div>
      </div>

      {/* Executive Verdict */}
      <div className="mb-6">
        <h3 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-1">
          Trạng thái Bằng chứng
        </h3>
        <p className="text-sm text-stone-800 p-3 bg-stone-50 border border-stone-200 rounded-md leading-relaxed">
          {evaluation.verdict}
        </p>
      </div>

      {/* 5 Pillars Table */}
      <div className="mb-6">
        <h3 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2">
          Điểm số từ Dữ liệu Kiểm chứng
        </h3>
        <table className="w-full text-xs text-left border border-stone-200">
          <thead className="bg-stone-100 border-b border-stone-200">
            <tr>
              <th className="p-2 font-bold text-stone-800">Trụ cột đánh giá</th>
              <th className="p-2 font-bold text-stone-800 text-center">Trọng số</th>
              <th className="p-2 font-bold text-stone-800 text-right">Điểm số (0-100)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            <tr>
              <td className="p-2">1. Mức độ phù hợp Khách hàng Mục tiêu (Target Fit)</td>
              <td className="p-2 text-center text-stone-600">25%</td>
              <td className="p-2 text-right font-mono font-bold">{evaluation.scores.targetCustomerFit}</td>
            </tr>
            <tr>
              <td className="p-2">2. Tính khả thi & Giải quyết Điểm đau (Pain Point Solvability)</td>
              <td className="p-2 text-center text-stone-600">20%</td>
              <td className="p-2 text-right font-mono font-bold">{evaluation.scores.painPointSolvability}</td>
            </tr>
            <tr>
              <td className="p-2">3. Định giá & Tỷ suất Giá trị (Pricing & Value Ratio)</td>
              <td className="p-2 text-center text-stone-600">20%</td>
              <td className="p-2 text-right font-mono font-bold">{evaluation.scores.pricingAndValue}</td>
            </tr>
            <tr>
              <td className="p-2">4. Lợi thế Cạnh tranh & Hào nước (Competitive Moat)</td>
              <td className="p-2 text-center text-stone-600">20%</td>
              <td className="p-2 text-right font-mono font-bold">{evaluation.scores.competitiveMoat}</td>
            </tr>
            <tr>
              <td className="p-2">5. Tiềm năng Mở rộng & Rủi ro Thị trường (Scalability)</td>
              <td className="p-2 text-center text-stone-600">15%</td>
              <td className="p-2 text-right font-mono font-bold">{evaluation.scores.marketScalability}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Target Personas */}
      <div className="mb-6">
        <h3 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2">
          Hồ sơ Khách hàng Mục tiêu (Personas)
        </h3>
        <div className="space-y-3">
          {evaluation.personas.map((persona, i) => (
            <div key={i} className="border border-stone-200 p-3 rounded-md text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-stone-900 text-sm">
                  {persona.name} ({persona.type})
                </span>
                <span className="font-mono font-bold text-stone-800">
                  Độ phù hợp: {persona.fitScore}%
                </span>
              </div>
              <p className="text-stone-600 mb-2 italic">{persona.demographics}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <strong className="text-rose-800 block">Nỗi đau chính:</strong>
                  <ul className="list-disc list-inside">
                    {persona.painPoints.slice(0, 3).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-emerald-800 block">Mục tiêu mong muốn:</strong>
                  <ul className="list-disc list-inside">
                    {persona.goals.slice(0, 3).map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SWOT Summary */}
      <div className="mb-6">
        <h3 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2">
          Ma trận SWOT
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 border border-stone-200 rounded">
            <strong className="text-emerald-800 block mb-1">Điểm mạnh (S):</strong>
            <ul className="list-disc list-inside text-[11px] space-y-0.5">
              {evaluation.swot.strengths.slice(0, 3).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="p-2.5 border border-stone-200 rounded">
            <strong className="text-rose-800 block mb-1">Điểm yếu (W):</strong>
            <ul className="list-disc list-inside text-[11px] space-y-0.5">
              {evaluation.swot.weaknesses.slice(0, 3).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
          <div className="p-2.5 border border-stone-200 rounded">
            <strong className="text-blue-800 block mb-1">Cơ hội (O):</strong>
            <ul className="list-disc list-inside text-[11px] space-y-0.5">
              {evaluation.swot.opportunities.slice(0, 3).map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
          <div className="p-2.5 border border-stone-200 rounded">
            <strong className="text-amber-800 block mb-1">Thách thức (T):</strong>
            <ul className="list-disc list-inside text-[11px] space-y-0.5">
              {evaluation.swot.threats.slice(0, 3).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="mb-6">
        <h3 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2">
          Lộ trình Hành động Khuyến nghị
        </h3>
        <ul className="space-y-1.5 text-xs text-stone-800 list-disc list-inside">
          {evaluation.recommendations.map((rec, i) => (
            <li key={i}>
              <strong>[{rec.area}] ({rec.priority}):</strong> {rec.action}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-stone-300 text-[11px] text-stone-600 flex justify-between">
        <span>ProductPulse - Nền tảng Thẩm định Sản phẩm & Khách hàng Mục tiêu</span>
        <span>Bản quyền nội bộ</span>
      </div>
    </div>
  );
};
