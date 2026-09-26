/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Play, FastForward } from 'lucide-react';

interface TypewriterMarkdownProps {
  content: string;
}

export default function TypewriterMarkdown({ content }: TypewriterMarkdownProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!content) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Reset and start typing
    setDisplayedText('');
    setIsTyping(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let currentIndex = 0;
    
    // Dynamic step size to make the animation feel quick and responsive regardless of length
    // Aim to finish within ~2-3 seconds max (approx 150 ticks of 15ms)
    const tickMs = 15;
    const targetTicks = 150;
    const step = Math.max(1, Math.ceil(content.length / targetTicks));

    timerRef.current = setInterval(() => {
      currentIndex += step;
      if (currentIndex >= content.length) {
        setDisplayedText(content);
        setIsTyping(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } else {
        setDisplayedText(content.slice(0, currentIndex));
      }
    }, tickMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [content]);

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setDisplayedText(content);
    setIsTyping(false);
  };

  return (
    <div className="relative group/typewriter">
      {/* Typewriter Markdown output */}
      <ReactMarkdown>{displayedText}</ReactMarkdown>

      {/* Skipping Control Button (appears smoothly when typing is active) */}
      {isTyping && (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute -bottom-10 right-0 py-1.5 px-3 rounded-md bg-black/80 hover:bg-black text-[10px] font-mono tracking-widest text-amber-500 hover:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-md animate-pulse cursor-pointer"
          title="Skip inscription animation"
        >
          <FastForward className="w-3 h-3" />
          <span>FAST FORWARD INSCRIPTION</span>
        </button>
      )}
    </div>
  );
}
