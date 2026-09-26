export type ManifestationCategory = 
  | 'wealth_abundance'
  | 'health_vitality'
  | 'wisdom_scholarship'
  | 'creative_artefact'
  | 'sacred_sanctuary'
  | 'spiritual_authority'
  | 'relational_harmony';

export type ManifestationStatus = 
  | 'prima_conceptio' // Phase 1: Ideation / Mental Blueprint
  | 'anima_aetherica' // Phase 2: Emotional / Vibrational Condensation
  | 'alchemical_transmutation' // Phase 3: Energy / Spoken Logos / Sigilization
  | 'physical_crystallization' // Phase 4: Mundane Action / Realized 3D Form
  | 'completed'
  | 'archived'
  | 'cancelled';

export interface ElementalBalance {
  ignis: number; // Fire / Will / Action (1-10)
  aer: number;   // Air / Thought / Clarity (1-10)
  aqua: number;  // Water / Emotion / Feeling (1-10)
  terra: number; // Earth / Physical Anchor / Structure (1-10)
  quintessence: number; // Spirit / Detachment / Faith (1-10)
}

export interface SynchronicityEvidence {
  id: string;
  date: string;
  title: string;
  description: string;
  signType: 'numerical' | 'physical_lead' | 'encounter' | 'dream' | 'tangible_gain' | 'synchronicity';
  impactScore: number; // 1-10
}

export interface ManifestationStep {
  id: string;
  phase: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  category: 'mental' | 'emotional' | 'ritual' | 'physical';
}

export interface ManifestationExperiment {
  id: string;
  title: string;
  category: ManifestationCategory;
  targetDescription: string;
  tangibleMetrics: string; // Specific physical indicators of completion
  targetDate?: string;
  densityScore: number; // 0 to 100%
  status: ManifestationStatus;
  elementalBalance: ElementalBalance;
  solfeggioHz: number;
  intentionDecree: string;
  sigilNotes?: string;
  physicalAnchor: string; // The tactile physical object or daily physical action
  steps: ManifestationStep[];
  evidenceLog: SynchronicityEvidence[];
  journalNotes: string;
  createdAt: string;
  updatedAt: string;
  manifestedAt?: string;
  userId?: string;
}

export interface ManifestationText {
  id: string;
  title: string;
  author: string;
  era: string;
  tradition: string;
  category: ManifestationCategory | 'universal_law' | 'hermetic' | 'kabbalistic' | 'vedic' | 'quantum_physics';
  summary: string;
  fullExcerpt: string;
  corePrinciples: string[];
  practicalTechnique: string;
  fiatDecree: string;
  tags: string[];
  isCustomImported?: boolean;
  sourceUrl?: string;
}

export interface AlignmentAnalysisResponse {
  densityScore: number;
  dominantElement: string;
  elementalBalance: ElementalBalance;
  energeticBlockages: string[];
  transmutationPath: {
    phase1: string;
    phase2: string;
    phase3: string;
    phase4: string;
  };
  recommendedDecree: string;
  suggestedSolfeggioHz: number;
  physicalAnchorAction: string;
  alchemicalAdvice: string;
}
