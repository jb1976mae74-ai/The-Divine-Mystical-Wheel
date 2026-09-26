import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Orbit, ZoomIn, ZoomOut, RotateCcw, Maximize2, 
  Search, Filter, Sparkles, Crown, Layers, Compass, 
  Eye, Volume2, VolumeX, Copy, Check, Plus, Trash2,
  ChevronRight, Download, Share2, Info, BookOpen, Scale,
  Sliders, Shield, Zap, Flame, Star, Scroll
} from 'lucide-react';
import { GrandDesignNode, GRAND_DESIGN_TREE_DATA } from '../data/grandDesignHierarchyData';
import GrandDesignNodeInspector from './GrandDesignNodeInspector';

interface GrandDesignHierarchyTreeProps {
  activeTheme?: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    accentGradient: string;
    borderAccent: string;
    borderAccentSemi: string;
    starStroke: string;
    accentGlow: string;
    bgCard: string;
  };
  onNavigateToSection?: (section: string) => void;
}

// Helper to color nodes by category
const CATEGORY_CONFIG: Record<string, { color: string; border: string; bg: string; label: string }> = {
  root: { color: '#f59e0b', border: '#d97706', bg: '#451a03', label: 'Prime Sovereign Root' },
  celestial: { color: '#fbbf24', border: '#f59e0b', bg: '#291800', label: 'Celestial & Logos' },
  astral: { color: '#c084fc', border: '#9333ea', bg: '#2e1065', label: 'Astral & Zodiac' },
  telluric: { color: '#34d399', border: '#059669', bg: '#064e3b', label: 'Telluric & Physical' },
  scholarship: { color: '#38bdf8', border: '#0284c7', bg: '#0c4a6e', label: 'Scriptural Archives' },
  geometry: { color: '#f472b6', border: '#db2777', bg: '#500724', label: 'Sacred Geometry' },
  constant: { color: '#6ee7b7', border: '#10b981', bg: '#022c22', label: 'Universal Constant' },
  station: { color: '#f87171', border: '#dc2626', bg: '#450a0a', label: 'Stewardship Station' },
  element: { color: '#fb923c', border: '#ea580c', bg: '#431407', label: 'Elemental Energy' },
  zodiac: { color: '#e879f9', border: '#c026d3', bg: '#3b0764', label: 'Zodiac Archetype' },
  decree: { color: '#fcd34d', border: '#d97706', bg: '#331e05', label: 'Divine Decree' },
  scroll: { color: '#7dd3fc', border: '#0ea5e9', bg: '#07273c', label: 'Ancient Manuscript' },
};

