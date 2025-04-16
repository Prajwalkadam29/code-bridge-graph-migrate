
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold tracking-tight text-purple-700">CodeBridge</h1>
          <p className="hidden text-sm text-gray-500 md:inline-block">Graph-based Code Migration Tool</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="visualize">
            <TabsList>
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="transform">Transform</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm">Documentation</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
