import React, { useState, useRef, useEffect } from 'react';
import { Ticket, TicketStatus, TicketLog } from '../types';
import { useToast } from '../context/ToastContext';

interface TicketDetailProps {
  onBack: () => void;
}

// Mock Log Data for the demo
const initialLogs: TicketLog[] = [
  { id: '1', type: 'system', message: 'Talep oluşturuldu (E-posta kaynağından)', timestamp: '24 Ekim, 10:30', user: 'Sistem', avatar: 'SYS', isInternal: true },
  { id: '2', type: 'message', user: 'Selin Yılmaz', avatar: 'SY', message: 'VPN bağlantısı kurmaya çalıştığımda Error 800 hatası alıyorum. Satış ekibinin geneli bu sorunu yaşıyor.', timestamp: '24 Ekim, 10:35' },
  { id: '3', type: 'message', user: 'Ali Göksoy', avatar: 'AG', message: 'Merhaba Selin Hanım, durumu inceliyorum. @Zeynep bu konuda bir güncelleme var mıydı ağ tarafında?', timestamp: '24 Ekim, 10:40', isInternal: true },
];

const mockAgents = [
    { id: 'ag', name: 'Ali Göksoy', username: '@Ali' },
    { id: 'zy', name: 'Zeynep Yılmaz', username: '@Zeynep' },
    { id: 'ce', name: 'Caner Erkin', username: '@Caner' },
];

// Data for Redirect Modal
const redirectTargets = [
    { id: 'g_net', name: 'Ağ Yönetimi Ekibi', type: 'GROUP', icon: 'dns' },
    { id: 'g_sec', name: 'Bilgi Güvenliği', type: 'GROUP', icon: 'security' },
    { id: 'u_zy', name: 'Zeynep Yılmaz', type: 'USER', role: 'Network Lead', icon: 'person' },
    { id: 'u_ce', name: 'Caner Erkin', type: 'USER', role: 'Support Specialist', icon: 'person' },
    { id: 'u_md', name: 'Mehmet Demir', type: 'USER', role: 'System Admin', icon: 'person' },
];

interface WorkflowStep {
  id: number;
  label: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
}

