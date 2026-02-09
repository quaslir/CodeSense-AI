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
export default function App() {
const [input, setInput] = useState<string>("");
const [response, setResponse] = useState<string>("");
const [isLoading, setIsLoading] = useState<boolean>(false);
async function send() {
  console.log("teST");
  setIsLoading(true);
  setResponse("");
try {
  const res = await fetch("http://localhost:3000/analyze", {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({input})
  });
  const data = await res.json();
  console.log(data.reply || "Errror");
}
catch(error) {
  console.error(error);
}
finally {
  setIsLoading(false);
}
}
 return (
    <div className="flex h-screen w-full bg-[#0D1117] text-gray-300 font-sans">
      
      {/* --- Sidebar --- */}
      <aside className="w-16 border-r border-gray-800 flex flex-col items-center py-4 gap-4 bg-[#161B22]">
        <div className="p-2 bg-blue-600 rounded-lg mb-4 text-white">
          <Cpu size={24} />
        </div>
        <button 
          onClick={() => send()} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl transition-colors title='Explain'"
        >
          <MessageSquareCode size={20} className="text-blue-400" />
        </button>
        <button 
          onClick={() => send()} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl transition-colors title='Debug'"
        >
          <Bug size={20} className="text-red-400" />
        </button>
        <button 
          onClick={() => send()} 
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
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-all">
            <Play size={12} /> Run Code
          </button>
        </header>

        {/* Editor & AI Panel Split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Editor Space */}
          <div className="flex-1 border-r border-gray-800">
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

          {/* AI Panel */}
          <section className="w-[450px] bg-[#0D1117] flex flex-col">
            <div className="p-3 border-b border-gray-800 bg-[#161B22] flex items-center gap-2 text-sm font-bold">
              <ChevronRight size={16} className={`text-blue-500 ${isLoading ? 'animate-pulse' : ''}`} />
              AI Insights
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <p className="text-xs uppercase tracking-widest animate-pulse">Analyzing Code...</p>
                </div>
              ) : response ? (
                <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-gray-600 text-sm italic text-center mt-20 px-10">
                  Select an action from the sidebar to analyze your logic.
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}