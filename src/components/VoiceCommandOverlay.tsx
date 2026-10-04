import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Sparkles } from 'lucide-react';

interface VoiceCommandOverlayProps {
  command: string | null;
  activeTheme: {
    id: string;
    textAccentHex: string;
    [key: string]: any;
  };
}

export const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({ command, activeTheme }) => {
  return (
    <AnimatePresence>
      {command && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="relative group">
            {/* Pulsing background effect */}
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse group-hover:bg-amber-500/30 transition-all duration-700" />
            
            <div className={`
              relative flex items-center gap-3 px-6 py-3 rounded-full 
              bg-black/80 backdrop-blur-md border border-amber-500/30
              shadow-[0_0_30px_rgba(212,175,55,0.2)]
              ${activeTheme.id === 'deep-void' ? 'border-violet-500/30 shadow-violet-500/10' : ''}
            `}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40">
                <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500/70 leading-none mb-1">
                  Vocal Command Processed
                </span>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-sm font-serif font-bold text-white tracking-wide">
                    {command}
                  </span>
                </div>
              </div>
              
              <div className="ml-4 flex gap-1">
                <div className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 rounded-full bg-amber-400 animate-bounce" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCommandOverlay;
