import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Account() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'orders', label: 'My Orders', icon: 'shopping_bag' },
    { id: 'wishlist', label: 'Wishlist', icon: 'favorite' },
    { id: 'addresses', label: 'Addresses', icon: 'location_on' },
    { id: 'profile', label: 'Profile Details', icon: 'person' },
  ];

  return (
    <div className="bg-stone-50 dark:bg-stone-900 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm p-6 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">Welcome Back</p>
              <h3 className="font-serif text-lg text-stone-900 dark:text-white">Ade Olatunji</h3>
            </div>
          </div>

          <nav className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                  activeTab === item.id
                    ? 'border-primary bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-white'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-4 px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l-4 border-transparent">
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </nav>

          <div className="mt-8 bg-white dark:bg-stone-800 p-6 rounded-lg shadow-sm">
            <h4 className="font-serif text-lg text-stone-900 dark:text-white mb-2">Concierge Service</h4>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">Need assistance with your bespoke order?</p>
            <button className="text-primary text-sm font-bold underline">Contact Support</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-2">Hello, Ade.</h1>
            <p className="text-stone-500 dark:text-stone-400">It's good to see you again. Here is what's happening with your account today.</p>
          </div>

          {/* Latest Purchase */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <h2 className="font-serif text-2xl text-stone-900 dark:text-white">Latest Purchase</h2>
              <Link to="/orders" className="text-primary text-sm hover:underline flex items-center gap-1">
                View all orders <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 h-64 md:h-auto relative bg-stone-100">
                <span className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider z-10">Shipped</span>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e" alt="Shoe" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-stone-500 uppercase tracking-wider">Order #BG-2024-892</span>
                    <span className="font-serif text-xl text-primary">$450.00</span>
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-white mb-1">The Lagos Velvet Loafer</h3>
                  <p className="text-sm text-stone-500 mb-6">Size 42 • Obsidian Black</p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-100 dark:border-stone-700">
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 text-sm">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    Arriving Tuesday, Oct 24
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none py-2 px-4 border border-stone-200 dark:border-stone-600 rounded text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">Invoice</button>
                    <button className="flex-1 md:flex-none py-2 px-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors">Track Package</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Currently Coveting */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <h2 className="font-serif text-2xl text-stone-900 dark:text-white">Currently Coveting</h2>
              <Link to="/wishlist" className="text-primary text-sm hover:underline flex items-center gap-1">
                View wishlist <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Item 1 */}
              <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden group">
                <div className="relative aspect-square bg-stone-100 dark:bg-stone-900">
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm fill-current">favorite</span>
                  </button>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm67IA7RXIA_V5-P7yQtms_Ujf1RHkfqLCnJPbDpssajbPh1Nz_CgkDOo2uSoTORdHg89ewHnUnzciVxRv18fiiXclQVM9f8aZysQh9C-BBXELW8j-Kx9OEfHMvc2K423RG9L7xKtWXM98lG3uosVEM-Qy2BNz84uU-bhSBk6xVNIwFP2m2n46SP_at-b1PBkRZPjU5l8yvg8Ogd6FIfUPhXzNvQiTAR4H-eTn1cCXwHNVh9Jfg1GaPBxB7D-fGh50EV_5SiXOO5HH" alt="Shoe" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-lg text-stone-900 dark:text-white">The Abuja Slide</h3>
                    <span className="text-primary font-bold">$320</span>
                  </div>
                  <p className="text-xs text-stone-500">Hand-woven Leather</p>
                </div>
              </div>
              {/* Item 2 */}
              <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden group">
                <div className="relative aspect-square bg-stone-100 dark:bg-stone-900">
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm fill-current">favorite</span>
                  </button>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL" alt="Shoe" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-lg text-stone-900 dark:text-white">Royal Kano Boot</h3>
                    <span className="text-primary font-bold">$580</span>
                  </div>
                  <p className="text-xs text-stone-500">Indigo Suede</p>
                </div>
              </div>
              {/* Item 3 */}
              <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden group">
                <div className="relative aspect-square bg-stone-100 dark:bg-stone-900">
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm fill-current">favorite</span>
                  </button>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwtfk-IFmxMcdoWd4KP_fdk54u5SIh60BH8qcSRRyOUia2EgmZvtMSYpShek4Y5U3PeRhMy4IaC-X3cm3lUp0LOLLWrDRYrmKX15cXurho9FG9k0O3dozUNDi1qdRfQrs0s0e5ELnrt8hWU2dRIcxLjJjEoOCNLxJPYIHZDVKa6exd1pOcznSGwjwz6LMlRBI24HH8MCXmm39vAFBY98yCTEbDV9-fuzO0ZUz6GzPC9JAwPY3DvPG8qFYbPvQfoA2K_0VSiWAKw1Ze" alt="Shoe" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-lg text-stone-900 dark:text-white">Lekki Trainer</h3>
                    <span className="text-primary font-bold">$395</span>
                  </div>
                  <p className="text-xs text-stone-500">Calfskin & Mesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Shipping */}
            <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">home</span>
                  <h3 className="font-serif text-lg text-stone-900 dark:text-white">Default Shipping</h3>
                </div>
                <button className="text-primary text-sm font-medium hover:underline">Edit</button>
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed pl-8">
                <p className="font-medium text-stone-900 dark:text-white">Ade Olatunji</p>
                <p>14 Victoria Island Blvd</p>
                <p>Lagos, 101241</p>
                <p>Nigeria</p>
              </div>
            </div>

            {/* Default Payment */}
            <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">credit_card</span>
                  <h3 className="font-serif text-lg text-stone-900 dark:text-white">Default Payment</h3>
                </div>
                <button className="text-primary text-sm font-medium hover:underline">Manage</button>
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed pl-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded text-xs font-bold text-stone-600 dark:text-stone-300">VISA</span>
                  <span className="font-mono">•••• 4242</span>
                </div>
                <p>Expires 12/26</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
