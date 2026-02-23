import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { useCart } from '../context/CartContext';
import { formatNGN } from '../lib/api';

export default function StorefrontLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, itemCount, updateQty, removeItem } = useCart();

  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + (item.product.price + item.variant.priceModifier) * item.quantity,
      0
    ) ?? 0;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden font-display min-h-screen flex flex-col">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-brand-navy/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Left Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors">Home</Link>
            <Link to="/shop" className="text-white/80 hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors">Shop</Link>
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
              <Link to="/account" className="text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-white hover:text-primary transition-colors relative"
                aria-label={`Shopping bag — ${itemCount} items`}
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </nav>
          {/* Mobile */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsCartOpen(true)} className="text-white hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-white hover:text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end md:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-full max-w-xs bg-brand-navy text-white shadow-2xl h-full flex flex-col border-l border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-serif text-xl font-bold uppercase tracking-widest">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/60 hover:text-white">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {[
                { to: '/shop', label: 'Shop' },
                { to: '/collections', label: 'Collections' },
                { to: '/our-story', label: 'Our Story' },
                { to: '/contact', label: 'Contact' },
                { to: '/account', label: 'Account' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-white/80 hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-brand-navy-light shadow-2xl h-full flex flex-col border-l border-white/10">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-white/10">
              <h2 className="font-serif text-2xl font-medium text-slate-900 dark:text-white">
                Shopping Bag{' '}
                {itemCount > 0 && (
                  <span className="text-sm font-sans text-primary ml-2">({itemCount})</span>
                )}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!cart || cart.items.length === 0 ? (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-5xl text-stone-300 dark:text-stone-700 mb-4 block">
                    shopping_bag
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">Your bag is empty.</p>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 inline-block text-primary underline text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Link
                      to={`/products/${item.product.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-24 h-32 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-sm overflow-hidden"
                    >
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-serif text-base text-slate-900 dark:text-white hover:text-primary transition-colors leading-tight"
                          >
                            {item.product.name}
                          </Link>
                          <span className="text-sm font-medium text-slate-900 dark:text-white ml-2">
                            {formatNGN((item.product.price + item.variant.priceModifier) * item.quantity)}
                          </span>
                        </div>
                        {item.variant.color && (
                          <p className="text-xs text-slate-500 dark:text-white/60">{item.variant.color}</p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-white/60">Size: {item.variant.sizeEU} EU</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-300 dark:border-white/20 rounded-sm">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="px-2 text-xs font-medium text-slate-900 dark:text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-slate-600 dark:text-white/60 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-slate-400 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400 transition-colors underline decoration-1 underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-white/10 p-6 bg-white dark:bg-brand-navy-light">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-500 dark:text-white/60">Subtotal</span>
                  <span className="text-lg font-serif font-medium text-slate-900 dark:text-white">
                    {formatNGN(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-white/40 mb-6">Shipping & taxes calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-primary hover:bg-primary/90 text-brand-navy font-bold py-4 px-6 rounded-sm transition-all duration-300 tracking-wide uppercase text-sm flex items-center justify-center gap-2"
                >
                  Checkout <span>•</span> {formatNGN(subtotal)}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy-light text-white pt-20 pb-10 border-t border-white/5 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="text-primary"><span className="material-symbols-outlined text-3xl">diamond</span></div>
                <h2 className="font-serif text-2xl font-bold uppercase tracking-widest">Bata Ganik</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Redefining African luxury footwear. Handcrafted in Lagos, worn globally.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-primary transition-colors"><FontAwesomeIcon icon={faInstagram} size="lg" /></a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors"><FontAwesomeIcon icon={faTwitter} size="lg" /></a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors"><FontAwesomeIcon icon={faFacebookF} size="lg" /></a>
              </div>
            </div>
            <div>
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-6">Shop</h3>
              <ul className="space-y-4 text-sm text-white/70">
                <li><Link to="/shop?sort=newest" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link to="/collections" className="hover:text-white transition-colors">Collections</Link></li>
              </ul>
            </div>
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
            <div>
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-6">Stay in the loop</h3>
              <p className="text-white/60 text-sm mb-4">Subscribe for exclusive access to new drops and private sales.</p>
              <form className="flex flex-col gap-3">
                <input type="email" placeholder="Your email address" className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary" />
                <button type="button" className="bg-primary text-brand-navy font-bold py-3 px-4 rounded-md hover:bg-white transition-colors uppercase text-xs tracking-wider">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© 2025 Bata Ganik. All rights reserved.</p>
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
