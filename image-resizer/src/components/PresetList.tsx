import { useState } from "react";
import { Preset } from "../types";

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
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    width: "",
    height: "",
    format: "png" as const,
    quality: "90",
  });

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
    setFormData({
      name: "",
      width: "",
      height: "",
      format: "png",
      quality: "90",
    });
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
    <div style={{ background: "#2a2a2a", padding: "1.5rem", borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Export Presets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "0.5rem 1rem",
            background: "#4a9eff",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ Add Preset"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "1rem", padding: "1rem", background: "#1a1a1a", borderRadius: "4px" }}>
          <input
            type="text"
            placeholder="Preset name (e.g., Instagram Post)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              background: "#333",
              border: "1px solid #555",
              borderRadius: "4px",
              color: "#e0e0e0",
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              type="number"
              placeholder="Width"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              style={{
                padding: "0.5rem",
                background: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "#e0e0e0",
              }}
            />
            <input
              type="number"
              placeholder="Height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              style={{
                padding: "0.5rem",
                background: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "#e0e0e0",
              }}
            />
          </div>
          <select
            value={formData.format}
            onChange={(e) =>
              setFormData({
                ...formData,
                format: e.target.value as "png" | "jpg" | "webp",
              })
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              background: "#333",
              border: "1px solid #555",
              borderRadius: "4px",
              color: "#e0e0e0",
            }}
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WebP</option>
          </select>
          {formData.format !== "png" && (
            <input
              type="number"
              min="1"
              max="100"
              placeholder="Quality (1-100)"
              value={formData.quality}
              onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                background: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "#e0e0e0",
              }}
            />
          )}
          <button
            onClick={handleAddPreset}
            disabled={!formData.name || !formData.width || !formData.height}
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "#4a9eff",
              border: "none",
              borderRadius: "4px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add Preset
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {presets.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic" }}>
            No presets yet. Add one to get started!
          </p>
        ) : (
          presets.map((preset) => (
            <label
              key={preset.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem",
                background: selectedPresets.includes(preset.id) ? "#3a3a3a" : "#333",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selectedPresets.includes(preset.id)}
                onChange={() => handleTogglePreset(preset.id)}
                style={{ marginRight: "0.75rem" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{preset.name}</div>
                <div style={{ fontSize: "0.875rem", color: "#aaa" }}>
                  {preset.width}×{preset.height} • {preset.format.toUpperCase()}
                  {preset.quality && ` • ${preset.quality}% quality`}
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
