import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Order, formatPrice } from '../../lib/api';

export default function TrackOrder() {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const res = await api.get<{ orders: Order[] }>(`/orders?email=${encodeURIComponent(email.trim())}`);
      const match = res.orders?.find(
        (o) => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase()
      );
      if (match) {
        setOrder(match);
      } else {
        setError('No order found with that email and order number combination.');
      }
    } catch {
      setError('Could not look up order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">Order Tracking</span>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">
            Track Your Order
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Enter your email address and order number to check the status of your order.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 md:p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email you used at checkout"
                className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 bg-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Order Number
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. BG-2026-12345"
                className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 bg-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-md transition-all tracking-wide uppercase flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-spin material-symbols-outlined">progress_activity</span>
              ) : (
                <><span className="material-symbols-outlined text-sm">search</span> Track Order</>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-700 dark:text-red-400 mb-8 text-center">
            {error}
          </div>
        )}

        {/* Result */}
        {order && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            {/* Order Header */}
            <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">Order Number</span>
                  <span className="text-lg font-serif font-bold text-slate-900 dark:text-white">#{order.orderNumber}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">Placed On</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {new Date(order.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Tracker */}
            <div className="p-6 md:p-8">
              {order.status === 'CANCELLED' ? (
                <div className="text-center py-4">
                  <span className="material-symbols-outlined text-4xl text-red-500 mb-2 block">cancel</span>
                  <p className="text-red-600 font-bold">This order has been cancelled.</p>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    {statusSteps.map((step, i) => (
                      <div key={step} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {i > 0 && (
                          <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                            i <= currentStep ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
                          }`} />
                        )}
                        {/* Step dot */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                          i <= currentStep
                            ? 'bg-primary text-white'
                            : 'bg-neutral-200 dark:bg-neutral-700 text-slate-500'
                        }`}>
                          {i < currentStep ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            i + 1
                          )}
                        </div>
                        {/* Step label */}
                        <span className={`text-[10px] mt-2 uppercase tracking-wider font-bold ${
                          i <= currentStep ? 'text-primary' : 'text-slate-400'
                        }`}>
                          {step === 'PROCESSING' ? 'Confirmed' : step.charAt(0) + step.slice(1).toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-700 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images[0] && (
                        <img src={item.product.images[0].url} alt={item.productName} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.productName}</p>
                      <p className="text-xs text-slate-500">
                        Size: {item.size} EU {item.color ? `· ${item.color}` : ''} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">
                      {formatPrice(item.lineTotal, order.currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-neutral-100 dark:border-neutral-700 pt-4 flex justify-between items-center">
                <span className="font-serif font-bold text-lg text-slate-900 dark:text-white">Total</span>
                <span className="font-serif font-bold text-xl text-primary">{formatPrice(order.total, order.currency)}</span>
              </div>
            </div>

            {/* View Full Details */}
            <div className="p-6 border-t border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-center">
              <Link
                to={`/order-confirmation?orderId=${order.id}`}
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                View Full Order Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}

        {/* No results hint */}
        {searched && !order && !loading && !error && (
          <p className="text-center text-slate-500">No order found.</p>
        )}
      </div>
    </div>
  );
}
