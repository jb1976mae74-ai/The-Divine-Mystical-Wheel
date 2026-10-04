import React from 'react';
import { Mic, X, Sparkles, Command, Volume2, Bookmark, Download, Shuffle, Compass, Terminal, FileText } from 'lucide-react';

interface VoiceCommandsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme?: {
    id: string;
    textPrimary: string;
    textAccentHex: string;
  };
}

interface VoiceCommandItem {
  command: string;
  action: string;
  category: 'Actions' | 'Navigation' | 'Dictation';
  icon: React.ReactNode;
}

const VOICE_COMMAND_LIST: VoiceCommandItem[] = [
  {
    command: '"Save Note" or "Inscribe Note"',
    action: 'Inscribes the current mystical contemplation directly into your Grimoire journal.',
    category: 'Actions',
    icon: <Bookmark className="w-4 h-4 text-amber-400" />
  },
  {
    command: '"Clear Consultation" or "Reset"',
    action: 'Clears the active inquiry, oracle response, and balance interpretation.',
    category: 'Actions',
    icon: <Command className="w-4 h-4 text-rose-400" />
  },
  {
    command: '"Export Chronicles" or "Download"',
    action: 'Downloads your consultation history archive as a formatted TXT file.',
    category: 'Actions',
    icon: <Download className="w-4 h-4 text-emerald-400" />
  },
  {
    command: '"Seek Randomly" or "Random Query"',
    action: 'Generates a random profound esoteric inquiry across mystical traditions.',
    category: 'Actions',
    icon: <Shuffle className="w-4 h-4 text-purple-400" />
  },
  {
    command: '"Toggle Sound" or "Mute Oracle"',
    action: 'Mutes or unmutes synthesized speech audio playback.',
    category: 'Actions',
    icon: <Volume2 className="w-4 h-4 text-sky-400" />
  },
  {
    command: '"Open Oracle" / "Show Oracle"',
    action: 'Switches the main workspace view back to the Primary Oracle Console.',
    category: 'Navigation',
    icon: <Sparkles className="w-4 h-4 text-amber-400" />
  },
  {
    command: '"Open Military Base" / "Citadel"',
    action: 'Switches view to Supreme Fighting Force Base & TFDAS Armament System.',
    category: 'Navigation',
    icon: <Compass className="w-4 h-4 text-rose-400" />
  },
  {
    command: '"Open GPS" / "Geodesic Positioning"',
    action: 'Switches view to Kingdom Geodesic GPS Positioning & Satellite Triangulation.',
    category: 'Navigation',
    icon: <Compass className="w-4 h-4 text-sky-400" />
  },
  {
    command: '"Open Enochian" / "First Call"',
    action: 'Switches view to Enochian Sanctum and Angelic Language Call.',
    category: 'Navigation',
    icon: <Terminal className="w-4 h-4 text-purple-400" />
  },
  {
    command: '"Open Scriptura" / "Sigil" / "Chronicles"',
    action: 'Navigates to Scriptura Search, Aetheric Sigil Canvas, or opens Chronicles History Drawer.',
    category: 'Navigation',
    icon: <FileText className="w-4 h-4 text-emerald-400" />
  },
  {
    command: 'Any natural speech phrase',
    action: 'Dictates and appends your spoken text directly into the Oracle consultation inquiry input box.',
    category: 'Dictation',
    icon: <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
  }
];

export const VoiceCommandsHelpModal: React.FC<VoiceCommandsHelpModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-amber-500/40 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.25)] p-6 text-amber-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-200 tracking-wide">
                Oracle Hands-Free Voice Commands
              </h3>
              <p className="text-xs font-serif text-neutral-400">
                Speak any of the following voice commands to control the sanctuary hands-free.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {['Actions', 'Navigation', 'Dictation'].map((cat) => {
            const items = VOICE_COMMAND_LIST.filter(i => i.category === cat);
            return (
              <div key={cat} className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400/90 px-1">
                  {cat}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {items.map((item, idx) => (
                    <div 
                      key={`${item.command}-${idx}`}
                      className="p-3 rounded-xl bg-black/50 border border-white/10 hover:border-amber-500/30 transition-all flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs font-bold text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 inline-block mb-1">
                          {item.command}
                        </div>
                        <p className="text-xs font-serif text-neutral-300 leading-relaxed">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between text-xs font-serif text-neutral-400">
          <span>Click the microphone button in the Oracle portal to start listening.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommandsHelpModal;
