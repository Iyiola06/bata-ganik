import React, { useState } from 'react';
import { api } from '../../lib/api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact', { name, email, subject, message });
      setSuccess(true);
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col lg:flex-row pt-20">
      {/* Contact Form Section */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-background-dark p-8 lg:p-20 flex flex-col justify-center relative order-2 lg:order-1">
        <div className="max-w-xl mx-auto w-full">
          <div className="mb-12">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Concierge Service</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-medium text-slate-900 dark:text-white mb-6">Let us assist you</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light text-lg">
              Whether you're inquiring about a custom order, checking availability, or simply want to learn more about our heritage, we are here to help.
            </p>
          </div>

          {success ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
              </div>
              <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">Message Received</h3>
              <p className="text-slate-500 dark:text-slate-400">Thank you, {name.split(' ')[0]}. Our concierge team will respond within 24 hours.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 text-primary underline text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {[
                  { id: 'name', label: 'Your Name', type: 'text', value: name, setter: setName },
                  { id: 'email', label: 'Email Address', type: 'email', value: email, setter: setEmail },
                  { id: 'subject', label: 'Subject', type: 'text', value: subject, setter: setSubject },
                ].map(({ id, label, type, value, setter }) => (
                  <div key={id} className="relative group">
                    <input
                      id={id}
                      type={type}
                      required
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="block w-full py-4 px-0 text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                      placeholder=" "
                    />
                    <label
                      htmlFor={id}
                      className="absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-medium"
                    >
                      {label}
                    </label>
                  </div>
                ))}
                <div className="relative group">
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="block w-full py-4 px-0 text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors resize-none"
                    placeholder=" "
                  />
                  <label
                    htmlFor="message"
                    className="absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-medium"
                  >
                    Your Message
                  </label>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-brand-navy dark:bg-white text-white dark:text-brand-navy px-10 py-4 font-bold uppercase tracking-widest transition duration-300 hover:bg-primary hover:text-brand-navy focus:outline-none disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="animate-spin material-symbols-outlined mr-2">progress_activity</span>
                  ) : (
                    <span className="mr-2">Send Message</span>
                  )}
                  {!submitting && (
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Map / Info Section */}
      <div className="w-full lg:w-1/2 bg-brand-navy dark:bg-black relative min-h-[500px] lg:min-h-auto order-1 lg:order-2 overflow-hidden flex flex-col">
        <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.730379379204!2d3.419672374187258!3d6.428611193562473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8ad706240221%3A0xe5433362145e69e0!2sVictoria%20Island%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1709923847234!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/90 to-brand-navy/60 dark:from-black dark:via-black/90 dark:to-black/60 z-10" />
        <div className="relative z-20 flex flex-col justify-center items-center h-full p-10 lg:p-20 text-center">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 text-primary mb-6 bg-brand-navy/50 backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <h3 className="font-serif text-3xl text-white mb-2">Lagos Flagship</h3>
            <div className="w-12 h-0.5 bg-primary mx-auto my-6" />
            <address className="not-italic text-white/70 font-light leading-relaxed">
              14 Adetokunbo Ademola Street<br />
              Victoria Island, Lagos<br />
              Nigeria
            </address>
            <p className="text-primary text-sm mt-4 tracking-widest uppercase font-bold">Open Daily 10am - 8pm</p>
          </div>
          <div className="flex flex-col gap-6 w-full max-w-sm">
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-primary hover:text-brand-navy backdrop-blur-sm border border-white/10 text-white py-4 px-6 rounded-sm transition-all duration-300 group"
            >
              <span className="material-symbols-outlined text-xl text-green-400 group-hover:text-brand-navy">chat</span>
              <span className="uppercase tracking-wide text-sm font-bold">Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
