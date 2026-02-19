import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeView: (view: ViewState) => void;
  onToggleTheme: () => void;
}

type CommandItem = {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Help';
  icon: string;
  action: () => void;
  shortcut?: string;
};

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onChangeView, onToggleTheme }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // --- COMMAND DEFINITIONS ---
  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-dash', title: 'Genel Bakış (Dashboard)', category: 'Navigation', icon: 'dashboard', action: () => onChangeView(ViewState.DASHBOARD) },
    { id: 'nav-connect', title: 'Connect (Sosyal Akış)', category: 'Navigation', icon: 'forum', action: () => onChangeView(ViewState.CONNECT) },
    { id: 'nav-chat', title: 'Mesajlar (Chat)', category: 'Navigation', icon: 'chat', action: () => onChangeView(ViewState.MESSAGES) },
    { id: 'nav-inbox', title: 'İç Yazışma (Mail)', category: 'Navigation', icon: 'mail', action: () => onChangeView(ViewState.INBOX) },
    { id: 'nav-tickets', title: 'Taleplerim', category: 'Navigation', icon: 'confirmation_number', action: () => onChangeView(ViewState.TICKET_LIST) },
    { id: 'nav-reports', title: 'Raporlar & Analizler', category: 'Navigation', icon: 'analytics', action: () => onChangeView(ViewState.REPORTS) },
    { id: 'nav-admin', title: 'Sistem Yönetimi', category: 'Navigation', icon: 'settings_applications', action: () => onChangeView(ViewState.ADMIN_SETTINGS) },
    { id: 'nav-settings', title: 'Kişisel Ayarlar', category: 'Navigation', icon: 'settings', action: () => onChangeView(ViewState.SETTINGS) },
    { id: 'nav-dept', title: 'Departman Listesi', category: 'Navigation', icon: 'apps', action: () => onChangeView(ViewState.DEPARTMENTS_LIST) },
    
    // Departments
    { id: 'dept-it', title: 'IT Portalı', category: 'Navigation', icon: 'terminal', action: () => onChangeView(ViewState.DEPT_IT) },
    { id: 'dept-hr', title: 'İK Portalı', category: 'Navigation', icon: 'groups', action: () => onChangeView(ViewState.DEPT_HR) },
    { id: 'dept-fin', title: 'Finans Portalı', category: 'Navigation', icon: 'payments', action: () => onChangeView(ViewState.DEPT_FINANCE) },
    
    // Actions
    { id: 'act-new', title: 'Yeni Talep Oluştur', category: 'Actions', icon: 'add_circle', action: () => onChangeView(ViewState.DEPARTMENTS_LIST), shortcut: 'N' },
    { id: 'act-theme', title: 'Temayı Değiştir (Karanlık/Aydınlık)', category: 'Actions', icon: 'contrast', action: () => onToggleTheme(), shortcut: 'T' },
    
    // Help (Mock)
    { id: 'hlp-vpn', title: 'VPN Bağlantı Sorunları', category: 'Help', icon: 'help', action: () => console.log('Help') },
    { id: 'hlp-pass', title: 'Şifre Sıfırlama Prosedürü', category: 'Help', icon: 'lock_reset', action: () => console.log('Help') },
  ];

  // Filter commands
  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
        const activeItem = listRef.current.children[selectedIndex] as HTMLElement;
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <span className="material-symbols-outlined text-slate-400 text-[24px]">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-4 text-lg text-slate-800 dark:text-slate-100 placeholder-slate-400"
            placeholder="Ne yapmak istiyorsunuz?"
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs text-slate-500 dark:text-slate-400 font-bold">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div 
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto py-2"
        >
          {filteredCommands.length > 0 ? (
            <>
                {/* Group logic could be added here, currently flat list for simplicity but sorted by category implicitly via array order if needed */}
                {filteredCommands.map((cmd, index) => (
                    <div
                        key={cmd.id}
                        onClick={() => {
                            cmd.action();
                            onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`mx-2 px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                            index === selectedIndex 
                            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                             <span className={`material-symbols-outlined ${index === selectedIndex ? 'text-primary' : 'text-slate-400'}`}>
                                {cmd.icon}
                             </span>
                             <div className="flex flex-col">
                                 <span className={`text-sm font-medium ${index === selectedIndex ? 'font-bold' : ''}`}>
                                    {cmd.title}
                                 </span>
                                 <span className="text-[10px] text-slate-400 opacity-80 uppercase tracking-wider font-bold">
                                    {cmd.category === 'Navigation' ? 'Git' : cmd.category === 'Actions' ? 'İşlem' : 'Yardım'}
                                 </span>
                             </div>
                        </div>
                        {cmd.shortcut && (
                            <span className="text-xs text-slate-400 font-mono hidden sm:block">
                                {cmd.shortcut}
                            </span>
                        )}
                        {index === selectedIndex && !cmd.shortcut && (
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                Seç
                                <span className="material-symbols-outlined text-[14px]">keyboard_return</span>
                            </span>
                        )}
                    </div>
                ))}
            </>
          ) : (
            <div className="py-12 px-6 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
                <p>Sonuç bulunamadı.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
            <div className="flex gap-4">
                <span><strong className="text-slate-500 dark:text-slate-300">↑↓</strong> gezinmek için</span>
                <span><strong className="text-slate-500 dark:text-slate-300">enter</strong> seçmek için</span>
            </div>
            <span>RetailMind OS</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
