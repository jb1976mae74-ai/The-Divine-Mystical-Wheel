export interface PlanetaryHouseDef {
  houseNum: number;
  roman: string;
  latinName: string;
  englishTitle: string;
  subtitle: string;
  angleType: 'Angular' | 'Succedent' | 'Cadent';
  naturalSign: string;
  naturalSignSymbol: string;
  naturalRuler: string;
  naturalRulerSymbol: string;
  element: 'Ignis' | 'Materia' | 'Aer' | 'Aqua';
  domainKeywords: string[];
  description: string;
  esotericSignificance: string;
  meditationPrompt: string;
}

export const PLANETARY_HOUSES: PlanetaryHouseDef[] = [
  {
    houseNum: 1,
    roman: "I",
    latinName: "Vita",
    englishTitle: "House of Self & Incarnation",
    subtitle: "The Ascendant / Eastern Horizon",
    angleType: "Angular",
    naturalSign: "Aries",
    naturalSignSymbol: "♈",
    naturalRuler: "Mars",
    naturalRulerSymbol: "♂",
    element: "Ignis",
    domainKeywords: ["Identity", "Physical Form", "Vital Force", "First Impressions", "Ego Projection"],
    description: "The cusp of the 1st House is the Ascendant (Rising Sign)—the exact degree of the eastern horizon at the moment of your birth. It governs the physical body, outward appearance, immediate temperament, and the lens through which you meet the external cosmos.",
    esotericSignificance: "The portal of primary soul descent and conscious embodiment. Here the divine spark crystallizes into mortal form and asserts its sacred presence upon the earthly plane.",
    meditationPrompt: "How do I choose to present my sovereign divine spark to the world today?"
  },
  {
    houseNum: 2,
    roman: "II",
    latinName: "Lucrum",
    englishTitle: "House of Value & Material Substance",
    subtitle: "Resources & Tangible Foundations",
    angleType: "Succedent",
    naturalSign: "Taurus",
    naturalSignSymbol: "♉",
    naturalRuler: "Venus",
    naturalRulerSymbol: "♀",
    element: "Materia",
    domainKeywords: ["Material Assets", "Self-Worth", "Financial Acumen", "Physical Comfort", "Personal Values"],
    description: "Governs personal finances, tangible possessions, material security, and the innate value system. It reflects how you cultivate resources and ground your energetic creations into lasting reality.",
    esotericSignificance: "The alchemy of condensation. In this sphere, spiritual intention is transformed into physical sustenance and authentic self-worth free from earthly idolatry.",
    meditationPrompt: "What sacred resources and spiritual treasures am I cultivating for eternity?"
  },
  {
    houseNum: 3,
    roman: "III",
    latinName: "Fratres",
    englishTitle: "House of Mind & Communication",
    subtitle: "Local Realm & Cognitive Flow",
    angleType: "Cadent",
    naturalSign: "Gemini",
    naturalSignSymbol: "♊",
    naturalRuler: "Mercury",
    naturalRulerSymbol: "☿",
    element: "Aer",
    domainKeywords: ["Intellect", "Communication", "Local Journeys", "Siblings", "Early Learning"],
    description: "Governs the conscious intellect, speaking, writing, information processing, siblings, neighbors, and short daily voyages. It represents the active nervous system of your immediate world.",
    esotericSignificance: "The bridge between inner perception and outer speech (Logos). Here thought forms are transmuted into spoken frequencies that shape proximate reality.",
    meditationPrompt: "Are my daily words and thoughts aligning with high-frequency divine truth?"
  },
  {
    houseNum: 4,
    roman: "IV",
    latinName: "Genitor",
    englishTitle: "House of Home & Ancestral Roots",
    subtitle: "The Imum Coeli (IC) / Subterranean Anchor",
    angleType: "Angular",
    naturalSign: "Cancer",
    naturalSignSymbol: "♋",
    naturalRuler: "Moon",
    naturalRulerSymbol: "☽",
    element: "Aqua",
    domainKeywords: ["Ancestry", "Home Sanctuary", "Subconscious Safety", "Emotional Roots", "Lineage"],
    description: "The Imum Coeli (IC)—the lowest point of the chart. Governs your inner sanctuary, ancestral heritage, mother/father roots, psychological foundations, and private domestic refuge.",
    esotericSignificance: "The subterranean well of the soul. It represents the ancestral karmic reservoir and the subterranean bedrock upon which your entire life structure is built.",
    meditationPrompt: "How can I deepen my emotional roots and honor my sacred ancestral sanctuary?"
  },
  {
    houseNum: 5,
    roman: "V",
    latinName: "Nati",
    englishTitle: "House of Pleasure & Creative Fire",
    subtitle: "Joy, Art & Sovereign Expression",
    angleType: "Succedent",
    naturalSign: "Leo",
    naturalSignSymbol: "♌",
    naturalRuler: "Sun",
    naturalRulerSymbol: "☉",
    element: "Ignis",
    domainKeywords: ["Creative Passion", "Romance", "Play & Joy", "Artistic Works", "Children"],
    description: "Governs authentic creative expression, romantic magnetism, gambling/speculation, artistic pursuits, hobbies, entertainment, and the joyful celebration of life.",
    esotericSignificance: "The radiant solar altar of the heart. Here the soul pours forth uninhibited joy and births original artistic creations imbued with living light.",
    meditationPrompt: "What joyful creative fire is seeking release through my heart today?"
  },
  {
    houseNum: 6,
    roman: "VI",
    latinName: "Valetudo",
    englishTitle: "House of Health & Sacred Craft",
    subtitle: "Service, Daily Rituals & Healing",
    angleType: "Cadent",
    naturalSign: "Virgo",
    naturalSignSymbol: "♍",
    naturalRuler: "Mercury",
    naturalRulerSymbol: "☿",
    element: "Materia",
    domainKeywords: ["Daily Routines", "Physical Health", "Service to Others", "Work Habits", "Purification"],
    description: "Governs daily work routines, bodily wellness, nutrition, hygiene, service, pets, and the refinement of technical skill through disciplined practice.",
    esotericSignificance: "The sacred laboratory of purification. In this house, the physical vessel is cleansed and dedicated as a holy temple for higher service.",
    meditationPrompt: "Which daily habits and sacred disciplines are purifying my physical temple?"
  },
  {
    houseNum: 7,
    roman: "VII",
    latinName: "Uxor",
    englishTitle: "House of Partnerships & Mirrors",
    subtitle: "The Descendant (DSC) / Western Horizon",
    angleType: "Angular",
    naturalSign: "Libra",
    naturalSignSymbol: "♎",
    naturalRuler: "Venus",
    naturalRulerSymbol: "♀",
    element: "Aer",
    domainKeywords: ["Marriage", "Business Contracts", "Sacred Mirrors", "Diplomacy", "Shadow Projection"],
    description: "The Descendant marks the western cusp. Governs one-on-one relationships, marital unions, contractual alliances, negotiations, and open adversaries who reflect your unintegrated traits.",
    esotericSignificance: "The sacred mirror of otherness (The Sacred Marriage / Hieros Gamos). Through another soul, you encounter the hidden half of your own wholeness.",
    meditationPrompt: "What truth are my intimate relationships reflecting back into my awareness?"
  },
  {
    houseNum: 8,
    roman: "VIII",
    latinName: "Mors",
    englishTitle: "House of Transformation & Occult Depths",
    subtitle: "Death, Rebirth & Shared Alchemy",
    angleType: "Succedent",
    naturalSign: "Scorpio",
    naturalSignSymbol: "♏",
    naturalRuler: "Pluto & Mars",
    naturalRulerSymbol: "♇",
    element: "Aqua",
    domainKeywords: ["Spiritual Rebirth", "Occult Secrets", "Shared Finances", "Intimacy", "Inheritance"],
    description: "Governs deep psychological metamorphosis, esoteric mysteries, joint finances, inheritance, taxation, intimacy, and the spiritual dissolution that precedes resurrection.",
    esotericSignificance: "The alchemical crucible of Nigredo and resurrection. Here the mortal ego surrenders its illusions, allowing the immortal phoenix to rise from the ash.",
    meditationPrompt: "What must I bravely release into the alchemical fire to experience spiritual rebirth?"
  },
  {
    houseNum: 9,
    roman: "IX",
    latinName: "Iter",
    englishTitle: "House of Philosophy & Higher Wisdom",
    subtitle: "Transcendental Voyaging & Divine Law",
    angleType: "Cadent",
    naturalSign: "Sagittarius",
    naturalSignSymbol: "♐",
    naturalRuler: "Jupiter",
    naturalRulerSymbol: "♃",
    element: "Ignis",
    domainKeywords: ["Higher Learning", "Spiritual Law", "Global Travel", "Philosophy", "Publishing"],
    description: "Governs higher education, spiritual wisdom, cosmic philosophies, foreign travel, legal systems, publishing, prophecy, and the search for universal truth.",
    esotericSignificance: "The arrow of transcendent mind (Gnosis). This sphere elevates human intellect into divine contemplation of universal principles and cosmic order.",
    meditationPrompt: "What higher cosmic wisdom or horizon is calling my spirit forward?"
  },
  {
    houseNum: 10,
    roman: "X",
    latinName: "Regnum",
    englishTitle: "House of Career & Midheaven (MC)",
    subtitle: "Worldly Mastery, Reputation & Calling",
    angleType: "Angular",
    naturalSign: "Capricorn",
    naturalSignSymbol: "♑",
    naturalRuler: "Saturn",
    naturalRulerSymbol: "♄",
    element: "Materia",
    domainKeywords: ["Public Standing", "Vocation", "Authority", "Legacy", "Worldly Achievement"],
    description: "The Medium Coeli (MC) represents the zenith of the sky. Governs career pinnacle, public prestige, professional mastery, government/structural authority, and lifelong legacy.",
    esotericSignificance: "The mountaintop of earthly manifestation. Here the soul crystallizes its highest vocation and accepts stewardship over worldly systems.",
    meditationPrompt: "What enduring legacy of integrity and mastery am I destined to build?"
  },
  {
    houseNum: 11,
    roman: "XI",
    latinName: "Benefacta",
    englishTitle: "House of Community & Collective Visions",
    subtitle: "Allied Circles, Future Hopes & Synergy",
    angleType: "Succedent",
    naturalSign: "Aquarius",
    naturalSignSymbol: "♒",
    naturalRuler: "Uranus & Saturn",
    naturalRulerSymbol: "♅",
    element: "Aer",
    domainKeywords: ["Soul Allies", "Humanitarian Goals", "Social Networks", "Future Visions", "Ideals"],
    description: "Governs kindred soul groups, humanitarian movements, future aspirations, collaborative ideals, organizations, benefactors, and the collective evolution of humanity.",
    esotericSignificance: "The universal web of fellowship. In this sphere, individual souls unite in harmonic resonance to channel revolutionary light for the collective good.",
    meditationPrompt: "How can I align with kindred souls to manifest a higher collective future?"
  },
  {
    houseNum: 12,
    roman: "XII",
    latinName: "Carcer",
    englishTitle: "House of the Subconscious & Mystical Return",
    subtitle: "The Divine Void, Karma & Solitary Grace",
    angleType: "Cadent",
    naturalSign: "Pisces",
    naturalSignSymbol: "♓",
    naturalRuler: "Neptune & Jupiter",
    naturalRulerSymbol: "♆",
    element: "Aqua",
    domainKeywords: ["Subconscious", "Spiritual Liberation", "Karmic Synthesis", "Dreams", "Solitude"],
    description: "Governs the deepest subconscious, dream realms, solitary meditation, hidden enemies, institutions/retreats, ancestral karma, and the ultimate surrender to the divine source.",
    esotericSignificance: "The cosmic womb before rebirth and the ocean of mystical union. Here all earthly dualities dissolve into unconditional love and pure transcendent consciousness.",
    meditationPrompt: "What quiet truths are waiting to be uncovered in the sanctuary of silent contemplation?"
  }
];

