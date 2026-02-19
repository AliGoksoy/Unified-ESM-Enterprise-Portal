import React from 'react';
import { ViewState } from '../types';

interface DepartmentsListProps {
  onChangeView: (view: ViewState) => void;
}

const DepartmentsList: React.FC<DepartmentsListProps> = ({ onChangeView }) => {
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
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-8 shrink-0">
             <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-primary">apps</span>
                Departmanlar ve Hizmetler
             </h1>
             <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl">
                 Kurum içi tüm hizmetlere buradan ulaşabilir, ilgili departmanların portallarına giderek talep oluşturabilirsiniz.
             </p>
        </div>

        {/* Grid Content */}
        <div className="p-8 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.map((dept) => (
                <div 
                    key={dept.id}
                    onClick={() => onChangeView(dept.view)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full relative"
                >
                    {dept.count > 0 && (
                        <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">
                            {dept.count} Talep
                        </span>
                    )}
                    
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-sm ${dept.color}`}>
                        <span className="material-symbols-outlined text-[32px]">{dept.icon}</span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xl mb-3 group-hover:text-primary transition-colors">{dept.name}</h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-1">
                        {dept.desc}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700 w-full">
                         <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-primary transition-colors">
                            Hizmet Kataloğu
                            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                         </span>
                    </div>
                </div>
            ))}
            
            {/* Call to Action Card */}
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-default group">
                 <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center mb-4 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    <span className="material-symbols-outlined text-3xl">add_circle</span>
                 </div>
                 <h3 className="font-bold text-slate-600 dark:text-slate-300 text-lg mb-1">Yeni Departman?</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Organizasyona yeni bir birim eklendiyse sistem yöneticisine bildirin.
                 </p>
            </div>

            </div>
        </div>
    </div>
  );
};

export default DepartmentsList;