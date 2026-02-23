import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Product, formatNGN } from '../../lib/api';

const STATUS_BADGE: Record<string, string> = {
  low: 'bg-orange-100 text-orange-800',
  ok: 'bg-green-100 text-green-800',
  all: 'bg-slate-100 text-slate-800',
};

export default function Products() {
  const [products, setProducts] = useState<(Product & { totalStock: number })[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(search ? { search } : {}),
        ...(stockFilter ? { stock: stockFilter } : {}),
      });
      const res = await api.get<{
        products: (Product & { totalStock: number })[];
        pagination: { total: number };
      }>(`/admin/products?${params}`);
      setProducts(res.products);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, stockFilter, page]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.message ?? 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    setToggling(id);
    try {
      await api.patch(`/admin/products/${id}`, { isPublished: !isPublished });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: !isPublished } : p))
      );
    } catch (err: any) {
      alert(err?.message ?? 'Update failed');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
            <p className="text-slate-500 dark:text-slate-400">{total} products total</p>
          </div>
          <Link
            to="/admin/products/new"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm flex items-center gap-2 w-fit transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">All Stock</option>
            <option value="low">Low Stock (≤ 5)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {['Product', 'SKU', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading
                ? [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
                : products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden flex-shrink-0">
                          {product.images[0] && (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.collection?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{product.sku}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{formatNGN(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${(product as any).totalStock <= 5
                          ? 'bg-orange-100 text-orange-800'
                          : (product as any).totalStock === 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                        {(product as any).totalStock ?? 0} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(product.id, product.isPublished)}
                        disabled={toggling === product.id}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${product.isPublished
                            ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-800'
                          }`}
                      >
                        {toggling === product.id ? '...' : product.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-base">
                            {deleting === product.id ? 'progress_activity' : 'delete'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">inventory_2</span>
              <p className="text-slate-500">No products found.</p>
              {(search || stockFilter) && (
                <button onClick={() => { setSearch(''); setStockFilter(''); }} className="mt-2 text-primary underline text-sm">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {Math.ceil(total / 20) > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-700 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
