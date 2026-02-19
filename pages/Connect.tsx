import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

// --- TYPES ---
type PostType = 'ANNOUNCEMENT' | 'DISCUSSION' | 'POLL' | 'KUDOS' | 'CIRCULAR';
type PostStatus = 'PUBLISHED' | 'PENDING' | 'DRAFT';

interface PollOption {
    id: string;
    text: string;
    votes: number;
    votedByMe?: boolean;
}

interface ConnectPost {
    id: string;
    type: PostType;
    status: PostStatus; // New field for workflow
    author: {
        name: string;
        avatar: string; // Initials or Image URL
        role?: string;
    };
    content: string; // Text or HTML
    timestamp: string;
    likes: number;
    comments: number;
    likedByMe: boolean;
    // Specialized Fields
    title?: string; // For Announcements
    pollOptions?: PollOption[]; // For Polls
    kudosTo?: string; // For Kudos (Receiver Name)
    image?: string; // Optional attachment
    tags?: string[];
    isPinned?: boolean;
    publishDate?: string; // Scheduled date
}

// --- MOCK DATA ---
const initialPosts: ConnectPost[] = [
    {
        id: 'post_5',
        type: 'CIRCULAR',
        status: 'PUBLISHED',
        author: { name: 'Genel Müdürlük', avatar: 'GM', role: 'Yönetim Kurulu' },
        title: 'Tamim No: 2023/14 - Kış Dönemi Kıyafet Yönetmeliği ve Mesai Saatleri',
        content: 'Değerli Çalışma Arkadaşlarımız,\n\n1 Kasım 2023 tarihi itibarıyla kış dönemi çalışma saatleri uygulamasına geçilecektir. Ayrıca ofis genelinde "Smart Casual" kıyafet yönetmeliği güncellenmiştir. Detaylı yönetmelik ekte sunulmuştur.\n\nBilgilerinize rica ederiz.',
        timestamp: 'Bugün, 09:00',
        likes: 124,
        comments: 0,
        likedByMe: false,
        isPinned: true,
        tags: ['Yönetmelik', 'İK', 'Resmi']
    },
    {
        id: 'post_1',
        type: 'ANNOUNCEMENT',
        status: 'PUBLISHED',
        author: { name: 'İnsan Kaynakları', avatar: 'İK', role: 'Operasyon' },
        title: '📢 Ofis Yenileme Çalışmaları',
        content: 'Merkez ofis A Blok 3. katta yapılacak tadilat nedeniyle, 25-27 Ekim tarihleri arasında bu kat kullanıma kapalı olacaktır. İlgili ekipler B Blok toplantı odalarını kullanabilirler.',
        timestamp: '2 saat önce',
        likes: 24,
        comments: 5,
        likedByMe: false,
        isPinned: false,
        tags: ['Ofis', 'Duyuru']
    },
    {
        id: 'post_3',
        type: 'KUDOS',
        status: 'PUBLISHED',
        author: { name: 'Ali Göksoy', avatar: 'AG', role: 'IT Specialist' },
        content: 'SAP entegrasyon projesindeki üstün gayreti, sabrı ve çözüm odaklı yaklaşımı için tebrikler! Projeyi zamanından önce tamamlamamızı sağladı. 🚀',
        kudosTo: 'Zeynep Yılmaz',
        timestamp: 'Dün, 14:30',
        likes: 56,
        comments: 8,
        likedByMe: false,
    },
    {
        id: 'post_2',
        type: 'POLL',
        status: 'PUBLISHED',
        author: { name: 'Etkinlik Komitesi', avatar: 'EK', role: 'Sosyal Kulüp' },
        content: 'Yıl sonu etkinliği için tercihiniz nedir? Lütfen oylayalım! 🎄',
        timestamp: '4 saat önce',
        likes: 12,
        comments: 18,
        likedByMe: true,
        pollOptions: [
            { id: 'opt1', text: 'Tekne Turu 🚢', votes: 45, votedByMe: false },
            { id: 'opt2', text: 'Otelde Gala Yemeği 🍽️', votes: 32, votedByMe: false },
            { id: 'opt3', text: 'Barbekü Partisi 🍖', votes: 15, votedByMe: false },
        ]
    },
    {
        id: 'post_4',
        type: 'DISCUSSION',
        status: 'PUBLISHED',
        author: { name: 'Mehmet Demir', avatar: 'MD', role: 'Network Admin' },
        content: 'Yeni VPN istemcisi (v5.2) hakkında geri bildirimleriniz neler? Bağlantı kopma sorunu yaşayan var mı?',
        timestamp: 'Dün, 09:15',
        likes: 8,
        comments: 14,
        likedByMe: false,
        tags: ['Teknoloji', 'Feedback']
    }
];

