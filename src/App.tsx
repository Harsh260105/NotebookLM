import React, { useState, useCallback, useEffect } from 'react';
import { FileText, MessageSquare, Settings, BookOpen } from 'lucide-react';
import PDFUpload from './components/PDFUpload';
import PDFViewer from './components/PDFViewer';
import ChatInterface from './components/ChatInterface';
import DocumentList from './components/DocumentList';
import { Document, ChatMessage } from './types';
import { PDFProcessor } from './utils/pdfProcessor';
import { AIService } from './utils/aiService';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightPage, setHighlightPage] = useState<number | undefined>();

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    
    try {
      // Extract text and get page count
      const [extractedText, pageCount] = await Promise.all([
        PDFProcessor.extractText(file),
        PDFProcessor.getPageCount(file)
      ]);

      // Create new document
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        file,
        uploadDate: new Date(),
        pageCount,
        size: file.size
      };

      // Add to documents list
      setDocuments(prev => [newDocument, ...prev]);
      setSelectedDocument(newDocument);
      setCurrentPage(1);
      setMessages([]);

      // Store document text for AI processing
      AIService.setDocumentText(newDocument.id, extractedText);

    } catch (error) {
      console.error('Error processing PDF:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedDocument) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await AIService.generateResponse(
        content,
        selectedDocument.id,
        messages
      );

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        citations: response.citations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDocument, messages]);

  const handleCitationClick = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    setHighlightPage(pageNumber);
    
    // Clear highlight after animation
    setTimeout(() => setHighlightPage(undefined), 2000);
  }, []);

  const handleDocumentSelect = useCallback((document: Document) => {
    setSelectedDocument(document);
    setCurrentPage(1);
    setMessages([]);
  }, []);

  const handleRemoveDocument = useCallback((documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    
    if (selectedDocument?.id === documentId) {
      const remainingDocs = documents.filter(doc => doc.id !== documentId);
      setSelectedDocument(remainingDocs.length > 0 ? remainingDocs[0] : null);
      setMessages([]);
      setCurrentPage(1);
    }
  }, [selectedDocument, documents]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">NotebookLM</h1>
                <p className="text-sm text-gray-500">AI-powered document analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{documents.length} documents</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="h-4 w-4" />
                <span>{messages.length} messages</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Document Upload and List */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h2>
              <PDFUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
            </div>
            
            <DocumentList
              documents={documents}
              selectedDocument={selectedDocument}
              onSelectDocument={handleDocumentSelect}
              onRemoveDocument={handleRemoveDocument}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-7.1rem)]">
              {/* PDF Viewer */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Document Viewer</h3>
                  {selectedDocument && (
                    <p className="text-sm text-gray-500 mt-1">{selectedDocument.name}</p>
                  )}
                </div>
                <div className="flex h-full overflow-auto">
                  <PDFViewer
                    file={selectedDocument?.file || null}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    highlightPage={highlightPage}
                  />
                </div>
              </div>

              {/* Chat Interface */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">AI Assistant</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Ask questions about your document
                  </p>
                </div>
                <div className="h-full">
                  <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    selectedDocument={selectedDocument}
                    onCitationClick={handleCitationClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;