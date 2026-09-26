import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Sparkles, Calendar, Award, Star } from 'lucide-react';
import { ZODIAC_DESCRIPTIONS } from '../data/zodiacData';

export interface PastInquiry {
  id: string;
  question: string;
  answer: string;
  school: string;
  timestamp: string;
  zodiacSign?: string;
  tags?: string[];
  notes?: string;
}

interface ZodiacPolarChartProps {
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

const ZODIAC_METADATA = [
  { name: "Aries", symbol: "♈", element: "Ignis", modality: "Cardinal", color: "#EF4444", gradientId: "polar-grad-aries", startColor: "#EF4444", endColor: "#991B1B", desc: "Bold, passionate, and pioneering initiator." },
  { name: "Taurus", symbol: "♉", element: "Materia", modality: "Fixed", color: "#10B981", gradientId: "polar-grad-taurus", startColor: "#10B981", endColor: "#065F46", desc: "Grounded, sensory, loyal, and steady builder." },
  { name: "Gemini", symbol: "♊", element: "Aer", modality: "Mutable", color: "#06B6D4", gradientId: "polar-grad-gemini", startColor: "#06B6D4", endColor: "#075985", desc: "Curious, agile, witty, and versatile thinker." },
  { name: "Cancer", symbol: "♋", element: "Aqua", modality: "Cardinal", color: "#3B82F6", gradientId: "polar-grad-cancer", startColor: "#3B82F6", endColor: "#1E40AF", desc: "Intuitive, nurturing, protective, and emotional." },
  { name: "Leo", symbol: "♌", element: "Ignis", modality: "Fixed", color: "#F59E0B", gradientId: "polar-grad-leo", startColor: "#F59E0B", endColor: "#92400E", desc: "Radiant, noble, creative, and expressive leader." },
  { name: "Virgo", symbol: "♍", element: "Materia", modality: "Mutable", color: "#059669", gradientId: "polar-grad-virgo", startColor: "#059669", endColor: "#064E3B", desc: "Analytical, helpful, pure, and meticulously organized." },
  { name: "Libra", symbol: "♎", element: "Aer", modality: "Cardinal", color: "#22D3EE", gradientId: "polar-grad-libra", startColor: "#22D3EE", endColor: "#0369A1", desc: "Harmonious, diplomatic, artistic, and relationship-driven." },
  { name: "Scorpio", symbol: "♏", element: "Aqua", modality: "Fixed", color: "#6366F1", gradientId: "polar-grad-scorpio", startColor: "#6366F1", endColor: "#3730A3", desc: "Intense, psychic, strategic, and transformative." },
  { name: "Sagittarius", symbol: "♐", element: "Ignis", modality: "Mutable", color: "#D97706", gradientId: "polar-grad-sagittarius", startColor: "#D97706", endColor: "#78350F", desc: "Philosophical, wild, truth-seeking, and optimistic voyager." },
  { name: "Capricorn", symbol: "♑", element: "Materia", modality: "Cardinal", color: "#4B5563", gradientId: "polar-grad-capricorn", startColor: "#4B5563", endColor: "#1F2937", desc: "Ambitious, master of structures, patient, and self-disciplined." },
  { name: "Aquarius", symbol: "♒", element: "Aer", modality: "Fixed", color: "#8B5CF6", gradientId: "polar-grad-aquarius", startColor: "#8B5CF6", endColor: "#5B21B6", desc: "Visionary, humanitarian, rebellious, and community-centric." },
  { name: "Pisces", symbol: "♓", element: "Aqua", modality: "Mutable", color: "#6366F1", gradientId: "polar-grad-pisces", startColor: "#6366F1", endColor: "#4338CA", desc: "Dreamy, empathetic, artistic, and spiritually transcendent." }
];

export default function ZodiacPolarChart({ pastInquiries, activeTheme }: ZodiacPolarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredSign, setHoveredSign] = useState<any | null>(null);

  // Compute frequencies
  const frequencies = useMemo(() => {
    const counts: Record<string, number> = {};
    ZODIAC_METADATA.forEach(z => { counts[z.name] = 0; });
    
    let validCount = 0;
    pastInquiries.forEach(iq => {
      if (iq.zodiacSign) {
        const trimmed = iq.zodiacSign.trim();
        const match = ZODIAC_METADATA.find(z => z.name.toLowerCase() === trimmed.toLowerCase());
        if (match) {
          counts[match.name] += 1;
          validCount += 1;
        }
      }
    });

    return { counts, totalWithZodiac: validCount };
  }, [pastInquiries]);

  // Dynamic D3 layout rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 360;
    const height = 360;
    const margin = 55;
    const maxRadius = (width / 2) - margin; // 125px
    const innerRadius = 38; // leave a nice central core

    const svg = d3.select(svgRef.current);
    svg.selectAll(".d3-dynamic-element").remove();

