import { UniversalConstant, StewardshipStation, DivineDecree, LedgerEntry } from '../types/divineOrder';

export const CANONICAL_CONSTANTS: UniversalConstant[] = [
  {
    id: 'c-light',
    name: 'Speed of Light in Aetheric Vacuum',
    symbol: 'c',
    canonicalValue: '299,792,458',
    currentObserved: '299,792,458.000',
    unit: 'm / s',
    deviationPercent: 0.000,
    status: 'PERFECT_LOCK',
    domain: 'Spacetime Geometric Grid',
    salazarianRatio: 'Exact 1.000000000 Logos Lock'
  },
  {
    id: 'salazar-whip',
    name: 'Salazarian Whip Standing Wave Resonance',
    symbol: 'λ_S',
    canonicalValue: '112.000',
    currentObserved: '112.000',
    unit: 'inches (102" rod + 10" spring)',
    deviationPercent: 0.000,
    status: 'PERFECT_LOCK',
    domain: 'Electrodynamic & Transceiver Matching',
    salazarianRatio: '27.185 MHz (1.1:1 SWR Zero Reflection)'
  },
  {
    id: 'fine-structure',
    name: 'Fine Structure Constant Inverse',
    symbol: 'α⁻¹',
    canonicalValue: '137.035999',
    currentObserved: '137.035999',
    unit: 'dimensionless',
    deviationPercent: 0.000,
    status: 'PERFECT_LOCK',
    domain: 'Quantum Electrodynamics & Astral Aura',
    salazarianRatio: 'Kabbalistic Gematria Prime (137 = Qabalah)'
  },
  {
    id: 'planck-reduced',
    name: 'Reduced Planck Constant of Action',
    symbol: 'ℏ',
    canonicalValue: '1.054571817 × 10⁻³⁴',
    currentObserved: '1.054571817 × 10⁻³⁴',
    unit: 'J · s',
    deviationPercent: 0.000,
    status: 'PERFECT_LOCK',
    domain: 'Logos Subatomic Granularity',
    salazarianRatio: 'Fundamental Action Quantum'
  },
  {
    id: 'golden-ratio',
    name: 'Golden Divine Harmonic Ratio',
    symbol: 'Φ',
    canonicalValue: '1.6180339887',
    currentObserved: '1.6180339887',
    unit: 'ratio',
    deviationPercent: 0.000,
    status: 'PERFECT_LOCK',
    domain: 'Macro-Cosmic & Sacred Architecture',
    salazarianRatio: 'Fractal Expansion of the Divine Office'
  },
  {
    id: 'grav-constant',
    name: 'Newtonian Gravitational Coupling',
    symbol: 'G',
    canonicalValue: '6.67430 × 10⁻¹¹',
    currentObserved: '6.67430 × 10⁻¹¹',
    unit: 'm³ · kg⁻¹ · s⁻²',
    deviationPercent: 0.000,
    status: 'PERFECT_LOCK',
    domain: 'Physical Plane Materia Anchor',
    salazarianRatio: 'Taurus Telluric Density Vector'
  },
  {
    id: 'entropy-damping',
    name: 'Boltzmann Entropy Damping Factor',
    symbol: 'k_B · ΔS',
    canonicalValue: '1.380649 × 10⁻²³',
    currentObserved: '1.380649 × 10⁻²³',
    unit: 'J / K',
    deviationPercent: 0.000,
    status: 'PERFECT_LOCK',
    domain: 'Anti-Entropy Governance Barrier',
    salazarianRatio: 'Divine Order Resistance Matrix'
  }
];

