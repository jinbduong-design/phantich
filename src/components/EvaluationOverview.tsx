import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Coins,
  Save,
  ShieldCheck,
  Sliders,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { EvaluationScores, Product } from '../types/product';
import {
  buildEvaluationConfidence,
  calculateGrade,
  calculateOverallScore,
  getGradeColor,
} from '../utils/evaluator';

interface EvaluationOverviewProps {
  product: Product;
  onUpdateScores: (newScores: EvaluationScores, newNotes?: string) => void;
  onTriggerAi: () => void;
}

const pillars: Array<{
  key: keyof EvaluationScores;
  label: string;
  weight: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: 'targetCustomerFit',
    label: 'Khách hàng',
    weight: '25%',
    hint: 'Đúng người mua, đúng nhu cầu.',
    icon: Target,
  },
  {
    key: 'painPointSolvability',
    label: 'Nỗi đau',
    weight: '20%',
    hint: 'Mức độ cấp thiết và giải quyết được.',
    icon: CheckCircle2,
  },
  {
    key: 'pricingAndValue',
    label: 'Giá trị / Giá',
    weight: '20%',
    hint: 'Giá trị cảm nhận so với mức sẵn sàng chi.',
    icon: Coins,
  },
  {
    key: 'competitiveMoat',
    label: 'Lợi thế',
    weight: '20%',
    hint: 'Khác biệt và khó bị thay thế.',
    icon: ShieldCheck,
  },
  {
    key: 'marketScalability',
    label: 'Mở rộng',
    weight: '15%',
    hint: 'Khả năng tăng trưởng và rủi ro thị trường.',
    icon: TrendingUp,
  },
];

export const EvaluationOverview: React.FC<EvaluationOverviewProps> = ({
  product,
  onUpdateScores,
  onTriggerAi,
}) => {
  const { evaluation } = product;
  const [isEditingScores, setIsEditingScores] = useState(false);
  const [localScores, setLocalScores] = useState<EvaluationScores>(evaluation.scores);
  const [userNotes, setUserNotes] = useState(evaluation.userNotes || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    setLocalScores(evaluation.scores);
    setUserNotes(evaluation.userNotes || '');
    setIsEditingScores(false);
  }, [product.id, evaluation.scores, evaluation.userNotes]);

  const confidence = useMemo(
    () => evaluation.confidence ?? buildEvaluationConfidence(product),
    [evaluation.confidence, product],
  );

  const previewOverallScore = calculateOverallScore(localScores);
  const previewGrade = calculateGrade(previewOverallScore);
  const gradeColor = getGradeColor(previewGrade);

  const handleScoreChange = (key: keyof EvaluationScores, value: number) => {
    setLocalScores((current) => ({
      ...current,
      [key]: Math.max(0, Math.min(100, value)),
    }));
  };

  const handleSave = () => {
    onUpdateScores(localScores, userNotes);
    setIsEditingScores(false);
    setIsSavedNotice(true);
    window.setTimeout(() => setIsSavedNotice(false), 1800);
  };

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
            <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-5 text-stone-600">
              {product.tagline || product.description}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={onTriggerAi}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Phân tích AI</span>
              <span className="sm:hidden">AI</span>
            </button>
            <button
              onClick={() => setIsEditingScores((value) => !value)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium ${
                isEditingScores
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">{isEditingScores ? 'Đóng chỉnh điểm' : 'Chỉnh điểm'}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-stone-50 px-3 py-3 text-sm leading-5 text-stone-700">
          {evaluation.verdict}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-stone-200 bg-white p-4 lg:col-span-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-stone-500">Điểm</div>
              <div className="mt-1 flex items-end gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-stone-900">
                  {previewOverallScore}
                </span>
                <span className={`mb-1 rounded border px-1.5 py-0.5 text-xs font-semibold ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}>
                  {previewGrade}
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-stone-500">Độ tin cậy</div>
              <div className="mt-1 font-mono text-3xl font-bold text-stone-900">{confidence.score}%</div>
              <div className="mt-1 text-xs text-stone-500">{confidence.level}</div>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-stone-900 transition-all"
              style={{ width: `${confidence.score}%` }}
            />
          </div>

          {confidence.unknowns.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                Cần xác minh
              </div>
              <ul className="mt-2 space-y-1.5">
                {confidence.unknowns.slice(0, 4).map((item) => (
                  <li key={item} className="text-sm leading-5 text-stone-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isEditingScores && (
            <button
              onClick={handleSave}
              className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" /> Lưu điểm
            </button>
          )}

          {isSavedNotice && (
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Đã lưu
            </div>
          )}
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4 lg:col-span-8 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-stone-900">5 trụ cột</h2>
            <span className="text-xs text-stone-500">Điểm ≠ độ chắc chắn</span>
          </div>

          <div className="space-y-2.5">
            {pillars.map(({ key, label, weight, hint, icon: Icon }) => {
              const value = localScores[key];

              return (
                <div key={key} className="rounded-lg border border-stone-100 bg-stone-50/70 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-stone-600 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-stone-800">{label}</span>
                          <span className="ml-1.5 text-xs text-stone-400">{weight}</span>
                        </div>
                        <span className="shrink-0 font-mono text-sm font-semibold text-stone-900">
                          {value}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-200">
                        <div
                          className="h-full rounded-full bg-stone-800 transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>

                      {isEditingScores ? (
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(event) => handleScoreChange(key, Number(event.target.value))}
                          className="mt-2 w-full accent-stone-900"
                          aria-label={label}
                        />
                      ) : (
                        <p className="mt-1.5 hidden text-xs leading-5 text-stone-500 sm:block">{hint}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-stone-900">Ghi chú thực tế</h2>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            <Save className="h-4 w-4" /> Lưu
          </button>
        </div>
        <textarea
          rows={3}
          value={userNotes}
          onChange={(event) => setUserNotes(event.target.value)}
          placeholder="Phỏng vấn, số liệu bán, pricing test, phản hồi thật..."
          className="mt-3 w-full resize-y rounded-lg border border-stone-200 p-3 text-sm leading-5 text-stone-800 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
        />
      </section>
    </div>
  );
};
