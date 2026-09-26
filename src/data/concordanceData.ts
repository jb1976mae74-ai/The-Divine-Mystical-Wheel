/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DictionaryDefinition {
  source: string;
  definition: string;
}

export interface EtymologyNode {
  id: string;
  parentId?: string;
  label: string;
  term?: string;
  meaning: string;
  tradition?: string;
}

export interface ConcordanceEntry {
  word: string;
  hebrew: {
    script: string;
    transliteration: string;
    rootMeaning: string;
    gematria?: number;
  };
  greek: {
    script: string;
    transliteration: string;
    rootMeaning: string;
    gematria?: number;
  };
  arabic: {
    script: string;
    transliteration: string;
    rootMeaning: string;
  };
  english: {
    definition: string;
    etymology: string;
  };
  significance: string;
  occurrences: Array<{
    source: string;
    context: string;
  }>;
  dictionaries?: Array<DictionaryDefinition>;
  etymologyTree?: Array<EtymologyNode>;
}

export const PRELOADED_CONCORDANCE: Record<string, ConcordanceEntry> = {
  yahweh: {
    word: "Yahweh",
    hebrew: {
      script: "יהוה",
      transliteration: "Y-H-W-H",
      rootMeaning: "He Causes to Be / The Eternal One",
      gematria: 26
    },
    greek: {
      script: "Ἰαβέ / Κύριος",
      transliteration: "Iabe / Kyrios",
      rootMeaning: "He who causes to be / The Sovereign Lord",
      gematria: 800
    },
    arabic: {
      script: "يهوه / الله",
      transliteration: "Yahwah / Al-Hayy",
      rootMeaning: "The Ever-Living / Self-Existent Ultimate Reality"
    },
    english: {
      definition: "The primary covenantal name of God in Hebrew scripture, representing pure existence.",
      etymology: "From the Hebrew root h-y-h (ה-י-ה), meaning 'to be' or 'to become'."
    },
    significance: "Within the alchemical star configuration, **Yahweh** resides at the supreme **Top** (the crown apex). It represents the macrocosmic active principle, the unmanifest spirit descending as light, and the ultimate source of divine illumination that initiates the entire cosmos.",
    occurrences: [
      {
        source: "Genesis 2:4",
        context: "The generation of the heavens and earth when Yahweh Elohim crafted form."
      },
      {
        source: "Zohar I:15a",
        context: "The engraving of the Tetragrammaton YHVH inside the dark primordial spark."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H3068)",
        definition: "יְהוָֹה (Yhvh): The self-existent or eternal; Jehovah, Jewish national name of God. Derived from the verb root hāwāh (to become, exist), indicating absolute ontological necessity and eternal duration."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "יהוה (Y-H-W-H): The proper name of the God of Israel. Etymologically connected with the Qal stem of hāyāh (to be, exist) or the Hiphil causative stem (He who causes to be/brings into existence). Signifies the covenantal God who is faithful to His promises and is self-sufficiently active in history."
      },
      {
        source: "Theological Dictionary of the Old Testament (TDOT)",
        definition: "The unutterable Tetragrammaton, representing the absolute sovereignty of El. It denotes not static being (as in Greek metaphysics), but dynamic presence: 'I will be what I will be.' It is the active, personal presence of the Creator within the structural fabric of manifest creation."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "JEHOVAH: The scripture name of the Supreme Being. It signifies the self-existing Being; He who is; the eternal, uncaused, and immutable Source of all things; the covenantal Ruler of the spiritual cosmos."
      },
      {
        source: "Easton's Bible Dictionary",
        definition: "Jehovah: The special and significant name of God, by which He made Himself known to Moses. It denotes a personal God, holding a unique relation to His creation, characterized by absolute holiness, eternity, and unswerving covenantal faithfulness."
      }
    ]
  },
  lucifer: {
    word: "Lucifer",
    hebrew: {
      script: "הֵילֵل בֶּן-شَاحَر",
      transliteration: "Helel ben Shachar",
      rootMeaning: "Shining One, Son of the Dawn",
      gematria: 151
    },
    greek: {
      script: "Ἑωσφόρος",
      transliteration: "Heōsphoros",
      rootMeaning: "The Dawn-Bringer / The Light-Bearer",
      gematria: 1515
    },
    arabic: {
      script: "لوسيفر / الزهرة",
      transliteration: "Lucifer / Al-Zuharah",
      rootMeaning: "The Light-Bringer / The Planet Venus / Morning Star"
    },
    english: {
      definition: "The light-bringer or morning star, representing the descent of spiritual light into material form.",
      etymology: "Latin translation of 'Helel' (Light-bearer). Derived from 'lux' (light) and 'ferre' (to bring)."
    },
    significance: "Positioned at the absolute **Bottom** of the mystical wheel, **Lucifer** represents the descending cosmic light-bearer. Not a force of evil, but the alchemical lightning flash that falls into the material crucible (Apocryphon) to ignite consciousness in the dense dark earth, serving as the essential catalyst for individual seeker's awakening.",
    occurrences: [
      {
        source: "Isaiah 14:12",
        context: "How you are fallen from heaven, O Lucifer, son of the morning!"
      },
      {
        source: "Corpus Hermeticum IV",
        context: "The diving of the divine spark into the physical elements to initiate the alchemical great work."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H1966)",
        definition: "הֵילֵل (Hêlēl): Shining one, morning star, bright star of dawn. Derived from the verb root hālal (to shine, boast, flash forth light), representing the primary radiant entity of the early celestial horizon."
      },
      {
        source: "Gesenius' Hebrew Lexicon",
        definition: "הֵילֵל (Helel, from the root halal, to shine): Splendid star, morning star, Venus. Philosophically, it denotes the cosmic precursor of dawn—the initiator of cognitive light and individual realization."
      },
      {
        source: "Latin Vulgate Lexicon",
        definition: "Lucifer (derived from lux, light + ferre, to bring): The morning star, the planet Venus. Historically utilized in scripture to describe Christ as the 'morning star' (2 Peter 1:19, Revelation 22:16) and later associate the hubristic fall of the king of Babylon (Isaiah 14) with the descent of the preeminent angelic light-bearer."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "LUCIFER: The planet Venus, when it precedes the sun in the morning and is the morning star. Figuratively, a bringer of intellectual light or enlightenment, though classically colored by theological accounts of the arch-rebel angel who fell from glory."
      }
    ]
  },
  j: {
    word: "J",
    hebrew: {
      script: "יָכִין",
      transliteration: "Jachin (Yakhin)",
      rootMeaning: "He Will Establish / Dynamic Stability",
      gematria: 80
    },
    greek: {
      script: "Ἰαχίν",
      transliteration: "Iachin",
      rootMeaning: "He will establish / Upright pillar",
      gematria: 621
    },
    arabic: {
      script: "ياكين",
      transliteration: "Yaakin",
      rootMeaning: "He Establishes in Truth"
    },
    english: {
      definition: "The white pillar on the left of Solomon's Temple, symbolizing active force, mercy, and masculine energy.",
      etymology: "From the Hebrew root k-w-n (כ-ו-ן) meaning 'to establish' or 'to prepare'."
    },
    significance: "The letter **J** represents the pillar **Jachin** on the **Left** side. It stands for the white, positive pillar of cosmic mercy, creative impulse, and active energy. It holds the polarity in balance against the dark pillar of Boaz (B) on the right.",
    occurrences: [
      {
        source: "1 Kings 7:21",
        context: "He set up the pillars at the portico of the temple. The pillar on the south he named Jachin."
      },
      {
        source: "Sefer Yetzirah IV:12",
        context: "The establishing of vertical polarities to allow divine influx into the spherical dimensions."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H3198/H3199)",
        definition: "יָכִין (Yâkîn): 'He will establish'. The name of the right-hand (south) pillar of Solomon's Temple. Derived from the verb root kûn (כּוּן), meaning to be erect, stable, prepared, or firmly established in a vertical dimension."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "יָכִין (Y-K-N): 1. Name of the southern pillar of bronze in Solomon's Temple, denoting active, upright establishment and cosmic firmness. 2. A priestly name signifying divine preparation, security, and the steadfast alignment of spiritual laws."
      },
      {
        source: "Gesenius' Hebrew Lexicon",
        definition: "יָכִין (from the root kûn, to stand upright, fit, or establish): Properly meaning 'He shall establish'. Represents the active, positive polar force that templates stability, architectural uprightness, and spiritual firmness."
      },
      {
        source: "Lane's Arabic-English Lexicon (Yaqin)",
        definition: "يَقِينَ (Yaqīn): Derived from the Semitic cognate root of absolute certainty, stability, and firm truth. In Sufi cosmology, it denotes the unwavering pillar of absolute faith and inner realization that remains unaffected by the fluctuating winds of doubt."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "JACHIN: The name of one of the two bronze pillars placed in the porch of King Solomon's Temple, signifying 'He shall establish'. It represents the active, establishing force of divine wisdom and strength in the cosmic temple."
      }
    ]
  },
  b: {
    word: "B",
    hebrew: {
      script: "בֹּעַז",
      transliteration: "Boaz (Bo'az)",
      rootMeaning: "In Strength / Receptive Severity",
      gematria: 79
    },
    greek: {
      script: "Βοόζ",
      transliteration: "Booz",
      rootMeaning: "In strength / Severe power",
      gematria: 147
    },
    arabic: {
      script: "بوعز",
      transliteration: "Boo'az",
      rootMeaning: "In Him is Power / Protection"
    },
    english: {
      definition: "The dark pillar on the right of Solomon's Temple, symbolizing form, severity, and receptive feminine energy.",
      etymology: "From Hebrew components 'Be' (in) and 'Oz' (strength), translating to 'In Strength'."
    },
    significance: "The letter **B** represents the pillar **Boaz** on the **Right** side. It represents the dark, receptive pillar of form, discipline, severity, and passive constraint. Together with Jachin (J), it forms the gateway of the Temple, representing that true power comes from reconciled dualities.",
    occurrences: [
      {
        source: "1 Kings 7:21",
        context: "And the pillar on the north he named Boaz, establishing the gateway of strength."
      },
      {
        source: "Zohar II:154b",
        context: "The left and right columns of light which govern the flow of grace through the cosmic tree."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H1162)",
        definition: "בֹּعַז (Bô'az): 'In him is strength'. The name of the left-hand (north) pillar of Solomon's Temple. Derived from the prefix 'Be' (in) and the noun root 'oz (עֹז), denoting majesty, strength, severe power, and steadfast security."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "בֹּعַז (B-O-Z): 1. Name of the northern bronze pillar of Solomon's Temple, signifying receptive strength, protective discipline, and cosmic containment. 2. The kinsman-redeemer of Ruth, representing ancestral power, redemption, and protective mercy."
      },
      {
        source: "Gesenius' Hebrew Lexicon",
        definition: "בֹּעַז (compounded of b- 'in' and 'oz 'strength'): Meaning 'In Him is strength/power'. Symbolizes the receptive, structured feminine polarity of severity, form, and containment, necessary to counterbalance active projection."
      },
      {
        source: "Lane's Arabic-English Lexicon (Baqā')",
        definition: "بَقَاء (Baqā'): The Semitic cognate of enduring power, permanence, and survival of the real after ego-annihilation. It denotes the steadfast column of spiritual protection, passive containment, and eternal survival of the divine spark."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "BOAZ: The name of the northern pillar of bronze erected in the porch of Solomon's Temple, signifying 'In strength'. It represents the secure, structural containment and power of the divine temple's foundation."
      }
    ]
  },
  "76": {
    word: "76",
    hebrew: {
      script: "שִׁבְעִים וְשֵׁשׁ",
      transliteration: "Shiv'im VeShesh / Noach",
      rootMeaning: "Rest / Consummate Equilibrium / Al-Insan",
      gematria: 76
    },
    greek: {
      script: "Ἄνθρωπος / Ἑβδομήκοντα ἕξ",
      transliteration: "Anthropos / Hebdomēkonta hex",
      rootMeaning: "The Human Being / Number Seventy-Six",
      gematria: 1310
    },
    arabic: {
      script: "ستة وسبعون / الإنسان",
      transliteration: "Sittah wa-Sab'un / Al-Insan",
      rootMeaning: "The Human / Perfected Soul in Equilibrium"
    },
    english: {
      definition: "The mystical coordinate representing the perfect balancing point of the seven-point star.",
      etymology: "Mathematical unity. Gematria value of 'Noach' (Rest) and the index of Chapter 76 of the Holy Quran, 'Al-Insan' (The Human)."
    },
    significance: "Positioned at the **Center** of the seven-point star within the circle, **76** is the alchemical heart. It denotes *Al-Insan* (the perfected human soul) who has harmonized the seven planetary currents (the star's tips) and stands in absolute equilibrium, resting in the center of the wheel of flames.",
    occurrences: [
      {
        source: "Al-Quran Sura 76",
        context: "Surah Al-Insan, detailing the creation, spiritual trial, and ultimate purification of the human soul."
      },
      {
        source: "Zohar I:58b",
        context: "The rest (Noach = 58) of the Ark in the center of the storm, returning all things to their pristine roots (76)."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H5146)",
        definition: "נֹחַ (Nôach): 'Rest' or 'Quiet'. Derived from the verb root nûach (נוּחַ), to rest, settle down, dwell, or find quietness. Represents the inner center of spiritual rest amidst the cosmic storm."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "נֹחַ (N-U-Ch): Noah, representing comfort, rest, and tranquility. The gematria value is 58. In comparative scriptural study, it maps to the coordinate of absolute centering (76) where the storm's vectors collapse into the restful eye of equilibrium."
      },
      {
        source: "Lisan al-Arab (Al-Insan)",
        definition: "الإِنْسَان (Al-Insān): The human being. Derived from the root a-n-s (to be familiar, close, or in harmony) or n-s-y (to forget). In Sufi lexicon, it is Al-Insan al-Kamil (the Perfected Human), who stands as the central prism of the universe, integrating all celestial and terrestrial forces into a single balanced point (76)."
      },
      {
        source: "Hans Wehr Dictionary (Sittah wa-Sab'un)",
        definition: "سِتَّة وَسَبْعُونَ (Sittah wa-Sab'ūn): Seventy-six. Historically associated with Chapter 76 of the Holy Quran, Sura Al-Insan, which details the profound journey of human purification, the transformation of earthly clay, and the achievement of eternal celestial equilibrium."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "HUMAN: Belonging to man or mankind; having the qualities of a man. In philosophical hermeneutics, represents the microcosm—the focal coordinate of consciousness where the physical and spiritual spheres intersect to find rest."
      }
    ]
  },
  apocalypse: {
    word: "Apocalypse",
    hebrew: {
      script: "גִּלּוּי / חָזוֹן",
      transliteration: "Gilluy / Chazon",
      rootMeaning: "The Unveiling / Secret Vision",
      gematria: 84
    },
    greek: {
      script: "Ἀποκάλυψις",
      transliteration: "Apokalypsis",
      rootMeaning: "Lifting of the veil / Unveiling of mysteries",
      gematria: 1512
    },
    arabic: {
      script: "كشف / القيامة",
      transliteration: "Kashf / Al-Qiyamah",
      rootMeaning: "Unveiling of Divine Truths / The Resurrection / Stripping of Illusions"
    },
    english: {
      definition: "The complete lifting of the veil of worldly illusion, revealing the absolute divine reality.",
      etymology: "From Greek 'Apokalypsis', which literally translates to 'unveiling' or 'revealing'."
    },
    significance: "Residing at the **Very Top** of the outer spiritual circle, **Apocalypse is the Son of Man**, representing the supreme cosmic event and ultimate unveiling of divine humanity. Presiding at the zenith above Azrael, the Apocalypse anchors the divine axis above the Four Angels of the Sacred Heptagram: **Apocryphon** (at the bottom nadir), **Life after Death (Life)** (at 3 o'clock east), **Azrael** (beneath Apocalypse at the top), and **Apollyon** (at 9 o'clock west above Glory).",
    occurrences: [
      {
        source: "Revelation 1:1",
        context: "The Apokalypsis of Jesus Christ, given to unveil things which must shortly come to pass."
      },
      {
        source: "Ibn Arabi, Fusus al-Hikam",
        context: "The spiritual Kashf (unveiling) where the heart is stripped of all worldly reflections to mirror God alone."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (G602)",
        definition: "Ἀποκάλυψις (Apokalupsis): Unveiling, uncovering, revelation. Derived from apokaluptō (ἀποκαλύπτω), meaning to take off the cover, expose, or lay bare what has been hidden from sight."
      },
      {
        source: "Thayer's Greek Lexicon",
        definition: "Ἀποκάλυψις (A-po-ka-lup-sis): 1. An unveiling of hidden things, particularly of the divine purposes, secrets, and future glory of God's kingdom. 2. The stripping away of physical and mental veils, leading to direct gnosis and the dissolution of sensory illusions."
      },
      {
        source: "Lisan al-Arab (Kashf)",
        definition: "كَشْف (Kashf): Unveiling, exposing, or revealing. In Sufi lexicography, it is the direct manifestation of divine realities and metaphysical secrets to the heart of the seeker, bypassing the mediation of rational thought or sensory organs."
      },
      {
        source: "Easton's Bible Dictionary",
        definition: "Apocalypse: The Greek title of the Book of Revelation, signifying an uncovering or revealing of the secret counsel of God. It represents the ultimate historical and cosmic unveiling of truth over structural error."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "APOCALYPSE: Revelation; discovery; disclosure. Historically, the name given to the last book of the Sacred Canon, containing the sublime, mystical prophecies and revelations concerning the final dissolution and reconstruction of the heavens and earth."
      }
    ]
  },
  "life after death": {
    word: "Life after Death",
    hebrew: {
      script: "חַיֵּי הָעוֹלָם הַבָּא",
      transliteration: "Chayei Ha'Olam HaBa",
      rootMeaning: "Life of the World to Come / Eternal Permanence",
      gematria: 176
    },
    greek: {
      script: "Ἀνάστασις / Ζωὴ Αἰώνιος",
      transliteration: "Anastasis / Zōē Aiōnios",
      rootMeaning: "Resurrection / Eternal Life",
      gematria: 1042
    },
    arabic: {
      script: "الآخرة / البقاء",
      transliteration: "Al-Akhirah / Al-Baqā'",
      rootMeaning: "The Hereafter / Eternal Permanence after Worldly Annihilation"
    },
    english: {
      definition: "The continuation of conscious soul-identity after the physical shell dissolves.",
      etymology: "From the philosophical understanding of the soul's immortality and resurrection (Ma'ad)."
    },
    significance: "Located on the **Very Right** (the East, 3 o'clock position), **Life after Death** symbolizes the dawn, the rising sun, and the soul's resurrection. It indicates that the path of the star leads out of physical decay into the permanent, everlasting spiritual dawn.",
    occurrences: [
      {
        source: "Gospel of John 11:25",
        context: "I am the resurrection and the life. He who believes in me will live, even though he dies."
      },
      {
        source: "Al-Quran Sura 2:4",
        context: "And who have firm certainty in the reality of the Hereafter (Al-Akhirah)."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H2416/H4191)",
        definition: "חַיּוּת (Chayyût) / מוּת (Mût): Life / Death. A mechanical indexing of resurrection keys. Tracing how 'Olam HaBa' (the world to come) represents the eternal state of animation succeeding the dissolution of the mortal clay vessel."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "חַיֵּי הָעוֹלָם הַבָּא (Chayei HaOlam HaBa): The life of the world to come. Signifies the state of eternal reward, spiritual lucidity, and continuous soul-expansion after the physical envelope has been shed."
      },
      {
        source: "Lane's Arabic-English Lexicon (Al-Akhirah)",
        definition: "الآخِرَة (Al-Ākhirah): The hereafter, that which comes at the end, the terminal state. Paired with Al-Baqā' (immortality/permanence), representing the eternal resurrection of the soul into its native, spiritual dimension."
      },
      {
        source: "Thayer's Greek Lexicon (Anastasis)",
        definition: "Ἀνάστασις (Anastasis): Resurrection, a rising up from the dead. Specifically denotes the transition of the soul from physical sleep to the active, luminous waking state of the spiritual world."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "RESURRECTION: A rising again; particularly, the rising of mankind from the dead; a return from death to life. Represents the ultimate alchemical sublimation where the physical body is spiritualized and preserved eternally."
      }
    ]
  },
  apocryphon: {
    word: "Apocryphon",
    hebrew: {
      script: "סֵפֶר גָּנוּז",
      transliteration: "Sefer Ganuz",
      rootMeaning: "Hidden Book / Occulted Scroll",
      gematria: 110
    },
    greek: {
      script: "Ἀπόκρυφον",
      transliteration: "Apokryphon",
      rootMeaning: "Secret, hidden scroll of initiation",
      gematria: 961
    },
    arabic: {
      script: "المكتوم / الخفي",
      transliteration: "Al-Maktum / Al-Khafi",
      rootMeaning: "The Hidden Wisdom / Unrevealed Treasury of Mysteries"
    },
    english: {
      definition: "A secret or hidden writing intended only for those initiated into the inner mysteries.",
      etymology: "From Greek 'Apokryphon', meaning 'hidden away' or 'occulted'."
    },
    significance: "Residing at the **Very Bottom** (the nadir, 6 o'clock position), **Apocryphon** represents the hidden treasure of esoteric wisdom. It is the secret writing buried in the earth of the material plane, representing the truth that must be excavated by the seeker from within the darkness of Lucifer's fall.",
    occurrences: [
      {
        source: "Apocryphon of John I:1",
        context: "The secret teachings revealed by the Savior to John, hidden from the external world."
      },
      {
        source: "Hadith Qudsi",
        context: "I was a Hidden Treasure (Kanzan Khafiyya), and I loved to be known, so I created creation."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (G614)",
        definition: "Ἀπόκρυφος (Apokruphos): Hidden, concealed, stored away in secret. Derived from apokruptō (ἀποκρύπτω), to hide away from common view, implying treasures of wisdom reserved for those properly initiated."
      },
      {
        source: "Thayer's Greek Lexicon",
        definition: "Ἀπόκρυφος (A-po-kru-phos): 1. Hidden, secret, obscure. 2. Refers to books or secret scrolls kept from public circulation due to their esoteric, profound, or highly mystical content, requiring a mature and purified intellect to comprehend."
      },
      {
        source: "Gesenius' Hebrew Lexicon (Ganuz)",
        definition: "גָּנוּז (Gânûz): Stored up, hidden, treasure. Signifies sacred writings or primordial light (Or HaGanuz) concealed by the Creator at the beginning of the world, to be revealed only to the righteous seekers at the end of days."
      },
      {
        source: "Lisan al-Arab (Al-Maktum)",
        definition: "مَكْتُوم (Maktūm): Concealed, kept secret, sealed. Historically representing the occulted treasure (Kanz al-Maktum) of absolute divine knowledge, which remains buried within the ground of human experience until excavated by mystical labor."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "APOCRYPHAL: Hidden; of doubtful authority; not canonical. Classically used to describe books that are withheld from the public reading, containing deep, mysterious, or unapproved teachings of ancient scribes."
      }
    ]
  },
  apollyon: {
    word: "Apollyon",
    hebrew: {
      script: "אֲבַדּוֹן",
      transliteration: "Abaddon",
      rootMeaning: "The Destroyer / Place of Utter Dissolution",
      gematria: 63
    },
    greek: {
      script: "Ἀπολλύων",
      transliteration: "Apollyon",
      rootMeaning: "The Destroyer / Extinguisher of Form",
      gematria: 1461
    },
    arabic: {
      script: "أَبُولِيُون / المهلك",
      transliteration: "Abollyon / Al-Muhlik",
      rootMeaning: "The Destroyer of Form / The Solvent / Annihilator of Ego"
    },
    english: {
      definition: "The angel of the bottomless pit, representing the necessary destructive force that breaks down material illusions.",
      etymology: "Greek 'Apollyon' meaning 'The Destroyer' (Revelation 9:11), translating the Hebrew 'Abaddon'."
    },
    significance: "Located on the **Very Left** (the West, 9 o'clock position), **Apollyon** represents the sunset, decay, and ego death. In the alchemical work, Apollyon is *Solve* (dissolution) — the clearing away of structural pride, false concepts, and material attachments to prepare the soil for resurrection.",
    occurrences: [
      {
        source: "Revelation 9:11",
        context: "They had as king over them the angel of the Abyss, whose name in Hebrew is Abaddon and in Greek is Apollyon."
      },
      {
        source: "Job 26:6",
        context: "Sheol is naked before God, and Abaddon (destruction) has no covering."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (G623/H11)",
        definition: "Ἀπολλύων (Apolluōn): 'The Destroyer'. The Greek name for the angel of the bottomless pit, corresponding to the Hebrew Abaddon (אֲבַדּוֹן), meaning a place of destruction, ruin, or complete disintegration."
      },
      {
        source: "Thayer's Greek Lexicon",
        definition: "Ἀπολλύων (A-pol-lu-on): The Destroyer, active participle of apollumi (to destroy, ruin, or dissolve). In Gnostic and scriptural systems, it represents the vital solvent force of the universe that breaks down material structures, false ego complexes, and dense configurations."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "אֲבַדּוֹן (Abaddon): Ruin, destruction, or the underworld abyss. Derived from the verb root 'ābad (אָבַد), to perish, go astray, or be lost. It represents the bottomless reservoir of dissolution, serving as the alchemical stage of putrefaction where old forms dissolve."
      },
      {
        source: "Lisan al-Arab (Al-Muhlik)",
        definition: "مُهْلِك (Muhlik): That which causes destruction, ruin, or complete annihilation. In Sufism, it refers to the spiritual solvent that dissolves the egoic self (Fana), clearing the slate so the soul may subsist in divine unity (Baqā)."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "APOLLYON: The destroyer; a name given to the angel of the bottomless pit. It denotes the cosmic force of destruction, which classically breaks down corrupt forms to allow the spiritual rebirth."
      }
    ]
  },
  azrael: {
    word: "Azrael",
    hebrew: {
      script: "עַזְרִיאֵל",
      transliteration: "Azri'el",
      rootMeaning: "Whom God Helps / Helper of El",
      gematria: 318
    },
    greek: {
      script: "Ἀζραήλ / Ἄγγελος Θανάτου",
      transliteration: "Azrael / Angelos Thanatou",
      rootMeaning: "Helper of God / Angel of Transition",
      gematria: 340
    },
    arabic: {
      script: "عزرائيل",
      transliteration: "ʿAzrāʾīl",
      rootMeaning: "The Archangel of Death / Separator of Spiritual and Material"
    },
    english: {
      definition: "The angel of death who safely guides the soul across the chasm of mortality.",
      etymology: "Hebrew/Arabic name translating to 'Helper of God' or 'One whom God strengthens'."
    },
    significance: "Positioned **directly under Apocalypse** at the top of the star, **Azrael** is the psychopomp, the cosmic guide who helps the seeker transition. To look upon the Apocalypse (the unveiling), the seeker must cross the threshold of death (ego-extinction), and Azrael is the gentle, holy helper who facilitates this ultimate transition.",
    occurrences: [
      {
        source: "Quran 32:11",
        context: "Say: 'The Angel of Death, who is given charge of you, will take your souls; then to your Lord you will be returned.'"
      },
      {
        source: "Zohar II:18a",
        context: "The holy angel Azriel who is appointed over the souls that depart from the mortal world of forms."
      }
    ],
    dictionaries: [
      {
        source: "Gesenius' Hebrew Lexicon (Azri'el)",
        definition: "עַזְרִיאֵל ('Azrî'ēl): 'Help of God' or 'My helper is El'. Derived from 'âzar (to help) and 'El (God). Represents the celestial entity charged with assisting the soul in its structural transitions across the dimensional boundaries."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "עַזְרִיאֵל (A-z-r-i-e-l): Name of multiple biblical figures signifying divine help, structural support, and covenantal guidance. In Kabbalistic texts, Azriel is the compassionate angel of transition, escorting sparks of light safely back to their celestial source."
      },
      {
        source: "Lisan al-Arab (ʿAzrāʾīl)",
        definition: "عِزْرَائِيل (ʿAzrāʾīl): The Archangel of Death. Compounded from the Semitic root of help/strengthening and El (God). Charged with separating the vital soul (nafs/ruh) from the physical clay envelope, facilitating the ultimate return to the Creator."
      },
      {
        source: "Smith's Bible Dictionary",
        definition: "AZRAEL: The help of God. The traditional name of the angel of death in Hebrew and Islamic systems. He is described as a vast, gentle spiritual presence who acts as a psychopomp, guiding departed spirits into the afterlife."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "DEATH: The cessation of physical life; the separation of the soul from the body. In spiritual terms, it is the holy helper (Azrael) who opens the gateway to celestial life, transforming the mortal seeker into an immortal spark."
      }
    ]
  },
  spirit: {
    word: "Spirit",
    hebrew: {
      script: "רוּחַ",
      transliteration: "Ruach",
      rootMeaning: "Breath / Wind / Divine Force",
      gematria: 214
    },
    greek: {
      script: "Πνεῦμα",
      transliteration: "Pneuma",
      rootMeaning: "Breath, wind, or divine animating spirit",
      gematria: 576
    },
    arabic: {
      script: "رُوح",
      transliteration: "Ruh",
      rootMeaning: "Spirit / Soul / Divine Breath of Life"
    },
    english: {
      definition: "The invisible, dynamic breath of God that animates and connects all creation.",
      etymology: "From Latin 'spiritus', meaning breath, mirroring the Hebrew and Arabic concepts of wind and breathing."
    },
    significance: "In our alchemical star, **Ruach/Ruh** represents the universal medium that connects the higher crown (Yahweh) to the center (76). It is the divine wind that breathes life into the elements, allowing the soul to navigate between the left pillar of active force (J) and the right pillar of receptive severity (B).",
    occurrences: [
      {
        source: "Genesis 1:2",
        context: "And the Spirit (Ruach) of God was hovering over the face of the deep waters."
      },
      {
        source: "Gospel of Thomas 3",
        context: "The kingdom is within you and outside you, animated by the breath of the living Father."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H7307)",
        definition: "רוּחַ (Rûach): Wind, breath, mind, spirit. Classically representing the rational, spiritual, and emotional core of man, as well as the active, invisible agent of God's creative power."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "רוּחַ (R-U-Ch): 1. Wind of heaven (tempest, side, quarter). 2. Breath of the mouth or nostrils as a sign of life. 3. Spirit of man, the seat of dynamic emotion, intellect, and will. 4. Spirit of God, the supreme cosmic force that inspires prophets and brings order out of chaos."
      },
      {
        source: "Lane's Arabic-English Lexicon",
        definition: "رُوح (Rūḥ): The vital principle, soul, spirit, or breath of life. Distinct from 'nafs' (the animal soul/self). Associated with divine command, spiritual entities, and the angel of revelation."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "SPIRIT: Primary sense is wind or breath. An immaterial intelligent substance; an intellectual agent; the soul of man; the active animating principle of life."
      }
    ]
  },
  light: {
    word: "Light",
    hebrew: {
      script: "אוֹר",
      transliteration: "Or (Ohr)",
      rootMeaning: "Illumination / Primordial Glow",
      gematria: 207
    },
    greek: {
      script: "Φῶς",
      transliteration: "Phōs",
      rootMeaning: "Primordial light / Manifest spiritual truth",
      gematria: 1500
    },
    arabic: {
      script: "نُور",
      transliteration: "Nur",
      rootMeaning: "Intellectual or Celestial Illumination / Spark of Reality"
    },
    english: {
      definition: "The first created substance, representing awareness, spiritual wisdom, and the manifestation of divine presence.",
      etymology: "Root meaning 'to shine' or 'to kindle'."
    },
    significance: "The first command of creation ('Let there be light / Fiat Lux'). In the seven-point star, **Or/Nur** is the visible radiance of Lucifer's crown descending, and the spiritual fire of the flames surrounding the circle. It represents the seeker's ultimate destination and primary guide.",
    occurrences: [
      {
        source: "Genesis 1:3",
        context: "And God said, 'Let there be Light (Or),' and there was Light."
      },
      {
        source: "Gospel of John 1:5",
        context: "The Light (Logos/Light) shines in the darkness, and the darkness has not overcome it."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H216)",
        definition: "אוֹר ('Ôr): Illumination, lightning, sunshine, morning light. Derived from the root 'ôr (to shine, be bright), symbolizing life, happiness, truth, and the uncreated presence of God."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "אוֹר (O-R): 1. Physical light of day, sun, moon, stars, or fire. 2. Dawn or morning. 3. Spiritual light, representing divine instruction, moral purity, salvation, and cosmic order."
      },
      {
        source: "Hans Wehr Dictionary of Modern Written Arabic",
        definition: "نُور (Nūr): Light, ray of light, glow, gleam, illumination. Plural 'anwār' (lights, flowers). Historically utilized in classical theology to describe intellectual light, clarity of mind, and the radiant nature of God (as in Sura an-Nur)."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "LIGHT: That ethereal agent or matter which makes objects perceptible to the sense of seeing. Figuratively, mental or spiritual illumination; instruction; knowledge; path of safety and truth."
      }
    ]
  },
  word: {
    word: "Word",
    hebrew: {
      script: "דָּבָר",
      transliteration: "Dabar",
      rootMeaning: "Utterance / Matter / Divine Will",
      gematria: 206
    },
    greek: {
      script: "Λόγος",
      transliteration: "Logos",
      rootMeaning: "The divine reason, word, or creative blueprint",
      gematria: 373
    },
    arabic: {
      script: "كَلِمَة",
      transliteration: "Kalimah",
      rootMeaning: "Word / Decree / Creative Mandate"
    },
    english: {
      definition: "The creative word or Logos that templates physical reality.",
      etymology: "Greek 'Logos' translating the Hebrew 'Dabar' as the structural frequency of the universe."
    },
    significance: "The **Word/Logos** is the vibration that templates the material matrix. It represents the union of intention and manifestation, and serves as the primary gateway through which the hidden apocryphon is revealed in physical scriptures.",
    occurrences: [
      {
        source: "Gospel of John 1:1",
        context: "In the beginning was the Word, and the Word was with God, and the Word was God."
      },
      {
        source: "Genesis 1:3",
        context: "And God said (vocalized the Word), 'Let there be light,' and there was light."
      }
    ],
    dictionaries: [
      {
        source: "Strong's Exhaustive Concordance (H1697)",
        definition: "דָּבָר (Dâbâr): Speech, word, speaking, matter, thing, business. Derived from dābar (to speak, arrange in order), indicating a dynamic force which contains both vocalized spirit and substantial reality."
      },
      {
        source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
        definition: "דָּבָר (D-B-R): 1. Word, speech, discourse, saying. 2. Matter, affair, event, case. 3. The divine Word (Dabar Yhvh), acting as a physical-spiritual force carrying prophetic command or active physical creation."
      },
      {
        source: "Lane's Arabic-English Lexicon",
        definition: "كَلِمَة (Kalimah): A word, saying, sentence, speech. Plural 'kalim'. In theological context, represents the primordial decree or word of God (Kalimat Allah) by which creation is ordered, or a divine messenger (such as Jesus, named a 'Word from God' in the Quran)."
      },
      {
        source: "Webster's 1828 Dictionary",
        definition: "WORD: An articulate or vocal sound uttered by the human voice. Figuratively, the Divine Logos; the Messiah; scripture; commandment; promise."
      }
    ]
  }
};