export interface HousePersonalNote {
  houseNum: number;
  note: string;
  category: 'General' | 'Affirmation' | 'Transit Reflection' | 'Shadow Work' | 'Karmic Lesson' | 'Goal / Milestone';
  updatedAt: string;
}

export const HOUSE_NOTE_STORAGE_KEY = 'natal_chart_planetary_house_notes_v1';

export function loadSavedHouseNotes(): Record<number, HousePersonalNote> {
  try {
    const raw = localStorage.getItem(HOUSE_NOTE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load house notes from localStorage', err);
    return {};
  }
}

export function saveHouseNotesToStorage(notes: Record<number, HousePersonalNote>): void {
  try {
    localStorage.setItem(HOUSE_NOTE_STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn('Failed to save house notes to localStorage', err);
  }
}

// Basic Keplerian planetary calculations for house distribution mapping
export interface ResidentPlanetInfo {
  name: string;
  symbol: string;
  color: string;
  longitude: number;
  degreeFormatted: string;
  houseNum: number;
}

export function getHouseResidentPlanets(
  birthDate: string,
  birthTime: string = "12:00",
  lat: number = 31.2,
  lng: number = 29.919,
  tz: number = 2
): Record<number, ResidentPlanetInfo[]> {
  const result: Record<number, ResidentPlanetInfo[]> = {};
  for (let i = 1; i <= 12; i++) {
    result[i] = [];
  }

  if (!birthDate) return result;

  try {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = (birthTime || "12:00").split(':').map(Number);
    const hourUTC = hour - tz;
    
    let Y = year;
    let M = month;
    if (M <= 2) {
      Y -= 1;
      M += 12;
    }
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const jd = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5 + (hourUTC + (minute || 0) / 60) / 24;
    const d = jd - 2451545.0;

    const epsilon = 23.4392911 * Math.PI / 180;
    let gmst = 6.697374558 + 0.06570982441908 * d + ((jd - 0.5) % 1) * 24;
    gmst = ((gmst % 24) + 24) % 24;
    let lst = gmst + lng / 15.0;
    lst = ((lst % 24) + 24) % 24;
    const ramc = lst * 15 * Math.PI / 180;
    const latRad = lat * Math.PI / 180;

    let asc = Math.atan2(
      Math.cos(ramc),
      -Math.sin(ramc) * Math.cos(epsilon) - Math.tan(latRad) * Math.sin(epsilon)
    ) * 180 / Math.PI;
    asc = ((asc % 360) + 360) % 360;

    const houses: number[] = [];
    for (let h = 0; h < 12; h++) {
      houses.push(((asc + h * 30) % 360 + 360) % 360);
    }

    const zodiacSymbols = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
    const zodiacNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    const formatDeg = (long: number) => {
      const norm = ((long % 360) + 360) % 360;
      const sIdx = Math.floor(norm / 30) % 12;
      const deg = Math.floor(norm % 30);
      return `${deg}° ${zodiacSymbols[sIdx]} ${zodiacNames[sIdx]}`;
    };

    const planetsList = [
      { name: "Sun", symbol: "☉", color: "#F59E0B", calc: (dVal: number) => {
        const g = 357.528 + 0.9856003 * dVal;
        const L = 280.460 + 0.9856474 * dVal;
        return (L + 1.915 * Math.sin(g * Math.PI / 180) + 360) % 360;
      }},
      { name: "Moon", symbol: "☽", color: "#E2E8F0", calc: (dVal: number) => {
        const Lm = 218.316 + 13.176396 * dVal;
        const Mm = 134.963 + 13.064993 * dVal;
        return (Lm + 6.289 * Math.sin(Mm * Math.PI / 180) + 360) % 360;
      }},
      { name: "Mercury", symbol: "☿", color: "#38BDF8", calc: (dVal: number) => {
        const sunG = 357.528 + 0.9856003 * dVal;
        const sunL = 280.460 + 0.9856474 * dVal;
        const sLam = sunL + 1.915 * Math.sin(sunG * Math.PI / 180);
        const mMean = 252.250 + 4.092334 * dVal;
        return (sLam + 24 * Math.sin(mMean * Math.PI / 180) + 360) % 360;
      }},
      { name: "Venus", symbol: "♀", color: "#10B981", calc: (dVal: number) => {
        const sunG = 357.528 + 0.9856003 * dVal;
        const sunL = 280.460 + 0.9856474 * dVal;
        const sLam = sunL + 1.915 * Math.sin(sunG * Math.PI / 180);
        const vMean = 181.979 + 1.602130 * dVal;
        return (sLam + 44 * Math.sin(vMean * Math.PI / 180) + 360) % 360;
      }},
      { name: "Mars", symbol: "♂", color: "#EF4444", calc: (dVal: number) => {
        const L = 355.453 + 0.524020 * dVal;
        const M = 19.390 + 0.524033 * dVal;
        return (L + 9.5 * Math.sin(M * Math.PI / 180) + 360) % 360;
      }},
      { name: "Jupiter", symbol: "♃", color: "#FBBF24", calc: (dVal: number) => {
        const L = 34.404 + 0.083085 * dVal;
        const M = 20.020 + 0.083091 * dVal;
        return (L + 5.5 * Math.sin(M * Math.PI / 180) + 360) % 360;
      }},
      { name: "Saturn", symbol: "♄", color: "#6366F1", calc: (dVal: number) => {
        const L = 50.077 + 0.033459 * dVal;
        const M = 317.020 + 0.033444 * dVal;
        return (L + 6.3 * Math.sin(M * Math.PI / 180) + 360) % 360;
      }},
      { name: "Uranus", symbol: "♅", color: "#22D3EE", calc: (dVal: number) => {
        const L = 314.055 + 0.011733 * dVal;
        return (L + 5.2 * Math.sin((142.23 + 0.0117 * dVal) * Math.PI / 180) + 360) % 360;
      }},
      { name: "Neptune", symbol: "♆", color: "#A78BFA", calc: (dVal: number) => {
        const L = 304.348 + 0.005981 * dVal;
        return (L + 4.1 * Math.sin((256.22 + 0.0059 * dVal) * Math.PI / 180) + 360) % 360;
      }},
      { name: "Pluto", symbol: "♇", color: "#EC4899", calc: (dVal: number) => {
        const L = 238.928 + 0.003965 * dVal;
        return (L + 17.2 * Math.sin((14.88 + 0.0040 * dVal) * Math.PI / 180) + 360) % 360;
      }}
    ];

    planetsList.forEach(p => {
      const long = p.calc(d);
      let hIdx = 11;
      for (let h = 0; h < 12; h++) {
        const curCusp = houses[h];
        const nxtCusp = houses[(h + 1) % 12];
        const span = (nxtCusp - curCusp + 360) % 360;
        const pOffset = (long - curCusp + 360) % 360;
        if (pOffset >= 0 && pOffset < span) {
          hIdx = h;
          break;
        }
      }
      const hNum = hIdx + 1;
      result[hNum].push({
        name: p.name,
        symbol: p.symbol,
        color: p.color,
        longitude: long,
        degreeFormatted: formatDeg(long),
        houseNum: hNum
      });
    });

  } catch (err) {
    console.warn('Failed to calculate house placements', err);
  }

  return result;
}
