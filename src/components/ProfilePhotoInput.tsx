import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Camera, Upload, X } from 'lucide-react';

interface ProfilePhotoInputProps {
  previewUrl: string | null;
  onPhotoSelect: (file: File) => void;
  onClear?: () => void;
}

const ProfilePhotoInput: React.FC<ProfilePhotoInputProps> = ({
  previewUrl,
  onPhotoSelect,
  onClear
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start camera stream
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Explicitly try to play after setting srcObject
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.error("Error playing video:", playError);
        }
      }
      
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions or try uploading a photo instead.");
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current) {
      // Make sure we have valid dimensions
      const width = videoRef.current.videoWidth || 640;
      const height = videoRef.current.videoHeight || 480;
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current.readyState === 4) { // Make sure video is ready
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onPhotoSelect(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      } else {
        console.error("Video not ready for capture");
      }
    }
  };

  // Handle file selection from file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onPhotoSelect(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear the selected photo
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {showCamera ? (
        <div className="w-full max-w-md flex flex-col items-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            onLoadedMetadata={(e) => (e.target as HTMLVideoElement).play()}
            className="w-64 h-64 rounded-lg bg-black object-cover mb-3"
          />
          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={capturePhoto}
              className="bg-green-600 hover:bg-green-700"
            >
              <Camera size={16} className="mr-2" /> Capture
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={stopCamera}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-32 h-32 rounded-full overflow-hidden relative mb-3 flex items-center justify-center bg-gray-200">
            {previewUrl ? (
              <>
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover" 
                />
                <button 
                  type="button"
                  onClick={handleClear}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <Camera size={32} className="text-gray-400" />
            )}
          </div>

          <div className="flex gap-2 mb-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={startCamera}
              className="flex items-center gap-1"
            >
              <Camera size={16} /> Take Photo
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={triggerFileInput}
              className="flex items-center gap-1"
            >
              <Upload size={16} /> Upload
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default ProfilePhotoInput;