import React from 'react';

export default function TermsOfService() {
  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-8 text-center">Terms of Service</h1>
        
        <div className="space-y-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Introduction</h2>
            <p className="mb-4">
              Welcome to Bata Ganik. These Terms of Service govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Use of Our Website</h2>
            <p className="mb-4">
              You may use our website for lawful purposes only. You agree not to use our website in any way that violates any applicable laws or regulations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Intellectual Property</h2>
            <p className="mb-4">
              All content on our website, including text, graphics, logos, images, and software, is the property of Bata Ganik or its licensors and is protected by copyright and other intellectual property laws. You may not use any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Product Information</h2>
            <p className="mb-4">
              We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content on our website are accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Pricing and Availability</h2>
            <p className="mb-4">
              Prices and availability of products are subject to change without notice. We reserve the right to limit the quantity of products we supply.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Bata Ganik be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our website or services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Nigeria.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. Your continued use of our website following any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@bataganik.com" className="text-primary hover:underline">legal@bataganik.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
