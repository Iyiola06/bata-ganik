import React, { useState } from 'react';

interface NewsletterFormProps {
    variant?: 'footer' | 'standalone';
}

export default function NewsletterForm({ variant = 'standalone' }: NewsletterFormProps) {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsSubscribing(true);
        setMessage(null);

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Something went wrong.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
        } finally {
            setIsSubscribing(false);
        }
    };

    if (variant === 'footer') {
        return (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary disabled:opacity-50"
                    disabled={isSubscribing}
                />
                <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-primary text-brand-navy font-bold py-3 px-4 rounded-md hover:bg-white transition-colors uppercase text-xs tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubscribing && <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>}
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
                {message && (
                    <p className={`text-xs mt-1 ${message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {message.text}
                    </p>
                )}
            </form>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 bg-transparent border-b border-slate-300 dark:border-slate-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50"
                    disabled={isSubscribing}
                />
                <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-primary hover:bg-primary/90 text-brand-navy font-bold py-3 px-8 uppercase text-xs tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubscribing && <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>}
                    {isSubscribing ? 'Joining...' : 'Subscribe'}
                </button>
            </form>
            {message && (
                <p className={`text-sm mt-4 text-center ${message.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
