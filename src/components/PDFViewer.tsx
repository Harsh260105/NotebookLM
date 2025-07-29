import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { Document as PDFDocument, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PDFViewer({ file, currentPage, onPageChange, highlightPage }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
  }, []);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  const downloadPDF = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!file) {
    return (
      <div className="flex-1 bg-gray-100 rounded-b-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="h-24 w-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0116 6.414V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">No PDF selected</p>
          <p className="text-sm text-gray-400">Upload a PDF to start viewing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-b-lg border border-gray-200 overflow-hidden flex flex-col">
      {/* PDF Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium px-2">
              {currentPage} of {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center space-x-1">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium px-2">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 2.0}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={rotate}
            className="p-1 rounded hover:bg-gray-200"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={downloadPDF}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <div 
            className={`bg-white shadow-lg transition-all duration-300 ${
              highlightPage === currentPage ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
            }`}
          >
            <PDFDocument
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-96 bg-gray-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                loading={
                  <div className="flex items-center justify-center h-96 bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }
              />
            </PDFDocument>
          </div>
        </div>
      </div>
    </div>
  );
}