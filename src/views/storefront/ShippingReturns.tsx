import React from 'react';

export default function ShippingReturns() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Shipping & Returns</h1>
        
        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Shipping Policy</h2>
            <p className="mb-4">
              At Bata Ganik, we take pride in ensuring your handcrafted footwear reaches you in pristine condition. We offer worldwide shipping with our trusted logistics partners.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Lagos Delivery:</strong> 1-2 business days. Free for all orders.</li>
              <li><strong>Nationwide Delivery (Nigeria):</strong> 3-5 business days. Flat rate of ₦3,500.</li>
              <li><strong>International Shipping:</strong> 5-10 business days via DHL Express. Rates calculated at checkout based on destination.</li>
            </ul>
            <p className="mt-4">
              Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Return & Exchange Policy</h2>
            <p className="mb-4">
              We want you to be completely satisfied with your purchase. If for any reason you are not, we accept returns and exchanges within 14 days of delivery.
            </p>
            <p className="mb-4">
              To be eligible for a return, your item must be:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Unused and in the same condition that you received it.</li>
              <li>In the original packaging with all tags and dust bags included.</li>
              <li>Accompanied by the receipt or proof of purchase.</li>
            </ul>
            <p className="mt-4">
              <strong>Non-returnable items:</strong> Personalized or bespoke items, and gift cards.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">How to Initiate a Return</h2>
            <p>
              To start a return, please contact our support team at <a href="mailto:support@bataganik.com" className="text-primary hover:underline">support@bataganik.com</a> with your order number and reason for return. We will provide you with a return shipping label and instructions on how and where to send your package.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
