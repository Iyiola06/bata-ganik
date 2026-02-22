import React from 'react';

export default function CareInstructions() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Care Instructions</h1>
        
        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Leather Care</h2>
            <p className="mb-4">
              Our leather is sourced from the finest tanneries and requires regular care to maintain its beauty and durability.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Clean with a soft, dry cloth to remove dust and dirt.</li>
              <li>Use a high-quality leather conditioner every few months to keep the leather supple and prevent cracking.</li>
              <li>Avoid exposure to direct sunlight and heat sources, as this can cause the leather to fade and dry out.</li>
              <li>If your shoes get wet, allow them to air dry naturally away from direct heat. Stuff them with newspaper to help maintain their shape.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Suede Care</h2>
            <p className="mb-4">
              Suede requires a delicate touch. Use a suede brush to gently remove dirt and restore the nap.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Protect your suede shoes with a water-repellent spray before wearing them.</li>
              <li>Avoid wearing suede in wet conditions.</li>
              <li>If stains occur, use a suede eraser or a specialized suede cleaner.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Storage</h2>
            <p className="mb-4">
              Proper storage is essential for preserving the shape and quality of your footwear.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Store your shoes in a cool, dry place away from direct sunlight.</li>
              <li>Use shoe trees or stuff them with acid-free tissue paper to help maintain their shape.</li>
              <li>Keep them in the provided dust bags to protect them from dust and scratches.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
