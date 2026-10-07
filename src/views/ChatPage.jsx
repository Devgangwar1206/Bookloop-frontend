import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Image as ImageIcon, 
  ShieldCheck, 
  ExternalLink, 
  Tag, 
  ArrowLeftRight, 
  Search, 
  ArrowLeft,
  BookOpen,
  CheckCheck,
  Check,
  Info,
  Star,
  MapPin,
  User,
  X,
  ChevronRight,
  Clock,
  Phone,
  Server,
  Wifi,
  WifiOff,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { chatApi } from '../services/chatApi';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { MakeOfferModal } from '../components/modals/MakeOfferModal';
import { RequestExchangeModal } from '../components/modals/RequestExchangeModal';
import { EmptyState } from '../components/common/EmptyState';

const QUICK_PROMPTS = [
  'Is this book still available?',
  'Can you do ₹300 for quick pickup tomorrow?',
  'Where can we meet for hand exchange?',
  'Would you be interested in a book swap?',
  'Are all pages intact with no severe markings?'
];

export function ChatPage() {
  const { id: activeChatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setUnreadMessages, markChatAsRead, markAllChatsAsRead, desktopPermission, requestDesktopPermission } = useMarketplace();

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [backendModalOpen, setBackendModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wsStatus, setWsStatus] = useState('checking'); // 'connected' | 'checking' | 'offline'
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientHandle = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    chatApi.getConversations().then((convs) => {
      if (!isMounted) return;
      const list = convs || [];
      
      const selected = activeChatId 
        ? list.find(c => c.id === activeChatId) || list[0]
        : list[0];
      
      if (selected) {
        // Mark as read immediately when loaded
        chatApi.markAsRead(selected.id).then((remaining) => {
          if (isMounted) {
            setUnreadMessages(remaining);
          }
        });
        
        // Update local list to clear unread on selected
        const updatedList = list.map(c => c.id === selected.id ? { ...c, unreadCount: 0 } : c);
        setConversations(updatedList);
        setActiveChat(selected);
        
        chatApi.getMessages(selected.id).then((msgs) => {
          if (isMounted) setMessages(msgs || []);
        });
      } else {
        setConversations(list);
      }
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [activeChatId, setUnreadMessages]);

  // Connect to Spring Boot WebSocket STOMP broker when activeChat changes
  useEffect(() => {
    if (!activeChat?.id) return;

    setOtherUserTyping(false);
    const handle = chatApi.connectWebSocket(activeChat.id, {
      onMessage: (incomingMsg) => {
        if (!incomingMsg) return;
        setMessages((prev) => {
          if (prev.some(m => m.id === incomingMsg.id)) {
            return prev;
          }
          // If we had a temporary optimistic message with matching text and sender, replace it with the confirmed one
          const tempIndex = prev.findIndex(m =>
            (m.isOptimistic || (m.id && String(m.id).startsWith('temp-'))) &&
            m.text === incomingMsg.text &&
            String(m.senderId) === String(incomingMsg.senderId)
          );
          if (tempIndex !== -1) {
            const next = [...prev];
            next[tempIndex] = incomingMsg;
            return next;
          }
          return [...prev, incomingMsg];
        });

        // Update last message in conversation preview
        setConversations((prev) => prev.map(c => 
          c.id === activeChat.id ? { 
            ...c, 
            lastMessage: incomingMsg.text, 
            lastMessageTime: incomingMsg.time || 'Just now' 
          } : c
        ));
      },
      onTyping: (payload) => {
        const myId = String(user?.id || localStorage.getItem('userId') || 'u-me');
        const myEmail = user?.email || '';
        if (payload?.userId !== myId && payload?.userId !== myEmail && payload?.conversationId === activeChat.id) {
          setOtherUserTyping(Boolean(payload?.typing));
        }
      },
      onStatusChange: (status) => {
        setWsStatus(status);
      }
    });

    stompClientHandle.current = handle;

    return () => {
      if (handle && handle.disconnect) {
        handle.disconnect();
      }
    };
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherUserTyping]);

  const handleSelectConversation = async (conv) => {
    setActiveChat(conv);
    navigate(`/chat/${conv.id}`);
    
    // Clear unread count for this conversation immediately
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
    if (markChatAsRead) {
      await markChatAsRead(conv.id);
    }
    
    const msgs = await chatApi.getMessages(conv.id);
    setMessages(msgs || []);
  };

  const handleMarkAllRead = async () => {
    if (markAllChatsAsRead) {
      await markAllChatsAsRead();
    }
    setConversations(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setNewMessage(val);

    if (stompClientHandle.current?.sendTyping && activeChat) {
      stompClientHandle.current.sendTyping(true, user?.name || 'You');

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        stompClientHandle.current?.sendTyping(false, user?.name || 'You');
      }, 2000);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || newMessage;
    if (!text || !text.trim() || !activeChat) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (stompClientHandle.current?.sendTyping) {
      stompClientHandle.current.sendTyping(false, user?.name || 'You');
    }

    const myId = String(user?.id || localStorage.getItem('userId') || '');
    const newMsg = await chatApi.sendMessage(activeChat.id, text.trim(), myId);
    setMessages((prev) => {
      if (prev.some(m => m.id === newMsg.id)) {
        return prev;
      }
      return [...prev, newMsg];
    });
    setNewMessage('');

    // Update conversation snippet in list
    setConversations((prev) => prev.map(c => 
      c.id === activeChat.id ? { ...c, lastMessage: text.trim(), lastMessageTime: 'Just now' } : c
    ));
  };

  const handleSimulateImageSend = async () => {
    if (!activeChat) return;
    const newMsg = await chatApi.sendMessage(activeChat.id, '📷 [Attached Photo: Book spine & pages inspection]');
    setMessages((prev) => [...prev, newMsg]);
  };

  const filteredConversations = conversations.filter((c) => {
    const name = c.otherUser?.name || c.userName || '';
    const title = c.bookTitle || '';
    const q = searchFilter.toLowerCase();
    return name.toLowerCase().includes(q) || title.toLowerCase().includes(q);
  });

  const isViewerSeller = (c) => {
    const currentUserId = String(user?.id || localStorage.getItem('userId') || '');
    const currentUserEmail = user?.email || '';
    return (
      (currentUserId && c?.otherUser?.id && String(c.otherUser.id) === currentUserId) ||
      (currentUserEmail && c?.otherUser?.id && String(c.otherUser.id) === currentUserEmail) ||
      (user?.name && c?.otherUser?.name && c.otherUser.name.toLowerCase() === user.name.toLowerCase())
    );
  };

  const getChatName = (c) => {
    if (isViewerSeller(c)) {
      return c?.buyer?.name || c?.currentUserName || 'Buyer';
    }
    return c?.otherUser?.name || c?.userName || 'Seller';
  };

  const getChatAvatar = (c) => {
    if (isViewerSeller(c)) {
      return c?.buyer?.avatar || c?.currentUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    }
    return c?.otherUser?.avatar || c?.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
  };

  const getChatLocation = (c) => {
    if (isViewerSeller(c)) {
      return c?.buyer?.location || c?.currentUserLocation || 'Local';
    }
    return c?.otherUser?.location || 'Sector 62, Noida, UP';
  };

  const isVerified = (c) => {
    if (isViewerSeller(c)) {
      return Boolean(c?.buyer?.verified || c?.currentUserVerified);
    }
    return Boolean(c?.otherUser?.verified || c?.verified);
  };
  const getTime = (c) => c?.lastMessageTime || c?.time || 'Today';

  const targetBookForModal = activeChat ? {
    id: activeChat.bookId,
    title: activeChat.bookTitle,
    price: activeChat.bookPrice,
    images: [activeChat.bookImage],
    seller: activeChat.otherUser,
    condition: 'Used - Good'
  } : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-7.5rem)] min-h-[580px]">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md h-full flex overflow-hidden">
          
          {/* ==================================================
              LEFT COLUMN: CONVERSATIONS LIST
              ================================================== */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Conversations Header */}
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-lg text-slate-900">
                    Messages
                  </h2>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {conversations.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              {/* Chat Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search chats or book titles..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeChat?.id === conv.id;
                  const name = getChatName(conv);
                  const avatar = getChatAvatar(conv);
                  const time = getTime(conv);
                  const hasUnread = conv.unreadCount > 0;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-indigo-50/70 border-l-4 border-indigo-600' 
                          : hasUnread 
                          ? 'bg-blue-50/40 hover:bg-slate-50' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={avatar}
                          alt={name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-xs truncate ${hasUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                            {name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {time}
                          </span>
                        </div>

                        <div className="text-[11px] font-semibold text-indigo-700 truncate flex items-center gap-1">
                          <BookOpen className="w-3 h-3 shrink-0 text-indigo-500" />
                          <span className="truncate">{conv.bookTitle}</span>
                        </div>

                        <p className={`text-xs truncate mt-0.5 ${hasUnread ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>

                      {hasUnread && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ==================================================
              RIGHT COLUMN: ACTIVE CHAT WINDOW
              ================================================== */}
          {activeChat ? (
            <div className="flex-1 flex flex-col h-full bg-slate-50/50 min-w-0">
              
              {/* TOP HEADER: Seller / Person Profile Banner */}
              <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex items-center justify-between gap-2 sm:gap-3 shrink-0 shadow-2xs">
                {/* Back button on mobile */}
                <button
                  type="button"
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer shrink-0"
                  title="Back to all chats"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Person Profile Section (Clickable to open detailed profile modal) */}
                <div 
                  onClick={() => setPersonModalOpen(true)}
                  className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 cursor-pointer group"
                  title="Click to view seller profile & rating info"
                >
                  <div className="relative shrink-0">
                    <img
                      src={getChatAvatar(activeChat)}
                      alt={getChatName(activeChat)}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-blue-500/40 transition-all"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
                        {getChatName(activeChat)}
                      </h3>
                      {isVerified(activeChat) && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span className="hidden xs:inline">Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                      <span className="text-emerald-700 font-medium">Online</span>
                      <span className="text-slate-300">·</span>
                      <span className="truncate">{getChatLocation(activeChat)}</span>
                      <span className="text-slate-300 hidden sm:inline">·</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBackendModalOpen(true);
                        }}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                          wsStatus === 'connected'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Spring Boot Backend & WebSocket Integration Status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{wsStatus === 'connected' ? 'WebSocket Live' : 'Spring Boot'}</span>
                      </button>

                      {/* WhatsApp-like Desktop Alert toggle */}
                      {requestDesktopPermission && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDesktopPermission();
                          }}
                          className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                            desktopPermission === 'granted'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          }`}
                          title="Click to enable system desktop alerts on incoming messages"
                        >
                          <span>{desktopPermission === 'granted' ? '🔔 Alerts On' : '🔔 Enable Alerts'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Info Button for Quick Person Details */}
                  <button
                    type="button"
                    onClick={() => setPersonModalOpen(true)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                    title="View seller rating & profile"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {/* Make Offer: Warm Amber */}
                  <button
                    type="button"
                    onClick={() => setOfferModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden xs:inline">Make Offer</span>
                    <span className="xs:hidden">Offer</span>
                  </button>

                  {/* Propose Swap: Fresh Teal (Tablet & Desktop) */}
                  <button
                    type="button"
                    onClick={() => setExchangeModalOpen(true)}
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600" />
                    <span>Swap</span>
                  </button>

                  {/* View Listing Link */}
                  {activeChat.bookId && (
                    <Link
                      to={`/books/${activeChat.bookId}`}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 shrink-0"
                      title="View book listing details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* BOOK DEAL RIBBON (Dedicated space so person info is not squashed) */}
              <div className="bg-slate-100/90 px-3.5 sm:px-4 py-2 border-b border-slate-200/90 flex items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={activeChat.bookImage}
                    alt={activeChat.bookTitle}
                    className="w-7 h-9 object-cover rounded-md border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-slate-900 truncate text-xs">
                      {activeChat.bookTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span>Price: <strong className="text-slate-950 font-bold">₹{activeChat.bookPrice}</strong></span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600 font-medium">Condition: {activeChat.bookCondition || 'Used - Good'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setExchangeModalOpen(true)}
                    className="sm:hidden px-2 py-1 rounded-lg text-[11px] font-bold bg-white text-teal-800 border border-teal-300 hover:bg-teal-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    Swap
                  </button>
                  {activeChat.bookId && (
                    <Link
                      to={`/books/${activeChat.bookId}`}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      <span>Book Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* MESSAGES SCROLL AREA */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {/* Book Trade Snapshot Card */}
                <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5 mb-4">
                  <img
                    src={activeChat.bookImage}
                    alt={activeChat.bookTitle}
                    className="w-12 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Trading Subject</div>
                    <div className="font-serif font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {activeChat.bookTitle}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Listed at <strong className="text-slate-900 font-sans">₹{activeChat.bookPrice}</strong> · Safe Meetup or Courier
                    </div>
                  </div>
                </div>

                {messages.map((msg) => {
                  const currentUserId = String(user?.id || localStorage.getItem('userId') || 'u-me');
                  const currentUserEmail = user?.email || '';
                  const isMe = String(msg.senderId) === currentUserId ||
                               (currentUserEmail && String(msg.senderId) === currentUserEmail) ||
                               (currentUserId === 'u-me' && msg.senderId === 'u-me');
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs shadow-2xs'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                        <span>{msg.time}</span>
                        {isMe && (
                          <CheckCheck className="w-3.5 h-3.5 text-indigo-500" title="Read" />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Real-time Typing Indicator */}
                {otherUserTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-2xl w-fit border border-slate-200 shadow-2xs">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    </div>
                    <span className="font-medium text-[11px] text-slate-600">
                      {getChatName(activeChat)} is typing...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK PROMPTS CHIPS */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick reply:</span>
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="shrink-0 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={handleSimulateImageSend}
                  className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Attach book photo for condition verification"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder={`Message ${getChatName(activeChat)}...`}
                  value={newMessage}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                />

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center p-8 bg-slate-50/50">
              <EmptyState
                type="messages"
                title="Select a conversation"
                description="Choose an ongoing discussion on the left or send an inquiry from a book listing."
              />
            </div>
          )}

        </div>

      </div>

      {/* Modals for Offer, Exchange and Person Profile Details */}
      {targetBookForModal && (
        <>
          <MakeOfferModal
            isOpen={offerModalOpen}
            onClose={() => setOfferModalOpen(false)}
            book={targetBookForModal}
          />

          <RequestExchangeModal
            isOpen={exchangeModalOpen}
            onClose={() => setExchangeModalOpen(false)}
            targetBook={targetBookForModal}
          />
        </>
      )}

      {/* Person Profile Information Modal */}
      {personModalOpen && activeChat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-info-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span id="seller-info-title" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isViewerSeller(activeChat) ? 'Buyer Profile Information' : 'Seller Profile Information'}
              </span>
              <button
                type="button"
                onClick={() => setPersonModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close user information"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={getChatAvatar(activeChat)}
                  alt={getChatName(activeChat)}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-serif font-bold text-slate-900 text-base truncate">
                    {getChatName(activeChat)}
                  </h4>
                  {isVerified(activeChat) && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Verified
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Member since {activeChat.otherUser?.memberSince || 'March 2024'}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-800">{activeChat.otherUser?.rating || '4.9'}</span>
                  <span className="text-slate-400">({activeChat.otherUser?.reviewsCount || '38'} ratings)</span>
                </div>
              </div>
            </div>

            {/* Details list */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Location</span>
                </span>
                <span className="font-semibold text-slate-900">{getChatLocation(activeChat)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Response Time</span>
                </span>
                <span className="font-semibold text-emerald-700">{activeChat.otherUser?.responseRate || '< 15 mins'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Buyer Protection</span>
                </span>
                <span className="font-semibold text-blue-700">BookLoop Escrow</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              {!isViewerSeller(activeChat) ? (
                <>
                  <Link
                    to={`/seller/${activeChat.otherUser?.id || 's-1'}`}
                    onClick={() => setPersonModalOpen(false)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <User className="w-4 h-4" />
                    <span>View Full Seller Profile & Books</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setPersonModalOpen(false);
                      setOfferModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span>Make Price Offer on Book</span>
                  </button>
                </>
              ) : (
                <div className="text-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
                  Direct Buyer Discussion for Book Purchase / Swap
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SPRING BOOT BACKEND STATUS & QUICKSTART MODAL
          ================================================== */}
      {backendModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setBackendModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base">
                    Spring Boot Chat Backend
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Real-time WebSocket &amp; REST Chat Module
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBackendModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close backend info modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Connection Status Indicator */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="font-semibold text-slate-800">
                  {wsStatus === 'connected' ? 'Connected to Spring Boot' : 'Fallback Local Mode Active'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                wsStatus === 'connected'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {wsStatus === 'connected' ? 'STOMP LIVE' : 'BACKEND READY'}
              </span>
            </div>

            {/* Architecture Details */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 font-sans">Module Directory:</span>
                  <span className="font-bold text-slate-800 font-mono">/backend</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 font-sans">REST Base:</span>
                  <span className="text-indigo-600 font-mono">{(typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '').replace(/\/api\/v1$/, '') : 'http://localhost:8000') + '/api/chat'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 font-sans">STOMP Endpoint:</span>
                  <span className="text-indigo-600 font-mono">{(typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WS_URL) || ((typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '').replace(/\/api\/v1$/, '') : 'http://localhost:8000') + '/ws-chat')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 font-sans">Topic Subscription:</span>
                  <span className="text-indigo-600 font-mono">/topic/conversation.&#123;id&#125;</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
                <strong className="font-semibold block mb-0.5 text-amber-950">Database Configuration:</strong>
                As requested, database values in <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[11px]">backend/src/main/resources/application.properties</code> have been left null/empty. You can connect your PostgreSQL, MySQL, or H2 database anytime.
              </div>

              {/* Terminal command snippet */}
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-1 text-xs font-mono">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 font-sans">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Run Backend Module:
                </div>
                <div className="text-emerald-400 select-all font-mono">
                  cd backend &amp;&amp; mvn spring-boot:run
                </div>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setBackendModalOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                Close &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
