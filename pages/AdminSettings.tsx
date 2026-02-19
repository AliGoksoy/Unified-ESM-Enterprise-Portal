import React, { useState } from 'react';
import { UserGroup, ServiceCategory, Department, FormType, ViewState, IdentityEntity } from '../types';
import { useToast } from '../context/ToastContext';

// --- MOCK IDENTITY DIRECTORY (Active Directory / LDAP Simulation) ---
const mockIdentityDirectory: IdentityEntity[] = [
  // Users
  { id: 'u1', displayName: 'Ali Göksoy', type: 'USER', email: 'ali.g@company.com', title: 'IT Director', department: 'IT', avatar: 'AG' },
  { id: 'u2', displayName: 'Ayşe Yılmaz', type: 'USER', email: 'ayse.y@company.com', title: 'HR Manager', department: 'HR', avatar: 'AY' },
  { id: 'u3', displayName: 'Mehmet Demir', type: 'USER', email: 'mehmet.d@company.com', title: 'Network Lead', department: 'IT', avatar: 'MD' },
  { id: 'u4', displayName: 'Zeynep Kaya', type: 'USER', email: 'zeynep.k@company.com', title: 'Finance Specialist', department: 'Finance', avatar: 'ZK' },
  { id: 'u5', displayName: 'Caner Erkin', type: 'USER', email: 'caner.e@company.com', title: 'Support Specialist', department: 'IT', avatar: 'CE' },
  { id: 'u7', displayName: 'Burak Yılmaz', type: 'USER', email: 'burak.y@company.com', title: 'System Admin', department: 'IT', avatar: 'BY' },
  { id: 'u8', displayName: 'Elif Demir', type: 'USER', email: 'elif.d@company.com', title: 'Recruiter', department: 'HR', avatar: 'ED' },
  
  // AD Security Groups
  { id: 'ad_g1', displayName: 'IT_All_Staff', type: 'GROUP', memberCount: 45, department: 'IT', avatar: 'IT' },
  { id: 'ad_g2', displayName: 'HR_Recruitment_Team', type: 'GROUP', memberCount: 5, department: 'HR', avatar: 'HR' },
  { id: 'ad_g3', displayName: 'Network_Admins_L2', type: 'GROUP', memberCount: 3, department: 'IT', avatar: 'NA' },
  { id: 'ad_g4', displayName: 'Finance_Approvers', type: 'GROUP', memberCount: 8, department: 'Finance', avatar: 'FA' },
  { id: 'ad_g5', displayName: 'Service_Desk_L1', type: 'GROUP', memberCount: 12, department: 'IT', avatar: 'SD' },
];

const initialGroups: UserGroup[] = [
  { 
      id: 'g1', 
      name: 'IT Helpdesk L1', 
      description: 'İlk seviye teknik destek ve yönlendirme ekibi.', 
      members: ['ad_g5', 'u5'], // A Group + A specific User
      managerId: 'u5'
  },
  { 
      id: 'g2', 
      name: 'Network Operations', 
      description: 'Ağ ve altyapı yönetim ekibi.', 
      members: ['ad_g3', 'u3'], // Network Admins Group + Mehmet
      managerId: 'u3'
  },
  { 
      id: 'g3', 
      name: 'HR Operations', 
      description: 'İnsan kaynakları operasyon ekibi.', 
      members: ['ad_g2', 'u2'], // Recruitment Group + Ayşe
      managerId: 'u2'
  }
];

const initialDepartments: Department[] = [
  {
    id: 'dept_it',
    name: 'Bilgi Teknolojileri',
    description: 'Şirket içi teknolojik altyapı ve destek süreçleri.',
    isActive: true,
    viewState: ViewState.DEPT_IT,
    managerId: 'u1', // Ali Göksoy
    categories: [
      { id: 'it_hw', title: 'Donanım', icon: 'devices', formType: 'HARDWARE', assignedGroupId: 'g1', sla: '2 Gün', isActive: true },
      { id: 'it_sw', title: 'Yazılım', icon: 'code', formType: 'SOFTWARE', assignedGroupId: 'g1', sla: '1 Gün', isActive: true },
      { id: 'it_net', title: 'Ağ & Erişim', icon: 'router', formType: 'ACCESS', assignedGroupId: 'g2', sla: '4 Saat', isActive: true },
    ]
  },
  {
    id: 'dept_hr',
    name: 'İnsan Kaynakları',
    description: 'Personel yönetimi, işe alım ve özlük hakları.',
    isActive: true,
    viewState: ViewState.DEPT_HR,
    managerId: 'u2', // Ayşe Yılmaz
    categories: [
      { id: 'hr_leave', title: 'İzin İşlemleri', icon: 'event_available', formType: 'DATE_RANGE', assignedGroupId: 'g3', sla: '1 Gün', isActive: true },
    ]
  },
  {
    id: 'dept_fin',
    name: 'Finans',
    description: 'Mali işler, bütçe ve raporlama.',
    isActive: true,
    viewState: ViewState.DEPT_FINANCE,
    managerId: 'u4', // Zeynep Kaya
    categories: []
  }
];

