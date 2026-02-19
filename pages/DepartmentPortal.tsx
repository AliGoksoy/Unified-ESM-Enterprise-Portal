import React from 'react';
import { ViewState, ServiceCategory } from '../types';

interface DepartmentPortalProps {
  currentView: ViewState;
  onSelectCategory: (category: ServiceCategory) => void;
  onChangeView: (view: ViewState) => void;
}

// Departman Verileri ve Alt Birimleri
export const departmentData: Record<string, { title: string; description: string; color: string; categories: ServiceCategory[] }> = {
  [ViewState.DEPT_IT]: {
    title: 'Bilgi Teknolojileri',
    description: 'Donanım, yazılım, ağ altyapısı ve teknik destek hizmetleri.',
    color: 'bg-indigo-600',
    categories: [
      { id: 'it_network', title: 'Ağ & Bağlantı', description: 'VPN, Wi-Fi, İnternet erişim sorunları ve güvenlik duvarı talepleri.', icon: 'router', formType: 'GENERAL' },
      { id: 'it_hardware', title: 'Donanım & Cihaz', description: 'Laptop, monitör, klavye talepleri ve arıza bildirimleri.', icon: 'devices', formType: 'HARDWARE' },
      { id: 'it_software', title: 'Yazılım & Lisans', description: 'Adobe, Office 365 lisansları ve yeni yazılım kurulum talepleri.', icon: 'code', formType: 'SOFTWARE' },
      { id: 'it_access', title: 'Hesap & Erişim', description: 'Şifre sıfırlama, yeni kullanıcı oluşturma ve yetki tanımlamaları.', icon: 'password', formType: 'ACCESS' },
      { id: 'it_security', title: 'Siber Güvenlik', description: 'Şüpheli e-posta bildirimi, güvenlik ihlali ve veri sızıntısı.', icon: 'security', formType: 'SECURITY' },
      { id: 'it_project', title: 'Proje Talebi', description: 'Yeni bir IT projesi başlatma veya mevcut projelere destek.', icon: 'rocket_launch', formType: 'DATE_RANGE' },
    ]
  },
  [ViewState.DEPT_FINANCE]: {
    title: 'Finans & Muhasebe',
    description: 'Ödemeler, faturalar, bütçe yönetimi ve finansal raporlama.',
    color: 'bg-emerald-600',
    categories: [
      { id: 'fin_invoice', title: 'Fatura Girişi', description: 'Tedarikçi faturalarının sisteme işlenmesi ve onayı.', icon: 'receipt_long', formType: 'FINANCE' },
      { id: 'fin_expense', title: 'Masraf Bildirimi', description: 'Personel harcamaları, seyahat ve konaklama giderleri.', icon: 'credit_card', formType: 'FINANCE' },
      { id: 'fin_budget', title: 'Bütçe Onayı', description: 'Departman bütçesi dışındaki harcamalar için ek onay.', icon: 'pie_chart', formType: 'FINANCE' },
      { id: 'fin_payroll', title: 'Bordro & Maaş', description: 'Maaş ödemeleri ve bordro sorgulama işlemleri.', icon: 'payments', formType: 'GENERAL' },
    ]
  },
  [ViewState.DEPT_HR]: {
    title: 'İnsan Kaynakları',
    description: 'İzin, bordro, işe alım, eğitim ve personel özlük işlemleri.',
    color: 'bg-rose-600',
    categories: [
      { id: 'hr_leave', title: 'İzin Talebi', description: 'Yıllık izin, mazeret izni veya hastalık raporu bildirimi.', icon: 'event_available', formType: 'DATE_RANGE' },
      { id: 'hr_docs', title: 'Belge Talebi', description: 'Bordro, çalışma belgesi, vize yazısı vb. resmi evrak talepleri.', icon: 'description', formType: 'GENERAL' },
      { id: 'hr_recruitment', title: 'İşe Alım', description: 'Yeni personel talebi veya açık pozisyon referans bildirimi.', icon: 'person_add', formType: 'DATE_RANGE' },
      { id: 'hr_training', title: 'Eğitim & Gelişim', description: 'Kişisel gelişim veya mesleki eğitim katılım talepleri.', icon: 'school', formType: 'DATE_RANGE' },
      { id: 'hr_benefits', title: 'Yan Haklar', description: 'Özel sağlık sigortası, yemek kartı veya servis işlemleri.', icon: 'health_and_safety', formType: 'GENERAL' },
    ]
  },
  [ViewState.DEPT_PROCUREMENT]: {
    title: 'Satın Alma & Tedarik',
    description: 'Ofis malzemeleri, demirbaş, hizmet alımı ve tedarikçi yönetimi.',
    color: 'bg-amber-600',
    categories: [
      { id: 'proc_supplies', title: 'Ofis Malzemesi', description: 'Kırtasiye, kağıt, toner ve genel ofis ihtiyaçları.', icon: 'inventory_2', formType: 'GENERAL' },
      { id: 'proc_asset', title: 'Demirbaş Talebi', description: 'Masa, sandalye, dolap gibi kalıcı demirbaş ürünleri.', icon: 'chair', formType: 'HARDWARE' },
      { id: 'proc_service', title: 'Hizmet Alımı', description: 'Dış kaynaklı hizmetler, danışmanlık veya bakım onarım.', icon: 'engineering', formType: 'DATE_RANGE' },
      { id: 'proc_vendor', title: 'Tedarikçi İşlemleri', description: 'Yeni tedarikçi kaydı veya mevcut tedarikçi değerlendirmesi.', icon: 'store', formType: 'GENERAL' },
      { id: 'proc_travel', title: 'Seyahat & Konaklama', description: 'Uçak bileti, otel rezervasyonu ve transfer hizmetleri.', icon: 'flight_takeoff', formType: 'DATE_RANGE' },
    ]
  },
  [ViewState.DEPT_OPERATIONS]: {
    title: 'İdari İşler & Operasyon',
    description: 'Ofis yönetimi, araç kiralama, güvenlik ve tesis hizmetleri.',
    color: 'bg-cyan-600',
    categories: [
      { id: 'ops_maintenance', title: 'Arıza & Bakım', description: 'Ofis içi teknik arızalar, klima, aydınlatma ve mobilya tamiri.', icon: 'build', formType: 'GENERAL' },
      { id: 'ops_vehicle', title: 'Araç Talebi', description: 'Şirket aracı kiralama, yakıt kartı ve servis işlemleri.', icon: 'directions_car', formType: 'DATE_RANGE' },
      { id: 'ops_security', title: 'Giriş & Kart', description: 'Ziyaretçi kaydı, personel giriş kartı yenileme.', icon: 'badge', formType: 'ACCESS' },
      { id: 'ops_cleaning', title: 'Temizlik Hizmetleri', description: 'Ofis temizliği ve hijyen malzemesi talepleri.', icon: 'cleaning_services', formType: 'GENERAL' },
    ]
  },
  [ViewState.DEPT_LEGAL]: {
    title: 'Hukuk & Uyum',
    description: 'Sözleşmeler, hukuki danışmanlık ve KVKK süreçleri.',
    color: 'bg-slate-700',
    categories: [
      { id: 'legal_contract', title: 'Sözleşme İnceleme', description: 'Tedarikçi ve müşteri sözleşmelerinin hukuki kontrolü.', icon: 'gavel', formType: 'DATE_RANGE' },
      { id: 'legal_consult', title: 'Hukuki Danışmanlık', description: 'Departmanlar arası hukuki görüş ve destek talepleri.', icon: 'support', formType: 'GENERAL' },
      { id: 'legal_gdpr', title: 'KVKK / Veri Gizliliği', description: 'Kişisel verilerin korunması ile ilgili bildirimler.', icon: 'policy', formType: 'GENERAL' },
    ]
  },
  [ViewState.DEPT_MARKETING]: {
    title: 'Satış & Pazarlama',
    description: 'Reklam, kampanya, sosyal medya ve tasarım talepleri.',
    color: 'bg-purple-600',
    categories: [
      { id: 'mkt_design', title: 'Grafik Tasarım', description: 'Sosyal medya görselleri, banner ve broşür tasarımları.', icon: 'palette', formType: 'GENERAL' },
      { id: 'mkt_social', title: 'Sosyal Medya', description: 'LinkedIn, Instagram içerik onayı ve paylaşım talepleri.', icon: 'share', formType: 'GENERAL' },
      { id: 'mkt_event', title: 'Etkinlik & Organizasyon', description: 'Fuar, seminer ve şirket içi etkinlik planlama.', icon: 'event', formType: 'DATE_RANGE' },
    ]
  }
};

