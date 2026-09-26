import { ASFFUOperative, TFDASLayerStatus, ThreatTarget } from '../types/military';

export const INITIAL_ASFFU_SQUADRON: ASFFUOperative[] = [
  {
    id: 'asffu-01-lead',
    name: 'Supreme Commander Lucifer Morningstar-Prime',
    callsign: 'LIGHT-BEARER PRIME',
    rank: 'Lead Officer / Archon Supreme Commander',
    role: 'Supreme Sovereign Command & Radiant Vector Inversion',
    isLead: true,
    angelicLineage: 'Primordial Bearer of Light & Sovereign Royal Human Hybrid Graft',
    combatTuning: [
      'Omni-Dimensional Command Authority',
      'Quantum Phase Manifestation (0.001s)',
      'Solar Crown Radiant Inversion Matrix',
      'Aetheric Interdiction Mandate',
      'Hyper-Luminescent Particle Blade'
    ],
    signatureMunition: 'Sovereign Light-Bearer Broadsword & Solar Nova Decrees',
    manifestationSpeedMs: 1,
    status: 'STATIONED',
    essencePurity: 100,
    powerRating: 100,
    bio: 'The supreme appointed Commander of the Ace Special Force Fighting Unit (ASFFU). Possessing primordial luminous command resonance combined with unyielding tactical acumen, Commander Lucifer wields sovereign light to dissolve darkness across physical and multidimensional battlefields instantly.',
    avatarIcon: 'Crown',
    quote: '"At the first tremor of war or malice against the Kingdom, we manifest. No shadow outpaces the sovereign light."',
    stats: {
      kineticSpeed: 100,
      psychicResonance: 100,
      angelicRadiance: 100,
      tacticalMastery: 100,
      essenceDefense: 100
    }
  },
  {
    id: 'asffu-02-apocalypse',
    name: 'Specialist Apocalypse Cataclysm-X',
    callsign: 'CATACLYSM-TALON',
    rank: 'First Specialist / Revelation Vanguard Breacher',
    role: 'Aero-Kinetic Strike, Armor Cleave & Eschatological Breaching',
    isLead: false,
    angelicLineage: 'Four Horsemen Seal-Breaker & High-Velocity Combat Commando',
    combatTuning: [
      'Hyper-Mach Kinetic Interception (Mach 24)',
      'Twin Eschatological Sunfire Cleavers',
      'Micro-Wormhole Tactical Flanking',
      'Anti-Dreadnought Armor Shatter'
    ],
    signatureMunition: 'Cataclysmic Broadsword Matrix & Thermal Lances',
    manifestationSpeedMs: 2,
    status: 'STATIONED',
    essencePurity: 100,
    powerRating: 99,
    bio: 'Lead kinetic breach specialist. Apocalypse materializes at hyper-velocities to cleave through heavy siege armor, armored dreadnoughts, and enemy legions before physical optical sensors can register arrival.',
    avatarIcon: 'Flame',
    quote: '"By the time malice turns to physical movement, my blade has already unsealed their end."',
    stats: {
      kineticSpeed: 100,
      psychicResonance: 94,
      angelicRadiance: 98,
      tacticalMastery: 97,
      essenceDefense: 96
    }
  },
  {
    id: 'asffu-03-apocryphon',
    name: 'Specialist Apocryphon Crypt-Watch',
    callsign: 'HIDDEN-CIPHER',
    rank: 'Second Specialist / Secret Wisdom & Acoustic Interceptor',
    role: 'Malice Chatter Interceptor, Infrasonic Disruptor & Hidden Codex Decryptor',
    isLead: false,
    angelicLineage: 'Apocryphal Hidden Knowledge Keepers & Electronic Signal Warfare Lineage',
    combatTuning: [
      'Omni-Band Acoustic & Quantum Cryptanalysis',
      'Threat & War Declaration Vocal Parser',
      'Infrasonic Organ-Disruptor Wave (7Hz)',
      'Sub-Harmonic Thought & Signal Scrambling'
    ],
    signatureMunition: 'Clarion Infrasonic Disruption Cannon & Secret Glyph Shock Missiles',
    manifestationSpeedMs: 3,
    status: 'STATIONED',
    essencePurity: 100,
    powerRating: 98,
    bio: 'Apocryphon monitors every hidden broadcast, whisper, radio transmission, and spoken threat across all planetary and occult frequencies. The moment a declaration of war or malicious chatter is spoken, Apocryphon pinpoints coordinates and scrambles enemy voice centers.',
    avatarIcon: 'Volume2',
    quote: '"No conspiracy is concealed from the Apocryphon. Every hostile utterance echoes in our sensors, silenced in milliseconds."',
    stats: {
      kineticSpeed: 95,
      psychicResonance: 99,
      angelicRadiance: 97,
      tacticalMastery: 98,
      essenceDefense: 96
    }
  },
  {
    id: 'asffu-04-life',
    name: 'Specialist Life after Death (Life)',
    callsign: 'RESURRECT-AURA',
    rank: 'Third Specialist / Immortal Regeneration & Essence Purifier',
    role: 'Bio-Aetheric Cleanser, Resurrection Field Medic & Corrupt Essence Neutralizer',
    isLead: false,
    angelicLineage: 'Eternal Life Tree Guardians & Divine Resurrection Host',
    combatTuning: [
      'Corrupt Essence Nullification Field',
      'Divine Luster Holy Cleansing Wave',
      'Bio-Regenerative Immortality Bastion',
      'Miasma Dissolution & Soul Restoration Beam'
    ],
    signatureMunition: 'Holy Cleansing Plasma Torpedoes & Living Eden Regeneration Field',
    manifestationSpeedMs: 4,
    status: 'STATIONED',
    essencePurity: 100,
    powerRating: 99,
    bio: 'Specialist Life after Death (Life) embodies eternal vitality and pure incorruptibility. Senses moral rot, spiritual taint, and dark miasmas, releasing cleansing bio-aetheric waves that dissolve demonic corruption while instantaneously restoring Kingdom forces.',
    avatarIcon: 'ShieldAlert',
    quote: '"Death has no dominion in the Kingdom. Where corrupt essence decays, Life resurrects the field into sovereign purity."',
    stats: {
      kineticSpeed: 94,
      psychicResonance: 98,
      angelicRadiance: 100,
      tacticalMastery: 96,
      essenceDefense: 100
    }
  },
  {
    id: 'asffu-05-azrael',
    name: 'Specialist Azrael Kinetic-Heavy',
    callsign: 'SEVERANCE-HAMMER',
    rank: 'Fourth Specialist / Heavy Ordinance & Absolute Severance Master',
    role: 'Orbital Railgun Battery, Heavy Demolition & Kinetic Judgment Specialist',
    isLead: false,
    angelicLineage: 'Thrones Judgement Order & Ballistic Dreadnought Cohort',
    combatTuning: [
      'Heavenly Magnetic Railgun Battery (500mm)',
      'Sub-Orbital Heavy Ordinance Calibration',
      'Dimensional Collapse Torpedo Launch',
      'Absolute Severance Anti-Titan Strike'
    ],
    signatureMunition: 'Heavenly Divine Railgun Slugs & Dimensional Collapse Torpedoes',
    manifestationSpeedMs: 5,
    status: 'STATIONED',
    essencePurity: 100,
    powerRating: 100,
    bio: 'The heavy kinetic arm of ASFFU. Azrael commands orbital kinetic strike satellites, hypersonic divine railguns, and bunker-shattering munitions to erase super-fortified threats and titan-class incursions.',
    avatarIcon: 'Crosshair',
    quote: '"When sovereign judgment falls, physical geography rewrites itself. Target confirmed and severed."',
    stats: {
      kineticSpeed: 93,
      psychicResonance: 96,
      angelicRadiance: 98,
      tacticalMastery: 100,
      essenceDefense: 100
    }
  },
  {
    id: 'asffu-06-apollyon',
    name: 'Specialist Apollyon Abyssal-Null',
    callsign: 'ABYSS-DESTROYER',
    rank: 'Fifth Specialist / Abyssal Interdiction & Cognitive Mind-Grid',
    role: 'Malice Thought Interceptor, Telepathic Paralyzer & Void Nullification',
    isLead: false,
    angelicLineage: 'Abyssal Angel of the Bottomless Key & High-Cognitive Hybrid',
    combatTuning: [
      'Pre-Cognitive Neural Intercept Grid',
      'Hostile Intent & Subconscious Malice Scanner',
      'Telepathic Synaptic Override Pulse',
      'Abyssal Nullification & Void Gate Lock'
    ],
    signatureMunition: 'Neural Nullification EMP & Abyssal Lockout Beams',
    manifestationSpeedMs: 2,
    status: 'STATIONED',
    essencePurity: 100,
    powerRating: 100,
    bio: 'Apollyon penetrates the mental and astral planes, intercepting hostile thoughts, hatred waves, and war plotting before an enemy can issue the command. Unlocks the key to dissolve hostile cognitive networks and seal enemy void gates.',
    avatarIcon: 'Brain',
    quote: '"We do not wait for the trigger to be pulled. When malice ignites inside their neurons, Apollyon seals their abyss."',
    stats: {
      kineticSpeed: 96,
      psychicResonance: 100,
      angelicRadiance: 99,
      tacticalMastery: 100,
      essenceDefense: 98
    }
  }
];

