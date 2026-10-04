import React, { useState, useEffect } from 'react';
import { 
  FileText, ExternalLink, Copy, Check, Download, Upload, 
  Sparkles, RefreshCw, FolderSearch, Eye, LogIn, ChevronDown, 
  ChevronUp, Tag, Plus, CheckSquare, Square
} from 'lucide-react';
import { openGooglePicker, PickedGoogleDriveFile } from '../utils/googlePicker';
import { googleSignIn, getAccessToken } from '../firebase';
import { User } from 'firebase/auth';

export interface KeepNoteExport {
  title: string;
  textContent: string;
  isPinned?: boolean;
  isArchived?: boolean;
  color?: string;
  labels?: Array<{ name: string }>;
  listContent?: Array<{ text: string; isChecked: boolean }>;
}

interface GoogleKeepAndPickerHubProps {
  currentUser: User | null;
  needsAuth: boolean;
  onAuthSuccess?: () => void;
  onImportNote?: (note: { title: string; content: string; school: string; color: string; pinned: boolean }) => void;
  onScryQuery?: (query: string, school?: string) => void;
  activeTheme?: {
    id: string;
    textPrimary: string;
    textAccentHex: string;
    bgPanelHex?: string;
  };
  compact?: boolean;
}

const COMMON_MYSTIC_QUERIES = [
  {
    title: 'The Great Work (Magnum Opus)',
    query: 'What is the Great Work in Hermetic Alchemy and spiritual transmutation?',
    school: 'Hermetic Alchemy',
    tag: '#AlchemicalTransmutation'
  },
  {
    title: 'The Tree of Life (Otz Chiim)',
    query: 'Explain the Tree of Life, the 10 Sefirot, and the 22 Paths of Wisdom.',
    school: 'Kabbalah',
    tag: '#Kabbalah'
  },
  {
    title: 'The Demiurge (Yaldabaoth)',
    query: 'Define the Demiurge and the cosmic architecture in Gnosticism.',
    school: 'Gnosticism',
    tag: '#Gnosis'
  },
  {
    title: 'School of the Prophets: Ramah',
    query: 'Describe the ancient School of the Prophets at Ramah founded by the Prophet Samuel.',
    school: 'Divine Law Scholarship',
    tag: '#SchoolOfTheProphets'
  },
  {
    title: 'Ezekiel\'s Merkavah Chariot',
    query: 'Reveal the mystical secrets of Ezekiel\'s Chariot and the Wheel within a Wheel.',
    school: 'Cosmic Revelations',
    tag: '#Merkavah'
  },
  {
    title: 'The 76 Keys of Cosmic Knowledge',
    query: 'What are the 76 Keys of Cosmic Knowledge and the Great Wheel of Mysteries?',
    school: 'Cosmic Revelations',
    tag: '#76Keys'
  }
];

