"use client";

// ─── Слайды ────────────────────────────────────────────────────────────────────
// Замените имена файлов под ваш формат если отличается
const SLIDE_URLS = Array.from({ length: 27 }, (_, i) =>
  `/slides/Content%20Hunter%20%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F_page-${String(i + 1).padStart(4, "0")}.jpg`
);

export default function ExcursionPage() {
  return (
    <main
      style={{
        background: "#0b1220",
        minHeight: "100vh",
        fontFamily: "-apple-system,'SF Pro Display','Inter',system-ui,sans-serif",
        color: "#f1f5f9",
        maxWidth: 480,
        margin: "0 auto",
        overflowX: "hidden",
        paddingBottom: 100,
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { -webkit-tap-highlight-color: transparent; }
        img { display: block; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "36px 20px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 240, height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 20, padding: "5px 12px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          color: "#4ade80", marginBottom: 18, textTransform: "uppercase",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          Content Hunter
        </div>

        <h1 style={{
          fontSize: 30, fontWeight: 900, lineHeight: 1.1,
          letterSpacing: "-0.025em", marginBottom: 12,
        }}>
          ЭКСКУРСИЯ НА<br />
          <span style={{ color: "#4ade80" }}>КОНТЕНТ-ФЕРМУ</span>
        </h1>

        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
          Как вырастить миллионные охваты в соцсетях и получать новых клиентов на автомате.
        </p>

        {/* Счётчик слайдов */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginTop: 16,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "6px 12px",
          fontSize: 12, color: "#475569", fontWeight: 600,
        }}>
          <span style={{ color: "#4ade80" }}>↓</span>
          {SLIDE_URLS.length} слайдов · прокрутите вниз
        </div>
      </section>

      {/* ── СЛАЙДЫ ───────────────────────────────────────────────────── */}
      <section style={{ padding: "0 20px 40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SLIDE_URLS.map((url, i) => (
            <div
              key={i}
              style={{ position: "relative" }}
            >
              <img
                src={url}
                alt={`Слайд ${i + 1}`}
                loading={i < 3 ? "eager" : "lazy"}
                style={{
                  width: "100%",
                  borderRadius: 14,
                  display: "block",
                }}
              />
              {/* Номер слайда */}
              <div style={{
                position: "absolute", top: 10, right: 10,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                borderRadius: 6, padding: "3px 8px",
                fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)",
              }}>
                {i + 1} / {SLIDE_URLS.length}
              </div>
            </div>
          ))}
        </div>

        {/* Финальный блок после последнего слайда */}
        <div style={{
          marginTop: 20,
          background: "linear-gradient(135deg,rgba(34,197,94,0.1),rgba(22,163,74,0.05))",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 20, padding: "24px 20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <h2 style={{
            fontSize: 22, fontWeight: 900, marginBottom: 10,
            lineHeight: 1.2, letterSpacing: "-0.02em",
          }}>
            Готовы запустить<br />
            <span style={{ color: "#4ade80" }}>свою ферму?</span>
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
            Построить такую ферму самостоятельно — ~20 000 000 ₽.<br />
            Аренда в Content Hunter — от 25 000 ₽ в месяц.<br />
            Первичные вложения — 0 ₽.
          </p>
          <a
            href="https://sbsite.pro//ru_site_ch_1?utm_source=telegram&utm_medium=excursion&utm_campaign=final"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", padding: "16px",
              borderRadius: 14,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "#fff", fontSize: 16, fontWeight: 800,
              textDecoration: "none", letterSpacing: "-0.01em",
              boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
            }}
          >
            Получить консультацию →
          </a>
          <p style={{ fontSize: 11, color: "#334155", marginTop: 10 }}>
            Бесплатно · Гарантия просмотров в договоре
          </p>
        </div>
      </section>

      {/* ── STICKY CTA ───────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        padding: "10px 20px 24px",
        background: "linear-gradient(to top,#0b1220 55%,transparent)",
        zIndex: 100,
      }}>
        <a
          href="https://sbsite.pro//ru_site_ch_1?utm_source=telegram&utm_medium=excursion&utm_campaign=sticky"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block", padding: "15px",
            borderRadius: 14,
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "#fff", fontSize: 15, fontWeight: 800,
            textAlign: "center", textDecoration: "none",
            boxShadow: "0 6px 28px rgba(34,197,94,0.35)",
            letterSpacing: "-0.01em",
          }}
        >
          Получить консультацию →
        </a>
      </div>
    </main>
  );
}
