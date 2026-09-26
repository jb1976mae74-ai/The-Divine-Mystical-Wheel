import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, Sparkles, Send, ExternalLink } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  url?: string;
  activeTheme?: {
    id: string;
    textPrimary?: string;
    borderPrimary?: string;
    accentColor?: string;
  };
}

export default function SocialShareModal({
  isOpen,
  onClose,
  title = "Share Oracle Revelation",
  text = "Seeking wisdom from the Celestial Oracle...",
  url = typeof window !== 'undefined' ? window.location.href : '',
  activeTheme
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const cleanText = text.trim();

  // Helper for opening social windows
  const openShare = (shareLink: string) => {
    window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=550');
  };

  // 1. X / Twitter
  const handleXShare = () => {
    const formatted = `🔮 ${title}: "${cleanText.length > 180 ? cleanText.substring(0, 177) + "..." : cleanText}"\n\nConsult the Oracle:`;
    openShare(`https://x.com/intent/tweet?text=${encodeURIComponent(formatted)}&url=${encodeURIComponent(shareUrl)}`);
  };

  // 2. Facebook
  const handleFacebookShare = () => {
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`🔮 ${title}: ${cleanText}`)}`);
  };

  // 3. LinkedIn
  const handleLinkedInShare = () => {
    openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
  };

  // 4. Reddit
  const handleRedditShare = () => {
    openShare(`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`🔮 ${title}: ${cleanText.substring(0, 100)}`)}`);
  };

  // 5. WhatsApp
  const handleWhatsAppShare = () => {
    const message = `🔮 *${title}*\n"${cleanText}"\n\nConsult the Oracle instance:\n${shareUrl}`;
    openShare(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`);
  };

  // 6. Telegram
  const handleTelegramShare = () => {
    const message = `🔮 ${title}:\n"${cleanText}"`;
    openShare(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`);
  };

  // 7. Threads
  const handleThreadsShare = () => {
    const message = `🔮 ${title}: "${cleanText}" ${shareUrl}`;
    openShare(`https://www.threads.net/intent/post?text=${encodeURIComponent(message)}`);
  };

  // 8. Pinterest
  const handlePinterestShare = () => {
    openShare(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(`🔮 ${title}: ${cleanText}`)}`);
  };

  // 9. Email
  const handleEmailShare = () => {
    const subject = `🔮 ${title} - Celestial Oracle`;
    const body = `Greeting seeker,\n\nI wished to share this revelation with you:\n\n"${cleanText}"\n\nConsult the Oracle here:\n${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // 10. Native Share (if supported)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `🔮 ${title}: ${cleanText}`,
          url: shareUrl,
        });
      } catch (err) {
        console.warn("Native share error:", err);
      }
    }
  };

  // Copy Link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Copy link error:", err);
    }
  };

  // Copy Full Revelation Text + Link
  const handleCopyFull = async () => {
    try {
      const fullContent = `🔮 ${title}\n"${cleanText}"\n\nCelestial Oracle: ${shareUrl}`;
      await navigator.clipboard.writeText(fullContent);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (err) {
      console.warn("Copy full error:", err);
    }
  };

  const platforms = [
    {
      id: 'x',
      name: 'X (Twitter)',
      action: handleXShare,
      bg: 'bg-black hover:bg-neutral-900 text-white border-neutral-800',
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook',
      action: handleFacebookShare,
      bg: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/30',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      id: 'reddit',
      name: 'Reddit',
      action: handleRedditShare,
      bg: 'bg-[#FF4500]/10 hover:bg-[#FF4500]/20 text-[#FF4500] border-[#FF4500]/30',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#FF4500]" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.25-1.25-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      )
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      action: handleWhatsAppShare,
      bg: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#25D366]" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      )
    },
    {
      id: 'telegram',
      name: 'Telegram',
      action: handleTelegramShare,
      bg: 'bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9] border-[#229ED9]/30',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#229ED9]" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.812 7.159c-.102.775-.877 5.378-1.272 7.487-.167.891-.497 1.189-.816 1.219-.693.064-1.22-.456-1.891-.896-1.048-.687-1.64-1.114-2.656-1.783-1.173-.773-.412-1.198.256-1.892.175-.182 3.218-2.95 3.277-3.202.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.112.033.361.018.558z"/>
        </svg>
      )
    },
    {
      id: 'threads',
      name: 'Threads',
      action: handleThreadsShare,
      bg: 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700',
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12.186 24c-2.673 0-5.112-.77-7.054-2.228C3.125 20.26 1.737 18.23.957 15.76.185 13.313-.082 10.59.18 7.828c.348-3.666 1.98-6.9 4.595-9.108C7.387-3.488 10.664-4.66 14.288-4.522c3.553.136 6.772 1.48 9.062 3.785 2.228 2.242 3.528 5.383 3.662 8.845.068 1.764-.202 3.473-.804 5.083-.603 1.61-1.554 3.037-2.825 4.24-1.282 1.21-2.83 2.13-4.602 2.735-1.77.604-3.692.832-5.71.677-1.396-.107-2.738-.456-3.987-1.037a11.97 11.97 0 01-3.23-2.18l1.693-1.685c.74.722 1.602 1.303 2.562 1.727.96.425 1.983.673 3.04.737 1.547.094 3.013-.088 4.358-.54 1.346-.452 2.518-1.144 3.488-2.057.97-.913 1.692-1.996 2.148-3.22.456-1.222.658-2.515.602-3.847-.107-2.613-1.092-4.982-2.775-6.673-1.73-1.738-4.16-2.753-6.844-2.856-2.737-.105-5.215.782-6.978 2.497-1.98 1.928-3.216 4.38-3.48 6.9-.2 1.918.006 3.8.61 5.592.604 1.79 1.626 3.256 3.04 4.357 1.413 1.1 3.197 1.684 5.304 1.745 2.03.058 3.84-.42 5.38-1.42 1.542-1 2.656-2.39 3.313-4.13.658-1.74.805-3.61.436-5.56l-2.35.39c.28 1.48.167 2.9-.33 4.22-.498 1.32-1.34 2.37-2.51 3.13-1.17.76-2.54 1.12-4.08 1.08-1.57-.04-2.91-.48-4.01-1.31-1.1-.83-1.89-1.93-2.36-3.29-.47-1.36-.63-2.79-.48-4.25.2-1.91 1.13-3.77 2.62-5.23 1.33-1.3 3.21-1.97 5.28-1.89 2.03.08 3.87.85 5.18 2.17 1.28 1.28 2.03 3.07 2.11 5.05.04 1.01-.11 1.99-.46 2.92-.35.93-.89 1.75-1.63 2.44-.74.69-1.63 1.21-2.66 1.56a10.23 10.23 0 01-3.32.41z"/>
        </svg>
      )
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      action: handleLinkedInShare,
      bg: 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border-[#0A66C2]/30',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      action: handlePinterestShare,
      bg: 'bg-[#E60023]/10 hover:bg-[#E60023]/20 text-[#E60023] border-[#E60023]/30',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#E60023]" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026l.032-.026z"/>
        </svg>
      )
    },
    {
      id: 'email',
      name: 'Email',
      action: handleEmailShare,
      bg: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: <Send className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="relative w-full max-w-lg bg-[#0d0d12] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-slate-200 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-amber-200 flex items-center gap-1.5">
                    <span>{title}</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Broadcast revelation across celestial networks
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Box */}
            <div className="mb-5 p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs font-serif text-slate-300 leading-relaxed max-h-28 overflow-y-auto custom-scrollbar relative">
              <span className="text-[10px] font-mono text-amber-400/80 uppercase block mb-1">Preview Quote</span>
              <p className="italic">"{cleanText}"</p>
            </div>

            {/* Native Web Share Button (if supported) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full mb-4 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-serif font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 stroke-[2.5]" />
                <span>Share via System Options</span>
              </button>
            )}

            {/* Social Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 mb-5">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={p.action}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${p.bg}`}
                >
                  {p.icon}
                  <span className="text-[11px] font-serif font-medium">{p.name}</span>
                </button>
              ))}
            </div>

            {/* Copy Link & Copy Full Revelation Row */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Direct Access Link</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded-xl text-xs font-serif font-medium flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                    copied
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                      : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyFull}
                className={`w-full mt-1 py-2 px-3 rounded-xl text-xs font-serif font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  copiedFull
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                    : 'bg-black/40 hover:bg-black/70 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {copiedFull ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedFull ? 'Full Revelation Copied!' : 'Copy Revelation Text & Link'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