export const CANONICAL_STATIONS: StewardshipStation[] = [
  {
    id: 'st-00',
    stationCode: 'STATION-PRIME-00',
    entityName: 'Grand Architect Jerry Ben Salazar (Creator)',
    archetype: 'Administrator of the Logos & Master Builder (J • B • 76)',
    assignedDimension: 'Omni-Dimensional Central Throne & 2nd House Monolith',
    entropyResistance: 100,
    dutyDirective: 'Sovereign governance, issuance of divine decrees, calibration of the 112" aetheric whip, and cosmic ledger oversight.',
    standingWaveResonance: '1.1:1 SWR Infinite Purity (Zero Reflected Power)',
    status: 'ALIGNED'
  },
  {
    id: 'st-01',
    stationCode: 'STATION-ASFFU-01',
    entityName: 'Supreme Commander Lucifer Morningstar-Prime',
    archetype: 'Sovereign Light-Bearer & Solar Nova Decrees',
    assignedDimension: 'Celestial Apex & Defense Fleet Command',
    entropyResistance: 99.9,
    dutyDirective: 'Enforcement of Divine Decrees across astral vectors, solar illumination, and executive sword-strike defense.',
    standingWaveResonance: 'Solar Flare Coherence 99.8%',
    status: 'ALIGNED'
  },
  {
    id: 'st-02',
    stationCode: 'STATION-ASFFU-02',
    entityName: 'Specialist Apocalypse Cataclysm-X',
    archetype: 'Revelation Breacher & Veil Shatterer',
    assignedDimension: 'Dimensional Thresholds & Inter-Universal Portals',
    entropyResistance: 99.7,
    dutyDirective: 'Breaching hostile unmanifest incursions, rapid tactical revelation, and quantum purification.',
    standingWaveResonance: 'Hyper-Resonant Plasma Vanguard',
    status: 'ALIGNED'
  },
  {
    id: 'st-03',
    stationCode: 'STATION-ASFFU-03',
    entityName: 'Specialist Apocryphon',
    archetype: 'Keeper of the Hidden Vaults & Crypt-Watch',
    assignedDimension: 'The Sealed Archive of Primordial Knowledge',
    entropyResistance: 99.8,
    dutyDirective: 'Safeguarding classified ciphers, dead sea scrolls, and ancient cuneiform royal directives.',
    standingWaveResonance: 'Zero-Leakage Cryptographic Isolation',
    status: 'ALIGNED'
  },
  {
    id: 'st-04',
    stationCode: 'STATION-ASFFU-04',
    entityName: 'Specialist Life',
    archetype: 'Regenerative Incorruptibility & Bioplasmic Healing',
    assignedDimension: 'The Tree of Life & Soul Matrix Weave',
    entropyResistance: 100,
    dutyDirective: 'Restoration of biological and spiritual vessels, immortality covenants, and harmonic cellular rejuvenation.',
    standingWaveResonance: 'Pure Vital Spark Harmonic',
    status: 'ALIGNED'
  },
  {
    id: 'st-05',
    stationCode: 'STATION-ASFFU-05',
    entityName: 'Specialist Azrael',
    archetype: 'Kinetic & Heavy Ordinance Enforcer',
    assignedDimension: 'Subatomic Boundary & Kinetic Perimeter',
    entropyResistance: 99.5,
    dutyDirective: 'Total disruption of dark entropy nodes, kinetic interdiction, and soul transition security.',
    standingWaveResonance: 'Heavy Graviton Wave 1.05:1',
    status: 'ALIGNED'
  },
  {
    id: 'st-06',
    stationCode: 'STATION-ASFFU-06',
    entityName: 'Specialist Apollyon',
    archetype: 'Abyssal Mind-Grid Interdictor',
    assignedDimension: 'Deep Subconscious & Cognitive Void Perimeter',
    entropyResistance: 99.6,
    dutyDirective: 'Neutralization of cognitive psychic parasites, abyssal quarantine, and neural barrier fortification.',
    standingWaveResonance: 'Infrasonic Null-Field Coherence',
    status: 'ALIGNED'
  },
  {
    id: 'st-07',
    stationCode: 'STATION-LOGOS-07',
    entityName: 'Divine Anchor YAHWEH',
    archetype: 'The Eternal Unchanging Root (I AM THAT I AM)',
    assignedDimension: 'The Absolute Center of All Manifested Existence',
    entropyResistance: 100,
    dutyDirective: 'Universal ontological stabilization, prime foundation of existence, and source of divine authority.',
    standingWaveResonance: 'Prime Harmonic 0.000 Drift',
    status: 'ALIGNED'
  }
];

