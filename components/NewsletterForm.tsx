
import React, { useState } from 'react';
import { addNewsletterSubscriber } from '../services/configService';
import { useLanguage } from '../hooks/useLanguage';

const NewsletterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'invalid'>('idle');
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setStatus('invalid');
            return;
        }
        setStatus('loading');
        setTimeout(() => {
            const success = addNewsletterSubscriber(email);
            if (success) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        }, 500);
    };

    let message;
    if (status === 'success') {
        message = <p className="text-sm text-green-600 dark:text-green-400 mt-2">{t('newsletter_success')}</p>;
    } else if (status === 'error') {
        message = <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">{t('newsletter_error')}</p>;
    } else if (status === 'invalid') {
        message = <p className="text-sm text-red-600 dark:text-red-400 mt-2">{t('newsletter_invalid_email')}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                    placeholder={t('newsletter_placeholder')}
                    className="flex-grow bg-transparent px-4 py-2 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                    aria-label="Email for newsletter"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                    {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                        t('newsletter_button')
                    )}
                </button>
            </div>
            {message && <div className="text-center">{message}</div>}
        </form>
    );
};

export default NewsletterForm;
