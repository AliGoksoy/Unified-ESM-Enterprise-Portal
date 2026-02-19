import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

// --- TYPES ---
interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isSystem?: boolean;
}

interface IdentityUser {
    id: string;
    name: string;
    avatar: string;
    role: string;
    status: 'online' | 'offline' | 'busy' | 'away';
    department: string;
}

interface Conversation {
    id: string;
    type: 'DIRECT' | 'CHANNEL';
    name?: string; // For channels
    targetUserId?: string; // For Direct messages (Link to Identity)
    avatar?: string; // For channels
    unreadCount: number;
    lastMessage: string;
    lastMessageTime: string;
}

// --- MOCK IDENTITY DIRECTORY (Centralized Source) ---
const mockIdentityDirectory: IdentityUser[] = [
    { id: 'u1', name: 'Ali Göksoy', avatar: 'AG', role: 'System Admin', status: 'online', department: 'IT' },
    { id: 'u2', name: 'Zeynep Yılmaz', avatar: 'ZY', role: 'Finance Specialist', status: 'busy', department: 'Finans' },
    { id: 'u3', name: 'Caner Erkin', avatar: 'CE', role: 'Procurement Officer', status: 'offline', department: 'Satın Alma' },
    { id: 'u4', name: 'Ayşe Demir', avatar: 'AD', role: 'HR Manager', status: 'away', department: 'İK' },
    { id: 'u5', name: 'Mehmet Öz', avatar: 'MÖ', role: 'Ops Lead', status: 'online', department: 'Operasyon' },
    { id: 'u6', name: 'Selin Tekin', avatar: 'ST', role: 'Legal Counsel', status: 'offline', department: 'Hukuk' },
];

const currentUser = 'me'; // ID for logged in user

// --- MOCK CONVERSATIONS ---
// Note: Direct messages now reference `targetUserId` instead of hardcoded names
const initialConversations: Conversation[] = [
    { 
        id: 'c1', type: 'CHANNEL', name: 'Genel Duyurular', avatar: '#', 
        unreadCount: 0, lastMessage: 'Yarın ofis ilaçlanacak arkadaşlar.', lastMessageTime: '10:30'
    },
    { 
        id: 'c2', type: 'CHANNEL', name: 'IT Destek', avatar: '#', 
        unreadCount: 2, lastMessage: 'Sunucu bakımı tamamlandı.', lastMessageTime: '09:15'
    },
    { 
        id: 'd1', type: 'DIRECT', targetUserId: 'u1', // Links to Ali Göksoy
        unreadCount: 1, lastMessage: 'Raporu inceledin mi?', lastMessageTime: '11:20'
    },
    { 
        id: 'd2', type: 'DIRECT', targetUserId: 'u2', // Links to Zeynep Yılmaz
        unreadCount: 0, lastMessage: 'Teşekkürler, iyi çalışmalar.', lastMessageTime: 'Dün'
    },
    { 
        id: 'd3', type: 'DIRECT', targetUserId: 'u3', // Links to Caner Erkin
        unreadCount: 0, lastMessage: 'Toplantı notlarını attım.', lastMessageTime: 'Pzt'
    }
];

const mockMessages: Record<string, Message[]> = {
    'd1': [
        { id: 'm1', senderId: 'u1', text: 'Selam, nasılsın?', timestamp: '11:15' },
        { id: 'm2', senderId: 'me', text: 'İyiyim Ali, sen nasılsın? Proje nasıl gidiyor?', timestamp: '11:16' },
        { id: 'm3', senderId: 'u1', text: 'Fena değil, son raporu inceledin mi? Birkaç düzeltme gerekebilir.', timestamp: '11:20' }
    ],
    'c2': [
        { id: 'cm1', senderId: 'sys', text: 'Bu kanal sadece IT duyuruları içindir.', timestamp: '09:00', isSystem: true },
        { id: 'cm2', senderId: 'u1', text: 'Sunucu bakımı tamamlandı, erişimler açıldı.', timestamp: '09:15' },
    ]
};

