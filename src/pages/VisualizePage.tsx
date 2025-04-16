
import React, { useState } from 'react';
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

const VisualizePage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [edges, setEdges] = useState(sampleEdges);
  
  // Handle node click to highlight connected edges
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    
    // Update edge highlighting based on selected node
    const updatedEdges = sampleEdges.map(edge => ({
      ...edge,
      highlighted: edge.source === nodeId || edge.target === nodeId
    }));
    
    setEdges(updatedEdges);
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
              nodes={sampleNodes} 
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
              code={sourceCodeSample} 
            />
          </div>
          
          <div>
            <TransformationDetail {...transformationDetail} />
          </div>
          
          <div>
            <CodeEditor 
              title="Target Code (TypeScript)" 
              language="typescript" 
              code={targetCodeSample} 
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
