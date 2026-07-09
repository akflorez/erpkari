import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Bot, 
  RefreshCcw, 
  Users, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-screen glass border-r border-white/5 flex flex-col transition-[width] duration-300 ease-in-out z-50 overflow-hidden",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo + Toggle Button Row */}
      <div className={cn(
        "flex items-center border-b border-white/5 flex-shrink-0",
        collapsed ? "justify-center px-0 py-5" : "justify-between px-5 py-5"
      )}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-lg">C</span>
          </div>
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            collapsed ? "w-0 opacity-0" : "w-28 opacity-100"
          )}>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 whitespace-nowrap block">
              ContaERP
            </span>
          </div>
        </div>

        {/* Toggle button - only shown when expanded */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0"
            title="Colapsar menú"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <div key={item.id} className="relative group/item">
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                  collapsed ? "justify-center" : "justify-start",
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}

                <Icon 
                  size={20} 
                  className={cn(
                    "flex-shrink-0 transition-transform duration-200",
                    isActive && "text-indigo-400",
                    !collapsed && "group-hover/item:scale-110"
                  )} 
                />

                {/* Label - slides in/out */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out flex items-center gap-2 flex-1 min-w-0",
                  collapsed ? "w-0 opacity-0" : "opacity-100"
                )}>
                  <span className="font-medium text-sm whitespace-nowrap truncate">
                    {item.label}
                  </span>
                  {item.highlight && (
                    <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                      IA
                    </span>
                  )}
                </div>
              </button>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 border border-white/10 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[200]">
                  {item.label}
                  {item.highlight && <span className="ml-1.5 text-[8px] bg-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded uppercase">IA</span>}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2 space-y-0.5 border-t border-white/5 flex-shrink-0">

        {/* Configuracion */}
        <div className="relative group/item">
          <button 
            onClick={() => setActiveTab('configuracion')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              collapsed ? "justify-center" : "justify-start",
              activeTab === 'configuracion' 
                ? "bg-indigo-500/10 text-indigo-400" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings size={20} className="flex-shrink-0" />
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              collapsed ? "w-0 opacity-0" : "opacity-100"
            )}>
              <span className="font-medium text-sm whitespace-nowrap">Configuración</span>
            </div>
          </button>
          {collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 border border-white/10 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[200]">
              Configuración
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
            </div>
          )}
        </div>

        {/* Expand/Collapse toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200",
            collapsed ? "justify-center" : "justify-start"
          )}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed 
            ? <PanelLeftOpen size={20} className="flex-shrink-0" /> 
            : <PanelLeftClose size={20} className="flex-shrink-0" />
          }
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            collapsed ? "w-0 opacity-0" : "opacity-100"
          )}>
            <span className="font-medium text-sm whitespace-nowrap">Colapsar</span>
          </div>
        </button>
      </div>

      {/* Company tag - only when expanded */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        collapsed ? "max-h-0 opacity-0 mb-0" : "max-h-24 opacity-100 mb-4"
      )}>
        <div className="px-4">
          <div className="glass rounded-xl border-indigo-500/10 p-3">
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Empresa Piloto</p>
            <p className="text-xs font-semibold text-slate-300">Frutas La Primavera</p>
            <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
