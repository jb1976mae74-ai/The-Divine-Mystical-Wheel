import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
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
  VolumeX,
  Copy,
  Check,
  Share2,
  ExternalLink,
  FileText,
  Link,
  EyeOff,
  Eye,
  GripVertical,
  Move,
  RotateCcw
} from "lucide-react";
import { getZodiacSignFromDate } from "./DailyAstroGuidance";
import SocialShareModal from "./SocialShareModal";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  mode?: "live" | "failsafe";
  thoughtTrace?: string;
  latency?: "low" | "normal";
}

interface GeminiChatbotProps {
  activeTab?: string;
  isOpenInitial?: boolean;
  school?: string;
  zodiacSign?: string;
  birthDate?: string;
  onSpeakText?: (text: string) => void;
  autoTtsEnabled?: boolean;
  setAutoTtsEnabled?: (enabled: boolean) => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
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
  // Automatically retrieve active school from prop or localStorage
  const effectiveSchool = useMemo(() => {
    if (propSchool && propSchool.trim() !== "") return propSchool;
    if (typeof window !== "undefined") {
      const savedSchool = localStorage.getItem("oracle-active-school");
      if (savedSchool && savedSchool.trim() !== "") return savedSchool;
    }
    return "Hermetic Alchemy";
  }, [propSchool]);

  // Automatically retrieve zodiac sign from prop, birthDate prop, or localStorage
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
  const [dragResetKey, setDragResetKey] = useState<number>(0);
  const panelDragControls = useDragControls();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("gemini-support-launcher-dismissed") === "true";
    }
    return false;
  });

  const handleToggleDismiss = (dismiss: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsDismissed(dismiss);
    if (typeof window !== "undefined") {
      localStorage.setItem("gemini-support-launcher-dismissed", String(dismiss));
    }
  };
  const [inputMessage, setInputMessage] = useState<string>("");
  const [pendingSuggestion, setPendingSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);
  const [shareModalState, setShareModalState] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
    url: string;
  }>({
    isOpen: false,
    title: "Gemini AI Support Agent Portal",
    text: "",
    url: ""
  });

  const handleCopyPortalLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const portalUrl = typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?portal=gemini-support&tab=${encodeURIComponent(activeTab)}${effectiveSchool ? `&school=${encodeURIComponent(effectiveSchool)}` : ""}${effectiveZodiacSign ? `&zodiac=${encodeURIComponent(effectiveZodiacSign)}` : ""}`
      : "";

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(portalUrl).then(() => {
        setCopyFeedback("link");
        setTimeout(() => setCopyFeedback(null), 2500);
      });
    }
    setIsShareMenuOpen(false);
  };

  const handleCopyTranscript = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const headerInfo = `🔮 THE GREAT WHEEL OF MYSTERIES - GEMINI SUPPORT AGENT PORTAL
Workspace: ${activeTab.toUpperCase()}
School of Thought: ${effectiveSchool || "General"}
Zodiac Profile: ${effectiveZodiacSign || "General"}
Timestamp: ${new Date().toLocaleString()}

