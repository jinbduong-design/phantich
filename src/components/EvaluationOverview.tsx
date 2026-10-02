import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Coins,
  Database,
  Pencil,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { EvaluationScores, Product } from '../types/product';
import { getGradeColor } from '../utils/evaluator';

interface EvaluationOverviewProps {
  product: Product;
  onEditEvidence: () => void;
  onTriggerAi: () => void;
}

const pillars: Array<{
  key: keyof EvaluationScores;
  label: string;
  weight: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'targetCustomerFit', label: 'Khách hàng', weight: '25%', icon: Target },
  { key: 'painPointSolvability', label: 'Giải quyết pain', weight: '20%', icon: CheckCircle2 },
  { key: 'pricingAndValue', label: 'Giá trị / Giá', weight: '20%', icon: Coins },
  { key: 'competitiveMoat', label: 'Lợi thế cạnh tranh', weight: '20%', icon: ShieldCheck },
  { key: 'marketScalability', label: 'Khả năng mở rộng', weight: '15%', icon: TrendingUp },
];

const statusCopy = {
  insufficient: {
    label: 'Chưa đủ dữ liệu',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  provisional: {
    label: 'Tạm tính',
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  validated: {
    label: 'Đủ bằng chứng cơ bản',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
} as const;

export const EvaluationOverview: React.FC<EvaluationOverviewProps> = ({
  product,
  onEditEvidence,
  onTriggerAi,
}) => {
  const { evaluation } = product;
  const gradeColor = getGradeColor(evaluation.ratingGrade);
  const status = statusCopy[evaluation.status];

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
              <span>{product.category}</span>
              <span>·</span>
              <span>{product.stage}</span>
              {product.pricing && (
                <>
                  <span>·</span>
                  <span>{product.pricing}</span>
                </>
              )}
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              {product.name}
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-stone-600">
              {product.tagline || product.description}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={onEditEvidence}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <Pencil className="h-4 w-4" />
              Cập nhật bằng chứng
            </button>
            <button
              onClick={onTriggerAi}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              AI gợi ý
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
          <span className="text-xs text-stone-500">
            Điểm được tính từ bằng chứng đã nhập, không từ độ dài mô tả.
          </span>
        </div>

        <div className="mt-3 rounded-lg bg-stone-50 px-3 py-3 text-sm leading-5 text-stone-700">
          {evaluation.verdict}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-stone-200 bg-white p-4 lg:col-span-4 sm:p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Điểm bằng chứng
              </div>
              {evaluation.status === 'insufficient' ? (
                <div className="mt-2 text-xl font-bold text-stone-400">Chưa đủ</div>
              ) : (
                <div className="mt-1 flex items-end gap-2">
                  <span className="font-mono text-4xl font-bold tracking-tight text-stone-900">
                    {evaluation.overallScore}
                  </span>
                  <span
                    className={`mb-1 rounded border px-1.5 py-0.5 text-xs font-semibold ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}
                  >
                    {evaluation.ratingGrade}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Độ tin cậy
              </div>
              <div className="mt-1 font-mono text-3xl font-bold text-stone-900">
                {evaluation.confidence.score}%
              </div>
              <div className="mt-1 text-xs text-stone-500">{evaluation.confidence.level}</div>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-stone-900"
              style={{ width: `${evaluation.confidence.score}%` }}
            />
          </div>

          <div className="mt-4 border-t border-stone-100 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
              <Database className="h-4 w-4" />
              Bằng chứng hiện có
            </div>
            {evaluation.confidence.knownSignals.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {evaluation.confidence.knownSignals.map((item) => (
                  <li key={item} className="text-sm leading-5 text-stone-600">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-stone-500">Chưa có dữ liệu kiểm chứng.</p>
            )}
          </div>

          {evaluation.confidence.unknowns.length > 0 && (
            <div className="mt-4 border-t border-stone-100 pt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                Còn thiếu
              </div>
              <ul className="mt-2 space-y-1.5">
                {evaluation.confidence.unknowns.slice(0, 7).map((item) => (
                  <li key={item} className="text-sm leading-5 text-stone-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4 lg:col-span-8 sm:p-5">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-stone-900">Logic 5 trụ cột</h2>
            <p className="mt-1 text-xs text-stone-500">
              Mỗi trụ cột gồm nhiều tín hiệu độc lập. Bấm để xem cách điểm được hình thành.
            </p>
          </div>

          <div className="space-y-2.5">
            {pillars.map(({ key, label, weight, icon: Icon }) => {
              const criterion = evaluation.breakdown[key];

              return (
                <details
                  key={key}
                  className="group rounded-lg border border-stone-200 bg-stone-50/60 open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-stone-600 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="text-sm font-medium text-stone-800">{label}</span>
                          <span className="ml-1.5 text-xs text-stone-400">{weight}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-semibold text-stone-900">
                            {criterion.score}
                          </span>
                          <span className="ml-2 text-xs text-stone-400">
                            tin cậy {criterion.confidence}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-200">
                        <div
                          className="h-full rounded-full bg-stone-800"
                          style={{ width: `${criterion.score}%` }}
                        />
                      </div>
                    </div>
                  </summary>

                  <div className="border-t border-stone-100 px-3 pb-3 pt-2 sm:pl-15">
                    <div className="space-y-2">
                      {criterion.factors.map((factor) => (
                        <div
                          key={factor.label}
                          className="grid grid-cols-[1fr_auto] gap-3 rounded-lg bg-stone-50 px-3 py-2"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-stone-700">
                                {factor.label}
                              </span>
                              <span className="text-xs text-stone-400">
                                trọng số {Math.round(factor.weight * 100)}%
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs leading-4 text-stone-500">
                              {factor.evidence}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm font-semibold text-stone-800">
                              {factor.score}
                            </div>
                            <div className={`text-xs ${factor.sufficient ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {factor.sufficient ? 'đủ mẫu' : 'thiếu mẫu'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {criterion.missing.length > 0 && (
                      <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                        <div className="text-xs font-semibold text-amber-800">Cần bổ sung</div>
                        <ul className="mt-1 space-y-1 text-xs leading-5 text-amber-900">
                          {criterion.missing.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      </div>

      {product.evidence.notes && (
        <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-stone-900">Nguồn / ghi chú bằng chứng</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-600">
            {product.evidence.notes}
          </p>
        </section>
      )}
    </div>
  );
};