export default function GrandDesignHierarchyTree({ activeTheme, onNavigateToSection }: GrandDesignHierarchyTreeProps) {
  // Layout and view state
  const [layoutMode, setLayoutMode] = useState<'radial' | 'horizontal'>('radial');
  const [treeData, setTreeData] = useState<GrandDesignNode>(() => {
    try {
      const saved = localStorage.getItem('grand-design-custom-tree');
      return saved ? JSON.parse(saved) : GRAND_DESIGN_TREE_DATA;
    } catch {
      return GRAND_DESIGN_TREE_DATA;
    }
  });

  const [selectedNode, setSelectedNode] = useState<GrandDesignNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Node Form state
  const [newNodeParentId, setNewNodeParentId] = useState<string>('root-grand-design');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeHebrew, setNewNodeHebrew] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState<GrandDesignNode['category']>('celestial');
  const [newNodeGematria, setNewNodeGematria] = useState('');
  const [newNodeDescription, setNewNodeDescription] = useState('');

  // Refs for SVG and D3 Zoom container
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Inscribed to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const speakNodeDetails = (node: GrandDesignNode) => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${node.name}. Hebrew title: ${node.hebrew}. Category: ${node.category}. ${node.description}. Gematria and numerical value: ${node.gematriaOrValue || 'None'}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Speech synthesis not supported on this device.');
    }
  };

  // Build searchable node list for parent selector
  const allNodesList = useMemo(() => {
    const list: Array<{ id: string; name: string; hebrew: string; category: string }> = [];
    const traverse = (node: GrandDesignNode) => {
      list.push({ id: node.id, name: node.name, hebrew: node.hebrew, category: node.category });
      if (node.children) node.children.forEach(traverse);
      if (node._children) node._children.forEach(traverse);
    };
    traverse(treeData);
    return list;
  }, [treeData]);

  // Handle adding custom node
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) {
      showToast('Please provide a name for the entity.');
      return;
    }

    const newNode: GrandDesignNode = {
      id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: newNodeName.trim(),
      hebrew: newNodeHebrew.trim() || 'חָכְמָה עִלָּאָה',
      category: newNodeCategory,
      level: 3,
      gematriaOrValue: newNodeGematria.trim() || 'Harmonic 76 Lock',
      description: newNodeDescription.trim() || 'Custom revelation anchored into the Grand Design architecture.',
      realmDirective: 'Dynamic Inscription by Seekers of the Divine Order'
    };

    const cloneData = JSON.parse(JSON.stringify(treeData)) as GrandDesignNode;
    let added = false;

    const findAndAppend = (node: GrandDesignNode): boolean => {
      if (node.id === newNodeParentId) {
        if (!node.children) node.children = [];
        node.children.push(newNode);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findAndAppend(child)) return true;
        }
      }
      if (node._children) {
        for (const child of node._children) {
          if (findAndAppend(child)) return true;
        }
      }
      return false;
    };

    added = findAndAppend(cloneData);
    if (!added) {
      if (!cloneData.children) cloneData.children = [];
      cloneData.children.push(newNode);
    }

    setTreeData(cloneData);
    try {
      localStorage.setItem('grand-design-custom-tree', JSON.stringify(cloneData));
    } catch (err) {
      console.warn('Failed saving custom tree to localStorage:', err);
    }

    setSelectedNode(newNode);
    setShowAddModal(false);
    setNewNodeName('');
    setNewNodeHebrew('');
    setNewNodeGematria('');
    setNewNodeDescription('');
    showToast(`Entity "${newNode.name}" successfully anchored to the Grand Design!`);
  };

  const resetToCanonicalTree = () => {
    setTreeData(GRAND_DESIGN_TREE_DATA);
    try {
      localStorage.removeItem('grand-design-custom-tree');
    } catch {}
    showToast('Reset to Canonical Grand Design hierarchy.');
  };

  // Zoom Controls
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.scaleBy, 0.75);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const width = svgRef.current.clientWidth || 900;
      const height = svgRef.current.clientHeight || 700;
      const initialTransform = layoutMode === 'radial'
        ? d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85)
        : d3.zoomIdentity.translate(80, height / 2).scale(0.85);

      d3.select(svgRef.current).transition().duration(600).call(zoomBehaviorRef.current.transform, initialTransform);
    }
  };

  // Expand / Collapse all helper
  const setGlobalExpansion = (expand: boolean) => {
    const cloneData = JSON.parse(JSON.stringify(treeData)) as GrandDesignNode;
    const toggle = (n: GrandDesignNode) => {
      if (expand) {
        if (n._children && n._children.length > 0) {
          n.children = n._children;
          n._children = undefined;
        }
      } else {
        if (n.level > 1 && n.children && n.children.length > 0) {
          n._children = n.children;
          n.children = undefined;
        }
      }
      if (n.children) n.children.forEach(toggle);
      if (n._children) n._children.forEach(toggle);
    };
    toggle(cloneData);
    setTreeData(cloneData);
    showToast(expand ? 'All celestial & earthly branches expanded!' : 'Collapsed to Prime Realms.');
  };

  // D3 Render Effect
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const containerWidth = svgRef.current.clientWidth || 960;
    const containerHeight = svgRef.current.clientHeight || 720;

    svg.selectAll('*').remove();

    // Defs for glowing gradients and filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Linear and Radial Gradients for Links
    const linkGradient = defs.append('linearGradient')
      .attr('id', 'goldLinkGradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    linkGradient.append('stop').attr('offset', '0%').attr('stop-color', '#d4af37').attr('stop-opacity', 0.8);
    linkGradient.append('stop').attr('offset', '100%').attr('stop-color', '#a855f7').attr('stop-opacity', 0.4);

    // Root Group for Zoom
    const g = svg.append('g').attr('class', 'main-d3-canvas');
    gRef.current = g.node();

    // Setup Zoom Behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoomBehavior;
    svg.call(zoomBehavior);

    // Initial positioning
    const initialTransform = layoutMode === 'radial'
      ? d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(0.85)
      : d3.zoomIdentity.translate(100, containerHeight / 2).scale(0.85);

    svg.call(zoomBehavior.transform, initialTransform);

    // Build Hierarchy
    const root = d3.hierarchy<GrandDesignNode>(treeData, (d) => d.children);

    // Filter highlight matches
    const searchLower = searchQuery.toLowerCase().trim();
    const isSearchActive = searchLower.length > 0;

    // Check if node or its descendants match search
    const matchesSearch = (d: d3.HierarchyNode<GrandDesignNode>): boolean => {
      if (!isSearchActive) return true;
      const n = d.data;
      return (
        n.name.toLowerCase().includes(searchLower) ||
        n.hebrew.toLowerCase().includes(searchLower) ||
        n.category.toLowerCase().includes(searchLower) ||
        (n.gematriaOrValue && n.gematriaOrValue.toLowerCase().includes(searchLower)) ||
        n.description.toLowerCase().includes(searchLower)
      );
    };

    if (layoutMode === 'radial') {
      // ----------------------------------------------------
      // RADIAL MANDALA TREE LAYOUT
      // ----------------------------------------------------
      const radius = Math.min(containerWidth, containerHeight) * 0.95;
      const treeLayout = d3.tree<GrandDesignNode>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.8) / a.depth);

      treeLayout(root);

      // Background Radial Concentric Rings representing Celestial Spheres
      const ringRadii = [radius * 0.28, radius * 0.55, radius * 0.85];
      const ringGroup = g.append('g').attr('class', 'celestial-rings');

      ringRadii.forEach((r, i) => {
        ringGroup.append('circle')
          .attr('r', r)
          .attr('fill', 'none')
          .attr('stroke', '#d4af37')
          .attr('stroke-width', 0.8)
          .attr('stroke-opacity', 0.15 - i * 0.03)
          .attr('stroke-dasharray', i === 1 ? '4,4' : '2,6');
      });

      // Radial Links Generator
      const radialLink = d3.linkRadial<any, d3.HierarchyPointNode<GrandDesignNode>>()
        .angle((d) => d.x)
        .radius((d) => d.y);

      // Draw Links
      g.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(root.links())
        .enter()
        .append('path')
        .attr('d', radialLink as any)
        .attr('fill', 'none')
        .attr('stroke', (d) => {
          const targetCat = d.target.data.category;
          const conf = CATEGORY_CONFIG[targetCat] || CATEGORY_CONFIG.celestial;
          return conf.border;
        })
        .attr('stroke-opacity', (d) => (matchesSearch(d.target) ? 0.6 : 0.15))
        .attr('stroke-width', (d) => Math.max(1, 3 - d.target.depth * 0.6))
        .attr('stroke-dasharray', (d) => (d.target.depth > 2 ? '3,3' : 'none'));

      // Draw Nodes
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node-group cursor-pointer')
        .attr('transform', (d: any) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`)
        .on('click', (event, d) => {
          event.stopPropagation();
          setSelectedNode(d.data);
        });

      // Node Outer Halo / Aura for Search & Selected
      node.append('circle')
        .attr('r', (d) => (d.depth === 0 ? 26 : Math.max(8, 20 - d.depth * 3)))
        .attr('fill', (d) => {
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.bg;
        })
        .attr('stroke', (d) => {
          const isSelected = selectedNode?.id === d.data.id;
          if (isSelected) return '#ffffff';
          if (isSearchActive && matchesSearch(d)) return '#fbbf24';
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.border;
        })
        .attr('stroke-width', (d) => (selectedNode?.id === d.data.id ? 3 : isSearchActive && matchesSearch(d) ? 2.5 : 1.5))
        .attr('filter', (d) => (d.depth <= 1 || selectedNode?.id === d.data.id ? 'url(#glow)' : 'none'));

      // Node Center Dot
      node.append('circle')
        .attr('r', (d) => (d.depth === 0 ? 6 : Math.max(3, 7 - d.depth * 1.2)))
        .attr('fill', (d) => {
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.color;
        });

      // Node Labels (Text)
      node.append('text')
        .attr('dy', '0.31em')
        .attr('x', (d: any) => (d.x < Math.PI ? (d.depth === 0 ? 0 : 16) : (d.depth === 0 ? 0 : -16)))
        .attr('text-anchor', (d: any) => (d.depth === 0 ? 'middle' : d.x < Math.PI ? 'start' : 'end'))
        .attr('transform', (d: any) => (d.depth === 0 ? 'none' : d.x >= Math.PI ? 'rotate(180)' : null))
        .text((d) => d.data.name)
        .attr('font-size', (d) => (d.depth === 0 ? '12px' : d.depth === 1 ? '11px' : '9.5px'))
        .attr('font-family', 'ui-serif, Georgia, serif')
        .attr('font-weight', (d) => (d.depth <= 1 ? 'bold' : 'normal'))
        .attr('fill', (d) => {
          if (selectedNode?.id === d.data.id) return '#ffffff';
          if (isSearchActive && matchesSearch(d)) return '#fef08a';
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.color;
        })
        .attr('opacity', (d) => (isSearchActive ? (matchesSearch(d) ? 1 : 0.25) : 0.9))
        .style('pointer-events', 'none')
        .style('user-select', 'none');

    } else {
      // ----------------------------------------------------
      // HORIZONTAL DENDROGRAM / FLOWCHART LAYOUT
      // ----------------------------------------------------
      const treeLayout = d3.tree<GrandDesignNode>()
        .nodeSize([38, 220]);

      treeLayout(root);

      // Horizontal Links Generator
      const horizontalLink = d3.linkHorizontal<any, d3.HierarchyPointNode<GrandDesignNode>>()
        .x((d) => d.y)
        .y((d) => d.x);

      // Draw Links
      g.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(root.links())
        .enter()
        .append('path')
        .attr('d', horizontalLink as any)
        .attr('fill', 'none')
        .attr('stroke', (d) => {
          const targetCat = d.target.data.category;
          const conf = CATEGORY_CONFIG[targetCat] || CATEGORY_CONFIG.celestial;
          return conf.border;
        })
        .attr('stroke-opacity', (d) => (matchesSearch(d.target) ? 0.65 : 0.2))
        .attr('stroke-width', (d) => Math.max(1, 3 - d.target.depth * 0.5));

      // Draw Nodes
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node-group cursor-pointer')
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`)
        .on('click', (event, d) => {
          event.stopPropagation();
          setSelectedNode(d.data);
        });

      // Node Capsule / Pill Background for readable text
      node.append('rect')
        .attr('x', -8)
        .attr('y', -12)
        .attr('width', (d) => Math.max(120, d.data.name.length * 7.5 + 24))
        .attr('height', 24)
        .attr('rx', 6)
        .attr('fill', (d) => {
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.bg;
        })
        .attr('stroke', (d) => {
          if (selectedNode?.id === d.data.id) return '#ffffff';
          if (isSearchActive && matchesSearch(d)) return '#fbbf24';
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.border;
        })
        .attr('stroke-width', (d) => (selectedNode?.id === d.data.id ? 2 : 1))
        .attr('opacity', 0.9);

      // Node Left Indicator Dot
      node.append('circle')
        .attr('cx', 2)
        .attr('cy', 0)
        .attr('r', 4)
        .attr('fill', (d) => {
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.color;
        });

      // Node Label Text
      node.append('text')
        .attr('x', 14)
        .attr('y', 4)
        .text((d) => d.data.name)
        .attr('font-size', '11px')
        .attr('font-family', 'ui-serif, Georgia, serif')
        .attr('font-weight', (d) => (d.depth <= 1 ? 'bold' : 'normal'))
        .attr('fill', (d) => {
          if (selectedNode?.id === d.data.id) return '#ffffff';
          if (isSearchActive && matchesSearch(d)) return '#fef08a';
          const conf = CATEGORY_CONFIG[d.data.category] || CATEGORY_CONFIG.celestial;
          return conf.color;
        })
        .style('pointer-events', 'none')
        .style('user-select', 'none');
    }

  }, [treeData, layoutMode, searchQuery, selectedNode]);

  // Export SVG as File
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `Grand_Design_Hierarchical_Tree_${layoutMode}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    showToast('Grand Design SVG hierarchy exported successfully!');
  };

  return (
    <div className="w-full flex flex-col gap-6 text-slate-200">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs font-serif shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Controls Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141218] via-[#0d0c11] to-[#08080c] border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-serif">
              <Network className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">מִבְנֶה הָעוֹלָמוֹת • The Grand Design Hierarchy</span>
              <span className="text-amber-500/60">•</span>
              <span>D3.js Dynamic Tree Visualization</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              Celestial & Earthly Forms Architecture
            </h2>
            <p className="text-xs font-serif text-slate-300 max-w-2xl">
              An interactive D3.js topological tree spanning the Absolute Prime Logos, the 12 Zodiacal Triplicities, 
              Archangelic ASFFU stations, fundamental physical constants, and scriptural Dead Sea Scroll codices.
            </p>
          </div>

          {/* Layout Mode Toggle & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-serif">
              <button
                onClick={() => setLayoutMode('radial')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  layoutMode === 'radial'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Circular Mandala / Celestial Wheel"
              >
                <Orbit className="w-3.5 h-3.5 text-amber-400" />
                <span>Radial Mandala</span>
              </button>
              <button
                onClick={() => setLayoutMode('horizontal')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  layoutMode === 'horizontal'
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Horizontal Hierarchical Flowchart"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Horizontal Flow</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/40 hover:to-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-serif font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Inscribe Entity</span>
            </button>

            <button
              onClick={handleExportSvg}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-200 text-xs cursor-pointer transition-all"
              title="Export High-Res SVG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter, Search & Tree Depth Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-serif">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, Hebrew, gematria, constants (e.g. 112, Michael, Taurus, 1QS)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500/50 focus:outline-none text-slate-200 placeholder-slate-500 font-serif"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Depth / Quick Expand Controls */}
          <div className="md:col-span-7 flex flex-wrap items-center justify-start md:justify-end gap-2">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Tree Navigation:</span>
            <button
              onClick={() => setGlobalExpansion(true)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-300 transition-all text-xs cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={() => setGlobalExpansion(false)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-300 transition-all text-xs cursor-pointer"
            >
              Collapse Deep
            </button>
            <button
              onClick={resetToCanonicalTree}
              className="px-2.5 py-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 text-red-300 transition-all text-xs cursor-pointer"
              title="Reset any custom changes"
            >
              Reset Canonical
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* D3 Canvas Container */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-amber-500/20 bg-[#060609] min-h-[620px] shadow-2xl flex flex-col">
          
          {/* Subtle Canvas Watermark & Coordinate Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Top-Right Canvas Quick-Tool Overlay */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-black/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-xl">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom-Left Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex flex-wrap gap-2 max-w-md bg-black/85 p-2.5 rounded-xl border border-white/10 backdrop-blur-md text-[10px] font-mono">
            <span className="text-slate-400 font-bold w-full uppercase tracking-wider text-[9px]">Domain Legend:</span>
            {Object.entries(CATEGORY_CONFIG).slice(0, 6).map(([catKey, conf]) => (
              <div key={catKey} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: conf.color }} />
                <span className="text-slate-300">{conf.label}</span>
              </div>
            ))}
          </div>

          {/* SVG Host */}
          <svg
            ref={svgRef}
            className="w-full h-[620px] select-none cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          />

          {/* Helper hint for seekers */}
          <div className="p-2.5 border-t border-white/5 bg-black/50 text-center text-[11px] font-serif text-slate-400">
            <span>Click any node in the tree to inspect its metaphysical attributes, gematria, and exegesis directives. Drag canvas to pan; scroll to zoom.</span>
          </div>
        </div>

        {/* Right Side: Selected Node Inspector & Knowledge Vault */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <GrandDesignNodeInspector
                key={selectedNode.id}
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                categoryConfig={CATEGORY_CONFIG}
                onNavigateToSection={onNavigateToSection}
              />
            ) : (
              <div className="p-6 rounded-2xl bg-[#101014] border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center">
                  <Compass className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <h4 className="font-serif font-bold text-sm text-amber-200">Select Any Node to Inspect</h4>
                <p className="text-xs font-serif text-slate-400 leading-relaxed">
                  Click on the central Prime Logos, any celestial archangel, zodiacal triplicity, or physical constant to generate its full AI exegesis, gematria breakdown, electrodynamic standing wave harmonics, and scriptural scrolls nexus.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedNode(treeData)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-serif transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspect Prime Logos (Root)</span>
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Quick Domain Navigation Hub */}
          <div className="p-4 rounded-2xl bg-[#101014] border border-amber-500/20 space-y-3">
            <h4 className="font-serif font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Sanctuary Portal Links</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-serif">
              <button
                onClick={() => onNavigateToSection && onNavigateToSection('seal')}
                className="p-2.5 rounded-xl bg-black/40 hover:bg-amber-950/30 border border-white/5 hover:border-amber-500/40 text-left text-slate-300 hover:text-amber-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Sacred Seal</span>
              </button>
              <button
                onClick={() => onNavigateToSection && onNavigateToSection('texts')}
                className="p-2.5 rounded-xl bg-black/40 hover:bg-purple-950/30 border border-white/5 hover:border-purple-500/40 text-left text-slate-300 hover:text-purple-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <Scroll className="w-3.5 h-3.5 text-purple-400" />
                <span>Sacred Texts</span>
              </button>
              <button
                onClick={() => onNavigateToSection && onNavigateToSection('decrees')}
                className="p-2.5 rounded-xl bg-black/40 hover:bg-amber-950/30 border border-white/5 hover:border-amber-500/40 text-left text-slate-300 hover:text-amber-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Decrees</span>
              </button>
              <button
                onClick={() => onNavigateToSection && onNavigateToSection('constants')}
                className="p-2.5 rounded-xl bg-black/40 hover:bg-emerald-950/30 border border-white/5 hover:border-emerald-500/40 text-left text-slate-300 hover:text-emerald-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Constants</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Entity Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-[#121118] border border-amber-500/40 shadow-2xl space-y-4 font-serif relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>

              <div className="space-y-1 border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Inscribe Custom Form / Entity</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Anchor a new celestial intelligence, physical constant, or scriptural parchment into the active Grand Design tree.
                </p>
              </div>

              <form onSubmit={handleAddNode} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Parent Hierarchy Anchor</label>
                  <select
                    value={newNodeParentId}
                    onChange={(e) => setNewNodeParentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 focus:border-amber-500/60 focus:outline-none"
                  >
                    {allNodesList.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Entity Name (English)</label>
                    <input
                      type="text"
                      value={newNodeName}
                      onChange={(e) => setNewNodeName(e.target.value)}
                      placeholder="e.g. Merkavah Gateway"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Hebrew Inscription</label>
                    <input
                      type="text"
                      value={newNodeHebrew}
                      onChange={(e) => setNewNodeHebrew(e.target.value)}
                      placeholder="e.g. שַׁעַר הַמֶּרְכָּבָה"
                      dir="rtl"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
                    <select
                      value={newNodeCategory}
                      onChange={(e) => setNewNodeCategory(e.target.value as GrandDesignNode['category'])}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 focus:border-amber-500/60 focus:outline-none"
                    >
                      <option value="celestial">Celestial & Logos</option>
                      <option value="astral">Astral & Planetary</option>
                      <option value="telluric">Telluric & Physical</option>
                      <option value="scholarship">Scriptural Manuscript</option>
                      <option value="geometry">Sacred Geometry</option>
                      <option value="constant">Universal Constant</option>
                      <option value="station">Stewardship Station</option>
                      <option value="element">Elemental Energy</option>
                      <option value="decree">Divine Decree</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Gematria / Value</label>
                    <input
                      type="text"
                      value={newNodeGematria}
                      onChange={(e) => setNewNodeGematria(e.target.value)}
                      placeholder="e.g. 76, 373, 112 in, SWR 1.1"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Esoteric Description</label>
                  <textarea
                    rows={3}
                    value={newNodeDescription}
                    onChange={(e) => setNewNodeDescription(e.target.value)}
                    placeholder="Describe the function, theological standing, or physical resonance of this entity..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 focus:border-amber-500/60 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold shadow-lg cursor-pointer transition-all"
                  >
                    Anchor to Grand Design
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
