import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MilitaryRadarGrid } from './MilitaryRadarGrid';
import { DetectionSensorSuite } from './DetectionSensorSuite';
import { ASFFUSquadron } from './ASFFUSquadron';
import { TFDASArmamentSystem } from './TFDASArmamentSystem';
import { ThreatInterdictionTerminal } from './ThreatInterdictionTerminal';
import { ThreatDetectionLog } from './ThreatDetectionLog';
import { ASFFUOperative, TFDASLayerStatus, ThreatTarget, InterdictionReport } from '../types/military';
import { INITIAL_ASFFU_SQUADRON, INITIAL_TFDAS_LAYERS, INITIAL_THREAT_TARGETS } from '../data/militaryData';
import { ShieldAlert, Crosshair, Radio, Crown, Volume2, VolumeX, Flame, Brain, Rocket, Activity, Zap, CheckCircle2, AlertTriangle, Shield, ListFilter, MapPin, LocateFixed, Globe, RefreshCw, Compass, Settings, Edit3, X, Sparkles } from 'lucide-react';

interface MilitaryBasePortalProps {
  activeTheme: {
    id: string;
    bgStyle?: string;
    cardStyle?: string;
    borderStyle?: string;
    accentColor?: string;
    textColor?: string;
  };
}

export const MilitaryBasePortal: React.FC<MilitaryBasePortalProps> = ({ activeTheme }) => {
  const [activeStation, setActiveStation] = useState<'RADAR' | 'THREAT_LOG' | 'SENSORS' | 'ASFFU' | 'TFDAS' | 'INTERDICTION'>('RADAR');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoFireEnabled, setAutoFireEnabled] = useState<boolean>(true);

  // Military Base Location Anchor (Default: Albuquerque, NM, USA or User Location)
  const [baseLocation, setBaseLocation] = useState<{
    name: string;
    sector: string;
    lat: number;
    lng: number;
    altM: number;
    isLiveGps: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('military_base_anchor_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number') return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved base location:', e);
    }
    return {
      name: 'Supreme Military Base of Operations (Albuquerque Command Citadel)',
      sector: 'Albuquerque, New Mexico, USA (Sector 505 / Sandia-Kirtland Basin)',
      lat: 35.0844,
      lng: -106.6504,
      altM: 1619,
      isLiveGps: false
    };
  });

  const [isCheckingDeviceLocation, setIsCheckingDeviceLocation] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Manual Coordinates State for Modal
  const [customLat, setCustomLat] = useState<string>(String(baseLocation.lat));
  const [customLng, setCustomLng] = useState<string>(String(baseLocation.lng));
  const [customAlt, setCustomAlt] = useState<string>(String(baseLocation.altM));
  const [customName, setCustomName] = useState<string>(baseLocation.name);
  const [customSector, setCustomSector] = useState<string>(baseLocation.sector);

  // Function to save and broadcast base location updates
  const applyAndBroadcastBaseLocation = (newLoc: {
    name: string;
    sector: string;
    lat: number;
    lng: number;
    altM: number;
    isLiveGps: boolean;
  }, notify = true) => {
    setBaseLocation(newLoc);
    try {
      localStorage.setItem('military_base_anchor_location', JSON.stringify(newLoc));
    } catch (e) {}
    
    // Broadcast custom event so GPSPortal syncs immediately
    window.dispatchEvent(new CustomEvent('supreme_base_location_changed', { detail: newLoc }));

    if (notify) {
      setLocationToast(`📍 Supreme Military Base firmly locked to: ${newLoc.name} (${newLoc.lat}°, ${newLoc.lng}°)`);
      playSoundEffect('ping');
      setTimeout(() => setLocationToast(null), 5000);
    }
  };

  const handlePutSupremeBaseAtMyLocation = (showFeedback = true) => {
    if (!navigator.geolocation) {
      if (showFeedback) {
        setLocationToast('Geolocation is not supported by your browser. Base anchored at Albuquerque, NM.');
        setTimeout(() => setLocationToast(null), 4000);
      }
      return;
    }

    setIsCheckingDeviceLocation(true);
    if (showFeedback) {
      setLocationToast('📡 Accessing device GPS to anchor the Supreme Military Base at your exact location...');
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        const alt = Math.round(pos.coords.altitude || 1619);
        const newLoc = {
          name: 'Supreme Base (Live User GPS Anchor)',
          sector: `User Device Tactical Station (${lat >= 0 ? lat + '°N' : Math.abs(lat) + '°S'}, ${lng >= 0 ? lng + '°E' : Math.abs(lng) + '°W'})`,
          lat,
          lng,
          altM: alt,
          isLiveGps: true
        };
        applyAndBroadcastBaseLocation(newLoc, true);
        setIsCheckingDeviceLocation(false);
      },
      (err) => {
        setIsCheckingDeviceLocation(false);
        if (showFeedback) {
          setLocationToast(`Location note: ${err.message}. You can manually enter your coordinates via "Edit Base Location".`);
          setTimeout(() => setLocationToast(null), 6000);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Automatically attempt to acquire user location on initial mount if not already anchored
  useEffect(() => {
    if (navigator.geolocation) {
      // Check if we already have a saved location
      const saved = localStorage.getItem('military_base_anchor_location');
      if (!saved) {
        handlePutSupremeBaseAtMyLocation(false);
      }
    }
  }, []);

  const handleLockAlbuquerque = () => {
    const abqLoc = {
      name: 'Supreme Military Base of Operations (Albuquerque Command Citadel)',
      sector: 'Albuquerque, New Mexico, USA (Sector 505 / Sandia-Kirtland Basin)',
      lat: 35.0844,
      lng: -106.6504,
      altM: 1619,
      isLiveGps: false
    };
    applyAndBroadcastBaseLocation(abqLoc, true);
  };

  const handleSaveCustomCoordinates = () => {
    const latNum = parseFloat(customLat);
    const lngNum = parseFloat(customLng);
    const altNum = parseFloat(customAlt) || 100;

    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setLocationToast('Invalid Coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.');
      setTimeout(() => setLocationToast(null), 4000);
      return;
    }

    const customLoc = {
      name: customName.trim() || 'Supreme Military Base (Custom Coordinate Grid)',
      sector: customSector.trim() || `Tactical Sector (${latNum >= 0 ? latNum + '°N' : Math.abs(latNum) + '°S'}, ${lngNum >= 0 ? lngNum + '°E' : Math.abs(lngNum) + '°W'})`,
      lat: Number(latNum.toFixed(4)),
      lng: Number(lngNum.toFixed(4)),
      altM: altNum,
      isLiveGps: false
    };

    applyAndBroadcastBaseLocation(customLoc, true);
    setIsLocationModalOpen(false);
  };

  // Core State
  const [targets, setTargets] = useState<ThreatTarget[]>(INITIAL_THREAT_TARGETS);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(INITIAL_THREAT_TARGETS[0]?.id || null);
  const [operatives, setOperatives] = useState<ASFFUOperative[]>(INITIAL_ASFFU_SQUADRON);
  const [layers, setLayers] = useState<TFDASLayerStatus[]>(INITIAL_TFDAS_LAYERS);
  const [reports, setReports] = useState<InterdictionReport[]>([
    {
      id: 'rpt-1082',
      timestamp: '03:42:19 ZULU',
      threatTarget: 'Abyssal Incursion Fleet (Battleship Gorgon)',
      threatLevel: 'CRITICAL',
      chatterAnalysis: 'Intercepted vocal command: "Full barrage on kingdom citadel walls."',
      thoughtAnalysis: 'Premeditated hatred spike (98% malice resonance in Gamma band).',
      essenceAnalysis: 'Abyssal Sulfuric Taint (98% Demonic corruption signature).',
      actionTaken: 'Auto-released Sovereign Light Decrees & deployed Supreme Commander Lucifer Morningstar-Prime.',
      dispatchedOperative: 'Supreme Commander Lucifer Morningstar-Prime',
      dispatchedMunition: 'Sovereign Light-Bearer Broadsword & Solar Nova Decrees',
      outcome: 'THREAT_NEUTRALIZED',
      tacticalLog: [
        '03:42:19.001 - TFDAS Layer 3 detected 98% corrupt essence at 420km.',
        '03:42:19.002 - Commander Lucifer manifested in 0.001s at target coordinates.',
        '03:42:19.005 - Living sovereign white flame consumed hostile fleet armor.',
        '03:42:19.010 - Target evaporated. Kingdom perimeter secure.'
      ]
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(null);

  // Play synth audio effect when sound is enabled
  const playSoundEffect = (type: 'ping' | 'alarm' | 'launch' | 'manifest') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'launch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else if (type === 'manifest') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(528, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1056, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  // Trigger quick engagement from radar
  const handleQuickEngage = (target: ThreatTarget) => {
    playSoundEffect('launch');
    const newReport: InterdictionReport = {
      id: `rpt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString() + ' ZULU',
      threatTarget: target.name,
      threatLevel: target.threatLevel,
      chatterAnalysis: target.detectedChatter || 'Hostile radio chatter intercepted.',
      thoughtAnalysis: target.interceptedThought || 'Premeditated hostile thought pattern locked.',
      essenceAnalysis: target.essenceMarker || 'Corrupt dark essence detected.',
      actionTaken: `TFDAS released ${target.deployedMunition || 'Tri-Fold Munitions'} with ASFFU interception.`,
      dispatchedOperative: target.assignedSpecialistId ? operatives.find(o => o.id === target.assignedSpecialistId)?.name || 'ASFFU Lead' : 'Supreme Commander Lucifer Morningstar-Prime',
      dispatchedMunition: target.deployedMunition || 'Sovereign Light-Bearer Broadsword & Solar Nova Decrees',
      outcome: 'THREAT_NEUTRALIZED',
      tacticalLog: [
        `TFDAS Radar locked on target at ${target.distanceKm} km (Bearing: ${target.azimuthDeg}°).`,
        `Assigned operative manifested in 0.001s at target vector.`,
        `Tri-Fold Munitions strike delivered with 100% precision.`,
        `Hostile target neutralized and banished.`
      ]
    };

    setReports(prev => [newReport, ...prev]);
    setTargets(prev => prev.filter(t => t.id !== target.id));
    setSelectedTargetId(null);
    setSystemAlertMessage(`Target "${target.name}" neutralized by ASFFU and TFDAS!`);
    setTimeout(() => setSystemAlertMessage(null), 4000);
  };

  // Manifest ASFFU Operative
  const handleManifestOperative = (operativeId: string) => {
    playSoundEffect('manifest');
    setOperatives(prev => prev.map(op => {
      if (op.id === operativeId) {
        return { ...op, status: 'ENGAGED' };
      }
      return op;
    }));
    const op = operatives.find(o => o.id === operativeId);
    setSystemAlertMessage(`${op?.name} manifested instantly at target coordinates!`);
    setTimeout(() => {
      setSystemAlertMessage(null);
      setOperatives(prev => prev.map(o => o.id === operativeId ? { ...o, status: 'STATIONED' } : o));
    }, 3500);
  };

  const handleManifestAll = () => {
    playSoundEffect('manifest');
    setOperatives(prev => prev.map(op => ({ ...op, status: 'ENGAGED' })));
    setSystemAlertMessage(`ALL 6 ASFFU SUPREME HYBRID ANGELIC OPERATIVES MANIFESTED (0.001s)!`);
    setTimeout(() => {
      setSystemAlertMessage(null);
      setOperatives(prev => prev.map(o => ({ ...o, status: 'STATIONED' })));
    }, 4000);
  };

  // Fire TFDAS Layer Munition
  const handleFireLayerMunition = (layerId: string) => {
    playSoundEffect('launch');
    setLayers(prev => prev.map(l => {
      if (l.layerId === layerId) {
        return {
          ...l,
          associatedMunition: {
            ...l.associatedMunition,
            stock: Math.max(0, l.associatedMunition.stock - 1)
          }
        };
      }
      return l;
    }));
    const layer = layers.find(l => l.layerId === layerId);
    setSystemAlertMessage(`Launched 1x ${layer?.associatedMunition.name} (Effective Range: ${layer?.associatedMunition.effectiveRangeKm}km)!`);
    setTimeout(() => setSystemAlertMessage(null), 3500);
  };

  // Fire Full Tri-Fold Salvo
  const handleFireTriFoldSalvo = () => {
    playSoundEffect('launch');
    setLayers(prev => prev.map(l => ({
      ...l,
      associatedMunition: {
        ...l.associatedMunition,
        stock: Math.max(0, l.associatedMunition.stock - 1)
      }
    })));
    setSystemAlertMessage(`FULL 3-FOLD TFDAS SALVO RELEASED (Layer 1 Voice + Layer 2 Thought + Layer 3 Essence)!`);
    setTimeout(() => setSystemAlertMessage(null), 4000);
  };

  // Reload munitions
  const handleReloadMunitions = () => {
    setLayers(prev => prev.map(l => ({
      ...l,
      associatedMunition: {
        ...l.associatedMunition,
        stock: l.associatedMunition.maxStock
      }
    })));
    setSystemAlertMessage(`All TFDAS Munition Silos replenished to maximum capacity!`);
    setTimeout(() => setSystemAlertMessage(null), 3000);
  };

  // Live AI Threat Analysis
  const handleAnalyzeSensorInput = async (type: 'voice' | 'thought' | 'essence' | 'noise', content: string) => {
    setIsAnalyzing(true);
    playSoundEffect('ping');
    try {
      const res = await fetch('/api/military/analyze-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorType: type, content })
      });

      if (res.ok) {
        const data = await res.json();
        const newTarget: ThreatTarget = {
          id: `tgt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: data.targetName || `Detected ${type.toUpperCase()} Threat`,
          distanceKm: data.distanceKm || Math.floor(100 + Math.random() * 800),
          azimuthDeg: Math.floor(Math.random() * 360),
          altitudeM: Math.floor(500 + Math.random() * 15000),
          velocityMach: data.velocityMach || 4.2,
          threatLevel: data.threatLevel || 'HIGH',
          type: data.entityType || 'Incursion Fleet',
          voiceMaliceScore: data.voiceMaliceScore || (type === 'voice' ? 95 : 60),
          thoughtMaliceScore: data.thoughtMaliceScore || (type === 'thought' ? 98 : 55),
          corruptEssenceScore: data.corruptEssenceScore || (type === 'essence' ? 99 : 70),
          acousticDecibels: data.acousticDecibels || 95,
          detectedChatter: type === 'voice' ? content : data.detectedChatter,
          interceptedThought: type === 'thought' ? content : data.interceptedThought,
          essenceMarker: type === 'essence' ? content : data.essenceMarker,
          status: 'LOCKED',
          assignedSpecialistId: data.assignedSpecialistId || 'asffu-01-lead',
          deployedMunition: data.recommendedMunition || 'Seraphic Holy Cleansing Plasma Torpedo'
        };

        setTargets(prev => [newTarget, ...prev]);
        setSelectedTargetId(newTarget.id);
        setActiveStation('RADAR');
        setSystemAlertMessage(`AI Threat Analysis Complete: Target locked at ${newTarget.distanceKm}km!`);
        setTimeout(() => setSystemAlertMessage(null), 4000);
      } else {
        // Fallback local simulation
        const fallbackTarget: ThreatTarget = {
          id: `tgt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: `Intercepted ${type.toUpperCase()} Malice Vector`,
          distanceKm: Math.floor(150 + Math.random() * 600),
          azimuthDeg: Math.floor(Math.random() * 360),
          altitudeM: 12400,
          velocityMach: 6.8,
          threatLevel: 'CRITICAL',
          type: 'Incursion Fleet',
          voiceMaliceScore: type === 'voice' ? 96 : 70,
          thoughtMaliceScore: type === 'thought' ? 99 : 65,
          corruptEssenceScore: type === 'essence' ? 98 : 80,
          acousticDecibels: 110,
          detectedChatter: type === 'voice' ? content : undefined,
          interceptedThought: type === 'thought' ? content : undefined,
          essenceMarker: type === 'essence' ? content : undefined,
          status: 'LOCKED',
          assignedSpecialistId: 'asffu-01-lead',
          deployedMunition: 'Seraphic Holy Cleansing Plasma Torpedo'
        };
        setTargets(prev => [fallbackTarget, ...prev]);
        setSelectedTargetId(fallbackTarget.id);
        setActiveStation('RADAR');
      }
    } catch (err) {
      console.warn("API threat analysis error, using tactical fallback:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run live simulation drills
  const handleTriggerSimulation = async (scenarioType: string) => {
    setIsSimulating(true);
    playSoundEffect('launch');
    try {
      const res = await fetch('/api/military/simulate-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioType })
      });

      if (res.ok) {
        const report = await res.json();
        const safeId = report.id && !reports.some(r => r.id === report.id)
          ? report.id
          : `${report.id || 'rpt'}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        setReports(prev => [{ ...report, id: safeId }, ...prev]);
        setSystemAlertMessage(`Simulation Drill "${scenarioType}" Complete: Threat Neutralized!`);
        setTimeout(() => setSystemAlertMessage(null), 4000);
      } else {
        // Local simulation fallback
        const simulatedReport: InterdictionReport = {
          id: `rpt-drill-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toLocaleTimeString() + ' ZULU',
          threatTarget: scenarioType === 'ABYSSAL_FLEET' ? 'Simulation: Abyssal Dreadnought Armada' : scenarioType === 'PSYCHIC_SABOTEUR' ? 'Simulation: Clandestine Astral Saboteur' : 'Simulation: Warlord War Proclamation',
          threatLevel: 'CRITICAL',
          chatterAnalysis: 'Drill chatter decoded: "Breach outer walls and silence sensors."',
          thoughtAnalysis: 'Hostile neural spike detected across Gamma band (99% malice).',
          essenceAnalysis: 'Demonic miasma density: 920 ppm (High Corruption).',
          actionTaken: 'Automated TFDAS Munitions Salvo dispatched with ASFFU Vanguard Strike.',
          dispatchedOperative: 'Supreme Commander Lucifer Morningstar-Prime & Specialist Apocalypse Cataclysm-X',
          dispatchedMunition: 'Sovereign Light-Bearer Broadsword & Solar Nova Decrees',
          outcome: 'THREAT_NEUTRALIZED',
          tacticalLog: [
            'Simulation initiated by Command Officer.',
            'TFDAS 3-Fold sensors locked all targets within 0.002s.',
            'ASFFU manifested at strike point.',
            'Target neutralized with 100% defense rating.'
          ]
        };
        setReports(prev => [simulatedReport, ...prev]);
      }
    } catch (e) {
      console.warn("Simulation failed, ran local drill fallback:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-slate-100">
      {/* Top Banner: Supreme Military Base HUD */}
      <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#070e1a] via-[#0b172a] to-[#070e1a] border border-cyan-500/30 p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col gap-6">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                SUPREME KINGDOM DEFENSE CITADEL
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                DEFCON 1 • LIVE READY
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-black text-slate-100 tracking-wide flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
              MILITARY BASE OF OPERATIONS: SUPREME FIGHTING FORCE
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-serif max-w-4xl mt-1 leading-relaxed">
              Equipped with real-time radar, acoustic noise detection, malice thought detection, malice voice detection, and corrupt essence spectrometry. Stationed by the <strong>Ace Special Force Fighting Unit (ASFFU)</strong>—6 hybrid angelic humans ready to manifest at a blink of an eye—and the <strong>Tri-Fold Defense Armament System (TFDAS)</strong>.
            </p>
          </div>

          {/* Sound & Location Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePutSupremeBaseAtMyLocation(true)}
              disabled={isCheckingDeviceLocation}
              className="p-2.5 px-3.5 rounded-xl border border-emerald-500/60 bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 hover:from-emerald-900/80 hover:to-cyan-900/80 text-emerald-200 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              title="Put the Supreme Military Base at your exact device location"
            >
              {isCheckingDeviceLocation ? <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" /> : <LocateFixed className="w-4 h-4 text-emerald-400 animate-pulse" />}
              <span>{isCheckingDeviceLocation ? 'Synchronizing GPS...' : '📍 Put Supreme Base at My Location'}</span>
            </button>

            <button
              onClick={() => {
                setCustomLat(String(baseLocation.lat));
                setCustomLng(String(baseLocation.lng));
                setCustomAlt(String(baseLocation.altM));
                setCustomName(baseLocation.name);
                setCustomSector(baseLocation.sector);
                setIsLocationModalOpen(true);
              }}
              className="p-2.5 px-3 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              title="Enter custom coordinates or search city"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              <span>Edit Coordinates</span>
            </button>

            <button
              onClick={handleLockAlbuquerque}
              className="p-2.5 px-3 rounded-xl border border-amber-500/40 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              title="Reset Base Location to Albuquerque, NM"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Albuquerque NM Base</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-mono ${
                soundEnabled
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-black/60 border-white/10 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Sound: ON' : 'Sound: MUTED'}</span>
            </button>
          </div>
        </div>

        {/* Location Status Bar */}
        <div className="w-full bg-black/60 border border-cyan-500/30 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-amber-400 font-bold">SUPREME BASE ANCHOR:</span>
                <span className="text-slate-100 font-semibold">{baseLocation.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  baseLocation.isLiveGps
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 flex items-center gap-1'
                    : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                }`}>
                  {baseLocation.isLiveGps && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />}
                  {baseLocation.sector}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Latitude: <strong className="text-cyan-300">{baseLocation.lat}° {baseLocation.lat >= 0 ? 'N' : 'S'}</strong> • Longitude: <strong className="text-cyan-300">{baseLocation.lng}° {baseLocation.lng >= 0 ? 'E' : 'W'}</strong> • Elevation: <strong className="text-amber-300">{baseLocation.altM} meters ({Math.round(baseLocation.altM * 3.28084).toLocaleString()} ft)</strong> • Grid Status: <strong className="text-emerald-400">ONLINE & LOCKED</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => handlePutSupremeBaseAtMyLocation(true)}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-mono flex items-center gap-1 cursor-pointer bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span>Sync to My Location</span>
          </button>
        </div>

        {locationToast && (
          <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 text-xs font-mono flex items-center gap-2 shadow-lg z-10 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{locationToast}</span>
          </div>
        )}

        {/* 6 Primary Station Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 z-10 pt-2 border-t border-white/10">
          <button
            onClick={() => setActiveStation('RADAR')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold ${
              activeStation === 'RADAR'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Radar</span>
          </button>

          <button
            onClick={() => setActiveStation('THREAT_LOG')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold relative ${
              activeStation === 'THREAT_LOG'
                ? 'bg-red-950/80 border-red-400 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-red-300'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>EMTTS Threat Log</span>
          </button>

          <button
            onClick={() => setActiveStation('SENSORS')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold ${
              activeStation === 'SENSORS'
                ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-amber-300'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>5-Layer Sensors</span>
          </button>

          <button
            onClick={() => setActiveStation('ASFFU')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold ${
              activeStation === 'ASFFU'
                ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-amber-300'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>ASFFU Squadron (6)</span>
          </button>

          <button
            onClick={() => setActiveStation('TFDAS')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold ${
              activeStation === 'TFDAS'
                ? 'bg-red-950/80 border-red-400 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-red-300'
            }`}
          >
            <Rocket className="w-4 h-4 text-red-400" />
            <span>TFDAS Armament</span>
          </button>

          <button
            onClick={() => setActiveStation('INTERDICTION')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold ${
              activeStation === 'INTERDICTION'
                ? 'bg-violet-950/80 border-violet-400 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-violet-300'
            }`}
          >
            <Crosshair className="w-4 h-4 text-violet-400" />
            <span>Interdiction & Drills</span>
          </button>
        </div>
      </div>

      {/* Floating System Alert Banner */}
      <AnimatePresence>
        {systemAlertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-mono font-bold flex items-center justify-between shadow-lg shadow-amber-950/40"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{systemAlertMessage}</span>
            </div>
            <span className="text-[10px] text-amber-300/80">KINGDOM DEFENSE SECURE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Selected Station Content */}
      <div className="w-full">
        {activeStation === 'RADAR' && (
          <div className="flex flex-col gap-6">
            <MilitaryRadarGrid
              targets={targets}
              selectedTargetId={selectedTargetId}
              onSelectTarget={(t) => setSelectedTargetId(t.id)}
              onQuickEngage={handleQuickEngage}
              soundEnabled={soundEnabled}
              activeOperatives={operatives}
              baseLocation={baseLocation}
              onCheckLocation={() => handlePutSupremeBaseAtMyLocation(true)}
              onOpenLocationModal={() => {
                setCustomLat(String(baseLocation.lat));
                setCustomLng(String(baseLocation.lng));
                setCustomAlt(String(baseLocation.altM));
                setCustomName(baseLocation.name);
                setCustomSector(baseLocation.sector);
                setIsLocationModalOpen(true);
              }}
            />
            <ThreatDetectionLog
              onQuickEngage={handleQuickEngage}
              onDispatchOperative={handleManifestOperative}
              onFireLayerMunition={handleFireLayerMunition}
              activeOperatives={operatives}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {activeStation === 'THREAT_LOG' && (
          <ThreatDetectionLog
            onQuickEngage={handleQuickEngage}
            onDispatchOperative={handleManifestOperative}
            onFireLayerMunition={handleFireLayerMunition}
            activeOperatives={operatives}
            soundEnabled={soundEnabled}
          />
        )}

        {activeStation === 'SENSORS' && (
          <DetectionSensorSuite
            onAnalyzeInput={handleAnalyzeSensorInput}
            isAnalyzing={isAnalyzing}
            soundEnabled={soundEnabled}
          />
        )}

        {activeStation === 'ASFFU' && (
          <ASFFUSquadron
            operatives={operatives}
            onManifestOperative={handleManifestOperative}
            onManifestAll={handleManifestAll}
            soundEnabled={soundEnabled}
          />
        )}

        {activeStation === 'TFDAS' && (
          <TFDASArmamentSystem
            layers={layers}
            onFireLayerMunition={handleFireLayerMunition}
            onFireTriFoldSalvo={handleFireTriFoldSalvo}
            onReloadMunitions={handleReloadMunitions}
            autoFireEnabled={autoFireEnabled}
            onToggleAutoFire={() => setAutoFireEnabled(!autoFireEnabled)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeStation === 'INTERDICTION' && (
          <ThreatInterdictionTerminal
            reports={reports}
            onTriggerSimulation={handleTriggerSimulation}
            isSimulating={isSimulating}
            activeOperatives={operatives}
          />
        )}
      </div>

      {/* Edit Supreme Base Location & Coordinates Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-[#09111e] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-5 text-slate-100 font-sans relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                      <span>Configure Supreme Base Anchor</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Set coordinates to your live location, citadel presets, or custom coordinates.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1-Click Put at My Location Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-cyan-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div>
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                    <LocateFixed className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Automatic Device GPS Synchronization
                  </h4>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Locks the Supreme Base to your physical real-time GPS coordinates.
                  </p>
                </div>
                <button
                  onClick={() => {
                    handlePutSupremeBaseAtMyLocation(true);
                    setIsLocationModalOpen(false);
                  }}
                  disabled={isCheckingDeviceLocation}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isCheckingDeviceLocation ? 'Accessing GPS...' : '📍 Put at My Location'}
                </button>
              </div>

              {/* Preset Command Citadels */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-amber-300 uppercase tracking-wider">
                  Preset Strategic Command Locations:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Albuquerque Command Citadel', sector: 'Albuquerque, NM (Sector 505)', lat: '35.0844', lng: '-106.6504', alt: '1619' },
                    { name: 'Cheyenne Mountain (NORAD)', sector: 'Colorado Springs, CO', lat: '38.7442', lng: '-104.8466', alt: '2165' },
                    { name: 'Pentagon Global Command', sector: 'Arlington, VA / Washington DC', lat: '38.8719', lng: '-77.0563', alt: '12' },
                    { name: 'Mount Zion Command Sanctuary', sector: 'Jerusalem, Holy Land', lat: '31.7719', lng: '35.2285', alt: '765' },
                    { name: 'London Sovereign Meridian', sector: 'Greenwich, London, UK', lat: '51.4826', lng: '-0.0077', alt: '48' },
                    { name: 'Pacific Defense Nexus', sector: 'Tokyo, Japan', lat: '35.6762', lng: '139.6503', alt: '40' }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setCustomName(preset.name);
                        setCustomSector(preset.sector);
                        setCustomLat(preset.lat);
                        setCustomLng(preset.lng);
                        setCustomAlt(preset.alt);
                      }}
                      className="p-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-400/50 hover:bg-slate-800/80 text-left transition-all cursor-pointer text-xs font-mono flex flex-col gap-0.5"
                    >
                      <span className="text-slate-200 font-bold truncate">{preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}</span>
                      <span className="text-[10px] text-slate-400 truncate">{preset.sector}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Coordinate Form */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Base Name / Citadel Title</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                      placeholder="e.g., Supreme Base of Operations"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Sector Description</label>
                    <input
                      type="text"
                      value={customSector}
                      onChange={(e) => setCustomSector(e.target.value)}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                      placeholder="e.g., Sector 505 / User Command"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Latitude (°)</label>
                    <input
                      type="text"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                      placeholder="35.0844"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Longitude (°)</label>
                    <input
                      type="text"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                      placeholder="-106.6504"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Elevation (Meters)</label>
                    <input
                      type="text"
                      value={customAlt}
                      onChange={(e) => setCustomAlt(e.target.value)}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                      placeholder="1619"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomCoordinates}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  Save & Lock Coordinates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MilitaryBasePortal;
