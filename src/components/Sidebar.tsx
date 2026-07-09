import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Bot, 
  RefreshCcw, 
  Users, 
  Calendar, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventarios', label: 'Inventarios', icon: Package },
  { id: 'dian', label: 'DIAN / Facturas', icon: FileText },
  { id: 'ia', label: 'Asistente IA', icon: Bot, highlight: true },
  { id: 'conciliacion', label: 'Conciliación', icon: RefreshCcw },
  { id: 'nomina', label: 'Nómina', icon: Users },
  { id: 'calendario', label: 'Calendario Fiscal', icon: Calendar },
];

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside 
      className={cn(
        "h-screen glass border-r border-white/5 flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
          <span className="font-bold text-white text-xl">C</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ContaERP
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={22} className={cn("flex-shrink-0", isActive && "animate-pulse")} />
              {!collapsed && (
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
              {item.highlight && !collapsed && (
                <span className="ml-auto text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-1">
        <button 
          onClick={() => setActiveTab('configuracion')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
            activeTab === 'configuracion' 
              ? "bg-indigo-500/10 text-indigo-400" 
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <Settings size={22} />
          {!collapsed && <span className="font-medium text-sm">Configuración</span>}
        </button>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-white transition-all"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          {!collapsed && <span className="font-medium text-sm">Colapsar</span>}
        </button>
      </div>

      {/* Beta Indicator */}
      {!collapsed && (
        <div className="p-4 mx-4 mb-6 glass rounded-xl border-indigo-500/10">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Empresa Piloto</p>
          <p className="text-xs font-semibold text-slate-300">Frutas La Primavera</p>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          </div>
        </div>
      )}
    </aside>
  );
};
