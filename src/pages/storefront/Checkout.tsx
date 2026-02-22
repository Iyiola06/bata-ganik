import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      navigate('/order-confirmation');
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Payment Details */}
          <div className="flex-1">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <Link to="/contact" className="hover:text-primary">Contact</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="hover:text-primary cursor-pointer">Shipping</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="font-bold text-slate-900 dark:text-white">Payment</span>
            </nav>

            <h2 className="font-serif text-3xl text-slate-900 dark:text-white mb-2">Payment Details</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Choose your preferred payment method.</p>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Payment Methods */}
              <div className="space-y-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary ring-1 ring-primary bg-white dark:bg-neutral-800' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary/50'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-white">Card Payment</span>
                    </div>
                    {paymentMethod === 'card' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1 ml-0">Pay securely with Paystack</p>
                </div>

                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-primary ring-1 ring-primary bg-white dark:bg-neutral-800' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary/50'}`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-white">Bank Transfer</span>
                    </div>
                    {paymentMethod === 'bank' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1 ml-0">Direct transfer to our Zenith Bank account</p>
                </div>
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-4 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Card Information</h3>
                    <div className="flex gap-2">
                       <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">VISA</span>
                       <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">MC</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <input type="text" placeholder="Card number" className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent" />
                      <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400">credit_card</span>
                    </div>
                    
                    <input type="text" placeholder="Name on card" className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent" />
                    
                    <div className="flex gap-4">
                      <input type="text" placeholder="Expiration (MM/YY)" className="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent" />
                      <div className="flex-1 relative">
                        <input type="text" placeholder="CVC" className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent" />
                        <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-lg cursor-help">help</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="billing" className="rounded border-neutral-300 text-primary focus:ring-primary" defaultChecked />
                    <label htmlFor="billing" className="text-sm text-slate-600 dark:text-slate-300">Billing address same as shipping</label>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-md transition-all shadow-lg mt-8">
                Pay ₦85,000.00
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
                <span className="material-symbols-outlined text-sm">lock</span>
                Your transaction is secured with 256-bit SSL encryption
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 sticky top-24">
              <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6">Order Summary</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-700">
                <div className="w-16 h-16 bg-neutral-100 rounded-md overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw" alt="Shoe" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-slate-900 dark:text-white">Lagos Loafer</h4>
                    <span className="font-medium">₦80,000</span>
                  </div>
                  <p className="text-xs text-slate-500">Onyx Black</p>
                  <p className="text-xs text-slate-500">Size: 42</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">Qty 1</span>
                    <button className="text-xs text-primary hover:underline">Remove</button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">Discount code</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="GIFT20" className="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  <button className="bg-neutral-200 dark:bg-neutral-700 text-slate-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">Apply</button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 pb-4 border-b border-neutral-100 dark:border-neutral-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-white">₦80,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900 dark:text-white">₦5,000.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="font-bold text-lg text-slate-900 dark:text-white">Total</span>
                <span className="font-serif font-bold text-xl text-primary">₦85,000.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
