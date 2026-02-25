import React from 'react';

export default function OurStory() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Our Story</h1>
        
        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
          <section>
            <p className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left text-stone-900 dark:text-white">
              Bata Ganik was born from a desire to redefine African luxury. Founded in Lagos, Nigeria, we bridge the gap between traditional craftsmanship and contemporary design.
            </p>
            <p className="mb-6">
              Our journey began in the bustling markets of Lagos, where we witnessed the incredible skill of local artisans. We saw an opportunity to showcase this talent to the world, creating footwear that is not only beautiful but also tells a story of heritage and culture.
            </p>
          </section>

          <div className="aspect-video w-full bg-stone-200 dark:bg-stone-800 rounded-lg overflow-hidden my-12">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm67IA7RXIA_V5-P7yQtms_Ujf1RHkfqLCnJPbDpssajbPh1Nz_CgkDOo2uSoTORdHg89ewHnUnzciVxRv18fiiXclQVM9f8aZysQh9C-BBXELW8j-Kx9OEfHMvc2K423RG9L7xKtWXM98lG3uosVEM-Qy2BNz84uU-bhSBk6xVNIwFP2m2n46SP_at-b1PBkRZPjU5l8yvg8Ogd6FIfUPhXzNvQiTAR4H-eTn1cCXwHNVh9Jfg1GaPBxB7D-fGh50EV_5SiXOO5HH" alt="Artisan working on a shoe" className="w-full h-full object-cover" />
          </div>

          <section>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-6">The Craft</h2>
            <p className="mb-6">
              Every pair of Bata Ganik shoes is handcrafted by skilled artisans who have honed their craft over generations. We use only the finest locally sourced leathers and materials, ensuring that each pair is a masterpiece of quality and durability.
            </p>
            <p>
              We believe in sustainable fashion. Our production process is designed to minimize waste, and we are committed to fair labor practices, ensuring that our artisans are paid a living wage and work in safe conditions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-6">The Vision</h2>
            <p>
              Our vision is to become a global symbol of African excellence. We want to challenge the narrative around African luxury, proving that world-class design and craftsmanship can originate from the continent. When you wear Bata Ganik, you are not just wearing a pair of shoes; you are wearing a piece of African heritage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
