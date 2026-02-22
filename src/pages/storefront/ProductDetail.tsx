import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState('Savannah Brown');
  const [selectedSize, setSelectedSize] = useState('42');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('craft');

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const productImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDm67IA7RXIA_V5-P7yQtms_Ujf1RHkfqLCnJPbDpssajbPh1Nz_CgkDOo2uSoTORdHg89ewHnUnzciVxRv18fiiXclQVM9f8aZysQh9C-BBXELW8j-Kx9OEfHMvc2K423RG9L7xKtWXM98lG3uosVEM-Qy2BNz84uU-bhSBk6xVNIwFP2m2n46SP_at-b1PBkRZPjU5l8yvg8Ogd6FIfUPhXzNvQiTAR4H-eTn1cCXwHNVh9Jfg1GaPBxB7D-fGh50EV_5SiXOO5HH",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDLAZ9DBK_hLhaH6sFtISFBhFor2KcOuY9OzNl1LatqNEiWI_nrjlhdAOv0Lu1qQ46AXovsjCgLFvMvOcyVR_ODhEGdTkw962UiY7T4UqfdMomXwVzLHMGXmSTa1tQLjLvOugGps4317V6wEeDEF6HolHs9EvhV2gdgg6qy1zmWKf-C_sFvkpdKiBAKdKIdmq77uDgAbjRH3huApmxGG3l9QXwaF3A8C3ByYS6vk4tGPwvOZxRDca2DBM3TzS7_09-XbT-znkO-ZEIg"
  ];

  const [mainImage, setMainImage] = useState(productImages[0]);

  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/collections" className="hover:text-primary">Men</Link>
        <span className="mx-2">/</span>
        <span className="hover:text-primary cursor-pointer">Oxfords</span>
        <span className="mx-2">/</span>
        <span className="text-stone-900 dark:text-white font-bold">The Oba Oxford</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery Section */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible hide-scroll">
            {productImages.map((img, index) => (
              <button 
                key={index}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border-2 ${mainImage === img ? 'border-primary' : 'border-transparent'} rounded-sm overflow-hidden`}
              >
                <img src={img} alt={`Product view ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 bg-stone-100 dark:bg-stone-900 rounded-lg overflow-hidden relative group">
            <span className="absolute top-4 right-4 bg-white dark:bg-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10">New Arrival</span>
            <img src={mainImage} alt="The Oba Oxford" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="lg:col-span-5 pt-4">
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-2">The Oba Oxford</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">Handcrafted in Lagos. Defining modern African elegance.</p>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-bold text-primary">₦ 120,000</span>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">In Stock</span>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest block mb-3">Select Color</span>
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedColor('Savannah Brown')}
                className={`w-8 h-8 rounded-full bg-[#8B5A2B] ring-2 ring-offset-2 ${selectedColor === 'Savannah Brown' ? 'ring-primary' : 'ring-transparent'}`}
                title="Savannah Brown"
              ></button>
              <button 
                onClick={() => setSelectedColor('Obsidian Black')}
                className={`w-8 h-8 rounded-full bg-[#1a1a1a] ring-2 ring-offset-2 ${selectedColor === 'Obsidian Black' ? 'ring-primary' : 'ring-transparent'}`}
                title="Obsidian Black"
              ></button>
              <button 
                onClick={() => setSelectedColor('Sahara Taupe')}
                className={`w-8 h-8 rounded-full bg-[#A89F91] ring-2 ring-offset-2 ${selectedColor === 'Sahara Taupe' ? 'ring-primary' : 'ring-transparent'}`}
                title="Sahara Taupe"
              ></button>
            </div>
            <p className="text-xs text-stone-500 mt-2">Color: <span className="text-stone-900 dark:text-white font-medium">{selectedColor}</span></p>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest">Select Size (EU)</span>
              <button className="text-xs text-primary underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {['40', '41', '42', '43', '44', '45'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border ${selectedSize === size ? 'border-primary bg-primary text-white' : 'border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white hover:border-primary'} rounded-sm text-sm font-medium transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button className="w-full bg-[#c9a96e] hover:bg-[#b89a5f] text-white font-bold py-4 rounded-sm shadow-lg mb-4 flex items-center justify-center gap-2 transition-all">
            <span className="material-symbols-outlined">shopping_bag</span>
            Add to Cart - ₦ 120,000
          </button>
          
          <div className="flex items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400 mb-10">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">local_shipping</span> Free shipping within Lagos</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">verified</span> Authenticity Guaranteed</span>
          </div>

          {/* Accordions */}
          <div className="border-t border-stone-200 dark:border-stone-800">
            {/* The Craft */}
            <div className="border-b border-stone-200 dark:border-stone-800">
              <button 
                onClick={() => toggleAccordion('craft')}
                className="w-full py-4 flex justify-between items-center text-left"
              >
                <span className="font-medium text-stone-900 dark:text-white">The Craft</span>
                <span className="material-symbols-outlined text-stone-400 transition-transform duration-300" style={{ transform: activeAccordion === 'craft' ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'craft' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Constructed from full-grain Italian leather sourced ethically and dyed using traditional methods. The Oba Oxford features a Goodyear-welted sole for durability and comfort, hand-stitched by master artisans in our Lagos workshop. The interior is lined with soft calfskin to ensure breathability.
                </p>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="border-b border-stone-200 dark:border-stone-800">
              <button 
                onClick={() => toggleAccordion('care')}
                className="w-full py-4 flex justify-between items-center text-left"
              >
                <span className="font-medium text-stone-900 dark:text-white">Care Instructions</span>
                <span className="material-symbols-outlined text-stone-400 transition-transform duration-300" style={{ transform: activeAccordion === 'care' ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'care' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Clean with a soft, dry cloth. Use a high-quality leather conditioner every few months to maintain suppleness. Avoid direct sunlight and moisture. Store in the provided dust bag when not in use.
                </p>
              </div>
            </div>

            {/* Delivery & Returns */}
            <div className="border-b border-stone-200 dark:border-stone-800">
              <button 
                onClick={() => toggleAccordion('delivery')}
                className="w-full py-4 flex justify-between items-center text-left"
              >
                <span className="font-medium text-stone-900 dark:text-white">Delivery & Returns</span>
                <span className="material-symbols-outlined text-stone-400 transition-transform duration-300" style={{ transform: activeAccordion === 'delivery' ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'delivery' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Free delivery within Lagos (1-2 business days). Nationwide delivery (3-5 business days). International shipping available. Returns accepted within 14 days of purchase in original condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white">Complete the Look</h2>
          <Link to="/collections" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            View Collection <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div className="group">
            <div className="aspect-square bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden mb-4 relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI" alt="Belt" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="font-serif text-lg text-stone-900 dark:text-white">The Heritage Belt</h3>
            <p className="text-xs text-stone-500 mb-2">Full Grain Leather</p>
            <p className="text-primary font-bold">₦ 25,000</p>
          </div>
          {/* Item 2 */}
          <div className="group">
            <div className="aspect-square bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden mb-4 relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwtfk-IFmxMcdoWd4KP_fdk54u5SIh60BH8qcSRRyOUia2EgmZvtMSYpShek4Y5U3PeRhMy4IaC-X3cm3lUp0LOLLWrDRYrmKX15cXurho9FG9k0O3dozUNDi1qdRfQrs0s0e5ELnrt8hWU2dRIcxLjJjEoOCNLxJPYIHZDVKa6exd1pOcznSGwjwz6LMlRBI24HH8MCXmm39vAFBY98yCTEbDV9-fuzO0ZUz6GzPC9JAwPY3DvPG8qFYbPvQfoA2K_0VSiWAKw1Ze" alt="Bag" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="font-serif text-lg text-stone-900 dark:text-white">The Weekender</h3>
            <p className="text-xs text-stone-500 mb-2">Hand-stitched Duffle</p>
            <p className="text-primary font-bold">₦ 185,000</p>
          </div>
          {/* Item 3 */}
          <div className="group">
            <div className="aspect-square bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden mb-4 relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL" alt="Loafer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="font-serif text-lg text-stone-900 dark:text-white">The Azure Loafer</h3>
            <p className="text-xs text-stone-500 mb-2">Premium Suede</p>
            <p className="text-primary font-bold">₦ 95,000</p>
          </div>
          {/* Item 4 */}
          <div className="group">
            <div className="aspect-square bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden mb-4 relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuACnQ8n3h1Ag-TIge3HgbK8YMOjakdNLbnsG5hN1mcO4dug8dOgSriVeXyLmsIaQMJTeZK34-PSEfmH9lrM4180Jiix_S_4oYTq-5fKwGRbNDmb6x7LOLevBJRqWbVhXSRkxbFwjtvPKZENNabIjp3LfINtAzVmRTNvtO7yDnOqqtX2hzGI7mwZQjQt2e8x_m3dgAQx4ov2yNf_7XdwZIOLh1WZR2T0rDdvzPd0yZ8tKrE_9n8I_k3D3s6UoTGdoYL4XmCMF1e796WW" alt="Care Kit" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="font-serif text-lg text-stone-900 dark:text-white">Shoe Care Kit</h3>
            <p className="text-xs text-stone-500 mb-2">Complete Set</p>
            <p className="text-primary font-bold">₦ 15,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
