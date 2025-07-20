

import React, { useState, useRef, useEffect } from 'react';
import { TourConfig, ReferenceItem, TipInfo } from '../types';
import { getTourConfig, saveTourConfig, getTipInfo, saveTipInfo, exportConfig, importConfig, getTourById } from '../services/configService';
import Icon from './Icon';
import QRCodeGenerator from './QRCodeGenerator';

interface AdminPageProps {
    tourId?: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ tourId }) => {
    const [config, setConfig] = useState<TourConfig | null>(null);
    const [tipInfo, setTipInfo] = useState<TipInfo | null>(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [visibleQrRefId, setVisibleQrRefId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const configFileRef = useRef<HTMLInputElement>(null);
    const qrCodeFileRef = useRef<HTMLInputElement>(null);
    const referenceImageFileRef = useRef<HTMLInputElement>(null);
    const referenceVideoFileRef = useRef<HTMLInputElement>(null);
    const [targetReferenceId, setTargetReferenceId] = useState<string | null>(null);

    useEffect(() => {
        const loggedInTourId = sessionStorage.getItem('loggedInTourId');
        if (tourId && loggedInTourId === tourId) {
            setIsAuthorized(true);
            const tour = getTourById(tourId);
            if (tour) {
                setConfig(tour.config);
                setTipInfo(tour.tipInfo);
            } else {
                setError(`Tour with ID "${tourId}" not found.`);
            }
        } else if (tourId) {
             setError('You are not authorized to view this admin panel. Please log in.');
        } else {
            setError('No Tour ID specified.');
        }
    }, [tourId]);


    if (!isAuthorized || !tourId) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">Access Denied</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{error || "You must be logged in to access this page."}</p>
                    <a href={`/#/login`} className="mt-6 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Go to Login</a>
                </div>
            </div>
        );
    }
    
    if (!config || !tipInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                 <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">Error</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{error || "Loading tour data..."}</p>
                     <a href="/#" className="mt-6 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Return to Tour List</a>
                </div>
            </div>
        );
    }

    const tourUrl = `${window.location.origin}${window.location.pathname}#/tour/${tourId}`;

    const handleSave = () => {
        saveTourConfig(tourId, config);
        saveTipInfo(tourId, tipInfo);
        setShowSaveConfirm(true);
        setTimeout(() => setShowSaveConfirm(false), 2000);
    };

    const handleConfigChange = (field: keyof TourConfig, value: string) => {
        setConfig(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    const handleReferenceChange = (id: string, field: 'keyword' | 'description' | 'videoUrl' | 'imageUrl', value: string) => {
        setConfig(prev => {
            if (!prev) return null;
            return {
            ...prev,
            references: prev.references.map(ref => {
                if (ref.id === id) {
                    const newRef = { ...ref, [field]: value };
                    if (field === 'imageUrl' && value) newRef.videoUrl = '';
                    if (field === 'videoUrl' && value) newRef.imageUrl = '';
                    return newRef;
                }
                return ref;
            })
        }});
    };

    const handleAddReference = () => {
        const newReference: ReferenceItem = { id: Date.now().toString(), keyword: '', description: '' };
        setConfig(prev => prev ? ({ ...prev, references: [...prev.references, newReference] }) : null);
    };

    const handleDeleteReference = (id: string) => {
        if (window.confirm('Are you sure you want to delete this reference?')) {
            setConfig(prev => prev ? ({ ...prev, references: prev.references.filter(ref => ref.id !== id) }) : null);
        }
    };
    
    const handleTipInfoChange = (field: keyof TipInfo, value: string) => {
        setTipInfo(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importConfig(file, (newConfig, newTipInfo) => {
                setConfig(newConfig);
                setTipInfo(newTipInfo);
                alert('Configuration imported successfully! Remember to save.');
            });
        }
        if(configFileRef.current) configFileRef.current.value = "";
    };

    const handleQrCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    handleTipInfoChange('paymentQrCode', e.target.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file.");
        }
        if(qrCodeFileRef.current) qrCodeFileRef.current.value = "";
    };

    const triggerReferenceImageUpload = (refId: string) => {
        setTargetReferenceId(refId);
        referenceImageFileRef.current?.click();
    };

    const handleReferenceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!targetReferenceId) return;
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    handleReferenceChange(targetReferenceId, 'imageUrl', e.target.result);
                }
                setTargetReferenceId(null);
                if(referenceImageFileRef.current) referenceImageFileRef.current.value = "";
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file.");
        }
    };

    const triggerReferenceVideoUpload = (refId: string) => {
        setTargetReferenceId(refId);
        referenceVideoFileRef.current?.click();
    };

    const handleReferenceVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!targetReferenceId) return;
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    handleReferenceChange(targetReferenceId, 'videoUrl', e.target.result);
                }
                 setTargetReferenceId(null);
                 if(referenceVideoFileRef.current) referenceVideoFileRef.current.value = "";
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid video file.");
        }
    };

    const Card: React.FC<{title: string, description: string, icon: 'settings' | 'tip' | 'qrcode' | 'book', children: React.ReactNode}> = ({title, description, icon, children}) => (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
                <Icon name={icon} className="w-8 h-8 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <div className="mt-6">
                {children}
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <Icon name="walking" className="w-8 h-8 text-sky-500"/>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tour Admin Panel</h1>
                    </div>
                     <div className="flex items-center gap-4">
                        <a href={`/#/tour/${tourId}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← Back to Chat</a>
                        <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors flex items-center">
                            <Icon name="save" className="w-5 h-5 mr-2" />
                            {showSaveConfirm ? 'Saved!' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Configure your AI tour guide's personality, knowledge base, and tipping options.
                </p>

                <div className="grid grid-cols-1 gap-8">
                    {/* Tour Name & System Instruction Card */}
                    <Card title="AI Configuration" description="Define your AI's name, personality and instructions." icon="settings">
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tour Name</label>
                                <input
                                    type="text"
                                    value={config.tourName}
                                    onChange={(e) => handleConfigChange('tourName', e.target.value)}
                                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                                    placeholder="e.g., Secrets of the Gothic Quarter"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">System Instruction</label>
                                <textarea
                                    value={config.systemInstruction}
                                    onChange={(e) => handleConfigChange('systemInstruction', e.target.value)}
                                    rows={5}
                                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                                    placeholder="e.g., You are a witty historian who knows all the secrets of Barcelona's Gothic Quarter..."
                                />
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This sets the AI's personality and context. Be descriptive!</p>
                            </div>
                        </div>
                    </Card>

                    {/* QR Code Card */}
                     <Card title="Promotional QR Code" description="Share this code to let people start your tour." icon="qrcode">
                        <div className="flex justify-center">
                            <QRCodeGenerator text={tourUrl} filename={`${config.tourName.replace(/\s/g, '_')}_tour_qr.png`} label={`QR code for the "${config.tourName}" tour.`} />
                        </div>
                    </Card>

                    {/* Tip Jar Card */}
                    <Card title="Tip Jar" description="Provide options for users to leave a tip." icon="tip">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tip Message</label>
                                <textarea
                                    value={tipInfo.message}
                                    onChange={(e) => handleTipInfoChange('message', e.target.value)}
                                    rows={3}
                                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                                    placeholder="A friendly message encouraging tips."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">PayPal.me Link</label>
                                <input
                                    type="text"
                                    value={tipInfo.paypalLink}
                                    onChange={(e) => handleTipInfoChange('paypalLink', e.target.value)}
                                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                                    placeholder="https://paypal.me/your-guide-name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Bizum / Other Info</label>
                                <input
                                    type="text"
                                    value={tipInfo.bizumInfo}
                                    onChange={(e) => handleTipInfoChange('bizumInfo', e.target.value)}
                                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                                    placeholder="Bizum: 123 456 789"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Payment QR Code</label>
                                <div className="flex items-center gap-4">
                                    <input type="file" ref={qrCodeFileRef} onChange={handleQrCodeUpload} className="hidden" accept="image/*" />
                                    <button onClick={() => qrCodeFileRef.current?.click()} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm flex items-center gap-2">
                                        <Icon name="upload" className="w-5 h-5"/>
                                        Upload Image
                                    </button>
                                    {tipInfo.paymentQrCode && <img src={tipInfo.paymentQrCode} alt="QR Code Preview" className="w-16 h-16 rounded-md border p-1 bg-white" />}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Knowledge Base Card */}
                     <Card title="Local Knowledge Base" description="Add specific keywords, descriptions, and media to provide instant, precise answers." icon="book">
                        <div className="space-y-4">
                            {config.references.map((ref, index) => (
                                <div key={ref.id} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={ref.keyword}
                                            onChange={(e) => handleReferenceChange(ref.id, 'keyword', e.target.value)}
                                            placeholder={`Keyword #${index + 1} (e.g., 'QR-ref:STATUE_01')`}
                                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md"
                                        />
                                        <textarea
                                            value={ref.description}
                                            onChange={(e) => handleReferenceChange(ref.id, 'description', e.target.value)}
                                            placeholder="Description for this keyword..."
                                            rows={3}
                                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md md:col-span-2"
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                             <button onClick={() => triggerReferenceImageUpload(ref.id)} className="text-xs px-2 py-1 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300 rounded-md hover:bg-sky-200 dark:hover:bg-sky-800 flex items-center gap-1"><Icon name="camera" className="w-4 h-4"/>Upload Image</button>
                                             <button onClick={() => triggerReferenceVideoUpload(ref.id)} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 flex items-center gap-1"><Icon name="camera" className="w-4 h-4"/>Upload Video</button>
                                             
                                            {ref.imageUrl && <img src={ref.imageUrl} alt="Reference Preview" className="h-10 w-10 object-cover rounded"/>}
                                            {ref.videoUrl && <video src={ref.videoUrl} className="h-10 w-10 object-cover rounded bg-black"/>}

                                             {ref.keyword && (
                                                <button onClick={() => setVisibleQrRefId(visibleQrRefId === ref.id ? null : ref.id)} className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-1">
                                                    <Icon name="qrcode" className="w-4 h-4"/>
                                                    {visibleQrRefId === ref.id ? 'Hide' : 'Show'} QR Code
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={() => handleDeleteReference(ref.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 flex items-center gap-1 text-sm"><Icon name="delete" className="w-4 h-4"/>Delete</button>
                                    </div>
                                    {visibleQrRefId === ref.id && ref.keyword && (
                                        <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg flex justify-center">
                                            <QRCodeGenerator text={ref.keyword} filename={`${ref.keyword.replace(/[^a-zA-Z0-9]/g, '_')}_qr.png`} label={`QR code for keyword: "${ref.keyword}"`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button onClick={handleAddReference} className="w-full mt-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center gap-2">
                                <Icon name="add" className="w-5 h-5" /> Add New Reference
                            </button>
                             <input type="file" ref={referenceImageFileRef} onChange={handleReferenceImageUpload} className="hidden" accept="image/*" />
                             <input type="file" ref={referenceVideoFileRef} onChange={handleReferenceVideoUpload} className="hidden" accept="video/*" />
                        </div>
                    </Card>
                    
                    <div className="flex justify-center items-center gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <input type="file" ref={configFileRef} onChange={handleImport} className="hidden" accept=".json" />
                        <button onClick={() => configFileRef.current?.click()} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm flex items-center gap-2">
                           <Icon name="upload" className="w-5 h-5"/> Import Config (.json)
                        </button>
                         <button onClick={() => exportConfig(tourId)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm flex items-center gap-2">
                           <Icon name="download" className="w-5 h-5"/> Export Config (.json)
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminPage;