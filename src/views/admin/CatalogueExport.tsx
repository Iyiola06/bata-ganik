import React, { useEffect, useState } from 'react';
import { api, type Category } from '../../lib/api';

type CatalogueProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string | null;
  images?: Array<{ url: string }>;
  variants?: Array<{ sizeEU: string; stockQty: number }>;
  category?: { name: string; slug: string } | null;
};

export default function CatalogueExport() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get<{ categories: Category[] }>('/admin/categories')
      .then((res) => setCategories(res.categories))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '100' });
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }

    api
      .get<{ products: CatalogueProduct[] }>(`/admin/products?${params.toString()}`)
      .then((res) => setProducts(res.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handlePrint = () => {
    window.print();
  };

  const selectedCategoryName =
    selectedCategory === 'all'
      ? 'All Categories Catalogue'
      : `${categories.find((c) => c.slug === selectedCategory)?.name || 'Catalogue'} Collection`;

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-[calc(100vh-64px)] ${
        theme === 'dark' ? 'dark bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <div className="w-full lg:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 print:hidden flex flex-col gap-6 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Export Catalogue</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Generate a printable PDF catalogue.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Category Filter
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Theme</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-white shadow text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-700 shadow text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Dark Mode
            </button>
          </div>
        </div>

        <button
          onClick={handlePrint}
          disabled={loading || products.length === 0}
          className="mt-4 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined">print</span>
          Print / Save PDF
        </button>
      </div>

      <div
        className={`flex-1 p-8 lg:p-12 overflow-y-auto print:p-0 print:m-0 print:bg-transparent print:overflow-visible bg-white dark:bg-slate-950 text-slate-900 dark:text-white ${theme}`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full print:hidden">
            <span className="animate-spin material-symbols-outlined text-4xl text-primary">
              progress_activity
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 print:hidden">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">inventory_2</span>
            <p className="text-lg font-medium">
              {selectedCategory === 'all' ? 'No products found to export' : 'No products found for this category'}
            </p>
          </div>
        ) : (
          <div className="max-w-[1000px] mx-auto print:max-w-none print:w-full">
            <div className="mb-12 border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Bata Ganik</h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  {selectedCategoryName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold opacity-50">CONFIDENTIAL TRADELIST</p>
                <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-8">
              {products.map((product) => {
                const uniqueSizes = Array.from(
                  new Set(
                    (product.variants ?? [])
                      .map((variant) => variant.sizeEU)
                      .filter(Boolean)
                  )
                ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

                return (
                  <div key={product.id} className="break-inside-avoid mb-8">
                    <div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1 leading-tight">{product.name}</h3>
                    <div className="flex justify-between items-center mb-2 gap-3">
                      <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{product.sku}</p>
                      <p className="font-bold text-primary">N{product.price.toLocaleString()}</p>
                    </div>
                    {product.category?.name && selectedCategory === 'all' && (
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                        {product.category.name}
                      </p>
                    )}
                    {product.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-3">
                        {product.description}
                      </p>
                    )}
                    {uniqueSizes.length > 0 && (
                      <div className="mt-auto">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                          Available Sizes (EU)
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {uniqueSizes.map((size) => (
                            <span
                              key={size}
                              className="text-[10px] font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 print:block">
              <p>Bata Ganik Luxury Footwear | Generated {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
