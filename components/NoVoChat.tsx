import React, { useState, useRef, useEffect } from 'react';
import { chatWithNoVo } from '../services/gemini.ts';
import { BRAND_LOGOS } from '../constants.tsx';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface NoVoChatProps {
  onClose: () => void;
  lang?: 'en' | 'pt';
}

const NoVoChat: React.FC<NoVoChatProps> = ({ onClose, lang = 'en' }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: lang === 'pt' ? "Olá! Eu sou o NoVo, o seu assistente inteligente na PLS Consultants. Como posso ajudar com os nossos serviços Jurídicos, Contabilísticos ou de Tradução hoje?" : "Hello! I am NoVo, your intelligent assistant at PLS Consultants. How can I assist you with our Legal, Accountancy, or Translation services today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithNoVo(userMsg, history, lang);
      setMessages(prev => [...prev, { role: 'model', content: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Something went wrong. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl z-[100] flex flex-col overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border border-amber-500/30">
            <img 
              src={BRAND_LOGOS.NOVO_AVATAR} 
              alt="NoVo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 z-20"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none text-amber-500">NoVo AI</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Online Assistant</span>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg transition-colors text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none shadow-md' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === 'pt' ? "Digite sua mensagem..." : "Type your message..."}
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1.5 bg-slate-900 text-amber-500 p-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoVoChat;