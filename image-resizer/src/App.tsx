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
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>
        Image Resizer
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <PresetList
            presets={presets}
            onPresetsChange={setPresets}
            selectedPresets={selectedPresets}
            onSelectedPresetsChange={setSelectedPresets}
          />
        </div>

        <div>
          <UploadArea
            files={selectedFiles}
            onFilesChange={setSelectedFiles}
          />
        </div>
      </div>

      {selectedFiles.length > 0 && selectedPresets.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <ExportQueue
            files={selectedFiles}
            presets={presets.filter((p) => selectedPresets.includes(p.id))}
          />
        </div>
      )}
    </div>
  );
}

export default App;
