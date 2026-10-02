import React, { useEffect, useState } from 'react';
import { Product, ProductCategory, ProductEvidence, ProductStage } from '../types/product';
import {
  EMPTY_EVIDENCE,
  generateDefaultEvaluation,
  normalizeEvidence,
  recalculateProduct,
} from '../utils/evaluator';
import { Sparkles, X } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product, runAiImmediate?: boolean) => void;
  editingProduct?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'SaaS / B2B',
  'Công nghệ & IoT',
  'F&B & Ẩm thực',
  'Tiêu dùng & Thời trang',
  'EdTech & Đào tạo',
  'Sức khỏe & Y tế',
  'Dịch vụ & Tài chính',
  'Khác',
];

const STAGES: ProductStage[] = [
  'Ý tưởng sơ khai',
  'MVP thử nghiệm',
  'Beta / Early Access',
  'Đã ra mắt thị trường',
  'Tăng trưởng mở rộng',
];

const makeInitialForm = (product?: Product | null) => ({
  name: product?.name || '',
  tagline: product?.tagline || '',
  category: product?.category || ('SaaS / B2B' as ProductCategory),
  stage: product?.stage || ('Ý tưởng sơ khai' as ProductStage),
  pricing: product?.pricing || '',
  description: product?.description || '',
  targetCustomerDescription: product?.targetCustomerDescription || '',
  competitors: product?.competitors || '',
  evidence: normalizeEvidence(product?.evidence || EMPTY_EVIDENCE),
});

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}) => {
  const [formData, setFormData] = useState(() => makeInitialForm(editingProduct));
  const [runAiImmediate, setRunAiImmediate] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormData(makeInitialForm(editingProduct));
    setRunAiImmediate(false);
    setErrorMsg('');
  }, [isOpen, editingProduct?.id]);

  if (!isOpen) return null;

  const setEvidenceNumber = (key: keyof ProductEvidence, raw: string) => {
    const value = raw === '' ? 0 : Math.max(0, Number(raw));
    setFormData((current) => ({
      ...current,
      evidence: { ...current.evidence, [key]: Number.isFinite(value) ? value : 0 },
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg('Nhập tên sản phẩm.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Nhập mô tả ngắn về sản phẩm.');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    const evidence = normalizeEvidence(formData.evidence);

    if (editingProduct) {
      const updated = recalculateProduct({
        ...editingProduct,
        ...formData,
        evidence,
        updatedAt: now,
      });
      onSave(updated, runAiImmediate);
    } else {
      const created: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        evidence,
        createdAt: now,
        updatedAt: now,
        evaluation: generateDefaultEvaluation({
          category: formData.category,
          evidence,
        }),
      };
      onSave(created, runAiImmediate);
    }

    onClose();
  };

  const evidenceFields: Array<{
    key: keyof ProductEvidence;
    label: string;
    hint: string;
  }> = [
    { key: 'customerInterviews', label: 'Phỏng vấn khách', hint: 'Tổng số người đúng phân khúc đã hỏi' },
    { key: 'problemConfirmed', label: 'Xác nhận pain', hint: 'Trong số phỏng vấn, bao nhiêu người thực sự có vấn đề' },
    { key: 'solutionTests', label: 'Đã dùng thử', hint: 'Số người/lần dùng workflow thực tế' },
    { key: 'positiveOutcomes', label: 'Có outcome tốt', hint: 'Dùng xong có kết quả đo/quan sát được' },
    { key: 'pricingTests', label: 'Pricing test', hint: 'Số người được test mức giá cụ thể' },
    { key: 'priceAccepted', label: 'Chấp nhận giá', hint: 'Trong pricing test, số người chấp nhận' },
    { key: 'payingCustomers', label: 'Khách trả tiền', hint: 'Giao dịch thật, không tính lời hứa mua' },
    { key: 'repeatCustomers', label: 'Khách quay lại', hint: 'Mua lại/gia hạn/tiếp tục sử dụng có trả tiền' },
    { key: 'competitiveComparisons', label: 'So sánh cạnh tranh', hint: 'Lần khách cân nhắc mình cùng lựa chọn khác' },
    { key: 'wonAgainstAlternative', label: 'Chọn mình', hint: 'Trong các lần so sánh, khách chọn sản phẩm này' },
    { key: 'acquisitionTests', label: 'Test kênh bán', hint: 'Số thử nghiệm kênh acquisition có đo kết quả' },
    { key: 'repeatableChannels', label: 'Kênh lặp lại được', hint: 'Kênh đã tạo khách đủ chuẩn nhiều lần' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/50 p-3 backdrop-blur-xs sm:p-4">
      <div className="my-6 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-xl border border-stone-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {editingProduct ? 'Sửa sản phẩm & bằng chứng' : 'Thêm sản phẩm'}
            </h2>
            <p className="mt-0.5 text-sm text-stone-500">
              Điểm chỉ được tính từ dữ liệu kiểm chứng bên dưới.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {errorMsg && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {errorMsg}
            </div>
          )}

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-900">Thông tin sản phẩm</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Tên sản phẩm *</span>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 p-2.5 outline-none focus:border-stone-500"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Tagline</span>
                <input
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 p-2.5 outline-none focus:border-stone-500"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Ngành</span>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as ProductCategory })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Giai đoạn</span>
                <select
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData({ ...formData, stage: e.target.value as ProductStage })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
                >
                  {STAGES.map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-1 text-sm">
              <span className="font-medium text-stone-700">Mô tả sản phẩm *</span>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Sản phẩm làm gì, cho ai, thay thế cách làm nào?"
                className="w-full rounded-lg border border-stone-300 p-2.5 leading-5 outline-none focus:border-stone-500"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Khách hàng mục tiêu</span>
                <textarea
                  rows={2}
                  value={formData.targetCustomerDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, targetCustomerDescription: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-300 p-2.5"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Đối thủ / cách thay thế</span>
                <textarea
                  rows={2}
                  value={formData.competitors}
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 p-2.5"
                />
              </label>
            </div>

            <label className="block space-y-1 text-sm">
              <span className="font-medium text-stone-700">Giá / mô hình doanh thu</span>
              <input
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                className="w-full rounded-lg border border-stone-300 p-2.5"
              />
            </label>
          </section>

          <section className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-stone-900">Dữ liệu kiểm chứng</h3>
              <p className="mt-1 text-xs leading-5 text-stone-500">
                Chỉ nhập số thực tế. Chưa có thì để 0 — hệ thống sẽ giảm độ tin cậy thay vì tự đoán.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {evidenceFields.map(({ key, label, hint }) => (
                <label key={key} className="rounded-lg border border-stone-200 bg-white p-3">
                  <span className="block text-sm font-medium text-stone-800">{label}</span>
                  <input
                    type="number"
                    min="0"
                    value={Number(formData.evidence[key]) || 0}
                    onChange={(e) => setEvidenceNumber(key, e.target.value)}
                    className="mt-2 w-full rounded-md border border-stone-200 px-2.5 py-2 font-mono text-sm outline-none focus:border-stone-500"
                  />
                  <span className="mt-1.5 block text-xs leading-4 text-stone-500">{hint}</span>
                </label>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Bằng chứng khác biệt</span>
                <select
                  value={formData.evidence.differentiationProof}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      evidence: {
                        ...formData.evidence,
                        differentiationProof: e.target.value as ProductEvidence['differentiationProof'],
                      },
                    })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
                >
                  <option value="none">Chưa có</option>
                  <option value="claim">Mới là giả thuyết / tuyên bố</option>
                  <option value="customer-confirmed">Khách hàng xác nhận</option>
                  <option value="measured">Đã đo bằng kết quả thực tế</option>
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-stone-700">Gross margin (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.evidence.grossMarginPct ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      evidence: {
                        ...formData.evidence,
                        grossMarginPct:
                          e.target.value === '' ? undefined : Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Để trống nếu chưa biết"
                  className="w-full rounded-lg border border-stone-300 p-2.5"
                />
              </label>
            </div>

            <label className="mt-3 block space-y-1 text-sm">
              <span className="font-medium text-stone-700">Ghi chú nguồn bằng chứng</span>
              <textarea
                rows={2}
                value={formData.evidence.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    evidence: { ...formData.evidence, notes: e.target.value },
                  })
                }
                placeholder="VD: link sheet phỏng vấn, số đơn Shopify, kết quả ads, báo cáo bán hàng..."
                className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
              />
            </label>
          </section>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-sm">
            <input
              type="checkbox"
              checked={runAiImmediate}
              onChange={(e) => setRunAiImmediate(e.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-stone-700">
              Sau khi lưu, dùng AI để gợi ý rủi ro và bước kiểm chứng tiếp theo
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-stone-600 hover:bg-stone-100">
              Hủy
            </button>
            <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-800">
              {editingProduct ? 'Lưu & tính lại' : 'Tạo sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
