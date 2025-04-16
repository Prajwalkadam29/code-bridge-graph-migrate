
#!/bin/bash
set -e

# Check if Emscripten SDK is in PATH
if ! command -v emcc &> /dev/null; then
    echo "Error: Emscripten SDK not found. Please install and activate it."
    echo "Visit https://emscripten.org/docs/getting_started/downloads.html for instructions."
    exit 1
fi

# Create build directory
mkdir -p wasm-build
cd wasm-build

# Configure with CMake
emcmake cmake ..

# Build
emmake make -j$(nproc)

# Copy output to public directory
mkdir -p ../public
cp codebridge.js ../public/
cp codebridge.wasm ../public/

echo "WebAssembly build completed successfully!"
