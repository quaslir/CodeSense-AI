import { useState } from "react"
import { useEffect } from "react"
import { Editor } from "@monaco-editor/react";
import { 
  Play, 
  Bug, 
  Zap, 
  MessageSquareCode, 
  ChevronRight, 
  Loader2, 
  Terminal,
  Cpu
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TerminalWindow from "./Terminal";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/atom-one-dark.css'
export default function App() {
const [input, setInput] = useState<string>(localStorage.getItem("saved_code") || "");
const [response, setResponse] = useState<string>("");
const [isLoading, setIsLoading] = useState<boolean>(false);
const [output, setOutput] = useState<string>("");
const [error, setError] = useState<string>("");
async function send(model:number) {
  setIsLoading(true);
  setResponse("");
try {
  const res = await fetch("http://localhost:3000/analyze", {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({input, model})
  });
  const data = await res.json();
  setResponse(data.reply);
}
catch(error) {
  console.error(error);
}
finally {
  setIsLoading(false);
}
}

async function runCode(lang: number) {
  setOutput("");
  setError("");
  const code = input;
  try {

    const res = await axios.post("http://localhost:3000/api/compile", {
      code, lang
    });
    const data = res.data;
    setOutput(data.output);
    setError(data.error);
  } catch(error) {
    console.error(error);
  }
}


useEffect(() => {
  localStorage.setItem("saved_code", input);
}, [input]);
 return (
    <div className="flex h-screen w-full bg-[#0D1117] text-gray-300 font-sans">
      
      {/* --- Sidebar --- */}
      <aside className="w-16 border-r border-gray-800 flex flex-col items-center py-4 gap-4 bg-[#161B22]">
        <div className="p-2 bg-blue-600 rounded-lg mb-4 text-white">
          <Cpu size={24} />
        </div>
        <button 
          onClick={() => send(0)} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl transition-colors title='Explain'"
        >
          <MessageSquareCode size={20} className="text-blue-400" />
        </button>
        <button 
          onClick={() => send(1)} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl transition-colors title='Debug'"
        >
          <Bug size={20} className="text-red-400" />
        </button>
        <button 
          onClick={() => send(2)} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl transition-colors title='Optimize'"
        >
          <Zap size={20} className="text-yellow-400" />
        </button>
      </aside>

      {/* --- Main Area --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-[#161B22]">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-500">
            <Terminal size={14} /> main.cpp
          </div>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-all"
          onClick={() => runCode(54)}>
            <Play size={12} /> Run Code
          </button>
        </header>

        {/* Editor & AI Panel Split */}
        <div className="flex-1 flex overflow-hidden">
          
         {/* Editor & Terminal Space */}
<div className="flex-1 flex flex-col border-r border-gray-800">
  
  <div className="flex-1">
    <Editor
      height="100%"
      defaultLanguage="cpp"
      theme="vs-dark"
      value={input}
      onChange={(value) => setInput(value || "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        padding: { top: 20 },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
      }}
    />
  </div>

  <TerminalWindow output={output} error={error} />

</div>

          <section className="w-[450px] bg-[#0D1117] border-l border-gray-800 flex flex-col">
  <div className="p-3 border-b border-gray-800 bg-[#161B22] flex items-center gap-2 text-sm font-bold">
    <ChevronRight size={16} className={`text-blue-500 ${isLoading ? 'animate-pulse' : ''}`} />
    AI Insights
  </div>

  <div className="flex-1 overflow-y-auto p-5">
    {isLoading ? (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="text-xs uppercase tracking-widest animate-pulse">Analyzing Code...</p>
      </div>
    ) : response ? (
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown 
          rehypePlugins={[rehypeHighlight]} 
          components={{
            pre({ children }) {
              return (
                <pre className="rounded-lg p-0 overflow-hidden my-4 border border-gray-800">
                  {children}
                </pre>
              );
            },
            code({ className, children }) {
              // Если это блок кода (есть класс), highlight.js всё раскрасит сам
              return (
                <code className={`${className} px-1 rounded`}>
                  {children}
                </code>
              );
            }
          }}
        >
          {response.trim().startsWith('```') ? response : `\`\`\`cpp\n${response}\n\`\`\``}
        </ReactMarkdown>
      </div>
    ) : (

      <div className="flex flex-col items-center justify-center h-full opacity-30">
        <Cpu size={48} className="mb-4" />
        <p className="text-sm italic text-center px-10">Select an action to start analysis</p>
      </div>
    )}
  </div>
</section>

        </div>
      </main>
    </div>
  );
}