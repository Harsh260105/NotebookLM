import { ExternalLink, FileText } from 'lucide-react';
import { Citation } from '../types';

interface CitationButtonProps {
  citation: Citation;
  onClick: (pageNumber: number) => void;
}

export default function CitationButton({ citation, onClick }: CitationButtonProps) {
  const handleClick = () => {
    onClick(citation.pageNumber);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.8) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.8) return 'Good';
    if (confidence >= 0.7) return 'Fair';
    return 'Low';
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-md hover:scale-105 ${getConfidenceColor(citation.confidence)}`}
      title={`${citation.text} (Confidence: ${getConfidenceLabel(citation.confidence)})`}
    >
      <FileText className="h-3 w-3" />
      <span>Page {citation.pageNumber}</span>
      <ExternalLink className="h-3 w-3" />
      <div className="flex items-center space-x-1">
        <div className="w-1 h-1 rounded-full bg-current opacity-40"></div>
        <span className="text-xs opacity-75">
          {Math.round(citation.confidence * 100)}%
        </span>
      </div>
    </button>
  );
}