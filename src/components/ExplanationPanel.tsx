
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Step {
  title: string;
  description: string;
}

interface ExplanationPanelProps {
  currentStage: string;
  steps: Step[];
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ currentStage, steps }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Migration Process</CardTitle>
        <CardDescription>
          Current stage: <span className="font-semibold text-purple-600">{currentStage}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
              <h3 className="text-sm font-medium">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplanationPanel;
