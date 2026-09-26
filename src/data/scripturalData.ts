/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScriptureVerse {
  id: string;
  tradition: string; // "Gnostic", "Canonical Christian", "Kabbalistic", "Hermetic", "Eastern Mysticism"
  book: string; // e.g. "Gospel of Thomas"
  reference: string; // e.g. "Logion 3"
  text: string;
  alternateTranslation?: string;
  historicalContext?: string;
  parallelReferences?: string[];
  originalLanguage?: string; // "Greek", "Coptic", "Hebrew", "Sanskrit", "Latin"
  symbolicImplications?: string;
}

export const SCRIPTURAL_DATABASE: ScriptureVerse[] = [
  {
    id: "gthom-3",
    tradition: "Gnostic",
    book: "Gospel of Thomas",
    reference: "Logion 3",
    text: "If your leaders say to you, 'Look, the Father's kingdom is in the sky,' then the birds of the sky will precede you. If they say to you, 'It is in the sea,' then the fish will precede you. Rather, the kingdom is within you and it is outside you. When you know yourselves, then you will be known, and you will understand that you are children of the living Father. But if you do not know yourselves, then you live in poverty, and you are the poverty.",
    alternateTranslation: "If those who lead you say to you, 'See, the kingdom is in heaven,' then the birds of heaven will precede you... The kingdom of God of which I speak is inside you, yet it sits visible in all around you.",
    originalLanguage: "Coptic / Greek",
    historicalContext: "Discovered in 1945 at Nag Hammadi, Egypt (Nag Hammadi Codex II). Written originally in Greek around the early 2nd century AD, reflecting esoteric sayings attributed to Jesus.",
    parallelReferences: ["Luke 17:21", "Luke 11:52", "Gospel of Mary 4:3"],
    symbolicImplications: "Points to radical self-knowledge (gnosis) as the realization of divine identity, contrasting external institutionalized religion with the internal indwelling spark."
  },
  {
    id: "gthom-2",
    tradition: "Gnostic",
    book: "Gospel of Thomas",
    reference: "Logion 2",
    text: "Let him who seeks continue seeking until he finds. When he finds, he will become troubled. When he becomes troubled, he will be astonished, and he will rule over the All, and find rest.",
    alternateTranslation: "Let him who seeks not stop seeking until he finds. When he finds, he will marvelling wonder, and having wondered, he will reign, and having reigned, he will rest.",
    originalLanguage: "Coptic / Greek",
    historicalContext: "Cited by early church fathers such as Clement of Alexandria before the Coptic cache was discovered. Shares deep structural overlap with Hermetic ascending paths.",
    parallelReferences: ["Emerald Tablet Section III", "Matthew 7:7", "Corpus Hermeticum IV"],
    symbolicImplications: "The stages of enlightenment: seeker initiates search, encounters reality-breaking shock (trouble), settles in divine awe (astonishment), attains cosmic sovereignty (reign), and final eternal stillness (rest)."
  },
  {
    id: "apoc-john-1",
    tradition: "Gnostic",
    book: "Apocryphon of John",
    reference: "Chapter 11",
    text: "Now the Archon who is weak-minded has three names. The first name is Yaldabaoth, the second is Saklas, and the third is Nebruel. And he is impious in his arrogance which is in him. For he said, 'I am God and there is no other God beside me,' for he is ignorant of his strength, the place from which he had come.",
    alternateTranslation: "The self-centered Ruler thought to himself, 'I am a jealous God, and there is no other God but me.' But by saying this, he admitted that another God did indeed exist, for if there were no other, of whom would he be jealous?",
    originalLanguage: "Coptic / Greek",
    historicalContext: "A major Sethian Gnostic text explaining the cosmology of the Pleroma, the fall of Sophia, and the creation of the material world by the demiurge Yaldabaoth.",
    parallelReferences: ["Exodus 20:5", "Isaiah 45:5", "Corpus Hermeticum I.9"],
    symbolicImplications: "Represents the ego's false assumption of absolute independence, mistaking the material framework for the high spiritual source of ultimate reality."
  },
  {
    id: "gen-1",
    tradition: "Canonical Christian",
    book: "Genesis",
    reference: "1:1-3",
    text: "In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters. And God said, 'Let there be light,' and there was light.",
    alternateTranslation: "At the head of things, Elohim carved out the skies and the soil. The land was chaotic waste, a heavy void (Tohu wa-Bohu). Then the breath of Elohim vibrated upon the face of the deep. Elohim commanded: 'Light, become!' and light became.",
    originalLanguage: "Hebrew",
    historicalContext: "The creation account of Genesis, dating in its final written form to post-exilic priestly redactorship, yet containing highly ancient mythological and cosmological elements.",
    parallelReferences: ["John 1:1", "Zohar I:15a", "Rig Veda 10:129"],
    symbolicImplications: "The emergence of structured consciousness, cosmic order (light), and divine language out of primordial chaos and potentiality (the deep, dark waters)."
  },
  {
    id: "john-1",
    tradition: "Canonical Christian",
    book: "Gospel of John",
    reference: "1:1-5",
    text: "In the beginning was the Word, and the Word was with God, and the Word was God. He was with God in the beginning. Through him all things were made; without him nothing was made that has been made. In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.",
    alternateTranslation: "In the origin of things was the Logos, and the Logos was in intimate communion with God, and what God was, the Logos was. The Light burns in the shadow, and the shadow has never choked it.",
    originalLanguage: "Greek",
    historicalContext: "Written in Ephesus around 90-100 AD. Incorporates Hellenistic Jewish philosophical concepts of Philo of Alexandria regarding the Logos (divine reason/word) as mediator of creation.",
    parallelReferences: ["Genesis 1:1", "Corpus Hermeticum I.6", "Heraclitus Fragment 50"],
    symbolicImplications: "The Logos is the blueprint or frequency of creation. Connects verbal utterance, rational intelligence, and the physical universe into a cohesive divine architecture."
  },
  {
    id: "luke-12",
    tradition: "Canonical Christian",
    book: "Gospel of Luke",
    reference: "12:34",
    text: "For where your treasure is, there your heart will be also.",
    alternateTranslation: "For wherever your hoard is gathered, there your central desire and soul focus will settle also.",
    originalLanguage: "Greek",
    historicalContext: "Found within the Sayings Source (Q Source) of early Synoptic Gospels. Focuses on the inner alignment overriding external material attachment.",
    parallelReferences: ["Matthew 6:21", "Gospel of Thomas 76"],
    symbolicImplications: "The absolute law of attention and valuation: what you value most acts as the anchor point of your spiritual and cognitive state."
  },
  {
    id: "emerald-1",
    tradition: "Hermetic",
    book: "The Emerald Tablet",
    reference: "Section II-IV",
    text: "That which is below is like that which is above, and that which is above is like that which is below, to accomplish the miracles of the One Thing. And as all things have been and arose from one by the mediation of one: so all things have their birth from this one thing by adaptation. The Sun is its father, the Moon its mother, the wind hath carried it in its belly, the earth is its nurse.",
    alternateTranslation: "What is lower reflects what is higher, and what is higher reflects what is lower, to complete the wonders of the Great Work. Its father is the Solar power; its mother is Lunar fluidity...",
    originalLanguage: "Arabic / Latin",
    historicalContext: "Attributed to the mythical sage Hermes Trismegistus. Found in Arabic texts from the 8th century (Kitab Sirr al-Khaliqa) and translated into Medieval Latin, becoming the absolute foundation of Western alchemy.",
    parallelReferences: ["Gospel of Thomas 22", "Zohar II:48a", "Sefer Yetzirah 1:3"],
    symbolicImplications: "The principle of correspondence: Macrocosm mirrors Microcosm. Every material action participates in and is mirrored by high spiritual configurations. Indicates a single, integrated living universe."
  },
  {
    id: "cherm-1",
    tradition: "Hermetic",
    book: "Corpus Hermeticum (Poimandres)",
    reference: "I:6",
    text: "I am Poimandres, Mind of Sovereignty. That Light, he said, is I, the Mind, your God, who is before the moist nature that appeared from darkness. And the luminous Word that came from the Mind is the Son of God. What then? Know this: that which sees and hears in you is the Word of the Lord, but the Mind is God the Father. They are not divided from one another; for union is life.",
    alternateTranslation: "He said: I am Poimandres, the Shepherd of Men, the Great Mind. The shining Light you saw is I; and the brilliant Logos that leaps out from Mind is the son... They do not separate, for their very coherence is the sustaining force of all Life.",
    originalLanguage: "Greek",
    historicalContext: "Written in Roman Egypt around the 2nd-3rd centuries AD. Bridges Platonic, Stoic, Jewish, and Egyptian priestly mysticism into structured metaphysical teaching.",
    parallelReferences: ["John 1:1", "Genesis 1:2", "Upanishads - Purusha"],
    symbolicImplications: "Human consciousness (the ability to see and hear internally) is identified directly with the cosmic Word, making humans alchemical co-creators with God when aligned."
  },
  {
    id: "zohar-1",
    tradition: "Kabbalistic",
    book: "The Zohar",
    reference: "Volume 1, 15a",
    text: "In the beginning, when the King's will began to take effect, He engraved engravings in the heavenly aura. A blinding spark flashed within the concealed of the concealed, from the head of Infinity (Ein Sof), like a fog in a ring, neither white nor black, neither red nor green, of no color at all. Only when its expansion took form, did it produce radiantly glowing letters.",
    alternateTranslation: "At the root of the Sovereign's desire, He carved shapes into the highest ether. A spark of dark flame erupted out of the most secret chambers of the Infinite, like a mystical mist wrapped in a circle...",
    originalLanguage: "Aramaic",
    historicalContext: "Composed in medieval Spain by Moses de León in the 13th century, but attributed to the 2nd-century sage Simeon bar Yochai. It is the primary classic text of Jewish Kabbalah.",
    parallelReferences: ["Genesis 1:1", "Sefer Yetzirah 1:1", "Big Bang Cosmology"],
    symbolicImplications: "Describes the mystery of Tzimtzum (divine contraction) and the emergence of structural reality from absolute nothingness (Ayin) using divine alphabets and cosmic measurements."
  },
  {
    id: "sefer-y-1",
    tradition: "Kabbalistic",
    book: "Sefer Yetzirah",
    reference: "Chapter 1:1",
    text: "With thirty-two mystical paths of Wisdom engraved Yah, the Lord of Hosts, the God of Israel, the Living God, King of the Universe. He created His world by three books: scroll, scribe, and story, or text, number, and communication.",
    alternateTranslation: "By means of thirty-two hidden pathways of intelligence, the Absolute carved out His dwelling... producing reality through three dimensions: Sefar (numbers), Sipur (letters/sounds), and Sefer (books/writing).",
    originalLanguage: "Hebrew",
    historicalContext: "One of the earliest Jewish treatises on cosmology and magic, written between the 2nd and 6th centuries AD. Outlines the 10 Sefirot and 22 letters of the Hebrew alphabet as elements of creation.",
    parallelReferences: ["Zohar I:15a", "John 1:3", "Pythagorean Fragments"],
    symbolicImplications: "The concept that math, language, and material form share a single numerical root, and that the universe is literally spoken and calculated into existence."
  },
  {
    id: "upanishad-1",
    tradition: "Eastern Mysticism",
    book: "Chandogya Upanishad",
    reference: "Chapter 6 (Tat Tvam Asi)",
    text: "That which is the extremely subtle essence—this entire world has that as its soul, its true nature. That is Reality. That is the Self (Atman). And that, O Shvetaketu, is what you are: Tat Tvam Asi.",
    alternateTranslation: "This invisible tiny seed within the fig is the source of the whole giant tree... That which is the vital, invisible spark of this entire universe is the truth. That is the ultimate Self. You are that.",
    originalLanguage: "Sanskrit",
    historicalContext: "One of the oldest Upanishads, part of the Sama Veda. Dates to roughly the 8th-6th centuries BCE. Lays the absolute foundation for Advaita Vedanta (non-duality).",
    parallelReferences: ["Gospel of Thomas 3", "Corpus Hermeticum I:6", "Luke 17:21"],
    symbolicImplications: "Non-duality. The realization that the individual observer's innermost self (Atman) is identical to the universal ultimate ground of all existence (Brahman)."
  },
  {
    id: "dhamma-1",
    tradition: "Eastern Mysticism",
    book: "The Dhammapada",
    reference: "Verse 1-2",
    text: "Mind precedes all mental states. Mind is their chief; they are all mind-made. If with an impure mind a person speaks or acts, suffering follows him like the wheel follows the foot of the ox. Mind precedes all mental states. If with a pure mind a person speaks or acts, happiness follows him like his never-departing shadow.",
    alternateTranslation: "Phenomena are preceded by the heart-mind, ruled by the mind, made of the mind... As down the cart-track the heavy wheel follows the ox, so grief pursues the negative thought.",
    originalLanguage: "Pali",
    historicalContext: "A core collection of sayings of the Buddha, part of the Khuddaka Nikaya of the Sutta Pitaka, compiled in the 3rd century BCE or earlier.",
    parallelReferences: ["Luke 12:34", "Hermetic Asclepius", "Proverbs 23:7"],
    symbolicImplications: "Mental resonance and karma. Reframes physical reality as a directly projected manifestation of the subjective mind, placing absolute responsibility on mental governance."
  }
];
