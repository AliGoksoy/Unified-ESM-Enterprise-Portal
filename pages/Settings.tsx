import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

type SettingsTab = 'GENERAL' | 'PROFILE' | 'NOTIFICATIONS' | 'SECURITY' | 'APPEARANCE';

const Settings: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('GENERAL');

  // Mock State
  const [language, setLanguage] = useState('tr');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [slackNotif, setSlackNotif] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = () => {
    // Simulate save
    setTimeout(() => {
        addToast('Ayarlar başarıyla güncellendi.', 'success');
    }, 500);
  };

  const tabs = [
      { id: 'GENERAL', label: 'Genel', icon: 'tune' },
      { id: 'PROFILE', label: 'Profil', icon: 'person' },
      { id: 'NOTIFICATIONS', label: 'Bildirimler', icon: 'notifications' },
      { id: 'SECURITY', label: 'Güvenlik', icon: 'security' },
      { id: 'APPEARANCE', label: 'Görünüm', icon: 'palette' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 shrink-0">
             <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary">settings</span>
                Kişisel Ayarlar
             </h1>
             <p className="text-slate-500 dark:text-slate-400 mt-1">Hesap tercihlerinizi ve uygulama deneyiminizi özelleştirin.</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex flex-col gap-1 shrink-0">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SettingsTab)}
                        className={`text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
                            activeTab === tab.id 
                            ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-slate-700' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`}>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Form Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-8">
                    
                    {/* GENERAL TAB */}
                    {activeTab === 'GENERAL' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Bölge ve Dil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Uygulama Dili</label>
                                        <select 
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                                        >
                                            <option value="tr">Türkçe (TR)</option>
                                            <option value="en">English (US)</option>
                                            <option value="de">Deutsch (DE)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Saat Dilimi</label>
                                        <select 
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                                            defaultValue="europe_istanbul"
                                        >
                                            <option value="europe_istanbul">(GMT+03:00) İstanbul</option>
                                            <option value="europe_london">(GMT+00:00) London</option>
                                            <option value="america_new_york">(GMT-05:00) New York</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Erişilebilirlik</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Yüksek Kontrast</span>
                                            <span className="text-xs text-slate-500">Metin ve arkaplan kontrastını artırır.</span>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700">
                                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                                        </div>
                                    </label>
                                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Animasyonları Azalt</span>
                                            <span className="text-xs text-slate-500">Arayüz geçişlerini basitleştirir.</span>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700">
                                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'PROFILE' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl font-bold text-slate-500 dark:text-slate-300 ring-4 ring-white dark:ring-slate-800 shadow-lg">
                                    SA
                                </div>
                                <div>
                                    <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                                        Fotoğrafı Değiştir
                                    </button>
                                    <p className="text-xs text-slate-400 mt-2">JPG, GIF veya PNG. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Ad Soyad</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Süper Admin" 
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" 
                                    />
                                    <p className="text-[10px] text-slate-400">Bu bilgi Identity sisteminden gelmektedir.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Ünvan</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Sistem Yöneticisi" 
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Telefon</label>
                                    <input 
                                        type="text" 
                                        defaultValue="+90 555 123 45 67" 
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Lokasyon</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Merkez Ofis - Kat 4" 
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'NOTIFICATIONS' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Bildirim Tercihleri</h3>
                            
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">E-posta Bildirimleri</span>
                                            <span className="text-xs text-slate-500">Önemli güncellemeleri mail olarak al.</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setEmailNotif(!emailNotif)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotif ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                            <span className="material-symbols-outlined">notifications_active</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Push Bildirimleri</span>
                                            <span className="text-xs text-slate-500">Tarayıcı ve mobil bildirimleri.</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setPushNotif(!pushNotif)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotif ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                            <span className="material-symbols-outlined">tag</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Slack Entegrasyonu</span>
                                            <span className="text-xs text-slate-500">Onayları Slack üzerinden yönet.</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSlackNotif(!slackNotif)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${slackNotif ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${slackNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'SECURITY' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 dark:text-emerald-400">
                                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 dark:text-emerald-200">Hesabınız Güvende</h4>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400">Son şifre değişikliği: 14 gün önce.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">İki Faktörlü Doğrulama (2FA)</h4>
                                        <p className="text-xs text-slate-500">Giriş yaparken telefonunuza kod gönderilir.</p>
                                    </div>
                                    <button 
                                        onClick={() => setTwoFactor(!twoFactor)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">Aktif Oturumlar</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-slate-400">laptop_mac</span>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">MacBook Pro - Istanbul, TR</p>
                                                    <p className="text-[10px] text-emerald-600 font-bold">Şu an aktif</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-slate-400">smartphone</span>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">iPhone 14 - Istanbul, TR</p>
                                                    <p className="text-[10px] text-slate-400">2 saat önce</p>
                                                </div>
                                            </div>
                                            <button className="text-rose-500 text-xs font-bold hover:underline">Çıkış Yap</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* APPEARANCE TAB */}
                    {activeTab === 'APPEARANCE' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Tema Tercihi</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="cursor-pointer group">
                                        <div className="h-24 rounded-xl bg-slate-100 border-2 border-primary relative overflow-hidden shadow-sm">
                                            <div className="absolute inset-x-0 top-0 h-4 bg-white border-b border-slate-200"></div>
                                            <div className="absolute left-0 top-4 bottom-0 w-6 bg-slate-200 border-r border-slate-300"></div>
                                            <div className="absolute right-2 bottom-2 bg-primary w-4 h-4 rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-[10px]">check</span>
                                            </div>
                                        </div>
                                        <p className="text-center text-xs font-bold mt-2 text-primary">Sistem Teması</p>
                                    </div>
                                    <div className="cursor-pointer group opacity-50 hover:opacity-100 transition-opacity">
                                        <div className="h-24 rounded-xl bg-white border-2 border-slate-200 relative overflow-hidden shadow-sm">
                                            <div className="absolute inset-x-0 top-0 h-4 bg-slate-50 border-b border-slate-100"></div>
                                            <div className="absolute left-0 top-4 bottom-0 w-6 bg-slate-100 border-r border-slate-200"></div>
                                        </div>
                                        <p className="text-center text-xs font-bold mt-2 text-slate-500">Aydınlık</p>
                                    </div>
                                    <div className="cursor-pointer group opacity-50 hover:opacity-100 transition-opacity">
                                        <div className="h-24 rounded-xl bg-slate-900 border-2 border-slate-700 relative overflow-hidden shadow-sm">
                                            <div className="absolute inset-x-0 top-0 h-4 bg-slate-800 border-b border-slate-700"></div>
                                            <div className="absolute left-0 top-4 bottom-0 w-6 bg-slate-800 border-r border-slate-700"></div>
                                        </div>
                                        <p className="text-center text-xs font-bold mt-2 text-slate-500">Karanlık</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Değişiklikleri Kaydet
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Settings;
