import ReactMarkdown from 'react-markdown';
import rehypeHighlight from "rehype-highlight";

import { 
  Cpu, Loader2
} from 'lucide-react';

interface ContentProps {
    isLoading:boolean,
    response:string
};

export default function Content({isLoading, response}:ContentProps) {
    return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
    {isLoading ? (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <div className="absolute inset-0 blur-lg bg-blue-500/20 animate-pulse"></div>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] font-medium animate-pulse text-blue-400/80">
          Analyzing System...
        </p>
      </div>
    ) : response ? (

      <div className="p-6 prose prose-invert prose-pre:bg-[#161B22] prose-pre:border prose-pre:border-gray-800 max-w-none w-full">
        <ReactMarkdown 
          rehypePlugins={[rehypeHighlight]} 
          components={{
            pre({ children }) {
              return (
                <div className="relative group my-6">
                  <pre className="rounded-xl !p-4 !m-0 overflow-x-auto border border-gray-800 shadow-2xl bg-[#010409]">
                    {children}
                  </pre>

                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50 rounded-l-xl"></div>
                </div>
              );
            },
            code({ className, children }) {
              const isBlock = className?.includes('language-');
              return (
                <code className={`${className} ${!isBlock ? 'bg-gray-800 px-1.5 py-0.5 rounded text-blue-300' : ''} font-mono text-sm leading-relaxed`}>
                  {children}
                </code>
              );
            },
            h3({children}) {
              return <h3 className="text-blue-400 text-lg font-semibold mt-8 mb-4 border-b border-gray-800 pb-2">{children}</h3>
            },
            li({children}) {
              return <li className="text-gray-300 mb-2 marker:text-blue-500">{children}</li>
            }
          }}
        >
          {response.trim().startsWith('```') ? response : `\`\`\`cpp\n${response}\n\`\`\``}
        </ReactMarkdown>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full opacity-20 transition-opacity hover:opacity-40">
        <Cpu size={64} strokeWidth={1} className="mb-4 text-blue-400" />
        <p className="text-sm font-light tracking-widest text-center px-10">
          CHOOSE AN ACTION TO INITIALIZE ANALYSIS
        </p>
      </div>
    )}
  </div>
    );
}