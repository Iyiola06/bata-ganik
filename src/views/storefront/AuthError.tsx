import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AuthError() {
    const location = useLocation();
    const hash = location.hash;

    // If we have an access_token in the hash, it means we actually logged in 
    // via Implicit Flow rather than PKCE. We should tell the user to just go to account.
    const isActuallySuccess = hash.includes('access_token=');

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-background-light dark:bg-background-dark flex justify-center">
            <div className="max-w-md w-full text-center">
                <div className="mb-10">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">
                            {isActuallySuccess ? 'check_circle' : 'error'}
                        </span>
                    </div>
                    <h1 className="font-serif text-4xl text-slate-900 dark:text-white mb-4">
                        {isActuallySuccess ? 'Login Successful' : 'Authentication Error'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isActuallySuccess
                            ? "You've been successfully authenticated, but your browser used a different security flow. You can now proceed to your account."
                            : "Something went wrong during the login process. This usually happens if the session expired or the security code was invalid."}
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
