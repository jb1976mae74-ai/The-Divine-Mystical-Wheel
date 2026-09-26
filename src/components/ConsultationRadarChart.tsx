import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { Crown, Sparkles } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  activeTheme: any;
  dominantSubject?: string;
  isTrendMode?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  activeTheme,
  dominantSubject,
  isTrendMode,
}) => {
  if (active && payload && payload.length) {
    const currentSubject = payload[0].payload.subject;
    const isDominant = currentSubject === dominantSubject;

    if (isTrendMode && payload.length > 1) {
      return (
        <div
          className={`bg-[#18181b]/98 border ${
            activeTheme.id === 'deep-void'
              ? 'border-violet-500/40'
              : activeTheme.id === 'ethereal-silver'
              ? 'border-slate-400/40'
              : 'border-amber-500/30'
          } px-3 py-2 rounded-lg shadow-xl text-left backdrop-blur-md flex flex-col gap-1.5 min-w-[170px]`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1 gap-2">
            <p
              className={`text-xs font-mono font-bold ${
                activeTheme.id === 'deep-void'
                  ? 'text-violet-300'
                  : activeTheme.id === 'ethereal-silver'
                  ? 'text-slate-200'
                  : 'text-amber-300'
              }`}
            >
              {currentSubject}
            </p>
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider bg-white/5 px-1 py-0.5 rounded border border-white/10">
              5-Consultation Trend
            </span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const labelName = entry.name || `Consultation #${index + 1}`;
              return (
                <div
                  key={`tooltip-entry-${entry.name || index}-${index}`}
                  className="flex items-center justify-between text-[10px] font-mono gap-3"
                >
                  <span
                    className="flex items-center gap-1.5 truncate max-w-[130px]"
                    style={{ color: entry.stroke || entry.color }}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: entry.stroke || entry.color }}
                    />
                    <span className="truncate">{labelName}</span>
                  </span>
                  <span className="font-bold text-slate-100 font-mono shrink-0">
                    {entry.value} / 10
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`bg-[#18181b]/98 border ${
          activeTheme.id === 'deep-void'
            ? 'border-violet-500/40'
            : activeTheme.id === 'ethereal-silver'
            ? 'border-slate-400/40'
            : 'border-amber-500/30'
        } px-3.5 py-2 rounded-lg shadow-xl text-center backdrop-blur-md flex flex-col items-center gap-1 min-w-[130px]`}
      >
        <div className="flex items-center gap-1.5 justify-center">
          {isDominant && (
            <Crown
              className={`w-3.5 h-3.5 ${
                activeTheme.id === 'deep-void'
                  ? 'text-violet-400'
                  : activeTheme.id === 'ethereal-silver'
                  ? 'text-slate-300'
                  : 'text-amber-400'
              } animate-pulse`}
            />
          )}
          <p
            className={`text-xs font-mono font-semibold ${
              activeTheme.id === 'deep-void'
                ? 'text-violet-300'
                : activeTheme.id === 'ethereal-silver'
                ? 'text-slate-200'
                : 'text-amber-200'
            }`}
          >
            {currentSubject}
          </p>
        </div>
        <p
          className={`text-sm font-mono ${
            activeTheme.id === 'deep-void'
              ? 'text-violet-400'
              : activeTheme.id === 'ethereal-silver'
              ? 'text-slate-300'
              : 'text-amber-400'
          } font-bold mt-0.5`}
        >
          {payload[0].value} <span className="text-[10px] text-slate-500 font-normal">/ 10</span>
        </p>
        {isDominant && (
          <span
            className={`text-[8.5px] font-mono tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase mt-0.5 flex items-center gap-1`}
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" /> Dominant Force
          </span>
        )}
      </div>
    );
  }
  return null;
};

interface ConsultationRadarChartProps {
  unifiedRadarData: any[];
  activeTheme: any;
  showTrendAnalysis: boolean;
  trendConsultations: any[];
  hiddenTrendIndices: number[];
  highestElement?: { subject: string; value: number; fullMark: number };
  elementalView?: 'standard' | 'spiritus-ignis' | 'aqua-aer' | 'materia-ignis';
  isTransitioning?: boolean;
}

const ELEMENTAL_VIEW_THEMES: Record<string, {
  name: string;
  stroke: string;
  fill: string;
  glow: string;
  focusedElements: string[];
  accentColor: string;
}> = {
  'standard': {
    name: 'Quintessence',
    stroke: '#fbbf24', // Amber/Gold
    fill: 'rgba(251, 191, 36, 0.22)',
    glow: 'rgba(251, 191, 36, 0.45)',
    focusedElements: ['Spiritus', 'Ignis', 'Aqua', 'Aer', 'Materia'],
    accentColor: '#fbbf24'
  },
  'spiritus-ignis': {
    name: 'Celestial Flame',
    stroke: '#f97316', // Fiery Orange
    fill: 'rgba(249, 115, 22, 0.26)',
    glow: 'rgba(249, 115, 22, 0.55)',
    focusedElements: ['Spiritus', 'Ignis'],
    accentColor: '#fb923c'
  },
  'aqua-aer': {
    name: 'Astral Tides',
    stroke: '#06b6d4', // Celestial Cyan / Azure
    fill: 'rgba(6, 182, 212, 0.24)',
    glow: 'rgba(6, 182, 212, 0.55)',
    focusedElements: ['Aqua', 'Aer'],
    accentColor: '#38bdf8'
  },
  'materia-ignis': {
    name: 'Telluric Crucible',
    stroke: '#10b981', // Emerald / Alchemical Terra
    fill: 'rgba(16, 185, 129, 0.24)',
    glow: 'rgba(16, 185, 129, 0.55)',
    focusedElements: ['Materia', 'Ignis'],
    accentColor: '#34d399'
  }
};

