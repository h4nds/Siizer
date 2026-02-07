import { useState, useEffect } from "react";
import PresetList from "./components/PresetList";
import UploadArea from "./components/UploadArea";
import ExportQueue from "./components/ExportQueue";
import { Preset } from "./types";

type Theme = "light" | "dark";

function App() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const active = document.activeElement;
      const isInput = active && (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        (active as HTMLElement).isContentEditable
      );
      if (isInput) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const name = file.name || `pasted-${Date.now()}.${item.type.split("/")[1] || "png"}`;
            imageFiles.push(file.name ? file : new File([file], name, { type: file.type }));
          }
        }
      }
      if (imageFiles.length > 0) {
        e.preventDefault();
        setSelectedFiles((prev) => [...prev, ...imageFiles]);
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="app">
      <h1 className="app-title">Siizer</h1>
      <p className="app-tagline">Resize multiple images with presets you fine-tune.</p>

      <div className="app-grid">
        <div className="section">
          <PresetList
            presets={presets}
            onPresetsChange={setPresets}
            selectedPresets={selectedPresets}
            onSelectedPresetsChange={setSelectedPresets}
          />
        </div>

        <div className="section">
          <UploadArea
            files={selectedFiles}
            onFilesChange={setSelectedFiles}
          />
        </div>
      </div>

      {selectedFiles.length > 0 && selectedPresets.length > 0 && (
        <div className="app-export">
          <div className="section">
            <ExportQueue
              files={selectedFiles}
              presets={presets.filter((p) => selectedPresets.includes(p.id))}
            />
          </div>
        </div>
      )}

      <div className="theme-toggle">
        <div className="theme-toggle-inner">
          <button
            type="button"
            className={theme === "light" ? "is-active" : ""}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <button
            type="button"
            className={theme === "dark" ? "is-active" : ""}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
