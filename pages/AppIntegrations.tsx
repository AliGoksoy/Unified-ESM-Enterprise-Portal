import React, { useState } from 'react';
import { IntegrationApp } from '../types';
import { useToast } from '../context/ToastContext';

// --- MOCK INTEGRATIONS DATA ---
const mockIntegrations: IntegrationApp[] = [
  {
    id: 'jira',
    name: 'Jira Software',
    description: 'IT taleplerini Jira projeleriyle eşleştirin ve issue takibi yapın.',
    category: 'Development',
    logo: 'developer_board', // Material icon
    status: 'CONNECTED',
    isInstalled: true,
    config: { apiKey: '••••••••••••', webhookUrl: 'https://jira.company.com/webhook', syncFrequency: 'Real-time' }
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Bildirimleri Slack kanallarına gönderin ve komutlarla talep açın.',
    category: 'Communication',
    logo: 'tag', // Using generic icon to simulate Slack
    status: 'CONNECTED',
    isInstalled: true,
    config: { apiKey: 'xoxb-12345...', webhookUrl: 'https://hooks.slack.com/...' }
  },
  {
    id: 'msteams',
    name: 'Microsoft Teams',
    description: 'Teams üzerinden onay süreçlerini yönetin ve toplantı planlayın.',
    category: 'Communication',
    logo: 'groups',
    status: 'DISCONNECTED',
    isInstalled: true
  },
  {
    id: 'sap',
    name: 'SAP S/4HANA',
    description: 'Satın alma ve İK modülleri ile çift yönlü veri senkronizasyonu.',
    category: 'Finance',
    logo: 'account_balance',
    status: 'CONNECTED',
    isInstalled: true
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Toplantı odası rezervasyonları için Zoom Rooms entegrasyonu.',
    category: 'Productivity',
    logo: 'videocam',
    status: 'DISCONNECTED',
    isInstalled: false
  },
  {
    id: 'office365',
    name: 'Office 365',
    description: 'Takvim ve E-posta senkronizasyonu için kurumsal bağlantı.',
    category: 'Productivity',
    logo: 'mail',
    status: 'DISCONNECTED',
    isInstalled: false
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Commit ve PR durumlarını talep detaylarında görüntüleyin.',
    category: 'Development',
    logo: 'code',
    status: 'DISCONNECTED',
    isInstalled: false
  },
  {
    id: 'workday',
    name: 'Workday',
    description: 'Personel veritabanı ve izin yönetimi senkronizasyonu.',
    category: 'HR',
    logo: 'badge',
    status: 'DISCONNECTED',
    isInstalled: false
  }
];

