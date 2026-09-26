import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Sparkles, Star, Flame, Compass, Sun } from 'lucide-react';
import { PastInquiry } from './ChroniclesTimeline';

interface ZodiacalInfluenceChartProps {
  pastInquiries: PastInquiry[];
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    bgCard: string;
    starStroke: string;
  };
  selectedZodiacFilter?: string;
  onSelectZodiacFilter?: (zodiac: string) => void;
}

const ZODIAC_LIST = [
  { name: 'Aries', symbol: '♈', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', element: 'Air' },
  { name: 'Cancer', symbol: '♋', element: 'Water' },
  { name: 'Leo', symbol: '♌', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', element: 'Earth' },
  { name: 'Libra', symbol: '♎', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', element: 'Air' },
  { name: 'Pisces', symbol: '♓', element: 'Water' },
];

export default function ZodiacalInfluenceChart({
  pastInquiries,
  activeTheme,
  selectedZodiacFilter = 'all',
  onSelectZodiacFilter
}: ZodiacalInfluenceChartProps) {
  const [showChart, setShowChart] = useState(true);

  // Compute frequency distribution across the 12 zodiac signs
  const chartData = useMemo(() => {
    if (!pastInquiries || pastInquiries.length === 0) return [];

    const counts: Record<string, number> = {};
    ZODIAC_LIST.forEach(z => {
      counts[z.name] = 0;
    });

    pastInquiries.forEach(iq => {
      if (iq.zodiacSign) {
        // Find matching zodiac (case-insensitive)
        const found = ZODIAC_LIST.find(z => z.name.toLowerCase() === iq.zodiacSign?.toLowerCase());
        if (found) {
          counts[found.name] = (counts[found.name] || 0) + 1;
        } else {
          // Fallback if custom or unlisted
          counts[iq.zodiacSign] = (counts[iq.zodiacSign] || 0) + 1;
        }
      }
    });

    // If there are unlisted zodiacs in pastInquiries, add them
    const existingNames = new Set(ZODIAC_LIST.map(z => z.name));
    pastInquiries.forEach(iq => {
      if (iq.zodiacSign && !existingNames.has(iq.zodiacSign)) {
        if (counts[iq.zodiacSign] === undefined) {
          counts[iq.zodiacSign] = 1;
        }
      }
    });

    return Object.entries(counts).map(([name, value]) => {
      const meta = ZODIAC_LIST.find(z => z.name === name);
      return {
        name,
        symbol: meta ? meta.symbol : '✨',
        element: meta ? meta.element : 'Cosmic',
        value
      };
    });
  }, [pastInquiries]);

  // Derived statistics
  const stats = useMemo(() => {
    if (!pastInquiries || pastInquiries.length === 0) {
      return { dominantSign: 'None', totalTagged: 0, topElement: 'None' };
    }

    let maxCount = -1;
    let dominantSign = 'None';
    const elementCounts: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    let totalTagged = 0;

    chartData.forEach(item => {
      if (item.value > 0) {
        totalTagged += item.value;
        if (item.value > maxCount) {
          maxCount = item.value;
          dominantSign = `${item.symbol} ${item.name}`;
        }
        if (elementCounts[item.element] !== undefined) {
          elementCounts[item.element] += item.value;
        }
      }
    });

    let topElement = 'None';
    let maxElemCount = -1;
    Object.entries(elementCounts).forEach(([elem, count]) => {
      if (count > maxElemCount) {
        maxElemCount = count;
        topElement = elem;
      }
    });

    return {
      dominantSign: maxCount > 0 ? dominantSign : 'None',
      totalTagged,
      topElement: maxElemCount > 0 ? topElement : 'None'
    };
  }, [chartData, pastInquiries]);

  const activeColor = activeTheme.textAccentHex || '#D4AF37';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-950/95 border border-white/15 px-3 py-2 rounded-lg shadow-xl backdrop-blur-md text-left">
          <p className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1">
            <span>{data.symbol}</span>
            <span>{data.name}</span>
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">Element: {data.element}</p>
          <p className="text-xs font-mono font-bold text-white mt-1">
            {data.value} {data.value === 1 ? 'Inquiry' : 'Inquiries'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!pastInquiries || pastInquiries.length === 0) return null;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xs font-serif font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Zodiacal Influence Chart</span>
          </h4>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            Frequency distribution across celestial zodiac alignments
          </p>
        </div>

        <button
          onClick={() => setShowChart(!showChart)}
          className="text-[10px] font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>{showChart ? "Hide Chart" : "Show Chart"}</span>
        </button>
      </div>

      {showChart && (
        <>
          {/* Chart Canvas */}
          <div className="h-36 w-full mt-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 20 }}>
                <XAxis 
                  dataKey="symbol" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#d4af37', fontSize: 11, fontFamily: 'serif' }}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={8} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fill: '#64748b', fontSize: 8, fontFamily: 'monospace' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                <Bar 
                  dataKey="value" 
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                  onClick={(data) => {
                    if (onSelectZodiacFilter && data && data.name) {
                      onSelectZodiacFilter(selectedZodiacFilter === data.name ? 'all' : data.name);
                    }
                  }}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => {
                    const isSelected = selectedZodiacFilter === entry.name;
                    return (
                      <Cell 
                        key={`zodiac-cell-${index}`} 
                        fill={isSelected ? '#f59e0b' : activeColor}
                        fillOpacity={entry.value === 0 ? 0.08 : isSelected ? 0.9 : 0.45 + (entry.value / (Math.max(...chartData.map(d => d.value)) || 1)) * 0.45}
                        stroke={isSelected ? '#fbbf24' : activeColor}
                        strokeWidth={isSelected ? 2 : 1}
                        strokeOpacity={entry.value === 0 ? 0.1 : 0.8}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats Footer */}
          <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2 text-center text-[9px] font-mono text-slate-500">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-300 font-serif flex items-center gap-1 truncate max-w-full" title={stats.dominantSign}>
                {stats.dominantSign}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-600 mt-0.5">Dominant Sign</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/5 px-1">
              <span className="text-[10px] text-amber-400 font-bold font-mono">
                {stats.topElement}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-600 mt-0.5">Core Element</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-300 font-mono">
                {stats.totalTagged} / {pastInquiries.length}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-600 mt-0.5">Aligned Inquiries</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
