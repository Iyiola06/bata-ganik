import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Introduction</h2>
            <p className="mb-4">
              At Bata Ganik, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide to us directly, such as your name, email address, shipping address, and payment information when you place an order or sign up for our newsletter.
            </p>
            <p className="mb-4">
              We also automatically collect certain information about your device and browsing activity, including your IP address, browser type, and pages visited.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and fulfill your orders.</li>
              <li>Communicate with you about your order status and provide customer support.</li>
              <li>Send you marketing communications and promotional offers (if you have opted in).</li>
              <li>Improve our website and services.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Sharing Your Information</h2>
            <p className="mb-4">
              We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, and delivering orders.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Your Rights</h2>
            <p className="mb-4">
              You have the right to access, correct, or delete your personal information. You may also opt out of receiving marketing communications at any time.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:privacy@bataganik.com" className="text-primary hover:underline">privacy@bataganik.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
