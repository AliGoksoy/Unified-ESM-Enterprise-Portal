import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { ViewState } from '../types';

interface HeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSearchClick?: () => void;
  onNavigate: (view: ViewState) => void;
}

// Mock Notifications
const mockNotifications = [
  { id: 1, title: 'Talep Onaylandı', desc: 'VPN erişim talebiniz yönetici tarafından onaylandı.', time: '5 dk önce', unread: true, type: 'success' },
  { id: 2, title: 'Yeni Mesaj', desc: 'Ali Göksoy: "Sertifika süresi dolmuş olabilir..."', time: '1 sa önce', unread: true, type: 'info' },
  { id: 3, title: 'Sistem Bakımı', desc: 'Bu gece 02:00 - 04:00 arası planlı bakım.', time: '3 sa önce', unread: false, type: 'warning' },
];

const Header: React.FC<HeaderProps> = ({ 
  isSidebarCollapsed, 
  onToggleSidebar, 
  isDarkMode, 
  onToggleTheme,
  onSearchClick,
  onNavigate
}) => {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserOpen(false);
    addToast('Başarıyla çıkış yapıldı. (Demo)', 'success');
  };

  const handleProfileClick = () => {
    onNavigate(ViewState.USER_PROFILE);
    setIsUserOpen(false);
  };

  const handleSettingsClick = () => {
    onNavigate(ViewState.SETTINGS);
    setIsUserOpen(false);
  };

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <header className="bg-[#0B1120] text-slate-300 h-14 flex items-center justify-between shrink-0 border-b border-slate-800/50 z-40 relative transition-colors duration-300">
      {/* Left: Branding & Toggle */}
      <div className={`flex items-center h-full border-r border-slate-800/50 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20 px-0 justify-center' : 'w-64 px-4'}`}>
        <div className={`flex items-center gap-3 flex-1 overflow-hidden ${isSidebarCollapsed ? 'hidden' : 'flex'}`}>
          <div className="h-8 w-8 bg-[#F43F5E] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-900/20 shrink-0">
            R
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <span className="text-white text-sm font-bold leading-none tracking-tight truncate">RetailMind</span>
            <span className="text-[10px] text-slate-500 font-medium leading-none mt-1 truncate">Workspace Portal</span>
          </div>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={onToggleSidebar}
          className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          title={isSidebarCollapsed ? "Menüyü Aç" : "Menüyü Daralt"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSidebarCollapsed ? 'menu_open' : 'menu'}
          </span>
        </button>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 px-6 flex items-center">
        <div 
            className="relative group w-full max-w-md cursor-pointer"
            onClick={onSearchClick}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-500 text-[18px]">search</span>
          </div>
          <input
            type="text"
            readOnly
            className="block w-full pl-10 pr-12 py-1.5 border border-slate-700/50 rounded-lg leading-5 bg-[#1e293b]/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-[#1e293b] focus:border-slate-600 focus:ring-1 focus:ring-slate-600 sm:text-xs transition-all cursor-pointer hover:bg-[#1e293b]"
            placeholder="Çalışma alanı ara..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="inline-flex items-center border border-slate-600 rounded px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-slate-700/50">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 px-6 h-full border-l border-slate-800/50">
        
        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          title={isDarkMode ? "Aydınlık Mod" : "Karanlık Mod"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800 relative ${isNotifOpen ? 'bg-slate-800 text-white' : ''}`}
              title="Bildirimler"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[#0B1120]"></span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                 <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Bildirimler</h3>
                    <button className="text-[10px] font-bold text-primary hover:underline">Tümünü Okundu Say</button>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto">
                    {mockNotifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${notif.unread ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                          <div className="flex gap-3">
                             <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                               notif.type === 'success' ? 'bg-emerald-500' : 
                               notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                             }`}></div>
                             <div>
                                <h4 className={`text-xs font-bold mb-0.5 ${notif.unread ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                  {notif.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {notif.desc}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">{notif.time}</span>
                             </div>
                          </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      Tüm Geçmişi Gör
                    </button>
                 </div>
              </div>
            )}
        </div>
        
        <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userRef}>
            <button 
              onClick={() => setIsUserOpen(!isUserOpen)}
              className={`flex items-center gap-3 hover:bg-slate-800 py-1.5 px-2 rounded-lg transition-colors group ${isUserOpen ? 'bg-slate-800' : ''}`}
            >
              <div className="h-7 w-7 rounded-full bg-indigo-900/50 border border-indigo-700/50 flex items-center justify-center text-indigo-200 text-xs font-medium shrink-0">
                SA
              </div>
              <span className={`text-xs font-medium hidden xl:block ${isUserOpen ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-200'}`}>
                superadmin@retailmind.com
              </span>
              <span className={`material-symbols-outlined text-slate-500 text-[16px] transition-transform duration-200 ${isUserOpen ? 'rotate-180 text-slate-300' : 'group-hover:text-slate-300'}`}>
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {isUserOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Süper Admin</p>
                      <p className="text-xs text-slate-500 truncate">superadmin@retailmind.com</p>
                  </div>
                  
                  <div className="p-1.5">
                      <button 
                        onClick={handleProfileClick}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                      >
                          <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                          Profilim & Varlıklarım
                      </button>
                      <button 
                        onClick={handleSettingsClick}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                      >
                          <span className="material-symbols-outlined text-[18px] text-slate-400">settings</span>
                          Ayarlar
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                          <span className="material-symbols-outlined text-[18px] text-slate-400">help</span>
                          Yardım Merkezi
                      </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 p-1.5">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 transition-colors font-medium"
                      >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Çıkış Yap
                      </button>
                  </div>
              </div>
            )}
        </div>

      </div>
    </header>
  );
};

export default Header;
