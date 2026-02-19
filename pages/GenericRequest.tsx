import React, { useState, useEffect } from 'react';
import { ViewState, ServiceCategory, FormType, KnowledgeArticle } from '../types';
import { useToast } from '../context/ToastContext';

interface GenericRequestProps {
  category: ServiceCategory | null;
  onBack: () => void;
}

// Mock Agents for @Mentions
const mockAgents = [
    { id: 'ag', name: 'Ali Göksoy', username: '@Ali' },
    { id: 'zy', name: 'Zeynep Yılmaz', username: '@Zeynep' },
    { id: 'ce', name: 'Caner Erkin', username: '@Caner' },
    { id: 'hd', name: 'Hukuk Danışma', username: '@Hukuk' },
];

// --- MOCK KNOWLEDGE BASE DATA ---
const mockArticles: KnowledgeArticle[] = [
  {
    id: 'kb_vpn_01',
    title: 'VPN Bağlantı Sorunları ve Çözümleri',
    excerpt: 'Error 800, sertifika hataları ve bağlantı kopmaları için çözüm adımları.',
    tags: ['vpn', 'bağlantı', 'network', 'erişim'],
    likes: 124,
    views: 1540,
    content: `
      <h3 class="font-bold text-lg mb-2">VPN Bağlanmıyor mu?</h3>
      <p class="mb-4">Eğer GlobalProtect veya Cisco AnyConnect kullanırken bağlantı hatası alıyorsanız, lütfen aşağıdaki adımları sırasıyla deneyin:</p>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>İnternet bağlantınızı kontrol edin (Wi-Fi kapatıp açın).</li>
        <li>VPN istemcisinde "Refresh Connection" butonuna tıklayın.</li>
        <li>Bilgisayarınızı yeniden başlatın (özellikle son güncellemeden sonra).</li>
      </ul>
      <h4 class="font-bold text-md mb-2">Sertifika Hatası</h4>
      <p>Eğer "Certificate Invalid" hatası alıyorsanız, sertifikanızın süresi dolmuş olabilir. Bu durumda otomatik yenileme için ofis ağına bir kez fiziksel olarak bağlanmanız gerekebilir.</p>
    `
  },
  {
    id: 'kb_outlook_01',
    title: 'Outlook E-posta Kurulumu',
    excerpt: 'Mobil cihazlarda ve yeni bilgisayarlarda kurumsal e-posta kurulum rehberi.',
    tags: ['outlook', 'mail', 'eposta', 'kurulum'],
    likes: 85,
    views: 920,
    content: `
      <p class="mb-4">Yeni cihazınızda Outlook kurulumu için:</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Outlook uygulamasını mağazadan indirin.</li>
        <li>Şirket e-posta adresinizi (ad.soyad@company.com) girin.</li>
        <li>SSO ekranında Windows şifrenizi kullanın.</li>
        <li>MFA (Authenticator) onayı verin.</li>
      </ol>
    `
  },
  {
    id: 'kb_pass_01',
    title: 'Şifre Sıfırlama ve Hesap Kilidi',
    excerpt: 'Kilitlenen hesabınızı self-servis portal üzerinden nasıl açarsınız?',
    tags: ['şifre', 'password', 'kilit', 'hesap', 'erişim'],
    likes: 210,
    views: 3400,
    content: `
       <p>Güvenlik nedeniyle 3 hatalı denemede hesabınız 15 dakika kilitlenir. Beklemek istemiyorsanız:</p>
       <p class="mt-2"><a href="#" class="text-blue-500 underline">password.company.com</a> adresine gidin ve "Unlock Account" seçeneğini kullanın.</p>
    `
  },
  {
    id: 'kb_printer_01',
    title: 'Yazıcı Ekleme',
    excerpt: 'Katınızdaki en yakın yazıcıyı bulma ve sürücü yükleme.',
    tags: ['yazıcı', 'printer', 'çıktı', 'donanım'],
    likes: 45,
    views: 300,
    content: `
      <p>Windows arama çubuğuna <strong>\\\\print-server</strong> yazın ve Enter'a basın. Açılan listeden kat numaranıza uygun yazıcıya çift tıklayarak kurulumu tamamlayın.</p>
    `
  }
];

