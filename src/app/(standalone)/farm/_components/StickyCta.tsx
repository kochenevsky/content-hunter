"use client";

import { useState, useEffect } from "react";

type StickyCtaProps = {
  href: string;
  label: string;
  stickyLabel?: string;
};

export function StickyCta({ href, label, stickyLabel }: StickyCtaProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Inline кнопка */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 32px",
          borderRadius: 14,
          background: "linear-gradient(135deg,#22c55e,#16a34a)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 800,
          textDecoration: "none",
          letterSpacing: "-0.01em",
          boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
          transition: "opacity 0.15s",
          width: "100%",
          maxWidth: 420,
        }}
      >
        {label}
      </a>

      {/* Sticky кнопка — появляется после 300px скролла */}
      {isSticky && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          padding: "10px 20px 24px",
          background: "linear-gradient(to top,#0b1220 55%,transparent)",
          zIndex: 100,
          pointerEvents: "none",
        }}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: 15,
              borderRadius: 14,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 800,
              textAlign: "center",
              textDecoration: "none",
              boxShadow: "0 6px 28px rgba(34,197,94,0.4)",
              letterSpacing: "-0.01em",
              pointerEvents: "all",
            }}
          >
            {stickyLabel ?? label}
          </a>
        </div>
      )}
    </>
  );
}
