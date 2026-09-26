import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  FlaskConical,
  BookOpen,
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Layers,
  Search,
  Globe,
  Sliders,
  Flame,
  Feather,
  Sun,
  Moon,
  Star,
  Activity,
  ArrowRight,
  Shield,
  Eye,
  Clock,
  RefreshCw,
  Award,
  Zap,
  Bookmark,
  FileText,
  Copy,
  Check,
  Tag,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info,
  Ban,
  XCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import {
  ManifestationExperiment,
  ManifestationText,
  ManifestationCategory,
  ManifestationStatus,
  SynchronicityEvidence,
  ManifestationStep,
  ElementalBalance,
  AlignmentAnalysisResponse
} from '../types/manifestation';
import {
  CANONICAL_MANIFESTATION_TEXTS,
  MANIFESTATION_SOLFEGGIO_FREQUENCIES,
  MANIFESTATION_PHASES_INFO
} from '../data/manifestationLibraryData';

export interface ThemeConfig {
  id: string;
  name: string;
  bgPage: string;
  bgCard: string;
  textPrimary: string;
  textAccent: string;
  borderAccent: string;
  inputFocus: string;
}

interface ManifestationLaboratoryProps {
  activeTheme: ThemeConfig;
  onOpenConsultation?: (question: string, school: string) => void;
}