const AppIntegrations: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'INSTALLED' | 'MARKETPLACE'>('INSTALLED');
  const [integrations, setIntegrations] = useState<IntegrationApp[]>(mockIntegrations);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // Form States
  const [formApiKey, setFormApiKey] = useState('');
  const [formUrl, setFormUrl] = useState('');

  // --- FILTER LOGIC ---
  const displayedApps = integrations.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'INSTALLED' ? app.isInstalled : !app.isInstalled;
      return matchesSearch && matchesTab;
  });

  // --- ACTIONS ---
  
  const handleOpenConfig = (app: IntegrationApp) => {
      setSelectedApp(app);
      setFormApiKey(app.config?.apiKey || '');
      setFormUrl(app.config?.webhookUrl || '');
      setIsDrawerOpen(true);
  };

  const handleConnect = () => {
      setIsTestingConnection(true);
      // Simulate API call
      setTimeout(() => {
          setIsTestingConnection(false);
          if (selectedApp) {
              setIntegrations(prev => prev.map(app => 
                  app.id === selectedApp.id 
                  ? { ...app, isInstalled: true, status: 'CONNECTED', config: { apiKey: formApiKey, webhookUrl: formUrl } } 
                  : app
              ));
              addToast(`${selectedApp.name} başarıyla bağlandı.`, 'success');
              setIsDrawerOpen(false);
          }
      }, 1500);
  };

  const handleDisconnect = () => {
      if (confirm('Bu entegrasyonu kaldırmak istediğinize emin misiniz?')) {
          if (selectedApp) {
              setIntegrations(prev => prev.map(app => 
                  app.id === selectedApp.id 
                  ? { ...app, isInstalled: false, status: 'DISCONNECTED', config: undefined } 
                  : app
              ));
              addToast(`${selectedApp.name} bağlantısı kesildi.`, 'info');
              setIsDrawerOpen(false);
          }
      }
  };

  // --- RENDERERS ---

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-300 relative">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                 <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-primary">extension</span>
                    Uygulamalar ve Entegrasyonlar
                 </h1>
                 <p className="text-slate-500 dark:text-slate-400 mt-1">Harici sistemleri bağlayın, iş akışlarını otomatikleştirin.</p>
             </div>
             
             <div className="flex gap-4">
                 <div className="relative">
                     <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                     <input 
                        type="text" 
                        placeholder="Uygulama ara..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
                     />
                 </div>
                 <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                     <button 
                        onClick={() => setActiveTab('INSTALLED')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'INSTALLED' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                     >
                        Kurulu
                     </button>
                     <button 
                        onClick={() => setActiveTab('MARKETPLACE')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'MARKETPLACE' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                     >
                        Marketplace
                     </button>
                 </div>
             </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-8">
            {displayedApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search_off</span>
                    <p className="text-lg font-medium">Aradığınız kriterlere uygun uygulama bulunamadı.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedApps.map(app => (
                        <div key={app.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full group relative overflow-hidden">
                            {/* Status Stripe */}
                            {app.isInstalled && (
                                <div className={`absolute top-0 left-0 w-full h-1 ${app.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                                    app.isInstalled ? 'bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-700 grayscale'
                                }`}>
                                    <span className="material-symbols-outlined">{app.logo}</span>
                                </div>
                                {app.isInstalled && (
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                        app.status === 'CONNECTED' 
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' 
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                                    }`}>
                                        {app.status === 'CONNECTED' ? 'Aktif' : 'Pasif'}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{app.name}</h3>
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-3 opacity-80">{app.category}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">{app.description}</p>

                            <button 
                                onClick={() => handleOpenConfig(app)}
                                className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                    app.isInstalled 
                                    ? 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'
                                    : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
                                }`}
                            >
                                {app.isInstalled ? (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">settings</span>
                                        Ayarları Yönet
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                        Entegre Et
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- CONFIGURATION DRAWER --- */}
        {isDrawerOpen && selectedApp && (
            <>
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
                <div className="absolute top-0 right-0 h-full w-[450px] bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-700">
                    
                    {/* Drawer Header */}
                    <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                                <span className="material-symbols-outlined text-2xl">{selectedApp.logo}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedApp.name}</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">{selectedApp.category}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Drawer Body */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">info</span>
                            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                                Bu entegrasyonu etkinleştirmek için {selectedApp.name} yönetici panelinden alacağınız API anahtarını girmeniz gerekmektedir.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">API Key / Token</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        value={formApiKey}
                                        onChange={(e) => setFormApiKey(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-mono" 
                                        placeholder="xoxb-your-token-here"
                                    />
                                    <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-[18px]">key</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Webhook / Endpoint URL</label>
                                <input 
                                    type="text" 
                                    value={formUrl}
                                    onChange={(e) => setFormUrl(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" 
                                    placeholder="https://api.example.com/v1/webhook"
                                />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Otomatik Senkronizasyon</h4>
                                    <p className="text-xs text-slate-500">Veriler her 15 dakikada bir güncellenir.</p>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-primary transition"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-3">
                        <button 
                            onClick={handleConnect}
                            disabled={isTestingConnection}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all ${
                                isTestingConnection ? 'bg-primary/70 cursor-wait' : 'bg-primary hover:bg-primary-hover'
                            }`}
                        >
                            {isTestingConnection ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Bağlantı Test Ediliyor...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">link</span>
                                    {selectedApp.isInstalled ? 'Ayarları Güncelle' : 'Bağlantıyı Kur'}
                                </>
                            )}
                        </button>
                        
                        {selectedApp.isInstalled && (
                            <button 
                                onClick={handleDisconnect}
                                className="w-full py-3 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                            >
                                Entegrasyonu Kaldır
                            </button>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default AppIntegrations;
