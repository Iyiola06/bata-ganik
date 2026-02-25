import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatNGN } from '../../lib/api';
import { useCart } from '../../context/CartContext';

type Step = 'details' | 'payment';
type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';
type Gateway = 'paystack' | 'stripe';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface DiscountData {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

const SHIPPING_FEE = 5000; // ₦5,000

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();

  const [step, setStep] = useState<Step>('details');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [gateway, setGateway] = useState<Gateway>('paystack');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Shipping form
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', country: 'Nigeria',
  });

  // Discount
  const [discountCode, setDiscountCode] = useState('');
  const [discountData, setDiscountData] = useState<DiscountData | null>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const updateAddress = (field: keyof ShippingAddress, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + (item.product.price + item.variant.priceModifier) * item.quantity,
      0
    ) ?? 0;

  const discountAmount = discountData?.discountAmount ?? 0;
  const total = subtotal + SHIPPING_FEE - discountAmount;

  useEffect(() => {
    // When currency changes, set the appropriate gateway
    if (currency === 'NGN') {
      setGateway('paystack');
    } else {
      setGateway('stripe');
    }
  }, [currency]);

  const validateDiscount = async () => {
    if (!discountCode.trim()) return;
    setValidatingCode(true);
    setDiscountError('');
    try {
      const res = await api.post<{ discount: { id: string; code: string; type: string; value: number; discountAmount: number } }>(
        '/discount/validate',
        { code: discountCode.toUpperCase(), orderTotal: subtotal }
      );
      setDiscountData({
        id: res.discount.id,
        code: res.discount.code,
        discountType: res.discount.type as 'percentage' | 'fixed',
        discountValue: res.discount.value,
        discountAmount: res.discount.discountAmount,
      });
    } catch (err: any) {
      setDiscountError(err?.message ?? 'Invalid discount code');
      setDiscountData(null);
    } finally {
      setValidatingCode(false);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaystackPayment = async () => {
    if (!cart) return;
    setIsSubmitting(true);
    setError('');
    try {
      // 1. Create the order
      const orderRes = await api.post<{ order: { id: string; total: number } }>('/orders', {
        cartId: cart.id,
        guestFirstName: address.firstName,
        guestLastName: address.lastName,
        guestEmail: address.email,
        guestPhone: address.phone,
        shippingAddress: {
          firstName: address.firstName,
          lastName: address.lastName,
          phone: address.phone,
          addressLine1: address.address,
          city: address.city,
          state: address.state,
          country: address.country,
        },
        shippingFee: SHIPPING_FEE,
        discountCodeId: discountData?.id,
        discountAmount: discountData?.discountAmount ?? 0,
        paymentGateway: 'paystack',
        currency: 'NGN',
      });

      // 2. Initialize Paystack
      const payRes = await api.post<{ authorizationUrl: string }>('/payments/paystack/initialize', {
        orderId: orderRes.order.id,
        email: address.email,
        amount: orderRes.order.total,
      });

      await refreshCart();
      // 3. Redirect to Paystack hosted page
      window.location.href = payRes.authorizationUrl;
    } catch (err: any) {
      setError(err?.message ?? 'Payment initialization failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripePayment = async () => {
    if (!cart) return;
    setIsSubmitting(true);
    setError('');
    try {
      // 1. Create the order
      const orderRes = await api.post<{ order: { id: string; total: number } }>('/orders', {
        cartId: cart.id,
        guestFirstName: address.firstName,
        guestLastName: address.lastName,
        guestEmail: address.email,
        guestPhone: address.phone,
        shippingAddress: {
          firstName: address.firstName,
          lastName: address.lastName,
          phone: address.phone,
          addressLine1: address.address,
          city: address.city,
          state: address.state,
          country: address.country,
        },
        shippingFee: SHIPPING_FEE,
        discountCodeId: discountData?.id,
        discountAmount: discountData?.discountAmount ?? 0,
        paymentGateway: 'stripe',
        currency: currency.toLowerCase(),
      });

      // 2. Initialize Stripe PaymentIntent
      const payRes = await api.post<{ clientSecret: string }>('/payments/stripe/initialize', {
        orderId: orderRes.order.id,
        amount: orderRes.order.total,
        currency: currency.toLowerCase(),
      });

      await refreshCart();
      // 3. Redirect to order-confirmation
      navigate(`/order-confirmation?orderId=${orderRes.order.id}&clientSecret=${payRes.clientSecret}`);
    } catch (err: any) {
      setError(err?.message ?? 'Payment initialization failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen bg-background-light dark:bg-background-dark text-center">
        <p className="text-slate-500 text-lg">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-primary underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Progress */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <button
            onClick={() => setStep('details')}
            className={`font-medium transition-colors hover:text-primary ${step === 'details' ? 'text-slate-900 dark:text-white font-bold' : ''}`}
          >
            Details
          </button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className={`font-medium transition-colors ${step === 'payment' ? 'text-slate-900 dark:text-white font-bold' : ''}`}>
            Payment
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="flex-1">
            {/* Step 1: Details */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                <h2 className="font-serif text-3xl text-slate-900 dark:text-white mb-6">Contact & Shipping</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: 'firstName' as const, label: 'First Name' },
                    { field: 'lastName' as const, label: 'Last Name' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">{label}</label>
                      <input
                        type="text"
                        required
                        value={address[field]}
                        onChange={(e) => updateAddress(field, e.target.value)}
                        className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 bg-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
                {[
                  { field: 'email' as const, label: 'Email Address', type: 'email' },
                  { field: 'phone' as const, label: 'Phone Number', type: 'tel' },
                  { field: 'address' as const, label: 'Street Address', type: 'text' },
                  { field: 'city' as const, label: 'City', type: 'text' },
                  { field: 'state' as const, label: 'State / Region', type: 'text' },
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">{label}</label>
                    <input
                      type={type}
                      required
                      value={address[field]}
                      onChange={(e) => updateAddress(field, e.target.value)}
                      className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 bg-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => updateAddress('country', e.target.value)}
                    className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-4 py-3 bg-white dark:bg-neutral-900 focus:outline-none focus:border-primary"
                  >
                    <option>Nigeria</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-md transition-all tracking-wide uppercase flex items-center justify-center gap-2"
                >
                  Continue to Payment <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="space-y-6">
                <h2 className="font-serif text-3xl text-slate-900 dark:text-white mb-6">Payment</h2>

                {/* Currency / Gateway Selector */}
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-3">Currency & Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'NGN', label: '₦ Naira (Paystack)', subtitle: 'Card, Bank Transfer, USSD, Mobile Money' },
                      { value: 'USD', label: '$ US Dollar (Stripe)', subtitle: 'Card, Apple Pay, Google Pay' },
                      { value: 'GBP', label: '£ British Pound (Stripe)', subtitle: 'Card, Apple Pay, Google Pay' },
                      { value: 'EUR', label: '€ Euro (Stripe)', subtitle: 'Card, SEPA Direct Debit' },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setCurrency(opt.value as Currency)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${currency === opt.value
                          ? 'border-primary ring-1 ring-primary bg-primary/5'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary/50'
                          }`}
                      >
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.subtitle}</p>
                        {currency === opt.value && (
                          <span className="material-symbols-outlined text-primary text-sm mt-2 block">check_circle</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Pay Button */}
                {gateway === 'paystack' ? (
                  <button
                    onClick={handlePaystackPayment}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-md transition-all tracking-wide uppercase flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin material-symbols-outlined">progress_activity</span>
                    ) : (
                      <><span className="material-symbols-outlined text-sm">payments</span> Pay {formatNGN(total)} with Paystack</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleStripePayment}
                    disabled={isSubmitting}
                    className="w-full bg-[#635BFF] hover:bg-[#4f46e5] text-white font-bold py-4 rounded-md transition-all tracking-wide uppercase flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin material-symbols-outlined">progress_activity</span>
                    ) : (
                      <><span className="material-symbols-outlined text-sm">credit_card</span> Pay with Stripe</>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setStep('details')}
                  className="w-full text-sm text-slate-500 hover:text-primary flex items-center justify-center gap-1 mt-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Back to details
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Secured with 256-bit SSL encryption
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 sticky top-24">
              <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-700">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-700 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images[0] && (
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.product.name}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white ml-2 flex-shrink-0">
                          {formatNGN((item.product.price + item.variant.priceModifier) * item.quantity)}
                        </p>
                      </div>
                      {item.variant.color && <p className="text-xs text-slate-500">{item.variant.color}</p>}
                      <p className="text-xs text-slate-500">Size: {item.variant.sizeEU} EU · Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="WELCOME10"
                    className="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={validateDiscount}
                    disabled={validatingCode}
                    className="bg-neutral-200 dark:bg-neutral-700 text-slate-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-60"
                  >
                    {validatingCode ? '...' : 'Apply'}
                  </button>
                </div>
                {discountError && <p className="text-red-500 text-xs mt-1">{discountError}</p>}
                {discountData && (
                  <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                    {discountData.discountType === 'percentage'
                      ? `${discountData.discountValue}% off applied`
                      : `${formatNGN(discountData.discountValue)} off applied`}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 pb-4 border-b border-neutral-100 dark:border-neutral-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatNGN(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountData?.code})</span>
                    <span>−{formatNGN(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatNGN(SHIPPING_FEE)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="font-bold text-lg text-slate-900 dark:text-white">Total</span>
                <span className="font-serif font-bold text-xl text-primary">{formatNGN(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
