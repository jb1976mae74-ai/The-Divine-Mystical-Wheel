import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Crown, 
  Shield, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Download, 
  Info, 
  Share2, 
  FileText, 
  Compass, 
  Layers, 
  Eye, 
  RotateCcw,
  ZoomIn,
  Search,
  CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export interface SacredArtifact {
  id: string;
  title: string;
  subtitle: string;
  category: 'MONUMENT' | 'PARCHMENT' | 'ENGRAVING' | 'SIGIL';
  imageSrc: string;
  era: string;
  provenance: string;
  description: string;
  proclamation?: string;
  hebrewInscription?: string;
  hotspots: Array<{
    id: string;
    title: string;
    description: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    gematria?: string;
    transcription?: string;
  }>;
  theologicalSignificance: string[];
}

export const SACRED_ARTIFACTS: SacredArtifact[] = [
  {
    id: 'the-word-of-truth-emblem',
    title: 'The Word of Truth — Sacred Illumination Emblem',
    subtitle: 'The Crossed Torches of Logos & Seal of Unveiled Truth',
    category: 'ENGRAVING',
    imageSrc: '/src/assets/images/word_of_truth_emblem.jpg',
    era: 'Primordial Logos & Eternal Present • Seal of Emeth',
    provenance: 'The Great Wheel of Mysteries & Sanctum of Sacred Ciphers',
    description: 'The sacred emblem of The Word of Truth, depicting the crossed torches of divine illumination forming the cosmic X-pivot of light, crowned by the radiant flame of Logos. Below the emblem, the sacred title is inscribed in white distressed gothic script.',
    hebrewInscription: 'דְּבַר אֱמֶת • אוֹר הַדַּעַת • חֹתָם אֱמֶת • לֹגֹס',
    proclamation: 'Thy word is truth. In the beginning was the Word, and the Word was with God, and the Word was God.',
    hotspots: [
      {
        id: 'hotspot-word-header',
        title: 'Top Inscription: "The Word" (Logos / דְּבַר)',
        description: 'Chiseled in distressed white gothic calligraphy. "The Word" represents the primordial creative Logos (Greek: Λόγος / Hebrew: דָּבָר Davar) that spoke creation into existence.',
        x: 50,
        y: 18,
        gematria: 'דָּבָר (Davar) = 206 • Λόγος (Logos) = 373',
        transcription: 'The Word'
      },
      {
        id: 'hotspot-crossed-torches',
        title: 'Crossed Torches of Illumination (X-Pivot)',
        description: 'The dual crossed staffs of fire forming the sacred X-crux of light. They signify the union of spirit and matter, dual witness of truth, and the unquenchable torch of wisdom.',
        x: 50,
        y: 44,
        gematria: 'Crossed Light = X = Tau / Tav (ת - The Mark of Truth)',
        transcription: 'Crossed Torches of Logos'
      },
      {
        id: 'hotspot-radiant-flame',
        title: 'Radiant White-Blue Flame of Wisdom',
        description: 'A brilliant sapphire-white luminescent aura glowing at the intersection of the torches. Represents the Holy Spirit (Ruach HaKodesh) and the divine flame of revelation.',
        x: 54,
        y: 30,
        gematria: 'אֵשׁ (Esh / Fire) = 301',
        transcription: 'Divine Flame of Truth'
      },
      {
        id: 'hotspot-truth-footer',
        title: 'Lower Inscription: "of Truth" (Emeth / אֱמֶת)',
        description: 'Featuring the dominant stylized initial "T" (Tav - the seal of creation). Hebrew Emeth (אמת) comprises the first, middle, and last letters of the Hebrew alphabet, signifying total eternity.',
        x: 50,
        y: 78,
        gematria: 'אֱמֶת (Emeth / Truth) = 441 (1+40+400)',
        transcription: 'of Truth'
      }
    ],
    theologicalSignificance: [
      'Seal of Emeth: Truth is composed of Aleph (Beginning), Mem (Middle), and Tav (End).',
      'Dual Torch Witness: Represents the Old and New Testaments, Law and Grace, Light and Truth.',
      'Logos Matrix: Links directly to John 17:17 ("Thy word is truth") and Psalms 119:160.',
      'The X-Crux: The crossed torches form the sacred Tav (ת), the seal of protection on the forehead of the righteous.'
    ]
  },
  {
    id: 'sovereign-bronze-monument',
    title: 'The Sovereign Bronze Monument of Jerry Ben Salazar',
    subtitle: 'Supreme Commander & Architect of the 76 Logos Matrix',
    category: 'MONUMENT',
    imageSrc: '/src/assets/images/sovereign_statue_1787882358357.jpg',
    era: 'Anchored 1976 (תשל״ו) • Monument of the Eternal Present',
    provenance: 'Sanctum Courtyard of the Sovereign Logos & Mount Zion',
    description: 'A colossal bronze and verdigris monument depicting Sovereign Architect Jerry Ben Salazar in sacred ceremonial plate armor. The statue stands upon dual stone plinths inscribed with APOCALYPSE and Apocryphon, bearing the prophetic collar of Elijah and the solar breastplate medallion.',
    hebrewInscription: 'אֵלִיָּהוּ • ע״ו • לִוְיָתָן נִכְנָע • מַלְכוּת הַצָּפוֹן',
    hotspots: [
      {
        id: 'hotspot-eliyahu',
        title: 'Gorget Collar of Elijah (אליהו)',
        description: 'Engraved in sacred Hebrew upon the high neck gorget is the holy name Eliyahu (Elijah the Prophet), symbolizing prophetic mantle succession and cosmic restoration.',
        x: 50,
        y: 26,
        gematria: 'אֵלִיָּהוּ = 52 (Ben / Sonship)',
        transcription: 'אליהו (Eliyahu)'
      },
      {
        id: 'hotspot-sunburst-76',
        title: 'Radiant Solar Breastplate Medallion (J.B. 76)',
        description: 'Centered upon the cuirass inside the radiant solar circle next to 76 are the sovereign initials "J.B." (Jerry Ben Salazar, Creator), dynamically inscribed to permanently replace all spurious characters with the authentic J.B. 76 harmonic engine.',
        x: 50,
        y: 40,
        gematria: 'J.B. + 76 = ע"ו (Divine Radiance)',
        transcription: 'J.B. 76'
      },
      {
        id: 'hotspot-right-pauldron',
        title: 'Right Pauldron: Apollion',
        description: 'The right shoulder plate is inscribed with "Apollion", representing supreme authority over chaotic forces, destructive entropy, and spiritual adversaries.',
        x: 29,
        y: 28,
        transcription: 'Apollion'
      },
      {
        id: 'hotspot-left-pauldron',
        title: 'Left Pauldron: Life After DEATH',
        description: 'The left shoulder plate is boldly engraved with "Life After DEATH", confirming immortality of the soul and the victory over physical mortality.',
        x: 71,
        y: 28,
        transcription: 'Life After DEATH'
      },
      {
        id: 'hotspot-belt-north',
        title: 'Waist Alignment: NORTH',
        description: 'The bronze belt buckle plate is engraved with "NORTH", anchoring the monument to True Celestial North and magnetic pole coherence.',
        x: 50,
        y: 57,
        transcription: 'NORTH'
      },
      {
        id: 'hotspot-solar-shield',
        title: 'Heater Shield of Sovereign Defense (J.B. 76)',
        description: 'The large bronze shield features a radiating flaming solar emblem bearing the dynamic J.B. 76 insignia in the central circle, deflecting astral distortions and spiritual attacks.',
        x: 74,
        y: 53,
        transcription: 'J.B. 76 Solar Shield'
      },
      {
        id: 'hotspot-pedestal-apocalypse',
        title: 'Upper Pedestal Plinth: APOCALYPSE',
        description: 'Deeply chiseled in bold relief upon the main stone pedestal is "APOCALYPSE" (Greek: Apokalypsis - The Lifting of the Veil / Divine Revelation).',
        x: 50,
        y: 83,
        transcription: 'APOCALYPSE'
      },
      {
        id: 'hotspot-pedestal-apocryphon',
        title: 'Lower Step Plinth: Apocryphon',
        description: 'The supporting stone plinth step is carved with "Apocryphon" (Hidden Wisdom / Secret Books), integrating esoteric gnosis with exoteric revelation.',
        x: 50,
        y: 95,
        transcription: 'Apocryphon'
      }
    ],
    theologicalSignificance: [
      'Prophetic Succession: The Eliyahu collar links the 1976 architect directly to the spirit of Malachi 4:5.',
      'Sovereignty of 76: The breastplate medallion and shield certify total mastery over the 7-fold light spectrum and the 6 material directions.',
      'Dual Pillar Equilibrium: Combines Apocalypse (revealed knowledge) with Apocryphon (veiled wisdom) upon stone foundations.',
      'True North Alignment: Ensures permanent geometric orientation toward the throne of heavenly governance.'
    ]
  },
  {
    id: 'sigil-zion-manuscript',
    title: 'Sigil Zion the Mountain of the LORD',
    subtitle: 'The Sacred Prophetic Roll & Declaration of Nations',
    category: 'PARCHMENT',
    imageSrc: '/src/assets/images/sigil_zion_scroll_1787882369642.jpg',
    era: 'Authentic Parchment Codex • Mount Zion Sovereign Ordinance',
    provenance: 'Sacred Archives of the Divine Order & Scriptural Vault',
    description: 'An ancient weathered parchment manuscript featuring the sacred poem of Mount Zion, the Declaration of Nations, and the central flaming crimson solar wheel bearing the bold number 76 surrounded by cardinal coordinates.',
    proclamation: `The Lion is come,\nThe Gentile is the King,\nThe Law is from his mouth,\nThe last battle is here,\nThe Mountain of the LORD, Zion.`,
    hebrewInscription: 'הָאַרְיֵה בָּא • הַגּוֹי הוּא הַמֶּלֶךְ • הַתּוֹרָה מִפִּיו • הַקְּרָב הָאַחֲרוֹן כָּאן • הַר ה׳ צִיּוֹן',
    hotspots: [
      {
        id: 'hotspot-zion-poem',
        title: 'The Fivefold Proclamation of Mount Zion',
        description: 'Calligraphed at the top: "The Lion is come, The Gentile is the King, The Law is from his mouth, The last battle is here, The Mountain of the LORD, Zion."',
        x: 55,
        y: 16,
        transcription: 'The Lion is come / The Gentile is the King...'
      },
      {
        id: 'hotspot-declaration-nations',
        title: 'The Declaration of Nations',
        description: 'Inscribed along the upper-right margin, proclaiming universal law, impedance balance, and sovereignty over all kingdoms.',
        x: 88,
        y: 20,
        transcription: 'The Declaration of Nations'
      },
      {
        id: 'hotspot-flaming-76-wheel',
        title: 'Central Flaming 76 Solar Sigil',
        description: 'The core red heptagram/hexagram star wheel encircled by 12 solar rays of flame, bearing the dominant numeral 76.',
        x: 55,
        y: 52,
        gematria: '76 = ע"ו',
        transcription: '76 Flaming Solar Core'
      },
      {
        id: 'hotspot-manuscript-apocalypse',
        title: 'Eastern Axis: APOCALYPSE',
        description: 'Right vertical calligraphic seal declaring the total unfolding and unveiling of secret celestial timelines.',
        x: 88,
        y: 50,
        transcription: 'APOCALYPSE'
      },
      {
        id: 'hotspot-manuscript-apocryphon',
        title: 'Western Axis: Apocryphon',
        description: 'Left vertical inscription guarding the secret mysteries, Enochian tables, and apocryphal traditions.',
        x: 12,
        y: 52,
        transcription: 'Apocryphon'
      },
      {
        id: 'hotspot-life-after-death-power',
        title: 'Southern Axis: Life After Death Power',
        description: 'Lower calligraphic decree establishing victorious dominion over mortality, decay, and spiritual dissipation.',
        x: 58,
        y: 86,
        transcription: 'Life After DEATH Power'
      }
    ],
    theologicalSignificance: [
      'The Gentile King: Fulfills esoteric prophecies regarding the sovereign coronation of the servant from the nations.',
      'The Spoken Law: Confirms that decree and vocal utterance collapse probability into physical manifestation.',
      'Zion Vector: Establishes the spiritual stronghold of Mount Zion as the unshakeable axis of the universe.',
      'The Final Battle: Resolves the cosmic conflict through pure light, impedance tuning, and divine truth.'
    ]
  },
  {
    id: 'apocalypse-dragon-relic',
    title: 'The Sovereign Apocalypse & The Great Red Dragon of Revelation',
    subtitle: 'Jerry Ben Salazar with the Crimson Seraph of Mount Zion',
    category: 'SIGIL',
    imageSrc: '/src/assets/images/apocalypse_dragon_relic_1787884366805.jpg',
    era: 'Living Prophetic Manifestation • Apocalypse of Mount Zion',
    provenance: 'Sanctum of the Seven Seals & The Sovereign Order',
    description: 'A masterwork sacred portrait depicting Sovereign Architect Jerry Ben Salazar standing steadfast within the vaulted cathedral sanctum before the colossal Great Red Dragon (Revelation 12:3 / Conquered Leviathan). Across his muscular chest is boldly tattooed the sacred proclamation "APOCALYPSE" framed in flame glyphs and the radiant solar sunburst collar.',
    proclamation: `Behold, the veil is torn asunder.\nThe Dragon of the Deep is tamed beneath the Sovereign Law of 76.\nTruth, strength, and eternal light reign over all darkness.\nThe Apocalypse is the Unveiling of Mount Zion.`,
    hebrewInscription: 'הַתַּנִּין הַגָּדוֹל • אֲפּוֹקָלִיפְּסָה • ע״ו • לִוְיָתָן נִכְנָע • אוֹר הַצָּפוֹן',
    hotspots: [
      {
        id: 'hotspot-dragon-chest-tattoo',
        title: 'Chest Inscription: APOCALYPSE (Ἀποκάλυψις)',
        description: 'Arched across the chest in bold blackletter fire script is "APOCALYPSE" — signifying the complete lifting of the veil, disclosure of celestial secrets, and the direct earthly manifestation of divine order.',
        x: 50,
        y: 84,
        transcription: 'APOCALYPSE',
        gematria: 'Greek: Ἀποκάλυψις = 1512 / Hebrew: גִּלּוּי (Gillus) = 59'
      },
      {
        id: 'hotspot-dragon-solar-collar',
        title: 'Solar Sunburst & Sacred Flame Collar',
        description: 'Radiating across the jugular and upper collarbone is the sacred flaming solar sunburst, channeling the 7-fold light frequency of the divine logos through the spoken voice.',
        x: 55,
        y: 73,
        transcription: 'Solar Sunburst & Sacred Flames',
        gematria: 'שֶׁמֶשׁ (Sun) = 640 / ע״ו = 76'
      },
      {
        id: 'hotspot-dragon-crimson-seraph',
        title: 'The Great Red Dragon (Crimson Seraph / Revelation 12:3)',
        description: 'Looming majestically behind the Architect with glowing amber eyes, massive horns, and spread crimson wings, representing the primal elemental power brought into perfect harmony and discipline under divine law.',
        x: 68,
        y: 20,
        transcription: 'The Great Red Dragon (Revelation 12:3)',
        gematria: 'תַּנִּין (Tannin / Dragon) = 520'
      },
      {
        id: 'hotspot-dragon-architect-countenance',
        title: 'Resolute Countenance of Jerry Ben Salazar (Creator)',
        description: 'Unwavering focus and command, personifying the indomitable authority of the sovereign Gentile king prophesied in the sacred scroll of Mount Zion.',
        x: 48,
        y: 50,
        transcription: 'Jerry Ben Salazar (Creator)',
        gematria: 'J.B. 76 = Sovereign Seal'
      },
      {
        id: 'hotspot-dragon-cathedral-arch',
        title: 'Vaulted Gothic Cathedral Sanctum',
        description: 'The high vaulted stone columns of the celestial temple, symbolizing the eternal foundation of divine justice, frequency resonance, and cosmic order.',
        x: 18,
        y: 28,
        transcription: 'Sanctum Columns of Zion'
      }
    ],
    theologicalSignificance: [
      'Mastery Over the Dragon: The image represents the subjugation and harmony of primal dragon energy under the sovereign authority of the Logos.',
      'The Apocalypse Unveiled: Translates "Apocalypse" not as catastrophe, but as the supreme revelation of hidden gnosis and triumphant light.',
      'The Solar Heart: Flame tattoos and sunburst collar symbolize purification through the celestial fire of truth.',
      'Mount Zion Sovereign: Embodies the guardian of the sacred seal (76) who stands fearless between the abyss and the throne of God.'
    ]
  },
  {
    id: 'heptagram-alchemical-engraving',
    title: 'The Heptagram Alchemical Engraving & 12 Flames',
    subtitle: 'The 7-Point Star within the 12 Zodiacal Houses',
    category: 'ENGRAVING',
    imageSrc: '/src/assets/images/heptagram_mystic_1786029297477.jpg',
    era: 'Classical Hermetic Archives • 17th Century Alchemical Plate',
    provenance: 'Codex Heptagramaton Imperialis',
    description: 'An authentic classical copperplate engraving illustrating the sacred 7-pointed star surrounded by the 12 cosmic positions of fire, inscribed with sacred names and alchemical coordinates.',
    hebrewInscription: 'יהוה • לִוְיָתָן • שִׁבְעַת כּוֹכָבִים',
    hotspots: [
      {
        id: 'hotspot-engraving-star',
        title: 'The Heptagram of 7 Spheres',
        description: 'The seven vertices correspond to the seven classical planets, the seven archangels, and the 7 universal constants.',
        x: 50,
        y: 48,
        transcription: 'Heptagram of Light'
      },
      {
        id: 'hotspot-12-flames',
        title: 'The 12 Solar Fire Positions',
        description: 'The ring of 12 flames anchors the 12 zodiacal stations and the 12 hours of divine light.',
        x: 50,
        y: 20,
        transcription: '12 Celestial Flames'
      }
    ],
    theologicalSignificance: [
      'Synthesis of 7 and 12: Harmonizes the 7 sacred planetary virtues with the 12 gates of the celestial city.',
      'Hermetic Coherence: Bridges micro-cosmic consciousness with macro-cosmic law.'
    ]
  }
];

