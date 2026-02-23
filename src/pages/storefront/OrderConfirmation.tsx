import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, type Order, formatNGN } from '../../lib/api';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.');
      setLoading(false);
      return;
    }
    api.get<{ order: Order }>(`/orders?orderId=${orderId}`)
      .then((res) => setOrder(res.order))
      .catch(() => setError('Could not load order details.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen text-center">
        <p className="text-slate-500 text-lg">{error || 'Order not found.'}</p>
        <Link to="/shop" className="mt-4 inline-block text-primary underline">Continue Shopping</Link>
      </div>
    );
  }

  const customerName = `${order.guestFirstName ?? ''} ${order.guestLastName ?? ''}`.trim() || 'Valued Customer';

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8">
            <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-navy dark:text-white mb-4">
            Your story is on its way.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-light max-w-lg mx-auto">
            Thank you for your purchase, <strong className="text-brand-navy dark:text-white">{customerName}</strong>. We are crafting your
            order with care.{order.guestEmail && (
              <> A confirmation email has been sent to <span className="text-brand-navy dark:text-white font-medium">{order.guestEmail}</span>.</>
            )}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-50 dark:bg-neutral-900/50">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">Order Number</span>
              <span className="text-lg font-serif font-bold text-brand-navy dark:text-white">#{order.orderNumber}</span>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 uppercase tracking-wider">
                {order.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 md:p-8">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 py-6 first:pt-0 last:pb-0">
                  <div className="w-full sm:w-28 h-28 bg-neutral-100 dark:bg-neutral-700 rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images[0] && (
                      <img src={item.product.images[0].url} alt={item.productName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-xl text-brand-navy dark:text-white mb-1">{item.productName}</h3>
                        <p className="text-sm text-slate-500">Size: {item.size} (EU)</p>
                        {item.color && <p className="text-sm text-slate-500">Color: {item.color}</p>}
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-lg text-brand-navy dark:text-white">{formatNGN(item.lineTotal)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-700 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatNGN(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−{formatNGN(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>{formatNGN(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                <span className="font-serif font-bold text-xl text-brand-navy dark:text-white">Total</span>
                <span className="font-serif font-bold text-xl text-primary">{formatNGN(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 md:p-8 border-t border-neutral-100 dark:border-neutral-700">
              <h4 className="font-serif text-lg font-bold text-brand-navy dark:text-white mb-4">Shipping Address</h4>
              <address className="not-italic text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {customerName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.country}<br />
                {order.guestEmail}
              </address>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/shop"
            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-sm transition-all duration-300 tracking-wide uppercase text-sm w-full sm:w-auto text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="border border-brand-navy dark:border-white text-brand-navy dark:text-white hover:bg-brand-navy hover:text-white font-medium py-4 px-10 rounded-sm transition-all duration-300 tracking-wide uppercase text-sm w-full sm:w-auto text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
