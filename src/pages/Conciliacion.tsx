import React, { useState } from 'react';
import { 
  RefreshCcw, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  ArrowDownRight,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BankTransaction {
  id: string;
  date: string;
  desc: string;
  amount: number;
  type: 'IN' | 'OUT';
  matched: boolean;
  erpId?: string;
}

interface ErpTransaction {
  id: string;
  date: string;
  desc: string;
  amount: number;
  type: 'IN' | 'OUT';
  matched: boolean;
}

export const Conciliacion = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchDone, setMatchDone] = useState(false);

  const [bankTrans, setBankTrans] = useState<BankTransaction[]>([
    { id: 'TX-101', date: '2026-03-24', desc: 'Transferencia Recibida Exito Manizales', amount: 12450000, type: 'IN', matched: false },
    { id: 'TX-102', date: '2026-03-25', desc: 'Pago Proveedor Cajones de Madera SAS', amount: 850000, type: 'OUT', matched: false },
    { id: 'TX-103', date: '2026-03-25', desc: 'Retiro Cajero Davivienda', amount: 200000, type: 'OUT', matched: false },
    { id: 'TX-104', date: '2026-03-26', desc: 'Pago PSE Servicios Claro Hogar', amount: 150000, type: 'OUT', matched: false },
  ]);

  const [erpTrans, setErpTrans] = useState<ErpTransaction[]>([
    { id: 'ERP-001', date: '2026-03-24', desc: 'Recaudo Factura FV-001', amount: 12450000, type: 'IN', matched: false },
    { id: 'ERP-002', date: '2026-03-25', desc: 'Pago a Proveedores - Cajones', amount: 850000, type: 'OUT', matched: false },
    { id: 'ERP-003', date: '2026-03-26', desc: 'Pago servicios de internet claro', amount: 150000, type: 'OUT', matched: false },
  ]);

  const handleUpload = () => {
    setFileUploaded(true);
  };

  const handleAutoMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      // Simple matcher: matching by amount and type
      const newBank = bankTrans.map(bt => {
        const match = erpTrans.find(et => et.amount === bt.amount && et.type === bt.type);
        if (match) {
          return { ...bt, matched: true, erpId: match.id };
        }
        return bt;
      });

      const newErp = erpTrans.map(et => {
        const match = bankTrans.find(bt => bt.amount === et.amount && bt.type === et.type);
        if (match) {
          return { ...et, matched: true };
        }
        return et;
      });

      setBankTrans(newBank);
      setErpTrans(newErp);
      setIsMatching(false);
      setMatchDone(true);
    }, 1500);
  };

  // Stats
  const totalBank = bankTrans.length;
  const matchedBank = bankTrans.filter(b => b.matched).length;
  const unmatchedBank = totalBank - matchedBank;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <RefreshCcw className="text-indigo-500" size={32} />
            Conciliación <span className="text-indigo-500">Bancaria</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Carga extractos bancarios y realiza el cruce automático con tus libros auxiliares contables NIIF.</p>
        </div>
        {fileUploaded && !matchDone && (
          <button 
            onClick={handleAutoMatch}
            disabled={isMatching}
            className="btn-premium flex items-center gap-2"
          >
            <Zap size={18} />
            {isMatching ? 'Conciliando...' : 'Ejecutar Cruce Automático'}
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card py-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo según Extracto</p>
          <p className="text-2xl font-bold text-white mt-1">$24,530,000</p>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight size={12} /> Davivienda Cta. Corriente
          </span>
        </div>
        <div className="glass-card py-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo según Libros</p>
          <p className="text-2xl font-bold text-white mt-1">$24,730,000</p>
          <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 mt-1">
            Cuenta PUC 111005
          </span>
        </div>
        <div className="glass-card py-4 border-rose-500/10">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Diferencia por Conciliar</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">-$200,000</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1">Requiere ajuste contable</span>
        </div>
        <div className="glass-card py-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transacciones Cruzadas</p>
          <p className="text-2xl font-bold text-white mt-1">
            {matchDone ? `${matchedBank} / ${totalBank}` : `0 / ${totalBank}`}
          </p>
          <span className="text-[10px] text-slate-500 font-medium mt-1">
            {matchDone ? 'Match automático exitoso' : 'Carga archivo para iniciar'}
          </span>
        </div>
      </div>

      {/* Main Drag Drop Simulator */}
      {!fileUploaded ? (
        <div 
          onClick={handleUpload}
          className="glass-card h-[250px] flex flex-col items-center justify-center border-dashed border-white/10 hover:border-indigo-500/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud size={32} />
          </div>
          <div className="text-center mt-4 space-y-1">
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Importar extracto bancario</h4>
            <p className="text-xs text-slate-500">Soporta archivos CSV de Bancolombia, Davivienda y BBVA.</p>
          </div>
          <button className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-300">
            Seleccionar Archivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Side */}
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div>
                <h3 className="text-sm font-bold text-white">Extracto Bancario Importado</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Extracto_Davivienda_Marzo.csv</p>
              </div>
              {matchDone && (
                <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle size={12} /> {unmatchedBank} Sin Cruzar
                </span>
              )}
            </div>

            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
              {bankTrans.map((bt) => (
                <div key={bt.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{bt.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <span>{bt.date}</span>
                      <span>•</span>
                      <span className="font-mono">{bt.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className={cn(
                        "text-xs font-mono font-bold",
                        bt.type === 'IN' ? 'text-emerald-400' : 'text-slate-300'
                      )}>
                        {bt.type === 'IN' ? '+' : '-'}${bt.amount.toLocaleString('es-CO')}
                      </p>
                      {bt.matched ? (
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 block">
                          Cruzar a {bt.erpId}
                        </span>
                      ) : (
                        <button className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 underline uppercase tracking-widest mt-0.5 block">
                          Crear Asiento
                        </button>
                      )}
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      bt.matched ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    )}>
                      {bt.matched ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ERP Side */}
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div>
                <h3 className="text-sm font-bold text-white">Libro Auxiliar Contable (1110)</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">ERP General Ledger - Bancos</p>
              </div>
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <Plus size={14} /> Agregar Registro
              </button>
            </div>

            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
              {erpTrans.map((et) => (
                <div key={et.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{et.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <span>{et.date}</span>
                      <span>•</span>
                      <span className="font-mono">{et.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className={cn(
                        "text-xs font-mono font-bold",
                        et.type === 'IN' ? 'text-emerald-400' : 'text-slate-300'
                      )}>
                        {et.type === 'IN' ? '+' : '-'}${et.amount.toLocaleString('es-CO')}
                      </p>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest mt-0.5 block",
                        et.matched ? "text-emerald-400" : "text-slate-500"
                      )}>
                        {et.matched ? 'CONCILIADO' : 'PENDIENTE'}
                      </span>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      et.matched ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-600 border border-white/5"
                    )}>
                      {et.matched ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