export const INITIAL_DECREES: DivineDecree[] = [
  {
    id: 'dec-001',
    decreeNumber: 'DECREE-LOGOS-76-001',
    title: 'The Sovereign Injunction of Anti-Entropy and Cosmic Governance',
    pillar: 'SOVEREIGN_MANDATE',
    targetDomain: 'All Manifested Spacetime & Subatomic Lattices',
    author: 'Grand Architect Jerry Ben Salazar (Creator)',
    sealStamp: 'SEAL-J-B-76-DIVINE-LOGOS-ETERNAL',
    summary: 'Proclaiming that existence is fundamentally structured by Architectural Will. Chaos is hereby declared an unregistered variable subject to immediate reconciliation by the Office of the Divine Order.',
    liturgyDirectives: [
      'Every subatomic movement and civilizational trajectory must comply with the divine blueprint of necessity.',
      'Language is recognized as the supreme legal directive of the physical plane; spoken intent exerts legal force over matter.',
      'Sovereign compliance is declared the ultimate expression of freedom.'
    ],
    constantsEnforced: [
      { name: 'Speed of Light', symbol: 'c', value: '299,792,458 m/s', variance: '0.000%' },
      { name: 'Entropy Damping', symbol: 'k_B · ΔS', value: '1.380649 × 10⁻²³ J/K', variance: '0.000%' }
    ],
    status: 'SEALED_ETERNAL',
    timestamp: 'ORIGIN ZULU • 04/29/1976',
    harmonicRating: 100,
    astralSignature: 'SIG-76-ARCHITECT-ALPHA-OMEGA'
  },
  {
    id: 'dec-002',
    decreeNumber: 'DECREE-LOGOS-76-002',
    title: 'Decree of the 112-Inch Aetheric Whip & 1.1:1 SWR Matching Resonance',
    pillar: 'CALIBRATION',
    targetDomain: 'Electrodynamic Invocations & Transceiver Antenna Grids',
    author: 'Grand Architect Jerry Ben Salazar (Creator)',
    sealStamp: 'SEAL-J-B-76-112-INCH-HARMONIC',
    summary: 'Mandating that all spiritual and physical transceivers maintain exact 112-inch electrical length (102" rod + 10" heavy barrel spring) to ensure zero reflected ego power and 100% forward transmission to the Creator.',
    liturgyDirectives: [
      'Standing wave reflections exceeding 1.3:1 SWR are to be actively retuned with the barrel spring.',
      'Coaxial impedance shall remain strictly locked to 50 Ohms pure resistive load.',
      'Invocations broadcast at 27.185 MHz receive immediate priority routing across celestial channels.'
    ],
    constantsEnforced: [
      { name: 'Salazarian Whip Resonance', symbol: 'λ_S', value: '112.000 in', variance: '0.000%' },
      { name: 'SWR Impedance Lock', symbol: 'Z_0', value: '50.00 Ω', variance: '0.000%' }
    ],
    status: 'SEALED_ETERNAL',
    timestamp: '1976-04-29T00:00:00 ZULU',
    harmonicRating: 99.8,
    astralSignature: 'SIG-76-WHIP-RESONANCE-ZERO-REFLECTION'
  },
  {
    id: 'dec-003',
    decreeNumber: 'DECREE-LOGOS-76-003',
    title: 'Establishment of the Ledger of Infinite Truth and Soul-Currency Auditing',
    pillar: 'RETRIBUTIVE_SYNTHESIS',
    targetDomain: 'Soul Matrix & Karmic Balance Registry',
    author: 'Grand Architect Jerry Ben Salazar (Creator)',
    sealStamp: 'SEAL-J-B-76-LEDGER-INFINITE-TRUTH',
    summary: 'The Office functions as the Supreme Auditor of eternity. No action, vibration, or prayer is lost; all existence debts are weighed and balanced against the Ledger of Infinite Truth.',
    liturgyDirectives: [
      'Actions are continuously audited for alignment with divine logos.',
      'Enlightenment assets are permanently archived in indelible crystal repositories.',
      'Entropic deficits are resolved through sincere alchemical transmutation and disciplined stewardship.'
    ],
    constantsEnforced: [
      { name: 'Golden Harmonic Ratio', symbol: 'Φ', value: '1.6180339887', variance: '0.000%' }
    ],
    status: 'SEALED_ETERNAL',
    timestamp: '1976-04-29T12:00:00 ZULU',
    harmonicRating: 100,
    astralSignature: 'SIG-76-LEDGER-ETERNAL-TRUTH'
  },
  {
    id: 'dec-004',
    decreeNumber: 'DECREE-LOGOS-76-004',
    title: 'Authorization of the ASFFU Vanguard Strike & Multi-Planar Defense',
    pillar: 'ALIGNMENT',
    targetDomain: 'Perimeter Defense & Interdimensional Astral Boundaries',
    author: 'Grand Architect Jerry Ben Salazar (Creator)',
    sealStamp: 'SEAL-J-B-76-ASFFU-SUPREME-DEFENSE',
    summary: 'Mobilizing Supreme Commander Lucifer Morningstar-Prime, Specialist Apocalypse, Specialist Apocryphon, Specialist Life, Specialist Azrael, and Specialist Apollyon for autonomous interdiction of dimensional anomalies.',
    liturgyDirectives: [
      'ASFFU squadron maintains instant readiness for 0.001s manifestation.',
      'TFDAS armament systems authorized to deploy cleansing plasma torpedoes and solar nova decrees against hostile incursions.',
      'Cognitive mind-grid protected against unauthorized thought intrusions.'
    ],
    constantsEnforced: [
      { name: 'Fine Structure Constant', symbol: 'α⁻¹', value: '137.035999', variance: '0.000%' }
    ],
    status: 'SEALED_ETERNAL',
    timestamp: 'CURRENT ERA ZULU',
    harmonicRating: 99.9,
    astralSignature: 'SIG-76-ASFFU-SUPREME-COUNCIL'
  }
];

