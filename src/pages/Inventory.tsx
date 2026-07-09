import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  Plus,
  AlertCircle,
  Truck,
  Layers,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Inventory = () => {
  const [productList, setProductList] = useState([
    { id: '1', name: 'Mango Tommy Atkins', category: 'Frutas', stock: 1200, minStock: 500, unit: 'kg', cost: 3200, price: 4500, status: 'normal' },
    { id: '2', name: 'Papaya Criolla', category: 'Frutas', stock: 12, minStock: 100, unit: 'kg', cost: 1800, price: 2500, status: 'critical' },
    { id: '3', name: 'Banano Urabá', category: 'Frutas', stock: 450, minStock: 400, unit: 'kg', cost: 1200, price: 1800, status: 'warning' },
    { id: '4', name: 'Aguacate Hass', category: 'Frutas', stock: 800, minStock: 300, unit: 'kg', cost: 5500, price: 7800, status: 'normal' },
    { id: '5', name: 'Piña Oro Miel', category: 'Frutas', stock: 0, minStock: 200, unit: 'unid', cost: 2800, price: 4200, status: 'out' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frutas');
  const [stock, setStock] = useState(100);
  const [minStock, setMinStock] = useState(50);
  const [unit, setUnit] = useState('kg');
  const [cost, setCost] = useState(3000);
  const [price, setPrice] = useState(4500);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate status based on stock and minStock
    let status: 'normal' | 'warning' | 'critical' | 'out' = 'normal';
    if (stock === 0) {
      status = 'out';
    } else if (stock < minStock / 2) {
      status = 'critical';
    } else if (stock < minStock) {
      status = 'warning';
    }

    const newProd = {
      id: String(productList.length + 1),
      name,
      category,
      stock,
      minStock,
      unit,
      cost,
      price,
      status
    };

    setProductList([...productList, newProd]);
    setShowModal(false);
    
    // Reset form fields
    setName('');
    setStock(100);
    setMinStock(50);
    setCost(3000);
    setPrice(4500);
  };

  // Dynamic statistics
  const totalSKUs = productList.length;
  const criticalAlerts = productList.filter(p => p.status === 'critical' || p.status === 'out').length;
  const totalValuation = productList.reduce((sum, p) => sum + (p.stock * p.cost), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Package className="text-indigo-500" size={32} />
            Control de <span className="text-indigo-500">Inventarios</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Gestión de stock, costos y alertas críticas · Frutas La Primavera</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost border border-white/5 bg-white/5">
            <Truck size={18} />
            Movimientos
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-premium"
          >
            <Plus size={18} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card flex items-center gap-4 py-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total SKUs</p>
            <p className="text-2xl font-bold text-white">{totalSKUs}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 py-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alertas Críticas</p>
            <p className="text-2xl font-bold text-white">{criticalAlerts}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 py-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valorización</p>
            <p className="text-2xl font-bold text-white">${(totalValuation / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o SKU..."
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-white/5 text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2">
              <Filter size={14} />
              Filtros
            </button>
            <select className="bg-slate-900/50 border border-white/5 rounded-lg text-xs font-bold text-slate-400 px-3 py-2 outline-none">
              <option>Todas las categorías</option>
              <option>Frutas</option>
              <option>Empaques</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Producto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stock actual</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Costo Unit.</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Precio Venta</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {productList.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:border-indigo-500/50 transition-all">
                        <Package size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">SKU: PROD-102{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{p.stock} {p.unit}</span>
                      <div className="mt-1 h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            p.status === 'critical' ? "w-2 bg-rose-500" : 
                            p.status === 'warning' ? "w-10 bg-amber-500" : "w-16 bg-emerald-500"
                          )} 
                          style={{ width: `${Math.min((p.stock / p.minStock) * 50, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-300">
                    ${p.cost.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-white font-bold">
                    ${p.price.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest inline-flex",
                      p.status === 'normal' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                      p.status === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                      p.status === 'critical' ? "bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse" :
                      "bg-slate-800 border-slate-700 text-slate-400"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        p.status === 'normal' ? "bg-emerald-500" :
                        p.status === 'warning' ? "bg-amber-500" :
                        p.status === 'critical' ? "bg-rose-500" : "bg-slate-500"
                      )} />
                      {p.status === 'normal' ? 'Óptimo' : p.status === 'warning' ? 'Bajo' : p.status === 'critical' ? 'Crítico' : 'Sin Stock'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-slate-600 hover:text-white transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-md overflow-hidden border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Nuevo Producto Agrícola</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              {/* Product name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nombre del Producto</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Mango Tommy Atkins"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category and unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Categoría</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Frutas">Frutas</option>
                    <option value="Empaques">Empaques</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Unidad de Medida</label>
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="kg">kilogramos (kg)</option>
                    <option value="unid">unidades (unid)</option>
                  </select>
                </div>
              </div>

              {/* Stocks limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Stock Inicial</label>
                  <input 
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Stock Mínimo</label>
                  <input 
                    type="number"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
              </div>

              {/* Cost & sales price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Costo Unitario ($)</label>
                  <input 
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Precio Venta ($)</label>
                  <input 
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
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
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
