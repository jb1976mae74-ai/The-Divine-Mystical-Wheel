/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import { GitFork, Sparkles, HelpCircle, ChevronRight, Eye } from "lucide-react";

export interface EtymologyNode {
  id: string;
  parentId?: string;
  label: string;
  term?: string;
  meaning: string;
  tradition?: string;
}

interface VisualEtymologyProps {
  nodes?: EtymologyNode[];
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    bgCard: string;
    starStroke: string;
    accentGlow: string;
  };
}

export default function VisualEtymology({ nodes = [], activeTheme }: VisualEtymologyProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Fallback default nodes if none provided
  const validNodes = useMemo(() => {
    if (nodes && nodes.length > 0) return nodes;
    return [
      { id: "root", label: "Semitic Origin", term: "*- - -", meaning: "Primordial root archetype", tradition: "Semitic" },
      { id: "hebrew", parentId: "root", label: "Tiberian Hebrew", term: "רוּחַ", meaning: "Spiritual breath/wind", tradition: "Judeo-Christian" },
      { id: "arabic", parentId: "root", label: "Classical Arabic", term: "روح", meaning: "Inner soul / vital spark", tradition: "Islamic" }
    ];
  }, [nodes]);

  // Clean data for stratify: ensure exactly one root node is present
  const stratifiedData = useMemo(() => {
    if (validNodes.length === 0) return null;

    try {
      // Find nodes that have parentIds that don't match any node id
      const existingIds = new Set(validNodes.map(n => n.id));
      const adjustedNodes = validNodes.map(node => {
        // If parentId doesn't exist, treat as root (no parent)
        if (node.parentId && !existingIds.has(node.parentId)) {
          return { ...node, parentId: undefined };
        }
        return node;
      });

      // Count root nodes
      const roots = adjustedNodes.filter(n => !n.parentId);
      if (roots.length === 0) {
        // Force first node to be root
        adjustedNodes[0] = { ...adjustedNodes[0], parentId: undefined };
      } else if (roots.length > 1) {
        // Tie multiple roots to a single synthetic root if needed, or just force all but first to parent to first
        const primaryRootId = roots[0].id;
        for (let i = 1; i < adjustedNodes.length; i++) {
          if (!adjustedNodes[i].parentId && adjustedNodes[i].id !== primaryRootId) {
            adjustedNodes[i].parentId = primaryRootId;
          }
        }
      }

      const stratify = d3.stratify<EtymologyNode>()
        .id(d => d.id)
        .parentId(d => d.parentId || "");

      return stratify(adjustedNodes);
    } catch (err) {
      console.warn("Stratification failed. Generating flat tree.", err);
      return null;
    }
  }, [validNodes]);

  // Tree measurements
  const width = 640;
  const height = 280;
  const margin = { top: 25, right: 120, bottom: 25, left: 100 };

  // Calculate layout coordinates swapped for Left-to-Right layout
  const treeData = useMemo(() => {
    if (!stratifiedData) return null;

    const treeLayout = d3.tree<EtymologyNode>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    return treeLayout(stratifiedData);
  }, [stratifiedData]);

  // Set initial selected node to root
  const activeNode = useMemo(() => {
    if (!validNodes || validNodes.length === 0) return null;
    if (selectedNodeId) {
      const match = validNodes.find(n => n.id === selectedNodeId);
      if (match) return match;
    }
    // Default to the actual root node
    const rootNode = validNodes.find(n => !n.parentId) || validNodes[0];
    return rootNode;
  }, [validNodes, selectedNodeId]);

  // Helper to draw a smooth cubic Bezier horizontal link
  const drawLinkPath = (sX: number, sY: number, tX: number, tY: number) => {
    return `M ${sX} ${sY} C ${(sX + tX) / 2} ${sY}, ${(sX + tX) / 2} ${tY}, ${tX} ${tY}`;
  };

  // tradition color palettes
  const getTraditionColors = (tradition?: string) => {
    const t = (tradition || "").toLowerCase();
    if (t.includes("kabbal") || t.includes("hebrew") || t.includes("judeo")) {
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/40",
        text: "text-amber-300",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        stroke: "#f59e0b"
      };
    }
    if (t.includes("sufi") || t.includes("arabic") || t.includes("islam")) {
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/40",
        text: "text-emerald-300",
        glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        stroke: "#10b981"
      };
    }
    if (t.includes("gnostic") || t.includes("greek") || t.includes("hellen")) {
      return {
        bg: "bg-purple-500/10",
        border: "border-purple-500/40",
        text: "text-purple-300",
        glow: "shadow-[0_0_12px_rgba(168,85,247,0.25)]",
        stroke: "#a855f7"
      };
    }
    if (t.includes("hermet") || t.includes("alchem")) {
      return {
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/40",
        text: "text-cyan-300",
        glow: "shadow-[0_0_12px_rgba(6,182,212,0.25)]",
        stroke: "#06b6d4"
      };
    }
    // Default
    return {
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
      text: "text-blue-300",
      glow: "shadow-[0_0_12px_rgba(59,130,246,0.25)]",
      stroke: "#3b82f6"
    };
  };

  const currentColors = getTraditionColors(activeNode?.tradition);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in" id="visual_etymology_root">
      
      {/* Dynamic Interactive Stage Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* D3 Canvas Panel */}
        <div className="lg:col-span-2 bg-black/45 rounded-2xl border border-white/5 p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
          {/* Cosmic Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-75"></div>
          
          <div className="absolute top-3 left-4 flex items-center gap-1.5 z-10">
            <GitFork className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Branching Genealogies</span>
          </div>

          <div className="absolute top-3 right-4 flex items-center gap-1 z-10 text-[9px] font-mono text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500/60" /> Click nodes to trace lineages
          </div>

          {!treeData ? (
            <div className="text-center py-12 text-slate-500 font-serif">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-bounce" />
              <p className="text-sm">Weaving ancestral threads...</p>
              <p className="text-xs text-slate-600 mt-1">Linguistic coordinates align through aetheric paths.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto select-none flex items-center justify-center p-2 scrollbar-none">
              <svg 
                width={width} 
                height={height} 
                className="overflow-visible font-serif text-xs"
              >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                  
                  {/* Draw Lines/Links first (so they sit behind nodes) */}
                  <g className="links" fill="none" strokeWidth="1.5">
                    {treeData.links().map((link, index) => {
                      const sY = link.source.x; // mapped swap
                      const sX = link.source.y;
                      const tY = link.target.x;
                      const tX = link.target.y;

                      const sourceColors = getTraditionColors(link.source.data.tradition);
                      const targetColors = getTraditionColors(link.target.data.tradition);

                      return (
                        <motion.path
                          key={`link-${index}`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.35 }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          d={drawLinkPath(sX, sY, tX, tY)}
                          stroke={targetColors.stroke}
                          className="hover:stroke-[2.5px] hover:opacity-75 transition-all duration-350 cursor-pointer"
                        />
                      );
                    })}
                  </g>

                  {/* Draw Nodes */}
                  <g className="nodes">
                    {treeData.descendants().map((node) => {
                      const nY = node.x; // mapped swap
                      const nX = node.y;
                      const isSelected = activeNode?.id === node.data.id;
                      const col = getTraditionColors(node.data.tradition);

                      return (
                        <g 
                          key={`node-${node.data.id}`} 
                          transform={`translate(${nX}, ${nY})`}
                          onClick={() => setSelectedNodeId(node.data.id)}
                          className="cursor-pointer group"
                        >
                          {/* Pulse background on hover or selection */}
                          <circle 
                            r={isSelected ? 16 : 10} 
                            fill={col.stroke}
                            fillOpacity={isSelected ? 0.15 : 0.05}
                            stroke={col.stroke}
                            strokeOpacity={isSelected ? 0.75 : 0.2}
                            strokeWidth={isSelected ? 2 : 1}
                            className="group-hover:scale-125 transition-all duration-300"
                          />
                          
                          {/* Inner core circle */}
                          <circle 
                            r={isSelected ? 6 : 4} 
                            fill={col.stroke} 
                            className="group-hover:scale-110 transition-transform duration-300"
                          />

                          {/* Term / Glyph typography above node */}
                          {node.data.term && (
                            <text
                              dy="-16"
                              textAnchor="middle"
                              fill="#FFF0A5"
                              className="text-sm font-serif font-bold tracking-wide select-all opacity-90 drop-shadow-md group-hover:fill-white transition-colors"
                            >
                              {node.data.term}
                            </text>
                          )}

                          {/* Node label */}
                          <text
                            dy={node.data.term ? "16" : "14"}
                            dx="0"
                            textAnchor="middle"
                            fill={isSelected ? "#ffffff" : "#cbd5e1"}
                            className={`text-[10px] font-semibold tracking-wide transition-all ${isSelected ? 'font-bold underline decoration-amber-400/50 underline-offset-2' : 'group-hover:text-slate-200'}`}
                          >
                            {node.data.label}
                          </text>

                          {/* Small meaning subtitle (hidden on terminal leaf if text-cluttering, but styled beautifully) */}
                          <text
                            dy={node.data.term ? "27" : "25"}
                            textAnchor="middle"
                            fill="#94a3b8"
                            className="text-[8px] font-light opacity-80 select-none group-hover:opacity-100 transition-opacity"
                          >
                            {node.data.meaning.length > 18 ? node.data.meaning.slice(0, 16) + "..." : node.data.meaning}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                </g>
              </svg>
            </div>
          )}
        </div>

        {/* Esoteric Commentary Sidepanel */}
        <div className={`rounded-2xl bg-black/40 border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden h-full min-h-[340px]`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(ellipse_at_top_right,#ffffff03,transparent)] rounded-full"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode?.id || "empty"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${currentColors.bg} ${currentColors.text} border ${currentColors.border}`}>
                  {activeNode?.tradition || "Linguistic Axis"}
                </span>
                <span className="text-[9px] font-mono text-slate-500">Node ID: {activeNode?.id}</span>
              </div>

              <div>
                <h5 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">Historical Stage</h5>
                <h3 className={`text-xl font-serif ${activeTheme.textPrimary} mt-1 font-semibold flex items-center gap-1.5`}>
                  {activeNode?.label}
                </h3>
              </div>

              {activeNode?.term && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center my-1">
                  <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-widest mb-1">Inscribed Glyph / Script</span>
                  <div className="text-3xl font-serif text-amber-100 font-bold tracking-wide select-all">
                    {activeNode?.term}
                  </div>
                </div>
              )}

              <div>
                <h5 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">Semantic Meaning</h5>
                <p className="text-sm font-serif text-slate-200 mt-1 select-all font-light leading-relaxed">
                  "{activeNode?.meaning}"
                </p>
              </div>

              <div className="text-[11px] font-serif text-slate-400 leading-relaxed italic border-t border-white/5 pt-3">
                <strong className="text-slate-300 not-italic block mb-0.5 font-mono text-[9px] uppercase tracking-wider">Tradition Implications:</strong>
                {activeNode?.id === "proto_root" && (
                  "The primordial root represents the raw phonetic and cognitive sound-archetype before diversification. Across Semitic tongues, this breath-stem denotes divine emergence, life-breath, or spatial expanse."
                )}
                {activeNode?.id.includes("hebrew") && (
                  "In Kabbalistic tradition, Hebrew is the template of creation itself. The letters are spiritual channels of energy. This term maps directly to the active Sephira, conducting light into the lower worlds of form."
                )}
                {activeNode?.id.includes("arabic") && (
                  "In Islamic and Sufi metaphysics, the term is linked directly to Al-Amr (The Command) and the divine breath. It represents the uncreated spark that animates spiritual travel and heart-opening alignment."
                )}
                {activeNode?.id.includes("greek") && (
                  "Philosophically, the Greek expression bridges mystical gnosis and scholastic logic, laying the structural groundwork for Western metaphysics and the systematic exploration of the soul."
                )}
                {(!activeNode?.id.includes("hebrew") && !activeNode?.id.includes("arabic") && !activeNode?.id.includes("greek") && activeNode?.id !== "proto_root") && (
                  `This etymological coordinate bridges traditional frameworks. It shows how the core idea behind the word ${activeNode?.term ? `'${activeNode.term}'` : ''} evolved and was preserved across boundaries.`
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[10px] font-serif text-slate-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-500/80" /> Select different branches to explore
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
          </div>
        </div>

      </div>

    </div>
  );
}
