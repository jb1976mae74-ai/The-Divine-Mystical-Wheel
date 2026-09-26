import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Loader2, Sparkles, User as UserIcon, Bot, LogIn, 
  Globe, Search, ExternalLink, ChevronDown, Check, Compass, BookOpen, Layers,
  Radio, ShieldCheck, Zap, Trash2, RotateCcw
} from 'lucide-react';
import { db, auth, googleSignIn } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, updateDoc, arrayUnion, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ChatMessage, ChatSession, GroundingSource, EngineLinks, ArchiveSearchResult } from '../types';
import { searchAppArchives, APP_ARCHIVE_COLLECTIONS } from '../utils/appArchiveSearch';
import ReactMarkdown from 'react-markdown';

type SearchEngineType = 'all' | 'google' | 'bing' | 'yahoo' | 'scholarly';

const SEARCH_ENGINE_OPTIONS: { id: SearchEngineType; label: string; icon: string; description: string }[] = [
  { id: 'all', label: 'Omni Synthesis', icon: '🌐', description: 'Google Grounded + Bing + Yahoo + Scholarly synthesis' },
  { id: 'google', label: 'Google Search', icon: '🔍', description: 'Real-time live Google Search grounding' },
  { id: 'bing', label: 'Microsoft Bing', icon: '💠', description: 'Bing structured search & knowledge indexing' },
  { id: 'yahoo', label: 'Yahoo! Search', icon: '🟣', description: 'Yahoo news, archival & global directories' },
  { id: 'scholarly', label: 'Sacred Archives', icon: '📜', description: 'Dead Sea Scrolls, Perseus & esoteric manuscripts' },
];

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  role: 'model',
  content: 'Greetings, seeker of truth. I am the **Mystic Guide**, powered by **Gemini 3.8 Flash** with **High Intelligence** and real-time live grounding across **Google Search**, **Microsoft Bing**, **Yahoo!**, and ancient scholarly archives.\n\nInquire of sacred geometry, ancient ciphers, recent historical discoveries, or navigation across the Great Wheel of Mysteries.',
  timestamp: new Date().toISOString(),
  engineUsed: 'all',
  modelUsed: 'gemini-3.8-flash'
};

