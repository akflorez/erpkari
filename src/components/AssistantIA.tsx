import React from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Paperclip, 
  FileText,
  CreditCard,
  History
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AssistantIA = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { 
      role: 'assistant', 
      content: 'Hola, soy tu asistente de ContaERP. Puedo ayudarte a generar asientos, analizar facturas o responder dudas sobre NIIF. ¿En qué trabajamos hoy?' 
    }
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'He analizado tu solicitud. Para registrar esa compra de mangos con retención del 2.5%, he preparado una propuesta de asiento contable. ¿Deseas revisarla?' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 z-[60] transition-all duration-300 hover:scale-110 active:scale-95",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 rounded-[inherit] bg-white/20 animate-ping opacity-20" />
        <Bot size={28} />
      </button>

      {/* AI Panel */}
      <div 
        className={cn(
          "fixed bottom-8 right-8 w-[400px] h-[600px] glass rounded-3xl flex flex-col z-[70] transition-all duration-500 shadow-[0_0_50px_rgba(99,102,241,0.2)] border-indigo-500/20 overflow-hidden",
          !isOpen && "scale-90 opacity-0 pointer-events-none translate-y-12"
        )}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/5 bg-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Asistente ContaERP</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Claude</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white/5 text-slate-300 rounded-tl-none border border-white/5"
              )}>
                {m.content}
                {m.role === 'assistant' && i > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/50 border border-indigo-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Propuesta de Asiento</span>
                      <CreditCard size={12} className="text-indigo-400" />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>1435 - Inventarios</span>
                      <span className="font-bold text-white">$5.200.000 (D)</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>2365 - Retención</span>
                      <span className="font-bold text-white">$130.000 (C)</span>
                    </div>
                    <button className="mt-1 w-full py-2 bg-indigo-500 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-400 transition-all uppercase tracking-widest">
                      Revisar y Contabilizar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/5 space-y-3">
          {/* Quick Actions */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { label: 'Crear Asiento', icon: FileText },
              { label: 'Subir Factura', icon: Paperclip },
              { label: 'Auditoría', icon: Sparkles },
              { label: 'Historial', icon: History },
            ].map((q, i) => (
              <button key={i} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold hover:bg-white/10 hover:text-white transition-all whitespace-nowrap uppercase tracking-widest">
                <q.icon size={12} />
                {q.label}
              </button>
            ))}
          </div>

          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe una transacción..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-400 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
