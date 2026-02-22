import React from 'react';
import { Link } from 'react-router-dom';

export default function AddProduct() {
  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
              <Link to="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <Link to="/admin/products" className="hover:text-primary transition-colors">Products</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-slate-900 dark:text-white font-medium">Add New</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">New Product Listing</h1>
            <p className="text-slate-500 dark:text-slate-400">Create a new luxury footwear listing for the Bata Ganik collection.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 h-10 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Save Draft
            </button>
            <button className="px-5 h-10 rounded-lg text-sm font-bold text-white bg-primary hover:bg-[#b09055] transition-colors shadow-sm shadow-primary/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">publish</span>
              Publish Product
            </button>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visuals & Story (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Media Uploader */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Product Media</h3>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Cover Image</span>
              </div>
              {/* Dropzone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-6">
                <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-2xl">add_photo_alternate</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
              {/* Grid Preview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 cursor-grab active:cursor-grabbing group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsue-jm9rOgtNW040FtgnmikpnpAyGuEObCVHHtVVEa1is4SXpOxbUtB8jAppvq_sn4mbd89FBmt-Rw8Z84Db9dWfMVl5q-hRdsJoOToBOsx4lzEwX9lU4hBJ4LN3sSSHQvvMok8LyGTQgFi14qRQDf1gVEwCe25d9Z0WSM_DXoH0TmG8UpOgmM3DbVph2h6Y5_6AdxT24GYNYy6Mb4G65bukFCMcbghTirW1fRLFL0NG1bpJRNV4cIFAirjbf8QozXKHswMw13HZ" alt="Blue leather shoe detail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm cursor-pointer hover:bg-red-50 hover:text-red-500 text-slate-400">
                    <span className="material-symbols-outlined text-sm block">close</span>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-primary/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Main</div>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnD0Uv7djQbxEmSYYzaBOKcwG4XFCLEcOxr5mGaRBBQ_bKg3F-d0FcWGXIcyPrG4GNfh6ziCVLzoadkBYEF5qGhncNbxIN3CF79E6suiQFaSZSz4A01WVabC5BwLTBM1u6dt-_dHNwzBt1RVAOhD6aO5NozGno0zGjW-GGKbcpoA1jWTkhPiv64Rj4cOGredJnpUQjuKBDXO6jntZ2tDQE9H0B9TyDBqkAQ2WRfn19tVOoLwCY5WX44NFbdM1o5MFjxp3aHpYa6YBD" alt="Leather texture closeup" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm cursor-pointer hover:bg-red-50 hover:text-red-500 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm block">close</span>
                  </div>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUWlJNuO2OMpkTm5StP10PecTvsHGK-oFbg_Ttlfgb2nrkAPodViLI5WWvk9MFQutVG_XpNPUBlvgnjlRd3MiQrdXIf2mOqSJ5iAktg0BC_chQqd2gZZ5iLk15Ct9MARDWEHpTZJIEyQixYUGcy4Yg5CkcukTX9OhLULFQ7GKKaxpEWYpg1H6qSWHQ4On7fOy6yvjNvMW5n2INtFWz6_e7vya0I57RnzBPdsr7mC0Zk-ENulSU1sV1B9CTOV5nFBPrOz9Eo0ad0SgX" alt="Shoe sole detail" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm cursor-pointer hover:bg-red-50 hover:text-red-500 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm block">close</span>
                  </div>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-500">add</span>
                </div>
              </div>
            </div>

            {/* Cultural Story Section (Brand Heritage) */}
            <div className="bg-[#faf9f6] dark:bg-[#1a1814] border border-[#e8e6e1] dark:border-[#333] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-9xl text-primary">history_edu</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  <h3 className="font-bold text-[#4a453e] dark:text-[#d4cfc5] text-lg">Cultural Story</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Every Bata Ganik piece tells a story. Describe the Nigerian heritage, craftsmanship, or inspiration behind this design. This will appear on the product page.
                </p>
                <label className="block">
                  <span className="sr-only">Heritage Story</span>
                  <textarea 
                    className="w-full rounded-lg bg-white dark:bg-black border-transparent focus:border-primary focus:ring-0 shadow-sm placeholder:text-slate-400 text-slate-700 dark:text-slate-300 text-sm leading-relaxed p-4 resize-none" 
                    placeholder="E.g., Inspired by the vibrant patterns of the Yoruba talking drum..." 
                    rows={6}
                  ></textarea>
                </label>
              </div>
            </div>

            {/* Organization Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Organization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Collection</label>
                  <div className="relative">
                    <select className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary">
                      <option>Lagos Luxury</option>
                      <option>Savannah Edit</option>
                      <option>Royal Heritage</option>
                      <option>Urban Nomad</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Vendor</label>
                  <input type="text" value="Bata Ganik Atelier" readOnly className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags</label>
                  <input type="text" placeholder="Leather, Handmade, Formal..." className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Data (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* General Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">General Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Product Name</label>
                  <input type="text" placeholder="e.g. The Oba Loafer" className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-medium focus:ring-primary focus:border-primary placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Description</label>
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-white dark:bg-slate-800">
                    {/* Fake Rich Text Toolbar */}
                    <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center gap-1">
                      <button type="button" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                      <button type="button" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                      <button type="button" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[18px]">format_underlined</span></button>
                      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                      <button type="button" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                      <button type="button" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
                      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                      <button type="button" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[18px]">link</span></button>
                    </div>
                    <textarea rows={5} placeholder="Describe the product specifics, materials used, and care instructions..." className="w-full border-none p-4 text-sm text-slate-700 dark:text-slate-300 focus:ring-0 resize-none bg-transparent"></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Base Price (NGN)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm">₦</span>
                    </div>
                    <input type="number" placeholder="0.00" className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Compare at Price <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm">₦</span>
                    </div>
                    <input type="number" placeholder="0.00" className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">SKU (Stock Keeping Unit)</label>
                  <input type="text" placeholder="BG-2024-001" className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Barcode / ISBN <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                  <input type="text" className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Track quantity</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Continue selling when out of stock</span>
                </label>
              </div>
            </div>

            {/* Variants (Sizes) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Size Variants</h3>
                <button type="button" className="text-sm text-primary font-bold hover:text-[#b09055] transition-colors">
                  + Add Size
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Size (EU)</th>
                      <th className="px-4 py-3">Price Modifier</th>
                      <th className="px-4 py-3">Stock Qty</th>
                      <th className="px-4 py-3 rounded-r-lg w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg">drag_indicator</span>
                          EU 40
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">—</td>
                      <td className="px-4 py-3">
                        <input type="number" defaultValue={12} className="w-20 py-1 px-2 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg">drag_indicator</span>
                          EU 41
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">—</td>
                      <td className="px-4 py-3">
                        <input type="number" defaultValue={8} className="w-20 py-1 px-2 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg">drag_indicator</span>
                          EU 42
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">—</td>
                      <td className="px-4 py-3">
                        <input type="number" defaultValue={5} className="w-20 py-1 px-2 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg">drag_indicator</span>
                          EU 43
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">—</td>
                      <td className="px-4 py-3">
                        <input type="number" defaultValue={0} className="w-20 py-1 px-2 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
