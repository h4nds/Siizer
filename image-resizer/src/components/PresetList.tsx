import { useState } from "react";
import { Preset } from "../types";

interface Props {
  presets: Preset[];
  onPresetsChange: (presets: Preset[]) => void;
  selectedPresets: string[];
  onSelectedPresetsChange: (ids: string[]) => void;
}

const initialFormData = {
  name: "",
  width: "",
  height: "",
  format: "png" as Preset["format"],
  quality: "90",
};

export default function PresetList({
  presets,
  onPresetsChange,
  selectedPresets,
  onSelectedPresetsChange,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);

  const handleAddPreset = () => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: formData.name,
      width: parseInt(formData.width),
      height: parseInt(formData.height),
      format: formData.format,
      quality: formData.format !== "png" ? parseInt(formData.quality) : undefined,
    };

    onPresetsChange([...presets, newPreset]);
    setFormData(initialFormData);
    setShowForm(false);
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
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add preset"}
        </button>
      </div>

      {showForm && (
        <div className="preset-form">
          <div className="form-group">
            <input
              type="text"
              className="input"
              placeholder="Preset name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group input-row">
            <input
              type="number"
              className="input"
              placeholder="Width"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
            />
            <input
              type="number"
              className="input"
              placeholder="Height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
          </div>
          <div className="form-group">
            <select
              className="select"
              value={formData.format}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  format: e.target.value as "png" | "jpg" | "webp",
                })
              }
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          {formData.format !== "png" && (
            <div className="form-group">
              <input
                type="number"
                className="input"
                min={1}
                max={100}
                placeholder="Quality (1–100)"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              />
            </div>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddPreset}
              disabled={!formData.name || !formData.width || !formData.height}
            >
              Add preset
            </button>
          </div>
        </div>
      )}

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
