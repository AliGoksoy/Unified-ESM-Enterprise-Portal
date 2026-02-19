import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isCollapsed }) => {
  const navItemClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group whitespace-nowrap ${
      isActive
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    } ${isCollapsed ? 'justify-center px-0' : ''}`;

  const iconClass = (isActive: boolean) =>
    `material-symbols-outlined text-[20px] transition-colors shrink-0 ${
      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
    }`;

  // Check if current view is any specific department page
  const isDepartmentActive = 
    currentView === ViewState.DEPARTMENTS_LIST ||
    currentView === ViewState.DEPT_HR ||
    currentView === ViewState.DEPT_IT ||
    currentView === ViewState.DEPT_FINANCE ||
    currentView === ViewState.DEPT_PROCUREMENT ||
    currentView === ViewState.DEPT_OPERATIONS ||
    currentView === ViewState.DEPT_LEGAL ||
    currentView === ViewState.DEPT_MARKETING;

  return (
    <aside 
      className={`bg-[#0f172a] h-full flex flex-col flex-shrink-0 border-r border-slate-800/50 pt-2 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
        {/* Section Header */}
        <div className={`px-3 mb-2 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          ANA MENÜ
        </div>
        
        <div
          className={navItemClass(currentView === ViewState.DASHBOARD)}
          onClick={() => onChangeView(ViewState.DASHBOARD)}
          title={isCollapsed ? "Genel Bakış" : undefined}
        >
          <span className={iconClass(currentView === ViewState.DASHBOARD)}>dashboard</span>
          {!isCollapsed && <span className="text-sm font-medium">Genel Bakış</span>}
        </div>

        <div
          className={navItemClass(currentView === ViewState.CONNECT)}
          onClick={() => onChangeView(ViewState.CONNECT)}
          title={isCollapsed ? "İletişim & Duyuru" : undefined}
        >
          <span className={iconClass(currentView === ViewState.CONNECT)}>forum</span>
          {!isCollapsed && <span className="text-sm font-medium">İletişim & Duyuru</span>}
        </div>

        <div
          className={navItemClass(currentView === ViewState.MESSAGES)}
          onClick={() => onChangeView(ViewState.MESSAGES)}
          title={isCollapsed ? "Mesajlar" : undefined}
        >
          <span className={iconClass(currentView === ViewState.MESSAGES)}>chat</span>
          {!isCollapsed && (
            <>
              <span className="text-sm font-medium flex-1">Mesajlar</span>
              <span className="bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full text-[10px] font-bold border border-emerald-500/30">
                3
              </span>
            </>
          )}
        </div>

        <div
          className={navItemClass(currentView === ViewState.INBOX)}
          onClick={() => onChangeView(ViewState.INBOX)}
          title={isCollapsed ? "İç Yazışma (Mail)" : undefined}
        >
          <span className={iconClass(currentView === ViewState.INBOX)}>mail</span>
          {!isCollapsed && (
            <>
              <span className="text-sm font-medium flex-1">İç Yazışma</span>
              <span className="bg-blue-500/20 text-blue-400 py-0.5 px-2 rounded-full text-[10px] font-bold border border-blue-500/30">
                2
              </span>
            </>
          )}
        </div>

        <div
          className={navItemClass(currentView === ViewState.TICKET_LIST || currentView === ViewState.TICKET_DETAIL)}
          onClick={() => onChangeView(ViewState.TICKET_LIST)}
          title={isCollapsed ? "Taleplerim" : undefined}
        >
          <span className={iconClass(currentView === ViewState.TICKET_LIST || currentView === ViewState.TICKET_DETAIL)}>confirmation_number</span>
          {!isCollapsed && (
            <>
              <span className="text-sm font-medium flex-1">Taleplerim</span>
              <span className="bg-rose-500/20 text-rose-300 py-0.5 px-2 rounded-full text-[10px] font-bold border border-rose-500/30">
                5
              </span>
            </>
          )}
        </div>

        <div
          className={navItemClass(isDepartmentActive)}
          onClick={() => onChangeView(ViewState.DEPARTMENTS_LIST)}
          title={isCollapsed ? "Departmanlar" : undefined}
        >
          <span className={iconClass(isDepartmentActive)}>apps</span>
          {!isCollapsed && <span className="text-sm font-medium">Departmanlar & Hizmetler</span>}
        </div>

        {/* Section Header */}
        <div className={`px-3 mt-8 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden mt-4' : 'opacity-100'}`}>
          ARAÇLAR
        </div>

        <div 
          className={navItemClass(currentView === ViewState.REPORTS)}
          onClick={() => onChangeView(ViewState.REPORTS)}
          title={isCollapsed ? "Raporlar" : undefined}
        >
          <span className={iconClass(currentView === ViewState.REPORTS)}>analytics</span>
          {!isCollapsed && <span className="text-sm font-medium">Raporlar</span>}
        </div>
        
        <div 
          className={navItemClass(currentView === ViewState.ADMIN_SETTINGS)}
          onClick={() => onChangeView(ViewState.ADMIN_SETTINGS)}
          title={isCollapsed ? "Sistem Yönetimi" : undefined}
        >
          <span className={iconClass(currentView === ViewState.ADMIN_SETTINGS)}>settings_applications</span>
          {!isCollapsed && <span className="text-sm font-medium">Sistem Yönetimi</span>}
        </div>

        <div 
          className={navItemClass(currentView === ViewState.APP_INTEGRATIONS)}
          onClick={() => onChangeView(ViewState.APP_INTEGRATIONS)}
          title={isCollapsed ? "Entegrasyonlar" : undefined}
        >
          <span className={iconClass(currentView === ViewState.APP_INTEGRATIONS)}>extension</span>
          {!isCollapsed && <span className="text-sm font-medium">Uygulamalar & Entegrasyon</span>}
        </div>

        <div 
          className={navItemClass(currentView === ViewState.SETTINGS)}
          onClick={() => onChangeView(ViewState.SETTINGS)}
          title={isCollapsed ? "Ayarlar" : undefined}
        >
          <span className={iconClass(currentView === ViewState.SETTINGS)}>settings</span>
          {!isCollapsed && <span className="text-sm font-medium">Kişisel Ayarlar</span>}
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
         <div className={`bg-[#1e293b]/50 rounded-xl border border-slate-800 transition-all ${isCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}>
             {!isCollapsed ? (
                <>
                   <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Depolama</span>
                       <span className="text-[10px] font-bold text-primary">85%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%] rounded-full"></div>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2">15GB / 20GB Kullanılıyor</p>
                </>
             ) : (
                <div className="w-full flex justify-center" title="Depolama: 85%">
                   <div className="h-8 w-8 rounded-full border-2 border-slate-700 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" style={{ animationDuration: '0s', transform: 'rotate(300deg)'}}></div>
                      <span className="text-[8px] font-bold text-white">85%</span>
                   </div>
                </div>
             )}
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
