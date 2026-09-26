import { GrandDesignNode } from '../data/grandDesignHierarchyData';

export interface GrandDesignNodeAiExegesis {
  nodeId: string;
  nodeName: string;
  hebrew: string;
  category: string;
  theologicalExegesis: string;
  metaphysicalPurpose: string;
  gematriaBreakdown: {
    primaryValue: string;
    hebrewEquation?: string;
    primeFactors?: string;
    reductionRoot?: string | number;
    symbolicAlignment: string;
  };
  electrodynamicHarmonics: {
    swrRatio: string;
    resonantFrequencyHz: string;
    waveProfile: string;
    entropyDampingFactor: string;
  };
  elementalMatrix: {
    spiritus: number;
    ignis: number;
    aqua: number;
    aer: number;
    materia: number;
  };
  scripturalAndScrollNexus: Array<{
    source: string;
    citation: string;
    relevance: string;
  }>;
  sovereignDirectives: string[];
  meditativeAffirmation: string;
  dimensionalCoordinates?: string;
  harmonicPurityScore?: number;
  oracleSignature?: string;
  generatedTimestamp?: string;
}

export interface NodeInquiryExchange {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  keyTakeaway?: string;
  practicalLiturgicalApplication?: string;
  resonanceFactor?: string;
}
