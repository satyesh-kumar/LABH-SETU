import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Send,
  Bot,
  User,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info,
  Volume2,
  VolumeX,
} from 'lucide-react';
import api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AssistantChat = ({ initialSchemeId = null, initialQuery = '' }) => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: isHi
        ? 'नमस्ते! मैं लाभसेतु एआई सहायक हूँ। मैं आपको सरकारी योजनाओं की पात्रता, आवश्यक दस्तावेजों और आधिकारिक आवेदन प्रक्रिया के बारे में सत्यापित जानकारी प्रदान कर सकता हूँ।'
        : 'Namaste! I am the LabhSetu AI Assistant. I can help you discover government schemes, understand preliminary eligibility, check document requirements, and locate official application portals.',
      sources: [],
    },
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [speakingId, setSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get(`/assistant/suggestions?lang=${i18n.language}`);
        if (data.success) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error('Failed to load suggested questions', err);
      }
    };
    fetchSuggestions();
  }, [i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryToSend) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query) return;

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
        schemeContextId: initialSchemeId,
      });

      if (data.success) {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.data.answer,
          sources: data.data.sources || [],
          disclaimer: isHi ? data.data.disclaimerHi : data.data.disclaimer,
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (data.data.suggestedQuestions) {
          setSuggestions(data.data.suggestedQuestions);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Sorry, I am currently unable to retrieve information. Please check the Find Schemes page or try again.',
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gov-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gov-700 flex items-center justify-center text-white border border-gov-600">
            <Bot className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide">{t('assistant.title')}</h3>
            <p className="text-[11px] text-slate-300">
              Grounded in verified government guidelines & operational norms
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
          Source-Grounded AI
        </span>
      </div>

      {/* Notice Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="leading-snug">{t('assistant.disclaimer')}</p>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-gov-600 text-white'
                    : 'bg-slate-100 text-gov-800 border border-slate-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-gov-700" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gov-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
                    <span className="text-[10px] font-bold text-gov-700 uppercase tracking-wider">
                      Official Guidance
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(m.text, m.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-gov-800 bg-white hover:bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 transition-colors"
                      title="Listen aloud / आवाज़ सुनें"
                    >
                      {speakingId === m.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                          <span className="text-rose-600">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-gov-600" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Sources References in Assistant Message */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('assistant.sources_title')}</span>
                    </span>
                    <div className="space-y-1.5">
                      {m.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-gov-400 text-xs text-gov-700 hover:text-gov-900 transition-colors"
                        >
                          <span className="font-medium truncate max-w-[240px]">
                            {src.title}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-gov-800 border border-slate-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gov-700" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-sm text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gov-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gov-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-gov-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-xs font-medium">Consulting official scheme sources...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts chips */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
            {t('assistant.suggested_title')}:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-xs bg-white border border-slate-200 hover:border-gov-400 hover:bg-gov-50/50 text-slate-700 hover:text-gov-800 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t('assistant.input_placeholder')}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-600 focus:bg-white transition-colors"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!inputQuery.trim() || loading}
          icon={Send}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default AssistantChat;
