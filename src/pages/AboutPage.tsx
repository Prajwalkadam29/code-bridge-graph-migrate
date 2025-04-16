
import React from 'react';
import Header from '@/components/Header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Home, Info, Book, School, GitMerge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
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
              <BreadcrumbPage>About</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Info className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              About This Project
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-600">
            Understanding code migration using graph data structures
          </p>
        </div>
        
        <Card className="mb-10">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <School className="h-6 w-6 text-purple-600" />
                Project Overview
              </h2>
              <p>
                This project was developed for our Data Structures and Algorithms course to demonstrate the 
                application of graph theory in solving real-world problems. Specifically, we focused on 
                using graph data structures to represent and transform source code between different programming
                languages.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Academic Context</h3>
              <p>
                Code migration between languages is a common challenge in software engineering that involves 
                several complex steps: code analysis, structural representation, pattern detection, transformation 
                application, and code generation. Our project visualizes this process as a graph-based transformation
                pipeline.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <GitMerge className="h-6 w-6 text-purple-600" />
                Technical Implementation
              </h2>
              <p>
                We represent source code as Abstract Syntax Trees (ASTs) and then transform these trees 
                into graph structures. Each node in the graph represents a code construct (class, method, 
                variable, etc.), and edges represent relationships between these constructs (containment, 
                inheritance, method calls, etc.).
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Graph Algorithms Used</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <span className="font-medium">Depth-First Search (DFS)</span>: Used to traverse the AST and build the 
                  graph representation of code structures.
                </li>
                <li>
                  <span className="font-medium">Pattern Matching</span>: Custom graph isomorphism algorithms to detect 
                  patterns in the source code that match transformation rules.
                </li>
                <li>
                  <span className="font-medium">Graph Transformation</span>: Applying rules to convert source 
                  language graph patterns to target language patterns.
                </li>
                <li>
                  <span className="font-medium">Topological Sorting</span>: Used to determine the order of 
                  transformations to maintain code dependencies.
                </li>
              </ul>
              
              <Separator className="my-6" />
              
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Book className="h-6 w-6 text-purple-600" />
                Future Work
              </h2>
              <p>
                This project is a proof-of-concept that demonstrates the potential of graph-based code 
                transformation. Future work could include:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Expanding the set of transformation rules</li>
                <li>Supporting more programming languages</li>
                <li>Enhancing the visualization with more detailed graph views</li>
                <li>Implementing user-defined transformation rules</li>
                <li>Developing a plugin for popular IDEs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Project Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-md">
              <h3 className="font-medium text-purple-800">Team Member 1</h3>
              <p className="mt-1 text-sm text-gray-600">
                Graph Algorithm Implementation
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800">Team Member 2</h3>
              <p className="mt-1 text-sm text-gray-600">
                Code Parsing & AST Generation
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-md">
              <h3 className="font-medium text-indigo-800">Team Member 3</h3>
              <p className="mt-1 text-sm text-gray-600">
                Transformation Rule Design
              </p>
            </div>
            <div className="p-4 bg-pink-50 rounded-md">
              <h3 className="font-medium text-pink-800">Team Member 4</h3>
              <p className="mt-1 text-sm text-gray-600">
                Visualization & UI Development
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

export default AboutPage;
