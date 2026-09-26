import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  X,
  Search,
  Filter,
  Sparkles,
  Trash2,
  Download,
  Upload,
  Copy,
  Share2,
  RotateCcw,
  BookOpen,
  ArrowRightLeft,
  Calendar,
  Check,
  FileText,
  FileDown,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  Award,
  Star,
  Eye,
  Tag,
  Tags,
  Plus,
  Minus,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ListChecks,
  SlidersHorizontal,
  User,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import ChroniclesTimeline, { PastInquiry } from './ChroniclesTimeline';
import ZodiacalInfluenceChart from './ZodiacalInfluenceChart';
import TypewriterMarkdown from './TypewriterMarkdown';
import VirtualizedList from './VirtualizedList';
import { jsPDF } from 'jspdf';
import { generateChroniclePdf, PdfExportOptions, analyzeChronicleCollection } from '../utils/chroniclePdfExport';

export type ChronicleSortOption = 
  | "newest" 
  | "oldest" 
  | "alphabetical" 
  | "zodiac-asc" 
  | "zodiac-desc" 
  | "zodiac-alpha";

const ZODIAC_CANONICAL_ORDER: Record<string, number> = {
  'aries': 1,
  'taurus': 2,
  'gemini': 3,
  'cancer': 4,
  'leo': 5,
  'virgo': 6,
  'libra': 7,
  'scorpio': 8,
  'sagittarius': 9,
  'capricorn': 10,
  'aquarius': 11,
  'pisces': 12
};

const ALL_ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', element: 'Air' },
  { name: 'Cancer', symbol: '♋', element: 'Water' },
  { name: 'Leo', symbol: '♌', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', element: 'Earth' },
  { name: 'Libra', symbol: '♎', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', element: 'Air' },
  { name: 'Pisces', symbol: '♓', element: 'Water' }
];

interface ConsultationChroniclesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pastInquiries: PastInquiry[];
  setPastInquiries: React.Dispatch<React.SetStateAction<PastInquiry[]>>;
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    bgCard: string;
    starStroke: string;
    accentGradient?: string;
  };
  onReInvoke: (question: string, school: string) => void;
  openSocialShare: (title: string, text: string, url?: string) => void;
  setPurgingAll: (open: boolean) => void;
  setDbToast: (toast: { message: string; type: "success" | "error" | "warning"; id: number } | null) => void;
  downloadPDF?: (recordsToExport?: PastInquiry[], options?: PdfExportOptions) => void;
}

