import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { StrategicOracle } from './StrategicOracle';

type TacticType = 'Ground' | 'Naval' | 'Aerial' | 'Mythological';
type EraType = 'Mythological' | 'Ancient' | 'Medieval' | 'Early Modern' | 'Modern';

interface Tactic {
  id: string;
  name: string;
  type: TacticType;
  era: EraType;
  shortDescription: string;
  detailedDescription: string;
  historicalContext: string;
}

const TACTICS: Tactic[] = [
  {
    id: "trojan_horse",
    name: "Trojan Horse Stratagem",
    type: "Mythological",
    era: "Mythological",
    shortDescription: "A legendary subterfuge concealing elite warriors within a sacred offering to breach unassailable walls.",
    detailedDescription: "The Trojan Horse is the eternal myth of deceptive gift-giving and internal infiltration. When divine fortifications refuse to yield to brute siege, victory is achieved by disguising lethality within sacred reverence. Mystically, it represents passing through outer defenses by aligning with the enemy's own spiritual blind spots and Hubris.",
    historicalContext: "Recounted in Homer's Odyssey and Virgil's Aeneid, where Odysseus devised a colossal wooden horse to infiltrate the city of Troy after a ten-year siege."
  },
  {
    id: "myrmidon_phalanx",
    name: "Myrmidon Shield-Wall",
    type: "Mythological",
    era: "Mythological",
    shortDescription: "The ant-born legion of Achilles fighting in unbroken, ruthless unison.",
    detailedDescription: "Legend speaks of the Myrmidons created by Zeus from ants, possessing superhuman discipline, unyielding ferocity, and flawless tactical alignment. In battle, they moved as a singular hive-mind entity immune to panic or retreat.",
    historicalContext: "Featured in Homer's Iliad as the elite mythical army commanded by Achilles during the Trojan War."
  },
  {
    id: "aegis_shield",
    name: "Aegis Divine Defense",
    type: "Mythological",
    era: "Mythological",
    shortDescription: "The gorgon-embossed mantle of Athena deflecting mortal and divine strikes alike.",
    detailedDescription: "The Aegis is the ultimate celestial armor. Bearing the severed head of Medusa at its center, it paralyzes advancing foes with primal terror while casting an impenetrable energetic barrier over allied ranks. Mystically, it represents invulnerability granted by absolute spiritual righteousness.",
    historicalContext: "Derived from Greek mythology, where Athena and Zeus bore the golden-fringed Aegis shield to inspire terror and shield champions in mythic warfare."
  },
  {
    id: "kraken_summons",
    name: "Leviathan Sea Swarm",
    type: "Mythological",
    era: "Mythological",
    shortDescription: "Summoning ocean-dwelling leviathans to crush enemy armadas into splintered drift.",
    detailedDescription: "In mythic naval doctrine, commanders invoke primordial sea serpents and leviathans to drag enemy galleys into dark whirlpool abysses. It represents unleashing uncontrollable elemental chaos against rigid seafaring vessels.",
    historicalContext: "Rooted in Nordic sagas and ancient Mediterranean lore of sea monsters dragged forth during oceanic clashes."
  },
  {
    id: "phoenix_rebirth",
    name: "Phoenix Tactical Rebirth",
    type: "Mythological",
    era: "Mythological",
    shortDescription: "Rising anew from the embers of routed ranks to execute a crushing counter-strike.",
    detailedDescription: "When an army appears utterly destroyed, the Phoenix Stratagem converts total ruin into blinding pyric renewal. Surrounding foes are blinded by radiant embers as fallen ranks reform with supernatural vigor to envelop their shocked captors.",
    historicalContext: "Inspired by Greco-Egyptian solar mythologies, representing ultimate tactical resilience where defeat is transformed into sudden, incandescent victory."
  },
  {
    id: "feigned_retreat",
    name: "Feigned Retreat",
    type: "Ground",
    era: "Medieval",
    shortDescription: "A false flight to draw the enemy from their strong position, leading them into an ambush.",
    detailedDescription: "The Feigned Retreat is the art of weaponizing the enemy's own aggression and overconfidence. By breaking formation and appearing to flee in panic, the commander seduces the opponent into abandoning their disciplined lines to pursue an easy slaughter. Mystically, it is the creation of a vacuum that draws the enemy's scattered energy forward, only to snap shut upon them once they have overextended beyond their safe boundaries. The illusion of weakness becomes the ultimate snare.",
    historicalContext: "Crucially employed by William the Conqueror at the Battle of Hastings (1066) to pull King Harold's Saxon shield wall down from Senlac Hill."
  },
  {
    id: "shield_wall",
    name: "Shield Wall",
    type: "Ground",
    era: "Ancient",
    shortDescription: "An interlocking barrier of shields forming an impenetrable defensive phalanx.",
    detailedDescription: "The Shield Wall embodies the supreme collective defense. When soldiers interlock their shields, they surrender their individual ego to become a single, unified fortress of iron and wood. Mystically, it represents the absolute grounding of energy, turning the battlefield's chaotic violence against itself. The line holds not by the strength of one, but by the interconnected will of all, presenting an immovable object to the enemy's unstoppable force.",
    historicalContext: "A hallmark tactic of ancient Greek hoplites, Roman legions, and famously used by Anglo-Saxon armies and Vikings to endure massive assaults."
  },
  {
    id: "flanking",
    name: "Flanking Maneuver",
    type: "Ground",
    era: "Ancient",
    shortDescription: "To strike where the opponent is blind, turning the shadow of their awareness into a blade.",
    detailedDescription: "The Flanking Maneuver transcends mere physical repositioning; it is the mastery of perspective and the exploitation of the void. By moving outside the enemy's field of concentrated energy, the commander creates a sudden imbalance in the universal flow. The attack strikes from the periphery, dissolving the opponent's fortified center without directly challenging it. It teaches that strength applied against the unseen edge is multiplied tenfold.",
    historicalContext: "Famously utilized by Hannibal at the Battle of Cannae, where the Roman center was allowed to advance while Carthaginian forces enveloped them from the sides, creating a perfect trap of misdirected momentum."
  },
  {
    id: "cantabrian_circle",
    name: "Cantabrian Circle",
    type: "Ground",
    era: "Ancient",
    shortDescription: "A rotating wheel of horse archers raining continuous arrows without breaking momentum.",
    detailedDescription: "The Cantabrian Circle is a continuous rotating wheel where cavalry archers ride in a circle, loosing arrows at the closest point to the enemy line before riding back into the rotation. Mystically, it is the weaponization of the eternal wheel, unleashing a relentless rain of missile attacks while denying the enemy a stationary target.",
    historicalContext: "Utilized by Iberian Cantabri tribes and adopted by Roman auxiliary cavalry to harass rigid enemy infantry formations."
  },
  {
    id: "schiltron",
    name: "Schiltron Hedgehog",
    type: "Ground",
    era: "Medieval",
    shortDescription: "A circular hedgehog of 12-foot pikes repelling heavy armored cavalry charges.",
    detailedDescription: "The Schiltron is the defensive sphere. When threatened by knightly charges, spearmen form concentric rings with pikes pointing outward in every direction. It denies the enemy any exposed flank or rear, turning cavalry momentum into self-destruction.",
    historicalContext: "Decisively deployed by William Wallace and Robert the Bruce at Stirling Bridge and Bannockburn to break heavy English cavalry."
  },
  {
    id: "tercio_square",
    name: "Tercio Formation",
    type: "Ground",
    era: "Early Modern",
    shortDescription: "Combined-arms square of pikemen protecting musketeers delivering deadly volley fire.",
    detailedDescription: "The Tercio was the pinnacle of early modern military revolution. Musketeers delivered volley fire while taking refuge inside an impenetrable square of 18-foot pikes whenever enemy cavalry charged. It represents the perfect harmony between missile destruction and heavy melee defense.",
    historicalContext: "Pioneered by Spanish commander Gonzalo Fernández de Córdoba, dominating European warfare throughout the 16th and early 17th centuries."
  },
  {
    id: "line_volley",
    name: "Line Infantry Volley",
    type: "Ground",
    era: "Early Modern",
    shortDescription: "Disciplined multi-rank volley fire creating an unbroken sheet of lead.",
    detailedDescription: "Linear infantry tactics arranged soldiers in two or three ranks to maximize firepower. By cycling fire between ranks, a regiment maintained continuous lead volleys, shattering enemy morale before a bayonet charge.",
    historicalContext: "The hallmark tactical doctrine of 18th-century armies during the Seven Years' War and Napoleonic Era."
  },
  {
    id: "pincer",
    name: "Pincer Movement",
    type: "Ground",
    era: "Modern",
    shortDescription: "The dual serpents closing their jaws; two opposing forces converging to crush the single point.",
    detailedDescription: "The Pincer Movement embodies the cosmic principle of duality overcoming unity. By splitting the attacking force into two synchronized arms, the commander forces the enemy to divide their consciousness and resources. It is the mystical act of surrounding the singular ego with the overwhelming forces of duality, ensuring that any outward thrust by the enemy is met with inward, crushing pressure from the flanks.",
    historicalContext: "The Soviet Army's operation at Stalingrad against the German Sixth Army stands as a monumental double envelopment, trapping a vast force within a narrowing ring of steel."
  },
  {
    id: "blitzkrieg",
    name: "Lightning War (Blitzkrieg)",
    type: "Ground",
    era: "Modern",
    shortDescription: "A storm of overwhelming speed and force, shattering the enemy's mind before their body can react.",
    detailedDescription: "Lightning War relies on the elemental power of sudden, unyielding momentum. It bypasses strongpoints to attack the nervous system of the enemy's command, paralyzing their ability to respond. Mystically, it is the invocation of pure shock—a sudden influx of chaotic energy that shatters rigid structures and leaves the opponent in a state of suspended terror, incapable of coherent defense.",
    historicalContext: "A doctrine emphasizing mobility, speed, and concentrated force, utilized extensively by Germany in the early stages of World War II to quickly defeat opponents before they could mobilize."
  },
  {
    id: "crossing_the_t",
    name: "Crossing the T",
    type: "Naval",
    era: "Modern",
    shortDescription: "Aligning the broadside of one's power against the narrow tip of the adversary's advance.",
    detailedDescription: "In the oceanic expanse, Crossing the T represents the alignment of ultimate potential against ultimate restriction. It is the tactical manifestation of maximizing one's own energetic output while minimizing the opponent's. By bringing the full weight of broadside fire upon a single advancing point, the commander channels a wave of destruction that cannot be answered, silencing the oncoming storm before it can unfurl.",
    historicalContext: "A classic naval maneuver, decisively executed by Admiral Togo at the Battle of Tsushima in 1905, allowing the Japanese fleet to unleash devastating broadsides against the Russian fleet's advancing column."
  },
  {
    id: "wolfpack",
    name: "Wolfpack Tactics",
    type: "Naval",
    era: "Modern",
    shortDescription: "The silent hunters gathering in the dark, swarming the leviathan from all directions.",
    detailedDescription: "Wolfpack Tactics harness the chaotic, decentralized energy of the swarm. It relies on stealth, communication, and simultaneous convergence. Mystically, it represents the dissolution of the solitary hero by the collective will of the many. The target is overwhelmed not by a single crushing blow, but by a thousand unseen cuts emerging from the watery abyss.",
    historicalContext: "Pioneered by Karl Dönitz during the Battle of the Atlantic, where German U-boats would coordinate attacks on Allied convoys, overwhelming escorts through coordinated, multi-directional strikes."
  },
  {
    id: "boom_and_zoom",
    name: "Boom and Zoom",
    type: "Aerial",
    era: "Modern",
    shortDescription: "The falcon's stoop; converting the potential energy of the heavens into the kinetic strike of judgment.",
    detailedDescription: "Boom and Zoom is the pure expression of celestial advantage. The attacker utilizes altitude—the high ground of the sky—to build overwhelming speed, striking the unaware target below, and using the remaining momentum to ascend back into the safety of the heavens. It is the ultimate manifestation of striking from a higher plane of existence, untouchable and supreme.",
    historicalContext: "A foundational tactic for fighter aircraft with superior energy retention and dive speed, effectively used by aircraft like the P-51 Mustang or Fw 190 during WWII to dictate the terms of engagement."
  },
  {
    id: "thach_weave",
    name: "Thach Weave",
    type: "Aerial",
    era: "Modern",
    shortDescription: "The intertwining dance of two falcons, covering each other's blind spots in a spiral of mutual protection.",
    detailedDescription: "The Thach Weave is the mystical geometry of partnership and mutual defense. When an enemy threatens one, the pair crisscrosses their flight paths, forcing the pursuer into the line of fire of the wingman. It transforms vulnerability into a deadly trap, symbolizing how intertwined souls can turn their individual weaknesses into an impenetrable, reciprocal shield.",
    historicalContext: "Invented by John S. Thach during WWII to allow slower, less maneuverable American Wildcats to counter the superior performance of the Japanese Zero by relying on coordinated team tactics."
  }
];

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

