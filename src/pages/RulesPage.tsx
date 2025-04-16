
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Home, Wrench, ArrowRightLeft, FileCode } from 'lucide-react';
import TransformationRuleList from '@/components/TransformationRuleList';
import { codeBridgeService, TransformationRule, TransformationStats } from '@/services/CodeBridgeService';
import { toast } from 'sonner';

const RulesPage = () => {
  const [selectedRule, setSelectedRule] = useState<TransformationRule | null>(null);
  const [stats, setStats] = useState<TransformationStats | null>(null);
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        await codeBridgeService.initialize();
        const statsData = await codeBridgeService.getTransformationStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load transformation stats:', error);
        // Set default stats if there's an error
        setStats({
          totalNodes: 5,
          transformedNodes: 4,
          rulesApplied: ['ClassToInterface', 'JavaToTS_Types'],
          confidence: 88
        });
      }
    };
    
    loadStats();
  }, []);
  
  const handleRuleSelect = (rule: TransformationRule) => {
    setSelectedRule(rule);
    toast.info(`Selected rule: ${rule.name}`);
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
              <BreadcrumbPage>Transformation Rules</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Transformation Rules
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Rules that govern how source code structures are transformed to target language
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransformationRuleList onRuleSelect={handleRuleSelect} />
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                  Rule Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Selected Rule</h3>
                    <p className="mt-1">{selectedRule ? selectedRule.name : "Inner Class to Separate Class"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Description</h3>
                    <p className="mt-1 text-sm">
                      {selectedRule 
                        ? `Converts ${selectedRule.source} to ${selectedRule.target} with ${selectedRule.confidence}% confidence.`
                        : "Converts Java inner classes to separate TypeScript classes. This transformation preserves the relationship between the classes while adapting to TypeScript&apos;s module system."
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Example Transformation</h3>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs font-mono text-gray-700">
                      <p className="mb-2">// Java:</p>
                      <p>class Outer {"{"}</p>
                      <p>  class Inner {"{"} ... {"}"}</p>
                      <p>{"}"}</p>
                      <p className="mt-2 mb-2">// TypeScript:</p>
                      <p>class Outer {"{"} ... {"}"}</p>
                      <p>class Inner {"{"} ... {"}"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-indigo-600" />
                  Rule Application Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Rules:</span>
                    <span className="font-medium">
                      {stats ? stats.rulesApplied.length : "..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Nodes:</span>
                    <span className="font-medium">
                      {stats ? stats.totalNodes : "..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Transformed:</span>
                    <span className="font-medium">
                      {stats ? stats.transformedNodes : "..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Confidence:</span>
                    <span className="font-medium">
                      {stats ? `${stats.confidence}%` : "..."}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default RulesPage;
