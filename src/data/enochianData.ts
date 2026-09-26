import { EnochianKey, EnochianLetter, EnochianWord, MonthConfig } from '../types/enochian';

export const ENOCHIAN_ALPHABET: EnochianLetter[] = [
  { letter: 'Un', name: 'Un', latinEquivalent: 'A', gematria: 1, elementalAffinity: 'Fire', tarotCorrespondence: 'The Sun', meaning: 'Original spark, Breath of God' },
  { letter: 'Pa', name: 'Pa', latinEquivalent: 'B', gematria: 2, elementalAffinity: 'Earth', tarotCorrespondence: 'The Hierophant', meaning: 'Vessel of creation, House' },
  { letter: 'Veh', name: 'Veh', latinEquivalent: 'C / K', gematria: 20, elementalAffinity: 'Spirit', tarotCorrespondence: 'The Magician', meaning: 'Supreme will, Crown' },
  { letter: 'Gal', name: 'Gal', latinEquivalent: 'D', gematria: 4, elementalAffinity: 'Water', tarotCorrespondence: 'The Empress', meaning: 'Flow, Door of the sanctuary' },
  { letter: 'Graph', name: 'Graph', latinEquivalent: 'E', gematria: 5, elementalAffinity: 'Air', tarotCorrespondence: 'The Lovers', meaning: 'Feather of truth, Sight' },
  { letter: 'Or', name: 'Or', latinEquivalent: 'F', gematria: 80, elementalAffinity: 'Fire', tarotCorrespondence: 'The Chariot', meaning: 'Pillar of flame, Strength' },
  { letter: 'Ged', name: 'Ged', latinEquivalent: 'G', gematria: 3, elementalAffinity: 'Water', tarotCorrespondence: 'The High Priestess', meaning: 'Sanctuary, Receptacle' },
  { letter: 'Na', name: 'Na', latinEquivalent: 'H', gematria: 8, elementalAffinity: 'Spirit', tarotCorrespondence: 'The Star', meaning: 'Spiritual light, Portal' },
  { letter: 'Gon', name: 'Gon', latinEquivalent: 'I / Y / J', gematria: 10, elementalAffinity: 'Fire', tarotCorrespondence: 'The Hermit', meaning: 'Divine hand, Seed' },
  { letter: 'Ur', name: 'Ur', latinEquivalent: 'L', gematria: 30, elementalAffinity: 'Air', tarotCorrespondence: 'Justice', meaning: 'Balance, Equilibrium' },
  { letter: 'Tal', name: 'Tal', latinEquivalent: 'M', gematria: 40, elementalAffinity: 'Water', tarotCorrespondence: 'The Hanged Man', meaning: 'Primordial waters, Dissolution' },
  { letter: 'Drux', name: 'Drux', latinEquivalent: 'N', gematria: 50, elementalAffinity: 'Water', tarotCorrespondence: 'Death', meaning: 'Transformation, Fish' },
  { letter: 'Med', name: 'Med', latinEquivalent: 'O', gematria: 70, elementalAffinity: 'Earth', tarotCorrespondence: 'The Devil', meaning: 'Eye of the Watcher, Foundation' },
  { letter: 'Mals', name: 'Mals', latinEquivalent: 'P', gematria: 80, elementalAffinity: 'Fire', tarotCorrespondence: 'The Tower', meaning: 'Voice of thunder, Flash' },
  { letter: 'Ger', name: 'Ger', latinEquivalent: 'Q', gematria: 100, elementalAffinity: 'Water', tarotCorrespondence: 'The Moon', meaning: 'Back of head, Subconscious' },
  { letter: 'Don', name: 'Don', latinEquivalent: 'R', gematria: 200, elementalAffinity: 'Air', tarotCorrespondence: 'The Sun / Judgement', meaning: 'Solar brilliance, Spirit head' },
  { letter: 'Fam', name: 'Fam', latinEquivalent: 'S', gematria: 60, elementalAffinity: 'Fire', tarotCorrespondence: 'Temperance', meaning: 'Bow of promise, Sacred arrow' },
  { letter: 'Gisg', name: 'Gisg', latinEquivalent: 'T', gematria: 9, elementalAffinity: 'Earth', tarotCorrespondence: 'The World', meaning: 'Mark of completion, Seal' },
  { letter: 'Van', name: 'Van', latinEquivalent: 'U / V / W', gematria: 6, elementalAffinity: 'Air', tarotCorrespondence: 'The Wheel of Fortune', meaning: 'Hook, Nail, Joining link' },
  { letter: 'Pal', name: 'Pal', latinEquivalent: 'X', gematria: 60, elementalAffinity: 'Earth', tarotCorrespondence: 'Strength', meaning: 'Crossroads, Fulcrum' },
  { letter: 'Ceph', name: 'Ceph', latinEquivalent: 'Z', gematria: 7, elementalAffinity: 'Air', tarotCorrespondence: 'The Emperor', meaning: 'Sword of discernment, Crowned king' }
];

