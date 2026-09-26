export type WisdomPillarId = 
  | 'PILLAR_1_GEOMETRY' 
  | 'PILLAR_2_MEASURES' 
  | 'PILLAR_3_HARMONICS' 
  | 'PILLAR_4_DISCERNMENT' 
  | 'PILLAR_5_COUNSEL' 
  | 'PILLAR_6_CRYSTALLIZATION' 
  | 'PILLAR_7_AWE';

export interface WisdomPillar {
  id: WisdomPillarId;
  pillarNumber: number;
  title: string;
  hebrewName: string;
  transliteration: string;
  epithet: string;
  scripturalFoundations: string[];
  canonicalVerse: string;
  architecturalFunction: string;
  geometricProof: string;
  sacredRatio: string;
  frequencyHz: number;
  cymaticPattern: string;
  colorHex: string;
  cosmicDomain: string;
  description: string;
  liturgicalFormula: string;
  structuralIntegrityScore: number;
}

export interface ArchitecturalBlueprint {
  id: string;
  blueprintCode: string;
  title: string;
  hebrewName: string;
  pillarAffinity: WisdomPillarId;
  cosmicScale: 'SUBATOMIC' | 'PLANETARY' | 'CELESTIAL_SPHERES' | 'TEMPLE_SANCTUM' | 'METAVERSE_COSMOS';
  sacredGeometryType: 'GOLDEN_COMPASS' | 'NEW_JERUSALEM_CUBE' | 'TABERNACLE_PROPORTIONS' | 'FLOWER_OF_LIFE' | 'VECTOR_EQUILIBRIUM' | 'SALAZARIAN_76_WHEEL';
  dimensionalRatios: string[];
  keyEquations: string[];
  materialSpiritualMatrix: string;
  description: string;
  canonicalPassages: string[];
  svgPreset: string;
  status: 'DRAFTED_BY_CHOKHMAH' | 'ENGRAVED_IN_TEHOM' | 'ACTIVE_COSMIC_LAW' | 'ESTABLISHED_ETERNAL';
  authoritativeSeal: string;
}

export interface DivineMetrologyUnit {
  id: string;
  name: string;
  hebrewName: string;
  scriptureReference: string;
  category: 'LINEAR_SPAN' | 'VOLUME_FLUID' | 'WEIGHT_BALANCE' | 'TEMPORAL_CYCLE';
  ancientValue: string;
  modernEquivalent: string;
  quantumCosmicEquivalence: string;
  architecturalSignificance: string;
  interactiveRatio: number;
}

export interface BlueprintDecree {
  id: string;
  decreeCode: string;
  title: string;
  hebrewTitle: string;
  pillarId: WisdomPillarId;
  targetDomain: string;
  architecturalIntent: string;
  geometricAxiom: string;
  materialSpecification: string;
  harmonicResonance: string;
  liturgyFormula: string[];
  sealAuthority: string;
  status: 'ESTABLISHED_ETERNAL' | 'IN_CONSTRUCTION' | 'CALIBRATING';
  timestamp: string;
  harmonicLockPercent: number;
}

export interface MorningStarTone {
  name: string;
  frequencyHz: number;
  hebrewName: string;
  celestialBody: string;
  harmonicRatio: string;
  spiritualResonance: string;
  description: string;
}

export interface WisdomDialogueMessage {
  id: string;
  sender: 'SEEKER' | 'SOPHIA_ARCHITECT';
  text: string;
  timestamp: string;
  scriptureCitations?: string[];
  geometricInsight?: string;
  pillarTag?: string;
}
