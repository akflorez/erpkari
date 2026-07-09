import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  ArrowUpRight, 
  Calendar, 
  AlertTriangle,
  ChevronRight,
  FileText
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Filler, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const KpiCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="glass-card group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${color}-500/10 blur-2xl group-hover:bg-${color}-500/20 transition-all duration-500 rounded-full`} />
    
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {change}%
      </div>
    </div>
    
    <div className="mt-4">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
    </div>
    
    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
      <span className="text-[10px] text-slate-500 font-medium">Vs. mes anterior</span>
      <ArrowUpRight size={14} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
    </div>
  </div>
);

export const Dashboard = () => {
  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        fill: true,
        label: 'Ingresos',
        data: [42, 55, 48, 70, 65, 82],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
      {
        fill: true,
        label: 'Egresos',
        data: [35, 40, 42, 50, 48, 55],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 11 },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard <span className="text-indigo-500">NIIF</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Resumen financiero consolidado · Frutas La Primavera SAS</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">SISTEMA EN LÍNEA: MARZO 2026</span>
          </div>
          <button className="btn-premium">
            <Download size={18} />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Ventas Totales" value="$124.5M" change="12.5" trend="up" icon={DollarSign} color="indigo" />
        <KpiCard title="Costo Mercancía" value="$68.2M" change="4.1" trend="down" icon={ShoppingCart} color="purple" />
        <KpiCard title="Utilidad Bruta" value="$56.3M" change="8.2" trend="up" icon={TrendingUp} color="emerald" />
        <KpiCard title="Cartera Pendiente" value="$21.8M" change="15.4" trend="up" icon={Calendar} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Flujo de Caja</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Proyección semestral · Millones COP</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-xs text-slate-400 font-medium">Ingresos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-xs text-slate-400 font-medium">Egresos</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Side Widgets */}
        <div className="space-y-8">
          {/* Fiscal Calendar Widget */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="text-indigo-400" size={20} />
                Vencimientos
              </h3>
              <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-slate-400">PRÓXIMOS</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'IVA Bimestral', date: 'Abr 15', days: 12, color: 'emerald' },
                { label: 'Retención Fuente', date: 'Abr 18', days: 15, color: 'indigo' },
                { label: 'ICA Manizales', date: 'Abr 22', days: 19, color: 'amber' },
                { label: 'Nómina Elect.', date: 'May 05', days: 32, color: 'slate' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex flex-col items-center justify-center border border-${item.color}-500/10`}>
                    <span className={`text-[10px] font-bold text-${item.color}-400/60 leading-none`}>ABR</span>
                    <span className={`text-base font-bold text-${item.color}-400`}>{item.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-500 font-medium">En {item.days} días naturales</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-indigo-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Widget */}
          <div className="glass-card border-rose-500/20 bg-rose-500/[0.02]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-rose-400" size={20} />
                Alertas Críticas
              </h3>
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px] font-bold text-rose-400">2</span>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                <p className="text-xs font-bold text-slate-200">Stock Bajo: Papaya Criolla</p>
                <div className="flex items-center justify-between">
                  <div className="h-1.5 w-2/3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-12 bg-rose-500" />
                  </div>
                  <span className="text-[10px] text-rose-400 font-bold">12 / 100 kg</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                <p className="text-xs font-bold text-slate-200">Factura Vencida: INV-034</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">Cliente: Fruber Mercaldas</span>
                  <span className="text-[10px] text-amber-400 font-bold">$4.200.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Download = ({ size }: any) => <FileText size={size} />;
