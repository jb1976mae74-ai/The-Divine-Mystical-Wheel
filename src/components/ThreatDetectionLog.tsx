import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  EMTTSAlert,
  SourceClassification,
  ThreatLevel,
  DetectionLayer,
  ASFFUOperative,
  ThreatTarget
} from '../types/military';
import {
  INITIAL_EMTTS_ALERTS,
  generateRandomEMTTSAlert
} from '../data/militaryData';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Activity,
  Brain,
  Flame,
  Volume2,
  VolumeX,
  Crosshair,
  Sparkles,
  Zap,
  Search,
  Filter,
  Download,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Eye,
  Crown,
  Rocket,
  Compass,
  FileText
} from 'lucide-react';

interface ThreatDetectionLogProps {
  alerts?: EMTTSAlert[];
  onQuickEngage?: (target: ThreatTarget) => void;
  onDispatchOperative?: (operativeId: string) => void;
  onFireLayerMunition?: (layerId: string) => void;
  activeOperatives?: ASFFUOperative[];
  soundEnabled?: boolean;
}

// Helper to guarantee unique alert IDs even across storage reloads or concurrent streams
const sanitizeAndDeduplicateAlerts = (list: EMTTSAlert[]): EMTTSAlert[] => {
  const seenIds = new Set<string>();
  return list.map((item, index) => {
    let id = item.id;
    if (!id || seenIds.has(id)) {
      id = `${id || 'emtts-alert'}-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`;
    }
    seenIds.add(id);
    return { ...item, id };
  });
};