export function calculateEnochianGematria(text: string): { total: number; breakdown: { char: string; val: number; letterName: string }[] } {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  const letterMap: Record<string, { val: number; name: string }> = {
    'A': { val: 1, name: 'Un' },
    'B': { val: 2, name: 'Pa' },
    'C': { val: 20, name: 'Veh' },
    'K': { val: 20, name: 'Veh' },
    'D': { val: 4, name: 'Gal' },
    'E': { val: 5, name: 'Graph' },
    'F': { val: 80, name: 'Or' },
    'G': { val: 3, name: 'Ged' },
    'H': { val: 8, name: 'Na' },
    'I': { val: 10, name: 'Gon' },
    'J': { val: 10, name: 'Gon' },
    'Y': { val: 10, name: 'Gon' },
    'L': { val: 30, name: 'Ur' },
    'M': { val: 40, name: 'Tal' },
    'N': { val: 50, name: 'Drux' },
    'O': { val: 70, name: 'Med' },
    'P': { val: 80, name: 'Mals' },
    'Q': { val: 100, name: 'Ger' },
    'R': { val: 200, name: 'Don' },
    'S': { val: 60, name: 'Fam' },
    'T': { val: 9, name: 'Gisg' },
    'U': { val: 6, name: 'Van' },
    'V': { val: 6, name: 'Van' },
    'W': { val: 6, name: 'Van' },
    'X': { val: 60, name: 'Pal' },
    'Z': { val: 7, name: 'Ceph' }
  };

  let total = 0;
  const breakdown = clean.split('').map(char => {
    const info = letterMap[char] || { val: 0, name: 'Unknown' };
    total += info.val;
    return { char, val: info.val, letterName: info.name };
  });

  return { total, breakdown };
}

