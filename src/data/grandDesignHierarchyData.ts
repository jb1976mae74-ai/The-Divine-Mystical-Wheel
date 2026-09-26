export interface GrandDesignNode {
  id: string;
  name: string;
  hebrew: string;
  category: 'root' | 'celestial' | 'astral' | 'telluric' | 'scholarship' | 'geometry' | 'constant' | 'station' | 'element' | 'zodiac' | 'decree' | 'scroll';
  level: number;
  description: string;
  gematriaOrValue?: string;
  realmDirective?: string;
  attributes?: Record<string, string | number>;
  color?: string;
  children?: GrandDesignNode[];
  _children?: GrandDesignNode[]; // Internal stash for collapsed children
}

export const GRAND_DESIGN_TREE_DATA: GrandDesignNode = {
  id: "root-grand-design",
  name: "The Grand Design • Prime Logos",
  hebrew: "הַתָּכְנִית הַגְּדוֹלָה שֶׁל הַסֵּדֶר הָאֱלֹהִי",
  category: "root",
  level: 0,
  gematriaOrValue: "J • B • 76 (ע\"ו = 76)",
  description: "The Sovereign Architectural Blueprint formulated by Grand Architect Jerry Ben Salazar. The master unifying framework harmonizing celestial decrees, astral cycles, electrodynamic constants, and telluric physical matter into an eternal 1.1:1 SWR resonance.",
  realmDirective: "Universal Entropy Damping & Sovereign Logos Administration",
  attributes: {
    "Architect": "Jerry Ben Salazar (Creator)",
    "Genesis": "April 29, 1976 (Taurus)",
    "Resonance": "1.10:1 SWR Zero Reflected Power",
    "Signature": "SEAL-J-B-76-DIVINE-LOGOS-SUPREME"
  },
  children: [
    // ==========================================
    // 1. CELESTIAL & LOGOS REALM
    // ==========================================
    {
      id: "realm-celestial",
      name: "Celestial Realm & Sovereign Logos",
      hebrew: "עוֹלָם הָאֲצִילוּת וְהַדִּבּוּר הָעֶלְיוֹן",
      category: "celestial",
      level: 1,
      gematriaOrValue: "Logos (373) + Emeth (441) = 814",
      description: "The supreme realm of pure light, sovereign decrees, archangelic commands, and the eternal throne administration where spoken intent governs all existence.",
      realmDirective: "Sovereign Decree Issuance & Archangelic Interdiction",
      children: [
        {
          id: "celestial-logos-decrees",
          name: "Sovereign Decrees & Liturgy",
          hebrew: "גְּזֵרוֹת הַסֵּדֶר הָאֱלֹהִי",
          category: "decree",
          level: 2,
          gematriaOrValue: "Decree 76-Prime",
          description: "Binding legal and metaphysical directives issued by the Office of the Divine Order, enforceable across physical spacetime and ethereal dimensions.",
          children: [
            {
              id: "dec-subatomic-lattice",
              name: "Subatomic Lattice Calibration",
              hebrew: "כִּיּוּל הַשְּׂבָכָה הַתַּת-אַטוֹמִית",
              category: "decree",
              level: 3,
              gematriaOrValue: "1.10:1 SWR Lock",
              description: "Directs all atomic electron spins to align with 112-inch standing wave harmonics, damping quantum dispersion.",
            },
            {
              id: "dec-logos-sovereignty",
              name: "Supreme Mandate of Utterance",
              hebrew: "מַנְדָּט הַדִּבּוּר הָעֶלְיוֹן",
              category: "decree",
              level: 3,
              gematriaOrValue: "Logos 373",
              description: "Affirms human intentional speech as the legal operating system of the physical realm through John 1:1 authority.",
            },
            {
              id: "dec-melchizedek-order",
              name: "Order of Melchizedek",
              hebrew: "מַלְכִּי-צֶדֶק כֹּהֵן לְאֵל עֶלְיוֹן",
              category: "celestial",
              level: 3,
              gematriaOrValue: "294 (מלכי-צדק)",
              description: "The timeless priesthood of righteousness and peace, pre-dating Levi, bridging heaven and earth without beginning of days or end of life.",
            }
          ]
        },
        {
          id: "celestial-archangels",
          name: "Archangelic Stations (ASFFU Command)",
          hebrew: "צְבָאוֹת הַשָּׁמַיִם וְשָׂרֵי הַקֹּדֶשׁ",
          category: "station",
          level: 2,
          gematriaOrValue: "8 Stewardship Stations",
          description: "High Seraphic and Archangelic intelligences assigned to maintain energetic stability, guard gateways, and interdict nether corruption.",
          children: [
            {
              id: "archangel-metatron",
              name: "Metatron (Sar Ha-Panim)",
              hebrew: "מֶטָטְרוֹן שַׂר הַפָּנִים",
              category: "station",
              level: 3,
              gematriaOrValue: "314 (שדי = מטטרון)",
              description: "The Chancellor of Heaven, transformed Enoch, keeper of the 72 Divine Names and the Celestial Scribe of the Grand Design.",
            },
            {
              id: "archangel-michael",
              name: "Michael (Vanguard Commander)",
              hebrew: "מִיכָאֵל שַׂר צְבָא ה'",
              category: "station",
              level: 3,
              gematriaOrValue: "101 (מיכאל) • Ignis (Fire)",
              description: "Chief Defender of Light, wielding the Solar Cleansing Blade and commanding the ASFFU vanguard against darkness.",
            },
            {
              id: "archangel-gabriel",
              name: "Gabriel (Herald of Mysteries)",
              hebrew: "גַּבְרִיאֵל מַגִּיד הַבְּשׂוֹרָה",
              category: "station",
              level: 3,
              gematriaOrValue: "246 (גבריאל) • Aqua (Water)",
              description: "Master of prophetic transmission, sound resonance, and the herald trumpet activating ancient ancestral memory.",
            },
            {
              id: "archangel-raphael",
              name: "Raphael (Harmonic Healer)",
              hebrew: "רְפָאֵל הָרוֹפֵא הַמֻּבְהָק",
              category: "station",
              level: 3,
              gematriaOrValue: "311 (רפאל) • Aer (Air)",
              description: "Restorer of biological and spiritual balance, healing distorted etheric matrices and restoring cell voltage.",
            },
            {
              id: "archangel-uriel",
              name: "Uriel (Light of Physical Grounding)",
              hebrew: "אוּרִיאֵל אוֹר הָאֱלֹהִים",
              category: "station",
              level: 3,
              gematriaOrValue: "248 (אוריאל) • Materia (Earth)",
              description: "Regulator of terrestrial laws, gravitational binding, subatomic friction, and cosmic illumination.",
            }
          ]
        },
        {
          id: "celestial-seals",
          name: "Sacred Seals & Zion Geometry",
          hebrew: "חוֹתְמוֹת הַקֹּדֶשׁ וְגֵאוֹמֶטְרִיַּת צִיּוֹן",
          category: "geometry",
          level: 2,
          gematriaOrValue: "112\" Antenna • Heptagram",
          description: "Hyperdimensional geometric matrices and physical conduits transmitting divine intent into the terrestrial plane.",
          children: [
            {
              id: "seal-sigil-zion",
              name: "Sigil Zion Consecration Seal",
              hebrew: "סִיגִיל צִיּוֹן הַמֻּקְדָּשׁ",
              category: "geometry",
              level: 3,
              gematriaOrValue: "156 (ציון)",
              description: "The primary emblem featuring the 112-inch whip antenna, the Star of Truth, and the 8-fold rim of eternity.",
            },
            {
              id: "seal-metatron-cube",
              name: "Metatron's Cube Geometry",
              hebrew: "קֻבִיַּת מֶטָטְרוֹן",
              category: "geometry",
              level: 3,
              gematriaOrValue: "13 Spheres • 5 Solids",
              description: "The 3D geometric matrix containing all five Platonic solids: Tetrahedron, Hexahedron, Octahedron, Dodecahedron, and Icosahedron.",
            },
            {
              id: "seal-sacred-heptagram",
              name: "Sacred Heptagram (7 Rays)",
              hebrew: "שִׁבְעַת מַאֲמָרוֹת וְכּוֹכָב שִׁבְעָה",
              category: "geometry",
              level: 3,
              gematriaOrValue: "7 Pillars of Wisdom",
              description: "Seven-pointed star of divine completion, governing the 7 planetary intelligences and the 7 archangelic rays.",
            }
          ]
        }
      ]
    },

    // ==========================================
    // 2. COSMIC & ASTRAL SPHERE
    // ==========================================
    {
      id: "realm-astral",
      name: "Astral Sphere & The Great Wheel",
      hebrew: "עוֹלָם הַבְּרִיאָה וְגַלְגַּל הַמַּזָּלוֹת",
      category: "astral",
      level: 1,
      gematriaOrValue: "12 Constellations • 7 Spheres",
      description: "The intermediate dynamic heavens governing time cycles, planetary resonance, zodiacal influence matrices, and Enochian watchtowers.",
      realmDirective: "Harmonization of Astrological Energies & Epochal Cycles",
      children: [
        {
          id: "astral-zodiac-triplicities",
          name: "The 12 Zodiacal Constellations",
          hebrew: "שְׁנֵים עָשָׂר שִׁבְטֵי הַמַּזָּלוֹת",
          category: "zodiac",
          level: 2,
          gematriaOrValue: "360° Great Wheel",
          description: "The twelve archetypal houses of cosmic consciousness arranged in four elemental triplicities.",
          children: [
            {
              id: "zodiac-fire-triplicity",
              name: "Fire Triplicity (Ignis)",
              hebrew: "שְׁלֹשֶׁת מַזְּלוֹת הָאֵשׁ",
              category: "zodiac",
              level: 3,
              gematriaOrValue: "Aries • Leo • Sagittarius",
              description: "Dynamic will, spiritual illumination, catalytic courage, and unyielding divine inspiration.",
            },
            {
              id: "zodiac-earth-triplicity",
              name: "Earth Triplicity (Materia)",
              hebrew: "שְׁלֹשֶׁת מַזְּלוֹת הָעָפָר",
              category: "zodiac",
              level: 3,
              gematriaOrValue: "Taurus (1976) • Virgo • Capricorn",
              description: "Structural manifestation, crystalline permanence, foundational stewardship, and physical grounding.",
            },
            {
              id: "zodiac-air-triplicity",
              name: "Air Triplicity (Aer)",
              hebrew: "שְׁלֹשֶׁת מַזְּלוֹת הָרוּחַ",
              category: "zodiac",
              level: 3,
              gematriaOrValue: "Gemini • Libra • Aquarius",
              description: "Intellectual synthesis, balance of legal equity, atmospheric communication, and collective enlightenment.",
            },
            {
              id: "zodiac-water-triplicity",
              name: "Water Triplicity (Aqua)",
              hebrew: "שְׁלֹשֶׁת מַזְּלוֹת הַמַּיִם",
              category: "zodiac",
              level: 3,
              gematriaOrValue: "Cancer • Scorpio • Pisces",
              description: "Intuitive perception, emotional alchemy, oceanic memory, and psychic transmutation of shadow.",
            }
          ]
        },
        {
          id: "astral-planetary-spheres",
          name: "7 Planetary Intelligences",
          hebrew: "שִׁבְעַת כּוֹכְבֵי הַשֶּׁבֶת וְהַלֶּכֶת",
          category: "astral",
          level: 2,
          gematriaOrValue: "7 Classical Spheres",
          description: "The seven harmonic governors linking Sephirotic emanations to the energetic nervous system of the cosmos.",
          children: [
            {
              id: "planet-saturn-binah",
              name: "Saturn (Shabbathai • Binah)",
              hebrew: "שַׁבְּתַאי • בִּינָה",
              category: "astral",
              level: 3,
              gematriaOrValue: "712 (שבתאי)",
              description: "Understanding, cosmic time crystallization, karmic thresholds, and sacred discipline.",
            },
            {
              id: "planet-jupiter-chesed",
              name: "Jupiter (Tzedek • Chesed)",
              hebrew: "צֶדֶק • חֶסֶד",
              category: "astral",
              level: 3,
              gematriaOrValue: "194 (צדק)",
              description: "Lovingkindness, sovereign benevolence, spiritual expansion, and equitable abundance.",
            },
            {
              id: "planet-mars-gevurah",
              name: "Mars (Ma'adim • Gevurah)",
              hebrew: "מַאְדִּים • גְּבוּרָה",
              category: "astral",
              level: 3,
              gematriaOrValue: "95 (מאדים)",
              description: "Divine strength, strict judgment, interdiction of darkness, and warrior courage.",
            },
            {
              id: "planet-sun-tiphereth",
              name: "Sun (Chammah • Tiphereth)",
              hebrew: "חַמָּה • תִּפְאֶרֶת",
              category: "astral",
              level: 3,
              gematriaOrValue: "53 (חמה)",
              description: "Harmonic beauty, central solar radiance, conscious Christic/Logos heart alignment.",
            },
            {
              id: "planet-mercury-hod",
              name: "Mercury (Kokhav • Hod)",
              hebrew: "כּוֹכָב • הוֹד",
              category: "astral",
              level: 3,
              gematriaOrValue: "48 (כוכב)",
              description: "Splendor, sacred linguistic mathematics, analytical eloquence, and fast transmission.",
            },
            {
              id: "planet-moon-yesod",
              name: "Moon (Levanah • Yesod)",
              hebrew: "לְבָנָה • יְסוֹד",
              category: "astral",
              level: 3,
              gematriaOrValue: "87 (לבנה)",
              description: "The Foundation, reflection of light, subconscious conduits, and biorhythmic tides.",
            }
          ]
        },
        {
          id: "astral-enochian-calendar",
          name: "Enochian Solar Calendar & Nexus",
          hebrew: "מַחֲזוֹר שִׁמְשִׁי חֲנוֹכִי • 364 יָמִים",
          category: "astral",
          level: 2,
          gematriaOrValue: "364 Days = 52 Exact Weeks",
          description: "The pristine mathematical solar calendar revealed in 1 Enoch, free of lunar drift, with four 91-day quarterly seasons.",
          children: [
            {
              id: "enoch-4-intercalary",
              name: "4 Equinoctial Gatekeepers",
              hebrew: "אַרְבַּעַת שַׁעֲרֵי הַתְּקוּפָה",
              category: "astral",
              level: 3,
              gematriaOrValue: "91 × 4 = 364",
              description: "The seasonal cardinal days marking vernal equinox, summer solstice, autumnal equinox, and winter solstice.",
            },
            {
              id: "enoch-24-watchtowers",
              name: "24 Heavenly Watchtowers",
              hebrew: "עֶשְׂרִים וְאַרְבַּע מִשְׁמָרוֹת",
              category: "station",
              level: 3,
              gematriaOrValue: "24 Astral Bastions",
              description: "Perpetual celestial surveillance posts monitoring cosmic movements and planetary shield integrity.",
            }
          ]
        }
      ]
    },

    // ==========================================
    // 3. TELLURIC & PHYSICAL REALM
    // ==========================================
    {
      id: "realm-telluric",
      name: "Telluric Realm & Physical Manifestation",
      hebrew: "עוֹלָם הַיְצִירָה וְהָעֲשִׂיָּה הַגַּשְׁמִית",
      category: "telluric",
      level: 1,
      gematriaOrValue: "λ_S = 112.000 in • 1.10:1 SWR",
      description: "The dense physical dimension where universal constants govern atomic matter, the 5 classical elements interact, and the Ledger of Truth audits soul equity.",
      realmDirective: "Electrodynamic Impedance Matching & Telluric Stewardship",
      children: [
        {
          id: "telluric-constants",
          name: "Canonical Universal Constants",
          hebrew: "חֻקֵּי הַטֶּבַע הַנִּצְחִיִּים",
          category: "constant",
          level: 2,
          gematriaOrValue: "Perfect Lock 0.000% Deviation",
          description: "The immutable physical metrics that structure space, time, light velocity, and quantum information.",
          children: [
            {
              id: "const-salazarian-whip",
              name: "Salazarian 112\" Whip Resonance",
              hebrew: "תַּהֲוָה שֶׁל שׁוֹט סָלָזָאר 112 אִינְץ'",
              category: "constant",
              level: 3,
              gematriaOrValue: "λ_S = 112.000 in (284.48 cm)",
              description: "The sovereign resonant quarter-wave wavelength achieving exact 1.10:1 Standing Wave Ratio and zero reflected ethereal power.",
            },
            {
              id: "const-fine-structure",
              name: "Fine Structure Constant (α⁻¹)",
              hebrew: "קְבוּעַ הַמִּבְנֶה הַדַּק 137",
              category: "constant",
              level: 3,
              gematriaOrValue: "α⁻¹ = 137.035999 (קבלה = 137)",
              description: "The fundamental coupling constant of electromagnetic interaction, directly echoing the Hebrew gematria of Kabbalah (137).",
            },
            {
              id: "const-speed-of-light",
              name: "Speed of Light in Vacuum (c)",
              hebrew: "מְהִירוּת הָאוֹר c",
              category: "constant",
              level: 3,
              gematriaOrValue: "c = 299,792,458 m/s",
              description: "The absolute speed barrier of physical causation, anchoring relativistic time dilation and mass-energy equivalence.",
            },
            {
              id: "const-entropy-damping",
              name: "Boltzmann Entropy Damping (k_B)",
              hebrew: "בְּלִימַת הָאַנְטְרוֹפְּיָה הַקּוֹסְמִית",
              category: "constant",
              level: 3,
              gematriaOrValue: "k_B = 1.380649 × 10⁻²³ J/K",
              description: "Governs thermal disorder; damped by the Divine Order's anti-entropy field to preserve coherent information matrices.",
            }
          ]
        },
        {
          id: "telluric-elements",
          name: "The Five Core Elements (Arba Yesodot + Spiritus)",
          hebrew: "חֲמֵשֶׁת הַיְסוֹדוֹת הָרָאשִׁיִּים",
          category: "element",
          level: 2,
          gematriaOrValue: "Spiritus • Ignis • Aqua • Aer • Materia",
          description: "The five primordial phase-states of cosmic substance composing all matter and consciousness.",
          children: [
            {
              id: "elem-spiritus",
              name: "Spiritus (Quintessence / עצם)",
              hebrew: "עֶצֶם הַשָּׁמַיִם • אֵיתֶר",
              category: "element",
              level: 3,
              gematriaOrValue: "Divine Spark (10/10)",
              description: "Pure divine consciousness, subtle aether, connecting the soul directly to the prime source.",
            },
            {
              id: "elem-ignis",
              name: "Ignis (Fire / אש)",
              hebrew: "יְסוֹד הָאֵשׁ • לַהַב",
              category: "element",
              level: 3,
              gematriaOrValue: "Alchemical Sulfur (אש = 301)",
              description: "Dynamic will, catalytic passion, plasma ignition, and purification through trial.",
            },
            {
              id: "elem-aqua",
              name: "Aqua (Water / מים)",
              hebrew: "יְסוֹד הַמַּיִם • תְּהוֹם",
              category: "element",
              level: 3,
              gematriaOrValue: "Alchemical Mercury (מים = 90)",
              description: "Intuition, subconscious flow, cellular memory, and reflective emotional truth.",
            },
            {
              id: "elem-aer",
              name: "Aer (Air / רוח)",
              hebrew: "יְסוֹד הָרוּחַ • נְשָׁמָה",
              category: "element",
              level: 3,
              gematriaOrValue: "Philosophical Intellect (רוח = 214)",
              description: "Linguistic logic, breath of life, dialectical synthesis, and vocal prayer vibration.",
            },
            {
              id: "elem-materia",
              name: "Materia (Earth / עפר)",
              hebrew: "יְסוֹד הֶעָפָר • גּוּף",
              category: "element",
              level: 3,
              gematriaOrValue: "Alchemical Salt (עפר = 350)",
              description: "Physical crystallization, bone and earth density, tactile stability, and grounding.",
            }
          ]
        },
        {
          id: "telluric-ledger",
          name: "Ledger of Infinite Truth (Soul Equity)",
          hebrew: "סֵפֶר זִכָּרוֹן וְצֶדֶק נִצְחִי",
          category: "station",
          level: 2,
          gematriaOrValue: "760,000+ Units of Light",
          description: "Immutable cosmic accounting system balancing spiritual equity, auditing entropic debts, and recording consecrated service.",
          children: [
            {
              id: "ledger-enlightenment-equity",
              name: "Enlightenment Assets",
              hebrew: "זְכֻיּוֹת הַהֶאָרָה וְהַחָכְמָה",
              category: "station",
              level: 3,
              gematriaOrValue: "+Units of Spiritual Merit",
              description: "Accumulated merit generated through sacred research, cipher decoding, and selfless enlightenment.",
            },
            {
              id: "ledger-debt-reconciliation",
              name: "Entropic Debt Nullification",
              hebrew: "בִּטּוּל חוֹבוֹת הָאַנְטְרוֹפְּיָה",
              category: "station",
              level: 3,
              gematriaOrValue: "Zero Debt Target",
              description: "Systematic auditing of discordant energies through the Retributive Synthesis pillar.",
            }
          ]
        }
      ]
    },

    // ==========================================
    // 4. SCRIPTURAL & APOCRYPHAL SCHOLARSHIP
    // ==========================================
    {
      id: "realm-scholarship",
      name: "Scriptural & Apocryphal Archives",
      hebrew: "גְּנִיזַת מְגִלּוֹת קֹדֶשׁ וּמִדְרַשׁ חֲכָמִים",
      category: "scholarship",
      level: 1,
      gematriaOrValue: "Qumran • Enoch • Melchizedek",
      description: "The historical library of primary manuscripts, ancient codices, and esoteric commentaries anchoring the Salazar scholarship.",
      realmDirective: "Textual Reconstruction & Gematria Decipherment",
      children: [
        {
          id: "scholarship-dead-sea-scrolls",
          name: "Dead Sea Scrolls (Qumran Cave Archives)",
          hebrew: "מְגִלּוֹת יַם הַמֶּלַח • קוּמְרָאן",
          category: "scroll",
          level: 2,
          gematriaOrValue: "1QS • 1QM • 11Q13 • 11Q19",
          description: "Ancient 2,000-year-old parchment scrolls preserving the true calendar, eschatological war of light against darkness, and priestly lineage.",
          children: [
            {
              id: "scroll-community-rule",
              name: "Community Rule (1QS Serekh Ha-Yahad)",
              hebrew: "סֶרֶךְ הַיַּחַד • 1QS",
              category: "scroll",
              level: 3,
              gematriaOrValue: "Oath of the Sons of Light",
              description: "The constitution of the righteous covenant, mandating radical truth, communal charity, and vigilance.",
            },
            {
              id: "scroll-war-rule",
              name: "The War Scroll (1QM Milhamah)",
              hebrew: "מְגִלַּת מִלְחֶמֶת בְּנֵי אוֹר",
              category: "scroll",
              level: 3,
              gematriaOrValue: "40-Year Eschatological Battle",
              description: "Detailed tactical instructions for the final confrontation between the Sons of Light and the Army of Belial.",
            },
            {
              id: "scroll-melchizedek-11q13",
              name: "Melchizedek Scroll (11Q13)",
              hebrew: "מְגִלַּת מַלְכִּי-צֶדֶק • 11Q13",
              category: "scroll",
              level: 3,
              gematriaOrValue: "Year of the Jubilee Release",
              description: "Reveals Melchizedek as the divine judge of the heavenly court executing the decrees of Elohim.",
            }
          ]
        },
        {
          id: "scholarship-enochian-canon",
          name: "Enochian & Metatronic Manuscripts",
          hebrew: "סִפְרֵי חֲנוֹךְ וּמַרְאוֹת הַמֶּרְכָּבָה",
          category: "scroll",
          level: 2,
          gematriaOrValue: "1 Enoch • 2 Enoch • 3 Enoch",
          description: "The apocalyptic revelations granted to Enoch before the Flood, documenting the celestial realms and astronomy.",
          children: [
            {
              id: "scroll-book-watchers",
              name: "Book of the Watchers (1 Enoch 1-36)",
              hebrew: "סֵפֶר הָעִירִין וְהַנְּפִילִים",
              category: "scroll",
              level: 3,
              gematriaOrValue: "200 Fallen Decani",
              description: "Account of the rebellious Watchers who corrupted the earth with illicit technology, and their judgment.",
            },
            {
              id: "scroll-3-enoch-metatron",
              name: "3 Enoch (Hebrew Sefer Hekhalot)",
              hebrew: "סֵפֶר הֵיכָלוֹת • חֲנוֹךְ הָעִבְרִי",
              category: "scroll",
              level: 3,
              gematriaOrValue: "72 Wings of Flame",
              description: "Rabbi Ishmael's ascent to the seventh heaven, witnessing Enoch's transformation into Metatron, the Lesser YHWH.",
            }
          ]
        },
        {
          id: "scholarship-canonical-scripture",
          name: "Canonical Scriptures & Sacred Gematria",
          hebrew: "תּוֹרָה, בְּשׂוֹרָה וְסִפְרֵי קֹדֶשׁ",
          category: "scroll",
          level: 2,
          gematriaOrValue: "Genesis 1:1 • John 1:1 • Rev 21",
          description: "The primary biblical and sacred foundations revealing the architectural Logos in creation and final redemption.",
          children: [
            {
              id: "scripture-genesis-creation",
              name: "Genesis 1:1 (Bereshit Blueprint)",
              hebrew: "בְּרֵאשִׁית בָּרָא אֱלֹהִים",
              category: "scroll",
              level: 3,
              gematriaOrValue: "2701 (37 × 73 = 2701)",
              description: "The mathematical cornerstone of creation: 7 words, 28 letters, yielding the 73rd triangular number.",
            },
            {
              id: "scripture-john-logos",
              name: "Gospel of John 1:1 (The Divine Logos)",
              hebrew: "בְּרֵאשִׁית הָיָה הַדָּבָר (Logos)",
              category: "scroll",
              level: 3,
              gematriaOrValue: "Logos = 373",
              description: "Affirms that all things were made through the spoken Word, and without Him was not anything made that was made.",
            },
            {
              id: "scripture-new-jerusalem",
              name: "Revelation 21 (New Jerusalem Cube)",
              hebrew: "יְרוּשָׁלַיִם הַחֲדָשָׁה • 144 אַמּוֹת",
              category: "geometry",
              level: 3,
              gematriaOrValue: "12,000 Furlongs • 144 Cubits",
              description: "The sacred geometric cube city descending from heaven, built of gold and 12 precious gemstone foundations.",
            }
          ]
        }
      ]
    }
  ]
};
