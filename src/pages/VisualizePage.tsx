
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GraphVisualization from '@/components/GraphVisualization';
import CodeEditor from '@/components/CodeEditor';
import ExplanationPanel from '@/components/ExplanationPanel';
import TransformationDetail from '@/components/TransformationDetail';
import { 
  sampleNodes, 
  sampleEdges, 
  sourceCodeSample, 
  targetCodeSample,
  transformationSteps,
  transformationDetail
} from '@/data/sampleData';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { codeBridgeService, GraphData } from '@/services/CodeBridgeService';

// Updated Node interface compatible with GraphVisualization expectations
interface VisNode {
  id: string;
  type: string; 
  label: string;
}

// Updated Edge interface compatible with GraphVisualization expectations
interface VisEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  highlighted?: boolean;
}

const VisualizePage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [edges, setEdges] = useState<VisEdge[]>(sampleEdges);
  const [nodes, setNodes] = useState<VisNode[]>(sampleNodes);
  const [sourceCode, setSourceCode] = useState(sourceCodeSample);
  const [targetCode, setTargetCode] = useState(targetCodeSample);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load WASM module on component mount
  useEffect(() => {
    const initWasm = async () => {
      try {
        await codeBridgeService.initialize();
        setIsLoaded(true);
        toast.success('C++ WASM module loaded successfully');
      } catch (error) {
        console.error('Failed to initialize WASM module:', error);
        toast.error('Failed to load C++ module. Using sample data instead.');
        // Continue with sample data
        setIsLoaded(true);
      }
    };
    
    initWasm();
  }, []);
  
  // Handle node click to highlight connected edges
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    
    // Update edge highlighting based on selected node
    const updatedEdges = edges.map(edge => ({
      ...edge,
      highlighted: edge.source === nodeId || edge.target === nodeId
    }));
    
    setEdges(updatedEdges);
  };
  
  // Process the Java code with the WASM module
  const processCode = async () => {
    if (!isLoaded) {
      toast.error('WASM module not loaded yet');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Parse Java code to AST
      const astJson = await codeBridgeService.parseJavaCode(sourceCode);
      console.log('Generated AST:', astJson);
      
      // Convert AST to graph
      const graphData = await codeBridgeService.astToGraph(astJson);
      console.log('Generated Graph:', graphData);
      
      // Transform the graph
      const transformedGraph = await codeBridgeService.transformGraph(JSON.stringify(graphData));
      console.log('Transformed Graph:', transformedGraph);
      
      // Generate TypeScript code
      const generatedCode = await codeBridgeService.generateCode(JSON.stringify(transformedGraph));
      console.log('Generated TypeScript:', generatedCode);
      
      // Convert backend graph nodes/edges to visualization format
      const visNodes: VisNode[] = transformedGraph.nodes.map(node => ({
        id: node.id,
        type: node.type,
        label: node.label,
        properties: node.properties
      }));
      
      const visEdges: VisEdge[] = transformedGraph.edges.map(edge => ({
        id: edge.id || `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        highlighted: false,
        properties: edge.properties
      }));
      
      // Update UI with the results
      setNodes(visNodes);
      setEdges(visEdges);
      setTargetCode(generatedCode);
      
      toast.success('Code processed successfully!');
    } catch (error) {
      console.error('Error processing code:', error);
      toast.error('Error processing code. Using sample data instead.');
      
      // Revert to sample data
      setNodes(sampleNodes);
      setEdges(sampleEdges);
      setTargetCode(targetCodeSample);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSourceCodeChange = (newCode: string) => {
    setSourceCode(newCode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Visualization</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Code Migration Visualization
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Visualize how code transforms between languages using graph structures
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GraphVisualization 
              nodes={nodes} 
              edges={edges}
              onNodeClick={handleNodeClick} 
            />
          </div>
          
          <div>
            <ExplanationPanel 
              currentStage={selectedNode ? `Node: ${selectedNode}` : "Transformation Mapping"} 
              steps={transformationSteps}
            />
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <CodeEditor 
              title="Source Code (Java)" 
              language="java" 
              code={sourceCode}
              onChange={handleSourceCodeChange}
            />
            <div className="mt-4">
              <Button 
                onClick={processCode} 
                disabled={isProcessing || !isLoaded}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Process with C++ (WASM)"}
              </Button>
            </div>
          </div>
          
          <div>
            <TransformationDetail {...transformationDetail} />
          </div>
          
          <div>
            <CodeEditor 
              title="Target Code (TypeScript)" 
              language="typescript" 
              code={targetCode}
              readOnly={true}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container px-4 mx-auto">
          <p className="text-center text-sm text-gray-500">
            Data Structures and Algorithms Course Project — Code Migration Using Graph Data Structures
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VisualizePage;
