// src/app/(frontend)/offer/page.tsx
'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function OfferPage() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          setContainerWidth(ref.clientWidth);
        }
      }}
      style={{
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        background: '#0b1220',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Навигация */}
      {numPages > 1 && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(11, 18, 32, 0.95)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            style={{
              background: pageNumber <= 1 ? '#333' : '#3b82f6',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Назад
          </button>
          <span style={{ color: '#e2e8f0', fontSize: '14px', userSelect: 'none' }}>
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            style={{
              background: pageNumber >= numPages ? '#333' : '#3b82f6',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer',
            }}
          >
            Вперед →
          </button>
        </div>
      )}

      {/* PDF документ */}
      <div style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 0',
      }}>
        <Document
          file="/docs/offer.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div style={{ color: '#e2e8f0', padding: '20px' }}>
              Загрузка документа...
            </div>
          }
          error={
            <div style={{ color: '#ef4444', padding: '20px' }}>
              Ошибка загрузки PDF
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={containerWidth > 800 ? 800 : containerWidth - 32}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
