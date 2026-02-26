import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { api, formatNGN } from '../../lib/api';

interface AnalyticsData {
    kpis: { revenue: number; orders: number; avgOrderValue: number; customers: number };
    revenueByMonth: { name: string; value: number }[];
    topProducts: { name: string; revenue: number; units: number }[];
    ordersByStatus: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: '#f59e0b',
    PROCESSING: '#3b82f6',
    SHIPPED: '#6366f1',
    DELIVERED: '#22c55e',
    CANCELLED: '#ef4444',
};

const BAR_COLORS = ['#c9a96e', '#a0774e', '#3B1F0A', '#C19A6B', '#4A0000'];

const KPI_ICONS = [
    { icon: 'payments', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: 'shopping_bag', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: 'receipt', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: 'group', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

function KpiSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </div>
    );
}

function ChartSkeleton() {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />;
}

export default function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get<AnalyticsData>('/admin/analytics')
            .then(setData)
            .catch((e) => setError(e.message ?? 'Failed to load analytics'))
            .finally(() => setLoading(false));
    }, []);

    const kpiCards = data ? [
        { label: 'Total Revenue', value: formatNGN(data.kpis.revenue) },
        { label: 'Total Orders', value: data.kpis.orders.toLocaleString() },
        { label: 'Avg. Order Value', value: formatNGN(data.kpis.avgOrderValue) },
        { label: 'Registered Customers', value: data.kpis.customers.toLocaleString() },
    ] : [];

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">A full breakdown of your store performance.</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {loading
                        ? [1, 2, 3, 4].map((i) => <KpiSkeleton key={i} />)
                        : kpiCards.map((card, i) => (
                            <div key={card.label} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                                    <div className={`p-3 ${KPI_ICONS[i].bg} rounded-lg ${KPI_ICONS[i].color}`}>
                                        <span className="material-symbols-outlined">{KPI_ICONS[i].icon}</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
                            </div>
                        ))
                    }
                </div>

                {/* Revenue Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Over Time</h2>
                    {loading ? <ChartSkeleton /> : (
                        data?.revenueByMonth.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                                No paid orders yet — data will appear once payments come in.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={data?.revenueByMonth ?? []}>
                                    <defs>
                                        <linearGradient id="grad_rev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v: any) => formatNGN(Number(v))} />
                                    <Area type="monotone" dataKey="value" stroke="#c9a96e" strokeWidth={2} fill="url(#grad_rev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Products by Revenue</h2>
                        {loading ? <ChartSkeleton /> : (
                            data?.topProducts.length === 0 ? (
                                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No sales data yet.</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={data?.topProducts ?? []} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                                        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                        <Tooltip formatter={(v: any) => formatNGN(Number(v))} />
                                        <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                                            {(data?.topProducts ?? []).map((_, i) => (
                                                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )
                        )}
                    </div>

                    {/* Orders by Status */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Orders by Status</h2>
                        {loading ? <ChartSkeleton /> : (
                            data?.ordersByStatus.length === 0 ? (
                                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No orders yet.</div>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={data?.ordersByStatus ?? []}
                                                dataKey="count"
                                                nameKey="status"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                innerRadius={50}
                                            >
                                                {(data?.ordersByStatus ?? []).map((entry, i) => (
                                                    <Cell key={i} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v: any) => [v, '']} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                                        {(data?.ordersByStatus ?? []).map((s) => (
                                            <div key={s.status} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[s.status] ?? '#94a3b8' }} />
                                                {s.status} ({s.count})
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
