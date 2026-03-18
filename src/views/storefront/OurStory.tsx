import React from 'react';

export default function OurStory() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-4">Our Story</h1>
          <p className="text-primary tracking-widest uppercase text-sm font-medium">The Vision of Mr. Kunle Ogunjobi</p>
        </div>

        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
          {/* The Visionary */}
          <section>
            <p className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 text-stone-900 dark:text-white">
              Bata Ganik was founded on curiosity, discipline, and an uncompromising standard of quality. Its founder, Mr. Kunle Ogunjobi, began this journey at the age of fifty—not out of necessity, but out of a decade-long fascination with the internal architecture of luxury footwear. 
            </p>
            <p className="mb-6">
              With no formal industry to lean on, he learned the craft from the ground up. He spent years observing local master shoemakers, studying techniques, and even dismantling imported Italian shoes to understand the invisible layers that determine true durability and refinement.
            </p>
            <p>
              The first pairs were made at home on his wife’s sewing machine. They were sold to friends who immediately recognized the difference in structure and finish. From the outset, the intention was never scale; it was standard.
            </p>
          </section>

          <div className="aspect-[21/9] w-full bg-stone-100 dark:bg-stone-900 rounded-lg overflow-hidden my-12">
            <img src="https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=1600&q=80" alt="Artisan crafting footwear" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>

          {/* Heritage and Discipline */}
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-6">Heritage and Discipline</h2>
            <p className="mb-6">
              Raised within a Nigerian royal lineage, Mr. Ogunjobi understood from an early age that presentation reflects identity. In his world, refinement is not decorative—it is disciplined. This philosophy subtly shapes every Bata Ganik creation.
            </p>
            <p className="font-serif text-xl italic text-stone-900 dark:text-white border-l-4 border-primary pl-6 py-2 my-8">
              "Quality is a responsibility, not a luxury." — Mr. Kunle Ogunjobi
            </p>
          </section>

          {/* The Standard */}
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-6">The Unseen Standard</h2>
            <p className="mb-6">
              Bata Ganik prioritizes construction over speed. Quality is defined by what cannot immediately be seen: the density of the sole, the integrity of the bonding, and the internal structure that allows a shoe to maintain its form through years of wear.
            </p>
            <p>
              Today, the house serves leaders and individuals who value presence. While the collections expand, the foundation remains unchanged: craftsmanship, discipline, and longevity.
            </p>
          </section>

          <div className="pt-12 text-center">
            <p className="font-serif text-xl italic text-stone-900 dark:text-white">
              Bata Ganik is not created for mass appeal. <br />
              <span className="text-primary mt-2 block not-italic font-sans font-bold tracking-widest uppercase text-sm">It is created to endure.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