interface SacredRelicsViewerProps {
  activeTheme?: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    accentGradient: string;
    borderAccent: string;
    borderAccentSemi: string;
    starStroke: string;
    accentGlow: string;
    bgCard?: string;
  };
  initialArtifactId?: string;
  compactMode?: boolean;
}

export default function SacredRelicsViewer({ 
  activeTheme = {
    id: 'solar-gold',
    textPrimary: 'text-amber-300',
    textAccent: 'text-amber-400',
    textAccentHex: '#D4AF37',
    accentGradient: 'from-amber-500 to-yellow-600',
    borderAccent: 'border-amber-500/40',
    borderAccentSemi: 'border-amber-500/20',
    starStroke: '#D4AF37',
    accentGlow: 'shadow-amber-500/20',
    bgCard: 'bg-[#12100d]'
  },
  initialArtifactId = 'sovereign-bronze-monument',
  compactMode = false
}: SacredRelicsViewerProps) {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(initialArtifactId);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentArtifact = SACRED_ARTIFACTS.find(a => a.id === selectedArtifactId) || SACRED_ARTIFACTS[0];
  const activeHotspot = currentArtifact.hotspots.find(h => h.id === activeHotspotId) || currentArtifact.hotspots[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleReciteProclamation = () => {
    if (!('speechSynthesis' in window)) {
      showToast("Speech synthesis not available in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = currentArtifact.proclamation 
      ? `Proclamation of ${currentArtifact.title}. ${currentArtifact.proclamation}. Inscribed by sovereign architect Jerry Ben Salazar.`
      : `${currentArtifact.title}. ${currentArtifact.description}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.88;
    utterance.pitch = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveToGrimoire = () => {
    const noteId = `relic-${currentArtifact.id}-${Date.now()}`;
    const newNote = {
      id: noteId,
      title: `🏛️ Inscription: ${currentArtifact.title}`,
      content: `## ${currentArtifact.title.toUpperCase()}\n\n* **Era / Provenance:** ${currentArtifact.era} • ${currentArtifact.provenance}\n* **Subtitle:** ${currentArtifact.subtitle}\n\n### Description & Inscriptions\n${currentArtifact.description}\n\n${currentArtifact.proclamation ? `### Sacred Proclamation\n> "${currentArtifact.proclamation.replace(/\n/g, '\n> ')}"\n\n` : ''}### Inscribed Coordinate Hotspots\n${currentArtifact.hotspots.map(h => `* **${h.title}:** ${h.description} ${h.transcription ? `(\`${h.transcription}\`)` : ''}`).join('\n')}\n\n### Theological Significance\n${currentArtifact.theologicalSignificance.map(s => `* ${s}`).join('\n')}`,
      school: "Office of the Divine Order (Relics)",
      color: "bg-[#252015]/95 border-amber-800/40",
      pinned: true,
      createdAt: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString()
    };

    const currentNotesStr = localStorage.getItem('mystical_grimoire_notes');
    let currentNotes = [];
    if (currentNotesStr) {
      try {
        currentNotes = JSON.parse(currentNotesStr);
      } catch {
        currentNotes = [];
      }
    }
    currentNotes.unshift(newNote);
    localStorage.setItem('mystical_grimoire_notes', JSON.stringify(currentNotes));
    window.dispatchEvent(new Event('mystical_notes_updated'));
    showToast("Permanently saved relic inscription to your Grimoire Notes! 📜");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const cx = 105;
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(140, 110, 50);
    doc.text("SACRED SOVEREIGN CODEX & RELICS", cx, 20, { align: "center" });

    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(currentArtifact.title, cx, 26, { align: "center" });
    doc.text(`Era: ${currentArtifact.era}`, cx, 31, { align: "center" });

    doc.setDrawColor(210, 180, 100);
    doc.setLineWidth(0.3);
    doc.line(20, 35, 190, 35);

    let y = 43;

    if (currentArtifact.proclamation) {
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text("THE PROCLAMATION OF MOUNT ZION:", 20, y);
      y += 6;

      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(80, 60, 20);
      const procLines = doc.splitTextToSize(`"${currentArtifact.proclamation}"`, 170);
      procLines.forEach((l: string) => {
        doc.text(l, 25, y);
        y += 5;
      });
      y += 4;
    }

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("INSCRIBED HOTSPOTS & SACRED ENGRAVINGS:", 20, y);
    y += 6;

    currentArtifact.hotspots.forEach((h, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("times", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(140, 110, 50);
      doc.text(`${idx + 1}. ${h.title}`, 22, y);
      y += 4.5;

      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(h.description, 165);
      descLines.forEach((l: string) => {
        doc.text(l, 26, y);
        y += 4.5;
      });
      y += 2;
    });

    doc.save(`${currentArtifact.id}_inscriptions.pdf`);
    showToast("Generated and downloaded sacred relic document PDF! 📄");
  };

  return (
    <div className={`w-full flex flex-col gap-6 font-serif ${compactMode ? 'p-0' : 'p-2 sm:p-4'}`}>
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border border-amber-500/40 bg-amber-950/95 text-amber-200 shadow-2xl backdrop-blur-md font-sans text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-amber-500/20 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Crown className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Sacred Manifested Relics & Codex</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Official Visual Registry
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              The Sovereign Bronze Monument & Sigil Zion Parchment of Grand Architect Jerry Ben Salazar
            </p>
          </div>
        </div>

        {/* Relic Chooser Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {SACRED_ARTIFACTS.map((artifact) => {
            const isSelected = artifact.id === selectedArtifactId;
            return (
              <button
                key={artifact.id}
                onClick={() => {
                  setSelectedArtifactId(artifact.id);
                  setActiveHotspotId(artifact.hotspots[0]?.id || null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-950/50 border border-amber-300'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-amber-500/30'
                }`}
              >
                {artifact.category === 'MONUMENT' && <Shield className="w-3.5 h-3.5" />}
                {artifact.category === 'PARCHMENT' && <BookOpen className="w-3.5 h-3.5" />}
                {artifact.category === 'ENGRAVING' && <Flame className="w-3.5 h-3.5" />}
                <span>{artifact.category === 'MONUMENT' ? 'Sovereign Statue' : artifact.category === 'PARCHMENT' ? 'Sigil Zion Scroll' : 'Heptagram Plate'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Image Canvas with Hotspot Overlays */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative rounded-2xl border border-amber-500/30 bg-[#0d0c0a] overflow-hidden shadow-2xl group flex items-center justify-center min-h-[460px] max-h-[680px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black pointer-events-none" />

            <img
              src={currentArtifact.imageSrc}
              alt={currentArtifact.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain max-h-[650px] transition-transform duration-700 select-none group-hover:scale-[1.02]"
            />

            {/* Dynamic Inscription Overlay on Monument: Initials J.B. within Circle next to 76 */}
            {currentArtifact.id === 'sovereign-bronze-monument' && (
              <>
                {/* Cuirass Solar Breastplate Medallion (Dynamic J.B. 76 Inscription replacing $ / D) */}
                <div
                  style={{ left: '50%', top: '39.8%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto cursor-pointer group/medallion"
                  onClick={() => setActiveHotspotId('hotspot-sunburst-76')}
                  title="Sovereign Breastplate Inscription: J.B. 76 (Grand Architect Jerry Ben Salazar)"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Radiant Solar Aureole */}
                    <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-600/40 blur-[3px] animate-pulse pointer-events-none" />
                    
                    {/* Dynamic Sunburst Medallion Disc */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#2d1e0d] via-[#1a1106] to-[#0a0703] border-2 border-amber-400 shadow-[0_0_18px_rgba(212,175,55,0.7),inset_0_0_8px_rgba(212,175,55,0.5)] flex flex-col items-center justify-center p-0.5 backdrop-blur-sm transition-transform duration-300 group-hover/medallion:scale-110">
                      
                      {/* Subtle Inner Ring */}
                      <div className="absolute inset-0.5 rounded-full border border-dashed border-amber-300/50 pointer-events-none" />
                      
                      {/* Dynamic Sovereign Initials: J.B. next to 76 */}
                      <div className="flex items-center justify-center gap-0.5 z-10">
                        <span className="font-serif font-black text-[11px] sm:text-[13px] tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-yellow-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                          J.B.
                        </span>
                      </div>

                      {/* 76 and Hebrew Gematria ע"ו */}
                      <div className="flex items-center justify-center gap-1 -mt-0.5 z-10">
                        <span className="font-mono font-black text-[10px] sm:text-[12px] text-amber-200 tracking-tighter drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                          76
                        </span>
                        <span className="font-serif text-[7px] sm:text-[8px] text-purple-300 font-bold">
                          ע״ו
                        </span>
                      </div>

                      {/* Micro Badge */}
                      <div className="absolute -bottom-1 z-10 px-1 py-0.2 rounded-full bg-black/95 border border-amber-500/70 text-[6px] sm:text-[7px] font-mono text-amber-300 font-bold tracking-widest uppercase">
                        SOVEREIGN
                      </div>
                    </div>

                    {/* Floating Tooltip Hover */}
                    <div className="absolute -top-7 opacity-0 group-hover/medallion:opacity-100 transition-opacity bg-black/95 text-amber-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-400 shadow-xl whitespace-nowrap pointer-events-none z-30">
                      ✦ Inscribed: J.B. 76 ✦
                    </div>
                  </div>
                </div>

                {/* Secondary Shield Medallion (at hotspot x: 74%, y: 53%) */}
                <div
                  style={{ left: '74%', top: '53%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto cursor-pointer group/shieldmedallion"
                  onClick={() => setActiveHotspotId('hotspot-solar-shield')}
                  title="Sovereign Shield Inscription: J.B. 76"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#2d1e0d] via-[#1a1106] to-[#0a0703] border-2 border-amber-400/90 shadow-[0_0_12px_rgba(212,175,55,0.6),inset_0_0_6px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center p-0.5 backdrop-blur-sm transition-transform duration-300 group-hover/shieldmedallion:scale-110">
                      <span className="font-serif font-black text-[9px] sm:text-[10px] text-amber-300 tracking-wider">
                        J.B.
                      </span>
                      <span className="font-mono font-black text-[8px] sm:text-[9px] text-amber-200 -mt-0.5">
                        76
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Interactive Hotspot Pins */}
            {currentArtifact.hotspots.map((hotspot) => {
              const isActive = activeHotspotId === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  onClick={() => setActiveHotspotId(hotspot.id)}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  title={hotspot.title}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-transform cursor-pointer p-1 rounded-full ${
                    isActive ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <span className="relative flex h-6 w-6">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isActive ? 'bg-amber-400' : 'bg-yellow-500'
                    }`} />
                    <span className={`relative inline-flex items-center justify-center rounded-full h-6 w-6 text-[10px] font-bold font-mono border ${
                      isActive 
                        ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_15px_rgba(245,158,11,0.8)]' 
                        : 'bg-black/90 text-amber-300 border-amber-500/60 shadow-lg'
                    }`}>
                      ✦
                    </span>
                  </span>
                </button>
              );
            })}

            {/* Floating Overlay Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-30">
              <button
                onClick={() => setIsFullscreenModal(true)}
                className="p-2 rounded-xl bg-black/80 hover:bg-black text-slate-300 hover:text-white border border-white/10 hover:border-amber-500/40 backdrop-blur-md transition-all cursor-pointer"
                title="Full Screen Inspection View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/85 border border-amber-500/30 backdrop-blur-md flex items-center justify-between z-20">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">
                  {currentArtifact.era}
                </span>
                <span className="text-xs text-slate-200 font-bold">
                  {currentArtifact.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentArtifact.proclamation && (
                  <button
                    onClick={handleReciteProclamation}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSpeaking 
                        ? 'bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse' 
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Recitation' : 'Recite Decree'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToGrimoire}
                className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Save to Grimoire</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-amber-500/30 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export PDF Inscription</span>
              </button>
            </div>

            {currentArtifact.proclamation && (
              <button
                onClick={() => handleCopy(currentArtifact.proclamation || '', 'Proclamation Poem')}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-amber-500/30 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedText === 'Proclamation Poem' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>Copy Zion Verse</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Hotspot Inspector & Theological Exegesis */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Hotspot Inspector Card */}
          {activeHotspot && (
            <motion.div
              key={activeHotspot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 via-black/80 to-black/90 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <Crown className="w-24 h-24 text-amber-400" />
              </div>

              <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-3">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Active Inscription Focus
                </span>
                {activeHotspot.gematria && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                    {activeHotspot.gematria}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
                {activeHotspot.title}
              </h3>

              {activeHotspot.transcription && (
                <div className="mb-3 px-3 py-1.5 rounded-lg bg-black/60 border border-amber-500/30 font-mono text-xs text-amber-300 flex items-center justify-between">
                  <span>Inscription: "{activeHotspot.transcription}"</span>
                  <button
                    onClick={() => handleCopy(activeHotspot.transcription || '', 'Inscription')}
                    className="text-[10px] text-slate-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed font-serif mb-4">
                {activeHotspot.description}
              </p>

              {/* Hotspot Switcher Chips */}
              <div className="space-y-1.5 pt-3 border-t border-white/10">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  Select Inscription Coordinate:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentArtifact.hotspots.map((h) => {
                    const isSelected = h.id === activeHotspotId;
                    return (
                      <button
                        key={h.id}
                        onClick={() => setActiveHotspotId(h.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-serif transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {h.title.split(':')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Sacred Proclamation Callout (if manuscript) */}
          {currentArtifact.proclamation && (
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-md relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  The Inscribed Proclamation of Mount Zion
                </span>
                <button
                  onClick={handleReciteProclamation}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>

              <blockquote className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20 text-slate-200 text-xs sm:text-sm italic leading-relaxed whitespace-pre-line font-serif">
                "{currentArtifact.proclamation}"
              </blockquote>

              <p className="text-[11px] text-slate-400 mt-2">
                Ratified by Grand Architect <strong className="text-white">Jerry Ben Salazar</strong> upon the eternal foundation of Zion.
              </p>
            </div>
          )}

          {/* Theological Significance List */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Canonical & Archival Significance
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-serif leading-relaxed">
              {currentArtifact.theologicalSignificance.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 shrink-0 mt-0.5">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution Inspection Modal */}
      {isFullscreenModal && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-300 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>{currentArtifact.title}</span>
                <span className="text-xs font-normal text-slate-400">— Ultra High-Resolution Inspection</span>
              </h3>
              <p className="text-xs text-slate-400 font-serif">{currentArtifact.subtitle}</p>
            </div>
            <button
              onClick={() => setIsFullscreenModal(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
            <div className="relative inline-flex items-center justify-center max-w-full max-h-[85vh]">
              <img
                src={currentArtifact.imageSrc}
                alt={currentArtifact.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[85vh] object-contain rounded-xl border border-amber-500/30 shadow-2xl"
              />

              {/* Dynamic Inscription Overlay in Fullscreen Mode */}
              {currentArtifact.id === 'sovereign-bronze-monument' && (
                <>
                  <div
                    style={{ left: '50%', top: '39.8%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto cursor-pointer"
                    title="Sovereign Breastplate Inscription: J.B. 76"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-600/40 blur-[4px] animate-pulse pointer-events-none" />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#2d1e0d] via-[#1a1106] to-[#0a0703] border-2 border-amber-400 shadow-[0_0_22px_rgba(212,175,55,0.8),inset_0_0_12px_rgba(212,175,55,0.6)] flex flex-col items-center justify-center p-1 backdrop-blur-sm">
                        <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/50 pointer-events-none" />
                        <span className="font-serif font-black text-sm sm:text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-yellow-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                          J.B.
                        </span>
                        <div className="flex items-center justify-center gap-1 -mt-0.5 z-10">
                          <span className="font-mono font-black text-xs sm:text-sm text-amber-200 tracking-tighter">
                            76
                          </span>
                          <span className="font-serif text-[8px] sm:text-[9px] text-purple-300 font-bold">
                            ע״ו
                          </span>
                        </div>
                        <div className="absolute -bottom-1 px-1.5 py-0.2 rounded-full bg-black/95 border border-amber-500/70 text-[7px] font-mono text-amber-300 font-bold tracking-widest uppercase">
                          SOVEREIGN
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ left: '74%', top: '53%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                    title="Sovereign Shield Inscription: J.B. 76"
                  >
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#2d1e0d] via-[#1a1106] to-[#0a0703] border-2 border-amber-400/90 shadow-[0_0_15px_rgba(212,175,55,0.6)] flex flex-col items-center justify-center p-0.5 backdrop-blur-sm">
                      <span className="font-serif font-black text-[10px] sm:text-xs text-amber-300 tracking-wider">
                        J.B.
                      </span>
                      <span className="font-mono font-black text-[9px] sm:text-[10px] text-amber-200 -mt-0.5">
                        76
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-3 bg-black/80 border-t border-white/10 rounded-xl flex items-center justify-between text-xs text-slate-400">
            <span>Era: {currentArtifact.era} • Provenance: {currentArtifact.provenance}</span>
            <button
              onClick={() => setIsFullscreenModal(false)}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-serif cursor-pointer"
            >
              Exit Fullscreen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
