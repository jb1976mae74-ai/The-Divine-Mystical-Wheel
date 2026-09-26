import React, { useState, useEffect, useMemo } from 'react';
import { 
  Pin, Trash, Search, Grid, List, Plus, LogIn, LogOut, Check, 
  CloudLightning, AlertTriangle, FileText, Calendar, Cloud, RefreshCw,
  Copy, ExternalLink, TrendingUp, Activity, Milestone, Compass, 
  Layers, Sun, Droplet, Wind, CircleDot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, logout, getAccessToken, db, auth } from '../firebase';
import { User } from 'firebase/auth';
import { 
  collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot
} from 'firebase/firestore';
import MiniWYSIWYG, { parseMarkdownToHtml } from './MiniWYSIWYG';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

export interface GrimoireNote {
  id: string;
  title: string;
  content: string;
  school: string;
  color: string; // Thematic background color
  pinned: boolean;
  createdAt: string;
}

interface GrimoireNotesProps {
  lastInquiry?: { question: string; answer: string; school: string };
  onSaveConfirmed?: () => void;
  activeTheme?: any;
  triggerSaveNoteCounter?: number;
}

const PALETTE = [
  { name: 'Obsidian Void', bg: 'bg-[#18181b]/95 border-zinc-800', hex: '#18181b', text: 'text-zinc-200' },
  { name: 'Aether Gold', bg: 'bg-[#2e2b1c]/95 border-amber-900/45', hex: '#2e2b1c', text: 'text-amber-100' },
  { name: 'Sage Green', bg: 'bg-[#1a2e1d]/95 border-emerald-900/45', hex: '#1a2e1d', text: 'text-emerald-100' },
  { name: 'Midnight Astral', bg: 'bg-[#161f38]/95 border-blue-900/40', hex: '#161f38', text: 'text-sky-100' },
  { name: 'Crimson Temple', bg: 'bg-[#331111]/95 border-rose-950/50', hex: '#331111', text: 'text-rose-100' },
];

