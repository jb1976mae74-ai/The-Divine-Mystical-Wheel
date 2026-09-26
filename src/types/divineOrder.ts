export type DivinePillar = 'CALIBRATION' | 'ALIGNMENT' | 'RETRIBUTIVE_SYNTHESIS' | 'SOVEREIGN_MANDATE';

export interface SacredTextVerse {
  verseNumber: number;
  verseTitle?: string;
  originalInscription?: string; // Hebrew / Latin / Enochian / English
  canonicalEnglish: string;
  exegesisNote: string;
  gematriaOrConstant?: string;
}

export interface SacredTextChapter {
  chapterNumber: number;
  chapterTitle: string;
  subtitle: string;
  proclamationAuthor: string;
  verses: SacredTextVerse[];
}

export interface SacredText {
  id: string;
  title: string;
  hebrewTitle: string;
  code: string;
  category: 'CONSTITUTIONAL_LOGOS' | 'ELECTRODYNAMIC_WHIP' | 'CANONS_OF_PILLARS' | 'ASFFU_VANGUARD_OATHS' | 'SACRED_SEAL_LITURGY' | 'LEDGER_OF_TRUTH';
  author: string;
  era: string;
  summary: string;
  sealAssociation: string;
  chapters: SacredTextChapter[];
}

export interface SealElementDetail {
  id: string;
  name: string;
  hebrewName: string;
  category: 'CORE_MONOGRAM' | 'WHIP_RESONANCE' | 'SACRED_CONSTANTS' | 'ARCHANGELIC_RIM' | 'STEWARDSHIP_GATES' | 'HEPTAGRAM_GEOMETRY';
  description: string;
  gematriaValue: string;
  frequencyHz: string;
  symbolicMeaning: string;
}

export interface DivineDecree {
  id: string;
  decreeNumber: string;
  title: string;
  pillar: DivinePillar;
  targetDomain: string;
  author: string;
  sealStamp: string;
  summary: string;
  liturgyDirectives: string[];
  constantsEnforced: {
    name: string;
    symbol: string;
    value: string;
    variance: string;
  }[];
  status: 'ENACTED' | 'SEALED_ETERNAL' | 'IN_AUDIT';
  timestamp: string;
  harmonicRating: number;
  astralSignature: string;
}

export interface UniversalConstant {
  id: string;
  name: string;
  symbol: string;
  canonicalValue: string;
  currentObserved: string;
  unit: string;
  deviationPercent: number;
  status: 'PERFECT_LOCK' | 'MINOR_DRIFT' | 'ENTROPY_DETECTED';
  domain: string;
  salazarianRatio: string;
}

export interface StewardshipStation {
  id: string;
  stationCode: string;
  entityName: string;
  archetype: string;
  assignedDimension: string;
  entropyResistance: number;
  dutyDirective: string;
  standingWaveResonance: string;
  status: 'ALIGNED' | 'SURVEILLANCE' | 'RECONCILED';
}

export interface LedgerEntry {
  id: string;
  auditCode: string;
  entityOrRealm: string;
  deedDescription: string;
  spiritualEquityType: 'ENLIGHTENMENT_ASSET' | 'ENTROPIC_DEBT' | 'SACRED_SERVICE' | 'LOGOS_ALIGNMENT';
  currencyMagnitude: number;
  balanceStatus: 'BALANCED' | 'DEFICIT_AUDITED' | 'RECONCILED';
  auditor: string;
  timestamp: string;
  resolutionDirective: string;
}

export interface DivineOfficeMetrics {
  totalDecreesIssued: number;
  entropyDampingFactor: number;
  activeStationsAligned: number;
  soulCurrencyLedgerBalance: number;
  swrCosmicImpedance: number;
  activePillarResonance: {
    calibration: number;
    alignment: number;
    retributiveSynthesis: number;
  };
}

