import React, { useEffect, useState } from 'react';
import { api, formatNGN } from '../../lib/api';

interface Customer {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    ordersCount: number;
    totalSpend: number;
    createdAt: string;
}

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: '20',
                ...(search ? { search } : {}),
            });
            const res = await api.get<{ customers: Customer[]; pagination: { total: number } }>(
                `/admin/customers?${params}`
            );
            setCustomers(res.customers);
            setTotal(res.pagination.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, [search, page]);

    const totalPages = Math.ceil(total / 20);

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Customers</h1>
                        <p className="text-slate-500 dark:text-slate-400">{total} registered customers</p>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-sm">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name or email..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {['Customer', 'Email', 'Phone', 'Orders', 'Lifetime Spend', 'Joined'].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {loading
                                ? [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        {[1, 2, 3, 4, 5, 6].map((j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                    {(customer.firstName?.[0] ?? customer.email[0]).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {customer.firstName} {customer.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{customer.email}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{customer.phone ?? '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                                {customer.ordersCount} order{customer.ordersCount !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                            {customer.totalSpend > 0 ? formatNGN(customer.totalSpend) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(customer.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {!loading && customers.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">group</span>
                            <p className="text-slate-500 font-medium">No customers found.</p>
                            {search && (
                                <button onClick={() => setSearch('')} className="mt-2 text-primary underline text-sm">
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-9 h-9 rounded text-sm font-medium transition-colors ${p === page
                                    ? 'bg-primary text-white'
                                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
