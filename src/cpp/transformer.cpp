#include "transformer.h"

namespace codebridge {

// ClassToInterfaceRule implementation
bool ClassToInterfaceRule::matches(const ASTNode* node) const {
    // Check if it's a class declaration and if it has no method implementations (only signatures)
    if (node->getType() != ASTNode::NodeType::CLASS_DECLARATION) {
        return false;
    }
    
    // In a real implementation, we would check if the class has only method signatures
    // For this example, we'll assume it matches
    return true;
}

std::unique_ptr<ASTNode> ClassToInterfaceRule::apply(const ASTNode* node) const {
    const auto* classDecl = static_cast<const ClassDeclaration*>(node);
    
    // Create a new "interface" class (in a real implementation, this would create a TypeScript interface)
    auto newClass = std::make_unique<ClassDeclaration>(classDecl->getName() + "Interface");
    
    // Copy fields as properties
    for (const auto& field : classDecl->getFields()) {
        newClass->addField(std::unique_ptr<VariableDeclaration>(
            static_cast<VariableDeclaration*>(field->clone().release())
        ));
    }
    
    // Copy methods as signatures
    for (const auto& method : classDecl->getMethods()) {
        newClass->addMethod(method->clone());
    }
    
    return newClass;
}

std::string ClassToInterfaceRule::getDescription() const {
    return "Converts Java classes to TypeScript interfaces when appropriate";
}

std::string ClassToInterfaceRule::getSourceConstruct() const {
    return "Java Class";
}

std::string ClassToInterfaceRule::getTargetConstruct() const {
    return "TypeScript Interface";
}

int ClassToInterfaceRule::getConfidence() const {
    return 95;
}

bool ClassToInterfaceRule::isAutomated() const {
    return true;
}

// StaticMethodToFunctionRule implementation
bool StaticMethodToFunctionRule::matches(const ASTNode* node) const {
    // Check if it's a function declaration inside a class and has static modifier
    // For this example, we'll assume it matches
    return node->getType() == ASTNode::NodeType::FUNCTION_DECLARATION;
}

std::unique_ptr<ASTNode> StaticMethodToFunctionRule::apply(const ASTNode* node) const {
    const auto* funcDecl = static_cast<const FunctionDeclaration*>(node);
    
    // Create a standalone function (in a real implementation, this would be a module function)
    auto newFunc = std::make_unique<FunctionDeclaration>(funcDecl->getName(), funcDecl->getReturnType());
    
    // Copy parameters
    for (const auto& param : funcDecl->getParameters()) {
        newFunc->addParameter(param.name, param.type);
    }
    
    // Copy body if it exists
    if (funcDecl->getBody()) {
        newFunc->setBody(funcDecl->getBody()->clone());
    }
    
    return newFunc;
}

std::string StaticMethodToFunctionRule::getDescription() const {
    return "Converts Java static methods to TypeScript module functions";
}

std::string StaticMethodToFunctionRule::getSourceConstruct() const {
    return "Static Method";
}

std::string StaticMethodToFunctionRule::getTargetConstruct() const {
    return "Module Function";
}

int StaticMethodToFunctionRule::getConfidence() const {
    return 90;
}

bool StaticMethodToFunctionRule::isAutomated() const {
    return true;
}

// CodeTransformer implementation
CodeTransformer::CodeTransformer() {
    // Initialize with default rules
    addRule(std::make_unique<ClassToInterfaceRule>());
    addRule(std::make_unique<StaticMethodToFunctionRule>());
}

void CodeTransformer::addRule(std::unique_ptr<TransformationRule> rule) {
    rules_.push_back(std::move(rule));
}

std::unique_ptr<ASTNode> CodeTransformer::transform(const ASTNode* ast) const {
    if (!ast) {
        return nullptr;
    }
    
    // Reset stats
    lastStats_ = TransformStats{0, 0};
    
    // Check if any rule applies to this node
    for (const auto& rule : rules_) {
        lastStats_.totalNodes++;
        
        if (rule->matches(ast)) {
            lastStats_.transformedNodes++;
            lastStats_.ruleApplicationCounts[rule->getDescription()]++;
            return rule->apply(ast);
        }
    }
    
    // No rule matched, clone the current node
    auto cloned = ast->clone();
    
    // Handle different node types for recursive transformation
    if (ast->getType() == ASTNode::NodeType::PROGRAM) {
        const auto* program = static_cast<const Program*>(ast);
        auto newProgram = std::unique_ptr<Program>(static_cast<Program*>(cloned.release()));
        
        // Clear children and add transformed versions
        newProgram = std::make_unique<Program>();
        for (const auto& child : program->getChildren()) {
            newProgram->addChild(transform(child.get()));
        }
        
        return newProgram;
    }
    else if (ast->getType() == ASTNode::NodeType::CLASS_DECLARATION) {
        const auto* classDecl = static_cast<const ClassDeclaration*>(ast);
        auto newClass = std::unique_ptr<ClassDeclaration>(
            static_cast<ClassDeclaration*>(cloned.release()));
        
        // Create a new class with transformed components
        newClass = std::make_unique<ClassDeclaration>(classDecl->getName());
        if (!classDecl->getBaseClass().empty()) {
            newClass->setBaseClass(classDecl->getBaseClass());
        }
        
        // Transform fields
        for (const auto& field : classDecl->getFields()) {
            auto transformed = transform(field.get());
            if (transformed->getType() == ASTNode::NodeType::VARIABLE_DECLARATION) {
                newClass->addField(std::unique_ptr<VariableDeclaration>(
                    static_cast<VariableDeclaration*>(transformed.release())
                ));
            }
        }
        
        // Transform methods
        for (const auto& method : classDecl->getMethods()) {
            newClass->addMethod(transform(method.get()));
        }
        
        return newClass;
    }
    
    // Default: return the cloned node unchanged
    return cloned;
}

std::unique_ptr<CodeGraph> CodeTransformer::transformGraph(const CodeGraph* graph) const {
    if (!graph) {
        return nullptr;
    }
    
    // Create a new graph
    auto newGraph = std::make_unique<CodeGraph>();
    
    // First, copy all nodes (potentially transforming them)
    for (const auto& node : graph->getNodes()) {
        const auto* astNode = node->getData();
        
        if (astNode) {
            // Try to transform the AST node
            auto transformedAST = transform(astNode);
            
            // Create a new graph node based on the transformed AST
            auto newNode = std::make_unique<GraphNode>(
                node->getId(),
                transformedAST ? "Transformed: " + node->getLabel() : node->getLabel(),
                node->getType()
            );
            
            // Copy properties
            for (const auto& [key, value] : node->getProperties()) {
                newNode->setProperty(key, value);
            }
            
            // Mark as transformed if applicable
            if (transformedAST) {
                newNode->setProperty("transformed", "true");
            }
            
            newGraph->addNode(std::move(newNode));
        }
        else {
            // No AST data, just copy the node
            auto newNode = std::make_unique<GraphNode>(
                node->getId(),
                node->getLabel(),
                node->getType()
            );
            
            // Copy properties
            for (const auto& [key, value] : node->getProperties()) {
                newNode->setProperty(key, value);
            }
            
            newGraph->addNode(std::move(newNode));
        }
    }
    
    // Then copy all edges
    for (const auto& edge : graph->getEdges()) {
        auto newEdge = std::make_unique<GraphEdge>(
            edge->getId(),
            edge->getSource(),
            edge->getTarget(),
            edge->getLabel()
        );
        
        // Copy properties
        for (const auto& [key, value] : edge->getProperties()) {
            newEdge->setProperty(key, value);
        }
        
        newGraph->addEdge(std::move(newEdge));
    }
    
    return newGraph;
}

const std::vector<std::unique_ptr<TransformationRule>>& CodeTransformer::getRules() const {
    return rules_;
}

CodeTransformer::TransformStats CodeTransformer::getLastTransformStats() const {
    return lastStats_;
}

} // namespace codebridge
