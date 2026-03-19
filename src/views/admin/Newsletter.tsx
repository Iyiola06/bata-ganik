import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Subscriber {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

export default function Newsletter() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<{ subscribers: Subscriber[] }>('/admin/newsletter')
            .then(res => setSubscribers(res.subscribers))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = async (id: string, current: boolean) => {
        try {
            await api.patch(`/admin/newsletter/${id}`, { isActive: !current });
            setSubscribers(prev => prev.map(s => s.id === id ? { ...s, isActive: !current } : s));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Newsletter Subscribers</h1>
                        <p className="text-slate-500 dark:text-slate-400">View and manage your marketing list.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined At</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={4} className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/4" /></td>
                                        </tr>
                                    ))
                                ) : subscribers.length > 0 ? (
                                    subscribers.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{s.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {s.isActive ? 'Active' : 'Unsubscribed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {new Date(s.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => toggleStatus(s.id, s.isActive)}
                                                    className="text-xs text-primary font-bold hover:underline"
                                                >
                                                    {s.isActive ? 'Disable' : 'Enable'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">No subscribers found yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
