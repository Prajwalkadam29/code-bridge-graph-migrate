
#include "ast.h"
#include <sstream>

namespace codebridge {

std::string Program::toJSON() const {
    std::stringstream ss;
    ss << "{\"type\":\"Program\",\"children\":[";
    
    for (size_t i = 0; i < children_.size(); ++i) {
        if (i > 0) ss << ",";
        ss << children_[i]->toJSON();
    }
    
    ss << "]}";
    return ss.str();
}

std::unique_ptr<ASTNode> Program::clone() const {
    auto cloned = std::make_unique<Program>();
    
    for (const auto& child : children_) {
        cloned->addChild(child->clone());
    }
    
    return cloned;
}

std::string VariableDeclaration::toJSON() const {
    std::stringstream ss;
    ss << "{\"type\":\"VariableDeclaration\",\"name\":\"" << name_ 
       << "\",\"varType\":\"" << type_ << "\"";
    
    if (initializer_) {
        ss << ",\"initializer\":" << initializer_->toJSON();
    }
    
    ss << "}";
    return ss.str();
}

std::unique_ptr<ASTNode> VariableDeclaration::clone() const {
    auto cloned = std::make_unique<VariableDeclaration>(name_, type_);
    
    if (initializer_) {
        cloned->setInitializer(std::unique_ptr<Expression>(
            static_cast<Expression*>(initializer_->clone().release())));
    }
    
    return cloned;
}

std::string Identifier::toJSON() const {
    return "{\"type\":\"Identifier\",\"name\":\"" + name_ + "\"}";
}

std::unique_ptr<ASTNode> Identifier::clone() const {
    return std::make_unique<Identifier>(name_);
}

std::string Literal::toJSON() const {
    std::stringstream ss;
    ss << "{\"type\":\"Literal\",\"literalType\":";
    
    switch (literalType_) {
        case LiteralType::NUMBER:
            ss << "\"NUMBER\"";
            break;
        case LiteralType::STRING:
            ss << "\"STRING\"";
            break;
        case LiteralType::BOOLEAN:
            ss << "\"BOOLEAN\"";
            break;
        case LiteralType::NULL_LITERAL:
            ss << "\"NULL\"";
            break;
    }
    
    ss << ",\"value\":\"" << value_ << "\"}";
    return ss.str();
}

std::unique_ptr<ASTNode> Literal::clone() const {
    return std::make_unique<Literal>(literalType_, value_);
}

std::string BinaryExpression::toJSON() const {
    std::stringstream ss;
    std::string opStr;
    
    switch (operator_) {
        case OperatorType::ADD: opStr = "+"; break;
        case OperatorType::SUBTRACT: opStr = "-"; break;
        case OperatorType::MULTIPLY: opStr = "*"; break;
        case OperatorType::DIVIDE: opStr = "/"; break;
        case OperatorType::MODULO: opStr = "%"; break;
        case OperatorType::EQUAL: opStr = "=="; break;
        case OperatorType::NOT_EQUAL: opStr = "!="; break;
        case OperatorType::LESS_THAN: opStr = "<"; break;
        case OperatorType::GREATER_THAN: opStr = ">"; break;
        case OperatorType::LESS_EQUAL: opStr = "<="; break;
        case OperatorType::GREATER_EQUAL: opStr = ">="; break;
        case OperatorType::AND: opStr = "&&"; break;
        case OperatorType::OR: opStr = "||"; break;
    }
    
    ss << "{\"type\":\"BinaryExpression\",\"operator\":\"" << opStr
       << "\",\"left\":" << left_->toJSON()
       << ",\"right\":" << right_->toJSON() << "}";
       
    return ss.str();
}

std::unique_ptr<ASTNode> BinaryExpression::clone() const {
    return std::make_unique<BinaryExpression>(
        operator_,
        std::unique_ptr<Expression>(static_cast<Expression*>(left_->clone().release())),
        std::unique_ptr<Expression>(static_cast<Expression*>(right_->clone().release()))
    );
}

std::string FunctionDeclaration::toJSON() const {
    std::stringstream ss;
    ss << "{\"type\":\"FunctionDeclaration\",\"name\":\"" << name_
       << "\",\"returnType\":\"" << returnType_ << "\",\"parameters\":[";
    
    for (size_t i = 0; i < parameters_.size(); ++i) {
        if (i > 0) ss << ",";
        ss << "{\"name\":\"" << parameters_[i].name
           << "\",\"type\":\"" << parameters_[i].type << "\"}";
    }
    
    ss << "]";
    
    if (body_) {
        ss << ",\"body\":" << body_->toJSON();
    }
    
    ss << "}";
    return ss.str();
}

std::unique_ptr<ASTNode> FunctionDeclaration::clone() const {
    auto cloned = std::make_unique<FunctionDeclaration>(name_, returnType_);
    
    for (const auto& param : parameters_) {
        cloned->addParameter(param.name, param.type);
    }
    
    if (body_) {
        cloned->setBody(body_->clone());
    }
    
    return cloned;
}

std::string ClassDeclaration::toJSON() const {
    std::stringstream ss;
    ss << "{\"type\":\"ClassDeclaration\",\"name\":\"" << name_ << "\"";
    
    if (!baseClass_.empty()) {
        ss << ",\"baseClass\":\"" << baseClass_ << "\"";
    }
    
    ss << ",\"fields\":[";
    for (size_t i = 0; i < fields_.size(); ++i) {
        if (i > 0) ss << ",";
        ss << fields_[i]->toJSON();
    }
    
    ss << "],\"methods\":[";
    for (size_t i = 0; i < methods_.size(); ++i) {
        if (i > 0) ss << ",";
        ss << methods_[i]->toJSON();
    }
    
    ss << "]}";
    return ss.str();
}

std::unique_ptr<ASTNode> ClassDeclaration::clone() const {
    auto cloned = std::make_unique<ClassDeclaration>(name_);
    
    if (!baseClass_.empty()) {
        cloned->setBaseClass(baseClass_);
    }
    
    for (const auto& field : fields_) {
        cloned->addField(std::unique_ptr<VariableDeclaration>(
            static_cast<VariableDeclaration*>(field->clone().release())));
    }
    
    for (const auto& method : methods_) {
        cloned->addMethod(method->clone());
    }
    
    return cloned;
}

} // namespace codebridge
