import { availableLanguages } from "./Langs";
import type { Language } from "./Langs";
import { 
  Play,
  ChevronRight, 
  Terminal,
} from 'lucide-react';

interface HeaderProps {
  selectedLang: Language;
  onLanguageChange: (lang: Language) => void;
  onRunCode: (langId: number) => void;
};

export default function Header({selectedLang, onLanguageChange, onRunCode}:HeaderProps) {
    
    return (
        <header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-[#161B22] shrink-0">
  <div className="flex items-center gap-3">
    <Terminal size={14} className="text-gray-500" />
    
    <div className="relative group">
      <select 
        value={selectedLang.name}
        onChange={(e) => {
          const lang = availableLanguages.find(l => l.name === e.target.value);
          if (lang) onLanguageChange(lang);
        }}
        className="bg-transparent text-xs font-medium uppercase tracking-widest text-gray-300 outline-none cursor-pointer hover:text-blue-400 transition-colors appearance-none pr-4"
      >
        {availableLanguages.map(lang => (
          <option key={lang.id} value={lang.name} className="bg-[#161B22] text-gray-300">
            {lang.name}
          </option>
        ))}
      </select>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronRight size={10} className="rotate-90 text-gray-600" />
      </div>
    </div>
  </div>

  <button 
    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs cursor-pointer transition-all active:scale-95"
    onClick={() => onRunCode(selectedLang.id)} 
  >
    <Play size={12} /> Run Code
  </button>
</header>
    )
}