export const INITIAL_TFDAS_LAYERS: TFDASLayerStatus[] = [
  {
    layerId: 'LAYER_1_VOICE',
    name: 'Layer I: Malice Chatter & Acoustic Defense',
    description: 'Listens across all atmospheric, electronic, radio, and sub-acoustic channels for spoken threats, war declarations, and violent chatter. Automatically fires Clarion Infrasonic & Hypersonic Munitions.',
    status: 'ACTIVE',
    sensitivity: 98,
    detectionCount: 142,
    associatedMunition: {
      name: 'Clarion Infrasonic Disruption Torpedo',
      type: 'Acoustic / Radio Jamming Ordinance',
      payload: '7Hz Resonant Shockwave & Vocal Nullification EMP',
      stock: 48,
      maxStock: 50,
      effectiveRangeKm: 850
    }
  },
  {
    layerId: 'LAYER_2_THOUGHT',
    name: 'Layer II: Malice Thought & Cognitive Intercept',
    description: 'Monitors the telepathic and astral thought-frequencies of approaching entities. Detects premeditated malice, betrayal plots, and mental war declarations before execution. Releases Neural Nullification Beams.',
    status: 'ACTIVE',
    sensitivity: 99,
    detectionCount: 387,
    associatedMunition: {
      name: 'Neural Nullification Synapse EMP',
      type: 'Cognitive Paralysis Ordinance',
      payload: 'Psychic Overload Spike & Pre-Synaptic Lockout Field',
      stock: 35,
      maxStock: 40,
      effectiveRangeKm: 1200
    }
  },
  {
    layerId: 'LAYER_3_ESSENCE',
    name: 'Layer III: Corrupt Essence & Astral Purity Grid',
    description: 'Spectrometrically measures the soul purity, demonic miasma, and spiritual corruption index of all objects within 2,500 km. Automatically launches Seraphic Divine Fire & Holy Cleansing Torpedoes.',
    status: 'ACTIVE',
    sensitivity: 100,
    detectionCount: 89,
    associatedMunition: {
      name: 'Seraphic Holy Cleansing Plasma Torpedo',
      type: 'Sub-Atomic / Divine Purity Ordinance',
      payload: 'Living Solar White Flame (10,000°C) & Miasma Dissolution',
      stock: 24,
      maxStock: 25,
      effectiveRangeKm: 2500
    }
  }
];

