import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { WA_API_URL, WA_SOCKET_URL, WA_SOCKET_PATH } from '../config';
import { 
  Send, 
  Search, 
  MessageSquare, 
  User, 
  Clock,
  MoreVertical,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface TGMessage {
  id: string;
  chatId: string;
  from: string;
  number: string;
  text: string;
  time: string;
  timestamp: number;
}

export default function InboxTelegram() {
  const [messages, setMessages] = useState<TGMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const socket = io(WA_SOCKET_URL, {
      path: WA_SOCKET_PATH,
      transports: ['websocket', 'polling']
    });

    socket.on('tg:message', (msg: TGMessage) => {
      setMessages(prev => [msg, ...prev]);
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(WA_API_URL + '/api/telegram/inbox');
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      console.error('Error fetching TG messages:', e);
    }
  };

  const chats = Array.from(new Set(messages.map(m => m.chatId))).map(chatId => {
    const chatMsgs = messages.filter(m => m.chatId === chatId);
    return {
      chatId,
      name: chatMsgs[0].from,
      lastMsg: chatMsgs[0].text,
      time: chatMsgs[0].time,
      count: chatMsgs.length
    };
  });

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.chatId.includes(search)
  );

  const currentChatMessages = messages
    .filter(m => m.chatId === selectedChat)
    .sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat, messages]);

  const handleSend = async () => {
    if (!selectedChat || !replyText.trim()) return;
    try {
        const res = await fetch(WA_API_URL + '/api/telegram/bulk/manual-send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ number: selectedChat, text: replyText }]
            })
        });
        if (res.ok) {
            setReplyText('');
            // Add a temporary local message for UI feedback
            const myMsg: TGMessage = {
                id: Date.now().toString(),
                chatId: selectedChat,
                from: 'Yo',
                number: '',
                text: replyText,
                time: new Date().toLocaleTimeString('es-CO'),
                timestamp: Math.floor(Date.now() / 1000)
            };
            setMessages(prev => [myMsg, ...prev]);
        }
    } catch {}
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
      
      {/* Sidebar de Chats */}
      <div className="w-80 border-r border-border-subtle flex flex-col bg-surface/30 backdrop-blur-md">
        <div className="p-4 border-b border-border-subtle">
           <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#0088cc]" />
              <h2 className="font-bold text-lg text-text-main">Inbox Telegram</h2>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Buscar contacto..."
                className="w-full bg-[#0d0f12] border border-border-subtle rounded-xl py-2 pl-10 pr-4 text-sm text-text-main focus:border-[#0088cc] transition-all outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
           {filteredChats.length === 0 ? (
             <div className="p-10 text-center text-text-muted">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-xs">No hay conversaciones</p>
             </div>
           ) : (
             filteredChats.map(chat => (
                <button
                  key={chat.chatId}
                  onClick={() => setSelectedChat(chat.chatId)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-hover transition-all border-b border-border-subtle/50 text-left ${selectedChat === chat.chatId ? 'bg-hover border-r-4 border-[#0088cc]' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0088cc] to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {chat.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-sm text-text-main truncate">{chat.name}</span>
                       <span className="text-[10px] text-text-muted">{chat.time}</span>
                    </div>
                    <p className="text-xs text-text-muted truncate leading-relaxed">{chat.lastMsg}</p>
                  </div>
                </button>
             ))
           )}
        </div>
      </div>

      {/* Area de Chat */}
      <div className="flex-1 flex flex-col bg-surface/10">
        {selectedChat ? (
          <>
            {/* Header del Chat */}
            <div className="h-16 border-b border-border-subtle bg-surface/50 flex items-center justify-between px-6">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc]">
                     <User className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-text-main">{chats.find(c => c.chatId === selectedChat)?.name}</p>
                     <p className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En Línea
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="p-2 text-text-muted hover:text-text-main rounded-lg transition-colors">
                     <ShieldCheck className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-text-muted hover:text-text-main rounded-lg transition-colors">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
               {currentChatMessages.map((msg, i) => {
                 const isMe = msg.from === 'Yo';
                 return (
                   <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm relative ${isMe ? 'bg-[#0088cc] text-white rounded-tr-none' : 'bg-card border border-border-subtle text-text-main rounded-tl-none'}`}>
                         <p className="text-sm leading-relaxed">{msg.text}</p>
                         <span className={`text-[9px] block mt-1 ${isMe ? 'text-white/70' : 'text-text-muted'} text-right`}>{msg.time}</span>
                      </div>
                   </div>
                 );
               })}
            </div>

            {/* Input de Respuesta */}
            <div className="p-4 bg-surface/50 border-t border-border-subtle">
               <div className="bg-[#0d0f12] border border-border-subtle rounded-2xl p-2 flex items-center gap-2 focus-within:border-[#0088cc] transition-all">
                  <input 
                    type="text" 
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-text-main"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    className="p-2.5 bg-[#0088cc] hover:bg-opacity-80 text-white rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-30">
             <div className="w-24 h-24 bg-gradient-to-br from-[#0088cc] to-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 transform -rotate-12">
                <MessageSquare className="w-12 h-12" />
             </div>
             <h3 className="text-xl font-bold text-text-main mb-2">Selecciona un chat</h3>
             <p className="text-sm">Tus conversaciones de Telegram aparecerán aquí en tiempo real.</p>
          </div>
        )}
      </div>
    </div>
  );
}
