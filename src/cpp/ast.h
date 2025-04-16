
#ifndef AST_H
#define AST_H

#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

namespace codebridge {

// Forward declarations
class ASTNode;
class Expression;
class Statement;

// Base class for all AST nodes
class ASTNode {
public:
    enum class NodeType {
        PROGRAM,
        VARIABLE_DECLARATION,
        FUNCTION_DECLARATION,
        CLASS_DECLARATION,
        METHOD_DECLARATION,
        EXPRESSION,
        STATEMENT,
        BLOCK,
        IF_STATEMENT,
        FOR_STATEMENT,
        WHILE_STATEMENT,
        RETURN_STATEMENT,
        BINARY_EXPRESSION,
        CALL_EXPRESSION,
        IDENTIFIER,
        LITERAL
    };

    ASTNode(NodeType type) : type_(type) {}
    virtual ~ASTNode() = default;

    NodeType getType() const { return type_; }
    
    // Convert node to JSON representation
    virtual std::string toJSON() const = 0;
    
    // Create a deep clone of this node
    virtual std::unique_ptr<ASTNode> clone() const = 0;
    
    // Get source location info
    virtual std::string getLocationInfo() const { return location_; }
    void setLocationInfo(const std::string& location) { location_ = location; }

protected:
    NodeType type_;
    std::string location_; // Source code location (file:line:col)
};

// Program is the root node of the AST
class Program : public ASTNode {
public:
    Program() : ASTNode(NodeType::PROGRAM) {}
    
    void addChild(std::unique_ptr<ASTNode> child) {
        children_.push_back(std::move(child));
    }
    
    const std::vector<std::unique_ptr<ASTNode>>& getChildren() const {
        return children_;
    }
    
    std::string toJSON() const override;
    std::unique_ptr<ASTNode> clone() const override;

private:
    std::vector<std::unique_ptr<ASTNode>> children_;
};

// Variable declaration node
class VariableDeclaration : public ASTNode {
public:
    VariableDeclaration(const std::string& name, const std::string& type)
        : ASTNode(NodeType::VARIABLE_DECLARATION), name_(name), type_(type) {}
    
    const std::string& getName() const { return name_; }
    const std::string& getType() const { return type_; }
    
    void setInitializer(std::unique_ptr<Expression> initializer) {
        initializer_ = std::move(initializer);
    }
    
    const Expression* getInitializer() const { return initializer_.get(); }
    
    std::string toJSON() const override;
    std::unique_ptr<ASTNode> clone() const override;

private:
    std::string name_;
    std::string type_;
    std::unique_ptr<Expression> initializer_;
};

// Base class for all expressions
class Expression : public ASTNode {
public:
    Expression(NodeType type) : ASTNode(type) {}
};

// Identifier expression (variable names, etc.)
class Identifier : public Expression {
public:
    Identifier(const std::string& name)
        : Expression(NodeType::IDENTIFIER), name_(name) {}
    
    const std::string& getName() const { return name_; }
    
    std::string toJSON() const override;
    std::unique_ptr<ASTNode> clone() const override;

private:
    std::string name_;
};

// Literal values (numbers, strings, etc.)
class Literal : public Expression {
public:
    enum class LiteralType {
        NUMBER,
        STRING,
        BOOLEAN,
        NULL_LITERAL
    };
    
    Literal(LiteralType literalType, const std::string& value)
        : Expression(NodeType::LITERAL), literalType_(literalType), value_(value) {}
    
    LiteralType getLiteralType() const { return literalType_; }
    const std::string& getValue() const { return value_; }
    
    std::string toJSON() const override;
    std::unique_ptr<ASTNode> clone() const override;

private:
    LiteralType literalType_;
    std::string value_;
};

// Binary operation expression (a + b, etc.)
class BinaryExpression : public Expression {
public:
    enum class OperatorType {
        ADD,
        SUBTRACT,
        MULTIPLY,
        DIVIDE,
        MODULO,
        EQUAL,
        NOT_EQUAL,
        LESS_THAN,
        GREATER_THAN,
        LESS_EQUAL,
        GREATER_EQUAL,
        AND,
        OR
    };
    
    BinaryExpression(OperatorType op, 
                    std::unique_ptr<Expression> left,
                    std::unique_ptr<Expression> right)
        : Expression(NodeType::BINARY_EXPRESSION), 
          operator_(op), 
          left_(std::move(left)), 
          right_(std::move(right)) {}
    
    OperatorType getOperator() const { return operator_; }
    const Expression* getLeft() const { return left_.get(); }
    const Expression* getRight() const { return right_.get(); }
    
    std::string toJSON() const override;
    std::unique_ptr<ASTNode> clone() const override;

private:
    OperatorType operator_;
    std::unique_ptr<Expression> left_;
    std::unique_ptr<Expression> right_;
};

// Base class for all statements
class Statement : public ASTNode {
public:
    Statement(NodeType type) : ASTNode(type) {}
};

// Function declaration node
class FunctionDeclaration : public ASTNode {
public:
    struct Parameter {
        std::string name;
        std::string type;
    };
    
    FunctionDeclaration(const std::string& name, const std::string& returnType)
        : ASTNode(NodeType::FUNCTION_DECLARATION), name_(name), returnType_(returnType) {}
    
    void addParameter(const std::string& name, const std::string& type) {
        parameters_.push_back({name, type});
    }
    
    void setBody(std::unique_ptr<ASTNode> body) {
        body_ = std::move(body);
    }
    
    const std::string& getName() const { return name_; }
    const std::string& getReturnType() const { return returnType_; }
    const std::vector<Parameter>& getParameters() const { return parameters_; }
    const ASTNode* getBody() const { return body_.get(); }
    
    std::string toJSON() const override;
    std::unique_ptr<ASTNode> clone() const override;

private:
    std::string name_;
    std::string returnType_;
    std::vector<Parameter> parameters_;
    std::unique_ptr<ASTNode> body_;
};

// Class declaration node
class ClassDeclaration : public ASTNode {
public:
    ClassDeclaration(const std::string& name)
        : ASTNode(NodeType::CLASS_DECLARATION), name_(name) {}
    
    void addMethod(std::unique_ptr<ASTNode> method) {
        methods_.push_back(std::move(method));
    }
    
    void addField(std::unique_ptr<VariableDeclaration> field) {
        fields_.push_back(std::move(field));
    }
    
    void setBaseClass(const std::string& baseClass) {
        baseClass_ = baseClass;
    }
    
    const std::string& getName() const { return name_; }
    const std::string& getBaseClass() const { return baseClass_; }
    const std::vector<std::unique_ptr<ASTNode>>& getMethods() const { return methods_; }
    const std::vector<std::unique_ptr<VariableDeclaration>>& getFields() const { return fields_; }
    
    std::string toJSON() const override;
    std::unique_ptr<ASTNode> clone() const override;

private:
    std::string name_;
    std::string baseClass_;
    std::vector<std::unique_ptr<ASTNode>> methods_;
    std::vector<std::unique_ptr<VariableDeclaration>> fields_;
};

} // namespace codebridge

#endif // AST_H