==================================================
`;
    const formattedTranscript = messages
      .map(m => `[${m.timestamp}] ${m.role === "user" ? "SEEKER" : "GEMINI AGENT"}:\n${m.content}`)
      .join("\n\n");

    const fullText = `${headerInfo}\n${formattedTranscript}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        setCopyFeedback("transcript");
        setTimeout(() => setCopyFeedback(null), 2500);
      });
    }
    setIsShareMenuOpen(false);
  };

  const handleOpenSocialShare = (customText?: string, customTitle?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const latestAssistantMsg = messages.filter(m => m.role === "assistant").pop()?.content || "Gemini AI Support & Knowledge Specialist Portal";
    const cleanText = (customText || latestAssistantMsg).replace(/#/g, "").replace(/\*/g, "").substring(0, 260);
    const portalUrl = typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?portal=gemini-support&tab=${encodeURIComponent(activeTab)}`
      : "";

    setShareModalState({
      isOpen: true,
      title: customTitle || "Gemini AI Support & Knowledge Agent Portal",
      text: `🔮 Gemini Support Revelation (${activeTab.toUpperCase()}): "${cleanText}"`,
      url: portalUrl
    });
    setIsShareMenuOpen(false);
  };

  const handleCopySingleMessage = (msgId: string, content: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanText = content.replace(/#/g, "").replace(/\*/g, "");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cleanText).then(() => {
        setCopiedMsgId(msgId);
        setTimeout(() => setCopiedMsgId(null), 2000);
      });
    }
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `Greetings, Seeker. I am your **Context-Aware Gemini Support & Knowledge Specialist**.\n\nI am synchronized with your active profile:\n- **Workspace**: ${activeTab.toUpperCase()}${effectiveSchool ? `\n- **School of Thought**: ${effectiveSchool}` : ""}${effectiveZodiacSign ? `\n- **Zodiac Profile**: ${effectiveZodiacSign}` : ""}\n\nMy responses are dynamically tailored to your chosen tradition and astrological profile. How may I guide or assist your quest today?`,
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
    // Dynamically update initial welcome message when effectiveSchool or effectiveZodiacSign or activeTab changes
    setMessages((prev) => {
      const hasOnlyWelcome = prev.length === 1 && (prev[0].id === "welcome-msg" || prev[0].id.startsWith("welcome-msg"));
      if (!hasOnlyWelcome) return prev;
      
      const traditionInfo = effectiveSchool ? `\n- **School of Thought**: ${effectiveSchool}` : "";
      const zodiacInfo = effectiveZodiacSign ? `\n- **Zodiac Profile**: ${effectiveZodiacSign}` : "";
      
      return [
        {
          id: "welcome-msg",
          role: "assistant",
          content: `Greetings, Seeker. I am your **Context-Aware Gemini Support & Knowledge Specialist**.\n\nI am synchronized with your active profile:\n- **Workspace**: ${activeTab.toUpperCase()}${traditionInfo}${zodiacInfo}\n\nMy responses are dynamically tailored to your chosen tradition and astrological profile. How may I guide or assist your quest today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
  }, [activeTab, effectiveSchool, effectiveZodiacSign]);

  // Context-aware quick prompt suggestions based on active tab and tradition
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
      // Prepare previous conversation history for Gemini multi-turn session
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-msg" && !m.id.startsWith("welcome-msg"))
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      // Extract current school and zodiac sign from state/props/localStorage
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
      const customSystemInstruction = `You are the official Context-Aware Gemini AI Support & Knowledge Specialist for 'The Great Wheel of Mysteries'.
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

      const assistantMsgId = `assistant-${Date.now()}`;
      const placeholderMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: "live",
        latency: "low"
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
              // Ignore parse errors on split chunks
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
      console.error("[Gemini Chatbot Error]:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `### ⚠️ Aetheric Signal Interruption\n\nI encountered a temporary connection issue (${err.message}). \n\n**Troubleshooting Suggestions:**\n1. Check your network connection.\n2. Verify the application dev server status.\n3. Try asking your question again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: "failsafe"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome-msg-reset",
        role: "assistant",
        content: `Conversation history cleared. Context synchronized with workspace (**${activeTab.toUpperCase()}**)${effectiveSchool ? `, Tradition (**${effectiveSchool}**)` : ''}${effectiveZodiacSign ? `, and Zodiac (**${effectiveZodiacSign}**)` : ''}. How may I guide you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const suggestions = getTabSuggestions(activeTab, effectiveSchool, effectiveZodiacSign);

  return (
    <>
      {/* Compact Floating Launcher Button when closed & not dismissed */}
      {!isOpen && !isDismissed && (
        <motion.div
          id="gemini-chatbot-launcher-wrapper"
          drag
          dragMomentum={false}
          dragElastic={0.08}
          whileDrag={{ scale: 1.08, cursor: "grabbing", boxShadow: "0 25px 35px rgba(0,0,0,0.9)" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50 flex items-center p-1 rounded-full bg-gradient-to-r from-amber-600/90 via-purple-800/90 to-amber-600/90 text-amber-100 shadow-2xl shadow-black/80 border border-amber-400/40 backdrop-blur-md cursor-grab active:cursor-grabbing touch-none select-none group"
        >
          <div
            className="pl-2 pr-0.5 text-amber-300/80 group-hover:text-amber-100 transition-colors flex items-center shrink-0 cursor-grab active:cursor-grabbing"
            title="Gently press & swipe to move Gemini Support button anywhere"
          >
            <GripVertical className="w-4 h-4 text-amber-300" />
          </div>

          <button
            id="gemini-chatbot-launcher-btn"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer text-xs font-medium"
            title="Open Gemini AI Support & Knowledge Agent (Press & swipe to move)"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-black animate-ping" />
            </div>
            <span className="font-semibold text-amber-100 tracking-wide text-xs">Gemini Support</span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/50 border border-amber-400/30 text-amber-300 hidden sm:inline">
              {activeTab}
            </span>
          </button>

          <div className="w-[1px] h-4 bg-amber-500/30 my-auto mx-0.5" />

          <button
            id="gemini-chatbot-dismiss-btn"
            onClick={(e) => handleToggleDismiss(true, e)}
            className="p-1.5 rounded-full text-amber-300/70 hover:text-amber-100 hover:bg-black/40 transition-colors cursor-pointer"
            title="Hide Gemini Support floating button"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Discreet Unhide Edge Tab when dismissed */}
      {!isOpen && isDismissed && (
        <motion.button
          id="gemini-chatbot-unhide-btn"
          drag
          dragMomentum={false}
          dragElastic={0.08}
          whileDrag={{ scale: 1.05, cursor: "grabbing" }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -2 }}
          onClick={(e) => {
            handleToggleDismiss(false, e);
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-4 right-0 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-l-xl bg-[#14161a]/95 hover:bg-[#1f2229] border-l border-y border-amber-500/40 text-amber-300 text-xs font-mono shadow-xl backdrop-blur-md cursor-grab active:cursor-grabbing touch-none select-none transition-all border-amber-400/60"
          title="Unhide Gemini Support (Press & swipe to move edge tab)"
        >
          <GripVertical className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-amber-200">Gemini Agent</span>
          <Eye className="w-3 h-3 text-amber-400/80" />
        </motion.button>
      )}

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`gemini-panel-${dragResetKey}`}
            id="gemini-chatbot-container"
            drag
            dragControls={panelDragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.01, cursor: "grabbing" }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed right-2 sm:right-6 bottom-4 z-50 w-[94vw] sm:w-[440px] bg-[#0c0d0f]/95 border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 ${
              isMinimized ? "h-[64px]" : "h-[85vh] sm:h-[620px] max-h-[90vh]"
            }`}
          >
            {/* Header / Drag Handle */}
            <div
              id="gemini-chatbot-header"
              onPointerDown={(e) => panelDragControls.start(e)}
              className="px-3.5 py-3 bg-gradient-to-r from-[#14161a] via-[#1a1724] to-[#14161a] border-b border-amber-500/20 flex items-center justify-between select-none cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className="p-1 rounded text-amber-400/80 hover:text-amber-200 hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing flex items-center shrink-0"
                  title="Gently press & swipe header to move Gemini Support anywhere"
                >
                  <GripVertical className="w-4 h-4 text-amber-400" />
                </div>

                <div
                  className="flex items-center gap-2 cursor-pointer min-w-0 flex-1"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-amber-100 tracking-wide font-serif truncate">
                        Gemini Support
                      </h3>
                      <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-300/70 font-mono flex items-center gap-1 flex-wrap truncate">
                      <Move className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="text-amber-200 capitalize">{activeTab}</span>
                      <span className="text-[9px] text-amber-400/60 hidden sm:inline">• Swipe to move</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {/* Share / Copy Portal Button with Dropdown Menu */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    id="gemini-chatbot-share-portal-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShareMenuOpen(!isShareMenuOpen);
                    }}
                    className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      copyFeedback
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : isShareMenuOpen
                        ? "bg-amber-500/25 text-amber-300 border border-amber-500/50"
                        : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                    title="Copy Share Link or Transcript for Gemini Support Agent Portal"
                  >
                    {copyFeedback ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    )}
                    <span className="hidden sm:inline text-[10px] font-semibold tracking-wide">
                      {copyFeedback === "link"
                        ? "Link Copied!"
                        : copyFeedback === "transcript"
                        ? "Copied All!"
                        : "Copy Share"}
                    </span>
                  </button>

                  {/* Share Menu Dropdown */}
                  <AnimatePresence>
                    {isShareMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-60 bg-[#12141a]/95 border border-amber-500/40 rounded-xl shadow-2xl shadow-black z-50 p-1.5 space-y-1 backdrop-blur-xl select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-2.5 py-1.5 border-b border-zinc-800 text-[10px] font-mono text-amber-300/80 uppercase tracking-wider flex items-center justify-between">
                          <span>Portal Share Menu</span>
                          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                        </div>

                        <button
                          id="gemini-copy-link-option"
                          onClick={handleCopyPortalLink}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-zinc-200 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Link className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-amber-100">Copy Share Link</span>
                            <span className="text-[10px] text-zinc-400">Direct URL with current context</span>
                          </div>
                        </button>

                        <button
                          id="gemini-copy-transcript-option"
                          onClick={handleCopyTranscript}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-zinc-200 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-purple-200">Copy Full Transcript</span>
                            <span className="text-[10px] text-zinc-400">Copy Q&A history to clipboard</span>
                          </div>
                        </button>

                        <button
                          id="gemini-social-share-option"
                          onClick={(e) => handleOpenSocialShare(undefined, undefined, e)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-zinc-200 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-zinc-800/80"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-emerald-200">Social Media Share</span>
                            <span className="text-[10px] text-zinc-400">Post to X, WhatsApp, LinkedIn...</span>
                          </div>
                        </button>

                        <button
                          id="gemini-reset-position-option"
                          onClick={() => {
                            setDragResetKey(prev => prev + 1);
                            setIsShareMenuOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-zinc-200 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-zinc-800/80"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-amber-200">Reset Window Position</span>
                            <span className="text-[10px] text-zinc-400">Snap floating window back to default</span>
                          </div>
                        </button>

                        <button
                          id="gemini-hide-launcher-option"
                          onClick={(e) => {
                            handleToggleDismiss(true, e);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-zinc-800/80"
                        >
                          <EyeOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-rose-200">Hide Floating Launcher</span>
                            <span className="text-[10px] text-zinc-400">Dismiss floating button from UI</span>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  }`}
                  title={(propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true")) ? "Auto-Read Chatbot: ON (Hands-Free)" : "Auto-Read Chatbot: OFF"}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">
                    {(propAutoTtsEnabled ?? (typeof window !== "undefined" && localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true")) ? "Auto-TTS ON" : "Auto-TTS OFF"}
                  </span>
                </button>
                <button
                  id="gemini-chatbot-minimize-btn"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  title={isMinimized ? "Expand Chat" : "Minimize Chat"}
                >
                  {isMinimized ? <ChevronDown className="w-4 h-4 rotate-180" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  id="gemini-chatbot-clear-btn"
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                  title="Clear Conversation History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  id="gemini-chatbot-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body when expanded */}
            {!isMinimized && (
              <>
                {/* Copy Feedback Toast Banner */}
                <AnimatePresence>
                  {copyFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="px-3 py-1.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono rounded-lg flex items-center justify-center gap-2 shadow-lg mx-4 mt-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                      <span>
                        {copyFeedback === "link"
                          ? "Gemini Support Portal Share Link copied to clipboard!"
                          : "Full Support Session Transcript copied to clipboard!"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Messages Container */}
                <div
                  id="gemini-chatbot-messages"
                  className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent"
                >
                  {messages.map((msg, mIdx) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={`${msg.id}-${mIdx}`}
                        className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-semibold ${
                            isUser
                              ? "bg-amber-600/30 border-amber-500/50 text-amber-200"
                              : "bg-purple-900/40 border-purple-500/50 text-purple-200"
                          }`}
                        >
                          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
                        </div>

                        <div className={`max-w-[82%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                              isUser
                                ? "bg-amber-600/20 border-amber-500/30 text-amber-50 rounded-tr-xs"
                                : "bg-[#14161f] border-zinc-800 text-zinc-200 rounded-tl-xs shadow-md"
                            }`}
                          >
                            <div className="prose prose-invert prose-xs max-w-none text-zinc-200 space-y-2">
                              <Markdown>{msg.content}</Markdown>
                            </div>

                            {!isUser && msg.thoughtTrace && (
                              <div className="mt-3 pt-3 border-t border-zinc-800">
                                <details className="group">
                                  <summary className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-amber-400 cursor-pointer list-none transition-colors">
                                    <Terminal className="w-3 h-3" />
                                    <span>Show Thought Trace</span>
                                    <ChevronDown className="w-2.5 h-2.5 group-open:rotate-180 transition-transform" />
                                  </summary>
                                  <div className="mt-2 p-2 rounded bg-black/40 border border-zinc-800/50 text-[10px] font-mono text-zinc-400 leading-relaxed overflow-x-auto">
                                    <Markdown>{msg.thoughtTrace}</Markdown>
                                  </div>
                                </details>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1 px-1">
                            <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>

                            {/* Copy Message Button */}
                            <button
                              onClick={(e) => handleCopySingleMessage(msg.id, msg.content, e)}
                              className="p-0.5 rounded text-zinc-500 hover:text-amber-300 hover:bg-zinc-800/80 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Copy message to clipboard"
                            >
                              {copiedMsgId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400 animate-bounce" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>

                            {/* Share Message Button */}
                            <button
                              onClick={(e) => handleOpenSocialShare(msg.content, "Gemini Support Agent Revelation", e)}
                              className="p-0.5 rounded text-zinc-500 hover:text-amber-300 hover:bg-zinc-800/80 transition-colors cursor-pointer"
                              title="Share this revelation"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>

                            {!isUser && (
                              <button
                                onClick={() => triggerSpeak(msg.content)}
                                className="p-0.5 rounded text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/80 transition-colors cursor-pointer"
                                title="Read message aloud"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                            {msg.latency === "low" && (
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border bg-emerald-950/60 text-emerald-300 border-emerald-800/40 flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5" /> Low Latency
                              </span>
                            )}
                            {msg.mode && (
                              <span
                                className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                                  msg.mode === "live"
                                    ? "bg-purple-950/60 text-purple-300 border-purple-800/40"
                                    : "bg-amber-950/60 text-amber-300 border-amber-800/40"
                                }`}
                              >
                                {msg.mode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex gap-3 flex-row items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-amber-400 shrink-0">
                        <Bot className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-[#14161f] border border-zinc-800 text-xs text-amber-300/80 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 animate-bounce text-amber-400" />
                        <span>Gemini is synthesizing context-aware response...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Context Quick Action Suggestions */}
                <div className="px-3 py-2 bg-[#0a0b0d] border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 shrink-0 select-none">Quick Prompts:</span>
                  {suggestions.map((sug, idx) => {
                    const isSelected = pendingSuggestion === sug;
                    return (
                      <button
                        key={`sug-${idx}`}
                        id={`gemini-suggestion-btn-${idx}`}
                        onClick={() => {
                          setInputMessage(sug);
                          setPendingSuggestion(sug);
                          setTimeout(() => {
                            inputRef.current?.focus();
                          }, 50);
                        }}
                        disabled={isLoading}
                        title="Click to load and review this question"
                        className={`shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all text-left whitespace-nowrap cursor-pointer disabled:opacity-50 ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/60 ring-1 ring-amber-500/30"
                            : "bg-zinc-900 hover:bg-amber-500/10 hover:text-amber-300 border-zinc-800 hover:border-amber-500/30 text-zinc-400"
                        }`}
                      >
                        💡 {sug}
                      </button>
                    );
                  })}
                </div>

                {/* Pre-made Question Confirmation Bar */}
                {pendingSuggestion && (
                  <div
                    id="gemini-suggestion-confirmation-bar"
                    className="px-3 py-2 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border-t border-amber-500/30 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 text-amber-300">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-zinc-400 text-[11px]">Ready to ask:</span>{" "}
                        <span className="font-medium text-amber-200 truncate font-mono">"{pendingSuggestion}"</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        id="gemini-confirm-suggestion-btn"
                        onClick={() => {
                          const text = pendingSuggestion;
                          setPendingSuggestion(null);
                          handleSendMessage(text);
                        }}
                        disabled={isLoading}
                        className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> OK / Send
                      </button>
                      <button
                        id="gemini-cancel-suggestion-btn"
                        onClick={() => {
                          setPendingSuggestion(null);
                          setInputMessage("");
                        }}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[11px] rounded-lg transition-colors cursor-pointer"
                        title="Clear pre-made question"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Input Controls */}
                <div className="p-3 bg-[#111217] border-t border-zinc-800/80">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      id="gemini-chatbot-input"
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => {
                        setInputMessage(e.target.value);
                        if (pendingSuggestion && e.target.value !== pendingSuggestion) {
                          setPendingSuggestion(null);
                        }
                      }}
                      placeholder={`Ask Gemini agent about ${activeTab}...`}
                      disabled={isLoading}
                      className="flex-1 bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                    <button
                      id="gemini-chatbot-send-btn"
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-black font-medium hover:from-amber-400 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
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

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={shareModalState.isOpen}
        onClose={() => setShareModalState((prev) => ({ ...prev, isOpen: false }))}
        title={shareModalState.title}
        text={shareModalState.text}
        url={shareModalState.url}
      />
    </>
  );
};
