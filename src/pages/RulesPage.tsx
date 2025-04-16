
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Home, Wrench, ArrowRightLeft, FileCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const transformationRules = [
  {
    id: 'rule-1',
    name: 'Class to Interface Conversion',
    source: 'Java Class',
    target: 'TypeScript Interface',
    confidence: 95,
    automated: true
  },
  {
    id: 'rule-2',
    name: 'Static Methods to Module Functions',
    source: 'Static Method',
    target: 'Module Function',
    confidence: 90,
    automated: true
  },
  {
    id: 'rule-3',
    name: 'Inner Class to Separate Class',
    source: 'Inner Class',
    target: 'Standalone Class',
    confidence: 92,
    automated: true
  },
  {
    id: 'rule-4',
    name: 'Getter/Setter to Property',
    source: 'Accessor Methods',
    target: 'TypeScript Property',
    confidence: 85,
    automated: true
  },
  {
    id: 'rule-5',
    name: 'For Loop to Array Methods',
    source: 'Traditional For Loop',
    target: 'map/filter/reduce',
    confidence: 80,
    automated: false
  }
];

const RulesPage = () => {
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-purple-600" />
                  Available Transformation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transformationRules.map(rule => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.source}</TableCell>
                        <TableCell>{rule.target}</TableCell>
                        <TableCell>
                          <Badge variant={rule.confidence > 90 ? "default" : "secondary"}>
                            {rule.confidence}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {rule.automated ? 
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Automated</Badge> :
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Manual Review</Badge>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
                    <p className="mt-1">Inner Class to Separate Class</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Description</h3>
                    <p className="mt-1 text-sm">
                      Converts Java inner classes to separate TypeScript classes. This transformation preserves the relationship
                      between the classes while adapting to TypeScript's module system.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Example Transformation</h3>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs font-mono text-gray-700">
                      <p className="mb-2">// Java:</p>
                      <p>class Outer {</p>
                      <p>  class Inner { ... }</p>
                      <p>}</p>
                      <p className="mt-2 mb-2">// TypeScript:</p>
                      <p>class Outer { ... }</p>
                      <p>class Inner { ... }</p>
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
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Automated Rules:</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Manual Review:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Confidence:</span>
                    <span className="font-medium">88%</span>
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
