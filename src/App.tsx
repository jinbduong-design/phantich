/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Product, TargetPersona, SwotAnalysis, CompetitorItem, RecommendationItem, ProductEvaluation } from './types/product';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { EvaluationOverview } from './components/EvaluationOverview';
import { AnalysisSnapshot } from './components/AnalysisSnapshot';
import { PersonaHub } from './components/PersonaHub';
import { SwotMarketView } from './components/SwotMarketView';
import { CompetitorView } from './components/CompetitorView';
import { ReviewsAndRecommendations } from './components/ReviewsAndRecommendations';
import { ProductComparison } from './components/ProductComparison';
import { ProductFormModal } from './components/ProductFormModal';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { PrintReport } from './components/PrintReport';
import { Search, Filter, Plus, ArrowRight, LayoutGrid, Award, BarChart3, Users, Swords, ShieldCheck, MessageSquare } from 'lucide-react';
import { normalizeEvidence, recalculateProduct } from './utils/evaluator';
import { isProductPulseAnalysisImport, productFromAnalysisImport } from './utils/analysisImport';

const STORAGE_KEY = 'productpulse_products_v3';
const LEGACY_STORAGE_KEYS = ['productpulse_products_v2'];

export default function App() {
  // Initialize state from local storage or initial products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return products[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<'products' | 'evaluation' | 'personas' | 'comparison'>('products');
  const [evalSubTab, setEvalSubTab] = useState<'overview' | 'personas' | 'swot' | 'competitors' | 'reviews'>('overview');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'analysis-desc' | 'score-desc' | 'score-asc' | 'recent'>('analysis-desc');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [productForAi, setProductForAi] = useState<Product | null>(null);

  // Hidden file input for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Failed to clear legacy localStorage', e);
    }
  }, []);

  // Sync only user-created / imported products. No fictional seed data.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [products]);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Filtering & Sorting
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetCustomerDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'analysis-desc') return (b.analysis?.overallScore ?? -1) - (a.analysis?.overallScore ?? -1);
    if (sortBy === 'score-desc') return b.evaluation.overallScore - a.evaluation.overallScore;
    if (sortBy === 'score-asc') return a.evaluation.overallScore - b.evaluation.overallScore;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Handlers
  const handleSaveProduct = (product: Product, runAiImmediate?: boolean) => {
    const exists = products.some((p) => p.id === product.id);
    if (exists) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([product, ...products]);
      setSelectedProductId(product.id);
    }

    if (runAiImmediate) {
      setProductForAi(product);
      setIsAiModalOpen(true);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Xóa sản phẩm này và toàn bộ dữ liệu đánh giá của nó?')) {
      const remaining = products.filter((p) => p.id !== productId);
      setProducts(remaining);
      if (selectedProductId === productId) {
        setSelectedProductId(remaining[0]?.id || '');
        if (remaining.length === 0) setActiveTab('products');
      }
    }
  };

  const handleUpdatePersonas = (updatedPersonas: TargetPersona[]) => {
    if (!selectedProduct) return;
    const updated: Product = {
      ...selectedProduct,
      evaluation: {
        ...selectedProduct.evaluation,
        personas: updatedPersonas,
      },
    };
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleUpdateSwot = (newSwot: SwotAnalysis) => {
    if (!selectedProduct) return;
    const updated: Product = {
      ...selectedProduct,
      evaluation: {
        ...selectedProduct.evaluation,
        swot: newSwot,
      },
    };
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleUpdateCompetitors = (updatedComps: CompetitorItem[]) => {
    if (!selectedProduct) return;
    const updated: Product = {
      ...selectedProduct,
      evaluation: {
        ...selectedProduct.evaluation,
        competitorMatrix: updatedComps,
      },
    };
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleUpdateRecommendations = (updatedRecs: RecommendationItem[]) => {
    if (!selectedProduct) return;
    const updated: Product = {
      ...selectedProduct,
      evaluation: {
        ...selectedProduct.evaluation,
        recommendations: updatedRecs,
      },
    };
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleApplyAiEvaluation = (updatedEvaluation: ProductEvaluation) => {
    if (!productForAi) return;
    const updated: Product = {
      ...productForAi,
      updatedAt: new Date().toISOString().split('T')[0],
      evaluation: updatedEvaluation,
    };
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProductId(updated.id);
  };

  // Export / Import
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `productpulse-data-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);

        if (isProductPulseAnalysisImport(parsed)) {
          const imported = productFromAnalysisImport(parsed);
          setProducts((current) => [
            imported,
            ...current.filter((product) => product.id !== imported.id),
          ]);
          setSelectedProductId(imported.id);
          setActiveTab('evaluation');
          setEvalSubTab('overview');
          alert(
            `Đã nhập phân tích "${imported.name}". Analysis Score và Validation Score được giữ tách riêng.`,
          );
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((item: any) =>
            recalculateProduct({
              ...item,
              evidence: normalizeEvidence(item.evidence),
            } as Product),
          );
          setProducts(normalized);
          setSelectedProductId(normalized[0].id);
          alert(
            `Đã nhập ${normalized.length} sản phẩm backup. Validation Score được tính lại từ evidence.`,
          );
        } else {
          alert(
            'File không đúng định dạng ProductPulse. Cần productpulse.analysis.v1 hoặc file backup ProductPulse.',
          );
        }
      } catch (err) {
        alert('Không thể đọc file JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (confirm('Xóa toàn bộ dữ liệu sản phẩm đang lưu trên thiết bị này?')) {
      setProducts([]);
      setSelectedProductId('');
      setActiveTab('products');
      localStorage.removeItem(STORAGE_KEY);
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const categories = ['All', 'SaaS / B2B', 'Công nghệ & IoT', 'F&B & Ẩm thực', 'Tiêu dùng & Thời trang', 'Quà tặng & Decor', 'EdTech & Đào tạo', 'Sức khỏe & Y tế', 'Dịch vụ & Tài chính'];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased flex flex-col">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Main Header */}
      <div className="print:hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewProduct={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          onPrint={handlePrint}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportClick}
          onResetData={handleResetData}
          productCount={products.length}
        />
      </div>

      {/* Main Application Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:hidden">
        {/* VIEW 1: PRODUCTS DIRECTORY & QUICK OVERVIEW */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, ngành hàng hoặc tệp khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              {/* Category Segmented Controls & Sort */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0">
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {cat === 'All' ? 'Tất cả ngành' : cat}
                    </button>
                  ))}
                </div>

                <div className="border-l border-stone-200 pl-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs p-1.5 border border-stone-200 rounded-md bg-white font-medium text-stone-700"
                  >
                    <option value="analysis-desc">Analysis cao nhất</option>
                    <option value="score-desc">Validation cao nhất</option>
                    <option value="score-asc">Validation thấp nhất</option>
                    <option value="recent">Mới tạo gần đây</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isSelected={p.id === selectedProductId}
                  onSelect={() => {
                    setSelectedProductId(p.id);
                    setActiveTab('evaluation');
                  }}
                  onEdit={() => {
                    setEditingProduct(p);
                    setIsFormOpen(true);
                  }}
                  onDelete={() => handleDeleteProduct(p.id)}
                  onAiAnalyze={() => {
                    setProductForAi(p);
                    setIsAiModalOpen(true);
                  }}
                />
              ))}

              <div
                onClick={handleImportClick}
                className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[260px]"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">Import phân tích ChatGPT</h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs leading-relaxed">
                  Nhập file productpulse.analysis.v1 để dựng Analysis Score, chỉ số, rủi ro và test tiếp theo.
                </p>
              </div>

              {/* Add New Product Quick Action Tile */}
              <div
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
                className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-stone-500 hover:bg-white transition-all group min-h-[260px]"
              >
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Thêm Sản phẩm Mới
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs leading-relaxed">
                  Thiết lập hồ sơ đánh giá, phân tích khách hàng mục tiêu & kích hoạt AI thẩm định.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DEEP EVALUATION WORKSPACE */}
        {activeTab === 'evaluation' && selectedProduct && (
          <div className="space-y-6">
            {/* Product Switcher Bar */}
            <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm flex items-center justify-between overflow-x-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-semibold uppercase tracking-wider shrink-0">
                  Đang xem:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {products.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                        prod.id === selectedProductId
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {prod.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingProduct(selectedProduct);
                    setIsFormOpen(true);
                  }}
                  className="text-xs font-medium text-stone-700 hover:text-stone-900 underline"
                >
                  Sửa thông tin sản phẩm
                </button>
              </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="flex items-center bg-white border border-stone-200 p-1 rounded-xl shadow-xs overflow-x-auto">
              <button
                onClick={() => setEvalSubTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  evalSubTab === 'overview'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Bảng điểm & Nhận định</span>
              </button>

              <button
                onClick={() => setEvalSubTab('personas')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  evalSubTab === 'personas'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Khách hàng Mục tiêu ({selectedProduct.evaluation.personas.length})</span>
              </button>

              <button
                onClick={() => setEvalSubTab('swot')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  evalSubTab === 'swot'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>SWOT & Thị trường</span>
              </button>

              <button
                onClick={() => setEvalSubTab('competitors')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  evalSubTab === 'competitors'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Swords className="w-4 h-4" />
                <span>Đối thủ & Hào nước</span>
              </button>

              <button
                onClick={() => setEvalSubTab('reviews')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  evalSubTab === 'reviews'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Bằng chứng & Hành động</span>
              </button>
            </div>

            {/* Sub-Tab Contents */}
            {evalSubTab === 'overview' && (
              <div className="space-y-4 sm:space-y-5">
                {selectedProduct.analysis && (
                  <AnalysisSnapshot analysis={selectedProduct.analysis} />
                )}
                <EvaluationOverview
                  product={selectedProduct}
                  onEditEvidence={() => {
                    setEditingProduct(selectedProduct);
                    setIsFormOpen(true);
                  }}
                  onTriggerAi={() => {
                    setProductForAi(selectedProduct);
                    setIsAiModalOpen(true);
                  }}
                />
              </div>
            )}

            {evalSubTab === 'personas' && (
              <PersonaHub
                personas={selectedProduct.evaluation.personas}
                onUpdatePersonas={handleUpdatePersonas}
                onGenerateAiPersona={() => {
                  setProductForAi(selectedProduct);
                  setIsAiModalOpen(true);
                }}
              />
            )}

            {evalSubTab === 'swot' && (
              <SwotMarketView
                swot={selectedProduct.evaluation.swot}
                marketAnalysis={selectedProduct.evaluation.marketAnalysis}
                onUpdateSwot={handleUpdateSwot}
              />
            )}

            {evalSubTab === 'competitors' && (
              <CompetitorView
                competitorMatrix={selectedProduct.evaluation.competitorMatrix}
                onUpdateCompetitors={handleUpdateCompetitors}
              />
            )}

            {evalSubTab === 'reviews' && (
              <ReviewsAndRecommendations
                recommendations={selectedProduct.evaluation.recommendations}
                onUpdateRecommendations={handleUpdateRecommendations}
              />
            )}
          </div>
        )}

        {/* VIEW 3: TARGET PERSONA HUB DEDICATED VIEW */}
        {activeTab === 'personas' && selectedProduct && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
                  Sản phẩm đang chọn:
                </span>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="text-xs p-1.5 border border-stone-200 rounded-md font-semibold text-stone-900 bg-white"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} ({prod.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <PersonaHub
              personas={selectedProduct.evaluation.personas}
              onUpdatePersonas={handleUpdatePersonas}
              onGenerateAiPersona={() => {
                setProductForAi(selectedProduct);
                setIsAiModalOpen(true);
              }}
            />
          </div>
        )}

        {/* VIEW 4: SIDE-BY-SIDE PRODUCT COMPARISON */}
        {activeTab === 'comparison' && (
          <ProductComparison
            products={products}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActiveTab('evaluation');
            }}
          />
        )}
      </main>

      {/* Print View Component (Only rendered when printing) */}
      {selectedProduct && <PrintReport product={selectedProduct} />}

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setProductForAi(null);
        }}
        product={productForAi}
        onApplyAnalysis={handleApplyAiEvaluation}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">ProductPulse</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Hệ thống Thẩm định Sản phẩm & Khách hàng Mục tiêu</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Dữ liệu lưu trữ cục bộ (Local Persistence)</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>AI chỉ gợi ý · điểm tính từ evidence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
