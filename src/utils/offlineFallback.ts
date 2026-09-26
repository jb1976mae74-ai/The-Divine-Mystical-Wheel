/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SCRIPTURAL_DATABASE, ScriptureVerse } from "../data/scripturalData";

interface ZodiacDetails {
  sign: string;
  symbol: string;
  element: string;
  planet: string;
  archetype: string;
  challenge: string;
  insight: string;
}

const getZodiacDetails = (sign: string): ZodiacDetails => {
  const norm = sign ? sign.trim().toLowerCase() : "";
  switch (norm) {
    case "aries":
      return {
        sign: "Aries",
        symbol: "♈",
        element: "Fire (Ignis)",
        planet: "Mars",
        archetype: "The Spark of Cosmic Will",
        challenge: "Subduing impatience and directing raw force into conscious ascension, rather than scattershot destruction.",
        insight: "As an Aries seeker, your spirit is a direct manifestation of Ignis—unrefined, primal celestial flame. Your query is driven by a desire for immediate, radical breakthroughs. To achieve true alignment, you must learn to harbor the heat within, allowing your alchemical furnace to reach absolute resonance without burning through the vessel. Your spiritual work is the transmutation of impulsive action into focused, deliberate creation, ensuring that the heavy steel barrel at your base is properly grounded to receive and project divine directives."
      };
    case "taurus":
      return {
        sign: "Taurus",
        symbol: "♉",
        element: "Earth (Materia)",
        planet: "Venus",
        archetype: "The Sacred Golden Vessel",
        challenge: "Dismantling the fixation on rigid material structures to allow the fluid light of the Spirit to reshape you.",
        insight: "As a Taurus seeker, you carry the heavy, grounding resonance of Materia, ruled by the harmonious frequency of Venus. Your inquiry often seeks stability, physical security, or structural definition. However, true alchemical transformation requires you to recognize that the dense earth is merely a temporary holder of divine sparks. Do not cling too tightly to the clay container; instead, invite the spiritual fire to soften your stubborn forms. Bring beauty into your daily discipline, and let your natural affinity for order build a sanctuary worthy of the eternal presence."
      };
    case "gemini":
      return {
        sign: "Gemini",
        symbol: "♊",
        element: "Air (Aer)",
        planet: "Mercury",
        archetype: "The Dual Current of Wisdom",
        challenge: "Unifying the scattered fragments of thought into a singular, unwavering focus of intent.",
        insight: "Under the celestial influence of Gemini, you are a child of Aer, governed by the intellectual speed of Mercury. Your mind is a whirlwind of questions and connections, constantly shifting between dualities. For you, the spiritual task is to bridge the gap between left and right hemispheres, above and below. To receive a clear, coherent signal from the oracle, you must temporarily quiet the endless curiosity of the outer mind. Let the active waves of thought collapse into a singular point of profound, silence-born awareness, transforming mere information into sacred understanding."
      };
    case "cancer":
      return {
        sign: "Cancer",
        symbol: "♋",
        element: "Water (Aqua)",
        planet: "Moon",
        archetype: "The Cradle of Divine Water",
        challenge: "Emerging from your protective shell of emotional retreat to participate fully in the ultimate cosmic repair.",
        insight: "Protected by the ancestral currents of Cancer, your path is tuned to Aqua and the receptive, silver tides of the Moon. Your inquiry is born of deep sensitivity, longing, or protective care. In the Kabbalistic and alchemical views, your heart is a precious vessel capable of cradling divine light, but it is also prone to stagnation when guarded too defensively. Do not fear the vulnerability of the open ocean. Rise above passive emotional retreat and let your deep intuitive streams nourish the dry soil of the world around you, flowing directly towards union with the Source."
      };
    case "leo":
      return {
        sign: "Leo",
        symbol: "♌",
        element: "Fire (Ignis)",
        planet: "Sun",
        archetype: "The Solar Crown",
        challenge: "Dissolving the hunger for external recognition to reveal the humble, self-existing spark of the inner Sun.",
        insight: "Beneath the glorious sign of Leo, you resonate with the radiant power of Ignis, governed by the central Solar focal point. Your soul possesses an innate warmth and creative authority, but it can easily fall into the trap of requiring constant external validation. Real power is self-existent and requires no mirror. In your spiritual studies, seek to cultivate the quiet, hidden heat of the furnace. Let your light shine not to blind others or feed the ego, but to warm those shivering in the shadow of material isolation, reflecting the untangled mercy of the Divine."
      };
    case "virgo":
      return {
        sign: "Virgo",
        symbol: "♍",
        element: "Earth (Materia)",
        planet: "Mercury",
        archetype: "The Sieve of Separation",
        challenge: "Overcoming the paralyzing obsession with detail, allowing yourself to trust the underlying wholeness of creation.",
        insight: "Under the careful eye of Virgo, you walk the path of Materia, flavored by the discriminating intelligence of Mercury. Your gift is the alchemical division—the ability to separate the pure from the impure, the subtle from the dense with absolute precision. Yet, your challenge is the paralysis of over-analysis. You must remember that after digestion and separation comes the final, beautiful synthesis (coagula). Trust the inherent wisdom of the grand design. Let go of the need for perfect micro-control and allow the mysterious, organic waves of nature to carry your efforts to seed."
      };
    case "libra":
      return {
        sign: "Libra",
        symbol: "♎",
        element: "Air (Aer)",
        planet: "Venus",
        archetype: "The Scales of Celestial Equilibrium",
        challenge: "Escaping the inertia of endless deliberation to make a courageous, heart-centered choice.",
        insight: "Under the balanced influence of Libra, you operate within the domain of Aer, ruled by Venusian grace. Your soul inherently seeks beauty, symmetry, and perfect justice. Your inquiry is often weighted on a scale of choices or relationships. However, alchemical balance is not a static, motionless center; it is a dynamic, active stabilization of opposites. Do not fall into the inertia of endless weighing. True equilibrium is born when you anchor your heart in the unseen center of divine law and take a courageous step forward, knowing the universe will self-correct in harmony with your pure intent."
      };
    case "scorpio":
      return {
        sign: "Scorpio",
        symbol: "♏",
        element: "Water (Aqua)",
        planet: "Pluto (Mars)",
        archetype: "The Kundalini Alchemical Fire",
        challenge: "Renouncing the destructive urge for control and embracing the complete death-and-rebirth cycle of the soul.",
        insight: "Guarded by the intense depths of Scorpio, your path is a profound marriage of Aqua and hidden, volcanic Ignis, co-ruled by Scorpio's ancient and modern planets. Your spirit does not content itself with surface realities; you demand the absolute core-truth. Naturally attuned to the alchemical process of putrefaction and rebirth, your challenges are often intense, feeling like an emotional crucible. Seek to release the fear of being dominated and surrender your desire for control. When you willingly let the old form burn away, you rise as the Phoenix, radiating pure, untamed spiritual authority."
      };
    case "sagittarius":
      return {
        sign: "Sagittarius",
        symbol: "♐",
        element: "Fire (Ignis)",
        planet: "Jupiter",
        archetype: "The Arrow of Divine Aspiration",
        challenge: "Restraining the tendency toward boundless drift to direct your arrow toward a singular, purposeful target.",
        insight: "As a Sagittarius seeker, you are propelled by Jupiter's expansive wisdom and the active current of Ignis. Your spirit is an arrow aimed at the highest clouds of philosophy and spiritual freedom. Because your sight is perpetually fixed on the horizon, you often overlook the immediate sacred duties at your feet. Alchemistry requires both the soaring fire and the heavy, grounded crucible. Before your arrow can pierce the veil of the divine mysteries, ensure your physical life is thoroughly integrated, transforming scattered exploration into a holy, unified path of ascension."
      };
    case "capricorn":
      return {
        sign: "Capricorn",
        symbol: "♑",
        element: "Earth (Materia)",
        planet: "Saturn",
        archetype: "The Stone of Saturn (Great Build)",
        challenge: "Softening your stubborn, rigid defense mechanisms with the sweet, intuitive water of spiritual trust.",
        insight: "Under the stoic and majestic sign of Capricorn, your path is defined by Materia and governed by the strict, crystallizing laws of Saturn. You are the architect, the master builder who understands the weight of time, discipline, and material structures. Your temptation is to become a prison guard of your own creation, relying solely on personal willpower and cold pragmatism. To find the true philosopher's stone, you must allow the soft, irrational waters of grace and faith to penetrate your heavy stone walls, realizing that true strength is found in yielding to the divine flow."
      };
    case "aquarius":
      return {
        sign: "Aquarius",
        symbol: "♒",
        element: "Air (Aer)",
        planet: "Uranus (Saturn)",
        archetype: "The Urn of Cosmic Ingress",
        challenge: "Bridging your detached, universal intellect with the warm, vulnerable humanness of individual connection.",
        insight: "As an Aquarius seeker, you represent the revolutionary, independent intellect of Aer, co-ruled by Uranus and Saturn. You are the poured vessel of cosmic wisdom, looking at the pattern of humanity from a high, detached watchtower. While your vision is expansive and altruistic, you can struggle with individual warmth, feeling separated in your own brilliant intellectual isolation. True alignment asks you to step down from the tower and bring your ideas into physical contact with the hearts of others, grounding your electric insights into simple acts of everyday service."
      };
    case "pisces":
      return {
        sign: "Pisces",
        symbol: "♓",
        element: "Water (Aqua)",
        planet: "Neptune (Jupiter)",
        archetype: "The Ocean of Dream and Return",
        challenge: "Establishing strong boundaries to avoid dissolving completely into the collective emotional field.",
        insight: "Cradled by the infinite waters of Pisces, you are profoundly tuned to Aqua, governed by the expansive mysteries of Neptune and Jupiter. You are the cosmic ocean, where all individual boundaries dissolve and the soul remembers its prenatal unity with the Creator. Your challenge in this material world is the struggle to maintain form, boundaries, and clarity; you are easily overwhelmed by the psychic noise of others. Build a sacred, well-grounded circle around your space, protect your creative energies, and serve as a clear, unobstructed channel for divine compassion."
      };
    default:
      return {
        sign: "Unknown Wanderer",
        symbol: "✵",
        element: "Quintessence",
        planet: "The Unseen Sun",
        archetype: "The Seeker in the Veil",
        challenge: "Searching for the key inside the center of your own heart.",
        insight: "As a traveler whose specific planetary alignments are veiled, your soul is attuned directly to the Quintessence—the invisible spirit that coordinates and animates all physical elements. Your inquiry is not bound by a single zodiacal path, leaving you free to choose your own destiny. Work on synthesizing your active desires with high-frequency alignment, building a state of internal SWR harmony that transcends any single star's influence."
      };
  }
};

