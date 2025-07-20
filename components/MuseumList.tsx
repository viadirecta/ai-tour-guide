import React, { useState, useEffect } from 'react';
import { getAppData } from '../services/configService';
import { Tour } from '../types';
import Icon from './Icon';

const TourList: React.FC = () => {
    const [tours, setTours] = useState<Tour[]>([]);

    useEffect(() => {
        const data = getAppData();
        setTours(data.tours);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <Icon name="walking" className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                    <h1 className="text-4xl font-bold text-white">AI Tour Guides</h1>
                    <p className="text-slate-400 mt-2">Select a tour to begin your journey.</p>
                </div>

                {tours.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tours.map(tour => (
                            <a key={tour.id} href={`/#/tour/${tour.id}`} className="block bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/50 transition-all transform hover:-translate-y-1">
                                <h2 className="text-xl font-bold text-white mb-2">{tour.name}</h2>
                                <p className="text-sm text-slate-400">Start the {tour.name}.</p>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-semibold text-white">No Tours Configured</h2>
                        <p className="text-slate-400 mt-2">The Super Admin needs to configure a tour first.</p>
                    </div>
                )}
               
                <div className="text-center mt-16">
                    <a href="/#/superadmin" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                        <Icon name="settings" className="w-4 h-4 inline-block mr-1" />
                        Super Admin Panel
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TourList;