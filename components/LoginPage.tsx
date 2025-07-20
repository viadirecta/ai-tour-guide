
import React, { useState } from 'react';
import { getAppData } from '../services/configService';
import { TourStatus } from '../types';
import Icon from './Icon';
import { useLanguage } from '../hooks/useLanguage';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => { // Simulate network delay
            const appData = getAppData();
            const tour = appData.tours.find(t => t.email.toLowerCase() === email.toLowerCase());

            if (tour && tour.adminPassword === password) {
                switch (tour.status) {
                    case TourStatus.ACTIVE:
                        sessionStorage.setItem('loggedInTourId', tour.id);
                        window.location.hash = `#/admin/${tour.id}`;
                        break;
                    case TourStatus.PENDING:
                        setError(t('login_error_pending'));
                        setIsLoading(false);
                        break;
                    case TourStatus.SUSPENDED:
                        setError(t('login_error_suspended'));
                        setIsLoading(false);
                        break;
                    default:
                         setError(t('login_error_status'));
                         setIsLoading(false);
                }
            } else {
                setError(t('login_error_credentials'));
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-center mb-6">
                    <Icon name="walking" className="w-12 h-12 text-sky-500 dark:text-sky-400" />
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">{t('login_title')}</h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6">{t('login_subtitle')}</p>
                <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={t('email_placeholder')}
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={t('password_placeholder')}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 text-sm text-center mt-3">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                            t('login_button')
                        )}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('login_no_account')}{' '}
                        <a href="/#/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                            {t('login_register_link')}
                        </a>
                    </p>
                    <a href="/#" className="inline-block mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        {t('back_to_tour_list')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;