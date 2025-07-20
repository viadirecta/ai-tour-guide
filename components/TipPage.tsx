

import React, { useState, useEffect } from 'react';
import { getTourConfig, getTipInfo } from '../services/configService';
import { TipInfo, TourConfig } from '../types';
import Icon from './Icon';

interface TipPageProps {
    tourId?: string;
}

const TipPage: React.FC<TipPageProps> = ({ tourId }) => {
    const [tourConfig, setTourConfig] = useState<TourConfig | null>(null);
    const [tipInfo, setTipInfo] = useState<TipInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tourId) {
            setError("No tour specified.");
            return;
        }
        try {
            const config = getTourConfig(tourId);
            const tips = getTipInfo(tourId);

            if (config && tips) {
                setTourConfig(config);
                setTipInfo(tips);
            } else {
                 setError(`Could not load configuration for tour "${tourId}".`);
            }
        } catch (e) {
            setError("Could not load tour configuration.");
        }
    }, [tourId]);

    if (error || !tourId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">Error</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{error || "Invalid tour."}</p>
                    <a href="/#" className="mt-6 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Go to Homepage</a>
                </div>
            </div>
        );
    }
    
    if (!tourConfig || !tipInfo) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">Loading...</div>;
    }
    
    const name = tourConfig.tourName;
    const hasAnyTipInfo = tipInfo.paypalLink || tipInfo.bizumInfo || tipInfo.paymentQrCode;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <Icon name="tip" className="w-16 h-16 mx-auto mb-4 text-green-500 dark:text-green-400" />
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Leave a Tip</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">for your guide on the {name}</p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-center text-slate-600 dark:text-slate-300 mb-6 whitespace-pre-wrap">{tipInfo.message}</p>
                    
                    {!hasAnyTipInfo ? (
                         <p className="text-center text-slate-500 py-4">This guide has not configured any tipping options yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {tipInfo.paypalLink && (
                                <a href={tipInfo.paypalLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center px-4 py-3 bg-[#0070BA] text-white font-bold rounded-lg hover:bg-[#005ea6] transition-colors">
                                    <Icon name="paypal" className="w-6 h-6 mr-3" />
                                    Pay with PayPal
                                </a>
                            )}
                             {tipInfo.bizumInfo && (
                                <div className="text-center bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Bizum / Other</p>
                                    <p className="font-bold text-lg text-slate-900 dark:text-white">{tipInfo.bizumInfo}</p>
                                </div>
                            )}
                            {tipInfo.paymentQrCode && (
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Scan with your payment app</p>
                                    <div className="bg-white p-2 rounded-lg inline-block mx-auto">
                                        <img src={tipInfo.paymentQrCode} alt="Payment QR Code" className="w-48 h-48" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                 <div className="text-center mt-8">
                    <a href={`/#/tour/${tourId}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        ← Back to the Tour
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TipPage;