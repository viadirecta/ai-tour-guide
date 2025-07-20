

import React, { useState, useEffect } from 'react';
import { getAppData } from '../services/configService';
import { Tour, TourStatus } from '../types';
import Icon from './Icon';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../hooks/useLanguage';
import NewsletterForm from './NewsletterForm';

const PromotionalPage: React.FC = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        const data = getAppData();
        setTours(data.tours.filter(t => t.status === TourStatus.ACTIVE));
    }, []);
    
    const FeatureCard: React.FC<{icon: 'qrcode' | 'gemini' | 'walking', title: string, children: React.ReactNode}> = ({icon, title, children}) => (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-lg transform transition-transform hover:-translate-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center mb-4 border-4 border-white dark:border-slate-800">
                <Icon name={icon} className="w-8 h-8 text-sky-500 dark:text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{children}</p>
        </div>
    );

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans antialiased">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <Icon name="walking" className="w-7 h-7 text-sky-500"/>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{t('app_title')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#tours" className="hidden sm:inline-block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400">{t('header_tours_link')}</a>
                        <a href="/#/register" className="hidden sm:inline-block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400">{t('header_guides_link')}</a>
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative text-center py-24 sm:py-32 lg:py-40 px-4 bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {t('promo_title')}
                    </h1>
                    <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-600 dark:text-slate-400">
                        {t('promo_subtitle')}
                    </p>
                    <div className="mt-8">
                        <a href="#tours" className="inline-block px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-transform transform hover:scale-105 shadow-lg">
                            {t('promo_button')}
                        </a>
                    </div>
                </section>
                
                {/* Features Section */}
                <section className="py-20 sm:py-24 bg-slate-100 dark:bg-slate-900">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('feature_title')}</h2>
                            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">{t('feature_subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard icon="qrcode" title={t('feature_1_title')}>{t('feature_1_desc')}</FeatureCard>
                            <FeatureCard icon="gemini" title={t('feature_2_title')}>{t('feature_2_desc')}</FeatureCard>
                            <FeatureCard icon="walking" title={t('feature_3_title')}>{t('feature_3_desc')}</FeatureCard>
                        </div>
                    </div>
                </section>
                
                 {/* For Guides Section */}
                <section className="py-20 sm:py-24">
                     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center gap-8">
                            <div className="flex-grow text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-sky-600 dark:text-sky-400">{t('for_guides_title')}</h2>
                                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                                    {t('for_guides_desc')}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4 w-full sm:w-auto">
                                <a href="/#/register" className="w-full sm:w-auto inline-block text-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow">{t('for_guides_register')}</a>
                                <a href="/#/login" className="w-full sm:w-auto inline-block text-center px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">{t('for_guides_login')}</a>
                            </div>
                        </div>
                     </div>
                </section>

                {/* Available Tours Section */}
                <section id="tours" className="py-20 sm:py-24 bg-slate-100 dark:bg-slate-900">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('available_tours_title')}</h2>
                            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">{t('available_tours_subtitle')}</p>
                        </div>

                        {tours.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tours.map(tour => (
                                    <a key={tour.id} href={`/#/tour/${tour.id}`} className="group block bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tour.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t('start_tour_action').replace('{tourName}', tour.name)}</p>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('no_tours_title')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">{t('no_tours_desc')}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="py-20 sm:py-24">
                    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('newsletter_title')}</h2>
                        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 mb-8">{t('newsletter_desc')}</p>
                        <NewsletterForm />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PromotionalPage;