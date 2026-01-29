import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { Preset } from "../types";

interface Props {
  files: File[];
  presets: Preset[];
}

export default function ExportQueue({ files, presets }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress("Select output folder...");

    try {
      // Ask user where to save files (select directory)
      const selectedDir = await open({
        directory: true,
        multiple: false,
        title: "Select folder to save resized images",
      });

      if (!selectedDir || typeof selectedDir !== "string") {
        setIsExporting(false);
        setExportProgress("");
        return;
      }

      const basePath = selectedDir.replace(/\\/g, "/");
      setExportProgress("Starting export...");

      let completed = 0;
      const total = files.length * presets.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Read file as array buffer and convert to number array for Rust
        const arrayBuffer = await file.arrayBuffer();
        const imageData = Array.from(new Uint8Array(arrayBuffer));

        for (let j = 0; j < presets.length; j++) {
          const preset = presets[j];
          completed++;
          
          setExportProgress(
            `Processing ${file.name} → ${preset.name} (${completed}/${total})`
          );

          // Generate output filename
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const extension = preset.format === "jpg" ? "jpeg" : preset.format;
          const outputFileName = `${baseName}_${preset.name.replace(/\s+/g, "_")}_${preset.width}x${preset.height}.${extension}`;
          const outputPath = `${basePath}/${outputFileName}`;

          try {
            // Call Rust backend to resize image
            // The invoke function automatically serializes our JavaScript objects to JSON
            // and sends them to Rust, which deserializes them into the Preset struct
            const result = await invoke<string>("resize_image", {
              imageData: imageData,
              outputPath: outputPath,
              preset: {
                width: preset.width,
                height: preset.height,
                format: preset.format,
                quality: preset.quality,
              },
            });

            console.log(result);
          } catch (error) {
            console.error(`Error processing ${file.name} with ${preset.name}:`, error);
            setExportProgress(`Error: ${error}. Continuing...`);
          }
        }
      }

      setExportProgress(`Export complete! ${completed} files created in ${basePath}`);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress("");
      }, 3000);
    } catch (error) {
      console.error("Export error:", error);
      setExportProgress(`Error: ${error}`);
      setIsExporting(false);
    }
  };

  const totalExports = files.length * presets.length;

  return (
    <div style={{ background: "#2a2a2a", padding: "1.5rem", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        Export Queue ({totalExports} files will be created)
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        {files.map((file, fileIdx) => (
          <div key={fileIdx} style={{ marginBottom: "0.5rem" }}>
            <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
              {file.name}
            </div>
            <div style={{ paddingLeft: "1rem", fontSize: "0.875rem", color: "#aaa" }}>
              {presets.map((preset) => (
                <div key={preset.id}>
                  → {preset.name} ({preset.width}×{preset.height}.{preset.format})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting || totalExports === 0}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: isExporting ? "#555" : "#4a9eff",
          border: "none",
          borderRadius: "4px",
          color: "white",
          cursor: isExporting ? "not-allowed" : "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        {isExporting ? "Exporting..." : `Export ${totalExports} Files`}
      </button>

      {exportProgress && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "#1a1a1a",
            borderRadius: "4px",
            fontSize: "0.875rem",
            color: "#aaa",
          }}
        >
          {exportProgress}
        </div>
      )}
    </div>
  );
}
