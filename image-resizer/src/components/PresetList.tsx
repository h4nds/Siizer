import { useState } from "react";
import { Preset } from "../types";
import PresetPanel from "./PresetPanel";

interface Props {
  presets: Preset[];
  onPresetsChange: (presets: Preset[]) => void;
  selectedPresets: string[];
  onSelectedPresetsChange: (ids: string[]) => void;
}

export default function PresetList({
  presets,
  onPresetsChange,
  selectedPresets,
  onSelectedPresetsChange,
}: Props) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleAddPreset = (preset: Preset) => {
    onPresetsChange([...presets, preset]);
    setIsPanelOpen(false);
  };

  const handleTogglePreset = (id: string) => {
    if (selectedPresets.includes(id)) {
      onSelectedPresetsChange(selectedPresets.filter((p) => p !== id));
    } else {
      onSelectedPresetsChange([...selectedPresets, id]);
    }
  };

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Presets</h2>
        <button
          type="button"
          className="btn"
          onClick={() => setIsPanelOpen(true)}
        >
          Add preset
        </button>
      </div>

      <PresetPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAddPreset={handleAddPreset}
      />

      <div className="preset-list">
        {presets.length === 0 ? (
          <p className="empty-state">No presets. Add one to get started.</p>
        ) : (
          presets.map((preset) => (
            <label
              key={preset.id}
              className={`preset-item ${selectedPresets.includes(preset.id) ? "is-selected" : ""}`}
            >
              <input
                type="checkbox"
                checked={selectedPresets.includes(preset.id)}
                onChange={() => handleTogglePreset(preset.id)}
              />
              <div>
                <div className="preset-name">{preset.name}</div>
                <div className="preset-meta">
                  {preset.width}×{preset.height} · {preset.format.toUpperCase()}
                  {preset.quality != null && ` · ${preset.quality}%`}
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </>
  );
}
