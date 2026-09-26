import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Award, ExternalLink, ArrowRight, BookMarked,
  Sparkles, RefreshCw, AlertTriangle, Eye, Users, Layers, ShieldAlert, Check,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAccessToken, db, auth, googleSignIn } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import ZodiacCompatibility from './ZodiacCompatibility';

interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  alternateLink?: string;
}

interface ClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  alternateLink?: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  dueTime?: {
    hours: number;
    minutes: number;
  };
  maxPoints?: number;
}

interface ClassroomAnnouncement {
  id: string;
  courseId: string;
  text: string;
  alternateLink?: string;
  creationTime: string;
}

interface ClassroomSanctumProps {
  activeTheme?: {
    id: string;
    name: string;
    bgPage: string;
    bgCard: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    accentGradient: string;
    borderAccent: string;
    borderAccentSemi: string;
    accentGlow: string;
  };
}

export default function ClassroomSanctum({ activeTheme }: ClassroomSanctumProps) {
  const defaultTheme = {
    id: "ancient-gold",
    name: "Ancient Gold",
    bgPage: "bg-[#070708]",
    bgCard: "bg-[#141416]",
    textPrimary: "text-[#D4AF37]",
    textAccent: "text-amber-500",
    textAccentHex: "#D4AF37",
    accentGradient: "from-[#D4AF37] to-[#AA6C39]",
    borderAccent: "border-[#D4AF37]/20",
    borderAccentSemi: "border-[#D4AF37]/45",
    accentGlow: "rgba(212, 175, 55, 0.15)"
  };

  const themeToUse = activeTheme || defaultTheme;

  const [sanctumTab, setSanctumTab] = useState<'classroom' | 'zodiac'>('classroom');
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'announcements'>('work');
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [inscribedIds, setInscribedIds] = useState<Set<string>>(new Set());

  // Check auth state
  useEffect(() => {
    const checkUser = auth.onAuthStateChanged(async (user) => {
      setIsSignedIn(!!user);
      if (user) {
        const token = await getAccessToken();
        if (token) {
          setHasToken(true);
          fetchCourses(token);
        } else {
          setHasToken(false);
          setCourses([]);
          setSelectedCourse(null);
        }
      } else {
        setHasToken(false);
        setCourses([]);
        setSelectedCourse(null);
      }
    });
    return () => checkUser();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setIsSignedIn(true);
        setHasToken(true);
        fetchCourses(result.accessToken);
      }
    } catch (err: any) {
      console.warn('Google Classroom authorization failed:', err);
      setError(err.message || 'Authorization failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchCourses = async (directToken?: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = directToken || await getAccessToken();
      if (!token) {
        throw new Error("No Google access token found. Please ensure you are logged in and have approved permissions.");
      }

      const response = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Google API returned status ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.courses || []);
      setHasToken(true);
    } catch (err: any) {
      console.warn('Error fetching courses:', err);
      setError(err.message || 'Failed to communicate with Google Classroom API.');
    } finally {
      setLoading(false);
    }
  };

  const selectCourse = async (course: ClassroomCourse) => {
    setSelectedCourse(course);
    setDetailLoading(true);
    setCourseWork([]);
    setAnnouncements([]);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token found.");

      // Fetch Course Work
      const workResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (workResponse.ok) {
        const workData = await workResponse.json();
        setCourseWork(workData.courseWork || []);
      }

      // Fetch Announcements
      const announcementResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/announcements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (announcementResponse.ok) {
        const announcementData = await announcementResponse.json();
        setAnnouncements(announcementData.announcements || []);
      }

    } catch (err) {
      console.warn('Error loading course details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleInscribeCourseWork = async (item: ClassroomCourseWork) => {
    const formattedDueDate = item.dueDate
      ? `${item.dueDate.year}-${String(item.dueDate.month).padStart(2, '0')}-${String(item.dueDate.day).padStart(2, '0')}`
      : 'No due date';

    const title = `Classroom: ${item.title}`;
    const content = `## Google Classroom Assignment\n\n` +
      `**Course:** ${selectedCourse?.name || 'Academic Class'}\n` +
      `**Due Date:** ${formattedDueDate}\n` +
      `**Max Points:** ${item.maxPoints ?? 'N/A'}\n\n` +
      `### Assignment Description\n\n` +
      `${item.description || '*No description provided by the instructor.*'}\n\n` +
      `---\n` +
      `*Inscribed from Google Classroom. View original assignment [here](${item.alternateLink || '#'})*`;

    await inscribeNote(title, content, item.id);
  };

  const handleInscribeAnnouncement = async (item: ClassroomAnnouncement) => {
    const formattedDate = new Date(item.creationTime).toLocaleString();

    const title = `Classroom Announcement: ${selectedCourse?.name || 'Class'}`;
    const content = `## Course Announcement\n\n` +
      `**Posted on:** ${formattedDate}\n\n` +
      `### Announcement Content\n\n` +
      `${item.text || '*Empty announcement text.*'}\n\n` +
      `---\n` +
      `*Inscribed from Google Classroom. View post [here](${item.alternateLink || '#'})*`;

    await inscribeNote(title, content, item.id);
  };

  const inscribeNote = async (title: string, content: string, itemId: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      title,
      content,
      school: 'Salazar Academic',
      color: 'bg-[#1b2a24]/95 border-emerald-900/45', // Mystical Scholar Emerald Theme
      pinned: false,
      createdAt: new Date().toLocaleString(),
    };

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'notes', newNote.id), {
          ...newNote,
          userId: user.uid
        });
        setInscribedIds(prev => {
          const updated = new Set(prev);
          updated.add(itemId);
          return updated;
        });
      } catch (err) {
        console.warn('Failed to save inscribed note to Firestore:', err);
      }
    } else {
      // LocalStorage fallback
      const saved = localStorage.getItem('mystical_grimoire_notes');
      let notes = [];
      if (saved) {
        try { notes = JSON.parse(saved); } catch (e) {}
      }
      notes.unshift(newNote);
      localStorage.setItem('mystical_grimoire_notes', JSON.stringify(notes));
      setInscribedIds(prev => {
        const updated = new Set(prev);
        updated.add(itemId);
        return updated;
      });
    }

    // Trigger update notification across the app
    window.dispatchEvent(new Event('mystical_notes_updated'));
  };

  return (
    <div id="classroom-sanctum-root" className="space-y-6 max-w-6xl mx-auto p-2">
      {/* Sanctum Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/40 pb-4">
        <div>
          <h2 className="text-2xl font-serif text-emerald-100/90 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            The Classroom Sanctum
          </h2>
          <p className="text-xs text-emerald-400/70 font-sans mt-1">
            Access your active courses, assignments, and announcements, compiling academic learnings directly into your Grimoire.
          </p>
        </div>
        {isSignedIn && (
          <button
            onClick={() => fetchCourses()}
            disabled={loading}
            className="px-3 py-1.5 rounded-md border border-emerald-900/45 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 hover:text-emerald-100 font-serif text-xs transition duration-200 flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Attune Sync
          </button>
        )}
      </div>

      {/* Sanctum Main Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[#14161b]/80 p-1 border border-white/5 rounded-xl self-start max-w-md">
        <button
          onClick={() => setSanctumTab('classroom')}
          className={`flex-1 min-w-[140px] py-2 px-4 rounded-lg text-xs font-serif transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            sanctumTab === 'classroom'
              ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400 font-semibold border'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Google Classroom Archives
        </button>
        <button
          onClick={() => setSanctumTab('zodiac')}
          className={`flex-1 min-w-[140px] py-2 px-4 rounded-lg text-xs font-serif transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            sanctumTab === 'zodiac'
              ? 'bg-[#D4AF37]/15 border-[#D4AF37]/20 text-[#D4AF37] font-semibold border'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Zodiac Compatibility Charts
        </button>
      </div>

      {sanctumTab === 'zodiac' ? (
        <ZodiacCompatibility activeTheme={themeToUse} />
      ) : !isSignedIn ? (
        <div className="p-8 text-center rounded-lg border border-amber-900/25 bg-amber-950/5 flex flex-col items-center max-w-lg mx-auto">
          <ShieldAlert className="w-12 h-12 text-amber-500/80 mb-3" />
          <h3 className="font-serif text-amber-200/90 text-lg mb-1">Mystical Lock Engaged</h3>
          <p className="text-xs text-amber-300/60 leading-relaxed mb-6">
            To view Google Classroom data, please attune yourself with Google. Use the authorization portal below to unlock the Classroom Sanctum.
          </p>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="group relative flex items-center gap-3 bg-[#0a0a0c] hover:bg-black border border-white/10 hover:border-emerald-500/40 rounded-xl px-5 py-2.5 text-sm text-slate-300 font-medium transition-all duration-300 cursor-pointer"
          >
            {isLoggingIn ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 24 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span className="font-serif text-emerald-300">Workspace Link</span>
              </>
            )}
          </button>
        </div>
      ) : !hasToken ? (
        <div className="p-8 text-center rounded-lg border border-emerald-900/25 bg-emerald-950/5 flex flex-col items-center max-w-lg mx-auto">
          <BookMarked className="w-12 h-12 text-emerald-500/80 mb-3 animate-pulse" />
          <h3 className="font-serif text-emerald-200/90 text-lg mb-1">Sanctum Awaiting Attunement</h3>
          <p className="text-xs text-emerald-300/60 leading-relaxed mb-6">
            Your session is authenticated, but the academic gateway key is missing. Re-authorize to unlock synchronous learning channels from Google Classroom.
          </p>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="group relative flex items-center gap-3 bg-[#0a0a0c] hover:bg-black border border-white/10 hover:border-emerald-500/40 rounded-xl px-5 py-2.5 text-sm text-slate-300 font-medium transition-all duration-300 cursor-pointer"
          >
            {isLoggingIn ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 24 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span className="font-serif text-emerald-300">Attune Classroom Gateway</span>
              </>
            )}
          </button>
        </div>
      ) : error ? (
        <div className="p-5 rounded-lg border border-red-950/50 bg-red-950/10 text-red-200/90 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-medium text-sm">Sanctum Connection Interrupted</h4>
              <p className="text-xs text-red-300/70 mt-1">{error}</p>
            </div>
          </div>
          <p className="text-[11px] text-red-400/50 italic leading-snug">
            Check if your Google Account contains active Google Classroom courses, or make sure the Classroom scope permissions were successfully approved during login.
          </p>
          <div className="pt-2">
            <button
              onClick={handleGoogleLogin}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 hover:bg-red-950/60 font-serif transition-all"
            >
              Re-authorize Connection
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Courses List - Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-serif text-emerald-400/80 uppercase tracking-widest pl-1">
              Attuned Courses ({courses.length})
            </h3>

            {loading ? (
              <div className="p-12 text-center text-emerald-400/50 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-500/80" />
                <span className="text-xs font-sans">Reading classroom archives...</span>
              </div>
            ) : courses.length === 0 ? (
              <div className="p-8 text-center rounded-lg border border-emerald-950/30 bg-emerald-950/5">
                <Users className="w-10 h-10 text-emerald-600/40 mx-auto mb-3" />
                <h4 className="font-serif text-emerald-300/80 text-sm mb-1">No Academic Courses Found</h4>
                <p className="text-xs text-emerald-400/50 leading-relaxed">
                  We couldn't detect active Google Classroom enrollments or teaching rosters. Ensure you have active classes at <a href="https://classroom.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline">classroom.google.com</a>.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {courses.map((course, cIdx) => {
                  const isSelected = selectedCourse?.id === course.id;
                  return (
                    <button
                      key={`${course.id}-${cIdx}`}
                      onClick={() => selectCourse(course)}
                      className={`w-full text-left p-3.5 rounded-lg border transition duration-200 flex items-start gap-3 relative overflow-hidden ${
                        isSelected 
                          ? 'bg-emerald-950/20 border-emerald-700/60 shadow-lg shadow-emerald-950/30' 
                          : 'bg-[#121415]/90 border-emerald-950/30 hover:border-emerald-900/50 hover:bg-emerald-950/5'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500" />
                      )}
                      <div className="p-1.5 rounded bg-emerald-950/30 text-emerald-500 mt-0.5 shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="font-serif text-sm text-emerald-100 font-medium truncate">
                          {course.name}
                        </div>
                        {course.section && (
                          <div className="text-[11px] text-emerald-400/60">
                            Section: {course.section}
                          </div>
                        )}
                        {course.room && (
                          <div className="text-[10px] text-emerald-400/40 font-mono">
                            Room: {course.room}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Course Details - Right Column */}
          <div className="lg:col-span-7">
            {selectedCourse ? (
              <div className="rounded-lg border border-emerald-950/40 bg-[#121415]/95 overflow-hidden">
                {/* Course Details Banner */}
                <div className="p-5 border-b border-emerald-950/40 bg-emerald-950/10">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded">
                        Active Academy Unit
                      </span>
                      <h3 className="font-serif text-lg text-emerald-100 mt-1">{selectedCourse.name}</h3>
                      {selectedCourse.descriptionHeading && (
                        <p className="text-xs text-emerald-300/70 mt-1 leading-snug">{selectedCourse.descriptionHeading}</p>
                      )}
                    </div>
                    {selectedCourse.alternateLink && (
                      <a
                        href={selectedCourse.alternateLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded border border-emerald-900/30 bg-emerald-950/20 text-emerald-400 hover:text-emerald-200 transition"
                        title="View Course in Google Classroom"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-emerald-950/40 bg-[#0d0f10]">
                  <button
                    onClick={() => setActiveTab('work')}
                    className={`flex-1 py-3 text-center font-serif text-xs transition duration-200 flex items-center justify-center gap-1.5 border-b-2 ${
                      activeTab === 'work'
                        ? 'border-emerald-500 text-emerald-200 bg-emerald-950/5'
                        : 'border-transparent text-emerald-500 hover:text-emerald-300'
                    }`}
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    Course Work ({courseWork.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`flex-1 py-3 text-center font-serif text-xs transition duration-200 flex items-center justify-center gap-1.5 border-b-2 ${
                      activeTab === 'announcements'
                        ? 'border-emerald-500 text-emerald-200 bg-emerald-950/5'
                        : 'border-transparent text-emerald-500 hover:text-emerald-300'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Announcements ({announcements.length})
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="p-5 max-h-[420px] overflow-y-auto space-y-4">
                  {detailLoading ? (
                    <div className="p-12 text-center text-emerald-400/50 flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-emerald-500/80" />
                      <span className="text-xs">Chanting retrieval formulas...</span>
                    </div>
                  ) : activeTab === 'work' ? (
                    courseWork.length === 0 ? (
                      <div className="p-8 text-center text-emerald-400/40 text-xs font-sans">
                        No active course work found for this class.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {courseWork.map((item, cwIdx) => {
                          const isInscribed = inscribedIds.has(item.id);
                          return (
                            <div key={`${item.id}-${cwIdx}`} className="p-4 rounded-lg border border-emerald-950/40 bg-emerald-950/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1 min-w-0 flex-1">
                                <h4 className="font-serif text-sm text-emerald-100 font-medium leading-snug">{item.title}</h4>
                                {item.description && (
                                  <p className="text-xs text-emerald-400/60 line-clamp-2 leading-relaxed">{item.description}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-emerald-400/50">
                                  {item.dueDate && (
                                    <span className="flex items-center gap-1 text-amber-500/80">
                                      <Calendar className="w-3 h-3" />
                                      Due: {item.dueDate.year}-{item.dueDate.month}-{item.dueDate.day}
                                    </span>
                                  )}
                                  {item.maxPoints && (
                                    <span className="flex items-center gap-1 text-emerald-400/60">
                                      <Award className="w-3 h-3" />
                                      {item.maxPoints} pts
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 self-end sm:self-center">
                                <button
                                  onClick={() => handleInscribeCourseWork(item)}
                                  disabled={isInscribed}
                                  className={`px-3 py-1.5 rounded-md border text-xs font-serif transition duration-200 flex items-center gap-1 ${
                                    isInscribed
                                      ? 'bg-emerald-900/10 border-emerald-900/20 text-emerald-500/60'
                                      : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300 hover:bg-emerald-900/30'
                                  }`}
                                >
                                  {isInscribed ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      Inscribed
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      Inscribe
                                    </>
                                  )}
                                </button>
                                {item.alternateLink && (
                                  <a
                                    href={item.alternateLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded border border-emerald-950 bg-emerald-950/35 text-emerald-400 hover:text-emerald-200 transition"
                                    title="Open Assignment"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    announcements.length === 0 ? (
                      <div className="p-8 text-center text-emerald-400/40 text-xs font-sans">
                        No announcements posted in this classroom.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {announcements.map((item, aIdx) => {
                          const isInscribed = inscribedIds.has(item.id);
                          return (
                            <div key={`${item.id}-${aIdx}`} className="p-4 rounded-lg border border-emerald-950/40 bg-emerald-950/5 flex flex-col gap-3">
                              <div className="space-y-1">
                                <span className="text-[10px] text-emerald-500 font-mono">
                                  {new Date(item.creationTime).toLocaleString()}
                                </span>
                                <p className="text-xs text-emerald-100 whitespace-pre-line leading-relaxed">
                                  {item.text}
                                </p>
                              </div>
                              <div className="flex justify-end items-center gap-2 pt-1">
                                <button
                                  onClick={() => handleInscribeAnnouncement(item)}
                                  disabled={isInscribed}
                                  className={`px-3 py-1.5 rounded-md border text-xs font-serif transition duration-200 flex items-center gap-1 ${
                                    isInscribed
                                      ? 'bg-emerald-900/10 border-emerald-900/20 text-emerald-500/60'
                                      : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300 hover:bg-emerald-900/30'
                                  }`}
                                >
                                  {isInscribed ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      Inscribed
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      Inscribe
                                    </>
                                  )}
                                </button>
                                {item.alternateLink && (
                                  <a
                                    href={item.alternateLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded border border-emerald-950 bg-emerald-950/35 text-emerald-400 hover:text-emerald-200 transition"
                                    title="Open announcement"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 rounded-lg border border-dashed border-emerald-900/30 bg-[#121415]/40 text-emerald-400/40">
                <BookMarked className="w-12 h-12 mb-3 text-emerald-600/30" />
                <h4 className="font-serif text-sm text-emerald-300/70 mb-1">Select an Academic Course</h4>
                <p className="text-xs max-w-sm leading-relaxed">
                  Attune yourself with an active academic unit in the left roster to view the coursework assignments, study resources, and announcement logs.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
