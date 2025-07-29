import * as pdfjsLib from 'pdfjs-dist';

export class PDFProcessor {
  static async extractText(file: File): Promise<string[]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        pages.push(pageText);
      }

      return pages;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  static async getPageCount(file: File): Promise<number> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error('Error getting page count:', error);
      return 0;
    }
  }

  static searchInText(pages: string[], query: string): { page: number; text: string; relevance: number }[] {
    const results: { page: number; text: string; relevance: number }[] = [];
    const queryLower = query.toLowerCase();

    pages.forEach((pageText, index) => {
      if (!pageText.trim()) return;

      const sentences = pageText.split(/[.!?]+/).filter(s => s.trim().length > 20);
      
      sentences.forEach(sentence => {
        const sentenceLower = sentence.toLowerCase();
        if (sentenceLower.includes(queryLower)) {
          const relevance = this.calculateRelevance(sentenceLower, queryLower);
          if (relevance > 0.3) {
            results.push({
              page: index + 1,
              text: sentence.trim(),
              relevance
            });
          }
        }
      });
    });

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }

  private static calculateRelevance(text: string, query: string): number {
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;

    let matches = 0;
    words.forEach(word => {
      if (text.includes(word)) {
        matches++;
      }
    });
    
    const baseScore = matches / words.length;

    // Bonus for having the exact phrase match
    const hasExactMatch = text.includes(queryLower);
    const exactBonus = hasExactMatch ? 0.3 : 0;
    
    return Math.min(baseScore + exactBonus, 1.0);
  }

  static extractRelevantContext(pages: string[], query: string, maxTokens: number = 4000): string {
    const searchResults = this.searchInText(pages, query);
    let context = '';
    let tokenCount = 0;

    // Add page context for top results
    for (const result of searchResults) {
      const pageContent = pages[result.page - 1];
      const sentences = pageContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      // Find the sentence with the match and add surrounding context
      const matchIndex = sentences.findIndex(s => 
        s.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 2);
        const end = Math.min(sentences.length, matchIndex + 3);
        const contextSentences = sentences.slice(start, end);
        
        const pageContext = `\n[Page ${result.page}]\n${contextSentences.join('. ')}\n`;
        
        if (tokenCount + pageContext.length < maxTokens) {
          context += pageContext;
          tokenCount += pageContext.length;
        } else {
          break;
        }
      }
    }

    // If no specific matches, add first few pages as general context
    if (!context.trim()) {
      for (let i = 0; i < Math.min(3, pages.length); i++) {
        const pageContent = pages[i].substring(0, 1000);
        const pageContext = `\n[Page ${i + 1}]\n${pageContent}...\n`;
        
        if (tokenCount + pageContext.length < maxTokens) {
          context += pageContext;
          tokenCount += pageContext.length;
        } else {
          break;
        }
      }
    }

    return context;
  }
}