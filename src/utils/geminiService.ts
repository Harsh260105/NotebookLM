import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage, Citation } from '../types';
import { PDFProcessor } from './pdfProcessor';

export class GeminiService {
  private static genAI: GoogleGenerativeAI | null = null;
  private static documentTexts: Map<string, string[]> = new Map();

  static initialize() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
      return false;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    return true;
  }

  static setDocumentText(documentId: string, pages: string[]) {
    this.documentTexts.set(documentId, pages);
  }

  static async generateResponse(
    message: string, 
    documentId: string | null,
    conversationHistory: ChatMessage[]
  ): Promise<{ content: string; citations: Citation[] }> {
    if (!this.genAI) {
      if (!this.initialize()) {
        return {
          content: "I'm sorry, but the AI service is not properly configured. Please check that your Gemini API key is set up correctly.",
          citations: []
        };
      }
    }

    if (!documentId || !this.documentTexts.has(documentId)) {
      return {
        content: "I don't have access to any document right now. Please upload a PDF first so I can help you analyze its contents.",
        citations: []
      };
    }

    try {
      const pages = this.documentTexts.get(documentId)!;
      const model = this.genAI!.getGenerativeModel({ model: "gemini-1.5-flash" });

      const relevantContext = PDFProcessor.extractRelevantContext(pages, message);
      
      // Build conversation context
      const conversationContext = conversationHistory
        .slice(-6) // Last 6 messages for context
        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const prompt = `You are an AI assistant helping users understand and analyze PDF documents. You have access to the content of a PDF document and should provide helpful, accurate responses based on that content.

Document Content:
${relevantContext}

Previous Conversation:
${conversationContext}

Current Question: ${message}

Instructions:
1. Answer the question based on the document content provided above
2. Be specific and cite relevant information from the document
3. If the question cannot be answered from the document, say so clearly
4. Keep responses concise but informative
5. When referencing specific information, mention the page number if available
6. If asked for a summary, provide a comprehensive overview of the key points

Please provide a helpful response:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      // Extract citations from the response and document
      const citations = this.extractCitations(content, pages, message);

      return {
        content: content.trim(),
        citations
      };

    } catch (error) {
      console.error('Error generating response:', error);
      
      if (error instanceof Error && error.message.includes('API_KEY')) {
        return {
          content: "There's an issue with the API configuration. Please check your Gemini API key and try again.",
          citations: []
        };
      }
      
      return {
        content: "I apologize, but I encountered an error while processing your request. Please try again in a moment.",
        citations: []
      };
    }
  }

  private static extractCitations(response: string, pages: string[], query: string): Citation[] {
    const citations: Citation[] = [];
    const searchResults = PDFProcessor.searchInText(pages, query);
    
    // Create citations based on search results and response content
    const responseWords = response.toLowerCase().split(/\s+/);
    
    searchResults.forEach((result, index) => {
      // Check if the response mentions concepts from this page
      const pageWords = result.text.toLowerCase().split(/\s+/);
      const commonWords = pageWords.filter(word => 
        word.length > 3 && responseWords.includes(word)
      );
      
      if (commonWords.length > 2 || result.relevance > 0.7) {
        citations.push({
          id: (index + 1).toString(),
          pageNumber: result.page,
          text: result.text.substring(0, 100) + (result.text.length > 100 ? '...' : ''),
          confidence: Math.min(result.relevance + (commonWords.length * 0.1), 0.95)
        });
      }
    });

    // If no citations found, add top search results
    if (citations.length === 0 && searchResults.length > 0) {
      citations.push({
        id: '1',
        pageNumber: searchResults[0].page,
        text: searchResults[0].text.substring(0, 100) + '...',
        confidence: searchResults[0].relevance
      });
    }

    return citations.slice(0, 3); // Limit to 3 citations
  }

  static async summarizeDocument(pages: string[]): Promise<string> {
    if (!this.genAI) {
      if (!this.initialize()) {
        return "Unable to generate summary - AI service not configured.";
      }
    }

    try {
      const model = this.genAI!.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Combine first few pages for summary
      const contentForSummary = pages.slice(0, 5).join('\n\n');
      
      const prompt = `Please provide a comprehensive summary of this document. Focus on:
1. Main topics and themes
2. Key findings or arguments
3. Important conclusions
4. Overall structure and purpose

Document content:
${contentForSummary.substring(0, 8000)}

Provide a clear, well-structured summary:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
      
    } catch (error) {
      console.error('Error generating summary:', error);
      return "Unable to generate document summary at this time.";
    }
  }
}