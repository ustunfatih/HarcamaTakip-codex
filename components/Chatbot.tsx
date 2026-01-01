import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReportData } from '../types';
import { formatCurrency } from '../utils';
import { Sparkles, Send, X, Bot, Loader2, MessageCircle } from 'lucide-react';

interface ChatbotProps {
  reportData: ReportData;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Get API key from environment variable (Vite style)
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}
const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || '';

export const Chatbot: React.FC<ChatbotProps> = ({ reportData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateSystemContext = (data: ReportData) => {
    const categorySummary = data.categories
      .map(c => `- ${c.categoryName}: ${formatCurrency(c.totalAmount)} (${c.transactions.length} işlem)`)
      .join('\n');

    return `
      Sen yardımcı bir finansal asistan ve harcama analistisin. Kullanıcının YNAB (You Need A Budget) harcama raporunu analiz ediyorsun.
      Cevapların kısa, öz ve samimi olmalı. Kullanıcının bütçesi hakkında soruları cevapla.

      ŞU ANKİ RAPOR ÖZETİ:
      - Toplam Harcama: ${formatCurrency(data.totalSpent)}
      - Tarih Aralığı: ${data.startDate} ile ${data.endDate} arası.

      KATEGORİ DAĞILIMI:
      ${categorySummary}

      Para birimi olarak her zaman TL (₺) kullan. Eğer kullanıcı harcamaları hakkında yorum isterse, en yüksek harcama kalemlerine dikkat çek.
    `;
  };

  const handleSend = async () => {
    if (!input.trim() || !API_KEY) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Build conversation history
      const historyFormatted = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = model.startChat({
        history: historyFormatted,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      // Include system context in the first message
      const prompt = messages.length === 0
        ? `${generateSystemContext(reportData)}\n\nKullanıcı sorusu: ${userMessage}`
        : userMessage;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const responseText = response.text() || "Üzgünüm, şu an cevap veremiyorum.";

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Bir hata oluştu. Lütfen tekrar deneyin." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Don't render if no API key
  if (!API_KEY) {
    return null;
  }

  // --- COLLAPSED STATE ---
  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-emerald-600/90 to-orange-500/80 dark:from-emerald-600/60 dark:to-orange-500/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 text-white shadow-xl shadow-emerald-900/20 cursor-pointer mb-4 relative overflow-hidden group transition-all hover:scale-[1.01]"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
             <div className="bg-white/20 p-2 rounded-full">
                <Sparkles size={20} className="text-white animate-pulse" />
             </div>
             <div>
               <div className="font-bold text-sm">AI Asistanı</div>
               <div className="text-xs text-emerald-100 opacity-80">Harcamalarınızla ilgili soru sorun...</div>
             </div>
          </div>
          <MessageCircle size={20} className="text-white/80" />
        </div>
      </div>
    );
  }

  // --- EXPANDED STATE (FULL SCREEN) ---
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-3 transition-colors duration-300">

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg">
                <Bot size={20} className="text-white" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 dark:text-white">AI Asistanı</h3>
                <span className="text-xs text-slate-500 dark:text-zinc-400">Gemini 1.5 Flash</span>
            </div>
        </div>
        <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
            <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-center opacity-50 px-8">
               <Sparkles size={48} className="text-emerald-500 mb-4" />
               <p className="text-slate-600 dark:text-zinc-400 font-medium">
                 Harcamalarınız hakkında merak ettiğiniz her şeyi sorun.
               </p>
               <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                 Örnek: "En çok markete mi harcama yaptım?" veya "Geçen aya göre yemek harcamam nasıl?"
               </p>
           </div>
        )}

        {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user'
                       ? 'bg-emerald-600 text-white rounded-br-none'
                       : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-gray-100 dark:border-white/5 rounded-bl-none'
                  }`}
                >
                    {msg.text}
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start w-full">
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Düşünüyor...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-zinc-900 p-2 rounded-2xl border border-transparent focus-within:border-emerald-500 transition-colors">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Bir mesaj yazın..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white px-2 placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-sm min-h-[44px]"
            />
            <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    input.trim()
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-gray-300 dark:bg-zinc-800 text-gray-500 dark:text-zinc-600'
                }`}
            >
                <Send size={18} />
            </button>
        </div>
      </div>

    </div>
  );
};
