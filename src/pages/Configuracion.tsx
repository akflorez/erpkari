import React, { useState } from 'react';
import { 
  Settings, 
  BookOpen, 
  Compass, 
  MapPin, 
  Percent, 
  Search, 
  Plus, 
  Edit2, 
  Check,
  AlertTriangle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Configuracion = () => {
  const [subTab, setSubTab] = useState<'puc' | 'costCenters' | 'operations' | 'taxes'>('puc');

  // 1. PUC State
  const [pucCuentas, setPucCuentas] = useState([
    { code: '110505', name: 'Caja General', type: 'Débito', group: 'Activo' },
    { code: '111005', name: 'Bancos - Cta Corriente', type: 'Débito', group: 'Activo' },
    { code: '143501', name: 'Inventario de Frutas Frescas', type: 'Débito', group: 'Activo' },
    { code: '236540', name: 'ReteFuente compras (2.5%)', type: 'Crédito', group: 'Pasivo' },
    { code: '240805', name: 'IVA por pagar', type: 'Crédito', group: 'Pasivo' },
    { code: '413501', name: 'Ventas de Mango Tommy', type: 'Crédito', group: 'Ingresos' },
    { code: '510506', name: 'Sueldos de Personal', type: 'Débito', group: 'Gastos' },
  ]);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchPuc, setSearchPuc] = useState('');

  // 2. Cost Centers State
  const [costCenters, setCostCenters] = useState([
    { code: 'CC-01', name: 'Administración General', leader: 'Jorge Rojas', budget: 15000000, spent: 12400000 },
    { code: 'CC-02', name: 'Producción Agrícola', leader: 'Martha Díaz', budget: 35000000, spent: 36200000 },
    { code: 'CC-03', name: 'Logística y Distribución', leader: 'Carlos Gómez', budget: 18000000, spent: 17800000 },
    { code: 'CC-04', name: 'Ventas y Comercial', leader: 'Andrés Tobón', budget: 12000000, spent: 8900000 },
  ]);

  // 3. Operation Centers State
  const [operations, setOperations] = useState([
    { code: 'COP-01', name: 'Bodega Principal Manizales', type: 'Bodega', city: 'Manizales', active: true },
    { code: 'COP-02', name: 'Punto de Venta Alameda', type: 'Pto. Venta', city: 'Manizales', active: true },
    { code: 'COP-03', name: 'Sede Distribución Bogotá', type: 'Bodega', city: 'Bogotá', active: true },
    { code: 'COP-04', name: 'Ruta Cafetera Despachos', type: 'Ruta', city: 'Pereira', active: false },
  ]);

  // 4. Taxes State
  const taxes = [
    { code: 'IVA-19', name: 'IVA General', rate: '19%', base: 'Valor servicio/bien gravado', account: '240805' },
    { code: 'IVA-05', name: 'IVA Diferencial', rate: '5%', base: 'Bienes sección arancel', account: '240810' },
    { code: 'RTF-25', name: 'ReteFuente Compras PJ', rate: '2.5%', base: 'Compra de bienes declarantes', account: '236540' },
    { code: 'RTF-35', name: 'ReteFuente Compras PN', rate: '3.5%', base: 'Compra de bienes no declarantes', account: '236540' },
    { code: 'R-ICA', name: 'ReteICA Manizales', rate: '5.5 x mil', base: 'Actividad CIIU 4631', account: '236701' },
  ];

  const handleEditPuc = (code: string, currentName: string) => {
    setEditingCode(code);
    setEditName(currentName);
  };

  const handleSavePuc = (code: string) => {
    setPucCuentas(prev => prev.map(c => c.code === code ? { ...c, name: editName } : c));
    setEditingCode(null);
  };

  const filteredPuc = pucCuentas.filter(c => 
    c.code.includes(searchPuc) || c.name.toLowerCase().includes(searchPuc.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Settings className="text-indigo-500" size={32} />
          Parametrización <span className="text-indigo-500">del Sistema</span>
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Configuración de cuentas, costos, dependencias e impuestos nacionales vigentes 2026.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'puc', label: 'Plan de Cuentas (PUC)', icon: BookOpen },
          { id: 'costCenters', label: 'Centros de Costo', icon: Compass },
          { id: 'operations', label: 'Centros de Operación', icon: MapPin },
          { id: 'taxes', label: 'Tarifas de Impuestos', icon: Percent },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap",
                isActive 
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5 rounded-t-xl" 
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="glass-card p-6">
        {/* Tab 1: PUC */}
        {subTab === 'puc' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text" 
                  value={searchPuc}
                  onChange={(e) => setSearchPuc(e.target.value)}
                  placeholder="Buscar cuenta o código..."
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button className="btn-premium py-2 px-4 text-xs font-bold flex items-center gap-1.5 self-start">
                <Plus size={14} /> Auxiliar PUC
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <th className="pb-3 w-32">Código</th>
                    <th className="pb-3">Nombre de Cuenta</th>
                    <th className="pb-3 w-32">Naturaleza</th>
                    <th className="pb-3 w-32">Clase NIIF</th>
                    <th className="pb-3 w-16">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredPuc.map((cuenta) => (
                    <tr key={cuenta.code} className="hover:bg-white/[0.01]">
                      <td className="py-3 font-mono font-bold text-indigo-300">{cuenta.code}</td>
                      <td className="py-3">
                        {editingCode === cuenta.code ? (
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSavePuc(cuenta.code)}
                            className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-white focus:outline-none w-full max-w-sm"
                          />
                        ) : (
                          <span className="text-white font-medium">{cuenta.name}</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400 font-semibold">{cuenta.type}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          {cuenta.group}
                        </span>
                      </td>
                      <td className="py-3">
                        {editingCode === cuenta.code ? (
                          <button 
                            onClick={() => handleSavePuc(cuenta.code)}
                            className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            <Check size={14} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleEditPuc(cuenta.code, cuenta.name)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Cost Centers */}
        {subTab === 'costCenters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trazabilidad de Gasto por Centros</h3>
              <button className="btn-premium py-2 px-4 text-xs font-bold flex items-center gap-1.5">
                <Plus size={14} /> Centro de Costo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {costCenters.map((cc) => {
                const percent = (cc.spent / cc.budget) * 100;
                const isExceeded = percent >= 100;
                const isAtRisk = percent >= 90 && percent < 100;

                return (
                  <div key={cc.code} className="p-5 bg-slate-900/50 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold">{cc.code}</span>
                        <h4 className="text-sm font-bold text-white mt-1">{cc.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Responsable: {cc.leader}</p>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border",
                        isExceeded ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                        isAtRisk ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse" :
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      )}>
                        {isExceeded ? 'Excedido' : isAtRisk ? 'En Riesgo' : 'Óptimo'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">Gasto real: <strong className="text-slate-300">${cc.spent.toLocaleString('es-CO')}</strong></span>
                        <span className="text-slate-500">Presupuesto: <strong className="text-slate-300">${cc.budget.toLocaleString('es-CO')}</strong></span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            isExceeded ? "bg-rose-500" : isAtRisk ? "bg-amber-500" : "bg-emerald-500"
                          )} 
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Operation Centers */}
        {subTab === 'operations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dependencias Físicas</h3>
              <button className="btn-premium py-2 px-4 text-xs font-bold flex items-center gap-1.5">
                <Plus size={14} /> Centro de Operación
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <th className="pb-3 w-32">Código</th>
                    <th className="pb-3">Nombre</th>
                    <th className="pb-3 w-32">Tipo</th>
                    <th className="pb-3 w-32">Ciudad</th>
                    <th className="pb-3 w-28">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {operations.map((op) => (
                    <tr key={op.code} className="hover:bg-white/[0.01]">
                      <td className="py-3 font-mono font-bold text-indigo-300">{op.code}</td>
                      <td className="py-3 text-white font-semibold">{op.name}</td>
                      <td className="py-3 text-slate-400 font-semibold">{op.type}</td>
                      <td className="py-3 text-slate-300 font-semibold">{op.city}</td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                          op.active 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-slate-800 border-slate-700 text-slate-500"
                        )}>
                          {op.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Tax Rates */}
        {subTab === 'taxes' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-amber-400 text-xs">
              <AlertTriangle className="flex-shrink-0" size={18} />
              <div className="space-y-1">
                <p className="font-bold">Tarifas de Referencia Nacional</p>
                <p className="text-slate-400 leading-relaxed">Las tarifas de impuestos y retención en la fuente se actualizan automáticamente según las reformas tributarias nacionales y decretos vigentes para el año fiscal 2026.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <th className="pb-3 w-32">Identificador</th>
                    <th className="pb-3">Impuesto / Retención</th>
                    <th className="pb-3 w-28">Tarifa</th>
                    <th className="pb-3">Base de Cálculo</th>
                    <th className="pb-3 w-28">Cuenta PUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {taxes.map((t) => (
                    <tr key={t.code} className="hover:bg-white/[0.01]">
                      <td className="py-3 font-mono font-bold text-indigo-300">{t.code}</td>
                      <td className="py-3 text-white font-semibold">{t.name}</td>
                      <td className="py-3 text-emerald-400 font-bold font-mono">{t.rate}</td>
                      <td className="py-3 text-slate-400 font-medium">{t.base}</td>
                      <td className="py-3 font-mono font-semibold text-slate-300">{t.account}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
