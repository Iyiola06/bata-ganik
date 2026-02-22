import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 7500 },
];

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                className="pl-10 pr-4 py-2 rounded-lg border-none ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="p-2 rounded-lg bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 relative text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
            </button>
            <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              New Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₦12,450,000</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-500 font-bold flex items-center">
                <span className="material-symbols-outlined text-sm">trending_up</span> 12%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">145</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">shopping_bag</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-500 font-bold flex items-center">
                <span className="material-symbols-outlined text-sm">trending_up</span> 5%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Products</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">32</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-amber-500 font-bold flex items-center">
                <span className="material-symbols-outlined text-sm">trending_flat</span> 2%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Analytics</h3>
                <p className="text-sm text-slate-500">Monthly sales performance</p>
              </div>
              <select className="text-sm border-none bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-1 text-slate-600 dark:text-slate-300 font-medium cursor-pointer focus:ring-0">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c9a96e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    cursor={{stroke: '#c9a96e', strokeWidth: 1, strokeDasharray: '4 4'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#c9a96e" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-red-500">warning</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Low Stock Alerts</h3>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Kano Slide - Size 42', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI', stock: 2 },
                { name: 'Ibadan Runner - Black', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e', stock: 5 },
                { name: 'Lekki Pump - Size 38', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL', stock: 3 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500">Footwear</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">{item.stock} left</span>
                    <button className="text-xs text-primary hover:underline">Restock</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h3>
            <button className="text-sm text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { id: '#ORD-2024', product: 'Lagos Loafer', customer: 'Adeola Ojo', amount: '₦125,000', status: 'Shipped', statusColor: 'bg-emerald-100 text-emerald-700' },
                  { id: '#ORD-2023', product: 'Kano Slide', customer: 'Emeka Okafor', amount: '₦45,000', status: 'Processing', statusColor: 'bg-amber-100 text-amber-700' },
                  { id: '#ORD-2022', product: 'Abuja Boot', customer: 'Sarah', amount: '₦95,000', status: 'Delivered', statusColor: 'bg-blue-100 text-blue-700' },
                ].map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-200"></div>
                      {order.product}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.customer}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
