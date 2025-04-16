
declare module "@/components/CodeEditor" {
  export interface CodeEditorProps {
    title: string;
    language: string;
    code: string;
    onChange?: (newCode: string) => void;
    readOnly?: boolean;
  }

  const CodeEditor: React.FC<CodeEditorProps>;
  export default CodeEditor;
}
