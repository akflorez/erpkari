import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

interface JournalLine {
  code: string;
  name: string;
  type: 'D' | 'C';
  amount: number;
  description: string;
}

interface Proposal {
  type: string;
  description: string;
  lines: JournalLine[];
}

export const AsistenteIAPage = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hola, soy tu Asistente de Asientos Contables NIIF. Escribe en lenguaje natural lo que sucedió (ej. "Compramos papayas a agricultor local por $1,500,000 en efectivo" o "Pagamos arriendo del local por $2,000,000 con transferencia bancaria") y generaré el asiento contable correspondiente adaptado al PUC de Colombia.'
    }
  ]);

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    
    // Simulate Claude Sonnet response
    setTimeout(() => {
      let mockProposal: Proposal = {
        type: 'CG',
        description: 'Registro de compra de mercancía - Frutas frescas',
        lines: [
          { code: '143501', name: 'Inventarios - Frutas frescas', type: 'D', amount: 1500000, description: 'Compra de mercancía según factura' },
          { code: '236540', name: 'Retención en la fuente (2.5%)', type: 'C', amount: 37500, description: 'Retención compras declarantes' },
          { code: '111005', name: 'Bancos - Cuenta corriente', type: 'C', amount: 1462500, description: 'Pago neto factura' }
        ]
      };

      if (prompt.toLowerCase().includes('arriendo') || prompt.toLowerCase().includes('alquiler')) {
        mockProposal = {
          type: 'CE',
          description: 'Pago de arrendamiento mensual local comercial',
          lines: [
            { code: '512010', name: 'Construcciones y edificaciones (Arriendos)', type: 'D', amount: 2000000, description: 'Pago canon de arrendamiento local' },
            { code: '236530', name: 'Retención en la fuente - Arrendamientos (3.5%)', type: 'C', amount: 70000, description: 'Retención arriendo bien inmueble' },
            { code: '111005', name: 'Bancos - Cuenta corriente', type: 'C', amount: 1930000, description: 'Giro canon de arrendamiento' }
          ]
        };
      } else if (prompt.toLowerCase().includes('honorarios') || prompt.toLowerCase().includes('contador')) {
        mockProposal = {
          type: 'CE',
          description: 'Honorarios asesoría contable y tributaria',
          lines: [
            { code: '511030', name: 'Asesoría financiera y contable', type: 'D', amount: 1200000, description: 'Honorarios contador mensualidad' },
            { code: '236515', name: 'Retención en la fuente - Honorarios (10%)', type: 'C', amount: 120000, description: 'Retención honorarios PN declarante' },
            { code: '111005', name: 'Bancos - Cuenta corriente', type: 'C', amount: 1080000, description: 'Pago honorarios mensuales' }
          ]
        };
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Listo. He estructurado la propuesta para: "${mockProposal.description}". Revisa los códigos PUC y los valores en el panel de la derecha.`
      }]);
      
      setProposal(mockProposal);
      setIsGenerating(false);
      setPrompt('');
    }, 1500);
  };

  const handleUpdateLine = (index: number, field: keyof JournalLine, value: any) => {
    if (!proposal) return;
    const newLines = [...proposal.lines];
    newLines[index] = {
      ...newLines[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setProposal({ ...proposal, lines: newLines });
  };

  const handleDeleteLine = (index: number) => {
    if (!proposal) return;
    const newLines = proposal.lines.filter((_, i) => i !== index);
    setProposal({ ...proposal, lines: newLines });
  };

  const handleAddLine = () => {
    if (!proposal) return;
    setProposal({
      ...proposal,
      lines: [
        ...proposal.lines,
        { code: '110505', name: 'Caja general', type: 'D', amount: 0, description: 'Nueva línea de registro' }
      ]
    });
  };

  const totalDebits = proposal?.lines.reduce((sum, l) => l.type === 'D' ? sum + l.amount : sum, 0) || 0;
  const totalCredits = proposal?.lines.reduce((sum, l) => l.type === 'C' ? sum + l.amount : sum, 0) || 0;
  const difference = Math.abs(totalDebits - totalCredits);
  const isBalanced = difference < 1;

  const handlePost = () => {
    if (!isBalanced) return;
    setSuccessMsg('¡Asiento contable registrado con éxito en el Libro Diario!');
    setTimeout(() => {
      setSuccessMsg('');
      setProposal(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Bot className="text-indigo-500 animate-bounce" size={32} />
          Asistente Inteligente <span className="text-indigo-500">de Asientos</span>
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Generación automática de asientos contables mediante IA adaptada a PUC y NIIF colombianas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Chat AI */}
        <div className="lg:col-span-5 glass-card flex flex-col h-[600px] p-0 overflow-hidden relative">
          <div className="p-5 border-b border-white/5 bg-indigo-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot size={22} className="text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-sm">Claude API Asistente</h3>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Normativa NIIF 2026</span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold">ONLINE</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white/5 text-slate-400 p-3.5 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-indigo-400" />
                  Escribiendo propuesta contable...
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-white/5 space-y-4 bg-slate-950">
            {/* Quick Prompts */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                'Compra papaya $1.5M efectivo',
                'Pago arriendo $2M',
                'Honorarios contador $1.2M'
              ].map((pText, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(pText)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider"
                >
                  {pText}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Describe la transacción en lenguaje natural..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-400 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Journal Voucher Grid */}
        <div className="lg:col-span-7 space-y-6">
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 animate-bounce">
              <CheckCircle size={20} />
              <span className="font-bold text-sm">{successMsg}</span>
            </div>
          )}

          {proposal ? (
            <div className="glass-card space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded uppercase tracking-wider">
                    Comprobante: {proposal.type}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">Detalle de Asiento Contable</h3>
                </div>
                <button 
                  onClick={handleAddLine}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-indigo-400 flex items-center gap-1.5 transition-all"
                >
                  <Plus size={14} />
                  Línea
                </button>
              </div>

              {/* Editable Voucher Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      <th className="pb-3 w-28">Código PUC</th>
                      <th className="pb-3">Nombre Cuenta</th>
                      <th className="pb-3 w-24 text-center">Tipo</th>
                      <th className="pb-3 w-32 text-right">Valor</th>
                      <th className="pb-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {proposal.lines.map((line, idx) => (
                      <tr key={idx} className="group hover:bg-white/[0.01]">
                        <td className="py-3">
                          <input
                            type="text"
                            value={line.code}
                            onChange={(e) => handleUpdateLine(idx, 'code', e.target.value)}
                            className="bg-slate-900/50 border border-white/5 rounded px-2 py-1 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 w-24"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="text"
                            value={line.name}
                            onChange={(e) => handleUpdateLine(idx, 'name', e.target.value)}
                            className="bg-slate-900/50 border border-white/5 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 w-full"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <select
                            value={line.type}
                            onChange={(e) => handleUpdateLine(idx, 'type', e.target.value as 'D' | 'C')}
                            className="bg-slate-900/50 border border-white/5 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-bold"
                          >
                            <option value="D">Débito</option>
                            <option value="C">Crédito</option>
                          </select>
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            value={line.amount}
                            onChange={(e) => handleUpdateLine(idx, 'amount', e.target.value)}
                            className="bg-slate-900/50 border border-white/5 rounded px-2 py-1 text-xs text-white text-right font-mono focus:outline-none focus:border-indigo-500 w-28"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteLine(idx)}
                            className="p-1 rounded hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Balancer Footer */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <div className="space-y-1">
                    <p className="text-xs">Total Débitos: <span className="font-mono text-white font-bold ml-1">${totalDebits.toLocaleString('es-CO')}</span></p>
                    <p className="text-xs">Total Créditos: <span className="font-mono text-white font-bold ml-1">${totalCredits.toLocaleString('es-CO')}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">Diferencia:</p>
                    <p className={`text-lg font-mono ${isBalanced ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                      ${difference.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    {isBalanced ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                        <CheckCircle size={14} />
                        PARTIDAS CUADRADAS
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 font-bold">
                        <AlertCircle size={14} />
                        ASIENTO CONTABLE DESCUADRADO
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePost}
                    disabled={!isBalanced}
                    className="btn-premium py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-bold"
                  >
                    Contabilizar Asiento
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center space-y-4 border-dashed border-white/10 bg-white/[0.01]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-400 border border-indigo-500/10 animate-pulse">
                <Sparkles size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Esperando Consulta IA</h4>
                <p className="text-slate-500 max-w-sm text-sm mt-1">Escribe en el chat de la izquierda para generar y visualizar aquí la propuesta contable.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
