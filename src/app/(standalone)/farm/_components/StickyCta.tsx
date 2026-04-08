"use client";

import { useEffect, useState } from 'react';
import { useMetrica } from '@artginzburg/next-ym';
import ReactPixel from 'react-facebook-pixel';

type StickyCtaProps = {
  href: string;
  label: string;
  stickyLabel?: string;
  alwaysShowSticky?: boolean;
};

export function StickyCta({ href, label, stickyLabel, alwaysShowSticky }: StickyCtaProps) {
  const [isClient, setIsClient] = useState(false);
  const { reachGoal } = useMetrica();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (typeof window !== 'undefined' && isClient) {
      reachGoal('click_calc_button');
      ReactPixel.track('Lead', {
        content_name: 'Расчет для ниши',
        content_url: href,
      });
      window.open(href, '_blank');
    }
  };

  // Если не на клиенте — рендерим без обработчиков
  if (!isClient) {
    // Возвращаем упрощённую версию без событий
    if (alwaysShowSticky) {
      return (
        <div className="sticky-panel">
          <a href={href} target="_blank" rel="noopener noreferrer" className="sticky-btn">
            {stickyLabel ?? label}
          </a>
        </div>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-cta-btn">
        {label}
      </a>
    );
  }

  // Полная версия с обработчиками для клиента
  if (alwaysShowSticky) {
    return (
      <>
        <style>{`
          .sticky-panel {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #0b1220;
            border-top: 1px solid rgba(255,255,255,0.07);
            padding: 12px 16px 20px;
            z-index: 200;
          }
          .sticky-btn {
            display: block;
            width: 100%;
            max-width: 420px;
            margin: 0 auto;
            padding: 15px;
            border-radius: 14px;
            background: linear-gradient(135deg,#22c55e,#16a34a);
            color: #fff;
            font-size: 15px;
            font-weight: 800;
            text-align: center;
            text-decoration: none;
            box-shadow: 0 4px 20px rgba(34,197,94,0.35);
            letter-spacing: -0.01em;
            transition: opacity 0.15s;
            box-sizing: border-box;
            font-family: -apple-system,'SF Pro Display','Inter',system-ui,sans-serif;
          }
          .sticky-btn:hover { opacity: 0.9; }
        `}</style>
        <div className="sticky-panel">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="sticky-btn"
            onClick={handleClick}
          >
            {stickyLabel ?? label}
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .inline-cta-btn {
          display: block;
          width: 100%;
          max-width: 420px;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 24px rgba(34,197,94,0.3);
          transition: opacity 0.15s;
          text-align: center;
          box-sizing: border-box;
          font-family: -apple-system,'SF Pro Display','Inter',system-ui,sans-serif;
        }
        .inline-cta-btn:hover { opacity: 0.9; }
      `}</style>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-cta-btn"
        onClick={handleClick}
      >
        {label}
      </a>
    </>
  );
}
