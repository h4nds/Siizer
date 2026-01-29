# Image Resizer - Tauri + React + Rust

A desktop application for batch resizing images with custom presets. Built with Tauri (Rust backend + React frontend) to learn Rust while building something useful!

## 🦀 Learning Rust Concepts

This project teaches you Rust through practical application:

1. **Structs** - Data structures (like TypeScript interfaces)
2. **Result<T, E>** - Explicit error handling (no exceptions!)
3. **Ownership & Borrowing** - Rust's memory safety system
4. **Pattern Matching** - Exhaustive `match` expressions
5. **Option<T>** - Handling nullable values safely
6. **Async/Await** - Modern async programming
7. **Error Propagation** - The `?` operator

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+) and npm
- **Rust** - Install from [rustup.rs](https://rustup.rs/)
- **System dependencies**:
  - **Linux**: `libwebkit2gtk-4.0-dev`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft C++ Build Tools

### Installation

1. **Install Rust** (if not already installed):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Install system dependencies** (Linux):
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libayatana-appindicator3-dev librsvg2-dev
   ```

3. **Install Node dependencies**:
   ```bash
   cd image-resizer
   npm install
   ```

4. **Run the app**:
   ```bash
   npm run tauri dev
   ```

## 📁 Project Structure

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

## 🎯 How It Works

1. **Frontend (React)**: User creates presets, uploads images, selects what to export
2. **Bridge (Tauri)**: Frontend calls Rust functions via `invoke()`
3. **Backend (Rust)**: Processes images using the `image` crate, saves results
4. **Result**: Resized images saved to disk

## 🧠 Key Rust Concepts Explained

### 1. Ownership
Rust tracks who "owns" memory. When you pass a `String` to a function, ownership transfers. Use `&str` (reference) to borrow instead.

### 2. Result<T, E>
Functions return `Result<SuccessType, ErrorType>`. You MUST handle errors - no silent failures!

### 3. Pattern Matching
`match` expressions are exhaustive - you can't forget a case. This prevents bugs.

### 4. Option<T>
Like `null` in other languages, but safer. `Some(value)` or `None` - compiler forces you to handle both.

## 🛠️ Building for Production

```bash
npm run tauri build
```

This creates an executable in `src-tauri/target/release/`.

## 📚 Learning Resources

- [The Rust Book](https://doc.rust-lang.org/book/) - Official Rust tutorial
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/) - Learn by example
- [Tauri Docs](https://tauri.app/v1/guides/) - Tauri framework docs

## 🎓 Next Steps

Once you understand this codebase, try:
- Adding WebP support (requires `image-webp` crate)
- Implementing progress callbacks
- Adding image filters/effects
- Building a plugin system

Happy learning! 🦀