const CATEGORY_LABELS: Record<ManifestationCategory, { label: string; icon: string; color: string }> = {
  wealth_abundance: { label: 'Gold & Material Opulence', icon: '🪙', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' },
  health_vitality: { label: 'Physical Vitality & Somatic DNA', icon: '🌿', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
  wisdom_scholarship: { label: 'Esoteric Breakthrough & Scrolls', icon: '📜', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' },
  creative_artefact: { label: 'Master Invention & Artefact', icon: '⚡', color: 'text-violet-400 border-violet-500/40 bg-violet-950/30' },
  sacred_sanctuary: { label: 'Physical Haven & Sanctuary', icon: '🏛️', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' },
  spiritual_authority: { label: 'Kingdom Jurisdiction & Sovereignty', icon: '👑', color: 'text-yellow-400 border-yellow-500/40 bg-yellow-950/30' },
  relational_harmony: { label: 'Harmonic Alliance & Allies', icon: '🤝', color: 'text-pink-400 border-pink-500/40 bg-pink-950/30' }
};

const DEFAULT_EXPERIMENTS: ManifestationExperiment[] = [
  {
    id: 'exp-alchemical-gold-seed',
    title: 'Precipitation of Golden Abundance & Financial Sovereignty',
    category: 'wealth_abundance',
    targetDescription: 'Tangible physical influx of $10,000+ debt-free financial liquidity, sovereign income stream, and unbreachable material stability under Divine Order.',
    tangibleMetrics: '1. Bank account balance verified at +$10,000. 2. Signed independent contract or unexpected sovereign grant. 3. Physical gold coin or asset acquired in hand.',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    densityScore: 58,
    status: 'alchemical_transmutation',
    elementalBalance: { ignis: 8, aer: 9, aqua: 7, terra: 6, quintessence: 8 },
    solfeggioHz: 528,
    intentionDecree: 'BY THE LIVING LAW OF DIVINE SUPPLY: The formless substance now precipitates into physical gold and sovereign currency in my hands. I accept this abundance under grace with gratitude.',
    sigilNotes: 'Solar Hexagram with the Golden Seed glyph at the center, charged during planetary hour of the Sun.',
    physicalAnchor: 'A clean brass/gold token kept on the desk altar, touched every morning while declaring gratitude.',
    steps: [
      { id: 's1', phase: 1, title: 'Draft Precise Blueprint & Specific Amount', description: 'Write down the exact numerical figure, currency, and intended kingdom allocation with zero ambiguity.', completed: true, category: 'mental' },
      { id: 's2', phase: 1, title: 'Neutralize Scarcity Logic', description: 'Recognize that wealth is an infinite mental substance, not a zero-sum physical pie.', completed: true, category: 'mental' },
      { id: 's3', phase: 2, title: 'SATS Sensory Imprint', description: 'Nightly imaginal visualization: Feeling the weight of the physical currency in hand before falling asleep.', completed: true, category: 'emotional' },
      { id: 's4', phase: 2, title: 'Solfeggio 528Hz Meditation', description: '15-minute cellular tuning into 528Hz Miracle frequency to harmonize heart-brain coherence.', completed: true, category: 'emotional' },
      { id: 's5', phase: 3, title: 'Issue Logos Spoken Decree', description: 'Speak the authoritative present-tense declaration aloud at sunrise and sunset.', completed: true, category: 'ritual' },
      { id: 's6', phase: 3, title: 'Consecrate Sigil of Supply', description: 'Draw the Golden Seal on parchment and anoint with sacred frankincense/oil.', completed: false, category: 'ritual' },
      { id: 's7', phase: 4, title: 'Physical Anchor Object Placement', description: 'Place the consecrated gold/brass coin on the primary ledger or workspace.', completed: false, category: 'physical' },
      { id: 's8', phase: 4, title: 'Mundane Inspired Action', description: 'Send out professional proposals, invoice releases, or launch the sovereign offering.', completed: false, category: 'physical' }
    ],
    evidenceLog: [
      { id: 'ev1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], title: 'Recurring 777 & Golden Light Dream', description: 'Dreamt of holding molten gold that solidified into glowing coins upon speaking a single Hebrew letter.', signType: 'dream', impactScore: 8 },
      { id: 'ev2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], title: 'Unexpected Royalty Rebate Check Received', description: 'A surprise refund of $450 arrived in the mail without prior notification.', signType: 'tangible_gain', impactScore: 9 }
    ],
    journalNotes: 'The energy feels dense and calm. Moving from anxious wishing into the steady conviction of established fact. The 528Hz frequency grounds the solar plexus.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const ManifestationLaboratory: React.FC<ManifestationLaboratoryProps> = ({
  activeTheme,
  onOpenConsultation
}) => {
  // Navigation tabs within Laboratory
  const [labTab, setLabTab] = useState<'crucible' | 'library' | 'alignment' | 'logos' | 'new_experiment'>('crucible');

  // Persistence of Experiments
  const [experiments, setExperiments] = useState<ManifestationExperiment[]>(() => {
    try {
      const saved = localStorage.getItem('manifestation_experiments');
      return saved ? JSON.parse(saved) : DEFAULT_EXPERIMENTS;
    } catch (e) {
      return DEFAULT_EXPERIMENTS;
    }
  });

  const [activeExpId, setActiveExpId] = useState<string>(() => {
    return experiments[0]?.id || '';
  });

  useEffect(() => {
    try {
      localStorage.setItem('manifestation_experiments', JSON.stringify(experiments));
    } catch (e) {
      console.warn('Failed to persist manifestation experiments', e);
    }
  }, [experiments]);

  const activeExperiment = useMemo(() => {
    return experiments.find(e => e.id === activeExpId) || experiments[0];
  }, [experiments, activeExpId]);

  // Library State
  const [libraryTexts, setLibraryTexts] = useState<ManifestationText[]>(() => {
    try {
      const saved = localStorage.getItem('manifestation_library_custom');
      const customTexts: ManifestationText[] = saved ? JSON.parse(saved) : [];
      return [...CANONICAL_MANIFESTATION_TEXTS, ...customTexts];
    } catch (e) {
      return CANONICAL_MANIFESTATION_TEXTS;
    }
  });

  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState<string>('all');
  const [selectedTextModal, setSelectedTextModal] = useState<ManifestationText | null>(null);

  // Web Search / Deep AI Codex Importer State
  const [webQuery, setWebQuery] = useState('');
  const [isWebSearching, setIsWebSearching] = useState(false);
  const [webSearchResults, setWebSearchResults] = useState<ManifestationText[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Audio Synthesizer (Solfeggio Generator)
  const [isPlayingFrequency, setIsPlayingFrequency] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(528);
  const [volumeLevel, setVolumeLevel] = useState(0.15);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Alignment Diagnostic State
  const [diagnosticTitle, setDiagnosticTitle] = useState('');
  const [diagnosticDesc, setDiagnosticDesc] = useState('');
  const [diagnosticCategory, setDiagnosticCategory] = useState<ManifestationCategory>('wealth_abundance');
  const [diagnosticMetrics, setDiagnosticMetrics] = useState('');
  const [diagnosticDoubts, setDiagnosticDoubts] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alignmentResult, setAlignmentResult] = useState<AlignmentAnalysisResponse | null>(null);

  // New Experiment Wizard Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ManifestationCategory>('wealth_abundance');
  const [newDescription, setNewDescription] = useState('');
  const [newMetrics, setNewMetrics] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDecree, setNewDecree] = useState('');
  const [newAnchor, setNewAnchor] = useState('');
  const [newSolfeggio, setNewSolfeggio] = useState(528);

  // Synchronicity Log Form State
  const [newSyncTitle, setNewSyncTitle] = useState('');
  const [newSyncDesc, setNewSyncDesc] = useState('');
  const [newSyncType, setNewSyncType] = useState<SynchronicityEvidence['signType']>('synchronicity');
  const [newSyncImpact, setNewSyncImpact] = useState(7);
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);

  // Cancellation & Dissolution State
  const [cancelExperimentModal, setCancelExperimentModal] = useState<ManifestationExperiment | null>(null);

  // Toast / Copy Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Web Audio Synth Lifecycle
  const startSolfeggioTone = (hz: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.01, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(volumeLevel, audioCtxRef.current.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlayingFrequency(true);
      setCurrentFrequency(hz);
    } catch (err) {
      console.warn('AudioContext error:', err);
    }
  };

  const stopSolfeggioTone = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioCtxRef.current.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.3);
      setTimeout(() => {
        if (oscillatorRef.current) {
          try {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
          } catch (e) {}
          oscillatorRef.current = null;
        }
        setIsPlayingFrequency(false);
      }, 350);
    } else {
      setIsPlayingFrequency(false);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {}
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Update volume live if playing
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volumeLevel, audioCtxRef.current.currentTime);
    }
  }, [volumeLevel]);

  // Handle Step Toggle
  const toggleStepCompletion = (expId: string, stepId: string) => {
    setExperiments(prev => prev.map(exp => {
      if (exp.id !== expId) return exp;
      const updatedSteps = exp.steps.map(s => {
        if (s.id !== stepId) return s;
        return {
          ...s,
          completed: !s.completed,
          completedAt: !s.completed ? new Date().toISOString() : undefined
        };
      });

      // Recalculate density score based on step completion + evidence
      const totalSteps = updatedSteps.length;
      const completedSteps = updatedSteps.filter(s => s.completed).length;
      const stepRatio = totalSteps > 0 ? (completedSteps / totalSteps) * 75 : 0;
      const evidenceBonus = Math.min(25, exp.evidenceLog.length * 6);
      const newDensity = Math.min(100, Math.round(stepRatio + evidenceBonus));

      // Determine phase
      let newStatus: ManifestationStatus = exp.status;
      if (newDensity >= 95) newStatus = 'completed';
      else if (newDensity >= 70) newStatus = 'physical_crystallization';
      else if (newDensity >= 45) newStatus = 'alchemical_transmutation';
      else if (newDensity >= 20) newStatus = 'anima_aetherica';
      else newStatus = 'prima_conceptio';

      return {
        ...exp,
        steps: updatedSteps,
        densityScore: newDensity,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Add Evidence / Synchronicity Log
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSyncTitle.trim() || !activeExperiment) return;

    const newEvidence: SynchronicityEvidence = {
      id: 'ev-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      title: newSyncTitle.trim(),
      description: newSyncDesc.trim(),
      signType: newSyncType,
      impactScore: newSyncImpact
    };

    setExperiments(prev => prev.map(exp => {
      if (exp.id !== activeExperiment.id) return exp;
      const updatedLog = [newEvidence, ...exp.evidenceLog];
      const newDensity = Math.min(100, exp.densityScore + Math.round(newSyncImpact * 0.8));
      return {
        ...exp,
        evidenceLog: updatedLog,
        densityScore: newDensity,
        updatedAt: new Date().toISOString()
      };
    }));

    setNewSyncTitle('');
    setNewSyncDesc('');
    setShowAddEvidenceModal(false);
    triggerToast('✨ Synchronicity / Physical Evidence anchored to Laboratory Ledger!');
  };

  // Create New Experiment
  const handleCreateExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const generatedSteps: ManifestationStep[] = [
      { id: 's1', phase: 1, title: 'Crystalline Form Definition', description: `Formulate the exact, unmistakable 3D specifications for "${newTitle}".`, completed: true, category: 'mental' },
      { id: 's2', phase: 1, title: 'Scarcity & Doubt Purge', description: 'Perform 10-minute mental stillness, releasing all anxiety about the temporal mechanism.', completed: false, category: 'mental' },
      { id: 's3', phase: 2, title: 'Sensory SATS Imprint', description: `Nightly loop: Live in the profound sensory relief and possession of ${newMetrics || newTitle}.`, completed: false, category: 'emotional' },
      { id: 's4', phase: 2, title: `Solfeggio ${newSolfeggio}Hz Immersion`, description: 'Listen to the pure resonance frequency while holding the emotional vibration of the end.', completed: false, category: 'emotional' },
      { id: 's5', phase: 3, title: 'Authoritative Spoken Fiat', description: 'Recite the sovereign Logos decree aloud twice daily with zero division in heart.', completed: false, category: 'ritual' },
      { id: 's6', phase: 3, title: 'Alchemical Seal Activation', description: 'Engrave or visualize the geometric seal that locks this thought-form into the matrix.', completed: false, category: 'ritual' },
      { id: 's7', phase: 4, title: 'Physical Anchor Placement', description: `Establish physical anchor: ${newAnchor || 'A designated sacred token placed in your workspace.'}`, completed: false, category: 'physical' },
      { id: 's8', phase: 4, title: 'Inspired Terrestrial Action', description: 'Take 1 to 3 decisive physical actions in the world that prepare the vessel for arrival.', completed: false, category: 'physical' }
    ];

    const newExp: ManifestationExperiment = {
      id: 'exp-' + Date.now().toString(36),
      title: newTitle.trim(),
      category: newCategory,
      targetDescription: newDescription.trim() || newTitle.trim(),
      tangibleMetrics: newMetrics.trim() || 'Physical appearance and tangible sensory possession.',
      targetDate: newDate || undefined,
      densityScore: 25,
      status: 'prima_conceptio',
      elementalBalance: { ignis: 7, aer: 8, aqua: 6, terra: 5, quintessence: 7 },
      solfeggioHz: newSolfeggio,
      intentionDecree: newDecree.trim() || `I COMMAND AND ACCEPT: That ${newTitle} is now solidified into physical matter under Divine Order. It is finished.`,
      physicalAnchor: newAnchor.trim() || 'A tangible physical token designated on your altar/desk.',
      steps: generatedSteps,
      evidenceLog: [],
      journalNotes: 'Initiated in the Manifestation Laboratory. The thought-seed is planted into the fertile matrix.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setExperiments(prev => [newExp, ...prev]);
    setActiveExpId(newExp.id);
    setLabTab('crucible');
    triggerToast('🧪 New Material Manifestation Experiment Crucible Created!');

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewMetrics('');
    setNewDate('');
    setNewDecree('');
    setNewAnchor('');
  };

  // Cancel / Dissolve / Reactivate Manifestation Experiment
  const handleCancelOrDeleteExperiment = (expId: string, action: 'cancel' | 'reactivate' | 'delete') => {
    if (action === 'delete') {
      setExperiments(prev => {
        const remaining = prev.filter(e => e.id !== expId);
        if (activeExpId === expId && remaining.length > 0) {
          setActiveExpId(remaining[0].id);
        }
        return remaining;
      });
      setCancelExperimentModal(null);
      triggerToast('💨 Manifestation Crucible permanently dissolved from the physical matrix.');
      return;
    }

    if (action === 'cancel') {
      setExperiments(prev => prev.map(exp => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          status: 'cancelled',
          updatedAt: new Date().toISOString(),
          journalNotes: exp.journalNotes + `\n[${new Date().toISOString().split('T')[0]}] Manifestation protocol formally CANCELLED & energetic currents released.`
        };
      }));
      setCancelExperimentModal(null);
      triggerToast('🛑 Manifestation Crucible marked as Cancelled.');
      return;
    }

    if (action === 'reactivate') {
      setExperiments(prev => prev.map(exp => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          status: 'prima_conceptio',
          updatedAt: new Date().toISOString(),
          journalNotes: exp.journalNotes + `\n[${new Date().toISOString().split('T')[0]}] Manifestation protocol REACTIVATED into active crucible.`
        };
      }));
      setCancelExperimentModal(null);
      triggerToast('✨ Manifestation Crucible reactivated & energetic channels restored!');
    }
  };

  // Cancel Creation Wizard
  const handleCancelNewExperiment = () => {
    setNewTitle('');
    setNewDescription('');
    setNewMetrics('');
    setNewDate('');
    setNewDecree('');
    setNewAnchor('');
    setNewSolfeggio(528);
    setLabTab('crucible');
    triggerToast('Creation cancelled. Returned to active crucibles.');
  };

  // Cancel Diagnostic Alignment Form
  const handleCancelDiagnostic = () => {
    setDiagnosticTitle('');
    setDiagnosticDesc('');
    setDiagnosticMetrics('');
    setDiagnosticDoubts('');
    setAlignmentResult(null);
    triggerToast('Alchemical alignment diagnostic cleared.');
  };

  // Cancel & Clear Web Search
  const handleCancelWebSearch = () => {
    setWebQuery('');
    setWebSearchResults(null);
    setSearchError(null);
  };

  // Run AI Alignment Analysis
  const handleRunAnalysis = async () => {
    if (!diagnosticTitle.trim()) {
      triggerToast('Please provide a goal/title for the diagnostic.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/manifestation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: diagnosticTitle,
          targetDescription: diagnosticDesc,
          category: diagnosticCategory,
          tangibleMetrics: diagnosticMetrics,
          currentFeelings: diagnosticDoubts
        })
      });

      if (!res.ok) throw new Error('Analysis request failed');
      const data: AlignmentAnalysisResponse = await res.json();
      setAlignmentResult(data);
      triggerToast('✨ Alchemical Alignment Diagnosis Complete!');
    } catch (err: any) {
      console.warn('Analysis error:', err);
      // Fallback response
      setAlignmentResult({
        densityScore: 42,
        dominantElement: 'Aer & Ignis',
        elementalBalance: { ignis: 8, aer: 9, aqua: 6, terra: 4, quintessence: 7 },
        energeticBlockages: [
          'Scattered mental focus over multiple competing outcomes',
          'Subconscious association of physical delay with unworthiness',
          'Lack of concrete physical anchor in the immediate tactile environment'
        ],
        transmutationPath: {
          phase1: 'Prima Conceptio: Define the exact boundary conditions of this manifestation with mathematical precision.',
          phase2: 'Anima Aetherica: Practice SATS. Saturate the feeling-state of already having what you desire.',
          phase3: 'Alchemical Transmutation: Speak the Logos decree during sunrise or sunset.',
          phase4: 'Physical Crystallization: Take one tangible physical step within 24 hours to ground the current.'
        },
        recommendedDecree: `BY SOVEREIGN DECREE: The invisible substance now crystallizes into the physical reality of ${diagnosticTitle}. It is established.`,
        suggestedSolfeggioHz: 528,
        physicalAnchorAction: 'Select a physical token (stone, coin, ring, or notebook) to represent this intention.',
        alchemicalAdvice: 'Matter is simply spirit vibrating at a denser frequency. Align your feeling state with the end result to speed up physical condensation.'
      });
      triggerToast('⚡ Diagnostic rendered from Ancient Transmutational Grimoire!');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Web Search & Deep Library Research
  const handleWebSearchLibrary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!webQuery.trim()) return;

    setIsWebSearching(true);
    setSearchError(null);
    try {
      const res = await fetch('/api/manifestation/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: webQuery.trim(),
          topicCategory: libraryCategoryFilter !== 'all' ? libraryCategoryFilter : undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Web research channel unavailable');
      }

      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        setWebSearchResults(data.results);
        triggerToast(`📜 Retrieved ${data.results.length} ancient & modern treatises from the web!`);
      } else {
        throw new Error('No treatises found matching your query');
      }
    } catch (err: any) {
      console.warn('Library web search error:', err);
      setSearchError(err.message || 'Failed to search manifestation texts');
      // Synthetic fallback treatises for immediate study
      setWebSearchResults([
        {
          id: 'custom-' + Date.now(),
          title: `Treatise on ${webQuery}: The Alchemical Condensation of Intention`,
          author: 'Alexandrian Hermetic Guild & Modern Observer Physics',
          era: 'Ancient - Modern Synthesis',
          tradition: 'Hermetic Alchemy & Quantum Epigenetics',
          category: 'universal_law',
          summary: `A profound synthesis on "${webQuery}", detailing how coherent human intent collapses vacuum potential into localized molecular structure.`,
          fullExcerpt: `“To manifest '${webQuery}' is not to create something from nothingness, but to change the density of that which already exists in the implicate zero-point matrix.
The mind provides the blueprint (Aer); the emotional conviction provides the magnetic solvent (Aqua); the focused will provides the activating heat (Ignis); and disciplined physical action provides the crystalline matrix (Terra).
When all four elements are brought into alignment without contradictory chatter, the 3D world yields unconditionally to the operator’s decree.”`,
          corePrinciples: [
            'All material objects exist as frequency superpositions prior to observation',
            'Sustained heart-brain coherence acts as the phase-lock mechanism',
            'Resistance and doubt divide the waveform, creating destructive interference',
            'Grounding into physical matter requires tangible, tactile action'
          ],
          practicalTechnique: `The 4-Step Condensation: 1. Isolate the target concept of '${webQuery}'. 2. Saturate the feeling-state for 15 minutes. 3. Utter the Spoken Decree at 528Hz. 4. Complete one concrete physical action today.`,
          fiatDecree: `BY THE IMMUTABLE LAWS OF NATURE AND SPIRIT: That which I have conceived concerning ${webQuery} is now precipitated into tangible physical form. It is so.`,
          tags: ['Manifestation', 'Alchemy', 'Quantum Observer', webQuery],
          sourceUrl: 'Hermetic Archives & Applied Consciousness Journal',
          isCustomImported: true
        }
      ]);
    } finally {
      setIsWebSearching(false);
    }
  };

  // Import a Search Result permanently into the User's Library
  const handleImportTextToLibrary = (text: ManifestationText) => {
    const isAlreadyImported = libraryTexts.some(t => t.id === text.id || t.title === text.title);
    if (isAlreadyImported) {
      triggerToast('This text is already archived in your Manifestation Library.');
      return;
    }

    const importedText: ManifestationText = {
      ...text,
      isCustomImported: true
    };

    const updated = [importedText, ...libraryTexts];
    setLibraryTexts(updated);

    // Save only custom imported texts to localStorage
    const customOnly = updated.filter(t => t.isCustomImported);
    try {
      localStorage.setItem('manifestation_library_custom', JSON.stringify(customOnly));
    } catch (e) {}

    triggerToast(`📚 "${text.title}" added to your Permanent Manifestation Library!`);
  };

  // Filtered Library Texts
  const filteredLibrary = useMemo(() => {
    return libraryTexts.filter(item => {
      const matchCategory = libraryCategoryFilter === 'all' || item.category === libraryCategoryFilter;
      const matchSearch = !librarySearch.trim() || 
        item.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.author.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.summary.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(librarySearch.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [libraryTexts, libraryCategoryFilter, librarySearch]);

  // Export Experiment to JSON / Markdown
  const handleExportExperiment = (exp: ManifestationExperiment) => {
    const report = `# Material Manifestation Protocol: ${exp.title}
**Category:** ${CATEGORY_LABELS[exp.category]?.label || exp.category}
**Current Density:** ${exp.densityScore}% | **Status:** ${exp.status.toUpperCase()}
**Target Date:** ${exp.targetDate || 'Continuous Divine Timeline'}
**Solfeggio Frequency:** ${exp.solfeggioHz} Hz

## Target Physical Description
${exp.targetDescription}

## Tangible 3D Metrics
${exp.tangibleMetrics}

## Spoken Logos Fiat Decree
> "${exp.intentionDecree}"

## Physical Anchor
${exp.physicalAnchor}

## Elemental Balance
- Ignis (Fire / Will): ${exp.elementalBalance.ignis} / 10
- Aer (Air / Thought): ${exp.elementalBalance.aer} / 10
- Aqua (Water / Emotion): ${exp.elementalBalance.aqua} / 10
- Terra (Earth / Grounding): ${exp.elementalBalance.terra} / 10
- Quintessence (Spirit): ${exp.elementalBalance.quintessence} / 10

## 4-Phase Operational Checklist
${exp.steps.map(s => `- [${s.completed ? 'X' : ' '}] Phase ${s.phase} (${s.category.toUpperCase()}): ${s.title} — ${s.description}`).join('\n')}

## Synchronicity & Physical Evidence Log
${exp.evidenceLog.length > 0 ? exp.evidenceLog.map(ev => `- **${ev.date}** [${ev.signType.toUpperCase()}] **${ev.title}** (Impact: ${ev.impactScore}/10)\n  ${ev.description}`).join('\n') : '_No evidence logs recorded yet._'}

## Laboratory Notes
${exp.journalNotes}

---
*Generated by The Great Wheel of Mysteries - Manifestation Laboratory & Transmutation Chamber*
*Timestamp: ${new Date().toISOString()}*
`;

    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifestation-protocol-${exp.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('📥 Manifestation Protocol exported as Markdown!');
  };

  return (
    <div id="manifestation-laboratory-portal" className="w-full space-y-6 text-left">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-[80] bg-[#111116] border border-amber-500/50 text-amber-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-serif"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#0c0a09] via-[#141210] to-[#0a0f18] p-6 sm:p-8 shadow-2xl shadow-amber-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <FlaskConical className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Magnum Opus & Thought Precipitation
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-wide">
                  Material Manifestation Laboratory
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-serif text-slate-400 max-w-2xl leading-relaxed">
              Step-by-step alchemical transmution of mental archetypes into tangible 3D physical reality. Document, measure, tune Solfeggio frequencies, log synchronicities, and explore ancient & modern manifestation codices.
            </p>
          </div>

          {/* Solfeggio Tuner Quick Access Bar */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20 flex flex-col gap-2 min-w-[240px] shadow-lg">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Solfeggio Waveform
              </span>
              <span className="text-xs text-amber-400 font-bold">{currentFrequency} Hz</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={currentFrequency}
                onChange={(e) => {
                  const hz = Number(e.target.value);
                  setCurrentFrequency(hz);
                  if (isPlayingFrequency) startSolfeggioTone(hz);
                }}
                className="flex-1 bg-black/80 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {MANIFESTATION_SOLFEGGIO_FREQUENCIES.map(f => (
                  <option key={f.hz} value={f.hz}>
                    {f.hz} Hz — {f.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  if (isPlayingFrequency) stopSolfeggioTone();
                  else startSolfeggioTone(currentFrequency);
                }}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isPlayingFrequency
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/40 animate-pulse'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-white'
                }`}
                title={isPlayingFrequency ? 'Stop Solfeggio Resonance' : 'Activate Solfeggio Tone'}
              >
                {isPlayingFrequency ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>Status: {isPlayingFrequency ? 'Active Harmonization' : 'Idle'}</span>
              <span>Pure Sine Wave (432Hz/528Hz)</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setLabTab('crucible')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              labTab === 'crucible'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Crucibles ({experiments.length})</span>
          </button>

          <button
            onClick={() => setLabTab('library')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              labTab === 'library'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manifestation Library ({libraryTexts.length})</span>
          </button>

          <button
            onClick={() => setLabTab('alignment')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              labTab === 'alignment'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-yellow-400" />
            <span>Alchemical Alignment Oracle</span>
          </button>

          <button
            onClick={() => setLabTab('logos')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              labTab === 'logos'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>Logos Spoken Altars</span>
          </button>

          <button
            onClick={() => setLabTab('new_experiment')}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-serif font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Material Experiment</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE CRUCIBLES & EXPERIMENTS */}
      {labTab === 'crucible' && (
        <div className="space-y-6">
          {/* Experiment Selector Carousel / Grid */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {experiments.map(exp => {
              const isSelected = exp.id === activeExperiment?.id;
              const catInfo = CATEGORY_LABELS[exp.category] || CATEGORY_LABELS.wealth_abundance;
              const isCancelled = exp.status === 'cancelled';
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveExpId(exp.id)}
                  className={`flex-shrink-0 p-3.5 rounded-xl border text-left transition-all min-w-[260px] max-w-[320px] cursor-pointer ${
                    isSelected
                      ? isCancelled
                        ? 'bg-[#181212] border-red-500/60 ring-1 ring-red-500/30 shadow-xl'
                        : 'bg-[#181614] border-amber-500/60 ring-1 ring-amber-500/30 shadow-xl'
                      : 'bg-[#100f12]/60 border-white/5 hover:border-white/20 hover:bg-[#141318]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catInfo.color}`}>
                      {catInfo.icon} {catInfo.label.split(' ')[0]}
                    </span>
                    {isCancelled ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 font-bold uppercase">
                        Cancelled
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {exp.densityScore}% Dense
                      </span>
                    )}
                  </div>
                  <h4 className={`text-xs font-serif font-bold line-clamp-1 mb-1 ${isCancelled ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {exp.title}
                  </h4>
                  <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCancelled
                          ? 'bg-red-500/50'
                          : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                      }`}
                      style={{ width: `${exp.densityScore}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Active Experiment Chamber */}
          {activeExperiment ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Metrics, Densification Meter, Spoken Logos & Anchors */}
              <div className="lg:col-span-5 space-y-6">
                {/* Densification Gauge Card */}
                <div className="p-6 rounded-2xl bg-[#0e0d11] border border-amber-500/30 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h3 className="text-sm font-serif font-bold text-slate-100">
                        Alchemical Densification Matrix
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold ${
                        activeExperiment.status === 'cancelled'
                          ? 'bg-red-950/40 text-red-300 border-red-500/40'
                          : activeExperiment.status === 'completed'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {activeExperiment.status.replace('_', ' ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCancelExperimentModal(activeExperiment)}
                        className="p-1 rounded-lg bg-white/5 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-white/10 hover:border-red-500/40 transition-all cursor-pointer"
                        title="Cancel or Dissolve this Manifestation Protocol"
                      >
                        <Ban className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Circular / Linear Visualizer */}
                  <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                    <div className="text-3xl font-serif font-bold text-amber-300 mb-1">
                      {activeExperiment.densityScore}
                      <span className="text-xs font-mono text-slate-400 font-normal"> / 100%</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 text-center max-w-xs">
                      {activeExperiment.densityScore >= 90
                        ? '🟢 Phase 4: Full Physical Crystallization & Terrestrial Anchor.'
                        : activeExperiment.densityScore >= 65
                        ? '🟡 Phase 3: High Alchemical Transmutation & Energetic Condensation.'
                        : activeExperiment.densityScore >= 35
                        ? '🔵 Phase 2: Anima Aetherica & Sensory Subconscious Impression.'
                        : '🟣 Phase 1: Prima Conceptio & Mental Blueprint Form.'}
                    </p>

                    <div className="w-full bg-black/80 h-2.5 rounded-full overflow-hidden border border-white/10 mt-4">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 via-amber-500 to-emerald-400 transition-all duration-700"
                        style={{ width: `${activeExperiment.densityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Elemental Distribution Bars */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                      Five-Fold Elemental Balance
                    </span>
                    <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                      <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20">
                        <span className="text-red-400 block font-bold">Ignis</span>
                        <span className="text-slate-200">{activeExperiment.elementalBalance.ignis}/10</span>
                      </div>
                      <div className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                        <span className="text-cyan-400 block font-bold">Aer</span>
                        <span className="text-slate-200">{activeExperiment.elementalBalance.aer}/10</span>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-950/20 border border-blue-500/20">
                        <span className="text-blue-400 block font-bold">Aqua</span>
                        <span className="text-slate-200">{activeExperiment.elementalBalance.aqua}/10</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                        <span className="text-emerald-400 block font-bold">Terra</span>
                        <span className="text-slate-200">{activeExperiment.elementalBalance.terra}/10</span>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-950/20 border border-purple-500/20">
                        <span className="text-purple-400 block font-bold">Spirit</span>
                        <span className="text-slate-200">{activeExperiment.elementalBalance.quintessence}/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Tangible Metrics & Physical Anchor */}
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold block flex items-center gap-1">
                        <Check className="w-3 h-3 text-amber-400" /> Physical Confirmation Metrics
                      </span>
                      <p className="text-xs font-serif text-slate-300 leading-relaxed">
                        {activeExperiment.tangibleMetrics}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold block flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-400" /> Tactile Anchor Object / Action
                      </span>
                      <p className="text-xs font-serif text-slate-300 leading-relaxed">
                        {activeExperiment.physicalAnchor}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                      <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-semibold block flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> Spoken Logos Fiat Decree
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeExperiment.intentionDecree);
                            triggerToast('Spoken Decree copied to clipboard!');
                          }}
                          className="hover:text-white transition-colors"
                          title="Copy Decree"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </span>
                      <p className="text-xs font-serif italic text-amber-100/90 leading-relaxed">
                        "{activeExperiment.intentionDecree}"
                      </p>
                    </div>
                  </div>

                  {/* Cancelled Banner if status is cancelled */}
                  {activeExperiment.status === 'cancelled' && (
                    <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2">
                      <div className="flex items-center gap-2 text-red-300 text-xs font-serif font-bold">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Manifestation Crucible Cancelled</span>
                      </div>
                      <p className="text-[11px] font-serif text-red-200/80 leading-relaxed">
                        Energetic channels and active tracking are paused for this protocol.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCancelOrDeleteExperiment(activeExperiment.id, 'reactivate')}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-serif font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3 text-emerald-400" />
                          <span>Reactivate Crucible</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelOrDeleteExperiment(activeExperiment.id, 'delete')}
                          className="py-1.5 px-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-serif transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          <span>Dissolve</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions & Export */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExportExperiment(activeExperiment)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Export Protocol (MD)</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenConsultation) {
                            onOpenConsultation(
                              `How can I remove any remaining subconscious or metaphysical friction to accelerate the physical manifestation of: "${activeExperiment.title}"?`,
                              'Hermetic Alchemy'
                            );
                          } else {
                            triggerToast('Consult Oracle from the Main Oracle Tab.');
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-serif text-amber-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Consult Oracle</span>
                      </button>
                    </div>

                    {activeExperiment.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => setCancelExperimentModal(activeExperiment)}
                        className="w-full py-2 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/50 text-xs font-serif text-red-300 hover:text-red-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-medium"
                        title="Cancel or Dissolve this Manifestation Protocol"
                      >
                        <Ban className="w-3.5 h-3.5 text-red-400" />
                        <span>Cancel / Dissolve Crucible</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: 4-Phase Step Checklist & Synchronicity Log */}
              <div className="lg:col-span-7 space-y-6">
                {/* 4-Phase Step Checklist */}
                <div className="p-6 rounded-2xl bg-[#0e0d11] border border-white/10 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-serif font-bold text-slate-100">
                        Four-Phase Transmutation Protocols
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {activeExperiment.steps.filter(s => s.completed).length} / {activeExperiment.steps.length} Milestones Solidified
                    </span>
                  </div>

                  {/* Phase Groups */}
                  <div className="space-y-4">
                    {MANIFESTATION_PHASES_INFO.map(phaseInfo => {
                      const phaseSteps = activeExperiment.steps.filter(s => s.phase === phaseInfo.phase);
                      const allPhaseDone = phaseSteps.length > 0 && phaseSteps.every(s => s.completed);

                      return (
                        <div
                          key={phaseInfo.phase}
                          className={`p-4 rounded-xl border transition-all ${
                            allPhaseDone
                              ? 'bg-emerald-950/10 border-emerald-500/30'
                              : 'bg-black/30 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${phaseInfo.textColor} bg-white/5 border ${phaseInfo.borderColor}`}>
                                Phase {phaseInfo.phase}: {phaseInfo.name}
                              </span>
                              <span className="text-xs font-serif text-slate-300 font-medium">
                                ({phaseInfo.latinName})
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {phaseInfo.element}
                            </span>
                          </div>

                          <p className="text-[11px] font-serif text-slate-400 italic mb-3">
                            {phaseInfo.description}
                          </p>

                          {/* Step List in Phase */}
                          <div className="space-y-2">
                            {phaseSteps.map(step => (
                              <div
                                key={step.id}
                                onClick={() => toggleStepCompletion(activeExperiment.id, step.id)}
                                className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 cursor-pointer select-none ${
                                  step.completed
                                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                                    : 'bg-black/50 border-white/5 hover:border-amber-500/30 text-slate-300'
                                }`}
                              >
                                <button
                                  type="button"
                                  className="mt-0.5 text-amber-400 shrink-0"
                                >
                                  {step.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-500 hover:text-amber-400" />
                                  )}
                                </button>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`text-xs font-serif font-bold ${step.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                                      {step.title}
                                    </span>
                                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                                      {step.category}
                                    </span>
                                  </div>
                                  <p className={`text-[11px] font-serif mt-0.5 leading-relaxed ${step.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Synchronicity & Physical Evidence Ledger */}
                <div className="p-6 rounded-2xl bg-[#0e0d11] border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h3 className="text-sm font-serif font-bold text-slate-100">
                        Synchronicity & Physical Evidence Ledger
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowAddEvidenceModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Anchor New Sign</span>
                    </button>
                  </div>

                  {activeExperiment.evidenceLog.length === 0 ? (
                    <div className="p-6 rounded-xl bg-black/40 border border-dashed border-white/10 text-center space-y-2">
                      <Eye className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs font-serif text-slate-400">
                        No physical synchronicities anchored yet. Watch for recurring numbers, unexpected leads, dreams, or physical evidence as the intention condenses into matter.
                      </p>
                      <button
                        onClick={() => setShowAddEvidenceModal(true)}
                        className="px-3 py-1 text-xs font-mono text-amber-400 hover:underline cursor-pointer"
                      >
                        + Record First Synchronicity
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {activeExperiment.evidenceLog.map(ev => (
                        <div
                          key={ev.id}
                          className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1 text-left"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              ✦ [{ev.signType.toUpperCase()}]
                            </span>
                            <span className="text-slate-500">{ev.date} · Impact {ev.impactScore}/10</span>
                          </div>
                          <h5 className="text-xs font-serif font-bold text-slate-200">
                            {ev.title}
                          </h5>
                          <p className="text-[11px] font-serif text-slate-400 leading-relaxed">
                            {ev.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-black/30 rounded-2xl border border-white/10 space-y-3">
              <FlaskConical className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-serif font-bold text-slate-200">No Active Manifestation Experiments</h3>
              <p className="text-xs font-serif text-slate-400 max-w-md mx-auto">
                Create your first material manifestation experiment to begin the 4-phase transmutational journey.
              </p>
              <button
                onClick={() => setLabTab('new_experiment')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-serif font-bold text-xs shadow-lg cursor-pointer"
              >
                + Create Manifestation Experiment
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANIFESTATION LIBRARY & LIVE WEB IMPORTER */}
      {labTab === 'library' && (
        <div className="space-y-6">
          {/* Live Web & Esoteric Archives Search Importer Bar */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-black to-cyan-950/30 border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 animate-spin" />
                <h3 className="text-sm font-serif font-bold text-slate-100">
                  Universal Web Search & Esoteric Treatise Importer
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                AI + Historical Corpus Deep Crawler
              </span>
            </div>

            <p className="text-xs font-serif text-slate-400">
              Query across ancient hermetic manuscripts, New Thought classics, Kabbalistic codices, Vedic scriptures, and modern quantum physics papers. Retrieve authentic treatises and add them directly to your permanent laboratory library.
            </p>

            <form onSubmit={handleWebSearchLibrary} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={webQuery}
                  onChange={(e) => setWebQuery(e.target.value)}
                  placeholder="e.g. Neville Goddard SATS mechanics, Hermetic Law of Polarity, Sefer Yetzirah Malkuth grounding, Quantum Observer..."
                  className="w-full pl-9 pr-4 py-2.5 bg-black/70 border border-white/10 focus:border-cyan-400 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {(webQuery || webSearchResults) && (
                  <button
                    type="button"
                    onClick={handleCancelWebSearch}
                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-red-300 text-xs font-serif flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Cancel & Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isWebSearching || !webQuery.trim()}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-serif font-bold text-xs shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isWebSearching ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Searching Web & Archives...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Retrieve Treatises</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Web Search Results Area */}
            {webSearchResults && (
              <div className="space-y-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-bold">
                    Web & Esoteric Corpus Results ({webSearchResults.length})
                  </span>
                  <button
                    onClick={() => setWebSearchResults(null)}
                    className="text-slate-400 hover:text-white text-[10px] underline"
                  >
                    Clear Results
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {webSearchResults.map(text => (
                    <div
                      key={text.id}
                      className="p-4 rounded-xl bg-black/60 border border-cyan-500/30 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-cyan-400 font-bold">{text.tradition}</span>
                          <span className="text-slate-500">{text.era}</span>
                        </div>
                        <h4 className="text-sm font-serif font-bold text-slate-100">
                          {text.title}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400">By {text.author}</p>
                        <p className="text-xs font-serif text-slate-300 line-clamp-3 leading-relaxed">
                          {text.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => setSelectedTextModal(text)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-slate-200 text-center cursor-pointer"
                        >
                          Read Full Text
                        </button>
                        <button
                          onClick={() => handleImportTextToLibrary(text)}
                          className="py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-serif font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save to Library</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Library Catalog with Search & Filters */}
          <div className="p-6 rounded-2xl bg-[#0e0d11] border border-white/10 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Archived Manifestation Texts & Treatises
                </h3>
                <p className="text-xs font-serif text-slate-400">
                  {filteredLibrary.length} classical treatises across Hermeticism, Kabbalah, New Thought, Vedic Science, and Quantum Physics.
                </p>
              </div>

              {/* Local Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Filter library..."
                  className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-serif text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <select
                  value={libraryCategoryFilter}
                  onChange={(e) => setLibraryCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Traditions</option>
                  <option value="hermetic">Hermetic Philosophy</option>
                  <option value="universal_law">Universal Law / New Thought</option>
                  <option value="kabbalistic">Kabbalah / Sefer Yetzirah</option>
                  <option value="vedic">Vedic / Upanishads</option>
                  <option value="quantum_physics">Quantum Physics & Observer</option>
                  <option value="wealth_abundance">Wealth & Opulence</option>
                  <option value="spiritual_authority">Divine Order / Authority</option>
                </select>
              </div>
            </div>

            {/* Library Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLibrary.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-400 font-semibold">{item.tradition}</span>
                      <span className="text-slate-500">{item.era}</span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-[10px] font-mono text-slate-400">By {item.author}</p>

                    <p className="text-xs font-serif text-slate-300 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTextModal(item)}
                      className="text-xs font-serif text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Study Treatise</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    {item.isCustomImported && (
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALCHEMICAL ALIGNMENT ORACLE */}
      {labTab === 'alignment' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e0d11] border border-amber-500/30 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <Compass className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <h3 className="text-base font-serif font-bold text-slate-100">
                  Alchemical Alignment & Density Calculator
                </h3>
                <p className="text-xs font-serif text-slate-400">
                  Analyze energetic resistance, elemental distribution, and generate an instant 4-phase materialization roadmap.
                </p>
              </div>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Manifestation Goal / Physical Item
                </label>
                <input
                  type="text"
                  value={diagnosticTitle}
                  onChange={(e) => setDiagnosticTitle(e.target.value)}
                  placeholder="e.g. $25,000 Liquid Financial Inflow, Sacred Art Studio Sanctuary..."
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Category
                </label>
                <select
                  value={diagnosticCategory}
                  onChange={(e) => setDiagnosticCategory(e.target.value as ManifestationCategory)}
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => (
                    <option key={catKey} value={catKey}>
                      {info.icon} {info.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Physical 3D Metrics (How will you verify it?)
                </label>
                <input
                  type="text"
                  value={diagnosticMetrics}
                  onChange={(e) => setDiagnosticMetrics(e.target.value)}
                  placeholder="e.g. In hand, bank ledger verified, keys received..."
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Subconscious Hesitations / Doubts (If any)
                </label>
                <input
                  type="text"
                  value={diagnosticDoubts}
                  onChange={(e) => setDiagnosticDoubts(e.target.value)}
                  placeholder="e.g. Wondering about the timeline, fear of undeservingness..."
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {(diagnosticTitle || diagnosticDesc || diagnosticMetrics || diagnosticDoubts || alignmentResult) && (
                <button
                  type="button"
                  onClick={handleCancelDiagnostic}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-red-300 font-serif text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Cancel and Clear Diagnostic"
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Cancel & Clear</span>
                </button>
              )}

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !diagnosticTitle.trim()}
                className="flex-1 w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-serif font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmuting & Diagnosing Alignment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Alchemical Diagnostic</span>
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Output Card */}
            {alignmentResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-black/60 border border-amber-500/40 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      Initial Precipitation Density
                    </span>
                    <h4 className="text-lg font-serif font-bold text-slate-100">
                      {alignmentResult.densityScore}% Condensed into 3D Physical Form
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">Dominant Elements</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">{alignmentResult.dominantElement}</span>
                  </div>
                </div>

                {/* Advice Quote */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <p className="text-xs font-serif italic text-amber-200/90 leading-relaxed">
                    "{alignmentResult.alchemicalAdvice}"
                  </p>
                </div>

                {/* 4-Phase Roadmap */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Tailored 4-Phase Materialization Roadmap
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-serif">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-yellow-400 font-bold block">1. Prima Conceptio</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{alignmentResult.transmutationPath.phase1}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block">2. Anima Aetherica</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{alignmentResult.transmutationPath.phase2}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-orange-400 font-bold block">3. Alchemical Transmutation</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{alignmentResult.transmutationPath.phase3}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block">4. Physical Crystallization</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{alignmentResult.transmutationPath.phase4}</p>
                    </div>
                  </div>
                </div>

                {/* Subconscious Blockages Identified */}
                {alignmentResult.energeticBlockages.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block">
                      Subconscious Friction Identified & Neutralized
                    </span>
                    <ul className="space-y-1">
                      {alignmentResult.energeticBlockages.map((blockage, idx) => (
                        <li key={idx} className="text-xs font-serif text-slate-300 flex items-start gap-2">
                          <span className="text-amber-500">✦</span>
                          <span>{blockage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Spoken Logos & Anchor Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 font-bold block">Recommended Logos Decree</span>
                    <p className="text-xs font-serif italic text-slate-200 leading-relaxed">
                      "{alignmentResult.recommendedDecree}"
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">Physical Anchor Action</span>
                    <p className="text-xs font-serif text-slate-200 leading-relaxed">
                      {alignmentResult.physicalAnchorAction}
                    </p>
                  </div>
                </div>

                {/* Convert into Active Experiment Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setNewTitle(diagnosticTitle);
                      setNewCategory(diagnosticCategory);
                      setNewMetrics(diagnosticMetrics);
                      setNewDecree(alignmentResult.recommendedDecree);
                      setNewAnchor(alignmentResult.physicalAnchorAction);
                      setNewSolfeggio(alignmentResult.suggestedSolfeggioHz || 528);
                      setLabTab('new_experiment');
                      triggerToast('Transferred diagnostic into New Experiment Wizard!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-serif font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Inscribe this Diagnosis into a Live Materialization Crucible</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LOGOS SPOKEN ALTARS */}
      {labTab === 'logos' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e0d11] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <Zap className="w-5 h-5 text-violet-400 animate-pulse" />
              <div>
                <h3 className="text-base font-serif font-bold text-slate-100">
                  The Logos Altar & Verbal Fiat Chamber
                </h3>
                <p className="text-xs font-serif text-slate-400">
                  The spoken word is the vibrating catalyst that organizes ethereal chaos into physical reality. Recite these canonical decrees aloud with steady cadence.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CANONICAL_MANIFESTATION_TEXTS.map(t => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-violet-500/40 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider block">
                      {t.tradition} Fiat
                    </span>
                    <h4 className="text-xs font-serif font-bold text-slate-200">{t.title}</h4>
                    <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-500/20 text-xs font-serif italic text-slate-100 leading-relaxed">
                      "{t.fiatDecree}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(t.fiatDecree);
                        triggerToast('Fiat Decree copied to clipboard!');
                      }}
                      className="text-[11px] font-serif text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>

                    <button
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          const utterance = new SpeechSynthesisUtterance(t.fiatDecree);
                          utterance.rate = 0.88;
                          utterance.pitch = 0.95;
                          window.speechSynthesis.speak(utterance);
                          triggerToast('Chanting Fiat Decree via Voice Resonance...');
                        }
                      }}
                      className="text-xs font-serif text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Speak Decree
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NEW EXPERIMENT WIZARD */}
      {labTab === 'new_experiment' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e0d11] border border-amber-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-100">
                    Create New Material Manifestation Experiment
                  </h3>
                  <p className="text-xs font-serif text-slate-400">
                    Define the target physical outcome, anchor frequency, spoken decree, and 4-phase action steps.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLabTab('crucible')}
                className="text-xs font-serif text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Back to Crucibles
              </button>
            </div>

            <form onSubmit={handleCreateExperiment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Manifestation Target Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. $15,000 Liquid Financial Influx, Restoration of Physical Spine Vitality..."
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ManifestationCategory)}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => (
                      <option key={catKey} value={catKey}>
                        {info.icon} {info.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Detailed Physical Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the exact sensory parameters, colors, textures, and circumstances of this manifestation..."
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Tangible 3D Verification Metrics
                  </label>
                  <input
                    type="text"
                    value={newMetrics}
                    onChange={(e) => setNewMetrics(e.target.value)}
                    placeholder="e.g. Deposit statement confirmed, physical object in hand..."
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Solfeggio Frequency (Hz)
                  </label>
                  <select
                    value={newSolfeggio}
                    onChange={(e) => setNewSolfeggio(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                  >
                    {MANIFESTATION_SOLFEGGIO_FREQUENCIES.map(f => (
                      <option key={f.hz} value={f.hz}>
                        {f.hz} Hz — {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Spoken Logos Decree (Fiat)
                  </label>
                  <input
                    type="text"
                    value={newDecree}
                    onChange={(e) => setNewDecree(e.target.value)}
                    placeholder="e.g. I COMMAND AND RECEIVE: This manifestation is now settled in matter under Grace."
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Physical Anchor Object / Action
                  </label>
                  <input
                    type="text"
                    value={newAnchor}
                    onChange={(e) => setNewAnchor(e.target.value)}
                    placeholder="e.g. Brass coin on desk, dedicated notebook, ring worn daily..."
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancelNewExperiment}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-red-300 font-serif text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Cancel & Discard</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-black font-serif font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Initiate Material Manifestation Crucible</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: READ FULL TREATISE MODAL */}
      <AnimatePresence>
        {selectedTextModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-[#0d0c10] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-amber-400 font-bold uppercase">{selectedTextModal.tradition}</span>
                    <span className="text-slate-500">· {selectedTextModal.era}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-100">
                    {selectedTextModal.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">By {selectedTextModal.author}</p>
                </div>
                <button
                  onClick={() => setSelectedTextModal(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-left text-xs font-serif text-slate-300 leading-relaxed">
                {/* Abstract */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold block mb-1">
                    Scholarly Abstract
                  </span>
                  <p className="text-slate-200">{selectedTextModal.summary}</p>
                </div>

                {/* Full Excerpt */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                    Core Treatise Excerpt
                  </span>
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 whitespace-pre-line text-slate-200 font-serif leading-relaxed">
                    {selectedTextModal.fullExcerpt}
                  </div>
                </div>

                {/* Core Principles */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                    Immutable Transmutational Principles
                  </span>
                  <ul className="space-y-1.5">
                    {selectedTextModal.corePrinciples.map((principle, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                        <span className="text-amber-400 font-bold font-mono text-[11px]">{idx + 1}.</span>
                        <span>{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Technique */}
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block flex items-center gap-1">
                    <FlaskConical className="w-3.5 h-3.5" /> Prescribed Practical Technique
                  </span>
                  <p className="text-cyan-100">{selectedTextModal.practicalTechnique}</p>
                </div>

                {/* Spoken Decree */}
                <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider font-bold block flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Spoken Logos Decree
                  </span>
                  <p className="text-violet-100 italic font-serif leading-relaxed">
                    "{selectedTextModal.fiatDecree}"
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${selectedTextModal.title}\nBy ${selectedTextModal.author}\n\n${selectedTextModal.fullExcerpt}\n\nDecree:\n${selectedTextModal.fiatDecree}`
                    );
                    triggerToast('Treatise copied to clipboard!');
                  }}
                  className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Treatise</span>
                </button>

                <button
                  onClick={() => {
                    handleImportTextToLibrary(selectedTextModal);
                    setSelectedTextModal(null);
                  }}
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save to Permanent Library</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD SYNCHRONICITY / PHYSICAL EVIDENCE */}
      <AnimatePresence>
        {showAddEvidenceModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0d0c10] border border-amber-500/40 rounded-2xl shadow-2xl p-6 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-serif font-bold text-slate-100">
                    Record Synchronicity / Physical Sign
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddEvidence} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Sign / Evidence Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSyncTitle}
                    onChange={(e) => setNewSyncTitle(e.target.value)}
                    placeholder="e.g. Unsolicited Client Inquiry, Found Gold Ring, 444 Alignment..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      Sign Category
                    </label>
                    <select
                      value={newSyncType}
                      onChange={(e) => setNewSyncType(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                    >
                      <option value="synchronicity">Synchronicity</option>
                      <option value="tangible_gain">Tangible Gain / Financial Inflow</option>
                      <option value="physical_lead">Physical Lead / Opportunity</option>
                      <option value="encounter">Allied Person / Encounter</option>
                      <option value="dream">Lucid / Symbolic Dream</option>
                      <option value="numerical">Numerical / Celestial Code</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      Impact Score (1-10)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newSyncImpact}
                      onChange={(e) => setNewSyncImpact(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Detailed Notes & Observations
                  </label>
                  <textarea
                    rows={3}
                    value={newSyncDesc}
                    onChange={(e) => setNewSyncDesc(e.target.value)}
                    placeholder="Describe what occurred, how it felt, and what physical actions followed..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl text-xs font-serif text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEvidenceModal(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-slate-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Anchor Evidence
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CANCEL / DISSOLVE EXPERIMENT CONFIRMATION */}
      <AnimatePresence>
        {cancelExperimentModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0e0d12] border border-red-500/40 rounded-2xl shadow-2xl p-6 space-y-5 text-left"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-100">
                      Cancel / Dissolve Crucible
                    </h3>
                    <p className="text-xs font-mono text-slate-400 line-clamp-1">
                      {cancelExperimentModal.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelExperimentModal(null)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-serif text-slate-300 leading-relaxed">
                Choose whether to mark this manifestation experiment as <strong className="text-amber-300">Cancelled</strong> (preserving its notes and synchronicities while pausing active tracking) or <strong className="text-red-400">Permanently Dissolve</strong> it from the ledger.
              </p>

              <div className="space-y-3 pt-1">
                {/* Option 1: Mark as Cancelled */}
                <button
                  type="button"
                  onClick={() => handleCancelOrDeleteExperiment(cancelExperimentModal.id, 'cancel')}
                  className="w-full p-3.5 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/40 text-left transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <Ban className="w-4 h-4 text-amber-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-serif font-bold text-amber-200">
                      Mark as Cancelled (Pause Currents)
                    </div>
                    <div className="text-[11px] font-serif text-slate-400 mt-0.5">
                      Sets status to Cancelled and pauses active alerts while preserving all historical step data and notes.
                    </div>
                  </div>
                </button>

                {/* Option 2: Permanently Dissolve */}
                <button
                  type="button"
                  onClick={() => handleCancelOrDeleteExperiment(cancelExperimentModal.id, 'delete')}
                  className="w-full p-3.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/40 text-left transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <Trash2 className="w-4 h-4 text-red-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-serif font-bold text-red-300">
                      Permanently Dissolve Crucible
                    </div>
                    <div className="text-[11px] font-serif text-slate-400 mt-0.5">
                      Completely removes this experiment and its data from the laboratory memory matrix.
                    </div>
                  </div>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCancelExperimentModal(null)}
                  className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-slate-300 cursor-pointer"
                >
                  Keep Crucible Active
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ManifestationLaboratory;
