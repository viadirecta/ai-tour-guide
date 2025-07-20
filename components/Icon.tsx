
import React from 'react';

interface IconProps {
  name: 'user' | 'gemini' | 'send' | 'copy' | 'camera' | 'settings' | 'delete' | 'add' | 'save' | 'upload' | 'download' | 'walking' | 'tip' | 'paypal' | 'x-circle' | 'system' | 'sun' | 'moon' | 'desktop' | 'qrcode' | 'book';
  className?: string;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
);
const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2.5 2.5 0 0 1 2.47 2.13l.38 2.37a7.5 7.5 0 0 1 5.02 5.02l2.37.38A2.5 2.5 0 0 1 22 12a2.5 2.5 0 0 1-2.13 2.47l-2.37.38a7.5 7.5 0 0 1-5.02 5.02l-.38 2.37A2.5 2.5 0 0 1 12 22a2.5 2.5 0 0 1-2.47-2.13l-.38-2.37a7.5 7.5 0 0 1-5.02-5.02l-2.37-.38A2.5 2.5 0 0 1 2 12a2.5 2.5 0 0 1 2.13-2.47l2.37-.38a7.5 7.5 0 0 1 5.02-5.02l.38-2.37A2.5 2.5 0 0 1 12 2Z" /></svg>
);
const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
);
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 10.5h5.2v-1H9.4v1zM12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6.5 6H5.5c-.28 0-.5.22-.5.5s.22.5.5.5h13c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zm0 2H5.5c-.28 0-.5.22-.5.5s.22.5.5.5h13c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zm1-5H4.5C3.12 13 2 14.12 2 15.5V21c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-5.5c0-1.38-1.12-2.5-2.5-2.5zM20 20H4v-4.5c0-.83.67-1.5 1.5-1.5h13c.83 0 1.5.67 1.5 1.5V20z"/></svg>
);
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
);
const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
);
const AddIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
);
const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
);
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
);
const WalkingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>
);
const TipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9.5v-2H11v2zm.5-3.5c0 .55-.45 1-1 1h-1c-.55 0-1-.45-1-1V9.5c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v3zm2.5 3.5H13v-2h1.5v2zm-1-5.04c.04.03.06.04.1.04.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5s-.5.2-.5.5v2.79c-.15.11-.31.2-.49.25-.33.09-.68.03-1-.18-.51-.33-.78-.92-.7-1.54.09-.7.63-1.29 1.33-1.44.82-.18 1.63.14 2.08.8.24.34.38.75.38 1.18v3.5c0 .55-.45 1-1 1s-1-.45-1-1v-.96z"/></svg>
);
const PaypalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.45 6.94h6.3c.51 0 .92.42.82.93l-1.3 7.45c-.07.4-.44.7-.84.7H7.13c-.51 0-.92-.42-.82-.93l1.3-7.45c.08-.41.44-.7.84-.7zm.9 1.25L8.2 13.9h3.28l.57-3.26H9.35zM17.33 8.3l-.22 1.31c-.07.4-.44.7-.84.7h-1.33l-.19 1.07h2.17c.51 0 .92.42.82.93l-.26 1.5c-.07.4-.44.7-.84.7h-2.34l-.4 2.27c-.08.41-.45.71-.86.71H6.87c-.51 0-.92-.42-.82-.93l2.08-11.86c.07-.4.44-.7.84-.7h5.05c1.03 0 1.54.2 1.83.79.2.4.22.84.02 1.25z"/></svg>
);
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
);
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM4.93 4.93c-.78-.78-2.05-.78-2.83 0s-.78 2.05 0 2.83l1.41 1.41c.78.78 2.05.78 2.83 0s.78-2.05 0-2.83L4.93 4.93zm14.14 14.14c-.78-.78-2.05-.78-2.83 0s-.78 2.05 0 2.83l1.41 1.41c.78.78 2.05.78 2.83 0s.78-2.05 0-2.83l-1.41-1.41zM4.93 19.07c.78-.78.78-2.05 0-2.83L3.51 14.83c-.78-.78-2.05-.78-2.83 0s-.78 2.05 0 2.83l1.42 1.41c.78.78 2.05.78 2.83 0zM19.07 4.93c.78-.78.78-2.05 0-2.83l-1.41-1.41c-.78-.78-2.05-.78-2.83 0s-.78 2.05 0 2.83l1.41 1.41c.78.78 2.05.78 2.83 0z"/></svg>
);
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C6.01 21.5 7.7 22 9.5 22c5.52 0 10-4.48 10-10S15.02 2 9.5 2z"/></svg>
);
const DesktopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
);
const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 8h8v8h-8v-8zm2 2v4h4v-4h-4z"/></svg>
);
const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5C5.33 4.5 4.11 4.65 3 5V19c1.11.35 2.33.5 3.5.5 1.95 0 4.05-.4 5.5-1.5 1.45 1.1 3.55 1.5 5.5 1.5 1.17 0 2.39-.15 3.5-.5V5zM21 18.5c-.9.35-1.8.5-2.5.5-1.45 0-3.35-.6-4.5-1.5V6.5c1.15-.9 3.05-1.5 4.5-1.5.7 0 1.6.15 2.5.5v13z"/></svg>
);


const Icon: React.FC<IconProps> = ({ name, className }) => {
  switch (name) {
    case 'user': return <UserIcon className={className} />;
    case 'gemini': return <GeminiIcon className={className} />;
    case 'system': return <SettingsIcon className={className} />;
    case 'send': return <SendIcon className={className} />;
    case 'copy': return <CopyIcon className={className} />;
    case 'camera': return <CameraIcon className={className} />;
    case 'settings': return <SettingsIcon className={className} />;
    case 'delete': return <DeleteIcon className={className} />;
    case 'add': return <AddIcon className={className} />;
    case 'save': return <SaveIcon className={className} />;
    case 'upload': return <UploadIcon className={className} />;
    case 'download': return <DownloadIcon className={className} />;
    case 'walking': return <WalkingIcon className={className} />;
    case 'tip': return <TipIcon className={className} />;
    case 'paypal': return <PaypalIcon className={className} />;
    case 'x-circle': return <XCircleIcon className={className} />;
    case 'sun': return <SunIcon className={className} />;
    case 'moon': return <MoonIcon className={className} />;
    case 'desktop': return <DesktopIcon className={className} />;
    case 'qrcode': return <QrCodeIcon className={className} />;
    case 'book': return <BookIcon className={className} />;
    default: return null;
  }
};

export default Icon;
