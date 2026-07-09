import React, { useState, useEffect, useRef } from 'react';
import { 
  Send,
  UploadCloud,
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet,
  Trash2,
  Zap,
  Key,
  Bot,
  Info,
  QrCode,
  Smartphone
} from 'lucide-react';
import { io } from 'socket.io-client';

import { WA_API_URL } from '../config';

export const Telegram = () => {
  const [activeSubTab, setActiveSubTab] = useState<'connection' | 'bulk' | 'status'>('connection');
  const [loading, setLoading] = useState(false);
  const [tgConfig, setTgConfig] = useState({
    token: '',
    botName: '',
    isConnected: false,
    mode: 'bot',
    apiId: '',
    apiHash: '',
  });
  const [tgQR, setTgQR] = useState<string | null>(null);
  const [waSocketUrl] = useState('http://localhost:3001'); // Match backend
  const [broadcastStatus, setBroadcastStatus] = useState({
    active: false,
    total: 0,
    processed: 0,
    failed: 0,
    currentId: null,
    startTime: null
  });

  const [manualMessages, setManualMessages] = useState<any[]>([]);
  const [manualText, setManualText] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTgConfig();
    fetchStatus();

    const socket = io(WA_API_URL, {
        transports: ['websocket', 'polling']
    });

    socket.on('tg:qr', (data: string) => setTgQR(data));
    socket.on('tg:status', (data: any) => {
        setTgConfig(prev => ({ ...prev, isConnected: true, botName: data.botName }));
        setTgQR(null);
    });
    socket.on('tg:error', (err: string) => {
        alert('Error en Telegram: ' + err);
        setTgQR(null);
    });

    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    let interval: any;
    if (broadcastStatus.active || activeSubTab === 'status') {
      interval = setInterval(fetchStatus, 2000);
    }
    return () => clearInterval(interval);
  }, [broadcastStatus.active, activeSubTab]);

  const fetchTgConfig = async () => {
    try {
      const res = await fetch(WA_API_URL + '/config/telegram');
      if (res.ok) setTgConfig(await res.json());
    } catch {}
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(WA_API_URL + '/api/telegram/bulk/status');
      if (res.ok) setBroadcastStatus(await res.json());
    } catch {}
  };

  const handleConnect = async () => {
    if (!tgConfig.token) return;
    setLoading(true);
    try {
      const res = await fetch(WA_API_URL + '/config/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tgConfig.token })
      });
      if (res.ok) {
        const data = await res.json();
        setTgConfig({ ...tgConfig, isConnected: true, botName: data.botName });
        alert('Bot @' + data.botName + ' conectado con éxito.');
      } else {
        alert('Token inválido.');
      }
    } catch (e) {
      alert('Error de conexión con el servicio EMBOT.');
    }
    setLoading(false);
  };

  const handlePersonalConnect = async () => {
    if (!tgConfig.apiId || !tgConfig.apiHash) {
        alert('Se requiere API ID y API HASH');
        return;
    }
    setLoading(true);
    try {
        await fetch(WA_API_URL + '/config/telegram/personal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiId: tgConfig.apiId, apiHash: tgConfig.apiHash })
        });
        alert('Proceso iniciado. Escanea el QR que aparecerá.');
    } catch {}
    setLoading(false);
  };

  const handleModeChange = async (mode: 'bot' | 'personal') => {
    try {
        await fetch(WA_API_URL + '/config/telegram/mode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode })
        });
        setTgConfig({ ...tgConfig, mode });
    } catch {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const lines = content.split('\n');
        const parsed = lines.map(line => {
          const parts = line.split(',');
          return {
            number: parts[0]?.trim(),
            text: parts[1]?.trim() || manualText
          };
        }).filter(m => m.number && m.number.length >= 5);

        if (parsed.length === 0) {
          setFileError('Archivo vacío o sin IDs válidos.');
        } else {
          setManualMessages(parsed);
          setFileError(null);
        }
      } catch (err) {
        setFileError('Error al leer CSV.');
      }
    };
    reader.readAsText(file);
  };

  const startBulk = async () => {
    if (manualMessages.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch(WA_API_URL + '/api/telegram/bulk/manual-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: manualMessages })
      });
      if (res.ok) {
        setActiveSubTab('status');
      }
    } catch (e) {}
    setLoading(false);
  };

  const progress = broadcastStatus.total > 0 
    ? Math.round((broadcastStatus.processed + broadcastStatus.failed) / broadcastStatus.total * 100) 
    : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <span className="text-indigo-500"><Send size={32} /></span>
          Gestión <span className="text-indigo-500">Telegram</span>
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Módulo de comunicaciones masivas vía Bot API de Telegram</p>
      </div>

      <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5 w-fit shadow-sm">
        <button 
          onClick={() => setActiveSubTab('connection')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'connection' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <Key size={18} /> Conexión
        </button>
        <button 
          onClick={() => setActiveSubTab('bulk')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'bulk' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <UploadCloud size={18} /> Envío Masivo
        </button>
        <button 
          onClick={() => setActiveSubTab('status')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'status' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <Activity size={18} /> Monitor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {activeSubTab === 'connection' && (
            <div className="glass-card overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             Token de Acceso
                        </h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Configuración del Bot API</p>
                    </div>
                    {tgConfig.isConnected && (
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400">
                             BOT ONLINE: @{tgConfig.botName}
                        </div>
                    )}
                </div>
                
                <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5 mb-8 w-fit shadow-lg shadow-black/40">
                    <button 
                        onClick={() => handleModeChange('bot')}
                        className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${tgConfig.mode === 'bot' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Modo Bot (Token)
                    </button>
                    <button 
                        onClick={() => handleModeChange('personal')}
                        className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${tgConfig.mode === 'personal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Modo Personal (QR)
                    </button>
                </div>

                {tgConfig.mode === 'bot' ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Telegram Bot API Token</label>
                            <div className="flex gap-4">
                                <input 
                                    type="password" 
                                    placeholder="Pega tu token aquí..."
                                    value={tgConfig.token}
                                    onChange={(e) => setTgConfig({...tgConfig, token: e.target.value})}
                                    className="flex-1 bg-slate-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-indigo-500 transition-all font-mono"
                                />
                                <button 
                                    onClick={handleConnect}
                                    disabled={loading || !tgConfig.token}
                                    className="btn-premium px-8"
                                >
                                    {loading ? <RefreshCw className="animate-spin" /> : <Smartphone />}
                                    {tgConfig.isConnected ? 'Actualizar' : 'Conectar Bot'}
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-4">
                            <Info className="text-indigo-400 shrink-0" size={18} />
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Para obtener un token, primero debes crear un bot en Telegram hablando con <a href="https://t.me/BotFather" target="_blank" className="text-indigo-400 underline">@BotFather</a>. 
                                Una vez obtengas el token, pégalo arriba para habilitar los envíos.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8 items-center animate-in fade-in duration-300">
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">API ID</label>
                                    <input 
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-indigo-500 font-mono"
                                        value={tgConfig.apiId}
                                        onChange={e => setTgConfig({...tgConfig, apiId: e.target.value})}
                                        placeholder="Ej: 123456"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">API HASH</label>
                                    <input 
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-indigo-500 font-mono"
                                        value={tgConfig.apiHash}
                                        onChange={e => setTgConfig({...tgConfig, apiHash: e.target.value})}
                                        placeholder="Ej: abc123def..."
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handlePersonalConnect}
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all"
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : <QrCode />}
                                Generar QR de Vinculación
                            </button>
                            
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Instrucciones</p>
                                <ol className="text-xs text-slate-500 space-y-1 list-decimal ml-4">
                                    <li>Obtén tu API ID/HASH en <a href="https://my.telegram.org" target="_blank" className="text-indigo-400 underline">my.telegram.org</a></li>
                                    <li>Pégalos arriba y genera el QR</li>
                                    <li>Escanea el código desde tu App de Telegram</li>
                                </ol>
                            </div>
                        </div>

                        <div className="w-64 h-64 bg-white rounded-3xl p-4 flex items-center justify-center relative shadow-2xl shadow-indigo-500/10">
                            {tgQR ? (
                                <img src={tgQR} alt="QR Telegram" className="w-full h-full object-contain" />
                            ) : tgConfig.isConnected && tgConfig.mode === 'personal' ? (
                                <div className="flex flex-col items-center text-emerald-500">
                                    <CheckCircle2 size={60} />
                                    <p className="font-bold text-gray-800 mt-2">¡Conectado!</p>
                                    <p className="text-[10px] text-slate-500">{tgConfig.botName}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-300 opacity-30">
                                    <QrCode size={60} />
                                    <p className="text-[10px] font-bold mt-2">Esperando credenciales...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeSubTab === 'bulk' && (
            <div className="glass-card">
               <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">Preparar Campaña</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Carga de destinatarios y mensaje</p>
               </div>
               
               <div className="space-y-8">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer hover:bg-white/[0.02]
                      ${manualMessages.length > 0 ? 'border-indigo-500/30' : 'border-white/5'}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                    {manualMessages.length === 0 ? (
                      <div className="flex flex-col items-center">
                        <FileSpreadsheet className="text-slate-600 mb-4" size={40} />
                        <h4 className="text-white font-bold">Selecciona archivo CSV</h4>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Formato: chat_id, mensaje (opcional)</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                            <CheckCircle2 size={24} />
                        </div>
                        <h4 className="text-white font-bold">{manualMessages.length} Destinatarios Listos</h4>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setManualMessages([]); }}
                          className="mt-4 text-[10px] text-rose-500 hover:underline font-bold uppercase tracking-widest flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Limpiar
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mensaje Predeterminado</label>
                    <textarea 
                      placeholder="Escribe el mensaje aquí..."
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-indigo-500 min-h-[150px] transition-all resize-none"
                    />
                  </div>

                  <button 
                    disabled={manualMessages.length === 0 || loading || broadcastStatus.active || !tgConfig.isConnected}
                    onClick={startBulk}
                    className="btn-premium w-full h-14 text-lg"
                  >
                    {loading ? <RefreshCw className="animate-spin" /> : <Zap />}
                    Iniciar Transmisión Masiva
                  </button>
               </div>
            </div>
        )}

        {activeSubTab === 'status' && (
            <div className="glass-card">
               <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">Estado del Envío</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Seguimiento en tiempo real</p>
               </div>
               
               <div className="py-10 flex flex-col items-center">
                  {broadcastStatus.active ? (
                    <div className="w-full space-y-12">
                        <div className="flex flex-col items-center">
                            <div className="text-6xl font-bold text-white mb-2">{progress}%</div>
                            <div className="h-2 w-full max-w-md bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-8 w-full max-w-xl mx-auto">
                            <div className="text-center space-y-1">
                                <div className="text-3xl font-bold text-emerald-400">{broadcastStatus.processed}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Enviados</div>
                            </div>
                            <div className="text-center space-y-1 border-x border-white/5">
                                <div className="text-3xl font-bold text-rose-400">{broadcastStatus.failed}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Errores</div>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="text-3xl font-bold text-indigo-400">{broadcastStatus.total}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total</div>
                            </div>
                        </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center opacity-30 text-slate-400">
                       <Activity size={60} strokeWidth={1} />
                       <h4 className="mt-4 font-bold text-sm uppercase tracking-widest">Sin envíos activos</h4>
                    </div>
                  )}
               </div>
            </div>
        )}

      </div>
    </div>
  );
};

const ShieldCheck = () => <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />; // Simplified mockup for lucide consistency
const Download = () => <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
