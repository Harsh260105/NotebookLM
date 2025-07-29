import { FileText, Calendar, HardDrive, X } from 'lucide-react';
import { Document } from '../types';

interface DocumentListProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  onRemoveDocument: (documentId: string) => void;
}

export default function DocumentList({ 
  documents, 
  selectedDocument, 
  onSelectDocument, 
  onRemoveDocument 
}: DocumentListProps) {
  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm">No documents uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Documents ({documents.length})</h3>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
        {documents.map((document) => (
          <div
            key={document.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedDocument?.id === document.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => onSelectDocument(document)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {document.name}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(document.uploadDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HardDrive className="h-3 w-3" />
                      <span>{formatFileSize(document.size)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {document.pageCount} pages
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveDocument(document.id);
                }}
                className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}