import React, { useState } from 'react';
import { TargetPersona } from '../types/product';
import {
  Users,
  Target,
  AlertCircle,
  Award,
  Zap,
  HelpCircle,
  Coins,
  Radio,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
} from 'lucide-react';

interface PersonaHubProps {
  personas: TargetPersona[];
  onUpdatePersonas: (updated: TargetPersona[]) => void;
  onGenerateAiPersona?: () => void;
}

export const PersonaHub: React.FC<PersonaHubProps> = ({
  personas,
  onUpdatePersonas,
  onGenerateAiPersona,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New persona draft state
  const [newPersona, setNewPersona] = useState<Partial<TargetPersona>>({
    name: '',
    type: 'Primary',
    role: '',
    demographics: '',
    fitScore: 85,
    painPoints: [''],
    goals: [''],
    buyingTriggers: [''],
    objections: [''],
    willingnessToPay: '',
    channels: [''],
  });

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chân dung khách hàng này?')) {
      onUpdatePersonas(personas.filter((p) => p.id !== id));
    }
  };

  const handleSaveNew = () => {
    if (!newPersona.name) return;
    const created: TargetPersona = {
      id: `p-${Date.now()}`,
      name: newPersona.name || 'Khách hàng mục tiêu',
      type: (newPersona.type as 'Primary' | 'Secondary') || 'Secondary',
      role: newPersona.role || 'Người mua tiềm năng',
      demographics: newPersona.demographics || 'Nhân khẩu học chưa xác định',
      fitScore: newPersona.fitScore || 80,
      painPoints: (newPersona.painPoints || []).filter((s) => s.trim().length > 0),
      goals: (newPersona.goals || []).filter((s) => s.trim().length > 0),
      buyingTriggers: (newPersona.buyingTriggers || []).filter((s) => s.trim().length > 0),
      objections: (newPersona.objections || []).filter((s) => s.trim().length > 0),
      willingnessToPay: newPersona.willingnessToPay || 'Trung bình',
      channels: (newPersona.channels || []).filter((s) => s.trim().length > 0),
    };

    onUpdatePersonas([...personas, created]);
    setIsAddingNew(false);
    setNewPersona({
      name: '',
      type: 'Secondary',
      role: '',
      demographics: '',
      fitScore: 80,
      painPoints: [''],
      goals: [''],
      buyingTriggers: [''],
      objections: [''],
      willingnessToPay: '',
      channels: [''],
    });
  };

  return (
    <div className="space-y-6">
      {/* Hub Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
            <Users className="w-4 h-4 text-stone-500" />
            <span className="font-semibold uppercase tracking-wider">Hồ sơ Khách hàng Mục tiêu</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{personas.length} phân khúc chân dung</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Chân dung Khách hàng Mục tiêu (Target Customer Personas)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Phân tích thấu cảm sâu sắc về người ra quyết định, người thụ hưởng, nỗi đau thực sự, rào cản chi tiêu và các điểm chạm tiếp cận hiệu quả nhất.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onGenerateAiPersona && (
            <button
              onClick={onGenerateAiPersona}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <span>+ Tạo thêm Persona bằng AI</span>
            </button>
          )}
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Persona Thủ công</span>
          </button>
        </div>
      </div>

      {/* Add New Persona Form Modal or Expanded Card */}
      {isAddingNew && (
        <div className="bg-white border-2 border-dashed border-stone-300 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-base font-bold text-stone-900">
              Thêm Chân dung Khách hàng Mục tiêu Mới
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="p-1 text-stone-600 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Tên & Định danh Persona *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Hoàng Anh - Trưởng phòng Marketing B2B"
                value={newPersona.name || ''}
                onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Phân loại Persona
              </label>
              <select
                value={newPersona.type || 'Primary'}
                onChange={(e) => setNewPersona({ ...newPersona, type: e.target.value as any })}
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 bg-white"
              >
                <option value="Primary">Primary (Khách hàng cốt lõi / Quyết định mua)</option>
                <option value="Secondary">Secondary (Người dùng thụ hưởng / Hỗ trợ)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-stone-700 mb-1">
                Nhân khẩu học & Bối cảnh (Tuổi, Nghề, Thu nhập, Địa lý)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 28 - 40 tuổi, tại các thành phố lớn, thu nhập 25-50tr/tháng, phụ trách đội ngũ 5-15 người..."
                value={newPersona.demographics || ''}
                onChange={(e) => setNewPersona({ ...newPersona, demographics: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Điểm đau chính (Cách nhau bằng dấu phẩy)
              </label>
              <textarea
                rows={2}
                placeholder="Mất nhiều thời gian báo cáo, Chi phí thuê ngoài cao, Thiếu tính chuẩn xác..."
                value={(newPersona.painPoints || []).join(', ')}
                onChange={(e) =>
                  setNewPersona({
                    ...newPersona,
                    painPoints: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Mục tiêu mong muốn (Cách nhau bằng dấu phẩy)
              </label>
              <textarea
                rows={2}
                placeholder="Tiết kiệm 50% thời gian, Nâng cao năng suất, Giảm tỷ lệ sai sót..."
                value={(newPersona.goals || []).join(', ')}
                onChange={(e) =>
                  setNewPersona({
                    ...newPersona,
                    goals: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Mức độ sẵn sàng chi trả & Ngân sách
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 1 - 3 triệu/tháng, sẵn sàng thanh toán gói năm nếu có ưu đãi..."
                value={newPersona.willingnessToPay || ''}
                onChange={(e) => setNewPersona({ ...newPersona, willingnessToPay: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Kênh tiếp cận hiệu quả (Cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: LinkedIn, Hội thảo ngành, Google Search, TikTok..."
                value={(newPersona.channels || []).join(', ')}
                onChange={(e) =>
                  setNewPersona({
                    ...newPersona,
                    channels: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSaveNew}
              className="px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
            >
              Lưu Persona Mới
            </button>
          </div>
        </div>
      )}

      {/* Personas Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {personas.map((persona, index) => {
          const isPrimary = persona.type === 'Primary';
          return (
            <div
              key={persona.id || index}
              className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all ${
                isPrimary ? 'border-stone-400 ring-1 ring-stone-300' : 'border-stone-200'
              }`}
            >
              <div>
                {/* Persona Header Info (Clean unboxed typography) */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-sm tracking-tight ${
                        isPrimary
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {persona.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-600">
                        <span className="font-semibold text-stone-900">
                          {isPrimary ? 'Phân khúc Cốt lõi (Primary)' : 'Phân khúc Phụ (Secondary)'}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{persona.role || 'Người dùng'}</span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 mt-0.5">
                        {persona.name}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {persona.demographics}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-600 uppercase tracking-wider block font-semibold">
                        Độ Phù hợp (Fit)
                      </span>
                      <span className="font-mono text-lg font-bold text-stone-900">
                        {persona.fitScore}%
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(persona.id)}
                      title="Xóa Persona này"
                      className="mt-2 text-stone-600 hover:text-rose-600 p-1 rounded hover:bg-stone-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Persona Deep Dive Sections */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Pain Points */}
                  <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800 text-[11px] uppercase tracking-wide">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Nỗi đau & Thách thức (Pain Points)</span>
                    </div>
                    <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                      {persona.painPoints.map((pain, i) => (
                        <li key={i} className="line-clamp-2">
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Goals & Gains */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[11px] uppercase tracking-wide">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mục tiêu & Kỳ vọng (Goals)</span>
                    </div>
                    <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                      {persona.goals.map((goal, i) => (
                        <li key={i} className="line-clamp-2">
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buying Triggers */}
                  <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px] uppercase tracking-wide">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Động lực Kích hoạt Mua (Triggers)</span>
                    </div>
                    <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                      {persona.buyingTriggers.map((trig, i) => (
                        <li key={i} className="line-clamp-2">
                          {trig}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Objections */}
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-stone-700 text-[11px] uppercase tracking-wide">
                      <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                      <span>Rào cản & Lý do Từ chối (Objections)</span>
                    </div>
                    <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                      {persona.objections.map((obj, i) => (
                        <li key={i} className="line-clamp-2">
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Willingness to Pay & Channels Strip */}
                <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Coins className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-stone-800 block text-[11px]">
                        Khả năng & Mức độ sẵn sàng chi trả:
                      </span>
                      <span className="text-stone-600 leading-relaxed">
                        {persona.willingnessToPay}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Radio className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-stone-800 block text-[11px]">
                        Kênh tiếp cận & Điểm chạm truyền thông:
                      </span>
                      <div className="flex flex-wrap gap-1 text-stone-600 mt-0.5">
                        {persona.channels.map((ch, idx) => (
                          <span key={idx}>
                            {ch}
                            {idx < persona.channels.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
