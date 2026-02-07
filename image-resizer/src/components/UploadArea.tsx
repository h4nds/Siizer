import { useState, useRef, useEffect } from "react";

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

interface Props {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export default function UploadArea({ files, onFilesChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const urlsRef = useRef<Record<string, string>>({});

  const getUrl = (file: File): string => {
    const key = fileKey(file);
    if (!urlsRef.current[key]) {
      urlsRef.current[key] = URL.createObjectURL(file);
    }
    return urlsRef.current[key];
  };

  useEffect(() => {
    const current = urlsRef.current;
    return () => {
      Object.values(current).forEach(URL.revokeObjectURL);
      Object.keys(current).forEach((k) => delete current[k]);
    };
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );
    onFilesChange([...files, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/")
      );
      onFilesChange([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    const file = files[index];
    const key = fileKey(file);
    const url = urlsRef.current[key];
    if (url) {
      URL.revokeObjectURL(url);
      delete urlsRef.current[key];
    }
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <>
      <h2 className="section-title">Images</h2>

      <div
        className={`dropzone ${isDragging ? "dragover" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <p className="dropzone-text">Drop images here, paste (Ctrl+V), or</p>
        <label className="btn btn-primary">
          Browse
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={fileKey(file)} className="file-item">
              <img
                src={getUrl(file)}
                alt={file.name}
                className="file-item-thumb"
              />
              <span className="file-item-name">{file.name}</span>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeFile(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