const TicketDetail: React.FC<TicketDetailProps> = ({ onBack }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  
  // Mock Ticket State
  const [ticket, setTicket] = useState<Ticket>({
    id: 'INC-2024-899',
    subject: 'VPN Bağlantı Hatası - Satış Ekibi',
    description: 'Satış ekibi uzaktan bağlantı yapamıyor.',
    status: 'Open',
    priority: 'High',
    requester: 'Selin Yılmaz',
    department: 'IT',
    category: 'Network',
    createdDate: '2023-10-24T10:30:00',
    assignedTo: 'Ali Göksoy',
    logs: [] 
  });

  const [logs, setLogs] = useState<TicketLog[]>(initialLogs);
  const [replyText, setReplyText] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'MESSAGES' | 'HISTORY'>('MESSAGES');
  
  // New States
  const [inputMode, setInputMode] = useState<'PUBLIC' | 'INTERNAL'>('PUBLIC');
  const [showMentionList, setShowMentionList] = useState(false);
  
  // Modals
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [redirectSearch, setRedirectSearch] = useState('');
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TicketStatus>('Open');
  const [statusNote, setStatusNote] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (activeTab === 'MESSAGES') {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  // Handle Input Change for Mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setReplyText(val);
      
      if (val.endsWith('@')) {
          setShowMentionList(true);
      } else if (!val.includes('@')) {
          setShowMentionList(false);
      }
  };

  const insertMention = (username: string) => {
      setReplyText(prev => prev + username.substring(1) + ' '); 
      setShowMentionList(false);
  };

  // --- ACTIONS ---

  const handleAction = (action: 'ACCEPT' | 'APPROVE' | 'REDIRECT' | 'RESOLVE') => {
    const newLogId = (logs.length + 1).toString();
    const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});

    switch (action) {
      case 'ACCEPT':
        setTicket(prev => ({ ...prev, status: 'In Progress', assignedTo: 'Ali Göksoy' }));
        setLogs(prev => [...prev, { 
            id: newLogId, 
            type: 'system', 
            user: 'Ali Göksoy',
            avatar: 'AG',
            message: 'Talep Ali Göksoy tarafından üstlenildi.', 
            timestamp: time, 
            isInternal: true 
        }]);
        addToast('Talep başarıyla üzerinize atandı.', 'success');
        break;
      
      case 'APPROVE':
        setTicket(prev => ({ ...prev, status: 'In Progress' }));
        setLogs(prev => [...prev, { 
            id: newLogId, 
            type: 'approval', 
            user: 'Departman Yöneticisi',
            avatar: 'DY',
            message: 'Departman yöneticisi talebi onayladı.', 
            timestamp: time 
        }]);
        addToast('Talep onaylandı ve işleme alındı.', 'success');
        break;

      case 'REDIRECT':
        // Open Modal instead of direct action
        setIsRedirectModalOpen(true);
        break;

      case 'RESOLVE':
        setTicket(prev => ({ ...prev, status: 'Resolved' }));
        setLogs(prev => [...prev, { 
            id: newLogId, 
            type: 'system', 
            user: 'Ali Göksoy',
            avatar: 'AG',
            message: 'Talep başarıyla çözüldü olarak işaretlendi.', 
            timestamp: time 
        }]);
        addToast('Talep çözüldü olarak kapatıldı.', 'success');
        break;
    }
  };

  const handleConfirmRedirect = (target: any) => {
      const newLogId = (logs.length + 1).toString();
      const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
      
      // Update Ticket
      setTicket(prev => ({
          ...prev,
          assignedTo: target.type === 'USER' ? target.name : prev.assignedTo, // If group, assignedTo might become generic or empty
          status: 'Open' // Re-open or keep existing? Usually redirects might reset SLA or keep it active.
      }));

      // Add Log
      setLogs(prev => [...prev, {
          id: newLogId,
          type: 'system',
          user: 'Ali Göksoy',
          avatar: 'AG',
          message: `Talep "${target.name}" birimine/kişisine yönlendirildi.`,
          timestamp: time,
          isInternal: true
      }]);

      addToast(`Talep ${target.name} hedefine yönlendirildi.`, 'success');
      setIsRedirectModalOpen(false);
  };

  const handleStatusChangeSubmit = () => {
      if (targetStatus === ticket.status) {
          setIsStatusModalOpen(false);
          return;
      }

      const newLogId = (logs.length + 1).toString();
      const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
      const oldStatus = ticket.status;

      setTicket(prev => ({ ...prev, status: targetStatus }));
      
      setLogs(prev => [...prev, {
          id: newLogId,
          type: 'system',
          user: 'Ali Göksoy',
          avatar: 'AG',
          message: `Durum güncellendi: ${oldStatus} -> ${targetStatus}. ${statusNote ? `(${statusNote})` : ''}`,
          timestamp: time,
          isInternal: true
      }]);

      addToast(`Durum "${targetStatus}" olarak güncellendi.`, 'success');
      setIsStatusModalOpen(false);
      setStatusNote('');
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    
    const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});

    setLogs(prev => [...prev, {
      id: (prev.length + 1).toString(),
      type: 'message',
      user: 'Ali Göksoy', 
      avatar: 'AG',
      message: replyText,
      timestamp: time,
      isInternal: inputMode === 'INTERNAL'
    }]);
    
    setReplyText('');
    setInputMode('PUBLIC'); 
    addToast(inputMode === 'INTERNAL' ? 'İç not eklendi.' : 'Yanıt gönderildi.', 'success');
  };

  const handleAiAssist = () => {
    setIsAiGenerating(true);
    addToast('AI yanıt oluşturuyor...', 'info');
    setTimeout(() => {
        const aiResponse = `Merhaba Selin Hanım,\n\nBildirdiğiniz VPN bağlantı hatası (Error 800) teknik ekibimiz tarafından incelenmeye alınmıştır.\n\nBu hata genellikle güvenlik sertifikasının süresi dolduğunda ortaya çıkmaktadır. Sertifikanızı uzaktan yenilemek için gerekli işlemi başlattım. Lütfen 10 dakika içinde tekrar deneyip bilgi verebilir misiniz?\n\nSaygılarımla,\nAli`;
        setReplyText(aiResponse);
        setIsAiGenerating(false);
        setInputMode('PUBLIC');
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  // Helper to render text with @mentions
  const renderMessageContent = (text: string) => {
      const parts = text.split(/(@\w+)/g);
      return parts.map((part, index) => {
          if (part.startsWith('@')) {
              return <span key={index} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1 rounded font-semibold cursor-pointer hover:underline">{part}</span>;
          }
          return part;
      });
  };

  // Helper for Status Badge
  const getStatusBadge = (status: TicketStatus) => {
    const colors: any = {
      'Open': 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-purple-100 text-purple-700 border-purple-200',
      'Pending Approval': 'bg-amber-100 text-amber-700 border-amber-200',
      'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Closed': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[status] || colors['Closed']}`}>
        {status === 'Pending Approval' ? 'Onay Bekliyor' : status}
      </span>
    );
  };

  // --- WORKFLOW LOGIC ---
  const getWorkflowSteps = (): WorkflowStep[] => {
      const s = ticket.status;
      return [
          { 
              id: 1, 
              label: 'Talep Alındı', 
              icon: 'mark_email_read', 
              status: 'completed' 
          },
          { 
              id: 2, 
              label: 'L1 Kontrolü', 
              icon: 'support_agent', 
              status: s === 'Open' ? 'current' : 'completed' 
          },
          { 
              id: 3, 
              label: 'Uzman Çözümü', 
              icon: 'engineering', 
              status: s === 'Open' ? 'pending' : (s === 'In Progress' || s === 'Pending Approval') ? 'current' : 'completed' 
          },
          { 
              id: 4, 
              label: 'Tamamlandı', 
              icon: 'check_circle', 
              status: s === 'Resolved' || s === 'Closed' ? 'completed' : 'pending' 
          }
      ];
  };

  const workflowSteps = getWorkflowSteps();

  // --- TAB RENDERERS ---

  const renderMessages = () => (
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {logs.filter(log => log.type === 'message' || (log.type === 'system' && log.isInternal)).map((log, index) => {
            // Internal Notes Render
            const isMe = log.user === 'Ali Göksoy';
            
            if (log.type === 'system') {
               return (
                   <div key={index} className="flex justify-center my-2">
                       <span className="text-[10px] text-slate-400 italic bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">{log.message}</span>
                   </div>
               )
            }

            if (log.isInternal) {
                return (
                    <div key={index} className="flex flex-col gap-1 mx-8 group">
                            <div className="flex items-center gap-2 mb-1 pl-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">lock</span>
                                Sadece Personel
                            </span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{log.user}</span>
                            <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/50 p-4 rounded-xl shadow-sm text-sm text-slate-800 dark:text-slate-200 relative">
                                <div className="absolute top-0 right-0 border-t-[12px] border-r-[12px] border-t-amber-200 dark:border-t-amber-800 border-r-transparent opacity-50"></div>
                                {renderMessageContent(log.message)}
                            </div>
                    </div>
                );
            }

            // Public Messages
            return (
                <div key={index} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} group`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0 mt-1 ring-2 ring-white dark:ring-slate-700 ${isMe ? 'bg-primary' : 'bg-slate-400'}`}>
                        {log.avatar}
                    </div>
                    <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'items-end' : ''}`}>
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{log.user}</span>
                            <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{log.timestamp}</span>
                        </div>
                        <div className={`px-5 py-3 text-sm leading-relaxed shadow-sm ${
                            isMe 
                            ? 'bg-primary/5 border border-primary/10 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tr-none' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none'
                        }`}>
                            {renderMessageContent(log.message)}
                        </div>
                    </div>
                </div>
            );
        })}
        <div ref={logsEndRef} />
      </div>
  );

  const renderHistory = () => (
      <div className="flex-1 overflow-y-auto p-8">
          <div className="relative pl-6 border-l border-slate-200 dark:border-slate-700 space-y-8">
              {logs.map((log, index) => (
                  <div key={index} className="relative group">
                      <span className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ${
                          log.type === 'approval' ? 'bg-emerald-500 border-emerald-500' 
                          : log.type === 'system' ? 'bg-slate-400 border-slate-400'
                          : 'bg-blue-500 border-blue-500'
                      }`}>
                          {/* Inner dot */}
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      </span>
                      
                      <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{log.user || 'Sistem'}</span>
                                  {log.avatar && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium border border-slate-200 dark:border-slate-700">{log.avatar}</span>}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                          </div>
                          
                          <div className={`p-3 rounded-xl border text-sm ${
                              log.type === 'approval' 
                              ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100' 
                              : log.type === 'system'
                              ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}>
                              {log.message}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in slide-in-from-right-4 duration-300 relative">
      
      {/* 1. TOP HEADER - Actions & Meta */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-5 shrink-0 flex flex-col gap-4 z-20 shadow-sm">
        {/* Navigation & ID */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <span className="text-slate-400 text-sm font-mono border-l border-slate-200 dark:border-slate-700 pl-3">{ticket.id}</span>
                {getStatusBadge(ticket.status)}
                {ticket.priority === 'High' && (
                    <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-rose-200 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">priority_high</span> Yüksek Öncelik
                    </span>
                )}
            </div>
            
            {/* ACTION BUTTONS (Lifecycle) */}
            <div className="flex items-center gap-3">
                {ticket.status === 'Open' && (
                    <button 
                        onClick={() => handleAction('ACCEPT')}
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Üstlen
                    </button>
                )}

                {ticket.status === 'Pending Approval' && (
                     <button 
                        onClick={() => handleAction('APPROVE')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Onayla
                    </button>
                )}

                <button 
                    onClick={() => {
                        setTargetStatus(ticket.status);
                        setIsStatusModalOpen(true);
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">edit_attributes</span>
                    Durum Değiştir
                </button>

                {(ticket.status === 'Open' || ticket.status === 'In Progress') && (
                    <button 
                        onClick={() => handleAction('REDIRECT')}
                        className="px-4 py-2 bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">alt_route</span>
                        Yönlendir
                    </button>
                )}

                {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                    <button 
                        onClick={() => handleAction('RESOLVE')}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        Çözüldü
                    </button>
                )}
            </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 ml-12">{ticket.subject}</h1>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* 2. MAIN CONTENT - Activity Stream */}
        <div className="flex-1 flex flex-col bg-slate-100/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-700">
          
          {/* WORKFLOW TRACKER */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center shrink-0 shadow-sm z-10">
              <div className="relative flex items-center justify-between w-full max-w-3xl">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-700 -z-0 rounded-full"></div>
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 ease-out -z-0 rounded-full"
                        style={{ width: ticket.status === 'Resolved' ? '100%' : ticket.status === 'In Progress' ? '66%' : '33%' }}
                    ></div>

                    {workflowSteps.map((step) => {
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';
                        
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 group cursor-default">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    isCurrent 
                                    ? 'bg-primary text-white border-white dark:border-slate-800 shadow-md shadow-primary/30 scale-110 ring-2 ring-primary/20' 
                                    : isCompleted
                                    ? 'bg-primary text-white border-white dark:border-slate-800'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 border-white dark:border-slate-800'
                                }`}>
                                    <span className="material-symbols-outlined text-[16px]">
                                        {isCompleted ? 'check' : step.icon}
                                    </span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${
                                    isCurrent ? 'text-primary' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
              </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6">
              <button 
                  onClick={() => setActiveTab('MESSAGES')}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'MESSAGES' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                  Mesajlar & Notlar
              </button>
              <button 
                  onClick={() => setActiveTab('HISTORY')}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'HISTORY' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  Aksiyonlar & Tarihçe
              </button>
          </div>

          {/* MAIN CONTENT AREA */}
          {activeTab === 'MESSAGES' ? renderMessages() : renderHistory()}

          {/* Comment/Reply Area (Only visible in Messages Tab) */}
          {activeTab === 'MESSAGES' && (
            <div className="p-5 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-5xl mx-auto flex flex-col gap-2">
                    
                    {/* Mode Toggles */}
                    <div className="flex gap-1 ml-11">
                        <button 
                            onClick={() => setInputMode('PUBLIC')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-t-lg transition-colors border-t border-x ${
                                inputMode === 'PUBLIC' 
                                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 border-b-white dark:border-b-slate-900 translate-y-[1px] z-10' 
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            Herkese Açık Yanıt
                        </button>
                        <button 
                            onClick={() => setInputMode('INTERNAL')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-t-lg transition-colors border-t border-x flex items-center gap-1 ${
                                inputMode === 'INTERNAL' 
                                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-500 border-b-amber-50 dark:border-b-amber-900/10 translate-y-[1px] z-10' 
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:bg-amber-50/50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            İç Not (Sarı Not)
                        </button>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm ring-2 ring-slate-50 dark:ring-slate-700 mb-1">
                            AG
                        </div>
                        <div className="flex-1 min-w-0 relative">
                            {/* Mention List Popover */}
                            {showMentionList && (
                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-bottom-2">
                                    <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase">
                                        Ekip Arkadaşını Etiketle
                                    </div>
                                    {mockAgents.map(agent => (
                                        <button 
                                            key={agent.id}
                                            onClick={() => insertMention(agent.username)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 flex items-center justify-between group"
                                        >
                                            <span>{agent.name}</span>
                                            <span className="text-xs text-slate-400 group-hover:text-indigo-500">{agent.username}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className={`relative shadow-sm rounded-xl border transition-all overflow-hidden group bg-white dark:bg-slate-900 rounded-tl-none ${
                                inputMode === 'INTERNAL' 
                                ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/5' 
                                : isAiGenerating 
                                        ? 'ring-2 ring-indigo-400 border-indigo-400' 
                                        : 'border-slate-300 dark:border-slate-600 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'
                            }`}>
                                
                                {isAiGenerating && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-20 flex items-center justify-center backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm animate-pulse">
                                            <span className="material-symbols-outlined text-[20px] animate-spin">auto_awesome</span>
                                            AI yanıt oluşturuyor...
                                        </div>
                                    </div>
                                )}

                                <textarea 
                                    value={replyText}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={isAiGenerating}
                                    className="w-full p-4 text-sm text-slate-700 dark:text-slate-200 min-h-[80px] max-h-[300px] resize-none outline-none block placeholder:text-slate-400 bg-transparent" 
                                    placeholder={inputMode === 'INTERNAL' ? "Sadece ekip arkadaşlarının görebileceği bir not bırak..." : "Müşteriye yanıt yaz... (@ ile etiketle)"}
                                />
                                
                                <div className={`px-2 py-2 border-t flex items-center justify-between ${
                                    inputMode === 'INTERNAL' 
                                    ? 'bg-amber-100/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                                }`}>
                                    <div className="flex items-center gap-0.5">
                                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="Kalın"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="İtalik"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="Liste"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                        <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                        <button 
                                            onClick={() => setReplyText(prev => prev + '@')}
                                            className="p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 rounded transition-colors" 
                                            title="Etiketle (@)"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                                        </button>
                                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors" title="Dosya Ekle"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {inputMode === 'PUBLIC' && (
                                            <button 
                                                onClick={handleAiAssist}
                                                disabled={isAiGenerating}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-md hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                                                AI ile Yaz
                                            </button>
                                        )}

                                        <button 
                                            onClick={handleSend}
                                            disabled={!replyText.trim() || isAiGenerating}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                                !replyText.trim() || isAiGenerating
                                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                                : inputMode === 'INTERNAL'
                                                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transform hover:-translate-y-0.5'
                                                    : 'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20 transform hover:-translate-y-0.5' 
                                            }`}
                                        >
                                            {inputMode === 'INTERNAL' ? (
                                                <>
                                                    <span className="material-symbols-outlined text-[16px]">lock</span>
                                                    Not Ekle (Gizli)
                                                </>
                                            ) : (
                                                <>
                                                    Gönder
                                                    <span className="material-symbols-outlined text-[16px]">send</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-1 px-1">
                                <span className="text-[10px] text-slate-400">MarkDown desteklenir</span>
                                <span className="text-[10px] text-slate-400">Enter ile gönder, Shift+Enter ile satır başı</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* 3. RIGHT SIDEBAR - Context & Metadata */}
        <div className="w-80 bg-white dark:bg-slate-800 p-6 overflow-y-auto shrink-0 flex flex-col gap-6 border-l border-slate-200 dark:border-slate-700 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
            
            {/* SLA Timer Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">timer</span> SLA Durumu
                    </span>
                </div>
                <div className="flex justify-center items-baseline gap-1 text-slate-800 dark:text-slate-100">
                    <span className="text-4xl font-black tracking-tight">02</span>
                    <span className="text-sm font-bold mr-2 text-slate-400">SA</span>
                    <span className="text-4xl font-black tracking-tight">15</span>
                    <span className="text-sm font-bold text-slate-400">DK</span>
                </div>
                <p className="text-xs text-emerald-600 font-bold mt-2 bg-emerald-50 dark:bg-emerald-900/30 py-1 rounded">Hedef: Bugün 14:00</p>
            </div>

            {/* Ticket Info */}
            <div className="space-y-6">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-700 pb-2">Talep Detayları</h3>
                
                <div className="grid grid-cols-1 gap-y-5">
                    <div>
                        <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide font-bold">Talep Sahibi</span>
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg -ml-2 transition-colors cursor-pointer group">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">SY</div>
                           <div className="flex flex-col">
                               <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{ticket.requester}</span>
                               <span className="text-xs text-slate-500">Satış Müdürü • {ticket.department}</span>
                           </div>
                        </div>
                    </div>

                    <div>
                        <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide font-bold">Kategori</span>
                        <div className="flex gap-2 flex-wrap">
                             <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1.5 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">dns</span>
                                {ticket.department}
                             </span>
                             <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1.5 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-600">
                                {ticket.category}
                             </span>
                        </div>
                    </div>

                    <div>
                         <span className="text-xs text-slate-400 block mb-2 uppercase tracking-wide font-bold">Atanan Uzman</span>
                         {ticket.assignedTo ? (
                            <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                    {ticket.assignedTo.substring(0,1)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{ticket.assignedTo}</span>
                                    <span className="text-[10px] text-slate-400">L2 Support</span>
                                </div>
                                <button onClick={() => setIsRedirectModalOpen(true)} className="material-symbols-outlined text-slate-400 text-[16px] ml-auto cursor-pointer hover:text-primary">edit</button>
                            </div>
                         ) : (
                            <button 
                                onClick={() => handleAction('ACCEPT')}
                                className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-500 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                                Uzman Ata
                            </button>
                         )}
                    </div>
                </div>
            </div>

            {/* Additional Widgets */}
            <div className="mt-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    AI Önerisi
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                    Bu hata kodu (Error 800) genellikle kullanıcı sertifikasının süresi dolduğunda oluşur.
                </p>
                <button 
                  onClick={handleAiAssist}
                  disabled={isAiGenerating}
                  className="mt-3 text-[10px] font-bold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors w-full"
                >
                    Otomatik Yanıt Oluştur
                </button>
            </div>

        </div>
      </div>

      {/* --- REDIRECT MODAL --- */}
      {isRedirectModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">Talebi Yönlendir</h3>
                      <button onClick={() => setIsRedirectModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                          <span className="material-symbols-outlined text-slate-500">close</span>
                      </button>
                  </div>
                  
                  <div className="p-4">
                      <div className="relative mb-4">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                          <input 
                              type="text" 
                              placeholder="Kişi veya Grup Ara..." 
                              value={redirectSearch}
                              onChange={(e) => setRedirectSearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              autoFocus
                          />
                      </div>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {redirectTargets
                              .filter(t => t.name.toLowerCase().includes(redirectSearch.toLowerCase()))
                              .map(target => (
                                  <button 
                                      key={target.id}
                                      onClick={() => handleConfirmRedirect(target)}
                                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600 text-left group"
                                  >
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${target.type === 'GROUP' ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                                          <span className="material-symbols-outlined text-[20px]">{target.icon}</span>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{target.name}</h4>
                                          <span className="text-xs text-slate-500 dark:text-slate-400">{target.type === 'GROUP' ? 'Çözüm Grubu' : target.role}</span>
                                      </div>
                                      <span className="material-symbols-outlined text-slate-300 ml-auto group-hover:text-primary">arrow_forward</span>
                                  </button>
                              ))
                          }
                          {redirectTargets.filter(t => t.name.toLowerCase().includes(redirectSearch.toLowerCase())).length === 0 && (
                              <div className="text-center py-8 text-slate-400">
                                  <p className="text-sm">Sonuç bulunamadı.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- STATUS UPDATE MODAL --- */}
      {isStatusModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">edit_attributes</span>
                          Durum Güncelle
                      </h3>
                      <button onClick={() => setIsStatusModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                          <span className="material-symbols-outlined text-slate-500">close</span>
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Yeni Durum</label>
                          <select 
                              value={targetStatus}
                              onChange={(e) => setTargetStatus(e.target.value as TicketStatus)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-primary outline-none"
                          >
                              <option value="Open">Açık (Open)</option>
                              <option value="In Progress">İşlemde (In Progress)</option>
                              <option value="Pending Approval">Onay Bekliyor (Pending)</option>
                              <option value="Resolved">Çözüldü (Resolved)</option>
                              <option value="Closed">Kapalı (Closed)</option>
                          </select>
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Açıklama (Opsiyonel)</label>
                          <textarea 
                              value={statusNote}
                              onChange={(e) => setStatusNote(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-primary outline-none resize-none h-24"
                              placeholder="Durum değişikliği ile ilgili not ekleyin..."
                          />
                      </div>

                      <div className="pt-2">
                          <button 
                              onClick={handleStatusChangeSubmit}
                              className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                          >
                              <span className="material-symbols-outlined text-[18px]">save</span>
                              Kaydet
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default TicketDetail;
