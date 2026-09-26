export type SatelliteConstellation = 'GPS' | 'GLONASS' | 'Galileo' | 'BeiDou' | 'Celestial';

export interface SatelliteInfo {
  prn: number;
  constellation: SatelliteConstellation;
  elevation: number; // 0 - 90 deg
  azimuth: number;   // 0 - 360 deg
  snr: number;       // Signal to Noise Ratio (dBHz 0 - 55)
  locked: boolean;
  frequencyBand: string; // L1, L2, E1, B1, etc.
}

export interface GPSFixData {
  latitude: number;
  longitude: number;
  altitude: number; // meters
  accuracy: number; // meters
  altitudeAccuracy: number | null;
  heading: number | null; // degrees (0-360)
  speed: number | null;   // m/s
  speedKmh: number;
  speedKnots: number;
  speedMph: number;
  timestamp: number;
  fixType: 'NO_FIX' | '2D_FIX' | '3D_FIX' | 'DGPS' | 'RTK_FLOAT' | 'RTK_FIXED';
  hdop: number; // Horizontal Dilution of Precision
  vdop: number; // Vertical Dilution of Precision
  pdop: number; // Position Dilution of Precision
  satellitesInView: number;
  satellitesInUse: number;
  isSimulated: boolean;
  geoidHeightMeters: number;
}

export interface Waypoint {
  id: string;
  name: string;
  category: 'Sacred' | 'Tactical' | 'Kingdom Command' | 'Ancient Mystery' | 'Custom';
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  description: string;
  color: string;
  iconName: string;
  tags: string[];
  createdAt: string;
}

export interface NavigationRoute {
  id: string;
  name: string;
  origin: {
    name: string;
    lat: number;
    lng: number;
  };
  destination: {
    name: string;
    lat: number;
    lng: number;
  };
  totalDistanceKm: number;
  totalDistanceNauticalMiles: number;
  initialBearingDeg: number;
  estimatedTimeMin: number;
  travelMode: 'TERRESTRIAL' | 'AERIAL' | 'CELESTIAL_MANIFESTATION';
  waypoints: Waypoint[];
  instructions: RouteInstruction[];
}

export interface RouteInstruction {
  step: number;
  instruction: string;
  distanceKm: number;
  bearingDeg: number;
  cardinalDirection: string;
  esotericSignificance?: string;
}

export interface CoordinateConversions {
  dd: {
    latStr: string;
    lngStr: string;
    combined: string;
  };
  dms: {
    latStr: string;
    lngStr: string;
    combined: string;
  };
  mgrs: string;
  utm: string;
  celestialRaDec: {
    ra: string;
    dec: string;
    meridianPassage: string;
  };
}

export interface NMEAMessage {
  id: string;
  sentence: string;
  type: 'GGA' | 'RMC' | 'GSA' | 'GSV' | 'VTG';
  timestamp: string;
  description: string;
}
