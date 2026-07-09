import React from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  FileJson, 
  Fingerprint,
  RotateCcw,
  Plus
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

const invoices = [
  { id: 'FV-001', client: 'Exito Manizales', date: '2026-03-24', total: '$12.450.000', status: 'validated', cufe: 'e3b0c442...8b1a' },
  { id: 'FV-002', client: 'Fruber Mercaldas', date: '2026-03-25', total: '$4.200.000', status: 'sent', cufe: '8f92a1...4d2e' },
  { id: 'FV-003', client: 'Surtifruver Bogotá', date: '2026-03-25', total: '$8.900.000', status: 'signed', cufe: 'Pending' },
  { id: 'FV-004', client: 'Almacenes La 14', date: '2026-03-26', total: '$2.150.000', status: 'draft', cufe: 'N/A' },
];

export const DianModule = () => {
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
          <button className="btn-premium">
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
          <button className="btn-ghost text-xs">Ver Todo</button>
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
                <th className="px-3"></th>
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
                    {/* @ts-ignore */}
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest inline-flex",
                      // @ts-ignore
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
                  <td className="px-3 text-right">
                    <button className="p-2 rounded-lg hover:bg-indigo-500/10 text-slate-700 hover:text-indigo-400 transition-all">
                      <RotateCcw size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
