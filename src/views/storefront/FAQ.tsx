import React from 'react';

export default function FAQ() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Ordering & Payment</h2>
            <div className="space-y-6">
              <details className="group border-b border-stone-200 dark:border-stone-800 pb-4 cursor-pointer">
                <summary className="font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors list-none flex justify-between items-center">
                  What payment methods do you accept?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-4 text-sm">
                  We accept all major credit and debit cards (Visa, Mastercard, Verve), bank transfers, and mobile money payments via Paystack.
                </p>
              </details>
              <details className="group border-b border-stone-200 dark:border-stone-800 pb-4 cursor-pointer">
                <summary className="font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors list-none flex justify-between items-center">
                  Can I change or cancel my order?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-4 text-sm">
                  Yes, you can modify or cancel your order within 24 hours of placing it. Please contact our support team immediately for assistance.
                </p>
              </details>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Shipping & Delivery</h2>
            <div className="space-y-6">
              <details className="group border-b border-stone-200 dark:border-stone-800 pb-4 cursor-pointer">
                <summary className="font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors list-none flex justify-between items-center">
                  Do you ship internationally?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-4 text-sm">
                  Yes, we ship worldwide via DHL Express. Shipping rates and delivery times vary depending on your location.
                </p>
              </details>
              <details className="group border-b border-stone-200 dark:border-stone-800 pb-4 cursor-pointer">
                <summary className="font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors list-none flex justify-between items-center">
                  How can I track my order?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-4 text-sm">
                  Once your order has shipped, you will receive a confirmation email with a tracking number and a link to track your package.
                </p>
              </details>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Product Care & Sizing</h2>
            <div className="space-y-6">
              <details className="group border-b border-stone-200 dark:border-stone-800 pb-4 cursor-pointer">
                <summary className="font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors list-none flex justify-between items-center">
                  How do I care for my leather shoes?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-4 text-sm">
                  We recommend cleaning your shoes with a soft, dry cloth and using a high-quality leather conditioner regularly. Avoid direct sunlight and moisture.
                </p>
              </details>
              <details className="group border-b border-stone-200 dark:border-stone-800 pb-4 cursor-pointer">
                <summary className="font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors list-none flex justify-between items-center">
                  Are your sizes true to fit?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-4 text-sm">
                  Yes, our shoes are designed to fit true to size based on standard European sizing. Please refer to our Size Guide for detailed measurements.
                </p>
              </details>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
