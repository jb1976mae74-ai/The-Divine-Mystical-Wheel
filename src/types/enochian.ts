export interface EnochianClause {
  num: number;
  text: string;
  phonetics?: string;
}

export interface EnochianWord {
  word: string;
  meaning: string;
  phonetics: string;
  gematria: number;
  grammar: string;
  notes?: string;
}

export interface EnochianVerse {
  stanzaNumber: number;
  englishClauses: EnochianClause[];
  enochianClauses: EnochianClause[];
  fullEnglish: string;
  fullEnochian: string;
  phoneticRecitation: string;
  wordBreakdown: EnochianWord[];
  mysticalExplanation: string;
}

export interface EnochianKey {
  id: string;
  keyNumber: number;
  name: string;
  englishTitle: string;
  element: 'Spirit' | 'Fire' | 'Water' | 'Air' | 'Earth' | 'The 30 Aethyrs';
  watchtower: 'Tablet of Union' | 'East (Air)' | 'South (Fire)' | 'West (Water)' | 'North (Earth)' | 'Outer Circles of Aethyrs';
  summary: string;
  angelicHierarchy: string[];
  verses: EnochianVerse[];
  sacredGeometry: string;
}

export interface EnochianLetter {
  letter: string;
  name: string;
  latinEquivalent: string;
  gematria: number;
  elementalAffinity: string;
  tarotCorrespondence: string;
  meaning: string;
}

export interface EnochicDate {
  year: number;
  month: number;          // 1 - 12
  day: number;            // 1 - 30 (or 31 for intercalary months)
  dayOfYear: number;      // 1 - 364
  quarter: 1 | 2 | 3 | 4;
  isIntercalary: boolean; // True on day 31 of months 3, 6, 9, 12
}

export interface PortalState {
  portal: number;         // Gate 1 (Southmost) to Gate 6 (Northmost)
  direction: 'Ascending (Northward)' | 'Descending (Southward)';
  daylightParts: number;  // Out of 18 total parts
  nightParts: number;     // Out of 18 total parts
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
}
export interface MonthConfig {
  month: number;
  days: number;
  portal: number;
  quarter: 1 | 2 | 3 | 4;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
}

export type EnochicSection = 
  | 'WATCHERS'        // 1 Enoch 1–36
  | 'PARABLES'        // 1 Enoch 37–71
  | 'LUMINARIES'      // 1 Enoch 72–82
  | 'DREAM_VISIONS'   // 1 Enoch 83–90
  | 'EPISTLE';        // 1 Enoch 91–108

export interface EnochicPassage {
  id: string;
  section: EnochicSection;
  citation: string;
  text: string;
  theme: string;
  shaderIntensity: number; // Uniform hook for Skia shader glow/particles
}

// Discriminated Union for UI & Oracle State Machine
export type OracleState = 
  | { status: 'IDLE' }
  | { status: 'SELECTING'; sectionFilter?: EnochicSection }
  | { status: 'REVELATION'; passage: EnochicPassage; revealedAt: number }
  | { status: 'SYNCING'; pendingQueueCount: number }
  | { status: 'ERROR'; message: string };