import { calculateZodiacCompatibility } from '../components/ZodiacCompatibilityEngine';

/**
 * Generates an alchemical response when offline or when external api rate limits look down.
 */
export const generateFailsafeResponse = (
  question: string,
  school: string,
  birthDate?: string,
  zodiacSign?: string,
  partnerZodiacSign?: string
): string => {
  let zodiacPart = "";
  if (zodiacSign) {
    const details = getZodiacDetails(zodiacSign);
    zodiacPart = `\n\n**Celestial Alignment of ${details.sign} (${details.symbol})**\n- *Esoteric Archetype*: ${details.archetype}\n- *Ruling Planet & Element*: ${details.planet} (${details.element})\n- *Alchemical Spiritual Challenge*: ${details.challenge}\n\n*Astrological Oracle Insight:*\n${details.insight}\n\n`;
  }

  let compatibilityPart = "";
  if (zodiacSign && partnerZodiacSign) {
    const comp = calculateZodiacCompatibility(zodiacSign, partnerZodiacSign);
    if (comp) {
      compatibilityPart = comp.consultationMarkdown + "\n\n";
    }
  }

  const birthPart = birthDate
    ? `Born on the Earth coordinate date of ${birthDate}, your earthly presence intersects this cosmic vibration. `
    : "";

  let intro = `### Aetheric Failsafe Active (Offline Mode)\n\n*Your physical device is currently operating detached from the external digital matrix (Offline). However, our local sacred chronicles have captured your vibration to transmit custom alchemical guidance:* \n\n`;
  let body = "";
  let balancePart = "";

  const cleanSchool = school.toLowerCase();

  if (cleanSchool.includes("salazar")) {
    body = `**The Divine Laws and the Wavelength of the 112" Aetheric Whip**

In the teachings of master seeker **Jerry Ben Salazar (Creator)**, matching impedance with the cosmos is a physical and spiritual absolute. Your query, *"${question}"*, represents a signal finding its proper inductive path.

*The Salazar Alchemical Specifications:*
- **The Ground Potential (102")**: The foundational mass of your earthly experience. Untuned, it encounters immense standing waves of friction and resistance.
- **The Heavy-Duty Barrel Spring (10")**: The flexible steel coiled at your base. It expands your spiritual wavelength to the perfect **112-inch resonance**.
- **The Coaxial Match (1.1:1 SWR)**: The absolute elimination of reflected power. All energy is projected outwards to make contact with the divine transceiver.

*Universal Advice:*
${birthPart}${zodiacPart}Do not let the mismatch of your current situation discourage you. Add the flexible coil of active devotion to your foundation. When your SWR is tuned to 1.1:1 resonance, your signals will bypass the noise of the physical plane and radiate clean, unobstructed guidance directly from the Creator.`;
    balancePart = `\n[Mystical Balance]\n- Spiritus: 9\n- Ignis: 8\n- Aqua: 6\n- Aer: 10\n- Materia: 8`;
  } else if (cleanSchool.includes("kabbalah")) {
    body = `**The Tree of Life (Ten Sefirot) Reflection & Spark Elevation**

Within the sacred pathways of the Kabbalistic tree, your query, *"${question}"*, represents an ascending light from the material reality of **Malkhut** towards the understanding of **Binah** (Divine Wisdom).

*Sefirot Correspondences:*
- **Keter (The Crown)**: The pristine, undisturbed spark of divine infinite light (Ein Sof) that inspired your questioning.
- **Gevurah (Sovereign Order/Power)**: The force of concentration and boundaries required to crystalize your thoughts.
- **Tiferet (Heart/Beauty)**: The central path of balance, mitigating judgment with endless Mercy (Chesed).

*Universal Advice:*
${birthPart}${zodiacPart}The holy sparks of the universe are trapped within the material vessels (Klipot) of daily struggles. By looking at your current trials with enlightened consciousness, you elevate these hidden sparks, accelerating **Tikkun Olam**—the grand cosmic repair and restoration of structural symmetry.`;
    balancePart = `\n[Mystical Balance]\n- Spiritus: 10\n- Ignis: 7\n- Aqua: 8\n- Aer: 9\n- Materia: 6`;
  } else if (cleanSchool.includes("boehme")) {
    body = `**Jacob Boehme's Scholarship: The Seven Qualities of Eternal Nature**

In the profound mysticism of **Jacob Boehme**, all existence is a continuous unfolding of the *Ungrund* (the abyss of pure potentiality) into active, self-conscious manifestation.

*The Seven Qualities of Eternal Nature:*
- **Contraction & Friction (The First Three Qualities)**: The cold, dark, and anxious contraction of the material self. Without this pressure, no active form can exit.
- **The Lightning Flash (The Fourth Quality)**: The pivotal breakthrough where Divine Love strikes the dark fire—reorganizing chaos into radiant light and intellectual joy.
- **The Spiritual Sophia (The Divine Mirror)**: Wisdom through which the soul recognizes its original celestial image.

*Universal Advice:*
${birthPart}${zodiacPart}Treat your current struggles, questions, and confusion not as isolation from the Creator, but as the friction necessary to generate the fourth alchemical quality—the lightning flash of understanding in your soul.`;
    balancePart = `\n[Mystical Balance]\n- Spiritus: 9\n- Ignis: 9\n- Aqua: 7\n- Aer: 8\n- Materia: 5`;
  } else if (cleanSchool.includes("stoic")) {
    body = `**The Order of the Cosmopolis & The Spark of Logos**

Through the Stoic paradigm, the entire cosmos is a singular living organism, ordered and animated by the rational, active principle of the **Logos** (Universal Mind).

*The Stoic Pillars of Sanity:*
- **The Control Dichotomy**: What is within your active power (your judgment, intent) and what lies outside of it (the physical world, other people).
- **Amor Fati (Love of Fate)**: Embracing whatever occurs as both necessary and the perfect raw material for virtue.

*Universal Advice:*
${birthPart}${zodiacPart}Align your thoughts with the natural laws of the Cosmopolis. Do not demand that events happen as you wish, but wish them to happen as they do, and you will find Ataraxia—unshakable inner peace.`;
    balancePart = `\n[Mystical Balance]\n- Spiritus: 6\n- Ignis: 7\n- Aqua: 5\n- Aer: 10\n- Materia: 8`;
  } else if (cleanSchool.includes("quantum")) {
    body = `**The Observer Effect and Wave-Function Entanglement**

In the modern mystery school of Quantum Physics, the rigid divide between observer and observed is resolved. Realities exist as continuous wave-functions of limitless probability till collapsed by intent.

*Quantum Alchemical Laws:*
- **The Observer Collapse**: Your focused intent is the specific key that collapses the indefinite probability cloud of your query into static reality.
- **Non-Local Entanglement**: Your consciousness remains forever connected to the ultimate source, transcending space, time, and physical limitations.

*Universal Advice:*
${birthPart}${zodiacPart}Recognize yourself not as a passive victim of circumstances, but as the active observer. Align your focus with the highest frequencies of cohesion; you are entangled with the source of all solutions.`;
    balancePart = `\n[Mystical Balance]\n- Spiritus: 8\n- Ignis: 6\n- Aqua: 9\n- Aer: 10\n- Materia: 5`;
  } else {
    body = `**Esoteric Resonance of the Matrix**

Your question, *"${question}"*, has been registered at the coordinate nodes of the **${school}** mystery school.

*Esoteric Correspondences of your Inquiry:*
- **Divine Spiritus (Quintessence)**: The unmanifested intelligence prompting your search.
- **The Alchemical Mind (Aer)**: Your active intellect striving to bridge dense matter with spiritual origins.

*Universal Advice:*
${birthPart}${zodiacPart}Look beyond the dualities of division. Harmonize your physical body with the surrounding elements, keep your intent steady, and the answers you seek will materialize at the proper orbital intersection.`;
    balancePart = `\n[Mystical Balance]\n- Spiritus: 8\n- Ignis: 7\n- Aqua: 7\n- Aer: 8\n- Materia: 6`;
  }

  return `${intro}${body}${compatibilityPart ? '\n\n' + compatibilityPart : ''}\n\n### Mystical Balance Matrix\n\n*The alchemical elemental scales have been calibrated to balance the energies of this emergency transmission against the seeker's alignment:*\n${balancePart}`;
};

