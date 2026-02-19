import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

// --- TYPES ---

interface DirectoryUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    role: string;
    phone?: string;
    location?: string;
}

interface Email {
    id: string;
    from: DirectoryUser;
    to: DirectoryUser[];
    cc?: DirectoryUser[];
    subject: string;
    snippet: string;
    body: string;
    date: string;
    timestamp: Date;
    isRead: boolean;
    isStarred?: boolean;
    hasAttachment: boolean;
    folder: 'INBOX' | 'SENT' | 'DRAFTS' | 'TRASH';
    tags?: string[];
    priority?: 'HIGH' | 'NORMAL' | 'LOW';
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'MEETING' | 'EVENT' | 'HOLIDAY';
    location?: string;
    attendees?: string[]; // user ids
}

type ComposeMode = 'NEW' | 'REPLY' | 'REPLY_ALL' | 'FORWARD';
type SettingsTab = 'PROFILE' | 'SIGNATURE' | 'VACATION';
type InboxModule = 'MAIL' | 'CONTACTS' | 'CALENDAR';

// --- MOCK IDENTITY DATA (Active Directory Simulation) ---
const mockDirectory: DirectoryUser[] = [
    { id: 'u1', name: 'Ahmet Yılmaz', email: 'ali.goksoy@retailmind.com', avatar: 'AG', department: 'IT', role: 'System Admin', phone: '+90 555 111 22 33', location: 'Kat 4 - IT Ofis' },
    { id: 'u2', name: 'Zeynep Yılmaz', email: 'zeynep.yilmaz@retailmind.com', avatar: 'ZY', department: 'Finans', role: 'Finance Specialist', phone: '+90 555 222 33 44', location: 'Kat 3 - Finans' },
    { id: 'u3', name: 'Caner Erkin', email: 'caner.erkin@retailmind.com', avatar: 'CE', department: 'Satın Alma', role: 'Procurement Officer', phone: '+90 555 333 44 55', location: 'Zemin Kat' },
    { id: 'u4', name: 'Ayşe Demir', email: 'ayse.demir@retailmind.com', avatar: 'AD', department: 'İK', role: 'HR Manager', phone: '+90 555 444 55 66', location: 'Kat 2 - İK' },
    { id: 'u5', name: 'Mehmet Öz', email: 'mehmet.oz@retailmind.com', avatar: 'MÖ', department: 'Operasyon', role: 'Ops Lead', phone: '+90 555 555 66 77', location: 'Saha Ofisi' },
    { id: 'u6', name: 'Selin Tekin', email: 'selin.tekin@retailmind.com', avatar: 'ST', department: 'Hukuk', role: 'Legal Counsel', phone: '+90 555 666 77 88', location: 'Kat 5 - Yönetim' },
    { id: 'g1', name: 'Tüm Çalışanlar', email: 'all@retailmind.com', avatar: '#', department: 'Genel', role: 'Dağıtım Listesi' },
    { id: 'g2', name: 'IT Destek', email: 'support@retailmind.com', avatar: '#', department: 'IT', role: 'Grup' },
];

const currentUser: DirectoryUser = { id: 'me', name: 'Ben', email: 'me@retailmind.com', avatar: 'ME', department: 'IT', role: 'Admin' };

