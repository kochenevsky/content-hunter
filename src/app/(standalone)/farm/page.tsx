import { StickyCta } from './_components/StickyCta'

export const metadata = {
  title: 'Система масштабирования SMM — Content Hunter',
  description: 'Загружай ролики — платформа распространяет их по десяткам прогретых аккаунтов автоматически. Гарантия просмотров в договоре.',
}

const SLIDE_URLS = Array.from({ length: 28 }, (_, i) =>
  `/slides/Content%20Hunter%20%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F_page-${String(i + 1).padStart(4, "0")}.jpg`
)

export default function FarmPage() {
  return (
    <>
      <style>{`
        .farm-root {
          background: #0b1220;
          min-height: 100vh;
          font-family: -apple-system,'SF Pro Display','Inter',system-ui,sans-serif;
          color: #f1f5f9;
        }

        .farm-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ── HERO ── */
        .farm-hero {
          padding: 60px 0 48px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .farm-hero { padding: 80px 0 64px; }
        }

        .farm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          color: #4ade80;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .farm-hero h1 {
          font-size: clamp(28px, 5vw, 52px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
          color: #fff;
        }

        .farm-hero-img {
          width: 100%;
          border-radius: 18px;
          margin: 28px 0;
          display: block;
          border: 1px solid rgba(255,255,255,0.07);
          object-fit: cover;
          max-height: 420px;
        }

        .farm-lead {
          font-size: clamp(15px, 2vw, 18px);
          color: #94a3b8;
          line-height: 1.65;
          margin-bottom: 14px;
        }

        .farm-list {
          list-style: none;
          margin: 0 0 24px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .farm-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: clamp(14px, 1.8vw, 17px);
          color: #cbd5e1;
          line-height: 1.5;
        }

        .farm-list li::before {
          content: '—';
          color: #22c55e;
          flex-shrink: 0;
          margin-top: 1px;
          font-weight: 700;
        }

        .farm-note {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 28px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          border-left: 3px solid rgba(34,197,94,0.4);
        }

        /* ── CEILING ── */
        .farm-section {
          padding: 64px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .farm-section h2 {
          font-size: clamp(24px, 4vw, 40px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 36px;
        }

        .farm-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          margin-bottom: 40px;
        }
        @media (min-width: 600px) {
          .farm-cards { grid-template-columns: 1fr 1fr; }
        }

        .farm-card-before {
          padding: 28px 24px;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .farm-card-after {
          padding: 28px 24px;
          border-radius: 18px;
          background: rgba(34,197,94,0.07);
          border: 1px solid rgba(34,197,94,0.2);
        }

        .card-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .card-main {
          font-size: clamp(16px, 2vw, 20px);
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 8px;
        }

        .card-big {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 900;
          line-height: 1.1;
          margin-top: 4px;
        }

        .farm-section-lead {
          font-size: clamp(15px, 2vw, 18px);
          color: #64748b;
          margin-bottom: 16px;
          font-weight: 600;
        }

        /* ── SLIDES ── */
        .farm-slides-section {
          padding: 64px 0 80px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .farm-slides-title {
          font-size: clamp(22px, 3.5vw, 36px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .farm-slides-sub {
          font-size: 13px;
          color: #334155;
          margin-bottom: 24px;
        }

        .farm-slides-grid {
          columns: 1;
          gap: 10px;
        }
        @media (min-width: 600px) {
          .farm-slides-grid { columns: 2; gap: 12px; }
        }
        @media (min-width: 900px) {
          .farm-slides-grid { columns: 3; gap: 14px; }
        }

        .farm-slide-wrap {
          break-inside: avoid;
          margin-bottom: 10px;
          position: relative;
          border-radius: 14px;
          overflow: hidden;
        }
        @media (min-width: 600px) { .farm-slide-wrap { margin-bottom: 12px; } }

        .farm-slide-wrap img {
          width: 100%;
          display: block;
          transition: transform 0.2s ease;
        }
        @media (min-width: 768px) {
          .farm-slide-wrap:hover img { transform: scale(1.015); }
        }

        .farm-slide-num {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.55);
        }

        /* ── FINAL CTA ── */
        .farm-final {
          background: linear-gradient(135deg,rgba(34,197,94,0.1),rgba(22,163,74,0.04));
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 24px;
          padding: 40px 28px;
          text-align: center;
          margin-top: 16px;
        }
        @media (min-width: 768px) {
          .farm-final { padding: 56px 80px; }
        }

        .farm-final h3 {
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .farm-final p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .farm-final-btn {
          display: block;
          max-width: 360px;
          margin: 0 auto;
          padding: 17px;
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
        }
        .farm-final-btn:hover { opacity: 0.9; }

        .farm-final-note {
          font-size: 11px;
          color: #334155;
          margin-top: 10px;
        }

        /* ── SECTION DIVIDER ── */
        .farm-divider {
          width: 40px;
          height: 3px;
          background: #22c55e;
          border-radius: 2px;
          margin-bottom: 32px;
        }
      `}</style>

      <div className="farm-root">
        <div className="farm-container">

          {/* ── HERO ── */}
          <section className="farm-hero">
            <div className="farm-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              Content Hunter
            </div>

            <h1>
              Вы недополучаете ×10–30 охвата<br />
              <span style={{ color: '#4ade80' }}>с каждого ролика</span>
            </h1>

            {/* Горизонтальная картинка — загрузите farm-hero.jpg в /public/ */}
            <img
              src="/farm-hero.jpg"
              alt="Контент-ферма Content Hunter"
              className="farm-hero-img"
            />

            <p className="farm-lead">
              Пока вы публикуете ролик в 1 аккаунт, его можно масштабировать в десятки аккаунтов и получать в разы больше просмотров с тем же контентом.
            </p>
            <p className="farm-lead">
              Проверьте, какой охват может давать ваша ниша:
            </p>

            <ul className="farm-list">
              {[
                'Сколько аккаунтов нужно',
                'Сколько публикаций можно масштабировать',
                'Какой охват может давать система',
                'Сколько стоит запуск',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="farm-note">
              Иногда расчёт показывает, что масштабирование не даст эффекта. И это лучше узнать до запуска.
            </div>

            <StickyCta
              href="https://sbsite.pro//eu_site_calc_1"
              label="Рассчитать для моей ниши"
              stickyLabel="Рассчитать для моей ниши"
            />
          </section>

          {/* ── CEILING ── */}
          <section className="farm-section">
            <div className="farm-divider" />
            <h2>
              Один аккаунт — потолок.<br />
              <span style={{ color: '#4ade80' }}>Система аккаунтов — рост.</span>
            </h2>

            <div className="farm-cards">
              <div className="farm-card-before">
                <p className="card-label" style={{ color: '#475569' }}>Сейчас у вас</p>
                <p className="card-main">30 роликов в месяц</p>
                <p className="card-big" style={{ color: '#475569' }}>= 30 000<br />просмотров</p>
              </div>
              <div className="farm-card-after">
                <p className="card-label" style={{ color: '#4ade80' }}>С нашей платформой</p>
                <p className="card-main" style={{ color: '#94a3b8' }}>30 роликов × 30 копий × 30 аккаунтов</p>
                <p className="card-big" style={{ color: '#fff' }}>= от 1 000 000<br />просмотров</p>
              </div>
            </div>

            <p className="farm-section-lead">Почему вы сейчас упираетесь в потолок</p>
            <ul className="farm-list" style={{ marginBottom: 28 }}>
              {[
                '1 аккаунт ограничивает охват',
                'Алгоритмы не масштабируют один источник',
                'Даже хороший ролик быстро умирает',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <StickyCta
              href="https://sbsite.pro//eu_site_calc_1"
              label="Сделать расчёты"
              stickyLabel="Сделать расчёты"
            />
          </section>

          {/* ── ПРЕЗЕНТАЦИЯ ── */}
          <section className="farm-slides-section">
            <div className="farm-divider" />
            <h2 className="farm-slides-title">
              Экскурсия на<br />
              <span style={{ color: '#4ade80' }}>контент-ферму</span>
            </h2>
            <p className="farm-slides-sub">
              {SLIDE_URLS.length} слайдов · прокрутите вниз
            </p>

            <div className="farm-slides-grid">
              {SLIDE_URLS.map((url, i) => (
                <div key={i} className="farm-slide-wrap">
                  <img
                    src={url}
                    alt={`Слайд ${i + 1}`}
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <div className="farm-slide-num">{i + 1} / {SLIDE_URLS.length}</div>
                </div>
              ))}
            </div>

            {/* Финальный CTA */}
            <div className="farm-final">
              <div style={{ fontSize: 36, marginBottom: 14 }}>🚀</div>
              <h3>
                Готовы запустить<br />
                <span style={{ color: '#4ade80' }}>свою ферму?</span>
              </h3>
              <p>
                Построить такую ферму самостоятельно — ~20 000 000 ₽.<br />
                Аренда в Content Hunter — от 25 000 ₽ в месяц.<br />
                Первичные вложения — 0 ₽.
              </p>
              <a
                href="https://sbsite.pro//eu_site_calc_1"
                target="_blank"
                rel="noopener noreferrer"
                className="farm-final-btn"
              >
                Рассчитать для моей ниши →
              </a>
              <p className="farm-final-note">Бесплатно · Гарантия просмотров в договоре</p>
            </div>
          </section>

        </div>{/* /farm-container */}
      </div>
    </>
  )
}
