import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, formatNGN } from '../../lib/api';

interface Stats {
  revenue: { total: number; change: number };
  orders: { total: number; change: number; pending: number };
  products: { total: number; lowStock: number };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    guestFirstName: string;
    guestLastName: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }>;
  revenueByMonth: Array<{ name: string; value: number }>;
}

const STATUS_COLOURS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

function StatSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Stats>('/admin/stats')
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
      {
        label: 'Total Revenue',
        value: formatNGN(stats.revenue.total),
        change: stats.revenue.change,
        icon: 'payments',
        color: 'text-primary',
        bg: 'bg-primary/10',
      },
      {
        label: 'Total Orders',
        value: stats.orders.total.toLocaleString(),
        change: stats.orders.change,
        icon: 'shopping_bag',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        sub: `${stats.orders.pending} pending`,
      },
      {
        label: 'Active Products',
        value: stats.products.total.toLocaleString(),
        icon: 'inventory_2',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        sub: stats.products.lowStock > 0 ? `${stats.products.lowStock} low stock` : 'All stocked',
      },
    ]
    : [];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
          </div>
          <Link
            to="/admin/products/new"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm transition-colors flex items-center gap-2 w-fit"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Product
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [1, 2, 3].map((i) => <StatSkeleton key={i} />)
            : statCards.map((card) => (
              <div key={card.label} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</h3>
                  </div>
                  <div className={`p-3 ${card.bg} rounded-lg ${card.color}`}>
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {card.change !== undefined && (
                    <span className={`font-bold flex items-center ${card.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      <span className="material-symbols-outlined text-sm">
                        {card.change >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      {Math.abs(card.change)}%
                    </span>
                  )}
                  <span className="text-slate-400">{card.change !== undefined ? 'vs last month' : card.sub}</span>
                  {card.change !== undefined && card.sub && (
                    <span className="text-slate-400">· {card.sub}</span>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Revenue Chart + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue (6 months)</h2>
            {loading ? (
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={stats?.revenueByMonth ?? []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatNGN(v)} />
                  <Area type="monotone" dataKey="value" stroke="#c9a96e" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Low Stock Alert */}
          {stats && stats.products.lowStock > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-orange-500">warning</span>
                <h2 className="text-base font-bold text-orange-800 dark:text-orange-200">Low Stock Alert</h2>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {stats.products.lowStock} product variant{stats.products.lowStock > 1 ? 's' : ''} running low on stock.
              </p>
              <Link
                to="/admin/products?stock=low"
                className="mt-4 inline-block text-sm font-bold text-orange-600 dark:text-orange-400 underline"
              >
                View affected products →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['Order', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading
                  ? [1, 2, 3].map((i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                  : (stats?.recentOrders ?? []).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {order.guestFirstName} {order.guestLastName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {formatNGN(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${STATUS_COLOURS[order.status] ?? 'bg-slate-100 text-slate-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
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
