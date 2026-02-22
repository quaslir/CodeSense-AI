import { Terminal } from "lucide-react";
export default function TerminalWindow({ output, error }: { output: string; error: string }) {
  return (
    <div className="h-40 border-t border-gray-800 bg-[#0D1117] flex flex-col font-mono">
      <div className="flex items-center gap-2 px-4 py-1.5 bg-[#161B22] border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
        <Terminal size={12} /> Console Output
      </div>
      <div className="flex-1 overflow-y-auto p-3 text-xs leading-relaxed">
        {error ? (
          <div className="text-red-400 whitespace-pre-wrap">
            <span className="bg-red-900/30 px-1 rounded mr-2">Error</span>
            {error}
          </div>
        ) : output ? (
          <div className="text-green-400 whitespace-pre-wrap">
            <span className="bg-green-900/30 px-1 rounded mr-2">Success</span>
            {output}
          </div>
        ) : (
          <div className="text-gray-600 italic">No output yet. Run the code to see results...</div>
        )}
      </div>
    </div>
  );
}