import React from 'react';
import { Asset, ServiceCategory } from '../types';
import { useToast } from '../context/ToastContext';

interface UserProfileProps {
    onReportIssue: (asset: Asset) => void;
}

// Mock User Data
const user = {
    name: 'Süper Admin',
    title: 'Sistem Yöneticisi',
    department: 'Bilgi Teknolojileri',
    email: 'superadmin@retailmind.com',
    phone: '+90 555 123 45 67',
    location: 'Merkez Ofis - Kat 4',
    manager: 'Emre Yönetici',
    joinDate: '15 Mart 2021',
    avatar: 'SA'
};

// Mock Assets Data
const myAssets: Asset[] = [
    {
        id: 'AST-001',
        name: 'MacBook Pro 16"',
        model: 'M2 Pro, 32GB RAM, 1TB SSD',
        serialNumber: 'C02XY123AB',
        type: 'HARDWARE',
        status: 'ACTIVE',
        assignedDate: '20.03.2021',
        warrantyEnd: '20.03.2024',
        icon: 'laptop_mac'
    },
    {
        id: 'AST-002',
        name: 'Dell UltraSharp 27"',
        model: 'U2723QE 4K Monitor',
        serialNumber: 'CN-0X123-789',
        type: 'ACCESSORY',
        status: 'ACTIVE',
        assignedDate: '20.03.2021',
        warrantyEnd: '20.03.2024',
        icon: 'monitor'
    },
    {
        id: 'AST-003',
        name: 'iPhone 14 Pro',
        model: '128GB Space Black',
        serialNumber: 'IMEI-9988776655',
        type: 'HARDWARE',
        status: 'REPAIR',
        assignedDate: '10.01.2023',
        warrantyEnd: '10.01.2025',
        icon: 'phone_iphone'
    },
    {
        id: 'LIC-001',
        name: 'Adobe Creative Cloud',
        model: 'All Apps Plan',
        serialNumber: 'user@retailmind.com',
        type: 'SOFTWARE',
        status: 'ACTIVE',
        assignedDate: '01.04.2021',
        warrantyEnd: '-',
        icon: 'brush'
    },
    {
        id: 'LIC-002',
        name: 'JetBrains All Products',
        model: 'Commercial License',
        serialNumber: 'JB-123456',
        type: 'SOFTWARE',
        status: 'ACTIVE',
        assignedDate: '01.04.2021',
        warrantyEnd: '01.04.2024',
        icon: 'code'
    }
];

const UserProfile: React.FC<UserProfileProps> = ({ onReportIssue }) => {
    const { addToast } = useToast();

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* 1. Hero / Profile Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
                 {/* Banner Background - Solid Rose color as requested */}
                 <div className="relative h-40 bg-[#E11D48] dark:bg-rose-900 overflow-hidden group">
                     {/* Subtle sheen effect instead of strong gradient */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10 pointer-events-none"></div>
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
                     <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-20"></div>
                 </div>
                 
                 <div className="px-8 pb-8">
                     {/* Layout Adjustment */}
                     <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6 gap-6">
                         {/* Avatar */}
                         <div className="relative group shrink-0">
                            <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-1.5 shadow-2xl ring-4 ring-slate-50 dark:ring-slate-900">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/50 dark:to-slate-800 flex items-center justify-center text-3xl font-bold text-rose-600 dark:text-rose-400">
                                    {user.avatar}
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                            </button>
                         </div>
                         
                         {/* User Info - Name Removed */}
                         <div className="flex-1 text-center md:text-left mb-2 md:mb-1 pt-4">
                             <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                 <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                                     <span className="material-symbols-outlined text-[18px] text-rose-500">badge</span> 
                                     {user.title}
                                 </span>
                                 <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                                     <span className="material-symbols-outlined text-[18px] text-emerald-500">apartment</span> 
                                     {user.department}
                                 </span>
                                 <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                                     <span className="material-symbols-outlined text-[18px] text-rose-500">location_on</span> 
                                     {user.location}
                                 </span>
                             </div>
                         </div>
                         
                         {/* Actions */}
                         <div className="flex gap-3 mb-1">
                             <button className="px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
                                 <span className="material-symbols-outlined text-[18px]">edit</span>
                                 Bilgileri Düzenle
                             </button>
                         </div>
                     </div>
                     
                     {/* Meta Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-100 dark:border-slate-700">
                         <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                             <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">mail</span>
                             </div>
                             <div>
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">E-posta</span>
                                 <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.email}</span>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                             <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                <span className="material-symbols-outlined">call</span>
                             </div>
                             <div>
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Telefon</span>
                                 <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.phone}</span>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                             <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined">supervisor_account</span>
                             </div>
                             <div>
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Yönetici</span>
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.manager}</span>
                                 </div>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                             <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined">calendar_today</span>
                             </div>
                             <div>
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">İşe Başlama</span>
                                 <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.joinDate}</span>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>

            {/* 2. Assets Section */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">inventory_2</span>
                        Zimmetli Varlıklarım
                    </h2>
                    <div className="flex gap-2">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            4 Aktif
                        </span>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            1 Tamirde
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myAssets.map(asset => (
                        <div key={asset.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/40 transition-all overflow-hidden flex flex-col relative">
                            {/* Status Indicator Bar */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${asset.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                            {/* Asset Header */}
                            <div className="p-6 flex items-start justify-between">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
                                    <span className="material-symbols-outlined text-3xl">{asset.icon}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                        asset.status === 'ACTIVE' 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                                        : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                                    }`}>
                                        {asset.status === 'ACTIVE' ? 'Aktif' : 'Tamirde'}
                                    </span>
                                    <div className="text-[10px] font-mono text-slate-400 mt-1">{asset.id}</div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="px-6 pb-6 flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 text-lg group-hover:text-primary transition-colors">{asset.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">{asset.model}</p>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Seri No</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-200 font-bold tracking-wide">{asset.serialNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs px-2">
                                        <span className="text-slate-400">Veriliş</span>
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">{asset.assignedDate}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs px-2">
                                        <span className="text-slate-400">Garanti</span>
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">{asset.warrantyEnd}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                                <button 
                                    onClick={() => onReportIssue(asset)}
                                    className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">report_problem</span>
                                    Sorun Bildir
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Request Placeholder */}
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary/50 dark:hover:border-primary/50 transition-all group">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">Yeni Ekipman Talebi</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-4 leading-relaxed">
                            Yeni bir donanım veya yazılım ihtiyacınız mı var? Talep oluşturmak için tıklayın.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;