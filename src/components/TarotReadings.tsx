import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, RefreshCw, Eye, Send, Loader2, CreditCard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TAROT_DECK = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", 
  "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", 
  "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World",
  "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands", "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
  "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups", "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
  "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords", "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
  "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles", "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles", "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
];

interface TarotReadingsProps {
  activeTheme: {
    id: string;
    textPrimary: string;
    borderAccent: string;
    bgCard: string;
    accentGradient?: string;
  };
}

type SpreadType = 'single' | 'three-card';

interface DrawnCard {
  name: string;
  isReversed: boolean;
  position?: string;
}

export default function TarotReadings({ activeTheme }: TarotReadingsProps) {
  const [spreadType, setSpreadType] = useState<SpreadType>('three-card');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [reading, setReading] = useState<string>('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [intent, setIntent] = useState('');

  const drawCards = () => {
    setIsDrawing(true);
    setReading('');
    setDrawnCards([]);
    
    setTimeout(() => {
      const numCards = spreadType === 'single' ? 1 : 3;
      const positions = spreadType === 'single' ? ["Current State"] : ["Past", "Present", "Future"];
      
      let deck = [...TAROT_DECK];
      let selected: DrawnCard[] = [];
      
      for (let i = 0; i < numCards; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        const cardName = deck[randomIndex];
        deck.splice(randomIndex, 1);
        
        selected.push({
          name: cardName,
          isReversed: Math.random() > 0.7, // 30% chance of reversal
          position: positions[i]
        });
      }
      
      setDrawnCards(selected);
      setIsDrawing(false);
    }, 800);
  };

  const interpretReading = async () => {
    if (drawnCards.length === 0) return;
    
    setIsInterpreting(true);
    
    let prompt = `I have drawn the following Tarot spread (${spreadType === 'single' ? 'Single Card' : 'Past, Present, Future'}):\n\n`;
    drawnCards.forEach(card => {
      prompt += `- ${card.position}: ${card.name} ${card.isReversed ? '(Reversed)' : '(Upright)'}\n`;
    });
    
    if (intent.trim()) {
      prompt += `\nMy specific inquiry/intent is: "${intent}"\n`;
    }
    
    prompt += `\nPlease provide a mystical and insightful interpretation of these cards based on Tarot Scholarship.`;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt, school: "Tarot Scholarship" })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setReading(data.answer);
    } catch (error) {
      console.error(error);
      setReading("The cards are shrouded in mist. The celestial link is severed, and interpretation cannot be reached at this time.");
    } finally {
      setIsInterpreting(false);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${activeTheme.bgCard || 'bg-[#141416]'} border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className={`text-2xl font-serif ${activeTheme.textPrimary} flex items-center gap-2`}>
          <Layers className={`w-6 h-6 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> 
          Tarot Divination
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Setup & Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-400 font-serif">Spread Type:</label>
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setSpreadType('single')}
                className={`flex-1 py-2 text-xs font-mono rounded transition-colors ${spreadType === 'single' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Single Card
              </button>
              <button
                onClick={() => setSpreadType('three-card')}
                className={`flex-1 py-2 text-xs font-mono rounded transition-colors ${spreadType === 'three-card' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Past/Present/Future
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400 font-serif">Seeker's Intent (Optional):</label>
            <textarea
              value={intent}
              onChange={e => setIntent(e.target.value)}
              placeholder="What wisdom do you seek from the cards?"
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-white/30 h-24 resize-none font-serif"
            />
          </div>

          <button
            onClick={drawCards}
            disabled={isDrawing}
            className={`w-full py-3 rounded-lg bg-gradient-to-r ${activeTheme?.accentGradient || 'from-amber-500 to-amber-700'} text-black font-serif font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50`}
          >
            {isDrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isDrawing ? "Shuffling the Arcana..." : "Draw Cards"}
          </button>
        </div>

        {/* Right Col: Cards & Reading */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="min-h-[220px] bg-black/20 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {drawnCards.length === 0 ? (
              <div className="text-center text-slate-500 flex flex-col items-center gap-3">
                <CreditCard className="w-12 h-12 opacity-20" />
                <p className="font-serif italic text-sm">The deck awaits your inquiry.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 ${spreadType === 'three-card' ? 'sm:grid-cols-3' : 'sm:grid-cols-1'} gap-4 w-full`}>
                <AnimatePresence mode="popLayout">
                  {drawnCards.map((card, idx) => (
                    <motion.div
                      key={`${card.name}-${idx}`}
                      initial={{ opacity: 0, y: 20, rotateY: 90 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.2 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        {card.position}
                      </span>
                      <div className={`w-full aspect-[2/3] max-w-[160px] bg-gradient-to-b from-slate-800 to-black border-2 ${activeTheme.id === 'deep-void' ? 'border-violet-500/30' : activeTheme.id === 'ethereal-silver' ? 'border-slate-400/30' : 'border-amber-500/30'} rounded-lg shadow-xl relative flex items-center justify-center p-4 text-center group`}>
                        <div className="absolute inset-1 border border-white/10 rounded pointer-events-none"></div>
                        <p className={`font-serif text-sm md:text-base font-bold ${activeTheme.id === 'deep-void' ? 'text-violet-200' : activeTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-amber-200'} ${card.isReversed ? 'rotate-180' : ''}`}>
                          {card.name}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {card.isReversed ? 'Reversed' : 'Upright'}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {drawnCards.length > 0 && !reading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <button
                onClick={interpretReading}
                disabled={isInterpreting}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-serif text-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isInterpreting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                {isInterpreting ? "Consulting the Oracle..." : "Interpret the Spread"}
              </button>
            </motion.div>
          )}

          {reading && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl bg-black/40 border ${activeTheme.id === 'deep-void' ? 'border-violet-500/20' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/20' : 'border-amber-500/20'}`}
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300">
                  Oracle's Interpretation
                </span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none prose-headings:font-serif prose-headings:text-amber-200 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-serif">
                <ReactMarkdown>{reading}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
