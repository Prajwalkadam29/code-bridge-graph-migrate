
#ifndef TRANSFORMER_H
#define TRANSFORMER_H

#include "ast.h"
#include "graph.h"
#include <string>
#include <functional>
#include <memory>
#include <vector>
#include <unordered_map>

namespace codebridge {

// Abstract base class for transformation rules
class TransformationRule {
public:
    virtual ~TransformationRule() = default;
    
    // Returns true if the rule should be applied to this node
    virtual bool matches(const ASTNode* node) const = 0;
    
    // Apply the transformation to a node
    virtual std::unique_ptr<ASTNode> apply(const ASTNode* node) const = 0;
    
    // Get a description of the rule
    virtual std::string getDescription() const = 0;
    
    // Get source and target language constructs
    virtual std::string getSourceConstruct() const = 0;
    virtual std::string getTargetConstruct() const = 0;
    
    // Get confidence level (0-100)
    virtual int getConfidence() const = 0;
    
    // Can it be applied automatically?
    virtual bool isAutomated() const = 0;
};

// Class to class transformation rule
class ClassToInterfaceRule : public TransformationRule {
public:
    bool matches(const ASTNode* node) const override;
    std::unique_ptr<ASTNode> apply(const ASTNode* node) const override;
    std::string getDescription() const override;
    std::string getSourceConstruct() const override;
    std::string getTargetConstruct() const override;
    int getConfidence() const override;
    bool isAutomated() const override;
};

// Static methods to module functions transformation rule
class StaticMethodToFunctionRule : public TransformationRule {
public:
    bool matches(const ASTNode* node) const override;
    std::unique_ptr<ASTNode> apply(const ASTNode* node) const override;
    std::string getDescription() const override;
    std::string getSourceConstruct() const override;
    std::string getTargetConstruct() const override;
    int getConfidence() const override;
    bool isAutomated() const override;
};

// Main transformer class
class CodeTransformer {
public:
    CodeTransformer();
    
    // Add a transformation rule
    void addRule(std::unique_ptr<TransformationRule> rule);
    
    // Transform an AST using all rules
    std::unique_ptr<ASTNode> transform(const ASTNode* ast) const;
    
    // Transform a graph directly
    std::unique_ptr<CodeGraph> transformGraph(const CodeGraph* graph) const;
    
    // Get all available rules
    const std::vector<std::unique_ptr<TransformationRule>>& getRules() const;
    
    // Get transformation statistics
    struct TransformStats {
        int totalNodes;
        int transformedNodes;
        std::unordered_map<std::string, int> ruleApplicationCounts;
    };
    
    TransformStats getLastTransformStats() const;

private:
    std::vector<std::unique_ptr<TransformationRule>> rules_;
    mutable TransformStats lastStats_;
};

} // namespace codebridge

#endif // TRANSFORMER_H
