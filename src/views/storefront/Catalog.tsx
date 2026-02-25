import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, type Product, type Collection, formatNGN } from '../../lib/api';

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-stone-200 dark:bg-stone-800 rounded mb-3" />
      <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2 mb-2" />
      <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4 mb-2" />
      <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
    </div>
  );
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const sort = searchParams.get('sort') ?? 'newest';
  const collection = searchParams.get('collection') ?? '';
  const page = Number(searchParams.get('page') ?? 1);

  // Fetch products when filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      sort,
      page: String(page),
      limit: '12',
      ...(collection ? { collection } : {}),
    });
    api.get<{ products: Product[]; pagination: { total: number; pages: number } }>(
      `/products?${params}`
    )
      .then((res) => {
        setProducts(res.products);
        setTotal(res.pagination.total);
        setPages(res.pagination.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sort, collection, page]);

  // Fetch collections once for the filter sidebar
  useEffect(() => {
    api.get<{ collections: Collection[] }>('/collections')
      .then((res) => setCollections(res.collections))
      .catch(console.error);
  }, []);

  const setFilter = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete('page'); // reset to page 1 on filter change
      return next;
    });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A–Z' },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">Explore</span>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 dark:text-white">
            {collection
              ? (collections.find((c) => c.slug === collection)?.name ?? 'Shop')
              : 'All Products'}
          </h1>
          {!loading && (
            <p className="text-slate-500 dark:text-slate-400 mt-2">{total} styles</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="mb-8">
              <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">Collections</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setFilter('collection', '')}
                    className={`text-sm w-full text-left py-1 transition-colors ${!collection ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'
                      }`}
                  >
                    All Collections
                  </button>
                </li>
                {collections.map((col) => (
                  <li key={col.id}>
                    <button
                      onClick={() => setFilter('collection', col.slug)}
                      className={`text-sm w-full text-left py-1 transition-colors ${collection === col.slug
                          ? 'text-primary font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-primary'
                        }`}
                    >
                      {col.name}
                      {col._count && (
                        <span className="ml-1 text-xs text-slate-400">({col._count.products})</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex justify-end mb-6">
              <select
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="text-sm border border-slate-200 dark:border-stone-700 rounded px-3 py-2 bg-white dark:bg-stone-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="aspect-[3/4] bg-stone-100 dark:bg-stone-800 overflow-hidden rounded mb-3 relative">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].altText ?? product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      {product.compareAtPrice && (
                        <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">SALE</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                      {product.collection?.name ?? ''}
                    </p>
                    <h2 className="font-serif text-base text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{formatNGN(product.price)}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-slate-400 line-through">{formatNGN(product.compareAtPrice)}</span>
                      )}
                    </div>
                  </Link>
                ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilter('page', String(p))}
                    className={`w-9 h-9 rounded text-sm font-medium transition-colors ${p === page
                        ? 'bg-primary text-white'
                        : 'border border-slate-200 dark:border-stone-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-24">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No products found.</p>
                <button onClick={() => setSearchParams({})} className="mt-4 text-primary underline text-sm">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
