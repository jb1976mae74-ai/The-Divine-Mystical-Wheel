import React, { useState, useEffect, useRef } from "react";
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
  MessageSquare,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface MysticOracleChatProps {
  isOpenInitial?: boolean;
}

export const MysticOracleChat: React.FC<MysticOracleChatProps> = ({
  isOpenInitial = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenInitial);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoVoice, setAutoVoice] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `Greetings, Seeker of Mysteries. I am the **Mystic Oracle**, synchronized with the cosmic design of the Great Wheel.\n\nHow may I illuminate the shadows of your quest today? You may speak with me via voice or text.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/#/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/`/g, '')
      .replace(/~/g, '')
      .replace(/>/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        const rec = new SpeechRecognitionAPI();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          if (resultText) {
            setInputMessage(resultText);
            // Auto submit voice conversation input
            setTimeout(() => {
              handleSendMessage(resultText);
            }, 300);
          }
        };

        rec.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.warn("Failed to start SpeechRecognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend !== undefined ? textToSend : inputMessage;
    if (!query.trim()) return;

    stopSpeaking();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (textToSend === undefined) {
      setInputMessage("");
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) throw new Error("Oracle connection failed.");
      
      const data = await response.json();
      const replyText = data.reply || data.text || "The Oracle is silent at this time.";
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (autoVoice) {
        speakText(replyText);
      }
    } catch (error) {
      console.error(error);
      const fallbackReply = "The aetheric currents are turbulent. Please consult the Oracle again.";
      const errMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMessage]);
      if (autoVoice) {
        speakText(fallbackReply);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? "w-16 h-16" : "w-[420px] sm:w-[440px] h-[640px]"} ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <motion.div
        className="w-full h-full bg-neutral-950/95 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-neutral-950 to-neutral-950">
          <div className="flex items-center gap-2.5 text-amber-200">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <div>
              <span className="font-serif font-bold tracking-wider uppercase text-xs block text-amber-100">Mystic Voice Oracle</span>
              <span className="text-[9px] font-mono text-amber-400/80 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                {isListening ? "Listening to your voice..." : isSpeaking ? "Oracle Speaking..." : "Aetheric Voice Channel Open"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoVoice(!autoVoice)}
              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                autoVoice 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-neutral-900 text-neutral-400 border-neutral-700'
              }`}
              title={autoVoice ? "Auto-Voice Enabled" : "Auto-Voice Disabled"}
            >
              {autoVoice ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-300 cursor-pointer">
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-300 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-serif">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs ${msg.role === "user" ? "bg-amber-600 text-neutral-950 rounded-br-none shadow-md font-medium" : "bg-neutral-900 text-amber-100 rounded-bl-none border border-amber-500/20 shadow-lg"}`}>
                <Markdown>{msg.content}</Markdown>
              </div>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <button
                    onClick={() => speakText(msg.content)}
                    className="text-[10px] font-mono text-amber-400/80 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/20 cursor-pointer transition-colors"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    <span>Speak</span>
                  </button>
                  <span className="text-[9px] font-mono text-neutral-500">{msg.timestamp}</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-amber-400 text-xs font-serif animate-pulse p-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>Oracle is channeling revelation...</span>
            </div>
          )}
          {isListening && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-xl animate-pulse">
              <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Listening to your spoken inquiry... Speak now.</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Voice Controls */}
        <div className="p-4 border-t border-amber-500/20 bg-neutral-950/80 space-y-2">
          {speechError && (
            <div className="text-[10px] font-mono text-rose-400 bg-rose-950/40 border border-rose-500/30 p-1.5 rounded-lg text-center">
              {speechError}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isListening 
                  ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-lg shadow-rose-900/50' 
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-amber-300'
              }`}
              title={isListening ? "Stop Listening" : "Speak to the Oracle"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded-xl px-3.5 py-2.5 text-xs font-serif text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder={isListening ? "Listening..." : "Type or speak your inquiry..."}
            />

            <button 
              onClick={() => handleSendMessage()} 
              disabled={isLoading || !inputMessage.trim()} 
              className="p-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-neutral-950 transition-all cursor-pointer shrink-0 shadow-md"
              title="Send Inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MysticOracleChat;
