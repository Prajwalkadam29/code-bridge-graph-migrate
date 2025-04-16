
#ifndef BRIDGE_H
#define BRIDGE_H

#include <string>
#include <vector>
#include <emscripten/bind.h>
#include "ast.h"
#include "graph.h"
#include "transformer.h"

namespace codebridge {

// Simple wrapper class for JavaScript interop
class CodeBridge {
public:
    CodeBridge();
    
    // Parse source code to AST (simplified for this example)
    std::string parseJavaCode(const std::string& code);
    
    // Create a graph from AST
    std::string astToGraph(const std::string& astJson);
    
    // Transform a graph
    std::string transformGraph(const std::string& graphJson);
    
    // Get available transformation rules
    std::string getTransformationRules();
    
    // Apply specific transformation rule
    std::string applyTransformation(const std::string& graphJson, int ruleIndex);
    
    // Generate target language code
    std::string generateCode(const std::string& graphJson);
    
    // Get transformation stats
    std::string getTransformationStats();
    
private:
    std::unique_ptr<CodeTransformer> transformer_;
};

} // namespace codebridge

EMSCRIPTEN_BINDINGS(codebridge_module) {
    emscripten::class_<codebridge::CodeBridge>("CodeBridge")
        .constructor<>()
        .function("parseJavaCode", &codebridge::CodeBridge::parseJavaCode)
        .function("astToGraph", &codebridge::CodeBridge::astToGraph)
        .function("transformGraph", &codebridge::CodeBridge::transformGraph)
        .function("getTransformationRules", &codebridge::CodeBridge::getTransformationRules)
        .function("applyTransformation", &codebridge::CodeBridge::applyTransformation)
        .function("generateCode", &codebridge::CodeBridge::generateCode)
        .function("getTransformationStats", &codebridge::CodeBridge::getTransformationStats);
}

#endif // BRIDGE_H
