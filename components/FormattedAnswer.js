import React from 'react';
import ReactMarkdown from 'react-markdown';

const FormattedAnswer = ({ answer }) => {
  // Function to preprocess the answer text to handle common formatting issues
  const preprocessAnswer = (text) => {
    if (!text) return '';
    
    let processedText = text;
    
    // Convert numbered list patterns like "1. **Title:** content" to proper markdown
    processedText = processedText.replace(/(\d+)\.\s*\*\*([^*]+)\*\*\s*/g, '$1. **$2** ');
    
    // Ensure proper line breaks for numbered lists
    processedText = processedText.replace(/(\d+\.\s+[^0-9]+?)(\s+)(\d+\.)/g, '$1\n\n$3');
    
    // Add line breaks before numbered items if they're all on one line
    processedText = processedText.replace(/(\d+\.\s+[^0-9]+?)\s+(\d+\.)/g, '$1\n\n$2');
    
    return processedText;
  };

  const markdownComponents = {
    // Custom styling for different markdown elements
    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-900 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium text-gray-900 mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-3 text-gray-700">{children}</ol>,
    li: ({ children }) => <li className="ml-2 leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
        {children}
      </blockquote>
    ),
    code: ({ inline, children }) => {
      return inline ? (
        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ) : (
        <pre className="bg-gray-100 text-gray-800 p-3 rounded-md overflow-x-auto mb-4">
          <code className="font-mono text-sm">{children}</code>
        </pre>
      );
    },
  };

  const processedAnswer = preprocessAnswer(answer);

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown components={markdownComponents}>
        {processedAnswer}
      </ReactMarkdown>
    </div>
  );
};

export default FormattedAnswer;