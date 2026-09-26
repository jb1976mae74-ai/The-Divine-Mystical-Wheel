import React, { useState, useEffect } from 'react';
import { GPSFixData, Waypoint, SatelliteInfo } from '../../types/gps';
import { SACRED_AND_TACTICAL_WAYPOINTS, INITIAL_SATELLITES, getSavedBaseLocation, getBaseWaypoint } from '../../data/gpsPresets';
import GPSMapCanvas from './GPSMapCanvas';
import SatelliteSkyplot from './SatelliteSkyplot';
import HUDCompassAltimeter from './HUDCompassAltimeter';
import RoutePlanner from './RoutePlanner';
import NMEATerminal from './NMEATerminal';
import {
  Navigation,
  Globe,
  Radio,
  Compass,
  MapPin,
  Terminal,
  Activity,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Volume2,
  VolumeX,
  Share2,
  LocateFixed,
  AlertTriangle,
  Layers
} from 'lucide-react';

interface GPSPortalProps {
  activeTheme: any;
  onOpenMilitaryBase?: () => void;
}

export default function GPSPortal({ activeTheme, onOpenMilitaryBase }: GPSPortalProps) {
  // GPS Fix State (Default anchored at Supreme Military Base or Live Browser Geolocation)
  const [currentFix, setCurrentFix] = useState<GPSFixData>(() => {
    const baseLoc = getSavedBaseLocation();
    return {
      latitude: baseLoc.lat,
      longitude: baseLoc.lng,
      altitude: baseLoc.altM,
      accuracy: 1.8,
      altitudeAccuracy: 2.2,
      heading: 42.5,
      speed: 0,
      speedKmh: 0,
      speedKnots: 0,
      speedMph: 0,
      timestamp: Date.now(),
      fixType: '3D_FIX',
      hdop: 0.85,
      vdop: 1.1,
      pdop: 1.4,
      satellitesInView: 18,
      satellitesInUse: 14,
      isSimulated: false,
      geoidHeightMeters: -18.2
    };
  });

  const [useLiveBrowserGPS, setUseLiveBrowserGPS] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    const baseWp = getBaseWaypoint();
    return [baseWp, ...SACRED_AND_TACTICAL_WAYPOINTS.slice(1)];
  });
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(() => getBaseWaypoint());
  const [activeRouteDestination, setActiveRouteDestination] = useState<Waypoint | null>(SACRED_AND_TACTICAL_WAYPOINTS[1]);
  const [satellites, setSatellites] = useState<SatelliteInfo[]>(INITIAL_SATELLITES);
  const [audioTelemetryEnabled, setAudioTelemetryEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'MAP' | 'SKYPLOT' | 'TELEMETRY' | 'ROUTE' | 'NMEA'>('MAP');

  // Listen for supreme base location changes from MilitaryBasePortal or user GPS
  useEffect(() => {
    const handleBaseLocationChanged = (e: any) => {
      const newLoc = e.detail;
      if (newLoc && typeof newLoc.lat === 'number' && typeof newLoc.lng === 'number') {
        const updatedBaseWp: Waypoint = {
          id: 'wp-kingdom-command',
          name: newLoc.name,
          category: 'Kingdom Command',
          latitude: newLoc.lat,
          longitude: newLoc.lng,
          altitudeMeters: newLoc.altM || 1619,
          description: `Central Tactical Command for the Supreme Fighting Force & ASFFU Operatives stationed at ${newLoc.sector}.`,
          color: '#ef4444',
          iconName: 'ShieldAlert',
          tags: ['Kingdom', 'Military', 'ASFFU', 'TFDAS', newLoc.isLiveGps ? 'Live Device GPS' : 'Base Command'],
          createdAt: '2026-08-30'
        };

        setWaypoints(prev => [updatedBaseWp, ...prev.filter(w => w.id !== 'wp-kingdom-command')]);
        setSelectedWaypoint(updatedBaseWp);
        setCurrentFix(prev => ({
          ...prev,
          latitude: newLoc.lat,
          longitude: newLoc.lng,
          altitude: newLoc.altM || prev.altitude
        }));
      }
    };

    window.addEventListener('supreme_base_location_changed', handleBaseLocationChanged);
    return () => window.removeEventListener('supreme_base_location_changed', handleBaseLocationChanged);
  }, []);

  // Load custom waypoints from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kingdom_gps_custom_waypoints');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWaypoints(prev => {
            const presetIds = new Set(SACRED_AND_TACTICAL_WAYPOINTS.map(w => w.id));
            const customs = parsed.filter(w => !presetIds.has(w.id));
            return [...SACRED_AND_TACTICAL_WAYPOINTS, ...customs];
          });
        }
      }
    } catch (e) {
      console.warn('Could not load saved waypoints:', e);
    }
  }, []);

  // Save custom waypoints to localStorage
  const persistWaypoints = (newWps: Waypoint[]) => {
    setWaypoints(newWps);
    try {
      localStorage.setItem('kingdom_gps_custom_waypoints', JSON.stringify(newWps));
    } catch (e) {
      console.warn('Could not persist waypoints:', e);
    }
  };

  const handleAddWaypoint = (wp: Waypoint) => {
    const updated = [wp, ...waypoints];
    persistWaypoints(updated);
    setSelectedWaypoint(wp);
  };

  const handleDeleteWaypoint = (id: string) => {
    const updated = waypoints.filter(w => w.id !== id);
    persistWaypoints(updated);
    if (selectedWaypoint?.id === id) {
      setSelectedWaypoint(null);
    }
    if (activeRouteDestination?.id === id) {
      setActiveRouteDestination(null);
    }
  };

  const handleAddWaypointAtCoord = (lat: number, lng: number) => {
    const customWp: Waypoint = {
      id: `wp-reticle-${Date.now()}`,
      name: `Waypoint (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      category: 'Custom',
      latitude: lat,
      longitude: lng,
      altitudeMeters: 100,
      description: 'Pin dropped from cursor reticle crosshair.',
      color: '#06b6d4',
      iconName: 'MapPin',
      tags: ['Reticle', 'Custom'],
      createdAt: new Date().toISOString().split('T')[0]
    };
    handleAddWaypoint(customWp);
  };

  // Browser Geolocation Watcher
  useEffect(() => {
    if (!useLiveBrowserGPS) return;

    if (!navigator.geolocation) {
      setGeoError('HTML5 Geolocation is not supported by your browser.');
      return;
    }

    setGeoError(null);
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const speedMs = pos.coords.speed || 0;
        const speedKmh = speedMs * 3.6;
        const speedKnots = speedMs * 1.94384;
        const speedMph = speedMs * 2.23694;

        setCurrentFix(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitude: pos.coords.altitude || prev.altitude,
          accuracy: pos.coords.accuracy || 2.5,
          altitudeAccuracy: pos.coords.altitudeAccuracy || 3.0,
          heading: pos.coords.heading !== null ? pos.coords.heading : prev.heading,
          speed: speedMs,
          speedKmh,
          speedKnots,
          speedMph,
          timestamp: pos.timestamp,
          isSimulated: false,
          fixType: '3D_FIX'
        }));
      },
      err => {
        setGeoError(`Location Error: ${err.message}. Using high-precision Celestial simulation coordinates.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [useLiveBrowserGPS]);

  // Audio Telemetry Ping Sound effect
  const playTelemetryChime = (freq = 880) => {
    if (!audioTelemetryEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-100 font-sans pb-16">
      {/* Top Banner & Control Deck */}
      <div className="p-6 bg-gradient-to-r from-[#070b14] via-[#0d1527] to-[#070b14] border border-cyan-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-lg">
                <Navigation className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-2">
                  <span>Kingdom Geodesic GPS Positioning System</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-normal">
                    WGS84 / DGPS 10Hz
                  </span>
                </h2>
                <p className="text-xs font-serif text-slate-400">
                  Global satellite constellation triangulation, turn-by-turn vector guidance, multi-band carrier locks, and celestial geodesy.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live GPS Toggle */}
            <button
              onClick={() => {
                setUseLiveBrowserGPS(!useLiveBrowserGPS);
                playTelemetryChime(1200);
              }}
              className={`px-3 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                useLiveBrowserGPS
                  ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <LocateFixed className={`w-4 h-4 ${useLiveBrowserGPS ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`} />
              <span>{useLiveBrowserGPS ? 'Live Browser GPS: ACTIVE' : 'Enable Device GPS'}</span>
            </button>

            {/* Audio Telemetry Toggle */}
            <button
              onClick={() => setAudioTelemetryEnabled(!audioTelemetryEnabled)}
              title="Toggle Audio Radar Pings"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {audioTelemetryEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Geolocation Warning Banner if needed */}
        {geoError && (
          <div className="mt-4 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{geoError}</span>
          </div>
        )}

        {/* Global Navigation Tab Selector */}
        <div className="flex items-center gap-1.5 mt-5 border-t border-white/10 pt-4 overflow-x-auto">
          {[
            { id: 'MAP', label: 'Tactical Leaflet Matrix', icon: Layers },
            { id: 'SKYPLOT', label: 'Satellite Skyplot & Constellation', icon: Radio },
            { id: 'TELEMETRY', label: 'Compass & Altimeter HUD', icon: Compass },
            { id: 'ROUTE', label: 'Waypoint Matrix & Navigation', icon: MapPin },
            { id: 'NMEA', label: 'NMEA Serial Stream', icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playTelemetryChime(950);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-lg shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Interactive Tactical Map + Route Planner Quick Deck */}
      {activeTab === 'MAP' && (
        <div className="space-y-4">
          <GPSMapCanvas
            currentFix={currentFix}
            waypoints={waypoints}
            selectedWaypoint={selectedWaypoint}
            onSelectWaypoint={setSelectedWaypoint}
            onAddWaypointAtCoord={handleAddWaypointAtCoord}
            activeRouteDestination={activeRouteDestination}
            activeTheme={activeTheme}
          />
          <HUDCompassAltimeter currentFix={currentFix} activeTheme={activeTheme} />
        </div>
      )}

      {/* Tab 2: Satellite Skyplot & Constellation Breakdown */}
      {activeTab === 'SKYPLOT' && (
        <div className="space-y-4">
          <SatelliteSkyplot satellites={satellites} currentFix={currentFix} activeTheme={activeTheme} />
          <HUDCompassAltimeter currentFix={currentFix} activeTheme={activeTheme} />
        </div>
      )}

      {/* Tab 3: Compass, Speedometer & Altimeter HUD */}
      {activeTab === 'TELEMETRY' && (
        <div className="space-y-4">
          <HUDCompassAltimeter currentFix={currentFix} activeTheme={activeTheme} />
          <SatelliteSkyplot satellites={satellites} currentFix={currentFix} activeTheme={activeTheme} />
        </div>
      )}

      {/* Tab 4: Waypoint Directory & Turn-by-Turn Routing */}
      {activeTab === 'ROUTE' && (
        <div className="space-y-4">
          <RoutePlanner
            currentFix={currentFix}
            waypoints={waypoints}
            onAddWaypoint={handleAddWaypoint}
            onDeleteWaypoint={handleDeleteWaypoint}
            selectedWaypoint={selectedWaypoint}
            onSelectWaypoint={setSelectedWaypoint}
            activeRouteDestination={activeRouteDestination}
            onSetRouteDestination={setActiveRouteDestination}
            activeTheme={activeTheme}
          />
        </div>
      )}

      {/* Tab 5: NMEA Serial Telemetry Stream */}
      {activeTab === 'NMEA' && (
        <div className="space-y-4">
          <NMEATerminal currentFix={currentFix} activeTheme={activeTheme} />
          <HUDCompassAltimeter currentFix={currentFix} activeTheme={activeTheme} />
        </div>
      )}
    </div>
  );
}