export const FIRST_ENOCHIAN_KEY: EnochianKey = {
  id: 'enochian-key-1',
  keyNumber: 1,
  name: 'The First Enochian Call',
  englishTitle: 'The Opening of the Gates of Creation & Sovereign Justice',
  element: 'Spirit',
  watchtower: 'Tablet of Union',
  summary: 'The Primordial Key delivered by the Archangel Ave to Dr. John Dee and Sir Edward Kelley in 1584. It establishes the Supreme Sovereign Dominion of the God of Justice (Iad Balt) across the firmaments, commanding the Holy Watchers to reveal the mysteries of Creation to the faithful seeker.',
  angelicHierarchy: ['Iad Balt (God of Justice)', 'Iaida (The Highest)', 'Pir (Holy Ones / Angels)', 'Erm Iadnah (Ark of Knowledge)'],
  sacredGeometry: 'The Central Wheel of Spirit surrounded by the 4 Watchtower Tables, reflecting the Heptagram of Divine Governance and the Sigillum Dei Aemeth.',
  verses: [
    {
      stanzaNumber: 1,
      englishClauses: [
        { num: 1, text: 'I reign over you' },
        { num: 2, text: 'Saith the God of Justice' },
        { num: 3, text: 'In power exalted above' }
      ],
      enochianClauses: [
        { num: 1, text: 'Ol Sonf Vorsag', phonetics: 'Ol sonf vor-sah-geh' },
        { num: 2, text: 'Goho Iad Balt', phonetics: 'Go-ho ee-ah-deh bah-let' },
        { num: 3, text: 'Lonsh', phonetics: 'Lon-seh' }
      ],
      fullEnglish: 'I reign over you, saith the God of Justice, in power exalted above',
      fullEnochian: 'Ol sonf vorsag, goho Iad Balt, lonsh',
      phoneticRecitation: 'Ol son-ef vor-sah-gay, go-ho Ee-ah-day Bah-let, lon-seh',
      wordBreakdown: [
        { word: 'Ol', meaning: 'I / Myself (The Divine I AM)', phonetics: 'Ol', gematria: 100, grammar: 'Personal Pronoun (1st person)' },
        { word: 'Sonf', meaning: 'Reign / Rule / Sovereign Command', phonetics: 'Son-ef', gematria: 216, grammar: 'Verb (Present tense)' },
        { word: 'Vorsag', meaning: 'Over you / Above your realms', phonetics: 'Vor-sah-gay', gematria: 279, grammar: 'Preposition + Pronoun' },
        { word: 'Goho', meaning: 'Saith / Decrees / Speaks with authority', phonetics: 'Go-ho', gematria: 91, grammar: 'Verb of divine utterance' },
        { word: 'Iad', meaning: 'God / The Divine Source', phonetics: 'Ee-ah-deh', gematria: 15, grammar: 'Proper Noun (Divine Title)' },
        { word: 'Balt', meaning: 'Justice / Righteous Equilibrium', phonetics: 'Bah-let', gematria: 42, grammar: 'Noun of divine attribute' },
        { word: 'Lonsh', meaning: 'Power / Exalted Might / Dominion', phonetics: 'Lon-seh', gematria: 148, grammar: 'Noun of spiritual authority' }
      ],
      mysticalExplanation: 'The proclamation of absolute sovereign order. God as Iad Balt speaks not as a despot, but as the supreme mathematical and moral balance of the cosmos.'
    },
    {
      stanzaNumber: 2,
      englishClauses: [
        { num: 1, text: 'The Firmament of Wrath:' },
        { num: 2, text: 'In Whose Hands' },
        { num: 3, text: 'The Sun is as a sword' }
      ],
      enochianClauses: [
        { num: 1, text: 'Calz Vonpho', phonetics: 'Cahl-zeds von-fo' },
        { num: 2, text: 'Sobra Z-Ol', phonetics: 'Soh-brah zed-ol' },
        { num: 3, text: 'Ror I Ta Nazps', phonetics: 'Roh-reh ee tah nah-zeds-pehs' }
      ],
      fullEnglish: 'The Firmament of Wrath: In Whose Hands the Sun is as a sword',
      fullEnochian: 'Calz vonpho: sobra z-ol ror i ta nazps',
      phoneticRecitation: 'Cahl-zeds von-foh: soh-brah zed-ol roh-reh ee tah nah-zeds-pehs',
      wordBreakdown: [
        { word: 'Calz', meaning: 'Firmament / Vault of heaven', phonetics: 'Cahl-zeds', gematria: 58, grammar: 'Noun (Cosmic expanse)' },
        { word: 'Vonpho', meaning: 'Wrath / Tempest / Cleansing fury', phonetics: 'Von-foh', gematria: 242, grammar: 'Noun (Divine energy)' },
        { word: 'Sobra', meaning: 'In whose / Unto whom', phonetics: 'Soh-brah', gematria: 333, grammar: 'Relative pronoun' },
        { word: 'Z-Ol', meaning: 'Hands / Grasp / Directive palms', phonetics: 'Zed-ol', gematria: 107, grammar: 'Plural noun' },
        { word: 'Ror', meaning: 'The Sun / Solar radiance', phonetics: 'Roh-reh', gematria: 470, grammar: 'Celestial noun' },
        { word: 'I', meaning: 'Is / Exists as', phonetics: 'Ee', gematria: 10, grammar: 'Copula verb' },
        { word: 'Ta', meaning: 'As / Like unto', phonetics: 'Tah', gematria: 10, grammar: 'Comparative particle' },
        { word: 'Nazps', meaning: 'Sword / Piercing weapon of light', phonetics: 'Nah-zeds-pehs', gematria: 198, grammar: 'Symbolic noun' }
      ],
      mysticalExplanation: 'The Solar current as an active instrument of spiritual surgery and discernment, cutting through delusion in the celestial firmament.'
    },
    {
      stanzaNumber: 3,
      englishClauses: [
        { num: 1, text: 'And the Moon' },
        { num: 2, text: 'As a through-thrusting fire:' },
        { num: 3, text: 'Who measureth' }
      ],
      enochianClauses: [
        { num: 1, text: 'Od Graa', phonetics: 'Od grah-ah' },
        { num: 2, text: 'Ta Malprg', phonetics: 'Tah mahl-per-geh' },
        { num: 3, text: 'Ds Hol-Q', phonetics: 'Dehs hol-koo' }
      ],
      fullEnglish: 'And the Moon as a through-thrusting fire: Who measureth',
      fullEnochian: 'Od graa ta malprg: ds hol-q',
      phoneticRecitation: 'Od grah-ah tah mahl-pair-geh: dehs hole-koo',
      wordBreakdown: [
        { word: 'Od', meaning: 'And / In addition to', phonetics: 'Od', gematria: 74, grammar: 'Conjunction' },
        { word: 'Graa', meaning: 'The Moon / Reflective lunar lens', phonetics: 'Grah-ah', gematria: 205, grammar: 'Celestial noun' },
        { word: 'Ta', meaning: 'As / Resembling', phonetics: 'Tah', gematria: 10, grammar: 'Comparative' },
        { word: 'Malprg', meaning: 'Through-thrusting fire / Piercing sparks', phonetics: 'Mahl-per-geh', gematria: 324, grammar: 'Alchemical noun' },
        { word: 'Ds', meaning: 'Who / Which / He that', phonetics: 'Dehs', gematria: 64, grammar: 'Relative pronoun' },
        { word: 'Hol-Q', meaning: 'Measureth / Counts the dimensions', phonetics: 'Hole-koo', gematria: 208, grammar: 'Active verb' }
      ],
      mysticalExplanation: 'The Moon transmuting cold reflection into a penetrating fire of alchemical distillation, calibrating the cosmic measurements.'
    },
    {
      stanzaNumber: 4,
      englishClauses: [
        { num: 1, text: 'Your garments in the midst of my vestures' },
        { num: 2, text: 'And trussed you together' }
      ],
      enochianClauses: [
        { num: 1, text: 'Qaa Nothoa Zimz', phonetics: 'Kah-ah no-tho-ah zeem-zeds' },
        { num: 2, text: 'Od Commah', phonetics: 'Od com-mah' }
      ],
      fullEnglish: 'Your garments in the midst of my vestures and trussed you together',
      fullEnochian: 'Qaa nothoa zimz od commah',
      phoneticRecitation: 'Kah-ah no-tho-ah zeem-zeds od com-mah',
      wordBreakdown: [
        { word: 'Qaa', meaning: 'Your garments / Robes / Bodies of form', phonetics: 'Kah-ah', gematria: 102, grammar: 'Noun plural' },
        { word: 'Nothoa', meaning: 'In the midst of / Among', phonetics: 'No-tho-ah', gematria: 139, grammar: 'Preposition' },
        { word: 'Zimz', meaning: 'My vestures / Divine outer robes', phonetics: 'Zeem-zeds', gematria: 64, grammar: 'Possessive noun' },
        { word: 'Od', meaning: 'And', phonetics: 'Od', gematria: 74, grammar: 'Conjunction' },
        { word: 'Commah', meaning: 'Trussed you / Bound together / Gathered tightly', phonetics: 'Com-mah', gematria: 74, grammar: 'Verb (Past/perfective)' }
      ],
      mysticalExplanation: 'The divine garment encompassing all individualized consciousness, weaving the microcosm of the seeker into the macrocosmic vesture.'
    },
    {
      stanzaNumber: 5,
      englishClauses: [
        { num: 1, text: 'As the palms of my hands:' },
        { num: 2, text: 'Whose seat' },
        { num: 3, text: 'I garnished with the fire' }
      ],
      enochianClauses: [
        { num: 1, text: 'Ta Nobloh Zien', phonetics: 'Tah no-bloh zee-en' },
        { num: 2, text: 'Soba Thil', phonetics: 'Soh-bah theel' },
        { num: 3, text: 'Gnonp Prge', phonetics: 'G-non-peh pair-gay' }
      ],
      fullEnglish: 'As the palms of my hands: Whose seat I garnished with the fire',
      fullEnochian: 'Ta nobloh zien: soba thil gnonp prge',
      phoneticRecitation: 'Tah noh-bloh zee-en: soh-bah theel g-non-peh pair-gay',
      wordBreakdown: [
        { word: 'Ta', meaning: 'As / Even as', phonetics: 'Tah', gematria: 10, grammar: 'Comparative particle' },
        { word: 'Nobloh', meaning: 'Palms / Inward hands', phonetics: 'Noh-bloh', gematria: 130, grammar: 'Noun' },
        { word: 'Zien', meaning: 'My hands / Fingers', phonetics: 'Zee-en', gematria: 72, grammar: 'Noun' },
        { word: 'Soba', meaning: 'Whose / Of whom', phonetics: 'Soh-bah', gematria: 133, grammar: 'Relative pronoun' },
        { word: 'Thil', meaning: 'Seat / Throne / Center of dominion', phonetics: 'Theel', gematria: 47, grammar: 'Sacred noun' },
        { word: 'Gnonp', meaning: 'I garnished / Adorned / Laid out', phonetics: 'G-non-peh', gematria: 213, grammar: 'Verb' },
        { word: 'Prge', meaning: 'Fire / Sacred flames', phonetics: 'Pair-gay', gematria: 288, grammar: 'Elemental noun' }
      ],
      mysticalExplanation: 'The throne of consciousness resting safely in the palm of the Omnipresent Creator, guarded by elemental fire.'
    },
    {
      stanzaNumber: 6,
      englishClauses: [
        { num: 1, text: 'Of gathering:' },
        { num: 2, text: 'Who beautified' },
        { num: 3, text: 'Your garments with admiration:' }
      ],
      enochianClauses: [
        { num: 1, text: 'Aldi', phonetics: 'Ahl-dee' },
        { num: 2, text: 'Ds Vrbs', phonetics: 'Dehs ver-behs' },
        { num: 3, text: 'Obleh G Rsam', phonetics: 'Ob-leh geh er-sahm' }
      ],
      fullEnglish: 'Of gathering: Who beautified your garments with admiration:',
      fullEnochian: 'Aldi: ds vrbs obleh g rsam:',
      phoneticRecitation: 'Ahl-dee: dehs ver-behs ob-leh geh er-sahm',
      wordBreakdown: [
        { word: 'Aldi', meaning: 'Of gathering / Assembly of parts', phonetics: 'Ahl-dee', gematria: 45, grammar: 'Gerund / Noun' },
        { word: 'Ds', meaning: 'Who / Which', phonetics: 'Dehs', gematria: 64, grammar: 'Pronoun' },
        { word: 'Vrbs', meaning: 'Beautified / Adorned with grace', phonetics: 'Ver-behs', gematria: 268, grammar: 'Verb' },
        { word: 'Obleh', meaning: 'Your garments / Coverings', phonetics: 'Ob-leh', gematria: 105, grammar: 'Noun' },
        { word: 'G', meaning: 'With / And', phonetics: 'Geh', gematria: 3, grammar: 'Preposition' },
        { word: 'Rsam', meaning: 'Admiration / Wonder / Sacred glory', phonetics: 'Er-sahm', gematria: 301, grammar: 'Noun' }
      ],
      mysticalExplanation: 'The harmonic assembly of souls, dressed in radiant splendour by divine intention.'
    },
    {
      stanzaNumber: 7,
      englishClauses: [
        { num: 1, text: 'To Whom I made a law' },
        { num: 2, text: 'To govern the Holy Ones:' },
        { num: 3, text: 'Who delivered you' }
      ],
      enochianClauses: [
        { num: 1, text: 'Casarm Ohorela', phonetics: 'Cah-sahrm oh-ho-reh-lah' },
        { num: 2, text: 'Taba Pir', phonetics: 'Tah-bah peer' },
        { num: 3, text: 'Ds Zonrensg', phonetics: 'Dehs zon-ren-seh-geh' }
      ],
      fullEnglish: 'To Whom I made a law to govern the Holy Ones: Who delivered you',
      fullEnochian: 'Casarm ohorela taba pir: ds zonrensg',
      phoneticRecitation: 'Cah-sahrm oh-hoh-ray-lah tah-bah peer: dehs zon-ren-say-gay',
      wordBreakdown: [
        { word: 'Casarm', meaning: 'To whom / Unto whom', phonetics: 'Cah-sahrm', gematria: 321, grammar: 'Pronoun' },
        { word: 'Ohorela', meaning: 'I made a law / Decreed a statute', phonetics: 'Oh-hoh-ray-lah', gematria: 294, grammar: 'Verb + Noun clause' },
        { word: 'Taba', meaning: 'To govern / Rule with wisdom', phonetics: 'Tah-bah', gematria: 21, grammar: 'Infinitive verb' },
        { word: 'Pir', meaning: 'The Holy Ones / Angelic Host', phonetics: 'Peer', gematria: 290, grammar: 'Plural holy title' },
        { word: 'Ds', meaning: 'Who', phonetics: 'Dehs', gematria: 64, grammar: 'Relative pronoun' },
        { word: 'Zonrensg', meaning: 'Delivered / Handed down unto you', phonetics: 'Zon-ren-say-gay', gematria: 388, grammar: 'Verb (Action of transmission)' }
      ],
      mysticalExplanation: 'The cosmic constitution governing the Angelic Orders and the lineage of sacred knowledge transmitted down to mankind.'
    },
    {
      stanzaNumber: 8,
      englishClauses: [
        { num: 1, text: 'A rod' },
        { num: 2, text: 'With the Ark of Knowledge.' },
        { num: 3, text: 'Moreover Ye lifted up Your' }
      ],
      enochianClauses: [
        { num: 1, text: 'Cab', phonetics: 'Cah-beh' },
        { num: 2, text: 'Erm Iadnah', phonetics: 'Air-meh ee-ah-deh-nah' },
        { num: 3, text: 'Pilah Farzm', phonetics: 'Pee-lah far-zeds-meh' }
      ],
      fullEnglish: 'A rod with the Ark of Knowledge. Moreover Ye lifted up Your',
      fullEnochian: 'Cab erm Iadnah: pilah farzm',
      phoneticRecitation: 'Cah-beh air-meh Ee-ah-day-nah: pee-lah fahr-zeds-meh',
      wordBreakdown: [
        { word: 'Cab', meaning: 'A rod / Sceptre of power', phonetics: 'Cah-beh', gematria: 23, grammar: 'Noun (Symbol of authority)' },
        { word: 'Erm', meaning: 'With / Along with', phonetics: 'Air-meh', gematria: 245, grammar: 'Preposition' },
        { word: 'Iadnah', meaning: 'The Ark of Knowledge / Divine gnosis chest', phonetics: 'Ee-ah-day-nah', gematria: 84, grammar: 'Sacred compound noun' },
        { word: 'Pilah', meaning: 'Moreover / Furthermore', phonetics: 'Pee-lah', gematria: 129, grammar: 'Adverbial connector' },
        { word: 'Farzm', meaning: 'Ye lifted up / Raised aloft', phonetics: 'Fahr-zeds-meh', gematria: 337, grammar: 'Verb (Elevation)' }
      ],
      mysticalExplanation: 'The twin instruments of mastery: the Rod of Will (Cab) and the Ark of Divine Knowledge (Iadnah).'
    },
    {
      stanzaNumber: 9,
      englishClauses: [
        { num: 1, text: 'Voices and sware' },
        { num: 2, text: 'Obedience and faith' },
        { num: 3, text: 'To Him' },
        { num: 4, text: 'That liveth' }
      ],
      enochianClauses: [
        { num: 1, text: 'Znrza', phonetics: 'Zeds-ner-zah' },
        { num: 2, text: 'Adna Gono', phonetics: 'Ah-deh-nah go-no' },
        { num: 3, text: 'Iadpil', phonetics: 'Ee-ah-deh-peel' },
        { num: 4, text: 'Ds Hom Od', phonetics: 'Dehs hom od' }
      ],
      fullEnglish: 'Voices and sware obedience and faith to Him that liveth',
      fullEnochian: 'Znrza adna gono Iadpil ds hom od',
      phoneticRecitation: 'Zeds-ner-zah ah-deh-nah go-noh Ee-ah-deh-peel dehs hohm od',
      wordBreakdown: [
        { word: 'Znrza', meaning: 'Your voices / Chants / Sound vibration', phonetics: 'Zeds-ner-zah', gematria: 265, grammar: 'Noun plural' },
        { word: 'Adna', meaning: 'And sware / Pledged covenant', phonetics: 'Ah-deh-nah', gematria: 63, grammar: 'Verb (Covenant oath)' },
        { word: 'Gono', meaning: 'Obedience and faith / Loyalty', phonetics: 'Go-noh', gematria: 193, grammar: 'Noun' },
        { word: 'Iadpil', meaning: 'To Him / Unto God Himself', phonetics: 'Ee-ah-deh-peel', gematria: 144, grammar: 'Compound pronoun' },
        { word: 'Ds', meaning: 'That / Who', phonetics: 'Dehs', gematria: 64, grammar: 'Relative pronoun' },
        { word: 'Hom', meaning: 'Liveth / Breathes eternal life', phonetics: 'Hohm', gematria: 118, grammar: 'Verb (Life force)' },
        { word: 'Od', meaning: 'And', phonetics: 'Od', gematria: 74, grammar: 'Conjunction' }
      ],
      mysticalExplanation: 'The oath of the Angelic choir and the awakened seeker, harmonizing will with the Living Source of eternity.'
    },
    {
      stanzaNumber: 10,
      englishClauses: [
        { num: 1, text: 'Triumpheth:' },
        { num: 2, text: 'Whose beginning is not' },
        { num: 3, text: 'Nor end cannot be:' },
        { num: 4, text: 'Which' }
      ],
      enochianClauses: [
        { num: 1, text: 'Toh', phonetics: 'Toh' },
        { num: 2, text: 'Soba Ipam', phonetics: 'Soh-bah ee-pahm' },
        { num: 3, text: 'Lu Ipamis', phonetics: 'Loo ee-pah-mees' },
        { num: 4, text: 'Ds', phonetics: 'Dehs' }
      ],
      fullEnglish: 'Triumpheth: Whose beginning is not nor end cannot be: Which',
      fullEnochian: 'Toh: soba ipam lu ipamis: ds',
      phoneticRecitation: 'Toh: soh-bah ee-pahm loo ee-pah-mees: dehs',
      wordBreakdown: [
        { word: 'Toh', meaning: 'Triumpheth / Conquers through all ages', phonetics: 'Toh', gematria: 87, grammar: 'Verb' },
        { word: 'Soba', meaning: 'Whose', phonetics: 'Soh-bah', gematria: 133, grammar: 'Pronoun' },
        { word: 'Ipam', meaning: 'Beginning is not / Unbegotten', phonetics: 'Ee-pahm', gematria: 131, grammar: 'Negative noun-clause' },
        { word: 'Lu', meaning: 'Nor / Neither', phonetics: 'Loo', gematria: 36, grammar: 'Negative conjunction' },
        { word: 'Ipamis', meaning: 'End cannot be / Incorruptible limitlessness', phonetics: 'Ee-pah-mees', gematria: 198, grammar: 'Eternal attribute' },
        { word: 'Ds', meaning: 'Which / Who', phonetics: 'Dehs', gematria: 64, grammar: 'Pronoun' }
      ],
      mysticalExplanation: 'The timeless, beginningless, endless nature of the Absolute Monad, triumphing over all finite cycles.'
    },
    {
      stanzaNumber: 11,
      englishClauses: [
        { num: 1, text: 'Shineth as a flame in the midst of your palace' },
        { num: 2, text: 'And reigneth' }
      ],
      enochianClauses: [
        { num: 1, text: 'Loholo Vep Zomd Poamal', phonetics: 'Lo-ho-lo vehp zom-deh po-ah-mahl' },
        { num: 2, text: 'Od Bogpa', phonetics: 'Od bog-pah' }
      ],
      fullEnglish: 'Shineth as a flame in the midst of your palace and reigneth',
      fullEnochian: 'Loholo vep zomd poamal od bogpa',
      phoneticRecitation: 'Loh-hoh-loh veh-peh zom-deh poh-ah-mahl od bog-pah',
      wordBreakdown: [
        { word: 'Loholo', meaning: 'Shineth / Radiates pure white brilliance', phonetics: 'Loh-hoh-loh', gematria: 188, grammar: 'Verb' },
        { word: 'Vep', meaning: 'As a flame / Fire pillar', phonetics: 'Veh-peh', gematria: 106, grammar: 'Noun' },
        { word: 'Zomd', meaning: 'In the midst of / Center', phonetics: 'Zom-deh', gematria: 121, grammar: 'Preposition' },
        { word: 'Poamal', meaning: 'Your palace / Temple sanctum', phonetics: 'Poh-ah-mahl', gematria: 222, grammar: 'Noun (Sanctuary)' },
        { word: 'Od', meaning: 'And', phonetics: 'Od', gematria: 74, grammar: 'Conjunction' },
        { word: 'Bogpa', meaning: 'Reigneth / Presides', phonetics: 'Bog-pah', gematria: 155, grammar: 'Verb' }
      ],
      mysticalExplanation: 'The central Shekhinah / Divine Spark glowing within the interior castle of the soul and the cosmic temple.'
    },
    {
      stanzaNumber: 12,
      englishClauses: [
        { num: 1, text: 'Amongst you as the balance' },
        { num: 2, text: 'Of righteousness and truth.' },
        { num: 3, text: 'Move' }
      ],
      enochianClauses: [
        { num: 1, text: 'Aai Ta Piap', phonetics: 'Ah-ah-ee tah pee-ah-peh' },
        { num: 2, text: 'Piamol Od Vaoan', phonetics: 'Pee-ah-mohl od vah-oh-ahn' },
        { num: 3, text: 'Zacare', phonetics: 'Zah-cah-ray' }
      ],
      fullEnglish: 'Amongst you as the balance of righteousness and truth. Move',
      fullEnochian: 'Aai ta piap piamol od vaoan: zacare',
      phoneticRecitation: 'Ah-ah-ee tah pee-ah-peh pee-ah-mohl od vah-oh-ahn: zah-cah-ray',
      wordBreakdown: [
        { word: 'Aai', meaning: 'Amongst you / In your presence', phonetics: 'Ah-ah-ee', gematria: 12, grammar: 'Preposition' },
        { word: 'Ta', meaning: 'As', phonetics: 'Tah', gematria: 10, grammar: 'Particle' },
        { word: 'Piap', meaning: 'The balance / The scales', phonetics: 'Pee-ah-peh', gematria: 171, grammar: 'Noun (Equilibrium)' },
        { word: 'Piamol', meaning: 'Righteousness / Divine law', phonetics: 'Pee-ah-mohl', gematria: 201, grammar: 'Noun' },
        { word: 'Od', meaning: 'And', phonetics: 'Od', gematria: 74, grammar: 'Conjunction' },
        { word: 'Vaoan', meaning: 'Truth / Unshakable verity', phonetics: 'Vah-oh-ahn', gematria: 128, grammar: 'Noun' },
        { word: 'Zacare', meaning: 'Move / Stir yourselves / Arise into motion', phonetics: 'Zah-cah-ray', gematria: 233, grammar: 'Imperative verb' }
      ],
      mysticalExplanation: 'The stirring of dynamic action. Zacare is the great awakening command directed to the angelic hosts of the Watchtowers.'
    },
    {
      stanzaNumber: 13,
      englishClauses: [
        { num: 1, text: 'Therefore and show yourselves:' },
        { num: 2, text: 'Open the mysteries of' }
      ],
      enochianClauses: [
        { num: 1, text: '(e) Ca Od Zamran', phonetics: 'Eh cah od zahm-rahn' },
        { num: 2, text: 'Odo Cicle', phonetics: 'Oh-doh see-clay' }
      ],
      fullEnglish: 'Therefore and show yourselves: Open the mysteries of',
      fullEnochian: 'Ca od zamran: odo cicle',
      phoneticRecitation: 'Ay cah od zahm-rahn: oh-doh see-clay',
      wordBreakdown: [
        { word: 'Ca', meaning: 'Therefore / On this account', phonetics: 'Cah', gematria: 21, grammar: 'Conjunction' },
        { word: 'Od', meaning: 'And', phonetics: 'Od', gematria: 74, grammar: 'Conjunction' },
        { word: 'Zamran', meaning: 'Show yourselves / Appear visibly / Manifest', phonetics: 'Zahm-rahn', gematria: 308, grammar: 'Imperative verb' },
        { word: 'Odo', meaning: 'Open / Unlock / Unveil', phonetics: 'Oh-doh', gematria: 144, grammar: 'Imperative verb' },
        { word: 'Cicle', meaning: 'The mysteries / Secret cycles / Deep wisdom', phonetics: 'See-clay', gematria: 75, grammar: 'Noun plural' }
      ],
      mysticalExplanation: 'The imperative invocation for direct cognitive and spiritual communion with the celestial intelligences.'
    },
    {
      stanzaNumber: 14,
      englishClauses: [
        { num: 1, text: 'Creation.' },
        { num: 2, text: 'Be friendly unto me' },
        { num: 3, text: 'For I am' },
        { num: 4, text: 'The servant of the same' }
      ],
      enochianClauses: [
        { num: 1, text: 'Qaa', phonetics: 'Kah-ah' },
        { num: 2, text: 'Zorge', phonetics: 'Zor-gay' },
        { num: 3, text: 'Lap Zirdo', phonetics: 'Lah-peh zeer-doh' },
        { num: 4, text: 'Noco', phonetics: 'No-co' }
      ],
      fullEnglish: 'Creation. Be friendly unto me, for I am the servant of the same',
      fullEnochian: 'Qaa: zorge: lap zirdo noco',
      phoneticRecitation: 'Kah-ah: zor-gay: lah-peh zeer-doh noh-coh',
      wordBreakdown: [
        { word: 'Qaa', meaning: 'Creation / The fabric of being', phonetics: 'Kah-ah', gematria: 102, grammar: 'Noun' },
        { word: 'Zorge', meaning: 'Be friendly / Show gracious benevolence', phonetics: 'Zor-gay', gematria: 285, grammar: 'Imperative verb' },
        { word: 'Lap', meaning: 'For / Because', phonetics: 'Lah-peh', gematria: 111, grammar: 'Causal conjunction' },
        { word: 'Zirdo', meaning: 'I am / I exist in alignment', phonetics: 'Zeer-doh', gematria: 291, grammar: 'Verb (1st person copula)' },
        { word: 'Noco', meaning: 'The servant / The minister / Attendant', phonetics: 'Noh-coh', gematria: 140, grammar: 'Sacred title' }
      ],
      mysticalExplanation: 'The practitioner presents their credentials not with arrogance, but in humility as the conscious servant of cosmic harmony.'
    },
    {
      stanzaNumber: 15,
      englishClauses: [
        { num: 1, text: 'Your God,' },
        { num: 2, text: 'The true worshipper of' },
        { num: 3, text: 'The Highest.' }
      ],
      enochianClauses: [
        { num: 1, text: 'Mad', phonetics: 'Mah-deh' },
        { num: 2, text: 'Hoath', phonetics: 'Ho-ah-theh' },
        { num: 3, text: 'Iaida.', phonetics: 'Ee-ah-ee-dah' }
      ],
      fullEnglish: 'Your God, the true worshipper of the Highest.',
      fullEnochian: 'Mad: hoath Iaida.',
      phoneticRecitation: 'Mah-deh: hoh-ah-theh Ee-ah-ee-dah.',
      wordBreakdown: [
        { word: 'Mad', meaning: 'Your God / The Creator', phonetics: 'Mah-deh', gematria: 45, grammar: 'Divine Noun' },
        { word: 'Hoath', meaning: 'The true worshipper / Loyal devotee / Adept', phonetics: 'Hoh-ah-theh', gematria: 88, grammar: 'Honorific title' },
        { word: 'Iaida', meaning: 'The Highest / The Ineffable Supreme / Most High', phonetics: 'Ee-ah-ee-dah', gematria: 26, grammar: 'Ultimate Divine Name' }
      ],
      mysticalExplanation: 'The concluding seal: establishing the absolute identity of the true seeker as the devotee of IAIDA—The Highest.'
    }
  ]
};

