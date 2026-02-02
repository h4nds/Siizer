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

        const arrayBuffer = await file.arrayBuffer();
        const imageData = Array.from(new Uint8Array(arrayBuffer));

        for (let j = 0; j < presets.length; j++) {
          const preset = presets[j];
          completed++;

          setExportProgress(
            `Processing ${file.name} → ${preset.name} (${completed}/${total})`
          );

          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const extension = preset.format === "jpg" ? "jpeg" : preset.format;
          const outputFileName = `${baseName}_${preset.name.replace(/\s+/g, "_")}_${preset.width}x${preset.height}.${extension}`;
          const outputPath = `${basePath}/${outputFileName}`;

          try {
            await invoke<string>("resize_image", {
              imageData,
              outputPath,
              preset: {
                width: preset.width,
                height: preset.height,
                format: preset.format,
                quality: preset.quality,
              },
            });
          } catch (error) {
            console.error(`Error processing ${file.name} with ${preset.name}:`, error);
            setExportProgress(`Error: ${error}. Continuing...`);
          }
        }
      }

      setExportProgress(`Done. ${completed} files saved to ${basePath}`);
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
    <>
      <h2 className="section-title">
        Export · {totalExports} file{totalExports !== 1 ? "s" : ""}
      </h2>

      <div className="queue-list">
        {files.map((file, fileIdx) => (
          <div key={fileIdx} className="queue-file">
            <div className="queue-file-name">{file.name}</div>
            <div className="queue-presets">
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
        type="button"
        className="btn btn-primary export-btn"
        onClick={handleExport}
        disabled={isExporting || totalExports === 0}
      >
        {isExporting ? "Exporting…" : `Export ${totalExports} file${totalExports !== 1 ? "s" : ""}`}
      </button>

      {exportProgress && (
        <div className="progress-message">{exportProgress}</div>
      )}
    </>
  );
}
