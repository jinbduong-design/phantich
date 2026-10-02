import React, { useState } from 'react';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import { RecommendationItem } from '../types/product';

interface ReviewsAndRecommendationsProps {
  recommendations: RecommendationItem[];
  onUpdateRecommendations: (updated: RecommendationItem[]) => void;
}

export const ReviewsAndRecommendations: React.FC<ReviewsAndRecommendationsProps> = ({
  recommendations,
  onUpdateRecommendations,
}) => {
  const [newRec, setNewRec] = useState({
    area: 'Khách hàng',
    action: '',
    priority: 'Cao' as 'Cao' | 'Trung bình' | 'Thấp',
  });

  const handleAddRec = () => {
    if (!newRec.action.trim()) return;
    onUpdateRecommendations([...recommendations, newRec]);
    setNewRec({ area: 'Khách hàng', action: '', priority: 'Cao' });
  };

  const handleDeleteRec = (index: number) => {
    onUpdateRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const getPriorityStyle = (priority: 'Cao' | 'Trung bình' | 'Thấp') => {
    if (priority === 'Cao') return 'text-rose-700 bg-rose-50 border-rose-200';
    if (priority === 'Trung bình') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-stone-700 bg-stone-100 border-stone-200';
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-2 border-b border-stone-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Hành động tiếp theo
            </div>
            <h2 className="mt-1 text-lg font-bold text-stone-900">
              Giảm uncertainty trước khi tăng điểm
            </h2>
          </div>
          <span className="text-xs text-stone-500">{recommendations.length} việc</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3 sm:grid-cols-12">
          <select
            value={newRec.area}
            onChange={(e) => setNewRec({ ...newRec, area: e.target.value })}
            className="rounded-lg border border-stone-200 bg-white p-2 text-sm sm:col-span-3"
          >
            <option>Khách hàng</option>
            <option>Giải pháp</option>
            <option>Định giá</option>
            <option>Cạnh tranh</option>
            <option>Phân phối</option>
            <option>Economics</option>
          </select>

          <input
            type="text"
            placeholder="Việc cần kiểm chứng cụ thể..."
            value={newRec.action}
            onChange={(e) => setNewRec({ ...newRec, action: e.target.value })}
            className="rounded-lg border border-stone-200 bg-white p-2 text-sm sm:col-span-6"
          />

          <select
            value={newRec.priority}
            onChange={(e) =>
              setNewRec({
                ...newRec,
                priority: e.target.value as RecommendationItem['priority'],
              })
            }
            className="rounded-lg border border-stone-200 bg-white p-2 text-sm sm:col-span-2"
          >
            <option value="Cao">Cao</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Thấp">Thấp</option>
          </select>

          <button
            onClick={handleAddRec}
            className="flex min-h-10 items-center justify-center rounded-lg bg-stone-900 text-white hover:bg-stone-800 sm:col-span-1"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {recommendations.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 p-5 text-center text-sm text-stone-500">
              Chưa có hành động. Hệ thống chỉ tạo việc dựa trên khoảng trống bằng chứng, không tạo review hay phản hồi giả.
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div
                key={`${rec.area}-${index}`}
                className="group flex items-start justify-between gap-3 rounded-lg border border-stone-200 p-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">
                      {rec.area}
                    </span>
                    <span
                      className={`rounded border px-2 py-0.5 text-xs font-semibold ${getPriorityStyle(
                        rec.priority,
                      )}`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-5 text-stone-800">{rec.action}</p>
                </div>
                <button
                  onClick={() => handleDeleteRec(index)}
                  className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
