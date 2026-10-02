import React from 'react';
import { Plus, Printer, Download, Upload, RotateCcw, Sparkles } from 'lucide-react';

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
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold tracking-tight text-lg shadow-sm">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 tracking-tight text-base">ProductPulse</span>
                <span className="text-xs text-stone-600 font-mono">v2.4</span>
              </div>
              <p className="text-xs text-stone-600 hidden sm:block">
                Thẩm định Sản phẩm & Chân dung Khách hàng Mục tiêu
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Functional Segmented Controls */}
          <nav className="flex items-center bg-stone-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'products'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Danh sách ({productCount})
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'evaluation'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bảng Thẩm định
            </button>
            <button
              onClick={() => setActiveTab('personas')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'personas'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Khách hàng Mục tiêu
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'comparison'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              So sánh Đối đầu
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 border-r border-stone-200 pr-2 mr-1">
              <button
                onClick={onPrint}
                title="In hoặc Lưu báo cáo PDF"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onExportJSON}
                title="Tải về file dữ liệu JSON"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onImportJSON}
                title="Nhập dữ liệu từ file JSON"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={onResetData}
                title="Khôi phục dữ liệu mẫu ban đầu"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onNewProduct}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Sản phẩm</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
