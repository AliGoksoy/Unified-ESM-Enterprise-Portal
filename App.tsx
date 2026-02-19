import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import DepartmentPortal from './pages/DepartmentPortal';
import GenericRequest from './pages/GenericRequest';
import DepartmentsList from './pages/DepartmentsList';
import AdminSettings from './pages/AdminSettings';
import AppIntegrations from './pages/AppIntegrations';
import Reports from './pages/Reports';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings'; // New Import
import Connect from './pages/Connect';
import Messages from './pages/Messages';
import Inbox from './pages/Inbox';
import ToastContainer from './components/ToastContainer';
import CommandPalette from './components/CommandPalette';
import { ViewState, ServiceCategory, Asset } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Track previous view to return to correct department from request form
  const [previousDeptView, setPreviousDeptView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Track selected ticket for detail view
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleDepartmentCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setPreviousDeptView(currentView);
    setCurrentView(ViewState.GENERIC_REQUEST);
  };

  const handleBackToDepartment = () => {
    setCurrentView(previousDeptView);
    setSelectedCategory(null);
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCurrentView(ViewState.TICKET_DETAIL);
  };

  // Handle reporting an issue from My Assets
  const handleReportAssetIssue = (asset: Asset) => {
     // Create a temporary category for Hardware Issue
     const hardwareCategory: ServiceCategory = {
         id: 'asset_report',
         title: `${asset.name} - Arıza Bildirimi`,
         description: `${asset.serialNumber} seri numaralı cihaz için arıza kaydı.`,
         icon: asset.icon,
         formType: 'HARDWARE'
     };
     setSelectedCategory(hardwareCategory);
     setPreviousDeptView(ViewState.USER_PROFILE); // Return to profile after
     setCurrentView(ViewState.GENERIC_REQUEST);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onChangeView={setCurrentView} />;
      
      case ViewState.CONNECT:
        return <Connect />;

      case ViewState.MESSAGES:
        return <Messages />;

      case ViewState.INBOX:
        return <Inbox />;

      case ViewState.TICKET_LIST:
        return <TicketList onTicketSelect={handleTicketSelect} onCreateRequest={handleDepartmentCategorySelect} />;
      
      case ViewState.TICKET_DETAIL:
        return <TicketDetail onBack={() => setCurrentView(ViewState.TICKET_LIST)} />;
      
      case ViewState.DEPARTMENTS_LIST:
        return <DepartmentsList onChangeView={setCurrentView} />;
      
      case ViewState.ADMIN_SETTINGS:
        return <AdminSettings />;

      case ViewState.APP_INTEGRATIONS: 
        return <AppIntegrations />;

      case ViewState.SETTINGS: // New Route
        return <Settings />;
      
      case ViewState.REPORTS:
        return <Reports />;
      
      case ViewState.USER_PROFILE:
        return <UserProfile onReportIssue={handleReportAssetIssue} />;

      // All Department Portals
      case ViewState.DEPT_IT:
      case ViewState.DEPT_FINANCE:
      case ViewState.DEPT_OPERATIONS:
      case ViewState.DEPT_LEGAL:
      case ViewState.DEPT_MARKETING:
      case ViewState.DEPT_HR:
      case ViewState.DEPT_PROCUREMENT:
        return (
          <DepartmentPortal 
            currentView={currentView} 
            onSelectCategory={handleDepartmentCategorySelect}
            onChangeView={setCurrentView}
          />
        );
      
      // Generic Request Form
      case ViewState.GENERIC_REQUEST:
        return (
          <GenericRequest 
            category={selectedCategory} 
            onBack={handleBackToDepartment} 
          />
        );

      default:
        return <Dashboard onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <ToastContainer />
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        onChangeView={setCurrentView}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
      
      <Header 
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSearchClick={() => setIsPaletteOpen(true)}
        onNavigate={setCurrentView}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          onChangeView={setCurrentView} 
          isCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto relative transition-all duration-300 bg-slate-50 dark:bg-slate-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
