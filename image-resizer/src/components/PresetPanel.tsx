import { useState, useEffect, useRef } from "react";
import { Preset } from "../types";

const PANEL_WIDTH = 320;
const PANEL_HEIGHT = 380;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: formData.name,
      width: parseInt(formData.width, 10),
      height: parseInt(formData.height, 10),
      format: formData.format,
      quality: formData.format !== "png" ? parseInt(formData.quality, 10) : undefined,
    };
    onAddPreset(newPreset);
    setFormData(initialFormData);
    onClose();
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
        <form onSubmit={handleSubmit} className="preset-panel-form">
          <div className="form-group">
            <label className="preset-panel-label">Preset name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Instagram post, thumbnail"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="preset-panel-label">Output size (pixels)</label>
            <p className="preset-panel-hint">Images will be resized to exactly this width and height.</p>
            <div className="input-row">
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
          </div>
          <div className="form-group">
            <label className="preset-panel-label">File format</label>
            <p className="preset-panel-hint">PNG: lossless, best for graphics. JPG: smaller files, good for photos. WebP: modern, small and high quality.</p>
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
              <option value="png">PNG (lossless)</option>
              <option value="jpg">JPG (smaller files)</option>
              <option value="webp">WebP (modern)</option>
            </select>
          </div>
          {formData.format !== "png" && (
            <div className="form-group">
              <label className="preset-panel-label">Quality</label>
              <p className="preset-panel-hint">Higher = better quality and larger file. 80–90 is usually a good balance.</p>
              <input
                type="number"
                className="input"
                min={1}
                max={100}
                placeholder="1–100"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              />
            </div>
          )}
          <div className="form-actions preset-panel-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.name || !formData.width || !formData.height}
            >
              Add preset
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