export const ALL_ENOCHIAN_KEYS_SUMMARY = [
  {
    num: 1,
    title: 'First Call',
    theme: 'Opening of Creation & Justice',
    element: 'Spirit',
    firstWords: 'Ol Sonf Vorsag',
    description: 'Establishes sovereign authority and requests the angels to open the mysteries of creation.'
  },
  {
    num: 2,
    title: 'Second Call',
    theme: 'Motion and Stability',
    element: 'Spirit',
    firstWords: 'Adgt Vpaah Zong',
    description: 'Addresses the angelic wings and celestial wheels that balance the pillars of nature.'
  },
  {
    num: 3,
    title: 'Third Call',
    theme: 'Watchtower of the East (Air)',
    element: 'Air',
    firstWords: 'Micma Goho Piad',
    description: 'Invocations of the Watchtower of the East, invoking the angels of breath, thought, and swift wind.'
  },
  {
    num: 4,
    title: 'Fourth Call',
    theme: 'Watchtower of the South (Fire)',
    element: 'Fire',
    firstWords: 'Othil Goid Iad',
    description: 'Invocations of the Watchtower of the South, commanding the blazing lightnings and incandescent fire.'
  },
  {
    num: 5,
    title: 'Fifth Call',
    theme: 'Watchtower of the West (Water)',
    element: 'Water',
    firstWords: 'Sapaah Zimii Dool',
    description: 'Invocations of the Watchtower of the West, summoning the primordial oceanic currents and deep intuition.'
  },
  {
    num: 6,
    title: 'Sixth Call',
    theme: 'Watchtower of the North (Earth)',
    element: 'Earth',
    firstWords: 'Gah S Diu',
    description: 'Invocations of the Watchtower of the North, governing the mineral, crystal, and material foundations of earth.'
  },
  {
    num: 19,
    title: 'Call of the 30 Aethyrs (Aires)',
    theme: 'The 30 Celestial Spheres',
    element: 'The 30 Aethyrs',
    firstWords: 'Madriaax Ds Praf',
    description: 'The great key used with interchangeable Aethyr names (LIL, ARN, ZOR, PAZ, LIT, MAZ, DEO, ZID, ZIP, ZAX, ICH, LOE, ZIM, VTA, OXO, LEA, TAN, ZEN, POP, CHR, ASP, LIN, TOR, NIA, UTI, DES, ZAA, BAG, KHI, TEX).'
  }
];

