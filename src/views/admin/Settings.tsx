import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';

interface ToggleSetting {
    id: string;
    label: string;
    description: string;
    defaultValue: boolean;
}

interface AdminInvite {
    id: string;
    email: string;
    role: 'admin' | 'super_admin';
    expiresAt: string;
    usedAt: string | null;
    revokedAt: string | null;
    createdAt: string;
}

const NOTIFICATION_SETTINGS: ToggleSetting[] = [
    { id: 'notify_new_order', label: 'New Order Alerts', description: 'Get notified when a new order is placed.', defaultValue: true },
    { id: 'notify_low_stock', label: 'Low Stock Warnings', description: 'Alert when a product variant drops below 5 units.', defaultValue: true },
    { id: 'notify_new_customer', label: 'New Customer Sign-ups', description: 'Get notified when a new customer registers.', defaultValue: false },
    { id: 'notify_discount_use', label: 'Discount Code Usage', description: 'Alert when a discount code is redeemed.', defaultValue: false },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
        </div>
    );
}

function inviteStatus(invite: AdminInvite) {
    if (invite.revokedAt) return 'Revoked'
    if (invite.usedAt) return 'Used'
    if (new Date(invite.expiresAt).getTime() <= Date.now()) return 'Expired'
    return 'Active'
}

