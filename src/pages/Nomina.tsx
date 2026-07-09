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
  UserPlus,
  X,
  FileDown,
  AlertCircle,
  Calendar,
  Settings,
  Briefcase,
  Edit2
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

interface Novelty {
  type: 'vacaciones' | 'incapacidad' | 'licencia' | 'ausencia';
  days: number;
}

export const Nomina = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'EMP-01', name: 'Carlos Mario Gómez', role: 'Conductor Logística', salary: 1600000, contract: 'Término Fijo', eps: 'Sanitas', pension: 'Porvenir', arlRisk: 'III' },
    { id: 'EMP-02', name: 'María Karina Ramos', role: 'Auxiliar Administrativa', salary: 1423500, contract: 'Indefinido', eps: 'Sura', pension: 'Protección', arlRisk: 'I' },
    { id: 'EMP-03', name: 'Jorge Hernán Rojas', role: 'Director de Operaciones', salary: 4500000, contract: 'Indefinido', eps: 'Sura', pension: 'Colpensiones', arlRisk: 'I' },
  ]);

  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  
  if (!selectedEmp && employees.length > 0) {
    setSelectedEmp(employees[0]);
  }

  const [payrollPeriod, setPayrollPeriod] = useState('Marzo 2026');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modals state
  const [showHireModal, setShowHireModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoveltyModal, setShowNoveltyModal] = useState(false);
  const [showMassModal, setShowMassModal] = useState(false);

  // Novelties dictionary mapping employee ID to active novelty
  const [novelties, setNovelties] = useState<Record<string, Novelty>>({
    'EMP-01': { type: 'vacaciones', days: 5 } // Carlos Gomez starts with 5 days of vacation as sample data
  });

  // Form states for Hiring/Editing
  const [name, setName] = useState('');
  const [role, setRole] = useState('Operario Agrícola');
  const [salary, setSalary] = useState(1423500);
  const [contract, setContract] = useState('Indefinido');
  const [eps, setEps] = useState('Sura');
  const [pension, setPension] = useState('Protección');
  const [arlRisk, setArlRisk] = useState<'I' | 'III'>('I');
  const [editId, setEditId] = useState<string | null>(null);

  // Form states for Novelties
  const [noveltyType, setNoveltyType] = useState<'vacaciones' | 'incapacidad' | 'licencia' | 'ausencia'>('vacaciones');
  const [noveltyDays, setNoveltyDays] = useState(3);

  // 2026 Colombian Payroll Constants
  const SMMLV_2026 = 1423500;
  const AUX_TRANSPORTE_2026 = 200000;

  // Calculation function accounting for novelties
  const calculatePayroll = (emp: Employee) => {
    const basicSalary = emp.salary;
    const activeNovelty = novelties[emp.id];

    let workedDays = 30;
    let noveltyDays = 0;
    let earnedSalary = basicSalary;
    let noveltyPayment = 0;
    let qualifiesForAux = basicSalary <= (2 * SMMLV_2026);
    let auxTransport = qualifiesForAux ? AUX_TRANSPORTE_2026 : 0;

    if (activeNovelty) {
      noveltyDays = activeNovelty.days;
      workedDays = 30 - noveltyDays;
      
      // Earned salary proportional to worked days
      earnedSalary = (basicSalary / 30) * workedDays;
      
      // Proportional aux. transporte
      auxTransport = qualifiesForAux ? (AUX_TRANSPORTE_2026 / 30) * workedDays : 0;

      // Novelty cost calculation
      if (activeNovelty.type === 'vacaciones') {
        // Vacaciones pagadas al 100% del básico
        noveltyPayment = (basicSalary / 30) * noveltyDays;
      } else if (activeNovelty.type === 'incapacidad') {
        // Incapacidad médica general pagada al 66.67%
        noveltyPayment = (basicSalary / 30) * noveltyDays * 0.6667;
      } else if (activeNovelty.type === 'licencia') {
        // Licencia remunerada pagada al 100%
        noveltyPayment = (basicSalary / 30) * noveltyDays;
      } else if (activeNovelty.type === 'ausencia') {
        // Ausencia no remunerada pagada a $0
        noveltyPayment = 0;
      }
    }

    const totalDevengado = earnedSalary + noveltyPayment;

    // Deducciones (Salud 4%, Pensión 4% based on devengado excluding aux. transporte, but including vacation/licencia/incapacidad base)
    // For simplicity, we calculate deductions based on basic salary components
    const baseSeguridadSocial = earnedSalary + noveltyPayment;
    const deductionSalud = baseSeguridadSocial * 0.04;
    const deductionPension = baseSeguridadSocial * 0.04;
    const totalDeducciones = deductionSalud + deductionPension;

    // Neto
    const netoPagar = (earnedSalary + noveltyPayment + auxTransport) - totalDeducciones;

    // Aportes Patronales (Exempt of Salud and Parafiscales for salaries < 10 SMMLV under Art 114-1 ET)
    const exemptParafiscales = basicSalary < (10 * SMMLV_2026);
    const patronalSalud = exemptParafiscales ? 0 : (baseSeguridadSocial * 0.085);
    const patronalPension = baseSeguridadSocial * 0.12;
    
    // ARL Risk rates: I (0.522%), III (2.436%)
    const arlRate = emp.arlRisk === 'I' ? 0.00522 : 0.02436;
    const arlAmount = baseSeguridadSocial * arlRate;
    
    const cajaCompensacion = baseSeguridadSocial * 0.04;
    const totalAportesPatronales = patronalSalud + patronalPension + arlAmount + cajaCompensacion;

    // Provisiones NIIF (Cesantías 8.33%, Prima 8.33%, Intereses 1% monthly, Vacaciones 4.17%)
    // Base includes aux. transporte for Cesantías and Prima
    const baseProvisiones = earnedSalary + noveltyPayment + auxTransport;
    const provCesantias = baseProvisiones * 0.0833;
    const provPrima = baseProvisiones * 0.0833;
    const provIntereses = provCesantias * 0.12;
    const provVacaciones = baseSeguridadSocial * 0.0417;
    const totalProvisiones = provCesantias + provPrima + provIntereses + provVacaciones;

    const totalCompanyCost = totalDevengado + auxTransport + totalAportesPatronales + totalProvisiones;

    return {
      workedDays,
      noveltyDays,
      earnedSalary,
      noveltyPayment,
      auxTransport,
      totalDevengado: totalDevengado + auxTransport,
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
    setSuccessMsg(`¡Comprobante contable de nómina para ${selectedEmp?.name} contabilizado con éxito!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handlePostMassPayroll = () => {
    setShowMassModal(false);
    setSuccessMsg(`¡Liquidación de nómina automática consolidada para los ${employees.length} colaboradores procesada con éxito y registrada en Libro Diario!`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `EMP-0${employees.length + 1}`;
    const newEmp: Employee = {
      id: nextId,
      name,
      role,
      salary,
      contract,
      eps,
      pension,
      arlRisk
    };

    setEmployees([...employees, newEmp]);
    setSelectedEmp(newEmp);
    setShowHireModal(false);
    resetForm();
  };

  const openEditModal = (emp: Employee) => {
    setEditId(emp.id);
    setName(emp.name);
    setRole(emp.role);
    setSalary(emp.salary);
    setContract(emp.contract);
    setEps(emp.eps);
    setPension(emp.pension);
    setArlRisk(emp.arlRisk);
    setShowEditModal(true);
  };

  const handleEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployees(prev => prev.map(emp => {
      if (emp.id === editId) {
        const updated = { ...emp, name, role, salary, contract, eps, pension, arlRisk };
        if (selectedEmp?.id === editId) {
          setSelectedEmp(updated);
        }
        return updated;
      }
      return emp;
    }));
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setRole('Operario Agrícola');
    setSalary(1423500);
    setContract('Indefinido');
    setEditId(null);
  };

  const handleAddNovelty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    setNovelties(prev => ({
      ...prev,
      [selectedEmp.id]: { type: noveltyType, days: noveltyDays }
    }));
    setShowNoveltyModal(false);
  };

  const handleRemoveNovelty = (empId: string) => {
    setNovelties(prev => {
      const copy = { ...prev };
      delete copy[empId];
      return copy;
    });
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
          <p className="text-slate-500 mt-1 font-medium">Gestión de personal, novedades, vacaciones y nómina electrónica masiva para Colombia 2026.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMassModal(true)}
            className="btn-ghost border border-white/5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold flex items-center gap-1.5"
          >
            <Calculator size={16} />
            Nómina Automática (Masiva)
          </button>
          <button 
            onClick={() => setShowHireModal(true)}
            className="btn-premium"
          >
            <UserPlus size={16} />
            Contratar
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 size={20} />
          <span className="font-bold text-sm">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Employees List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Colaboradores</h3>
          {employees.map((emp) => {
            const hasNovelty = novelties[emp.id];
            return (
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
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white leading-tight">{emp.name}</h4>
                    {hasNovelty && (
                      <span className="text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {hasNovelty.type}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{emp.role}</p>
                  <p className="text-[11px] text-indigo-400 font-mono mt-1 font-bold">
                    ${emp.salary.toLocaleString('es-CO')} COP
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Calculator Panel */}
        {selectedEmp && (
          <div className="lg:col-span-8 glass-card space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded uppercase tracking-wider">
                  Detalle de Liquidación ({payrollPeriod})
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <h3 className="text-xl font-bold text-white">{selectedEmp.name}</h3>
                  <button 
                    onClick={() => openEditModal(selectedEmp)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Editar perfil de trabajador"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedEmp.role} • Riesgo {selectedEmp.arlRisk} ARL • Contrato {selectedEmp.contract}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowNoveltyModal(true)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <Calendar size={14} className="text-indigo-400" />
                  Novedad
                </button>
                <button 
                  onClick={handlePostPayroll}
                  className="btn-premium py-2 px-4 text-xs"
                >
                  <Calculator size={14} />
                  Contabilizar Individual
                </button>
              </div>
            </div>

            {/* Calculations Grid */}
            {(() => {
              const calc = calculatePayroll(selectedEmp);
              const activeNovelty = novelties[selectedEmp.id];
              return (
                <div className="space-y-8">
                  {/* Novelty status banner */}
                  {activeNovelty && (
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs text-amber-400">
                      <div className="flex items-center gap-3">
                        <AlertCircle size={16} />
                        <span>
                          Reportada novedad de <strong>{activeNovelty.type.toUpperCase()}</strong> por <strong>{activeNovelty.days} días</strong>. 
                          Días laborados normales liquidando: {calc.workedDays} días.
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveNovelty(selectedEmp.id)}
                        className="text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Devengado vs Deducciones */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Devengado</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Salario Laborado ({calc.workedDays}d):</span>
                            <span className="font-mono text-white font-bold">${calc.earnedSalary.toLocaleString('es-CO')}</span>
                          </div>
                          {activeNovelty && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Novedad ({calc.noveltyDays}d):</span>
                              <span className="font-mono text-white font-bold">${calc.noveltyPayment.toLocaleString('es-CO')}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Aux. Transporte:</span>
                            <span className="font-mono text-white font-bold">${calc.auxTransport.toLocaleString('es-CO')}</span>
                          </div>
                          <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2 font-mono">
                            <span className="text-indigo-400">Total Devengado:</span>
                            <span className="text-white">${calc.totalDevengado.toLocaleString('es-CO')}</span>
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
                          <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2 font-mono">
                            <span className="text-rose-400">Total Deducciones:</span>
                            <span className="text-white">${calc.totalDeducciones.toLocaleString('es-CO')}</span>
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
                        <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2 font-mono">
                          <span className="text-indigo-400">Total Aportes:</span>
                          <span className="text-white">${calc.totalAportesPatronales.toLocaleString('es-CO')}</span>
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
                        <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold mt-2 font-mono">
                          <span className="text-indigo-400">Total Provisiones:</span>
                          <span className="text-white">${calc.totalProvisiones.toLocaleString('es-CO')}</span>
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
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* 1. Modal: HIRE EMPLOYEE */}
      {showHireModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-md overflow-hidden border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <UserPlus className="text-indigo-400" size={18} />
                <h3 className="text-lg font-bold text-white">Nuevo Registro Laboral</h3>
              </div>
              <button onClick={() => setShowHireModal(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Juan Carlos Pérez"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargo</label>
                  <input 
                    type="text" required value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ej. Operario Agrícola"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Contrato</label>
                  <select value={contract} onChange={(e) => setContract(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="Indefinido">Término Indefinido</option>
                    <option value="Término Fijo">Término Fijo</option>
                    <option value="Obra o Labor">Obra o Labor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Salario Básico ($)</label>
                  <input 
                    type="number" required value={salary} onChange={(e) => setSalary(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Riesgo ARL</label>
                  <select value={arlRisk} onChange={(e) => setArlRisk(e.target.value as 'I' | 'III')} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="I">Riesgo I (Oficina)</option>
                    <option value="III">Riesgo III (Transporte/Campo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entidad EPS</label>
                  <select value={eps} onChange={(e) => setEps(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="Sura">EPS Sura</option>
                    <option value="Sanitas">EPS Sanitas</option>
                    <option value="Compensar">Compensar EPS</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fondo Pensión</label>
                  <select value={pension} onChange={(e) => setPension(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="Protección">Protección</option>
                    <option value="Porvenir">Porvenir</option>
                    <option value="Colpensiones">Colpensiones</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowHireModal(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-400">
                  Cancelar
                </button>
                <button type="submit" className="btn-premium py-2 px-4 font-bold text-xs">
                  Guardar Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: EDIT EMPLOYEE PROFILE */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-md overflow-hidden border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Settings className="text-indigo-400" size={18} />
                <h3 className="text-lg font-bold text-white">Editar Perfil del Trabajador</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditEmployee} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Juan Carlos Pérez"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargo</label>
                  <input 
                    type="text" required value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ej. Operario Agrícola"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Contrato</label>
                  <select value={contract} onChange={(e) => setContract(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="Indefinido">Término Indefinido</option>
                    <option value="Término Fijo">Término Fijo</option>
                    <option value="Obra o Labor">Obra o Labor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Salario Básico ($)</label>
                  <input 
                    type="number" required value={salary} onChange={(e) => setSalary(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Riesgo ARL</label>
                  <select value={arlRisk} onChange={(e) => setArlRisk(e.target.value as 'I' | 'III')} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="I">Riesgo I (Oficina)</option>
                    <option value="III">Riesgo III (Transporte/Campo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entidad EPS</label>
                  <select value={eps} onChange={(e) => setEps(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="Sura">EPS Sura</option>
                    <option value="Sanitas">EPS Sanitas</option>
                    <option value="Compensar">Compensar EPS</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fondo Pensión</label>
                  <select value={pension} onChange={(e) => setPension(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="Protección">Protección</option>
                    <option value="Porvenir">Porvenir</option>
                    <option value="Colpensiones">Colpensiones</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-400">
                  Cancelar
                </button>
                <button type="submit" className="btn-premium py-2 px-4 font-bold text-xs">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: ADD NOVELTY (VACACIONES, INCAPACIDADES, LICENCIAS, AUSENCIAS) */}
      {showNoveltyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-sm overflow-hidden border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Calendar className="text-indigo-400" size={18} />
                <h3 className="text-sm font-bold text-white">Ingresar Novedad Laboral</h3>
              </div>
              <button onClick={() => setShowNoveltyModal(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNovelty} className="p-6 space-y-4">
              <div className="p-2.5 bg-slate-900 rounded-xl text-[10px] text-slate-500">
                Colaborador seleccionado: <strong className="text-slate-300">{selectedEmp?.name}</strong>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Tipo de Novedad</label>
                <select 
                  value={noveltyType} 
                  onChange={(e) => setNoveltyType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="vacaciones">Vacaciones Remuneradas</option>
                  <option value="incapacidad">Incapacidad Médica (66.67%)</option>
                  <option value="licencia">Licencia Remunerada (100%)</option>
                  <option value="ausencia">Ausencia No Remunerada (Descuento)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Cantidad de Días</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30" 
                  required 
                  value={noveltyDays}
                  onChange={(e) => setNoveltyDays(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowNoveltyModal(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-400">
                  Cancelar
                </button>
                <button type="submit" className="btn-premium py-2 px-4 font-bold text-xs">
                  Ingresar Novedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: MASS PAYROLL (LIQUIDACIÓN AUTOMÁTICA) */}
      {showMassModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-2xl overflow-hidden border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Calculator className="text-indigo-400" size={20} />
                <h3 className="text-lg font-bold text-white">Liquidación de Nómina Automática</h3>
              </div>
              <button onClick={() => setShowMassModal(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Period selector */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Mes</label>
                  <select
                    value={payrollPeriod.split(' ')[0]}
                    onChange={(e) => setPayrollPeriod(`${e.target.value} ${payrollPeriod.split(' ')[1]}`)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Año</label>
                  <select
                    value={payrollPeriod.split(' ')[1]}
                    onChange={(e) => setPayrollPeriod(`${payrollPeriod.split(' ')[0]} ${e.target.value}`)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Período</label>
                  <select
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="mensual">Mensual completo</option>
                    <option value="q1">1ª quincena (1–15)</option>
                    <option value="q2">2ª quincena (16–30)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <p className="text-white font-bold">Consolidación de Liquidación</p>
                  <p className="text-slate-500">Período: <span className="text-indigo-400 font-bold">{payrollPeriod}</span> · Se procesarán todos los colaboradores registrados.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Colaboradores</p>
                  <p className="text-lg font-bold text-indigo-400">{employees.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      <th className="pb-3">Nombre</th>
                      <th className="pb-3">Novedades</th>
                      <th className="pb-3 text-right">Deducciones</th>
                      <th className="pb-3 text-right">Aportes Patronales</th>
                      <th className="pb-3 text-right">Neto a Pagar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {employees.map((emp) => {
                      const calc = calculatePayroll(emp);
                      const activeNovelty = novelties[emp.id];
                      return (
                        <tr key={emp.id} className="hover:bg-white/[0.01]">
                          <td className="py-2.5">
                            <p className="font-bold text-white">{emp.name}</p>
                            <p className="text-[9px] text-slate-500">{emp.role}</p>
                          </td>
                          <td className="py-2.5">
                            {activeNovelty ? (
                              <span className="text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {activeNovelty.type} ({activeNovelty.days}d)
                              </span>
                            ) : (
                              <span className="text-[8px] font-bold bg-slate-900 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Ninguna
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-right font-mono text-rose-400 font-semibold">
                            -${calc.totalDeducciones.toLocaleString('es-CO')}
                          </td>
                          <td className="py-2.5 text-right font-mono text-slate-400">
                            ${calc.totalAportesPatronales.toLocaleString('es-CO')}
                          </td>
                          <td className="py-2.5 text-right font-mono text-indigo-400 font-bold">
                            ${calc.netoPagar.toLocaleString('es-CO')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              {(() => {
                const grandTotalNet = employees.reduce((sum, emp) => sum + calculatePayroll(emp).netoPagar, 0);
                const grandTotalCost = employees.reduce((sum, emp) => sum + calculatePayroll(emp).totalCompanyCost, 0);
                return (
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5 text-xs">
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Desembolso Neto Bancario</p>
                      <p className="text-lg font-bold font-mono text-white mt-0.5">${grandTotalNet.toLocaleString('es-CO')} COP</p>
                    </div>
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Costo Consolidado Empresa (NIIF)</p>
                      <p className="text-lg font-bold font-mono text-indigo-400 mt-0.5">${grandTotalCost.toLocaleString('es-CO')} COP</p>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowMassModal(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-400">
                  Cancelar
                </button>
                <button 
                  onClick={handlePostMassPayroll}
                  className="btn-premium py-2.5 px-6 font-bold text-xs"
                >
                  Confirmar Liquidación Masiva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
