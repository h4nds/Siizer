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

  return (
    <div className="app">
      <h1 className="app-title">Image Resizer</h1>

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
  );
}

export default App;
