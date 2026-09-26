export interface GroundingSource {
  title: string;
  url: string;
}

export interface EngineLinks {
  google: string;
  bing: string;
  yahoo: string;
  duckduckgo: string;
  archive?: string;
}

export interface ArchiveSearchResult {
  id: string;
  archiveCollection: string;
  title: string;
  reference?: string;
  excerpt: string;
  relevanceScore?: number;
  tags?: string[];
  url?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  sources?: GroundingSource[];
  webSearchQueries?: string[];
  engineLinks?: EngineLinks;
  engineUsed?: string;
  modelUsed?: string;
  archiveSearchResults?: ArchiveSearchResult[];
  archivesSearched?: string[];
  archiveSearchSummary?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface GrimoireNote {
  id: string;
  title: string;
  content: string;
  school: string;
  color: string;
  pinned: boolean;
  userId: string;
  createdAt: string;
}

export interface Tradition {
  name: string;
  description: string;
  principles: string[];
  badge: {
    icon: string;
    primaryColor: string;
    secondaryColor: string;
    pattern: string;
  };
  createdAt: string;
  userId: string;
}