const GenericRequest: React.FC<GenericRequestProps> = ({ category, onBack }) => {
  const [priority, setPriority] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);
  
  const [suggestedArticles, setSuggestedArticles] = useState<KnowledgeArticle[]>([]);
  const [viewingArticle, setViewingArticle] = useState<KnowledgeArticle | null>(null);
  
  const { addToast } = useToast();

  // Smart Search Logic
  useEffect(() => {
    if (subject.length < 3) {
      // Show popular articles if search is empty/short
      setSuggestedArticles(mockArticles.slice(0, 2)); 
      return;
    }

    const lowerQuery = subject.toLowerCase();
    const results = mockArticles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.tags.some(tag => tag.includes(lowerQuery))
    );
    setSuggestedArticles(results);
  }, [subject]);

  // Handle Input Change for Description (Mentions)
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setDescription(val);
      
      // Simple check to show mention list if the last char is '@'
      if (val.endsWith('@')) {
          setShowMentionList(true);
      } else if (!val.includes('@')) {
          setShowMentionList(false);
      }
  };

  const insertMention = (username: string) => {
      setDescription(prev => prev + username.substring(1) + ' '); 
      setShowMentionList(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
        addToast(`${category?.title} talebiniz başarıyla oluşturuldu.`, 'success');
        onBack();
    }, 500);
  };

  const handleArticleHelpful = () => {
    addToast('Geri bildiriminiz için teşekkürler! Sorununuzun çözüldüğüne sevindik.', 'success');
    setViewingArticle(null);
    onBack(); // Redirect back since problem is solved (Ticket Deflection)
  };

  if (!category) return null;

  // --- Dynamic Form Section Components ---

  const renderHardwareFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cihaz Türü</label>
            <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-slate-600 dark:text-slate-300">
                <option>Laptop</option>
                <option>Masaüstü PC</option>
                <option>Monitör</option>
                <option>Telefon / Tablet</option>
                <option>Diğer</option>
            </select>
         </div>
         <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Seri Numarası (Varsa)</label>
            <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none placeholder:text-slate-400" placeholder="Örn: SN-12345678" />
         </div>
      </div>
      <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Teslimat Adresi / Lokasyon</label>
         <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" placeholder="Örn: 3. Kat, B Blok, Masa 42" />
      </div>
    </>
  );

  const renderSoftwareFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Yazılım Adı</label>
           <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" placeholder="Örn: Adobe Photoshop" />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Versiyon / Sürüm</label>
           <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" placeholder="Örn: 2024 CC" />
        </div>
        <div className="space-y-2 md:col-span-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lisans Türü</label>
           <div className="flex gap-4">
               <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                   <input type="radio" name="license" className="text-primary focus:ring-primary" defaultChecked />
                   Yeni Lisans Talebi
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                   <input type="radio" name="license" className="text-primary focus:ring-primary" />
                   Mevcut Lisans Yenileme
               </label>
           </div>
        </div>
    </div>
  );

  const renderAccessFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Erişim İstenen Sistem</label>
           <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" placeholder="Örn: SAP, CRM, Jira" />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kullanıcı Hesabı (E-posta)</label>
           <input type="email" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" placeholder="isim.soyisim@sirket.com" />
        </div>
        <div className="space-y-2 md:col-span-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Talep Türü</label>
           <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-slate-600 dark:text-slate-300">
               <option>Yeni Hesap Oluşturma</option>
               <option>Şifre Sıfırlama</option>
               <option>Yetki Artırımı</option>
               <option>Hesap Kapatma</option>
           </select>
        </div>
    </div>
  );

  const renderDateRangeFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Başlangıç Tarihi</label>
           <input type="date" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-slate-600 dark:text-slate-300" />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bitiş Tarihi</label>
           <input type="date" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-slate-600 dark:text-slate-300" />
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg md:col-span-2 flex items-start gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg mt-0.5">info</span>
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
               Seçtiğiniz tarihler arasındaki iş günleri hesaplanarak onay sürecine dahil edilecektir. Resmi tatiller otomatik olarak düşülür.
            </p>
        </div>
    </div>
  );

  const renderFinanceFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Proje / Masraf Merkezi Kodu</label>
           <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" placeholder="Örn: PRJ-2023-001" />
        </div>
         <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tahmini Tutar</label>
           <div className="relative">
               <span className="absolute left-3 top-2 text-slate-500 font-bold text-sm">₺</span>
               <input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm focus:border-primary outline-none" placeholder="0.00" />
           </div>
        </div>
        <div className="space-y-2 md:col-span-3">
             <label className="text-sm font-medium text-slate-700 dark:text-slate-300">IBAN (Gerekirse)</label>
             <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none font-mono" placeholder="TR00 0000 0000 0000 0000 00" />
        </div>
    </div>
  );

  const renderSecurityFields = () => (
      <div className="space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 rounded-lg flex items-start gap-2">
            <span className="material-symbols-outlined text-rose-600 dark:text-rose-400 text-lg mt-0.5">warning</span>
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
               Bu form üzerinden bildireceğiniz güvenlik ihlalleri en yüksek öncelikle işleme alınacaktır. Lütfen hassas verileri (şifre vb.) buraya yazmayınız.
            </p>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Olayın Gerçekleştiği Zaman</label>
             <input type="datetime-local" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-slate-600 dark:text-slate-300" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Etkilenen Varlıklar</label>
             <input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" placeholder="E-posta hesabı, Sunucu, Dosya Paylaşımı..." />
          </div>
      </div>
  );

  const renderDynamicFields = (type: FormType) => {
      switch (type) {
          case 'HARDWARE': return renderHardwareFields();
          case 'SOFTWARE': return renderSoftwareFields();
          case 'ACCESS': return renderAccessFields();
          case 'DATE_RANGE': return renderDateRangeFields();
          case 'FINANCE': return renderFinanceFields();
          case 'SECURITY': return renderSecurityFields();
          case 'GENERAL': default: return null; // No extra fields for general
      }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <button onClick={onBack} className="hover:text-primary flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Geri Dön
        </button>
        <span className="text-slate-300">|</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">Yeni Talep</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Header with Icon */}
            <div className="flex items-start gap-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm">
                    <span className="material-symbols-outlined text-4xl">{category.icon}</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">{category.title} Talebi</h1>
                    <p className="text-slate-500 text-lg">{category.description}</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Form Header */}
                <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Talep Detayları</span>
                    <span className="text-xs font-medium text-slate-400">ID: OTO-OLUŞTURULACAK</span>
                </div>

                <form className="p-8 space-y-8" onSubmit={handleSubmit}>
                    {/* Core Fields: Subject & Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Konu Başlığı</label>
                            <div className="relative">
                                <input 
                                    required
                                    type="text" 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Talebinizi özetleyen kısa bir başlık..."
                                />
                                {subject.length > 2 && (
                                    <div className="absolute right-3 top-3.5">
                                        <span className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Öncelik Seviyesi</label>
                            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                                {['Low', 'Medium', 'High'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                            priority === p 
                                            ? p === 'High' ? 'bg-rose-500 text-white shadow-md' : p === 'Medium' ? 'bg-amber-500 text-white shadow-md' : 'bg-emerald-500 text-white shadow-md'
                                            : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {p === 'Low' ? 'Düşük' : p === 'Medium' ? 'Orta' : 'Yüksek'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Core Field: Rich Text Description */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                            Açıklama
                            <span className="text-xs font-normal text-slate-400">Detayları buraya girin</span>
                        </label>
                        
                        {/* Mention List Popover */}
                        {showMentionList && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-bottom-2">
                                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase">
                                    Kişi Etiketle
                                </div>
                                {mockAgents.map(agent => (
                                    <button 
                                        key={agent.id}
                                        type="button"
                                        onClick={() => insertMention(agent.username)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 flex items-center justify-between group"
                                    >
                                        <span>{agent.name}</span>
                                        <span className="text-xs text-slate-400 group-hover:text-indigo-500">{agent.username}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Rich Editor Container */}
                        <div className="relative shadow-sm rounded-xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden bg-white dark:bg-slate-900 group">
                            <textarea 
                                required
                                value={description}
                                onChange={handleDescriptionChange}
                                className="w-full p-4 text-sm text-slate-700 dark:text-slate-200 min-h-[160px] max-h-[400px] resize-none outline-none block placeholder:text-slate-400 bg-transparent" 
                                placeholder="İhtiyacınızı veya sorunu detaylandırın... (@ ile kişi etiketleyebilirsiniz)"
                            />
                            
                            {/* Toolbar */}
                            <div className="px-2 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-0.5">
                                    <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="Kalın"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                    <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="İtalik"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                    <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="Liste"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                    <button 
                                        type="button"
                                        onClick={() => setDescription(prev => prev + '@')}
                                        className="p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 rounded transition-colors" 
                                        title="Etiketle (@)"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                                    </button>
                                    <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="Dosya Ekle"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                                </div>
                                <span className="text-[10px] text-slate-400 pr-2">MarkDown Desteklenir</span>
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC FIELDS BLOCK */}
                    {category.formType !== 'GENERAL' && (
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">tune</span>
                                {category.title} için Ek Bilgiler
                            </h3>
                            {renderDynamicFields(category.formType)}
                        </div>
                    )}

                    {/* Attachments */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Ek Dosyalar</label>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all text-slate-400">
                                <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Dosya yüklemek için tıklayın veya sürükleyin</p>
                            <p className="text-xs text-slate-500 mt-1">Ekran görüntüsü, hata logları veya ilgili belgeler (Maks 10MB)</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button type="button" onClick={onBack} className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                            İptal Et
                        </button>
                        <button type="submit" className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2 hover:translate-y-[-1px]">
                            Talebi Gönder
                            <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Right Column: Smart Knowledge Base (Sticky) */}
        <div className="lg:col-span-4 sticky top-6">
             <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10 flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm animate-pulse">
                        <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Akıllı Asistan</h3>
                        <p className="text-xs text-indigo-200">
                           {subject.length > 2 
                             ? `${suggestedArticles.length} alakalı makale bulundu`
                             : 'Siz yazdıkça öneriler sunacağım.'
                           }
                        </p>
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    {suggestedArticles.length > 0 ? (
                        suggestedArticles.map(article => (
                            <div 
                                key={article.id}
                                onClick={() => setViewingArticle(article)}
                                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors line-clamp-2">{article.title}</h4>
                                    <span className="material-symbols-outlined text-xs text-white/50 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                                <p className="text-xs text-indigo-100/70 line-clamp-2 mb-3">{article.excerpt}</p>
                                <div className="flex items-center gap-3 text-[10px] text-white/50">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">thumb_up</span> {article.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">visibility</span> {article.views}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-white/30">
                            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                            <p className="text-sm">İlgili sonuç bulunamadı.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <button className="text-xs font-bold text-indigo-300 hover:text-white transition-colors flex items-center justify-center gap-1 w-full">
                        Yardım Merkezine Git
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                </div>
             </div>
        </div>
      </div>

      {/* Article Preview Modal */}
      {viewingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingArticle(null)}></div>
              <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900">
                      <div>
                          <div className="flex gap-2 mb-2">
                              {viewingArticle.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase rounded">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{viewingArticle.title}</h2>
                      </div>
                      <button onClick={() => setViewingArticle(null)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto prose dark:prose-invert max-w-none">
                      {/* Render HTML Content Safely (Mock) */}
                      <div dangerouslySetInnerHTML={{ __html: viewingArticle.content }} />
                  </div>

                  <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                          Bu makale sorununuzu çözdü mü?
                      </div>
                      <div className="flex gap-3">
                          <button 
                              onClick={() => setViewingArticle(null)}
                              className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 rounded-lg transition-colors"
                          >
                              Hayır, Talep Açacağım
                          </button>
                          <button 
                              onClick={handleArticleHelpful}
                              className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                          >
                              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                              Evet, Çözüldü
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default GenericRequest;