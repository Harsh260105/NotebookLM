// Legacy AI service - now using GeminiService
// This file is kept for backward compatibility

import { ChatMessage, Citation } from '../types';
import { GeminiService } from './geminiService';

export class AIService {
  private static documentTexts: Map<string, string[]> = new Map();

  static setDocumentText(documentId: string, pages: string[]) {
    this.documentTexts.set(documentId, pages);
    GeminiService.setDocumentText(documentId, pages);
  }

  static async generateResponse(
    message: string, 
    documentId: string | null,
    conversationHistory: ChatMessage[]
  ): Promise<{ content: string; citations: Citation[] }> {
    return GeminiService.generateResponse(message, documentId, conversationHistory);
  }
}