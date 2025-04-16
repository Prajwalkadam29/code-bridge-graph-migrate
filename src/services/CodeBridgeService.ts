
import { toast } from 'sonner';

interface CodeBridgeModule {
  CodeBridge: {
    new(): CodeBridgeInstance;
  };
}

interface CodeBridgeInstance {
  parseJavaCode: (code: string) => string;
  astToGraph: (astJson: string) => string;
  transformGraph: (graphJson: string) => string;
  getTransformationRules: () => string;
  applyTransformation: (graphJson: string, ruleIndex: number) => string;
  generateCode: (graphJson: string) => string;
  getTransformationStats: () => string;
}

// Global module variable to maintain singleton instance
let codeBridgeModule: CodeBridgeModule | null = null;
let codeBridgeInstance: CodeBridgeInstance | null = null;

// Interface for graph data
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties?: Record<string, string>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  highlighted?: boolean;
  properties?: Record<string, string>;
}

export interface TransformationRule {
  id: string;
  name: string;
  source: string;
  target: string;
  confidence: number;
  automated: boolean;
}

export interface TransformationStats {
  totalNodes: number;
  transformedNodes: number;
  rulesApplied: string[];
  confidence: number;
}

class CodeBridgeService {
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    // If already initializing, return the existing promise
    if (this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    
    this.initPromise = new Promise<void>(async (resolve, reject) => {
      try {
        if (!codeBridgeModule) {
          // Dynamically import the WASM module
          const CreateCodeBridgeModule = (window as any).CreateCodeBridgeModule;
          
          if (!CreateCodeBridgeModule) {
            console.error('CodeBridge WASM module not found. Make sure it is properly loaded.');
            toast.error('Failed to load CodeBridge module');
            reject(new Error('CodeBridge module not found'));
            return;
          }
          
          codeBridgeModule = await CreateCodeBridgeModule();
          codeBridgeInstance = new codeBridgeModule.CodeBridge();
          console.log('CodeBridge WASM module initialized successfully');
        }
        
        resolve();
      } catch (error) {
        console.error('Error initializing CodeBridge WASM module:', error);
        toast.error('Failed to initialize CodeBridge module');
        reject(error);
      } finally {
        this.isInitializing = false;
      }
    });
    
    return this.initPromise;
  }

  private async ensureInitialized(): Promise<void> {
    if (!codeBridgeInstance) {
      await this.initialize();
    }
  }

  async parseJavaCode(javaCode: string): Promise<string> {
    await this.ensureInitialized();
    try {
      return codeBridgeInstance!.parseJavaCode(javaCode);
    } catch (error) {
      console.error('Error parsing Java code:', error);
      toast.error('Error parsing Java code');
      throw error;
    }
  }

  async astToGraph(astJson: string): Promise<GraphData> {
    await this.ensureInitialized();
    try {
      const graphJson = codeBridgeInstance!.astToGraph(astJson);
      return JSON.parse(graphJson);
    } catch (error) {
      console.error('Error converting AST to graph:', error);
      toast.error('Error generating graph from AST');
      throw error;
    }
  }

  async transformGraph(graphJson: string): Promise<GraphData> {
    await this.ensureInitialized();
    try {
      const transformedGraphJson = codeBridgeInstance!.transformGraph(graphJson);
      return JSON.parse(transformedGraphJson);
    } catch (error) {
      console.error('Error transforming graph:', error);
      toast.error('Error during graph transformation');
      throw error;
    }
  }

  async getTransformationRules(): Promise<TransformationRule[]> {
    await this.ensureInitialized();
    try {
      const rulesJson = codeBridgeInstance!.getTransformationRules();
      return JSON.parse(rulesJson);
    } catch (error) {
      console.error('Error getting transformation rules:', error);
      toast.error('Error loading transformation rules');
      throw error;
    }
  }

  async applyTransformation(graphJson: string, ruleIndex: number): Promise<GraphData> {
    await this.ensureInitialized();
    try {
      const transformedGraphJson = codeBridgeInstance!.applyTransformation(graphJson, ruleIndex);
      return JSON.parse(transformedGraphJson);
    } catch (error) {
      console.error('Error applying transformation rule:', error);
      toast.error('Error applying transformation rule');
      throw error;
    }
  }

  async generateCode(graphJson: string): Promise<string> {
    await this.ensureInitialized();
    try {
      return codeBridgeInstance!.generateCode(graphJson);
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Error generating target code');
      throw error;
    }
  }

  async getTransformationStats(): Promise<TransformationStats> {
    await this.ensureInitialized();
    try {
      const statsJson = codeBridgeInstance!.getTransformationStats();
      return JSON.parse(statsJson);
    } catch (error) {
      console.error('Error getting transformation stats:', error);
      toast.error('Error retrieving transformation statistics');
      throw error;
    }
  }
}

// Export a singleton instance
export const codeBridgeService = new CodeBridgeService();
