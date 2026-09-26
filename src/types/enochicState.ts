import { EnochicPassage } from './enochian';

export type EnochicState = 'AWAKENING_WATCHERS';

export const ENOCHIC_PASSAGE_REGISTRY: Record<EnochicState, EnochicPassage[]> = {
  'AWAKENING_WATCHERS': [
    {
      id: 'watchers-001',
      section: 'WATCHERS',
      citation: '1 Enoch 1:1',
      text: 'The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be living in the day of tribulation, when all the wicked and godless are to be removed.',
      theme: 'Blessing',
      shaderIntensity: 0.5,
    },
  ],
};
