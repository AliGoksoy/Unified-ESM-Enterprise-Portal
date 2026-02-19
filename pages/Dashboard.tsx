import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  onChangeView: (view: ViewState) => void;
}

// --- MOCK ALERTS DATA ---
interface SystemAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'MAINTENANCE' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  affectedServices?: string[];
}

const activeAlerts: SystemAlert[] = [
  {
    id: 'alert_01',
    type: 'CRITICAL',
    title: 'Exchange E-posta Servisinde Kesinti',
    message: 'Dış dünyaya e-posta gönderimlerinde gecikmeler yaşanmaktadır. Ekiplerimiz soruna müdahale etmektedir.',
    timestamp: 'Güncellendi: 10:45',
    affectedServices: ['E-posta', 'Outlook']
  },
  {
    id: 'alert_02',
    type: 'MAINTENANCE',
    title: 'Planlı Bakım: SAP Sistemleri',
    message: 'Bu gece 22:00 - 02:00 saatleri arasında SAP HR modülünde planlı bakım çalışması yapılacaktır.',
    timestamp: 'Planlanan: Bugün 22:00',
    affectedServices: ['SAP HR', 'Bordro']
  },
  {
    id: 'alert_03',
    type: 'INFO',
    title: 'Ofis İlaçlama Duyurusu',
    message: 'Cuma günü mesai bitimi sonrası (18:00) ofis genelinde ilaçlama yapılacaktır. Lütfen yiyecek bırakmayınız.',
    timestamp: 'Tarih: 27 Ekim Cuma',
  }
];

