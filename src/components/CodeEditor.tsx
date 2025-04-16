
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CodeEditorProps {
  title: string;
  language: string;
  code: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ title, language, code }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className={`language-${language} rounded-md bg-gray-900 p-4 text-sm text-white overflow-auto h-80`}>
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
