import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scroll, Sparkles, BookOpen, Layers, Search, FileText, 
  RotateCcw, Compass, Feather, Check, Copy, Download,
  Send, Loader2, ArrowRight, ShieldCheck, Sun, Moon,
  Clock, Award, Flame, Eye, Key, Scale
} from 'lucide-react';

interface EnochScholarshipPortalProps {
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    accentGradient: string;
    borderAccent: string;
    borderAccentSemi: string;
    starStroke: string;
    accentGlow: string;
    bgCard: string;
  };
}

interface EnochManuscriptRecord {
  id: string;
  corpus: '1 Enoch (Ethiopic)' | '2 Enoch (Slavonic)' | '3 Enoch (Hebrew)' | 'Qumran Aramaic' | 'New Testament & Patristic';
  section: string;
  chapters: string;
  title: string;
  estimatedDate: string;
  keyThemes: string[];
  summary: string;
  keyPassageHebrewAramaic?: string;
  keyPassageTranslation: string;
  scholarlyAnalysis: string;
  canonicalStatus: string;
  manuscripts: string[];
}

interface ApocalypseWeek {
  weekNumber: number;
  title: string;
  reference: string;
  epochEra: string;
  description: string;
  theologicalSignificance: string;
  biblicalParallels: string;
  phase: 'Historical (Weeks 1-7)' | 'Eschatological (Weeks 8-10)';
}

const APOCALYPSE_OF_WEEKS: ApocalypseWeek[] = [
  {
    weekNumber: 1,
    title: 'The Primordial Age of Righteousness',
    reference: '1 Enoch 93:3',
    epochEra: 'From Creation to Enoch (7th from Adam)',
    description: 'Enoch is born as the seventh from Adam during an era of primeval justice and divine fellowship, before universal corruption sets in.',
    theologicalSignificance: 'Establishes Enoch as the primal scribe, eye-witness, and prophet appointed to record the heavenly tablets of all generations.',
    biblicalParallels: 'Genesis 5:21–24; Jude 1:14; Hebrews 11:5',
    phase: 'Historical (Weeks 1-7)'
  },
  {
    weekNumber: 2,
    title: 'The Deluge & The Preservation of the Seed',
    reference: '1 Enoch 93:4',
    epochEra: 'The Generation of the Flood & Noah',
    description: 'Injustice and deceit multiply across the earth. The first great crisis culminates in the cosmic Flood, but Noah is preserved as a righteous root.',
    theologicalSignificance: 'Introduces the recurring Enochic motif: catastrophic judgment on universal deceit paired with divine covenant preservation for the righteous remnant.',
    biblicalParallels: 'Genesis 6–9; 1 Peter 3:20; 2 Peter 2:5',
    phase: 'Historical (Weeks 1-7)'
  },
  {
    weekNumber: 3,
    title: 'The Call of Abraham & The Plant of Justice',
    reference: '1 Enoch 93:5',
    epochEra: 'The Patriarchal Era',
    description: 'At the close of the third week, a man (Abraham) is chosen, and from him grows the "Plant of Righteous Judgment" destined to endure forever.',
    theologicalSignificance: 'Connects the patriarchal covenant directly to the cosmic righteous lineage, framing Israel as the garden/plant of divine inheritance.',
    biblicalParallels: 'Genesis 12:1–3; Genesis 15:6; Galatians 3:6–9',
    phase: 'Historical (Weeks 1-7)'
  },
  {
    weekNumber: 4,
    title: 'The Sinai Theophany & The Law',
    reference: '1 Enoch 93:6',
    epochEra: 'The Exodus & Mosaic Covenant',
    description: 'Visions of the holy and righteous Law are given to Moses at Mount Sinai, providing a legal and moral fence for all generations.',
    theologicalSignificance: 'Highlights the revealed Torah as a divine safeguard against the deceptive corruption introduced by the fallen Watchers.',
    biblicalParallels: 'Exodus 19–20; Deuteronomy 33:2; Acts 7:38',
    phase: 'Historical (Weeks 1-7)'
  },
  {
    weekNumber: 5,
    title: 'The House of Glory & Dominion',
    reference: '1 Enoch 93:7',
    epochEra: 'Solomonic Monarchy & First Temple',
    description: 'The House of Glory and Royal Dominion (the First Temple in Jerusalem) is built for the eternal name of God.',
    theologicalSignificance: 'Marks the zenith of Israel’s historical earthly splendor, prefiguring the transcendent eternal sanctuary of the final week.',
    biblicalParallels: '1 Kings 6–8; 2 Chronicles 7:1–3; Psalm 132',
    phase: 'Historical (Weeks 1-7)'
  },
  {
    weekNumber: 6,
    title: 'Apostasy, Blindness & The Babylonian Exile',
    reference: '1 Enoch 93:8',
    epochEra: 'The Divided Kingdom to the Exile (586 BCE)',
    description: 'Those living in the house become blinded in heart and forsake wisdom. A man ascends to heaven (Elijah), the Temple is burned, and the people are scattered.',
    theologicalSignificance: 'Explains the destruction of Jerusalem not as divine impotence, but as the consequence of internal spiritual blindness and covenant breach.',
    biblicalParallels: '2 Kings 25; 2 Chronicles 36:14–21; Jeremiah 52',
    phase: 'Historical (Weeks 1-7)'
  },
  {
    weekNumber: 7,
    title: 'The Apostate Generation & The Enlightened Remnant',
    reference: '1 Enoch 93:9–10',
    epochEra: 'Hellenistic Era & Pre-Maccabean Crisis (c. 175 BCE)',
    description: 'An apostate generation arises whose deeds are entirely perverse. From it emerge the "chosen righteous of the eternal plant of righteousness," endowed with sevenfold wisdom to instruct the faithful.',
    theologicalSignificance: 'The author’s contemporary moment: provides theodicy for the persecuted elect, validating their sectarian wisdom as the true continuation of the patriarchal covenant.',
    biblicalParallels: 'Daniel 11:32–35; Daniel 12:3; 1QS (Community Rule)',
    phase: 'Historical (Weeks 1-7)'
  },
  {
    weekNumber: 8,
    title: 'The Sword of Justice & The Incorruptible House',
    reference: '1 Enoch 91:12–13',
    epochEra: 'Eschatological Dawn / Earthly Vindication',
    description: 'A sword is handed to the righteous to execute righteous judgment on violent oppressors. At its close, they acquire dwellings of righteousness and the new eternal House of the Great King is built.',
    theologicalSignificance: 'Unlike purely quietist apocalypses, the righteous participate actively in overthrowing socioeconomic and religious tyranny, inaugurating the true eternal Temple.',
    biblicalParallels: 'Psalm 149:6–9; Daniel 7:22; Revelation 2:26–27',
    phase: 'Eschatological (Weeks 8-10)'
  },
  {
    weekNumber: 9,
    title: 'Universal Revelation & Total Destruction of Evil',
    reference: '1 Enoch 91:14',
    epochEra: 'Global Eschatological Purge',
    description: 'Righteous judgment is revealed to the entire world. All the works of the godless vanish permanently from the whole earth, and mankind directs its eyes toward the path of uprightness.',
    theologicalSignificance: 'Universalization of cosmic justice: judgment expands from Israel to all nations, eradicating systemic evil, idolatry, and violent structures forever.',
    biblicalParallels: 'Isaiah 11:9; Habakkuk 2:14; Zechariah 14:9',
    phase: 'Eschatological (Weeks 8-10)'
  },
  {
    weekNumber: 10,
    title: 'The Cosmic Judgment of the Watchers & The New Heaven',
    reference: '1 Enoch 91:15–17',
    epochEra: 'Cosmic Renewal & Countless Eternal Weeks',
    description: 'In the seventh part of the tenth week, the Great Eternal Judgment is executed upon the fallen Watchers. The old heaven passes away, a new heaven shines with sevenfold brilliance, and countless weeks of sinless peace begin.',
    theologicalSignificance: 'Final elimination of the root cause of cosmic defilement (the rebellious angels). History dissolves into timeless, incorruptible communion with God.',
    biblicalParallels: 'Isaiah 65:17; Jude 1:6; 2 Peter 3:13; Revelation 21:1–5',
    phase: 'Eschatological (Weeks 8-10)'
  }
];

