import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';

export default function AdminSignup() {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4 block">block</span>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-slate-500">This invitation link is invalid or has expired.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            // 1. Create user via server-side API (auto-confirms, auto-promotes first admin)
            await api.post('/admin/invite/signup', {
                email,
                password,
                firstName,
                lastName,
                token,
            });

            // 2. Sign in immediately
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) throw signInError;

            // 3. Redirect to admin dashboard
            navigate('/admin', { replace: true });
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">person_add</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Invitation</h1>
                    <p className="text-slate-500 text-sm mt-1">Create your admin account</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                                placeholder="Min. 8 characters"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>}
                        {loading ? 'Creating Account...' : 'Create Admin Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-600 text-xs">
                    This is a private invitation link · Do not share
                </p>
            </div>
        </div>
    );
}
