// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn about Tauri commands at https://tauri.app/v1/guides/features/command

// This is our main function - entry point of the Rust program
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![resize_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// ============================================================================
// RUST CONCEPT #1: Structs (like TypeScript interfaces)
// ============================================================================
// In Rust, we define data structures with `struct`. This is similar to a
// TypeScript interface, but Rust structs can have methods attached to them.
// `#[derive(serde::Deserialize)]` automatically generates code to convert
// JSON from the frontend into this struct.
#[derive(serde::Deserialize)]
struct Preset {
    width: u32,   // u32 = unsigned 32-bit integer (0 to 4 billion)
    height: u32,
    format: String,  // String = owned string (heap-allocated)
    quality: Option<u8>,  // Option<T> = can be Some(value) or None (like null)
}

// ============================================================================
// RUST CONCEPT #2: Functions and Return Types
// ============================================================================
// Functions in Rust use `->` to specify return type.
// `Result<T, E>` is Rust's way of handling errors:
//   - Ok(value) = success
//   - Err(error) = failure
// This is better than exceptions because you MUST handle errors explicitly.
// `#[tauri::command]` makes this function callable from the frontend.

#[tauri::command]
async fn resize_image(
    // Rust concept: String = owned string (heap-allocated, can be modified)
    // Vec<u8> = vector of bytes (like Uint8Array in JS)
    image_data: Vec<u8>,
    output_path: String,
    preset: Preset,
) -> Result<String, String> {
    // ========================================================================
    // RUST CONCEPT #3: Error Handling with `?` operator
    // ========================================================================
    // The `?` operator is shorthand for:
    //   match result {
    //       Ok(value) => value,
    //       Err(e) => return Err(e.into()),
    //   }
    // It propagates errors up the call stack automatically.

    // ========================================================================
    // RUST CONCEPT #4: References and Borrowing
    // ========================================================================
    // `&image_data` creates a reference (borrow) to the Vec<u8>
    // This doesn't take ownership, just lets us read the data
    // Rust's borrow checker ensures memory safety at compile time
    
    // Load image from bytes (instead of file path)
    let img = image::load_from_memory(&image_data)
        .map_err(|e| format!("Failed to decode image: {}", e))?;

    // ========================================================================
    // RUST CONCEPT #5: Immutability by default
    // ========================================================================
    // Variables are immutable unless you use `mut`. Here `resized` is immutable
    // because we don't need to modify it after creation.
    let resized = img.resize_exact(
        preset.width, 
        preset.height, 
        image::imageops::FilterType::Lanczos3
    );

    // ========================================================================
    // RUST CONCEPT #6: Match expressions for control flow
    // ========================================================================
    // Match is exhaustive - you MUST handle all cases (or use _ for catch-all)
    // This prevents bugs from forgetting to handle a case!
    match preset.format.as_str() {
        "png" => {
            // ================================================================
            // RUST CONCEPT #7: Method chaining and error handling
            // ================================================================
            // `.map_err()` converts one error type to another
            // `?` propagates the error if it fails
            resized.save(&output_path)
                .map_err(|e| format!("Failed to save PNG: {}", e))?;
        }
        "jpg" | "jpeg" => {
            // ================================================================
            // RUST CONCEPT #8: Option unwrapping
            // ================================================================
            // `.unwrap_or(default)` returns the value if Some, or default if None
            // This is safe because we provide a fallback
            let quality = preset.quality.unwrap_or(90);
            
            // Convert to RGB8 for JPEG (JPEG doesn't support alpha channel)
            let rgb_img = resized.to_rgb8();
            
            // Save as JPEG
            rgb_img.save_with_format(&output_path, image::ImageFormat::Jpeg)
                .map_err(|e| format!("Failed to save JPEG: {}", e))?;
        }
        "webp" => {
            // WebP encoding requires additional crate (image-webp)
            // For now, we'll save as PNG as fallback
            resized.save(&output_path)
                .map_err(|e| format!("WebP not fully supported, saved as PNG: {}", e))?;
        }
        _ => {
            // ================================================================
            // RUST CONCEPT #9: Early returns with Err
            // ================================================================
            // We can return early from a function with an error
            return Err(format!("Unsupported format: {}", preset.format));
        }
    }

    // Return success message
    // Ok() wraps the success value in a Result
    Ok(format!("Successfully resized image to {}", output_path))
}
