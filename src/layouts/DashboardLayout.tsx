import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

export const DashboardLayout = ({ 
  children, 
  activeTab, 
  setActiveTab 
}: { 
  children: React.ReactNode, 
  activeTab: string, 
  setActiveTab: (id: string) => void 
}) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar - fixed */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
          
          {/* Footer Branding */}
          <footer className="max-w-7xl mx-auto mt-12 pb-8 border-t border-white/5 pt-6 flex justify-between items-center text-slate-600">
            <p className="text-[10px] font-medium uppercase tracking-widest">
              © 2026 ContaERP · Sistema de Gestión NIIF
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <span className="hover:text-indigo-400 cursor-pointer">SOPORTE</span>
              <span className="hover:text-indigo-400 cursor-pointer">DOCUMENTACIÓN</span>
              <span className="text-slate-800">|</span>
              <span className="flex items-center gap-1 group cursor-pointer">
                DESARROLLADO POR 
                <span className="text-slate-400 group-hover:text-indigo-400 transition-colors">EMDECOB</span>
              </span>
            </div>
          </footer>
        </main>

        {/* Global Glass Background Decoration */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] -z-10 rounded-full animate-float" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] -z-10 rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      </div>
    </div>
  );
};
