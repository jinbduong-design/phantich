import React from 'react';
import { AlertTriangle, Beaker, Brain, CheckCircle2, ExternalLink } from 'lucide-react';
import { ProductAnalysis } from '../types/product';

interface AnalysisSnapshotProps {
  analysis: ProductAnalysis;
}

const basisLabel = {
  observed: 'Quan sát',
  inferred: 'Suy luận',
  researched: 'Research',
} as const;

export const AnalysisSnapshot: React.FC<AnalysisSnapshotProps> = ({ analysis }) => {
  return (
    <section className="rounded-xl border border-indigo-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 border-b border-stone-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            <Brain className="h-4 w-4" />
            Analysis Score
          </div>
          <h2 className="mt-1 text-lg font-bold text-stone-900">Phân tích chiến lược từ ChatGPT</h2>
          <p className="mt-1 max-w-3xl text-sm leading-5 text-stone-600">{analysis.summary}</p>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2">
          <div className="rounded-lg bg-indigo-50 px-3 py-2 text-center">
            <div className="text-xs text-indigo-700">Điểm phân tích</div>
            <div className="mt-0.5 font-mono text-2xl font-bold text-indigo-950">
              {analysis.overallScore}
            </div>
          </div>
          <div className="rounded-lg bg-stone-100 px-3 py-2 text-center">
            <div className="text-xs text-stone-500">Confidence</div>
            <div className="mt-0.5 font-mono text-2xl font-bold text-stone-900">
              {analysis.confidence}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {analysis.metrics.map((metric) => (
          <div key={metric.key} className="rounded-lg border border-stone-200 bg-stone-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-stone-800">{metric.label}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-white px-1.5 py-0.5 text-xs text-stone-500">
                    {basisLabel[metric.basis]}
                  </span>
                  <span className="text-xs text-stone-400">tin cậy {metric.confidence}%</span>
                </div>
              </div>
              <div className="font-mono text-lg font-bold text-stone-900">{metric.score}</div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div className="h-full rounded-full bg-stone-800" style={{ width: `${metric.score}%` }} />
            </div>
            {metric.rationale && (
              <p className="mt-2 text-xs leading-4 text-stone-500">{metric.rationale}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" /> Điểm mạnh / cơ hội
          </div>
          <ul className="mt-2 space-y-1.5 text-sm leading-5 text-stone-700">
            {[...analysis.strengths, ...analysis.opportunities].slice(0, 5).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" /> Giả thuyết / rủi ro
          </div>
          <ul className="mt-2 space-y-1.5 text-sm leading-5 text-stone-700">
            {[...analysis.assumptions, ...analysis.risks].slice(0, 5).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
            <Beaker className="h-4 w-4" /> Cần test tiếp
          </div>
          <ul className="mt-2 space-y-1.5 text-sm leading-5 text-stone-700">
            {analysis.nextTests.slice(0, 5).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      {analysis.sources.length > 0 && (
        <div className="mt-4 border-t border-stone-100 pt-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">Nguồn phân tích</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.sources.map((source, index) =>
              source.url ? (
                <a
                  key={`${source.title}-${index}`}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
                >
                  {source.title} <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span
                  key={`${source.title}-${index}`}
                  className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs text-stone-600"
                >
                  {source.title}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-stone-500">
        Analysis Score là đánh giá chiến lược/hypothesis. Validation Score bên dưới chỉ tăng khi có evidence thực tế.
      </p>
    </section>
  );
};
