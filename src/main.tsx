import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { pdfjs } from 'react-pdf';
import App from './App.tsx';
import './index.css';

const workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
