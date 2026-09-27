import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';

const FloatingChatbot = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: isHi
        ? 'नमस्ते! मैं लाभसेतु एआई सहायक हूँ। आप मुझसे किसी भी सरकारी योजना, पात्रता नियमों या आवेदन प्रक्रिया के बारे में पूछ सकते हैं।'
        : 'Namaste! I am your LabhSetu AI Assistant. Ask me anything about central or state welfare schemes, eligibility norms, or document requirements.',
      sources: [],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    isHi ? 'पीएम किसान की पात्रता क्या है?' : 'What is PM-KISAN eligibility?',
    isHi ? 'आयुष्मान भारत कार्ड कैसे बनवाएं?' : 'How to apply for Ayushman Card?',
    isHi ? 'विद्यार्थियों के लिए कौन सी छात्रवृत्तियां हैं?' : 'Scholarships for students?',
  ]);
  const [speakingId, setSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Load suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get(`/assistant/suggestions?lang=${i18n.language}`);
        if (data.success && data.suggestions?.length) {
          setSuggestions(data.suggestions.slice(0, 3));
        }
      } catch {
        // keep fallback suggestions
      }
    };
    fetchSuggestions();
  }, [i18n.language]);

  const handleSpeak = (text, msgId) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHi ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryToSend) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const { data } = await api.post('/assistant/query', {
        query,
        language: i18n.language,
      });

      if (data.success) {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.data.answer,
          sources: data.data.sources || [],
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (data.data.suggestedQuestions?.length) {
          setSuggestions(data.data.suggestedQuestions.slice(0, 3));
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: isHi
            ? 'क्षमा करें, इस समय जानकारी प्राप्त करने में कठिनाई हो रही है। कृपया योजना सूची देखें या पुनः प्रयास करें।'
            : 'Sorry, I am temporarily unable to retrieve this data. Please explore Find Schemes or try again.',
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: isHi
          ? 'नमस्ते! मैं लाभसेतु एआई सहायक हूँ। आप मुझसे किसी भी सरकारी योजना के बारे में पूछ सकते हैं।'
          : 'Namaste! I am your LabhSetu AI Assistant. Ask me anything about central or state welfare schemes.',
        sources: [],
      },
    ]);
  };

  return (
    <>
      {/* 1. Minimized Modern Floating Chat Trigger */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group animate-in fade-in zoom-in-95 duration-200">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#111a2e] text-slate-800 dark:text-slate-200 text-xs font-bold shadow-elevation border border-slate-200 dark:border-slate-700 pointer-events-none group-hover:scale-102 transition-transform">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isHi ? 'सहायता चाहिए? AI से पूछें' : 'Need Help? Ask AI'}</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-13 h-13 rounded-2xl bg-gradient-to-br from-gov-700 via-gov-800 to-gov-950 hover:from-gov-600 hover:to-gov-900 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center relative border border-sky-400/30 group focus:outline-none focus:ring-4 focus:ring-sky-500/30"
            aria-label="Open AI Scheme Chatbot"
            title="Open LabhSetu AI Assistant"
          >
            <Bot className="w-6 h-6 text-sky-200 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-slate-950" />
            </span>
          </button>
        </div>
      )}

      {/* 2. Expanded Floating Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[410px] h-[560px] max-h-[85vh] z-50 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0b2545] via-[#103b6d] to-[#184f85] text-white flex items-center justify-between border-b border-[#1b4b82] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b2545]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                    {isHi ? 'लाभसेतु सहायक' : 'LabhSetu Assistant'}
                  </h3>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-sky-200/80 leading-none mt-0.5">
                  {isHi ? 'आधिकारिक योजना परामर्शदाता' : 'Grounded Scheme Guide'}
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/assistant"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Open full page assistant"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-0.5"
                title="Minimize chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/60 dark:bg-[#090e1a]/80 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                      isUser
                        ? 'bg-gov-600 text-white'
                        : 'bg-gradient-to-br from-sky-500 to-gov-700 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-gov-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Sources Chips */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          {isHi ? 'सत्यापित स्रोत:' : 'Official Sources:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {m.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-gov-600 dark:text-sky-400 hover:underline bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                            >
                              <span>{s.title}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Speech toggle */}
                    {!isUser && (
                      <div className="mt-1.5 flex justify-end">
                        <button
                          onClick={() => handleSpeak(m.text, m.id)}
                          className="text-[10px] text-slate-400 hover:text-gov-600 dark:hover:text-sky-400 flex items-center gap-1 p-0.5"
                          title="Read aloud"
                        >
                          {speakingId === m.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-500" />
                              <span className="text-rose-500">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-gov-700 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-2 text-slate-500 text-xs shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gov-600" />
                  <span>{isHi ? 'जानकारी खोजी जा रही है...' : 'Searching official records...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions.length > 0 && (
            <div className="px-3 py-1.5 bg-slate-100/70 dark:bg-[#0c1322] border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
              {suggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="whitespace-nowrap px-2.5 py-1 bg-white dark:bg-[#111a2e] hover:bg-gov-50 dark:hover:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white dark:bg-[#0c1322] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              placeholder={isHi ? 'योजना के बारे में प्रश्न पूछें...' : 'Ask about any scheme, eligibility...'}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-600"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-2 bg-gov-600 hover:bg-gov-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
              title="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
