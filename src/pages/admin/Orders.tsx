import React, { useState } from 'react';

const orders = [
  {
    id: '#BG-2024-045',
    customer: 'Folake Adebayo',
    email: 'folake.a@example.com',
    avatar: 'FA',
    date: 'Oct 24, 2023',
    time: '10:42 AM',
    total: '₦ 125,000',
    status: 'Pending',
    items: [
      { name: 'Lagos Loafer', size: '38', qty: 1, price: '₦ 125,000', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL' }
    ]
  },
  {
    id: '#BG-2024-044',
    customer: 'Chukwudi Okafor',
    email: 'c.okafor@gmail.com',
    avatar: 'CO',
    date: 'Oct 23, 2023',
    time: '02:15 PM',
    total: '₦ 85,000',
    status: 'Shipped',
    items: [
      { name: 'Kano Slide', size: '42', qty: 1, price: '₦ 85,000', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI' }
    ]
  },
  {
    id: '#BG-2024-043',
    customer: 'Zainab Aliyu',
    email: 'zainab.design@yahoo.com',
    avatar: 'ZA',
    date: 'Oct 22, 2023',
    time: '09:30 AM',
    total: '₦ 210,000',
    status: 'Delivered',
    items: [
      { name: 'Royal Blue Velvet Loafers', size: '42', qty: 1, price: '₦ 210,000', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO6NeLwXpilr_se4zjGUk5SieGn6vkyZf_KvAytPW1393PC_C8tk5a_8c76Ot9LUPSyVcK1IUxppMdkj6y1a5dq7FIXoWupdNwomcG5VNA3lIbINutkiaqn_WuWzEhKUvXvucsnVjusSjUfyueGZkK3KSo1z6g36yJyiYfpaiK9HIGm6J1pwUO8WdJJ9nD24BP-rLeRqJ3QIlWK5nj44eqYyxvycdka1O7PWxAS1OvyTJTdXlQR1H_y2dQk7dtVfKGlaBUDfqJaK6w' }
    ]
  },
  {
    id: '#BG-2024-042',
    customer: 'Tunde Bakare',
    email: 'tunde.bakare@outlook.com',
    avatar: 'TB',
    date: 'Oct 21, 2023',
    time: '11:15 AM',
    total: '₦ 45,000',
    status: 'Processing',
    items: [
      { name: 'Lagos Loafer', size: '40', qty: 1, price: '₦ 45,000', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL' }
    ]
  },
  {
    id: '#BG-2024-041',
    customer: 'Emeka Nwachukwu',
    email: 'emeka.n@example.com',
    avatar: 'EN',
    date: 'Oct 20, 2023',
    time: '04:45 PM',
    total: '₦ 150,000',
    status: 'Cancelled',
    items: [
      { name: 'Kano Slide', size: '43', qty: 2, price: '₦ 75,000', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI' }
    ]
  },
  {
    id: '#BG-2024-040',
    customer: 'Amara Kanu',
    email: 'amara.k@gmail.com',
    avatar: 'AK',
    date: 'Oct 19, 2023',
    time: '01:20 PM',
    total: '₦ 320,000',
    status: 'Delivered',
    items: [
      { name: 'Royal Blue Velvet Loafers', size: '39', qty: 1, price: '₦ 210,000', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO6NeLwXpilr_se4zjGUk5SieGn6vkyZf_KvAytPW1393PC_C8tk5a_8c76Ot9LUPSyVcK1IUxppMdkj6y1a5dq7FIXoWupdNwomcG5VNA3lIbINutkiaqn_WuWzEhKUvXvucsnVjusSjUfyueGZkK3KSo1z6g36yJyiYfpaiK9HIGm6J1pwUO8WdJJ9nD24BP-rLeRqJ3QIlWK5nj44eqYyxvycdka1O7PWxAS1OvyTJTdXlQR1H_y2dQk7dtVfKGlaBUDfqJaK6w' },
      { name: 'Lagos Loafer', size: '39', qty: 1, price: '₦ 110,000', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL' }
    ]
  }
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#161513] border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-slate-900 dark:text-white">Bata Ganik</span>
          </div>
          <button className="p-2 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <a href="#" className="hover:text-primary transition-colors">Dashboard</a>
                  <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                  <span className="text-slate-900 dark:text-white font-medium">Orders</span>
                </nav>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">Order Management</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                  Track and manage customer orders across all regions. Ensure timely delivery for the premium experience.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  <span>Export CSV</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Create Order</span>
                </button>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 lg:col-span-6 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 shadow-sm transition-shadow" 
                  placeholder="Search by Order #, Customer or Email..." 
                />
              </div>
              <div className="md:col-span-3 lg:col-span-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">filter_list</span>
                  </div>
                  <select className="block w-full pl-10 pr-10 py-3 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 shadow-sm appearance-none cursor-pointer">
                    <option>All Statuses</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 lg:col-span-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                  </div>
                  <select className="block w-full pl-10 pr-10 py-3 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 shadow-sm appearance-none cursor-pointer">
                    <option>Last 30 Days</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[140px]">Order #</th>
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[200px]">Customer</th>
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Total</th>
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right w-[100px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.map((order) => (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
                      >
                        <td className="p-5">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{order.id}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 text-primary-dark">
                              <span className="font-bold text-sm">{order.avatar}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{order.customer}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{order.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-slate-600 dark:text-slate-400">
                          {order.date} <span className="text-xs text-slate-400 block">{order.time}</span>
                        </td>
                        <td className="p-5 text-sm font-bold text-slate-900 dark:text-white text-right">
                          {order.total}
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            order.status === 'Pending' ? 'bg-primary/20 text-primary-dark dark:text-primary border-primary/20' :
                            order.status === 'Shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                            order.status === 'Delivered' ? 'bg-navy text-white border-navy shadow-sm' :
                            order.status === 'Processing' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600' :
                            'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-slate-900 dark:text-white">1-6</span> of <span className="font-bold text-slate-900 dark:text-white">128</span> orders</span>
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
      </div>

      {/* Preview Pane */}
      {selectedOrder && (
        <aside className="hidden 2xl:flex w-[400px] flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161513] shrink-0 overflow-y-auto transition-all">
          <div className="p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Details</h2>
                <span className="text-sm text-primary font-mono font-medium">{selectedOrder.id}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 text-primary-dark">
                <span className="font-bold text-lg">{selectedOrder.avatar}</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.customer}</p>
                <p className="text-xs text-slate-500">Lagos, Nigeria</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Order Items</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                      <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">Size {item.size} • Qty {item.qty}</p>
                      </div>
                      <p className="text-sm font-semibold text-primary">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Timeline</h3>
                <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-navy border-2 border-white dark:border-slate-900"></div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Delivered</p>
                    <p className="text-xs text-slate-500">Oct 24, 02:00 PM</p>
                  </div>
                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-white dark:border-slate-900"></div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Shipped from Lagos Hub</p>
                    <p className="text-xs text-slate-500">Oct 23, 09:12 AM</p>
                  </div>
                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900"></div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Order Placed</p>
                    <p className="text-xs text-slate-500">Oct 22, 09:30 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 mt-auto">
                <button className="w-full py-3 rounded-lg bg-navy text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-navy/20">
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
