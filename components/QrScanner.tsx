import React, { useRef, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.setAttribute('playsinline', 'true');
              videoRef.current.play();
            }
        } catch(err) {
            console.error("Error accessing camera: ", err);
            alert("Could not access the camera. Please ensure you have given permission.");
            onClose();
        }
    };
    
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        // Using JPEG for smaller file size
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageDataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-slate-800 p-4 rounded-lg shadow-xl w-full max-w-md">
        <video ref={videoRef} className="w-full h-auto rounded-md" playsInline />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
            <div className="w-2/3 h-1/2 border-4 border-dashed border-sky-400 rounded-lg opacity-75"></div>
        </div>
        <div className="mt-4 flex flex-col items-center">
            <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-sky-500 border-4 border-white shadow-lg hover:bg-sky-400 transition-colors"
                aria-label="Capture image"
            ></button>
            <p className="text-center text-white mt-3">Point at a reference and capture</p>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-slate-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-slate-700 transition-colors"
          aria-label="Close scanner"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;