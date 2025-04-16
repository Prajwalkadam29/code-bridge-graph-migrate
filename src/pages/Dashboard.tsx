
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, FileCode, FileSymlink, GitFork } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            CodeBridge Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Graph-based code migration visualization dashboard
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSymlink className="h-5 w-5 text-purple-600" />
                Visualization Tool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Visualize the code transformation process with interactive graph diagrams
              </p>
              <Button asChild className="w-full">
                <Link to="/visualize" className="flex items-center justify-center gap-2">
                  Open Visualization <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Project Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Analyze source code structure and dependencies for migration planning
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/analysis" className="flex items-center justify-center gap-2">
                  View Analysis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitFork className="h-5 w-5 text-indigo-600" />
                Transformation Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Explore and customize the rules that govern code transformation
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/rules" className="flex items-center justify-center gap-2">
                  Manage Rules <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <p className="text-gray-700 mb-4">
            This project demonstrates how graph structures can be used to represent and transform code between different
            programming languages. By parsing source code into Abstract Syntax Trees (ASTs), then converting them to graph
            representations, we can analyze dependencies, identify patterns, and apply transformations.
          </p>
          <div className="flex justify-end">
            <Button asChild variant="outline">
              <Link to="/about">Learn More</Link>
            </Button>
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

export default Dashboard;
