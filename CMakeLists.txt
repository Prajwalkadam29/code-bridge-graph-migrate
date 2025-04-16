
cmake_minimum_required(VERSION 3.10)
project(CodeBridge)

set(CMAKE_CXX_STANDARD 17)

# Add Emscripten-specific options
set(CMAKE_EXECUTABLE_SUFFIX ".js")

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/src/cpp)

# Source files
set(SOURCES
    src/cpp/ast.cpp
    src/cpp/graph.cpp
    src/cpp/transformer.cpp
    src/cpp/bridge.cpp
)

# Add executable
add_executable(codebridge ${SOURCES})

# Emscripten-specific link options
set_target_properties(codebridge PROPERTIES
    LINK_FLAGS "-s WASM=1 -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME=\"CreateCodeBridgeModule\" -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=\"['ccall', 'cwrap']\" -s EXPORTED_FUNCTIONS=\"['_malloc', '_free']\" -s ENVIRONMENT=\"web\"")

# Copy output to the project's public directory
add_custom_command(TARGET codebridge POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    ${CMAKE_BINARY_DIR}/codebridge.js
    ${CMAKE_SOURCE_DIR}/public/codebridge.js
    COMMAND ${CMAKE_COMMAND} -E copy
    ${CMAKE_BINARY_DIR}/codebridge.wasm
    ${CMAKE_SOURCE_DIR}/public/codebridge.wasm
)
