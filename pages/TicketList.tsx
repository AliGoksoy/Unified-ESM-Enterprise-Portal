import React, { useState } from 'react';
import { Ticket, TicketStatus, ServiceCategory, ViewState } from '../types';
import { departmentData } from './DepartmentPortal';

interface TicketListProps {
  onTicketSelect: (ticketId: string) => void;
  onCreateRequest: (category: ServiceCategory) => void;
}

// Map ViewState to Display Info for the Modal
const departmentsForModal = [
    { id: ViewState.DEPT_IT, name: 'Bilgi Teknolojileri', icon: 'terminal', color: 'bg-indigo-500' },
    { id: ViewState.DEPT_HR, name: 'İnsan Kaynakları', icon: 'groups', color: 'bg-rose-500' },
    { id: ViewState.DEPT_FINANCE, name: 'Finans', icon: 'payments', color: 'bg-emerald-500' },
    { id: ViewState.DEPT_PROCUREMENT, name: 'Satın Alma', icon: 'inventory_2', color: 'bg-amber-500' },
    { id: ViewState.DEPT_OPERATIONS, name: 'İdari İşler', icon: 'domain', color: 'bg-cyan-500' },
    { id: ViewState.DEPT_LEGAL, name: 'Hukuk', icon: 'gavel', color: 'bg-slate-500' },
    { id: ViewState.DEPT_MARKETING, name: 'Pazarlama', icon: 'campaign', color: 'bg-purple-500' },
];

// Extended Mock Data to fill the board
const mockTickets: Ticket[] = [
  {
    id: 'INC-2024-899',
    subject: 'VPN Bağlantı Hatası - Satış Ekibi',
    description: 'Satış ekibi uzaktan bağlantı yapamıyor, Error 800 alıyoruz.',
    status: 'In Progress',
    priority: 'High',
    requester: 'Selin Yılmaz',
    requesterAvatar: 'SY',
    department: 'IT',
    category: 'Network',
    assignedTo: 'Ali Göksoy',
    createdDate: '2023-10-24T09:30:00',
    logs: []
  },
  {
    id: 'REQ-2024-102',
    subject: 'Yeni MacBook Pro Talebi',
    description: 'Yeni başlayan tasarımcı için donanım talebi.',
    status: 'Pending Approval',
    priority: 'Medium',
    requester: 'Caner Erkin',
    requesterAvatar: 'CE',
    department: 'Satın Alma',
    category: 'Donanım',
    createdDate: '2023-10-23T14:15:00',
    logs: []
  },
  {
    id: 'HR-2024-055',
    subject: 'Yıllık İzin Talebi - Kasım',
    description: '14-20 Kasım arası yıllık izin kullanmak istiyorum.',
    status: 'Open',
    priority: 'Low',
    requester: 'Ayşe Kaya',
    requesterAvatar: 'AK',
    department: 'İK',
    category: 'İzin',
    createdDate: '2023-10-24T10:05:00',
    logs: []
  },
  {
    id: 'FIN-2024-301',
    subject: 'Eylül Ayı Masraf Fişleri',
    description: 'Yurtdışı seyahat harcamaları ektedir.',
    status: 'Resolved',
    priority: 'Medium',
    requester: 'Burak Yılmaz',
    requesterAvatar: 'BY',
    department: 'Finans',
    category: 'Masraf',
    assignedTo: 'Zeynep Finans',
    createdDate: '2023-10-20T11:00:00',
    logs: []
  },
  {
    id: 'OPS-2024-009',
    subject: 'Toplantı Odası Klima Arızası',
    description: 'B Blok 3. kat toplantı odası kliması su akıtıyor.',
    status: 'Open',
    priority: 'High',
    requester: 'Ofis Yönetimi',
    requesterAvatar: 'OY',
    department: 'İdari İşler',
    category: 'Arıza',
    createdDate: '2023-10-24T08:45:00',
    logs: []
  },
  {
    id: 'SEC-2024-001',
    subject: 'Şüpheli E-posta Bildirimi',
    description: 'Phishing şüphesi taşıyan mail analizi.',
    status: 'In Progress',
    priority: 'High',
    requester: 'Mehmet Öz',
    requesterAvatar: 'MÖ',
    department: 'IT',
    category: 'Güvenlik',
    assignedTo: 'Ali Göksoy',
    createdDate: '2023-10-24T11:20:00',
    logs: []
  },
   {
    id: 'LGL-2024-012',
    subject: 'Tedarikçi Sözleşmesi Revizesi',
    description: 'X firması ile yapılacak sözleşme maddeleri.',
    status: 'Pending Approval',
    priority: 'High',
    requester: 'Hukuk Departmanı',
    requesterAvatar: 'HD',
    department: 'Hukuk',
    category: 'Sözleşme',
    createdDate: '2023-10-22T09:00:00',
    logs: []
  }
];

type ViewMode = 'LIST' | 'BOARD';

