import React from 'react';
import { Factory, Globe2, Package, Timer, Wallet } from 'lucide-react';
import { Product } from '../types/product';
import {
  basisLabel,
  calculateUnitEconomics,
  normalizeEconomics,
  normalizeMarketProfile,
  normalizeOperations,
} from '../utils/commercial';

interface Props {
  product: Product;
  onEdit: () => void;
}

const formatMoney = (value: number | undefined, currency: 'VND' | 'USD') => {
  if (value === undefined) return '—';
  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value);
};

export const EconomicsOperationsView: React.FC<Props> = ({ product, onEdit }) => {
  const market = normalizeMarketProfile(product.marketProfile);
  const operations = normalizeOperations(product.operations);
  const { economics, baseUnitCost, platformFee, contribution, contributionMarginPct, markup } =
    calculateUnitEconomics(product.economics);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Kinh tế & Vận hành</h2>
          <p className="mt-1 text-sm text-stone-500">Tách giả thuyết, báo giá và số thực tế.</p>
        </div>
        <button onClick={onEdit} className="rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white">
          Cập nhật
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Globe2 className="h-4 w-4" /> Khách hàng & thị trường
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><span className="text-stone-500">Cơ sở</span><span>{basisLabel[market.basis]}</span></div>
            <div className="flex justify-between gap-3"><span className="text-stone-500">Phân khúc</span><span>{market.customerSegment}</span></div>
            <div className="flex justify-between gap-3"><span className="text-stone-500">Độ tuổi</span><span>{market.ageMin !== undefined || market.ageMax !== undefined ? `${market.ageMin ?? '?'}–${market.ageMax ?? '?'}` : '—'}</span></div>
            <div className="flex justify-between gap-3"><span className="text-stone-500">Phạm vi</span><span>{market.marketScope}</span></div>
            <div>
              <div className="text-stone-500">Thị trường mục tiêu</div>
              <div className="mt-1 text-stone-800">{market.targetMarkets.join(' · ') || '—'}</div>
            </div>
            <div>
              <div className="text-stone-500">Kênh</div>
              <div className="mt-1 text-stone-800">{market.channels.join(' · ') || '—'}</div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Wallet className="h-4 w-4" /> Unit economics
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ['Giá nhập', economics.importUnitCost],
              ['Nguyên liệu', economics.materialCost],
              ['Nhân công', economics.laborCost],
              ['Đóng gói', economics.packagingCost],
              ['Chi phí khác', economics.otherUnitCost],
              ['Giá bán', economics.targetSellingPrice],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-lg bg-stone-50 p-2.5">
                <div className="text-xs text-stone-500">{label}</div>
                <div className="mt-1 font-mono text-sm font-semibold text-stone-900">
                  {formatMoney(value as number | undefined, economics.currency)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2 border-t border-stone-100 pt-3 text-sm">
            <div className="flex justify-between"><span className="text-stone-500">Cơ sở</span><span>{basisLabel[economics.basis]}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Base unit cost</span><span className="font-mono">{formatMoney(baseUnitCost, economics.currency)}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Phí sàn</span><span className="font-mono">{formatMoney(platformFee, economics.currency)}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Contribution</span><span className="font-mono">{formatMoney(contribution, economics.currency)}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Margin</span><span className="font-mono">{contributionMarginPct === undefined ? '—' : `${contributionMarginPct.toFixed(1)}%`}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Markup</span><span className="font-mono">{markup === undefined ? '—' : `${markup.toFixed(2)}x`}</span></div>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Factory className="h-4 w-4" /> Sản xuất
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-stone-500">Cơ sở</span><span>{basisLabel[operations.basis]}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Mô hình</span><span>{operations.productionModel}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Fulfillment</span><span>{operations.fulfillmentModel}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Nguồn</span><span>{operations.supplierCountry || '—'}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">MOQ</span><span>{operations.moq ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Lead time NCC</span><span>{operations.supplierLeadTimeDays === undefined ? '—' : `${operations.supplierLeadTimeDays} ngày`}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Hoàn thiện 1 đơn</span><span>{operations.completionTimeHours === undefined ? '—' : `${operations.completionTimeHours} giờ`}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">QC</span><span>{operations.qcTimeMinutes === undefined ? '—' : `${operations.qcTimeMinutes} phút`}</span></div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
          <Package className="h-4 w-4" /> Quy trình vận hành
        </div>
        {operations.steps.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">Chưa thiết lập quy trình.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            {operations.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3 rounded-lg bg-stone-50 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-800">{step.name}</div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
                    {step.owner && <span>{step.owner}</span>}
                    {step.durationMinutes !== undefined && (
                      <span className="inline-flex items-center gap-1"><Timer className="h-3 w-3" /> {step.durationMinutes} phút</span>
                    )}
                  </div>
                  {step.note && <p className="mt-1 text-xs leading-4 text-stone-500">{step.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