// --- MOCK EMAILS ---
const mockEmails: Email[] = [
    {
        id: 'e1',
        from: mockDirectory[3], // Ayşe Demir (IK)
        to: [mockDirectory[6]], // All Employees
        subject: 'Duyuru: Yeni Yan Haklar Paketi',
        snippet: 'Değerli çalışma arkadaşlarımız, 2024 yılı itibariyle geçerli olacak...',
        body: `Değerli çalışma arkadaşlarımız,

2024 yılı itibariyle geçerli olacak yeni yan haklar paketimiz güncellenmiştir. Detaylı bilgiyi ekteki sunumda bulabilirsiniz.

Öne çıkan değişiklikler:
- Özel sağlık sigortası kapsamı genişletildi.
- Yemek kartı limitleri %30 artırıldı.
- Uzaktan çalışma desteği aylık olarak güncellendi.

Saygılarımızla,
İnsan Kaynakları`,
        date: '10:30',
        timestamp: new Date(),
        isRead: false,
        isStarred: true,
        hasAttachment: true,
        folder: 'INBOX',
        tags: ['Kurumsal', 'Önemli'],
        priority: 'HIGH'
    },
    {
        id: 'e2',
        from: mockDirectory[0], // Ali Göksoy
        to: [currentUser],
        cc: [mockDirectory[4]],
        subject: 'VPN Erişim Sorunları Hk.',
        snippet: 'Merhaba, dün gece yapılan güncellemeden sonra bazı kullanıcılar...',
        body: `Merhaba,

Dün gece yapılan güncellemeden sonra bazı kullanıcılar VPN bağlantısında sorun yaşıyor. Logları incelediğimizde sertifika hatası görüyoruz. 

Konuyla ilgili Network ekibiyle görüşebilir misin?

İyi çalışmalar,
Ali`,
        date: 'Dün',
        timestamp: new Date(Date.now() - 86400000),
        isRead: true,
        isStarred: false,
        hasAttachment: false,
        folder: 'INBOX',
        tags: ['Teknik']
    },
    {
        id: 'e4',
        from: currentUser,
        to: [mockDirectory[5]], // Selin Tekin
        subject: 'Aylık Sistem Raporu - Ekim',
        snippet: 'Ekte Ekim ayı sistem performans raporunu bulabilirsiniz.',
        body: 'Ekte Ekim ayı sistem performans raporunu bulabilirsiniz.',
        date: '20 Ekim',
        timestamp: new Date(Date.now() - 300000000),
        isRead: true,
        isStarred: false,
        hasAttachment: true,
        folder: 'SENT'
    }
];

// --- MOCK CALENDAR EVENTS ---
const mockEvents: CalendarEvent[] = [
    { id: 'evt1', title: 'Haftalık IT Toplantısı', start: new Date(new Date().setHours(10, 0)), end: new Date(new Date().setHours(11, 0)), type: 'MEETING', location: 'Toplantı Odası A', attendees: ['u1', 'u2'] },
    { id: 'evt2', title: 'Proje Lansmanı', start: new Date(new Date().setDate(new Date().getDate() + 2)), end: new Date(new Date().setDate(new Date().getDate() + 2)), type: 'EVENT', location: 'Konferans Salonu' },
    { id: 'evt3', title: 'Cumhuriyet Bayramı', start: new Date('2023-10-29'), end: new Date('2023-10-29'), type: 'HOLIDAY' },
];

