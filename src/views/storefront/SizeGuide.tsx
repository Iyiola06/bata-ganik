import React from 'react';

export default function SizeGuide() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Size Guide</h1>
        
        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Finding Your Perfect Fit</h2>
            <p className="mb-8">
              At Bata Ganik, we use standard European sizing for all our footwear. Our shoes are handcrafted on lasts that provide a comfortable, true-to-size fit. If you are between sizes, we recommend sizing up for closed-toe shoes and sizing down for open-toe styles.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-stone-200 dark:border-stone-800">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white font-serif text-lg">
                    <th className="p-4 border border-stone-200 dark:border-stone-800">EU Size</th>
                    <th className="p-4 border border-stone-200 dark:border-stone-800">UK Size</th>
                    <th className="p-4 border border-stone-200 dark:border-stone-800">US Size</th>
                    <th className="p-4 border border-stone-200 dark:border-stone-800">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { eu: 39, uk: 5.5, us: 6.5, cm: 24.5 },
                    { eu: 40, uk: 6.5, us: 7.5, cm: 25.0 },
                    { eu: 41, uk: 7.5, us: 8.5, cm: 26.0 },
                    { eu: 42, uk: 8.0, us: 9.0, cm: 26.5 },
                    { eu: 43, uk: 9.0, us: 10.0, cm: 27.5 },
                    { eu: 44, uk: 9.5, us: 10.5, cm: 28.0 },
                    { eu: 45, uk: 10.5, us: 11.5, cm: 29.0 },
                    { eu: 46, uk: 11.0, us: 12.0, cm: 29.5 },
                  ].map((row) => (
                    <tr key={row.eu} className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                      <td className="p-4 border border-stone-200 dark:border-stone-800 font-medium">{row.eu}</td>
                      <td className="p-4 border border-stone-200 dark:border-stone-800">{row.uk}</td>
                      <td className="p-4 border border-stone-200 dark:border-stone-800">{row.us}</td>
                      <td className="p-4 border border-stone-200 dark:border-stone-800">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">How to Measure</h2>
            <ol className="list-decimal pl-5 space-y-4">
              <li>Place a piece of paper on the floor against a wall.</li>
              <li>Stand on the paper with your heel against the wall.</li>
              <li>Mark the longest part of your foot on the paper.</li>
              <li>Measure the distance from the wall to the mark in centimeters.</li>
              <li>Compare your measurement with the chart above to find your size.</li>
            </ol>
            <p className="mt-4 text-sm italic">
              Tip: Measure both feet and use the larger measurement for the best fit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
