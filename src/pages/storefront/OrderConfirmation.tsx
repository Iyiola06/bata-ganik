import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderConfirmation() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 animate-scale-in">
            <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-navy dark:text-white mb-4">
            Your story is on its way.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-light max-w-lg mx-auto">
            Thank you for your purchase, Omowunmi. We are crafting your order with care. A confirmation email has been sent to <span className="text-brand-navy dark:text-white font-medium">omowunmi@example.com</span>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-50 dark:bg-neutral-900/50">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">Order Number</span>
              <span className="text-lg font-serif font-bold text-brand-navy dark:text-white">#BG-8294-LG</span>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">Estimated Delivery</span>
              <span className="text-lg font-serif font-bold text-primary">Oct 24 - Oct 28</span>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 md:p-8">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {/* Item 1 */}
              <div className="flex flex-col sm:flex-row gap-6 py-6 first:pt-0">
                <div className="w-full sm:w-32 h-32 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw" alt="The Danfo Oxford" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-xl text-brand-navy dark:text-white mb-1">The Danfo Oxford</h3>
                      <p className="text-sm text-slate-500 mb-1">Size: 42 (EU)</p>
                      <p className="text-sm text-slate-500">Color: Cognac Leather</p>
                    </div>
                    <span className="font-bold text-lg text-brand-navy dark:text-white">$245.00</span>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Processing
                    </span>
                  </div>
                </div>
              </div>
              {/* Item 2 */}
              <div className="flex flex-col sm:flex-row gap-6 py-6 last:pb-0">
                <div className="w-full sm:w-32 h-32 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI" alt="The Zaria Boot" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-xl text-brand-navy dark:text-white mb-1">The Zaria Boot</h3>
                      <p className="text-sm text-slate-500 mb-1">Size: 42 (EU)</p>
                      <p className="text-sm text-slate-500">Color: Chocolate Brown</p>
                    </div>
                    <span className="font-bold text-lg text-brand-navy dark:text-white">$315.00</span>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Processing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-700">
              <div className="flex justify-between mb-2 text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>$560.00</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-slate-600 dark:text-slate-400">
                <span>Shipping (International Express)</span>
                <span>$45.00</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                <span className="font-serif font-bold text-xl text-brand-navy dark:text-white">Total</span>
                <span className="font-serif font-bold text-xl text-brand-navy dark:text-white">$605.00</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 md:p-8 border-t border-neutral-100 dark:border-neutral-700">
            <h4 className="font-serif text-lg font-bold text-brand-navy dark:text-white mb-4">Shipping Address</h4>
            <address className="not-italic text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Omowunmi Adebayo<br />
              14 Admiralty Way, Lekki Phase 1<br />
              Lagos, 105102<br />
              Nigeria<br />
              +234 801 234 5678
            </address>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button className="bg-primary hover:bg-primary/90 text-brand-navy font-bold py-4 px-10 rounded-sm transition-all duration-300 tracking-wide uppercase text-sm w-full sm:w-auto text-center">
            Track Order
          </button>
          <Link to="/" className="border border-brand-navy dark:border-white text-brand-navy dark:text-white hover:bg-brand-navy hover:text-white dark:hover:bg-white dark:hover:text-brand-navy font-medium py-4 px-10 rounded-sm transition-all duration-300 tracking-wide uppercase text-sm w-full sm:w-auto text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