const ERA_RANK: Record<EraType, number> = {
  "Mythological": 0,
  "Ancient": 1,
  "Medieval": 2,
  "Early Modern": 3,
  "Modern": 4
};

const ERA_DESCRIPTIONS: Record<EraType, { title: string; eraText: string; context: string; icon: string }> = {
  "Mythological": {
    title: "Mythological & Heroic Era (Prehistoric / Epics)",
    eraText: "Heroic Duels, Divine Stratagems & Sacred Infiltrations",
    context: "Tactics of the mythic age combined divine intervention, heroic champions, deception stratagems like the Trojan Horse, and mythical legions bound by sacred oaths.",
    icon: "⚡"
  },
  "Ancient": {
    title: "Ancient Warfare Era (c. 3000 BCE – 500 CE)",
    eraText: "Phalanx, Shield Walls & Envelopment",
    context: "Ancient military doctrine prioritized massed infantry cohesion, heavy shield formations, and early cavalry envelopment. Victory relied on maintaining unbreakable lines and forcing moral collapse in close-quarters combat.",
    icon: "🏛️"
  },
  "Medieval": {
    title: "Medieval Warfare Era (c. 500 CE – 1500 CE)",
    eraText: "Chivalric Shock, Feigned Retreats & Fortifications",
    context: "Medieval combat blended heavy armored cavalry shock charges with tactical ruses like feigned retreats and impenetrable schiltrons. Fortified strongholds and terrain mastery defined long campaigns of attrition.",
    icon: "🏰"
  },
  "Early Modern": {
    title: "Early Modern Era (c. 1500 CE – 1800 CE)",
    eraText: "Pike-and-Shot, Line Volleys & Naval Broadsides",
    context: "The gunpowder revolution reshaped battlefields with combined-arms Tercios and linear volley fire. Naval doctrine evolved into line-of-battle fleet engagements armed with massive cannon broadsides.",
    icon: "📜"
  },
  "Modern": {
    title: "Modern Warfare Era (c. 1800 CE – Present)",
    eraText: "Mechanized Speed, Air Supremacy & Combined Arms",
    context: "Modern tactics harness industrial mobility, radio communication, air supremacy, and submarine wolfpacks. Operations center on rapid penetration, double envelopments, and vertical energy combat.",
    icon: "🚀"
  }
};

