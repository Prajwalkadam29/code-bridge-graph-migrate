
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

const Index = () => {
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
              currentStage="Transformation Mapping" 
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
        
        <div className="mt-12 bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">About Code Migration Using Graphs</h2>
          <p className="text-gray-700">
            This project demonstrates how graph structures can be used to represent and transform code between different
            programming languages. By parsing source code into an Abstract Syntax Tree (AST), then converting it to a graph
            representation, we can analyze dependencies, identify patterns, and apply transformations to generate
            equivalent code in a target language.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 bg-purple-50 rounded-md">
              <h3 className="font-medium text-purple-800">Analysis</h3>
              <p className="mt-1 text-sm text-gray-600">
                Parsing source code and constructing a graph representation reveals structure and dependencies.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800">Transformation</h3>
              <p className="mt-1 text-sm text-gray-600">
                Applying transformations to the graph based on language-specific patterns.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-md">
              <h3 className="font-medium text-indigo-800">Generation</h3>
              <p className="mt-1 text-sm text-gray-600">
                Generating target language code from the transformed graph representation.
              </p>
            </div>
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

export default Index;
