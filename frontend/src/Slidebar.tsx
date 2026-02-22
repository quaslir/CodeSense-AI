import { 
  Bug, 
  Zap, 
  MessageSquareCode, 
  Cpu,
  SettingsIcon
} from 'lucide-react';

interface SlidebarProps {
    isLoading:boolean,
    onSend:(mode:number) => void;
    onSetIsSettingsOpen:(isSettingOpen:boolean) => void;
};

export default function Slidebar({isLoading, onSend, onSetIsSettingsOpen}:SlidebarProps) {
    return (
              <aside className="w-16 border-r border-gray-800 flex flex-col items-center py-4 gap-4 bg-[#161B22]">
        <div className="p-2 bg-blue-600 rounded-lg mb-4 text-white">
          <Cpu size={24} />
        </div>
        <button 
          onClick={() => onSend(0)} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition-colors title='Explain'"
        >
          <MessageSquareCode size={20} className="text-blue-400" />
        </button>
        <button 
          onClick={() => onSend(1)} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition-colors title='Debug'"
        >
          <Bug size={20} className="text-red-400" />
        </button>
        <button 
          onClick={() => onSend(2)} 
          disabled={isLoading}
          className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition-colors title='Optimize'"
        >
          <Zap size={20} className="text-yellow-400" />
        </button>

        <div className="mt-auto"> {/* Это прижмет кнопку к низу */}
    <button 
      onClick={() => onSetIsSettingsOpen(true)}
      className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition-colors text-gray-500 hover:text-white"
    >
      <SettingsIcon size={20} />
    </button>
  </div>
      </aside>
    );
}