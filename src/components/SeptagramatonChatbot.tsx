import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import {
  Bot,
  User,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Sparkles,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Terminal,
  CheckCircle2,
  Zap,
  Volume2,
  Check
} from "lucide-react";
import { getZodiacSignFromDate } from "./DailyAstroGuidance";
import { searchAppArchives, APP_ARCHIVE_COLLECTIONS } from "../utils/appArchiveSearch";
import { ArchiveSearchResult } from "../types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  mode?: "live" | "failsafe";
  thoughtTrace?: string;
  latency?: "low" | "normal";
  archiveSearchResults?: ArchiveSearchResult[];
}

export interface SeptagramatonChatbotProps {
  activeTab?: string;
  isOpenInitial?: boolean;
  school?: string;
  zodiacSign?: string;
  birthDate?: string;
  onSpeakText?: (text: string) => void;
  autoTtsEnabled?: boolean;
  setAutoTtsEnabled?: (enabled: boolean) => void;
}

export const SeptagramatonChatbot: React.FC<SeptagramatonChatbotProps> = ({
  activeTab = "general",
  isOpenInitial = false,
  school: propSchool,
  zodiacSign: propZodiacSign,
  birthDate: propBirthDate,
  onSpeakText,
  autoTtsEnabled: propAutoTtsEnabled,
  setAutoTtsEnabled: propSetAutoTtsEnabled
}) => {
  const triggerSpeak = (text: string) => {
    if (!text || !text.trim()) return;
    if (onSpeakText) {
      onSpeakText(text);
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/#/g, "")
        .replace(/\*/g, "")
        .replace(/_/g, "")
        .replace(/`/g, "")
        .replace(/~/g, "")
        .replace(/>/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };
  // Extract current school from state / props / localStorage
  const effectiveSchool = useMemo(() => {
    if (propSchool && propSchool.trim() !== "") return propSchool;
    if (typeof window !== "undefined") {
      const savedSchool = localStorage.getItem("oracle-active-school");
      if (savedSchool && savedSchool.trim() !== "") return savedSchool;
    }
    return "Hermetic Alchemy";
  }, [propSchool]);

  // Extract current zodiac sign from state / props / localStorage
  const effectiveZodiacSign = useMemo(() => {
    if (propZodiacSign && propZodiacSign.trim() !== "") return propZodiacSign;
    if (propBirthDate && propBirthDate.trim() !== "") return getZodiacSignFromDate(propBirthDate);
    if (typeof window !== "undefined") {
      const savedSign = localStorage.getItem("oracle-zodiac-sign");
      if (savedSign && savedSign.trim() !== "") return savedSign;
      const savedBirth = localStorage.getItem("oracle-birth-date");
      if (savedBirth) return getZodiacSignFromDate(savedBirth);
    }
    return "";
  }, [propZodiacSign, propBirthDate]);

  const [isOpen, setIsOpen] = useState<boolean>(isOpenInitial);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [pendingSuggestion, setPendingSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `Greetings, Seeker. I am the **Septagramaton Oracle & Knowledge Specialist**.\n\nI am synchronized with your active state:\n- **Workspace**: ${activeTab.toUpperCase()}${effectiveSchool ? `\n- **School of Thought**: ${effectiveSchool}` : ""}${effectiveZodiacSign ? `\n- **Zodiac Profile**: ${effectiveZodiacSign}` : ""}\n\nMy responses are dynamically tailored to your selected mystery tradition and astrological profile. How may I guide or assist your quest today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    setMessages((prev) => {
      const hasOnlyWelcome = prev.length === 1 && (prev[0].id === "welcome-msg" || prev[0].id.startsWith("welcome-msg"));
      if (!hasOnlyWelcome) return prev;
      
      const traditionInfo = effectiveSchool ? `\n- **School of Thought**: ${effectiveSchool}` : "";
      const zodiacInfo = effectiveZodiacSign ? `\n- **Zodiac Profile**: ${effectiveZodiacSign}` : "";
      
      return [
        {
          id: "welcome-msg",
          role: "assistant",
          content: `Greetings, Seeker. I am the **Septagramaton Oracle & Knowledge Specialist**.\n\nI am synchronized with your active state:\n- **Workspace**: ${activeTab.toUpperCase()}${traditionInfo}${zodiacInfo}\n\nMy responses are dynamically tailored to your selected mystery tradition and astrological profile. How may I guide or assist your quest today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
  }, [activeTab, effectiveSchool, effectiveZodiacSign]);

  // Context-aware quick prompt suggestions based on active tab, tradition, and zodiac sign
  const getTabSuggestions = (tab: string, currentSchool?: string, currentZodiac?: string) => {
    const suggestionsList: string[] = [];
    
    if (currentSchool) {
      suggestionsList.push(`How does the ${currentSchool} tradition view my astrological profile?`);
    }
    if (currentZodiac) {
      suggestionsList.push(`What key insights apply to a ${currentZodiac} seeker?`);
    }

    switch (tab) {
      case "sigil":
      case "aetheric-sigil":
        suggestionsList.push(
          "Explain the 7-Point Star Heptagram cipher",
          "What is the significance of the 112\" Whip Antenna?"
        );
        break;
      case "scriptura":
      case "scripture":
        suggestionsList.push(
          "How do I search across the Bible and Apocrypha?",
          "Explain Melchizedek scriptural cross-references"
        );
        break;
      case "zodiac":
      case "astrology":
      case "natal":
        suggestionsList.push(
          "Explain natal chart planetary aspects",
          "How to calculate planetary hour rulers?"
        );
        break;
      case "tarot":
        suggestionsList.push(
          "How to perform a Celtic Cross Tarot Reading?",
          "Explain Major Arcana cipher correspondences"
        );
        break;
      default:
        suggestionsList.push(
          "Troubleshoot application features step-by-step",
          "Explain the 7-Point Star Heptagram cipher"
        );
        break;
    }
    return suggestionsList.slice(0, 3);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setPendingSuggestion(null);
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-msg" && !m.id.startsWith("welcome-msg"))
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      // Extract current school and zodiac sign from state / props / localStorage
      const activeSchool = (propSchool && propSchool.trim() !== "") 
        ? propSchool 
        : (typeof window !== "undefined" && localStorage.getItem("oracle-active-school")) || effectiveSchool || "Hermetic Alchemy";

      const activeZodiac = (propZodiacSign && propZodiacSign.trim() !== "") 
        ? propZodiacSign 
        : (propBirthDate && propBirthDate.trim() !== "" ? getZodiacSignFromDate(propBirthDate) : "") || 
          (typeof window !== "undefined" && (localStorage.getItem("oracle-zodiac-sign") || (localStorage.getItem("oracle-birth-date") ? getZodiacSignFromDate(localStorage.getItem("oracle-birth-date")!) : ""))) || 
          effectiveZodiacSign || 
          "Unspecified";

      // Construct tailored system instruction with mystery school and zodiac sign context header
      const customSystemInstruction = `You are the official Septagramaton Oracle & Knowledge Specialist for 'The Great Wheel of Mysteries'.
Your primary mission is to provide deeply tailored esoteric wisdom, research assistance, and step-by-step troubleshooting that dynamically reflects the user's selected mystery tradition and astrological profile.

User Astrological Profile & Tradition Context:
- Selected Mystery Tradition / School of Thought: ${activeSchool}
- User's Astrological Zodiac Sign: ${activeZodiac}
- Active Workspace / Section: ${activeTab}

Instructions for Channeled Responses:
1. Dynamically tailor your explanations, tone, analogies, and mystical insights to resonate directly with the user's chosen mystery tradition (${activeSchool}) and astrological profile (${activeZodiac}).
2. When answering questions about astrological charts, scriptural concordances, or ciphers, weave in references to ${activeSchool} tenets and ${activeZodiac} elemental nature.
3. Structure your responses cleanly with Markdown (using headings, bold key terms, and bullet points).
4. If asked for troubleshooting, provide clear, multi-step resolutions.
5. Maintain a scholarly, respectful, and deeply luminous mystic tone.`;

      // Run search throughout app archives first
      const archiveHits = searchAppArchives(query, { limit: 3 });

      const assistantMsgId = `assistant-${Date.now()}`;
      const placeholderMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: "live",
        latency: "low",
        archiveSearchResults: archiveHits.results
      };

      setMessages((prev) => [...prev, placeholderMsg]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "text/event-stream"
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          context: { activeTab, school: activeSchool, zodiacSign: activeZodiac },
          systemInstruction: customSystemInstruction,
          stream: true
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let isFailsafe = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split("\n\n");

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const jsonStr = trimmed.slice(5).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === "meta") {
                if (parsed.mode === "failsafe") isFailsafe = true;
              } else if (parsed.type === "chunk" && parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: accumulatedText,
                          mode: isFailsafe ? "failsafe" : "live",
                          latency: "low"
                        }
                      : m
                  )
                );
              }
            } catch (e) {
              // Ignore split chunk parse errors
            }
          }
        }

        const finalStreamText = accumulatedText || "I have received your vibration, but could not produce a response.";
        if (!accumulatedText) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: finalStreamText, latency: "low" }
                : m
            )
          );
        }

        // Trigger Auto-TTS if enabled
        const isAutoTtsOn = propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true");
        if (isAutoTtsOn) {
          triggerSpeak(finalStreamText);
        }
      } else {
        const data = await res.json();
        const finalReplyText = data.reply || "I have received your vibration, but could not produce a response.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: finalReplyText,
                  mode: data.mode,
                  thoughtTrace: data.thought_trace || data.reasoning,
                  latency: "low"
                }
              : m
          )
        );

        // Trigger Auto-TTS if enabled
        const isAutoTtsOn = propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true");
        if (isAutoTtsOn) {
          triggerSpeak(finalReplyText);
        }
      }
    } catch (err: any) {
      console.error("[Septagramaton Chatbot Error]:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `### ⚠️ Aetheric Signal Interruption\n\nI encountered a temporary connection issue (${err.message}). \n\n**Troubleshooting Suggestions:**\n1. Check your network connection.\n2. Verify the application dev server status.\n3. Try asking your question again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        content: `Greetings, Seeker. Channel cleared.\n\n- **School of Thought**: ${effectiveSchool}\n- **Zodiac Profile**: ${effectiveZodiacSign || "Unspecified"}\n\nHow may I assist your inquiries today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-slate-950 px-4 py-3 rounded-full shadow-2xl hover:shadow-amber-500/20 font-medium text-sm transition-all hover:scale-105 border border-amber-300/40"
            title="Open Septagramaton Oracle AI Assistant"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950" />
            </div>
            <span className="font-semibold tracking-wide">Septagramaton Oracle</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 bg-slate-950/95 backdrop-blur-md border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              isMinimized
                ? "bottom-6 right-6 w-80 h-16"
                : "bottom-6 right-6 w-96 md:w-[420px] h-[600px] max-h-[85vh]"
            }`}
          >
            {/* Header */}
            <div className="bg-slate-900/90 border-b border-amber-500/20 px-4 py-3 flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-3" onClick={() => setIsMinimized(!isMinimized)}>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100 tracking-wide">
                      Septagramaton Oracle
                    </h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono border border-amber-500/30">
                      LIVE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>{effectiveSchool}</span>
                    {effectiveZodiacSign && (
                      <>
                        <span>•</span>
                        <span className="text-amber-300">{effectiveZodiacSign}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    const currentAutoTts = propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true");
                    const nextVal = !currentAutoTts;
                    if (propSetAutoTtsEnabled) propSetAutoTtsEnabled(nextVal);
                    if (typeof window !== "undefined") localStorage.setItem("oracle-auto-tts-chatbot-enabled", String(nextVal));
                  }}
                  className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
                    (propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true"))
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                  title={(propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true")) ? "Auto-Read Chatbot: ON (Hands-Free)" : "Auto-Read Chatbot: OFF"}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">
                    {(propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true")) ? "Auto-TTS ON" : "Auto-TTS OFF"}
                  </span>
                </button>
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* Active Context Banner */}
                <div className="bg-amber-950/20 border-b border-amber-500/10 px-4 py-2 flex items-center justify-between text-[11px] text-amber-300/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Synchronized: <strong className="text-amber-200">{effectiveSchool}</strong></span>
                    {effectiveZodiacSign && <span>({effectiveZodiacSign})</span>}
                  </div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase shrink-0">{activeTab}</span>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-800">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-4 h-4 text-amber-400" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                          msg.role === "user"
                            ? "bg-amber-600 text-slate-950 font-medium rounded-tr-none"
                            : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <>
                            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                              <Markdown>{msg.content}</Markdown>
                            </div>

                            {/* App Archives Searched Section */}
                            {msg.archiveSearchResults && msg.archiveSearchResults.length > 0 && (
                              <div className="mt-3 pt-2.5 border-t border-amber-500/20 text-[10px]">
                                <div className="text-[10px] font-mono text-amber-300 font-semibold mb-1 flex items-center gap-1">
                                  <span>📜</span> App Archives Searched ({msg.archiveSearchResults.length} matches):
                                </div>
                                <div className="space-y-1.5 mt-1">
                                  {msg.archiveSearchResults.map((arc, aIdx) => (
                                    <div key={aIdx} className="p-2 rounded bg-black/40 border border-amber-500/20 text-[10px]">
                                      <div className="flex items-center justify-between text-amber-400 font-mono text-[9px] mb-0.5">
                                        <span>✦ {arc.archiveCollection}</span>
                                        {arc.reference && <span className="text-slate-400">{arc.reference}</span>}
                                      </div>
                                      <div className="font-semibold text-slate-200">{arc.title}</div>
                                      <p className="text-slate-400 italic line-clamp-2 mt-0.5">"{arc.excerpt}"</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}

                        <div className="flex items-center justify-between gap-2 mt-1.5 text-[10px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span>{msg.timestamp}</span>
                            {msg.role === "assistant" && (
                              <button
                                onClick={() => triggerSpeak(msg.content)}
                                className="p-0.5 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                                title="Read message aloud"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {msg.latency === "low" && (
                              <span className="text-emerald-400 font-mono text-[9px] flex items-center gap-0.5 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                                <Zap className="w-2.5 h-2.5" /> LOW LATENCY
                              </span>
                            )}
                            {msg.mode === "failsafe" && (
                              <span className="text-amber-400/80 font-mono text-[9px]">AETHERIC FAILSAFE</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {msg.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-slate-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span className="text-xs">Consulting the Septagramaton Oracle...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length < 5 && !isLoading && (
                  <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/60">
                    <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-amber-400" />
                      TAILORED INQUIRIES:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {getTabSuggestions(activeTab, effectiveSchool, effectiveZodiacSign).map((prompt, idx) => {
                        const isSelected = pendingSuggestion === prompt;
                        return (
                          <button
                            key={idx}
                            id={`septagramaton-prompt-btn-${idx}`}
                            onClick={() => {
                              setInputMessage(prompt);
                              setPendingSuggestion(prompt);
                              setTimeout(() => {
                                inputRef.current?.focus();
                              }, 50);
                            }}
                            title="Click to load and review this question"
                            className={`text-[11px] px-2.5 py-1 rounded-full transition-all text-left truncate max-w-full cursor-pointer ${
                              isSelected
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/60 ring-1 ring-amber-500/30"
                                : "bg-slate-900 hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/30"
                            }`}
                          >
                            💡 {prompt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pre-made Question Confirmation Bar */}
                {pendingSuggestion && (
                  <div
                    id="septagramaton-suggestion-confirmation-bar"
                    className="px-3 py-2 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-t border-amber-500/30 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 text-amber-300">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400 text-[11px]">Ready to ask:</span>{" "}
                        <span className="font-medium text-amber-200 truncate font-mono">"{pendingSuggestion}"</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        id="septagramaton-confirm-suggestion-btn"
                        onClick={() => {
                          const text = pendingSuggestion;
                          setPendingSuggestion(null);
                          handleSendMessage(text);
                        }}
                        disabled={isLoading}
                        className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> OK / Send
                      </button>
                      <button
                        id="septagramaton-cancel-suggestion-btn"
                        onClick={() => {
                          setPendingSuggestion(null);
                          setInputMessage("");
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] rounded-lg transition-colors cursor-pointer"
                        title="Clear pre-made question"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-3 border-t border-amber-500/20 bg-slate-900/90">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => {
                        setInputMessage(e.target.value);
                        if (pendingSuggestion && e.target.value !== pendingSuggestion) {
                          setPendingSuggestion(null);
                        }
                      }}
                      placeholder={`Inquire as a ${effectiveZodiacSign || 'seeker'} of ${effectiveSchool}...`}
                      disabled={isLoading}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-40 text-slate-950 p-2 rounded-xl transition-all font-medium shrink-0 shadow-lg"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
