
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { codeBridgeService, TransformationRule } from '@/services/CodeBridgeService';
import { Loader2 } from 'lucide-react';

interface TransformationRuleListProps {
  onRuleSelect?: (rule: TransformationRule) => void;
}

const TransformationRuleList: React.FC<TransformationRuleListProps> = ({ onRuleSelect }) => {
  const [rules, setRules] = useState<TransformationRule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        const rulesData = await codeBridgeService.getTransformationRules();
        setRules(rulesData);
        setError(null);
      } catch (err) {
        console.error("Failed to load transformation rules:", err);
        setError("Failed to load transformation rules");
        // Load fallback rules
        setRules([
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadRules();
  }, []);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Transformation Rules</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Available Transformation Rules
          {error && <Badge variant="destructive" className="ml-2">{error}</Badge>}
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
            {rules.map(rule => (
              <TableRow 
                key={rule.id} 
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => onRuleSelect && onRuleSelect(rule)}
              >
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
  );
};

export default TransformationRuleList;