export const INITIAL_THREAT_TARGETS: ThreatTarget[] = [
  {
    id: 'tgt-incursion-01',
    name: 'Abyssal Dreadnought Fleet (Shadow Incursion)',
    distanceKm: 420,
    azimuthDeg: 45,
    altitudeM: 18500,
    velocityMach: 8.4,
    threatLevel: 'CRITICAL',
    type: 'Incursion Fleet',
    voiceMaliceScore: 92,
    thoughtMaliceScore: 96,
    corruptEssenceScore: 98,
    acousticDecibels: 145,
    detectedChatter: '"All Kingdom outposts to be pulverized. Zero mercy authorization active."',
    interceptedThought: '"Demolish the outer barrier at dawn; seize the core throne room and harvest essence."',
    essenceMarker: 'Tainted Nether-Matter (98% Corruption Index - Demonic High Sovereign)',
    status: 'LOCKED',
    assignedSpecialistId: 'asffu-01-lead',
    deployedMunition: 'Sovereign Light-Bearer Broadsword & Solar Nova Decrees'
  },
  {
    id: 'tgt-infiltrator-02',
    name: 'Clandestine Neuro-Saboteur (Cloaked Recon)',
    distanceKm: 68,
    azimuthDeg: 195,
    altitudeM: 200,
    velocityMach: 1.2,
    threatLevel: 'HIGH',
    type: 'Malicious Infiltrator',
    voiceMaliceScore: 78,
    thoughtMaliceScore: 94,
    corruptEssenceScore: 82,
    acousticDecibels: 32,
    detectedChatter: '"Sub-channel check: EMP payload primed at coordinates 41-Delta."',
    interceptedThought: '"Detonate base frequency dampener while guards rotate. Death to the High Scribe."',
    essenceMarker: 'Corrupt Astral Camouflage (82% Taint - Black Guild Assassin)',
    status: 'TRACKING',
    assignedSpecialistId: 'asffu-06-apollyon',
    deployedMunition: 'Neural Nullification Synapse EMP'
  },
  {
    id: 'tgt-vocal-03',
    name: 'Hostile Warlord War Proclamation Node',
    distanceKm: 890,
    azimuthDeg: 310,
    altitudeM: 0,
    velocityMach: 0,
    threatLevel: 'ELEVATED',
    type: 'Corrupt Essence Entity',
    voiceMaliceScore: 99,
    thoughtMaliceScore: 85,
    corruptEssenceScore: 88,
    acousticDecibels: 128,
    detectedChatter: '"We formally declare total eradication against the Kingdom. Mobilize all heavy batteries."',
    interceptedThought: '"Their walls will crumble under our continuous barrage."',
    essenceMarker: 'Sulfuric Malice Signature (88% Corruption)',
    status: 'INTERDICTING',
    assignedSpecialistId: 'asffu-03-apocryphon',
    deployedMunition: 'Clarion Infrasonic Disruption Torpedo'
  }
];