export const ConsultationRadarChart: React.FC<ConsultationRadarChartProps> = ({
  unifiedRadarData,
  activeTheme,
  showTrendAnalysis,
  trendConsultations,
  hiddenTrendIndices,
  highestElement,
  elementalView = 'standard',
  isTransitioning = false,
}) => {
  const currentViewTheme = ELEMENTAL_VIEW_THEMES[elementalView] || ELEMENTAL_VIEW_THEMES['standard'];

  // In standard view with custom themes, respect the theme color; otherwise use elemental axis color
  const effectiveStroke = elementalView === 'standard' ? activeTheme.radarColor : currentViewTheme.stroke;
  const effectiveFill = elementalView === 'standard' 
    ? (activeTheme.radarFillColor || activeTheme.radarColor) 
    : currentViewTheme.fill;

  const renderPolarAngleAxisTick = ({ payload, x, y, textAnchor }: any) => {
    const isFocused = currentViewTheme.focusedElements.includes(payload.value);
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor || "middle"}
        dominantBaseline="central"
        fill={isFocused ? (elementalView === 'standard' ? '#e2e8f0' : currentViewTheme.accentColor) : '#64748b'}
        fontSize={isFocused && elementalView !== 'standard' ? 10.5 : 9.5}
        fontWeight={isFocused ? 700 : 500}
        fontFamily="monospace"
        style={{
          transition: 'fill 0.4s ease, font-size 0.3s ease, font-weight 0.3s ease',
        }}
      >
        {payload.value}
        {isFocused && elementalView !== 'standard' ? ' ✦' : ''}
      </text>
    );
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Dynamic ambient elemental glow backplane */}
      <div 
        className="absolute inset-0 m-auto w-48 h-48 rounded-full pointer-events-none blur-3xl transition-all duration-700 opacity-30"
        style={{ backgroundColor: currentViewTheme.accentColor }}
      />

      <RadarChart width={310} height={240} cx="50%" cy="50%" outerRadius="70%" data={unifiedRadarData}>
        <PolarGrid
          stroke={
            activeTheme.id === 'deep-void'
              ? 'rgba(192, 132, 252, 0.15)'
              : activeTheme.id === 'ethereal-silver'
              ? 'rgba(203, 213, 225, 0.15)'
              : 'rgba(212, 175, 55, 0.15)'
          }
          strokeWidth={1}
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={renderPolarAngleAxisTick}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 10]}
          tick={{ fill: '#475569', fontSize: 8 }}
          axisLine={false}
        />

        {/* Standard Mode Radar Layer */}
        <Radar
          key="radar-standard"
          name="Alignment Magnitude"
          dataKey="value"
          stroke={effectiveStroke}
          strokeWidth={showTrendAnalysis ? 0 : 2.5}
          fill={effectiveFill}
          fillOpacity={showTrendAnalysis ? 0 : (elementalView === 'standard' ? activeTheme.radarFillOpacity : 0.8)}
          isAnimationActive={false} // Smoothly updated via frame-by-frame cubic ease interpolation
          dot={
            showTrendAnalysis
              ? false
              : (props: any) => {
                  const isFocused = currentViewTheme.focusedElements.includes(props.payload.subject);
                  return (
                    <circle
                      key={`radar-dot-${props.payload.subject}`}
                      cx={props.cx}
                      cy={props.cy}
                      r={isFocused && elementalView !== 'standard' ? 4 : 2.5}
                      fill={isFocused ? effectiveStroke : '#64748b'}
                      stroke="#0f172a"
                      strokeWidth={1.5}
                      style={{
                        transition: 'r 0.3s ease, fill 0.4s ease',
                      }}
                    />
                  );
                }
          }
        />

        {/* Trend Analysis Radar Layers */}
        {trendConsultations.map((c, idx) => {
          const isHidden = hiddenTrendIndices.includes(idx);
          const isVisible = showTrendAnalysis && !isHidden;
          return (
            <Radar
              key={`trend-radar-${c.id}-${idx}`}
              name={`${c.shortLabel}: ${c.questionSnippet}`}
              dataKey={`val${idx}`}
              stroke={c.color}
              strokeWidth={isVisible ? (idx === 0 ? 2.5 : 1.5) : 0}
              fill={c.color}
              fillOpacity={isVisible ? (idx === 0 ? 0.25 : 0.08) : 0}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          );
        })}

        <Tooltip
          content={
            <CustomTooltip
              activeTheme={activeTheme}
              dominantSubject={highestElement?.subject}
              isTrendMode={showTrendAnalysis}
            />
          }
        />
      </RadarChart>
    </div>
  );
};

export default ConsultationRadarChart;
