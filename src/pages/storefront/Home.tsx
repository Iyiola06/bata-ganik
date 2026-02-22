import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const featuredProducts = [
    { id: 1, name: 'The Danfo Oxford', price: '₦ 245,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw', color: 'Cognac Leather' },
    { id: 2, name: 'The Eyo Derby', price: '₦ 280,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e', color: 'Midnight Black' },
    { id: 3, name: 'The Lekki Loafer', price: '₦ 210,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL', color: 'Royal Blue Suede' },
    { id: 4, name: 'The Zaria Boot', price: '₦ 315,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI', color: 'Chocolate Brown' },
    { id: 5, name: 'The Oba Oxford', price: '₦ 120,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm67IA7RXIA_V5-P7yQtms_Ujf1RHkfqLCnJPbDpssajbPh1Nz_CgkDOo2uSoTORdHg89ewHnUnzciVxRv18fiiXclQVM9f8aZysQh9C-BBXELW8j-Kx9OEfHMvc2K423RG9L7xKtWXM98lG3uosVEM-Qy2BNz84uU-bhSBk6xVNIwFP2m2n46SP_at-b1PBkRZPjU5l8yvg8Ogd6FIfUPhXzNvQiTAR4H-eTn1cCXwHNVh9Jfg1GaPBxB7D-fGh50EV_5SiXOO5HH', color: 'Savannah Brown' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden bg-[#c4a484]">
        {/* Background Image - Leather Texture */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnD0Uv7djQbxEmSYYzaBOKcwG4XFCLEcOxr5mGaRBBQ_bKg3F-d0FcWGXIcyPrG4GNfh6ziCVLzoadkBYEF5qGhncNbxIN3CF79E6suiQFaSZSz4A01WVabC5BwLTBM1u6dt-_dHNwzBt1RVAOhD6aO5NozGno0zGjW-GGKbcpoA1jWTkhPiv64Rj4cOGredJnpUQjuKBDXO6jntZ2tDQE9H0B9TyDBqkAQ2WRfn19tVOoLwCY5WX44NFbdM1o5MFjxp3aHpYa6YBD')" }}
        ></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full pt-20">
          <span className="inline-block py-1 px-3 border border-stone-800/30 text-stone-900 text-xs font-bold tracking-widest uppercase mb-6 bg-white/10 backdrop-blur-sm">Since 1982</span>
          <h1 className="font-serif text-6xl md:text-8xl text-stone-900 leading-none mb-6">
            Threads of <br />
            <span className="italic text-white/90">Heritage</span>
          </h1>
          <p className="text-stone-900/80 text-lg md:text-xl max-w-xl font-light leading-relaxed mb-12">
            A journey from the heart of Nigeria to the global stage of luxury footwear. Discover the soul stitched into every sole, where tradition meets modern elegance.
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
              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-4">Featured Collection</h2>
              <p className="text-stone-600 dark:text-stone-400 max-w-md">
                Handpicked favorites that define the Bata Ganik aesthetic.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => scroll('left')}
                className="p-3 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-3 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-8 snap-x hide-scroll scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="min-w-[300px] md:min-w-[350px] snap-start group"
                whileHover={{ y: -10 }}
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-[3/4] bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden mb-6 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  <h3 className="font-serif text-xl text-stone-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mb-2">{product.color}</p>
                  <span className="text-primary font-bold">{product.price}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Name Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden p-8 shadow-xl">
              <div className="w-full h-full border-8 border-white bg-white shadow-inner flex items-center justify-center">
                 <div className="w-48 h-48 rounded-full bg-stone-200 overflow-hidden relative">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnD0Uv7djQbxEmSYYzaBOKcwG4XFCLEcOxr5mGaRBBQ_bKg3F-d0FcWGXIcyPrG4GNfh6ziCVLzoadkBYEF5qGhncNbxIN3CF79E6suiQFaSZSz4A01WVabC5BwLTBM1u6dt-_dHNwzBt1RVAOhD6aO5NozGno0zGjW-GGKbcpoA1jWTkhPiv64Rj4cOGredJnpUQjuKBDXO6jntZ2tDQE9H0B9TyDBqkAQ2WRfn19tVOoLwCY5WX44NFbdM1o5MFjxp3aHpYa6YBD" alt="Texture" className="w-full h-full object-cover opacity-50" />
                 </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8">The Name</h2>
            <div className="space-y-6 text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              <p>
                Bata Ganik is more than a label; it is a linguistic tapestry woven from the rich dialects of Nigeria. Derived from ancient words signifying 'grounded strength' and 'regal step', our name embodies the philosophy that true luxury begins with a solid foundation.
              </p>
              <p>
                Every pair of shoes is a testament to the resilience and elegance of our ancestors. We believe that a shoe is not merely an accessory, but a vessel that carries you through life's most significant moments.
              </p>
            </div>
            <div className="mt-10 border-l-2 border-primary pl-6">
              <p className="font-serif text-xl italic text-stone-800 dark:text-stone-200 mb-4">
                "To walk in Bata Ganik is to walk with the dignity of kings and the grace of the earth beneath you."
              </p>
              <span className="text-xs font-bold tracking-widest uppercase text-primary">— Founder's Journal, 1985</span>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="w-full h-[60vh] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFLqWFaTnYZtHnWHyL0uAtP1s7gGk4Gp0UIh0j3k1RPc2JVg0tzfGdpG3HTmmj_cG8M0u0tAdgDsrYPwPG-gEuLiP9fINDCrKjLmKyf2hnv9FLq3UJVRT4LRSCWlZoSh2r29PEPb1kxFjh90UwvhWzfKeVJPQk76muw-eX8kXHepl4vJuVLDCeLhHBTL-gyGHugisDI1GHbpGPyTuyYhqAzerUzPdXJ5wRzSqQ_DCCAbOFZJ9FfVtmLs2miYwpKu4kNm73DcXjGB0l')" }}
        ></div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="font-serif text-4xl md:text-6xl text-white italic">The soul is in the stitch.</h2>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-6">The Vision</h2>
            <p className="text-stone-600 dark:text-stone-400 font-light">
              Redefining African luxury for the modern world, without losing the pulse of our origins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-stone-800 p-10 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-4xl text-primary mb-6">diamond</span>
              <h3 className="font-serif text-xl text-stone-900 dark:text-white mb-4">Uncompromising Luxury</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                We source only the finest, full-grain leathers, ensuring that each piece ages beautifully, developing a unique patina that tells your story.
              </p>
            </div>
            <div className="bg-white dark:bg-stone-800 p-10 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-4xl text-primary mb-6">public</span>
              <h3 className="font-serif text-xl text-stone-900 dark:text-white mb-4">Global Stage</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                From the bustling markets of Lagos to the fashion capitals of Milan and New York, Bata Ganik bridges cultures through impeccable design.
              </p>
            </div>
            <div className="bg-white dark:bg-stone-800 p-10 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-4xl text-primary mb-6">handyman</span>
              <h3 className="font-serif text-xl text-stone-900 dark:text-white mb-4">Master Craftsmanship</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Our artisans are not just workers; they are custodians of a fading art. We invest in their skills, ensuring fair wages and preserving heritage techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Craft */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-4">The Craft</h2>
              <p className="text-stone-600 dark:text-stone-400 max-w-md">
                It takes 48 hours and 120 distinct steps to create a single pair of Bata Ganik loafers. This is slow fashion in its truest form.
              </p>
            </div>
            <Link to="/our-story" className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:text-primary-dark transition-colors">
              Watch the Process <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            <div className="lg:col-span-2 relative rounded-lg overflow-hidden group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFLqWFaTnYZtHnWHyL0uAtP1s7gGk4Gp0UIh0j3k1RPc2JVg0tzfGdpG3HTmmj_cG8M0u0tAdgDsrYPwPG-gEuLiP9fINDCrKjLmKyf2hnv9FLq3UJVRT4LRSCWlZoSh2r29PEPb1kxFjh90UwvhWzfKeVJPQk76muw-eX8kXHepl4vJuVLDCeLhHBTL-gyGHugisDI1GHbpGPyTuyYhqAzerUzPdXJ5wRzSqQ_DCCAbOFZJ9FfVtmLs2miYwpKu4kNm73DcXjGB0l" alt="Craftsman" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Technique</span>
                <h3 className="font-serif text-2xl text-white">Precision Pattern Cutting</h3>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex-1 relative rounded-lg overflow-hidden group">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI" alt="Stitching" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-xl text-white">Hand Stitching</h3>
                </div>
              </div>
              <div className="flex-1 relative rounded-lg overflow-hidden group">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw" alt="Polishing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-xl text-white">Final Polish</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-stone-50 dark:bg-stone-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white">From Grandmother's Hands to World-Class Craft</h2>
            <div className="w-24 h-0.5 bg-primary mx-auto mt-6"></div>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-stone-300 dark:bg-stone-700 top-[15px]"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="relative pt-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-900 border-2 border-primary flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block text-center md:text-left">1982</span>
                <div className="bg-white dark:bg-stone-800 p-6 rounded shadow-sm">
                  <h3 className="font-serif text-lg text-stone-900 dark:text-white mb-2">The Spark</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Our founder watches his grandmother repair leather sandals in her village home, sparking a lifelong obsession with footwear.
                  </p>
                </div>
              </div>

              <div className="relative pt-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-600 flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-stone-300 dark:bg-stone-600"></div>
                </div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block text-center md:text-left">1995</span>
                <div className="bg-white dark:bg-stone-800 p-6 rounded shadow-sm">
                  <h3 className="font-serif text-lg text-stone-900 dark:text-white mb-2">First Workshop</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    A small studio opens in Lagos with just three artisans. The first bespoke collection is sold out within weeks.
                  </p>
                </div>
              </div>

              <div className="relative pt-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-600 flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-stone-300 dark:bg-stone-600"></div>
                </div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block text-center md:text-left">2010</span>
                <div className="bg-white dark:bg-stone-800 p-6 rounded shadow-sm">
                  <h3 className="font-serif text-lg text-stone-900 dark:text-white mb-2">International Debut</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Bata Ganik is featured in Milan Fashion Week, marking the arrival of African luxury footwear on the European stage.
                  </p>
                </div>
              </div>

              <div className="relative pt-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-600 flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-stone-300 dark:bg-stone-600"></div>
                </div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block text-center md:text-left">2023</span>
                <div className="bg-white dark:bg-stone-800 p-6 rounded shadow-sm">
                  <h3 className="font-serif text-lg text-stone-900 dark:text-white mb-2">Sustainable Future</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Launching our fully sustainable line, using ethically sourced hides and recycled soles, committing to the planet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center bg-white dark:bg-stone-950">
        <h2 className="font-serif text-5xl md:text-6xl text-stone-900 dark:text-white mb-6">Walk with History</h2>
        <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto mb-10 text-lg font-light">
          Experience the culmination of decades of heritage. Explore our latest collection of handcrafted footwear.
        </p>
        <Link to="/collections" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-12 rounded-sm transition-all duration-300 tracking-widest uppercase text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Explore The Collection
        </Link>
      </section>
    </>
  );
}
