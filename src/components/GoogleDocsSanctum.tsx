import React, { useState, useEffect } from 'react';
import { 
  FileText, ExternalLink, Copy, Check, Download, Upload, 
  Sparkles, RefreshCw, FolderSearch, Eye, LogIn, Plus, BookOpen, Scroll, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { googleSignIn, getAccessToken } from '../firebase';
import { User } from 'firebase/auth';

interface GoogleDocsSanctumProps {
  currentUser?: User | null;
  needsAuth?: boolean;
  onAuthSuccess?: () => void;
  activeTheme?: {
    id: string;
    textPrimary: string;
    textAccentHex: string;
  };
}

interface GoogleDocItem {
  id: string;
  name: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export const GoogleDocsSanctum: React.FC<GoogleDocsSanctumProps> = ({
  currentUser,
  needsAuth = false,
  onAuthSuccess,
  activeTheme,
}) => {
  const [docsList, setDocsList] = useState<GoogleDocItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // New Document creation state
  const [docTitle, setDocTitle] = useState('Great Wheel Esoteric Chronicle');
  const [docContent, setDocContent] = useState('Inscribed in the sacred registry of the Great Wheel of Mysteries.\n\nKey Concepts:\n- Hermetic Alchemy & Transmutation\n- Kabbalistic Tree of Life\n- Gnostic Archons & Pleroma');
  const [isCreating, setIsCreating] = useState(false);
  const [createdDocLink, setCreatedDocLink] = useState<string | null>(null);
  
  // Selected Doc Content state
  const [selectedDocContent, setSelectedDocContent] = useState<string | null>(null);
  const [isFetchingContent, setIsFetchingContent] = useState<string | null>(null);

  useEffect(() => {
    if (statusMessage) {
      const t = setTimeout(() => setStatusMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [statusMessage]);

  const fetchGoogleDocs = async () => {
    setIsLoading(true);
    setStatusMessage({ text: 'Authenticating & fetching Google Docs...', type: 'info' });

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
        // Try direct Google sign in prompt
        const signResult = await googleSignIn();
        if (signResult) {
          token = signResult.accessToken;
          if (onAuthSuccess) onAuthSuccess();
        }
      }

      if (!token) {
        throw new Error('Google authentication required to access Google Docs.');
      }

      // Query Google Drive API for Google Docs mimeType
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'&pageSize=20&orderBy=modifiedTime%20desc",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }

      const data = await response.json();
      setDocsList(data.files || []);
      setStatusMessage({ text: `Successfully loaded ${data.files?.length || 0} Google Docs.`, type: 'success' });
    } catch (err: any) {
      console.error('Google Docs fetch error:', err);
      setStatusMessage({ text: err.message || 'Error fetching Google Docs.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoogleDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) {
      setStatusMessage({ text: 'Please provide both title and content for the new Google Doc.', type: 'error' });
      return;
    }

    setIsCreating(true);
    setStatusMessage({ text: 'Creating new Google Doc via Google Docs API...', type: 'info' });

    try {
      let token = await getAccessToken();
      if (!token) {
        const signResult = await googleSignIn();
        if (signResult) {
          token = signResult.accessToken;
          if (onAuthSuccess) onAuthSuccess();
        }
      }

      if (!token) {
        throw new Error('Google authentication required to create Google Docs.');
      }

      // Step 1: Create empty document using Google Docs API
      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: docTitle
        })
      });

      if (!createRes.ok) {
        throw new Error(`Failed to create document: ${createRes.statusText}`);
      }

      const docData = await createRes.json();
      const documentId = docData.documentId;

      // Step 2: Insert text content using batchUpdate
      const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                text: docContent,
                endOfSegmentLocation: {}
              }
            }
          ]
        })
      });

      if (!updateRes.ok) {
        throw new Error(`Failed to write content into document: ${updateRes.statusText}`);
      }

      const docLink = `https://docs.google.com/document/d/${documentId}/edit`;
      setCreatedDocLink(docLink);
      setStatusMessage({ text: 'Google Doc created and inscribed successfully!', type: 'success' });
      fetchGoogleDocs();
    } catch (err: any) {
      console.error('Google Doc creation error:', err);
      setStatusMessage({ text: err.message || 'Error creating Google Doc.', type: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  const fetchDocContent = async (documentId: string) => {
    setIsFetchingContent(documentId);
    setStatusMessage({ text: 'Fetching document content...', type: 'info' });
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Authentication required.');

      // @ts-ignore
      await gapi.client.setToken({ access_token: token });

      // @ts-ignore
      const response = await gapi.client.docs.documents.get({ documentId });
      
      // Basic extraction of text from body content
      let text = '';
      if (response.result.body?.content) {
        response.result.body.content.forEach((item: any) => {
          if (item.paragraph?.elements) {
            item.paragraph.elements.forEach((el: any) => {
              if (el.textRun?.content) text += el.textRun.content;
            });
          }
        });
      }
      
      setSelectedDocContent(text || 'No text content found.');
      setStatusMessage({ text: 'Content retrieved successfully.', type: 'success' });
    } catch (err: any) {
      console.error('Fetch content error:', err);
      setStatusMessage({ text: 'Failed to fetch content.', type: 'error' });
    } finally {
      setIsFetchingContent(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-neutral-950 via-zinc-900 to-neutral-950 text-amber-100 rounded-2xl border border-amber-500/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Google Workspace Integration</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-200">
            Google Docs Esoteric Sanctum
          </h2>
          <p className="text-xs text-neutral-400 font-serif mt-0.5">
            Create, export, and browse your mystical chronicles directly within Google Docs.
          </p>
        </div>

        <button
          onClick={fetchGoogleDocs}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-serif font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synchronizing...' : 'Load My Google Docs'}</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className={`p-3 rounded-xl border text-xs font-serif flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' :
          statusMessage.type === 'error' ? 'bg-rose-950/40 border-rose-500/30 text-rose-200' :
          'bg-sky-950/40 border-sky-500/30 text-sky-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> :
           statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" /> :
           <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Google Doc Form */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-amber-500/25 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-serif font-bold text-amber-200 uppercase tracking-wider">
              Inscribe New Google Document
            </h3>
          </div>

          <form onSubmit={handleCreateGoogleDoc} className="space-y-3">
            <div>
              <label className="block text-[11px] font-serif text-neutral-400 mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Hermetic Prophecy & Star Alignments"
                className="w-full bg-black/50 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-100 font-serif focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-serif text-neutral-400 mb-1">Document Content & Transmission</label>
              <textarea
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                rows={6}
                placeholder="Write or paste your esoteric research, chat findings, or ritual notes here..."
                className="w-full bg-black/50 border border-amber-500/30 rounded-xl p-3 text-xs text-neutral-200 font-serif placeholder-neutral-600 focus:outline-none focus:border-amber-400 leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-neutral-950 font-serif font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Creating Document in Google Drive...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-neutral-950" />
                  <span>Create & Inscribe Google Doc</span>
                </>
              )}
            </button>
          </form>

          {createdDocLink && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="text-amber-200 font-serif">Document Created Successfully!</span>
              <a
                href={createdDocLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold underline"
              >
                <span>Open in Google Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Existing Google Docs Browser */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-amber-500/25 space-y-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderSearch className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-serif font-bold text-amber-200 uppercase tracking-wider">
                Your Google Docs ({docsList.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Google Drive Sync</span>
          </div>

          <div className="flex-1 min-h-[260px] max-h-[340px] overflow-y-auto space-y-2 pr-1">
            {docsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center text-neutral-500 font-serif text-xs">
                <FileText className="w-8 h-8 mb-2 opacity-30 text-amber-400" />
                <p>No Google Docs loaded yet.</p>
                <p className="text-[10px] text-neutral-600 mt-1">Click "Load My Google Docs" above to synchronize your Drive.</p>
              </div>
            ) : (
              docsList.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center flex-shrink-0 text-sky-400 font-bold text-xs">
                      Doc
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-serif font-bold text-amber-200 truncate">{doc.name}</h4>
                      <p className="text-[10px] font-mono text-neutral-400">
                        Modified: {doc.modifiedTime ? new Date(doc.modifiedTime).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://docs.google.com/document/d/${doc.id}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-serif transition-colors flex-shrink-0"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => fetchDocContent(doc.id)}
                    disabled={!!isFetchingContent}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[11px] font-serif transition-colors flex-shrink-0"
                  >
                    <span>{isFetchingContent === doc.id ? 'Loading...' : 'Read'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {selectedDocContent && (
        <div className="p-5 rounded-2xl bg-black/60 border border-neutral-700 mt-6 shadow-xl">
          <h3 className="text-sm font-serif font-bold text-amber-200 mb-3">Extracted Content</h3>
          <p className="text-xs font-serif text-neutral-300 leading-relaxed whitespace-pre-wrap">{selectedDocContent}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleDocsSanctum;
