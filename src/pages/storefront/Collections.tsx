import React from 'react';

const collections = [
  {
    id: 1,
    title: "The Oba Collection",
    subtitle: "Royal Heritage",
    description: "Fit for royalty. Designed with intricate detailing inspired by Benin bronze art and the regality of ancient monarchs.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDAPl2bVdEba0WEGp30VU5fSEM8WsE6Fgojij3dPIFjnnzAOK3jdmxaUGmA_bcWVYncg_gk00qLsuHAq7j0iXP38Vn2eNyx39wUb1YcG0H9qlbnWczLnGbNLhhPLLDuzPpVqp7oZkqLoOl5FDdqyQkDfhjtRKA9DAXH7b-E1_eLuGgredzR2csbvug-5kQGQ_OGSsAkjeLBaJb0-lDzajrXS25ST0z6jCqmKOZfo1vj8IIJ1xMGDTRy15QEPGCTevu8AgWbPe4GBlu",
    theme: "dark"
  },
  {
    id: 2,
    title: "The Saharan Edit",
    subtitle: "Nomadic Luxury",
    description: "Rugged elegance inspired by the vast landscapes of the North. Earthy tones meet durable comfort for the modern explorer.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYqdrIMMW_9CDShrN-YUoWCUse3IkxGpF7W0yQk6SY7g2BMxkv1dyOUnOVwM5EPpdymwanfj09Rbtk6TfzEPk-SVCJnOFG2mwt1T-y13WSLGxsSUDD1E16OClKUInVHgoO4FUmWh-VitvGmrocjrTioHGipBkJH3_vZzli8xfcNaHvSttr1vr3AX7PYZ-8861iSN1C1o38TBAz7TCKqP2dbkwbn7aN5_X7XsK38Dcqe5pPFju3p-Aa1eHC8-9wk17KhzYDjOx2bm77",
    theme: "light"
  },
  {
    id: 3,
    title: "Lagos After Dark",
    subtitle: "Urban Evening",
    description: "Sophisticated silhouettes for the city that never sleeps. Sleek blacks and patent leathers that command attention.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLAZ9DBK_hLhaH6sFtISFBhFor2KcOuY9OzNl1LatqNEiWI_nrjlhdAOv0Lu1qQ46AXovsjCgLFvMvOcyVR_ODhEGdTkw962UiY7T4UqfdMomXwVzLHMGXmSTa1tQLjLvOugGps4317V6wEeDEF6HolHs9EvhV2gdgg6qy1zmWKf-C_sFvkpdKiBAKdKIdmq77uDgAbjRH3huApmxGG3l9QXwaF3A8C3ByYS6vk4tGPwvOZxRDca2DBM3TzS7_09-XbT-znkO-ZEIg",
    theme: "dark"
  },
  {
    id: 4,
    title: "The Coastal Series",
    subtitle: "Resort Wear",
    description: "Relaxed luxury inspired by the Atlantic breeze. Soft suedes and loafers designed for leisurely weekends.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwtfk-IFmxMcdoWd4KP_fdk54u5SIh60BH8qcSRRyOUia2EgmZvtMSYpShek4Y5U3PeRhMy4IaC-X3cm3lUp0LOLLWrDRYrmKX15cXurho9FG9k0O3dozUNDi1qdRfQrs0s0e5ELnrt8hWU2dRIcxLjJjEoOCNLxJPYIHZDVKa6exd1pOcznSGwjwz6LMlRBI24HH8MCXmm39vAFBY98yCTEbDV9-fuzO0ZUz6GzPC9JAwPY3DvPG8qFYbPvQfoA2K_0VSiWAKw1Ze",
    theme: "light"
  }
];

export default function Collections() {
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

      {collections.map((collection, index) => (
        <React.Fragment key={collection.id}>
          <section className="relative w-full h-[80vh] md:h-[90vh] min-h-[600px] overflow-hidden group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] group-hover:scale-105" 
              style={{ backgroundImage: `url('${collection.image}')` }}
            ></div>
            <div className={`absolute inset-0 ${collection.theme === 'dark' ? 'bg-black/40 bg-gradient-to-t from-black/90 via-black/20 to-transparent' : 'bg-black/20 bg-gradient-to-t from-black/80 via-transparent to-transparent'}`}></div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-24 flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 border border-white/30 text-white/80 text-xs tracking-widest uppercase mb-6 backdrop-blur-sm">
                  {collection.subtitle}
                </span>
                <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none">
                  {collection.title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="text-primary italic">{collection.title.split(' ').slice(-1)}</span>
                </h2>
                <p className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed font-light italic max-w-xl">
                  "{collection.description}"
                </p>
              </div>
              <div className="mb-2 md:mb-4">
                <a href="#" className="group/btn inline-flex items-center gap-4 text-white hover:text-primary transition-colors duration-300">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase border-b border-white/30 pb-2 group-hover/btn:border-primary">Explore The Collection</span>
                  <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover/btn:translate-x-2">arrow_forward</span>
                </a>
              </div>
            </div>
          </section>
          {index < collections.length - 1 && (
            <div className="h-24 md:h-32 bg-white dark:bg-neutral-900"></div>
          )}
        </React.Fragment>
      ))}

      <section className="py-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-6">diamond</span>
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 dark:text-white mb-6">Join the Inner Circle</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-10 font-light text-lg">
            Be the first to know when new collections drop. Receive exclusive invitations to private viewings and early access to limited editions.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border-b border-slate-300 dark:border-slate-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button type="button" className="bg-primary hover:bg-primary/90 text-brand-navy font-bold py-3 px-8 uppercase text-xs tracking-widest transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
