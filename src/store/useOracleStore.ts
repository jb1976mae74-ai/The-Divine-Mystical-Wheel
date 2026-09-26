import { create } from 'zustand';
import { EnochicState, ENOCHIC_PASSAGE_REGISTRY } from '../types/enochicState';
import { EnochicPassage } from '../types/enochian';

interface OracleStore {
  currentState: EnochicState;
  activePassage: EnochicPassage;
  transitionTo: (nextState: EnochicState) => void;
  selectPassageById: (state: EnochicState, id: string) => void;
}

export const useOracleStore = create<OracleStore>((set, get) => ({
  currentState: 'AWAKENING_WATCHERS',
  activePassage: ENOCHIC_PASSAGE_REGISTRY.AWAKENING_WATCHERS[0],

  transitionTo: (nextState: EnochicState) => {
    const passages = ENOCHIC_PASSAGE_REGISTRY[nextState];
    const selectedPassage = passages[Math.floor(Math.random() * passages.length)];
    
    set({
      currentState: nextState,
      activePassage: selectedPassage,
    });
  },

  selectPassageById: (state: EnochicState, id: string) => {
    const passage = ENOCHIC_PASSAGE_REGISTRY[state].find((p) => p.id === id);
    if (passage) {
      set({ currentState: state, activePassage: passage });
    }
  },
}));
