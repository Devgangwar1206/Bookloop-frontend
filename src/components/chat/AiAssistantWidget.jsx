import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  User, 
  RotateCcw, 
  ChevronDown, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';

const AI_AVATAR_SRC = '/assets/loopie_clean_bot.png';
const AI_AVATAR_FALLBACK_SRC = '/assets/loopie_bot.png';

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `Hi there! I'm **Loopie**, your personal **BookLoop AI Guide** 🤖📚✨

I'm here to help you discover great books or sell your books safely and fast! Here is how I can guide you:
• 📚 **Book Recommendations:** Tell me your favorite genre, goals, or authors and I'll find top picks!
• 💰 **Seller Tips:** How to list books on [Sell Page](/sell), take good photos, and price to sell within 48 hours.
• 🔄 **Book Swaps:** How to trade reads directly at [Exchange Requests](/dashboard/exchanges).
• 🛡️ **Escrow & Safe OTP:** How our 100% buyer protection works so payments are released only after you verify the book in hand.

Feel free to pick one of the quick suggestions below or ask me anything! What would you like to explore today?`
  }
];

// Reordered as requested:
// 1. 📚 Recommend a book
// 2. 💰 How to list my first book? (moved to 2nd position)
// 3. 🔄 How does Book Exchange work?
// 4. 🛡️ How does Escrow & OTP work? (moved to the end)
const SUGGESTED_PROMPTS = [
  { 
    label: '📚 Recommend a book', 
    query: 'Can you recommend top books for personal growth, tech, and mindset on BookLoop?' 
  },
  { 
    label: '💰 How to list my first book?', 
    query: 'How do I list my first book to sell, and what price should I set for fast sales?' 
  },
  { 
    label: '🔄 How does Book Exchange work?', 
    query: 'How does the Book Exchange & Swap feature work on BookLoop?' 
  },
  { 
    label: '🛡️ How does Escrow & OTP work?', 
    query: 'How does BookLoop Escrow Protection and Delivery Security OTP keep buyers and sellers safe?' 
  }
];

let messageCounter = 0;
function createMessageId(prefix) {
  messageCounter += 1;
  return `${prefix}-${Date.now()}-${messageCounter}`;
}

