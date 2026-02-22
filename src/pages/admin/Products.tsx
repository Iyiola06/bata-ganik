import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 'BG-KN-004',
    name: 'The Kano Loafer',
    collection: 'Northern Heritage',
    stock: 124,
    variants: 2,
    price: '₦125,000',
    status: 'In Stock',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI'
  },
  {
    id: 'BG-LG-082',
    name: 'Lagos Mule',
    collection: 'Eko Vibes',
    stock: 8,
    variants: 1,
    price: '₦85,000',
    status: 'Low Stock',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e'
  },
  {
    id: 'BG-OW-102',
    name: 'Owu Crown Sandal',
    collection: 'Royal Edit',
    stock: 56,
    variants: 4,
    price: '₦145,000',
    status: 'In Stock',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL'
  },
  {
    id: 'BG-ZR-009',
    name: 'Zaria Boot',
    collection: 'Harmattan',
    stock: 0,
    variants: 1,
    price: '₦190,000',
    status: 'Out of Stock',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI'
  },
  {
    id: 'BG-IB-221',
    name: 'Ibadan Derby',
    collection: 'Heritage',
    stock: 32,
    variants: 3,
    price: '₦110,000',
    status: 'In Stock',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw'
  }
];

export default function Products() {
  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
              <Link to="/admin" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-slate-900 dark:text-white font-medium">Products</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Product Management</h1>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 rounded-lg bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 relative text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link to="/admin/products/new" className="px-4 py-2 bg-brand-navy hover:bg-brand-navy-light text-white font-bold rounded-lg text-sm transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Add New Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12%</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">1,248</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Products</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Action Needed</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">28</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock Items</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                <span className="material-symbols-outlined">category</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">12</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Collections</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                <span className="material-symbols-outlined">visibility</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">8.5k</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Product Views</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search products by name, SKU or tag..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-none ring-1 ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
               <button className="w-full md:w-auto flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                 <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">filter_list</span> Collection</span>
                 <span className="material-symbols-outlined text-[18px]">expand_more</span>
               </button>
            </div>
            <div className="relative flex-1 md:flex-none">
               <button className="w-full md:w-auto flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                 <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">inventory</span> Stock Status</span>
                 <span className="material-symbols-outlined text-[18px]">expand_more</span>
               </button>
            </div>
            <button className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-5 w-10">
                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Details</th>
                  <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Collection</th>
                  <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inventory</th>
                  <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-5">
                      <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                          <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-slate-500">SKU: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {product.collection}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                          {product.stock} in stock
                        </span>
                        <span className="text-xs text-slate-500">{product.variants} variants</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{product.price}</span>
                        <span className="text-xs text-slate-500">$85.00</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        product.status === 'In Stock' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' :
                        product.status === 'Low Stock' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          product.status === 'In Stock' ? 'bg-emerald-500' :
                          product.status === 'Low Stock' ? 'bg-amber-500' :
                          'bg-slate-400'
                        }`}></span>
                        {product.status === 'In Stock' ? 'In Stock' : product.status === 'Low Stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-slate-900 dark:text-white">1-5</span> of <span className="font-bold text-slate-900 dark:text-white">1,248</span> products</span>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