const ENOCH_RECORDS: EnochManuscriptRecord[] = [
  {
    id: '1enoch-watchers',
    corpus: '1 Enoch (Ethiopic)',
    section: 'The Book of the Watchers',
    chapters: '1 Enoch 1–36',
    title: 'The Descent of the Grigori on Mount Hermon & Enoch’s Intercession',
    estimatedDate: 'c. 300–250 BCE (Oldest section of 1 Enoch)',
    keyThemes: ['Fallen Angels (Watchers)', 'Samyaza & Azazel', 'Nephilim Giants', 'Cosmic Geography', 'Enoch the Scribe of Righteousness'],
    summary: 'Two hundred celestial Watchers under Samyaza descend on Mount Hermon, binding themselves by mutual oaths. They mate with human women and teach illicit technologies (metallurgy, weaponry, cosmetics, sorcery, astronomy). Enoch is commissioned by God to pronounce unalterable judgment upon the fallen angels and journeys through the cosmos to the ends of heaven.',
    keyPassageHebrewAramaic: 'ויתהלכו מלאכיא… ונחתו על ראש חרמון… ואנה חנוך ספרא דקשוטא',
    keyPassageTranslation: '"Behold, he comes with ten thousands of His holy ones, to execute judgment upon all, and to destroy all the ungodly, and to convict all flesh of all the works of their godlessness which they have godlessly committed..." (1 Enoch 1:9, cited in Jude 1:14-15)',
    scholarlyAnalysis: 'Provides the primary ancient Jewish etiology for the proliferation of cosmic evil and spiritual oppression. The phraseology in 1:9 is directly cited verbatim in the canonical Epistle of Jude 14–15.',
    canonicalStatus: 'Canonical in Ethiopian Orthodox Tewahedo Church & Eritrean Orthodox; Pseudepigraphal in Western/Eastern traditions.',
    manuscripts: ['Qumran Cave 4 (4Q201, 4Q202, 4Q204)', 'Greek Codex Panopolitanus (Akhmim)', 'Ethiopic Tana 9 & Kebran 9']
  },
  {
    id: '1enoch-parables',
    corpus: '1 Enoch (Ethiopic)',
    section: 'The Book of Parables (Similitudes of Enoch)',
    chapters: '1 Enoch 37–71',
    title: 'The Vision of the Son of Man, The Elect One, & The Throne of Glory',
    estimatedDate: 'c. 50 BCE – 50 CE',
    keyThemes: ['The Son of Man', 'The Elect One', 'Righteousness vs Wealthy Kings', 'The Throne of Glory', 'Enoch’s Heavenly Enthronement'],
    summary: 'Enoch beholds three apocalyptic similitudes revealing the heavenly courtroom. A transcendent, pre-existent figure styled "The Son of Man," "The Elect One," and "The Anointed (Messiah)" sits upon the Throne of Glory to judge kings and the mighty, vindicating the humble righteous.',
    keyPassageHebrewAramaic: 'ויתיב ברא דאנשא על כורסי יקרא למדן…',
    keyPassageTranslation: '"And there I saw One who had a head of days, and His head was white like wool, and with Him was another whose countenance had the appearance of a man... This is the Son of Man who has righteousness..." (1 Enoch 46:1–3)',
    scholarlyAnalysis: 'Forms the single most crucial theological background for Jesus’s self-designation as the "Son of Man" in the Gospels (Matthew 25:31; Mark 14:62). In chapter 71:14, Enoch himself is elevated in a controversial climactic translation.',
    canonicalStatus: 'Canonical in Ethiopic tradition; omitted from Qumran Cave 4 (suggesting distinctive provenance or late distribution).',
    manuscripts: ['Ethiopic MSS (Berlin Petermann II Nachtr. 29, Paris Abbadianus 55)']
  },
  {
    id: '1enoch-astronomical',
    corpus: '1 Enoch (Ethiopic)',
    section: 'The Astronomical Book (Book of the Heavenly Luminaries)',
    chapters: '1 Enoch 72–82',
    title: 'The 364-Day Solar Calendar & The Angelic Gates of the Sun and Moon',
    estimatedDate: 'c. 300–200 BCE',
    keyThemes: ['364-Day Solar Calendar', 'Archangel Uriel', 'Angelic Heavenly Gates', 'Critique of 354-Day Lunar Calendar', 'Cosmic Order'],
    summary: 'Archangel Uriel guides Enoch through the celestial portals, demonstrating the exact math of the 364-day solar calendar (divided into 4 seasonal quadrants of 91 days). The text vehemently defends the solar calendar against lunar calendars, warning that lunar calculations lead to festival apostasy.',
    keyPassageTranslation: '"And Uriel the holy angel, who is over them, showed me all the laws of the luminaries... thirty days each in their gates, plus four intercalary days of the seasons." (1 Enoch 72:1; 82:4–6)',
    scholarlyAnalysis: 'Foundational text for the sectarian Qumran Essene calendar (found in 4Q208–4Q211). The Essenes viewed adherence to this 364-day calendar as a matter of covenantal fidelity.',
    canonicalStatus: 'Canonical in Ethiopic; represented in oldest Qumran Aramaic scrolls (4Q208, 4Q209).',
    manuscripts: ['Qumran 4Q208, 4Q209', 'Ethiopic Tana 9', 'Chester Beatty XII']
  },
  {
    id: '1enoch-dreams',
    corpus: '1 Enoch (Ethiopic)',
    section: 'The Book of Dream Visions (Animal Apocalypse)',
    chapters: '1 Enoch 83–90',
    title: 'The Allegorical History of the World & The Horned Ram (Judas Maccabeus)',
    estimatedDate: 'c. 165–160 BCE (Maccabean Revolt period)',
    keyThemes: ['Animal Apocalypse', 'White Bull (Adam/Patriarchs)', 'Black Bulls & Wild Beasts (Nations)', 'Seventy Shepherds', 'The Great Horned Ram'],
    summary: 'An extended zoomorphic allegory of world history where humans are depicted as animals: Adam and Seth as white bulls, the Watchers as falling stars transforming into elephants/camels, Israel as sheep, gentile nations as predators (wolves, eagles, ravens), and Judas Maccabeus as the great horned ram with a great sword.',
    keyPassageTranslation: '"And I saw till a great horn sprouted on one of those sheep, and their eyes were opened, and he cried to the sheep, and the rams saw it and all ran to him..." (1 Enoch 90:9–12)',
    scholarlyAnalysis: 'Allows precise historical dating to the Maccabean uprising (167–160 BCE). Demonstrates the militant apocalyptic hopes of early 2nd-century BCE Judaism.',
    canonicalStatus: 'Canonical in Ethiopic; found in Qumran Cave 4 (4Q204, 4Q205).',
    manuscripts: ['Qumran 4Q204, 4Q205', 'Ethiopic Tana 9', 'Greek fragments']
  },
  {
    id: '1enoch-epistle',
    corpus: '1 Enoch (Ethiopic)',
    section: 'The Epistle of Enoch & The Apocalypse of Weeks',
    chapters: '1 Enoch 91–104/105',
    title: 'The Ten-Week Heptadic History & The Book of Woes Against the Rich',
    estimatedDate: 'c. 170–100 BCE',
    keyThemes: ['Apocalypse of Weeks (10 Weeks)', 'Prophetic Woes Against Wealthy Oppressors', 'Vindication of the Poor Righteous', 'Heavenly Books of Record'],
    summary: 'Contains the complete Apocalypse of Weeks outlining human destiny from Creation to the New Creation, followed by fierce prophetic woes condemning corrupt rulers, fraudulent judges, and wealthy oppressors who persecute the righteous elect.',
    keyPassageTranslation: '"Woe to you who build your houses with the sweat of others without wages... Know that your wealth shall not remain, but will depart from you quickly, because you acquired all things in unrighteousness." (1 Enoch 94:6–8; 99:12)',
    scholarlyAnalysis: 'Textually confirmed by Qumran fragment 4Q212 (4QEnᵍ), which proved that 93:10 is followed directly by 91:12, resolving the ancient manuscript dislocation in Ethiopic copies.',
    canonicalStatus: 'Canonical in Ethiopic; verified by Dead Sea Scroll 4Q212.',
    manuscripts: ['Qumran 4Q212 (4QEnᵍ)', 'Chester Beatty Papyrus XII (Greek)', 'Ethiopic MSS']
  },
  {
    id: '2enoch-secrets',
    corpus: '2 Enoch (Slavonic)',
    section: 'Book of the Secrets of Enoch (Slavonic Enoch)',
    chapters: '2 Enoch 1–73',
    title: 'The Journey Through the Ten Heavens & The Miraculous Birth of Melchizedek',
    estimatedDate: 'c. 1st Century CE (Preserved in Old Church Slavonic)',
    keyThemes: ['Ten Heavens', 'Secrets of Creation (Adoil & Arukhas)', 'Enoch Scribe of the Lord', 'The Transfiguration of Enoch', 'Priestly Succession of Melchizedek'],
    summary: 'Two radiant angels lift Enoch on their wings through ten ascending heavens. In the tenth heaven, Enoch gazes upon the face of the Lord, is anointed with fragrant holy oil, and transfigured into the likeness of the glorious angels. Chapters 71–72 narrate the miraculous virgin birth of Melchizedek with the seal of priesthood on his chest, whom Archangel Michael whisks to Eden before the Deluge.',
    keyPassageTranslation: '"And the Lord said to Michael: \'Take Enoch and extract him from his earthly garments, and anoint him with good oil, and clothe him in garments of glory.\' And I looked at myself, and I had become like one of His glorious ones." (2 Enoch 22:8–10)',
    scholarlyAnalysis: 'Key bridge text showing the evolution of Enoch into a celestial high priest and scribe, directly informing later Hekhalot mystical traditions and early Christian Melchizedekian Christology.',
    canonicalStatus: 'Apocryphal / Pseudepigraphal; preserved exclusively in medieval Slavonic manuscripts.',
    manuscripts: ['Slavonic MSS (Popov 105, Barsov 1515, Uvarov 1403)']
  },
  {
    id: '3enoch-metatron',
    corpus: '3 Enoch (Hebrew)',
    section: 'Sefer Hekhalot (The Hebrew Book of Enoch)',
    chapters: '3 Enoch 1–48',
    title: 'The Fiery Transfiguration of Human Enoch into Archangel Metatron',
    estimatedDate: 'c. 5th–7th Century CE (Babylonian / Palestinian Hekhalot Circles)',
    keyThemes: ['Metatron (Sar ha-Panim)', 'Lesser YHWH (YHWH Qatan)', 'Safra Rabba (Great Scribe)', 'Fiery Transfiguration', 'Seventy Names of Metatron'],
    summary: 'Rabbi Ishmael the High Priest ascends through the seven heavenly palaces (Hekhalot) and meets the supreme archangel Metatron, Prince of the Divine Presence. Metatron reveals: "I am Enoch, son of Jared. When the generation of the Flood sinned, God lifted me up... My flesh turned to flame, my veins to fire, my eyelashes to flashes of lightning, and God placed His crown upon me, calling me the Lesser YHWH."',
    keyPassageHebrewAramaic: 'אנא הוא חנוך בן ירד… הפך בשרי לשלהבת וגידי לאש בוערת… וקראני ה׳ הקטן',
    keyPassageTranslation: '"The Holy One, blessed be He, made for me a throne like the throne of glory... and He robed me in a garment of majesty and set a royal crown of 49 stones of radiance upon my head... and He called me \'The Lesser YHWH\' in the presence of all the heavenly host." (3 Enoch 10:1–3; 12:5)',
    scholarlyAnalysis: 'The apex of Jewish mystical angelology. Reconciles the human Enoch of Genesis 5:24 with the supreme heavenly viceroy Metatron, central to Merkabah mysticism and Talmudic disputes (b. Sanhedrin 38b; b. Chagigah 15a).',
    canonicalStatus: 'Jewish mystical classic (Kabbalistic/Merkabah literature); non-canonical.',
    manuscripts: ['Vatican Ebr. 228', 'Oxford Bodleian Opp. Add. 8vo 36', 'Munich Heb. 40']
  },
  {
    id: 'qumran-giants',
    corpus: 'Qumran Aramaic',
    section: 'The Book of Giants (4Q530–4Q532, 1Q23, 6Q8)',
    chapters: 'Aramaic Scroll Fragments',
    title: 'The Nightmares of the Nephilim: Ohya, Hahya, Mahway & Gilgamesh',
    estimatedDate: 'c. 200–100 BCE',
    keyThemes: ['Nephilim Giants (Ohya, Hahya, Mahway)', 'Gilgamesh & Hobabish Inscriptions', 'Dream Tablets & Erasure by Water', 'Enoch Interprets the Vision'],
    summary: 'Discovered in Dead Sea Scroll caves, this work narrates the terror of the giant sons of the Watchers (including Ohya, Hahya, and Gilgamesh) as they experience symbolic nightmares foretelling their drowning in the Flood and eternal destruction. The giant Mahway flies to the ends of the earth to beseech Enoch the Scribe to interpret their dream tablets.',
    keyPassageHebrewAramaic: 'וחזית בחלמא דא… לוחא חדא טמיעא במיא ורב חנוך ספרא יפשר להון…',
    keyPassageTranslation: '"Mahway mounted into the air like an eagle, flying over deserts and oceans, until he found Enoch the Scribe of Righteousness... And Enoch read the tablet: \'Know that you shall not escape the holy judgment of the Ruler of Heaven.\'" (4Q530 Col. 2)',
    scholarlyAnalysis: 'Demonstrates the syncretic engagement between ancient Mesopotamian epic figures (Gilgamesh, Humbaba) and Second Temple Jewish apocalyptic demonology, preserved alongside 1 Enoch in the Qumran library.',
    canonicalStatus: 'Discovered in Dead Sea Scrolls; ancient non-canonical Essene library.',
    manuscripts: ['4Q530, 4Q531, 4Q532, 1Q23, 6Q8 (Cave 1, 4, 6)']
  }
];