// Reusable cute avatar sticker component - pure mascot without background or border
function FemaleAiAvatar({ size = 'md', className = '', showOnlineDot = false, isThinking = false }) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(AI_AVATAR_SRC);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      {imageError ? (
        <div 
          className={`${currentSize} flex items-center justify-center font-bold text-xs`}
        >
          🤖
        </div>
      ) : (
        <div className={`${currentSize} flex items-center justify-center overflow-visible`}>
          <img
            src={currentSrc}
            alt="Loopie AI Guide"
            onError={() => {
              if (currentSrc === AI_AVATAR_SRC) {
                setCurrentSrc(AI_AVATAR_FALLBACK_SRC);
              } else {
                setImageError(true);
              }
            }}
            className={`w-full h-full object-contain filter drop-shadow-xs ${
              isThinking ? 'animate-pulse' : ''
            }`}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      {showOnlineDot && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center">
          <span className="w-1 h-1 rounded-full bg-white" />
        </span>
      )}
    </div>
  );
}

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnreadNotification(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage = {
      id: createMessageId('user'),
      role: 'user',
      content: text
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Assistant API request failed');
      }

      const data = await response.json();
      const assistantMessage = {
        id: createMessageId('ai'),
        role: 'assistant',
        content: data.reply || "I'm right here to help you! Feel free to ask about book recommendations, selling tips, or safe escrow orders."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('AI Assistant error, providing fallback:', err);
      const fallbackMessage = {
        id: createMessageId('ai-err'),
        role: 'assistant',
        content: `I'm right here to help you! 👧🌸 On BookLoop you can:
• **Buy Books:** Explore our [Marketplace](/books) with 100% Escrow Protection.
• **Sell Books:** List any book in 2 minutes at [Sell a Book](/sell).
• **Track Orders:** Check delivery and meetup status at [My Orders](/dashboard/orders).
• **Book Swaps:** Trade books with fellow readers at [Exchanges](/dashboard/exchanges).

What specific book recommendation or seller question can I answer for you?`
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to format text with markdown links & bold formatting
  const renderFormattedContent = (content) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push({ isLink: true, text: linkText, url: linkUrl });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return (
      <div className="space-y-1.5 leading-relaxed text-xs">
        {parts.map((part, i) => {
          if (typeof part === 'string') {
            const lines = part.split('\n');
            return lines.map((line, lineIdx) => {
              const boldRegex = /\*\*([^*]+)\*\*/g;
              const segments = [];
              let bLast = 0;
              let bMatch;
              while ((bMatch = boldRegex.exec(line)) !== null) {
                if (bMatch.index > bLast) segments.push(line.substring(bLast, bMatch.index));
                segments.push(<strong key={bMatch.index} className="font-bold text-slate-900">{bMatch[1]}</strong>);
                bLast = bMatch.index + bMatch[0].length;
              }
              if (bLast < line.length) segments.push(line.substring(bLast));

              return (
                <span key={`${i}-${lineIdx}`} className="block">
                  {segments.length > 0 ? segments : line}
                </span>
              );
            });
          } else if (part.isLink) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate(part.url);
                }}
                className="inline-flex items-center gap-0.5 font-bold text-blue-600 hover:text-blue-800 hover:underline mx-1 cursor-pointer bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200"
              >
                <span>{part.text}</span>
                <ExternalLink className="w-2.5 h-2.5 inline" />
              </button>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <>
      {/* FLOATING STICKER LAUNCHER BUTTON */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
        {/* Cute speech bubble popup on initial load */}
        {hasUnreadNotification && !isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-xs text-slate-800 rounded-2xl text-xs font-semibold shadow-xl hover:shadow-2xl cursor-pointer animate-bounce border border-slate-200/80 group transition-all"
          >
            <span className="text-base">✨</span>
            <span>Hi! I'm <strong>Loopie</strong> 🤖 Need book tips?</span>
            <span className="text-amber-600 font-bold underline ml-1 hover:text-amber-700">Ask me! 🌸</span>
          </div>
        )}

        {/* Floating Mascot Button: ONLY the character image WITHOUT background and WITHOUT border, with ONLY green active button */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="relative w-16 h-16 sm:w-20 sm:h-20 bg-transparent transition-all duration-300 cursor-pointer active:scale-95 hover:scale-110 flex items-center justify-center p-0 select-none border-0 outline-none focus:outline-none drop-shadow-lg hover:drop-shadow-2xl"
          aria-label={isOpen ? 'Close Loopie AI Guide' : 'Open Loopie AI Guide'}
          title={isOpen ? 'Close Loopie AI' : 'Chat with Loopie AI'}
        >
          {isOpen ? (
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={AI_AVATAR_SRC}
                alt="Loopie AI Guide"
                className="w-full h-full object-contain select-none pointer-events-none opacity-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-slate-900/85 text-white flex items-center justify-center shadow-lg border border-white/20">
                  <X className="w-5 h-5 stroke-[2.5]" />
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={AI_AVATAR_SRC}
                alt="Loopie AI Guide"
                onError={(e) => {
                  e.target.src = AI_AVATAR_FALLBACK_SRC;
                }}
                className="w-full h-full object-contain select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* ONLY green active button / indicator */}
              <span 
                className="absolute top-0 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center z-10"
                title="Online active"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60 pointer-events-none" />
              </span>
            </div>
          )}
        </button>
      </div>

      {/* CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div 
          className="fixed bottom-20 md:bottom-24 right-3 sm:right-6 z-40 w-[calc(100vw-24px)] sm:w-[430px] max-w-[430px] h-[560px] max-h-[78vh] bg-white rounded-3xl shadow-2xl border-2 border-amber-400/80 flex flex-col overflow-hidden animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Loopie AI Book Guide"
        >
          {/* Header with Cute Bot Mascot Sticker - Clean bright styling without dark background */}
          <div className="px-4 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-between gap-3 shrink-0 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <FemaleAiAvatar size="md" showOnlineDot={true} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-sm text-white truncate flex items-center gap-1">
                    <span>Loopie AI</span>
                    <span className="text-xs">🤖✨</span>
                  </h3>
                  <span className="text-[10px] font-bold bg-white/20 text-white border border-white/30 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online Guide
                  </span>
                </div>
                <div className="text-[11px] text-amber-100 font-medium truncate">
                  Personal Guide for Readers & Sellers 📚
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Close chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar in requested order:
              1. 📚 Recommend a book
              2. 💰 How to list my first book?
              3. 🔄 How does Book Exchange work?
              4. 🛡️ How does Escrow & OTP work? */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none text-xs">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt.query)}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors shrink-0 shadow-2xs cursor-pointer active:scale-95"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {isUser ? (
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold bg-blue-600 text-white shadow-2xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <FemaleAiAvatar size="sm" className="mt-0.5" />
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3 shadow-2xs text-xs ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-tr-xs' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <FemaleAiAvatar size="sm" isThinking={true} className="mt-0.5" />
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium text-slate-500 ml-1">Loopie is thinking... 🤖✨</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Guide Chips Footer */}
          <div className="px-3.5 py-2 bg-slate-100/80 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Escrow Protected</span>
            </span>
            <Link 
              to="/books" 
              onClick={() => setIsOpen(false)}
              className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline flex items-center gap-1"
            >
              <span>Explore 50+ Books</span>
              <span>→</span>
            </Link>
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Loopie for book recommendations or selling tips..."
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AiAssistantWidget;
