import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';

export default function StorefrontLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden font-display min-h-screen flex flex-col">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-brand-navy/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Left Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop/new-arrivals" className="text-white/80 hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors">Shop</Link>
            <Link to="/collections" className="text-white/80 hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors">Collections</Link>
          </nav>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">diamond</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-widest uppercase">Bata Ganik</h1>
          </Link>
          {/* Right Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/our-story" className="text-white/80 hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors">Our Story</Link>
            <Link to="/contact" className="text-white/80 hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors">Contact</Link>
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              <button className="text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
              <Link to="/account" className="text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-white hover:text-primary transition-colors relative"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </button>
            </div>
          </nav>
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-primary transition-colors relative"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white hover:text-primary"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end md:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity opacity-100" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-full max-w-xs bg-brand-navy text-white shadow-2xl h-full flex flex-col transform transition-transform translate-x-0 border-l border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-white">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/60 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <nav className="flex flex-col gap-6">
                <Link to="/shop/new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Shop</Link>
                <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Collections</Link>
                <Link to="/our-story" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Our Story</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Contact</Link>
                <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Account</Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity opacity-100" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-brand-navy-light shadow-2xl h-full flex flex-col transform transition-transform translate-x-0 border-l border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-white/10">
              <h2 className="font-serif text-2xl font-medium text-slate-900 dark:text-white">Shopping Bag <span className="text-sm font-sans text-primary ml-2">(3)</span></h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scroll">
              {/* Cart Item 1 */}
              <div className="flex gap-4 group">
                <div className="w-24 h-32 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-sm overflow-hidden relative">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw" alt="The Danfo Oxford" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg text-slate-900 dark:text-white leading-tight">The Danfo Oxford</h3>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">$245.00</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-white/60 mb-1">Cognac Leather</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">Size: 42 EU</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-300 dark:border-white/20 rounded-sm">
                      <button className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors text-xs">
                        <span className="material-symbols-outlined text-xs">remove</span>
                      </button>
                      <span className="px-2 text-xs font-medium text-slate-900 dark:text-white min-w-[20px] text-center">1</span>
                      <button className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors text-xs">
                        <span className="material-symbols-outlined text-xs">add</span>
                      </button>
                    </div>
                    <button className="text-xs text-slate-400 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400 transition-colors underline decoration-1 underline-offset-2">Remove</button>
                  </div>
                </div>
              </div>
              {/* Cart Item 2 */}
              <div className="flex gap-4 group">
                <div className="w-24 h-32 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-sm overflow-hidden relative">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e" alt="The Eyo Derby" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg text-slate-900 dark:text-white leading-tight">The Eyo Derby</h3>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">$280.00</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-white/60 mb-1">Midnight Black</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">Size: 43 EU</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-300 dark:border-white/20 rounded-sm">
                      <button className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors text-xs">
                        <span className="material-symbols-outlined text-xs">remove</span>
                      </button>
                      <span className="px-2 text-xs font-medium text-slate-900 dark:text-white min-w-[20px] text-center">1</span>
                      <button className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors text-xs">
                        <span className="material-symbols-outlined text-xs">add</span>
                      </button>
                    </div>
                    <button className="text-xs text-slate-400 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400 transition-colors underline decoration-1 underline-offset-2">Remove</button>
                  </div>
                </div>
              </div>
              {/* Cart Item 3 */}
              <div className="flex gap-4 group">
                <div className="w-24 h-32 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-sm overflow-hidden relative">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI" alt="The Zaria Boot" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg text-slate-900 dark:text-white leading-tight">The Zaria Boot</h3>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">$315.00</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-white/60 mb-1">Chocolate Brown</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">Size: 42 EU</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-300 dark:border-white/20 rounded-sm">
                      <button className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors text-xs">
                        <span className="material-symbols-outlined text-xs">remove</span>
                      </button>
                      <span className="px-2 text-xs font-medium text-slate-900 dark:text-white min-w-[20px] text-center">1</span>
                      <button className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors text-xs">
                        <span className="material-symbols-outlined text-xs">add</span>
                      </button>
                    </div>
                    <button className="text-xs text-slate-400 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400 transition-colors underline decoration-1 underline-offset-2">Remove</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 dark:border-white/10 p-6 bg-white dark:bg-brand-navy-light">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500 dark:text-white/60">Subtotal</span>
                <span className="text-lg font-serif font-medium text-slate-900 dark:text-white">$840.00</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-white/40 mb-6 font-light">Shipping & taxes calculated at checkout</p>
              <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="w-full bg-primary hover:bg-primary/90 text-brand-navy font-bold py-4 px-6 rounded-sm transition-all duration-300 tracking-wide uppercase text-sm flex items-center justify-center gap-2">
                Checkout <span>•</span> $840.00
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy-light text-white pt-20 pb-10 border-t border-white/5 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Col */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <span className="material-symbols-outlined text-3xl">diamond</span>
                </div>
                <h2 className="font-serif text-2xl font-bold uppercase tracking-widest">Bata Ganik</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Redefining African luxury footwear. Handcrafted in Lagos, worn globally.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-primary transition-colors">
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors">
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors">
                  <FontAwesomeIcon icon={faFacebookF} size="lg" />
                </a>
              </div>
            </div>
            {/* Links Col */}
            <div>
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-6">Shop</h3>
              <ul className="space-y-4 text-sm text-white/70">
                <li><Link to="/shop/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link to="/shop/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
                <li><Link to="/shop/oba-collection" className="hover:text-white transition-colors">The Oba Collection</Link></li>
                <li><Link to="/shop/saharan-edit" className="hover:text-white transition-colors">Saharan Edit</Link></li>
                <li><Link to="/shop/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            {/* Links Col */}
            <div>
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-6">Support</h3>
              <ul className="space-y-4 text-sm text-white/70">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/care-instructions" className="hover:text-white transition-colors">Care Instructions</Link></li>
              </ul>
            </div>
            {/* Newsletter */}
            <div>
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-6">Stay in the loop</h3>
              <p className="text-white/60 text-sm mb-4">Subscribe for exclusive access to new drops and private sales.</p>
              <form className="flex flex-col gap-3">
                <input type="email" placeholder="Your email address" className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                <button type="button" className="bg-primary text-brand-navy font-bold py-3 px-4 rounded-md hover:bg-white transition-colors uppercase text-xs tracking-wider">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          {/* Bottom Footer */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© 2024 Bata Ganik. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
