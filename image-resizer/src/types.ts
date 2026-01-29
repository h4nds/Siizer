export interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  format: "png" | "jpg" | "webp";
  quality?: number; // 1-100, for JPG/WebP
}

export interface ExportTask {
  file: File;
  preset: Preset;
  outputPath?: string;
}
