

import { AppData, Tour, TourConfig, TipInfo } from '../types';

const APP_DATA_STORAGE_KEY = 'gemini-tours-app-data';

const DEFAULT_APP_DATA: AppData = {
    superAdminEmail: "viadirecta@duck.com",
    superAdminPassword: "superadmin", // Default password, should be changed
    tours: [],
    newsletterSubscribers: [],
};

export function getAppData(): AppData {
    try {
        const storedData = localStorage.getItem(APP_DATA_STORAGE_KEY);
        if (storedData) {
            const data = JSON.parse(storedData) as Partial<AppData>;
            // Basic validation and migration
            if (data && typeof data.superAdminPassword === 'string' && Array.isArray(data.tours)) {
                
                // Migration for superAdminEmail
                if (typeof data.superAdminEmail !== 'string' || data.superAdminEmail === '') {
                    data.superAdminEmail = DEFAULT_APP_DATA.superAdminEmail;
                }
                
                // Migration for newsletter subscribers
                if (!Array.isArray(data.newsletterSubscribers)) {
                    data.newsletterSubscribers = [];
                }

                return data as AppData;
            }
        }
        // If no valid data, save and return default
        saveAppData(DEFAULT_APP_DATA);
        return DEFAULT_APP_DATA;
    } catch (error) {
        console.error("Failed to parse AppData from localStorage, using defaults.", error);
        saveAppData(DEFAULT_APP_DATA);
        return DEFAULT_APP_DATA;
    }
}

export function saveAppData(data: AppData): void {
    try {
        localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save AppData to localStorage", error);
    }
}

export function addNewsletterSubscriber(email: string): boolean {
    const appData = getAppData();
    const lowercasedEmail = email.toLowerCase();
    if (appData.newsletterSubscribers.includes(lowercasedEmail)) {
        return false; // Already subscribed
    }
    appData.newsletterSubscribers.push(lowercasedEmail);
    saveAppData(appData);
    return true; // Success
}

export function getTourById(tourId: string): Tour | undefined {
    const appData = getAppData();
    return appData.tours.find(t => t.id === tourId);
}

// These functions now operate on the AppData structure
export function getTourConfig(tourId: string): TourConfig | null {
    const tour = getTourById(tourId);
    return tour ? tour.config : null;
}

export function saveTourConfig(tourId: string, config: TourConfig): void {
    const appData = getAppData();
    const tourIndex = appData.tours.findIndex(t => t.id === tourId);
    if (tourIndex > -1) {
        appData.tours[tourIndex].config = config;
        saveAppData(appData);
    } else {
        console.error(`Tour with id ${tourId} not found for saving config.`);
    }
}

export function getTipInfo(tourId: string): TipInfo | null {
    const tour = getTourById(tourId);
    return tour ? tour.tipInfo : null;
}

export function saveTipInfo(tourId: string, tipInfo: TipInfo): void {
    const appData = getAppData();
    const tourIndex = appData.tours.findIndex(t => t.id === tourId);
    if (tourIndex > -1) {
        appData.tours[tourIndex].tipInfo = tipInfo;
        saveAppData(appData);
    } else {
        console.error(`Tour with id ${tourId} not found for saving tip info.`);
    }
}

export function exportConfig(tourId: string): void {
    const tour = getTourById(tourId);
    if (!tour) {
        alert(`Tour with ID "${tourId}" not found.`);
        return;
    }
    const { config, tipInfo } = tour;
    const exportData = { config, tipInfo };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${tour.id}_config.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

export function importConfig(file: File, callback: (config: TourConfig, tipInfo: TipInfo) => void): void {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            if (typeof event.target?.result === 'string') {
                const importedData = JSON.parse(event.target.result);
                // Simple validation for the imported structure
                if (importedData.config && importedData.tipInfo && importedData.config.tourName && importedData.config.systemInstruction) {
                    callback(importedData.config, importedData.tipInfo);
                } else {
                    alert('Invalid configuration file format.');
                }
            }
        } catch (e) {
            alert('Error reading or parsing the configuration file.');
            console.error(e);
        }
    };
    reader.readAsText(file);
}