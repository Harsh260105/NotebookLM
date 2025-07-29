import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import { ChatMessage, Document } from '../types';
import CitationButton from './CitationButton';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  selectedDocument: Document | null;
  onCitationClick: (pageNumber: number) => void;
}

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading, 
  selectedDocument,
  onCitationClick 
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const suggestedQuestions = [
    "What is the main topic of this document?",
    "Can you provide a comprehensive summary?",
    "What are the key findings and conclusions?",
    "Are there any specific recommendations or action items?",
    "What methodology or approach is discussed?",
    "Who are the main authors or contributors mentioned?"
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">AI Assistant</h3>
              <p className="text-xs text-gray-500">
                {selectedDocument ? `Analyzing: ${selectedDocument.name}` : 'Ready to help'}
              </p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-200 rounded">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && selectedDocument && (
          <div className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <Bot className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-lg font-medium">Ready to analyze your document</p>
              <p className="text-sm">I can help you understand, summarize, and extract insights from your PDF.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="text-left p-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-md"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length === 0 && !selectedDocument && (
          <div className="text-center text-gray-500 py-12">
            <Bot className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium">Welcome to your AI Document Assistant</p>
            <p className="text-sm">Upload a PDF document to start analyzing and asking questions about its content.</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-xs text-blue-700">
                <strong>Powered by Google Gemini</strong><br/>
                Advanced AI for document understanding and analysis
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            )}

            <div className="max-w-2xl">
              <div
                className={`px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words max-w-xs">{message.content}</p>
                
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                    <p className="text-xs font-medium text-gray-600">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.citations.map((citation) => (
                        <CitationButton
                          key={citation.id}
                          citation={citation}
                          onClick={onCitationClick}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`flex items-center space-x-2 mt-1 ${message.type === 'user' ? 'justify-end' : ''}`}>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(message.timestamp)}
                </span>
                
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                      title="Copy message"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-green-600"
                      title="Helpful"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600"
                      title="Not helpful"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={selectedDocument ? "Ask a question about your document..." : "Please upload a PDF first"}
              disabled={!selectedDocument || isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || !selectedDocument || isLoading}
            className="px-4 h-11 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        
      </div>
    </div>
  );
}