    // Map each zodiac sign data
    const chartData = ZODIAC_METADATA.map((sign, index) => {
      const count = frequencies.counts[sign.name] || 0;
      return {
        ...sign,
        count,
        index
      };
    });

    const maxCount = d3.max(chartData, d => d.count) || 0;
    // Fallback domain so the chart renders nicely even with zero consultations
    const scaleDomainUpper = maxCount > 0 ? maxCount : 1;

    // Linear scale for radius
    const radiusScale = d3.scaleLinear()
      .domain([0, scaleDomainUpper])
      .range([innerRadius, maxRadius]);

    const numSlices = 12;
    const angleWidth = (2 * Math.PI) / numSlices;

    const g = svg.append("g")
      .attr("class", "d3-dynamic-element")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Define glowing glow filters and gradients if not defined
    const defs = g.append("defs");

    // Dynamic linear gradients for outer bars based on elemental characteristics
    chartData.forEach(d => {
      const grad = defs.append("linearGradient")
        .attr("id", d.gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

      grad.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d.startColor)
        .attr("stop-opacity", 0.85);

      grad.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d.endColor)
        .attr("stop-opacity", 0.45);
    });

    // Create shadow glow filter
    const filter = defs.append("filter")
      .attr("id", "polar-glow-filter")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "blur");

    filter.append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");

    // 1. Concentric reference grid circles representing counts
    const gridTicks = maxCount > 4 
      ? d3.ticks(1, maxCount, 4) 
      : Array.from({ length: Math.max(maxCount, 1) }, (_, i) => i + 1);

    gridTicks.forEach(tick => {
      const r = radiusScale(tick);
      
      // Dashed grid circle
      g.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "rgba(255, 255, 255, 0.08)")
        .attr("stroke-dasharray", "3,3")
        .attr("stroke-width", 0.8);

      // Grid labels along the top axis (12 o'clock vertical)
      g.append("text")
        .attr("x", 4)
        .attr("y", -r + 3)
        .attr("text-anchor", "start")
        .attr("fill", "rgba(148, 163, 184, 0.55)")
        .attr("font-size", "7.5px")
        .attr("font-family", "monospace")
        .text(`${tick}`);
    });

    // 2. Radial slice boundary divider lines
    for (let i = 0; i < numSlices; i++) {
      const angle = i * angleWidth - Math.PI / 2; // offset by -PI/2 to start at top (12 o'clock)
      const x1 = innerRadius * Math.cos(angle);
      const y1 = innerRadius * Math.sin(angle);
      const x2 = (maxRadius + 6) * Math.cos(angle);
      const y2 = (maxRadius + 6) * Math.sin(angle);

      g.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "rgba(255, 255, 255, 0.06)")
        .attr("stroke-width", 0.7);
    }

    // 3. Polar bar arcs representing frequencies
    const arcGenerator = d3.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(d => radiusScale(d.count))
      .startAngle(d => d.index * angleWidth)
      .endAngle(d => (d.index + 1) * angleWidth)
      .padAngle(0.035) // gap between slices
      .padRadius(innerRadius);

    const barsGroup = g.append("g")
      .attr("class", "polar-bars");

    barsGroup.selectAll("path")
      .data(chartData)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", d => `url(#${d.gradientId})`)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 0.7)
      .attr("stroke-opacity", d => d.count > 0 ? 0.85 : 0.15)
      .attr("cursor", "pointer")
      .attr("class", "transition-all duration-300")
      .on("mouseover", function (event, d) {
        // Highlight active bar
        d3.select(this)
          .attr("stroke-width", 1.8)
          .attr("fill-opacity", 1)
          .attr("filter", "url(#polar-glow-filter)");

        setHoveredSign({
          name: d.name,
          symbol: d.symbol,
          element: d.element,
          modality: d.modality,
          count: d.count,
          color: d.color,
          desc: d.desc,
          pct: frequencies.totalWithZodiac > 0 
            ? Math.round((d.count / frequencies.totalWithZodiac) * 100) 
            : 0
        });
      })
      .on("mouseout", function (event, d) {
        // Restore styling
        d3.select(this)
          .attr("stroke-width", 0.7)
          .attr("fill-opacity", null)
          .attr("filter", null);

        setHoveredSign(null);
      });

    // 4. Outer labels (Zodiac signs & Symbols)
    const labelGroup = g.append("g")
      .attr("class", "labels");

    chartData.forEach((d, i) => {
      const midAngle = i * angleWidth + angleWidth / 2 - Math.PI / 2;
      const labelDistance = maxRadius + 18;
      const x = labelDistance * Math.cos(midAngle);
      const y = labelDistance * Math.sin(midAngle) + 3.5; // slight manual offset vertical adjustment

      // Decides text anchoring based on coordinates
      let textAnchor = "middle";
      if (Math.cos(midAngle) > 0.15) {
        textAnchor = "start";
      } else if (Math.cos(midAngle) < -0.15) {
        textAnchor = "end";
      }

      const activeLabel = labelGroup.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", textAnchor)
        .attr("class", "cursor-pointer select-none transition-all duration-300 font-serif")
        .on("mouseover", () => {
          setHoveredSign({
            name: d.name,
            symbol: d.symbol,
            element: d.element,
            modality: d.modality,
            count: d.count,
            color: d.color,
            desc: d.desc,
            pct: frequencies.totalWithZodiac > 0 
              ? Math.round((d.count / frequencies.totalWithZodiac) * 100) 
              : 0
          });
        })
        .on("mouseout", () => {
          setHoveredSign(null);
        });

      // Symbol in a gold/high-contrast display
      activeLabel.append("tspan")
        .text(d.symbol)
        .attr("fill", activeTheme.textAccentHex || "#D4AF37")
        .attr("font-size", "13px")
        .attr("font-family", "serif")
        .attr("font-weight", "bold");

      // Sign name in clean muted text
      activeLabel.append("tspan")
        .text(` ${d.name}`)
        .attr("fill", d.count > 0 ? "#f1f5f9" : "rgba(148, 163, 184, 0.5)")
        .attr("font-size", "9px")
        .attr("letter-spacing", "0.5px")
        .attr("font-weight", d.count > 0 ? "500" : "normal");
    });

    // 5. Central interactive core emblem
    const core = g.append("g")
      .attr("class", "central-core");

    // Decorative outer gold ring
    core.append("circle")
      .attr("r", innerRadius - 2)
      .attr("fill", "none")
      .attr("stroke", activeTheme.textAccentHex || "rgba(212, 175, 55, 0.4)")
      .attr("stroke-width", 0.6)
      .attr("stroke-opacity", 0.7);

    // Dark solid central masking disk
    core.append("circle")
      .attr("r", innerRadius - 4)
      .attr("fill", "#09090b")
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-width", 0.5);

    // Miniature text details inside central core
    core.append("text")
      .attr("y", -6)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(148, 163, 184, 0.45)")
      .attr("font-family", "monospace")
      .attr("font-size", "6.5px")
      .attr("letter-spacing", "1px")
      .text("ZODIAC");

    core.append("text")
      .attr("y", 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-family", "serif")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text(`${frequencies.totalWithZodiac}`);

    core.append("text")
      .attr("y", 17)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(148, 163, 184, 0.35)")
      .attr("font-family", "monospace")
      .attr("font-size", "5px")
      .attr("letter-spacing", "0.5px")
      .text("RECORDS");

  }, [frequencies, activeTheme]);

  return (
    <div id="zodiac-polar-visualizer" className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
      {/* Visualizer Title */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xs font-serif font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Zodiacal Frequency Spectrum</span>
          </h4>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            Polar bar distribution of Consultation Chronicles
          </p>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex justify-center items-center py-2 relative">
        <svg 
          ref={svgRef} 
          width="360" 
          height="360" 
          className="max-w-full h-auto select-none overflow-visible"
          style={{ width: '360px', height: '360px' }}
        />

        {/* Hover Information / Live Tooltip inside card layout */}
        {hoveredSign && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[120px] h-[120px] rounded-full bg-neutral-950/95 border border-white/10 flex flex-col justify-center items-center text-center p-2 backdrop-blur-md shadow-2xl transition-all duration-300">
              <span className="text-xs font-serif font-bold text-white flex items-center gap-1">
                <span style={{ color: hoveredSign.color }}>{hoveredSign.symbol}</span>
                {hoveredSign.name}
              </span>
              <span className="text-[7.5px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                {hoveredSign.element} • {hoveredSign.modality}
              </span>
              <span className="text-[13px] font-mono font-bold text-amber-200 mt-1.5">
                {hoveredSign.count} {hoveredSign.count === 1 ? 'record' : 'records'}
              </span>
              {hoveredSign.pct > 0 && (
                <span className="text-[8px] font-mono text-slate-500 mt-0.5">
                  ({hoveredSign.pct}% of total)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom info panel */}
      <div className="border-t border-white/5 pt-3 mt-1">
        {hoveredSign ? (
          <div className="min-h-[44px] animate-fade-in">
            <p className="text-[9.5px] text-slate-300 font-serif leading-relaxed italic">
              {ZODIAC_DESCRIPTIONS[hoveredSign.name]}
            </p>
          </div>
        ) : (
          <div className="min-h-[44px] flex items-center justify-center text-center">
            <p className="text-[9.5px] text-slate-500 font-mono tracking-wide">
              {frequencies.totalWithZodiac > 0 
                ? "Hover over any cosmic segment to reveal its astrological signature & insights."
                : "No saved chronicles have an associated zodiac sign. Add one in the main console to expand the polar spectrum!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
