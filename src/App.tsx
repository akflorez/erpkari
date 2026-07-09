import React from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { DianModule } from './pages/DianModule';
import { AssistantIA } from './components/AssistantIA';
import { Telegram } from './pages/Telegram';
import InboxTelegram from './pages/InboxTelegram';
import { AsistenteIAPage } from './pages/AsistenteIAPage';
import { Conciliacion } from './pages/Conciliacion';
import { Nomina } from './pages/Nomina';
import { CalendarioFiscal } from './pages/CalendarioFiscal';
import { Login } from './pages/Login';
import { Configuracion } from './pages/Configuracion';

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'inventarios' && <Inventory />}
      {activeTab === 'dian' && <DianModule />}
      {activeTab === 'telegram' && <Telegram />}
      {activeTab === 'inbox-telegram' && <InboxTelegram />}
      {activeTab === 'ia' && <AsistenteIAPage />}
      {activeTab === 'conciliacion' && <Conciliacion />}
      {activeTab === 'nomina' && <Nomina />}
      {activeTab === 'calendario' && <CalendarioFiscal />}
      {activeTab === 'configuracion' && <Configuracion />}
      {!['dashboard', 'inventarios', 'dian', 'telegram', 'inbox-telegram', 'ia', 'conciliacion', 'nomina', 'calendario', 'configuracion'].includes(activeTab) && (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <span className="font-bold text-2xl">?</span>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">Módulo en Desarrollo</h2>
            <p className="text-slate-500">Estamos preparando esta sección para cumplir con todas las normativas NIIF/DIAN 2026.</p>
          </div>
        </div>
      )}
      <AssistantIA />
    </DashboardLayout>
  );
}

export default App;
