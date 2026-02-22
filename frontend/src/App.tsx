import { useState } from "react"
import { useEffect } from "react"
import { Editor } from "@monaco-editor/react";
import { 
  ChevronRight

} from 'lucide-react';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import TerminalWindow from "./Terminal";
import { availableLanguages } from "./Langs";
import type { Language } from "./Langs";
import { useMonaco } from "@monaco-editor/react";
import 'highlight.js/styles/atom-one-dark.css'
import Header from "./Header";
import Content from "./Content";
import Slidebar from "./Slidebar";
import Settings from "./Settings";
let debounceTimer: number | undefined;
export default function App() {
const monaco = useMonaco();
const [input, setInput] = useState<string>(localStorage.getItem("saved_code") || "");
const [response, setResponse] = useState<string>("");
const [isLoading, setIsLoading] = useState<boolean>(false);
const [output, setOutput] = useState<string>("");
const [error, setError] = useState<string>("");
const [selectedLang, setSelectedLang] = useState<Language>(availableLanguages[0]);
const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
interface Settings {
  autocomplete:boolean,
  model: string
};
const [settings, setSettings] = useState<Settings>(
  {autocomplete: JSON.parse(localStorage.getItem("settings_auto") || "true"),
  model: localStorage.getItem("settings_model") || "Llama-3-70b"
})
async function send(model:number) {
  setIsLoading(true);
  setResponse("");
try {
  const res = await axios.post("http://localhost:3000/analyze", {
    input, model
  })
  const data = await res.data;
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
    if(!input) {
    setResponse("");
    return;
  }
  localStorage.setItem("saved_code", input);

}, [input]);

const updateSettings = (newSettings:Settings) => {
  setSettings(prev => {
    const updated = {...prev, ...newSettings};
  localStorage.setItem("settings_auto", JSON.stringify(updated.autocomplete));
  localStorage.setItem("settings_model", updated.model);
    return updated;
  });
}





const delay = (ms: number) => new Promise(res => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(res, ms);
});



useEffect(() => {
  if(!monaco) return;
  const provider = monaco.languages.registerInlineCompletionsProvider(selectedLang.name, {
    provideInlineCompletions: async(
      model: monaco.editor.ITextModel, 
      position: monaco.Position,       
      context: any,                          
      token: monaco.CancellationToken) => {
      if(!settings.autocomplete) return {items: []};

      await delay(500);

      if(token.isCancellationRequested) return {items: []};

      const startLine = Math.max(1, position.lineNumber - 50);

      const codeContext = model.getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });


      try {
        const res = await axios.post("http://localhost:3000/api/autocomplete", {
          code: codeContext,
          lang:selectedLang.name,
          model:settings.model
        });
        const suggestion = res.data.suggestion;

        const wordInfo = model.getWordUntilPosition(position);

        const startColumn = wordInfo ? wordInfo.startColumn : position.column;

         const endColumn = position.column;

        return {
          items: [
            {
              insertText: suggestion,
              range: {
                startLineNumber:position.lineNumber,
                startColumn:startColumn,
                endLineNumber:position.lineNumber,
                endColumn:endColumn
              },
            },
          ],
        };
      } catch(error) {
        console.error("Autocomplete error: ", error);
        return {items: []};

      }
    },
    freeInlineCompletions: () => {} ,
    disposeInlineCompletions:() => {}
  } as any
);

  return () => provider.dispose();
}, [selectedLang, settings, monaco]);



 return (
    <div className="flex h-screen w-full bg-[#0D1117] text-gray-300 font-sans">
      
      {/* --- Sidebar --- */}

  <Slidebar isLoading={isLoading} onSend={send} onSetIsSettingsOpen={setIsSettingsOpen}/>
      {/* --- Main Area --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        
      <Header selectedLang={selectedLang} onLanguageChange={setSelectedLang} onRunCode={runCode} />
        {/* Editor & AI Panel Split */}
        <div className="flex-1 flex overflow-hidden">
<div className="flex-1 flex flex-col border-r border-gray-800">
  
  <div className="flex-1">
    <Editor
      height="100%"
      language={selectedLang.name}
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


          <section className="h-full bg-[#0D1117] flex flex-col min-w-0 flex-1">
  <div className="p-3 border-b border-gray-800 bg-[#161B22] flex items-center justify-between shrink-0">
    <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-gray-200">
      <ChevronRight 
        size={16} 
        className={`text-blue-500 transition-transform ${isLoading ? 'animate-pulse' : ''}`} 
      />
      AI Insights
    </div>
    {response && !isLoading && (
      <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-gray-800/50 px-2 py-0.5 rounded">
        Analysis Ready
      </span>
    )}
  </div>

  {/* Content Area */}
  <Content response={response} isLoading={isLoading} />

</section>
        </div>
    
      </main>

      <Settings 
    isOpen={isSettingsOpen} 
    onClose={() => setIsSettingsOpen(false)} 
    settings={settings} 
    updateSettings={updateSettings} 
  />
    </div>
  );
}