export default function ConsultationChroniclesDrawer({
  isOpen,
  onClose,
  pastInquiries,
  setPastInquiries,
  activeTheme,
  onReInvoke,
  openSocialShare,
  setPurgingAll,
  setDbToast,
  downloadPDF: downloadPDFProp
}: ConsultationChroniclesDrawerProps) {
  // Local UI & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState("all");
  const [selectedZodiacFilter, setSelectedZodiacFilter] = useState("all");
  const [selectedTagFilter, setSelectedTagFilter] = useState("all");
  const [selectedDatePreset, setSelectedDatePreset] = useState<"all" | "7days" | "30days">("all");
  const [sortBy, setSortBy] = useState<ChronicleSortOption>("newest");
  const [showTimelineChart, setShowTimelineChart] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(40);

  // Batch Tagging & Individual Tagging States
  const [batchTagInput, setBatchTagInput] = useState("");
  const [batchTagToRemove, setBatchTagToRemove] = useState("");
  const [showBatchTagPanel, setShowBatchTagPanel] = useState(true);
  const [activeAddTagInquiryId, setActiveAddTagInquiryId] = useState<string | null>(null);
  const [singleTagInput, setSingleTagInput] = useState("");
  // Quick Notes editing state
  const [activeNoteInquiryId, setActiveNoteInquiryId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>("");

  const activeFiltersCount = (selectedSchoolFilter !== 'all' ? 1 : 0) + 
    (selectedZodiacFilter !== 'all' ? 1 : 0) + 
    (selectedTagFilter !== 'all' ? 1 : 0) + 
    (selectedDatePreset !== 'all' ? 1 : 0) +
    (sortBy !== 'newest' ? 1 : 0);

  // PDF Customization & Title Page States
  const [seekerName, setSeekerName] = useState<string>(() => {
    return localStorage.getItem("oracle-pdf-seeker-name") || "Jerry Ben Salazar";
  });
  const [includeTitlePage, setIncludeTitlePage] = useState<boolean>(true);
  const [includeSummary, setIncludeSummary] = useState<boolean>(true);
  const [customSubtitle, setCustomSubtitle] = useState<string>("");
  const [showPdfSettingsModal, setShowPdfSettingsModal] = useState<boolean>(false);
  
  // Expanded Card details state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readingModalInquiry, setReadingModalInquiry] = useState<PastInquiry | null>(null);

  // Comparison State
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Semantic Search State
  const [isSemanticSearching, setIsSemanticSearching] = useState(false);
  const [semanticScores, setSemanticScores] = useState<Record<string, { score: number; reason: string }> | null>(null);

  // Copy & Voice states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isDictating, setIsDictating] = useState(false);

  // CSV Export & Progress States
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvExportProgress, setCsvExportProgress] = useState(0);
  const [csvProcessedCount, setCsvProcessedCount] = useState(0);
  const [csvTotalCount, setCsvTotalCount] = useState(0);
  const [csvSuccessToast, setCsvSuccessToast] = useState<{
    show: boolean;
    recordCount: number;
    filename: string;
    fileSizeKB: string;
    timestamp: string;
  } | null>(null);

  // Reset semantic search when query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSemanticScores(null);
    }
  }, [searchQuery]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (readingModalInquiry) {
          setReadingModalInquiry(null);
        } else if (showComparisonModal) {
          setShowComparisonModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, readingModalInquiry, showComparisonModal, onClose]);

  // Extract list of unique traditions / schools with inquiry counts
  const availableSchoolsWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    pastInquiries.forEach(iq => {
      if (iq.school) {
        map.set(iq.school, (map.get(iq.school) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [pastInquiries]);

  const availableSchools = useMemo(() => {
    return availableSchoolsWithCounts.map(s => s.name);
  }, [availableSchoolsWithCounts]);

  // Extract list of zodiac signs for filtering (12 canonical signs + custom ones with counts)
  const availableZodiacs = useMemo(() => {
    const list: Array<{ name: string; symbol: string; count: number }> = ALL_ZODIAC_SIGNS.map(z => ({
      name: z.name,
      symbol: z.symbol,
      count: pastInquiries.filter(i => i.zodiacSign && i.zodiacSign.toLowerCase() === z.name.toLowerCase()).length
    }));

    // Find any custom zodiac signs in pastInquiries that aren't in canonical list
    const canonicalNames = new Set(ALL_ZODIAC_SIGNS.map(z => z.name.toLowerCase()));
    const customSigns = new Set<string>();
    pastInquiries.forEach(iq => {
      if (iq.zodiacSign && !canonicalNames.has(iq.zodiacSign.toLowerCase())) {
        customSigns.add(iq.zodiacSign);
      }
    });

    Array.from(customSigns).sort().forEach(cName => {
      list.push({
        name: cName,
        symbol: '✨',
        count: pastInquiries.filter(i => i.zodiacSign && i.zodiacSign.toLowerCase() === cName.toLowerCase()).length
      });
    });

    return list;
  }, [pastInquiries]);

  // Extract list of all unique custom tags with inquiry counts
  const availableTagsWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    pastInquiries.forEach(iq => {
      if (Array.isArray(iq.tags)) {
        iq.tags.forEach(t => {
          const clean = typeof t === 'string' ? t.trim() : '';
          if (clean) {
            map.set(clean, (map.get(clean) || 0) + 1);
          }
        });
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [pastInquiries]);

  // Execute AI Semantic Search using server endpoint
  const handleRunSemanticSearch = async () => {
    if (!searchQuery.trim() || pastInquiries.length === 0) return;
    setIsSemanticSearching(true);
    try {
      const res = await fetch("/api/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          inquiries: pastInquiries.map(iq => ({
            id: iq.id,
            question: iq.question,
            answer: iq.answer
          }))
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const scores: Record<string, { score: number; reason: string }> = {};
      if (Array.isArray(data.results)) {
        data.results.forEach((resItem: any) => {
          scores[resItem.id] = {
            score: typeof resItem.score === 'number' ? resItem.score : 0,
            reason: resItem.reason || "Thematic resonance detected."
          };
        });
      }
      setSemanticScores(scores);
    } catch (err) {
      console.warn("[Semantic Search] Falling back to client matching:", err);
      const scores: Record<string, { score: number; reason: string }> = {};
      const queryLower = searchQuery.toLowerCase();
      pastInquiries.forEach(iq => {
        const qText = iq.question.toLowerCase();
        const aText = iq.answer.toLowerCase();
        let score = 0;
        let reason = "Thematic connection scan completed.";
        if (qText.includes(queryLower) && aText.includes(queryLower)) {
          score = 0.95;
          reason = "Keywords matched both inquiry and answer text.";
        } else if (qText.includes(queryLower)) {
          score = 0.85;
          reason = "Keywords matched the inquiry prompt.";
        } else if (aText.includes(queryLower)) {
          score = 0.75;
          reason = "Keywords matched the channeled revelation.";
        }
        scores[iq.id] = { score, reason };
      });
      setSemanticScores(scores);
    } finally {
      setIsSemanticSearching(false);
    }
  };

  // Filter & Sort Inquiries
  const filteredInquiries = useMemo(() => {
    let result = [...pastInquiries];

    // 1. Keyword search / Semantic filter
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      if (semanticScores) {
        // Sort by semantic score if semantic search was run
        result = result.filter(iq => (semanticScores[iq.id]?.score || 0) > 0.2 || iq.question.toLowerCase().includes(qLower) || iq.answer.toLowerCase().includes(qLower));
      } else {
        result = result.filter(iq => 
          iq.question.toLowerCase().includes(qLower) ||
          iq.answer.toLowerCase().includes(qLower) ||
          (iq.school && iq.school.toLowerCase().includes(qLower)) ||
          (iq.zodiacSign && iq.zodiacSign.toLowerCase().includes(qLower)) ||
          (Array.isArray(iq.tags) && iq.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(qLower)))
        );
      }
    }

    // 2. School Filter
    if (selectedSchoolFilter !== "all") {
      result = result.filter(iq => iq.school === selectedSchoolFilter);
    }

    // 2.5 Zodiac Sign Filter
    if (selectedZodiacFilter !== "all") {
      result = result.filter(iq => iq.zodiacSign === selectedZodiacFilter);
    }

    // 2.75 Tag Filter
    if (selectedTagFilter !== "all") {
      result = result.filter(iq => Array.isArray(iq.tags) && iq.tags.some(t => typeof t === 'string' && t.toLowerCase() === selectedTagFilter.toLowerCase()));
    }

    // 3. Date Preset Filter
    if (selectedDatePreset !== "all") {
      const now = Date.now();
      const cutoff = selectedDatePreset === "7days" 
        ? now - (7 * 24 * 60 * 60 * 1000) 
        : now - (30 * 24 * 60 * 60 * 1000);

      result = result.filter(iq => {
        const d = new Date(iq.timestamp).getTime();
        return !isNaN(d) && d >= cutoff;
      });
    }

    // Helper to get timestamp in milliseconds to strictly prioritize newest records
    const parseTime = (ts: string, id?: string) => {
      if (ts) {
        if (/^\d{10,}$/.test(ts.trim())) {
          return parseInt(ts.trim(), 10);
        }
        const d = new Date(ts).getTime();
        if (!isNaN(d) && d > 0) return d;
        try {
          const cleaned = ts.replace(/[^\w\s\d,:/.-]/g, '').trim();
          const d2 = new Date(cleaned).getTime();
          if (!isNaN(d2) && d2 > 0) return d2;
        } catch (e) {}
      }
      if (id) {
        const idMatch = id.match(/\d{10,}/);
        if (idMatch) return parseInt(idMatch[0], 10);
      }
      return 0;
    };

    // 4. Sorting - strictly prioritizing newest records first by default
    result.sort((a, b) => {
      if (semanticScores && searchQuery.trim()) {
        const scoreA = semanticScores[a.id]?.score || 0;
        const scoreB = semanticScores[b.id]?.score || 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
      }

      if (sortBy === "oldest") {
        return parseTime(a.timestamp, a.id) - parseTime(b.timestamp, b.id);
      }
      if (sortBy === "alphabetical") {
        return a.question.localeCompare(b.question);
      }
      if (sortBy === "zodiac-asc") {
        // Astrological Zodiac wheel order: Aries (1) to Pisces (12)
        const signA = (a.zodiacSign || '').trim().toLowerCase();
        const signB = (b.zodiacSign || '').trim().toLowerCase();
        const orderA = signA ? (ZODIAC_CANONICAL_ORDER[signA] || 99) : 999;
        const orderB = signB ? (ZODIAC_CANONICAL_ORDER[signB] || 99) : 999;
        if (orderA !== orderB) return orderA - orderB;
        // Sub-sort by date newest first within same sign
        return parseTime(b.timestamp, b.id) - parseTime(a.timestamp, a.id);
      }
      if (sortBy === "zodiac-desc") {
        // Reverse Astrological Zodiac wheel order: Pisces (12) to Aries (1)
        const signA = (a.zodiacSign || '').trim().toLowerCase();
        const signB = (b.zodiacSign || '').trim().toLowerCase();
        const orderA = signA ? (ZODIAC_CANONICAL_ORDER[signA] || -1) : -999;
        const orderB = signB ? (ZODIAC_CANONICAL_ORDER[signB] || -1) : -999;
        if (orderA !== orderB) return orderB - orderA;
        return parseTime(b.timestamp, b.id) - parseTime(a.timestamp, a.id);
      }
      if (sortBy === "zodiac-alpha") {
        // Alphabetical sort by Zodiac sign name (A-Z)
        const signA = (a.zodiacSign || 'zzz').trim();
        const signB = (b.zodiacSign || 'zzz').trim();
        const cmp = signA.localeCompare(signB);
        if (cmp !== 0) return cmp;
        return parseTime(b.timestamp, b.id) - parseTime(a.timestamp, a.id);
      }
      // Default newest: newest timestamp first
      const timeDiff = parseTime(b.timestamp, b.id) - parseTime(a.timestamp, a.id);
      if (timeDiff !== 0) return timeDiff;
      return (b.id || '').localeCompare(a.id || '');
    });

    return result;
  }, [pastInquiries, searchQuery, selectedSchoolFilter, selectedZodiacFilter, selectedTagFilter, selectedDatePreset, sortBy, semanticScores]);

  // Multi-Record Selection State for Custom PDF Export
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);

  // Toggle selection for a single record
  const toggleRecordSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedRecordIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Check if all currently filtered inquiries are selected
  const isAllFilteredSelected = useMemo(() => {
    if (filteredInquiries.length === 0) return false;
    return filteredInquiries.every(iq => selectedRecordIds.includes(iq.id));
  }, [filteredInquiries, selectedRecordIds]);

  // Select/Deselect all currently filtered records
  const handleToggleSelectAllFiltered = () => {
    const currentFilteredIds = filteredInquiries.map(iq => iq.id);
    if (isAllFilteredSelected) {
      setSelectedRecordIds(prev => prev.filter(id => !currentFilteredIds.includes(id)));
    } else {
      setSelectedRecordIds(prev => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedRecordIds([]);
  };

  // Tags currently present on any of the selected records
  const tagsOnSelectedRecords = useMemo(() => {
    const map = new Map<string, number>();
    const selectedRecords = pastInquiries.filter(iq => selectedRecordIds.includes(iq.id));
    selectedRecords.forEach(iq => {
      if (Array.isArray(iq.tags)) {
        iq.tags.forEach(t => {
          const clean = typeof t === 'string' ? t.trim() : '';
          if (clean) {
            map.set(clean, (map.get(clean) || 0) + 1);
          }
        });
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [pastInquiries, selectedRecordIds]);

  // Batch Apply Tag to all selected records
  const handleBatchApplyTag = (tagCandidate?: string) => {
    const tagToApply = (tagCandidate !== undefined ? tagCandidate : batchTagInput).trim();
    if (!tagToApply) {
      setDbToast({
        message: "Please enter or select a tag name to apply.",
        type: "warning",
        id: Date.now()
      });
      return;
    }
    if (selectedRecordIds.length === 0) {
      setDbToast({
        message: "No consultation records selected. Check records to apply batch tag.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    let modifiedCount = 0;
    const updated = pastInquiries.map(iq => {
      if (selectedRecordIds.includes(iq.id)) {
        const existingTags = Array.isArray(iq.tags) ? [...iq.tags] : [];
        if (!existingTags.some(t => t.toLowerCase() === tagToApply.toLowerCase())) {
          modifiedCount++;
          return {
            ...iq,
            tags: [...existingTags, tagToApply]
          };
        }
      }
      return iq;
    });

    setPastInquiries(updated);
    try {
      localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
    } catch (e) {
      console.warn("Error storing past inquiries:", e);
    }
    setBatchTagInput("");
    setDbToast({
      message: modifiedCount > 0
        ? `Applied tag "${tagToApply}" to ${modifiedCount} selected record(s).`
        : `Tag "${tagToApply}" is already assigned to all ${selectedRecordIds.length} selected record(s).`,
      type: "success",
      id: Date.now()
    });
  };

  // Batch Remove Tag from all selected records
  const handleBatchRemoveTag = (tagCandidate?: string) => {
    const tagToRemove = (tagCandidate !== undefined ? tagCandidate : batchTagToRemove).trim();
    if (!tagToRemove) {
      setDbToast({
        message: "Please select a tag to remove from selected records.",
        type: "warning",
        id: Date.now()
      });
      return;
    }
    if (selectedRecordIds.length === 0) {
      setDbToast({
        message: "No consultation records selected. Check records to batch edit tags.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    let modifiedCount = 0;
    const updated = pastInquiries.map(iq => {
      if (selectedRecordIds.includes(iq.id) && Array.isArray(iq.tags)) {
        if (iq.tags.some(t => t.toLowerCase() === tagToRemove.toLowerCase())) {
          modifiedCount++;
          return {
            ...iq,
            tags: iq.tags.filter(t => t.toLowerCase() !== tagToRemove.toLowerCase())
          };
        }
      }
      return iq;
    });

    setPastInquiries(updated);
    try {
      localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
    } catch (e) {
      console.warn("Error storing past inquiries:", e);
    }

    if (batchTagToRemove.toLowerCase() === tagToRemove.toLowerCase()) {
      setBatchTagToRemove("");
    }

    setDbToast({
      message: modifiedCount > 0
        ? `Removed tag "${tagToRemove}" from ${modifiedCount} selected record(s).`
        : `Tag "${tagToRemove}" was not found on any selected records.`,
      type: "success",
      id: Date.now()
    });
  };

  // Batch Clear All Tags from selected records
  const handleBatchClearAllTags = () => {
    if (selectedRecordIds.length === 0) return;
    let count = 0;
    const updated = pastInquiries.map(iq => {
      if (selectedRecordIds.includes(iq.id) && iq.tags && iq.tags.length > 0) {
        count++;
        return { ...iq, tags: [] };
      }
      return iq;
    });
    setPastInquiries(updated);
    try {
      localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
    } catch (e) {}
    setDbToast({
      message: `Cleared all tags from ${count} selected record(s).`,
      type: "success",
      id: Date.now()
    });
  };

  // Add Tag to Single Record
  const handleAddTagToSingle = (id: string, tagCandidate: string) => {
    const cleanTag = tagCandidate.trim();
    if (!cleanTag) return;
    let added = false;
    const updated = pastInquiries.map(iq => {
      if (iq.id === id) {
        const existing = Array.isArray(iq.tags) ? [...iq.tags] : [];
        if (!existing.some(t => t.toLowerCase() === cleanTag.toLowerCase())) {
          added = true;
          const next = { ...iq, tags: [...existing, cleanTag] };
          if (readingModalInquiry && readingModalInquiry.id === id) {
            setReadingModalInquiry(next);
          }
          return next;
        }
      }
      return iq;
    });
    if (added) {
      setPastInquiries(updated);
      try {
        localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
      } catch (e) {}
      setDbToast({
        message: `Tag "${cleanTag}" added to record.`,
        type: "success",
        id: Date.now()
      });
    }
    setActiveAddTagInquiryId(null);
    setSingleTagInput("");
  };

  // Save Quick Note for Single Record
  const handleSaveQuickNote = (id: string, newNotes: string) => {
    const trimmed = newNotes.trim();
    const updated = pastInquiries.map(iq => {
      if (iq.id === id) {
        const next = { ...iq, notes: trimmed };
        if (readingModalInquiry && readingModalInquiry.id === id) {
          setReadingModalInquiry(next);
        }
        return next;
      }
      return iq;
    });
    setPastInquiries(updated);
    try {
      localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
    } catch (e) {}
    setActiveNoteInquiryId(null);
    setNoteInput("");
    setDbToast({
      message: trimmed ? "Quick insight note saved." : "Quick note removed.",
      type: "success",
      id: Date.now()
    });
  };

  // Remove Tag from Single Record
  const handleRemoveTagFromSingle = (id: string, tagToRemove: string) => {
    const updated = pastInquiries.map(iq => {
      if (iq.id === id && Array.isArray(iq.tags)) {
        const next = {
          ...iq,
          tags: iq.tags.filter(t => t.toLowerCase() !== tagToRemove.toLowerCase())
        };
        if (readingModalInquiry && readingModalInquiry.id === id) {
          setReadingModalInquiry(next);
        }
        return next;
      }
      return iq;
    });
    setPastInquiries(updated);
    try {
      localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
    } catch (e) {}
    setDbToast({
      message: `Tag "${tagToRemove}" removed from record.`,
      type: "success",
      id: Date.now()
    });
  };

  // Download Selected as PDF
  const handleDownloadSelectedPDF = () => {
    const selectedRecords = pastInquiries.filter(iq => selectedRecordIds.includes(iq.id));
    if (selectedRecords.length === 0) {
      setDbToast({
        message: "Please select at least one consultation record with the checkboxes to download as PDF.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    handleTriggerDownloadPDF(selectedRecords);
  };
  const handleDeleteSingle = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await fetch(`/api/consultations/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("Failed to delete record on server:", err);
    }

    setPastInquiries(prev => {
      const updated = prev.filter(iq => iq.id !== id);
      localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
      return updated;
    });

    if (comparisonIds.includes(id)) {
      setComparisonIds(prev => prev.filter(i => i !== id));
    }
    if (selectedRecordIds.includes(id)) {
      setSelectedRecordIds(prev => prev.filter(i => i !== id));
    }

    setDbToast({
      message: "Consultation record removed from chronicles.",
      type: "success",
      id: Date.now()
    });
  };

  // Copy inquiry text
  const handleCopyInquiry = (iq: PastInquiry, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const formatted = `### Consultation Inquiry\n**Question:** ${iq.question}\n**Scholarship:** ${iq.school}\n**Timestamp:** ${iq.timestamp}\n\n### Channeled Revelation\n${iq.answer}`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(iq.id);
    setTimeout(() => setCopiedId(null), 2000);
    setDbToast({
      message: "Consultation revelation copied to clipboard.",
      type: "success",
      id: Date.now()
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    if (pastInquiries.length === 0) return;
    const jsonStr = JSON.stringify(pastInquiries, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation_chronicles_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDbToast({
      message: `Exported ${pastInquiries.length} consultation chronicles to JSON file.`,
      type: "success",
      id: Date.now()
    });
  };

  // Export Markdown
  const handleExportMarkdown = () => {
    if (pastInquiries.length === 0) return;
    let md = `# Consultation Chronicles\n*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
    pastInquiries.forEach((iq, idx) => {
      md += `## ${idx + 1}. ${iq.question}\n`;
      md += `- **Scholarship:** ${iq.school}\n`;
      md += `- **Timestamp:** ${iq.timestamp}\n`;
      if (iq.zodiacSign) md += `- **Zodiac Alignment:** ${iq.zodiacSign}\n`;
      md += `\n### Revelation\n${iq.answer}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation_chronicles_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setDbToast({
      message: `Exported ${pastInquiries.length} consultation records to Markdown file.`,
      type: "success",
      id: Date.now()
    });
  };

  // Export CSV for Spreadsheet Analysis with Chunked Progress & Success Toast
  const handleExportCSV = () => {
    const listToExport = filteredInquiries.length > 0 ? filteredInquiries : pastInquiries;
    if (listToExport.length === 0) {
      setDbToast({
        message: "No consultation records available to export as CSV.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    if (isExportingCSV) return;

    setIsExportingCSV(true);
    setCsvExportProgress(0);
    setCsvProcessedCount(0);
    setCsvTotalCount(listToExport.length);
    setCsvSuccessToast(null);

    // CSV Column Headers
    const headers = [
      "Record ID",
      "Timestamp",
      "School of Thought",
      "Zodiac Sign",
      "Tags",
      "Inquiry Question",
      "Channeled Revelation",
      "Mystical Metrics Metadata",
      "Spiritus Metric",
      "Ignis Metric",
      "Aqua Metric",
      "Aer Metric",
      "Materia Metric",
      "Balance Interpretation"
    ];

    // Helper to safely escape CSV cell string
    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const total = listToExport.length;
    const rows: string[] = [];
    // Scale chunk size dynamically to guarantee smooth progress bar visual animation
    const chunkSize = Math.max(1, Math.min(20, Math.ceil(total / 15)));
    let currentIndex = 0;

    const processNextChunk = () => {
      const endIndex = Math.min(currentIndex + chunkSize, total);

      for (let i = currentIndex; i < endIndex; i++) {
        const iq = listToExport[i];
        const metricsMap: Record<string, number> = {};
        if (Array.isArray(iq.metrics)) {
          iq.metrics.forEach(m => {
            if (m.subject && typeof m.value === 'number') {
              metricsMap[m.subject.toLowerCase()] = m.value;
            }
          });
        }

        const mysticalMetricsSummary = Array.isArray(iq.metrics) && iq.metrics.length > 0
          ? iq.metrics.map(m => `${m.subject}: ${m.value}`).join(' | ')
          : [
              metricsMap['spiritus'] !== undefined ? `Spiritus: ${metricsMap['spiritus']}` : null,
              metricsMap['ignis'] !== undefined ? `Ignis: ${metricsMap['ignis']}` : null,
              metricsMap['aqua'] !== undefined ? `Aqua: ${metricsMap['aqua']}` : null,
              metricsMap['aer'] !== undefined ? `Aer: ${metricsMap['aer']}` : null,
              metricsMap['materia'] !== undefined ? `Materia: ${metricsMap['materia']}` : null,
            ].filter(Boolean).join(' | ') || 'N/A';

        rows.push([
          escapeCSV(iq.id),
          escapeCSV(iq.timestamp),
          escapeCSV(iq.school || ''),
          escapeCSV(iq.zodiacSign || ''),
          escapeCSV(Array.isArray(iq.tags) ? iq.tags.join('; ') : ''),
          escapeCSV(iq.question || ''),
          escapeCSV(iq.answer || ''),
          escapeCSV(mysticalMetricsSummary),
          escapeCSV(metricsMap['spiritus'] ?? ''),
          escapeCSV(metricsMap['ignis'] ?? ''),
          escapeCSV(metricsMap['aqua'] ?? ''),
          escapeCSV(metricsMap['aer'] ?? ''),
          escapeCSV(metricsMap['materia'] ?? ''),
          escapeCSV(iq.balanceInterpretation || '')
        ].join(','));
      }

      currentIndex = endIndex;
      const progressPercent = Math.min(100, Math.round((currentIndex / total) * 100));
      setCsvProcessedCount(currentIndex);
      setCsvExportProgress(progressPercent);

      if (currentIndex < total) {
        // Schedule next chunk to keep UI thread responsive and animate progress bar
        setTimeout(processNextChunk, 20);
      } else {
        // Finalize CSV file creation and trigger download
        setTimeout(() => {
          const filename = `consultation_chronicles_${new Date().toISOString().slice(0, 10)}.csv`;
          const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n'); // UTF-8 BOM
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const fileSizeKB = (blob.size / 1024).toFixed(1);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);

          setIsExportingCSV(false);

          // Success toast notification
          const toastMsg = `Successfully exported ${total} consultation ${total === 1 ? 'record' : 'records'} (${fileSizeKB} KB) to CSV spreadsheet!`;
          setDbToast({
            message: toastMsg,
            type: "success",
            id: Date.now()
          });

          setCsvSuccessToast({
            show: true,
            recordCount: total,
            filename,
            fileSizeKB,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          });

          // Auto-hide in-drawer success toast after 6 seconds
          setTimeout(() => {
            setCsvSuccessToast(prev => prev ? { ...prev, show: false } : null);
          }, 6000);
        }, 100);
      }
    };

    // Begin chunked processing
    setTimeout(processNextChunk, 30);
  };

  // Text-To-Speech Voice Conversation Recitation
  const handleSpeakInquiry = (id: string, textToSpeak: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      setDbToast({
        message: "Voice speech synthesis is not supported in this browser.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingId(id);

    // Clean text for speech output
    const cleanText = textToSpeak.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
    setDbToast({
      message: "Vocal recitation initialized.",
      type: "success",
      id: Date.now()
    });
  };

  // Voice Dictation Search for Chronicles
  const handleToggleVoiceSearch = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setDbToast({
        message: "Voice recognition is not supported in this browser.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    try {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsDictating(true);
        setDbToast({
          message: "Listening... Speak your search query or tradition.",
          type: "success",
          id: Date.now()
        });
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setSearchQuery(resultText);
          setDbToast({
            message: `Voice captured: "${resultText}"`,
            type: "success",
            id: Date.now()
          });
        }
        setIsDictating(false);
      };

      rec.onerror = () => {
        setIsDictating(false);
        setDbToast({
          message: "Voice search error or microphone permission denied.",
          type: "error",
          id: Date.now()
        });
      };

      rec.onend = () => {
        setIsDictating(false);
      };

      rec.start();
    } catch (err) {
      setIsDictating(false);
      setDbToast({
        message: "Failed to start voice recognition.",
        type: "error",
        id: Date.now()
      });
    }
  };

  // Export PDF Report
  const handleTriggerDownloadPDF = (recordsToExport?: PastInquiry[], overrideOptions?: Partial<PdfExportOptions>) => {
    const listToExport = recordsToExport && recordsToExport.length > 0 
      ? recordsToExport 
      : (filteredInquiries.length > 0 ? filteredInquiries : pastInquiries);

    if (!listToExport || listToExport.length === 0) {
      setDbToast({
        message: "No consultation records available to export as PDF.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    const currentSeekerName = (overrideOptions?.seekerName || seekerName || "Jerry Ben Salazar").trim();
    localStorage.setItem("oracle-pdf-seeker-name", currentSeekerName);

    const exportOptions: PdfExportOptions = {
      seekerName: currentSeekerName,
      includeTitlePage: overrideOptions?.includeTitlePage !== undefined ? overrideOptions.includeTitlePage : includeTitlePage,
      includeSummary: overrideOptions?.includeSummary !== undefined ? overrideOptions.includeSummary : includeSummary,
      customSubtitle: overrideOptions?.customSubtitle !== undefined ? overrideOptions.customSubtitle : (customSubtitle || undefined),
      ...overrideOptions
    };

    if (downloadPDFProp) {
      downloadPDFProp(listToExport, exportOptions);
      setDbToast({
        message: `Exported ${listToExport.length} ${listToExport.length === 1 ? 'record' : 'records'} as a stylized PDF for ${currentSeekerName}!`,
        type: "success",
        id: Date.now()
      });
      return;
    }

    // Fallback internal generation using chroniclePdfExport module
    try {
      const doc = generateChroniclePdf(listToExport, exportOptions);
      const sanitizedName = currentSeekerName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      doc.save(`sacred_consultation_chronicles_${sanitizedName}.pdf`);
      setDbToast({
        message: `Exported ${listToExport.length} ${listToExport.length === 1 ? 'record' : 'records'} as a stylized PDF report for ${currentSeekerName}!`,
        type: "success",
        id: Date.now()
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      setDbToast({
        message: "Failed to generate PDF report.",
        type: "error",
        id: Date.now()
      });
    }
  };

  // Dedicated function to Export All Records as PDF leveraging chroniclePdfExport
  const handleExportAllRecordsPDF = () => {
    if (!pastInquiries || pastInquiries.length === 0) {
      setDbToast({
        message: "No consultation records in the archives to export.",
        type: "warning",
        id: Date.now()
      });
      return;
    }

    const currentSeekerName = (seekerName || "Jerry Ben Salazar").trim();
    localStorage.setItem("oracle-pdf-seeker-name", currentSeekerName);

    const exportOptions: PdfExportOptions = {
      seekerName: currentSeekerName,
      includeTitlePage,
      includeSummary,
      customSubtitle: customSubtitle || `Complete Archival Consultation Chronicles (${pastInquiries.length} Sacred Records)`,
      filename: `sacred_chronicles_complete_${pastInquiries.length}_records_${currentSeekerName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`
    };

    if (downloadPDFProp) {
      downloadPDFProp(pastInquiries, exportOptions);
      setDbToast({
        message: `Exported all ${pastInquiries.length} records as a complete PDF chronicle for ${currentSeekerName}!`,
        type: "success",
        id: Date.now()
      });
      return;
    }

    // Direct generation leveraging chroniclePdfExport utility
    try {
      const doc = generateChroniclePdf(pastInquiries, exportOptions);
      const sanitizedName = currentSeekerName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      doc.save(`sacred_chronicles_complete_${pastInquiries.length}_records_${sanitizedName}.pdf`);
      setDbToast({
        message: `Successfully exported all ${pastInquiries.length} consultation records as PDF for ${currentSeekerName}!`,
        type: "success",
        id: Date.now()
      });
    } catch (err) {
      console.error("PDF all-records generation error:", err);
      setDbToast({
        message: "Failed to generate complete PDF chronicle.",
        type: "error",
        id: Date.now()
      });
    }
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          let addedCount = 0;
          const merged = [...pastInquiries];
          for (const item of parsed) {
            if (item.question && item.answer) {
              const itemToSave: PastInquiry = {
                id: item.id || ("imp-" + Math.random().toString(36).substring(2, 9)),
                question: item.question,
                answer: item.answer,
                school: item.school || "Celestial",
                timestamp: item.timestamp || new Date().toLocaleString(),
                zodiacSign: item.zodiacSign || "",
                balanceInterpretation: item.balanceInterpretation || ""
              };
              const exists = merged.some(m => m.id === itemToSave.id || (m.question === itemToSave.question && m.answer === itemToSave.answer));
              if (!exists) {
                merged.unshift(itemToSave);
                addedCount++;
                // Sync with server if connected
                try {
                  await fetch("/api/ask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      question: itemToSave.question,
                      answer: itemToSave.answer,
                      school: itemToSave.school,
                      birthDate: "",
                      zodiacSign: itemToSave.zodiacSign || "",
                      id: itemToSave.id
                    })
                  });
                } catch (err) {}
              }
            }
          }
          setPastInquiries(merged);
          localStorage.setItem("oracle-past-inquiries", JSON.stringify(merged));
          setDbToast({
            message: `Successfully imported ${addedCount} new consultation records!`,
            type: "success",
            id: Date.now()
          });
        }
      } catch (err) {
        setDbToast({
          message: "Failed to parse imported file. Please upload a valid JSON file.",
          type: "error",
          id: Date.now()
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Toggle selection for comparison mode
  const toggleComparisonSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setComparisonIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  if (!isOpen) return null;

  const compRecord1 = pastInquiries.find(i => i.id === comparisonIds[0]);
  const compRecord2 = pastInquiries.find(i => i.id === comparisonIds[1]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex justify-end">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="consultation-chronicles-drawer relative w-full max-w-4xl h-full bg-[#08080a] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden text-left z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-black/60 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  activeTheme.id === 'deep-void' 
                    ? 'bg-violet-950/40 border-violet-500/30 text-violet-300' 
                    : activeTheme.id === 'ethereal-silver' 
                    ? 'bg-slate-900/40 border-slate-500/30 text-slate-200' 
                    : 'bg-amber-950/40 border-[#D4AF37]/30 text-[#D4AF37]'
                }`}>
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-100">
                      Consultation Chronicles
                    </h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                      activeTheme.id === 'deep-void' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {pastInquiries.length} {pastInquiries.length === 1 ? 'Record' : 'Records'}
                    </span>
                  </div>
                  <p className="text-xs font-serif text-slate-400 mt-0.5">
                    Sacred repository of past inquiries, channeled revelations, and celestial alignments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPurgingAll(true)}
                  disabled={pastInquiries.length === 0}
                  className="px-3 py-1.5 rounded-xl border border-red-500/40 bg-red-950/40 hover:bg-red-900/60 text-red-200 hover:text-red-100 font-serif font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-950/40 hover:border-red-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-950/40"
                  title="Purge all saved consultation records (Triggers irreversible confirmation dialog)"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span className="hidden sm:inline">Clear All Chronicles</span>
                  <span className="sm:hidden">Clear All</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/10 transition-all cursor-pointer"
                  title="Close Chronicles Drawer (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs font-serif">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Dedicated 'Export All Records as PDF' Button */}
                <button
                  onClick={handleExportAllRecordsPDF}
                  disabled={pastInquiries.length === 0}
                  className="px-3.5 py-1.5 rounded-lg border border-amber-400/60 bg-gradient-to-r from-amber-600/30 via-yellow-600/25 to-amber-700/30 hover:from-amber-600/50 hover:to-yellow-600/40 text-amber-100 hover:text-white font-serif font-bold text-xs shadow-md shadow-amber-950/40 hover:border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  title={`Export all ${pastInquiries.length} historical consultation chronicles as a complete archival PDF for ${seekerName}`}
                >
                  <FileDown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Export All Records as PDF</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300/90 border border-amber-500/20">
                    {pastInquiries.length}
                  </span>
                </button>

                {/* Download Selected as PDF (when checkboxes checked) */}
                {selectedRecordIds.length > 0 && (
                  <button
                    onClick={handleDownloadSelectedPDF}
                    className="px-3.5 py-1.5 rounded-lg border border-amber-300 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-serif font-bold text-xs shadow-lg shadow-amber-950/50 hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                    title={`Export ${selectedRecordIds.length} checked record(s) as a custom PDF report for ${seekerName}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-950" />
                    <span>Download Selected ({selectedRecordIds.length})</span>
                  </button>
                )}

                {/* Filtered View PDF (when search/tradition filter is active and not all records shown) */}
                {filteredInquiries.length !== pastInquiries.length && selectedRecordIds.length === 0 && (
                  <button
                    onClick={() => handleTriggerDownloadPDF(filteredInquiries)}
                    disabled={filteredInquiries.length === 0}
                    className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 text-xs font-serif transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    title={`Export current filtered view (${filteredInquiries.length} records) as PDF`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export Filtered ({filteredInquiries.length})</span>
                  </button>
                )}

                {/* PDF Title Page & Summary Options */}
                <button
                  onClick={() => setShowPdfSettingsModal(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-black/40 hover:bg-amber-950/40 text-amber-300 hover:text-amber-200 text-xs font-serif transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Configure Title Page Seeker Name & Collection Summary Settings"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">PDF Options</span>
                </button>

                {/* Export JSON */}
                <button
                  onClick={handleExportJSON}
                  disabled={pastInquiries.length === 0}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/10 text-slate-300 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Export all chronicles as JSON"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export JSON</span>
                </button>

                {/* Export Markdown */}
                <button
                  onClick={handleExportMarkdown}
                  disabled={pastInquiries.length === 0}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/10 text-slate-300 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Export all chronicles as Markdown document"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Export Markdown</span>
                </button>

                {/* Export CSV for Spreadsheet Analysis */}
                <button
                  onClick={handleExportCSV}
                  disabled={pastInquiries.length === 0 || isExportingCSV}
                  className={`px-3 py-1.5 rounded-lg border font-serif font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isExportingCSV
                      ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-md shadow-emerald-950/50 animate-pulse'
                      : 'border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-200 hover:border-emerald-400'
                  } disabled:opacity-40`}
                  title="Export all historical inquiries into a downloadable CSV spreadsheet for data & metric analysis"
                >
                  {isExportingCSV ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                      <span>Exporting ({csvExportProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Export CSV</span>
                    </>
                  )}
                </button>

                {/* Import File Button */}
                <label className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/10 text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import Records</span>
                  <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>

                {/* Compare Button */}
                {comparisonIds.length > 0 && (
                  <button
                    onClick={() => {
                      if (comparisonIds.length === 2) {
                        setShowComparisonModal(true);
                      } else {
                        setDbToast({
                          message: "Please select a second consultation record to compare.",
                          type: "warning",
                          id: Date.now()
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      comparisonIds.length === 2
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-950/40 animate-pulse'
                        : 'bg-white/[0.03] border-white/10 text-slate-400'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compare ({comparisonIds.length}/2)</span>
                  </button>
                )}
              </div>

              {/* Purge All */}
              <button
                onClick={() => setPurgingAll(true)}
                disabled={pastInquiries.length === 0}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-900/40 text-red-300 hover:border-red-400 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Purge All</span>
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Visual Progress Bar Banner for CSV Export */}
            <AnimatePresence>
              {isExportingCSV && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-[#051a12] border border-emerald-500/50 rounded-xl p-4 shadow-xl shadow-emerald-950/40 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-serif font-bold text-emerald-200 flex items-center gap-1.5">
                          <span>Compiling Consultation Chronicles CSV...</span>
                        </h4>
                        <p className="text-[10px] font-mono text-emerald-400/80">
                          Escaping records & metric coordinates ({csvProcessedCount} of {csvTotalCount})
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-900/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-md shadow-sm">
                      {csvExportProgress}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full bg-black/80 border border-emerald-500/30 rounded-full h-3 overflow-hidden p-0.5 relative shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-600 via-teal-400 to-amber-400 rounded-full shadow-sm shadow-emerald-400/50"
                      initial={{ width: "0%" }}
                      animate={{ width: `${csvExportProgress}%` }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
                      <span>Encoding UTF-8 BOM • Escaping Quotes</span>
                    </span>
                    <span className="text-emerald-300 font-semibold">
                      {csvExportProgress < 100 ? "Building spreadsheet rows..." : "Finalizing download trigger..."}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Drawer Success Toast Notification */}
            <AnimatePresence>
              {csvSuccessToast && csvSuccessToast.show && (
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  className="bg-[#051c13] border border-emerald-500/60 rounded-xl p-3.5 shadow-xl shadow-emerald-950/50 relative overflow-hidden flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-serif font-bold text-emerald-200 flex items-center gap-1.5">
                        <span>CSV Export Complete!</span>
                      </h4>
                      <span className="text-[9px] font-mono text-emerald-400/70">
                        {csvSuccessToast.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] font-serif text-slate-300 mt-0.5 leading-snug">
                      Successfully compiled <span className="font-bold text-emerald-300">{csvSuccessToast.recordCount}</span> consultation {csvSuccessToast.recordCount === 1 ? 'record' : 'records'} ({csvSuccessToast.fileSizeKB} KB).
                    </p>
                    <p className="text-[10px] font-mono text-emerald-400/80 mt-1 truncate">
                      File: <span className="underline">{csvSuccessToast.filename}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setCsvSuccessToast(prev => prev ? { ...prev, show: false } : null)}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    title="Dismiss toast notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {/* 1. Search & Filter Bar */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRunSemanticSearch();
                    }}
                    placeholder="Search past inquiries, revelations, keywords or speak..."
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 rounded-lg pl-9 pr-32 py-2 text-xs font-serif text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                  
                  <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1">
                    {/* Voice Dictation Search Button */}
                    <button
                      onClick={handleToggleVoiceSearch}
                      type="button"
                      className={`h-full px-2 rounded-md border text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                        isDictating
                          ? 'bg-rose-500/30 border-rose-500 text-rose-300 animate-pulse'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-500/30'
                      }`}
                      title={isDictating ? "Listening... Click to stop" : "Voice Dictation Search (Speak your query)"}
                    >
                      {isDictating ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-amber-400" />}
                      <span className="hidden sm:inline">{isDictating ? 'Listening' : 'Voice'}</span>
                    </button>

                    {/* AI Semantic Search trigger */}
                    <button
                      onClick={handleRunSemanticSearch}
                      disabled={isSemanticSearching || !searchQuery.trim()}
                      className="h-full px-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-[#D4AF37] text-[10px] font-mono font-semibold rounded-md transition-all flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                      title="Scan using AI semantic similarity"
                    >
                      <Sparkles className={`w-3 h-3 ${isSemanticSearching ? 'animate-spin' : ''}`} />
                      <span>{isSemanticSearching ? 'Scanning...' : 'AI Scan'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Sort Dropdown */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    id="chronicles-quick-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-2 text-xs font-serif text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    title="Sort order for consultation records"
                  >
                    <option value="newest">✦ Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="zodiac-asc">Zodiac (♈→♓)</option>
                    <option value="zodiac-desc">Zodiac (♓→♈)</option>
                    <option value="zodiac-alpha">Zodiac (A→Z)</option>
                  </select>

                  {/* Toggle Advanced Filters Button */}
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`px-3 py-2 rounded-lg border text-xs font-serif transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      showAdvancedFilters || activeFiltersCount > 0
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-sm'
                        : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                    title="Toggle School of Thought Traditions and Zodiac Wheel Filters"
                  >
                    <Filter className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Traditions & Filters</span>
                    <span className="sm:hidden">Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-black">
                        {activeFiltersCount}
                      </span>
                    )}
                    {showAdvancedFilters ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Deeper Filters: Traditions, Zodiac Wheel & Presets */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2 border-t border-white/5 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* School of Thought Tradition Dropdown Filter */}
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
                    <span className="flex items-center gap-1 text-amber-400/90 font-semibold uppercase tracking-wider">
                      <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                      SCHOOL OF THOUGHT
                    </span>
                    {selectedSchoolFilter !== 'all' ? (
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full text-[9px] font-bold border border-amber-500/40">
                        {pastInquiries.filter(i => i.school === selectedSchoolFilter).length} Records
                      </span>
                    ) : (
                      <span className="bg-white/5 text-slate-400 px-1.5 py-0.2 rounded-full text-[9px] font-mono">
                        {availableSchoolsWithCounts.length} Traditions
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedSchoolFilter}
                    onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                    className={`w-full bg-black/60 border rounded-lg px-3 py-2 text-xs font-serif focus:outline-none cursor-pointer transition-all ${
                      selectedSchoolFilter !== 'all'
                        ? 'border-amber-500/80 text-amber-300 font-semibold bg-amber-950/30 shadow-sm shadow-amber-500/20'
                        : 'border-white/10 text-slate-300 focus:border-amber-500/50'
                    }`}
                  >
                    <option value="all" className="bg-neutral-900 text-slate-200">
                      All School Traditions [{pastInquiries.length} total]
                    </option>
                    {availableSchoolsWithCounts.map((sch, idx) => (
                      <option key={`sch-opt-${sch.name}-${idx}`} value={sch.name} className="bg-neutral-900 text-slate-200">
                        {sch.name} — [{sch.count} {sch.count === 1 ? 'consultation' : 'consultations'}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Zodiac Sign Filter & Sort Dropdown */}
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
                    <span className="flex items-center gap-1 text-amber-400/90 font-semibold uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      ZODIAC FILTER & SORT
                    </span>
                    {sortBy.startsWith('zodiac') ? (
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full text-[9px] font-bold border border-amber-500/40">
                        {sortBy === 'zodiac-asc' ? 'Sorted ♈→♓' : sortBy === 'zodiac-desc' ? 'Sorted ♓→♈' : 'Sorted A→Z'}
                      </span>
                    ) : selectedZodiacFilter !== 'all' ? (
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full text-[9px] font-bold border border-amber-500/40">
                        {availableZodiacs.find(z => z.name.toLowerCase() === selectedZodiacFilter.toLowerCase())?.count || 0} Inquiries
                      </span>
                    ) : (
                      <span className="bg-white/5 text-slate-400 px-1.5 py-0.2 rounded-full text-[9px] font-mono">
                        {pastInquiries.filter(i => i.zodiacSign).length} Tagged
                      </span>
                    )}
                  </div>
                  <select
                    id="chronicles-zodiac-filter-sort-dropdown"
                    value={
                      selectedZodiacFilter !== 'all'
                        ? selectedZodiacFilter
                        : sortBy.startsWith('zodiac')
                        ? `sort:${sortBy}`
                        : 'all'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith('sort:')) {
                        const sortKey = val.replace('sort:', '') as ChronicleSortOption;
                        setSortBy(sortKey);
                        setSelectedZodiacFilter('all');
                      } else {
                        setSelectedZodiacFilter(val);
                      }
                    }}
                    className={`w-full bg-black/60 border rounded-lg px-3 py-2 text-xs font-serif focus:outline-none cursor-pointer transition-all ${
                      selectedZodiacFilter !== 'all' || sortBy.startsWith('zodiac')
                        ? 'border-amber-500/80 text-amber-300 font-semibold bg-amber-950/30 shadow-sm shadow-amber-500/20'
                        : 'border-white/10 text-slate-300 focus:border-amber-500/50'
                    }`}
                  >
                    <optgroup label="✦ Sort Inquiries by Zodiac" className="bg-neutral-900 text-amber-300 font-bold font-mono">
                      <option value="sort:zodiac-asc" className="bg-neutral-900 text-amber-300 font-semibold">
                        ✨ Sort: Zodiac Order (♈ Aries → ♓ Pisces)
                      </option>
                      <option value="sort:zodiac-desc" className="bg-neutral-900 text-amber-300 font-semibold">
                        ✨ Sort: Reverse Order (♓ Pisces → ♈ Aries)
                      </option>
                      <option value="sort:zodiac-alpha" className="bg-neutral-900 text-amber-300 font-semibold">
                        ✨ Sort: Zodiac Name (A → Z)
                      </option>
                    </optgroup>
                    <optgroup label="🔍 Filter by Specific Zodiac Sign" className="bg-neutral-900 text-slate-300 font-bold font-mono">
                      <option value="all" className="bg-neutral-900 text-slate-200">
                        All Zodiac Signs [{pastInquiries.filter(i => i.zodiacSign).length} total tagged]
                      </option>
                      {availableZodiacs.map((zod, idx) => (
                        <option key={`zod-opt-${zod.name}-${idx}`} value={zod.name} className="bg-neutral-900 text-slate-200">
                          {zod.symbol} {zod.name} — [{zod.count} {zod.count === 1 ? 'inquiry' : 'inquiries'}]
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Inquiry Tags Filter Dropdown */}
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
                    <span className="flex items-center gap-1 text-amber-400/90 font-semibold uppercase tracking-wider">
                      <Tags className="w-2.5 h-2.5 text-amber-400" />
                      INQUIRY TAGS
                    </span>
                    {selectedTagFilter !== 'all' ? (
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full text-[9px] font-bold border border-amber-500/40">
                        {pastInquiries.filter(i => Array.isArray(i.tags) && i.tags.some(t => t.toLowerCase() === selectedTagFilter.toLowerCase())).length} Records
                      </span>
                    ) : (
                      <span className="bg-white/5 text-slate-400 px-1.5 py-0.2 rounded-full text-[9px] font-mono">
                        {availableTagsWithCounts.length} Tags
                      </span>
                    )}
                  </div>
                  <select
                    id="chronicles-tag-filter-dropdown"
                    value={selectedTagFilter}
                    onChange={(e) => setSelectedTagFilter(e.target.value)}
                    className={`w-full bg-black/60 border rounded-lg px-3 py-2 text-xs font-serif focus:outline-none cursor-pointer transition-all ${
                      selectedTagFilter !== 'all'
                        ? 'border-amber-500/80 text-amber-300 font-semibold bg-amber-950/30 shadow-sm shadow-amber-500/20'
                        : 'border-white/10 text-slate-300 focus:border-amber-500/50'
                    }`}
                  >
                    <option value="all" className="bg-neutral-900 text-slate-200">
                      All Tags [{availableTagsWithCounts.length} unique tags]
                    </option>
                    {availableTagsWithCounts.map((tg, idx) => (
                      <option key={`tag-opt-${tg.name}-${idx}`} value={tg.name} className="bg-neutral-900 text-slate-200">
                        🏷️ {tg.name} — [{tg.count} {tg.count === 1 ? 'record' : 'records'}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* School of Thought Tradition Badge Ribbon - Quick Filter */}
              {availableSchoolsWithCounts.length > 0 && (
                <div className="pt-2.5 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-400" />
                      School of Thought Traditions
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {availableSchoolsWithCounts.length} active {availableSchoolsWithCounts.length === 1 ? 'tradition' : 'traditions'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-amber-500/20">
                    <button
                      onClick={() => setSelectedSchoolFilter('all')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                        selectedSchoolFilter === 'all'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm shadow-amber-500/20'
                          : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <span>All Traditions</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40">
                        {pastInquiries.length}
                      </span>
                    </button>
                    {availableSchoolsWithCounts.map((sch, idx) => {
                      const isSelected = selectedSchoolFilter === sch.name;
                      return (
                        <button
                          key={`sch-btn-${sch.name}-${idx}`}
                          onClick={() => setSelectedSchoolFilter(isSelected ? 'all' : sch.name)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-serif transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold shadow-md shadow-amber-500/20 scale-105'
                              : 'bg-amber-950/20 text-amber-100/90 border-amber-500/30 hover:border-amber-400 hover:bg-amber-900/40'
                          }`}
                          title={`Filter by ${sch.name}: ${sch.count} consultations`}
                        >
                          <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                          <span>{sch.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold ${
                              isSelected
                                ? 'bg-amber-400 text-black'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {sch.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inquiry Custom Tags Badge Ribbon - Quick Filter */}
              {availableTagsWithCounts.length > 0 && (
                <div className="pt-2.5 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider flex items-center gap-1">
                      <Tags className="w-3 h-3 text-amber-400" />
                      Inquiry Tags & Themes
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {availableTagsWithCounts.length} {availableTagsWithCounts.length === 1 ? 'tag' : 'tags'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-amber-500/20">
                    <button
                      onClick={() => setSelectedTagFilter('all')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                        selectedTagFilter === 'all'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm shadow-amber-500/20'
                          : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <span>All Tags</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40">
                        {pastInquiries.filter(i => Array.isArray(i.tags) && i.tags.length > 0).length}
                      </span>
                    </button>
                    {availableTagsWithCounts.map((tg, idx) => {
                      const isSelected = selectedTagFilter.toLowerCase() === tg.name.toLowerCase();
                      return (
                        <button
                          key={`tag-ribbon-btn-${tg.name}-${idx}`}
                          onClick={() => setSelectedTagFilter(isSelected ? 'all' : tg.name)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold shadow-md shadow-amber-500/20 scale-105'
                              : 'bg-amber-950/20 text-amber-100/90 border-amber-500/30 hover:border-amber-400 hover:bg-amber-900/40'
                          }`}
                          title={`Filter by tag "${tg.name}": ${tg.count} inquiries`}
                        >
                          <Tag className="w-2.5 h-2.5 text-amber-400" />
                          <span>{tg.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold ${
                              isSelected
                                ? 'bg-amber-400 text-black'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {tg.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Zodiac Sign Badge Ribbon - Quick Visual Counts */}
              <div className="pt-2.5 border-t border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Zodiac Sign Distribution Badges
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {pastInquiries.filter(i => i.zodiacSign).length} of {pastInquiries.length} inquiries aligned
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-amber-500/20">
                  <button
                    onClick={() => setSelectedZodiacFilter('all')}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                      selectedZodiacFilter === 'all' && !sortBy.startsWith('zodiac')
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm shadow-amber-500/20'
                        : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <span>All Signs</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40">
                      {pastInquiries.filter(i => i.zodiacSign).length}
                    </span>
                  </button>

                  {/* Quick Zodiac Wheel Sort Toggle Button */}
                  <button
                    onClick={() => {
                      if (sortBy === 'zodiac-asc') setSortBy('zodiac-desc');
                      else if (sortBy === 'zodiac-desc') setSortBy('zodiac-alpha');
                      else if (sortBy === 'zodiac-alpha') setSortBy('newest');
                      else {
                        setSortBy('zodiac-asc');
                        setSelectedZodiacFilter('all');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                      sortBy.startsWith('zodiac')
                        ? 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-black/40 text-slate-400 border-white/10 hover:border-amber-500/40 hover:text-amber-300'
                    }`}
                    title="Sort inquiries along the Zodiac Wheel"
                  >
                    <ArrowUpDown className="w-2.5 h-2.5 text-amber-400" />
                    <span>
                      Sort: {sortBy === 'zodiac-asc' ? '♈→♓ (Wheel)' : sortBy === 'zodiac-desc' ? '♓→♈ (Reverse)' : sortBy === 'zodiac-alpha' ? 'A→Z (Name)' : 'Zodiac'}
                    </span>
                  </button>
                  {availableZodiacs.map((zod, idx) => {
                    const isSelected = selectedZodiacFilter.toLowerCase() === zod.name.toLowerCase();
                    const hasCount = zod.count > 0;
                    return (
                      <button
                        key={`zod-btn-${zod.name}-${idx}`}
                        onClick={() => setSelectedZodiacFilter(isSelected ? 'all' : zod.name)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-serif transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold shadow-md shadow-amber-500/20 scale-105'
                            : hasCount
                            ? 'bg-amber-950/40 text-amber-100 border-amber-500/40 hover:border-amber-400 hover:bg-amber-900/50'
                            : 'bg-black/30 text-slate-500 border-white/5 hover:border-white/10 opacity-60'
                        }`}
                        title={`${zod.name}: ${zod.count} inquiries in chronicles`}
                      >
                        <span className="font-sans">{zod.symbol}</span>
                        <span>{zod.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold ${
                            isSelected
                              ? 'bg-amber-400 text-black'
                              : hasCount
                              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                              : 'bg-white/5 text-slate-600'
                          }`}
                        >
                          {zod.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Controls (Date & Sorting) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs font-serif text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Preset:</span>
                  {(["all", "7days", "30days"] as const).map(preset => (
                    <button
                      key={preset}
                      onClick={() => setSelectedDatePreset(preset)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                        selectedDatePreset === preset
                          ? 'bg-white/10 text-white font-bold border border-white/20'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {preset === 'all' ? 'All Time' : preset === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Sort:</span>
                  <select
                    id="chronicles-secondary-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-black/60 border border-white/10 rounded-md px-2 py-1 text-[11px] font-serif text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical (Question)</option>
                    <option value="zodiac-asc">Zodiac Sign (♈ Aries → ♓ Pisces)</option>
                    <option value="zodiac-desc">Zodiac Sign (♓ Pisces → ♈ Aries)</option>
                    <option value="zodiac-alpha">Zodiac Sign Name (A → Z)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

              {/* Active Filter Chips */}
              {(selectedZodiacFilter !== 'all' || selectedSchoolFilter !== 'all' || selectedTagFilter !== 'all' || selectedDatePreset !== 'all' || sortBy.startsWith('zodiac')) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active Filters:</span>
                  {selectedZodiacFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-serif bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <span>✨ Zodiac: {ALL_ZODIAC_SIGNS.find(z => z.name.toLowerCase() === selectedZodiacFilter.toLowerCase())?.symbol || ''} {selectedZodiacFilter}</span>
                      <span className="px-1.5 py-0.1 bg-amber-500/30 text-amber-200 rounded-full text-[9px] font-mono font-bold">
                        {availableZodiacs.find(z => z.name.toLowerCase() === selectedZodiacFilter.toLowerCase())?.count || 0}
                      </span>
                      <button
                        onClick={() => setSelectedZodiacFilter('all')}
                        className="hover:text-white transition-colors cursor-pointer ml-0.5"
                        title="Clear Zodiac Filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedTagFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Tag className="w-2.5 h-2.5 text-amber-400" />
                      <span>Tag: {selectedTagFilter}</span>
                      <span className="px-1.5 py-0.1 bg-amber-500/30 text-amber-200 rounded-full text-[9px] font-mono font-bold">
                        {pastInquiries.filter(i => Array.isArray(i.tags) && i.tags.some(t => t.toLowerCase() === selectedTagFilter.toLowerCase())).length}
                      </span>
                      <button
                        onClick={() => setSelectedTagFilter('all')}
                        className="hover:text-white transition-colors cursor-pointer ml-0.5"
                        title="Clear Tag Filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {sortBy.startsWith('zodiac') && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-serif bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>
                        Sort: {
                          sortBy === 'zodiac-asc' ? 'Zodiac Order (♈ Aries → ♓ Pisces)' :
                          sortBy === 'zodiac-desc' ? 'Reverse Zodiac (♓ Pisces → ♈ Aries)' :
                          'Zodiac Name (A → Z)'
                        }
                      </span>
                      <button
                        onClick={() => setSortBy('newest')}
                        className="hover:text-white transition-colors cursor-pointer ml-0.5"
                        title="Reset Sort to Chronological"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedSchoolFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-serif bg-violet-500/20 text-violet-300 border border-violet-500/40">
                      <span>Tradition: {selectedSchoolFilter}</span>
                      <button
                        onClick={() => setSelectedSchoolFilter('all')}
                        className="hover:text-white transition-colors cursor-pointer ml-0.5"
                        title="Clear Tradition Filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedDatePreset !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      <span>Date: {selectedDatePreset === '7days' ? 'Last 7 Days' : 'Last 30 Days'}</span>
                      <button
                        onClick={() => setSelectedDatePreset('all')}
                        className="hover:text-white transition-colors cursor-pointer ml-0.5"
                        title="Clear Date Preset"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedZodiacFilter('all');
                      setSelectedSchoolFilter('all');
                      setSelectedTagFilter('all');
                      setSelectedDatePreset('all');
                      if (sortBy.startsWith('zodiac')) {
                        setSortBy('newest');
                      }
                    }}
                    className="text-[10px] font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer ml-auto"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Semantic Search Reasoning Banner */}
            {semanticScores && searchQuery.trim() && (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs font-serif text-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>AI Semantic Scan Active:</strong> Displaying records ordered by thematic relevance to "{searchQuery}".
                  </span>
                </div>
                <button
                  onClick={() => setSemanticScores(null)}
                  className="text-[10px] font-mono text-amber-400 underline hover:text-amber-200 cursor-pointer"
                >
                  Clear Resonance
                </button>
              </div>
            )}

            {/* Records Header & Analytics Toggle */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chronicle Inscriptions ({filteredInquiries.length})</span>
                </span>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-[11px] font-mono text-amber-300/80">
                  {sortBy === "newest" ? "Most Recent Records First" : sortBy === "oldest" ? "Oldest First" : sortBy}
                </span>
              </div>

              {pastInquiries.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTimelineChart(!showTimelineChart)}
                  className="text-[11px] font-serif text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/5 cursor-pointer"
                  title="Toggle Temporal Patterns & Astrological Analytics"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{showTimelineChart ? "Hide Analytics" : "View Analytics & Trends"}</span>
                  {showTimelineChart ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                </button>
              )}
            </div>

            {/* Expandable Temporal & Astrological Analytics */}
            <AnimatePresence>
              {showTimelineChart && pastInquiries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden bg-black/40 border border-white/10 rounded-xl p-4"
                >
                  <ChroniclesTimeline pastInquiries={pastInquiries} activeTheme={activeTheme} />
                  <ZodiacalInfluenceChart 
                    pastInquiries={pastInquiries} 
                    activeTheme={activeTheme} 
                    selectedZodiacFilter={selectedZodiacFilter}
                    onSelectZodiacFilter={setSelectedZodiacFilter}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Multi-Record Selection Control Bar & Batch Tagging Suite */}
            {filteredInquiries.length > 0 && (
              <div className="bg-[#121018] border border-amber-500/30 rounded-xl p-3 shadow-lg text-xs font-serif space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={handleToggleSelectAllFiltered}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-serif font-medium transition-all flex items-center gap-2 cursor-pointer ${
                        isAllFilteredSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/30'
                          : selectedRecordIds.length > 0
                          ? 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                          : 'bg-black/50 border-white/10 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
                      }`}
                      title={isAllFilteredSelected ? "Deselect all visible records" : "Select all visible records with checkboxes"}
                    >
                      {isAllFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-slate-950" />
                      ) : selectedRecordIds.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>{isAllFilteredSelected ? "Deselect All Visible" : "Select All Visible"}</span>
                    </button>

                    <span className="text-xs font-mono text-slate-400">
                      <strong className="text-amber-300 font-bold">{selectedRecordIds.length}</strong> of {filteredInquiries.length} selected
                    </span>

                    {selectedRecordIds.length > 0 && (
                      <button
                        onClick={handleClearSelection}
                        className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedRecordIds.length > 0 && (
                      <button
                        onClick={() => setShowBatchTagPanel(!showBatchTagPanel)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-serif font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          showBatchTagPanel
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-sm shadow-amber-500/20'
                            : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
                        }`}
                        title="Toggle Batch Tagging panel"
                      >
                        <Tags className="w-3.5 h-3.5 text-amber-400" />
                        <span>Batch Edit Tags ({selectedRecordIds.length})</span>
                        {showBatchTagPanel ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                      </button>
                    )}

                    <button
                      onClick={handleDownloadSelectedPDF}
                      disabled={selectedRecordIds.length === 0}
                      className={`px-3.5 py-1.5 rounded-lg border font-serif font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedRecordIds.length > 0
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 border-amber-300 shadow-amber-950/50 hover:brightness-110 cursor-pointer'
                          : 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed opacity-40'
                      }`}
                      title="Export ONLY selected checked records to a customized PDF report"
                    >
                      <FileText className={`w-3.5 h-3.5 ${selectedRecordIds.length > 0 ? 'text-slate-950' : 'text-slate-500'}`} />
                      <span>Download Selected as PDF ({selectedRecordIds.length})</span>
                    </button>
                  </div>
                </div>

                {/* Expandable Batch Tag Editor Panel */}
                <AnimatePresence>
                  {selectedRecordIds.length > 0 && showBatchTagPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-amber-500/20 space-y-3 overflow-hidden"
                    >
                      {/* Summary Header of Selection & Active Tags on Selected */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-black/40 border border-amber-500/20">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 font-semibold">
                          <Tags className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>BATCH TAG OPERATIONS:</span>
                          <span className="text-slate-300">Applying changes to {selectedRecordIds.length} checked records</span>
                        </div>

                        {tagsOnSelectedRecords.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-400">Tags on selected records:</span>
                            {tagsOnSelectedRecords.map((t, idx) => (
                              <span
                                key={`sel-tag-${idx}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/15 border border-amber-500/40 text-amber-200"
                              >
                                <span>{t.name}</span>
                                <span className="text-[9px] text-amber-400/80">({t.count})</span>
                                <button
                                  onClick={() => handleBatchRemoveTag(t.name)}
                                  className="ml-1 text-slate-400 hover:text-red-400 p-0.5 rounded cursor-pointer"
                                  title={`Remove tag "${t.name}" from all selected records`}
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 italic">No tags currently assigned to selection</span>
                        )}
                      </div>

                      {/* Action Controls: Apply Tag and Remove Tag */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Apply Tag Section */}
                        <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                              <Plus className="w-3 h-3 text-emerald-400" />
                              APPLY TAG TO SELECTED
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">Add to {selectedRecordIds.length} records</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={batchTagInput}
                              onChange={(e) => setBatchTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleBatchApplyTag();
                                }
                              }}
                              placeholder="Enter custom tag (e.g. Prophetic, Gnostic)..."
                              className="flex-1 bg-black/70 border border-white/15 focus:border-amber-500/60 rounded-lg px-2.5 py-1.5 text-xs font-serif text-slate-200 placeholder:text-slate-500 focus:outline-none"
                            />
                            <button
                              onClick={() => handleBatchApplyTag()}
                              disabled={!batchTagInput.trim()}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Apply Tag</span>
                            </button>
                          </div>

                          {/* Quick Suggestions Pills */}
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            <span className="text-[10px] font-mono text-slate-400">Quick:</span>
                            {['Prophetic', 'Gnostic', 'Eschatological', 'Hermetic', 'Kabbalistic', 'Astrological', 'Enochian', 'Warfare', 'Mystic'].map((suggestion) => (
                              <button
                                key={`batch-sugg-${suggestion}`}
                                onClick={() => handleBatchApplyTag(suggestion)}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
                                title={`Apply "${suggestion}" to all ${selectedRecordIds.length} records`}
                              >
                                +{suggestion}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Remove Tag Section */}
                        <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-rose-400 font-bold flex items-center gap-1">
                              <Minus className="w-3 h-3 text-rose-400" />
                              REMOVE TAG FROM SELECTED
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {tagsOnSelectedRecords.length} tags on selection
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={batchTagToRemove}
                              onChange={(e) => setBatchTagToRemove(e.target.value)}
                              className="flex-1 bg-black/70 border border-white/15 focus:border-rose-500/60 rounded-lg px-2.5 py-1.5 text-xs font-serif text-slate-200 focus:outline-none cursor-pointer"
                            >
                              <option value="">Select a tag to remove...</option>
                              {tagsOnSelectedRecords.map((t, idx) => (
                                <option key={`rem-opt-${idx}`} value={t.name}>
                                  {t.name} — [on {t.count} of {selectedRecordIds.length} selected]
                                </option>
                              ))}
                              {tagsOnSelectedRecords.length === 0 && (
                                <option disabled value="">(No tags currently on selected records)</option>
                              )}
                            </select>
                            <button
                              onClick={() => handleBatchRemoveTag()}
                              disabled={!batchTagToRemove.trim() || tagsOnSelectedRecords.length === 0}
                              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                            >
                              <Minus className="w-3 h-3" />
                              <span>Remove Tag</span>
                            </button>
                          </div>

                          {/* Clear all tags action */}
                          {tagsOnSelectedRecords.length > 0 && (
                            <div className="pt-1 flex justify-end">
                              <button
                                onClick={handleBatchClearAllTags}
                                className="text-[10px] font-mono text-rose-400/80 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
                                title="Remove all tags from the selected records"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                                <span>Clear All Tags from Selected Records</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 3. Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-serif text-slate-300 font-semibold mb-1">
                  {pastInquiries.length === 0 ? "No Chronicles Recorded Yet" : "No Matching Consultations Found"}
                </h3>
                <p className="text-xs font-serif text-slate-500 max-w-sm mx-auto mb-4">
                  {pastInquiries.length === 0 
                    ? "Inquire with the Celestial Oracle or search the ancient scriptures to begin recording your consultation history." 
                    : "Try adjusting your search keywords, tradition filter, or date presets."}
                </p>
                {pastInquiries.length === 0 && (
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-serif font-bold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
                  >
                    Initiate First Consultation
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                {filteredInquiries.slice(0, displayLimit).map((iq, index) => {
                  const isExpanded = expandedId === iq.id;
                  const isSelectedForComp = comparisonIds.includes(iq.id);
                  const isSelectedForPdf = selectedRecordIds.includes(iq.id);
                  const semMatch = semanticScores ? semanticScores[iq.id] : null;

                  return (
                    <div
                      key={iq.id ? `${iq.id}-${index}` : `iq-${index}`}
                      className={`bg-[#0d0d11] border rounded-xl p-4 sm:p-5 transition-all hover:border-white/20 text-left relative overflow-hidden flex flex-col justify-between ${
                          isSelectedForPdf
                            ? 'border-amber-400/90 bg-amber-950/20 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/50'
                            : isSelectedForComp 
                            ? 'border-amber-500/60 shadow-lg shadow-amber-950/20' 
                            : 'border-white/10'
                        }`}
                      >
                        {/* Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Latest record indicator badge */}
                            {index === 0 && sortBy === "newest" && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                <span>MOST RECENT</span>
                              </span>
                            )}

                            {/* Selection Checkbox */}
                            <button
                              onClick={(e) => toggleRecordSelect(iq.id, e)}
                              className={`px-2 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer border ${
                                isSelectedForPdf
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/30'
                                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-500/40'
                              }`}
                              title={isSelectedForPdf ? "Deselect this record" : "Select this record for custom PDF export"}
                            >
                              {isSelectedForPdf ? (
                                <CheckSquare className="w-3.5 h-3.5 text-slate-950" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-[10px] font-mono font-semibold uppercase">
                                {isSelectedForPdf ? 'Selected' : 'Select'}
                              </span>
                            </button>

                            {/* Tradition Tag */}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-serif font-semibold border ${
                              activeTheme.id === 'deep-void' 
                                ? 'bg-violet-950/40 border-violet-500/30 text-violet-300' 
                                : activeTheme.id === 'ethereal-silver' 
                                ? 'bg-slate-900/40 border-slate-500/30 text-slate-300' 
                                : 'bg-amber-950/40 border-[#D4AF37]/30 text-[#D4AF37]'
                            }`}>
                              {iq.school}
                            </span>

                            {/* Zodiac Sign */}
                            {iq.zodiacSign && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedZodiacFilter(prev => prev.toLowerCase() === iq.zodiacSign!.toLowerCase() ? 'all' : iq.zodiacSign!);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                                  selectedZodiacFilter.toLowerCase() === iq.zodiacSign.toLowerCase()
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                                    : 'bg-white/5 text-slate-400 border-white/5 hover:border-amber-500/40 hover:text-amber-300'
                                }`}
                                title={`Filter inquiries by ${iq.zodiacSign}`}
                              >
                                <span>✨ {iq.zodiacSign}</span>
                              </button>
                            )}

                            {/* Timestamp */}
                            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-600" />
                              {iq.timestamp}
                            </span>
                          </div>

                          {/* Semantic Match Score Badge */}
                          {semMatch && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold">
                              {Math.round(semMatch.score * 100)}% Match
                            </span>
                          )}
                        </div>

                        {/* Question Header with Tradition Badge */}
                        <div className="mb-3 flex items-center gap-2 flex-wrap">
                          <span 
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-serif font-semibold border shrink-0 shadow-sm transition-all ${
                              activeTheme.id === 'deep-void' 
                                ? 'bg-violet-950/80 border-violet-500/40 text-violet-200' 
                                : activeTheme.id === 'ethereal-silver' 
                                ? 'bg-slate-900/90 border-slate-400/40 text-slate-100' 
                                : 'bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-amber-950/40'
                            }`}
                            title={`School / Tradition: ${iq.school}`}
                          >
                            <Tag className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{iq.school}</span>
                          </span>
                          <h4 className="text-sm font-serif font-bold text-slate-100 leading-snug flex-1">
                            "{iq.question}"
                          </h4>
                        </div>

                        {/* Channeled Revelation Snippet or Expanded Markdown */}
                        <div className="mb-3">
                          {isExpanded ? (
                            <div className="p-3.5 bg-black/40 border border-white/5 rounded-lg text-xs font-serif text-slate-300 space-y-2">
                              <TypewriterMarkdown content={iq.answer} />
                            </div>
                          ) : (
                            <p className="text-xs font-serif text-slate-400 line-clamp-2 leading-relaxed">
                              {iq.answer.replace(/[#*`_]/g, '')}
                            </p>
                          )}
                        </div>

                        {/* Custom Inquiry Tags & Inscription Labels */}
                        <div className="mb-3 flex items-center gap-1.5 flex-wrap">
                          {Array.isArray(iq.tags) && iq.tags.length > 0 && iq.tags.map((tag, tIdx) => (
                            <span
                              key={`tag-${iq.id}-${tIdx}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border bg-amber-500/10 border-amber-500/30 text-amber-300 group shadow-sm transition-all"
                            >
                              <Tag className="w-2.5 h-2.5 text-amber-400" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTagFilter(prev => prev.toLowerCase() === tag.toLowerCase() ? 'all' : tag);
                                }}
                                className="hover:underline cursor-pointer"
                                title={`Filter chronicles by tag "${tag}"`}
                              >
                                {tag}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTagFromSingle(iq.id, tag);
                                }}
                                className="text-slate-500 hover:text-red-400 ml-0.5 p-0.5 rounded cursor-pointer"
                                title={`Remove tag "${tag}" from this inquiry`}
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}

                          {/* Quick Add Tag Button / Inline Input */}
                          {activeAddTagInquiryId === iq.id ? (
                            <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={singleTagInput}
                                onChange={(e) => setSingleTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddTagToSingle(iq.id, singleTagInput);
                                  } else if (e.key === 'Escape') {
                                    setActiveAddTagInquiryId(null);
                                    setSingleTagInput("");
                                  }
                                }}
                                placeholder="Tag name..."
                                autoFocus
                                className="px-2 py-0.5 text-[10px] font-mono bg-black/90 border border-amber-500/60 rounded text-amber-200 focus:outline-none w-28"
                              />
                              <button
                                onClick={() => handleAddTagToSingle(iq.id, singleTagInput)}
                                className="px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded text-[10px] font-mono font-bold hover:brightness-110 cursor-pointer"
                                title="Add tag"
                              >
                                <Check className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setActiveAddTagInquiryId(null);
                                  setSingleTagInput("");
                                }}
                                className="p-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAddTagInquiryId(iq.id);
                                setSingleTagInput("");
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 hover:text-amber-300 hover:bg-white/5 border border-dashed border-white/10 hover:border-amber-500/40 transition-colors cursor-pointer"
                              title="Add custom tag to this record"
                            >
                              <Plus className="w-2.5 h-2.5 text-amber-400" />
                              <span>Tag</span>
                            </button>
                          )}
                        </div>

                        {/* Quick Notes Section */}
                        <div className="mb-3 pt-2 border-t border-white/5">
                          {activeNoteInquiryId === iq.id ? (
                            <div className="p-3 bg-black/60 border border-amber-500/40 rounded-lg space-y-2" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Quick Insight Note
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">Press Save or Escape</span>
                              </div>
                              <textarea
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="Type brief insight or notes about this generated answer..."
                                rows={2}
                                autoFocus
                                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-xs font-serif text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveNoteInquiryId(null);
                                    setNoteInput("");
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-white/5 rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveQuickNote(iq.id, noteInput)}
                                  className="px-3 py-1 text-[11px] font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded cursor-pointer flex items-center gap-1 shadow-sm"
                                >
                                  <Check className="w-3 h-3" /> Save Note
                                </button>
                              </div>
                            </div>
                          ) : iq.notes && iq.notes.trim().length > 0 ? (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveNoteInquiryId(iq.id);
                                setNoteInput(iq.notes || "");
                              }}
                              className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs font-serif text-amber-200/90 group relative cursor-pointer hover:border-amber-500/60 transition-all"
                              title="Click to edit quick note"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Quick Insight Note:
                                </span>
                                <span className="text-[10px] font-mono text-amber-400/70 group-hover:underline">Edit</span>
                              </div>
                              <p className="italic text-slate-300 whitespace-pre-wrap">{iq.notes}</p>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveNoteInquiryId(iq.id);
                                setNoteInput("");
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-400 hover:text-amber-300 bg-white/5 hover:bg-white/10 border border-dashed border-white/15 hover:border-amber-500/40 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-amber-400" />
                              <span>Add Quick Note</span>
                            </button>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-serif">
                          <div className="flex items-center gap-2">
                            {/* Toggle Expand */}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : iq.id)}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <Eye className="w-3 h-3 text-amber-400" />}
                              <span>{isExpanded ? "Collapse" : "Quick View"}</span>
                            </button>

                            {/* Full Reading Modal */}
                            <button
                              onClick={() => setReadingModalInquiry(iq)}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3 text-sky-400" />
                              <span>Read Full</span>
                            </button>

                            {/* Select for Compare */}
                            <button
                              onClick={(e) => toggleComparisonSelect(iq.id, e)}
                              className={`px-2.5 py-1 rounded text-[11px] border transition-all flex items-center gap-1 cursor-pointer ${
                                isSelectedForComp
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                                  : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>{isSelectedForComp ? 'Selected' : 'Compare'}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Voice Recitation / Speech Button */}
                            <button
                              onClick={(e) => handleSpeakInquiry(iq.id, `Inquiry: ${iq.question}. Revelation: ${iq.answer}`, e)}
                              className={`p-1.5 rounded transition-colors cursor-pointer ${
                                speakingId === iq.id
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
                                  : 'hover:bg-white/10 text-slate-400 hover:text-amber-300'
                              }`}
                              title={speakingId === iq.id ? "Stop Voice Recitation" : "Listen to Voice Recitation of this revelation"}
                            >
                              {speakingId === iq.id ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                            </button>

                            {/* Download PDF for single record */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTriggerDownloadPDF([iq]);
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                              title="Download PDF report for this revelation"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                            </button>

                            {/* Re-Invoke */}
                            <button
                              onClick={() => {
                                onReInvoke(iq.question, iq.school);
                                onClose();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                              title="Re-ask this question in Celestial Oracle"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy */}
                            <button
                              onClick={(e) => handleCopyInquiry(iq, e)}
                              className={`px-2 py-1 rounded text-[11px] font-serif transition-all flex items-center gap-1 cursor-pointer border ${
                                copiedId === iq.id
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold shadow-sm shadow-emerald-950/40'
                                  : 'bg-white/5 border-transparent text-slate-300 hover:bg-emerald-950/30 hover:border-emerald-500/30 hover:text-emerald-300'
                              }`}
                              title="Copy inquiry and revelation to clipboard"
                            >
                              {copiedId === iq.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-emerald-400" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {/* Share Social */}
                            <button
                              onClick={() => openSocialShare("Celestial Revelation", `Consultation on "${iq.question}":\n\n${iq.answer}`)}
                              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
                              title="Share revelation to social media"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={(e) => handleDeleteSingle(iq.id, e)}
                              className="p-1.5 rounded hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete this record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {filteredInquiries.length > displayLimit && (
                  <div className="flex justify-center pt-2 pb-4">
                    <button
                      onClick={() => setDisplayLimit(prev => prev + 40)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 text-xs font-serif text-slate-300 hover:text-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Load More Chronicles ({filteredInquiries.length - displayLimit} remaining)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Full Reading Modal View */}
      {readingModalInquiry && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-slate-200">
                  Full Consultation Record
                </h3>
              </div>
              <button
                onClick={() => setReadingModalInquiry(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-serif text-slate-200 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1.5">
                  <span>RECORDED: {readingModalInquiry.timestamp}</span>
                </div>
                <div className="flex items-start gap-2 flex-wrap mt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-serif font-bold bg-amber-950/90 border border-amber-500/50 text-amber-200 shrink-0 shadow-sm">
                    <Tag className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{readingModalInquiry.school}</span>
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-amber-200 flex-1 leading-snug">
                    "{readingModalInquiry.question}"
                  </h4>
                </div>

                {/* Modal Tags Bar */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Tags className="w-2.5 h-2.5 text-amber-400" />
                    Tags:
                  </span>
                  {Array.isArray(readingModalInquiry.tags) && readingModalInquiry.tags.length > 0 ? (
                    readingModalInquiry.tags.map((tag, tIdx) => (
                      <span
                        key={`modal-tag-${tIdx}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-sm"
                      >
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTagFromSingle(readingModalInquiry.id, tag)}
                          className="text-slate-500 hover:text-red-400 ml-0.5 p-0.5 rounded cursor-pointer"
                          title={`Remove tag "${tag}"`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 italic">No tags assigned yet</span>
                  )}

                  {activeAddTagInquiryId === `modal-${readingModalInquiry.id}` ? (
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        value={singleTagInput}
                        onChange={(e) => setSingleTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTagToSingle(readingModalInquiry.id, singleTagInput);
                          } else if (e.key === 'Escape') {
                            setActiveAddTagInquiryId(null);
                            setSingleTagInput("");
                          }
                        }}
                        placeholder="Tag name..."
                        autoFocus
                        className="px-2 py-0.5 text-[10px] font-mono bg-black/90 border border-amber-500/60 rounded text-amber-200 focus:outline-none w-28"
                      />
                      <button
                        onClick={() => handleAddTagToSingle(readingModalInquiry.id, singleTagInput)}
                        className="px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded text-[10px] font-mono font-bold hover:brightness-110 cursor-pointer"
                      >
                        <Check className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveAddTagInquiryId(null);
                          setSingleTagInput("");
                        }}
                        className="p-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveAddTagInquiryId(`modal-${readingModalInquiry.id}`);
                        setSingleTagInput("");
                      }}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 hover:text-amber-300 hover:bg-white/5 border border-dashed border-white/10 hover:border-amber-500/40 transition-colors cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5 text-amber-400" />
                      <span>Add Tag</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed p-4 bg-black/50 border border-white/5 rounded-xl">
                <TypewriterMarkdown content={readingModalInquiry.answer} />
              </div>

              {readingModalInquiry.balanceInterpretation && (
                <div className="p-3 bg-amber-950/10 border border-amber-500/20 rounded-lg text-xs italic text-amber-200/90">
                  <strong>Elemental Balance Note:</strong> {readingModalInquiry.balanceInterpretation}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setReadingModalInquiry(null)}
                className="py-2 px-4 rounded-lg text-xs font-serif border border-white/10 text-slate-400 hover:text-white cursor-pointer text-center"
              >
                Close Reading
              </button>

              <button
                onClick={(e) => handleSpeakInquiry(readingModalInquiry.id, `Inquiry: ${readingModalInquiry.question}. Revelation: ${readingModalInquiry.answer}`, e)}
                className={`py-2 px-4 rounded-lg text-xs font-serif font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  speakingId === readingModalInquiry.id
                    ? 'bg-amber-500/30 border-amber-500 text-amber-200 animate-pulse shadow-md shadow-amber-950/40'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-300 hover:bg-amber-900/40 hover:border-amber-400'
                }`}
                title="Listen to full vocal recitation"
              >
                {speakingId === readingModalInquiry.id ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                    <span>Halt Vocal Recitation</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Listen (Voice Recitation)</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => handleCopyInquiry(readingModalInquiry, e)}
                className="py-2 px-4 rounded-lg text-xs font-serif font-semibold border border-emerald-500/30 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-900/50 cursor-pointer text-center flex items-center justify-center gap-1.5 transition-all"
                title="Copy full revelation to clipboard"
              >
                {copiedId === readingModalInquiry.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
              {/* Select for PDF Batch Toggle */}
              <button
                onClick={(e) => toggleRecordSelect(readingModalInquiry.id, e)}
                className={`py-2 px-4 rounded-lg text-xs font-serif font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedRecordIds.includes(readingModalInquiry.id)
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/30'
                    : 'bg-black/40 border-white/10 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
                }`}
                title={selectedRecordIds.includes(readingModalInquiry.id) ? "Remove from PDF export batch" : "Add to PDF export batch"}
              >
                {selectedRecordIds.includes(readingModalInquiry.id) ? (
                  <CheckSquare className="w-3.5 h-3.5 text-slate-950" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{selectedRecordIds.includes(readingModalInquiry.id) ? 'Selected for PDF Batch' : 'Select for PDF Batch'}</span>
              </button>

              <button
                onClick={() => handleTriggerDownloadPDF([readingModalInquiry])}
                className="py-2 px-4 rounded-lg text-xs font-serif font-semibold border border-amber-500/30 bg-amber-950/30 text-amber-200 hover:bg-amber-900/50 cursor-pointer text-center flex items-center justify-center gap-1.5 transition-all"
                title="Export this single revelation as a PDF report"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Single PDF</span>
              </button>
              <button
                onClick={() => {
                  onReInvoke(readingModalInquiry.question, readingModalInquiry.school);
                  setReadingModalInquiry(null);
                  onClose();
                }}
                className="py-2 px-4 rounded-lg text-xs font-serif font-bold bg-amber-500 text-black shadow-lg hover:bg-amber-400 cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Invoke in Oracle</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comparison Modal View */}
      {showComparisonModal && compRecord1 && compRecord2 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl bg-[#0a0a0d] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-slate-200">
                  Dual Consultation Comparative Analysis
                </h3>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid comparison */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Record 1 */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                  <span>RECORD A: {compRecord1.school}</span>
                  <div className="flex items-center gap-2">
                    <span>{compRecord1.timestamp}</span>
                    <button
                      onClick={(e) => handleCopyInquiry(compRecord1, e)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 border border-white/5"
                      title="Copy Record A revelation text"
                    >
                      {copiedId === compRecord1.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-400" />}
                      <span>{copiedId === compRecord1.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-serif font-bold text-slate-100 border-b border-white/5 pb-2">
                  "{compRecord1.question}"
                </h4>
                <div className="text-xs font-serif text-slate-300 prose prose-invert max-w-none max-h-80 overflow-y-auto pr-1">
                  <TypewriterMarkdown content={compRecord1.answer} />
                </div>
              </div>

              {/* Record 2 */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                  <span>RECORD B: {compRecord2.school}</span>
                  <div className="flex items-center gap-2">
                    <span>{compRecord2.timestamp}</span>
                    <button
                      onClick={(e) => handleCopyInquiry(compRecord2, e)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 border border-white/5"
                      title="Copy Record B revelation text"
                    >
                      {copiedId === compRecord2.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-400" />}
                      <span>{copiedId === compRecord2.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-serif font-bold text-slate-100 border-b border-white/5 pb-2">
                  "{compRecord2.question}"
                </h4>
                <div className="text-xs font-serif text-slate-300 prose prose-invert max-w-none max-h-80 overflow-y-auto pr-1">
                  <TypewriterMarkdown content={compRecord2.answer} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="py-2 px-6 rounded-lg text-xs font-serif border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* PDF Export & Title Page Customizer Modal */}
      {showPdfSettingsModal && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-[#0c0c10] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-purple-950/20 to-black">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
                    Sacred Chronicle PDF Export Configuration
                  </h3>
                  <p className="text-xs text-amber-400/80 font-serif">
                    Custom Title Page, Inscription & Collection Summary
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPdfSettingsModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs font-serif">
              {/* Seeker Name Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Seeker / Dedication Name:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSeekerName("Jerry Ben Salazar");
                      localStorage.setItem("oracle-pdf-seeker-name", "Jerry Ben Salazar");
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    Reset to "Jerry Ben Salazar"
                  </button>
                </div>
                <input
                  type="text"
                  value={seekerName}
                  onChange={(e) => {
                    setSeekerName(e.target.value);
                    localStorage.setItem("oracle-pdf-seeker-name", e.target.value);
                  }}
                  placeholder="e.g., Jerry Ben Salazar"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-amber-500/30 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <p className="text-[11px] text-slate-400">
                  This name is inscripted on the ceremonial title page, header seal, and collection colophon.
                </p>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title Page Toggle */}
                <label className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTitlePage}
                    onChange={(e) => setIncludeTitlePage(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block text-xs">Include Custom Title Page</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Generates the Heptagram star seal, formal dedication to the Seeker, date, and treaty subtitle.
                    </span>
                  </div>
                </label>

                {/* Summary Page Toggle */}
                <label className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSummary}
                    onChange={(e) => setIncludeSummary(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block text-xs">Include Collection Summary</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Generates elemental resonance breakdowns, tradition diversity index, and thematic synthesis.
                    </span>
                  </div>
                </label>
              </div>

              {/* Custom Subtitle (Optional) */}
              <div className="space-y-1.5">
                <label className="text-slate-200 font-bold block">
                  Custom Treatise Subtitle (Optional):
                </label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder="e.g. Celestial Inscriptions of Light & Hermetic Mysteries"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400/60"
                />
              </div>

              {/* Live Preview Insights */}
              {(() => {
                const targetList = selectedRecordIds.length > 0 
                  ? pastInquiries.filter(iq => selectedRecordIds.includes(iq.id))
                  : (filteredInquiries.length > 0 ? filteredInquiries : pastInquiries);
                const summaryStats = analyzeChronicleCollection(targetList);

                return (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Live Summary Preview for Export ({targetList.length} Records)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {selectedRecordIds.length > 0 ? `${selectedRecordIds.length} Selected` : 'Full View'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Traditions</span>
                        <span className="text-sm font-bold text-amber-200">{summaryStats.sortedTraditions.length}</span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Top Tradition</span>
                        <span className="text-xs font-bold text-slate-200 truncate">{summaryStats.primaryTradition}</span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Dominant Element</span>
                        <span className="text-xs font-bold text-amber-300">{summaryStats.dominantElement}</span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Primary Theme</span>
                        <span className="text-xs font-bold text-slate-200 truncate">{summaryStats.dominantThemes[0] || 'Gnosis'}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 italic bg-black/30 p-2.5 rounded border border-white/5 leading-relaxed">
                      "{summaryStats.executiveSummary}"
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPdfSettingsModal(false)}
                className="py-2 px-4 rounded-lg text-xs font-serif border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedRecordIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPdfSettingsModal(false);
                      handleDownloadSelectedPDF();
                    }}
                    className="py-2 px-4 rounded-lg text-xs font-serif font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export {selectedRecordIds.length} Selected PDF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowPdfSettingsModal(false);
                    handleExportAllRecordsPDF();
                  }}
                  className="py-2 px-4 rounded-lg text-xs font-serif font-bold border border-amber-400/50 bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 shadow-md cursor-pointer flex items-center gap-1.5"
                  title="Export all archival records as PDF"
                >
                  <FileDown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Export All Records as PDF ({pastInquiries.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPdfSettingsModal(false);
                    handleTriggerDownloadPDF(filteredInquiries);
                  }}
                  className="py-2 px-5 rounded-lg text-xs font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-slate-950 shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate Current View PDF</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
