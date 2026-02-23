import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    // Redirect to after login
    const from = (location.state as any)?.from?.pathname || '/account';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: email.split('@')[0], // placeholder
                        }
                    }
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-background-light dark:bg-background-dark flex justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl text-slate-900 dark:text-white mb-2">
                        {isSignUp ? 'Join The Circle' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isSignUp ? 'Create an account for a faster checkout experience.' : 'Log in to view your orders and manage your profile.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-primary hover:bg-[#b09055] text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>

                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-slate-500 hover:text-primary transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                        </button>
                    </div>
                </form>

                <div className="mt-12 text-center">
                    <Link to="/" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