export const MONTH_CONFIGS: MonthConfig[] = [
  { month: 1,  days: 30, portal: 4, quarter: 1, season: 'Spring' }, // Spring Equinox
  { month: 2,  days: 30, portal: 5, quarter: 1, season: 'Spring' },
  { month: 3,  days: 31, portal: 6, quarter: 1, season: 'Spring' }, // Intercalary / Summer Solstice
  { month: 4,  days: 30, portal: 6, quarter: 2, season: 'Summer' },
  { month: 5,  days: 30, portal: 5, quarter: 2, season: 'Summer' },
  { month: 6,  days: 31, portal: 4, quarter: 2, season: 'Summer' }, // Intercalary / Autumn Equinox
  { month: 7,  days: 30, portal: 3, quarter: 3, season: 'Autumn' },
  { month: 8,  days: 30, portal: 2, quarter: 3, season: 'Autumn' },
  { month: 9,  days: 31, portal: 1, quarter: 3, season: 'Autumn' }, // Intercalary / Winter Solstice
  { month: 10, days: 30, portal: 1, quarter: 4, season: 'Winter' },
  { month: 11, days: 30, portal: 2, quarter: 4, season: 'Winter' },
  { month: 12, days: 31, portal: 3, quarter: 4, season: 'Winter' }, // Intercalary / Year End
];
