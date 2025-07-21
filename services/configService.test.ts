import {
    getAppData,
    saveAppData,
    addNewsletterSubscriber,
    getTourById,
    getTourConfig,
    saveTourConfig,
    getTipInfo,
    saveTipInfo,
} from './configService';
import { AppData, Tour, TourConfig, TipInfo } from '../types';

const APP_DATA_STORAGE_KEY = 'gemini-tours-app-data';

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

const mockAppData: AppData = {
    superAdminEmail: 'admin@test.com',
    superAdminPassword: 'password',
    tours: [
        {
            id: 'tour1',
            config: {
                tourName: 'Test Tour 1',
                systemInstruction: 'You are a tour guide.',
            } as TourConfig,
            tipInfo: {
                title: 'Enjoying the tour?',
                message: 'Leave a tip!',
            } as TipInfo,
        },
    ],
    newsletterSubscribers: ['test@example.com'],
};

describe('configService', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    test('getAppData should return default data if none is stored', () => {
        const appData = getAppData();
        expect(appData).toBeDefined();
        expect(appData.superAdminEmail).toBe('viadirecta@duck.com');
    });

    test('saveAppData and getAppData should store and retrieve data', () => {
        saveAppData(mockAppData);
        const appData = getAppData();
        expect(appData).toEqual(mockAppData);
    });

    test('addNewsletterSubscriber should add a new subscriber', () => {
        saveAppData(mockAppData);
        const result = addNewsletterSubscriber('new@example.com');
        expect(result).toBe(true);
        const appData = getAppData();
        expect(appData.newsletterSubscribers).toContain('new@example.com');
    });

    test('addNewsletterSubscriber should not add a duplicate subscriber', () => {
        saveAppData(mockAppData);
        const result = addNewsletterSubscriber('test@example.com');
        expect(result).toBe(false);
    });

    test('getTourById should retrieve a tour by its ID', () => {
        saveAppData(mockAppData);
        const tour = getTourById('tour1');
        expect(tour).toBeDefined();
        expect(tour?.id).toBe('tour1');
    });

    test('getTourById should return undefined for a non-existent tour', () => {
        saveAppData(mockAppData);
        const tour = getTourById('tour2');
        expect(tour).toBeUndefined();
    });

    test('getTourConfig and saveTourConfig should manage tour configurations', () => {
        saveAppData(mockAppData);
        const newConfig: TourConfig = {
            tourName: 'Updated Tour 1',
            systemInstruction: 'You are an updated tour guide.',
        } as TourConfig;
        saveTourConfig('tour1', newConfig);
        const config = getTourConfig('tour1');
        expect(config).toEqual(newConfig);
    });

    test('getTipInfo and saveTipInfo should manage tip information', () => {
        saveAppData(mockAppData);
        const newTipInfo: TipInfo = {
            title: 'Liked the tour?',
            message: 'Consider tipping!',
        } as TipInfo;
        saveTipInfo('tour1', newTipInfo);
        const tipInfo = getTipInfo('tour1');
        expect(tipInfo).toEqual(newTipInfo);
    });
});
