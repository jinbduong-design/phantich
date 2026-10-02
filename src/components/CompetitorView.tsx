import React, { useState } from 'react';
import { CompetitorItem } from '../types/product';
import { Shield, Plus, Trash2, Swords, AlertCircle } from 'lucide-react';

interface CompetitorViewProps {
  competitorMatrix: CompetitorItem[];
  onUpdateCompetitors: (updated: CompetitorItem[]) => void;
}

export const CompetitorView: React.FC<CompetitorViewProps> = ({
  competitorMatrix,
  onUpdateCompetitors,
}) => {
  const [newCompetitor, setNewCompetitor] = useState({
    name: '',
    comparison: '',
    threatLevel: 'Trung bình' as 'Cao' | 'Trung bình' | 'Thấp',
  });

  const handleAdd = () => {
    if (!newCompetitor.name.trim()) return;
    onUpdateCompetitors([...competitorMatrix, newCompetitor]);
    setNewCompetitor({ name: '', comparison: '', threatLevel: 'Trung bình' });
  };

  const handleDelete = (index: number) => {
    onUpdateCompetitors(competitorMatrix.filter((_, i) => i !== index));
  };

  const getThreatBadge = (level: 'Cao' | 'Trung bình' | 'Thấp') => {
    switch (level) {
      case 'Cao':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Trung bình':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Thấp':
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
            <Swords className="w-4 h-4 text-stone-500" />
            <span className="font-semibold uppercase tracking-wider">Cảnh quan Cạnh tranh</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{competitorMatrix.length} đối thủ chính</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Ma trận So sánh Đối thủ & Định vị Khác biệt (Moat)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Phân tích trực diện ưu thế và rủi ro trước các lựa chọn thay thế hiện có trên thị trường để tìm ra điểm tựa độc nhất (Unique Selling Proposition).
          </p>
        </div>
      </div>

      {/* Add Competitor Form */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
          Thêm đối thủ cạnh tranh mới
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Tên đối thủ (VD: Excel/Thủ công, Brand X...)"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
              className="w-full p-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900"
            />
          </div>
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="So sánh điểm mạnh/yếu so với giải pháp của bạn..."
              value={newCompetitor.comparison}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, comparison: e.target.value })}
              className="w-full p-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900"
            />
          </div>
          <div className="sm:col-span-2">
            <select
              value={newCompetitor.threatLevel}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, threatLevel: e.target.value as any })}
              className="w-full p-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900 bg-white"
            >
              <option value="Cao">Nguy cơ Cao</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thấp">Nguy cơ Thấp</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <button
              onClick={handleAdd}
              className="w-full h-full min-h-[36px] bg-stone-900 text-white rounded-lg hover:bg-stone-800 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Competitors List */}
      <div className="space-y-4">
        {competitorMatrix.map((comp, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-stone-900">
                  {comp.name}
                </h4>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${getThreatBadge(
                    comp.threatLevel
                  )}`}
                >
                  Mức đe dọa: {comp.threatLevel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {comp.comparison}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleDelete(idx)}
                className="text-stone-600 hover:text-rose-600 p-2 rounded-lg hover:bg-stone-50 transition-colors"
                title="Xóa đối thủ này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