export default function GrimoireNotes({ lastInquiry, activeTheme, triggerSaveNoteCounter }: GrimoireNotesProps) {
  const dTheme = activeTheme || {
    id: 'ancient-gold',
    name: 'Ancient Gold',
    bgPage: 'bg-[#070708]',
    bgCard: 'bg-[#141416]',
    textPrimary: 'text-[#D4AF37]',
    textAccent: 'text-amber-500',
    textAccentHex: '#D4AF37',
    accentGradient: 'from-[#D4AF37] to-[#AA6C39]',
    borderAccent: 'border-[#D4AF37]/20',
    borderAccentSemi: 'border-[#D4AF37]/45',
    inputFocus: 'focus:border-[#D4AF37] focus:ring-[#D4AF37]/50',
  };

  const [notes, setNotes] = useState<GrimoireNote[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [school, setSchool] = useState('Personal Reflection');
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'dashboard'>('grid');

  const getActiveViewBtnStyle = (mode: string) => {
    if (viewMode !== mode) {
      return "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent";
    }
    if (dTheme.id === 'deep-void') {
      return "bg-[#c084fc]/15 text-violet-300 border border-[#c084fc]/35 font-medium shadow-md shadow-violet-950/20";
    }
    if (dTheme.id === 'ethereal-silver') {
      return "bg-[#cbd5e1]/15 text-slate-300 border border-[#cbd5e1]/35 font-medium shadow-md shadow-slate-950/20";
    }
    return "bg-[#D4AF37]/15 text-amber-300 border border-[#D4AF37]/35 font-medium shadow-md shadow-amber-950/20";
  };

  const getDThemeSaveBtnStyle = () => {
    if (dTheme.id === 'deep-void') {
      return "bg-[#c084fc]/20 hover:bg-[#c084fc]/35 text-violet-300 border border-[#c084fc]/40 rounded-lg p-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
    }
    if (dTheme.id === 'ethereal-silver') {
      return "bg-[#cbd5e1]/20 hover:bg-[#cbd5e1]/35 text-slate-200 border border-[#cbd5e1]/40 rounded-lg p-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
    }
    return "bg-[#D4AF37]/90 hover:bg-[#D4AF37] text-black rounded-lg p-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
  };

  const getDThemeInscribeBtnStyle = () => {
    if (dTheme.id === 'deep-void') {
      return "w-full sm:w-auto shrink-0 bg-[#c084fc]/15 hover:bg-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/50 rounded-lg px-4 py-2 text-xs font-serif transition-all";
    }
    if (dTheme.id === 'ethereal-silver') {
      return "w-full sm:w-auto shrink-0 bg-[#cbd5e1]/15 hover:bg-[#cbd5e1]/30 text-slate-200 border border-[#cbd5e1]/50 rounded-lg px-4 py-2 text-xs font-serif transition-all";
    }
    return "w-full sm:w-auto shrink-0 bg-amber-500/10 hover:bg-amber-500/25 text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-xs font-serif transition-all";
  };
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ id: string; service: 'drive' | 'tasks' | 'calendar' | 'docs'; status: 'idle' | 'syncing' | 'success' | 'error'; message?: string } | null>(null);

  // Google Calendar scheduling state
  const [schedulingNote, setSchedulingNote] = useState<any | null>(null);
  const [ritualDateTime, setRitualDateTime] = useState('');
  const [ritualDuration, setRitualDuration] = useState(30);
  const [ritualLocation, setRitualLocation] = useState('Inner Sanctum Sanctum');

  const openCalendarModal = (note: GrimoireNote) => {
    // Current date/time plus 1 hour, formatted for datetime-local (YYYY-MM-DDTHH:mm)
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    setRitualDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    setRitualDuration(30);
    setRitualLocation('Mystical Sanctuary');
    setSchedulingNote(note);
  };

  enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
      tenantId?: string | null;
    }
  }

  function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
      },
      operationType,
      path
    };
    console.warn('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  // Initialize Auth Session
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle Note subscription and local/Firestore merging based on Auth state
  useEffect(() => {
    if (!user) {
      // Load local guest notes when signed out
      const saved = localStorage.getItem('mystical_grimoire_notes');
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch (e) {
          console.warn('Failed to parse notes:', e);
        }
      } else {
        setNotes([]);
      }
      return;
    }

    // Subscribe to user's notes in Firestore
    const path = `users/${user.uid}/notes`;
    const unsubscribeNotes = onSnapshot(
      collection(db, 'users', user.uid, 'notes'),
      (snapshot) => {
        const firestoreNotes: GrimoireNote[] = [];
        snapshot.forEach((docSnap) => {
          firestoreNotes.push(docSnap.data() as GrimoireNote);
        });
        
        // Sort by timestamp descending
        firestoreNotes.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setNotes(firestoreNotes);

        // Auto-merge local notes if any exist
        const savedLocal = localStorage.getItem('mystical_grimoire_notes');
        if (savedLocal) {
          try {
            const localNotes: GrimoireNote[] = JSON.parse(savedLocal);
            if (localNotes.length > 0) {
              console.log("Merging local notes to Firestore...");
              localNotes.forEach(async (note) => {
                const notePath = `${path}/${note.id}`;
                try {
                  await setDoc(doc(db, 'users', user.uid, 'notes', note.id), {
                    ...note,
                    userId: user.uid
                  });
                } catch (err) {
                  handleFirestoreError(err, OperationType.WRITE, notePath);
                }
              });
              // Clear local storage notes so we don't merge them again
              localStorage.removeItem('mystical_grimoire_notes');
            }
          } catch (e) {
            console.warn('Failed to merge local notes:', e);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => {
      unsubscribeNotes();
    };
  }, [user]);

  // Listen for external updates from other tabs (e.g. Salazar Scholarship notes)
  useEffect(() => {
    const handleUpdate = () => {
      if (user) return; // Managed by Firestore sub in logged-in state
      const saved = localStorage.getItem('mystical_grimoire_notes');
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch (e) {
          console.warn('Failed to update notes from event:', e);
        }
      }
    };
    window.addEventListener('mystical_notes_updated', handleUpdate);
    return () => {
      window.removeEventListener('mystical_notes_updated', handleUpdate);
    };
  }, [user]);

  // Listen for programmatic creation of new notes from other components
  useEffect(() => {
    const handleCustomAdd = async (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; content: string; school?: string; color?: string }>;
      const { title, content, school: noteSchool, color } = customEvent.detail;
      
      const newNote: GrimoireNote = {
        id: crypto.randomUUID(),
        title: title,
        content: content,
        school: noteSchool || school,
        color: color || selectedColor.bg,
        pinned: false,
        createdAt: new Date().toLocaleString(),
      };

      if (user) {
        const notePath = `users/${user.uid}/notes/${newNote.id}`;
        try {
          await setDoc(doc(db, 'users', user.uid, 'notes', newNote.id), {
            ...newNote,
            userId: user.uid
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, notePath);
        }
      } else {
        saveNotesToLocal([newNote, ...notes]);
      }
    };
    
    window.addEventListener('add_custom_mystical_note', handleCustomAdd);
    return () => {
      window.removeEventListener('add_custom_mystical_note', handleCustomAdd);
    };
  }, [user, notes, school, selectedColor]);

  // Handle programmatic voice commands to save notes
  useEffect(() => {
    if (triggerSaveNoteCounter && triggerSaveNoteCounter > 0) {
      handleSaveLastInquiry();
    }
  }, [triggerSaveNoteCounter]);

  // Save notes helper for Guest/offline mode
  const saveNotesToLocal = (newNotes: GrimoireNote[]) => {
    setNotes(newNotes);
    localStorage.setItem('mystical_grimoire_notes', JSON.stringify(newNotes));
  };

  // Add standard note
  const handleAddNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    const newNote: GrimoireNote = {
      id: crypto.randomUUID(),
      title: title.trim() || 'Untitled Journal Note',
      content: content.trim(),
      school,
      color: selectedColor.bg,
      pinned: false,
      createdAt: new Date().toLocaleString(),
    };

    if (user) {
      const notePath = `users/${user.uid}/notes/${newNote.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'notes', newNote.id), {
          ...newNote,
          userId: user.uid
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, notePath);
      }
    } else {
      saveNotesToLocal([newNote, ...notes]);
    }

    setTitle('');
    setContent('');
  };

  // Quick save of oracle inquiry
  const handleSaveLastInquiry = async () => {
    if (!lastInquiry || !lastInquiry.answer) return;

    const newNote: GrimoireNote = {
      id: crypto.randomUUID(),
      title: `Contemplation: "${lastInquiry.question.slice(0, 35)}${lastInquiry.question.length > 35 ? '...' : ''}"`,
      content: `### Seeker's Inquiry\n> ${lastInquiry.question}\n\n### Oracle Responded\n${lastInquiry.answer}`,
      school: lastInquiry.school,
      color: 'bg-[#2e2b1c]/95 border-amber-900/45', // Use aether gold theme for oracle insights
      pinned: true,
      createdAt: new Date().toLocaleString(),
    };

    if (user) {
      const notePath = `users/${user.uid}/notes/${newNote.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'notes', newNote.id), {
          ...newNote,
          userId: user.uid
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, notePath);
      }
    } else {
      saveNotesToLocal([newNote, ...notes]);
    }
  };

  // Delete note
  const handleDeleteNote = async (id: string) => {
    if (user) {
      const notePath = `users/${user.uid}/notes/${id}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, notePath);
      }
    } else {
      saveNotesToLocal(notes.filter(n => n.id !== id));
    }
  };

  // Toggle pin
  const handleTogglePin = async (id: string) => {
    const noteToUpdate = notes.find(n => n.id === id);
    if (!noteToUpdate) return;

    if (user) {
      const notePath = `users/${user.uid}/notes/${id}`;
      try {
        await updateDoc(doc(db, 'users', user.uid, 'notes', id), {
          pinned: !noteToUpdate.pinned
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, notePath);
      }
    } else {
      saveNotesToLocal(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    }
  };

  // Firebase auth sign in
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.warn('Google authorization failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setNeedsAuth(true);
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  // Sync to Google Drive as Markdown Document
  const handleSyncToDrive = async (note: GrimoireNote) => {
    if (needsAuth) {
      alert('Please connect your Google Workspace account to sync Notes.');
      return;
    }

    setSyncStatus({ id: note.id, service: 'drive', status: 'syncing' });

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No access token - please sign in again.');

      // 1. Create file metadata in Drive
      const filename = `${note.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}_Grimoire.md`;
      const metadataResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: filename,
          mimeType: 'text/markdown',
          description: `Esoteric transmission saved from Oracle on school of ${note.school}`
        })
      });

      if (!metadataResponse.ok) {
        const errDetail = await metadataResponse.json();
        throw new Error(errDetail.error?.message || 'Failed to initialize Google Drive file creation.');
      }

      const fileData = await metadataResponse.json();
      const fileId = fileData.id;

      // 2. Upload file content to Drive via PATCH media type
      const fileContent = `# ${note.title}\n\n**Tradition**: ${note.school}\n**Inscribed**: ${note.createdAt}\n\n---\n\n${note.content}\n\n\n*Saved via Mystical Oracle Grimoire API Connection.*`;
      
      const uploadResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/markdown',
        },
        body: fileContent
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to transfer contents into Google Drive file container.');
      }

      setSyncStatus({ 
        id: note.id, 
        service: 'drive', 
        status: 'success', 
        message: 'Successfully inscribed in Google Drive!' 
      });

      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: any) {
      console.warn('Drive upload exception:', err);
      setSyncStatus({ 
        id: note.id, 
        service: 'drive', 
        status: 'error', 
        message: err.message || 'Transmission failed.' 
      });
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  // Sync to Google Docs
  const handleSyncToDocs = async (note: GrimoireNote) => {
    if (needsAuth) {
      alert('Please connect your Google Workspace account to sync Notes.');
      return;
    }

    setSyncStatus({ id: note.id, service: 'docs', status: 'syncing' });

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No access token - please sign in again.');

      // 1. Create document in Google Docs
      const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: note.title
        })
      });

      if (!createResponse.ok) {
        const errDetail = await createResponse.json();
        throw new Error(errDetail.error?.message || 'Failed to create Google Doc.');
      }

      const docData = await createResponse.json();
      const documentId = docData.documentId;

      // 2. Format content and insert text using batchUpdate
      // Strip markdown syntax and html tags for Google Docs compatibility
      const cleanContent = note.content
        .replace(/<[^>]*>/g, '') // strip html
        .replace(/###\s+/g, '')  // strip H3 headers
        .replace(/##\s+/g, '')   // strip H2 headers
        .replace(/#\s+/g, '')    // strip H1 headers
        .replace(/\*\*/g, '')    // strip bold
        .replace(/\*/g, '')      // strip italic
        .replace(/>/g, '');      // strip blockquotes

      const docBodyText = `Tradition: ${note.school}\nInscribed: ${note.createdAt}\n\n${cleanContent}\n\n*Saved via Mystical Oracle Grimoire API Connection.*`;

      const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                text: docBodyText,
                location: {
                  index: 1
                }
              }
            }
          ]
        })
      });

      if (!updateResponse.ok) {
        const errDetail = await updateResponse.json();
        throw new Error(errDetail.error?.message || 'Failed to populate Google Doc contents.');
      }

      setSyncStatus({ 
        id: note.id, 
        service: 'docs', 
        status: 'success', 
        message: 'Doc created!' 
      });

      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: any) {
      console.warn('Google Docs sync exception:', err);
      setSyncStatus({ 
        id: note.id, 
        service: 'docs', 
        status: 'error', 
        message: err.message || 'Docs sync failed.' 
      });
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  // Sync to Google Tasks
  const handleSyncToTasks = async (note: GrimoireNote) => {
    if (needsAuth) {
      alert('Please connect your Google Workspace account to sync Notes.');
      return;
    }

    setSyncStatus({ id: note.id, service: 'tasks', status: 'syncing' });

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No access token - please sign in again.');

      // Google Tasks payload
      const payload = {
        title: `Contemplate: ${note.title}`,
        notes: `Tradition: ${note.school}\n\n${note.content.replace(/[#*>]/g, '').slice(0, 800)}...`
      };

      const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errDetail = await res.json();
        throw new Error(errDetail.error?.message || 'Failed creating Workspace Task.');
      }

      setSyncStatus({ 
        id: note.id, 
        service: 'tasks', 
        status: 'success', 
        message: 'Task added to your list!' 
      });

      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: any) {
      console.warn('Google Tasks error:', err);
      setSyncStatus({ 
        id: note.id, 
        service: 'tasks', 
        status: 'error', 
        message: err.message || 'Task upload failed.' 
      });
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  // Submit proposed Google Calendar Event
  const handleScheduleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingNote) return;

    const note = schedulingNote;
    setSchedulingNote(null);

    // Confirm standard warning dialog for writing or updating Google Calendar events as mandated!
    const confirmed = window.confirm(
      `Do you grant permission to create the event "Ritual: ${note.title}" on your Google Calendar?`
    );
    if (!confirmed) return;

    setSyncStatus({ id: note.id, service: 'calendar', status: 'syncing' });

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No access token - please sign in again.');

      const startDateTime = new Date(ritualDateTime).toISOString();
      const endDateTime = new Date(new Date(ritualDateTime).getTime() + ritualDuration * 60 * 1000).toISOString();

      const payload = {
        summary: `🔮 Hermetic Contemplation: ${note.title}`,
        location: ritualLocation || 'Inner Sanctum Sanctuary',
        description: `Tradition of Study: ${note.school}\n\nNotes of Insight & Revelations:\n${note.content.replace(/[#*>_]/g, '')}\n\n---\nScheduled via Mystical Oracle Grimoire API Connection.`,
        start: {
          dateTime: startDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        },
        end: {
          dateTime: endDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        },
        reminders: {
          useDefault: true
        }
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errDetail = await res.json();
        throw new Error(errDetail.error?.message || 'Failed creating Workspace Calendar Event.');
      }

      setSyncStatus({ 
        id: note.id, 
        service: 'calendar', 
        status: 'success', 
        message: 'Ritual scheduled in Google Calendar!' 
      });

      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: any) {
      console.warn('Google Calendar error:', err);
      setSyncStatus({ 
        id: note.id, 
        service: 'calendar', 
        status: 'error', 
        message: err.message || 'Scheduling failed.' 
      });
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.school.toLowerCase().includes(query)
    );
  });

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <div className={`w-full ${dTheme.bgCard || 'bg-[#141416]'} border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 text-slate-200`}>
      
      {/* Header section with Account/Cloud connection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className={`text-xl font-serif ${dTheme.textPrimary} flex items-center gap-2`}>
            <CloudLightning className={`w-5 h-5 ${dTheme.id === 'deep-void' ? 'text-violet-400' : dTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> Seeker's Grimoire Journal
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-1">Inscribe insights locally or sync to Google Workspace</p>
        </div>

        {/* Sync Controls / User login info */}
        <div>
          {needsAuth ? (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className={`group relative flex items-center gap-3 bg-[#0a0a0c] hover:bg-black border border-white/10 ${dTheme.id === 'deep-void' ? 'hover:border-violet-500/40' : dTheme.id === 'ethereal-silver' ? 'hover:border-slate-400/40' : 'hover:border-amber-400/40'} rounded-xl px-4 py-2 text-sm text-slate-300 font-medium transition-all duration-300`}
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className={`w-4 h-4 animate-spin ${dTheme.textPrimary || 'text-[#D4AF37]'}`} />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span className="font-serif">Workspace Link</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-[#111113] border border-white/5 rounded-xl px-4 py-2">
              <div className="flex flex-col items-end">
                <span className={`text-xs font-serif ${dTheme.textPrimary}`}>Linked Account</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</span>
              </div>
              <button 
                onClick={handleLogout} 
                title="Banish connection"
                className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Google Keep Workspace alignment banner */}
      <div className={`rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-serif ${dTheme.id === 'deep-void' ? 'bg-violet-950/10 border border-violet-500/10 text-violet-200/95' : dTheme.id === 'ethereal-silver' ? 'bg-slate-900/10 border border-slate-400/10 text-slate-200/95' : 'bg-amber-950/10 border border-amber-500/10 text-amber-200/95'}`}>
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-1.5 rounded shrink-0 mt-0.5 ${dTheme.id === 'deep-void' ? 'bg-violet-500/15 text-violet-400' : dTheme.id === 'ethereal-silver' ? 'bg-slate-500/15 text-slate-300' : 'bg-amber-500/15 text-amber-500'}`}>
            <Copy className="w-4 h-4" />
          </div>
          <div className="leading-relaxed">
            <p className={`font-semibold font-serif mb-0.5 text-sm ${dTheme.id === 'deep-void' ? 'text-violet-300' : dTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-amber-300'}`}>Google Keep Integration & Notes Hub</p>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Use the <strong className={`${dTheme.id === 'deep-void' ? 'text-violet-300' : dTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-amber-300'}`}>Keep</strong> button on any note card to automatically copy its title and formatted content and open <strong className="text-slate-200">Google Keep</strong> ready for instant pasting. You can also sync notes as markdown documents directly to <strong>Google Drive</strong>, export to <strong>Google Docs</strong>, and set reminders in <strong>Google Tasks</strong>.
            </p>
          </div>
        </div>
        <a
          href="https://keep.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-serif flex items-center gap-1.5 transition-all shadow-sm ${
            dTheme.id === 'deep-void' 
              ? 'bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/25' 
              : dTheme.id === 'ethereal-silver' 
              ? 'bg-slate-800/40 border-slate-500/30 text-slate-200 hover:bg-slate-800/60' 
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
          }`}
        >
          <span>Open Google Keep</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Save last Oracle response directly */}
      {lastInquiry && lastInquiry.answer && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${dTheme.id === 'deep-void' ? 'bg-violet-950/20 border border-violet-500/25' : dTheme.id === 'ethereal-silver' ? 'bg-slate-900/25 border border-slate-400/25' : 'bg-amber-950/20 border border-[#D4AF37]/20'}`}
        >
          <div className="flex-1">
            <span className={`text-xs uppercase tracking-widest font-semibold flex items-center gap-1 ${dTheme.textPrimary}`}>
              <Plus className="w-3.5 h-3.5" /> Direct Inscription Available
            </span>
            <p className="text-sm font-serif text-slate-300 mt-1 line-clamp-1 italic">
              "{lastInquiry.question}"
            </p>
          </div>
          <button
            onClick={handleSaveLastInquiry}
            className={getDThemeInscribeBtnStyle()}
          >
            Inscribe onto Journal
          </button>
        </motion.div>
      )}

      {/* Note Creation Form (Keep note input box) */}
      <form onSubmit={handleAddNote} className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Note Title/Subject..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`bg-transparent border-none text-base font-serif ${dTheme.id === 'deep-void' ? 'text-violet-200' : dTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-amber-200'} placeholder-slate-600 focus:outline-none focus:ring-0 w-full`}
        />

        <MiniWYSIWYG
          value={content}
          onChange={setContent}
          placeholder="Capture your mystical revelation..."
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
          {/* Metadata tradition selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-serif">Tag:</span>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className={`bg-transparent hover:bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none ${dTheme.id === 'deep-void' ? 'focus:border-violet-400' : dTheme.id === 'ethereal-silver' ? 'focus:border-slate-300' : 'focus:border-[#D4AF37]'} cursor-pointer`}
            >
              <option value="Personal Reflection">Reflection</option>
              <option value="Hermetic Alchemy">Alchemy</option>
              <option value="Kabbalah">Kabbalah</option>
              <option value="Gnosticism">Gnosticism</option>
              <option value="Enochian">Enochian</option>
              <option value="Anunnaki">Anunnaki</option>
              <option value="Babylonian">Babylonian</option>
              <option value="Egyptian">Egyptian</option>
              <option value="Hindu">Hindu</option>
              <option value="Ba'hai">Ba'hai</option>
              <option value="Greek Mythology">Greek Myth</option>
              <option value="Jerry Ben Salazar's Scholarship (Creator)">Jerry Salazar's Scholarship</option>
              <option value="Jacob Boehme's Scholarship">Jacob Boehme's Scholarship</option>
              <option value="Divine Law Scholarship">Divine Law</option>
              <option value="Cosmic Revelations">Cosmic</option>
            </select>
          </div>

          {/* Color palette selector */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {PALETTE.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full border transition-all duration-200 ${color.bg} ${selectedColor.name === color.name ? `ring-2 ${dTheme.id === 'deep-void' ? 'ring-violet-400' : dTheme.id === 'ethereal-silver' ? 'ring-slate-300' : 'ring-amber-400'} border-none scale-110` : 'border-white/15'}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!title.trim() && !content.trim()}
              className={getDThemeSaveBtnStyle()}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </form>

      {/* Notes Control Bar (Search, View Toggle) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-black/20 border border-white/5 rounded-xl p-3 justify-between">
        <div className={`flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5 rounded-lg border bg-black/10 transition-all duration-300 ${viewMode === 'dashboard' ? 'opacity-40 border-transparent pointer-events-none' : `border-white/5 ${dTheme.id === 'deep-void' ? 'focus-within:border-violet-500/30' : dTheme.id === 'ethereal-silver' ? 'focus-within:border-slate-500/30' : 'focus-within:border-amber-500/30'}`}`}>
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search grimoire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={viewMode === 'dashboard'}
            className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1 border border-white/5 rounded-lg self-end md:self-auto">
          <button 
            type="button"
            onClick={() => setViewMode('grid')}
            className={getActiveViewBtnStyle('grid')}
            title="Grid View of Journal Notes"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setViewMode('list')}
            className={getActiveViewBtnStyle('list')}
            title="List View of Journal Notes"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>

          <button 
            type="button"
            onClick={() => setViewMode('dashboard')}
            className={`${getActiveViewBtnStyle('dashboard')} ${viewMode === 'dashboard' ? 'animate-pulse' : ''}`}
            title="Spiritual Growth & Element Aura Balance Dashboard"
          >
            <TrendingUp className={`w-3.5 h-3.5 ${dTheme.id === 'deep-void' ? 'text-violet-400' : dTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} />
            <span>Spiritual Dashboard</span>
          </button>
        </div>
      </div>

      {/* Grid/List of Notes or Spiritual Dashboard */}
      <div className="flex flex-col gap-6">
        {viewMode === 'dashboard' ? (
          <GrimoireDashboard notes={notes} dTheme={dTheme} />
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-400/70 font-semibold flex items-center gap-1.5 font-serif pl-1">
                  <Pin className="w-3 h-3 text-amber-500" /> Pinned Revelations
                </span>
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  <AnimatePresence mode="popLayout">
                    {pinnedNotes.map((note, pIdx) => (
                      <NoteCard 
                        key={`${note.id}-${pIdx}`}
                        note={note}
                        needsAuth={needsAuth}
                        syncStatus={syncStatus}
                        onTogglePin={handleTogglePin}
                        onDelete={handleDeleteNote}
                        onSyncToDrive={handleSyncToDrive}
                        onSyncToTasks={handleSyncToTasks}
                        onSyncToCalendar={openCalendarModal}
                        onSyncToDocs={handleSyncToDocs}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Other Section */}
            <div className="flex flex-col gap-2">
              {pinnedNotes.length > 0 && <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold font-serif pl-1">Other Observations</span>}
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-slate-600 italic font-serif">
                   The Grimoire is currently silent. Consult the Oracle or journal your ideas above to start.
                </div>
              ) : (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  <AnimatePresence mode="popLayout">
                    {otherNotes.map((note, oIdx) => (
                      <NoteCard 
                        key={`${note.id}-${oIdx}`}
                        note={note}
                        needsAuth={needsAuth}
                        syncStatus={syncStatus}
                        onTogglePin={handleTogglePin}
                        onDelete={handleDeleteNote}
                        onSyncToDrive={handleSyncToDrive}
                        onSyncToTasks={handleSyncToTasks}
                        onSyncToCalendar={openCalendarModal}
                        onSyncToDocs={handleSyncToDocs}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Calendar Scheduling Modal Overlay */}
      <AnimatePresence>
        {schedulingNote && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md ${dTheme.bgCard || 'bg-[#141416]'} border ${dTheme.id === 'deep-void' ? 'border-[#c084fc]/30' : dTheme.id === 'ethereal-silver' ? 'border-slate-500/30' : 'border-[#D4AF37]/30'} rounded-2xl p-6 shadow-2xl text-slate-200`}
            >
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Calendar className={`w-5 h-5 ${dTheme.id === 'deep-void' ? 'text-violet-400' : dTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-[#D4AF37]'} animate-pulse`} />
                <h3 className={`text-lg font-serif font-semibold ${dTheme.textPrimary}`}>Schedule Ritual Contemplation</h3>
              </div>

              <p className="text-xs text-slate-400 mb-4 font-serif italic">
                Inscribe a timed space in your Google Calendar as a dedication to deeper contemplation of this transmission.
              </p>

              <form onSubmit={handleScheduleConfirm} className="flex flex-col gap-4 font-serif">
                {/* Event Name */}
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400">Ritual Session Name</label>
                  <input
                    type="text"
                    disabled
                    value={`🔮 Contemplation: ${schedulingNote.title}`}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 font-serif"
                  />
                </div>

                {/* Date & Time */}
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400">Dedication Hour</label>
                  <input
                    type="datetime-local"
                    required
                    value={ritualDateTime}
                    onChange={(e) => setRitualDateTime(e.target.value)}
                    className={`w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none ${dTheme.id === 'deep-void' ? 'focus:border-violet-400 focus:ring-violet-400/50' : dTheme.id === 'ethereal-silver' ? 'focus:border-slate-300 focus:ring-slate-300/50' : 'focus:border-[#D4AF37] focus:ring-[#D4AF37]/50'} focus:ring-1`}
                  />
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400">Ritual Duration</label>
                  <div className="relative">
                    <select
                      value={ritualDuration}
                      onChange={(e) => setRitualDuration(Number(e.target.value))}
                      className={`w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none ${dTheme.id === 'deep-void' ? 'focus:border-violet-400 focus:ring-violet-400/50' : dTheme.id === 'ethereal-silver' ? 'focus:border-slate-300 focus:ring-slate-300/50' : 'focus:border-[#D4AF37] focus:ring-[#D4AF37]/50'} focus:ring-1 appearance-none`}
                    >
                      <option value={15} className="bg-[#141416]">15 Minutes of Silence</option>
                      <option value={30} className="bg-[#141416]">30 Minutes of Meditation</option>
                      <option value={60} className="bg-[#141416]">1 Hour of Ritual Synthesis</option>
                      <option value={120} className="bg-[#141416]">2 Hours of Deep Study</option>
                    </select>
                    <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${dTheme.textPrimary}`}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400">Sacred Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Inner Sanctum, Home Altar, Quiet Woods"
                    value={ritualLocation}
                    onChange={(e) => setRitualLocation(e.target.value)}
                    className={`w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none ${dTheme.id === 'deep-void' ? 'focus:border-violet-400 focus:ring-violet-400/50' : dTheme.id === 'ethereal-silver' ? 'focus:border-slate-300 focus:ring-slate-300/50' : 'focus:border-[#D4AF37] focus:ring-[#D4AF37]/50'} focus:ring-1`}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end mt-4 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setSchedulingNote(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded-lg text-xs font-serif transition-colors"
                  >
                    Close Scroll
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-gradient-to-br ${dTheme.accentGradient} text-black font-semibold rounded-lg text-xs font-serif hover:opacity-90 transition-all shadow-md`}
                  >
                    Inscribe Ritual Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Inner NoteCard Component for clear modularity
interface NoteCardProps {
  note: GrimoireNote;
  needsAuth: boolean;
  syncStatus: { id: string; service: 'drive' | 'tasks' | 'calendar' | 'docs'; status: 'idle' | 'syncing' | 'success' | 'error'; message?: string } | null;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onSyncToDrive: (note: GrimoireNote) => void;
  onSyncToTasks: (note: GrimoireNote) => void;
  onSyncToCalendar: (note: GrimoireNote) => void;
  onSyncToDocs: (note: GrimoireNote) => void;
}

function NoteCard({ 
  note, needsAuth, syncStatus, onTogglePin, onDelete, onSyncToDrive, onSyncToTasks, onSyncToCalendar, onSyncToDocs 
}: NoteCardProps) {
  const currentSync = syncStatus?.id === note.id ? syncStatus : null;
  const [copied, setCopied] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCopy = async () => {
    try {
      const markdownCleanContent = note.content.replace(/[#>]/g, '');
      const fullText = `Title: ${note.title}\nTradition: ${note.school}\nInscribed: ${note.createdAt}\n\n${markdownCleanContent}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const handleOpenGoogleKeep = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const markdownCleanContent = note.content.replace(/<[^>]+>/g, '').replace(/[#>]/g, '');
      const fullText = `${note.title}\n\n${markdownCleanContent}\n\n[Inscribed from The Great Wheel of Mysteries • ${note.school}]`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      window.open('https://keep.google.com/', '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.open('https://keep.google.com/', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-5 border rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group/card ${note.color}`}
    >
      {/* Inline Delete Confirmation Overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-[#0f0f11]/98 backdrop-blur-md rounded-xl p-5 flex flex-col items-center justify-center text-center z-10 border border-red-500/20">
          <Trash className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
          <h5 className="font-serif font-bold text-rose-400 text-sm">Banish Inscription?</h5>
          <p className="text-[11px] text-slate-400 font-sans mt-1 mb-4 leading-relaxed max-w-[220px]">
            Are you certain you wish to purge this revelation permanently from your local Grimoire?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-serif bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5"
            >
              Keep
            </button>
            <button
              onClick={() => {
                onDelete(note.id);
                setConfirmDelete(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-serif bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold shadow-lg shadow-red-950/40 transition-all"
            >
              Banish
            </button>
          </div>
        </div>
      )}

      {/* Top action row */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] uppercase tracking-wider bg-black/40 text-amber-200 border border-amber-600/20 rounded px-2 py-0.5 font-semibold">
          {note.school}
        </span>
        
        <div className="flex items-center gap-1.5">
          {/* Direct Google Keep trigger */}
          <button
            onClick={handleOpenGoogleKeep}
            title={copied ? "Copied! Opening Google Keep..." : "Copy formatted note & open Google Keep"}
            className="p-1 px-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 text-[10px] font-serif flex items-center gap-1 border border-amber-500/30 transition-colors"
          >
            <span className="text-amber-400 font-bold">💡</span>
            <span>Keep</span>
          </button>

          {/* Copy trigger */}
          <button
            onClick={handleCopy}
            title={copied ? "Copied to clipboard!" : "Copy note content for Google Keep"}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-amber-400'}`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Pin trigger */}
          <button
            onClick={() => onTogglePin(note.id)}
            title={note.pinned ? 'Unpin' : 'Pin Revelation'}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${note.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-amber-400' : ''}`} />
          </button>
          
          {/* Delete trigger */}
          <button
            onClick={() => setConfirmDelete(true)}
            title="Banish Note"
            className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Content */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="my-3 flex-grow cursor-pointer group/content"
      >
        <h4 className="font-serif font-bold text-amber-200 text-base border-b border-white/5 pb-1 mb-2 flex items-center justify-between pointer-events-auto">
          <span>{note.title}</span>
          <span className="text-[9px] text-amber-400 font-sans bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded transition-all">
            {isExpanded ? "Collapse" : "Expand"}
          </span>
        </h4>
        
        {isExpanded ? (
          <div 
            className="text-xs md:text-sm text-slate-200 font-serif leading-relaxed space-y-2 select-text focus:outline-none"
            onClick={(e) => e.stopPropagation()} /* Prevent closing when selecting cell text */
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(note.content) }}
          />
        ) : (
          <div className="text-xs md:text-sm text-slate-300 font-serif leading-relaxed line-clamp-6 whitespace-pre-wrap">
            {note.content.includes('|') ? (
              <span className="text-amber-300/90 font-sans text-xs italic flex items-center gap-1.5 py-1 bg-amber-500/5 px-2.5 rounded border border-amber-500/10">
                <span className="p-1 rounded bg-amber-500/15 text-amber-500 font-normal shrink-0">📊</span>
                <span>Contains Inscribed Matrix Data (Click to Expand Grid)</span>
              </span>
            ) : (
              note.content.replace(/[#>*_]/g, '')
            )}
          </div>
        )}
      </div>

      {/* Footer and Cloud sync operations */}
      <div className="border-t border-white/5 pt-3 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="text-[10px] text-slate-500 font-sans">
          {note.createdAt}
        </span>

        {/* Sync panel actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {currentSync ? (
            <span className={`text-[10px] font-sans flex items-center gap-1 px-2 py-0.5 rounded ${
              currentSync.status === 'success' ? 'bg-emerald-950/40 text-emerald-300' :
              currentSync.status === 'error' ? 'bg-red-950/40 text-red-300' :
              'bg-amber-950/30 text-amber-400 animate-pulse'
            }`}>
              {currentSync.status === 'syncing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
              {currentSync.status === 'success' ? <Check className="w-3 h-3 text-emerald-400" /> : null}
              {currentSync.status === 'error' ? <AlertTriangle className="w-3 h-3 text-red-400" /> : null}
              <span>{currentSync.message || 'Syncing...'}</span>
            </span>
          ) : (
            <div className="opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center gap-1">
              <button
                onClick={handleOpenGoogleKeep}
                title="Copy formatted note & launch Google Keep"
                className="p-1 px-1.5 rounded-md bg-black/40 hover:bg-black text-amber-300 hover:text-amber-200 text-[10px] font-serif flex items-center gap-1 border border-amber-500/20"
              >
                <span className="text-[11px]">💡</span>
                <span>Keep</span>
              </button>
              {!needsAuth ? (
                <>
                  <button
                    onClick={() => onSyncToDrive(note)}
                    title="Inscribe to Google Drive as Markdown Document"
                    className="p-1 px-1.5 rounded-md bg-black/40 hover:bg-black text-slate-400 hover:text-amber-400 text-[10px] font-serif flex items-center gap-1 border border-white/5"
                  >
                    <Cloud className="w-3 h-3 text-sky-400" />
                    <span>Drive</span>
                  </button>
                  <button
                    onClick={() => onSyncToDocs(note)}
                    title="Inscribe to Google Docs as a rich document"
                    className="p-1 px-1.5 rounded-md bg-black/40 hover:bg-black text-slate-400 hover:text-blue-400 text-[10px] font-serif flex items-center gap-1 border border-white/5"
                  >
                    <FileText className="w-3 h-3 text-blue-400" />
                    <span>Docs</span>
                  </button>
                  <button
                    onClick={() => onSyncToTasks(note)}
                    title="Inscribe as Reminder task on Google Tasks"
                    className="p-1 px-1.5 rounded-md bg-black/40 hover:bg-black text-slate-400 hover:text-amber-400 text-[10px] font-serif flex items-center gap-1 border border-white/5"
                  >
                    <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                    <span>Task</span>
                  </button>
                  <button
                    onClick={() => onSyncToCalendar(note)}
                    title="Schedule Ritual Contemplation on Google Calendar"
                    className="p-1 px-1.5 rounded-md bg-[#1a1a1c] hover:bg-black text-slate-400 hover:text-rose-400 text-[10px] font-serif flex items-center gap-1 border border-white/5"
                  >
                    <Calendar className="w-3 h-3 text-rose-400 animate-pulse" />
                    <span>Calendar</span>
                  </button>
                </>
              ) : (
                <span className="text-[10px] text-slate-500 italic font-mono pr-1">Connect space to sync</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SPIRITUAL ANALYSIS & PATTERNS DASHBOARD
// ==========================================

interface GrimoireDashboardProps {
  notes: GrimoireNote[];
  dTheme: any;
}

function GrimoireDashboard({ notes, dTheme }: GrimoireDashboardProps) {
  const [selectedSchool, setSelectedSchool] = useState<string>('All');
  const [showTrend, setShowTrend] = useState<boolean>(false);
  const [visibleElements, setVisibleElements] = useState<Record<string, boolean>>({
    Spiritus: true,
    Ignis: true,
    Aqua: true,
    Aer: true,
    Materia: true
  });

  const getNoteMetrics = (note: GrimoireNote) => {
    const text = note.content;
    const categories = ['Spiritus', 'Ignis', 'Aqua', 'Aer', 'Materia'];
    const scores: Record<string, number> = {};
    let foundExplicit = false;

    categories.forEach(cat => {
      const regexStr = new RegExp(`(?:-|\\*|\\s|^)${cat}\\s*[:\\-=\\|]\\s*\\*?\\*?(\\d+)\\*?\\*?`, 'i');
      const match = text.match(regexStr);
      if (match) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val >= 1 && val <= 10) {
          scores[cat] = val;
          foundExplicit = true;
        }
      }
    });

    if (!foundExplicit) {
      const lowerText = text.toLowerCase();
      const keywords: Record<string, string[]> = {
        Spiritus: ['spirit', 'soul', 'god', 'divine', 'spark', 'transcend', 'yahweh', 'lucifer', 'sacred', 'astral', 'celestial', 'heaven', 'enochian', 'angel', 'angelic', 'kabbalah', 'gnosis', 'gnostic', 'temple', 'infinite', 'eternal', 'seeker', 'commandment', 'covenant', 'decree', 'judgment'],
        Ignis: ['fire', 'ignis', 'flame', 'burn', 'passion', 'sulfur', 'energy', 'will', 'force', 'action', 'creative', 'active', 'hot', 'phoenix', 'hearth', 'sun', 'solar', 'volcano', 'tempest', 'spark', 'alchemy'],
        Aqua: ['water', 'aqua', 'intuition', 'emotion', 'flow', 'mercury', 'depth', 'feeling', 'sea', 'ocean', 'lunar', 'moon', 'chalice', 'cupped', 'fluid', 'tide', 'dissolve', 'wash', 'cleanse', 'wave'],
        Aer: ['air', 'aer', 'intellect', 'mind', 'thought', 'breath', 'wind', 'reason', 'philosophy', 'logic', 'conception', 'study', 'breeze', 'sky', 'flight', 'feather', 'words', 'speak', 'oracle', 'thinking', 'law', 'rules', 'principle'],
        Materia: ['matter', 'materia', 'earth', 'physical', 'body', 'ground', 'salt', 'stone', 'lead', 'gold', 'form', 'flesh', 'clay', 'solid', 'crystal', 'anchor', 'root', 'mortal', 'vein', 'iron', 'mineral']
      };

      categories.forEach(cat => {
        const words = keywords[cat];
        let count = 0;
        words.forEach(w => {
          let pos = lowerText.indexOf(w);
          while (pos !== -1) {
            count++;
            pos = lowerText.indexOf(w, pos + w.length);
          }
        });
        const calculatedValue = Math.min(10, Math.max(3, 3 + Math.floor(count / 2)));
        scores[cat] = calculatedValue;
      });
    } else {
      categories.forEach(cat => {
        if (scores[cat] === undefined) {
          scores[cat] = 5;
        }
      });
    }

    return {
      id: note.id,
      title: note.title,
      school: note.school,
      createdAt: note.createdAt.split(',')[0], // cleaner date representation for the chart X-axis
      fullCreatedAt: note.createdAt,
      Spiritus: scores['Spiritus'],
      Ignis: scores['Ignis'],
      Aqua: scores['Aqua'],
      Aer: scores['Aer'],
      Materia: scores['Materia']
    };
  };

  // Get active traditions in notes for dropdown filter
  const traditionsList = useMemo(() => {
    const list = Array.from(new Set(notes.map(n => n.school)));
    return ['All', ...list];
  }, [notes]);

  // Filter notes based on selected tradition
  const filteredNotes = useMemo(() => {
    return selectedSchool === 'All' 
      ? notes 
      : notes.filter(n => n.school === selectedSchool);
  }, [notes, selectedSchool]);

  // Transform notes in chronological order (oldest to newest for growth trend mapping)
  const growthData = useMemo(() => {
    return [...filteredNotes]
      .reverse()
      .map(getNoteMetrics)
      .map((item, idx) => ({
        ...item,
        indexLabel: `#${idx + 1}`,
        displayName: item.title.includes('Contemplation:') 
          ? item.title.replace('Contemplation: ', '').slice(0, 12).trim() + '...'
          : item.title.slice(0, 12).trim() + '...'
      }));
  }, [filteredNotes]);

  // Calculate Average elemental quantities
  const averages = useMemo(() => {
    const dataCount = growthData.length;
    if (!dataCount) {
      return { Spiritus: 0, Ignis: 0, Aqua: 0, Aer: 0, Materia: 0, count: 0 };
    }
    const sums = growthData.reduce((acc, curr) => {
      acc.Spiritus += curr.Spiritus;
      acc.Ignis += curr.Ignis;
      acc.Aqua += curr.Aqua;
      acc.Aer += curr.Aer;
      acc.Materia += curr.Materia;
      return acc;
    }, { Spiritus: 0, Ignis: 0, Aqua: 0, Aer: 0, Materia: 0 });

    return {
      Spiritus: sums.Spiritus / dataCount,
      Ignis: sums.Ignis / dataCount,
      Aqua: sums.Aqua / dataCount,
      Aer: sums.Aer / dataCount,
      Materia: sums.Materia / dataCount,
      count: dataCount
    };
  }, [growthData]);

  // Format averages for radar chart
  const lastFive = useMemo(() => growthData.slice(-5), [growthData]);

  const radarData = useMemo(() => {
    const categories = ['Spiritus', 'Ignis', 'Aqua', 'Aer', 'Materia'];
    
    return categories.map(cat => {
      const entry: any = { 
        subject: cat, 
        average: parseFloat((averages[cat as keyof typeof averages] || 0).toFixed(1)), 
        fullMark: 10 
      };
      
      lastFive.forEach((note, idx) => {
        entry[`trend${idx}`] = note[cat as keyof typeof note] || 0;
      });
      
      return entry;
    });
  }, [averages, lastFive]);

  // Generate esoteric alignment guidance
  const alchemicalAdvice = useMemo(() => {
    if (notes.length === 0) {
      return {
        title: "Portal Open but Silent",
        body: "Inscribe your first Oracle contemplations or journal reflections onto the Grimoire to map your divine flow lines."
      };
    }
    if (growthData.length === 0) {
      return {
        title: "Silence in Preferred Stream",
        body: "No inscriptions discovered for the selected Tradition. Toggle your tradition filter above to review alternative cosmic paths."
      };
    }

    const elementsList = [
      { key: 'Spiritus', val: averages.Spiritus, desc: 'spiritual quintessence / divine light', advice: 'foster your earthly grounding with solid, structured Materia reflections' },
      { key: 'Ignis', val: averages.Ignis, desc: 'active combustion, willpower and drive', advice: 'cool the blazing inner crucible with intuitive Aqua journaling to prevent mental burnout' },
      { key: 'Aqua', val: averages.Aqua, desc: 'mercurial flow, intuition and depth', advice: 'stabilize your emotional waves with disciplined Aer intellectual analysis' },
      { key: 'Aer', val: averages.Aer, desc: 'philosophical intellect and concepts', advice: 'embody your philosophical ideas into physical Materia forms or direct daily actions' },
      { key: 'Materia', val: averages.Materia, desc: 'physical grounding, salt and body', advice: 'elevate your earthly anchor toward higher Spiritus sparks of celestial transcendence' },
    ];

    // sort to find highest and lowest
    elementsList.sort((a, b) => b.val - a.val);
    const highest = elementsList[0];
    const lowest = elementsList[elementsList.length - 1];

    return {
      title: `Core Aura: ${highest.key} Ascendant`,
      body: `Your current spiritual resonance is heavily centered on ${highest.key} (${highest.val.toFixed(1)}/10), representing a pinnacle of ${highest.desc}. Conversely, your lowest energetic signature is ${lowest.key} (${lowest.val.toFixed(1)}/10). To achieve supreme alchemical balance, the Oracle instructs you to ${highest.advice}.`
    };
  }, [notes, growthData, averages]);

  // Favorite school
  const favoriteSchool = useMemo(() => {
    if (!notes.length) return "None";
    const freq: Record<string, number> = {};
    notes.forEach(n => {
      freq[n.school] = (freq[n.school] || 0) + 1;
    });
    let best = "None";
    let max = 0;
    Object.entries(freq).forEach(([sch, count]) => {
      if (count > max) {
        max = count;
        best = sch;
      }
    });
    return `${best} (${max} entries)`;
  }, [notes]);

  const toggleElementVisibility = (element: string) => {
    setVisibleElements(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const elementThemeStyles: Record<string, { stroke: string; glow: string; text: string; bg: string; border: string; desc: string; symbol: string }> = {
    Spiritus: { stroke: '#fbbf24', glow: 'rgba(251,191,36,0.3)', text: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/20', desc: 'Quintessence & Soul', symbol: '🜵' },
    Ignis: { stroke: '#f97316', glow: 'rgba(249,115,22,0.3)', text: 'text-orange-500', bg: 'bg-orange-500/5', border: 'border-orange-500/20', desc: 'Willpower & Flame', symbol: '🜂' },
    Aqua: { stroke: '#2dd4bf', glow: 'rgba(45,212,191,0.3)', text: 'text-teal-400', bg: 'bg-teal-500/5', border: 'border-teal-500/20', desc: 'Intuition & Mercury', symbol: '🜄' },
    Aer: { stroke: '#38bdf8', glow: 'rgba(56,189,248,0.3)', text: 'text-sky-400', bg: 'bg-sky-500/5', border: 'border-sky-500/20', desc: 'Intellect & Breath', symbol: '🜁' },
    Materia: { stroke: '#10b981', glow: 'rgba(16,185,129,0.3)', text: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/15', desc: 'Grounding & Salt', symbol: '🜄' },
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-black/20 border border-white/5 rounded-2xl min-h-[300px]">
        <Activity className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
        <h4 className="font-serif text-lg text-amber-200">The Growth Lines are Dormant</h4>
        <p className="text-slate-400 font-sans text-xs max-w-sm mt-1 leading-relaxed">
          The spiritual diagnostic grids are active but require data. Save a query reflection from the Oracle or add a custom journaling inscription above to begin charting your element balance.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-200">
      
      {/* Quick Overview Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#0e0e10]/80 border border-white/5 p-4 rounded-xl flex items-center gap-3 shadow-inner">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Inscriptions</p>
            <p className="text-xl font-bold font-serif text-amber-100">{notes.length}</p>
          </div>
        </div>

        <div className="bg-[#0e0e10]/80 border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Dominant Stream</p>
            <p className="text-sm font-bold font-serif text-slate-200 truncate max-w-[170px]" title={favoriteSchool}>{favoriteSchool}</p>
          </div>
        </div>

        <div className="bg-[#0e0e10]/80 border border-white/5 p-4 rounded-xl flex items-center gap-3 sm:col-span-2 lg:col-span-2">
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 animate-pulse shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Current High Balance</p>
            <p className="text-xs font-serif text-amber-300 font-semibold truncate leading-tight mt-0.5">
              {alchemicalAdvice.title}
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Span: Chronological Path Area/Line Chart */}
        <div className="bg-[#0e0e10]/80 border border-white/5 p-5 rounded-2xl lg:col-span-8 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <h4 className={`text-base font-serif ${dTheme.textPrimary} flex items-center gap-2`}>
                <Milestone className={`w-4 h-4 ${dTheme.id === 'deep-void' ? 'text-violet-400' : dTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> Spiritual Path Alignment
              </h4>
              <p className="text-[10px] text-slate-400 font-serif leading-relaxed">
                Chronological energetic tracking based on consecutive journal entries
              </p>
            </div>

            {/* Selection filters */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono">Tradition:</span>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="bg-black/60 border border-white/10 hover:border-amber-500/35 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none cursor-pointer font-serif"
              >
                {traditionsList.map(sch => (
                  <option key={sch} value={sch} className="bg-[#141416] text-white">
                    {sch === 'All' ? 'All Traditions' : sch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visibility Checkboxes */}
          <div className="flex flex-wrap items-center gap-2 py-1.5 bg-black/20 px-3 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono mr-1">Toggles:</span>
            {Object.keys(visibleElements).map(el => (
              <button
                key={el}
                onClick={() => toggleElementVisibility(el)}
                className={`flex items-center gap-1.5 px-2 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all ${
                  visibleElements[el] 
                    ? `${elementThemeStyles[el].bg} ${elementThemeStyles[el].text} border-${el === 'Spiritus' ? 'amber-500/40' : el === 'Ignis' ? 'orange-500/40' : el === 'Aqua' ? 'teal-500/40' : el === 'Aer' ? 'sky-500/40' : 'emerald-500/40'} font-bold`
                    : 'bg-transparent text-slate-500 border-white/5 hover:border-slate-700 hover:text-slate-400'
                }`}
              >
                <span className="text-xs">{elementThemeStyles[el].symbol}</span>
                <span>{el}</span>
              </button>
            ))}
          </div>

          {/* Core Line Chart */}
          <div className="w-full h-[320px] flex items-center justify-center">
            {growthData.length === 0 ? (
              <p className="text-xs text-slate-500 font-serif italic py-12">No chronologies exist for this custom stream query.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={growthData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
                  <XAxis 
                    dataKey="indexLabel" 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tick={{ fill: '#64748b', fontSize: 9 }}
                    axisLine={false}
                    tickCount={6}
                  />
                  <RechartsTooltip content={<ChartTooltipActive />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} 
                  />
                  
                  {Object.keys(visibleElements).map(el => visibleElements[el] && (
                    <Line
                      key={el}
                      type="monotone"
                      dataKey={el}
                      name={el}
                      stroke={elementThemeStyles[el].stroke}
                      strokeWidth={2.5}
                      dot={{ r: 3.5, strokeWidth: 1, stroke: '#0e0e10', fill: elementThemeStyles[el].stroke }}
                      activeDot={{ r: 6.5, stroke: '#ffffff', strokeWidth: 1.5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Span: Overall average Radar Balance Chart */}
        <div className="bg-[#0e0e10]/80 border border-white/5 p-5 rounded-2xl lg:col-span-4 flex flex-col justify-between shadow-xl">
          <div className="pb-3 border-b border-white/5 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-center sm:text-left">
              <h4 className={`text-base font-serif ${dTheme.textPrimary} flex items-center justify-center sm:justify-start gap-2`}>
                <CircleDot className={`w-4 h-4 ${dTheme.id === 'deep-void' ? 'text-violet-400' : dTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> Elements Synthesis
              </h4>
              <p className="text-[10px] text-slate-400 font-serif leading-relaxed mt-0.5">
                Comprehensive pentagonal alignment based on all logs
              </p>
            </div>
            
            <button
              onClick={() => setShowTrend(!showTrend)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-mono transition-all ${
                showTrend 
                  ? `${dTheme.id === 'deep-void' ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : dTheme.id === 'ethereal-silver' ? 'bg-slate-500/20 border-slate-500/50 text-slate-200' : 'bg-amber-500/20 border-amber-500/50 text-amber-300'} font-bold`
                  : 'bg-black/40 border-white/10 text-slate-500 hover:text-slate-300'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Trend</span>
            </button>
          </div>

          <div className="w-full h-[220px] flex items-center justify-center overflow-hidden my-4">
            {growthData.length === 0 ? (
              <p className="text-xs text-slate-500 font-serif italic">Need entries in selected stream.</p>
            ) : (
              <RadarChart width={250} height={210} cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke={dTheme.id === 'deep-void' ? 'rgba(192, 132, 252, 0.12)' : dTheme.id === 'ethereal-silver' ? 'rgba(203, 213, 225, 0.12)' : 'rgba(212, 175, 55, 0.12)'} strokeWidth={1} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 10]} 
                  tick={{ fill: '#475569', fontSize: 7 }}
                  axisLine={false}
                />
                
                {/* Trend Analysis Radars */}
                {showTrend && lastFive.length > 0 && lastFive.map((note, idx) => {
                  const trendColors = ['#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9', '#ffffff'];
                  // Use more thematic colors if available
                  const thematicColors = dTheme.id === 'deep-void' 
                    ? ['#4c1d95', '#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd']
                    : dTheme.id === 'ethereal-silver'
                    ? ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1']
                    : ['#78350f', '#b45309', '#d97706', '#f59e0b', '#fbbf24'];

                  return (
                    <Radar
                      key={`trend-${note.id}`}
                      name={`Consultation #${growthData.length - lastFive.length + idx + 1}`}
                      dataKey={`trend${idx}`}
                      stroke={thematicColors[idx] || trendColors[idx]}
                      fill={thematicColors[idx] || trendColors[idx]}
                      fillOpacity={0.05}
                      strokeWidth={1}
                      strokeDasharray="4 4"
                      className="radar-trend-pulse"
                      style={{ 
                        animationDelay: `${idx * 0.5}s`,
                        color: thematicColors[idx] || trendColors[idx] 
                      }}
                    />
                  );
                })}

                <Radar
                   name="Average Aether"
                   dataKey="average"
                   stroke={dTheme.radarColor || '#D4AF37'}
                   strokeWidth={2.5}
                   fill={dTheme.radarColor || '#D4AF37'}
                   fillOpacity={dTheme.radarFillOpacity || 0.25}
                />
                {showTrend && <Legend wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', marginTop: '10px' }} />}
                <RechartsTooltip content={<RadarTooltip />} />
              </RadarChart>
            )}
          </div>

          {/* Advice block */}
          <div className={`${dTheme.id === 'deep-void' ? 'bg-violet-950/20 border border-violet-500/15' : dTheme.id === 'ethereal-silver' ? 'bg-slate-900/25 border border-slate-400/15' : 'bg-amber-950/20 border border-[#D4AF37]/15'} rounded-xl p-3 text-left`}>
            <p className={`text-[10px] uppercase font-mono tracking-widest ${dTheme.textPrimary} mb-1 font-bold`}>Oracle Synthesis Guidance</p>
            <p className="text-[11px] text-slate-300 font-serif leading-relaxed italic">
              {alchemicalAdvice.body}
            </p>
          </div>
        </div>

      </div>

      {/* Grid of the 5 detailed Element state boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(elementThemeStyles).map(([el, style]) => {
          const val = averages[el as keyof typeof averages] || 0;
          return (
            <div 
              key={el} 
              className={`p-4 border rounded-xl flex flex-col justify-between shadow-md transition-all duration-300 hover:scale-[1.02] ${style.bg} ${style.border}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-2xl ${style.text}`}>{style.symbol}</span>
                <span className="text-2xl font-mono font-bold text-white tracking-tighter">
                  {typeof val === 'number' ? val.toFixed(1) : '0.0'}
                </span>
              </div>
              <div className="mt-4">
                <h5 className="font-serif text-sm font-bold text-amber-200">{el}</h5>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">{style.desc}</p>
                <div className="w-full bg-black/35 h-1.5 rounded-full mt-2.5 overflow-hidden border border-white/5">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(100, Math.max(0, val * 10))}%`,
                      backgroundColor: style.stroke,
                      boxShadow: `0 0 10px ${style.stroke}`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// Custom tooltip renderer for Spiritual Chart
const ChartTooltipActive = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#111113]/98 border border-amber-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-xs text-xs font-mono text-left">
        <p className="text-amber-300 font-serif font-bold text-sm mb-1">{data.title}</p>
        <p className="text-slate-400 text-[10px] mb-2">{data.fullCreatedAt} | {data.school}</p>
        <div className="space-y-1 border-t border-white/5 pt-2">
          {payload.map((entry: any, idx: number) => {
            const colors: Record<string, string> = {
              Spiritus: 'text-amber-400',
              Ignis: 'text-orange-500',
              Aqua: 'text-teal-400',
              Aer: 'text-sky-400',
              Materia: 'text-emerald-500'
            };
            return (
              <div key={`entry-${entry.name || idx}-${idx}`} className="flex justify-between items-center gap-6">
                <span className={`font-semibold ${colors[entry.name] || 'text-slate-300'}`}>{entry.name}</span>
                <span className="font-bold text-white">{entry.value} / 10</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const RadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111113]/98 border border-amber-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-md text-[10px] font-mono text-left">
        <p className="text-amber-300 font-serif font-bold text-xs mb-2 border-b border-white/10 pb-1">
          {payload[0].payload.subject} Metrics
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, idx: number) => (
            <div key={`radar-entry-${entry.name || idx}-${idx}`} className="flex justify-between items-center gap-4">
              <span className="text-slate-400">{entry.name}</span>
              <span className="text-white font-bold">{entry.value.toFixed(1)}</span>
            </div>
          )).reverse()}
        </div>
      </div>
    );
  }
  return null;
};
