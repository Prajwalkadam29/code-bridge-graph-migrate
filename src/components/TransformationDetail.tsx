
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TransformationDetailProps {
  from: string;
  to: string;
  transformation: string;
  pattern: string;
  confidence: number;
}

const TransformationDetail: React.FC<TransformationDetailProps> = ({
  from,
  to,
  transformation,
  pattern,
  confidence,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Transformation Details</CardTitle>
          <Badge variant={confidence > 80 ? "default" : "secondary"}>
            {confidence}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Source Language</h3>
            <p className="mt-1 text-sm">{from}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Target Language</h3>
            <p className="mt-1 text-sm">{to}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Transformation</h3>
            <p className="mt-1 text-sm">{transformation}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Pattern Detection</h3>
            <p className="mt-1 text-sm">{pattern}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransformationDetail;