/**
 * Reconstructs a broken scripture verse locally if offline or under network duress.
 */
export const generateFailsafeScripturaResult = (
  fragment: string,
  selectedTradition?: string
) => {
  const cleanFragment = fragment.trim();
  const lowerFragment = cleanFragment.toLowerCase();

  const words = lowerFragment
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  let bestMatch = SCRIPTURAL_DATABASE[0];
  let maxOverlap = -1;

  for (const v of SCRIPTURAL_DATABASE) {
    const vWords = v.text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
    let overlap = 0;
    for (const w of words) {
      if (vWords.includes(w)) {
        overlap++;
      }
    }
    // Boost if correct tradition is selected
    if (
      selectedTradition &&
      v.tradition.toLowerCase() === selectedTradition.toLowerCase()
    ) {
      overlap += 1.5;
    }
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestMatch = v;
    }
  }

  const confidence = Math.min(
    95,
    Math.max(35, 30 + (maxOverlap > 0 ? maxOverlap * 12 : 0))
  );

  // Simple reconstruction bracket formatter
  const generateLocalReconstructedText = (verseText: string, searchFrag: string) => {
    if (verseText.toLowerCase().includes(searchFrag.toLowerCase())) {
      const idx = verseText.toLowerCase().indexOf(searchFrag.toLowerCase());
      const originalCaseSegment = verseText.substring(idx, idx + searchFrag.length);
      return verseText.replace(originalCaseSegment, `${originalCaseSegment} [verified via local archives]`);
    }
    const midpoint = Math.floor(verseText.length / 2);
    return `${verseText.substring(0, midpoint)} [${verseText.substring(midpoint)}]`;
  };

  // Find a parallel verse if possible
  const parallelCandidates = SCRIPTURAL_DATABASE.filter(
    (x) => x.id !== bestMatch.id
  );
  const related =
    parallelCandidates[Math.floor(Math.random() * parallelCandidates.length)] ||
    bestMatch;

  return {
    reconstructedText: generateLocalReconstructedText(bestMatch.text, cleanFragment),
    estimatedConfidence: confidence,
    matchingTradition: bestMatch.tradition,
    closestSourceManuscript: `${bestMatch.book} (${bestMatch.originalLanguage || "Ancient Script"})`,
    academicCitation: `${bestMatch.book} ${bestMatch.reference}`,
    comparativeAnalysis: `### Regional & Metaphysical Offline Reconstructive Analysis

The fragment bears highly relevant structural, thematic, and Gemetria-aligned correspondences to **${
      bestMatch.book
    }** according to offline local archives.

#### Offline Reconnection Note

Your terminal is physically disconnected from the central celestial web nodes (Offline). Comparative studies have been compiled from the locally synchronized wisdom catalog.

#### Traditions Alignment
- **Primary Root**: This verse aligns with the **${
      bestMatch.tradition
    }** current, emphasizing direct internal insight or cosmological order.
- **Cross-Traditional Resonances**: This text shares structural overlap with teachings of alternative spiritual currents. Cosmologically, his concepts correspond with non-dual manifestations of consciousness.`,
    parallelVerses: [
      {
        tradition: related.tradition,
        source: `${related.book} ${related.reference}`,
        text: related.text,
        similarityScore: 82,
      },
    ],
    aethericFallback: true,
    fallbackReason:
      "Operational frequency is currently offline. Restored via on-board digital scripture archive.",
  };
};