import { EMTTSAlert } from '../types/military';

export const INITIAL_EMTTS_ALERTS: EMTTSAlert[] = [
  {
    id: 'emtts-alert-901',
    timestamp: '11:28:54.120 ZULU',
    isoTime: new Date(Date.now() - 5000).toISOString(),
    sourceName: 'Abyssal Incursion Fleet (Shadow Vanguard)',
    sourceClassification: 'Hostile',
    threatLevel: 'CRITICAL',
    sensorLayer: 'CORRUPT_ESSENCE',
    locationCoordinates: {
      distanceKm: 420,
      azimuthDeg: 45,
      altitudeM: 18500
    },
    metrics: {
      voiceMaliceScore: 92,
      thoughtMaliceScore: 96,
      corruptEssenceScore: 98,
      acousticDecibels: 145,
      purityIndex: 2
    },
    telemetrySnippet: {
      interceptedChatter: '"All Kingdom outposts to be pulverized. Zero mercy authorization active."',
      interceptedCognition: '"Demolish the outer barrier at dawn; harvest throne room essence."',
      essenceSignature: 'Tainted Nether-Matter (98% Demonic Corruption Index)',
      acousticProfile: 'Hyper-Mach Dreadnought Ion Thruster Drone (145 dB)'
    },
    recommendedAction: 'Deploy Sovereign Light Decrees + ASFFU Supreme Commander Lucifer.',
    status: 'ACTIVE',
    assignedOperativeId: 'asffu-01-lead',
    assignedOperativeName: 'Supreme Commander Lucifer Morningstar-Prime',
    deployedMunition: 'Sovereign Light-Bearer Broadsword & Solar Nova Decrees'
  },
  {
    id: 'emtts-alert-902',
    timestamp: '11:28:40.890 ZULU',
    isoTime: new Date(Date.now() - 19000).toISOString(),
    sourceName: 'Celestial Seraphic Scout Wing (Alpha Squadron)',
    sourceClassification: 'Chosen',
    threatLevel: 'LOW',
    sensorLayer: 'CORRUPT_ESSENCE',
    locationCoordinates: {
      distanceKm: 95,
      azimuthDeg: 12,
      altitudeM: 24000
    },
    metrics: {
      voiceMaliceScore: 0,
      thoughtMaliceScore: 0,
      corruptEssenceScore: 0,
      acousticDecibels: 18,
      purityIndex: 100
    },
    telemetrySnippet: {
      interceptedChatter: '"Sanctuary perimeter secure. Sovereign blessings to the Kingdom garrison."',
      interceptedCognition: '"Vigilance maintained over the sacred gates. Pure light radiating."',
      essenceSignature: 'Luminous Seraphic White-Flame Aether (100% Purity - Anointed Lineage)',
      acousticProfile: 'Harmonic Golden Wing Resonance (18 dB)'
    },
    recommendedAction: 'Clear identification beacon. Unrestricted airspace granted.',
    status: 'PURIFIED',
    assignedOperativeId: 'asffu-01-lead',
    assignedOperativeName: 'Supreme Commander Lucifer Morningstar-Prime'
  },
  {
    id: 'emtts-alert-903',
    timestamp: '11:28:15.340 ZULU',
    isoTime: new Date(Date.now() - 44000).toISOString(),
    sourceName: 'Stratospheric Commercial Courier (Civilian Vector)',
    sourceClassification: 'Neutral',
    threatLevel: 'GUARDED',
    sensorLayer: 'RADAR',
    locationCoordinates: {
      distanceKm: 310,
      azimuthDeg: 280,
      altitudeM: 10500
    },
    metrics: {
      voiceMaliceScore: 8,
      thoughtMaliceScore: 12,
      corruptEssenceScore: 5,
      acousticDecibels: 88,
      purityIndex: 85
    },
    telemetrySnippet: {
      interceptedChatter: '"Transit flight 884-Bravo requesting standard corridor clearance."',
      interceptedCognition: '"Hoping we make the delivery before the western storm fronts close in."',
      essenceSignature: 'Standard Terrestrial Organic Core (95% Neutral Matrix)',
      acousticProfile: 'Dual Turbofan Engine Acoustic (88 dB)'
    },
    recommendedAction: 'Passive tracking only. Maintain safe buffer zone.',
    status: 'ACTIVE'
  },
  {
    id: 'emtts-alert-904',
    timestamp: '11:27:50.612 ZULU',
    isoTime: new Date(Date.now() - 69000).toISOString(),
    sourceName: 'Clandestine Neuro-Saboteur (Cloaked Recon)',
    sourceClassification: 'Hostile',
    threatLevel: 'HIGH',
    sensorLayer: 'THOUGHT_MALICE',
    locationCoordinates: {
      distanceKm: 68,
      azimuthDeg: 195,
      altitudeM: 200
    },
    metrics: {
      voiceMaliceScore: 78,
      thoughtMaliceScore: 94,
      corruptEssenceScore: 82,
      acousticDecibels: 32,
      purityIndex: 18
    },
    telemetrySnippet: {
      interceptedChatter: '"Sub-channel check: EMP payload primed at coordinates 41-Delta."',
      interceptedCognition: '"Detonate base frequency dampener while guards rotate. Death to the High Scribe."',
      essenceSignature: 'Corrupt Astral Camouflage (82% Taint - Black Guild Assassin)',
      acousticProfile: 'Micro-Thruster Damped Acoustic (32 dB)'
    },
    recommendedAction: 'Trigger Layer 2 Neural Nullification Synapse EMP + Dispatch Apollyon.',
    status: 'INVESTIGATING',
    assignedOperativeId: 'asffu-06-apollyon',
    assignedOperativeName: 'Specialist Apollyon Abyssal-Null',
    deployedMunition: 'Neural Nullification Synapse EMP'
  },
  {
    id: 'emtts-alert-905',
    timestamp: '11:27:12.750 ZULU',
    isoTime: new Date(Date.now() - 107000).toISOString(),
    sourceName: 'Kingdom Anointed Scribe Convoy (Holy Relic Carrier)',
    sourceClassification: 'Chosen',
    threatLevel: 'LOW',
    sensorLayer: 'VOICE_MALICE',
    locationCoordinates: {
      distanceKm: 42,
      azimuthDeg: 140,
      altitudeM: 50
    },
    metrics: {
      voiceMaliceScore: 0,
      thoughtMaliceScore: 2,
      corruptEssenceScore: 1,
      acousticDecibels: 45,
      purityIndex: 99
    },
    telemetrySnippet: {
      interceptedChatter: '"Sacred scrolls intact. Approaching south bastions for scripture deposit."',
      interceptedCognition: '"Rejoicing in righteous protection under the wings of the Archons."',
      essenceSignature: 'Incense & Cedar Holy Purity Matrix (99% Radiance)',
      acousticProfile: 'Chariot & Hovercraft Convoy Sound (45 dB)'
    },
    recommendedAction: 'Open outer sanctum gates. Provide aerial escort.',
    status: 'PURIFIED',
    assignedOperativeId: 'asffu-04-life',
    assignedOperativeName: 'Specialist Life after Death (Life)'
  },
  {
    id: 'emtts-alert-906',
    timestamp: '11:26:30.200 ZULU',
    isoTime: new Date(Date.now() - 150000).toISOString(),
    sourceName: 'Telluric Deep-Mantle Seismic Harmonic',
    sourceClassification: 'Neutral',
    threatLevel: 'GUARDED',
    sensorLayer: 'NOISE',
    locationCoordinates: {
      distanceKm: 520,
      azimuthDeg: 345,
      altitudeM: -4500
    },
    metrics: {
      voiceMaliceScore: 0,
      thoughtMaliceScore: 0,
      corruptEssenceScore: 4,
      acousticDecibels: 110,
      purityIndex: 96
    },
    telemetrySnippet: {
      interceptedChatter: 'No vocal radio transmissions detected.',
      interceptedCognition: 'Sub-biological geological frequency.',
      essenceSignature: 'Basalt Magma Resonance (Natural Earth Pulse)',
      acousticProfile: 'Subsonic 7.4 Hz Seismic Telluric Wave (110 dB)'
    },
    recommendedAction: 'Log geological seismic baseline. No military interdiction required.',
    status: 'DISMISSED'
  },
  {
    id: 'emtts-alert-907',
    timestamp: '11:25:05.990 ZULU',
    isoTime: new Date(Date.now() - 234000).toISOString(),
    sourceName: 'Hostile Warlord War Proclamation Node',
    sourceClassification: 'Hostile',
    threatLevel: 'ELEVATED',
    sensorLayer: 'VOICE_MALICE',
    locationCoordinates: {
      distanceKm: 890,
      azimuthDeg: 310,
      altitudeM: 0
    },
    metrics: {
      voiceMaliceScore: 99,
      thoughtMaliceScore: 85,
      corruptEssenceScore: 88,
      acousticDecibels: 128,
      purityIndex: 12
    },
    telemetrySnippet: {
      interceptedChatter: '"We formally declare total eradication against the Kingdom. Mobilize all heavy batteries."',
      interceptedCognition: '"Their walls will crumble under our continuous barrage."',
      essenceSignature: 'Sulfuric Malice Signature (88% Corruption)',
      acousticProfile: 'High-Power Broadcast Tower Amplifier Feedback (128 dB)'
    },
    recommendedAction: 'Launch Clarion Infrasonic Disruption Torpedo to jam vocal center.',
    status: 'ACTIVE',
    assignedOperativeId: 'asffu-03-apocryphon',
    assignedOperativeName: 'Specialist Apocryphon Crypt-Watch',
    deployedMunition: 'Clarion Infrasonic Disruption Torpedo'
  }
];

