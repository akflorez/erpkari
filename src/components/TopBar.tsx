import React from 'react';
import { 
  Building2, 
  Search, 
  ChevronDown, 
  Bell, 
  HelpCircle, 
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const companies = [
  { name: 'Frutas La Primavera SAS', nit: '901.234.567-8', active: true },
  { name: 'EMDECOB Ltda', nit: '800.111.222-3', active: false },
  { name: 'Inversiones ABC', nit: '900.555.666-0', active: false },
];

export const TopBar = () => {
  const [showCompanyMenu, setShowCompanyMenu] = React.useState(false);
  const activeCompany = companies.find(c => c.active) || companies[0];

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-xl z-40 sticky top-0">
      {/* Left: Company Switcher */}
      <div className="relative">
        <button 
          onClick={() => setShowCompanyMenu(!showCompanyMenu)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <Building2 size={18} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-tight">{activeCompany.name}</p>
            <p className="text-[10px] text-slate-500 font-medium">NIT: {activeCompany.nit}</p>
          </div>
          <ChevronDown size={16} className={cn("text-slate-500 transition-transform", showCompanyMenu && "rotate-180")} />
        </button>

        {showCompanyMenu && (
          <div className="absolute top-full left-0 mt-2 w-72 glass rounded-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-white/5 mb-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cambiar Empresa</p>
            </div>
            {companies.map((c) => (
              <button
                key={c.nit}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left",
                  c.active ? "text-indigo-400" : "text-slate-300"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full", c.active ? "bg-indigo-500" : "bg-slate-700")} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.nit}</p>
                </div>
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-indigo-400 hover:bg-indigo-500/5 transition-all text-sm font-bold border-t border-white/5 mt-2">
              <Plus size={16} />
              Agregar Empresa
            </button>
          </div>
        )}
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar facturas, asientos, proveedores..."
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-slate-800 text-[10px] text-slate-500 font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-slate-800 text-[10px] text-slate-500 font-mono">K</kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
        </button>
        <button className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <HelpCircle size={20} />
        </button>
        <div className="w-[1px] h-8 bg-white/5 mx-2" />
        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-white/5 transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">Admin Emdecob</p>
            <p className="text-[10px] text-indigo-400 font-medium">Contador Master</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold group-hover:border-indigo-500 transition-all">
            AE
          </div>
        </button>
      </div>
    </header>
  );
};
