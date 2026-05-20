// src/app/(frontend)/offer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function OfferPage() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isMobile) return; // На мобильных не обрабатываем скролл для смены страниц
    
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    const pageHeight = container.scrollHeight / numPages;
    const newPage = Math.round(scrollPosition / pageHeight) + 1;
    
    if (newPage !== pageNumber && newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
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
      {/* Навигация - показываем только на мобильных */}
      {numPages > 1 && isMobile && (
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
              minWidth: '100px',
            }}
          >
            ← Назад
          </button>
          <span style={{ color: '#e2e8f0', fontSize: '14px', userSelect: 'none', minWidth: '80px', textAlign: 'center' }}>
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
              minWidth: '100px',
            }}
          >
            Вперед →
          </button>
        </div>
      )}

      {/* Индикатор страницы для десктопа (опционально) */}
      {numPages > 1 && !isMobile && (
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 10,
          background: 'rgba(11, 18, 32, 0.8)',
          backdropFilter: 'blur(8px)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ color: '#e2e8f0', fontSize: '12px', userSelect: 'none' }}>
            {pageNumber} / {numPages}
          </span>
        </div>
      )}

      {/* PDF документ */}
      <div
        onScroll={handleScroll}
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: isMobile ? '20px 0' : '20px 0',
          overflow: isMobile ? 'hidden' : 'auto',
        }}
      >
        {isMobile ? (
          // Мобильная версия - показываем одну страницу
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
        ) : (
          // Десктоп версия - показываем все страницы для скролла
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
            {Array.from(new Array(numPages), (_, index) => (
              <div key={`page_${index + 1}`} style={{ marginBottom: '20px' }}>
                <Page
                  pageNumber={index + 1}
                  width={containerWidth > 800 ? 800 : containerWidth - 32}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </div>
            ))}
          </Document>
        )}
      </div>

      {/* Подсказка для десктопа */}
      {!isMobile && numPages > 1 && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(11, 18, 32, 0.7)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>
            Прокручивайте для навигации по страницам
          </span>
        </div>
      )}
    </div>
  );
}
