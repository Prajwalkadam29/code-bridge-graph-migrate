
#ifndef GRAPH_H
#define GRAPH_H

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <functional>

namespace codebridge {

// Forward declaration
class ASTNode;

// Represents a node in the graph
class GraphNode {
public:
    GraphNode(const std::string& id, const std::string& label, const std::string& type)
        : id_(id), label_(label), type_(type), data_(nullptr) {}

    GraphNode(const std::string& id, const std::string& label, const std::string& type, 
              const ASTNode* data)
        : id_(id), label_(label), type_(type), data_(data) {}

    const std::string& getId() const { return id_; }
    const std::string& getLabel() const { return label_; }
    const std::string& getType() const { return type_; }
    const ASTNode* getData() const { return data_; }

    void setProperty(const std::string& key, const std::string& value) {
        properties_[key] = value;
    }

    std::string getProperty(const std::string& key) const {
        auto it = properties_.find(key);
        return (it != properties_.end()) ? it->second : "";
    }

    std::unordered_map<std::string, std::string> getProperties() const {
        return properties_;
    }

private:
    std::string id_;
    std::string label_;
    std::string type_;
    const ASTNode* data_;  // Reference to original AST node if applicable
    std::unordered_map<std::string, std::string> properties_;
};

// Represents an edge in the graph
class GraphEdge {
public:
    GraphEdge(const std::string& id, const std::string& source, const std::string& target, 
              const std::string& label)
        : id_(id), source_(source), target_(target), label_(label) {}

    const std::string& getId() const { return id_; }
    const std::string& getSource() const { return source_; }
    const std::string& getTarget() const { return target_; }
    const std::string& getLabel() const { return label_; }

    void setProperty(const std::string& key, const std::string& value) {
        properties_[key] = value;
    }

    std::string getProperty(const std::string& key) const {
        auto it = properties_.find(key);
        return (it != properties_.end()) ? it->second : "";
    }

    std::unordered_map<std::string, std::string> getProperties() const {
        return properties_;
    }

private:
    std::string id_;
    std::string source_;
    std::string target_;
    std::string label_;
    std::unordered_map<std::string, std::string> properties_;
};

// The graph that represents code structure
class CodeGraph {
public:
    CodeGraph() {}
    
    // Add a node to the graph
    void addNode(std::unique_ptr<GraphNode> node);
    
    // Add an edge to the graph
    void addEdge(std::unique_ptr<GraphEdge> edge);
    
    // Get node by ID
    const GraphNode* getNode(const std::string& id) const;
    
    // Get edge by ID
    const GraphEdge* getEdge(const std::string& id) const;
    
    // Get all nodes
    const std::vector<std::unique_ptr<GraphNode>>& getNodes() const { return nodes_; }
    
    // Get all edges
    const std::vector<std::unique_ptr<GraphEdge>>& getEdges() const { return edges_; }
    
    // Get outgoing edges from a node
    std::vector<const GraphEdge*> getOutgoingEdges(const std::string& nodeId) const;
    
    // Get incoming edges to a node
    std::vector<const GraphEdge*> getIncomingEdges(const std::string& nodeId) const;
    
    // Get neighbors of a node
    std::vector<const GraphNode*> getNeighbors(const std::string& nodeId) const;
    
    // Find nodes by property
    std::vector<const GraphNode*> findNodesByProperty(
        const std::string& key, const std::string& value) const;
    
    // Export graph to JSON
    std::string toJSON() const;
    
    // Find path between nodes (using BFS)
    std::vector<const GraphEdge*> findPath(
        const std::string& sourceId, const std::string& targetId) const;
    
    // Apply a transformation to the graph
    void applyTransformation(
        std::function<void(CodeGraph&)> transformFn);

private:
    std::vector<std::unique_ptr<GraphNode>> nodes_;
    std::vector<std::unique_ptr<GraphEdge>> edges_;
    std::unordered_map<std::string, GraphNode*> nodeMap_;
    std::unordered_map<std::string, GraphEdge*> edgeMap_;
    std::unordered_map<std::string, std::vector<GraphEdge*>> outgoingEdges_;
    std::unordered_map<std::string, std::vector<GraphEdge*>> incomingEdges_;
};

// A factory to create a graph from an AST
class GraphBuilder {
public:
    static std::unique_ptr<CodeGraph> buildFromAST(const ASTNode* root);
};

} // namespace codebridge

#endif // GRAPH_H
