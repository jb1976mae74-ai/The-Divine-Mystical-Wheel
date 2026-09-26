import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Waypoint, GPSFixData } from '../../types/gps';
import { MapPin, Navigation, Compass, Layers, Crosshair, ZoomIn, ZoomOut, Maximize2, ShieldAlert } from 'lucide-react';

// Guard Leaflet's internal DomUtil position handlers against undefined DOM references
if (typeof window !== 'undefined' && L && L.DomUtil) {
  const origGetPosition = L.DomUtil.getPosition;
  if (origGetPosition) {
    L.DomUtil.getPosition = function (el: any) {
      if (!el) return new L.Point(0, 0);
      try {
        return origGetPosition.call(this, el) || (el._leaflet_pos || new L.Point(0, 0));
      } catch {
        return el._leaflet_pos || new L.Point(0, 0);
      }
    };
  }

  const origSetPosition = L.DomUtil.setPosition;
  if (origSetPosition) {
    L.DomUtil.setPosition = function (el: any, point: any) {
      if (!el) return;
      try {
        origSetPosition.call(this, el, point);
      } catch {
        try {
          el._leaflet_pos = point;
        } catch {}
      }
    };
  }
}

interface GPSMapCanvasProps {
  currentFix: GPSFixData;
  waypoints: Waypoint[];
  selectedWaypoint: Waypoint | null;
  onSelectWaypoint: (wp: Waypoint) => void;
  onAddWaypointAtCoord: (lat: number, lng: number) => void;
  activeRouteDestination: Waypoint | null;
  activeTheme: any;
}

