import React, { useState, useMemo } from 'react';
import { Sparkles, Moon, Sun, Calendar, Clock, Edit2, Flame, RefreshCw, Check, Copy, Share2, Loader2, Star, Zap, Compass, CheckCircle2 } from 'lucide-react';
import { getMoonPhase, MoonPhaseInfo } from '../utils/astrologyUtils';
import { ZODIAC_DESCRIPTIONS } from '../data/zodiacData';

export function getZodiacSignFromDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1; // 1-12

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  return "";
}

export function getZodiacMetadata(sign: string) {
  const metadata: Record<string, { symbol: string; element: string; elementSymbol: string; dates: string; keyTrait: string }> = {
    Aries: { symbol: "♈", element: "Ignis (Fire)", elementSymbol: "🔥", dates: "Mar 21 - Apr 19", keyTrait: "Pioneering Will & Sovereign Spark" },
    Taurus: { symbol: "♉", element: "Materia (Earth)", elementSymbol: "🪨", dates: "Apr 20 - May 20", keyTrait: "Enduring Grounding & Structural Abundance" },
    Gemini: { symbol: "♊", element: "Aer (Air)", elementSymbol: "💨", dates: "May 21 - Jun 20", keyTrait: "Mercurial Intellect & Dual Synthesis" },
    Cancer: { symbol: "♋", element: "Aqua (Water)", elementSymbol: "💧", dates: "Jun 21 - Jul 22", keyTrait: "Ancestral Matrix & Empathetic Sanctuary" },
    Leo: { symbol: "♌", element: "Ignis (Fire)", elementSymbol: "🔥", dates: "Jul 23 - Aug 22", keyTrait: "Golden Radiance & Sovereign Nobility" },
    Virgo: { symbol: "♍", element: "Materia (Earth)", elementSymbol: "🪨", dates: "Aug 23 - Sep 22", keyTrait: "Alchemical Purification & Discernment" },
    Libra: { symbol: "♎", element: "Aer (Air)", elementSymbol: "💨", dates: "Sep 23 - Oct 22", keyTrait: "Harmonic Balance & Cosmic Justice" },
    Scorpio: { symbol: "♏", element: "Aqua (Water)", elementSymbol: "💧", dates: "Oct 23 - Nov 21", keyTrait: "Resurrection Phoenix & Subterranean Depth" },
    Sagittarius: { symbol: "♐", element: "Ignis (Fire)", elementSymbol: "🔥", dates: "Nov 22 - Dec 21", keyTrait: "Transcendental Vision & Truth Arrow" },
    Capricorn: { symbol: "♑", element: "Materia (Earth)", elementSymbol: "🪨", dates: "Dec 22 - Jan 19", keyTrait: "Structural Mastery & Mountain Pinnacle" },
    Aquarius: { symbol: "♒", element: "Aer (Air)", elementSymbol: "💨", dates: "Jan 20 - Feb 18", keyTrait: "Cosmic Water-Bearer & Epochal Intuition" },
    Pisces: { symbol: "♓", element: "Aqua (Water)", elementSymbol: "💧", dates: "Feb 19 - Mar 20", keyTrait: "Boundless Compassion & Mystical Dissolution" },
  };
  return metadata[sign] || { symbol: "✨", element: "Aether", elementSymbol: "✨", dates: "Unknown", keyTrait: "Mystical Seeker" };
}

interface DailyAstroGuidanceProps {
  birthDate: string;
  onUpdateBirthDate: (dateStr: string) => void;
  activeTheme: any;
  school?: string;
  manualZodiacSign?: string;
}

