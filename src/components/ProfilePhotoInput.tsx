import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';

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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up function to stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Function to stop the camera stream
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Setup video element when showCamera changes
  useEffect(() => {
    if (showCamera && videoRef.current && !videoReady) {
      initializeCamera();
    }
    
    if (!showCamera) {
      stopCameraStream();
      setVideoReady(false);
    }
  }, [showCamera]);

  // Initialize camera with retry logic
  const initializeCamera = async () => {
    try {
      stopCameraStream();
      setCameraError(null);
      setVideoReady(false);
      
      console.log("Initializing camera, attempt:", retryCount + 1);
      
      // Request camera with specific constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      // Store the stream in the ref for cleanup
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      if (videoRef.current) {
        // Remove any old listeners
        const videoElement = videoRef.current;
        videoElement.onloadedmetadata = null;
        videoElement.onloadeddata = null;
        videoElement.onerror = null;
        
        // Need to set to null first to ensure a new stream is attached
        videoElement.srcObject = null;
        
        // Add new listeners
        videoElement.onloadeddata = () => {
          console.log("Video loaded data");
          setVideoReady(true);
        };
        
        videoElement.onloadedmetadata = () => {
          console.log("Video loaded metadata");
          videoElement.play().catch(err => {
            console.error("Error playing video:", err);
            setCameraError("Could not play camera stream. Please try again.");
          });
        };
        
        videoElement.onerror = (e) => {
          console.error("Video error:", e);
          setCameraError("Camera error occurred. Please try again.");
        };
        
        // Set the stream
        videoElement.srcObject = mediaStream;
        
        // For Safari and iOS support
        if (videoElement.paused) {
          videoElement.play().catch(err => {
            console.error("Initial play error:", err);
          });
        }
      }
      
      // Set a timeout to check if video is displaying
      setTimeout(() => {
        if (videoRef.current && !videoReady) {
          if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
            console.log("Video dimensions not available after timeout");
            setCameraError("Camera stream not ready. Please try the retry button.");
          }
        }
      }, 3000);
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(`Camera access error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setVideoReady(false);
    }
  };

  // Start camera stream
  const startCamera = async () => {
    setShowCamera(true);
    setRetryCount(0);
  };

  // Stop camera stream and hide camera UI
  const stopCamera = () => {
    stopCameraStream();
    setShowCamera(false);
    setCameraError(null);
    setVideoReady(false);
  };

  // Retry camera initialization
  const retryCamera = () => {
    setRetryCount(prevCount => prevCount + 1);
    initializeCamera();
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !videoReady) {
      setCameraError("Camera not ready. Please wait or try again.");
      return;
    }
    
    const videoElement = videoRef.current;
    
    // Check that we have a valid video stream with dimensions
    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      setCameraError("Cannot capture - no video dimensions available.");
      return;
    }
    
    try {
      // Get video dimensions
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;
      
      // Create canvas and draw the video frame
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the current video frame to the canvas
        ctx.drawImage(videoElement, 0, 0, width, height);
        
        // Convert canvas to a blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a file from the blob
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onPhotoSelect(file);
            stopCamera();
          } else {
            setCameraError("Failed to create image from camera. Please try again.");
          }
        }, 'image/jpeg', 0.9);
      } else {
        setCameraError("Could not create canvas context for photo capture.");
      }
    } catch (err) {
      console.error("Error capturing photo:", err);
      setCameraError("Error capturing photo. Please try again.");
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
          {cameraError && (
            <div className="mb-3 text-red-500 text-sm p-2 bg-red-50 rounded-md w-full text-center">
              {cameraError}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={retryCamera}
                className="ml-2 bg-white"
              >
                <RefreshCw size={16} className="mr-1" /> Retry
              </Button>
            </div>
          )}
          
          <div className="relative w-64 h-64 rounded-lg bg-black mb-3">
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className={`w-full h-full rounded-lg object-cover ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              style={{transform: 'scaleX(-1)'}} // Mirror the camera
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={capturePhoto}
              className="bg-green-600 hover:bg-green-700"
              disabled={!videoReady}
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