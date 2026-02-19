import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-rose-900/50 mb-4 transform hover:scale-105 transition-transform">
                R
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">RetailMind</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">Kurumsal Çalışma Alanı</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Kurumsal E-posta</label>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                            placeholder="ad.soyad@retailmind.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Şifre</label>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-primary focus:ring-primary/50" />
                        <span className="text-xs text-slate-400 font-medium">Beni hatırla</span>
                    </label>
                    <button type="button" className="text-xs font-bold text-primary hover:text-rose-400 transition-colors">
                        Şifremi Unuttum?
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-900/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Giriş Yapılıyor...
                        </>
                    ) : (
                        <>
                            Giriş Yap
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                 <p className="text-xs text-slate-500 mb-4">veya SSO ile devam et</p>
                 <div className="grid grid-cols-2 gap-3">
                     <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-slate-300 text-sm font-medium">
                         <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                         Google
                     </button>
                     <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-slate-300 text-sm font-medium">
                         <img src="https://www.svgrepo.com/show/355117/microsoft.svg" className="w-5 h-5" alt="Microsoft" />
                         Microsoft
                     </button>
                 </div>
            </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
                Bu sisteme giriş yaparak <a href="#" className="text-slate-400 hover:text-white underline">Kullanım Koşulları</a>'nı kabul etmiş olursunuz.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;