const Messages: React.FC = () => {
    const { addToast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [activeConvId, setActiveConvId] = useState<string>('d1');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // New Chat Modal State
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    // Load messages when conversation changes
    useEffect(() => {
        const msgs = mockMessages[activeConvId] || [];
        setMessages(msgs);
        
        // Mark as read
        setConversations(prev => prev.map(c => 
            c.id === activeConvId ? { ...c, unreadCount: 0 } : c
        ));
    }, [activeConvId]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId: 'me',
            text: inputText,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        
        // Update conversation list preview
        setConversations(prev => prev.map(c => 
            c.id === activeConvId 
            ? { ...c, lastMessage: 'Siz: ' + inputText, lastMessageTime: 'Şimdi' } 
            : c
        ));

        setInputText('');

        // Simulate reply for demo
        const activeConv = conversations.find(c => c.id === activeConvId);
        if (activeConv?.type === 'DIRECT') {
            setTimeout(() => {
                const reply: Message = {
                    id: `msg_${Date.now() + 1}`,
                    senderId: activeConv.targetUserId || 'other',
                    text: 'Tamamdır, anlaşıldı 👍',
                    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, reply]);
            }, 2000);
        }
    };

    const startNewChat = (userId: string) => {
        // Check if conversation already exists
        const existingConv = conversations.find(c => c.type === 'DIRECT' && c.targetUserId === userId);
        
        if (existingConv) {
            setActiveConvId(existingConv.id);
        } else {
            // Create new conversation
            const newConv: Conversation = {
                id: `d_${Date.now()}`,
                type: 'DIRECT',
                targetUserId: userId,
                unreadCount: 0,
                lastMessage: '',
                lastMessageTime: 'Yeni'
            };
            setConversations([newConv, ...conversations]);
            setActiveConvId(newConv.id);
        }
        setIsNewChatModalOpen(false);
        setUserSearchQuery('');
    };

    // Helper to resolve display details
    const getConversationDetails = (conv: Conversation) => {
        if (conv.type === 'CHANNEL') {
            return {
                name: conv.name,
                avatar: conv.avatar, // Usually '#' or icon
                status: null,
                role: 'Kanal',
                isOnline: false
            };
        } else {
            const user = mockIdentityDirectory.find(u => u.id === conv.targetUserId);
            return {
                name: user?.name || 'Bilinmeyen Kullanıcı',
                avatar: user?.avatar || '?',
                status: user?.status,
                role: user?.role,
                isOnline: user?.status === 'online'
            };
        }
    };

    const activeConversation = conversations.find(c => c.id === activeConvId);
    const activeDetails = activeConversation ? getConversationDetails(activeConversation) : null;

    const filteredConversations = conversations.filter(c => {
        const details = getConversationDetails(c);
        return details.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const filteredIdentityUsers = mockIdentityDirectory.filter(u => 
        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full bg-white dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
            
            {/* LEFT SIDEBAR: Conversation List */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50">
                {/* Search Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Mesajlar</h2>
                        <button className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                        </button>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                        <input 
                            type="text" 
                            placeholder="Sohbet ara..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 dark:text-slate-200"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {/* Groups / Channels */}
                    <div className="mb-4">
                        <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                            Kanallar
                            <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary">add</span>
                        </h3>
                        {filteredConversations.filter(c => c.type === 'CHANNEL').map(c => (
                            <div 
                                key={c.id} 
                                onClick={() => setActiveConvId(c.id)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeConvId === c.id ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                            >
                                <span className="text-lg font-bold text-slate-400">#</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-bold truncate ${activeConvId === c.id ? 'text-slate-900 dark:text-white' : ''}`}>{c.name}</span>
                                        {c.unreadCount > 0 && <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{c.unreadCount}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Direct Messages */}
                    <div>
                        <div className="flex items-center justify-between px-3 mb-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direkt Mesajlar</h3>
                            <button onClick={() => setIsNewChatModalOpen(true)} className="text-slate-400 hover:text-primary transition-colors" title="Kişi Ekle">
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            </button>
                        </div>
                        
                        {filteredConversations.filter(c => c.type === 'DIRECT').map(c => {
                            const details = getConversationDetails(c);
                            return (
                                <div 
                                    key={c.id} 
                                    onClick={() => setActiveConvId(c.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeConvId === c.id ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <div className="relative">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm ${activeConvId === c.id ? 'bg-primary' : 'bg-slate-400'}`}>
                                            {details.avatar}
                                        </div>
                                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-slate-50 dark:border-slate-900 rounded-full ${
                                            details.status === 'online' ? 'bg-emerald-500' : details.status === 'busy' ? 'bg-rose-500' : details.status === 'away' ? 'bg-amber-500' : 'bg-slate-300'
                                        }`}></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className={`text-sm font-bold truncate ${activeConvId === c.id ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>{details.name}</span>
                                            <span className="text-[10px] text-slate-400">{c.lastMessageTime}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs truncate max-w-[140px] ${c.unreadCount > 0 ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-500'}`}>
                                                {c.lastMessage}
                                            </p>
                                            {c.unreadCount > 0 && <span className="bg-primary text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">{c.unreadCount}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN: Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
                {/* Chat Header */}
                <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {activeConversation?.type === 'CHANNEL' ? (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined">tag</span>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {activeDetails?.avatar}
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                {activeDetails?.name}
                                {activeDetails?.isOnline && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {activeConversation?.type === 'CHANNEL' ? '24 Üye' : activeDetails?.status === 'online' ? 'Çevrimiçi' : activeDetails?.role}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">phone</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">videocam</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">info</span>
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/50">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-3xl opacity-50">waving_hand</span>
                            </div>
                            <p className="text-sm">Sohbeti başlatın!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMe = msg.senderId === 'me';
                            const isSystem = msg.isSystem;
                            const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
                            
                            // Resolve Sender for Avatar
                            let senderAvatar = '?';
                            if (!isMe && !isSystem) {
                                if (activeConversation?.type === 'CHANNEL') {
                                    // In channels, look up sender from Identity
                                    const u = mockIdentityDirectory.find(u => u.id === msg.senderId);
                                    senderAvatar = u?.avatar || '?';
                                } else {
                                    // In DM, use the target user's avatar
                                    senderAvatar = activeDetails?.avatar || '?';
                                }
                            }

                            if (isSystem) {
                                return (
                                    <div key={msg.id} className="flex justify-center my-4">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                            {msg.text}
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group`}>
                                    {/* Avatar Placeholder for spacing */}
                                    <div className="w-8 shrink-0 flex flex-col items-center">
                                        {showAvatar && !isMe && (
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                                                {senderAvatar}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`flex flex-col max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        {/* Show Name in Channels */}
                                        {showAvatar && !isMe && activeConversation?.type === 'CHANNEL' && (
                                            <span className="text-[10px] font-bold text-slate-500 ml-1 mb-1">
                                                {mockIdentityDirectory.find(u => u.id === msg.senderId)?.name}
                                            </span>
                                        )}
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                                            isMe 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                            <span className={`text-[9px] block text-right mt-1 opacity-70 ${isMe ? 'text-white' : 'text-slate-400'}`}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <div className="flex gap-1 pb-2 pl-1">
                            <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            </button>
                            <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">image</span>
                            </button>
                        </div>
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Bir mesaj yazın..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none py-2.5 max-h-32 min-h-[44px]"
                            rows={1}
                        />
                        <button 
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm mb-0.5"
                        >
                            <span className="material-symbols-outlined text-[20px] block">send</span>
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-400">
                            Yazışmalar kurumsal politika gereği saklanmaktadır.
                        </p>
                    </div>
                </div>
            </div>

            {/* NEW CHAT MODAL */}
            {isNewChatModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Yeni Sohbet Başlat</h3>
                            <button onClick={() => setIsNewChatModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-slate-500">close</span>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                                <input 
                                    type="text" 
                                    placeholder="İsim veya departman ara..."
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)} 
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-2 pb-2">
                            <div className="px-2 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 mb-2 block">Kurumsal Rehber</span>
                                {filteredIdentityUsers.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredIdentityUsers.map(user => (
                                            <button 
                                                key={user.id}
                                                onClick={() => startNewChat(user.id)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left group"
                                            >
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                                                        {user.avatar}
                                                    </div>
                                                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white dark:border-slate-800 rounded-full ${
                                                        user.status === 'online' ? 'bg-emerald-500' : user.status === 'busy' ? 'bg-rose-500' : user.status === 'away' ? 'bg-amber-500' : 'bg-slate-300'
                                                    }`}></span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{user.name}</h4>
                                                    <p className="text-xs text-slate-500">{user.role} • {user.department}</p>
                                                </div>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">chat_bubble</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400 text-sm">Kullanıcı bulunamadı.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Messages;