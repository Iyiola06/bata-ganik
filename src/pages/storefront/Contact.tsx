import React from 'react';

export default function Contact() {
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

          <form className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <input 
                  type="text" 
                  id="name" 
                  className="block w-full py-4 px-0 text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors" 
                  placeholder=" " 
                  required 
                />
                <label 
                  htmlFor="name" 
                  className="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-medium"
                >
                  Your Name
                </label>
              </div>
              <div className="relative group">
                <input 
                  type="email" 
                  id="email" 
                  className="block w-full py-4 px-0 text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors" 
                  placeholder=" " 
                  required 
                />
                <label 
                  htmlFor="email" 
                  className="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-medium"
                >
                  Email Address
                </label>
              </div>
              <div className="relative group">
                <textarea 
                  id="message" 
                  rows={4} 
                  className="block w-full py-4 px-0 text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors resize-none" 
                  placeholder=" " 
                  required 
                ></textarea>
                <label 
                  htmlFor="message" 
                  className="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-medium"
                >
                  Your Message
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button type="button" className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-brand-navy dark:bg-white text-white dark:text-brand-navy px-10 py-4 font-bold uppercase tracking-widest transition duration-300 hover:bg-primary hover:text-brand-navy dark:hover:bg-primary dark:hover:text-white focus:outline-none">
                <span className="mr-2">Send Message</span>
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map / Info Section */}
      <div className="w-full lg:w-1/2 bg-brand-navy dark:bg-black relative min-h-[500px] lg:min-h-auto order-1 lg:order-2 overflow-hidden flex flex-col">
        {/* Map Background (Simulated with Image/Overlay for now, or iframe) */}
        <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.730379379204!2d3.419672374187258!3d6.428611193562473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8ad706240221%3A0xe5433362145e69e0!2sVictoria%20Island%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1709923847234!5m2!1sen!2sus" 
             width="100%" 
             height="100%" 
             style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(85%)' }} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             className="w-full h-full object-cover"
           ></iframe>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/90 to-brand-navy/60 dark:from-black dark:via-black/90 dark:to-black/60 z-10"></div>

        <div className="relative z-20 flex flex-col justify-center items-center h-full p-10 lg:p-20 text-center">
          <div className="mb-10 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 text-primary mb-6 bg-brand-navy/50 backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <h3 className="font-serif text-3xl text-white mb-2">Lagos Flagship</h3>
            <div className="w-12 h-0.5 bg-primary mx-auto my-6"></div>
            <address className="not-italic text-white/70 font-light leading-relaxed">
              14 Adetokunbo Ademola Street<br />
              Victoria Island, Lagos<br />
              Nigeria
            </address>
            <p className="text-primary text-sm mt-4 tracking-widest uppercase font-bold">Open Daily 10am - 8pm</p>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-sm">
            <a href="#" className="flex items-center justify-center gap-3 bg-white/10 hover:bg-primary hover:text-brand-navy backdrop-blur-sm border border-white/10 text-white py-4 px-6 rounded-sm transition-all duration-300 group">
              <span className="material-symbols-outlined text-xl text-green-400 group-hover:text-brand-navy">chat</span>
              <span className="uppercase tracking-wide text-sm font-bold">Chat on WhatsApp</span>
            </a>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                {/* Simple SVG Icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.488 2h-.173zm-3.748 3.82c-1.57.068-2.39.293-2.91.493-.696.265-1.196.59-1.666 1.06-.47.47-.795.97-1.06 1.666-.2.52-.425 1.34-.493 2.91zm0 0c0-1.554.01-1.895.05-2.915.045-1.024.21-1.637.452-2.115a3.09 3.09 0 011.137-1.137c.478-.242 1.09-.407 2.115-.452 1.02-.04 1.36-.05 2.915-.05s1.895.01 2.915.05c1.024.045 1.637.21 2.115.452a3.09 3.09 0 011.137 1.137c.242.478.407 1.09.452 2.115.04 1.02.05 1.36.05 2.915s-.01 1.895-.05 2.915c-.045 1.024-.21 1.637-.452 2.115a3.09 3.09 0 01-1.137 1.137c-.478.242-1.09.407-2.115.452-1.02.04-1.36.05-2.915.05s-1.895-.01-2.915-.05c-1.024-.045-1.637-.21-2.115-.452a3.09 3.09 0 01-1.137-1.137c-.242-.478-.407-1.09-.452-2.115-.04-1.02-.05-1.36-.05-2.915zm6.062 0a1.86 1.86 0 100 3.72 1.86 1.86 0 000-3.72zm0-1.46a3.32 3.32 0 110 6.64 3.32 3.32 0 010-6.64zm4.496-2.617a.97.97 0 100 1.94.97.97 0 000-1.94z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
