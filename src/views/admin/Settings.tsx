import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ToggleSetting {
    id: string;
    label: string;
    description: string;
    defaultValue: boolean;
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

export default function Settings() {
    const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
        const saved: Record<string, boolean> = {};
        NOTIFICATION_SETTINGS.forEach((s) => {
            const stored = localStorage.getItem(s.id);
            saved[s.id] = stored !== null ? stored === 'true' : s.defaultValue;
        });
        return saved;
    });

    const handleToggle = (id: string, value: boolean) => {
        setToggles((prev) => ({ ...prev, [id]: value }));
        localStorage.setItem(id, String(value));
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your store configuration and admin preferences.</p>
                </div>

                {/* Store Information */}
                <Section title="Store Information">
                    <InfoRow label="Store Name" value="Bata Ganik" />
                    <InfoRow label="Store URL" value="bata-ganik.vercel.app" />
                    <InfoRow label="Contact Email" value="hello@bataganik.com" />
                    <InfoRow label="Currency" value="Nigerian Naira (NGN ₦)" />
                    <InfoRow label="Country" value="Nigeria" />
                    <InfoRow label="Payment Gateways" value="Paystack · Stripe" />
                </Section>

                {/* Quick Links */}
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

                {/* Notification Preferences */}
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

                {/* Admin Account */}
                <Section title="Admin Account">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Admin User</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 flex gap-3">
                        <span className="material-symbols-outlined text-amber-500 flex-shrink-0">info</span>
                        <span>To add more admin users, use the invite link from <strong>Admin → Invite</strong> or run the SQL in <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900 px-1 rounded">setup.sql</code>.</span>
                    </div>
                </Section>
            </div>
        </div>
    );
}