const mockPendingCirculars: ConnectPost[] = [
    {
        id: 'draft_1',
        type: 'CIRCULAR',
        status: 'PENDING',
        author: { name: 'Hukuk Departmanı', avatar: 'HD', role: 'Hukuk Müşavirliği' },
        title: 'Tamim Taslağı: KVKK Aydınlatma Metni Güncellemesi',
        content: 'Şirket içi veri işleme politikalarımızda yapılan değişiklikler sebebiyle KVKK metni güncellenmiştir. Tüm personelin ekteki metni okuyup onaylaması gerekmektedir.',
        timestamp: 'Bekliyor',
        likes: 0,
        comments: 0,
        likedByMe: false,
        isPinned: false
    }
];

const Connect: React.FC = () => {
    const { addToast } = useToast();
    const [posts, setPosts] = useState<ConnectPost[]>(initialPosts);
    const [pendingPosts, setPendingPosts] = useState<ConnectPost[]>(mockPendingCirculars);
    const [activeTab, setActiveTab] = useState<'ALL' | 'ANNOUNCEMENTS' | 'CIRCULARS' | 'TEAM'>('ALL');
    const [newPostContent, setNewPostContent] = useState('');
    
    // Manager Mode State
    const [isManagerMode, setIsManagerMode] = useState(false);
    const [draftTitle, setDraftTitle] = useState('');
    const [draftContent, setDraftContent] = useState('');
    const [draftDept, setDraftDept] = useState('İK');

    // --- ACTIONS ---

    const handleLike = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
                    likedByMe: !post.likedByMe
                };
            }
            return post;
        }));
    };

    const handleVote = (postId: string, optionId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId && post.pollOptions) {
                const hasVoted = post.pollOptions.some(opt => opt.votedByMe);
                if (hasVoted) return post; 

                return {
                    ...post,
                    pollOptions: post.pollOptions.map(opt => ({
                        ...opt,
                        votes: opt.id === optionId ? opt.votes + 1 : opt.votes,
                        votedByMe: opt.id === optionId
                    }))
                };
            }
            return post;
        }));
        addToast('Oyunuz kaydedildi!', 'success');
    };

    const handlePostSubmit = () => {
        if (!newPostContent.trim()) return;
        
        const newPost: ConnectPost = {
            id: `post_${Date.now()}`,
            type: 'DISCUSSION',
            status: 'PUBLISHED',
            author: { name: 'Süper Admin', avatar: 'SA', role: 'Yönetici' },
            content: newPostContent,
            timestamp: 'Şimdi',
            likes: 0,
            comments: 0,
            likedByMe: false
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
        addToast('Gönderiniz paylaşıldı.', 'success');
    };

    // --- MANAGER ACTIONS ---

    const handleSubmitDraft = () => {
        if (!draftTitle || !draftContent) {
            addToast('Lütfen başlık ve içerik giriniz.', 'error');
            return;
        }

        const newDraft: ConnectPost = {
            id: `draft_${Date.now()}`,
            type: 'CIRCULAR',
            status: 'PENDING',
            author: { 
                name: draftDept === 'İK' ? 'İnsan Kaynakları' : draftDept === 'IT' ? 'Bilgi Teknolojileri' : 'Genel Müdürlük',
                avatar: draftDept,
                role: draftDept === 'GM' ? 'Yönetim Kurulu' : 'Operasyon'
            },
            title: draftTitle,
            content: draftContent,
            timestamp: 'Onay Bekliyor',
            likes: 0,
            comments: 0,
            likedByMe: false
        };

        setPendingPosts([...pendingPosts, newDraft]);
        setDraftTitle('');
        setDraftContent('');
        addToast('Tamim taslağı onaya gönderildi.', 'success');
    };

    const handleApprove = (post: ConnectPost) => {
        const publishedPost: ConnectPost = {
            ...post,
            status: 'PUBLISHED',
            timestamp: 'Az Önce',
            isPinned: true // Official circulars are pinned by default upon publish
        };

        setPosts([publishedPost, ...posts]);
        setPendingPosts(prev => prev.filter(p => p.id !== post.id));
        addToast('Tamim resmi olarak yayınlandı ve herkese duyuruldu.', 'success');
    };

    const handleReject = (postId: string) => {
        setPendingPosts(prev => prev.filter(p => p.id !== postId));
        addToast('Taslak reddedildi ve arşivlendi.', 'info');
    };

    // --- RENDER HELPERS ---

    // The "Hero" Post (Pinned)
    const renderHeroPost = (post: ConnectPost) => {
        return (
            <div key={post.id} className="relative w-full bg-gradient-to-r from-rose-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl mb-10 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                
                {/* Official Ribbon for Hero */}
                {post.type === 'CIRCULAR' && (
                    <div className="absolute top-0 left-0 w-full bg-rose-950/80 backdrop-blur-md border-b border-rose-800/50 py-2 px-10 flex items-center gap-3 z-20">
                        <span className="material-symbols-outlined text-[18px] text-rose-200">gavel</span>
                        <span className="text-[11px] font-serif font-black text-rose-50 tracking-[0.25em] uppercase drop-shadow-sm">Resmi Kurumsal Tamim</span>
                    </div>
                )}

                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start mt-4">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-rose-900/50 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">push_pin</span>
                                Vitrin
                            </span>
                            <span className="text-rose-200/80 text-xs font-medium uppercase tracking-widest border-l border-rose-200/20 pl-3">
                                {post.type === 'CIRCULAR' ? 'Yönetim Kurulu Kararı' : 'Önemli Duyuru'}
                            </span>
                        </div>
                        
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight font-serif tracking-tight">
                            {post.title}
                        </h2>
                        
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3 font-serif">
                            {post.content}
                        </p>

                        <div className="pt-4 flex items-center gap-4">
                            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors shadow-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                Detayları İncele
                            </button>
                            {post.type === 'CIRCULAR' && (
                                <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors flex items-center gap-2 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    PDF İndir
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 min-w-[180px]">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3 ring-4 ring-white/10">
                            {post.author.avatar}
                        </div>
                        <span className="text-white font-bold text-sm text-center font-serif">{post.author.name}</span>
                        <span className="text-rose-200/60 text-xs text-center mt-1 uppercase tracking-wide">{post.author.role}</span>
                        <span className="text-white/40 text-[10px] mt-4 font-mono">{post.timestamp}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderPost = (post: ConnectPost) => {
        const isAnnouncement = post.type === 'ANNOUNCEMENT';
        const isKudos = post.type === 'KUDOS';
        const isCircular = post.type === 'CIRCULAR';
        
        // Dynamic Card Styles
        let cardStyle = "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700";
        let headerIcon = "";
        let headerColor = "";

        if (isCircular) {
            // Updated style for Circulars: Rose Theme Colors (bg-rose-50)
            cardStyle = "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 shadow-xl shadow-rose-900/10 ring-1 ring-rose-200 dark:ring-rose-900";
            headerIcon = "policy";
            headerColor = "text-rose-800 dark:text-rose-200";
        } else if (isAnnouncement) {
            cardStyle = "bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900/50";
            headerIcon = "campaign";
            headerColor = "text-blue-600 dark:text-blue-400";
        } else if (isKudos) {
            cardStyle = "bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 border-purple-100 dark:border-purple-800";
            headerIcon = "celebration";
            headerColor = "text-purple-600 dark:text-purple-400";
        }

        return (
            <div key={post.id} className={`rounded-3xl border mb-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 relative overflow-hidden group ${cardStyle}`}>
                
                {/* OFFICIAL HEADER STRIP FOR CIRCULARS */}
                {isCircular && (
                    <div className="bg-rose-900 text-white px-5 py-3 flex items-center justify-between shadow-md relative z-20 border-b border-rose-800">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[20px] text-white">gavel</span>
                            <span className="text-xs font-serif font-black tracking-[0.25em] uppercase text-white drop-shadow-sm">Resmi Kurumsal Tamim</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-90">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            <span className="text-[9px] font-mono tracking-wide text-rose-100">CONFIDENTIAL</span>
                        </div>
                    </div>
                )}

                <div className="p-6 relative">
                    {/* Decorative Background Elements */}
                    {isKudos && <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>}
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white dark:ring-slate-700 ${
                                isCircular ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-100' :
                                isAnnouncement ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                                isKudos ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' :
                                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                                {post.author.avatar}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold flex items-center gap-2 ${isCircular ? 'text-rose-950 dark:text-rose-100 font-serif' : 'text-slate-900 dark:text-slate-100'}`}>
                                    {post.author.name}
                                    {isCircular && <span className="material-symbols-outlined text-[16px] text-rose-600" title="Resmi Makam">stars</span>}
                                </span>
                                <span className={`text-xs ${isCircular ? 'text-rose-800/70 dark:text-rose-200/70' : 'text-slate-500'}`}>{post.author.role} • {post.timestamp}</span>
                            </div>
                        </div>
                        {/* Post Type Badge */}
                        <div className="flex items-center gap-1">
                            {!isCircular && headerIcon && <span className={`material-symbols-outlined text-[20px] ${headerColor}`}>{headerIcon}</span>}
                            {post.isPinned && <span className="material-symbols-outlined text-[18px] text-slate-400 rotate-45">push_pin</span>}
                        </div>
                    </div>

                    {/* Content */}
                    <div className={`mb-5 relative z-10`}>
                        {post.title && (
                            <h3 className={`text-lg font-bold mb-3 leading-snug ${isCircular ? 'font-serif text-rose-950 dark:text-rose-50 text-xl tracking-tight' : 'text-slate-800 dark:text-slate-200'}`}>
                                {post.title}
                            </h3>
                        )}
                        
                        {isKudos && post.kudosTo && (
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/60 dark:bg-white/5 rounded-full border border-purple-100 dark:border-purple-800/50 shadow-sm backdrop-blur-sm">
                                <span className="text-xs text-purple-600 dark:text-purple-300 font-bold uppercase tracking-wider">Kime:</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-purple-600 text-[10px] flex items-center justify-center font-bold text-white">ZY</div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{post.kudosTo}</span>
                                </div>
                            </div>
                        )}

                        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isCircular ? 'text-slate-900 dark:text-slate-100 font-serif pl-4 border-l-4 border-rose-800/30 dark:border-rose-500/30 text-justify' : 'text-slate-600 dark:text-slate-300'}`}>
                            {post.content}
                        </p>
                        
                        {isCircular && (
                            <div className="mt-5 p-3 bg-white/60 dark:bg-black/20 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center justify-between group/file cursor-pointer hover:bg-white dark:hover:bg-black/40 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/50 rounded-lg flex items-center justify-center text-rose-700 dark:text-rose-200 shadow-sm border border-rose-200 dark:border-rose-800">
                                        <span className="material-symbols-outlined text-[18px]">description</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-rose-900 dark:text-rose-100">Kıyafet_Yonetmeligi_v2.pdf</p>
                                        <p className="text-[10px] text-rose-800/70 dark:text-rose-300/70">1.2 MB • PDF Belgesi</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-rose-500 group-hover/file:text-rose-700 transition-colors">download</span>
                            </div>
                        )}
                    </div>

                    {/* POLL RENDER */}
                    {post.type === 'POLL' && post.pollOptions && (
                        <div className="space-y-3 mb-6 bg-slate-50/80 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 relative z-10">
                            {post.pollOptions.map(opt => {
                                const totalVotes = post.pollOptions!.reduce((acc, curr) => acc + curr.votes, 0);
                                const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                                
                                return (
                                    <div key={opt.id} onClick={() => handleVote(post.id, opt.id)} className="relative group/poll cursor-pointer">
                                        {/* Track */}
                                        <div className="h-10 w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden relative shadow-sm transition-all group-hover/poll:border-primary/50">
                                            {/* Bar */}
                                            <div 
                                                className={`h-full transition-all duration-700 ease-out flex items-center px-3 ${opt.votedByMe ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-700'}`} 
                                                style={{ width: `${percentage}%` }}
                                            >
                                            </div>
                                            {/* Content Layer */}
                                            <div className="absolute inset-0 flex items-center justify-between px-4">
                                                <span className={`text-sm font-medium transition-colors ${opt.votedByMe ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {opt.text}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {opt.votedByMe && <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>}
                                                    <span className="text-xs font-bold text-slate-500">{percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="text-right text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
                                {post.pollOptions.reduce((acc, curr) => acc + curr.votes, 0)} Oy Kullanıldı
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className={`flex items-center justify-between pt-4 border-t relative z-10 ${isCircular ? 'border-rose-200/50 dark:border-rose-900/50' : 'border-slate-100 dark:border-slate-700/50'}`}>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                    post.likedByMe 
                                    ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' 
                                    : isCircular ? 'text-rose-800/60 dark:text-rose-200/60 hover:bg-rose-100 dark:hover:bg-rose-900/30' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${post.likedByMe ? 'fill-current' : ''}`}>thumb_up</span>
                                <span>{post.likes}</span>
                            </button>
                            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isCircular ? 'text-rose-800/60 dark:text-rose-200/60 hover:bg-rose-100 dark:hover:bg-rose-900/30' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                <span className="material-symbols-outlined text-[20px]">comment</span>
                                <span>{post.comments}</span>
                            </button>
                        </div>
                        <div className="flex gap-1">
                            <button className={`p-2 rounded-full transition-colors ${isCircular ? 'text-rose-400 hover:text-rose-700 hover:bg-rose-100' : 'text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                            </button>
                            <button className={`p-2 rounded-full transition-colors ${isCircular ? 'text-rose-400 hover:text-rose-700 hover:bg-rose-100' : 'text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                <span className="material-symbols-outlined text-[20px]">share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- MANAGER VIEW RENDER ---
    const renderManagerView = () => (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Column 1: Create Draft */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">edit_document</span>
                        Tamim Taslağı Oluştur
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Yayınlayan Birim</label>
                            <select 
                                value={draftDept} 
                                onChange={(e) => setDraftDept(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:border-primary outline-none"
                            >
                                <option value="GM">Genel Müdürlük</option>
                                <option value="İK">İnsan Kaynakları</option>
                                <option value="IT">Bilgi Teknolojileri</option>
                                <option value="HD">Hukuk Departmanı</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tamim Başlığı</label>
                            <input 
                                type="text"
                                value={draftTitle}
                                onChange={(e) => setDraftTitle(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:border-primary outline-none"
                                placeholder="Örn: Tamim No: 2023/15..." 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">İçerik Detayı</label>
                            <textarea 
                                value={draftContent}
                                onChange={(e) => setDraftContent(e.target.value)}
                                rows={6}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:border-primary outline-none resize-none"
                                placeholder="Tamim metnini buraya giriniz..." 
                            />
                        </div>
                        <div className="pt-2">
                            <button 
                                onClick={handleSubmitDraft}
                                className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                            >
                                Onay Havuzuna Gönder
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 2: Approval Queue */}
            <div className="col-span-12 lg:col-span-8">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">pending_actions</span>
                    Onay Bekleyenler ({pendingPosts.length})
                </h2>
                
                {pendingPosts.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                        <p className="text-sm font-medium">Onay bekleyen taslak bulunmamaktadır.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingPosts.map(post => (
                            <div key={post.id} className="relative group">
                                {/* Preview the actual card to show manager exactly how it looks */}
                                <div className="opacity-80 hover:opacity-100 transition-opacity">
                                    {renderPost({ ...post, type: 'CIRCULAR' })} 
                                </div>
                                
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/40 backdrop-blur-[1px] rounded-3xl flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all z-30">
                                    <button 
                                        onClick={() => handleReject(post.id)}
                                        className="px-6 py-3 bg-white text-rose-600 font-bold rounded-xl shadow-lg hover:bg-rose-50 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                        Reddet
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(post)}
                                        className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">publish</span>
                                        Resmi Olarak Yayınla
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // --- FILTER LOGIC ---
    const filteredPosts = posts.filter(p => {
        if (p.isPinned) return false; // Pinned posts are handled separately in Hero section
        
        if (activeTab === 'ALL') return true;
        if (activeTab === 'ANNOUNCEMENTS') return p.type === 'ANNOUNCEMENT';
        if (activeTab === 'CIRCULARS') return p.type === 'CIRCULAR';
        if (activeTab === 'TEAM') return p.type !== 'ANNOUNCEMENT' && p.type !== 'CIRCULAR';
        return true;
    });

    const pinnedPost = posts.find(p => p.isPinned);

    // --- MAIN RENDER ---
    return (
        <div className="h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] animate-in fade-in zoom-in-95 duration-300 font-sans">
            
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-5 shrink-0 sticky top-0 z-30 transition-all">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-rose-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                <span className="material-symbols-outlined text-2xl">hub</span>
                            </div>
                            İletişim ve Duyurular
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Manager Toggle */}
                        <button 
                            onClick={() => setIsManagerMode(!isManagerMode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                isManagerMode 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{isManagerMode ? 'visibility' : 'admin_panel_settings'}</span>
                            {isManagerMode ? 'Yayın Akışını Gör' : 'Yönetim Paneli'}
                        </button>

                        {/* Modern Tabs (Hide in Manager Mode) */}
                        {!isManagerMode && (
                            <div className="hidden md:flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                {[
                                    { id: 'ALL', label: 'Akış', icon: 'dynamic_feed' },
                                    { id: 'ANNOUNCEMENTS', label: 'Duyurular', icon: 'campaign' },
                                    { id: 'CIRCULARS', label: 'Tamimler', icon: 'policy' },
                                    { id: 'TEAM', label: 'Ekip', icon: 'groups' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                                            activeTab === tab.id 
                                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-[16px] ${activeTab === tab.id ? 'text-primary' : ''}`}>{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden w-full">
                
                {isManagerMode ? (
                    <div className="flex-1 overflow-y-auto">
                        {renderManagerView()}
                    </div>
                ) : (
                    <>
                        {/* Left Sidebar (Filters/Channels) */}
                        <div className="w-64 py-6 pl-6 hidden lg:block overflow-y-auto shrink-0 border-r border-slate-200/50 dark:border-slate-800/50">
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Kanallar</h3>
                                <ul className="space-y-2">
                                    {['Genel', 'IT Duyuruları', 'Sosyal Kulüp', 'İkinci El Pazarı', 'Yemek Menüsü'].map((channel, i) => (
                                        <li key={i}>
                                            <button className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all group ${
                                                i === 0 ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                            }`}>
                                                <span className={`text-lg ${i===0 ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>#</span> 
                                                {channel}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-b from-indigo-500 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/20 mr-4">
                                <h3 className="font-bold text-lg mb-1">Fikrin mi var?</h3>
                                <p className="text-xs text-indigo-100 mb-4 opacity-90">Şirket kültürüne katkıda bulunacak bir önerin varsa paylaş.</p>
                                <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-bold border border-white/20 transition-colors">
                                    Öneri Kutusu
                                </button>
                            </div>
                        </div>

                        {/* Main Feed */}
                        <div className="flex-1 overflow-y-auto p-4 md:py-8 md:px-8 no-scrollbar max-w-5xl mx-auto w-full">
                            
                            {/* Hero Section (Pinned) - Show on ALL tab OR if filtering Circulars and the pinned post IS a circular */}
                            {((activeTab === 'ALL') || (activeTab === 'CIRCULARS' && pinnedPost?.type === 'CIRCULAR')) && pinnedPost && renderHeroPost(pinnedPost)}

                            {/* Compose Box */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-1 mb-10 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                <div className="flex items-center gap-3 p-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">SA</div>
                                    <input 
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        placeholder="Ekiple bir şeyler paylaş..." 
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 h-10"
                                    />
                                </div>
                                {newPostContent && (
                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-[20px] animate-in slide-in-from-top-2">
                                        <div className="flex gap-1">
                                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors" title="Resim Ekle">
                                                <span className="material-symbols-outlined text-[20px]">image</span>
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors" title="Dosya Ekle">
                                                <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors" title="Anket">
                                                <span className="material-symbols-outlined text-[20px]">poll</span>
                                            </button>
                                        </div>
                                        <button 
                                            onClick={handlePostSubmit}
                                            className="px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
                                        >
                                            Paylaş
                                            <span className="material-symbols-outlined text-[16px]">send</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Posts Feed */}
                            <div className="space-y-4">
                                {filteredPosts.map(renderPost)}
                                
                                {filteredPosts.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">filter_list_off</span>
                                        </div>
                                        <p className="text-slate-500 font-medium">Bu kategoride henüz bir paylaşım yok.</p>
                                    </div>
                                )}
                                
                                {filteredPosts.length > 0 && (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-400">
                                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                                            Hepsini gördünüz!
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar (Widgets) */}
                        <div className="w-80 py-6 pr-6 hidden xl:flex flex-col gap-6 overflow-y-auto shrink-0 border-l border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30">
                            
                            {/* Events Widget - Premium Card Style */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-rose-500/20 transition-colors"></div>
                                
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 relative z-10">
                                    <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
                                        <span className="material-symbols-outlined text-[18px]">event</span>
                                    </span>
                                    Yaklaşan Etkinlikler
                                </h3>
                                
                                <div className="space-y-6 relative z-10">
                                    {[
                                        { title: 'Cadılar Bayramı', time: '17:00 • Teras Kat', day: '27', month: 'EKİM', color: 'text-orange-500', bg: 'bg-orange-50' },
                                        { title: 'Q4 Hedef Toplantısı', time: '09:00 • Konferans', day: '02', month: 'KASIM', color: 'text-blue-500', bg: 'bg-blue-50' }
                                    ].map((evt, i) => (
                                        <div key={i} className="flex gap-4 items-center group/item cursor-pointer">
                                            <div className={`w-12 h-14 ${evt.bg} dark:bg-slate-700/50 rounded-2xl flex flex-col items-center justify-center border border-transparent group-hover/item:border-slate-200 transition-all shadow-sm`}>
                                                <span className={`text-[10px] font-bold ${evt.color}`}>{evt.month}</span>
                                                <span className="text-lg font-black text-slate-700 dark:text-slate-200">{evt.day}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover/item:text-primary transition-colors">{evt.title}</h4>
                                                <p className="text-xs text-slate-400 mt-0.5">{evt.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <button className="w-full mt-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                    Tüm Takvimi Gör
                                </button>
                            </div>

                            {/* Birthdays Widget - Premium Card Style */}
                            <div className="bg-gradient-to-br from-amber-100 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-700 p-6 relative overflow-hidden">
                                <div className="absolute -bottom-4 -right-4 text-9xl text-amber-500/10 rotate-12">
                                    <span className="material-symbols-outlined">cake</span>
                                </div>

                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500 text-[20px]">cake</span>
                                    Bugün Doğanlar
                                </h3>
                                
                                <div className="flex -space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shadow-sm z-30" title="Ahmet Yılmaz">AY</div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shadow-sm z-20" title="Selin Kara">SK</div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold text-xs shadow-sm z-10 hover:bg-slate-50 transition-colors cursor-pointer">
                                        +2
                                    </div>
                                </div>
                                
                                <button className="relative z-10 w-full py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm text-amber-700 dark:text-amber-400 text-xs font-bold rounded-xl border border-white/50 dark:border-white/5 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm">
                                    Tebrik Gönder 🎉
                                </button>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Hızlı Erişim</h4>
                                <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/30 hover:shadow-md transition-all group">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block group-hover:text-primary">Yemek Listesi</span>
                                        <span className="text-[10px] text-slate-400">Bugün: Izgara Köfte</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/30 hover:shadow-md transition-all group">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block group-hover:text-primary">Servis Güzergahları</span>
                                        <span className="text-[10px] text-slate-400">Canlı Takip</span>
                                    </div>
                                </button>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Connect;