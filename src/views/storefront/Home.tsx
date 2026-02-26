import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api, type Product, type Collection, formatNGN } from '../../lib/api';

function ProductSkeleton() {
  return (
    <div className="flex-shrink-0 w-[280px] animate-pulse">
      <div className="aspect-[3/4] bg-stone-200 dark:bg-stone-800 rounded mb-3" />
      <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4 mb-2" />
      <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
    </div>
  );
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ products: Product[] }>('/products?featured=true&limit=6'),
      api.get<{ collections: Collection[] }>('/collections'),
    ])
      .then(([prodsRes, collsRes]) => {
        setProducts(prodsRes.products);
        setCollections(collsRes.collections);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden bg-[#c4a484]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full pt-20">
          <span className="inline-block py-1 px-3 border border-stone-800/30 text-stone-900 text-xs font-bold tracking-widest uppercase mb-6 bg-white/10 backdrop-blur-sm">
            Since 2020
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-stone-900 leading-none mb-6">
            Threads of <br />
            <span className="italic text-white/90">Heritage</span>
          </h1>
          <p className="text-stone-900/80 text-lg md:text-xl max-w-xl font-light leading-relaxed mb-12">
            A journey from the heart of Nigeria to the global stage of luxury footwear.
            Discover the soul stitched into every sole, where tradition meets modern elegance.
          </p>
          <div className="animate-bounce">
            <span className="material-symbols-outlined text-stone-900 text-3xl">keyboard_arrow_down</span>
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">Featured Collection</span>
              <h2 className="font-serif text-4xl md:text-5xl text-slate-900 dark:text-white">New Arrivals</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-slate-200 dark:border-stone-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-slate-200 dark:border-stone-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-[280px] group"
                >
                  <Link to={`/products/${product.slug}`}>
                    <div className="aspect-[3/4] bg-stone-100 dark:bg-stone-800 overflow-hidden rounded mb-3 relative">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].altText ?? product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      {product.compareAtPrice && (
                        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                      {product.collection?.name ?? 'Bata Ganik'}
                    </p>
                    <h3 className="font-serif text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{formatNGN(product.price)}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-slate-400 line-through">{formatNGN(product.compareAtPrice)}</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="inline-flex items-center gap-2 border border-slate-900 dark:border-white text-slate-900 dark:text-white px-8 py-3 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all font-medium tracking-wider text-sm uppercase">
              View All Products
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      {collections.length > 0 && (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-stone-50 dark:bg-stone-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">Our World</span>
              <h2 className="font-serif text-4xl md:text-5xl text-slate-900 dark:text-white">Explore Collections</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((col) => (
                <Link key={col.id} to={`/shop?collection=${col.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded bg-stone-200 dark:bg-stone-800">
                  {col.imageUrl && (
                    <img
                      src={col.imageUrl}
                      alt={col.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-xl text-white mb-1">{col.name}</h3>
                    {col._count && (
                      <p className="text-white/70 text-sm">{col._count.products} styles</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Heritage Banner */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#1a2744] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">Our Heritage</span>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Crafted in Nigeria. <br />
              <span className="italic text-primary">Worn by the World.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Every pair of Bata Ganik shoes tells a story — of the artisans from Kano,
              of ancient leather-working traditions, of a Nigeria that dresses its ambition
              in the finest materials on earth.
            </p>
            <Link to="/our-story" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all">
              Read Our Story
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="flex-1 aspect-video md:aspect-square rounded overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&q=80"
              alt="Artisan crafting Bata Ganik shoes"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
