import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

// --- MOCK DATA ---
const deptVolumeData = [
  { name: 'IT', tickets: 450, resolved: 410 },
  { name: 'İK', tickets: 210, resolved: 190 },
  { name: 'Finans', tickets: 320, resolved: 280 },
  { name: 'Satın Alma', tickets: 150, resolved: 120 },
  { name: 'Hukuk', tickets: 80, resolved: 75 },
  { name: 'İdari', tickets: 230, resolved: 220 },
];

const weeklyTrendData = [
  { name: 'Pzt', received: 65, resolved: 50 },
  { name: 'Sal', received: 59, resolved: 55 },
  { name: 'Çar', received: 80, resolved: 70 },
  { name: 'Per', received: 81, resolved: 75 },
  { name: 'Cum', received: 56, resolved: 60 },
  { name: 'Cmt', received: 25, resolved: 25 },
  { name: 'Paz', received: 15, resolved: 15 },
];

const statusData = [
  { name: 'Açık', value: 45, color: '#3b82f6' },      // Blue
  { name: 'İşlemde', value: 85, color: '#8b5cf6' },   // Violet
  { name: 'Onay Bekleyen', value: 30, color: '#f59e0b' }, // Amber
  { name: 'Çözüldü', value: 320, color: '#10b981' },  // Emerald
];

const topAgents = [
  { id: 1, name: 'Ali Göksoy', dept: 'IT', solved: 145, rating: 4.9, avatar: 'AG' },
  { id: 2, name: 'Zeynep Yılmaz', dept: 'Finans', solved: 120, rating: 4.8, avatar: 'ZY' },
  { id: 3, name: 'Caner Erkin', dept: 'Satın Alma', solved: 98, rating: 4.7, avatar: 'CE' },
  { id: 4, name: 'Ayşe Demir', dept: 'İK', solved: 85, rating: 4.9, avatar: 'AD' },
];

const Reports: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
             <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary">analytics</span>
                Raporlar & Analizler
             </h1>
             <p className="text-slate-500 dark:text-slate-400 mt-1">Sistem performansını ve talep metriklerini analiz edin.</p>
         </div>
         
         <div className="flex items-center gap-3">
             <div className="relative">
                 <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">calendar_today</span>
                 <select className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none">
                     <option>Son 30 Gün</option>
                     <option>Bu Ay</option>
                     <option>Geçen Ay</option>
                     <option>Bu Yıl</option>
                 </select>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                İndir
             </button>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top. Çözülen Talep</span>
                    <span className="material-symbols-outlined text-emerald-500 text-2xl">check_circle</span>
                </div>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">1,248</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded mb-1">+12%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Geçen aya göre artış var</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ort. Çözüm Süresi</span>
                    <span className="material-symbols-outlined text-blue-500 text-2xl">timer</span>
                </div>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">4s 12d</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded mb-1">-8%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Daha hızlı çözüm sağlanıyor</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Memnuniyet (CSAT)</span>
                    <span className="material-symbols-outlined text-amber-500 text-2xl">star</span>
                </div>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">4.8</span>
                    <span className="text-xs font-bold text-slate-400 mb-1">/ 5.0</span>
                </div>
                 <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[96%] rounded-full"></div>
                 </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SLA İhlali</span>
                    <span className="material-symbols-outlined text-rose-500 text-2xl">warning</span>
                </div>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">2.4%</span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded mb-1">+0.5%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Hedef %2'nin altı</p>
            </div>
        </div>

        {/* Charts Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dept Volume Bar Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Departman Bazlı Talep Hacmi</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deptVolumeData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: 'var(--tw-prose-invert-bg)'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                            />
                            <Legend wrapperStyle={{paddingTop: '20px'}} />
                            <Bar dataKey="tickets" name="Gelen" fill="#E11D48" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="resolved" name="Çözülen" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weekly Trend Area Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Haftalık Talep Trendi</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyTrendData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                            <defs>
                                <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                            />
                            <Area type="monotone" dataKey="received" name="Gelen" stroke="#6366f1" fillOpacity={1} fill="url(#colorReceived)" strokeWidth={3} />
                            <Area type="monotone" dataKey="resolved" name="Çözülen" stroke="#10b981" fillOpacity={0} strokeDasharray="5 5" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Charts Section 2 & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             
             {/* Status Donut Chart */}
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Talep Durum Dağılımı</h3>
                <div className="flex-1 min-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-900 dark:text-slate-100">480</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Toplam</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {statusData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.name}</span>
                        </div>
                    ))}
                </div>
             </div>

             {/* Top Agents Table */}
             <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">En İyi Performans (Personel)</h3>
                    <button className="text-xs font-bold text-primary hover:underline">Tümünü Gör</button>
                 </div>
                 
                 <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                         <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                             <tr>
                                 <th className="px-4 py-3 rounded-tl-lg">Uzman</th>
                                 <th className="px-4 py-3">Departman</th>
                                 <th className="px-4 py-3 text-center">Çözülen</th>
                                 <th className="px-4 py-3 text-right rounded-tr-lg">Puan</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                             {topAgents.map((agent) => (
                                 <tr key={agent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                                     <td className="px-4 py-3">
                                         <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                 {agent.avatar}
                                             </div>
                                             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{agent.name}</span>
                                         </div>
                                     </td>
                                     <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{agent.dept}</td>
                                     <td className="px-4 py-3 text-center">
                                         <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-bold">{agent.solved}</span>
                                     </td>
                                     <td className="px-4 py-3 text-right">
                                         <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                             {agent.rating}
                                             <span className="material-symbols-outlined text-[16px]">star</span>
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;