export const MysticGuideChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  
  // Search Engine & Intelligence Options
  const [selectedEngine, setSelectedEngine] = useState<SearchEngineType>('all');
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [expandedSourcesIdx, setExpandedSourcesIdx] = useState<number | null>(null);
  
  // App Archives First-Search States
  const [archiveFirstEnabled, setArchiveFirstEnabled] = useState(true);
  const [searchPhase, setSearchPhase] = useState<'idle' | 'searching_archives' | 'synthesizing'>('idle');
  const [archiveScanStatus, setArchiveScanStatus] = useState<string>('');
  const [expandedArchivesIdx, setExpandedArchivesIdx] = useState<number | null>(null);
  const [showArchiveBrowser, setShowArchiveBrowser] = useState(false);
  const [archiveFilterQuery, setArchiveFilterQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load chat session on open or user change
  useEffect(() => {
    if (!isOpen) return;

    if (!currentUser) {
      // Load guest conversation from localStorage if available
      try {
        const saved = localStorage.getItem('mystic_guide_guest_chat_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch (e) {}
      setMessages([DEFAULT_WELCOME_MESSAGE]);
      return;
    }

    const loadLastChat = async () => {
      try {
        const chatsRef = collection(db, 'users', currentUser.uid, 'chats');
        const q = query(chatsRef, orderBy('updatedAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const lastChat = querySnapshot.docs[0].data() as ChatSession;
          setCurrentChatId(lastChat.id);
          setMessages(lastChat.messages?.length ? lastChat.messages : [DEFAULT_WELCOME_MESSAGE]);
        } else {
          // Create a new session in Firestore
          const newChatId = `chat_${Date.now()}`;
          const newSession: ChatSession = {
            id: newChatId,
            userId: currentUser.uid,
            messages: [DEFAULT_WELCOME_MESSAGE],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', currentUser.uid, 'chats', newChatId), newSession);
          setCurrentChatId(newChatId);
          setMessages([DEFAULT_WELCOME_MESSAGE]);
        }
      } catch (err) {
        console.warn('Could not retrieve remote chat transcripts:', err);
      }
    };

    loadLastChat();
  }, [isOpen, currentUser]);

  const handleGoogleAuth = async () => {
    try {
      setIsSigningIn(true);
      await googleSignIn();
    } catch (e) {
      console.error('Sign-in failed:', e);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleClearChat = async () => {
    const freshMessages = [DEFAULT_WELCOME_MESSAGE];
    setMessages(freshMessages);
    try {
      localStorage.removeItem('mystic_guide_guest_chat_v2');
    } catch (e) {}

    if (currentUser) {
      const newChatId = `chat_${Date.now()}`;
      setCurrentChatId(newChatId);
      try {
        const newSession: ChatSession = {
          id: newChatId,
          userId: currentUser.uid,
          messages: freshMessages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', currentUser.uid, 'chats', newChatId), newSession);
      } catch (err) {
        console.warn('Could not save cleared chat session:', err);
      }
    }
  };

  const handleSend = async (e: React.FormEvent, directPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = directPrompt || message;
    if (!promptToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: promptToSend.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);
    setShowEngineDropdown(false);

    // STEP 1: Search throughout the app's archives first
    setSearchPhase('searching_archives');
    setArchiveScanStatus('Scanning 9 Sanctuary Archives (Dead Sea Scrolls, Enochian, Anunnaki, Salazar Heptagram, Ciphers)...');

    // Run client archive scan immediately
    const clientArchiveHit = searchAppArchives(promptToSend.trim(), { limit: 5 });
    if (clientArchiveHit.results.length > 0) {
      const distinctCols = Array.from(new Set(clientArchiveHit.results.map(r => r.archiveCollection)));
      setArchiveScanStatus(`Located ${clientArchiveHit.results.length} archive records in: ${distinctCols.slice(0, 2).join(', ')}${distinctCols.length > 2 ? '...' : ''}`);
    } else {
      setArchiveScanStatus('App archives scanned (9 collections). Grounding in foundational sanctuary codex...');
    }

    // Smooth transition to model synthesis
    const phaseTimer = setTimeout(() => {
      setSearchPhase('synthesizing');
    }, 700);

    // Save locally for guest
    if (!currentUser) {
      try {
        localStorage.setItem('mystic_guide_guest_chat_v2', JSON.stringify(updatedMessages));
      } catch (e) {}
    }

    try {
      // Update Firestore if logged in
      if (currentUser && currentChatId) {
        try {
          const chatRef = doc(db, 'users', currentUser.uid, 'chats', currentChatId);
          await updateDoc(chatRef, {
            messages: arrayUnion(userMessage),
            updatedAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn('Firestore sync note:', dbErr);
        }
      }

      // Call Gemini High Intelligence API with Search Grounding & Archive Pre-Search
      const response = await fetch('/api/mystic-guide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          searchEngine: selectedEngine,
          searchEnabled: searchEnabled,
          archiveFirstSearch: archiveFirstEnabled,
          history: updatedMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content
          })).slice(0, -1)
        })
      });

      const data = await response.json();
      
      if (data.text) {
        const botMessage: ChatMessage = {
          role: 'model',
          content: data.text,
          timestamp: new Date().toISOString(),
          sources: data.sources || [],
          webSearchQueries: data.webSearchQueries || [],
          engineLinks: data.engineLinks,
          engineUsed: data.engineUsed || selectedEngine,
          modelUsed: data.modelUsed || 'gemini-3.8-flash',
          archiveSearchResults: (data.archiveSearchResults && data.archiveSearchResults.length > 0) 
            ? data.archiveSearchResults 
            : clientArchiveHit.results,
          archivesSearched: data.archivesSearched || clientArchiveHit.collectionsScanned,
          archiveSearchSummary: data.archiveSearchSummary || clientArchiveHit.searchSummary
        };
        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);

        if (!currentUser) {
          try {
            localStorage.setItem('mystic_guide_guest_chat_v2', JSON.stringify(finalMessages));
          } catch (e) {}
        } else if (currentChatId) {
          try {
            const chatRef = doc(db, 'users', currentUser.uid, 'chats', currentChatId);
            await updateDoc(chatRef, {
              messages: arrayUnion(botMessage),
              updatedAt: new Date().toISOString()
            });
          } catch (dbErr) {
            console.warn('Firestore bot message sync note:', dbErr);
          }
        }
      } else {
        throw new Error(data.error || 'The celestial channels are silent.');
      }
    } catch (err: any) {
      console.warn('Chat transmission notice:', err?.message || err);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: `Seeker, the celestial stream encountered a brief alignment pause. You may attempt your inquiry once more, or select an alternative search engine perspective above.`,
        timestamp: new Date().toISOString(),
        archiveSearchResults: clientArchiveHit.results,
        archivesSearched: clientArchiveHit.collectionsScanned,
        archiveSearchSummary: clientArchiveHit.searchSummary
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      clearTimeout(phaseTimer);
      setIsLoading(false);
      setSearchPhase('idle');
    }
  };

  const activeEngineObj = SEARCH_ENGINE_OPTIONS.find(e => e.id === selectedEngine) || SEARCH_ENGINE_OPTIONS[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[360px] sm:w-[440px] h-[580px] bg-slate-950/95 border border-amber-500/35 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-slate-900/90 backdrop-blur p-3.5 border-b border-amber-500/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600/30 to-amber-400/10 flex items-center justify-center border border-amber-500/40 shadow-inner">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-amber-300 font-bold text-sm tracking-wide">Mystic Guide</h3>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono bg-amber-500/15 text-amber-300 rounded border border-amber-500/30 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-amber-400" /> High Intelligence
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span>Gemini 3.8 Flash</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Globe className="w-2.5 h-2.5" /> Multi-Engine Search
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClearChat}
                    title="Clear and clean chat history"
                    className="flex items-center gap-1 px-2 py-1 text-[11px] bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/40 rounded-lg transition-all cursor-pointer group"
                    aria-label="Clean Mystic Guide portal"
                  >
                    <Trash2 className="w-3 h-3 text-slate-400 group-hover:text-red-400 transition-colors" />
                    <span>Clean</span>
                  </button>
                  {!currentUser && (
                    <button
                      onClick={handleGoogleAuth}
                      disabled={isSigningIn}
                      title="Sign in with Google to sync history to Firestore"
                      className="flex items-center gap-1 px-2 py-1 text-[11px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition-all cursor-pointer"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Sync</span>
                    </button>
                  )}
                  {currentUser && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" title="Connected & synced to sacred records" />
                  )}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Multi-Search Engine Toolbar */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                <div className="relative">
                  <button
                    onClick={() => setShowEngineDropdown(!showEngineDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 text-[11px] transition-colors"
                  >
                    <span>{activeEngineObj.icon}</span>
                    <span className="font-medium text-amber-300">{activeEngineObj.label}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Engine Dropdown Menu */}
                  <AnimatePresence>
                    {showEngineDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.96 }}
                        className="absolute left-0 top-8 z-30 w-64 bg-slate-900 border border-amber-500/30 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 backdrop-blur-xl"
                      >
                        <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/5">
                          Search Intelligence Engine
                        </div>
                        {SEARCH_ENGINE_OPTIONS.map((engine) => (
                          <button
                            key={engine.id}
                            onClick={() => {
                              setSelectedEngine(engine.id);
                              setShowEngineDropdown(false);
                            }}
                            className={`flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                              selectedEngine === engine.id 
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' 
                                : 'hover:bg-slate-800/80 text-slate-300'
                            }`}
                          >
                            <span className="text-base leading-none pt-0.5">{engine.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-xs flex items-center justify-between">
                                {engine.label}
                                {selectedEngine === engine.id && <Check className="w-3 h-3 text-amber-400" />}
                              </div>
                              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{engine.description}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* App Archives First-Search Badge & Browser */}
                  <button
                    onClick={() => setShowArchiveBrowser(!showArchiveBrowser)}
                    title="App archives are searched first for every query. Click to explore the 9 collections."
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
                      showArchiveBrowser
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                    }`}
                  >
                    <span>📜</span>
                    <span className="font-mono text-[10px]">Archives (9)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </button>

                  {/* Grounding Toggle */}
                  <button
                    onClick={() => setSearchEnabled(!searchEnabled)}
                    title="Toggle real-time live search grounding"
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
                      searchEnabled
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Globe className={`w-3 h-3 ${searchEnabled ? 'text-emerald-400 animate-spin-slow' : 'text-slate-500'}`} />
                    <span>Search: {searchEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* App Archives Inspector Panel */}
            <AnimatePresence>
              {showArchiveBrowser && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-950 border-b border-amber-500/30 overflow-hidden"
                >
                  <div className="p-3 max-h-60 overflow-y-auto space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">App Archives Codex</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                          Searched First
                        </span>
                      </div>
                      <button
                        onClick={() => setShowArchiveBrowser(false)}
                        className="text-slate-400 hover:text-slate-200 text-[10px]"
                      >
                        Close
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={archiveFilterQuery}
                        onChange={(e) => setArchiveFilterQuery(e.target.value)}
                        placeholder="Search across all 9 internal archives..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      {archiveFilterQuery.trim() ? (
                        // Search matching results
                        searchAppArchives(archiveFilterQuery, { limit: 4 }).results.map((res, rIdx) => (
                          <div
                            key={rIdx}
                            onClick={() => {
                              setMessage(`Tell me more about ${res.title} from the ${res.archiveCollection} archive.`);
                              setShowArchiveBrowser(false);
                            }}
                            className="p-2 rounded bg-slate-900/90 border border-amber-500/20 hover:border-amber-400/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-amber-400 font-semibold">{res.archiveCollection}</span>
                              <span className="text-[9px] text-emerald-400 font-mono">Click to ask</span>
                            </div>
                            <h6 className="font-semibold text-slate-100 text-[11px] mt-0.5">{res.title}</h6>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{res.excerpt}</p>
                          </div>
                        ))
                      ) : (
                        // List of the 9 collections
                        APP_ARCHIVE_COLLECTIONS.map((col) => (
                          <div
                            key={col.id}
                            onClick={() => {
                              setMessage(`Search the ${col.name} archive for key insights.`);
                              setShowArchiveBrowser(false);
                            }}
                            className="p-2 rounded bg-slate-900/70 hover:bg-slate-800/80 border border-white/5 hover:border-amber-500/30 cursor-pointer transition-all flex items-start gap-2"
                          >
                            <span className="text-base pt-0.5">{col.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[11px] text-slate-200">{col.name}</span>
                                <span className="text-[9px] text-amber-400/80 font-mono">{col.recordCount}+ records</span>
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{col.description}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sync Banner if Guest */}
            {!currentUser && (
              <div className="bg-amber-950/40 border-b border-amber-500/20 px-3 py-1 flex items-center justify-between text-[10px] text-amber-300/80">
                <span>Guest mode • Stored in local ledger</span>
                <button 
                  onClick={handleGoogleAuth}
                  disabled={isSigningIn}
                  className="underline hover:text-amber-200 font-medium ml-2"
                >
                  Sign in for Cloud Firestore sync
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2.5 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border mt-0.5 ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 border-slate-700 text-slate-300' 
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm'
                    }`}>
                      {msg.role === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      {/* Engine Tag */}
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Gemini 3.8 Flash
                          </span>
                          <span>•</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5 text-emerald-400" />
                            {msg.engineUsed === 'bing' ? 'Bing Grounded' : msg.engineUsed === 'yahoo' ? 'Yahoo Directory' : msg.engineUsed === 'scholarly' ? 'Sacred Archive' : 'Google & Omni Grounded'}
                          </span>
                        </div>
                      )}

                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-amber-600 text-white rounded-tr-none shadow-md' 
                          : 'bg-slate-900/90 text-slate-200 border border-amber-500/20 rounded-tl-none shadow-lg'
                      }`}>
                        <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed font-sans">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>

                        {/* App Archives Searched Section (Pre-Query Archive Scan) */}
                        {msg.role === 'model' && msg.archiveSearchResults && msg.archiveSearchResults.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-amber-500/20 text-[10px]">
                            <button
                              onClick={() => setExpandedArchivesIdx(expandedArchivesIdx === idx ? null : idx)}
                              className="flex items-center justify-between w-full text-amber-300 font-medium py-1.5 px-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 transition-all cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="text-xs">📜</span>
                                <span className="font-semibold text-amber-200">App Archives Searched</span>
                                <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-full font-mono border border-amber-500/30">
                                  {msg.archiveSearchResults.length} Matches Found
                                </span>
                              </span>
                              <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${expandedArchivesIdx === idx ? 'rotate-180' : ''}`} />
                            </button>

                            {(expandedArchivesIdx === idx || msg.archiveSearchResults.length <= 2) && (
                              <div className="mt-2 space-y-2 bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/20">
                                <div className="text-[9px] text-slate-400 font-mono flex items-center justify-between pb-1 border-b border-white/5">
                                  <span>{msg.archiveSearchSummary || `Cross-referenced with 9 Sanctuary Collections`}</span>
                                </div>
                                {msg.archiveSearchResults.map((arc, aIdx) => (
                                  <div key={aIdx} className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/15 hover:border-amber-500/30 transition-colors">
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
                                        <span>✦</span> {arc.archiveCollection}
                                      </span>
                                      {arc.reference && (
                                        <span className="text-[8px] font-mono text-slate-400 px-1 py-0.5 rounded bg-black/40 border border-white/5">
                                          {arc.reference}
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="font-semibold text-slate-100 text-[11px] mb-1">{arc.title}</h5>
                                    <p className="text-[10px] text-slate-300 italic leading-relaxed line-clamp-3">
                                      "{arc.excerpt}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Verified Grounding Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px]">
                            <button
                              onClick={() => setExpandedSourcesIdx(expandedSourcesIdx === idx ? null : idx)}
                              className="flex items-center justify-between w-full text-amber-300/90 hover:text-amber-200 font-medium py-1"
                            >
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-emerald-400" /> Verified Sources & Citations ({msg.sources.length})
                              </span>
                              <ChevronDown className={`w-3 h-3 transition-transform ${expandedSourcesIdx === idx ? 'rotate-180' : ''}`} />
                            </button>

                            {(expandedSourcesIdx === idx || msg.sources.length <= 2) && (
                              <div className="mt-1.5 space-y-1">
                                {msg.sources.map((src, sIdx) => (
                                  <a
                                    key={sIdx}
                                    href={src.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-1.5 rounded bg-black/40 hover:bg-black/60 border border-white/5 text-slate-300 hover:text-amber-200 transition-colors group"
                                  >
                                    <span className="truncate pr-2 font-mono text-[9px]">{src.title}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Cross-Reference on Top Search Engines Bar */}
                        {msg.engineLinks && (
                          <div className="mt-3 pt-2 border-t border-white/10">
                            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                              <Search className="w-2.5 h-2.5 text-amber-400" /> Cross-Reference On Top Engines:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <a
                                href={msg.engineLinks.google}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded text-[10px] bg-blue-950/50 hover:bg-blue-900/60 border border-blue-600/40 text-blue-300 flex items-center gap-1 transition-colors"
                              >
                                <span>🔍</span> Google
                              </a>
                              <a
                                href={msg.engineLinks.bing}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-600/40 text-cyan-300 flex items-center gap-1 transition-colors"
                              >
                                <span>💠</span> Bing
                              </a>
                              <a
                                href={msg.engineLinks.yahoo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded text-[10px] bg-purple-950/50 hover:bg-purple-900/60 border border-purple-600/40 text-purple-300 flex items-center gap-1 transition-colors"
                              >
                                <span>🟣</span> Yahoo!
                              </a>
                              <a
                                href={msg.engineLinks.duckduckgo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded text-[10px] bg-orange-950/50 hover:bg-orange-900/60 border border-orange-600/40 text-orange-300 flex items-center gap-1 transition-colors"
                              >
                                <span>🦆</span> DuckDuckGo
                              </a>
                              {msg.engineLinks.archive && (
                                <a
                                  href={msg.engineLinks.archive}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 flex items-center gap-1 transition-colors"
                                >
                                  <span>📜</span> Archive
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-1.5 bg-slate-900/95 border border-amber-500/30 p-3 rounded-2xl w-fit max-w-[95%] shadow-xl"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>
                      {searchPhase === 'searching_archives'
                        ? 'Step 1: Running search through application archives...'
                        : 'Step 2: Synthesizing intelligence across App Archives & Search Grounding...'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 flex items-center gap-1.5 pl-5 font-mono">
                    <span className="text-amber-400">⚡</span>
                    <span>{archiveScanStatus || 'Scanning Dead Sea Scrolls, Anunnaki, Enochian & Salazar archives...'}</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inspiration Prompts */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {[
                  "Dead Sea Scrolls Cave 1 discoveries",
                  "Anunnaki Tablets of Destiny & Enki",
                  "Salazar Heptagram & 112\" Aetheric Whip",
                  "Enochian 30 Aethyrs & Angelic Keys",
                  "Platonic solids & Metatron's Cube"
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={(e) => handleSend(e, prompt)}
                    className="text-[10px] bg-slate-800/80 hover:bg-amber-950/50 hover:text-amber-200 border border-slate-700/60 hover:border-amber-500/30 text-slate-300 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>✦</span> {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form with Archive First Indicator */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900/95 border-t border-amber-500/20 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1 text-amber-300/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Archive Pre-Scan Active: 9 Collections</span>
                </span>
                <span className="text-slate-500">First-Party Codex Grounded</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Inquire of the archives or ask with ${activeEngineObj.label}...`}
                  className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-amber-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none transition-colors placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 px-3.5 py-2.5 rounded-xl text-white transition-all shadow-md active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 border-2 ${
          isOpen 
            ? 'bg-slate-900 border-amber-500 text-amber-400' 
            : 'bg-amber-600 border-amber-400/80 text-white hover:bg-amber-500 shadow-amber-600/30'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default MysticGuideChat;