const DepartmentPortal: React.FC<DepartmentPortalProps> = ({ currentView, onSelectCategory, onChangeView }) => {
  const data = departmentData[currentView];

  // Handler for the "General Request" button
  const handleGeneralRequest = () => {
    const generalCategory: ServiceCategory = {
      id: 'general_fallback',
      title: 'Genel Destek',
      description: 'Kategorize edilemeyen genel destek ve yardım talepleri.',
      icon: 'help_center',
      formType: 'GENERAL'
    };
    onSelectCategory(generalCategory);
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <span className="material-symbols-outlined text-6xl mb-4">construction</span>
        <h2 className="text-xl font-bold">Bu departman portalı yapım aşamasında.</h2>
        <button onClick={() => onChangeView(ViewState.DASHBOARD)} className="mt-4 text-primary font-bold hover:underline">
            Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Hero Header */}
      <div className={`relative ${data.color} text-white p-10 overflow-hidden shrink-0`}>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-12"></div>
        <div className="absolute right-20 bottom-0 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-4 font-medium">
                <span onClick={() => onChangeView(ViewState.DASHBOARD)} className="cursor-pointer hover:text-white transition-colors">Ana Sayfa</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Departmanlar</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-white">{data.title}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">{data.title} Portalı</h1>
            <p className="text-lg text-white/80 max-w-2xl">{data.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">category</span>
                Hizmet Kategorileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.categories.map((cat) => (
                    <div 
                        key={cat.id}
                        onClick={() => onSelectCategory(cat)}
                        className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer flex flex-col relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <span className="material-symbols-outlined text-8xl text-slate-900">{cat.icon}</span>
                        </div>
                        
                        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors z-10">
                            <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors z-10">{cat.title}</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed z-10 flex-1">
                            {cat.description}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between z-10">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-primary transition-colors">Talep Oluştur</span>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Support Box */}
            <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0">
                    <span className="material-symbols-outlined text-2xl">help_center</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-blue-900">Aradığınız hizmeti bulamadınız mı?</h3>
                    <p className="text-sm text-blue-700 mt-1 mb-3">
                        Listelenen kategoriler dışında bir konuda desteğe ihtiyacınız varsa, "Genel Talep" oluşturabilir veya yardım merkezimizi ziyaret edebilirsiniz.
                    </p>
                    <button 
                        onClick={handleGeneralRequest}
                        className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        Genel Destek Talebi Oluştur
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPortal;