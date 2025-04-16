
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Home, Code, GitGraph } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import { sourceCodeSample } from '@/data/sampleData';

const AnalysisPage = () => {
  const [analysisType, setAnalysisType] = useState('ast');
  
  const astRepresentation = `// AST Representation Example
{
  "type": "Program",
  "body": [
    {
      "type": "ClassDeclaration",
      "id": {
        "type": "Identifier",
        "name": "BinarySearchTree"
      },
      "body": {
        "type": "ClassBody",
        "body": [
          {
            "type": "MethodDefinition",
            "key": {
              "type": "Identifier",
              "name": "insert"
            },
            // More detailed structure here
          }
        ]
      }
    }
  ]
}`;
  
  const graphRepresentation = `// Graph Representation Example
{
  "nodes": [
    { "id": "class_1", "type": "class", "name": "BinarySearchTree" },
    { "id": "method_1", "type": "method", "name": "insert" },
    { "id": "method_2", "type": "method", "name": "insertRec" },
    { "id": "property_1", "type": "property", "name": "root" }
  ],
  "edges": [
    { "source": "class_1", "target": "method_1", "type": "contains" },
    { "source": "class_1", "target": "method_2", "type": "contains" },
    { "source": "class_1", "target": "property_1", "type": "contains" },
    { "source": "method_1", "target": "method_2", "type": "calls" }
  ]
}`;

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
              <BreadcrumbPage>Code Analysis</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Code Analysis
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Analyze source code structure for pattern detection and transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Source Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  title="Java Source"
                  language="java"
                  code={sourceCodeSample}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitGraph className="h-5 w-5 text-purple-600" />
                  Code Representations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ast" className="w-full" onValueChange={setAnalysisType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ast">Abstract Syntax Tree</TabsTrigger>
                    <TabsTrigger value="graph">Graph Representation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ast" className="mt-4">
                    <CodeEditor
                      title="AST Representation"
                      language="json"
                      code={astRepresentation}
                    />
                  </TabsContent>
                  <TabsContent value="graph" className="mt-4">
                    <CodeEditor
                      title="Graph Representation"
                      language="json"
                      code={graphRepresentation}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-md">
                      <h3 className="font-medium text-purple-800">Structure Detection</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Identified class hierarchies and method relationships in the source code.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h3 className="font-medium text-blue-800">Pattern Recognition</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Detected common patterns like recursive method calls and nested class definitions.
                      </p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-md">
                      <h3 className="font-medium text-indigo-800">Transformation Opportunities</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Identified 3 potential transformation patterns for modernizing the code structure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

export default AnalysisPage;
