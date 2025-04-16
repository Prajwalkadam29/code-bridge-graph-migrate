
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useLocation } from 'react-router-dom';
import { FileCode, Home, Info, LayoutDashboard, Settings } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const path = location.pathname;

  const getTabValue = () => {
    if (path === '/visualize') return 'visualize';
    if (path === '/analysis') return 'analyze';
    if (path === '/rules') return 'transform';
    return '';
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <FileCode className="h-6 w-6 text-purple-700" />
            <h1 className="text-2xl font-bold tracking-tight text-purple-700">CodeBridge</h1>
          </Link>
          <p className="hidden text-sm text-gray-500 md:inline-block">Graph-based Code Migration Tool</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {path !== '/' && (
            <Tabs value={getTabValue()}>
              <TabsList>
                <TabsTrigger value="visualize" asChild>
                  <Link to="/visualize">Visualize</Link>
                </TabsTrigger>
                <TabsTrigger value="analyze" asChild>
                  <Link to="/analysis">Analyze</Link>
                </TabsTrigger>
                <TabsTrigger value="transform" asChild>
                  <Link to="/rules">Transform</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/" title="Dashboard">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/about" title="About">
                <Info className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
