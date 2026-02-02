import { useState } from "react";
import PresetList from "./components/PresetList";
import UploadArea from "./components/UploadArea";
import ExportQueue from "./components/ExportQueue";
import { Preset } from "./types";

function App() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

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
    </div>
  );
}

export default App;
