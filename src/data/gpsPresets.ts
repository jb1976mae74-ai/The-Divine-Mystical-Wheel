import { Waypoint, SatelliteInfo, CoordinateConversions, NMEAMessage } from '../types/gps';

export function getSavedBaseLocation(): {
  name: string;
  sector: string;
  lat: number;
  lng: number;
  altM: number;
  isLiveGps: boolean;
} {
  try {
    const saved = localStorage.getItem('military_base_anchor_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
        return parsed;
      }
    }
  } catch (e) {}
  return {
    name: 'Supreme Military Base of Operations (Albuquerque Command Citadel)',
    sector: 'Albuquerque, New Mexico, USA (Sector 505 / Sandia-Kirtland Basin)',
    lat: 35.0844,
    lng: -106.6504,
    altM: 1619,
    isLiveGps: false
  };
}

export function getBaseWaypoint(): Waypoint {
  const loc = getSavedBaseLocation();
  return {
    id: 'wp-kingdom-command',
    name: loc.name,
    category: 'Kingdom Command',
    latitude: loc.lat,
    longitude: loc.lng,
    altitudeMeters: loc.altM || 1619,
    description: `Central Tactical Command for the Supreme Fighting Force & ASFFU Operatives stationed at ${loc.sector}.`,
    color: '#ef4444',
    iconName: 'ShieldAlert',
    tags: ['Kingdom', 'Military', 'ASFFU', 'TFDAS', loc.isLiveGps ? 'Live Device GPS' : 'Base Command'],
    createdAt: '2026-08-30'
  };
}

