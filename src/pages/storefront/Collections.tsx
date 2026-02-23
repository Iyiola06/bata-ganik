import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Collection } from '../../lib/api';

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ collections: Collection[] }>('/collections')
      .then((res) => setCollections(res.collections))
      .catch((err) => console.error('Error fetching collections:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Editorial</span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white mb-6 leading-tight">
            Curated <span className="italic text-slate-500 dark:text-slate-400">Collections</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Journey through our archives of Nigerian heritage, where each collection tells a unique story of culture, craftsmanship, and modern luxury.
          </p>
        </div>
      </section>

      {collections.map((collection, index) => {
        const titleArr = collection.name.split(' ');
        const lastWord = titleArr.pop();
        const firstPart = titleArr.join(' ');

        // Alternate themes visually
        const theme = index % 2 === 0 ? 'dark' : 'light';

        return (
          <React.Fragment key={collection.id}>
            <section className="relative w-full h-[80vh] md:h-[90vh] min-h-[600px] overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] group-hover:scale-105"
                style={{ backgroundImage: `url('${collection.imageUrl ?? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'}')` }}
              ></div>
              <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/40 bg-gradient-to-t from-black/90 via-black/20 to-transparent' : 'bg-black/20 bg-gradient-to-t from-black/80 via-transparent to-transparent'}`}></div>

              <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-24 flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="max-w-2xl">
                  {collection._count && (
                    <span className="inline-block px-3 py-1 border border-white/30 text-white/80 text-xs tracking-widest uppercase mb-6 backdrop-blur-sm">
                      {collection._count.products} Handcrafted Pieces
                    </span>
                  )}
                  <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none">
                    {firstPart} <br />
                    <span className="text-primary italic">{lastWord}</span>
                  </h2>
                  <p className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed font-light italic max-w-xl">
                    "{collection.description || 'Redefining African luxury footwear.'}"
                  </p>
                </div>
                <div className="mb-2 md:mb-4">
                  <Link
                    to={`/shop?collection=${collection.slug}`}
                    className="group/btn inline-flex items-center gap-4 text-white hover:text-primary transition-colors duration-300"
                  >
                    <span className="text-sm font-bold tracking-[0.2em] uppercase border-b border-white/30 pb-2 group-hover/btn:border-primary">Explore The Collection</span>
                    <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover/btn:translate-x-2">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </section>
            {index < collections.length - 1 && (
              <div className="h-24 md:h-32 bg-white dark:bg-neutral-900"></div>
            )}
          </React.Fragment>
        );
      })}

      <section className="py-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-6">diamond</span>
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 dark:text-white mb-6">Join the Inner Circle</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-10 font-light text-lg">
            Be the first to know when new collections drop. Receive exclusive invitations to private viewings and early access to limited editions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border-b border-slate-300 dark:border-slate-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button type="button" className="bg-primary hover:bg-primary/90 text-brand-navy font-bold py-3 px-8 uppercase text-xs tracking-widest transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
