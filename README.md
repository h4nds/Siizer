# Image Resizer - Tauri + React + Rust


               
 heyy this is Siizer!! is a desktop application for resizing multiple images with using presets you can fine tune yourself!. Built with Tauri (Rust backend + React frontend) to learn Rust while building something useful. You define presets (name, width, height, format PNG/JPG/WebP, optional quality) in the PresetList, add images via drag-and-drop or file picker in the UploadArea, then choose which presets and files to useeee

## App Desgin 

1. **Structs** - Data structures (like TypeScript interfaces)
2. **Result<T, E>** - Explicit error handling (non exceptions!)
3. **Ownership & Borrowing** - Rust's lovely memory safety system 
4. **Pattern Matching** - Exhaustive `match` expressions
5. **Option<T>** - Handling nullable values safely
6. **Async/Await** - Modern async programming
7. **Error Propagation** - The `?` operator

-=-

### Prereqs

- **Node.js** (v18+) and npm
- **Rust** - Install from [rustup.rs](https://rustup.rs/)
- **System dependencies**:
  - **Linux**: `libwebkit2gtk-4.0-dev`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft C++ Build Tools


### Installation
- make sure rust is installed 
- install sys dependances (libwebkit here)
- confirm you have the latest verison of node running 

    **Run the app**:

   ```bash
   npm run tauri dev
   ```

## 📁 Project Structurized

```
image-resizer/
├── src/                    # React frontend (TypeScript)
│   ├── components/         # React components
│   ├── types.ts            # TypeScript type definitions
│   └── App.tsx             # Main app component
├── src-tauri/              # Rust backend
│   ├── src/
│   │   └── main.rs         # Rust code with learning comments!
│   ├── Cargo.toml          # Rust dependencies (like package.json)
│   └── tauri.conf.json     # Tauri configuration
└── package.json            # Node.js dependencies
```

##  How It Works

1. **Frontend (React)**: User creates presets, uploads images, selects what to export
2. **Bridge (Tauri)**: Frontend calls Rust functions via `invoke()`
3. **Backend (Rust)**: Processes images using the `image` crate, saves results
4. **Result**: Resized images saved to disk

##  whats happening 
   - When you click Export, the app asks for an output folder and, for each image and each selected preset, reads the file as bytes, calls the Rust command resize_image with that data plus the preset and output path, and the backend loads the image, resizes it with Lanczos3, and saves as PNG or JPEG (WebP currently falls back to PNG). You run it from the image-resizer folder with npm run tauri dev, with Node and the Rust toolchain installed.




