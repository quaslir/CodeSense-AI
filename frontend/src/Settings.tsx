import { X, Cpu, Zap, Brain } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    autocomplete: boolean;
    model: string;
  };
  updateSettings: (newSettings: any) => void;
}

export default function Settings({ isOpen, onClose, settings, updateSettings }: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[400px] bg-[#161B22] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#0D1117]">
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Cpu size={16} className="text-blue-500" /> System Settings
          </h2>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded-md transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Autocomplete Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-200">AI Autocomplete</div>
              <div className="text-[10px] text-gray-500 uppercase">Predictive ghost text as you type</div>
            </div>
            <button 
              onClick={() => updateSettings({ ...settings, autocomplete: !settings.autocomplete })}
              className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${settings.autocomplete ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autocomplete ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-200">Intelligence Engine</div>
            <div className="grid grid-cols-2 gap-2">
              {['Llama-3-70b', 'Mixtral-8x7b'].map((m) => (
                <button
                  key={m}
                  onClick={() => updateSettings({ ...settings, model: m })}
                  className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-2 ${
                    settings.model === m ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-gray-800 hover:border-gray-600 cursor-pointer'
                  }`}
                >
                  {m.includes('Llama') ? <Brain size={16} /> : <Zap size={16} />}
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0D1117] border-t border-gray-800 text-[10px] text-center text-gray-500">
          Settings are saved to local storage
        </div>
      </div>
    </div>
  );
}