interface Props {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export default function UploadArea({ files, onFilesChange }: Props) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div style={{ background: "#2a2a2a", padding: "1.5rem", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "1rem" }}>Upload Images</h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed #555",
          borderRadius: "8px",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1rem",
          background: "#1a1a1a",
        }}
      >
        <p style={{ marginBottom: "1rem", color: "#aaa" }}>
          Drag and drop images here, or
        </p>
        <label
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#4a9eff",
            borderRadius: "4px",
            cursor: "pointer",
            color: "white",
          }}
        >
          Browse Files
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
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>Selected Files ({files.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {files.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem",
                  background: "#333",
                  borderRadius: "4px",
                }}
              >
                <span style={{ fontSize: "0.875rem" }}>{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    padding: "0.25rem 0.5rem",
                    background: "#ff4444",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
