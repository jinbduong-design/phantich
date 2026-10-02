import React from 'react';
import {
  MarketProfile,
  OperationsProfile,
  Product,
  UnitEconomics,
} from '../types/product';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  market: MarketProfile;
  economics: UnitEconomics;
  operations: OperationsProfile;
  onMarketChange: (value: MarketProfile) => void;
  onEconomicsChange: (value: UnitEconomics) => void;
  onOperationsChange: (value: OperationsProfile) => void;
}

const basisOptions = [
  ['unknown', 'Chưa xác định'],
  ['hypothesis', 'Giả thuyết'],
  ['quote', 'Báo giá'],
  ['actual', 'Thực tế'],
] as const;

const numberValue = (value?: number) => value ?? '';

export const CommercialOperationsFields: React.FC<Props> = ({
  market,
  economics,
  operations,
  onMarketChange,
  onEconomicsChange,
  onOperationsChange,
}) => {
  const updateStep = (index: number, patch: Partial<OperationsProfile['steps'][number]>) => {
    onOperationsChange({
      ...operations,
      steps: operations.steps.map((step, i) => (i === index ? { ...step, ...patch } : step)),
    });
  };

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
      <div>
        <h3 className="text-sm font-semibold text-stone-900">Thị trường · Giá · Sản xuất · Vận hành</h3>
        <p className="mt-1 text-xs leading-5 text-stone-500">
          Mỗi nhóm có trạng thái dữ liệu riêng để phân biệt giả thuyết, báo giá và số thực tế.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-stone-800">Khách hàng & thị trường</h4>
          <select
            value={market.basis}
            onChange={(e) => onMarketChange({ ...market, basis: e.target.value as MarketProfile['basis'] })}
            className="rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs"
          >
            {basisOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Phân khúc giá</span>
            <select
              value={market.customerSegment}
              onChange={(e) => onMarketChange({ ...market, customerSegment: e.target.value as MarketProfile['customerSegment'] })}
              className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
            >
              <option>Chưa xác định</option>
              <option>Thấp</option>
              <option>Trung bình</option>
              <option>Cao cấp</option>
              <option>Luxury</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Độ tuổi từ</span>
            <input
              type="number"
              min="0"
              max="100"
              value={numberValue(market.ageMin)}
              onChange={(e) => onMarketChange({ ...market, ageMin: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full rounded-lg border border-stone-300 p-2.5"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Đến</span>
            <input
              type="number"
              min="0"
              max="100"
              value={numberValue(market.ageMax)}
              onChange={(e) => onMarketChange({ ...market, ageMax: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full rounded-lg border border-stone-300 p-2.5"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Phạm vi</span>
            <select
              value={market.marketScope}
              onChange={(e) => onMarketChange({ ...market, marketScope: e.target.value as MarketProfile['marketScope'] })}
              className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
            >
              <option>Chưa xác định</option>
              <option>Việt Nam</option>
              <option>Quốc tế</option>
              <option>Cả hai</option>
            </select>
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Thị trường mục tiêu</span>
            <input
              value={market.targetMarkets.join(', ')}
              onChange={(e) => onMarketChange({ ...market, targetMarkets: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
              placeholder="Việt Nam, Mỹ, Úc..."
              className="w-full rounded-lg border border-stone-300 p-2.5"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Kênh dự kiến</span>
            <input
              value={market.channels.join(', ')}
              onChange={(e) => onMarketChange({ ...market, channels: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
              placeholder="Shopee, TikTok, Shopify..."
              className="w-full rounded-lg border border-stone-300 p-2.5"
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-stone-800">Unit economics</h4>
          <div className="flex items-center gap-2">
            <select
              value={economics.currency}
              onChange={(e) => onEconomicsChange({ ...economics, currency: e.target.value as UnitEconomics['currency'] })}
              className="rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs"
            >
              <option>VND</option>
              <option>USD</option>
            </select>
            <select
              value={economics.basis}
              onChange={(e) => onEconomicsChange({ ...economics, basis: e.target.value as UnitEconomics['basis'] })}
              className="rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs"
            >
              {basisOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['importUnitCost', 'Giá nhập / thành phẩm'],
            ['materialCost', 'Nguyên liệu'],
            ['laborCost', 'Nhân công'],
            ['packagingCost', 'Đóng gói'],
            ['otherUnitCost', 'Chi phí khác'],
            ['targetSellingPrice', 'Giá bán dự kiến'],
          ].map(([key, label]) => (
            <label key={key} className="space-y-1 text-sm">
              <span className="text-stone-600">{label}</span>
              <input
                type="number"
                min="0"
                value={numberValue(economics[key as keyof UnitEconomics] as number | undefined)}
                onChange={(e) => onEconomicsChange({ ...economics, [key]: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="w-full rounded-lg border border-stone-300 p-2.5 font-mono"
              />
            </label>
          ))}

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Phí sàn (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={numberValue(economics.platformFeePct)}
              onChange={(e) => onEconomicsChange({ ...economics, platformFeePct: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full rounded-lg border border-stone-300 p-2.5 font-mono"
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-stone-800">Sản xuất & fulfillment</h4>
          <select
            value={operations.basis}
            onChange={(e) => onOperationsChange({ ...operations, basis: e.target.value as OperationsProfile['basis'] })}
            className="rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs"
          >
            {basisOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Mô hình sản xuất</span>
            <select
              value={operations.productionModel}
              onChange={(e) => onOperationsChange({ ...operations, productionModel: e.target.value as OperationsProfile['productionModel'] })}
              className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
            >
              <option>Chưa xác định</option>
              <option>Tự sản xuất</option>
              <option>Gia công</option>
              <option>Nhập thành phẩm</option>
              <option>Hybrid</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Fulfillment</span>
            <select
              value={operations.fulfillmentModel}
              onChange={(e) => onOperationsChange({ ...operations, fulfillmentModel: e.target.value as OperationsProfile['fulfillmentModel'] })}
              className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
            >
              <option>Chưa xác định</option>
              <option>Làm theo đơn</option>
              <option>Có sẵn</option>
              <option>Hybrid</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Nguồn / quốc gia NCC</span>
            <input
              value={operations.supplierCountry}
              onChange={(e) => onOperationsChange({ ...operations, supplierCountry: e.target.value })}
              placeholder="Việt Nam / Trung Quốc..."
              className="w-full rounded-lg border border-stone-300 p-2.5"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">MOQ</span>
            <input
              type="number"
              min="0"
              value={numberValue(operations.moq)}
              onChange={(e) => onOperationsChange({ ...operations, moq: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full rounded-lg border border-stone-300 p-2.5 font-mono"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Lead time NCC (ngày)</span>
            <input
              type="number"
              min="0"
              value={numberValue(operations.supplierLeadTimeDays)}
              onChange={(e) => onOperationsChange({ ...operations, supplierLeadTimeDays: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full rounded-lg border border-stone-300 p-2.5 font-mono"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">Hoàn thiện 1 đơn (giờ)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={numberValue(operations.completionTimeHours)}
              onChange={(e) => onOperationsChange({ ...operations, completionTimeHours: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full rounded-lg border border-stone-300 p-2.5 font-mono"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-stone-600">QC (phút)</span>
            <input
              type="number"
              min="0"
              value={numberValue(operations.qcTimeMinutes)}
              onChange={(e) => onOperationsChange({ ...operations, qcTimeMinutes: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full rounded-lg border border-stone-300 p-2.5 font-mono"
            />
          </label>
        </div>

        <label className="mt-3 block space-y-1 text-sm">
          <span className="text-stone-600">Chính sách tồn kho</span>
          <input
            value={operations.stockPolicy}
            onChange={(e) => onOperationsChange({ ...operations, stockPolicy: e.target.value })}
            placeholder="VD: giữ sẵn khung, in ảnh/lắp ráp sau khi có đơn"
            className="w-full rounded-lg border border-stone-300 p-2.5"
          />
        </label>

        <div className="mt-4 border-t border-stone-100 pt-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-stone-800">Quy trình vận hành</div>
              <div className="text-xs text-stone-500">Từng bước từ nhận đơn tới bàn giao.</div>
            </div>
            <button
              type="button"
              onClick={() => onOperationsChange({
                ...operations,
                steps: [...operations.steps, { id: `step-${Date.now()}`, name: '', owner: '', note: '' }],
              })}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm bước
            </button>
          </div>

          <div className="space-y-2">
            {operations.steps.map((step, index) => (
              <div key={step.id} className="grid grid-cols-1 gap-2 rounded-lg bg-stone-50 p-2.5 sm:grid-cols-[1.4fr_.8fr_.6fr_auto]">
                <input
                  value={step.name}
                  onChange={(e) => updateStep(index, { name: e.target.value })}
                  placeholder={`Bước ${index + 1}: nhận ảnh / thiết kế / in...`}
                  className="rounded-md border border-stone-200 bg-white p-2 text-sm"
                />
                <input
                  value={step.owner || ''}
                  onChange={(e) => updateStep(index, { owner: e.target.value })}
                  placeholder="Ai làm"
                  className="rounded-md border border-stone-200 bg-white p-2 text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={numberValue(step.durationMinutes)}
                  onChange={(e) => updateStep(index, { durationMinutes: e.target.value === '' ? undefined : Number(e.target.value) })}
                  placeholder="Phút"
                  className="rounded-md border border-stone-200 bg-white p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => onOperationsChange({ ...operations, steps: operations.steps.filter((_, i) => i !== index) })}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