export default function Settings() {
    const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
        const saved: Record<string, boolean> = {};
        NOTIFICATION_SETTINGS.forEach((s) => {
            const stored = typeof window !== 'undefined' ? localStorage.getItem(s.id) : null;
            saved[s.id] = stored !== null ? stored === 'true' : s.defaultValue;
        });
        return saved;
    });

    const [role, setRole] = useState<string | null>(null);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [invites, setInvites] = useState<AdminInvite[]>([]);
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');
    const [inviteUrl, setInviteUrl] = useState('');
    const [creatingInvite, setCreatingInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'super_admin'>('admin');
    const [expiresInHours, setExpiresInHours] = useState('72');
    const [revokingId, setRevokingId] = useState<string | null>(null);

    const isSuperAdmin = role === 'super_admin';

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            const currentRole = data.user?.app_metadata?.role;
            setRole(typeof currentRole === 'string' ? currentRole : null);
        });
    }, []);

    const loadInvites = async () => {
        if (!isSuperAdmin) return;
        setInviteLoading(true);
        setInviteError('');
        try {
            const res = await api.get<{ invites: AdminInvite[] }>('/admin/invites');
            setInvites(res.invites);
        } catch (error: any) {
            setInviteError(error?.message ?? 'Failed to load invites.');
        } finally {
            setInviteLoading(false);
        }
    };

    useEffect(() => {
        loadInvites();
    }, [isSuperAdmin]);

    const handleToggle = (id: string, value: boolean) => {
        setToggles((prev) => ({ ...prev, [id]: value }));
        localStorage.setItem(id, String(value));
    };

    const handleCreateInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteError('');
        setInviteSuccess('');
        setInviteUrl('');
        setCreatingInvite(true);
        try {
            const res = await api.post<{ invite: AdminInvite; inviteUrl: string }>('/admin/invites', {
                email: inviteEmail.trim().toLowerCase(),
                role: inviteRole,
                expiresInHours: Number(expiresInHours),
            });
            setInvites((prev) => [res.invite, ...prev]);
            setInviteSuccess('Invite created successfully.');
            setInviteUrl(res.inviteUrl);
            setInviteEmail('');
            setInviteRole('admin');
            setExpiresInHours('72');
        } catch (error: any) {
            setInviteError(error?.message ?? 'Failed to create invite.');
        } finally {
            setCreatingInvite(false);
        }
    };

    const handleRevokeInvite = async (id: string) => {
        setRevokingId(id);
        setInviteError('');
        setInviteSuccess('');
        try {
            const res = await api.patch<{ invite: AdminInvite }>(`/admin/invites/${id}`, { action: 'revoke' });
            setInvites((prev) => prev.map((invite) => (invite.id === id ? res.invite : invite)));
            setInviteSuccess('Invite revoked.');
        } catch (error: any) {
            setInviteError(error?.message ?? 'Failed to revoke invite.');
        } finally {
            setRevokingId(null);
        }
    };

    const activeInvites = useMemo(
        () => invites.filter((invite) => inviteStatus(invite) === 'Active'),
        [invites]
    );

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your store configuration and admin preferences.</p>
                </div>

                <Section title="Store Information">
                    <InfoRow label="Store Name" value="Bata Ganik" />
                    <InfoRow label="Store URL" value="bata-ganik.vercel.app" />
                    <InfoRow label="Contact Email" value="hello@bataganik.com" />
                    <InfoRow label="Currency" value="Nigerian Naira (NGN)" />
                    <InfoRow label="Country" value="Nigeria" />
                    <InfoRow label="Payment Gateways" value="Paystack, Stripe" />
                </Section>

                <Section title="Quick Links">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { to: '/admin/products', icon: 'shopping_bag', label: 'Manage Products', desc: 'Add, edit, or remove products' },
                            { to: '/admin/discount-codes', icon: 'discount', label: 'Discount Codes', desc: 'Create and manage promo codes' },
                            { to: '/admin/orders', icon: 'package_2', label: 'View Orders', desc: 'Track and update order statuses' },
                            { to: '/admin/customers', icon: 'group', label: 'Customer List', desc: 'Browse registered customers' },
                        ].map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.label}</p>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Section>

                <Section title="Notification Preferences">
                    <p className="text-xs text-slate-400 mb-5">Preferences are saved locally in this browser.</p>
                    <div className="space-y-5">
                        {NOTIFICATION_SETTINGS.map((setting) => (
                            <div key={setting.id} className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{setting.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{setting.description}</p>
                                </div>
                                <Toggle
                                    checked={toggles[setting.id] ?? setting.defaultValue}
                                    onChange={(v) => handleToggle(setting.id, v)}
                                />
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="Admin Account">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Admin User</p>
                            <p className="text-xs text-slate-500">{role ?? 'admin'}</p>
                        </div>
                    </div>

                    {!isSuperAdmin && (
                        <div className="text-sm text-slate-500">
                            Invite management is available to super admins only.
                        </div>
                    )}

                    {isSuperAdmin && (
                        <div className="flex flex-col gap-5">
                            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Create Admin Invite</h3>
                                <form onSubmit={handleCreateInvite} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input
                                        type="email"
                                        required
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900"
                                    />
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value as 'admin' | 'super_admin')}
                                        className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900"
                                    >
                                        <option value="admin">admin</option>
                                        <option value="super_admin">super_admin</option>
                                    </select>
                                    <input
                                        type="number"
                                        min={1}
                                        max={720}
                                        value={expiresInHours}
                                        onChange={(e) => setExpiresInHours(e.target.value)}
                                        placeholder="Expires in hours"
                                        className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900"
                                    />
                                    <button
                                        type="submit"
                                        disabled={creatingInvite}
                                        className="md:col-span-3 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg disabled:opacity-60"
                                    >
                                        {creatingInvite ? 'Creating invite...' : 'Create invite'}
                                    </button>
                                </form>
                                {inviteSuccess && <p className="mt-3 text-xs text-green-600">{inviteSuccess}</p>}
                                {inviteError && <p className="mt-3 text-xs text-red-500">{inviteError}</p>}
                                {inviteUrl && (
                                    <div className="mt-3 p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-500 mb-2">Share this one-time invite link:</p>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs text-slate-700 dark:text-slate-300 break-all flex-1">{inviteUrl}</code>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(inviteUrl)}
                                                className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Invites ({activeInvites.length} active)</h3>
                                    <button
                                        onClick={loadInvites}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs text-slate-500 uppercase">Email</th>
                                                <th className="px-3 py-2 text-left text-xs text-slate-500 uppercase">Role</th>
                                                <th className="px-3 py-2 text-left text-xs text-slate-500 uppercase">Expires</th>
                                                <th className="px-3 py-2 text-left text-xs text-slate-500 uppercase">Status</th>
                                                <th className="px-3 py-2 text-right text-xs text-slate-500 uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {inviteLoading && (
                                                <tr>
                                                    <td className="px-3 py-4 text-slate-500 text-xs" colSpan={5}>Loading invites...</td>
                                                </tr>
                                            )}
                                            {!inviteLoading && invites.length === 0 && (
                                                <tr>
                                                    <td className="px-3 py-4 text-slate-500 text-xs" colSpan={5}>No invites yet.</td>
                                                </tr>
                                            )}
                                            {!inviteLoading && invites.map((invite) => {
                                                const status = inviteStatus(invite)
                                                const canRevoke = status === 'Active'
                                                return (
                                                    <tr key={invite.id}>
                                                        <td className="px-3 py-3 text-slate-800 dark:text-slate-200">{invite.email}</td>
                                                        <td className="px-3 py-3 text-slate-500">{invite.role}</td>
                                                        <td className="px-3 py-3 text-slate-500">
                                                            {new Date(invite.expiresAt).toLocaleString('en-NG')}
                                                        </td>
                                                        <td className="px-3 py-3 text-slate-500">{status}</td>
                                                        <td className="px-3 py-3 text-right">
                                                            <button
                                                                disabled={!canRevoke || revokingId === invite.id}
                                                                onClick={() => handleRevokeInvite(invite.id)}
                                                                className="text-xs text-red-500 hover:underline disabled:opacity-40 disabled:no-underline"
                                                            >
                                                                {revokingId === invite.id ? 'Revoking...' : 'Revoke'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </Section>
            </div>
        </div>
    );
}
