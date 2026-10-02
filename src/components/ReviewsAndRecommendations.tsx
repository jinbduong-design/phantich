import React, { useState } from 'react';
import { RecommendationItem, SimulatedReview } from '../types/product';
import { MessageSquare, CheckCircle, Star, ThumbsUp, AlertCircle, ArrowUpRight, Plus, Trash2 } from 'lucide-react';

interface ReviewsAndRecommendationsProps {
  recommendations: RecommendationItem[];
  simulatedReviews: SimulatedReview[];
  onUpdateRecommendations: (updated: RecommendationItem[]) => void;
}

export const ReviewsAndRecommendations: React.FC<ReviewsAndRecommendationsProps> = ({
  recommendations,
  simulatedReviews,
  onUpdateRecommendations,
}) => {
  const [newRec, setNewRec] = useState({
    area: 'Khách hàng mục tiêu',
    action: '',
    priority: 'Cao' as 'Cao' | 'Trung bình' | 'Thấp',
  });

  const handleAddRec = () => {
    if (!newRec.action.trim()) return;
    onUpdateRecommendations([...recommendations, newRec]);
    setNewRec({ area: 'Khách hàng mục tiêu', action: '', priority: 'Cao' });
  };

  const handleDeleteRec = (index: number) => {
    onUpdateRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const getPriorityStyle = (priority: 'Cao' | 'Trung bình' | 'Thấp') => {
    switch (priority) {
      case 'Cao':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Trung bình':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Thấp':
      default:
        return 'text-stone-700 bg-stone-100 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Plan Section */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold uppercase tracking-wider">Hành động Khuyến nghị</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Lộ trình Cải tiến & Hành động Ưu tiên (Action Plan)
            </h2>
          </div>
          <span className="text-xs text-stone-600 font-mono">
            {recommendations.length} khuyến nghị chiến lược
          </span>
        </div>

        {/* Add Recommendation Form */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          <div className="sm:col-span-3">
            <select
              value={newRec.area}
              onChange={(e) => setNewRec({ ...newRec, area: e.target.value })}
              className="w-full p-2 border border-stone-200 rounded-lg bg-white focus:ring-1 focus:ring-stone-900"
            >
              <option value="Khách hàng mục tiêu">Khách hàng mục tiêu</option>
              <option value="Định giá & Đóng gói">Định giá & Đóng gói</option>
              <option value="Tính năng & Trải nghiệm">Tính năng & Trải nghiệm</option>
              <option value="Thông điệp truyền thông (GTM)">Thông điệp truyền thông (GTM)</option>
              <option value="Rào cản pháp lý & Bảo mật">Rào cản pháp lý & Bảo mật</option>
            </select>
          </div>
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Nhập hành động khuyến nghị cụ thể..."
              value={newRec.action}
              onChange={(e) => setNewRec({ ...newRec, action: e.target.value })}
              className="w-full p-2 border border-stone-200 rounded-lg bg-white focus:ring-1 focus:ring-stone-900"
            />
          </div>
          <div className="sm:col-span-2">
            <select
              value={newRec.priority}
              onChange={(e) => setNewRec({ ...newRec, priority: e.target.value as any })}
              className="w-full p-2 border border-stone-200 rounded-lg bg-white focus:ring-1 focus:ring-stone-900"
            >
              <option value="Cao">Ưu tiên Cao</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thấp">Ưu tiên Thấp</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <button
              onClick={handleAddRec}
              className="w-full h-full min-h-[36px] bg-stone-900 text-white rounded-lg hover:bg-stone-800 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-2.5">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="group flex items-start justify-between gap-3 p-3.5 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 transition-colors text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900 uppercase tracking-wide text-[10px]">
                    {rec.area}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] border ${getPriorityStyle(
                      rec.priority
                    )}`}
                  >
                    Ưu tiên {rec.priority}
                  </span>
                </div>
                <p className="text-stone-800 text-xs sm:text-sm leading-relaxed">
                  {rec.action}
                </p>
              </div>

              <button
                onClick={() => handleDeleteRec(i)}
                className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-rose-600 p-1 rounded transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Reviews & Sentiment Voices */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold uppercase tracking-wider">Tiếng nói Khách hàng Giả lập</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Giả lập Phản hồi & Đánh giá Thực tế từ Người dùng (Customer Voices)
            </h2>
          </div>
          <span className="text-xs text-stone-600">
            Dự báo phản ứng thị trường
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simulatedReviews.map((rev, idx) => (
            <div
              key={idx}
              className="border border-stone-200 rounded-xl p-4 bg-stone-50/40 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      rev.sentiment === 'Tích cực'
                        ? 'bg-emerald-50 text-emerald-700'
                        : rev.sentiment === 'Quan ngại'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {rev.sentiment}
                  </span>
                </div>

                <p className="text-xs text-stone-800 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-xs">
                <span className="font-semibold text-stone-900 block">
                  {rev.author}
                </span>
                <span className="text-stone-600 text-[11px]">
                  {rev.persona}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
