import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import Icon from './Icon';

interface QRCodeGeneratorProps {
    text: string;
    filename: string;
    label: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ text, filename, label }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!text) {
            setQrCodeUrl('');
            return;
        }

        QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H', // High error correction
            margin: 2,
            width: 256,
            color: {
              dark: '#0f172a', // slate-900
              light: '#ffffff'
            }
        })
            .then(url => {
                setQrCodeUrl(url);
                setError('');
            })
            .catch(err => {
                console.error(err);
                setError('Could not generate QR code.');
            });
    }, [text]);

    const handleDownload = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (error) {
        return <p className="text-red-500 text-sm">{error}</p>;
    }
    
    if (!qrCodeUrl) {
        return (
            <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg w-48 h-48">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-slate-400"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <img src={qrCodeUrl} alt={label} className="w-48 h-48" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">{label}</p>
            <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-500 transition-colors"
            >
                <Icon name="download" className="w-5 h-5 mr-2" />
                Download QR Code
            </button>
        </div>
    );
};

export default QRCodeGenerator;