export default function EnochScholarshipPortal({ activeTheme }: EnochScholarshipPortalProps) {
  const [activeTab, setActiveTab] = useState<'corpus' | 'apocalypse-weeks' | 'manuscripts' | 'theology' | 'watchers' | 'ai-inquiry'>('corpus');
  const [selectedCorpusFilter, setSelectedCorpusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<EnochManuscriptRecord | null>(ENOCH_RECORDS[0]);
  const [selectedWeek, setSelectedWeek] = useState<ApocalypseWeek>(APOCALYPSE_OF_WEEKS[6]); // Default to Week 7
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Scholarly Assistant State
  const [aiPrompt, setAiPrompt] = useState<string>('Synthesize the relationship between 1 Enoch 93 (Apocalypse of Weeks), the 4Q212 Qumran Aramaic scroll, and the Son of Man in the Parables.');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    return ENOCH_RECORDS.filter(record => {
      const matchesCorpus = selectedCorpusFilter === 'all' || record.corpus === selectedCorpusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        record.title.toLowerCase().includes(q) ||
        record.section.toLowerCase().includes(q) ||
        record.summary.toLowerCase().includes(q) ||
        record.keyThemes.some(t => t.toLowerCase().includes(q)) ||
        record.chapters.toLowerCase().includes(q);
      return matchesCorpus && matchesSearch;
    });
  }, [selectedCorpusFilter, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleRunAiScholarship = async () => {
    if (!aiPrompt.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiError(null);
    setAiResponse('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[ENOCH SCHOLARSHIP ARCHIVE INQUIRY]\nUser Prompt: ${aiPrompt}\n\nContext Requirements: Provide a rigorous academic, textual-critical, and theological synthesis covering 1 Enoch (Ethiopic & Qumran Aramaic 4Q201-212), 2 Enoch (Slavonic), 3 Enoch (Hebrew Metatron), and early Christian/patristic receptions. Cite chapters, manuscript variants, and scholars (R.H. Charles, J.T. Milik, George Nickelsburg, Michael Stone, James VanderKam) where applicable.`,
          school: 'Enochic Judaism & Pseudepigrapha'
        })
      });

      if (!response.ok) {
        throw new Error(`Scholarship engine returned status ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.reply || data.response || data.text || 'Scholarship response synthesized successfully.');
    } catch (err: any) {
      setAiError(`Inquiry failed: ${err.message}. Using built-in offline scholarship database.`);
      setAiResponse(`### Offline Synthesis on Enochic Literature & Manuscript Variants\n\n**1. The Apocalypse of Weeks (1 Enoch 93:1–10; 91:12–17)**:\nDiscovered in Qumran Cave 4 (**4Q212 / 4QEnᵍ**), this text confirms that the 10-week schema is a continuous unit that was accidentally displaced in Ethiopic codices.\n\n**2. Evolution of Enoch’s Status**:\n- **1 Enoch 1–36**: Scribe of Righteousness who petitions God on behalf of fallen Watchers.\n- **1 Enoch 37–71**: Heavenly elevation and vision of the pre-existent Son of Man / Elect One.\n- **2 Enoch**: Ascension through ten heavens and appointment as heavenly scribe.\n- **3 Enoch**: Fiery transfiguration into Archangel Metatron, Prince of the Presence (*Sar ha-Panim*) and \'Lesser YHWH\'.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const exportEnochDossier = () => {
    let md = `# THE GREAT WHEEL OF MYSTERIES: COMPREHENSIVE ENOCH SCHOLARSHIP DOSSIER\n`;
    md += `Exported: ${new Date().toISOString()}\n\n`;
    md += `## 1. APOCALYPSE OF WEEKS (1 ENOCH 93:1-10; 91:12-17)\n`;
    APOCALYPSE_OF_WEEKS.forEach(w => {
      md += `### Week ${w.weekNumber}: ${w.title} (${w.reference})\n`;
      md += `- **Phase:** ${w.phase}\n`;
      md += `- **Era:** ${w.epochEra}\n`;
      md += `- **Description:** ${w.description}\n`;
      md += `- **Theological Significance:** ${w.theologicalSignificance}\n`;
      md += `- **Parallels:** ${w.biblicalParallels}\n\n`;
    });
    md += `\n## 2. THE COMPLETE ENOCHIC CORPUS\n`;
    ENOCH_RECORDS.forEach(r => {
      md += `### ${r.title} (${r.chapters})\n`;
      md += `- **Corpus:** ${r.corpus} | **Section:** ${r.section}\n`;
      md += `- **Date:** ${r.estimatedDate}\n`;
      md += `- **Canonical Status:** ${r.canonicalStatus}\n`;
      md += `- **Summary:** ${r.summary}\n`;
      md += `- **Key Passage:** "${r.keyPassageTranslation}"\n`;
      md += `- **Scholarly Analysis:** ${r.scholarlyAnalysis}\n`;
      md += `- **Manuscripts:** ${r.manuscripts.join(', ')}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Enoch_Complete_Scholarship_Portal_Archive_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border ${activeTheme.borderAccentSemi} ${activeTheme.bgCard} p-6 sm:p-8 backdrop-blur-xl shadow-2xl`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono uppercase tracking-widest">
              <Scroll className="w-3.5 h-3.5" />
              <span>Ancient Records & Pseudepigrapha Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-wide">
              The Enochic Wisdom & Scholarship Portal
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed font-sans">
              Comprehensive scholarly archive for <strong>1 Enoch (Ethiopic & Qumran Aramaic 4Q201–212)</strong>, 
              <strong> 2 Enoch (Slavonic)</strong>, <strong>3 Enoch (Hebrew Metatron)</strong>, the 
              <strong> Apocalypse of Weeks</strong>, and the Dead Sea Scrolls Book of Giants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportEnochDossier}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 text-xs font-mono uppercase tracking-wider transition-all shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Enoch Dossier</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          {[
            { id: 'corpus', label: 'Corpus Explorer', icon: BookOpen },
            { id: 'apocalypse-weeks', label: 'Apocalypse of Weeks (10 Weeks)', icon: Clock },
            { id: 'manuscripts', label: 'Dead Sea Scrolls (4QEn)', icon: Layers },
            { id: 'theology', label: 'Enoch to Metatron Theology', icon: Flame },
            { id: 'watchers', label: 'Watchers & Angelology', icon: Eye },
            { id: 'ai-inquiry', label: 'AI Scholarship Terminal', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* TAB 1: CORPUS EXPLORER */}
      {activeTab === 'corpus' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters, themes, Watchers, Son of Man..."
                className="w-full sm:w-80 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['all', '1 Enoch (Ethiopic)', '2 Enoch (Slavonic)', '3 Enoch (Hebrew)', 'Qumran Aramaic'].map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedCorpusFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    selectedCorpusFilter === f
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {f === 'all' ? 'All Traditions' : f.replace(' (Ethiopic)', '').replace(' (Slavonic)', '').replace(' (Hebrew)', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of sections */}
            <div className="space-y-3 lg:col-span-1 max-h-[750px] overflow-y-auto pr-1">
              {filteredRecords.map(record => {
                const isSelected = selectedRecord?.id === record.id;
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                        : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                        {record.corpus}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{record.chapters}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-serif font-bold text-white leading-snug">
                      {record.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {record.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {record.keyThemes.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Inspector */}
            <div className="lg:col-span-2">
              {selectedRecord ? (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl space-y-6 shadow-xl sticky top-4">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{selectedRecord.corpus}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-mono text-slate-400">{selectedRecord.chapters}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-mono text-emerald-400">{selectedRecord.estimatedDate}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                        {selectedRecord.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => copyToClipboard(`[${selectedRecord.section} - ${selectedRecord.chapters}]: ${selectedRecord.keyPassageTranslation}`, `rec-${selectedRecord.id}`)}
                      className="p-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
                    >
                      {copiedId === `rec-${selectedRecord.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === `rec-${selectedRecord.id}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Key Passage */}
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5" />
                      Key Ancient Inscription & Translation
                    </span>
                    {selectedRecord.keyPassageHebrewAramaic && (
                      <p className="text-sm font-serif text-amber-200/80 italic dir-rtl text-right">
                        {selectedRecord.keyPassageHebrewAramaic}
                      </p>
                    )}
                    <p className="text-sm font-serif text-slate-200 leading-relaxed">
                      {selectedRecord.keyPassageTranslation}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Content & Narrative Structure</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedRecord.summary}
                    </p>
                  </div>

                  {/* Scholarly Analysis */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Critical & Theological Scholarship</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedRecord.scholarlyAnalysis}
                    </p>
                  </div>

                  {/* Canonical Status & Manuscripts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Canonical Status</span>
                      <span className="text-xs font-medium text-amber-200 mt-1 block">{selectedRecord.canonicalStatus}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Witness Manuscripts</span>
                      <span className="text-xs font-medium text-slate-300 mt-1 block">{selectedRecord.manuscripts.join(', ')}</span>
                    </div>
                  </div>

                  {/* Key Themes Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Indexed Themes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecord.keyThemes.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">Select a record from the explorer list.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APOCALYPSE OF WEEKS (10 WEEKS) INTERACTIVE TIMELINE */}
      {activeTab === 'apocalypse-weeks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Heptadic Eschatology & Prophecy</span>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">
                  The Apocalypse of Weeks (1 Enoch 93:1–10; 91:12–17)
                </h2>
              </div>
              <div className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                ✓ Reconstructed via Qumran 4Q212
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              The <strong>Apocalypse of Weeks</strong> is one of the earliest Jewish apocalyptic philosophies of history (c. 175 BCE). 
              History is divided into ten deterministic &quot;weeks&quot; of world time. In the ancient Ethiopic manuscripts, 
              Weeks 8–10 (**91:12–17**) were dislocated prior to Weeks 1–7 (**93:1–10**). The Aramaic Dead Sea Scroll (**4Q212 / 4QEnᵍ**) 
              definitively restored the continuous, unbroken ten-week sequence shown below.
            </p>
          </div>

          {/* 10 Weeks Visual Step Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {APOCALYPSE_OF_WEEKS.map(w => {
              const isSelected = selectedWeek.weekNumber === w.weekNumber;
              const isEschatological = w.weekNumber >= 8;
              return (
                <button
                  key={w.weekNumber}
                  onClick={() => setSelectedWeek(w)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? isEschatological
                        ? 'border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/20 scale-105'
                        : 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20 scale-105'
                      : isEschatological
                      ? 'border-violet-950/80 bg-violet-950/20 hover:border-violet-700/60'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isEschatological ? 'text-violet-300' : 'text-amber-300'}`}>
                      WK {w.weekNumber}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {isEschatological ? '⚡ Climax' : '📜 Hist'}
                    </span>
                  </div>
                  <span className="text-[11px] font-serif font-semibold text-slate-200 mt-2 line-clamp-2 leading-tight">
                    {w.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Week Detail Card */}
          <motion.div
            key={selectedWeek.weekNumber}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 sm:p-8 rounded-2xl border ${
              selectedWeek.weekNumber >= 8 ? 'border-violet-500/40 bg-gradient-to-br from-violet-950/30 to-slate-950' : 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 to-slate-950'
            } backdrop-blur-xl shadow-2xl space-y-6`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded ${
                    selectedWeek.weekNumber >= 8 ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    Week {selectedWeek.weekNumber} of 10 ({selectedWeek.phase})
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedWeek.reference}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mt-2">
                  {selectedWeek.title}
                </h3>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Historical / Prophetic Period</span>
                <span className="text-sm font-semibold text-amber-200">{selectedWeek.epochEra}</span>
              </div>
            </div>

            {/* Description & Significance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Enochic Revelation & Prophecy
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-serif">
                  {selectedWeek.description}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-violet-400 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Theological Significance & Theodicy
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedWeek.theologicalSignificance}
                </p>
              </div>
            </div>

            {/* Biblical Cross References */}
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-400">Canonical Scripture Parallels:</span>
                <span className="text-xs font-medium text-amber-300">{selectedWeek.biblicalParallels}</span>
              </div>

              <button
                onClick={() => copyToClipboard(`Week ${selectedWeek.weekNumber} (${selectedWeek.reference}): ${selectedWeek.title}\nEra: ${selectedWeek.epochEra}\nDescription: ${selectedWeek.description}\nSignificance: ${selectedWeek.theologicalSignificance}`, `wk-${selectedWeek.weekNumber}`)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                {copiedId === `wk-${selectedWeek.weekNumber}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === `wk-${selectedWeek.weekNumber}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </motion.div>

          {/* Visual Eschatological Climax Roadmap */}
          <div className="p-6 rounded-2xl border border-violet-900/40 bg-slate-950/90 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-mono uppercase tracking-widest text-violet-300 font-bold">
                  The Eschatological Climax Architecture (Weeks 8–10 & Eternity)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">1 Enoch 91:12–17</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Week 8 */}
              <div 
                onClick={() => setSelectedWeek(APOCALYPSE_OF_WEEKS[7])}
                className="cursor-pointer p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-500/60 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    WEEK 8: The Sword of Justice & The Eternal Temple (1 Enoch 91:12–13)
                  </span>
                  <span className="text-[10px] text-amber-400/80 group-hover:text-amber-300">Click to inspect →</span>
                </div>
                <ul className="text-slate-300 space-y-1 pl-5 list-disc text-[11px] font-sans">
                  <li><strong>Societal/Covenantal Vindication:</strong> The righteous remnant receives the sword of divine justice.</li>
                  <li><strong>Eradication of Oppressors:</strong> Violent rulers and sinners are subdued by the elect.</li>
                  <li><strong>The Incorruptible House:</strong> The eternal Temple of the Great King is established in glorious splendor.</li>
                </ul>
              </div>

              <div className="flex justify-center text-violet-500">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Week 9 */}
              <div 
                onClick={() => setSelectedWeek(APOCALYPSE_OF_WEEKS[8])}
                className="cursor-pointer p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 hover:bg-blue-950/40 hover:border-blue-500/60 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    WEEK 9: Universal Judgment & Eradication of Evil (1 Enoch 91:14)
                  </span>
                  <span className="text-[10px] text-blue-400/80 group-hover:text-blue-300">Click to inspect →</span>
                </div>
                <ul className="text-slate-300 space-y-1 pl-5 list-disc text-[11px] font-sans">
                  <li><strong>Global Scope:</strong> Righteous judgment is unveiled to all the inhabitants of the whole earth.</li>
                  <li><strong>Demolition of Godless Systems:</strong> The works of the wicked permanently vanish into the abyss.</li>
                  <li><strong>Universal Enlightenment:</strong> All humanity turns its vision toward the path of uprightness.</li>
                </ul>
              </div>

              <div className="flex justify-center text-violet-500">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Week 10 & Eternity */}
              <div 
                onClick={() => setSelectedWeek(APOCALYPSE_OF_WEEKS[9])}
                className="cursor-pointer p-4 rounded-xl border border-violet-500/40 bg-violet-950/30 hover:bg-violet-950/50 hover:border-violet-500/70 transition-all space-y-2 group shadow-lg shadow-violet-950/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-violet-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    WEEK 10 & ETERNITY: Cosmic Judgment & The New Creation (1 Enoch 91:15–17)
                  </span>
                  <span className="text-[10px] text-violet-400/80 group-hover:text-violet-300">Click to inspect →</span>
                </div>
                <ul className="text-slate-300 space-y-1 pl-5 list-disc text-[11px] font-sans">
                  <li><strong>Archonic/Angelic Judgment:</strong> The Great Eternal Judgment falls upon the fallen Watchers.</li>
                  <li><strong>Cosmic Transmutation:</strong> The first heaven passes away; the new heaven radiates with 7-fold celestial brilliance.</li>
                  <li><strong>Boundless Eternity:</strong> Countless &quot;weeks without number&quot; begin in perpetual righteousness, joy, and sinless peace.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEAD SEA SCROLLS & MANUSCRIPTS */}
      {activeTab === 'manuscripts' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Qumran Cave 4 Discoveries & Witnesses</span>
            <h2 className="text-2xl font-serif font-bold text-white">
              The Aramaic Enoch Scroll Fragments (4Q201–4Q212)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              Between 1952 and 1956, eleven distinct Aramaic manuscript fragments of 1 Enoch were recovered from Cave 4 at Qumran. 
              Before these discoveries, 1 Enoch was only known through late medieval Ethiopic translations and partial Greek codices. 
              The Qumran scrolls proved that 1 Enoch was originally composed in Aramaic (and Hebrew) in pre-Christian Palestine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                code: '4Q212 (4QEnᵍ)',
                title: 'The Epistle & Apocalypse of Weeks Scroll',
                date: 'c. 50–25 BCE (Late Hasmonaean / Early Herodian)',
                content: 'Preserves 1 Enoch 91:10, 18–19; 92:1–5; 93:1–10; 91:12–17; 94:1–4. Proved that 93:10 is followed directly by 91:12 without interruption.',
                impact: 'Resolved the 100-year scholarly debate regarding the Ethiopic folio displacement.'
              },
              {
                code: '4Q201 (4QEnᵃ)',
                title: 'The Oldest Watchers Scroll',
                date: 'c. 200–150 BCE (Early Hasmonaean)',
                content: 'Preserves 1 Enoch 2:1–5:6; 6:1–8:1; 8:3–9:3; 10:1–4; 12:1–4. Contains the original Aramaic names of the Watcher decarchs (Samyaza, Baraqiel, Kokabiel).',
                impact: 'Confirmed that the Book of the Watchers predates the Maccabean Revolt by at least half a century.'
              },
              {
                code: '4Q204 (4QEnᶜ)',
                title: 'The Comprehensive Enochic Anthology',
                date: 'c. 100–50 BCE',
                content: 'Large scroll originally containing the Book of the Watchers, Dream Visions (Animal Apocalypse), and the Epistle of Enoch on a single continuous leather roll.',
                impact: 'Demonstrated that multiple distinct Enochic books were circulated and studied as an authoritative literary corpus at Qumran.'
              },
              {
                code: '4Q208–4Q209',
                title: 'The Oldest Astronomical Scrolls',
                date: 'c. 250–200 BCE (Oldest Dead Sea Scrolls)',
                content: 'Astronomical calculations of the 364-day solar calendar, lunar phases, and angelic portals. Written in archaic pre-Hasmonaean Aramaic.',
                impact: 'Shows that mathematical astronomy was deeply integrated with Enochic covenantal theology.'
              },
              {
                code: '4Q530–4Q532',
                title: 'The Book of Giants (Sefer ha-Gigantim)',
                date: 'c. 150–50 BCE',
                content: 'Narrates the nightmares of the giant sons of the Watchers (Ohya, Hahya, Mahway, and Gilgamesh) and Mahway’s flight to Enoch for interpretation.',
                impact: 'Revealed a previously lost major apocalyptic work belonging to the Enochic library.'
              },
              {
                code: 'Chester Beatty XII',
                title: 'Greek Papyrus of the Epistle of Enoch',
                date: 'c. 4th Century CE (Egypt)',
                content: 'Greek translation of 1 Enoch 97:6–107:3 alongside the Homily on the Passion by Melito of Sardis.',
                impact: 'Proved the active Christian transmission and study of Enochic texts in late antique Egyptian monastic communities.'
              }
            ].map(scroll => (
              <div key={scroll.code} className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    {scroll.code}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{scroll.date}</span>
                </div>
                <h3 className="text-base font-serif font-bold text-white">
                  {scroll.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {scroll.content}
                </p>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Scholarly Impact</span>
                  <p className="text-xs text-slate-400 mt-0.5">{scroll.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: THEOLOGY (ENOCH TO METATRON) */}
      {activeTab === 'theology' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Theological Evolution</span>
            <h2 className="text-2xl font-serif font-bold text-white">
              The Evolution of Enoch: From Patriarch to Archangel Metatron
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              Tracing the 1,000-year evolution of Enoch across ancient Jewish, Christian, and mystical literature: 
              from the righteous patriarch of Genesis 5 to the heavenly Scribe of 1–2 Enoch, and ultimately to 
              <strong> Archangel Metatron (&quot;The Lesser YHWH&quot;)</strong> in 3 Enoch and Merkabah mysticism.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <div className="flex items-center gap-2 text-amber-300">
                <Sun className="w-5 h-5" />
                <h3 className="text-lg font-serif font-bold">Stage 1: The Patriarch Scribe</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 block">Genesis 5:24 & 1 Enoch (300–100 BCE)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enoch walks with God and is &quot;taken&quot; without experiencing death. In 1 Enoch, he is commissioned as 
                the <strong>Scribe of Righteousness (*Safra da-Qeshota*)</strong> who mediates between heaven and the fallen Watchers, 
                recording the secrets of the cosmos and the moral history of all human generations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <div className="flex items-center gap-2 text-violet-300">
                <Compass className="w-5 h-5" />
                <h3 className="text-lg font-serif font-bold">Stage 2: The Heavenly Priest</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 block">2 Enoch & Parables (1st Century CE)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enoch ascends through ten heavens to stand before the throne. His earthly garments are removed, he is anointed 
                with celestial oil, and his visage is transfigured into that of the glorious angels. He serves as heavenly scribe 
                and high priest, prefiguring the elevation of Melchizedek.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <Flame className="w-5 h-5" />
                <h3 className="text-lg font-serif font-bold">Stage 3: Archangel Metatron</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 block">3 Enoch & Hekhalot (5th–7th Century CE)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Human Enoch undergoes full ontological transformation: his flesh turns to fiery torches, his bones to flaming coals, 
                and he is crowned as <strong>Metatron, Prince of the Divine Presence (*Sar ha-Panim*)</strong> and <strong>The Lesser YHWH (*YHWH Qatan*)</strong>, 
                possessing 70 celestial names.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WATCHERS & ANGELOLOGY */}
      {activeTab === 'watchers' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Enochic Angelology & Demonology</span>
            <h2 className="text-2xl font-serif font-bold text-white">
              The Four Holy Archangels & The Twenty Fallen Decarchs
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              1 Enoch 6–10 and 20 provides the earliest systematic angelology in Western literature, contrasting the four faithful archangels 
              standing before the Throne of Glory with the twenty rebellious decarchs who descended on Mount Hermon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The 4 Faithful Archangels */}
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-emerald-300 border-b border-emerald-500/20 pb-3">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-lg font-serif font-bold">The Four Presence Archangels (1 Enoch 9, 20, 40)</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Michael', role: 'Merciful & Longsuffering Prince', duty: 'Commander of the heavenly host; tasked with binding Samyaza and the Watchers in the subterranean valleys.' },
                  { name: 'Gabriel', role: 'Archangel of Power & Paradise', duty: 'Placed over paradise, the serpents, and the cherubim; tasked with destroying the giant Nephilim.' },
                  { name: 'Raphael', role: 'Archangel of Healing', duty: 'Healer of the earth defiled by fallen angels; tasked with binding Azazel by hands and feet in Dudael in darkness.' },
                  { name: 'Uriel / Phanuel', role: 'Archangel of Light & Astronomy', duty: 'Guardian of celestial order, guide of the sun and moon, and ruler over repentance of those who inherit eternal life.' }
                ].map(a => (
                  <div key={a.name} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-sm font-bold text-emerald-300 font-serif">{a.name}</span>
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">{a.role}</span>
                    <p className="text-xs text-slate-300 mt-1">{a.duty}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Fallen Watcher Decarchs */}
            <div className="p-6 rounded-2xl border border-red-500/30 bg-red-950/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-red-300 border-b border-red-500/20 pb-3">
                <Flame className="w-5 h-5" />
                <h3 className="text-lg font-serif font-bold">The Rebel Decarchs & Illicit Arts (1 Enoch 6–8)</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Samyaza (Semjaza)', title: 'Supreme Chief of the Two Hundred', art: 'Led the rebellion and taught magical incantations and root-cuttings.' },
                  { name: 'Azazel (Asael)', title: 'Instructor of Metallurgy & Pride', art: 'Taught swords, knives, shields, armor, bracelets, cosmetics, and the beautifying of eyelids.' },
                  { name: 'Baraqiel', title: 'Decarch of Lightning', art: 'Taught the watchers the signs and secrets of lightning.' },
                  { name: 'Kokabiel', title: 'Decarch of the Constellations', art: 'Taught astrology and the mathematical paths of the stars.' },
                  { name: 'Sariel / Tamiel', title: 'Decarch of the Moon & Earth', art: 'Taught the course of the moon and terrestrial mysteries.' }
                ].map(w => (
                  <div key={w.name} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-sm font-bold text-red-300 font-serif">{w.name}</span>
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">{w.title}</span>
                    <p className="text-xs text-slate-300 mt-1"><strong>Forbidden Art:</strong> {w.art}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI SCHOLARSHIP INQUIRY TERMINAL */}
      {activeTab === 'ai-inquiry' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Interactive Academic Research Engine</span>
            <h2 className="text-2xl font-serif font-bold text-white">
              Enochic Scholarship & Textual Hermeneutics Engine
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              Ask deep questions regarding Enochic paleography, the Aramaic fragments of Qumran, the 364-day calendar, 
              Christological parallels in the Gospel of Matthew, the Epistle of Jude, or the transformation into Metatron.
            </p>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              'Compare the 10-week schema in 1 Enoch with the 70 weeks in Daniel 9.',
              'Explain how Qumran 4Q212 resolved the Ethiopic leaf displacement in Section V.',
              'How does 1 Enoch 1:9 relate to the quotation in Jude 1:14-15?',
              'Analyze the title "Son of Man" in the Parables of Enoch vs the Gospels.',
              'Describe the transformation of human Enoch into Metatron in 3 Enoch.'
            ].map(p => (
              <button
                key={p}
                onClick={() => setAiPrompt(p)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-500/40 bg-slate-900/80 text-slate-300 hover:text-amber-200 text-left transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
              placeholder="Ask an academic question regarding 1 Enoch, 2 Enoch, 3 Enoch, Qumran manuscripts..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Grounded in Qumran, Ge&apos;ez &amp; Greek textual variants</span>
              <button
                onClick={handleRunAiScholarship}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isAiLoading ? 'Synthesizing...' : 'Run Scholarly Analysis'}</span>
              </button>
            </div>
          </div>

          {/* Output Display */}
          {aiError && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono">
              {aiError}
            </div>
          )}

          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Academic Synthesis Response
                </span>
                <button
                  onClick={() => copyToClipboard(aiResponse, 'ai-res')}
                  className="px-3 py-1 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 flex items-center gap-1.5"
                >
                  {copiedId === 'ai-res' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'ai-res' ? 'Copied' : 'Copy Synthesis'}</span>
                </button>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {aiResponse}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