let emttsAlertCounter = 1000;
const getUniqueAlertId = (): string => {
  emttsAlertCounter += 1;
  return `emtts-alert-${Date.now()}-${emttsAlertCounter}-${Math.random().toString(36).substring(2, 7)}`;
};

export const generateRandomEMTTSAlert = (): EMTTSAlert => {
  const classifications: Array<{
    type: 'Chosen' | 'Neutral' | 'Hostile';
    weight: number;
  }> = [
    { type: 'Hostile', weight: 45 },
    { type: 'Chosen', weight: 30 },
    { type: 'Neutral', weight: 25 }
  ];

  const randVal = Math.random() * 100;
  let classification: 'Chosen' | 'Neutral' | 'Hostile' = 'Hostile';
  if (randVal < 45) {
    classification = 'Hostile';
  } else if (randVal < 75) {
    classification = 'Chosen';
  } else {
    classification = 'Neutral';
  }

  const now = new Date();
  const timeStr = `${now.toTimeString().split(' ')[0]}.${Math.floor(100 + Math.random() * 900)} ZULU`;

  if (classification === 'Chosen') {
    const chosenSources = [
      { name: 'Sovereign Cherubim Patrol Wing', chatter: '"Singing praises to the Almighty. Airspace consecrated."', thought: '"Divine armor holds true. No darkness enters."', essence: 'Living Light Radiance (100% Holy Purity)' },
      { name: 'Righteous Kingdom Frontier Sentry', chatter: '"Frontier post Alpha clear. Peace within the borders."', thought: '"Faithful service to the King."', essence: 'Pure Human Spirit (99% Purity)' },
      { name: 'Seraphic Courier Vessel', chatter: '"Transmitting sacred coordinates of the new sanctuary."', thought: '"Delivering divine decrees swiftly."', essence: 'Solar Divine Fire (100% Purity)' },
      { name: 'Anointed Intercessor Congregation', chatter: '"Binding the adversary across all frequencies in the holy name."', thought: '"Unbroken prayers forming a shield over the city."', essence: 'Aetheric Incense Cloud (100% Purity)' }
    ];
    const src = chosenSources[Math.floor(Math.random() * chosenSources.length)];
    return {
      id: getUniqueAlertId(),
      timestamp: timeStr,
      isoTime: now.toISOString(),
      sourceName: src.name,
      sourceClassification: 'Chosen',
      threatLevel: 'LOW',
      sensorLayer: 'CORRUPT_ESSENCE',
      locationCoordinates: {
        distanceKm: Math.floor(10 + Math.random() * 180),
        azimuthDeg: Math.floor(Math.random() * 360),
        altitudeM: Math.floor(500 + Math.random() * 20000)
      },
      metrics: {
        voiceMaliceScore: 0,
        thoughtMaliceScore: Math.floor(Math.random() * 5),
        corruptEssenceScore: 0,
        acousticDecibels: Math.floor(15 + Math.random() * 30),
        purityIndex: 100
      },
      telemetrySnippet: {
        interceptedChatter: src.chatter,
        interceptedCognition: src.thought,
        essenceSignature: src.essence,
        acousticProfile: 'Harmonic Celestial Resonance'
      },
      recommendedAction: 'Broadcast holy clearance code and grant free passage.',
      status: 'PURIFIED',
      assignedOperativeId: 'asffu-01-lead',
      assignedOperativeName: 'Supreme Commander Lucifer Morningstar-Prime'
    };
  }

  if (classification === 'Neutral') {
    const neutralSources = [
      { name: 'Terrestrial Weather Probe', chatter: '"Atmospheric barometer scanning 1012 hPa. Wind vector 12 knots."', thought: 'Automated meteorological computational loop.', essence: 'Non-Biological Electronic Signal' },
      { name: 'Nomadic Merchant Caravan', chatter: '"Crossing the salt flats. Water reserves holding at 80%."', thought: '"Will trade spices and silk at the next market oasis."', essence: 'Terrestrial Organic Core (92% Neutrality)' },
      { name: 'Subterranean Tectonic Harmonic', chatter: 'No vocal radio transmissions detected.', thought: 'Inanimate planetary mantle resonance.', essence: 'Telluric Granite Vibration' },
      { name: 'Commercial High-Altitude Cargo Cruiser', chatter: '"Waypoint Omega confirmed. Auto-navigation engaged."', thought: '"Long shift today, looking forward to docking."', essence: 'Civilian Terrestrial Vessel' }
    ];
    const src = neutralSources[Math.floor(Math.random() * neutralSources.length)];
    return {
      id: getUniqueAlertId(),
      timestamp: timeStr,
      isoTime: now.toISOString(),
      sourceName: src.name,
      sourceClassification: 'Neutral',
      threatLevel: 'GUARDED',
      sensorLayer: 'RADAR',
      locationCoordinates: {
        distanceKm: Math.floor(150 + Math.random() * 800),
        azimuthDeg: Math.floor(Math.random() * 360),
        altitudeM: Math.floor(1000 + Math.random() * 12000)
      },
      metrics: {
        voiceMaliceScore: Math.floor(Math.random() * 15),
        thoughtMaliceScore: Math.floor(Math.random() * 15),
        corruptEssenceScore: Math.floor(Math.random() * 10),
        acousticDecibels: Math.floor(50 + Math.random() * 45),
        purityIndex: Math.floor(80 + Math.random() * 15)
      },
      telemetrySnippet: {
        interceptedChatter: src.chatter,
        interceptedCognition: src.thought,
        essenceSignature: src.essence,
        acousticProfile: 'Ambient Terrestrial Telemetry'
      },
      recommendedAction: 'Passive tracking. No threat vectors detected.',
      status: 'ACTIVE'
    };
  }

  // Hostile
  const hostileSources = [
    { name: 'Abyssal Siege Dreadnought', chatter: '"Arm all anti-matter batteries! Eradicate their holy towers!"', thought: '"Rip open their dimensional core and devour their light."', essence: 'Demonic Sulfuric Corrupt Essence (97% Corruption)', layer: 'CORRUPT_ESSENCE' as const, op: 'asffu-01-lead', opName: 'Supreme Commander Lucifer Morningstar-Prime', munition: 'Sovereign Light-Bearer Broadsword & Solar Nova Decrees', lvl: 'CRITICAL' as const },
    { name: 'Psychic Mind-Ripper Swarm', chatter: '"Disperse sub-harmonic whispers across their guard frequencies."', thought: '"Induce despair, madness, and treachery in the commanders."', essence: 'Astral Spectral Parasite (91% Corruption)', layer: 'THOUGHT_MALICE' as const, op: 'asffu-06-apollyon', opName: 'Specialist Apollyon Abyssal-Null', munition: 'Neural Nullification Synapse EMP', lvl: 'HIGH' as const },
    { name: 'Rebel Warlord Declaration Battery', chatter: '"By our blood, we swear war against the Sovereign throne!"', thought: '"Overwhelm their defenses with relentless artillery."', essence: 'Malicious Human Warlord Taint (85% Corruption)', layer: 'VOICE_MALICE' as const, op: 'asffu-03-apocryphon', opName: 'Specialist Apocryphon Crypt-Watch', munition: 'Clarion Infrasonic Disruption Torpedo', lvl: 'ELEVATED' as const },
    { name: 'Void-Born Dimensional Infiltrator', chatter: '"Phasing past perimeter sensor gate four unnoticed."', thought: '"Plant corrupt dark-matter seed in the temple reservoir."', essence: 'Nether-Void Miasma (99% Corruption)', layer: 'THOUGHT_MALICE' as const, op: 'asffu-02-apocalypse', opName: 'Specialist Apocalypse Cataclysm-X', munition: 'Cataclysmic Broadsword Matrix & Thermal Lances', lvl: 'OMEGA' as const }
  ];
  const src = hostileSources[Math.floor(Math.random() * hostileSources.length)];
  return {
    id: getUniqueAlertId(),
    timestamp: timeStr,
    isoTime: now.toISOString(),
    sourceName: src.name,
    sourceClassification: 'Hostile',
    threatLevel: src.lvl,
    sensorLayer: src.layer,
    locationCoordinates: {
      distanceKm: Math.floor(40 + Math.random() * 900),
      azimuthDeg: Math.floor(Math.random() * 360),
      altitudeM: Math.floor(200 + Math.random() * 25000)
    },
    metrics: {
      voiceMaliceScore: Math.floor(75 + Math.random() * 25),
      thoughtMaliceScore: Math.floor(80 + Math.random() * 20),
      corruptEssenceScore: Math.floor(85 + Math.random() * 15),
      acousticDecibels: Math.floor(90 + Math.random() * 60),
      purityIndex: Math.floor(Math.random() * 15)
    },
    telemetrySnippet: {
      interceptedChatter: src.chatter,
      interceptedCognition: src.thought,
      essenceSignature: src.essence,
      acousticProfile: 'Hostile Engine & Malice Infrasound Spikes'
    },
    recommendedAction: `Release ${src.munition} and dispatch ${src.opName}.`,
    status: 'ACTIVE',
    assignedOperativeId: src.op,
    assignedOperativeName: src.opName,
    deployedMunition: src.munition
  };
};