// --- MOCK CHART DATA ---
const data = [
  { name: 'Pzt', tickets: 40 },
  { name: 'Sal', tickets: 30 },
  { name: 'Çar', tickets: 20 },
  { name: 'Per', tickets: 27 },
  { name: 'Cum', tickets: 18 },
  { name: 'Cmt', tickets: 23 },
  { name: 'Paz', tickets: 34 },
];

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play logic for slider
  useEffect(() => {
    if (isPaused || activeAlerts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % activeAlerts.length);
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextAlert = () => {
    setCurrentAlertIndex((prev) => (prev + 1) % activeAlerts.length);
  };

  const prevAlert = () => {
    setCurrentAlertIndex((prev) => (prev - 1 + activeAlerts.length) % activeAlerts.length);
  };
  
  // Calculate System Status based on Alerts
  const hasCritical = activeAlerts.some(a => a.type === 'CRITICAL');
  const hasWarning = activeAlerts.some(a => a.type === 'WARNING' || a.type === 'MAINTENANCE');
  
  const systemStatus = hasCritical 
    ? { text: 'Hizmet Kesintisi', color: 'bg-rose-500', border: 'border-rose-200 text-rose-700 bg-rose-50' }
    : hasWarning
        ? { text: 'Kısmi Kesinti / Bakım', color: 'bg-amber-500', border: 'border-amber-200 text-amber-700 bg-amber-50' }
        : { text: 'Tüm Sistemler Aktif', color: 'bg-emerald-500', border: 'border-emerald-200 text-emerald-700 bg-emerald-50' };

  const departments = [
    {
      id: 'it',
      name: 'Bilgi Teknolojileri',
      desc: 'Donanım, yazılım, ağ erişimi ve teknik destek talepleri.',
      icon: 'terminal',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white',
      view: ViewState.DEPT_IT,
      count: 2
    },
    {
      id: 'hr',
      name: 'İnsan Kaynakları',
      desc: 'İzin, bordro, işe alım ve personel özlük işlemleri.',
      icon: 'groups',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white',
      view: ViewState.DEPT_HR,
      count: 0
    },
    {
      id: 'finance',
      name: 'Finans & Muhasebe',
      desc: 'Masraf girişi, bütçe onayları ve fatura işlemleri.',
      icon: 'payments',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white',
      view: ViewState.DEPT_FINANCE,
      count: 5
    },
    {
      id: 'procurement',
      name: 'Satın Alma & Tedarik',
      desc: 'Ofis malzemeleri, demirbaş ve dış kaynak talepleri.',
      icon: 'inventory_2',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300 group-hover:bg-amber-600 group-hover:text-white',
      view: ViewState.DEPT_PROCUREMENT,
      count: 1
    },
    {
      id: 'operations',
      name: 'İdari İşler & Operasyon',
      desc: 'Ofis bakımı, araç kiralama, güvenlik ve tesis yönetimi.',
      icon: 'domain',
      color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-300 group-hover:bg-cyan-600 group-hover:text-white',
      view: ViewState.DEPT_OPERATIONS,
      count: 0
    },
    {
      id: 'legal',
      name: 'Hukuk & Uyum',
      desc: 'Sözleşme inceleme, KVKK süreçleri ve hukuki danışmanlık.',
      icon: 'gavel',
      color: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 group-hover:bg-slate-800 group-hover:text-white',
      view: ViewState.DEPT_LEGAL,
      count: 3
    },
    {
      id: 'marketing',
      name: 'Satış & Pazarlama',
      desc: 'Kampanya görselleri, sosyal medya ve CRM desteği.',
      icon: 'campaign',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white',
      view: ViewState.DEPT_MARKETING,
      count: 0
    },
    {
      id: 'production',
      name: 'Ar-Ge & Üretim',
      desc: 'Prototip geliştirme, kalite kontrol ve üretim planlama.',
      icon: 'precision_manufacturing',
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300 group-hover:bg-orange-600 group-hover:text-white',
      view: ViewState.DASHBOARD,
      count: 0
    }
  ];

  const currentAlert = activeAlerts[currentAlertIndex];

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Merkezi Yönetim Paneli</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Hoş geldiniz, tüm departman süreçlerinizi tek noktadan yönetin.</p>
        </div>
        <div className="flex gap-3">
           <span className={`px-4 py-2 border rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 ${systemStatus.border} dark:bg-opacity-10 dark:border-opacity-20`}>
              <span className={`w-2.5 h-2.5 rounded-full ${systemStatus.color} ${hasCritical ? 'animate-ping' : ''}`}></span>
              {hasCritical && <span className={`absolute w-2.5 h-2.5 rounded-full ${systemStatus.color}`}></span>}
              {systemStatus.text}
           </span>
           <span className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              24 Ekim 2023
           </span>
        </div>
      </div>

      {/* ALERT BANNERS SECTION (SLIDER) */}
      {activeAlerts.length > 0 && (
        <div 
            className="relative group"
            onMouseEnter={() => setIsPaused(true)} 
            onMouseLeave={() => setIsPaused(false)}
        >
            <div 
                key={currentAlert.id}
                className={`rounded-2xl p-5 border flex items-center gap-5 shadow-md min-h-[100px] transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-right-2 ${
                    currentAlert.type === 'CRITICAL' 
                    ? 'bg-gradient-to-r from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 border-rose-200 dark:border-rose-800' 
                    : currentAlert.type === 'MAINTENANCE' || currentAlert.type === 'WARNING'
                        ? 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 border-amber-200 dark:border-amber-800'
                        : 'bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900 border-blue-200 dark:border-blue-800'
                }`}
            >
                {/* Icon */}
                <div className={`p-3 rounded-xl shrink-0 shadow-sm ${
                    currentAlert.type === 'CRITICAL' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400' :
                    currentAlert.type === 'MAINTENANCE' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                }`}>
                    <span className="material-symbols-outlined text-3xl">
                        {currentAlert.type === 'CRITICAL' ? 'report' : currentAlert.type === 'MAINTENANCE' ? 'engineering' : 'info'}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 pr-12">
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${
                            currentAlert.type === 'CRITICAL' ? 'bg-rose-600 text-white' :
                            currentAlert.type === 'MAINTENANCE' ? 'bg-amber-500 text-white' :
                            'bg-blue-600 text-white'
                        }`}>
                            {currentAlert.type === 'MAINTENANCE' ? 'BAKIM' : currentAlert.type === 'CRITICAL' ? 'KRİTİK' : 'DUYURU'}
                        </span>
                        <h3 className={`text-base font-bold ${
                            currentAlert.type === 'CRITICAL' ? 'text-rose-900 dark:text-rose-200' :
                            currentAlert.type === 'MAINTENANCE' ? 'text-amber-900 dark:text-amber-200' :
                            'text-blue-900 dark:text-blue-200'
                        }`}>
                            {currentAlert.title}
                        </h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                            currentAlert.type === 'CRITICAL' ? 'text-rose-800 dark:text-rose-300' :
                            currentAlert.type === 'MAINTENANCE' ? 'text-amber-800 dark:text-amber-300' :
                            'text-blue-800 dark:text-blue-300'
                    }`}>
                        {currentAlert.message}
                        <span className="opacity-70 ml-2 font-medium text-xs border-l border-current pl-2">
                            {currentAlert.timestamp}
                        </span>
                    </p>
                    
                    {currentAlert.affectedServices && (
                        <div className="flex gap-2 mt-2">
                            {currentAlert.affectedServices.map((svc, i) => (
                                <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/60 dark:bg-black/20 border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300">
                                    {svc}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Slider Controls */}
            {activeAlerts.length > 1 && (
                <>
                    <button 
                        onClick={prevAlert}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    <button 
                        onClick={nextAlert}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                    
                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {activeAlerts.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentAlertIndex(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    idx === currentAlertIndex 
                                    ? 'w-4 bg-slate-800 dark:bg-slate-200' 
                                    : 'bg-slate-400/50 dark:bg-slate-600'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Total Requests */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">dataset</span>
               </div>
               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
               </span>
            </div>
            <div className="relative z-10">
               <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 block">1,284</span>
               <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Toplam Talep</span>
            </div>
         </div>

         {/* Pending Approvals */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <span className="material-symbols-outlined">gavel</span>
               </div>
            </div>
            <div className="relative z-10">
               <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 block">14</span>
               <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Bekleyen Onay</span>
            </div>
         </div>

         {/* Open Tickets */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined">support_agent</span>
               </div>
            </div>
            <div className="relative z-10">
               <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 block">42</span>
               <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Açık İşlem</span>
            </div>
         </div>

         {/* Satisfaction */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined">sentiment_satisfied</span>
               </div>
               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  98%
               </span>
            </div>
            <div className="relative z-10">
               <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 block">4.8/5</span>
               <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Memnuniyet Puanı</span>
            </div>
         </div>
      </div>

      {/* Departments Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">apps</span>
            Departmanlar & Hizmetler
          </h2>
          <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            Tüm Kataloğu Gör
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
             <div 
                key={dept.id}
                onClick={() => onChangeView(dept.view)}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full relative"
             >
                {dept.count > 0 && (
                  <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">
                    {dept.count} Talep
                  </span>
                )}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${dept.color}`}>
                   <span className="material-symbols-outlined text-[28px]">{dept.icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2 group-hover:text-primary transition-colors">{dept.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                   {dept.desc}
                </p>
                <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-primary transition-colors mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                   Portala Git
                   <span className="material-symbols-outlined text-[16px] ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Bottom Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Haftalık Talep Hacmi</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tüm departmanlar genelinde işlem yoğunluğu</p>
              </div>
              <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 outline-none">
                 <option>Son 7 Gün</option>
                 <option>Bu Ay</option>
                 <option>Bu Yıl</option>
              </select>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: 'var(--tw-prose-invert-bg)'}} 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#0f172a'}} 
                    />
                    <Bar dataKey="tickets" fill="#E11D48" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Action List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
           <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Onay Bekleyenler</h3>
           <div className="space-y-4 flex-1">
              
              <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                 <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 font-bold text-xs">AM</div>
                 <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                       <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">Bütçe Artırımı</span>
                       <span className="text-[10px] font-medium text-slate-400">12d önce</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">Q4 Pazarlama kampanyası için ek bütçe talebi.</p>
                 </div>
              </div>

              <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                 <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-bold text-xs">SJ</div>
                 <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                       <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">VPN Erişimi</span>
                       <span className="text-[10px] font-medium text-slate-400">2s önce</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">Yeni başlayan stajyerler için VPN yetkilendirmesi.</p>
                 </div>
              </div>

              <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                 <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 font-bold text-xs">MK</div>
                 <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                       <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">MacBook Pro</span>
                       <span className="text-[10px] font-medium text-slate-400">Dün</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">Tasarım ekibi için donanım yenileme talebi.</p>
                 </div>
              </div>

           </div>
           <button className="w-full mt-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
              Tümünü Görüntüle
           </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;