const ALL_TYPES: TacticType[] = ["Ground", "Naval", "Aerial", "Mythological"];

const TYPE_DESCRIPTIONS: Record<TacticType, { label: string; icon: string }> = {
  "Ground": { label: "Ground Domain", icon: "🛡️" },
  "Naval": { label: "Naval Domain", icon: "⚓" },
  "Aerial": { label: "Aerial Domain", icon: "🦅" },
  "Mythological": { label: "Mythological Domain", icon: "⚡" }
};

interface TypeMultiSelectProps {
  selectedTypes: TacticType[];
  onChange: (types: TacticType[]) => void;
  typeCounts: Record<string, number>;
}

function TypeMultiSelect({ selectedTypes, onChange, typeCounts }: TypeMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAllSelected = selectedTypes.length === 0 || selectedTypes.length === ALL_TYPES.length;

  const toggleType = (type: TacticType) => {
    if (isAllSelected) {
      onChange([type]);
    } else {
      if (selectedTypes.includes(type)) {
        const next = selectedTypes.filter(t => t !== type);
        onChange(next);
      } else {
        const next = [...selectedTypes, type];
        onChange(next.length === ALL_TYPES.length ? [] : next);
      }
    }
  };

  const getDisplayText = () => {
    if (isAllSelected) return "All Domains (Universal) 🌐";
    if (selectedTypes.length === 1) return `${TYPE_DESCRIPTIONS[selectedTypes[0]]?.icon || ''} ${selectedTypes[0]} Domain`;
    return `${selectedTypes.length} Domains Selected 🌐`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-neutral-400 mb-1 font-mono uppercase tracking-wider">
        Warfare Domain (Multi-Select)
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 rounded px-3 py-2 text-neutral-200 text-left text-sm transition-colors flex items-center justify-between cursor-pointer focus:outline-none focus:border-amber-500 min-h-[38px]"
      >
        <span className="truncate">{getDisplayText()}</span>
        <span className="text-xs text-amber-500 font-mono ml-2 shrink-0">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-950/95 border border-amber-900/60 rounded-lg shadow-2xl p-3 space-y-2 text-sm backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs font-mono">
            <span className="text-amber-400 uppercase tracking-wider font-bold">Warfare Categories & Domains</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-neutral-400 hover:text-amber-400 underline cursor-pointer"
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {ALL_TYPES.map((type) => {
              const isChecked = isAllSelected || selectedTypes.includes(type);
              const info = TYPE_DESCRIPTIONS[type];
              const count = typeCounts[type] || 0;

              return (
                <div
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border select-none ${
                    isChecked
                      ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                      : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-amber-500 w-4 h-4 rounded cursor-pointer shrink-0 pointer-events-none"
                    />
                    <span className="text-base shrink-0">{info?.icon || '🌐'}</span>
                    <span className="font-serif text-xs font-medium truncate">{type}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-amber-400/80 shrink-0">
                    {count} tactic{count !== 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {!isAllSelected && selectedTypes.length > 0 && (
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs">
              <span className="text-neutral-500 font-mono text-[11px]">
                Active: {selectedTypes.length} domain{selectedTypes.length > 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-amber-500 hover:text-amber-400 font-mono text-[11px] underline cursor-pointer"
              >
                Reset to All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ALL_ERAS: EraType[] = ["Mythological", "Ancient", "Medieval", "Early Modern", "Modern"];

interface EraMultiSelectProps {
  selectedEras: EraType[];
  onChange: (eras: EraType[]) => void;
  eraCounts: Record<string, number>;
}

function EraMultiSelect({ selectedEras, onChange, eraCounts }: EraMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAllSelected = selectedEras.length === 0 || selectedEras.length === ALL_ERAS.length;

  const toggleEra = (era: EraType) => {
    if (isAllSelected) {
      onChange([era]);
    } else {
      if (selectedEras.includes(era)) {
        const next = selectedEras.filter(e => e !== era);
        onChange(next);
      } else {
        const next = [...selectedEras, era];
        onChange(next.length === ALL_ERAS.length ? [] : next);
      }
    }
  };

  const getDisplayText = () => {
    if (isAllSelected) return "All Eras (Universal) ⏳";
    if (selectedEras.length === 1) return `${ERA_DESCRIPTIONS[selectedEras[0]]?.icon || ''} ${selectedEras[0]} Era`;
    return `${selectedEras.length} Eras Selected ⏳`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-neutral-400 mb-1 font-mono uppercase tracking-wider">
        Filter Era (Multi-Select)
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 rounded px-3 py-2 text-neutral-200 text-left text-sm transition-colors flex items-center justify-between cursor-pointer focus:outline-none focus:border-amber-500 min-h-[38px]"
      >
        <span className="truncate">{getDisplayText()}</span>
        <span className="text-xs text-amber-500 font-mono ml-2 shrink-0">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-950/95 border border-amber-900/60 rounded-lg shadow-2xl p-3 space-y-2 text-sm backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs font-mono">
            <span className="text-amber-400 uppercase tracking-wider font-bold">Historical & Mythological Eras</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-neutral-400 hover:text-amber-400 underline cursor-pointer"
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {ALL_ERAS.map((era) => {
              const isChecked = isAllSelected || selectedEras.includes(era);
              const info = ERA_DESCRIPTIONS[era];
              const count = eraCounts[era] || 0;

              return (
                <div
                  key={era}
                  onClick={() => toggleEra(era)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border select-none ${
                    isChecked
                      ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                      : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // handled by div click
                      className="accent-amber-500 w-4 h-4 rounded cursor-pointer shrink-0 pointer-events-none"
                    />
                    <span className="text-base shrink-0">{info?.icon || '⏳'}</span>
                    <span className="font-serif text-xs font-medium truncate">{era} Era</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-amber-400/80 shrink-0">
                    {count} tactic{count !== 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {!isAllSelected && selectedEras.length > 0 && (
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs">
              <span className="text-neutral-500 font-mono text-[11px]">
                Active: {selectedEras.length} era{selectedEras.length > 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-amber-500 hover:text-amber-400 font-mono text-[11px] underline cursor-pointer"
              >
                Reset to All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BattleTactics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<TacticType[]>([]);
  const [selectedEras, setSelectedEras] = useState<EraType[]>([]);
  const [sortByEra, setSortByEra] = useState<"default" | "era-asc" | "era-desc" | "name">("era-asc");
  const [selectedTactic, setSelectedTactic] = useState<Tactic | null>(null);
  const [simulationResult, setSimulationResult] = useState<{roll: number, outcome: string, type: string} | null>(null);
  const [tacticalDeck, setTacticalDeck] = useState<Tactic[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lineSegments, setLineSegments] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Calculate counts for multi-select filter lists
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_TYPES.forEach(type => {
      counts[type] = TACTICS.filter(t => t.type === type).length;
    });
    return counts;
  }, []);

  const eraCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_ERAS.forEach(era => {
      counts[era] = TACTICS.filter(t => t.era === era).length;
    });
    return counts;
  }, []);

  const filteredTactics = useMemo(() => {
    let result = TACTICS.filter(tactic => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.length === ALL_TYPES.length || selectedTypes.includes(tactic.type);
      const matchesEra = selectedEras.length === 0 || selectedEras.length === ALL_ERAS.length || selectedEras.includes(tactic.era);
      const matchesSearch = tactic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tactic.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tactic.historicalContext.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesEra && matchesSearch;
    });

    if (sortByEra === "era-asc") {
      result = [...result].sort((a, b) => (ERA_RANK[a.era] || 0) - (ERA_RANK[b.era] || 0));
    } else if (sortByEra === "era-desc") {
      result = [...result].sort((a, b) => (ERA_RANK[b.era] || 0) - (ERA_RANK[a.era] || 0));
    } else if (sortByEra === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchTerm, selectedTypes, selectedEras, sortByEra]);

  const updateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];

    for (let i = 0; i < tacticalDeck.length - 1; i++) {
      const el1 = cardsRef.current.get(tacticalDeck[i].id);
      const el2 = cardsRef.current.get(tacticalDeck[i + 1].id);
      if (el1 && el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        
        segments.push({
          x1: Math.round(rect1.left + rect1.width / 2 - containerRect.left),
          y1: Math.round(rect1.top + rect1.height / 2 - containerRect.top),
          x2: Math.round(rect2.left + rect2.width / 2 - containerRect.left),
          y2: Math.round(rect2.top + rect2.height / 2 - containerRect.top),
        });
      }
    }
    setLineSegments(prev => {
      if (JSON.stringify(prev) === JSON.stringify(segments)) return prev;
      return segments;
    });
  };

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [tacticalDeck, filteredTactics]);

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const width = 160;
    const height = 160;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Prepare data based on filteredTactics
    const counts = {
      Ground: filteredTactics.filter(t => t.type === 'Ground').length,
      Naval: filteredTactics.filter(t => t.type === 'Naval').length,
      Aerial: filteredTactics.filter(t => t.type === 'Aerial').length,
      Mythological: filteredTactics.filter(t => t.type === 'Mythological').length,
    };

    const color = d3.scaleOrdinal()
      .domain(["Ground", "Naval", "Aerial", "Mythological"])
      .range(["#8B5A2B", "#1C39BB", "#4A90E2", "#9333EA"]);

    const pie = d3.pie<[string, number]>()
      .value(d => d[1])
      .sort(null);
      
    const dataReady = pie(Object.entries(counts));

    const arc = d3.arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const isAllTypes = selectedTypes.length === 0 || selectedTypes.length === ALL_TYPES.length;

    svg
      .selectAll('allSlices')
      .data(dataReady)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data[0]) as string)
      .attr("stroke", "#1a1a1a")
      .style("stroke-width", "2px")
      .style("opacity", d => (isAllTypes || selectedTypes.includes(d.data[0] as TacticType)) ? 1 : 0.2);
      
  }, [selectedTypes, filteredTactics]);

  const activeErasForBanners = useMemo(() => {
    if (selectedEras.length === 0) return ALL_ERAS;
    return selectedEras;
  }, [selectedEras]);

  return (
    <div ref={containerRef} className="battle-tactics-container relative w-full max-w-7xl mx-auto my-8 p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl">

      {/* SVG Overlay for Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(245, 158, 11, 0.5)" />
          </marker>
        </defs>
        {lineSegments.map((seg, i) => (
          <line
            key={`line-${i}-${seg.x1}-${seg.y1}-${seg.x2}-${seg.y2}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="rgba(245, 158, 11, 0.5)"
            strokeWidth="2"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
            className="animate-pulse"
          />
        ))}
      </svg>

      <h2 className="text-2xl font-serif text-amber-500 mb-6 flex items-center gap-3">
        <span>⚔️</span> Strategic Arcana: Battle Tactics
      </h2>

      <div className="flex flex-col md:flex-row gap-8 mb-6">
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1 font-mono uppercase tracking-wider">Search Tactics</label>
            <input 
              type="text" 
              placeholder="Search by name, description, or historical context..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Domain Multi-Select Dropdown */}
            <TypeMultiSelect
              selectedTypes={selectedTypes}
              onChange={setSelectedTypes}
              typeCounts={typeCounts}
            />

            {/* Era Multi-Select Dropdown */}
            <EraMultiSelect
              selectedEras={selectedEras}
              onChange={setSelectedEras}
              eraCounts={eraCounts}
            />

            <div>
              <label className="block text-sm text-neutral-400 mb-1 font-mono uppercase tracking-wider">Sort Maneuvers</label>
              <select 
                value={sortByEra} 
                onChange={(e) => setSortByEra(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors text-sm min-h-[38px]"
              >
                <option value="era-asc">Era: Chronological (Mythic → Modern) 📜</option>
                <option value="era-desc">Era: Reverse Chronological (Modern → Mythic) 🚀</option>
                <option value="name">Alphabetical (Name A-Z) 🔤</option>
                <option value="default">Default Order ⚔️</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills (Domains and Eras) */}
          {((selectedTypes.length > 0 && selectedTypes.length < ALL_TYPES.length) || (selectedEras.length > 0 && selectedEras.length < ALL_ERAS.length)) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-neutral-400 font-mono">Active Filters:</span>
              
              {/* Domain Pills */}
              {selectedTypes.length > 0 && selectedTypes.length < ALL_TYPES.length && selectedTypes.map(type => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/40 border border-purple-500/40 text-purple-300 rounded-full text-xs font-serif shadow-sm"
                >
                  <span>{TYPE_DESCRIPTIONS[type]?.icon}</span>
                  <span>{type} Domain</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTypes(prev => prev.filter(t => t !== type))}
                    className="text-purple-400 hover:text-purple-200 ml-1 font-bold cursor-pointer"
                    title="Remove domain filter"
                  >
                    ×
                  </button>
                </span>
              ))}

              {/* Era Pills */}
              {selectedEras.length > 0 && selectedEras.length < ALL_ERAS.length && selectedEras.map(era => (
                <span
                  key={era}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-500/40 text-amber-300 rounded-full text-xs font-serif shadow-sm"
                >
                  <span>{ERA_DESCRIPTIONS[era]?.icon}</span>
                  <span>{era} Era</span>
                  <button
                    type="button"
                    onClick={() => setSelectedEras(prev => prev.filter(e => e !== era))}
                    className="text-amber-400 hover:text-amber-200 ml-1 font-bold cursor-pointer"
                    title="Remove era filter"
                  >
                    ×
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={() => { setSelectedTypes([]); setSelectedEras([]); }}
                className="text-xs text-amber-500/80 hover:text-amber-400 underline font-mono cursor-pointer ml-1"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center bg-neutral-950 p-4 rounded-xl border border-neutral-800 w-full md:w-auto shrink-0">
          <h3 className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-2">Tactical Distribution</h3>
          <div ref={chartRef} className="w-[160px] h-[160px]" />
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs font-mono">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#8B5A2B]"></span>Ground</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#1C39BB]"></span>Naval</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#4A90E2]"></span>Aerial</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#9333EA]"></span>Mythological</span>
          </div>
        </div>
      </div>

      {/* Historical & Mythological Era Context Banner(s) */}
      {selectedEras.length > 0 && selectedEras.length < ALL_ERAS.length && (
        <div className="space-y-3 mb-6">
          {activeErasForBanners.map(eraKey => {
            const info = ERA_DESCRIPTIONS[eraKey];
            if (!info) return null;
            return (
              <motion.div 
                key={eraKey}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                <div className="text-3xl p-2 bg-amber-950/40 rounded-lg border border-amber-900/50 shrink-0">
                  {info.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-serif font-bold text-amber-400">{info.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-900/40 text-amber-300 rounded border border-amber-800/60 uppercase">
                      {info.eraText}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {info.context}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div 
          key={`${selectedTypes.join(',')}-${selectedEras.join(',')}-${searchTerm}`}
          variants={cardContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredTactics.map((tactic) => {
            const inDeckIndex = tacticalDeck.findIndex(t => t.id === tactic.id);
            const isInDeck = inDeckIndex !== -1;
            return (
            <motion.div 
              key={tactic.id} 
              variants={cardItemVariants}
              ref={el => {
                if (el) cardsRef.current.set(tactic.id, el as unknown as HTMLDivElement);
                else cardsRef.current.delete(tactic.id);
              }}
              className={`bg-neutral-950 border p-5 rounded-lg cursor-pointer transition-colors group flex flex-col h-full relative z-10 ${isInDeck ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-neutral-800 hover:border-amber-500/50'}`}
              onClick={() => { setSelectedTactic(tactic); setSimulationResult(null); }}
            >
              {isInDeck && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-neutral-900 z-20">
                  {inDeckIndex + 1}
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-serif text-neutral-200 group-hover:text-amber-400 transition-colors pr-2 leading-tight">{tactic.name}</h3>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-1 bg-neutral-900 text-neutral-500 rounded border border-neutral-800 whitespace-nowrap">
                    {tactic.type}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-neutral-900 text-amber-500/70 rounded border border-neutral-800 whitespace-nowrap">
                    {tactic.era}
                  </span>
                </div>
              </div>
              <p className="text-sm text-neutral-400 italic flex-grow">"{tactic.shortDescription}"</p>
              <div className="mt-4 pt-3 border-t border-neutral-800/50 flex justify-end">
                <span className="text-xs text-amber-600/70 group-hover:text-amber-500 transition-colors font-mono uppercase flex items-center gap-1">
                  View Secrets <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </motion.div>
          )})}
          {filteredTactics.length === 0 && (
            <motion.div 
              variants={cardItemVariants}
              className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col items-center justify-center gap-4"
            >
              <span className="text-neutral-600 font-serif italic">
                No tactics found matching your query in the selected domains or eras.
              </span>
              {selectedEras.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedEras([])}
                  className="px-4 py-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-900/50 rounded transition-colors font-mono uppercase text-xs tracking-wider cursor-pointer"
                >
                  Reset Era Filters
                </button>
              )}
              {searchTerm && (
                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(searchTerm + ' military tactics')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-900/50 rounded transition-colors font-mono uppercase text-xs tracking-wider"
                >
                  Search Google for "{searchTerm}"
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <StrategicOracle />

      {tacticalDeck.length > 0 && (
        <div className="mt-12 bg-neutral-950 border border-amber-900/40 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif text-amber-500 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Tactical Deck Preview
            </h3>
            <button
              onClick={() => {
                const combinedContent = tacticalDeck.map(t => 
                  `## ${t.name}\n\n### Symbology\n${t.detailedDescription}\n\n### Historical Context\n${t.historicalContext}`
                ).join('\n\n---\n\n');

                const event = new CustomEvent('add_custom_mystical_note', {
                  detail: {
                    title: `Tactical Deck (${tacticalDeck.length} Maneuvers)`,
                    content: combinedContent,
                    school: 'Military School of Thought 🎖️🪖',
                    color: 'bg-neutral-900 border-neutral-700'
                  }
                });
                window.dispatchEvent(event);
                setTacticalDeck([]);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-900/50 rounded transition-colors font-mono uppercase text-sm tracking-wider cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Commit Deck to Grimoire
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tacticalDeck.map((tactic, index) => (
              <div key={`${tactic.id}-${index}`} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg relative flex flex-col justify-between">
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-amber-400 font-medium text-sm pl-2">{tactic.name}</h4>
                    <button 
                      onClick={() => setTacticalDeck(deck => deck.filter(t => t.id !== tactic.id))}
                      className="text-neutral-500 hover:text-red-400 text-xs px-1"
                      title="Remove from deck"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">{tactic.shortDescription}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-500 flex justify-between">
                  <span>{tactic.type}</span>
                  <span>{tactic.era}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Tactic Secrets */}
      {selectedTactic && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-950 border border-amber-900/50 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            <button 
              onClick={() => { setSelectedTactic(null); setSimulationResult(null); }}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono uppercase px-2 py-1 bg-amber-950/50 text-amber-400 rounded border border-amber-900/50">
                {selectedTactic.type} Domain
              </span>
              <span className="text-xs font-mono uppercase px-2 py-1 bg-neutral-900 text-amber-500/80 rounded border border-neutral-800">
                {selectedTactic.era} Era
              </span>
            </div>

            <h3 className="text-2xl font-serif text-amber-500 mb-4">{selectedTactic.name}</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-1">Tactical Symbology</h4>
                <p className="text-neutral-300 font-serif leading-relaxed text-sm bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                  {selectedTactic.detailedDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-1">Historical Context</h4>
                <p className="text-neutral-400 font-sans text-sm bg-neutral-900/30 p-4 rounded-lg border border-neutral-800/50">
                  {selectedTactic.historicalContext}
                </p>
              </div>

              {/* Simulation Sandbox */}
              <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800">
                <h4 className="text-xs text-amber-500 font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span>🎲</span> Tactical Simulation Sandbox
                </h4>
                <p className="text-xs text-neutral-400 mb-4">
                  Simulate executing this maneuver under adversarial conditions. The die roll dictates tactical success and cosmic resonance.
                </p>
                
                <button
                  onClick={() => {
                    const roll = Math.floor(Math.random() * 20) + 1;
                    let outcome = "";
                    if (roll === 20) outcome = "CRITICAL VICTORY: Perfect tactical synchronization! The enemy lines shatter entirely.";
                    else if (roll >= 15) outcome = "TACTICAL SUCCESS: Maneuver executed as planned. Superior positioning achieved.";
                    else if (roll >= 8) outcome = "PARTIAL SUCCESS: Objectives met, but sustained moderate resistance and attrition.";
                    else if (roll >= 2) outcome = "TACTICAL FAILURE: Enemy anticipated the maneuver. Forced to withdraw.";
                    else outcome = "CRITICAL BLUNDER: Catastrophic miscalculation! Formation collapsed into chaos.";
                    
                    setSimulationResult({ roll, outcome, type: selectedTactic.type });
                  }}
                  className="w-full py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-900/50 rounded font-mono uppercase text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Execute Simulation Roll (d20)
                </button>

                {simulationResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-neutral-950 rounded border border-neutral-800 text-xs"
                  >
                    <div className="flex justify-between items-center mb-1 font-mono">
                      <span className="text-neutral-500">Roll Result:</span>
                      <span className="text-amber-400 font-bold text-sm">{simulationResult.roll} / 20</span>
                    </div>
                    <p className="text-neutral-300 italic">{simulationResult.outcome}</p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center">
              <button
                onClick={() => {
                  const exists = tacticalDeck.some(t => t.id === selectedTactic.id);
                  if (exists) {
                    setTacticalDeck(deck => deck.filter(t => t.id !== selectedTactic.id));
                  } else {
                    setTacticalDeck(deck => [...deck, selectedTactic]);
                  }
                }}
                className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  tacticalDeck.some(t => t.id === selectedTactic.id)
                    ? 'bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40'
                    : 'bg-amber-950/40 text-amber-400 border border-amber-900/50 hover:bg-amber-900/40'
                }`}
              >
                {tacticalDeck.some(t => t.id === selectedTactic.id) ? 'Remove from Tactical Deck' : 'Add to Tactical Deck'}
              </button>

              <button 
                onClick={() => { setSelectedTactic(null); setSimulationResult(null); }}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