export default function DailyAstroGuidance({
  birthDate,
  onUpdateBirthDate,
  activeTheme,
  school = "Hermetic Alchemy",
  manualZodiacSign = ""
}: DailyAstroGuidanceProps) {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(birthDate || "");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiReading, setAiReading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayMoonPhase = useMemo(() => getMoonPhase(todayStr), [todayStr]);
  
  const autoZodiacSign = useMemo(() => getZodiacSignFromDate(birthDate), [birthDate]);
  const zodiacSign = useMemo(() => manualZodiacSign || autoZodiacSign, [manualZodiacSign, autoZodiacSign]);
  const zodiacMeta = useMemo(() => getZodiacMetadata(zodiacSign), [zodiacSign]);
  const natalMoonPhase = useMemo(() => birthDate ? getMoonPhase(birthDate) : null, [birthDate]);

  // Generate static daily reading seed based on date + zodiac
  const staticReading = useMemo(() => {
    if (!zodiacSign || !todayMoonPhase) return null;

    const todayDateObj = new Date();
    const daySeed = todayDateObj.getDate() + todayDateObj.getMonth() * 31;
    
    const element = zodiacMeta.element;

    const mottoes: Record<string, string[]> = {
      "Ignis (Fire)": [
        "Ignite intent with calm discipline; true fire illuminates without consuming.",
        "Your sovereign spark cuts through inertia today; act with nobility.",
        "Channel raw creative heat into structured mastery and purposeful direction."
      ],
      "Materia (Earth)": [
        "Anchor your highest ideals in practical steps; earth turns vision into stone.",
        "Patience is your shield today; trust the steady growth of your efforts.",
        "Structure provides sanctuary; align your physical habits with spiritual truth."
      ],
      "Aer (Air)": [
        "Synthesize disparate thoughts into singular clarity; communicate with grace.",
        "Let your intellect elevate above emotional storms; seek objective truth.",
        "The breath carries divine inspiration; listen closely to quiet epiphanies."
      ],
      "Aqua (Water)": [
        "Trust the silent currents of intuition; depth reveals what surface hides.",
        "Flow around rigid barriers with gentle grace; emotion is a sacred conduit.",
        "Cleanse non-essential burdens; allow peaceful tides to restore your spirit."
      ]
    };

    const mottoList = mottoes[element] || mottoes["Ignis (Fire)"];
    const motto = mottoList[daySeed % mottoList.length];

    const focusHoursOptions = ["07:00 - 09:00 & 19:00 - 21:00", "08:30 - 11:00 & 16:00 - 18:30", "06:00 - 08:30 & 20:00 - 22:00", "09:00 - 11:30 & 15:00 - 17:30"];
    const focusHours = focusHoursOptions[daySeed % focusHoursOptions.length];

    const rituals: Record<string, string> = {
      "Ignis (Fire)": "Light a gold candle or face the sun for 60 seconds; state your primary intention with unshakeable resolve.",
      "Materia (Earth)": "Stand barefoot on earth or hold a natural mineral; ground your breath into the core of the physical plane.",
      "Aer (Air)": "Take 7 deep diaphragmatic breaths in quiet reflection; write down 3 key truths to focus your mind.",
      "Aqua (Water)": "Sip structured water mindfully; visualize emotional turbulence washing away into serene clarity."
    };

    const microRitual = rituals[element] || "Pause for 3 deep breaths and align your mind with the infinite.";

    return {
      motto,
      focusHours,
      microRitual,
      celestialTheme: `${zodiacSign} ${zodiacMeta.symbol} in harmony with ${todayMoonPhase.emoji} ${todayMoonPhase.name}`
    };
  }, [zodiacSign, todayMoonPhase, zodiacMeta]);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempDate) {
      onUpdateBirthDate(tempDate);
      setIsEditingDate(false);
      setAiReading(null); // Reset AI reading when date changes
    }
  };

  const handleGenerateAiReading = async () => {
    if (!birthDate || !zodiacSign || !todayMoonPhase) return;
    setLoadingAi(true);

    try {
      const prompt = `As a master celestial astrologer and alchemist, generate a personalized Daily Astro-Guidance forecast for a ${zodiacSign} (${zodiacMeta.element}) born on ${birthDate}.
Today's Moon Phase is ${todayMoonPhase.name} ${todayMoonPhase.emoji} (${todayMoonPhase.percentage}% illumination).
Please structure the reading with:
1. **Celestial Daily Mantra**
2. **Current Lunar-Zodiac Alignment**
3. **Primary Alchemical Focus & Peak Energy Hours**
4. **Sacred Guidance & Spiritual Direction** (2 concise, deeply insightful paragraphs)
5. **1-Minute Daily Alchemical Micro-Ritual**

Keep the tone sacred, inspiring, and concise.`;

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, school: school || "Hermetic Alchemy" })
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();
      if (data.answer) {
        setAiReading(data.answer);
      } else {
        throw new Error('No answer returned');
      }
    } catch (err) {
      console.warn("AI reading fetch error, fallback to static:", err);
      setAiReading(null);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = aiReading || (staticReading ? `Daily Astro-Guidance for ${zodiacSign} (${new Date().toLocaleDateString()}):\n\nTheme: ${staticReading.celestialTheme}\nMotto: "${staticReading.motto}"\nFocus Hours: ${staticReading.focusHours}\nMicro-Ritual: ${staticReading.microRitual}` : "");
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return (
    <div className={`w-full bg-[#111114] border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl transition-all duration-300 relative overflow-hidden`}>
      {/* Background Accent Glow */}
      <div 
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{
          backgroundColor: activeTheme?.id === 'deep-void' ? '#a78bfa' : activeTheme?.id === 'ethereal-silver' ? '#7dd3fc' : '#D4AF37'
        }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${activeTheme?.textPrimary || 'text-amber-400'}`}>
            <Compass className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <h3 className={`text-lg font-serif font-semibold ${activeTheme?.textPrimary || 'text-amber-400'} flex items-center gap-2`}>
              Daily Astro-Guidance
            </h3>
            <p className="text-[11px] text-slate-400 font-serif flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{formattedToday}</span>
            </p>
          </div>
        </div>

        {/* Today's Moon Phase Badge */}
        {todayMoonPhase && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-serif text-slate-200 shadow-inner">
            <span className="text-base">{todayMoonPhase.emoji}</span>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-semibold text-slate-200">{todayMoonPhase.name}</span>
              <span className="text-[9.5px] text-slate-400 font-mono">{todayMoonPhase.percentage}% Illumination</span>
            </div>
          </div>
        )}
      </div>

      {/* Birth Date Input / Display Section */}
      {!birthDate || isEditingDate ? (
        <form onSubmit={handleSaveDate} className="bg-black/40 border border-dashed border-white/15 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-serif font-semibold text-slate-200">Inscribe Birth Date</h4>
              <p className="text-[10px] text-slate-400 font-serif">Unlocks personalized daily zodiac & natal lunar readings.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              required
              className="bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="submit"
              className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${activeTheme?.accentGradient || 'from-amber-500 to-amber-700'} text-black font-serif text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            {isEditingDate && (
              <button
                type="button"
                onClick={() => setIsEditingDate(false)}
                className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-serif transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        /* Saved Birth Date & Natal Persona Badge */
        <div className="bg-black/35 border border-white/10 rounded-xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
              {zodiacMeta.symbol}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-serif font-bold ${activeTheme?.textPrimary || 'text-amber-400'}`}>
                  {zodiacSign}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {zodiacMeta.elementSymbol} {zodiacMeta.element}
                </span>
                {manualZodiacSign && (
                  <span className="text-[10px] font-serif px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Manual Override
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-serif mt-0.5">
                {zodiacMeta.keyTrait} • Born {new Date(birthDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {natalMoonPhase && (
              <div className="text-right hidden md:block border-r border-white/10 pr-3 mr-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Natal Lunar Gate</span>
                <span className="text-xs font-serif text-slate-300">{natalMoonPhase.emoji} {natalMoonPhase.name}</span>
              </div>
            )}
            <button
              onClick={() => {
                setTempDate(birthDate);
                setIsEditingDate(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-serif transition-all flex items-center gap-1.5 cursor-pointer"
              title="Change birth date"
            >
              <Edit2 className="w-3 h-3 text-slate-400" />
              <span>Edit Date</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Guidance Grid */}
      {staticReading && birthDate && (
        <div className="space-y-4">
          {/* Daily Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1: Daily Celestial Theme */}
            <div className="bg-black/25 border border-white/5 rounded-xl p-3.5 text-left flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-serif text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Celestial Theme
              </div>
              <p className="text-xs font-serif text-slate-200 italic leading-relaxed">
                "{staticReading.motto}"
              </p>
              <span className="text-[10px] font-mono text-slate-500">
                {staticReading.celestialTheme}
              </span>
            </div>

            {/* Card 2: Peak Energy Hours */}
            <div className="bg-black/25 border border-white/5 rounded-xl p-3.5 text-left flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-serif text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Peak Energy Hours
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200">
                {staticReading.focusHours}
              </p>
              <span className="text-[10px] font-serif text-slate-400">
                Optimal times for spiritual meditation & decision making.
              </span>
            </div>

            {/* Card 3: 1-Minute Micro Ritual */}
            <div className="bg-black/25 border border-white/5 rounded-xl p-3.5 text-left flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-serif text-slate-400 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Daily Alchemical Micro-Ritual
              </div>
              <p className="text-xs font-serif text-slate-300 leading-snug">
                {staticReading.microRitual}
              </p>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Takes under 1 minute
              </span>
            </div>
          </div>

          {/* AI In-Depth Reading Output or Cast AI Reading Button */}
          {aiReading ? (
            <div className="bg-[#0c0c0e] border border-amber-500/20 rounded-xl p-4 text-left relative space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" /> In-Depth AI Astro-Guidance
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy reading"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span className="text-[10px]">{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handleGenerateAiReading}
                    disabled={loadingAi}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    title="Refresh reading"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loadingAi ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="text-xs font-serif text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                {aiReading}
              </div>
            </div>
          ) : (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/20 border border-white/5 rounded-xl p-3.5">
              <div className="text-left">
                <p className="text-xs font-serif text-slate-300 font-medium">Deepen Your Celestial Channel</p>
                <p className="text-[10px] text-slate-500 font-serif">Cast an AI-amplified personalized astro-guidance reading for today.</p>
              </div>
              <button
                onClick={handleGenerateAiReading}
                disabled={loadingAi}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r ${activeTheme?.accentGradient || 'from-amber-500 to-amber-700'} text-black font-serif text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
              >
                {loadingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Channeling Astro-Guidance...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current text-black" />
                    <span>Cast In-Depth Astro Reading</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
