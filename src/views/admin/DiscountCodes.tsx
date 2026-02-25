import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface DiscountCode {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minimumOrder: number | null;
    maxUses: number | null;
    usedCount: number;
    expiresAt: string | null;
    isActive: boolean;
    createdAt: string;
    _count?: { orders: number };
}

export default function DiscountCodes() {
    const [codes, setCodes] = useState<DiscountCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [form, setForm] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: '',
        minimumOrder: '',
        maxUses: '',
        expiresAt: '',
        isActive: true,
    });

    const fetchCodes = async () => {
        setLoading(true);
        try {
            const res = await api.get<{ codes: DiscountCode[] }>('/admin/discount-codes');
            setCodes(res.codes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCodes(); }, []);

    const handleDelete = async (id: string, code: string) => {
        if (!window.confirm(`Delete code "${code}"? This cannot be undone.`)) return;
        setDeleting(id);
        try {
            await api.delete(`/admin/discount-codes?id=${id}`);
            setCodes((prev) => prev.filter((c) => c.id !== id));
        } catch (err: any) {
            alert(err?.message ?? 'Delete failed');
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await api.patch(`/admin/discount-codes?id=${id}`, { isActive: !isActive });
            setCodes((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !isActive } : c));
        } catch (err: any) {
            alert(err?.message ?? 'Update failed');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.code.trim() || !form.value) { setFormError('Code and value are required.'); return; }
        setSubmitting(true);
        setFormError('');
        try {
            await api.post('/admin/discount-codes', {
                code: form.code.toUpperCase(),
                type: form.type,
                value: Number(form.value),
                minimumOrder: form.minimumOrder ? Number(form.minimumOrder) : undefined,
                maxUses: form.maxUses ? Number(form.maxUses) : undefined,
                expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
                isActive: form.isActive,
            });
            setForm({ code: '', type: 'percentage', value: '', minimumOrder: '', maxUses: '', expiresAt: '', isActive: true });
            setShowForm(false);
            fetchCodes();
        } catch (err: any) {
            setFormError(err?.message ?? 'Failed to create discount code.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Discount Codes</h1>
                        <p className="text-slate-500 dark:text-slate-400">{codes.length} codes total</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm flex items-center gap-2 w-fit transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
                        {showForm ? 'Cancel' : 'New Code'}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-8">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Create Discount Code</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Code *</label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                                    placeholder="WELCOME10"
                                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Type *</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as any }))}
                                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₦)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Value *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{form.type === 'percentage' ? '%' : '₦'}</span>
                                    <input
                                        type="number"
                                        value={form.value}
                                        onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                                        placeholder={form.type === 'percentage' ? '10' : '5000'}
                                        min="0"
                                        className="w-full pl-8 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Min. Order (₦)</label>
                                <input
                                    type="number"
                                    value={form.minimumOrder}
                                    onChange={(e) => setForm((p) => ({ ...p, minimumOrder: e.target.value }))}
                                    placeholder="Optional"
                                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Max Uses</label>
                                <input
                                    type="number"
                                    value={form.maxUses}
                                    onChange={(e) => setForm((p) => ({ ...p, maxUses: e.target.value }))}
                                    placeholder="Unlimited"
                                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Expires At</label>
                                <input
                                    type="datetime-local"
                                    value={form.expiresAt}
                                    onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
                                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                                        className="rounded text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Active (usable by customers)</span>
                                </label>
                            </div>
                            {formError && (
                                <div className="md:col-span-2 lg:col-span-3 text-red-500 text-sm">{formError}</div>
                            )}
                            <div className="md:col-span-2 lg:col-span-3 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>}
                                    {submitting ? 'Creating...' : 'Create Code'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {['Code', 'Type & Value', 'Min. Order', 'Uses', 'Expires', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {loading
                                ? [1, 2, 3].map((i) => (
                                    <tr key={i}>
                                        {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                                            <td key={j} className="px-5 py-4">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : codes.map((code) => (
                                    <tr key={code.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-5 py-4 font-mono font-bold text-sm text-slate-900 dark:text-white tracking-widest">
                                            {code.code}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                                            {code.type === 'percentage' ? `${code.value}% off` : `₦${code.value.toLocaleString()} off`}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {code.minimumOrder ? `₦${code.minimumOrder.toLocaleString()}` : '—'}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {code.usedCount}{code.maxUses ? ` / ${code.maxUses}` : ''}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {code.expiresAt
                                                ? new Date(code.expiresAt) < new Date()
                                                    ? <span className="text-red-500 font-medium">Expired</span>
                                                    : new Date(code.expiresAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit' })
                                                : 'Never'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => handleToggleActive(code.id, code.isActive)}
                                                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${code.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-800'
                                                    }`}
                                            >
                                                {code.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => handleDelete(code.id, code.code)}
                                                disabled={deleting === code.id}
                                                className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-base">
                                                    {deleting === code.id ? 'progress_activity' : 'delete'}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {!loading && codes.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">discount</span>
                            <p className="text-slate-500">No discount codes yet. Create your first one above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
