import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import getCroppedImg from "@/Profile/cropImage";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

interface ProfilePicEditorProps {
  name: string;
}

const ProfilePicEditor: React.FC<ProfilePicEditorProps> = ({ name }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null); // raw uploaded image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null); // final image
  const [isEditing, setIsEditing] = useState(false);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleEnterEdit = () => {
    setIsEditing(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = useCallback(async () => {
    if (!imageSrc) {
      setIsEditing(false); // just exit edit mode if nothing was changed
      return;
    }
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(cropped as string);
      setImageSrc(null);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleDelete = () => {
    setCroppedImage(null);
    setImageSrc(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Edit Mode */}
      {isEditing ? (
        <>
          <div className="relative w-72 h-72 rounded-full overflow-hidden bg-gray-200">
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : croppedImage ? (
              <img
                src={croppedImage}
                alt="Current Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold bg-linkedout-blue">
                {getInitials(name)}
              </div>
            )}
          </div>

          {/* Zoom only if there's a new image being cropped */}
          {imageSrc && (
            <div className="w-60">
              <label className="block text-sm mb-1">Zoom</label>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(_, value) => setZoom(value as number)}
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-linkedout-blue text-white rounded"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload New
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        // Preview mode — click to edit
        <div
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-white cursor-pointer bg-linkedout-blue flex items-center justify-center text-white text-2xl font-bold"
          onClick={handleEnterEdit}
        >
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{getInitials(name)}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePicEditor;