const TicketList: React.FC<TicketListProps> = ({ onTicketSelect, onCreateRequest }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ASSIGNED' | 'WATCHING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // --- Helpers ---

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' };
      case 'In Progress': return { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' };
      case 'Pending Approval': return { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' };
      case 'Resolved': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' };
      case 'Closed': return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
    }
  };

  const getPriorityStyle = (priority: string) => {
      switch (priority) {
          case 'High': return { icon: 'priority_high', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', label: 'Yüksek' };
          case 'Medium': return { icon: 'drag_handle', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Orta' };
          case 'Low': return { icon: 'keyboard_arrow_down', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', label: 'Düşük' };
          default: return { icon: 'remove', color: 'text-slate-400', bg: 'bg-slate-100', label: 'Normal' };
      }
  };

  // --- Filtering ---
  
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.requester.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' ? true : 
                       activeTab === 'ASSIGNED' ? ticket.assignedTo === 'Ali Göksoy' : true; 
    return matchesSearch && matchesTab;
  });

  // --- Renderers for Modal ---
  
  const renderDrawer = () => {
      const selectedDept = selectedDeptId ? departmentsForModal.find(d => d.id === selectedDeptId) : null;
      const categories = selectedDeptId ? departmentData[selectedDeptId]?.categories || [] : [];

      return (
          <>
            <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)}></div>
            <div className={`fixed top-0 right-0 h-full w-[420px] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Drawer Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    {selectedDeptId ? (
                        <button onClick={() => setSelectedDeptId(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Geri Dön
                        </button>
                    ) : (
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Yeni Talep Oluştur</h3>
                    )}
                    <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
                    {!selectedDeptId ? (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Hangi departman ile ilgili bir talep oluşturmak istiyorsunuz?</p>
                            <div className="grid grid-cols-1 gap-3">
                                {departmentsForModal.map(dept => (
                                    <div 
                                        key={dept.id} 
                                        onClick={() => setSelectedDeptId(dept.id)}
                                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 cursor-pointer transition-all group flex items-center gap-4"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${dept.color}`}>
                                            <span className="material-symbols-outlined text-2xl">{dept.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{dept.name}</h4>
                                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                Hizmetleri Görüntüle <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${selectedDept?.color}`}>
                                    <span className="material-symbols-outlined text-xl">{selectedDept?.icon}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{selectedDept?.name}</h4>
                                    <p className="text-xs text-slate-500">Lütfen bir kategori seçin</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {categories.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => {
                                            setIsDrawerOpen(false);
                                            onCreateRequest(cat);
                                        }}
                                        className="w-full text-left bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mt-0.5">{cat.icon}</span>
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary mb-1">{cat.title}</h5>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{cat.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </>
      );
  };

  // --- Components ---

  const StatCard = ({ title, value, trend, icon, colorClass }: any) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex items-center justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
      <div>
        <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-3 mt-1">
           <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{value}</span>
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
              {trend}
           </span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform ${colorClass}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  );

  const ListView = () => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">
               <span className="material-symbols-outlined text-[16px]">check_box_outline_blank</span>
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32">ID</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talep Detayı</th>
            {/* NEW COLUMN */}
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-48">Sorumlu & Birim</th>
            
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-40">Talep Eden</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-40">Durum</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Öncelik</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Tarih</th>
            <th className="px-6 py-4 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {filteredTickets.map((ticket) => {
            const statusStyle = getStatusStyle(ticket.status);
            const priorityStyle = getPriorityStyle(ticket.priority);
            
            return (
              <tr 
                key={ticket.id} 
                onClick={() => onTicketSelect(ticket.id)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all cursor-pointer group"
              >
                <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary" onClick={(e) => e.stopPropagation()} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                    #{ticket.id.split('-')[1]}-{ticket.id.split('-')[2]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                            {ticket.subject}
                        </span>
                        {ticket.priority === 'High' && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        )}
                    </div>
                    <span className="text-xs text-slate-400 truncate max-w-[250px]">{ticket.description}</span>
                  </div>
                </td>
                
                {/* RESPONSIBLE & UNIT CELL */}
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        {ticket.assignedTo ? (
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300">
                                    {ticket.assignedTo.substring(0,1)}
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ticket.assignedTo}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400 italic mb-0.5">Atanmadı</span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-80">
                            {ticket.department}
                        </span>
                    </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white dark:ring-slate-700 shadow-sm">
                      {ticket.requesterAvatar || ticket.requester.substring(0,2)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{ticket.requester}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                     <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                     {ticket.status === 'Pending Approval' ? 'Onay Bekliyor' : ticket.status === 'In Progress' ? 'İşlemde' : ticket.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <div className="flex justify-center" title={priorityStyle.label}>
                       <span className={`material-symbols-outlined text-[20px] ${priorityStyle.color}`}>{priorityStyle.icon}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                     {new Date(ticket.createdDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                   </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const KanbanColumn = ({ title, status, count }: { title: string, status: TicketStatus, count: number }) => {
     const items = filteredTickets.filter(t => t.status === status);
     const statusStyle = getStatusStyle(status);

     return (
        <div className="flex-1 min-w-[320px] flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold px-3 py-1 rounded-lg border ${statusStyle.bg} ${statusStyle.text} border-transparent`}>{title}</h3>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">{items.length}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 pb-2 space-y-3 custom-scrollbar">
                {items.map(ticket => {
                    const priority = getPriorityStyle(ticket.priority);
                    return (
                        <div 
                            key={ticket.id}
                            onClick={() => onTicketSelect(ticket.id)}
                            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            {/* Priority Strip */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${priority.bg.replace('bg-', 'bg-opacity-100 bg-').split(' ')[0].replace('/20','')}`}></div>

                            <div className="flex justify-between items-start mb-3 pl-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                                    {ticket.id}
                                </span>
                                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${priority.color} bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded`}>
                                    <span className="material-symbols-outlined text-[12px]">{priority.icon}</span>
                                </div>
                            </div>
                            
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5 leading-snug pl-2 pr-1">
                                {ticket.subject}
                            </h4>
                            
                            <div className="flex items-center gap-2 mb-4 pl-2">
                                <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                    {ticket.department}
                                </span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-[10px] text-slate-400">{ticket.category}</span>
                            </div>
                            
                            {/* Assigned To in Board View */}
                            <div className="flex items-center gap-2 px-2 mb-3">
                                {ticket.assignedTo ? (
                                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-600/50">
                                        <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300">
                                            {ticket.assignedTo.substring(0,1)}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{ticket.assignedTo}</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-slate-400 italic px-2">Atanmadı</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-3 pl-2 mt-2">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                        {ticket.requester.substring(0,1)}
                                    </div>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[80px]">{ticket.requester.split(' ')[0]}</span>
                                 </div>
                                 <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                    {new Date(ticket.createdDate).toLocaleDateString('tr-TR', {day:'numeric', month:'short'})}
                                 </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
     );
  };

  const BoardView = () => (
    <div className="flex gap-4 h-full overflow-x-auto pb-4 animate-in fade-in zoom-in-95 duration-300">
        <KanbanColumn title="Açık" status="Open" count={3} />
        <KanbanColumn title="İşlemde" status="In Progress" count={2} />
        <KanbanColumn title="Onay Bekleyen" status="Pending Approval" count={5} />
        <KanbanColumn title="Çözüldü" status="Resolved" count={12} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative">
      
      {/* Modal Drawer */}
      {renderDrawer()}

      {/* 1. Header & Stats Section */}
      <div className="px-8 py-8 shrink-0 flex flex-col gap-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          
          {/* Top Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">confirmation_number</span>
                    </span>
                    Talep Yönetimi
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium pl-14">Tüm departman taleplerini tek bir merkezden izleyin.</p>
              </div>
              <div className="flex gap-3">
                  <button className="px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 shadow-sm">
                     <span className="material-symbols-outlined text-[20px]">filter_list</span>
                     Filtrele
                  </button>
                  <button 
                    onClick={() => {
                        setIsDrawerOpen(true);
                        setSelectedDeptId(null);
                    }}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                  >
                     <span className="material-symbols-outlined text-[20px]">add</span>
                     Yeni Talep
                  </button>
              </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
               <StatCard title="Toplam Talep" value="1,248" trend="+12%" icon="folder_open" colorClass="bg-gradient-to-br from-blue-500 to-blue-600" />
               <StatCard title="Onay Bekleyen" value="24" trend="+5%" icon="gavel" colorClass="bg-gradient-to-br from-amber-500 to-amber-600" />
               <StatCard title="Açık İşlem" value="86" trend="-2%" icon="timelapse" colorClass="bg-gradient-to-br from-violet-500 to-violet-600" />
               <StatCard title="Acil Öncelikli" value="12" trend="+1" icon="warning" colorClass="bg-gradient-to-br from-rose-500 to-rose-600" />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
               {/* Tabs */}
               <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 self-start">
                   <button 
                      onClick={() => setActiveTab('ALL')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                   >
                      Tümü
                   </button>
                   <button 
                      onClick={() => setActiveTab('ASSIGNED')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'ASSIGNED' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                   >
                      Bana Atananlar
                   </button>
                   <button 
                       onClick={() => setActiveTab('WATCHING')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'WATCHING' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                   >
                      Takip Ettiklerim
                   </button>
               </div>

               {/* Right Actions */}
               <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-72 group">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder="Talep ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-slate-400 dark:text-slate-200"
                        />
                    </div>
                    
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

                    {/* View Switcher */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={() => setViewMode('LIST')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            title="Liste Görünümü"
                        >
                            <span className="material-symbols-outlined text-[20px]">view_list</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('BOARD')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'BOARD' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            title="Pano Görünümü"
                        >
                            <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                        </button>
                    </div>
               </div>
          </div>
      </div>

      {/* 2. Content Section */}
      <div className="flex-1 overflow-hidden p-8 bg-slate-50 dark:bg-slate-900">
          {viewMode === 'LIST' ? <ListView /> : <BoardView />}
      </div>

    </div>
  );
};

export default TicketList;
