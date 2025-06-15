
import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import clsx from "clsx";

type Props = {
  onImageUpload: (file: File) => void;
  uploading: boolean;
};

const MedicineDropzone: React.FC<Props> = ({ onImageUpload, uploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || !files[0]) return;
    const file = files[0];
    // Only allow image files
    if (!file.type.startsWith("image/")) {
      alert("Upload an image file only!");
      return;
    }
    onImageUpload(file);
  }

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center h-64 w-full max-w-lg mx-auto px-6 rounded-2xl transition-colors duration-300 border-2 border-dashed cursor-pointer hover:shadow-xl",
        dragActive
          ? "border-cyan-400 bg-cyan-50/80"
          : "border-muted hover:border-cyan-300 bg-white/60"
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDragEnd={e => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={e => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer?.files);
      }}
      role="button"
      aria-label="Upload or drag & drop medicine image"
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={e => handleFiles(e.target.files)}
        disabled={uploading}
      />
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <UploadCloud size={48} className={clsx(
          "transition-transform duration-300",
          dragActive ? "scale-110 text-cyan-500" : "text-cyan-400"
        )} />
        <span className="text-lg font-semibold text-cyan-800/90 select-none">
          {uploading && !dragActive
            ? "Analyzing image..."
            : dragActive
              ? "Drop your image here!"
              : "Drag & Drop or Click to Upload"}
        </span>
        <span className="text-xs text-muted-foreground font-mono tracking-wide">
          jpg, jpeg, png, webp &bull; Max 5MB
        </span>
      </div>
    </div>
  );
};

export default MedicineDropzone;
