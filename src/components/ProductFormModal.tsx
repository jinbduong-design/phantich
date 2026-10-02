import React, { useState } from 'react';
import { Product, ProductCategory, ProductStage } from '../types/product';
import { generateDefaultEvaluation } from '../utils/evaluator';
import { X, Sparkles, Layers } from 'lucide-react';

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

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    tagline: editingProduct?.tagline || '',
    category: editingProduct?.category || ('SaaS / B2B' as ProductCategory),
    stage: editingProduct?.stage || ('MVP thử nghiệm' as ProductStage),
    pricing: editingProduct?.pricing || '',
    description: editingProduct?.description || '',
    targetCustomerDescription: editingProduct?.targetCustomerDescription || '',
    competitors: editingProduct?.competitors || '',
  });

  const [runAiImmediate, setRunAiImmediate] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Vui lòng cung cấp mô tả về sản phẩm và tính năng chính.');
      return;
    }

    const now = new Date().toISOString().split('T')[0];

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        ...formData,
        updatedAt: now,
      };
      onSave(updated, runAiImmediate);
    } else {
      const evaluation = generateDefaultEvaluation(formData);
      const created: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        createdAt: now,
        updatedAt: now,
        evaluation,
      };
      onSave(created, runAiImmediate);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {editingProduct ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Thẩm định Mới'}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Nhập thông tin sản phẩm và khách hàng mục tiêu để hệ thống phân tích toàn diện.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-stone-800 mb-1">
                Tên Sản phẩm / Dự án *
              </label>
              <input
                type="text"
                placeholder="VD: SmartSleep Lumina, FlowSaaS..."
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrorMsg('');
                }}
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-800 mb-1">
                Khẩu hiệu / Tagline ngắn
              </label>
              <input
                type="text"
                placeholder="VD: Giải pháp tự động hóa rà soát hợp đồng pháp lý"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-800 mb-1">
                Danh mục Ngành hàng
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-stone-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-800 mb-1">
                Giai đoạn Phát triển
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as ProductStage })}
                className="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-stone-900"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Mức giá Dự kiến / Mô hình Doanh thu
            </label>
            <input
              type="text"
              placeholder="VD: 990.000đ/tháng (Thuê bao SaaS) hoặc 12.500.000đ (Bán lẻ trọn gói kèm bảo hành)..."
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Mô tả Sản phẩm & Tính năng Cốt lõi *
            </label>
            <textarea
              rows={3}
              placeholder="Mô tả cụ thể cách sản phẩm hoạt động, điểm khác biệt, công nghệ áp dụng..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrorMsg('');
              }}
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Khách hàng Mục tiêu Sơ bộ (Target Customer)
            </label>
            <textarea
              rows={2}
              placeholder="Ai là người chi tiền mua? Ai là người dùng hằng ngày? Độ tuổi, quy mô, địa lý, nỗi đau lớn nhất của họ..."
              value={formData.targetCustomerDescription}
              onChange={(e) => setFormData({ ...formData, targetCustomerDescription: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Đối thủ Cạnh tranh Hiện tại / Giải pháp Thay thế
            </label>
            <input
              type="text"
              placeholder="VD: Các cách làm thủ công, Brand A, Brand B, công cụ nước ngoài..."
              value={formData.competitors}
              onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* AI Trigger Option */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer p-3 rounded-lg border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
              <input
                type="checkbox"
                checked={runAiImmediate}
                onChange={(e) => setRunAiImmediate(e.target.checked)}
                className="rounded accent-indigo-600 w-4 h-4"
              />
              <span className="text-stone-800 font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Kích hoạt thẩm định chuyên sâu ngay bằng AI Gemini sau khi lưu
              </span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
            >
              {editingProduct ? 'Cập nhật Sản phẩm' : 'Lưu & Bắt đầu Thẩm định'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
