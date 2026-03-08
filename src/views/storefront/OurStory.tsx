import React from 'react';

export default function OurStory() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Our Story</h1>

        <div className="space-y-16 text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
          {/* The Origin */}
          <section>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-6">The Origin</h2>
            <p className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 text-stone-900 dark:text-white">
              Bata Ganik was founded on curiosity, discipline, and an uncompromising standard of quality. Long before the first pair was made, its founder, Mr. Kunle Ogunjobi, was studying footwear with unusual attention. He examined stitching, sole construction, balance, and finishing. He questioned why certain shoes carried presence while others did not. His interest extended beyond appearance to the unseen structure beneath the surface, the layers that determine durability and refinement.
            </p>
            <p className="mb-6">
              For over a decade, the idea remained in development. It was researched, imagined, and revisited privately. Then, at the age of fifty, Mr. Ogunjobi chose to begin. With no structured footwear industry to rely on, he learned the craft from the ground up. He observed roadside shoemakers, studied techniques, asked detailed questions, and conducted independent research.
            </p>
            <p className="mb-6">
              To understand high-level construction, he dismantled imported Italian shoes to examine their internal architecture. His focus was clear: craftsmanship begins where visibility ends.
            </p>
            <p>
              The first products were made at home, using his wife's sewing machine. They were sold to friends who quickly recognized the difference in structure and finishing. From the outset, the intention was not scale. It was standard.
            </p>
          </section>

          <div className="aspect-[21/9] w-full bg-stone-200 dark:bg-stone-800 rounded-lg overflow-hidden my-12">
            <img src="https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=1600&q=80" alt="Artisan crafting footwear" className="w-full h-full object-cover" />
          </div>

          {/* The Standard */}
          <section>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-6">The Standard</h2>
            <p className="mb-6">
              Bata Ganik was never built for volume. It was built for longevity. While many craftsmen prioritize speed, Bata Ganik prioritizes construction. Materials are selected deliberately. Reinforcement is intentional. Finishing is precise. If a pair does not meet expectation, it is not released.
            </p>
            <p className="mb-6">
              Quality, in this house, is defined by what cannot immediately be seen: the strength of bonding, the integrity of layering, the density of the sole, and the structure that allows a shoe to maintain its form over years of wear.
            </p>
            <p className="font-serif text-xl italic text-stone-900 dark:text-white border-l-4 border-primary pl-6 py-2 my-8">
              A Bata Ganik shoe is designed to endure, not simply to impress.
            </p>
          </section>

          {/* Heritage and Philosophy */}
          <section>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-6">Heritage and Philosophy</h2>
            <p className="mb-6">
              Raised within a royal lineage, Mr. Ogunjobi grew up with an understanding that presentation reflects identity. In that context, refinement is not decorative. It is disciplined.
            </p>
            <p className="mb-6">
              This philosophy subtly shapes Bata Ganik. The brand does not rely on overt symbolism to communicate distinction. Instead, it expresses heritage through restraint, structure, and attention to detail. The influence of royalty is not theatrical; it is embedded in standards.
            </p>
            <p>
              Every product is created with the belief that quality is a responsibility, not a luxury.
            </p>
          </section>

          <div className="aspect-video w-full bg-stone-200 dark:bg-stone-800 rounded-lg overflow-hidden my-12">
            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80" alt="Leather textures and tools" className="w-full h-full object-cover" />
          </div>

          {/* Purpose and Vision */}
          <section>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-6">Purpose and Vision</h2>
            <p className="mb-6">
              Bata Ganik exists within a fashion-forward culture that values presentation, yet lacks a fully developed footwear manufacturing ecosystem. Much of what is available prioritizes affordability and volume over durability and craftsmanship. The brand was established to contribute to a higher standard, not by imitation, but by intention.
            </p>
            <p className="mb-6">
              The long-term vision is generational. Bata Ganik is being built as a respected luxury footwear house, capable of earning recognition beyond its origins. It is designed to become a name associated with integrity, structure, and enduring quality.
            </p>
            <p className="mb-6">
              Today, the brand serves men who understand that footwear completes identity: professionals, leaders, and individuals who value presence. Age is secondary to discernment; what unites its customers is an appreciation for refinement that lasts.
            </p>
            <p className="mb-6">
              As the house grows, collections may expand and scale may evolve. What will not change is the foundation: craftsmanship, discipline, and longevity.
            </p>
            <p className="font-serif text-xl italic text-stone-900 dark:text-white text-center mt-12 mb-16">
              Bata Ganik is not created for mass appeal. <br />
              <span className="text-primary mt-2 block">It is created to endure.</span>
            </p>
          </section>

          {/* Founder Spotlight */}
          <section className="bg-stone-50 dark:bg-stone-900 p-8 md:p-12 rounded-lg border border-stone-200 dark:border-stone-800">
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-2 text-center">Mr. Kunle Ogunjobi</h2>
            <p className="text-sm tracking-widest uppercase text-primary text-center mb-8">Founder Spotlight</p>
            <div className="max-w-3xl mx-auto space-y-6">
              <p>
                Mr. Kunle Ogunjobi founded Bata Ganik at the age of fifty, but the vision began long before that. For years, he was quietly fascinated by footwear: how it was structured, how it carried presence, and why some pairs felt distinguished while others felt ordinary. That curiosity eventually turned into commitment. He studied the craft from the ground up, learning from local shoemakers, researching materials, and even dismantling imported shoes to understand what made them exceptional.
              </p>
              <p>
                He began modestly, working from home with a single machine, selling to friends who quickly recognized the difference in his approach. From the start, he refused to compromise on quality. Where others prioritized speed, he focused on structure. Where others chased volume, he pursued durability and finish.
              </p>
              <p>
                Raised within a royal lineage, Mr. Ogunjobi grew up with a deep understanding of presentation and discipline. To him, quality is not luxury. It is responsibility. That philosophy shapes Bata Ganik: refined, intentional, and built to last.
              </p>
              <p>
                His ambition is clear: to build a footwear house known for craftsmanship and integrity, and to create a legacy that endures beyond a single generation.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
