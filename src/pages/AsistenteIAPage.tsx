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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    const userPrompt = prompt;
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
    setPrompt('');

    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Error: No se encontró la API Key de Gemini. Por favor crea un archivo .env en la raíz del proyecto y agrega VITE_GEMINI_API_KEY=tu_api_key para poder conectar con la IA.'
      }]);
      setIsGenerating(false);
      return;
    }

    const systemInstruction = `Eres un asistente contable experto para el mercado de Colombia. Tu tarea es analizar la transacción descrita en español y generar un asiento contable de partida doble válido en formato JSON, usando el PUC de Colombia.
Requisitos:
1. El total de Débitos debe ser exactamente igual al total de Créditos.
2. Cuentas comunes:
   - 110505: Caja general (Activo)
   - 111005: Bancos - Cuenta corriente (Activo)
   - 143501: Inventario frutas frescas (Activo)
   - 236540: ReteFuente compras (2.5%) (Pasivo)
   - 236530: ReteFuente arrendamientos (3.5%) (Pasivo)
   - 236515: ReteFuente honorarios (10%) (Pasivo)
   - 512010: Gasto Arrendamiento (Gasto)
   - 511030: Gasto Asesoría financiera/contable (Gasto)
3. REGLA 2026: Frutas frescas (mangos, papayas, bananos, aguacates) son excluidas de IVA (0%), no generes cuenta de IVA.
4. Formato de respuesta JSON estrictamente con la siguiente estructura:
{
  "type": "CE" | "CI" | "CG",
  "description": "Breve descripción general",
  "lines": [
    { "code": "código cuenta de 6 dígitos", "name": "nombre cuenta", "type": "D" | "C", "amount": valor numérico entero, "description": "descripción de línea" }
  ]
}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemInstruction },
                  { text: `Transacción a contabilizar: "${userPrompt}"` }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Error al conectar con la API de Gemini');
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error('No se recibió respuesta válida del modelo.');
      }

      const parsedProposal: Proposal = JSON.parse(textResponse);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Listo. He analizado la transacción con la IA de Gemini y he estructurado la propuesta para: "${parsedProposal.description}". Revisa los códigos PUC y los valores en el panel de la derecha.`
      }]);
      
      setProposal(parsedProposal);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Lo siento, no pude procesar la consulta con la IA (${error.message}). Por favor intenta de nuevo.`
      }]);
    } finally {
      setIsGenerating(false);
    }
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
