import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FiCamera, FiCircle } from 'react-icons/fi';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  disabled?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  disabled = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  // Effect to handle video stream once it's set
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      console.log('useEffect: Setting video srcObject');
      videoRef.current.srcObject = stream;
      
      videoRef.current.onloadedmetadata = () => {
        console.log('useEffect: Video metadata loaded');
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      };
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      console.log('Camera access granted, stream tracks:', mediaStream.getTracks().length);
      
      // Just set the stream and let useEffect handle the video setup
      setStream(mediaStream);
      setIsStreaming(true);
      
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setError(`Camera error: ${error.message || 'Unable to access camera'}`);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-image.jpg', {
              type: 'image/jpeg',
            });
            onCapture(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  }, [onCapture, stopCamera]);

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <div className="relative bg-black rounded-lg overflow-hidden min-h-64">
        {isStreaming ? (
          <>
            <div className="bg-green-100 p-2 text-sm text-green-800">
              Camera Status: {stream ? 'Stream Active' : 'No Stream'} | Tracks: {stream?.getTracks().length || 0}
            </div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              controls={false}
              className="w-full h-64 bg-gray-800"
              style={{ 
                display: 'block',
                objectFit: 'cover',
                transform: 'scaleX(-1)'
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={capturePhoto}
                className="bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiCircle className="w-6 h-6" />
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-100">
            <button
              onClick={startCamera}
              disabled={disabled}
              className="flex flex-col items-center space-y-2 p-6 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCamera className="w-8 h-8" />
              <span className="font-medium">Start Camera</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;