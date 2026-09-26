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
import { Calendar, Clock, BarChart3, Star, Award, Library, Sparkles } from 'lucide-react';

export interface PastInquiry {
  id: string;
  question: string;
  answer: string;
  school: string;
  timestamp: string;
  zodiacSign?: string;
  balanceInterpretation?: string;
  metrics?: Array<{ subject: string; value: number }>;
  tags?: string[];
  notes?: string;
}

interface ChroniclesTimelineProps {
  pastInquiries: PastInquiry[];
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    bgCard: string;
    starStroke: string;
  };
}

type GroupByMode = 'date' | 'hour' | 'weekday' | 'school' | 'zodiac';

export default function ChroniclesTimeline({ pastInquiries, activeTheme }: ChroniclesTimelineProps) {
  const [groupBy, setGroupBy] = useState<GroupByMode>('date');

  // Parse a timestamp string robustly
  const parseInquiryDate = (tsStr: string): Date => {
    if (!tsStr) return new Date();
    const d = new Date(tsStr);
    if (!isNaN(d.getTime())) return d;
    try {
      // Strips any emojis, leading/trailing non-alphanumeric, etc.
      const cleaned = tsStr.replace(/[^\w\s\d,:/.-]/g, '').trim();
      const d2 = new Date(cleaned);
      if (!isNaN(d2.getTime())) return d2;
    } catch (e) {}
    return new Date();
  };

  // Process data for the Recharts bar chart
  const chartData = useMemo(() => {
    if (!pastInquiries || pastInquiries.length === 0) return [];

    if (groupBy === 'date') {
      // Group by chronological Date (e.g. "Jul 17")
      const counts: Record<string, { dateObj: Date; count: number }> = {};
      
      pastInquiries.forEach(iq => {
        const d = parseInquiryDate(iq.timestamp);
        // Format to a readable date (e.g. "Jul 17")
        const key = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (!counts[key]) {
          counts[key] = { dateObj: d, count: 0 };
        }
        counts[key].count += 1;
      });

      // Sort chronological by dateObj
      return Object.entries(counts)
        .map(([name, val]) => ({ name, value: val.count, dateObj: val.dateObj }))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    } 
    
    if (groupBy === 'hour') {
      // Group by Hour of day (0 to 23) mapped to AM/PM intervals
      const counts: Record<number, number> = {};
      // Pre-populate all 24 hours to have a smooth continuous timeline
      for (let h = 0; h < 24; h++) {
        counts[h] = 0;
      }

      pastInquiries.forEach(iq => {
        const d = parseInquiryDate(iq.timestamp);
        const hr = d.getHours();
        counts[hr] = (counts[hr] || 0) + 1;
      });

      return Object.entries(counts).map(([hrStr, count]) => {
        const hr = parseInt(hrStr, 10);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const displayHr = hr % 12 === 0 ? 12 : hr % 12;
        return {
          name: `${displayHr} ${ampm}`,
          value: count,
          rawHour: hr
        };
      }).sort((a, b) => a.rawHour - b.rawHour);
    }

    if (groupBy === 'weekday') {
      // Group by Day of the Week (Sunday - Saturday)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const counts: Record<string, number> = {};
      days.forEach(d => { counts[d] = 0; });

      pastInquiries.forEach(iq => {
        const d = parseInquiryDate(iq.timestamp);
        const dayName = days[d.getDay()];
        counts[dayName] = (counts[dayName] || 0) + 1;
      });

      return days.map(name => ({
        name,
        value: counts[name]
      }));
    }

    if (groupBy === 'school') {
      // Group by School / Scholarship tradition
      const counts: Record<string, number> = {};
      pastInquiries.forEach(iq => {
        const school = iq.school || 'Unknown';
        // Shorten long school names for readable labels
        const shortSchool = school.replace("'s Scholarship", "").replace(" Scholarship", "");
        counts[shortSchool] = (counts[shortSchool] || 0) + 1;
      });

      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    }

    // Group by Zodiac Sign
    const zodiacList = [
      { name: 'Aries', symbol: '♈' },
      { name: 'Taurus', symbol: '♉' },
      { name: 'Gemini', symbol: '♊' },
      { name: 'Cancer', symbol: '♋' },
      { name: 'Leo', symbol: '♌' },
      { name: 'Virgo', symbol: '♍' },
      { name: 'Libra', symbol: '♎' },
      { name: 'Scorpio', symbol: '♏' },
      { name: 'Sagittarius', symbol: '♐' },
      { name: 'Capricorn', symbol: '♑' },
      { name: 'Aquarius', symbol: '♒' },
      { name: 'Pisces', symbol: '♓' }
    ];
    const counts: Record<string, number> = {};
    zodiacList.forEach(z => { counts[z.name] = 0; });
    pastInquiries.forEach(iq => {
      if (iq.zodiacSign) {
        const match = zodiacList.find(z => z.name.toLowerCase() === iq.zodiacSign?.toLowerCase());
        if (match) counts[match.name] = (counts[match.name] || 0) + 1;
      }
    });
    return zodiacList.map(z => ({
      name: `${z.symbol} ${z.name.slice(0, 3)}`,
      value: counts[z.name] || 0
    }));

  }, [pastInquiries, groupBy]);

  // Derived statistics for display
  const stats = useMemo(() => {
    if (!pastInquiries || pastInquiries.length === 0) {
      return { total: 0, activePeriod: 'N/A', favoriteSchool: 'N/A' };
    }

    // Favorite school calculation
    const schoolCounts: Record<string, number> = {};
    pastInquiries.forEach(iq => {
      schoolCounts[iq.school] = (schoolCounts[iq.school] || 0) + 1;
    });
    const sortedSchools = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1]);
    const favoriteSchool = sortedSchools[0] ? sortedSchools[0][0].replace(" Scholarship", "") : 'N/A';

    // Active period calculation
    let activePeriod = 'N/A';
    if (chartData.length > 0) {
      const sortedData = [...chartData].sort((a, b) => b.value - a.value);
      if (sortedData[0] && sortedData[0].value > 0) {
        activePeriod = sortedData[0].name;
      }
    }

    return {
      total: pastInquiries.length,
      activePeriod,
      favoriteSchool
    };
  }, [pastInquiries, chartData]);

  const activeColor = activeTheme.textAccentHex || '#D4AF37';

  // Custom tooltips matching the spiritual theme
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`bg-neutral-950/95 border border-white/15 px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md text-center`}>
          <p className="text-[10px] font-mono font-semibold text-slate-400">{payload[0].payload.name}</p>
          <p className="text-xs font-mono font-bold text-white mt-0.5">
            {payload[0].value} {payload[0].value === 1 ? 'Consultation' : 'Consultations'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!pastInquiries || pastInquiries.length === 0) return null;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
      {/* Header with quick overview */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xs font-serif font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Consultation Patterns</span>
          </h4>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            Visualizing frequency over sacred timeline dimensions
          </p>
        </div>

        {/* View mode buttons */}
        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setGroupBy('date')}
            title="By Date"
            className={`p-1 rounded-md transition-all cursor-pointer ${
              groupBy === 'date' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGroupBy('hour')}
            title="By Hour of Day"
            className={`p-1 rounded-md transition-all cursor-pointer ${
              groupBy === 'hour' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGroupBy('weekday')}
            title="By Day of Week"
            className={`p-1 rounded-md transition-all cursor-pointer ${
              groupBy === 'weekday' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGroupBy('school')}
            title="By Scholarship School"
            className={`p-1 rounded-md transition-all cursor-pointer ${
              groupBy === 'school' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGroupBy('zodiac')}
            title="By Zodiac Alignment"
            className={`p-1 rounded-md transition-all cursor-pointer ${
              groupBy === 'zodiac' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="h-32 w-full mt-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 8, fontFamily: 'monospace' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: '#64748b', fontSize: 8, fontFamily: 'monospace' }}
            />
            <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Bar 
              dataKey="value" 
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activeColor}
                  fillOpacity={entry.value === 0 ? 0.05 : 0.45 + (entry.value / (Math.max(...chartData.map(d => d.value)) || 1)) * 0.4}
                  stroke={activeColor}
                  strokeWidth={1}
                  strokeOpacity={entry.value === 0 ? 0.1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Miniature stats footer */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2 text-center text-[9px] font-mono text-slate-500">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500/80 animate-pulse" /> {stats.total}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-slate-600 mt-0.5">Chronicles</span>
        </div>
        <div className="flex flex-col items-center border-x border-white/5 px-1 truncate">
          <span className="text-[10px] text-slate-300 font-serif truncate max-w-full" title={stats.activePeriod}>
            {stats.activePeriod}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-slate-600 mt-0.5">Peak Window</span>
        </div>
        <div className="flex flex-col items-center truncate">
          <span className="text-[10px] text-slate-300 font-serif truncate max-w-full" title={stats.favoriteSchool}>
            {stats.favoriteSchool}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-slate-600 mt-0.5">Core Focus</span>
        </div>
      </div>
    </div>
  );
}
