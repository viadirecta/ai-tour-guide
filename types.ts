

export enum MessageSender {
  USER = 'user',
  GEMINI = 'gemini',
  SYSTEM = 'system',
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  image?: string; // base64 image data
  videoUrl?: string; // URL to a video
}

export interface ReferenceItem {
    id: string;
    keyword: string;
    description: string;
    imageUrl?: string; // base64 image data
    videoUrl?: string; // URL to a video file or stream
}

export interface TipInfo {
    message: string;
    paypalLink: string;
    bizumInfo: string;
    paymentQrCode: string; // base64 image data
}

// Configuration for a single tour guide's chat instance
export interface TourConfig {
    tourName: string;
    systemInstruction: string;
    references: ReferenceItem[];
}

export enum TourStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
}

export interface Tour {
    id: string;
    name: string;
    guideName: string;
    email: string;
    adminPassword: string;
    status: TourStatus;
    registrationDate: string; // ISO date string
    config: TourConfig;
    tipInfo: TipInfo;
}

export interface AppData {
    superAdminEmail: string;
    superAdminPassword: string;
    tours: Tour[];
    newsletterSubscribers: string[];
}