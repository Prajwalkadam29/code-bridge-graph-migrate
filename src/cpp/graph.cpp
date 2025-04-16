
#include "graph.h"
#include "ast.h"
#include <sstream>
#include <queue>
#include <set>

namespace codebridge {

void CodeGraph::addNode(std::unique_ptr<GraphNode> node) {
    const std::string nodeId = node->getId();
    nodeMap_[nodeId] = node.get();
    nodes_.push_back(std::move(node));
}

void CodeGraph::addEdge(std::unique_ptr<GraphEdge> edge) {
    const std::string edgeId = edge->getId();
    const std::string sourceId = edge->getSource();
    const std::string targetId = edge->getTarget();
    
    edgeMap_[edgeId] = edge.get();
    outgoingEdges_[sourceId].push_back(edge.get());
    incomingEdges_[targetId].push_back(edge.get());
    edges_.push_back(std::move(edge));
}

const GraphNode* CodeGraph::getNode(const std::string& id) const {
    auto it = nodeMap_.find(id);
    return (it != nodeMap_.end()) ? it->second : nullptr;
}

const GraphEdge* CodeGraph::getEdge(const std::string& id) const {
    auto it = edgeMap_.find(id);
    return (it != edgeMap_.end()) ? it->second : nullptr;
}

std::vector<const GraphEdge*> CodeGraph::getOutgoingEdges(const std::string& nodeId) const {
    std::vector<const GraphEdge*> result;
    auto it = outgoingEdges_.find(nodeId);
    
    if (it != outgoingEdges_.end()) {
        for (const auto& edge : it->second) {
            result.push_back(edge);
        }
    }
    
    return result;
}

std::vector<const GraphEdge*> CodeGraph::getIncomingEdges(const std::string& nodeId) const {
    std::vector<const GraphEdge*> result;
    auto it = incomingEdges_.find(nodeId);
    
    if (it != incomingEdges_.end()) {
        for (const auto& edge : it->second) {
            result.push_back(edge);
        }
    }
    
    return result;
}

std::vector<const GraphNode*> CodeGraph::getNeighbors(const std::string& nodeId) const {
    std::vector<const GraphNode*> neighbors;
    
    for (const auto& edge : getOutgoingEdges(nodeId)) {
        if (const auto* node = getNode(edge->getTarget())) {
            neighbors.push_back(node);
        }
    }
    
    return neighbors;
}

std::vector<const GraphNode*> CodeGraph::findNodesByProperty(
    const std::string& key, const std::string& value) const {
    
    std::vector<const GraphNode*> result;
    
    for (const auto& node : nodes_) {
        auto props = node->getProperties();
        auto it = props.find(key);
        
        if (it != props.end() && it->second == value) {
            result.push_back(node.get());
        }
    }
    
    return result;
}

std::string CodeGraph::toJSON() const {
    std::stringstream ss;
    
    ss << "{\"nodes\":[";
    for (size_t i = 0; i < nodes_.size(); ++i) {
        if (i > 0) ss << ",";
        
        const auto& node = nodes_[i];
        const auto& props = node->getProperties();
        
        ss << "{\"id\":\"" << node->getId()
           << "\",\"label\":\"" << node->getLabel()
           << "\",\"type\":\"" << node->getType() << "\"";
        
        if (!props.empty()) {
            ss << ",\"properties\":{";
            bool firstProp = true;
            
            for (const auto& [key, value] : props) {
                if (!firstProp) ss << ",";
                firstProp = false;
                
                ss << "\"" << key << "\":\"" << value << "\"";
            }
            
            ss << "}";
        }
        
        ss << "}";
    }
    
    ss << "],\"edges\":[";
    for (size_t i = 0; i < edges_.size(); ++i) {
        if (i > 0) ss << ",";
        
        const auto& edge = edges_[i];
        const auto& props = edge->getProperties();
        
        ss << "{\"id\":\"" << edge->getId()
           << "\",\"source\":\"" << edge->getSource()
           << "\",\"target\":\"" << edge->getTarget()
           << "\",\"label\":\"" << edge->getLabel() << "\"";
        
        if (!props.empty()) {
            ss << ",\"properties\":{";
            bool firstProp = true;
            
            for (const auto& [key, value] : props) {
                if (!firstProp) ss << ",";
                firstProp = false;
                
                ss << "\"" << key << "\":\"" << value << "\"";
            }
            
            ss << "}";
        }
        
        ss << "}";
    }
    
    ss << "]}";
    return ss.str();
}

std::vector<const GraphEdge*> CodeGraph::findPath(
    const std::string& sourceId, const std::string& targetId) const {
    
    std::queue<std::string> queue;
    std::set<std::string> visited;
    std::unordered_map<std::string, const GraphEdge*> edgeTo;
    
    queue.push(sourceId);
    visited.insert(sourceId);
    
    while (!queue.empty()) {
        std::string current = queue.front();
        queue.pop();
        
        if (current == targetId) {
            // Path found, reconstruct it
            std::vector<const GraphEdge*> path;
            std::string node = targetId;
            
            while (node != sourceId) {
                const GraphEdge* edge = edgeTo[node];
                path.push_back(edge);
                node = edge->getSource();
            }
            
            // Reverse to get path from source to target
            std::reverse(path.begin(), path.end());
            return path;
        }
        
        for (const auto& edge : getOutgoingEdges(current)) {
            std::string nextNode = edge->getTarget();
            
            if (visited.find(nextNode) == visited.end()) {
                visited.insert(nextNode);
                edgeTo[nextNode] = edge;
                queue.push(nextNode);
            }
        }
    }
    
    // No path found
    return {};
}

void CodeGraph::applyTransformation(std::function<void(CodeGraph&)> transformFn) {
    transformFn(*this);
}

// Helper function for graph building
void addNodeForAST(CodeGraph& graph, const ASTNode* node, 
                  const std::string& parentId = "") {
    static int nodeCounter = 0;
    std::string nodeId = "node_" + std::to_string(nodeCounter++);
    std::string nodeType;
    std::string nodeLabel;
    
    switch (node->getType()) {
        case ASTNode::NodeType::PROGRAM:
            nodeType = "program";
            nodeLabel = "Program";
            break;
        case ASTNode::NodeType::VARIABLE_DECLARATION: {
            const auto* varDecl = static_cast<const VariableDeclaration*>(node);
            nodeType = "var_decl";
            nodeLabel = varDecl->getName();
            break;
        }
        case ASTNode::NodeType::FUNCTION_DECLARATION: {
            const auto* funcDecl = static_cast<const FunctionDeclaration*>(node);
            nodeType = "func_decl";
            nodeLabel = funcDecl->getName();
            break;
        }
        case ASTNode::NodeType::CLASS_DECLARATION: {
            const auto* classDecl = static_cast<const ClassDeclaration*>(node);
            nodeType = "class_decl";
            nodeLabel = classDecl->getName();
            break;
        }
        case ASTNode::NodeType::IDENTIFIER: {
            const auto* id = static_cast<const Identifier*>(node);
            nodeType = "identifier";
            nodeLabel = id->getName();
            break;
        }
        case ASTNode::NodeType::LITERAL: {
            const auto* literal = static_cast<const Literal*>(node);
            nodeType = "literal";
            nodeLabel = literal->getValue();
            break;
        }
        case ASTNode::NodeType::BINARY_EXPRESSION: {
            const auto* binExpr = static_cast<const BinaryExpression*>(node);
            nodeType = "binary_expr";
            
            switch (binExpr->getOperator()) {
                case BinaryExpression::OperatorType::ADD: nodeLabel = "+"; break;
                case BinaryExpression::OperatorType::SUBTRACT: nodeLabel = "-"; break;
                case BinaryExpression::OperatorType::MULTIPLY: nodeLabel = "*"; break;
                case BinaryExpression::OperatorType::DIVIDE: nodeLabel = "/"; break;
                default: nodeLabel = "op";
            }
            break;
        }
        default:
            nodeType = "unknown";
            nodeLabel = "Unknown";
    }
    
    auto graphNode = std::make_unique<GraphNode>(nodeId, nodeLabel, nodeType, node);
    graphNode->setProperty("location", node->getLocationInfo());
    
    // Add node-specific properties
    if (node->getType() == ASTNode::NodeType::VARIABLE_DECLARATION) {
        const auto* varDecl = static_cast<const VariableDeclaration*>(node);
        graphNode->setProperty("varType", varDecl->getType());
    }
    else if (node->getType() == ASTNode::NodeType::FUNCTION_DECLARATION) {
        const auto* funcDecl = static_cast<const FunctionDeclaration*>(node);
        graphNode->setProperty("returnType", funcDecl->getReturnType());
    }
    else if (node->getType() == ASTNode::NodeType::CLASS_DECLARATION) {
        const auto* classDecl = static_cast<const ClassDeclaration*>(node);
        if (!classDecl->getBaseClass().empty()) {
            graphNode->setProperty("baseClass", classDecl->getBaseClass());
        }
    }
    
    // Create edge from parent if this is not the root
    if (!parentId.empty()) {
        static int edgeCounter = 0;
        std::string edgeId = "edge_" + std::to_string(edgeCounter++);
        graph.addEdge(std::make_unique<GraphEdge>(
            edgeId, parentId, nodeId, "contains"));
    }
    
    // Add the node to the graph
    graph.addNode(std::move(graphNode));
    
    // Process child nodes recursively
    if (node->getType() == ASTNode::NodeType::PROGRAM) {
        const auto* program = static_cast<const Program*>(node);
        for (const auto& child : program->getChildren()) {
            addNodeForAST(graph, child.get(), nodeId);
        }
    }
    else if (node->getType() == ASTNode::NodeType::FUNCTION_DECLARATION) {
        const auto* funcDecl = static_cast<const FunctionDeclaration*>(node);
        if (funcDecl->getBody()) {
            addNodeForAST(graph, funcDecl->getBody(), nodeId);
        }
    }
    else if (node->getType() == ASTNode::NodeType::CLASS_DECLARATION) {
        const auto* classDecl = static_cast<const ClassDeclaration*>(node);
        
        for (const auto& field : classDecl->getFields()) {
            addNodeForAST(graph, field.get(), nodeId);
        }
        
        for (const auto& method : classDecl->getMethods()) {
            addNodeForAST(graph, method.get(), nodeId);
        }
    }
    else if (node->getType() == ASTNode::NodeType::BINARY_EXPRESSION) {
        const auto* binExpr = static_cast<const BinaryExpression*>(node);
        addNodeForAST(graph, binExpr->getLeft(), nodeId);
        addNodeForAST(graph, binExpr->getRight(), nodeId);
    }
}

std::unique_ptr<CodeGraph> GraphBuilder::buildFromAST(const ASTNode* root) {
    auto graph = std::make_unique<CodeGraph>();
    
    if (root) {
        addNodeForAST(*graph, root);
    }
    
    return graph;
}

} // namespace codebridge