export default function GPSMapCanvas({
  currentFix,
  waypoints,
  selectedWaypoint,
  onSelectWaypoint,
  onAddWaypointAtCoord,
  activeRouteDestination,
  activeTheme
}: GPSMapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const waypointMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const rangeCirclesRef = useRef<L.Circle[]>([]);

  const [mapLayer, setMapLayer] = useState<'dark' | 'satellite' | 'street' | 'topo'>('dark');
  const [showRangeRings, setShowRangeRings] = useState(true);
  const [followUser, setFollowUser] = useState(true);
  const [crosshairPos, setCrosshairPos] = useState<{ lat: number; lng: number }>({
    lat: currentFix.latitude,
    lng: currentFix.longitude
  });

  // Tile layer URL definitions
  const tileLayers = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any stale container references
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [currentFix.latitude, currentFix.longitude],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      const baseTile = L.tileLayer(tileLayers[mapLayer], {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      currentTileLayerRef.current = baseTile;
      mapInstanceRef.current = map;

      // Click handler to drop/inspect waypoints
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (e && e.latlng) {
          setCrosshairPos({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });

      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        if (e && e.latlng) {
          setCrosshairPos({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });

      map.on('dragstart', () => {
        setFollowUser(false);
      });
    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        }
      } catch (e) {
        console.warn('Leaflet map cleanup warning:', e);
      }
      mapInstanceRef.current = null;
      userMarkerRef.current = null;
      accuracyCircleRef.current = null;
      waypointMarkersRef.current.clear();
      routePolylineRef.current = null;
      rangeCirclesRef.current = [];
      currentTileLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    try {
      if (currentTileLayerRef.current) {
        map.removeLayer(currentTileLayerRef.current);
      }
      const newTile = L.tileLayer(tileLayers[mapLayer], {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);
      currentTileLayerRef.current = newTile;
    } catch (e) {
      console.warn('Tile layer switch error:', e);
    }
  }, [mapLayer]);

  // Update User Beacon Marker & Range Rings
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (!(map as any)._loaded || !(map as any)._container) return;

    try {
      const userLatLng = L.latLng(currentFix.latitude, currentFix.longitude);

      // Create or update pulsing User Beacon
      const userBeaconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></div>
          <div class="absolute w-6 h-6 rounded-full bg-cyan-500/50 border border-cyan-300"></div>
          <div class="relative w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] border-2 border-white flex items-center justify-center">
            <div class="w-1 h-1 rounded-full bg-black"></div>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userBeaconHtml,
        className: 'gps-user-beacon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng(userLatLng);
      }

      // Accuracy Circle
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle(userLatLng, {
          radius: Math.max(15, currentFix.accuracy),
          color: '#06b6d4',
          fillColor: '#0891b2',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 4'
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng(userLatLng);
        accuracyCircleRef.current.setRadius(Math.max(15, currentFix.accuracy));
      }

      // Range rings (1km, 5km, 10km)
      rangeCirclesRef.current.forEach(c => {
        try { map.removeLayer(c); } catch {}
      });
      rangeCirclesRef.current = [];

      if (showRangeRings) {
        [1000, 5000, 15000].forEach((radiusMeters, idx) => {
          const ring = L.circle(userLatLng, {
            radius: radiusMeters,
            color: idx === 0 ? '#38bdf8' : idx === 1 ? '#0284c7' : '#0369a1',
            fillOpacity: 0,
            weight: 1,
            dashArray: '3, 6'
          }).addTo(map);
          rangeCirclesRef.current.push(ring);
        });
      }

      if (followUser) {
        map.panTo(userLatLng, { animate: false });
      }
    } catch (e) {
      console.warn('Error updating GPS map user layer:', e);
    }
  }, [currentFix.latitude, currentFix.longitude, currentFix.accuracy, showRangeRings, followUser]);

  // Update Waypoint Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (!(map as any)._loaded || !(map as any)._container) return;

    try {
      // Remove obsolete markers
      const currentWpIds = new Set(waypoints.map(w => w.id));
      waypointMarkersRef.current.forEach((marker, id) => {
        if (!currentWpIds.has(id)) {
          try { map.removeLayer(marker); } catch {}
          waypointMarkersRef.current.delete(id);
        }
      });

      // Add or update waypoints
      waypoints.forEach(wp => {
        const isSelected = selectedWaypoint?.id === wp.id;
        const isDest = activeRouteDestination?.id === wp.id;
        const pinColor = isDest ? '#ef4444' : isSelected ? '#fbbf24' : wp.color || '#3b82f6';

        const pinHtml = `
          <div class="relative group cursor-pointer flex flex-col items-center">
            <div class="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase whitespace-nowrap bg-black/90 border border-white/20 text-white shadow-xl mb-1 ${isSelected ? 'ring-2 ring-amber-400' : ''}">
              ${wp.name.slice(0, 18)}
            </div>
            <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-125" style="background-color: ${pinColor}; border: 2px solid #ffffff;">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div class="w-0.5 h-2 bg-white/80 shadow-md"></div>
          </div>
        `;

        const wpIcon = L.divIcon({
          html: pinHtml,
          className: 'gps-waypoint-pin',
          iconSize: [120, 50],
          iconAnchor: [60, 48]
        });

        if (!waypointMarkersRef.current.has(wp.id)) {
          const marker = L.marker([wp.latitude, wp.longitude], { icon: wpIcon })
            .addTo(map)
            .on('click', () => {
              onSelectWaypoint(wp);
            });
          waypointMarkersRef.current.set(wp.id, marker);
        } else {
          const marker = waypointMarkersRef.current.get(wp.id)!;
          marker.setLatLng([wp.latitude, wp.longitude]);
          marker.setIcon(wpIcon);
        }
      });
    } catch (e) {
      console.warn('Error updating waypoint markers:', e);
    }
  }, [waypoints, selectedWaypoint, activeRouteDestination]);

  // Update Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (!(map as any)._loaded || !(map as any)._container) return;

    try {
      if (routePolylineRef.current) {
        map.removeLayer(routePolylineRef.current);
        routePolylineRef.current = null;
      }

      if (activeRouteDestination) {
        const latlngs: L.LatLngExpression[] = [
          [currentFix.latitude, currentFix.longitude],
          [activeRouteDestination.latitude, activeRouteDestination.longitude]
        ];

        const polyline = L.polyline(latlngs, {
          color: '#f59e0b',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round'
        }).addTo(map);

        routePolylineRef.current = polyline;

        // Fit map bounds safely to show both user and destination
        const bounds = L.latLngBounds(latlngs);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
        }
      }
    } catch (e) {
      console.warn('Error updating route polyline:', e);
    }
  }, [activeRouteDestination, currentFix.latitude, currentFix.longitude]);

  // Pan to selected waypoint
  useEffect(() => {
    if (selectedWaypoint && mapInstanceRef.current) {
      setFollowUser(false);
      try {
        mapInstanceRef.current.flyTo([selectedWaypoint.latitude, selectedWaypoint.longitude], 14, {
          duration: 1.2
        });
      } catch (e) {
        console.warn('FlyTo waypoint warning:', e);
      }
    }
  }, [selectedWaypoint]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Tactical HUD Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Real-time Position Pill */}
        <div className="pointer-events-auto flex items-center gap-2 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-mono shadow-xl text-cyan-300">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-bold text-white tracking-wider">GPS LIVE:</span>
          <span>{currentFix.latitude.toFixed(5)}°N, {currentFix.longitude.toFixed(5)}°E</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-300 font-semibold">{currentFix.altitude.toFixed(0)}m ALT</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">±{currentFix.accuracy.toFixed(1)}m</span>
        </div>

        {/* Map Layer Mode Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 bg-black/80 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-xl">
          {(['dark', 'satellite', 'street', 'topo'] as const).map(layer => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                mapLayer === layer
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Tactical Tools Panel (Right Side) */}
      <div className="absolute right-3 top-16 z-10 flex flex-col gap-1.5">
        {/* Follow User Toggle */}
        <button
          onClick={() => {
            setFollowUser(true);
            if (mapInstanceRef.current) {
              try {
                mapInstanceRef.current.stop();
                mapInstanceRef.current.panTo([currentFix.latitude, currentFix.longitude], { animate: true });
              } catch (e) {}
            }
          }}
          title="Center on GPS Location"
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-xl flex items-center justify-center ${
            followUser
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30'
              : 'bg-black/75 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Crosshair className={`w-4 h-4 ${followUser ? 'animate-spin' : ''}`} />
        </button>

        {/* Range Rings Toggle */}
        <button
          onClick={() => setShowRangeRings(!showRangeRings)}
          title="Toggle Tactical Range Rings (1km, 5km, 15km)"
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-xl flex items-center justify-center ${
            showRangeRings
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-black/75 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => {
            try { mapInstanceRef.current?.zoomIn(); } catch {}
          }}
          title="Zoom In"
          className="p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-xl flex items-center justify-center"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => {
            try { mapInstanceRef.current?.zoomOut(); } catch {}
          }}
          title="Zoom Out"
          className="p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-xl flex items-center justify-center"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Add Waypoint at Crosshair */}
        <button
          onClick={() => onAddWaypointAtCoord(crosshairPos.lat, crosshairPos.lng)}
          title="Drop Waypoint at Crosshairs"
          className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/30 to-rose-500/30 backdrop-blur-md border border-amber-500/50 text-amber-300 hover:text-white hover:scale-105 transition-all cursor-pointer shadow-xl flex items-center justify-center"
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      {/* Crosshair Cursor Coordinates Footer */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-[10px] font-mono text-slate-400 shadow-xl flex items-center gap-2">
          <span className="text-amber-400 font-bold">CURSOR RETICLE:</span>
          <span>{crosshairPos.lat.toFixed(5)}°N, {crosshairPos.lng.toFixed(5)}°E</span>
          <button
            onClick={() => onAddWaypointAtCoord(crosshairPos.lat, crosshairPos.lng)}
            className="text-[9px] font-bold text-cyan-300 hover:text-cyan-200 underline ml-1 cursor-pointer"
          >
            + Inscribe Waypoint
          </button>
        </div>

        {activeRouteDestination && (
          <div className="pointer-events-auto bg-amber-950/80 backdrop-blur-md border border-amber-500/50 px-3 py-1 rounded-lg text-[10px] font-mono text-amber-200 shadow-xl flex items-center gap-2">
            <Navigation className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="font-bold">GUIDANCE LOCKED:</span>
            <span>{activeRouteDestination.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
