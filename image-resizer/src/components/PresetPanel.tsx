import { useState, useEffect, useRef } from "react";
import { Preset } from "../types";

const PANEL_WIDTH = 320;
const PANEL_HEIGHT = 380;

const QUICK_PRESETS: Omit<Preset, "id">[] = [
  { name: "Instagram post", width: 1080, height: 1080, format: "jpg", quality: 90 },
  { name: "Instagram story", width: 1080, height: 1920, format: "jpg", quality: 90 },
  { name: "Twitter/X post", width: 1200, height: 675, format: "jpg", quality: 90 },
  { name: "Thumbnail", width: 320, height: 240, format: "jpg", quality: 85 },
  { name: "Small", width: 640, height: 480, format: "jpg", quality: 85 },
  { name: "HD", width: 1920, height: 1080, format: "jpg", quality: 90 },
  { name: "PNG icon", width: 256, height: 256, format: "png" },
  { name: "WebP photo", width: 1200, height: 800, format: "webp", quality: 85 },
];

const initialFormData = {
  name: "",
  width: "",
  height: "",
  format: "png" as Preset["format"],
  quality: "90",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddPreset: (preset: Preset) => void;
}

function nextId(): string {
  return Date.now().toString();
}

export default function PresetPanel({ isOpen, onClose, onAddPreset }: Props) {
  const [formData, setFormData] = useState(initialFormData);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, panelX: 0, panelY: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPosition({
        x: Math.max(0, window.innerWidth / 2 - PANEL_WIDTH / 2),
        y: Math.max(0, window.innerHeight / 2 - PANEL_HEIGHT / 2),
      });
      setFormData(initialFormData);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newX = dragStartRef.current.panelX + dx;
      const newY = dragStartRef.current.panelY + dy;
      const maxX = window.innerWidth - PANEL_WIDTH;
      const maxY = window.innerHeight - PANEL_HEIGHT;
      setPosition({
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panelX: position.x,
      panelY: position.y,
    };
    setIsDragging(true);
  };

  const addQuickPreset = (p: Omit<Preset, "id">) => {
    onAddPreset({ ...p, id: nextId() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPreset: Preset = {
      id: nextId(),
      name: formData.name,
      width: parseInt(formData.width, 10),
      height: parseInt(formData.height, 10),
      format: formData.format,
      quality: formData.format !== "png" ? parseInt(formData.quality, 10) : undefined,
    };
    onAddPreset(newPreset);
    setFormData(initialFormData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="preset-panel-backdrop"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        className="preset-panel open"
        style={{ left: position.x, top: position.y }}
        role="dialog"
        aria-labelledby="preset-panel-title"
      >
        <div
          className="preset-panel-title"
          onMouseDown={handleTitleMouseDown}
        >
          <span id="preset-panel-title">New preset</span>
          <button
            type="button"
            className="preset-panel-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="preset-panel-form">
          <div className="preset-panel-quick">
            <span className="preset-panel-label">Quick add</span>
            <div className="preset-panel-quick-grid">
              {QUICK_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  className="preset-panel-quick-btn"
                  onClick={() => addQuickPreset(p)}
                >
                  {p.name}
                  <span className="preset-panel-quick-size">{p.width}×{p.height}</span>
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="preset-panel-custom">
            <span className="preset-panel-label">Custom</span>
            <div className="form-group input-row">
              <input
                type="text"
                className="input"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder="W"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder="H"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div className="form-group preset-panel-custom-row">
              <select
                className="select"
                value={formData.format}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    format: e.target.value as Preset["format"],
                  })
                }
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
              </select>
              {formData.format !== "png" && (
                <input
                  type="number"
                  className="input"
                  min={1}
                  max={100}
                  placeholder="Quality"
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  style={{ width: "5rem" }}
                />
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!formData.name || !formData.width || !formData.height}
              >
                Add
              </button>
            </div>
          </form>
          <div className="preset-panel-actions">
            <button type="button" className="btn" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