const Inbox: React.FC = () => {
    const { addToast } = useToast();
    const [activeModule, setActiveModule] = useState<InboxModule>('MAIL');
    const [currentFolder, setCurrentFolder] = useState<'INBOX' | 'SENT' | 'DRAFTS' | 'TRASH'>('INBOX');
    const [emails, setEmails] = useState<Email[]>(mockEmails);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Contacts State
    const [selectedContact, setSelectedContact] = useState<DirectoryUser | null>(null);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('PROFILE');
    
    // User Preferences
    const [userSignature, setUserSignature] = useState('Saygılarımla,\n\nAli Göksoy\nSystem Admin | RetailMind IT\nTel: +90 555 123 45 67');
    const [isVacationMode, setIsVacationMode] = useState(false);
    const [vacationMessage, setVacationMessage] = useState('Merhaba,\n\nŞu anda ofis dışındayım ve e-postalarıma sınırlı erişimim var. Acil durumlarda IT Destek hattını arayabilirsiniz.\n\nDönüş Tarihi: 25 Ekim 2023');

    // Compose State
    const [composeMode, setComposeMode] = useState<ComposeMode>('NEW');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [recipientsTo, setRecipientsTo] = useState<DirectoryUser[]>([]);
    const [recipientsCc, setRecipientsCc] = useState<DirectoryUser[]>([]);
    const [recipientsBcc, setRecipientsBcc] = useState<DirectoryUser[]>([]);
    const [composePriority, setComposePriority] = useState<'HIGH' | 'NORMAL' | 'LOW'>('NORMAL');
    const [composeTags, setComposeTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);

    // Refs for focus management
    const toInputRef = useRef<HTMLInputElement>(null);
    const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Filter Logic including Search
    const filteredEmails = emails.filter(e => {
        const matchesFolder = e.folder === currentFolder;
        if (!searchQuery) return matchesFolder;
        
        const q = searchQuery.toLowerCase();
        return matchesFolder && (
            e.subject.toLowerCase().includes(q) ||
            e.from.name.toLowerCase().includes(q) ||
            e.from.email.toLowerCase().includes(q) ||
            e.body.toLowerCase().includes(q)
        );
    });

    const unreadCount = emails.filter(e => e.folder === 'INBOX' && !e.isRead).length;
    const draftsCount = emails.filter(e => e.folder === 'DRAFTS').length;

    // Filter Contacts
    const filteredContacts = mockDirectory.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Smart Focus Logic
    useEffect(() => {
        if (isComposeOpen) {
            setTimeout(() => {
                if (composeMode === 'REPLY' || composeMode === 'REPLY_ALL') {
                    bodyTextareaRef.current?.focus();
                    bodyTextareaRef.current?.setSelectionRange(0, 0);
                } else {
                    toInputRef.current?.focus();
                }
            }, 100);
        }
    }, [isComposeOpen, composeMode]);

    // --- ACTIONS ---

    const handleNewEmail = (preselectedUser?: DirectoryUser) => {
        resetCompose();
        if (preselectedUser) {
            setRecipientsTo([preselectedUser]);
        }
        setComposeMode('NEW');
        setIsComposeOpen(true);
    };

    const handleReply = (mode: ComposeMode, email: Email) => {
        resetCompose();
        setComposeMode(mode);
        
        if (mode === 'REPLY') {
            setRecipientsTo([email.from]);
            setComposeSubject(email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`);
        } else if (mode === 'REPLY_ALL') {
            setRecipientsTo([email.from, ...email.to.filter(u => u.id !== currentUser.id)]);
            if (email.cc) setRecipientsCc(email.cc);
            setComposeSubject(email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`);
            if (email.cc && email.cc.length > 0) setShowCc(true);
        } else if (mode === 'FORWARD') {
            setComposeSubject(email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`);
            setComposeBody(`\n\n\n-------- İletilen İleti --------\nKimden: ${email.from.name} <${email.from.email}>\nTarih: ${email.timestamp.toLocaleString()}\nKonu: ${email.subject}\n\n${email.body}`);
        }

        setIsComposeOpen(true);
    };

    const resetCompose = () => {
        setRecipientsTo([]);
        setRecipientsCc([]);
        setRecipientsBcc([]);
        setComposeSubject('');
        setComposeBody('');
        setComposePriority('NORMAL');
        setComposeTags([]);
        setTagInput('');
        setShowCc(false);
        setShowBcc(false);
        setComposeMode('NEW');
    }

    const handleSaveSettings = () => {
        addToast('Ayarlar başarıyla kaydedildi.', 'success');
        setIsSettingsOpen(false);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !composeTags.includes(tagInput.trim())) {
            setComposeTags([...composeTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setComposeTags(composeTags.filter(t => t !== tag));
    };

    // --- RECIPIENT INPUT COMPONENT (Internal) ---
    const RecipientInput = ({ 
        label, 
        selectedUsers, 
        onAdd, 
        onRemove,
        inputRef // Allow passing ref
    }: { 
        label: string, 
        selectedUsers: DirectoryUser[], 
        onAdd: (u: DirectoryUser) => void, 
        onRemove: (id: string) => void,
        inputRef?: React.RefObject<HTMLInputElement>
    }) => {
        const [query, setQuery] = useState('');
        const [suggestions, setSuggestions] = useState<DirectoryUser[]>([]);
        const [isFocused, setIsFocused] = useState(false);
        // Use internal ref if external one not provided
        const localInputRef = useRef<HTMLInputElement>(null);
        const activeRef = inputRef || localInputRef;

        useEffect(() => {
            if (!query) {
                setSuggestions([]);
                return;
            }
            const lowerQ = query.toLowerCase();
            const results = mockDirectory.filter(u => 
                !selectedUsers.find(sel => sel.id === u.id) && // Exclude already selected
                (u.name.toLowerCase().includes(lowerQ) || u.email.toLowerCase().includes(lowerQ))
            );
            setSuggestions(results);
        }, [query, selectedUsers]);

        return (
            <div className={`flex items-start gap-2 border-b transition-colors py-2 ${isFocused ? 'border-primary' : 'border-slate-200 dark:border-slate-700'}`}>
                <span className="text-sm font-semibold text-slate-500 w-12 pt-1.5 shrink-0">{label}:</span>
                <div className="flex-1 flex flex-wrap gap-2 relative">
                    {/* Selected Chips */}
                    {selectedUsers.map(user => (
                        <div key={user.id} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 rounded-full pl-1 pr-2 py-0.5 border border-slate-200 dark:border-slate-600 animate-in fade-in zoom-in duration-200">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[9px] font-bold text-indigo-700 dark:text-indigo-300">
                                {user.avatar}
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                            <button onClick={() => onRemove(user.id)} className="text-slate-400 hover:text-rose-500 rounded-full p-0.5">
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        </div>
                    ))}
                    
                    {/* Input */}
                    <div className="relative flex-1 min-w-[120px]">
                        <input
                            ref={activeRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay for click handling
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !query && selectedUsers.length > 0) {
                                    onRemove(selectedUsers[selectedUsers.length - 1].id);
                                }
                            }}
                            className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-200 py-1"
                            placeholder={selectedUsers.length === 0 ? "Kişi veya grup ara..." : ""}
                        />
                        
                        {/* Dropdown Suggestions */}
                        {isFocused && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                                <div className="text-[10px] font-bold text-slate-400 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider">
                                    Rehber Sonuçları
                                </div>
                                {suggestions.map(user => (
                                    <div 
                                        key={user.id} 
                                        onClick={() => { onAdd(user); setQuery(''); activeRef.current?.focus(); }}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                            {user.avatar}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</span>
                                            <span className="text-[10px] text-slate-500 truncate">{user.email} • {user.department}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // --- CALENDAR RENDERER ---
    const CalendarView = () => {
        const [currentDate, setCurrentDate] = useState(new Date());
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
        
        // Adjust for Monday start (0=Mon, 6=Sun)
        const startOffset = (firstDayOfMonth + 6) % 7; 

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`empty-${i}`} className="bg-slate-50/30 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 min-h-[100px]"></div>);
        }
        
        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            
            // Find events for this day
            const dayEvents = mockEvents.filter(e => {
                const eventDate = new Date(e.start);
                return eventDate.getDate() === day && eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
            });

            days.push(
                <div key={day} className={`border border-slate-100 dark:border-slate-700 min-h-[100px] p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-900'}`}>
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {day}
                        </span>
                        {/* Add Event Button on Hover */}
                        <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary transition-opacity">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                    </div>
                    <div className="mt-2 space-y-1">
                        {dayEvents.map(evt => (
                            <div key={evt.id} className={`text-[10px] font-bold px-1.5 py-1 rounded truncate cursor-pointer ${
                                evt.type === 'HOLIDAY' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' :
                                evt.type === 'MEETING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                            }`}>
                                {evt.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-all">
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-bold hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-all">Bugün</button>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-all">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-hover transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Yeni Etkinlik
                    </button>
                </div>
                
                {/* Week Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 uppercase">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full bg-white dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
            
            {/* 1. Folder Sidebar */}
            <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
                
                {/* Module Switcher */}
                <div className="p-3">
                    <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => setActiveModule('MAIL')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${activeModule === 'MAIL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">mail</span>
                            Mail
                        </button>
                        <button 
                            onClick={() => setActiveModule('CONTACTS')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${activeModule === 'CONTACTS' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">contacts</span>
                            Kişiler
                        </button>
                        <button 
                            onClick={() => setActiveModule('CALENDAR')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${activeModule === 'CALENDAR' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                            Takvim
                        </button>
                    </div>
                </div>

                {activeModule === 'MAIL' && (
                    <>
                        <div className="px-4 pb-2">
                            <button 
                                onClick={() => handleNewEmail()}
                                className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-sm hover:shadow-md text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 group"
                            >
                                <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                </div>
                                Yeni E-posta
                            </button>
                        </div>
                        
                        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                            {[
                                { id: 'INBOX', label: 'Gelen Kutusu', icon: 'inbox', count: unreadCount },
                                { id: 'SENT', label: 'Gönderilenler', icon: 'send', count: 0 },
                                { id: 'DRAFTS', label: 'Taslaklar', icon: 'drafts', count: draftsCount },
                                { id: 'TRASH', label: 'Çöp Kutusu', icon: 'delete', count: 0 },
                            ].map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => { setCurrentFolder(folder.id as any); setSelectedEmail(null); }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        currentFolder === folder.id 
                                        ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-slate-700' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-[20px] ${currentFolder === folder.id ? 'fill-current' : ''}`}>{folder.icon}</span>
                                        {folder.label}
                                    </div>
                                    {folder.count > 0 && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            currentFolder === folder.id ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                        }`}>
                                            {folder.count}
                                        </span>
                                    )}
                                </button>
                            ))}

                            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 px-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2">Etiketler</span>
                                <div className="mt-2 space-y-1">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Önemli
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Kurumsal
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Proje
                                    </button>
                                </div>
                            </div>
                        </nav>

                        {/* Settings Button */}
                        <div className="p-3 mt-auto border-t border-slate-200 dark:border-slate-700">
                            <button 
                                onClick={() => setIsSettingsOpen(true)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                Posta Ayarları
                            </button>
                        </div>
                    </>
                )}

                {activeModule === 'CONTACTS' && (
                    <div className="flex-1 px-4 py-2">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mb-4 border border-indigo-100 dark:border-indigo-800">
                            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">Adres Defteri</h4>
                            <p className="text-xs text-indigo-700 dark:text-indigo-400">Tüm kurumsal kişiler Identity sisteminden senkronize edilmektedir.</p>
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">Departmanlar</div>
                        <div className="space-y-1">
                            {Array.from(new Set(mockDirectory.map(u => u.department))).map(dept => (
                                <button key={dept} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">folder</span>
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeModule === 'CALENDAR' && (
                    <div className="flex-1 px-4 py-2">
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">Takvimlerim</div>
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Kişisel
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                        Resmi Tatiller
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        Toplantılar
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Main Content Area */}
            
            {/* MAIL VIEW */}
            {activeModule === 'MAIL' && (
                <>
                    <div className={`${selectedEmail ? 'hidden lg:block w-80 xl:w-96' : 'w-full'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300`}>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">search</span>
                                <input 
                                    type="text" 
                                    placeholder="E-posta ara..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 dark:text-slate-200"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {/* ... Email List Rendering Code ... */}
                            {filteredEmails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                                    <p className="text-sm">
                                        {searchQuery ? 'Sonuç bulunamadı.' : 'Bu klasör boş.'}
                                    </p>
                                </div>
                            ) : (
                                filteredEmails.map(email => (
                                    <div 
                                        key={email.id}
                                        onClick={() => { setSelectedEmail(email); if(!email.isRead) { setEmails(prev => prev.map(e => e.id === email.id ? {...e, isRead:true} : e)); } }}
                                        className={`p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group relative ${
                                            selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                        }`}
                                    >
                                        {selectedEmail?.id === email.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                        
                                        <div className="flex justify-between items-start mb-1.5">
                                            <div className="flex items-center gap-2 max-w-[70%]">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${!email.isRead ? 'bg-primary' : 'bg-slate-400'}`}>
                                                    {email.from.avatar}
                                                </div>
                                                <h4 className={`text-sm truncate ${!email.isRead ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>
                                                    {email.from.name}
                                                </h4>
                                            </div>
                                            <span className={`text-[10px] whitespace-nowrap ${!email.isRead ? 'text-primary font-bold' : 'text-slate-400'}`}>{email.date}</span>
                                        </div>
                                        <h5 className={`text-xs mb-1 truncate ${!email.isRead ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {email.priority === 'HIGH' && <span className="text-rose-500 font-bold mr-1">!</span>}
                                            {email.subject}
                                        </h5>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {email.snippet}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={`flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900 min-w-0 ${!selectedEmail ? 'hidden lg:flex' : 'flex'}`}>
                        {selectedEmail ? (
                            <>
                                <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 bg-white dark:bg-slate-800">
                                    <button onClick={() => setSelectedEmail(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <span className="font-bold">Gelen Kutusu</span>
                                </div>
                                {/* Email Content Header & Body */}
                                <div className="p-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                                    <div className="flex justify-between items-start mb-6">
                                        {/* Actions Bar */}
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {selectedEmail.tags?.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button onClick={() => {}} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Arşivle">
                                                <span className="material-symbols-outlined text-[20px]">archive</span>
                                            </button>
                                            <button onClick={() => {}} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" title="Sil">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                                        {selectedEmail.subject}
                                    </h2>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-md ring-4 ring-indigo-50 dark:ring-slate-700">
                                                {selectedEmail.from.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedEmail.from.name}</span>
                                                    <span className="text-xs text-slate-500">&lt;{selectedEmail.from.email}&gt;</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">Alıcı: {selectedEmail.to.map(u=>u.name).join(', ')}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                                {selectedEmail.timestamp.toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons: Reply, Reply All, Forward */}
                                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                        <button 
                                            onClick={() => handleReply('REPLY', selectedEmail)}
                                            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">reply</span>
                                            Yanıtla
                                        </button>
                                        <button 
                                            onClick={() => handleReply('REPLY_ALL', selectedEmail)}
                                            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">reply_all</span>
                                            Tümünü Yanıtla
                                        </button>
                                        <button 
                                            onClick={() => handleReply('FORWARD', selectedEmail)}
                                            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">forward</span>
                                            İlet
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-10 bg-white dark:bg-slate-900">
                                    <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-7 font-sans whitespace-pre-wrap">
                                        {selectedEmail.body}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900">
                                <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <span className="material-symbols-outlined text-6xl opacity-30">mark_email_unread</span>
                                </div>
                                <p className="text-xl font-bold text-slate-600 dark:text-slate-300">Bir e-posta seçin</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* CONTACTS VIEW */}
            {activeModule === 'CONTACTS' && (
                <>
                    <div className={`${selectedContact ? 'hidden lg:block w-80 xl:w-96' : 'w-full'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300`}>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">search</span>
                                <input 
                                    type="text" 
                                    placeholder="Kişi ara..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 dark:text-slate-200"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {filteredContacts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                    <p className="text-sm">Kişi bulunamadı.</p>
                                </div>
                            ) : (
                                filteredContacts.map(user => (
                                    <div 
                                        key={user.id}
                                        onClick={() => setSelectedContact(user)}
                                        className={`p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-4 ${
                                            selectedContact?.id === user.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{user.name}</h4>
                                            <p className="text-xs text-slate-500">{user.role}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={`flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900 min-w-0 ${!selectedContact ? 'hidden lg:flex' : 'flex'}`}>
                        {selectedContact ? (
                            <div className="flex flex-col h-full overflow-y-auto">
                                <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 bg-white dark:bg-slate-800">
                                    <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <span className="font-bold">Kişi Detayı</span>
                                </div>
                                <div className="p-10 flex flex-col items-center border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-6">
                                        {selectedContact.avatar}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedContact.name}</h2>
                                    <p className="text-slate-500 text-sm mt-1">{selectedContact.role} • {selectedContact.department}</p>
                                    <div className="flex gap-3 mt-6">
                                        <button 
                                            onClick={() => handleNewEmail(selectedContact)}
                                            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">mail</span>
                                            E-posta Gönder
                                        </button>
                                        <button className="px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">chat</span>
                                            Mesaj Yaz
                                        </button>
                                    </div>
                                </div>
                                <div className="p-10 max-w-2xl mx-auto w-full space-y-6">
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">İletişim</label>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined text-[18px]">email</span>
                                            </div>
                                            <span className="text-sm font-medium">{selectedContact.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined text-[18px]">call</span>
                                            </div>
                                            <span className="text-sm font-medium">{selectedContact.phone || 'Telefon Yok'}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Organizasyon</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined text-[18px]">apartment</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{selectedContact.department}</div>
                                                <div className="text-xs text-slate-500">{selectedContact.location || 'Lokasyon Belirtilmemiş'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900">
                                <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <span className="material-symbols-outlined text-6xl opacity-30">person</span>
                                </div>
                                <p className="text-xl font-bold text-slate-600 dark:text-slate-300">Bir kişi seçin</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* CALENDAR VIEW */}
            {activeModule === 'CALENDAR' && <CalendarView />}

            {/* SETTINGS MODAL */}
            {isSettingsOpen && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[70vh] animate-in zoom-in-95 duration-200">
                        <div className="flex h-full">
                            {/* Settings Sidebar */}
                            <div className="w-56 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">Posta Ayarları</h3>
                                <div className="space-y-1">
                                    <button 
                                        onClick={() => setActiveSettingsTab('PROFILE')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSettingsTab === 'PROFILE' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                        Profil Bilgileri
                                    </button>
                                    <button 
                                        onClick={() => setActiveSettingsTab('SIGNATURE')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSettingsTab === 'SIGNATURE' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">ink_pen</span>
                                        İmza
                                    </button>
                                    <button 
                                        onClick={() => setActiveSettingsTab('VACATION')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSettingsTab === 'VACATION' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">beach_access</span>
                                        Otomatik Yanıt
                                    </button>
                                </div>
                            </div>

                            {/* Settings Content */}
                            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-800">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                                        {activeSettingsTab === 'PROFILE' && 'Profil Bilgileri'}
                                        {activeSettingsTab === 'SIGNATURE' && 'E-posta İmzası'}
                                        {activeSettingsTab === 'VACATION' && 'Otomatik Yanıt (Tatil Modu)'}
                                    </h3>
                                    <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="p-8 flex-1 overflow-y-auto">
                                    {activeSettingsTab === 'PROFILE' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-300">
                                                    {currentUser.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</h4>
                                                    <p className="text-sm text-slate-500">{currentUser.email}</p>
                                                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-800">Identity Managed</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Departman</label>
                                                    <input type="text" value={currentUser.department} disabled className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Görevi</label>
                                                    <input type="text" value={currentUser.role} disabled className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Telefon</label>
                                                    <input type="text" defaultValue="+90 555 123 45 67" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Lokasyon</label>
                                                    <input type="text" defaultValue="Merkez Ofis - Kat 4" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSettingsTab === 'SIGNATURE' && (
                                        <div className="space-y-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                Gönderilen tüm e-postaların altına otomatik olarak eklenecek imzanızı düzenleyin.
                                            </p>
                                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-3 py-2 flex gap-1">
                                                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"><span className="material-symbols-outlined text-[18px]">link</span></button>
                                                </div>
                                                <textarea 
                                                    value={userSignature} 
                                                    onChange={e => setUserSignature(e.target.value)} 
                                                    className="w-full h-48 p-4 text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 outline-none resize-none" 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeSettingsTab === 'VACATION' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Otomatik Yanıtı Etkinleştir</h4>
                                                    <p className="text-xs text-slate-500">Siz yokken gelen e-postalara otomatik cevap döner.</p>
                                                </div>
                                                <button 
                                                    onClick={() => setIsVacationMode(!isVacationMode)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVacationMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVacationMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className={`space-y-4 transition-opacity ${isVacationMode ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Başlangıç</label>
                                                        <input type="date" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Bitiş</label>
                                                        <input type="date" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Yanıt Metni</label>
                                                    <textarea 
                                                        value={vacationMessage}
                                                        onChange={(e) => setVacationMessage(e.target.value)}
                                                        rows={5}
                                                        className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-primary outline-none resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end">
                                    <button 
                                        onClick={handleSaveSettings}
                                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Değişiklikleri Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* COMPOSE MODAL */}
            {isComposeOpen && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-lg">
                                <span className="material-symbols-outlined text-primary">
                                    {composeMode === 'NEW' ? 'edit_square' : composeMode === 'FORWARD' ? 'forward' : 'reply'}
                                </span>
                                {composeMode === 'NEW' ? 'Yeni İleti' : composeMode === 'FORWARD' ? 'İlet' : 'Yanıtla'}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => { setIsComposeOpen(false); resetCompose(); }} className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            <div className="flex justify-end gap-3 text-xs font-bold text-primary px-2">
                                {!showCc && <button onClick={() => setShowCc(true)} className="hover:underline">Cc Ekle</button>}
                                {!showBcc && <button onClick={() => setShowBcc(true)} className="hover:underline">Bcc Ekle</button>}
                            </div>

                            <RecipientInput 
                                label="Kime" 
                                selectedUsers={recipientsTo} 
                                onAdd={(u) => setRecipientsTo([...recipientsTo, u])}
                                onRemove={(id) => setRecipientsTo(recipientsTo.filter(u => u.id !== id))}
                                inputRef={toInputRef}
                            />

                            {showCc && (
                                <RecipientInput 
                                    label="Cc" 
                                    selectedUsers={recipientsCc} 
                                    onAdd={(u) => setRecipientsCc([...recipientsCc, u])}
                                    onRemove={(id) => setRecipientsCc(recipientsCc.filter(u => u.id !== id))}
                                />
                            )}

                            {showBcc && (
                                <RecipientInput 
                                    label="Bcc" 
                                    selectedUsers={recipientsBcc} 
                                    onAdd={(u) => setRecipientsBcc([...recipientsBcc, u])}
                                    onRemove={(id) => setRecipientsBcc(recipientsBcc.filter(u => u.id !== id))}
                                />
                            )}

                            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 py-2">
                                <span className="text-sm font-semibold text-slate-500 w-12 pt-1.5 shrink-0">Konu:</span>
                                <input 
                                    type="text" 
                                    value={composeSubject}
                                    onChange={(e) => setComposeSubject(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-900 dark:text-slate-100 py-1.5 placeholder:font-normal placeholder:text-slate-400"
                                    placeholder="Konu başlığı girin..."
                                />
                            </div>

                            {/* Tags & Priority Bar */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <button 
                                        onClick={() => setComposePriority('LOW')} 
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${composePriority === 'LOW' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >Düşük</button>
                                    <button 
                                        onClick={() => setComposePriority('NORMAL')} 
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${composePriority === 'NORMAL' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >Normal</button>
                                    <button 
                                        onClick={() => setComposePriority('HIGH')} 
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${composePriority === 'HIGH' ? 'bg-white dark:bg-slate-700 shadow text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >Yüksek</button>
                                </div>
                                <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-[16px] text-slate-400">label</span>
                                    {composeTags.map(tag => (
                                        <span key={tag} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-rose-500"><span className="material-symbols-outlined text-[10px]">close</span></button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                                        placeholder="Etiket ekle (Enter)" 
                                        className="bg-transparent outline-none text-xs text-slate-700 dark:text-slate-300 flex-1 min-w-[100px]"
                                    />
                                </div>
                            </div>

                            {/* Editor Area */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col h-full min-h-[300px] overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                {/* Toolbar */}
                                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-2 flex items-center gap-1">
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"><span className="material-symbols-outlined text-[18px]">format_underlined</span></button>
                                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></button>
                                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"><span className="material-symbols-outlined text-[18px]">image</span></button>
                                </div>
                                <textarea 
                                    ref={bodyTextareaRef}
                                    placeholder="Mesajınızı buraya yazın..." 
                                    value={composeBody}
                                    onChange={(e) => setComposeBody(e.target.value)}
                                    className="flex-1 w-full bg-white dark:bg-slate-800 p-4 outline-none text-sm resize-none placeholder:text-slate-400 text-slate-800 dark:text-slate-200 leading-relaxed font-sans"
                                ></textarea>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" title="Taslağı Sil">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" title="Taslak Olarak Kaydet">
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleNewEmail.bind(null, undefined)} 
                                    className="px-8 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                                >
                                    Gönder
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Inbox;