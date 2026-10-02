import React, { useState } from 'react';
import { SwotAnalysis, MarketAnalysis } from '../types/product';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  Zap,
  Plus,
  Trash2,
  PieChart,
  Compass,
} from 'lucide-react';

interface SwotMarketViewProps {
  swot: SwotAnalysis;
  marketAnalysis: MarketAnalysis;
  onUpdateSwot: (newSwot: SwotAnalysis) => void;
}

export const SwotMarketView: React.FC<SwotMarketViewProps> = ({
  swot,
  marketAnalysis,
  onUpdateSwot,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'swot' | 'market'>('all');
  const [newInputs, setNewInputs] = useState({
    strength: '',
    weakness: '',
    opportunity: '',
    threat: '',
  });

  const handleAddItem = (field: keyof SwotAnalysis, text: string) => {
    if (!text.trim()) return;
    onUpdateSwot({
      ...swot,
      [field]: [...swot[field], text.trim()],
    });
    setNewInputs({ ...newInputs, [field === 'strengths' ? 'strength' : field === 'weaknesses' ? 'weakness' : field === 'opportunities' ? 'opportunity' : 'threat']: '' });
  };

  const handleRemoveItem = (field: keyof SwotAnalysis, index: number) => {
    onUpdateSwot({
      ...swot,
      [field]: swot[field].filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Phân tích Chiến lược
            </span>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Ma trận SWOT & Độ lớn Tiềm năng Thị trường
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Nhận diện rõ nội lực cạnh tranh, rào cản hạn chế, thời cơ bứt phá và các mối nguy rình rập để xây dựng chiến lược Go-To-Market vững chắc.
            </p>
          </div>

          <div className="flex items-center bg-stone-100 p-1 rounded-lg self-start sm:self-center">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSection === 'all'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveSection('swot')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSection === 'swot'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Chỉ SWOT
            </button>
            <button
              onClick={() => setActiveSection('market')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSection === 'market'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Thị trường (TAM/SAM/SOM)
            </button>
          </div>
        </div>
      </div>

      {/* Market Opportunity Banner (TAM - SAM - SOM) */}
      {(activeSection === 'all' || activeSection === 'market') && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <span>Quy mô & Tiềm năng Thị trường (Market Opportunity)</span>
          </div>

          <div className="p-4 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs sm:text-sm leading-relaxed text-indigo-950">
            <strong className="block text-indigo-900 font-semibold mb-1 text-xs uppercase tracking-wide">
              Ước tính Quy mô Thị trường (TAM · SAM · SOM):
            </strong>
            {marketAnalysis.tamSamSom}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/50">
              <span className="font-bold text-stone-900 block text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                Động lực thúc đẩy thị trường (Market Drivers)
              </span>
              <ul className="space-y-1.5 text-stone-700 list-disc list-inside leading-relaxed">
                {marketAnalysis.marketDrivers.map((driver, i) => (
                  <li key={i}>{driver}</li>
                ))}
              </ul>
            </div>

            <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/50">
              <span className="font-bold text-stone-900 block text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Rào cản gia nhập & Chuyển đổi (Adoption Barriers)
              </span>
              <ul className="space-y-1.5 text-stone-700 list-disc list-inside leading-relaxed">
                {marketAnalysis.adoptionBarriers.map((barrier, i) => (
                  <li key={i}>{barrier}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SWOT 4-Quadrant Grid */}
      {(activeSection === 'all' || activeSection === 'swot') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Điểm mạnh Cốt lõi (Strengths)
                  </h3>
                  <span className="text-[10px] text-stone-600 uppercase font-semibold">Nội tại tích cực</span>
                </div>
              </div>
              <span className="text-xs text-stone-600 font-mono font-medium">{swot.strengths.length} yếu tố</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-800">
              {swot.strengths.map((str, idx) => (
                <li key={idx} className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-stone-50 hover:bg-stone-100/70 transition-colors">
                  <span className="leading-relaxed">{str}</span>
                  <button
                    onClick={() => handleRemoveItem('strengths', idx)}
                    className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-rose-600 p-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Thêm điểm mạnh mới..."
                value={newInputs.strength}
                onChange={(e) => setNewInputs({ ...newInputs, strength: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem('strengths', newInputs.strength)}
                className="w-full text-xs p-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
              <button
                onClick={() => handleAddItem('strengths', newInputs.strength)}
                className="p-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                  W
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Điểm yếu & Hạn chế (Weaknesses)
                  </h3>
                  <span className="text-[10px] text-stone-600 uppercase font-semibold">Nội tại cần khắc phục</span>
                </div>
              </div>
              <span className="text-xs text-stone-600 font-mono font-medium">{swot.weaknesses.length} yếu tố</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-800">
              {swot.weaknesses.map((weak, idx) => (
                <li key={idx} className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-stone-50 hover:bg-stone-100/70 transition-colors">
                  <span className="leading-relaxed">{weak}</span>
                  <button
                    onClick={() => handleRemoveItem('weaknesses', idx)}
                    className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-rose-600 p-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Thêm điểm yếu mới..."
                value={newInputs.weakness}
                onChange={(e) => setNewInputs({ ...newInputs, weakness: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem('weaknesses', newInputs.weakness)}
                className="w-full text-xs p-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
              <button
                onClick={() => handleAddItem('weaknesses', newInputs.weakness)}
                className="p-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Opportunities */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                  O
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Cơ hội Thị trường (Opportunities)
                  </h3>
                  <span className="text-[10px] text-stone-600 uppercase font-semibold">Thời cơ bên ngoài</span>
                </div>
              </div>
              <span className="text-xs text-stone-600 font-mono font-medium">{swot.opportunities.length} cơ hội</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-800">
              {swot.opportunities.map((opp, idx) => (
                <li key={idx} className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-stone-50 hover:bg-stone-100/70 transition-colors">
                  <span className="leading-relaxed">{opp}</span>
                  <button
                    onClick={() => handleRemoveItem('opportunities', idx)}
                    className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-rose-600 p-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Thêm cơ hội mới..."
                value={newInputs.opportunity}
                onChange={(e) => setNewInputs({ ...newInputs, opportunity: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem('opportunities', newInputs.opportunity)}
                className="w-full text-xs p-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
              <button
                onClick={() => handleAddItem('opportunities', newInputs.opportunity)}
                className="p-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Threats */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  T
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Thách thức & Đe dọa (Threats)
                  </h3>
                  <span className="text-[10px] text-stone-600 uppercase font-semibold">Rủi ro bên ngoài</span>
                </div>
              </div>
              <span className="text-xs text-stone-600 font-mono font-medium">{swot.threats.length} nguy cơ</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-800">
              {swot.threats.map((thr, idx) => (
                <li key={idx} className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-stone-50 hover:bg-stone-100/70 transition-colors">
                  <span className="leading-relaxed">{thr}</span>
                  <button
                    onClick={() => handleRemoveItem('threats', idx)}
                    className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-rose-600 p-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Thêm thách thức mới..."
                value={newInputs.threat}
                onChange={(e) => setNewInputs({ ...newInputs, threat: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem('threats', newInputs.threat)}
                className="w-full text-xs p-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
              <button
                onClick={() => handleAddItem('threats', newInputs.threat)}
                className="p-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
