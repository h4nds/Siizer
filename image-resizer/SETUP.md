# Quick Setup Guide

## Step 1: Install Rust

If you don't have Rust installed:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installation, restart your terminal or run:
```bash
source $HOME/.cargo/env
```

## Step 2: Install System Dependencies (Linux)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

## Step 3: Install Node Dependencies

```bash
cd /home/ray/Projects/image-resizer
npm install
```

## Step 4: Run the App

```bash
npm run tauri dev
```

This will:
1. Start the Vite dev server (React frontend)
2. Compile the Rust backend
3. Launch the Tauri window

**First run will take a few minutes** as Rust compiles all dependencies. Subsequent runs are much faster!

## 🦀 What You'll Learn About Rust

### 1. **Ownership & Borrowing** (`main.rs` lines 37-55)
- Rust tracks memory ownership at compile time
- `&image_data` creates a reference (borrow) - doesn't take ownership
- Prevents memory leaks and data races

### 2. **Result<T, E> Error Handling** (throughout `main.rs`)
- Functions return `Result<Success, Error>` instead of throwing exceptions
- The `?` operator propagates errors automatically
- You MUST handle errors - no silent failures!

### 3. **Pattern Matching** (`main.rs` lines 70-104)
- `match` expressions are exhaustive - compiler forces you to handle all cases
- Prevents bugs from forgetting edge cases

### 4. **Option<T>** (`main.rs` line 24, 81)
- `Option<u8>` = `Some(value)` or `None` (like nullable types)
- `.unwrap_or(default)` safely handles None case
- Compiler prevents null pointer exceptions

### 5. **Structs & Serde** (`main.rs` lines 19-25)
- `struct` defines data structures (like TypeScript interfaces)
- `#[derive(serde::Deserialize)]` auto-generates JSON parsing code
- Type-safe serialization between frontend and backend

## 🎯 Try This

1. **Add a preset**: Click "+ Add Preset", fill in dimensions (e.g., 1920x1080)
2. **Upload images**: Drag & drop some images
3. **Select presets**: Check the presets you want to use
4. **Export**: Click "Export" and choose a folder

Watch the console for Rust function calls and see how TypeScript ↔ Rust communication works!

## 🐛 Troubleshooting

**"OS file watch limit reached"** (Linux)
- Your system’s inotify watch limit is too low. Increase it:
  ```bash
  # Temporary (until reboot):
  sudo sysctl fs.inotify.max_user_watches=524288

  # Permanent:
  echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/99-inotify-watches.conf
  sudo sysctl -p /etc/sysctl.d/99-inotify-watches.conf
  ```
- Then run `npm run tauri dev` again.

**"Command not found: cargo"**
- Rust isn't installed or not in PATH. Run `source $HOME/.cargo/env`

**"Failed to compile"**
- Make sure you have all system dependencies installed
- Try `cargo clean` then rebuild

**"Port 1420 already in use"**
- Another process is using the port. Kill it or change port in `vite.config.ts`

## 📚 Next Steps

Once it's running:
1. Read through `src-tauri/src/main.rs` - every concept is explained!
2. Try modifying the Rust code (change image quality, add formats)
3. Add new features (image filters, batch rename, etc.)

Happy coding! 🚀
