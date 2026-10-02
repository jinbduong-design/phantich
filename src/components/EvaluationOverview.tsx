import React, { useState } from 'react';
import { Product, EvaluationScores } from '../types/product';
import { getGradeColor, calculateOverallScore, calculateGrade } from '../utils/evaluator';
import {
  Sparkles,
  TrendingUp,
  Target,
  ShieldCheck,
  Coins,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Save,
  Sliders,
} from 'lucide-react';

interface EvaluationOverviewProps {
  product: Product;
  onUpdateScores: (newScores: EvaluationScores, newNotes?: string) => void;
  onTriggerAi: () => void;
}

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

  const previewOverallScore = calculateOverallScore(localScores);
  const previewGrade = calculateGrade(previewOverallScore);
  const gradeColor = getGradeColor(previewGrade);

  const handleScoreChange = (key: keyof EvaluationScores, val: number) => {
    setLocalScores((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, val)),
    }));
  };

  const handleSave = () => {
    onUpdateScores(localScores, userNotes);
    setIsEditingScores(false);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Product Summary Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-1.5">
              <span>{product.category}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{product.stage}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Định giá: <strong className="text-stone-900">{product.pricing || 'Chưa định giá'}</strong></span>
              {evaluation.lastEvaluatedAt && (
                <>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span>Đánh giá ngày: {evaluation.lastEvaluatedAt}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-stone-600 text-sm mt-1 max-w-3xl leading-relaxed">
              {product.tagline || product.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              onClick={onTriggerAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Thẩm định lại với Gemini AI</span>
            </button>
            <button
              onClick={() => setIsEditingScores(!isEditingScores)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                isEditingScores
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{isEditingScores ? 'Đóng chế độ chấm điểm' : 'Tùy chỉnh điểm số'}</span>
            </button>
          </div>
        </div>

        {/* Executive Verdict Callout */}
        <div className="mt-5 p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-stone-900 text-white mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Nhận định Thẩm định Tổng quan (Executive Verdict)
              </span>
              <p className="text-stone-800 text-sm leading-relaxed font-normal">
                {evaluation.verdict}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scorecard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Score Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Chỉ số Thẩm định Tổng hợp
          </span>
          <div className="relative mt-4 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-8 border-stone-100 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-extrabold text-stone-900 tracking-tight">
                {previewOverallScore}
              </span>
              <span className="text-xs text-stone-600 font-medium">trên 100</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className={`text-base font-bold px-3 py-1 rounded-md border ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}>
              Hạng {previewGrade}
            </span>
            <span className="text-xs text-stone-600">
              {previewOverallScore >= 80 ? 'Mức độ khả thi cao' : previewOverallScore >= 68 ? 'Tiềm năng cần tối ưu' : 'Rủi ro cần can thiệp'}
            </span>
          </div>

          <p className="text-xs text-stone-600 mt-4 leading-relaxed max-w-xs">
            Trọng số: Khách hàng (25%), Nỗi đau (20%), Định giá (20%), Hào cạnh tranh (20%), Mở rộng (15%).
          </p>

          {isEditingScores && (
            <button
              onClick={handleSave}
              className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Lưu điểm đã điều chỉnh</span>
            </button>
          )}

          {isSavedNotice && (
            <span className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã cập nhật điểm thành công!
            </span>
          )}
        </div>

        {/* Right: The 5 Evaluation Pillars */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-600">
              5 Trụ cột Thẩm định Cốt lõi
            </h2>
            <span className="text-xs text-stone-600">
              {isEditingScores ? 'Kéo thanh trượt để thay đổi điểm' : 'Điểm chuẩn hóa từ 0 - 100'}
            </span>
          </div>

          <div className="space-y-4">
            {/* 1. Target Customer Fit */}
            <div className="border border-stone-100 rounded-lg p-3.5 bg-stone-50/50">
              <div className="flex items-center justify-between text-xs font-medium text-stone-800 mb-1.5">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>1. Mức độ phù hợp Khách hàng Mục tiêu (Target Customer Fit)</span>
                  <span className="text-stone-600 text-[11px]">(Trọng số 25%)</span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {localScores.targetCustomerFit}/100
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${localScores.targetCustomerFit}%` }}
                />
              </div>
              {isEditingScores ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localScores.targetCustomerFit}
                  onChange={(e) => handleScoreChange('targetCustomerFit', Number(e.target.value))}
                  className="w-full mt-2 accent-indigo-600"
                />
              ) : (
                <p className="text-[11px] text-stone-600 mt-1">
                  Đánh giá độ rõ ràng của chân dung khách hàng, độ bức thiết của nhu cầu và quy mô tệp người mua sẵn sàng hành động.
                </p>
              )}
            </div>

            {/* 2. Pain Point Solvability */}
            <div className="border border-stone-100 rounded-lg p-3.5 bg-stone-50/50">
              <div className="flex items-center justify-between text-xs font-medium text-stone-800 mb-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2. Giải quyết Nỗi đau Thị trường (Pain Point Solvability)</span>
                  <span className="text-stone-600 text-[11px]">(Trọng số 20%)</span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {localScores.painPointSolvability}/100
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${localScores.painPointSolvability}%` }}
                />
              </div>
              {isEditingScores ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localScores.painPointSolvability}
                  onChange={(e) => handleScoreChange('painPointSolvability', Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-600"
                />
              ) : (
                <p className="text-[11px] text-stone-600 mt-1">
                  Mức độ triệt để khi tháo gỡ điểm nghẽn của khách hàng so với các giải pháp chắp vá hiện tại.
                </p>
              )}
            </div>

            {/* 3. Pricing & Value */}
            <div className="border border-stone-100 rounded-lg p-3.5 bg-stone-50/50">
              <div className="flex items-center justify-between text-xs font-medium text-stone-800 mb-1.5">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>3. Định giá & Tỷ suất Giá trị (Pricing & Value Ratio)</span>
                  <span className="text-stone-600 text-[11px]">(Trọng số 20%)</span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {localScores.pricingAndValue}/100
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${localScores.pricingAndValue}%` }}
                />
              </div>
              {isEditingScores ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localScores.pricingAndValue}
                  onChange={(e) => handleScoreChange('pricingAndValue', Number(e.target.value))}
                  className="w-full mt-2 accent-amber-600"
                />
              ) : (
                <p className="text-[11px] text-stone-600 mt-1">
                  Độ hợp lý của mức giá so với giá trị cảm nhận (Perceived Value) và mức độ sẵn sàng chi trả của phân khúc.
                </p>
              )}
            </div>

            {/* 4. Competitive Moat */}
            <div className="border border-stone-100 rounded-lg p-3.5 bg-stone-50/50">
              <div className="flex items-center justify-between text-xs font-medium text-stone-800 mb-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>4. Hào nước Cạnh tranh & Định vị (Competitive Moat)</span>
                  <span className="text-stone-600 text-[11px]">(Trọng số 20%)</span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {localScores.competitiveMoat}/100
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${localScores.competitiveMoat}%` }}
                />
              </div>
              {isEditingScores ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localScores.competitiveMoat}
                  onChange={(e) => handleScoreChange('competitiveMoat', Number(e.target.value))}
                  className="w-full mt-2 accent-blue-600"
                />
              ) : (
                <p className="text-[11px] text-stone-600 mt-1">
                  Mức độ khó bị sao chép (công nghệ, chi phí chuyển đổi, mạng lưới, sở hữu trí tuệ, kênh phân phối độc quyền).
                </p>
              )}
            </div>

            {/* 5. Scalability */}
            <div className="border border-stone-100 rounded-lg p-3.5 bg-stone-50/50">
              <div className="flex items-center justify-between text-xs font-medium text-stone-800 mb-1.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span>5. Tiềm năng Mở rộng & Rủi ro Thị trường (Scalability)</span>
                  <span className="text-stone-600 text-[11px]">(Trọng số 15%)</span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {localScores.marketScalability}/100
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${localScores.marketScalability}%` }}
                />
              </div>
              {isEditingScores ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localScores.marketScalability}
                  onChange={(e) => handleScoreChange('marketScalability', Number(e.target.value))}
                  className="w-full mt-2 accent-purple-600"
                />
              ) : (
                <p className="text-[11px] text-stone-600 mt-1">
                  Khả năng nhân rộng quy mô doanh thu mà chi phí biên không tăng tương ứng cùng mức độ rủi ro pháp lý/chu kỳ.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluator Notes Section */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-600">
            Ghi chú Thẩm định & Biên bản Cuộc họp
          </h2>
          <button
            onClick={handleSave}
            className="text-xs font-medium text-stone-700 hover:text-stone-900 inline-flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu ghi chú</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Thêm ghi chú đánh giá thực tế của bạn hoặc phản hồi từ ban hội đồng thẩm định..."
          className="w-full text-xs sm:text-sm text-stone-800 p-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 leading-relaxed"
        />
      </div>
    </div>
  );
};