type DrawerMode = 'NONE' | 'EDIT_DEPT' | 'EDIT_SERVICE' | 'ADD_SERVICE' | 'EDIT_GROUP' | 'ADD_GROUP';
type AdminTab = 'GROUPS' | 'SERVICES';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('SERVICES');
  const { addToast } = useToast();
  
  // States
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups);
  
  // Drawer States
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('NONE');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  
  // Identity Search States
  const [formMembers, setFormMembers] = useState<string[]>([]); // List of ID strings
  const [formManagerId, setFormManagerId] = useState(''); // Used for both Group Manager & Dept Manager
  const [identitySearchQuery, setIdentitySearchQuery] = useState('');
  const [identityFilter, setIdentityFilter] = useState<'ALL' | 'USER' | 'GROUP'>('ALL');
  
  const [formGroupId, setFormGroupId] = useState('');
  const [formIcon, setFormIcon] = useState('help');
  const [formType, setFormType] = useState<FormType>('GENERAL');
  const [formSla, setFormSla] = useState('');

  // --- HANDLERS ---

  const openEditDept = (dept: Department) => {
      setSelectedDept(dept);
      setFormName(dept.name);
      setFormDesc(dept.description || '');
      setFormManagerId(dept.managerId || ''); // Load Department Manager
      setDrawerMode('EDIT_DEPT');
  };

  const openEditService = (dept: Department, service: ServiceCategory) => {
      setSelectedDept(dept);
      setSelectedService(service);
      setFormName(service.title);
      setFormDesc(service.description || '');
      setFormIcon(service.icon);
      setFormType(service.formType);
      setFormGroupId(service.assignedGroupId || '');
      setFormSla(service.sla || '');
      setDrawerMode('EDIT_SERVICE');
  };

  const openAddService = (dept: Department) => {
      setSelectedDept(dept);
      setSelectedService(null);
      setFormName('');
      setFormDesc('');
      setFormIcon('help');
      setFormType('GENERAL');
      setFormGroupId('');
      setFormSla('24 Saat');
      setDrawerMode('ADD_SERVICE');
  };

  const openEditGroup = (group: UserGroup) => {
      setSelectedGroup(group);
      setFormName(group.name);
      setFormDesc(group.description);
      setFormManagerId(group.managerId || ''); // Load Group Manager
      setFormMembers(group.members || []);
      setIdentitySearchQuery('');
      setDrawerMode('EDIT_GROUP');
  };

  const openAddGroup = () => {
      setSelectedGroup(null);
      setFormName('');
      setFormDesc('');
      setFormManagerId('');
      setFormMembers([]);
      setIdentitySearchQuery('');
      setDrawerMode('ADD_GROUP');
  };

  // --- IDENTITY HANDLERS ---
  
  const handleAddMember = (entityId: string) => {
      if (!formMembers.includes(entityId)) {
          setFormMembers([...formMembers, entityId]);
      }
  };

  const handleRemoveMember = (entityId: string) => {
      setFormMembers(formMembers.filter(id => id !== entityId));
  };

  const handleSave = () => {
      if (drawerMode === 'EDIT_DEPT' && selectedDept) {
          setDepartments(prev => prev.map(d => d.id === selectedDept.id ? { 
              ...d, 
              name: formName, 
              description: formDesc,
              managerId: formManagerId // Save Identity Manager
          } : d));
          addToast('Departman güncellendi.', 'success');
      }
      else if (drawerMode === 'EDIT_SERVICE' && selectedDept && selectedService) {
          const updatedService: ServiceCategory = { ...selectedService, title: formName, description: formDesc, icon: formIcon, formType: formType, assignedGroupId: formGroupId, sla: formSla };
          setDepartments(prev => prev.map(d => d.id === selectedDept.id ? { ...d, categories: d.categories.map(c => c.id === selectedService.id ? updatedService : c) } : d));
          addToast('Hizmet güncellendi.', 'success');
      }
      else if (drawerMode === 'ADD_SERVICE' && selectedDept) {
          const newService: ServiceCategory = { id: `svc_${Date.now()}`, title: formName, description: formDesc, icon: formIcon, formType: formType, assignedGroupId: formGroupId, sla: formSla, isActive: true };
          setDepartments(prev => prev.map(d => d.id === selectedDept.id ? { ...d, categories: [...d.categories, newService] } : d));
          addToast('Yeni hizmet eklendi.', 'success');
      }
      else if (drawerMode === 'EDIT_GROUP' && selectedGroup) {
          setGroups(prev => prev.map(g => g.id === selectedGroup.id ? { ...g, name: formName, description: formDesc, managerId: formManagerId, members: formMembers } : g));
          addToast('Çözüm ekibi güncellendi.', 'success');
      }
      else if (drawerMode === 'ADD_GROUP') {
          const newGroup: UserGroup = { id: `g_${Date.now()}`, name: formName, description: formDesc, managerId: formManagerId, members: formMembers };
          setGroups([...groups, newGroup]);
          addToast('Yeni çözüm ekibi oluşturuldu.', 'success');
      }

      setDrawerMode('NONE');
  };

  // Filter Logic for Identity Search
  const filteredIdentity = mockIdentityDirectory.filter(entity => {
      const matchesSearch = entity.displayName.toLowerCase().includes(identitySearchQuery.toLowerCase()) ||
                            entity.email?.toLowerCase().includes(identitySearchQuery.toLowerCase()) || 
                            entity.department?.toLowerCase().includes(identitySearchQuery.toLowerCase());
      const matchesType = identityFilter === 'ALL' || entity.type === identityFilter;
      return matchesSearch && matchesType;
  });

  // --- RENDERERS ---

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-300 relative">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 shrink-0 flex justify-between items-center">
             <div>
                 <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-primary">settings_applications</span>
                    Sistem Yapılandırması
                 </h1>
                 <p className="text-slate-500 dark:text-slate-400 mt-1">Departmanlar, hizmetler ve çözüm ekipleri yönetimi.</p>
             </div>
             
             <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                 <button 
                    onClick={() => setActiveTab('SERVICES')}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'SERVICES' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                 >
                    <span className="material-symbols-outlined text-[18px]">category</span>
                    Hizmet Kataloğu
                 </button>
                 <button 
                    onClick={() => setActiveTab('GROUPS')}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'GROUPS' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                 >
                    <span className="material-symbols-outlined text-[18px]">groups</span>
                    Çözüm Ekipleri
                 </button>
             </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
            
            {/* SERVICES TAB */}
            {activeTab === 'SERVICES' && (
                <div className="space-y-8">
                    {departments.map(dept => {
                        const manager = mockIdentityDirectory.find(u => u.id === dept.managerId);

                        return (
                            <div key={dept.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                {/* Department Header */}
                                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <span className="material-symbols-outlined text-slate-500 text-2xl">apartment</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                                {dept.name}
                                                <button onClick={() => openEditDept(dept)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all text-slate-400 hover:text-primary">
                                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                                </button>
                                            </h3>
                                            <p className="text-xs text-slate-500">{dept.description}</p>
                                        </div>
                                    </div>

                                    {/* Department Manager Info */}
                                    <div className="flex items-center gap-4">
                                        {manager ? (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yönetici</div>
                                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{manager.displayName}</div>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                                                    {manager.avatar}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-slate-400 italic px-2">Yönetici Atanmamış</div>
                                        )}

                                        <button 
                                            onClick={() => openAddService(dept)}
                                            className="text-xs font-bold bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                            Hizmet Ekle
                                        </button>
                                    </div>
                                </div>

                                {/* Services List */}
                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {dept.categories.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">Bu departmana ait henüz bir hizmet tanımlanmamış.</div>
                                    ) : (
                                        dept.categories.map(cat => {
                                            const assignedGroup = groups.find(g => g.id === cat.assignedGroupId);

                                            return (
                                                <div key={cat.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{cat.title}</h4>
                                                            <div className="flex items-center gap-3 mt-0.5">
                                                                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                                    SLA: {cat.sla}
                                                                </span>
                                                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[12px] text-indigo-500">groups</span>
                                                                    {assignedGroup?.name || 'Ekip Atanmamış'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => openEditService(dept, cat)} className="text-slate-400 hover:text-primary p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                        <span className="material-symbols-outlined text-[20px]">settings</span>
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* GROUPS TAB */}
            {activeTab === 'GROUPS' && (
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex justify-end">
                        <button 
                            onClick={openAddGroup}
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
                        >
                            <span className="material-symbols-outlined text-[20px]">group_add</span>
                            Yeni Ekip Oluştur
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {groups.map(group => {
                            const manager = mockIdentityDirectory.find(u => u.id === group.managerId);
                            const members = group.members.map(id => mockIdentityDirectory.find(e => e.id === id)).filter(Boolean);

                            return (
                                <div key={group.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm group">
                                    
                                    {/* Card Header (Matches Service Catalog Style) */}
                                    <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400">
                                                <span className="material-symbols-outlined">groups</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                                    {group.name}
                                                    <button onClick={() => openEditGroup(group)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all text-slate-400 hover:text-primary">
                                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                                    </button>
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{group.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content (List Style) */}
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                        
                                        {/* Leader Row */}
                                        <div className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined text-[16px]">supervisor_account</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ekip Lideri</span>
                                                    {manager ? (
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{manager.displayName}</span>
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded border border-indigo-100 dark:border-indigo-800">
                                                                {manager.title}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Atanmamış</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Members List */}
                                        <div className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Ekip Üyeleri & Gruplar</span>
                                            {members.length === 0 ? (
                                                <span className="text-xs text-slate-400 italic">Üye bulunamadı.</span>
                                            ) : (
                                                <div className="space-y-2">
                                                    {members.map((m, idx) => (
                                                        <div key={idx} className="flex items-center justify-between group/member">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                                                    m?.type === 'GROUP' 
                                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                }`}>
                                                                    <span className="material-symbols-outlined text-[14px]">
                                                                        {m?.type === 'GROUP' ? 'domain' : 'person'}
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{m?.displayName}</span>
                                                            </div>
                                                            <span className="text-[10px] text-slate-400">
                                                                {m?.type === 'GROUP' ? `${m.memberCount} Üye` : m?.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>

        {/* --- RIGHT DRAWER (For Edits) --- */}
        {drawerMode !== 'NONE' && (
            <>
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setDrawerMode('NONE')}></div>
                <div className="absolute top-0 right-0 h-full w-[400px] bg-white dark:bg-slate-800 shadow-2xl z-50 p-6 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {drawerMode === 'EDIT_DEPT' ? 'Departman Düzenle' : 
                             drawerMode === 'EDIT_SERVICE' ? 'Hizmet Düzenle' : 
                             drawerMode === 'ADD_SERVICE' ? 'Yeni Hizmet' :
                             drawerMode === 'EDIT_GROUP' ? 'Ekip Düzenle' : 'Yeni Ekip'}
                        </h2>
                        <button onClick={() => setDrawerMode('NONE')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">İsim / Başlık</label>
                            <input 
                                type="text" 
                                value={formName} 
                                onChange={e => setFormName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none" 
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Açıklama</label>
                            <textarea 
                                value={formDesc} 
                                onChange={e => setFormDesc(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none resize-none" 
                            />
                        </div>

                        {/* Drawer Logic: Manager Select (Used for Group OR Department) */}
                        {(drawerMode === 'EDIT_GROUP' || drawerMode === 'ADD_GROUP' || drawerMode === 'EDIT_DEPT') && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">
                                    {drawerMode === 'EDIT_DEPT' ? 'Departman Yöneticisi' : 'Ekip Lideri'}
                                </label>
                                <select 
                                    value={formManagerId} 
                                    onChange={e => setFormManagerId(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                                >
                                    <option value="">Seçiniz...</option>
                                    {mockIdentityDirectory.filter(u => u.type === 'USER').map(u => (
                                        <option key={u.id} value={u.id}>{u.displayName} ({u.title})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Drawer Logic: Group Members (IDENTITY / DC SIMULATION) */}
                        {(drawerMode === 'EDIT_GROUP' || drawerMode === 'ADD_GROUP') && (
                            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">badge</span>
                                    Ekip Üyeleri (Identity/DC)
                                </label>
                                
                                {/* Search & Filter */}
                                <div className="space-y-2">
                                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                                        {(['ALL', 'USER', 'GROUP'] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setIdentityFilter(type)}
                                                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                                                    identityFilter === type 
                                                    ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' 
                                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                                }`}
                                            >
                                                {type === 'ALL' ? 'Tümü' : type === 'USER' ? 'Kullanıcılar' : 'Gruplar'}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                                        <input 
                                            type="text" 
                                            placeholder="Identity üzerinde ara..."
                                            value={identitySearchQuery}
                                            onChange={(e) => setIdentitySearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Results List */}
                                <div className="max-h-[180px] overflow-y-auto border border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredIdentity.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-slate-400 italic">Sonuç bulunamadı.</div>
                                    ) : (
                                        filteredIdentity.map(entity => {
                                            const isSelected = formMembers.includes(entity.id);
                                            return (
                                                <div 
                                                    key={entity.id} 
                                                    onClick={() => !isSelected && handleAddMember(entity.id)}
                                                    className={`p-2 flex items-center justify-between cursor-pointer transition-colors ${
                                                        isSelected ? 'bg-indigo-50/50 dark:bg-indigo-900/20 opacity-50 cursor-default' : 'hover:bg-white dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                            entity.type === 'GROUP' 
                                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        }`}>
                                                            <span className="material-symbols-outlined text-[16px]">
                                                                {entity.type === 'GROUP' ? 'domain' : 'person'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{entity.displayName}</div>
                                                            <div className="text-[10px] text-slate-500">
                                                                {entity.type === 'GROUP' ? `${entity.memberCount} Üye • ${entity.department}` : `${entity.title} • ${entity.department}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isSelected && <span className="material-symbols-outlined text-indigo-500 text-[16px]">check</span>}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Selected Members List */}
                                {formMembers.length > 0 && (
                                    <div className="mt-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Seçilenler ({formMembers.length})</label>
                                        <div className="flex flex-wrap gap-2">
                                            {formMembers.map(id => {
                                                const entity = mockIdentityDirectory.find(e => e.id === id);
                                                if (!entity) return null;
                                                return (
                                                    <div key={id} className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                                                        <span className={`w-2 h-2 rounded-full ${entity.type === 'GROUP' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">{entity.displayName}</span>
                                                        <button onClick={() => handleRemoveMember(id)} className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors">
                                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Drawer Logic: Service Specifics */}
                        {(drawerMode === 'EDIT_SERVICE' || drawerMode === 'ADD_SERVICE') && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Atanan Çözüm Ekibi</label>
                                    <select 
                                        value={formGroupId} 
                                        onChange={e => setFormGroupId(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                                    >
                                        <option value="">Seçiniz...</option>
                                        {groups.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-slate-400">Bu hizmet kategorisinde açılan talepler otomatik olarak bu gruba atanır.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Form Tipi</label>
                                        <select 
                                            value={formType} 
                                            onChange={e => setFormType(e.target.value as FormType)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                                        >
                                            <option value="GENERAL">Genel</option>
                                            <option value="HARDWARE">Donanım</option>
                                            <option value="SOFTWARE">Yazılım</option>
                                            <option value="ACCESS">Erişim</option>
                                            <option value="DATE_RANGE">Tarih Aralığı</option>
                                            <option value="FINANCE">Finans</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">SLA Süresi</label>
                                        <input 
                                            type="text" 
                                            value={formSla} 
                                            onChange={e => setFormSla(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">İkon</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['devices', 'router', 'code', 'person_add', 'event', 'payments', 'gavel', 'help'].map(icon => (
                                            <button 
                                                key={icon}
                                                onClick={() => setFormIcon(icon)}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${formIcon === icon ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200'}`}
                                            >
                                                <span className="material-symbols-outlined">{icon}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                        <button 
                            onClick={handleSave}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                        >
                            Kaydet ve Kapat
                        </button>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default AdminSettings;
