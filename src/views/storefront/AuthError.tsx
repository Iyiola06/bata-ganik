import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthError() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const hash = location.hash;
    const searchParams = new URLSearchParams(location.search);

    // Check if we actually have a session or token
    const hasTokenInHash = hash.includes('access_token=');
    const isActuallySuccess = user || hasTokenInHash;

    // Get specific error details if available
    const errorMsg = searchParams.get('error_description') || searchParams.get('error');

    useEffect(() => {
        // If they are already logged in, let's just get them to their account after a brief moment
        if (user && !loading) {
            const timer = setTimeout(() => {
                navigate('/account');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen pt-40 flex justify-center">
                <div className="animate-pulse text-slate-400 uppercase tracking-widest text-xs">Verifying session...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-background-light dark:bg-background-dark flex justify-center">
            <div className="max-w-md w-full text-center">
                <div className="mb-10">
                    <div className={`w-20 h-20 ${isActuallySuccess ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <span className={`material-symbols-outlined ${isActuallySuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-4xl`}>
                            {isActuallySuccess ? 'check_circle' : 'error'}
                        </span>
                    </div>
                    <h1 className="font-serif text-4xl text-slate-900 dark:text-white mb-4">
                        {isActuallySuccess ? 'Login Successful' : 'Authentication Error'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isActuallySuccess
                            ? (user
                                ? `Welcome back, ${user.user_metadata?.full_name || user.email}. You are successfully logged in and will be redirected shortly.`
                                : "You've been successfully authenticated. You can now proceed to your account.")
                            : (errorMsg || "Something went wrong during the login process. This usually happens if the session expired or the security link was already used.")}
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to={isActuallySuccess ? "/account" : "/login"}
                        className="block w-full bg-primary hover:bg-[#b09055] text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-primary/20"
                    >
                        {isActuallySuccess ? 'Go to My Account' : 'Try Again'}
                    </Link>

                    <Link
                        to="/"
                        className="block w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold py-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>

                {!isActuallySuccess && (
                    <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest">
                        If the problem persists, please contact support.
                    </p>
                )}
            </div>
        </div>
    );
}
