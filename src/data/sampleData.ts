
// Sample data for demonstration purposes
export const sampleNodes = [
  // Source code nodes (left side)
  { id: 'src1', type: 'source', label: 'Class' },
  { id: 'src2', type: 'source', label: 'Method' },
  { id: 'src3', type: 'source', label: 'Loop' },

  // Transformation node (middle)
  { id: 'transform', type: 'transform', label: 'AST\nTransform' },

  // Target code nodes (right side)
  { id: 'tgt1', type: 'target', label: 'Class' },
  { id: 'tgt2', type: 'target', label: 'Method' },
  { id: 'tgt3', type: 'target', label: 'Loop' },
];

export const sampleEdges = [
  // Source to transform
  { source: 'src1', target: 'transform' },
  { source: 'src2', target: 'transform' },
  { source: 'src3', target: 'transform' },

  // Transform to target
  { source: 'transform', target: 'tgt1' },
  { source: 'transform', target: 'tgt2', highlighted: true },
  { source: 'transform', target: 'tgt3' },
];

export const sourceCodeSample = `// Java code example
public class BinarySearchTree {
    class Node {
        int key;
        Node left, right;
        
        public Node(int item) {
            key = item;
            left = right = null;
        }
    }
    
    Node root;
    
    BinarySearchTree() {
        root = null;
    }
    
    void insert(int key) {
        root = insertRec(root, key);
    }
    
    Node insertRec(Node root, int key) {
        if (root == null) {
            root = new Node(key);
            return root;
        }
        
        if (key < root.key)
            root.left = insertRec(root.left, key);
        else if (key > root.key)
            root.right = insertRec(root.right, key);
            
        return root;
    }
}`;

export const targetCodeSample = `// TypeScript modern implementation
class BST<T> {
  private root: BSTNode<T> | null = null;
  
  constructor() {}
  
  insert(value: number): void {
    const newNode = new BSTNode(value);
    
    if (this.root === null) {
      this.root = newNode;
      return;
    }
    
    this.insertNode(this.root, newNode);
  }
  
  private insertNode(node: BSTNode<T>, newNode: BSTNode<T>): void {
    // Go to left subtree
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } 
    // Go to right subtree
    else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }
}

class BSTNode<T> {
  value: number;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;
  
  constructor(value: number) {
    this.value = value;
  }
}`;

export const transformationSteps = [
  {
    title: 'AST Generation',
    description: 'Parse source code and create Abstract Syntax Tree representation for analysis.',
  },
  {
    title: 'Pattern Detection',
    description: 'Identify common patterns, structures and constructs in the source language.',
  },
  {
    title: 'Graph Construction',
    description: 'Build a directed graph of code dependencies and relationships.',
  },
  {
    title: 'Transformation Mapping',
    description: 'Map source language constructs to equivalent target language features.',
  },
  {
    title: 'Code Generation',
    description: 'Generate target language code from the transformed graph representation.',
  },
];

export const transformationDetail = {
  from: 'Java',
  to: 'TypeScript',
  transformation: 'Class Structure Modernization',
  pattern: 'Nested Class to Separate Class',
  confidence: 92,
};
