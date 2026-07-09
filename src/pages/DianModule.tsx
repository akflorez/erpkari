import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  FileJson, 
  Fingerprint,
  RotateCcw,
  Plus,
  X,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const statusMap = {
  draft: { label: 'Borrador', color: 'slate', icon: FileText },
  signed: { label: 'Firmado (XAdES)', color: 'indigo', icon: Fingerprint },
  sent: { label: 'Enviado DIAN', color: 'purple', icon: Send },
  validated: { label: 'Aprobado DIAN', color: 'emerald', icon: ShieldCheck },
};

export const DianModule = () => {
  const [invoices, setInvoices] = useState([
    { id: 'FV-001', client: 'Exito Manizales', date: '2026-03-24', total: '$12.450.000', status: 'validated', cufe: 'e3b0c442...8b1a' },
    { id: 'FV-002', client: 'Fruber Mercaldas', date: '2026-03-25', total: '$4.200.000', status: 'sent', cufe: '8f92a1...4d2e' },
    { id: 'FV-003', client: 'Surtifruver Bogotá', date: '2026-03-25', total: '$8.900.000', status: 'signed', cufe: 'Pending' },
    { id: 'FV-004', client: 'Almacenes La 14', date: '2026-03-26', total: '$2.150.000', status: 'draft', cufe: 'N/A' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState('Exito Manizales');
  const [product, setProduct] = useState('Mango Tommy Atkins');
  const [qty, setQty] = useState(1000);
  const [price, setPrice] = useState(4500);

  // Calculates values
  const subtotal = qty * price;
  const iva = 0; // Excluded according to ET Art. 477 (fruits)
  const reteFuente = subtotal * 0.025; // 2.5% for general purchases
  const total = subtotal - reteFuente;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `FV-00${invoices.length + 1}`;
    const newInv = {
      id: nextId,
      client,
      date: new Date().toISOString().split('T')[0],
      total: `$${total.toLocaleString('es-CO')}`,
      status: 'draft' as const,
      cufe: 'N/A'
    };

    setInvoices([newInv, ...invoices]);
    setShowModal(false);
    // Reset defaults
    setQty(1000);
    setPrice(4500);
  };

  const handleAdvanceStatus = (id: string, currentStatus: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        if (currentStatus === 'draft') {
          return { ...inv, status: 'signed' as const, cufe: 'Generando...' };
        } else if (currentStatus === 'signed') {
          return { ...inv, status: 'sent' as const, cufe: 'Enviando...' };
        } else if (currentStatus === 'sent') {
          const randomCufe = Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
          return { ...inv, status: 'validated' as const, cufe: randomCufe };
        }
      }
      return inv;
    }));
  };

  const handleResetInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return { ...inv, status: 'draft' as const, cufe: 'N/A' };
      }
      return inv;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileJson className="text-indigo-500" size={32} />
            Módulo <span className="text-indigo-500">DIAN 2026</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Facturación Electrónica UBL 2.1 · Validación Previa</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-indigo-500/10">
            <ShieldCheck className="text-emerald-400" size={18} />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Resolución Activa: FV-5000</span>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-premium"
          >
            <Plus size={18} />
            Crear Factura
          </button>
        </div>
      </div>

      {/* Visual Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8 glass rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 -z-10" />
        
        {[
          { step: 1, label: 'Borrador', icon: FileText, desc: 'Captura de datos' },
          { step: 2, label: 'Firma / CUFE', icon: Fingerprint, desc: 'XAdES-BES / SHA-384' },
          { step: 3, label: 'Envío DIAN', icon: Send, desc: 'Wsdl validation' },
          { step: 4, label: 'Legalización', icon: CheckCircle2, desc: 'Representación Gráfica' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4 relative">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
              i === 0 ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "bg-slate-900 text-slate-500"
            )}>
              <s.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-white mb-1 uppercase tracking-widest">{s.label}</p>
              <p className="text-[10px] text-slate-500 font-medium px-4">{s.desc}</p>
            </div>
            {i < 3 && (
              <div className="hidden md:block absolute top-8 left-[70%] w-full h-[1px] bg-slate-800" />
            )}
          </div>
        ))}
      </div>

      {/* Invoices List */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Comprobantes Recientes</h3>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resolución DIAN Autorizada</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Factura</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valor Total</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado DIAN</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">CUFE</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.01] transition-all group cursor-pointer">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-white">{inv.id}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-slate-300">{inv.client}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-slate-500 font-mono">{inv.date}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-indigo-400 font-mono">{inv.total}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest inline-flex",
                      inv.status === 'validated' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                      inv.status === 'sent' ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                      inv.status === 'signed' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" :
                      "bg-slate-800 border-slate-700 text-slate-400"
                    )}>
                      {/* @ts-ignore */}
                      {statusMap[inv.status].label}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-[10px] font-mono text-slate-600 truncate max-w-[100px] hover:text-slate-400 transition-colors">
                      {inv.cufe}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                    {inv.status !== 'validated' ? (
                      <button 
                        onClick={() => handleAdvanceStatus(inv.id, inv.status)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        {inv.status === 'draft' ? 'Firmar' :
                         inv.status === 'signed' ? 'Enviar' : 'Validar'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                        Aprobada ✓
                      </span>
                    )}
                    <button 
                      onClick={() => handleResetInvoice(inv.id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-600 hover:text-white transition-all ml-2"
                      title="Reiniciar factura"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-lg overflow-hidden border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Nueva Factura Electrónica</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-6">
              {/* Client field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Cliente</label>
                <select 
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Exito Manizales">Exito Manizales</option>
                  <option value="Fruber Mercaldas">Fruber Mercaldas</option>
                  <option value="Surtifruver Bogotá">Surtifruver Bogotá</option>
                  <option value="Almacenes La 14">Almacenes La 14</option>
                </select>
              </div>

              {/* Product and quantities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Producto Fruta</label>
                  <select 
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Mango Tommy Atkins">Mango Tommy Atkins</option>
                    <option value="Papaya Criolla">Papaya Criolla</option>
                    <option value="Banano Urabá">Banano Urabá</option>
                    <option value="Aguacate Hass">Aguacate Hass</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Cantidad (kg)</label>
                  <input 
                    type="number" 
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
              </div>

              {/* Price and compliance badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Precio Unitario ($)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
                <div className="flex items-end pb-1.5">
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 flex items-center justify-center text-[10px] font-bold text-emerald-400 text-center">
                    EXCLUIDO DE IVA (Art. 477 ET)
                  </div>
                </div>
              </div>

              {/* Invoice calculation summary */}
              <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl space-y-2.5 text-xs font-medium">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal bruto:</span>
                  <span className="font-mono text-white">${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>IVA (0% Excluido):</span>
                  <span className="font-mono text-white">$0</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-2">
                  <span>ReteFuente compras (2.5%):</span>
                  <span className="font-mono text-rose-400">-${reteFuente.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1 text-emerald-400">
                  <span>Valor Neto a Cobrar:</span>
                  <span className="font-mono">${total.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-400 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-premium py-2 px-4 font-bold text-xs"
                >
                  Emitir Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
