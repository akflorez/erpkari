import React, { useState } from 'react';
import { 
  Users, 
  User, 
  Coins, 
  ArrowUpRight, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Calculator,
  UserPlus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  contract: string;
  eps: string;
  pension: string;
  arlRisk: 'I' | 'III';
}

const employeesList: Employee[] = [
  { id: 'EMP-01', name: 'Carlos Mario Gómez', role: 'Conductor Logística', salary: 1600000, contract: 'Término Fijo', eps: 'Sanitas', pension: 'Porvenir', arlRisk: 'III' },
  { id: 'EMP-02', name: 'María Karina Ramos', role: 'Auxiliar Administrativa', salary: 1423500, contract: 'Indefinido', eps: 'Sura', pension: 'Protección', arlRisk: 'I' },
  { id: 'EMP-03', name: 'Jorge Hernán Rojas', role: 'Director de Operaciones', salary: 4500000, contract: 'Indefinido', eps: 'Sura', pension: 'Colpensiones', arlRisk: 'I' },
];

export const Nomina = () => {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(employeesList[0]);
  const [payrollPeriod, setPayrollPeriod] = useState('Marzo 2026');
  const [successMsg, setSuccessMsg] = useState('');

  // 2026 Colombian Payroll Constants
  const SMMLV_2026 = 1423500;
  const AUX_TRANSPORTE_2026 = 200000;

  // Calculation function
  const calculatePayroll = (emp: Employee) => {
    const basicSalary = emp.salary;
    const qualifiesForAux = basicSalary <= (2 * SMMLV_2026);
    const auxTransport = qualifiesForAux ? AUX_TRANSPORTE_2026 : 0;
    
    // Deducciones
    const deductionSalud = basicSalary * 0.04;
    const deductionPension = basicSalary * 0.04;
    const totalDeducciones = deductionSalud + deductionPension;

    // Devengado
    const totalDevengado = basicSalary + auxTransport;

    // Neto
    const netoPagar = totalDevengado - totalDeducciones;

    // Aportes Patronales (Exempt of Salud and Parafiscales for salaries < 10 SMMLV under Art 114-1 ET)
    const exemptParafiscales = basicSalary < (10 * SMMLV_2026);
    const patronalSalud = exemptParafiscales ? 0 : (basicSalary * 0.085);
    const patronalPension = basicSalary * 0.12;
    
    // ARL Risk rates: I (0.522%), III (2.436%)
    const arlRate = emp.arlRisk === 'I' ? 0.00522 : 0.02436;
    const arlAmount = basicSalary * arlRate;
    
    const cajaCompensacion = basicSalary * 0.04;
    const totalAportesPatronales = patronalSalud + patronalPension + arlAmount + cajaCompensacion;

    // Provisiones NIIF (Cesantías 8.33%, Prima 8.33%, Intereses 1% of Cesantías per month/12, Vacaciones 4.17%)
    const provCesantias = (basicSalary + auxTransport) * 0.0833;
    const provPrima = (basicSalary + auxTransport) * 0.0833;
    const provIntereses = provCesantias * 0.12; // 12% annual -> 1% monthly
    const provVacaciones = basicSalary * 0.0417;
    const totalProvisiones = provCesantias + provPrima + provIntereses + provVacaciones;

    const totalCompanyCost = totalDevengado + totalAportesPatronales + totalProvisiones;

    return {
      basicSalary,
      auxTransport,
      totalDevengado,
      deductionSalud,
      deductionPension,
      totalDeducciones,
      netoPagar,
      patronalSalud,
      patronalPension,
      arlAmount,
      cajaCompensacion,
      totalAportesPatronales,
      provCesantias,
      provPrima,
      provIntereses,
      provVacaciones,
      totalProvisiones,
      totalCompanyCost
    };
  };

  const handlePostPayroll = () => {
    setSuccessMsg('¡Comprobante contable de nómina consolidado y contabilizado en PUC 5105 / 2370 con éxito!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="text-indigo-500" size={32} />
            Liquidación <span className="text-indigo-500">de Nómina</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Gestión de personal y nómina electrónica ajustada a normativas laborales de Colombia 2026.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl border-white/5 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">PERÍODO:</span>
            <select 
              value={payrollPeriod} 
              onChange={(e) => setPayrollPeriod(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="Marzo 2026">Marzo 2026</option>
              <option value="Abril 2026">Abril 2026</option>
            </select>
          </div>
          <button className="btn-premium">
            <UserPlus size={16} />
            Contratar
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span className="font-bold text-sm">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Employees List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Colaboradores</h3>
          {employeesList.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmp(emp)}
              className={cn(
                "glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden",
                selectedEmp?.id === emp.id ? "border-indigo-500 bg-indigo-500/[0.03] shadow-[0_0_15px_rgba(99,102,241,0.1)]" : ""
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm",
                selectedEmp?.id === emp.id ? "bg-indigo-500 text-white" : "bg-slate-900 text-slate-500 border border-white/5"
              )}>
                {emp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white leading-tight">{emp.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{emp.role}</p>
                <p className="text-[11px] text-indigo-400 font-mono mt-1 font-bold">
                  ${emp.salary.toLocaleString('es-CO')} COP
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Calculator Panel */}
        {selectedEmp && (
          <div className="lg:col-span-8 glass-card space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded uppercase tracking-wider">
                  Detalle de Liquidación
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{selectedEmp.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedEmp.role} • Riesgo {selectedEmp.arlRisk} ARL</p>
              </div>
              <button 
                onClick={handlePostPayroll}
                className="btn-premium py-2 px-4 self-start sm:self-center text-xs"
              >
                <Calculator size={14} />
                Contabilizar Nómina
              </button>
            </div>

            {/* Calculations Grid */}
            {(() => {
              const calc = calculatePayroll(selectedEmp);
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Column 1: Devengado vs Deducciones */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Devengado</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Salario Básico:</span>
                          <span className="font-mono text-white font-bold">${calc.basicSalary.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Aux. Transporte:</span>
                          <span className="font-mono text-white font-bold">${calc.auxTransport.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2">
                          <span className="text-indigo-400">Total Devengado:</span>
                          <span className="font-mono text-white">${calc.totalDevengado.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Deducciones</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Salud (4%):</span>
                          <span className="font-mono text-white font-bold">-${calc.deductionSalud.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pensión (4%):</span>
                          <span className="font-mono text-white font-bold">-${calc.deductionPension.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2">
                          <span className="text-rose-400">Total Deducciones:</span>
                          <span className="font-mono text-white">${calc.totalDeducciones.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neto a pagar en banco</p>
                      <p className="text-2xl font-bold font-mono text-white mt-1">
                        ${calc.netoPagar.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Aportes Patronales */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Aportes Patronales</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Salud (8.5%):</span>
                        <span className="font-mono text-white font-bold">
                          {calc.patronalSalud === 0 ? 'Exento (Art. 114-1)' : `$${calc.patronalSalud.toLocaleString('es-CO')}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pensión (12%):</span>
                        <span className="font-mono text-white font-bold">${calc.patronalPension.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ARL Riesgo {selectedEmp.arlRisk}:</span>
                        <span className="font-mono text-white font-bold">${calc.arlAmount.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Caja Comp. (4%):</span>
                        <span className="font-mono text-white font-bold">${calc.cajaCompensacion.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2">
                        <span className="text-indigo-400">Total Aportes:</span>
                        <span className="font-mono text-white">${calc.totalAportesPatronales.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Provisiones NIIF */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Provisiones NIIF</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cesantías (8.33%):</span>
                        <span className="font-mono text-white font-bold">${calc.provCesantias.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Prima de Serv. (8.33%):</span>
                        <span className="font-mono text-white font-bold">${calc.provPrima.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Intereses (1%):</span>
                        <span className="font-mono text-white font-bold">${calc.provIntereses.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vacaciones (4.17%):</span>
                        <span className="font-mono text-white font-bold">${calc.provVacaciones.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2">
                        <span className="text-indigo-400">Total Provisiones:</span>
                        <span className="font-mono text-white">${calc.totalProvisiones.toLocaleString('es-CO')}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl mt-6">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Costo total para la Empresa</p>
                      <p className="text-xl font-bold font-mono text-white mt-1">
                        ${calc.totalCompanyCost.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