export const ThreatDetectionLog: React.FC<ThreatDetectionLogProps> = ({
  alerts: initialAlertsProp,
  onQuickEngage,
  onDispatchOperative,
  onFireLayerMunition,
  activeOperatives = [],
  soundEnabled = true
}) => {
  // Main Alerts state (persisted or local state with initial presets)
  const [alerts, setAlerts] = useState<EMTTSAlert[]>(() => {
    try {
      const saved = localStorage.getItem('kingdom_emtts_threat_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeAndDeduplicateAlerts(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed loading cached EMTTS alerts:', e);
    }
    return sanitizeAndDeduplicateAlerts(initialAlertsProp || INITIAL_EMTTS_ALERTS);
  });

  // Streaming & Simulation state
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [streamIntervalMs, setStreamIntervalMs] = useState<number>(6000);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [classificationFilter, setClassificationFilter] = useState<'ALL' | SourceClassification>('ALL');
  const [layerFilter, setLayerFilter] = useState<'ALL' | DetectionLayer>('ALL');
  const [threatLevelFilter, setThreatLevelFilter] = useState<'ALL' | ThreatLevel>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  // Persist alerts to localStorage
  const persistAlerts = (newAlerts: EMTTSAlert[]) => {
    const sanitized = sanitizeAndDeduplicateAlerts(newAlerts);
    setAlerts(sanitized);
    try {
      localStorage.setItem('kingdom_emtts_threat_logs', JSON.stringify(sanitized.slice(0, 100)));
    } catch (e) {
      console.warn('Failed storing EMTTS alerts:', e);
    }
  };

  // Real-time automatic telemetry sweep stream
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const newAlert = generateRandomEMTTSAlert();
      setAlerts(prev => {
        const updated = sanitizeAndDeduplicateAlerts([newAlert, ...prev.slice(0, 149)]);
        try {
          localStorage.setItem('kingdom_emtts_threat_logs', JSON.stringify(updated.slice(0, 80)));
        } catch (e) {}
        return updated;
      });
    }, streamIntervalMs);

    return () => clearInterval(interval);
  }, [isLiveStreaming, streamIntervalMs]);

  // Toggle single alert expansion
  const toggleExpand = (id: string) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Manual EMTTS probe scan trigger
  const handleTriggerProbeScan = () => {
    setIsProbing(true);
    setTimeout(() => {
      const probeAlert = generateRandomEMTTSAlert();
      probeAlert.sourceName = `[PROBE SCAN] ${probeAlert.sourceName}`;
      const updated = sanitizeAndDeduplicateAlerts([probeAlert, ...alerts]);
      persistAlerts(updated);
      setSelectedAlertId(probeAlert.id);
      setIsProbing(false);
    }, 600);
  };

  // Copy raw telemetry
  const handleCopyAlert = async (alert: EMTTSAlert) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(alert, null, 2));
      setCopiedId(alert.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.warn('Failed copying telemetry JSON:', e);
    }
  };

  // Clear / Purge Logs
  const handleClearLogs = () => {
    persistAlerts([]);
  };

  // Reset to Presets
  const handleResetPresets = () => {
    persistAlerts(INITIAL_EMTTS_ALERTS);
  };

  // Export logs as JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredAlerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `emtts_threat_detection_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export logs as formatted TXT file
  const handleExportTXT = () => {
    let content = `================================================================================\n`;
    content += `       KINGDOM MILITARY BASE - EMTTS THREAT DETECTION LOG ARCHIVE        \n`;
    content += `       TRI-FOLD DEFENSE ARMAMENT SYSTEM (TFDAS) & ASFFU SQUADRON         \n`;
    content += `       Generated At: ${new Date().toISOString()} (${new Date().toTimeString()})    \n`;
    content += `================================================================================\n\n`;

    filteredAlerts.forEach((a, i) => {
      content += `[LOG #${i + 1}] ID: ${a.id} | TIMESTAMP: ${a.timestamp}\n`;
      content += `SOURCE: ${a.sourceName}\n`;
      content += `CLASSIFICATION: ${a.sourceClassification.toUpperCase()} | THREAT LEVEL: ${a.threatLevel}\n`;
      content += `SENSOR LAYER: ${a.sensorLayer} | COORD: Dist ${a.locationCoordinates.distanceKm}km, Az ${a.locationCoordinates.azimuthDeg}°, Alt ${a.locationCoordinates.altitudeM}m\n`;
      content += `METRICS -> Voice Malice: ${a.metrics.voiceMaliceScore}% | Thought Malice: ${a.metrics.thoughtMaliceScore}% | Corrupt Essence: ${a.metrics.corruptEssenceScore}% | Purity: ${a.metrics.purityIndex}% | Decibels: ${a.metrics.acousticDecibels} dB\n`;
      if (a.telemetrySnippet.interceptedChatter) content += `CHATTER: ${a.telemetrySnippet.interceptedChatter}\n`;
      if (a.telemetrySnippet.interceptedCognition) content += `THOUGHT: ${a.telemetrySnippet.interceptedCognition}\n`;
      if (a.telemetrySnippet.essenceSignature) content += `ESSENCE: ${a.telemetrySnippet.essenceSignature}\n`;
      content += `RECOMMENDED: ${a.recommendedAction}\n`;
      content += `STATUS: ${a.status}\n`;
      content += `--------------------------------------------------------------------------------\n\n`;
    });

    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `emtts_threat_detection_log_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Convert Alert to ThreatTarget for quick engagement
  const handleEngageFromAlert = (alert: EMTTSAlert) => {
    if (onQuickEngage) {
      const target: ThreatTarget = {
        id: `tgt-${alert.id}`,
        name: alert.sourceName,
        distanceKm: alert.locationCoordinates.distanceKm,
        azimuthDeg: alert.locationCoordinates.azimuthDeg,
        altitudeM: alert.locationCoordinates.altitudeM,
        velocityMach: alert.threatLevel === 'CRITICAL' ? 8.5 : alert.threatLevel === 'HIGH' ? 4.2 : 1.5,
        threatLevel: alert.threatLevel,
        type: alert.metrics.corruptEssenceScore > 80 ? 'Corrupt Essence Entity' : alert.metrics.thoughtMaliceScore > 80 ? 'Psycho-Weapon Swarm' : 'Incursion Fleet',
        voiceMaliceScore: alert.metrics.voiceMaliceScore,
        thoughtMaliceScore: alert.metrics.thoughtMaliceScore,
        corruptEssenceScore: alert.metrics.corruptEssenceScore,
        acousticDecibels: alert.metrics.acousticDecibels,
        detectedChatter: alert.telemetrySnippet.interceptedChatter,
        interceptedThought: alert.telemetrySnippet.interceptedCognition,
        essenceMarker: alert.telemetrySnippet.essenceSignature,
        status: 'LOCKED',
        assignedSpecialistId: alert.assignedOperativeId,
        deployedMunition: alert.deployedMunition
      };
      onQuickEngage(target);
    }
    // Update local alert status
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'ENGAGED' } : a));
  };

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Classification filter
      if (classificationFilter !== 'ALL' && alert.sourceClassification !== classificationFilter) {
        return false;
      }
      // Layer filter
      if (layerFilter !== 'ALL' && alert.sensorLayer !== layerFilter) {
        return false;
      }
      // Threat level filter
      if (threatLevelFilter !== 'ALL' && alert.threatLevel !== threatLevelFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = alert.sourceName.toLowerCase().includes(q);
        const matchId = alert.id.toLowerCase().includes(q);
        const matchChatter = alert.telemetrySnippet.interceptedChatter?.toLowerCase().includes(q);
        const matchThought = alert.telemetrySnippet.interceptedCognition?.toLowerCase().includes(q);
        const matchEssence = alert.telemetrySnippet.essenceSignature?.toLowerCase().includes(q);
        const matchAction = alert.recommendedAction.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchChatter && !matchThought && !matchEssence && !matchAction) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.isoTime).getTime();
      const timeB = new Date(b.isoTime).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });
  }, [alerts, classificationFilter, layerFilter, threatLevelFilter, searchQuery, sortOrder]);

  // Summary counts
  const counts = useMemo(() => {
    return {
      total: alerts.length,
      hostile: alerts.filter(a => a.sourceClassification === 'Hostile').length,
      chosen: alerts.filter(a => a.sourceClassification === 'Chosen').length,
      neutral: alerts.filter(a => a.sourceClassification === 'Neutral').length,
      critical: alerts.filter(a => a.threatLevel === 'CRITICAL' || a.threatLevel === 'OMEGA').length
    };
  }, [alerts]);

  return (
    <div className="w-full bg-[#070c14]/95 border border-red-500/30 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-6 text-slate-200">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-red-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-serif tracking-wide text-red-200 flex items-center gap-2">
                <span>EMTTS THREAT DETECTION LOG</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 border border-red-500/40 text-red-300 animate-pulse">
                REAL-TIME STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Essence, Malice, Thought & Telemetry Sensor Array • Multi-Layer Real-Time Intercept Logs
            </p>
          </div>
        </div>

        {/* Live Stream & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Streaming Toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-black/60 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle continuous real-time EMTTS telemetry sweep feed"
          >
            {isLiveStreaming ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Pause className="w-3.5 h-3.5" />
                <span>Live Feed: ACTIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Feed: PAUSED</span>
              </>
            )}
          </button>

          {/* Trigger Manual Probe Scan */}
          <button
            onClick={handleTriggerProbeScan}
            disabled={isProbing}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-950/40"
            title="Deploy high-frequency EMTTS radar probe to scan entire 2,500km perimeter"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin text-cyan-300' : 'text-cyan-400'}`} />
            <span>{isProbing ? 'Probing...' : 'Probe Scan'}</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <button
            onClick={handleExportJSON}
            className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
            title="Export filtered log in JSON format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={handleExportTXT}
            className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
            title="Export formatted readable log text archive"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>TXT</span>
          </button>

          {/* Clear Logs */}
          <button
            onClick={handleClearLogs}
            className="p-1.5 rounded-xl bg-black/40 border border-white/10 hover:border-red-500/40 text-slate-500 hover:text-red-400 text-xs transition-all cursor-pointer"
            title="Clear all alerts from active memory"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* EMTTS Telemetry & Source Classification Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Hostile Card */}
        <div
          onClick={() => setClassificationFilter(classificationFilter === 'Hostile' ? 'ALL' : 'Hostile')}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
            classificationFilter === 'Hostile'
              ? 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : 'bg-red-950/30 border-red-500/30 text-red-300 hover:bg-red-950/50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Hostile Threats</span>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-500/20 text-red-300">
              {counts.critical} CRIT
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-red-100">{counts.hostile}</div>
          <span className="text-[10px] text-red-400/80 font-mono">Malice spikes & corrupt essence</span>
        </div>

        {/* Chosen / Holy Card */}
        <div
          onClick={() => setClassificationFilter(classificationFilter === 'Chosen' ? 'ALL' : 'Chosen')}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
            classificationFilter === 'Chosen'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1 font-bold">
              <Crown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chosen Sources</span>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              100% PURITY
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-100">{counts.chosen}</div>
          <span className="text-[10px] text-emerald-400/80 font-mono">Angelic, holy convoys & scouts</span>
        </div>

        {/* Neutral Card */}
        <div
          onClick={() => setClassificationFilter(classificationFilter === 'Neutral' ? 'ALL' : 'Neutral')}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
            classificationFilter === 'Neutral'
              ? 'bg-slate-900 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900/60 border-white/15 text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1 font-bold">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Neutral Vectors</span>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
              PASSIVE
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{counts.neutral}</div>
          <span className="text-[10px] text-slate-400 font-mono">Civilian cargo, probes & seismic</span>
        </div>

        {/* Total Sensor Logs Card */}
        <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-amber-400">
            <span className="flex items-center gap-1 font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>EMTTS Array</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400">4-LAYER SCAN</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-200">{counts.total}</div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Sweep: {(streamIntervalMs / 1000).toFixed(1)}s</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-xl p-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by source, keyword, chatter, thoughts, coordinates..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-black/60 border border-white/10 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Classification Filter Select */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="text-slate-500 hidden sm:inline">Source:</span>
            {(['ALL', 'Chosen', 'Neutral', 'Hostile'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setClassificationFilter(cls)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                  classificationFilter === cls
                    ? cls === 'Hostile'
                      ? 'bg-red-600 border-red-400 text-white shadow-sm'
                      : cls === 'Chosen'
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                      : cls === 'Neutral'
                      ? 'bg-cyan-700 border-cyan-400 text-white shadow-sm'
                      : 'bg-amber-600 border-amber-400 text-white shadow-sm'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cls === 'ALL' ? 'All Sources' : cls}
              </button>
            ))}
          </div>

          {/* Sensor Layer Dropdown */}
          <select
            value={layerFilter}
            onChange={(e) => setLayerFilter(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300 focus:border-amber-500/50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All EMTTS Layers</option>
            <option value="VOICE_MALICE">Layer 1: Voice Malice</option>
            <option value="THOUGHT_MALICE">Layer 2: Thought Malice</option>
            <option value="CORRUPT_ESSENCE">Layer 3: Corrupt Essence</option>
            <option value="RADAR">Radar Telemetry</option>
            <option value="NOISE">Noise & Acoustic</option>
          </select>

          {/* Threat Level Filter Dropdown */}
          <select
            value={threatLevelFilter}
            onChange={(e) => setThreatLevelFilter(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300 focus:border-amber-500/50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="CRITICAL">Critical / Omega</option>
            <option value="HIGH">High Threat</option>
            <option value="ELEVATED">Elevated Threat</option>
            <option value="GUARDED">Guarded</option>
            <option value="LOW">Low / Sanctified</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
            className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-amber-500/30 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
            title="Toggle chronological sorting"
          >
            <span>{sortOrder === 'NEWEST' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(classificationFilter !== 'ALL' || layerFilter !== 'ALL' || threatLevelFilter !== 'ALL' || searchQuery) && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-amber-950/20 border border-amber-500/20 rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-amber-400 font-bold">Filtered Results:</span>
            <span>Showing {filteredAlerts.length} of {alerts.length} alerts</span>
            {classificationFilter !== 'ALL' && (
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-amber-200">
                Classification: {classificationFilter}
              </span>
            )}
            {layerFilter !== 'ALL' && (
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-amber-200">
                Layer: {layerFilter}
              </span>
            )}
            {threatLevelFilter !== 'ALL' && (
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-amber-200">
                Level: {threatLevelFilter}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setClassificationFilter('ALL');
              setLayerFilter('ALL');
              setThreatLevelFilter('ALL');
              setSearchQuery('');
            }}
            className="text-amber-400 hover:text-amber-300 underline text-[11px] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Chronological Alert Feed List */}
      <div className="flex flex-col gap-3 max-h-[620px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 rounded-xl bg-black/40 border border-white/5 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
            <Activity className="w-8 h-8 text-slate-600 animate-pulse" />
            <p className="font-mono text-sm font-bold text-slate-300">No EMTTS Detection Alerts Match Filter</p>
            <p className="text-xs text-slate-500">Adjust your filter parameters or trigger a manual probe scan above.</p>
            <button
              onClick={handleResetPresets}
              className="mt-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-900/40 cursor-pointer"
            >
              Reload Preset Logs
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => {
            const isExpanded = !!expandedAlerts[alert.id];
            const isSelected = selectedAlertId === alert.id;
            const isHostile = alert.sourceClassification === 'Hostile';
            const isChosen = alert.sourceClassification === 'Chosen';
            const isNeutral = alert.sourceClassification === 'Neutral';

            return (
              <motion.div
                key={`${alert.id}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`rounded-xl border transition-all overflow-hidden flex flex-col ${
                  isHostile
                    ? alert.threatLevel === 'CRITICAL' || alert.threatLevel === 'OMEGA'
                      ? 'bg-red-950/40 border-red-500/70 hover:border-red-400 shadow-md shadow-red-950/40'
                      : 'bg-red-950/20 border-red-500/40 hover:border-red-400/70'
                    : isChosen
                    ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400/70 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-900/50 border-cyan-500/25 hover:border-cyan-400/50'
                } ${isSelected ? 'ring-2 ring-amber-400/60' : ''}`}
              >
                {/* Alert Item Header Row */}
                <div
                  onClick={() => toggleExpand(alert.id)}
                  className="p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  {/* Left: Classification Badge, Name, Timestamp */}
                  <div className="flex items-start md:items-center gap-3">
                    {/* Source Classification Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 ${
                        isHostile
                          ? 'bg-red-600/30 border-red-500 text-red-200 animate-pulse'
                          : isChosen
                          ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                          : 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                      }`}
                    >
                      {isHostile && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                      {isChosen && <Crown className="w-3.5 h-3.5 text-emerald-400" />}
                      {isNeutral && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{alert.sourceClassification.toUpperCase()}</span>
                    </div>

                    {/* Source Name & Threat Level */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold font-serif text-sm text-slate-100">{alert.sourceName}</span>
                        {/* Threat Level Badge */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                            alert.threatLevel === 'CRITICAL' || alert.threatLevel === 'OMEGA'
                              ? 'bg-red-500 text-white animate-bounce'
                              : alert.threatLevel === 'HIGH'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                              : alert.threatLevel === 'ELEVATED'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {alert.threatLevel}
                        </span>
                        {/* Sensor Layer Tag */}
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/10 text-slate-400 border border-white/10">
                          {alert.sensorLayer.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span className="text-amber-400/90 font-semibold">{alert.timestamp}</span>
                        <span>•</span>
                        <span>Dist: {alert.locationCoordinates.distanceKm} km</span>
                        <span>•</span>
                        <span>Bearing: {alert.locationCoordinates.azimuthDeg}°</span>
                        <span>•</span>
                        <span>Alt: {alert.locationCoordinates.altitudeM} m</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Metrics & Expand Toggle */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    {/* Sensor Metric Mini Bars */}
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      {isHostile && (
                        <div className="flex flex-col items-end">
                          <span className="text-red-300 font-bold">Malice: {alert.metrics.thoughtMaliceScore}%</span>
                          <span className="text-orange-400 text-[9px]">Corruption: {alert.metrics.corruptEssenceScore}%</span>
                        </div>
                      )}
                      {isChosen && (
                        <div className="flex flex-col items-end">
                          <span className="text-emerald-300 font-bold">Purity: {alert.metrics.purityIndex}%</span>
                          <span className="text-emerald-400 text-[9px]">Aura: Sanctified</span>
                        </div>
                      )}
                      {isNeutral && (
                        <div className="flex flex-col items-end">
                          <span className="text-cyan-300 font-bold">Passive Matrix</span>
                          <span className="text-slate-400 text-[9px]">{alert.metrics.acousticDecibels} dB</span>
                        </div>
                      )}
                    </div>

                    {/* Expand Chevron */}
                    <button
                      type="button"
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Telemetry Breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10 bg-black/60 p-4 flex flex-col gap-4 text-xs font-mono"
                    >
                      {/* 4 Sensor Telemetry Breakdown Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-black/40 p-3 rounded-xl border border-white/10">
                        {/* Voice Malice */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Volume2 className="w-3 h-3 text-red-400" />
                              <span>Voice Malice</span>
                            </span>
                            <span className="font-bold text-red-300">{alert.metrics.voiceMaliceScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-500"
                              style={{ width: `${alert.metrics.voiceMaliceScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Thought Malice */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Brain className="w-3 h-3 text-purple-400" />
                              <span>Thought Malice</span>
                            </span>
                            <span className="font-bold text-purple-300">{alert.metrics.thoughtMaliceScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                              style={{ width: `${alert.metrics.thoughtMaliceScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Corrupt Essence */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-400" />
                              <span>Corrupt Essence</span>
                            </span>
                            <span className="font-bold text-orange-300">{alert.metrics.corruptEssenceScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-500"
                              style={{ width: `${alert.metrics.corruptEssenceScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Purity Index / Acoustic */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>Holy Purity / dB</span>
                            </span>
                            <span className="font-bold text-emerald-300">
                              {alert.metrics.purityIndex}% ({alert.metrics.acousticDecibels}dB)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                              style={{ width: `${alert.metrics.purityIndex}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Intercepted Snippets (Voice Chatter / Telepathic Thoughts / Essence Signature) */}
                      <div className="flex flex-col gap-2">
                        {alert.telemetrySnippet.interceptedChatter && (
                          <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 flex items-center gap-1">
                              <Volume2 className="w-3 h-3" />
                              <span>Intercepted Spoken Chatter (War Declaration / Voice Sensor)</span>
                            </span>
                            <p className="text-slate-200 italic font-serif text-[11px] leading-relaxed">
                              {alert.telemetrySnippet.interceptedChatter}
                            </p>
                          </div>
                        )}

                        {alert.telemetrySnippet.interceptedCognition && (
                          <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              <span>Intercepted Cognition Stream (Gamma Band Thought Sensor)</span>
                            </span>
                            <p className="text-purple-200 font-mono text-[11px] leading-relaxed">
                              {alert.telemetrySnippet.interceptedCognition}
                            </p>
                          </div>
                        )}

                        {alert.telemetrySnippet.essenceSignature && (
                          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              <span>Corrupt Essence Spectrometry (Astral Aura Marker)</span>
                            </span>
                            <p className="text-amber-200 font-mono text-[11px] leading-relaxed">
                              {alert.telemetrySnippet.essenceSignature}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Automated TFDAS Recommendation & Operational Dispatch Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">
                            Recommended Protocol & Munition:
                          </span>
                          <p className="text-xs text-amber-300 font-semibold">{alert.recommendedAction}</p>
                          {alert.assignedOperativeName && (
                            <span className="text-[11px] text-cyan-300 flex items-center gap-1 mt-0.5">
                              <Crown className="w-3 h-3 text-amber-400" />
                              <span>Assigned ASFFU Operative: {alert.assignedOperativeName}</span>
                            </span>
                          )}
                        </div>

                        {/* Interactive Engagement Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                          {/* Copy JSON */}
                          <button
                            onClick={() => handleCopyAlert(alert)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
                            title="Copy full JSON alert payload"
                          >
                            {copiedId === alert.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy JSON</span>
                              </>
                            )}
                          </button>

                          {/* Quick Engage (for Hostile alerts) */}
                          {isHostile && onQuickEngage && (
                            <button
                              onClick={() => handleEngageFromAlert(alert)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 border border-red-400 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-red-950/50 cursor-pointer transition-all"
                              title="Lock target, launch TFDAS munition & dispatch assigned ASFFU Ace Specialist"
                            >
                              <Rocket className="w-3.5 h-3.5 animate-bounce" />
                              <span>Interdict & Strike</span>
                            </button>
                          )}

                          {/* Manifest Assigned Operative */}
                          {alert.assignedOperativeId && onDispatchOperative && (
                            <button
                              onClick={() => onDispatchOperative(alert.assignedOperativeId!)}
                              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 border border-amber-400 text-black font-bold text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
                              title="Instant manifest assigned operative in 0.001s"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Manifest Specialist</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>EMTTS Multi-Layer Array Active</span>
          <span>•</span>
          <span>Buffer: {alerts.length}/150 Alerts Logged</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Tri-Fold Defense Armament System (TFDAS) Synced</span>
          <span>•</span>
          <span className="text-amber-400">Ace Special Force Fighting Unit (ASFFU) On High Alert</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetectionLog;
