import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaxObligation {
  id: string;
  name: string;
  dueDate: string;
  dueDay: number;
  estimatedAmount: number;
  status: 'critical' | 'warning' | 'info';
  form: string;
}

const taxList: TaxObligation[] = [
  { id: 'OBL-01', name: 'Retención en la fuente (Mensual)', dueDate: '2026-04-12', dueDay: 12, estimatedAmount: 1845000, status: 'critical', form: 'Formulario 350' },
  { id: 'OBL-02', name: 'IVA Declaración (Bimestral)', dueDate: '2026-04-15', dueDay: 15, estimatedAmount: 12450000, status: 'critical', form: 'Formulario 300' },
  { id: 'OBL-03', name: 'Nómina Electrónica (Mensual)', dueDate: '2026-04-10', dueDay: 10, estimatedAmount: 0, status: 'warning', form: 'XML UBL 2.1' },
  { id: 'OBL-04', name: 'ICA Manizales (Bimestral)', dueDate: '2026-04-22', dueDay: 22, estimatedAmount: 685000, status: 'info', form: 'Formulario Municipal' },
  { id: 'OBL-05', name: 'Medios Magnéticos (Exógena)', dueDate: '2026-05-15', dueDay: 15, estimatedAmount: 0, status: 'info', form: 'Formatos 1001-1014' },
];

export const CalendarioFiscal = () => {
  const [currentMonth, setCurrentMonth] = useState('Abril 2026');
  const [selectedDay, setSelectedDay] = useState<number | null>(12);

  // Generate days for April 2026
  // April 1st, 2026 is a Wednesday (3rd day of the week)
  const daysInApril = 30;
  const startDayOffset = 3; // Offset for empty grid cells

  const daysGrid: Array<{ day: number | null; obligation?: TaxObligation }> = [];
  
  // Fill offset cells
  for (let i = 0; i < startDayOffset; i++) {
    daysGrid.push({ day: null });
  }

  // Fill actual days
  for (let day = 1; day <= daysInApril; day++) {
    const matchedObligation = taxList.find(t => t.dueDay === day);
    daysGrid.push({ day, obligation: matchedObligation });
  }

  // Handle selected day description
  const activeObligations = taxList.filter(t => t.dueDay === selectedDay);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CalendarIcon className="text-indigo-500" size={32} />
            Calendario <span className="text-indigo-500">Fiscal 2026</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Control de obligaciones tributarias DIAN y municipales de Frutas La Primavera SAS.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-1 rounded-xl">
          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold text-white px-3">{currentMonth}</span>
          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-8 glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Planificador Mensual</h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <span className="text-slate-400">Crítico (&lt;14 días)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-400">Próximo (&lt;30 días)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-slate-400">Normal (&gt;30 días)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-3">
            <span>Dom</span>
            <span>Lun</span>
            <span>Mar</span>
            <span>Mie</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sab</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysGrid.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => item.day && setSelectedDay(item.day)}
                className={cn(
                  "h-16 rounded-xl border flex flex-col items-center justify-center relative transition-all duration-300 cursor-pointer",
                  item.day ? "hover:border-indigo-500/50 hover:bg-white/[0.01]" : "border-transparent cursor-default",
                  selectedDay === item.day ? "border-indigo-500 bg-indigo-500/[0.03] shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "border-white/5 bg-transparent",
                  item.obligation ? "font-bold text-white" : "text-slate-400"
                )}
              >
                {item.day && (
                  <>
                    <span className="text-xs">{item.day}</span>
                    {item.obligation && (
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5",
                        item.obligation.status === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                        item.obligation.status === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                      )} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Day Details & Table */}
        <div className="lg:col-span-4 space-y-6">
          {/* Day details card */}
          <div className="glass-card space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              Día seleccionado: {selectedDay} de Abril
            </h3>

            {activeObligations.length > 0 ? (
              activeObligations.map((ob, idx) => (
                <div key={idx} className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{ob.name}</h4>
                      <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase tracking-wider">{ob.form}</p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      ob.status === 'critical' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                      ob.status === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                      "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    )}>
                      {ob.status === 'critical' ? 'URGENTE' : ob.status === 'warning' ? 'PRÓXIMO' : 'AL DÍA'}
                    </span>
                  </div>

                  {ob.estimatedAmount > 0 && (
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Valor Estimado a Declarar</p>
                      <p className="text-lg font-bold font-mono text-white mt-0.5">
                        ${ob.estimatedAmount.toLocaleString('es-CO')} COP
                      </p>
                    </div>
                  )}

                  <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5">
                    <Sparkles size={14} />
                    Generar Borrador Declaración
                  </button>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto text-slate-600 mb-2" size={24} />
                <p className="text-xs text-slate-400 font-semibold">Sin vencimientos para esta fecha.</p>
              </div>
            )}
          </div>

          {/* List of all obligations */}
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Calendario de Vencimientos</h3>
            </div>
            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {taxList.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all cursor-pointer" onClick={() => setSelectedDay(t.dueDay)}>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <span className="text-[9px] font-mono text-slate-500">{t.dueDate}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold font-mono text-slate-300">
                      {t.estimatedAmount > 0 ? `$${(t.estimatedAmount/1000000).toFixed(1)}M` : 'N/A'}
                    </p>
                    <span className={cn(
                      "inline-block w-1.5 h-1.5 rounded-full mt-1.5",
                      t.status === 'critical' ? 'bg-rose-500' :
                      t.status === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
