

import React, { useState, useEffect, useMemo } from 'react';
import { AppData, Tour, TourStatus } from '../types';
import { getAppData, saveAppData } from '../services/configService';
import Icon from './Icon';
import { useLanguage } from '../hooks/useLanguage';

const StatCard: React.FC<{ title: string; value: string | number; icon: 'walking' | 'add' | 'x-circle' | 'user' | 'book'; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-700">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: TourStatus }> = ({ status }) => {
    const statusInfo = {
        [TourStatus.ACTIVE]: { text: 'Active', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        [TourStatus.PENDING]: { text: 'Pending', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        [TourStatus.SUSPENDED]: { text: 'Suspended', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    };
    const { text, classes } = statusInfo[status];
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>
            {text}
        </span>
    );
};


const SuperAdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [appData, setAppData] = useState<AppData | null>(null);
    const [editingTour, setEditingTour] = useState<Tour | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');

    useEffect(() => {
        const data = getAppData();
        setAppData(data);
        if (data) {
          setNewAdminEmail(data.superAdminEmail);
        }
    }, []);

    const stats = useMemo(() => {
        if (!appData) return { total: 0, active: 0, pending: 0, suspended: 0, subscribers: 0 };
        return {
            total: appData.tours.length,
            active: appData.tours.filter(t => t.status === TourStatus.ACTIVE).length,
            pending: appData.tours.filter(t => t.status === TourStatus.PENDING).length,
            suspended: appData.tours.filter(t => t.status === TourStatus.SUSPENDED).length,
            subscribers: appData.newsletterSubscribers.length,
        };
    }, [appData]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (appData && email.toLowerCase() === appData.superAdminEmail.toLowerCase() && password === appData.superAdminPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect email or password.');
        }
    };

    const handleSaveCredentials = () => {
        if (!appData || !newAdminEmail.trim()) {
            alert("Admin email cannot be empty.");
            return;
        }

        const updatedData: AppData = { 
          ...appData,
          superAdminEmail: newAdminEmail.trim(),
        };

        if (newAdminPassword) {
            updatedData.superAdminPassword = newAdminPassword;
        }
        
        setAppData(updatedData);
        saveAppData(updatedData);
        alert("Administrator credentials updated successfully.");
        setNewAdminPassword(''); // Clear password field after save
    };

    const handleUpdateStatus = (tourId: string, status: TourStatus) => {
        if (!appData) return;
        const updatedTours = appData.tours.map(t =>
            t.id === tourId ? { ...t, status } : t
        );
        const updatedData = { ...appData, tours: updatedTours };
        setAppData(updatedData);
        saveAppData(updatedData);
    };

    const handleDeleteTour = (tourId: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this tour? This cannot be undone.")) return;

        const updatedData = { ...appData!, tours: appData!.tours.filter(t => t.id !== tourId) };
        setAppData(updatedData);
        saveAppData(updatedData);
    };
    
    const handleSaveChanges = (updatedTour: Tour) => {
        if(!appData) return;
        const updatedData = { ...appData, tours: appData.tours.map(t => t.id === updatedTour.id ? updatedTour : t)};
        setAppData(updatedData);
        saveAppData(updatedData);
        setEditingTour(null);
    };

    const handleCreateTour = (newTourData: Omit<Tour, 'id' | 'status' | 'registrationDate' | 'config' | 'tipInfo'>) => {
        if (!appData) return;
        const newTourId = newTourData.name.toLowerCase().replace(/[^a-z0-9-]/g, ' ').trim().replace(/\s+/g, '-');
        
        if (!newTourId) {
             alert("Invalid tour name. Please use alphanumeric characters.");
            return;
        }

        if (appData.tours.some(t => t.id === newTourId || t.email.toLowerCase() === newTourData.email.toLowerCase())) {
            alert("A tour with this name or email already exists.");
            return;
        }

        const newTour: Tour = {
            id: newTourId,
            name: newTourData.name,
            guideName: newTourData.guideName,
            email: newTourData.email,
            adminPassword: newTourData.adminPassword,
            status: TourStatus.ACTIVE,
            registrationDate: new Date().toISOString(),
            config: {
                tourName: newTourData.name,
                systemInstruction: `You are a helpful guide for the "${newTourData.name}" tour.`,
                references: [],
            },
            tipInfo: {
                message: `Did you enjoy the ${newTourData.name}? Please consider leaving a tip!`,
                paypalLink: '',
                bizumInfo: '',
                paymentQrCode: '',
            }
        };

        const updatedData = { ...appData, tours: [...appData.tours, newTour] };
        setAppData(updatedData);
        saveAppData(updatedData);
        setIsCreating(false);
    };

    const handleCopySubscribers = () => {
        if (appData && appData.newsletterSubscribers.length > 0) {
            navigator.clipboard.writeText(appData.newsletterSubscribers.join(', ')).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    if (!appData) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
                <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-center mb-6"><Icon name="settings" className="w-12 h-12 text-red-500 dark:text-red-400" /></div>
                    <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Control Panel Access</h1>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Administrator Login</p>
                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" 
                                placeholder="Email"
                                required 
                            />
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" 
                                placeholder="Password"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center mt-3">{error}</p>}
                        <button type="submit" className="w-full mt-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500">Authenticate</button>
                    </form>
                     <div className="text-center mt-6"><a href="/#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400">← Back to Homepage</a></div>
                </div>
            </div>
        );
    }
    
    if (editingTour || isCreating) {
        return <TourEditor 
                    tour={editingTour} 
                    onSave={editingTour ? handleSaveChanges : handleCreateTour} 
                    onCancel={() => { setEditingTour(null); setIsCreating(false); }} 
                />;
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Super Admin Dashboard</h1><a href="/#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400">← Back to Homepage</a></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard title="Total Tours" value={stats.total} icon="walking" color="bg-sky-500" />
                    <StatCard title="Active Tours" value={stats.active} icon="user" color="bg-green-500" />
                    <StatCard title="Pending Approval" value={stats.pending} icon="add" color="bg-yellow-500" />
                    <StatCard title="Suspended" value={stats.suspended} icon="x-circle" color="bg-red-500" />
                    <StatCard title="Subscribers" value={stats.subscribers} icon="book" color="bg-indigo-500" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                            <h2 className="text-xl font-semibold text-sky-600 dark:text-sky-400">Manage Tours</h2>
                            <button onClick={() => setIsCreating(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
                                <Icon name="add" className="w-5 h-5 mr-2" />
                                Create New Tour
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Oversee, edit, create, or change the status of tour profiles.</p>
                        <div className="space-y-4">
                            {appData.tours.map(tour => (
                                <div key={tour.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-start flex-wrap gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{tour.name}</h3>
                                            <StatusBadge status={tour.status} />
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{tour.guideName} ({tour.email})</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Registered: {new Date(tour.registrationDate).toLocaleDateString()}</p>
                                        <a href={`/#/admin/${tour.id}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block">Go to Guide's Panel →</a>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 flex-shrink-0">
                                        <div className="flex items-center gap-2 font-medium text-sm">
                                            {tour.status === TourStatus.PENDING && (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(tour.id, TourStatus.ACTIVE)} className="text-green-600 hover:text-green-500">Approve</button>
                                                    <button onClick={() => handleDeleteTour(tour.id)} className="text-red-600 hover:text-red-500">Deny</button>
                                                </>
                                            )}
                                            {tour.status === TourStatus.ACTIVE && (
                                                <button onClick={() => handleUpdateStatus(tour.id, TourStatus.SUSPENDED)} className="text-yellow-600 hover:text-yellow-500">Suspend</button>
                                            )}
                                            {tour.status === TourStatus.SUSPENDED && (
                                                <button onClick={() => handleUpdateStatus(tour.id, TourStatus.ACTIVE)} className="text-green-600 hover:text-green-500">Reactivate</button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 border-l border-slate-300 dark:border-slate-600 pl-4">
                                            <button onClick={() => setEditingTour(tour)} className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 p-2 rounded-md" title="Edit Tour Details"><Icon name="settings" className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteTour(tour.id)} className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-md" title="Permanently Delete Tour"><Icon name="delete" className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {appData.tours.length === 0 && (<p className="text-center text-slate-500 py-4">No tours have been registered yet. Use the 'Create New Tour' button to get started.</p>)}
                        </div>
                    </div>
                     <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Administrator Credentials</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Admin Email</label>
                                    <input 
                                        type="email" 
                                        value={newAdminEmail} 
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">New Password (optional)</label>
                                    <input 
                                        type="password" 
                                        value={newAdminPassword} 
                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                        className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                                        placeholder="Leave blank to keep current password"
                                    />
                                </div>
                            </div>
                            <button onClick={handleSaveCredentials} className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500 transition-colors">
                                <Icon name="save" className="w-4 h-4 mr-2" />
                                Save Credentials
                            </button>
                        </div>
                         <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                             <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Newsletter Subscribers</h2>
                             <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                                 {appData.newsletterSubscribers.length > 0 ? (
                                     appData.newsletterSubscribers.map((email, index) => (
                                         <p key={index} className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-md">{email}</p>
                                     ))
                                 ) : (
                                     <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No subscribers yet.</p>
                                 )}
                             </div>
                             {appData.newsletterSubscribers.length > 0 && (
                                <button onClick={handleCopySubscribers} className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    <Icon name="copy" className="w-4 h-4 mr-2" />
                                    {copied ? 'Copied!' : 'Copy List'}
                                </button>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface TourEditorProps {
    tour: Tour | null;
    onSave: (tourData: any) => void;
    onCancel: () => void;
}

const TourEditor: React.FC<TourEditorProps> = ({ tour, onSave, onCancel }) => {
    const [tourData, setTourData] = useState({
        id: tour?.id || '',
        name: tour?.name || '',
        guideName: tour?.guideName || '',
        email: tour?.email || '',
        adminPassword: tour?.adminPassword || ''
    });

    const isCreating = !tour;

    const handleSave = () => {
        if (!tourData.name || !tourData.guideName || !tourData.email || !tourData.adminPassword) {
            alert("All fields are required.");
            return;
        }
        onSave(tourData);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 flex items-center justify-center">
             <div className="w-full max-w-lg p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{isCreating ? 'Create New Tour' : 'Edit Tour'}</h2>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tour Name</label>
                        <input type="text" value={tourData.name} onChange={e => setTourData({...tourData, name: e.target.value})} className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md" />
                        {isCreating && <p className="text-xs text-slate-400 mt-1">The Tour ID will be generated from this name.</p>}
                    </div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Guide Name</label><input type="text" value={tourData.guideName} onChange={e => setTourData({...tourData, guideName: e.target.value})} className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Guide Email</label><input type="email" value={tourData.email} onChange={e => setTourData({...tourData, email: e.target.value})} className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md" /></div>
                    {!isCreating && <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tour ID (Cannot be changed)</label><input type="text" value={tourData.id} readOnly className="w-full p-2 bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-500" /></div>}
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Guide's Admin Password</label><input type="text" value={tourData.adminPassword} onChange={e => setTourData({...tourData, adminPassword: e.target.value})} className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md" /></div>
                 </div>
                 <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">{isCreating ? 'Create Tour' : 'Save Changes'}</button>
                 </div>
             </div>
        </div>
    );
};


export default SuperAdminPage;