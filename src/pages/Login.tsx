import React, { useState } from 'react';
import { Bot, Key, User, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('admin@emdecob.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate backend authentication (bcrypt/JWT flow)
    setTimeout(() => {
      if (email === 'admin@emdecob.com' && password === '123456') {
        onLogin();
      } else {
        setError('Credenciales incorrectas. Intenta con admin@emdecob.com / 123456');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-float" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Logo / Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <span className="font-bold text-white text-3xl">C</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Conta<span className="text-indigo-500">ERP</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Acceso NIIF & DIAN 2026
          </p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-3xl p-8 border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Correo Electrónico</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@emdecob.com"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Contraseña</label>
                <span className="text-[10px] text-slate-600 hover:text-indigo-400 cursor-pointer font-bold uppercase tracking-wider">¿Olvidaste la clave?</span>
              </div>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Hint */}
        <div className="text-center">
          <p className="text-xs text-slate-600">
            Modo Demo: Usa <span className="text-slate-400 font-mono font-bold">admin@emdecob.com</span> y contraseña <span className="text-slate-400 font-mono font-bold">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
};
