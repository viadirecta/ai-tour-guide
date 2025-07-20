
import React, { useState } from 'react';
import { getAppData, saveAppData } from '../services/configService';
import { Tour, TourStatus } from '../types';
import Icon from './Icon';

const RegisterPage: React.FC = () => {
    const [guideName, setGuideName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tourName, setTourName] = useState('');
    const [tourDescription, setTourDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const appData = getAppData();

        if (appData.tours.some(t => t.email.toLowerCase() === email.toLowerCase())) {
            setError('An account with this email already exists.');
            setIsLoading(false);
            return;
        }

        const newTourId = tourName.toLowerCase().replace(/[^a-z0-9-]/g, ' ').trim().replace(/\s+/g, '-');
        if (!newTourId) {
            setError("Invalid tour name. Please use alphanumeric characters.");
            setIsLoading(false);
            return;
        }

        if (appData.tours.some(t => t.id === newTourId)) {
            setError("A tour with this name already exists. Please choose a different name.");
            setIsLoading(false);
            return;
        }

        const newTour: Tour = {
            id: newTourId,
            name: tourName,
            guideName: guideName,
            email: email,
            adminPassword: password,
            status: TourStatus.PENDING,
            registrationDate: new Date().toISOString(),
            config: {
                tourName: tourName,
                systemInstruction: tourDescription || `You are a helpful guide for the "${tourName}" tour.`,
                references: [],
            },
            tipInfo: {
                message: `Did you enjoy the ${tourName}? Please consider leaving a tip!`,
                paypalLink: '',
                bizumInfo: '',
                paymentQrCode: '',
            }
        };

        const updatedData = { ...appData, tours: [...appData.tours, newTour] };
        saveAppData(updatedData);

        setTimeout(() => {
            setIsLoading(false);
            alert('Registration successful! Your account is now pending approval from an administrator.');
            window.location.hash = '/';
        }, 500);
    };
    
    const commonInputClass = "w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-center mb-6">
                    <Icon name="add" className="w-12 h-12 text-sky-500 dark:text-sky-400" />
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Create Your Tour</h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Register as a guide and set up your AI assistant.</p>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" value={guideName} onChange={e => setGuideName(e.target.value)} className={commonInputClass} placeholder="Your Name" required />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={commonInputClass} placeholder="Email Address" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={commonInputClass} placeholder="Password" required />
                    <hr className="border-slate-200 dark:border-slate-700 !my-6" />
                    <input type="text" value={tourName} onChange={e => setTourName(e.target.value)} className={commonInputClass} placeholder="Name of Your Tour (e.g., 'Gothic Quarter Secrets')" required />
                    <textarea value={tourDescription} onChange={e => setTourDescription(e.target.value)} className={`${commonInputClass} h-24`} placeholder="Briefly describe your tour (this will be the AI's first instruction)." required />
                    
                    {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full !mt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 flex justify-center items-center">
                        {isLoading ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'Register Tour'}
                    </button>
                </form>
                 <div className="text-center mt-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <a href="/#/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                            Login here
                        </a>
                    </p>
                    <a href="/#" className="inline-block mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        ← Back to Tour List
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;