export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'led-001',
    auditCode: 'AUD-76-LOGOS-01',
    entityOrRealm: 'Telluric Alchemical Vessel (Taurus 1976 • Materia)',
    deedDescription: 'Inscribed foundational scholarship into the Celestial Oracle and anchored the 2nd House Sacred Monolith.',
    spiritualEquityType: 'LOGOS_ALIGNMENT',
    currencyMagnitude: 760000,
    balanceStatus: 'BALANCED',
    auditor: 'Grand Architect Jerry Ben Salazar',
    timestamp: '2026-08-20T18:00:00 ZULU',
    resolutionDirective: 'Archived as Eternal Sovereign Asset in the Ledger of Infinite Truth.'
  },
  {
    id: 'led-002',
    auditCode: 'AUD-76-CALIB-02',
    entityOrRealm: 'The Great Wheel of Mysteries Portal',
    deedDescription: 'Harmonized 112-inch aetheric whip antenna matching, reducing reflected spiritual resistance to 1.1:1 SWR.',
    spiritualEquityType: 'ENLIGHTENMENT_ASSET',
    currencyMagnitude: 112000,
    balanceStatus: 'BALANCED',
    auditor: 'Supreme Council Auditor',
    timestamp: '2026-08-20T16:30:00 ZULU',
    resolutionDirective: 'Full celestial bandwidth allocated for hands-free vocal proclamation.'
  },
  {
    id: 'led-003',
    auditCode: 'AUD-76-DEF-03',
    entityOrRealm: 'Dimensional Perimeter Sector 7',
    deedDescription: 'Neutralized simulation incursion via ASFFU vanguard strike and purified corrupted aura.',
    spiritualEquityType: 'SACRED_SERVICE',
    currencyMagnitude: 490000,
    balanceStatus: 'BALANCED',
    auditor: 'Supreme Commander Lucifer Morningstar-Prime',
    timestamp: '2026-08-20T14:15:00 ZULU',
    resolutionDirective: 'Perimeter reinforced with seraphic flame barrier and infrasonic null-fields.'
  },
  {
    id: 'led-004',
    auditCode: 'AUD-76-MANDATE-04',
    entityOrRealm: 'Office of the Divine Order Central Archives',
    deedDescription: 'Promulgated the Three Pillars of Execution: Calibration, Hierarchical Alignment, and Retributive Synthesis.',
    spiritualEquityType: 'LOGOS_ALIGNMENT',
    currencyMagnitude: 999999,
    balanceStatus: 'BALANCED',
    auditor: 'Grand Architect Jerry Ben Salazar',
    timestamp: '2026-08-20T12:00:00 ZULU',
    resolutionDirective: 'Permanent constitutional baseline established for all cosmic administrative functions.'
  }
];