const KEEP_THEME_COLORS = [
  { name: 'Amber Gold', hex: '#D4AF37', bgClass: 'bg-amber-950/40 border-amber-500/30 text-amber-200' },
  { name: 'Sage Green', hex: '#34A853', bgClass: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' },
  { name: 'Cerulean Blue', hex: '#4285F4', bgClass: 'bg-sky-950/40 border-sky-500/30 text-sky-200' },
  { name: 'Amethyst Purple', hex: '#A855F7', bgClass: 'bg-purple-950/40 border-purple-500/30 text-purple-200' },
  { name: 'Ruby Rose', hex: '#EA4335', bgClass: 'bg-rose-950/40 border-rose-500/30 text-rose-200' },
  { name: 'Obsidian Void', hex: '#1E293B', bgClass: 'bg-slate-900/60 border-slate-700/40 text-slate-200' },
];

export const GoogleKeepAndPickerHub: React.FC<GoogleKeepAndPickerHubProps> = ({
  currentUser,
  needsAuth,
  onAuthSuccess,
  onImportNote,
  onScryQuery,
  activeTheme,
  compact = false,
}) => {
  const [pickedFiles, setPickedFiles] = useState<PickedGoogleDriveFile[]>([]);
  const [isOpeningPicker, setIsOpeningPicker] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copiedQueryIndex, setCopiedQueryIndex] = useState<number | null>(null);
  
  // Keep Scratchpad state
  const [showScratchpad, setShowScratchpad] = useState(!compact);
  const [scratchTitle, setScratchTitle] = useState('');
  const [scratchBody, setScratchBody] = useState('');
  const [scratchSchool, setScratchSchool] = useState('Hermetic Alchemy');
  const [scratchColor, setScratchColor] = useState(KEEP_THEME_COLORS[0]);
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<{ text: string; done: boolean }[]>([
    { text: 'Purify alchemical prima materia', done: true },
    { text: 'Align with the Tree of Life sefirot', done: false },
    { text: 'Inscribe meditation revelation into Grimoire', done: false },
  ]);
  const [scratchCopied, setScratchCopied] = useState(false);

  useEffect(() => {
    if (statusMessage) {
      const t = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [statusMessage]);

  const handleLaunchPicker = async () => {
    setIsOpeningPicker(true);
    setStatusMessage({ text: 'Accessing Google Picker...', type: 'info' });

    try {
      let token = await getAccessToken();

      if (!token && needsAuth) {
        const signResult = await googleSignIn();
        if (signResult) {
          token = signResult.accessToken;
          if (onAuthSuccess) onAuthSuccess();
        }
      }

      if (!token) {
        throw new Error('Google sign-in is required to access your Google Drive files with Google Picker.');
      }

      await openGooglePicker({
        accessToken: token,
        title: 'Select Sacred Document, Note or Manuscript (Google Drive)',
        onPicked: (file) => {
          setPickedFiles(prev => [file, ...prev.filter(f => f.id !== file.id)]);
          setStatusMessage({ 
            text: `Successfully picked "${file.name}" from Google Drive!`, 
            type: 'success' 
          });

          // If caller provided onImportNote callback, automatically offer or add as note
          if (onImportNote) {
            const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
            const noteContent = file.content
              ? file.content
              : `📄 **Google Drive Inscription**: [${file.name}](${file.url || `https://drive.google.com/file/d/${file.id}/view`})\n\n**MIME**: \`${file.mimeType}\`\n**Drive ID**: \`${file.id}\`${file.sizeBytes ? `\n**Size**: ${(file.sizeBytes / 1024).toFixed(1)} KB` : ''}\n\n*Document selected via Google Picker API.*`;

            onImportNote({
              title: `Drive: ${cleanTitle}`,
              content: noteContent,
              school: 'Cosmic Revelations',
              color: 'bg-gradient-to-br from-cyan-950/40 via-blue-950/20 to-black',
              pinned: true
            });
          }
        },
        onCancel: () => {
          setStatusMessage(null);
        },
        onError: (err) => {
          setStatusMessage({ text: `Google Picker error: ${err.message}`, type: 'error' });
        }
      });
    } catch (err: any) {
      console.warn('Google Picker invocation failed:', err);
      setStatusMessage({ text: err.message || 'Could not display Google Picker.', type: 'error' });
    } finally {
      setIsOpeningPicker(false);
    }
  };

  const handleCopyFormattedForKeep = async (titleText: string, contentText: string, tag: string, idx?: number) => {
    const formatted = `📌 ${titleText}\n\n${contentText}\n\n${tag} #TheGreatWheelOfMysteries\nhttps://keep.google.com`;
    try {
      await navigator.clipboard.writeText(formatted);
      if (typeof idx === 'number') {
        setCopiedQueryIndex(idx);
        setTimeout(() => setCopiedQueryIndex(null), 3000);
      } else {
        setScratchCopied(true);
        setTimeout(() => setScratchCopied(false), 3000);
      }
      setStatusMessage({
        text: `Copied "${titleText}" formatted for Google Keep! Opening Keep...`,
        type: 'success'
      });
      // Give user direct prompt to open Google Keep
      window.open('https://keep.google.com', '_blank', 'noopener,noreferrer');
    } catch (e) {
      setStatusMessage({ text: 'Failed to write note to clipboard.', type: 'error' });
    }
  };

  const handleExportKeepJson = () => {
    const sampleKeepData: KeepNoteExport[] = [
      {
        title: scratchTitle || 'Sacred Revelation of the Wheel',
        textContent: isChecklist
          ? checklistItems.map(i => `${i.done ? '[x]' : '[ ]'} ${i.text}`).join('\n')
          : (scratchBody || 'Meditation on the 76 Keys of Cosmic Knowledge and the Tree of Life.'),
        isPinned: true,
        color: 'YELLOW',
        labels: [{ name: 'Mysteries76' }, { name: scratchSchool }],
        listContent: isChecklist
          ? checklistItems.map(i => ({ text: i.text, isChecked: i.done }))
          : undefined
      }
    ];

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleKeepData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `google_keep_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();

    setStatusMessage({ text: 'Exported note as Google Keep compatible JSON!', type: 'success' });
  };

  const handleImportKeepJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const notesToImport = Array.isArray(parsed) ? parsed : [parsed];
        let importedCount = 0;

        notesToImport.forEach((item: any) => {
          const title = item.title || item.name || 'Imported Keep Note';
          const content = item.textContent || (Array.isArray(item.listContent) ? item.listContent.map((l: any) => `- [${l.isChecked ? 'x' : ' '}] ${l.text}`).join('\n') : String(item));
          
          if (onImportNote) {
            onImportNote({
              title,
              content,
              school: item.labels?.[0]?.name || 'Personal Reflection',
              color: 'bg-gradient-to-br from-amber-950/30 to-black',
              pinned: Boolean(item.isPinned)
            });
            importedCount++;
          }
        });

        setStatusMessage({ text: `Successfully imported ${importedCount} notes from Google Keep archive!`, type: 'success' });
      } catch (err) {
        setStatusMessage({ text: 'Invalid JSON file. Please supply a valid Google Keep takeout export.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { text: '', done: false }]);
  };

  const updateChecklist = (idx: number, text: string) => {
    const next = [...checklistItems];
    next[idx].text = text;
    setChecklistItems(next);
  };

  const toggleChecklist = (idx: number) => {
    const next = [...checklistItems];
    next[idx].done = !next[idx].done;
    setChecklistItems(next);
  };

  const removeChecklist = (idx: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Header Banner & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border bg-black/40 border-amber-500/20 shadow-lg backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-sky-500/20 border border-amber-500/30 text-amber-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-1.5">
                Google Picker & Google Keep Workspace Hub
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-2xl leading-relaxed">
              Use <strong>Google Picker</strong> to browse, select, and import documents from your Google Drive with zero configuration. Create structured notes and dispatch them directly into <strong>Google Keep</strong> or export Keep-compatible archives.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          {/* Google Picker Trigger Button */}
          <button
            type="button"
            onClick={handleLaunchPicker}
            disabled={isOpeningPicker}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif font-semibold bg-gradient-to-r from-sky-500/20 to-blue-600/20 hover:from-sky-500/30 hover:to-blue-600/30 border border-sky-400/40 text-sky-200 transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Open Google Picker to select and import files from Google Drive"
          >
            <FolderSearch className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{isOpeningPicker ? 'Opening Picker...' : 'Pick from Google Drive'}</span>
          </button>

          {/* Direct Keep External Launch */}
          <a
            href="https://keep.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-serif bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 transition-all shadow-sm active:scale-95"
            title="Launch Google Keep web application in a new tab"
          >
            <span>Open Google Keep</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div 
          className={`p-3 rounded-lg text-xs font-serif flex items-center justify-between transition-all ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' 
              : statusMessage.type === 'error'
              ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
              : 'bg-sky-950/60 border border-sky-500/40 text-sky-200'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button 
            type="button" 
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Picked Files Drawer (If any files picked via Google Picker) */}
      {pickedFiles.length > 0 && (
        <div className="bg-black/30 border border-sky-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-serif font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <FolderSearch className="w-3.5 h-3.5" />
              Files Picked via Google Picker ({pickedFiles.length})
            </h4>
            <button
              type="button"
              onClick={() => setPickedFiles([])}
              className="text-[10px] text-slate-400 hover:text-slate-200 font-mono"
            >
              Clear Shelf
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {pickedFiles.map((file) => (
              <div 
                key={file.id}
                className="p-2.5 rounded-lg bg-black/50 border border-white/10 hover:border-sky-400/40 transition-all flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="font-semibold text-slate-200 line-clamp-1 font-serif" title={file.name}>
                      {file.name}
                    </p>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">
                      {file.sizeBytes ? `${(file.sizeBytes / 1024).toFixed(0)} KB` : 'Doc'}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 line-clamp-1">
                    {file.mimeType}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/5">
                  {file.url ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View in Drive
                    </a>
                  ) : <span />}

                  {file.content && onScryQuery && (
                    <button
                      type="button"
                      onClick={() => onScryQuery(file.content!.slice(0, 300), 'Cosmic Revelations')}
                      className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
                    >
                      <Sparkles className="w-2.5 h-2.5" /> Scry File
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Keep Quick Inscriber / Scratchpad */}
      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowScratchpad(!showScratchpad)}>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/15 text-amber-400">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-serif font-bold text-slate-200">
                Google Keep Quick Scratchpad & Inscriber
              </h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Compose notes or checklists ready to copy and paste directly into Google Keep with formatting preserved.
              </p>
            </div>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-200">
            {showScratchpad ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showScratchpad && (
          <div className="mt-4 flex flex-col gap-3">
            {/* Note Title & Color Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <input
                type="text"
                value={scratchTitle}
                onChange={(e) => setScratchTitle(e.target.value)}
                placeholder="Google Keep Note Title (e.g., Tree of Life Insights)..."
                className="flex-1 bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-serif placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans text-slate-400">Keep Color:</span>
                <div className="flex items-center gap-1.5">
                  {KEEP_THEME_COLORS.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      title={col.name}
                      onClick={() => setScratchColor(col)}
                      style={{ backgroundColor: col.hex }}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        scratchColor.name === col.name ? 'ring-2 ring-white scale-125' : 'border-black/50 opacity-80'
                      }`}
                    />
                  ))}
                </div>

                {/* Checklist Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setIsChecklist(!isChecklist)}
                  className={`ml-2 px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 border transition-all ${
                    isChecklist ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-black/40 border-white/10 text-slate-400'
                  }`}
                  title="Toggle Keep Checklist Mode"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>{isChecklist ? 'Checklist' : 'Text'}</span>
                </button>
              </div>
            </div>

            {/* Note Content (Text or Checklist) */}
            {isChecklist ? (
              <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex flex-col gap-2">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => toggleChecklist(idx)} 
                      className="text-amber-400 hover:text-amber-300"
                    >
                      {item.done ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
                    </button>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateChecklist(idx, e.target.value)}
                      placeholder={`Task item ${idx + 1}...`}
                      className={`flex-1 bg-transparent border-none text-xs font-serif focus:outline-none ${
                        item.done ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeChecklist(idx)}
                      className="text-slate-600 hover:text-rose-400 text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addChecklistItem}
                  className="self-start text-[11px] font-sans text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3 h-3" /> Add item
                </button>
              </div>
            ) : (
              <textarea
                value={scratchBody}
                onChange={(e) => setScratchBody(e.target.value)}
                placeholder="Take a note for Google Keep... Capture symbols, transmissions, citations, or reflections."
                rows={3}
                className="w-full bg-black/40 border border-white/15 rounded-lg p-3 text-xs text-slate-200 font-serif placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            )}

            {/* Scratchpad Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-serif">Tradition Tag:</span>
                <select
                  value={scratchSchool}
                  onChange={(e) => setScratchSchool(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="Hermetic Alchemy">Hermetic Alchemy</option>
                  <option value="Kabbalah">Kabbalah</option>
                  <option value="Gnosticism">Gnosticism</option>
                  <option value="Divine Law Scholarship">Divine Law (Prophets)</option>
                  <option value="Cosmic Revelations">Cosmic Revelations</option>
                  <option value="Personal Reflection">Personal Reflection</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy & Launch Keep */}
                <button
                  type="button"
                  onClick={() => {
                    const contentStr = isChecklist
                      ? checklistItems.map(i => `${i.done ? '[x]' : '[ ]'} ${i.text}`).join('\n')
                      : scratchBody;
                    handleCopyFormattedForKeep(
                      scratchTitle || 'Mystic Insight',
                      contentStr,
                      `#${scratchSchool.replace(/\s+/g, '')}`
                    );
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-semibold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 transition-all shadow-sm active:scale-95"
                >
                  {scratchCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied! Opening Keep</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copy & Open in Google Keep</span>
                    </>
                  )}
                </button>

                {/* Import into Grimoire */}
                {onImportNote && (
                  <button
                    type="button"
                    onClick={() => {
                      const contentStr = isChecklist
                        ? checklistItems.map(i => `${i.done ? '[x]' : '[ ]'} ${i.text}`).join('\n')
                        : scratchBody;
                      onImportNote({
                        title: scratchTitle || 'Keep Scratchpad Note',
                        content: contentStr,
                        school: scratchSchool,
                        color: scratchColor.bgClass,
                        pinned: false
                      });
                      setStatusMessage({ text: 'Inscribed note to Grimoire Journal!', type: 'success' });
                    }}
                    disabled={!scratchTitle && !scratchBody && checklistItems.every(i => !i.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Inscribe to Journal</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* One-Tap Mystic Inquiries -> Google Keep & Oracle Dispatch */}
      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-serif font-semibold text-slate-200 uppercase tracking-wider">
              Single-Tap Inquiries (Google Keep & Oracle Sync)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            One-click scry or copy for Google Keep
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {COMMON_MYSTIC_QUERIES.map((item, idx) => (
            <div 
              key={item.title}
              className="p-3 rounded-lg bg-black/50 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <p className="font-serif font-bold text-xs text-amber-300">
                    {item.title}
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 px-1 py-0.2 bg-white/5 rounded">
                    {item.school.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                  {item.query}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px]">
                {/* 1-tap Send to Google Keep */}
                <button
                  type="button"
                  onClick={() => handleCopyFormattedForKeep(item.title, item.query, item.tag, idx)}
                  className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors"
                  title="Copy note with tags and open in Google Keep"
                >
                  {copiedQueryIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Send to Keep</span>
                    </>
                  )}
                </button>

                {/* 1-tap Oracle Scry */}
                {onScryQuery && (
                  <button
                    type="button"
                    onClick={() => onScryQuery(item.query, item.school)}
                    className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-serif font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 active:scale-95"
                    title="Launch immediate Oracle consultation"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Scry Query</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Keep Archive Import / Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black/20 border border-white/5 rounded-xl text-xs font-serif">
        <div className="flex items-center gap-2 text-slate-400">
          <Download className="w-4 h-4 text-amber-400" />
          <span>Google Keep Archive Sync & Backup:</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportKeepJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs transition-all"
            title="Download Keep-formatted JSON archive"
          >
            <Download className="w-3 h-3" />
            <span>Export Keep JSON</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs transition-all cursor-pointer">
            <Upload className="w-3 h-3" />
            <span>Import Keep JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportKeepJson}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default GoogleKeepAndPickerHub;
