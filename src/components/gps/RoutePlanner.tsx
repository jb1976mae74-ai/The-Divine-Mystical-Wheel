import React, { useState } from 'react';
import { Waypoint, GPSFixData, NavigationRoute, RouteInstruction } from '../../types/gps';
import { calculateDistanceKm, calculateBearingDeg, bearingToCardinal } from '../../data/gpsPresets';
import { Navigation, MapPin, Plus, Trash2, Download, Search, Check, ArrowRight, Sparkles, Compass, Shield } from 'lucide-react';

interface RoutePlannerProps {
  currentFix: GPSFixData;
  waypoints: Waypoint[];
  onAddWaypoint: (wp: Waypoint) => void;
  onDeleteWaypoint: (id: string) => void;
  selectedWaypoint: Waypoint | null;
  onSelectWaypoint: (wp: Waypoint) => void;
  activeRouteDestination: Waypoint | null;
  onSetRouteDestination: (wp: Waypoint | null) => void;
  activeTheme: any;
}

export default function RoutePlanner({
  currentFix,
  waypoints,
  onAddWaypoint,
  onDeleteWaypoint,
  selectedWaypoint,
  onSelectWaypoint,
  activeRouteDestination,
  onSetRouteDestination,
  activeTheme
}: RoutePlannerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New waypoint form state
  const [newWpName, setNewWpName] = useState('');
  const [newWpLat, setNewWpLat] = useState(currentFix.latitude.toFixed(5));
  const [newWpLng, setNewWpLng] = useState(currentFix.longitude.toFixed(5));
  const [newWpAlt, setNewWpAlt] = useState('100');
  const [newWpDesc, setNewWpDesc] = useState('');
  const [newWpCategory, setNewWpCategory] = useState<'Custom' | 'Tactical' | 'Sacred'>('Custom');

  const [travelMode, setTravelMode] = useState<'TERRESTRIAL' | 'AERIAL' | 'CELESTIAL_MANIFESTATION'>('AERIAL');

  // Filtered waypoints
  const filteredWaypoints = waypoints.filter(wp => {
    const matchesSearch = wp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || wp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate route details if destination is active
  const routeCalculation = activeRouteDestination ? (() => {
    const distKm = calculateDistanceKm(
      currentFix.latitude,
      currentFix.longitude,
      activeRouteDestination.latitude,
      activeRouteDestination.longitude
    );
    const distNm = Number((distKm * 0.539957).toFixed(2));
    const bearing = calculateBearingDeg(
      currentFix.latitude,
      currentFix.longitude,
      activeRouteDestination.latitude,
      activeRouteDestination.longitude
    );
    const cardinal = bearingToCardinal(bearing);

    // Speed calculation based on travel mode
    const speedKmH = travelMode === 'CELESTIAL_MANIFESTATION' ? 299792458 / 1000 : travelMode === 'AERIAL' ? 950 : 110;
    const etaMinutes = travelMode === 'CELESTIAL_MANIFESTATION' ? 0.001 : (distKm / speedKmH) * 60;

    // Generate Turn-by-Turn Leg Steps
    const instructions: RouteInstruction[] = [
      {
        step: 1,
        instruction: `Depart from current GPS coordinates (${currentFix.latitude.toFixed(4)}°N, ${currentFix.longitude.toFixed(4)}°E).`,
        distanceKm: 0,
        bearingDeg: bearing,
        cardinalDirection: cardinal
      },
      {
        step: 2,
        instruction: `Establish Great-Circle Geodesic trajectory along bearing ${bearing}° (${cardinal}).`,
        distanceKm: Number((distKm * 0.15).toFixed(1)),
        bearingDeg: bearing,
        cardinalDirection: cardinal
      },
      {
        step: 3,
        instruction: `Maintain steady altitude Vector at ${activeRouteDestination.altitudeMeters}m MSL with GPS carrier lock.`,
        distanceKm: Number((distKm * 0.85).toFixed(1)),
        bearingDeg: bearing,
        cardinalDirection: cardinal,
        esotericSignificance: activeRouteDestination.description
      },
      {
        step: 4,
        instruction: `Approach terminal coordinates for ${activeRouteDestination.name}. Interlock anchor beacon.`,
        distanceKm: distKm,
        bearingDeg: bearing,
        cardinalDirection: cardinal
      }
    ];

    return {
      distKm,
      distNm,
      bearing,
      cardinal,
      etaMinutes,
      instructions
    };
  })() : null;

  // Handle Add Custom Waypoint
  const handleCreateWaypoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWpName.trim()) return;

    const lat = parseFloat(newWpLat);
    const lng = parseFloat(newWpLng);
    const alt = parseFloat(newWpAlt) || 0;

    if (isNaN(lat) || isNaN(lng)) return;

    const newWp: Waypoint = {
      id: `wp-custom-${Date.now()}`,
      name: newWpName.trim(),
      category: newWpCategory,
      latitude: lat,
      longitude: lng,
      altitudeMeters: alt,
      description: newWpDesc.trim() || 'Custom recorded waypoint coordinates.',
      color: '#06b6d4',
      iconName: 'MapPin',
      tags: ['Custom', 'User-Defined'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddWaypoint(newWp);
    setShowAddModal(false);
    setNewWpName('');
    setNewWpDesc('');
  };

  // Export GPX Track
  const handleExportGPX = () => {
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Great Wheel GPS Portal" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>GPS Route & Waypoint Export</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  ${waypoints.map(wp => `
  <wpt lat="${wp.latitude}" lon="${wp.longitude}">
    <ele>${wp.altitudeMeters}</ele>
    <name>${wp.name}</name>
    <desc>${wp.description}</desc>
    <type>${wp.category}</type>
  </wpt>`).join('')}
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPS_Waypoints_${Date.now()}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const geoJson = {
      type: 'FeatureCollection',
      features: waypoints.map(wp => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [wp.longitude, wp.latitude, wp.altitudeMeters]
        },
        properties: {
          id: wp.id,
          name: wp.name,
          category: wp.category,
          description: wp.description,
          tags: wp.tags
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPS_Waypoints_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Waypoint Directory (2 cols) */}
      <div className="lg:col-span-2 p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
        <div>
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Geodesic Waypoint Matrix ({filteredWaypoints.length} Stations)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Inscribe Waypoint</span>
              </button>

              <button
                onClick={handleExportGPX}
                title="Download GPX File"
                className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>GPX</span>
              </button>

              <button
                onClick={handleExportGeoJSON}
                title="Download GeoJSON File"
                className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
              >
                <Download className="w-3 h-3 text-emerald-400" />
                <span>GeoJSON</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter waypoints, sacred coordinates, tags..."
                className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            <div className="flex items-center gap-1 text-[9px] font-mono overflow-x-auto">
              {['ALL', 'Sacred', 'Kingdom Command', 'Ancient Mystery', 'Tactical', 'Custom'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Waypoints Scrollable Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredWaypoints.map(wp => {
              const isSelected = selectedWaypoint?.id === wp.id;
              const isRouteDest = activeRouteDestination?.id === wp.id;
              const distFromUser = calculateDistanceKm(currentFix.latitude, currentFix.longitude, wp.latitude, wp.longitude);

              return (
                <div
                  key={wp.id}
                  onClick={() => onSelectWaypoint(wp)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isRouteDest
                      ? 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-950/30'
                      : isSelected
                      ? 'bg-white/[0.04] border-cyan-400/60 shadow-md'
                      : 'bg-black/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: wp.color || '#38bdf8' }}
                      />
                      <span className="text-xs font-mono font-bold text-slate-100 line-clamp-1">
                        {wp.name}
                      </span>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 whitespace-nowrap">
                      {wp.category}
                    </span>
                  </div>

                  <p className="text-[10px] font-serif text-slate-400 line-clamp-2 italic">
                    "{wp.description}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-2">
                    <span className="text-slate-400">
                      {wp.latitude.toFixed(4)}°, {wp.longitude.toFixed(4)}°
                    </span>
                    <span className="text-amber-400 font-bold">
                      {distFromUser.toLocaleString()} km
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSetRouteDestination(isRouteDest ? null : wp);
                      }}
                      className={`flex-1 py-1 px-2 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isRouteDest
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                      }`}
                    >
                      <Navigation className="w-3 h-3" />
                      <span>{isRouteDest ? 'Clear Route' : 'Set Navigation Target'}</span>
                    </button>

                    {wp.category === 'Custom' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteWaypoint(wp.id);
                        }}
                        className="p-1 rounded bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40 cursor-pointer"
                        title="Delete Waypoint"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Navigation Guidance & Turn-by-Turn Panel */}
      <div className="p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Turn-by-Turn Guidance
              </span>
            </div>
            {activeRouteDestination && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                GUIDANCE ACTIVE
              </span>
            )}
          </div>

          {activeRouteDestination && routeCalculation ? (
            <div className="flex flex-col gap-3">
              {/* Destination Header Card */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Target Destination:
                </div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  {activeRouteDestination.name}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  {activeRouteDestination.latitude.toFixed(5)}°N, {activeRouteDestination.longitude.toFixed(5)}°E
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-amber-500/20 text-center text-[10px] font-mono">
                  <div className="p-1 bg-black/40 rounded">
                    <span className="text-slate-500 block text-[8px]">DISTANCE</span>
                    <span className="text-amber-300 font-bold">{routeCalculation.distKm.toLocaleString()} km</span>
                  </div>
                  <div className="p-1 bg-black/40 rounded">
                    <span className="text-slate-500 block text-[8px]">BEARING</span>
                    <span className="text-cyan-300 font-bold">{routeCalculation.bearing}° {routeCalculation.cardinal}</span>
                  </div>
                  <div className="p-1 bg-black/40 rounded">
                    <span className="text-slate-500 block text-[8px]">EST. TIME</span>
                    <span className="text-emerald-400 font-bold">
                      {routeCalculation.etaMinutes < 1 ? '<1 min' : `${Math.round(routeCalculation.etaMinutes)} min`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Travel Mode Toggle */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/5 text-[9px] font-mono">
                {(['TERRESTRIAL', 'AERIAL', 'CELESTIAL_MANIFESTATION'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setTravelMode(mode)}
                    className={`flex-1 py-1 rounded transition-all cursor-pointer ${
                      travelMode === mode
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'CELESTIAL_MANIFESTATION' ? 'CELESTIAL' : mode}
                  </button>
                ))}
              </div>

              {/* Step by Step Route Leg Instructions */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {routeCalculation.instructions.map(inst => (
                  <div key={inst.step} className="p-2 bg-black/40 rounded-lg border border-white/5 flex gap-2 items-start text-[11px] font-mono">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5 text-[10px]">
                      {inst.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 font-sans">{inst.instruction}</p>
                      {inst.esotericSignificance && (
                        <p className="text-[10px] font-serif text-amber-300/80 italic mt-0.5">
                          ✦ {inst.esotericSignificance}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl">
              <Compass className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-mono font-bold text-slate-400">No Destination Active</p>
              <p className="text-[11px] font-serif text-slate-500 mt-1">
                Select any landmark or inscribe custom coordinates to initialize route vector guidance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inscribe Waypoint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0a0d] border border-amber-500/40 rounded-2xl p-5 shadow-2xl shadow-amber-950/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Inscribe Custom Geodesic Waypoint</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWaypoint} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Waypoint Name</label>
                <input
                  type="text"
                  required
                  value={newWpName}
                  onChange={e => setNewWpName(e.target.value)}
                  placeholder="e.g. Northern Perimeter Outpost"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Latitude (°N/S)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newWpLat}
                    onChange={e => setNewWpLat(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Longitude (°E/W)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newWpLng}
                    onChange={e => setNewWpLng(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Altitude (Meters)</label>
                  <input
                    type="number"
                    value={newWpAlt}
                    onChange={e => setNewWpAlt(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Category</label>
                  <select
                    value={newWpCategory}
                    onChange={e => setNewWpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Custom">Custom</option>
                    <option value="Tactical">Tactical</option>
                    <option value="Sacred">Sacred</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Description / Notes</label>
                <textarea
                  value={newWpDesc}
                  onChange={e => setNewWpDesc(e.target.value)}
                  placeholder="Tactical or esoteric context..."
                  rows={2}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg cursor-pointer"
                >
                  Commit Waypoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
