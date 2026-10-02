import React from 'react';
import {
  Download,
  MoreHorizontal,
  Plus,
  Printer,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { APP_VERSION } from '../config/appVersion';

interface HeaderProps {
  activeTab: 'products' | 'evaluation' | 'personas' | 'comparison';
  setActiveTab: (tab: 'products' | 'evaluation' | 'personas' | 'comparison') => void;
  onNewProduct: () => void;
  onPrint: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  onResetData: () => void;
  productCount: number;
}

const navItems: Array<{
  id: HeaderProps['activeTab'];
  label: string;
}> = [
  { id: 'products', label: 'Sản phẩm' },
  { id: 'evaluation', label: 'Đánh giá' },
  { id: 'personas', label: 'Khách hàng' },
  { id: 'comparison', label: 'So sánh' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewProduct,
  onPrint,
  onExportJSON,
  onImportJSON,
  onResetData,
  productCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-sm font-bold text-white">
              P
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-stone-900 sm:text-base">
                  ProductPulse
                </span>
                <span className="shrink-0 rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-stone-600">
                  v{APP_VERSION}
                </span>
              </div>
              <p className="hidden text-xs text-stone-500 sm:block">
                Product intelligence workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <details className="relative">
              <summary
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 [&::-webkit-details-marker]:hidden"
                aria-label="Công cụ dữ liệu"
              >
                <MoreHorizontal className="h-5 w-5" />
              </summary>
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg">
                <button onClick={onPrint} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50">
                  <Printer className="h-4 w-4" /> Báo cáo PDF
                </button>
                <button onClick={onExportJSON} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50">
                  <Download className="h-4 w-4" /> Xuất dữ liệu
                </button>
                <button onClick={onImportJSON} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50">
                  <Upload className="h-4 w-4" /> Nhập dữ liệu
                </button>
                <button onClick={onResetData} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
                  <RotateCcw className="h-4 w-4" /> Khôi phục mẫu
                </button>
              </div>
            </details>

            <button
              onClick={onNewProduct}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-stone-900 px-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Thêm sản phẩm</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>

        <nav className="-mx-3 flex overflow-x-auto px-3 pb-2 sm:mx-0 sm:px-0">
          <div className="flex min-w-max items-center gap-1 rounded-lg bg-stone-100 p-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
                {item.id === 'products' && (
                  <span className="ml-1 text-xs text-stone-400">{productCount}</span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};