export const SACRED_AND_TACTICAL_WAYPOINTS: Waypoint[] = [
  getBaseWaypoint(),
  {
    id: 'wp-mount-zion',
    name: 'Mount Zion (Holy of Holies Meridian)',
    category: 'Sacred',
    latitude: 31.7719,
    longitude: 35.2285,
    altitudeMeters: 765,
    description: 'Ancient sanctuary of the Ark of the Covenant and the Davidic Throne.',
    color: '#eab308',
    iconName: 'Crown',
    tags: ['Sacred', 'Davidic', 'Holy'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-giza-pyramid',
    name: 'Great Pyramid of Giza (Meridian Apex 0)',
    category: 'Ancient Mystery',
    latitude: 29.9792,
    longitude: 31.1342,
    altitudeMeters: 138,
    description: 'Astronomical geodesic anchor of the ancient world aligned to true North within 3/60ths of a degree.',
    color: '#f59e0b',
    iconName: 'Pyramid',
    tags: ['Ancient', 'Geodesy', 'Orion Correlation'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-mount-sinai',
    name: 'Mount Sinai (Horeb Peak of Revelation)',
    category: 'Sacred',
    latitude: 28.5395,
    longitude: 33.9753,
    altitudeMeters: 2285,
    description: 'Summit of divine communion where the Ten Commandments and celestial ordinances were inscribed.',
    color: '#38bdf8',
    iconName: 'Flame',
    tags: ['Theophany', 'Torah', 'Moses'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-babylon',
    name: 'Babylonian Ishtar Gateway & Etemenanki',
    category: 'Ancient Mystery',
    latitude: 32.5363,
    longitude: 44.4208,
    altitudeMeters: 34,
    description: 'Primeval cradle of astronomical ledgers, ziggurats, and the Enuma Elish tablets.',
    color: '#ec4899',
    iconName: 'Scroll',
    tags: ['Babylon', 'Astronomy', 'Ziggurat'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-stonehenge',
    name: 'Stonehenge Megalithic Solar Observatory',
    category: 'Ancient Mystery',
    latitude: 51.1789,
    longitude: -1.8262,
    altitudeMeters: 102,
    description: 'Neolithic celestial computer tracking solstices, lunar standstills, and eclipse cycles.',
    color: '#10b981',
    iconName: 'Orbit',
    tags: ['Megalithic', 'Solstice', 'Eclipse'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-mount-olympus',
    name: 'Mount Olympus (Mytikas Summit)',
    category: 'Ancient Mystery',
    latitude: 40.0856,
    longitude: 22.3586,
    altitudeMeters: 2918,
    description: 'Seat of classical mythological councils and high atmospheric celestial observatories.',
    color: '#a855f7',
    iconName: 'Mountain',
    tags: ['Greek', 'Mythology', 'Celestial'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-teotihuacan',
    name: 'Teotihuacan (Pyramid of the Sun)',
    category: 'Ancient Mystery',
    latitude: 19.6925,
    longitude: -98.8437,
    altitudeMeters: 2275,
    description: 'City of the Gods with Avenue of the Dead scaled to cosmic orbital distances.',
    color: '#f97316',
    iconName: 'Sun',
    tags: ['Mesoamerica', 'Solar', 'Alignments'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-vatican-archives',
    name: 'Vatican Apostolic Secret Archives',
    category: 'Tactical',
    latitude: 41.9038,
    longitude: 12.4542,
    altitudeMeters: 45,
    description: 'Repository of preserved historic manuscripts, ecclesiastical ledgers, and ancient codices.',
    color: '#6366f1',
    iconName: 'BookOpen',
    tags: ['Codices', 'Manuscripts', 'Archives'],
    createdAt: '2026-08-19'
  },
  {
    id: 'wp-easter-island',
    name: 'Easter Island (Ahu Tongariki Moai Grid)',
    category: 'Ancient Mystery',
    latitude: -27.1258,
    longitude: -109.2769,
    altitudeMeters: 18,
    description: 'Navel of the World (Te Pito o Te Henua) aligned to equinox sunrises.',
    color: '#06b6d4',
    iconName: 'Compass',
    tags: ['Polynesia', 'Equinox', 'Moai'],
    createdAt: '2026-08-19'
  }
];

export const INITIAL_SATELLITES: SatelliteInfo[] = [
  // GPS Navstar (USA)
  { prn: 1, constellation: 'GPS', elevation: 72, azimuth: 45, snr: 48, locked: true, frequencyBand: 'L1/L2C' },
  { prn: 7, constellation: 'GPS', elevation: 58, azimuth: 120, snr: 45, locked: true, frequencyBand: 'L1/L5' },
  { prn: 13, constellation: 'GPS', elevation: 34, azimuth: 285, snr: 39, locked: true, frequencyBand: 'L1' },
  { prn: 17, constellation: 'GPS', elevation: 84, azimuth: 180, snr: 52, locked: true, frequencyBand: 'L1/L2C/L5' },
  { prn: 21, constellation: 'GPS', elevation: 22, azimuth: 330, snr: 35, locked: true, frequencyBand: 'L1' },
  { prn: 30, constellation: 'GPS', elevation: 15, azimuth: 75, snr: 31, locked: false, frequencyBand: 'L1' },

  // Galileo (EU)
  { prn: 104, constellation: 'Galileo', elevation: 65, azimuth: 95, snr: 47, locked: true, frequencyBand: 'E1/E5a' },
  { prn: 111, constellation: 'Galileo', elevation: 49, azimuth: 210, snr: 44, locked: true, frequencyBand: 'E1/E5b' },
  { prn: 119, constellation: 'Galileo', elevation: 78, azimuth: 315, snr: 50, locked: true, frequencyBand: 'E1/E6' },
  { prn: 126, constellation: 'Galileo', elevation: 28, azimuth: 140, snr: 37, locked: true, frequencyBand: 'E1' },

  // GLONASS (Russia)
  { prn: 205, constellation: 'GLONASS', elevation: 54, azimuth: 30, snr: 42, locked: true, frequencyBand: 'G1/G2' },
  { prn: 212, constellation: 'GLONASS', elevation: 38, azimuth: 165, snr: 38, locked: true, frequencyBand: 'G1' },
  { prn: 222, constellation: 'GLONASS', elevation: 69, azimuth: 260, snr: 46, locked: true, frequencyBand: 'G1/G2' },

  // BeiDou (China)
  { prn: 303, constellation: 'BeiDou', elevation: 61, azimuth: 105, snr: 45, locked: true, frequencyBand: 'B1C/B2a' },
  { prn: 309, constellation: 'BeiDou', elevation: 42, azimuth: 235, snr: 40, locked: true, frequencyBand: 'B1I/B3I' },
  { prn: 318, constellation: 'BeiDou', elevation: 81, azimuth: 15, snr: 51, locked: true, frequencyBand: 'B1C/B2a' },

  // Celestial Archangelic Beacon Grid (Kingdom Defense Layer)
  { prn: 777, constellation: 'Celestial', elevation: 90, azimuth: 0, snr: 55, locked: true, frequencyBand: 'Seraphic 777' },
  { prn: 888, constellation: 'Celestial', elevation: 75, azimuth: 180, snr: 54, locked: true, frequencyBand: 'Metatron Cube' }
];

/**
 * Calculates Great-Circle Distance between two coordinates in Kilometers (Haversine Formula)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Calculates Initial Bearing / Forward Azimuth in Degrees (0 - 360)
 */
export function calculateBearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;
  return Number(bearing.toFixed(1));
}

/**
 * Convert Bearing to 16-point Cardinal Direction (N, NNE, NE, etc.)
 */
export function bearingToCardinal(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Convert Decimal Degrees to DMS (Degrees, Minutes, Seconds)
 */
export function ddToDms(val: number, isLatitude: boolean): string {
  const direction = isLatitude ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
  const absVal = Math.abs(val);
  const degrees = Math.floor(absVal);
  const minutesDec = (absVal - degrees) * 60;
  const minutes = Math.floor(minutesDec);
  const seconds = ((minutesDec - minutes) * 60).toFixed(2);
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

/**
 * Convert Decimal Degrees to UTM approximation
 */
export function ddToUtm(lat: number, lon: number): string {
  const zoneNumber = Math.floor((lon + 180) / 6) + 1;
  const isNorthern = lat >= 0;
  const zoneLetter = isNorthern ? 'N' : 'S';
  
  // Approximate projection for UI display
  const easting = Math.round(500000 + (lon - (zoneNumber * 6 - 183)) * 111320 * Math.cos((lat * Math.PI) / 180));
  const northing = Math.round(isNorthern ? lat * 111000 : 10000000 + lat * 111000);
  
  return `UTM Zone ${zoneNumber}${zoneLetter}  E:${Math.abs(easting)}m  N:${Math.abs(northing)}m`;
}

/**
 * Convert Decimal Degrees to Military Grid Reference System (MGRS)
 */
export function ddToMgrs(lat: number, lon: number): string {
  const zone = Math.floor((lon + 180) / 6) + 1;
  const latBands = 'CDEFGHJKLMNPQRSTUVWX';
  const bandIndex = Math.min(latBands.length - 1, Math.max(0, Math.floor((lat + 80) / 8)));
  const bandLetter = latBands[bandIndex] || 'N';

  const sq1 = String.fromCharCode(65 + (Math.abs(Math.floor(lon * 2)) % 26));
  const sq2 = String.fromCharCode(65 + (Math.abs(Math.floor(lat * 2)) % 26));
  const easting5 = String(Math.abs(Math.round(lon * 10000)) % 100000).padStart(5, '0');
  const northing5 = String(Math.abs(Math.round(lat * 10000)) % 100000).padStart(5, '0');

  return `${zone}${bandLetter} ${sq1}${sq2} ${easting5} ${northing5}`;
}

/**
 * Convert Coordinates to Celestial Right Ascension and Declination
 */
export function ddToCelestial(lat: number, lon: number): { ra: string; dec: string; meridianPassage: string } {
  // Approximate RA based on longitude offset
  const raHours = ((lon + 180) / 15) % 24;
  const h = Math.floor(raHours);
  const m = Math.floor((raHours - h) * 60);
  const s = Math.round(((raHours - h) * 60 - m) * 60);

  const decSign = lat >= 0 ? '+' : '-';
  const decDeg = Math.floor(Math.abs(lat));
  const decMin = Math.floor((Math.abs(lat) - decDeg) * 60);
  const decSec = Math.round(((Math.abs(lat) - decDeg) * 60 - decMin) * 60);

  return {
    ra: `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`,
    dec: `${decSign}${String(decDeg).padStart(2, '0')}° ${String(decMin).padStart(2, '0')}' ${String(decSec).padStart(2, '0')}"`,
    meridianPassage: `Sidereal Epoch J2000.0 (Zenith Anchor)`
  };
}

/**
 * Generate Comprehensive Coordinate Conversions Object
 */
export function convertCoordinates(lat: number, lon: number): CoordinateConversions {
  const latDd = `${lat.toFixed(6)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngDd = `${lon.toFixed(6)}° ${lon >= 0 ? 'E' : 'W'}`;
  
  const latDms = ddToDms(lat, true);
  const lngDms = ddToDms(lon, false);

  return {
    dd: {
      latStr: latDd,
      lngStr: lngDd,
      combined: `${lat.toFixed(6)}, ${lon.toFixed(6)}`
    },
    dms: {
      latStr: latDms,
      lngStr: lngDms,
      combined: `${latDms}, ${lngDms}`
    },
    mgrs: ddToMgrs(lat, lon),
    utm: ddToUtm(lat, lon),
    celestialRaDec: ddToCelestial(lat, lon)
  };
}

/**
 * Generate Realistic NMEA 0183 Sentences ($GPGGA, $GPRMC, $GPGSA, $GPGSV, $GPVTG)
 */
export function generateNMEASentences(lat: number, lon: number, alt: number, speedKnots: number, heading: number): NMEAMessage[] {
  const now = new Date();
  const utcHours = String(now.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
  const timeStr = `${utcHours}${utcMinutes}${utcSeconds}.00`;

  const latDeg = Math.floor(Math.abs(lat));
  const latMin = ((Math.abs(lat) - latDeg) * 60).toFixed(4);
  const nmeaLat = `${String(latDeg).padStart(2, '0')}${latMin}`;
  const latDir = lat >= 0 ? 'N' : 'S';

  const lonDeg = Math.floor(Math.abs(lon));
  const lonMin = ((Math.abs(lon) - lonDeg) * 60).toFixed(4);
  const nmeaLon = `${String(lonDeg).padStart(3, '0')}${lonMin}`;
  const lonDir = lon >= 0 ? 'E' : 'W';

  const dateStr = `${String(now.getUTCDate()).padStart(2, '0')}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCFullYear()).slice(-2)}`;

  // $GPGGA: Global Positioning System Fix Data
  const ggaSentence = `$GPGGA,${timeStr},${nmeaLat},${latDir},${nmeaLon},${lonDir},1,14,0.85,${alt.toFixed(1)},M,-18.2,M,,*47`;

  // $GPRMC: Recommended Minimum Specific GPS/Transit Data
  const rmcSentence = `$GPRMC,${timeStr},A,${nmeaLat},${latDir},${nmeaLon},${lonDir},${speedKnots.toFixed(1)},${heading.toFixed(1)},${dateStr},,,A*6C`;

  // $GPGSA: GPS DOP and Active Satellites
  const gsaSentence = `$GPGSA,A,3,01,07,13,17,21,104,111,119,205,222,303,318,1.4,0.85,1.1*32`;

  // $GPVTG: Track Made Good and Ground Speed
  const vtgSentence = `$GPVTG,${heading.toFixed(1)},T,,M,${speedKnots.toFixed(1)},N,${(speedKnots * 1.852).toFixed(1)},K,A*2E`;

  return [
    {
      id: `nmea-gga-${Date.now()}`,
      sentence: ggaSentence,
      type: 'GGA',
      timestamp: timeStr,
      description: '3D Fix Data, HDOP 0.85, Altitude & Geoid Separation'
    },
    {
      id: `nmea-rmc-${Date.now() + 1}`,
      sentence: rmcSentence,
      type: 'RMC',
      timestamp: timeStr,
      description: 'Active Navigation Data, Speed Over Ground & True Heading'
    },
    {
      id: `nmea-gsa-${Date.now() + 2}`,
      sentence: gsaSentence,
      type: 'GSA',
      timestamp: timeStr,
      description: 'Active 12-Satellite Array Lock, PDOP 1.4, HDOP 0.85, VDOP 1.1'
    },
    {
      id: `nmea-vtg-${Date.now() + 3}`,
      sentence: vtgSentence,
      type: 'VTG',
      timestamp: timeStr,
      description: 'Ground Velocity Vector & Course True North'
    }
  ];
}
