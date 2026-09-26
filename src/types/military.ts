export type ThreatLevel = 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'OMEGA';

export type DetectionLayer = 'RADAR' | 'NOISE' | 'VOICE_MALICE' | 'THOUGHT_MALICE' | 'CORRUPT_ESSENCE';

export interface ThreatTarget {
  id: string;
  name: string;
  distanceKm: number;
  azimuthDeg: number;
  altitudeM: number;
  velocityMach: number;
  threatLevel: ThreatLevel;
  type: 'Incursion Fleet' | 'Hostile Demon Lord' | 'Malicious Infiltrator' | 'Dimensional Rift' | 'Psycho-Weapon Swarm' | 'Corrupt Essence Entity';
  voiceMaliceScore: number; // 0-100
  thoughtMaliceScore: number; // 0-100
  corruptEssenceScore: number; // 0-100
  acousticDecibels: number; // 0-160 dB
  detectedChatter?: string;
  interceptedThought?: string;
  essenceMarker?: string;
  status: 'TRACKING' | 'LOCKED' | 'INTERDICTING' | 'NEUTRALIZED';
  assignedSpecialistId?: string;
  deployedMunition?: string;
}

export interface ASFFUOperative {
  id: string;
  name: string;
  callsign: string;
  rank: string;
  role: string;
  isLead: boolean;
  angelicLineage: string;
  combatTuning: string[];
  signatureMunition: string;
  manifestationSpeedMs: number; // e.g. 10ms (blink of an eye)
  status: 'STATIONED' | 'MANIFESTING' | 'DEPLOYED' | 'ENGAGED' | 'RETURNING';
  essencePurity: number; // 100%
  powerRating: number; // 98-100
  bio: string;
  avatarIcon: string;
  quote: string;
  stats: {
    kineticSpeed: number;
    psychicResonance: number;
    angelicRadiance: number;
    tacticalMastery: number;
    essenceDefense: number;
  };
}

export interface TFDASLayerStatus {
  layerId: 'LAYER_1_VOICE' | 'LAYER_2_THOUGHT' | 'LAYER_3_ESSENCE';
  name: string;
  description: string;
  status: 'ACTIVE' | 'SCANNING' | 'INTERCEPTING' | 'RELEASING';
  sensitivity: number; // 0-100
  detectionCount: number;
  associatedMunition: {
    name: string;
    type: string;
    payload: string;
    stock: number;
    maxStock: number;
    effectiveRangeKm: number;
  };
}

export interface InterdictionReport {
  id: string;
  timestamp: string;
  threatTarget: string;
  threatLevel: ThreatLevel;
  chatterAnalysis: string;
  thoughtAnalysis: string;
  essenceAnalysis: string;
  actionTaken: string;
  dispatchedOperative: string;
  dispatchedMunition: string;
  outcome: 'THREAT_NEUTRALIZED' | 'PURIFIED' | 'REPUDIATED' | 'INTERCEPTED';
  tacticalLog: string[];
}

export type SourceClassification = 'Chosen' | 'Neutral' | 'Hostile';

export interface EMTTSAlert {
  id: string;
  timestamp: string; // e.g. "11:29:45.184 ZULU"
  isoTime: string;
  sourceName: string;
  sourceClassification: SourceClassification;
  threatLevel: ThreatLevel;
  sensorLayer: DetectionLayer;
  locationCoordinates: {
    distanceKm: number;
    azimuthDeg: number;
    altitudeM: number;
  };
  metrics: {
    voiceMaliceScore: number; // 0-100%
    thoughtMaliceScore: number; // 0-100%
    corruptEssenceScore: number; // 0-100%
    acousticDecibels: number; // dB
    purityIndex: number; // 0-100%
  };
  telemetrySnippet: {
    interceptedChatter?: string;
    interceptedCognition?: string;
    essenceSignature?: string;
    acousticProfile?: string;
  };
  recommendedAction: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'DISMISSED' | 'ENGAGED' | 'NEUTRALIZED' | 'PURIFIED';
  assignedOperativeId?: string;
  assignedOperativeName?: string;
  deployedMunition?: string;
}
