export interface Document {
  id: string;
  name: string;
  file: File;
  uploadDate: Date;
  pageCount: number;
  size: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  pageNumber: number;
  text: string;
  confidence: number;
}

export interface SearchResult {
  page: number;
  text: string;
  relevance: number;
}