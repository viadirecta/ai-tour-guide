
import React, { useState } from 'react';
import Icon from './Icon';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 rounded-lg my-4 border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-t-lg">
        <span className="text-xs font-sans text-slate-500 dark:text-slate-400">{language || 'code'}</span>
        <button onClick={handleCopy} className="flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <Icon name="copy" className="w-4 h-4 mr-1" />
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;