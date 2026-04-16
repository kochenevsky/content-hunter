'use client';

import { StickyCta } from './_components/StickyCta';
import { ConsultModal } from './_components/ConsultModal';
import { useState, useEffect } from 'react';

export default function FarmPageClient({ slideUrls }: { slideUrls: string[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utmParams, setUtmParams] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmString = params.toString();
    setUtmParams(utmString ? `&${utmString}` : '');
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const getBotLink = () => {
  // Убираем первый & и заменяем на ?
  const cleanUtm = utmParams.startsWith('&') ? '?' + utmParams.slice(1) : '';
  return `https://contenthunter.ru/consult${cleanUtm}`;
};
  
return (
    <>
      <ConsultModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <style>{`
        /* сброс — убираем любые внешние отступы/рамки */
        html, body { margin: 0; padding: 0; overflow-x: hidden; }

        .farm-root {
          background: #0b1220;
          min-height: 100vh;
          font-family: -apple-system,'SF Pro Display','Inter',system-ui,sans-serif;
          color: #f1f5f9;
          overflow-x: hidden;
          width: 100%;
        }

        .farm-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 16px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── HERO ── */
        .farm-hero {
          padding: 60px 0 48px;
          position: relative;
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
          font-size: clamp(26px, 5vw, 52px);
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
          object-fit: cover;
          max-height: 420px;
          border: none;
          outline: none;
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
          width: 100%;
          box-sizing: border-box;
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
  color: #94a3b8;  /* ← было #475569, стало #94a3b8 (светло-серый) */
  line-height: 1.6;
  margin-bottom: 28px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  border-left: 3px solid rgba(34,197,94,0.4);
  box-sizing: border-box;
  width: 100%;
}

        /* ── SECTIONS ── */
        .farm-section {
          padding: 56px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          width: 100%;
          box-sizing: border-box;
        }

        .farm-section h2 {
          font-size: clamp(22px, 4vw, 40px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 32px;
        }

        .farm-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 36px;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 600px) {
          .farm-cards { grid-template-columns: 1fr 1fr; }
        }

        .farm-card-before {
          padding: 24px 20px;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          box-sizing: border-box;
        }

        .farm-card-after {
          padding: 24px 20px;
          border-radius: 18px;
          background: rgba(34,197,94,0.07);
          border: 1px solid rgba(34,197,94,0.2);
          box-sizing: border-box;
        }

        .card-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .card-main {
          font-size: clamp(14px, 2vw, 18px);
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 6px;
        }

        .card-big {
          font-size: clamp(22px, 4vw, 34px);
          font-weight: 900;
          line-height: 1.15;
          margin-top: 4px;
        }

        .farm-section-lead {
          font-size: clamp(15px, 2vw, 18px);
          color: #64748b;
          margin-bottom: 14px;
          font-weight: 600;
        }

        .farm-divider {
          width: 40px;
          height: 3px;
          background: #22c55e;
          border-radius: 2px;
          margin-bottom: 28px;
        }

        /* ── DEMO VIDEO SECTION (НОВЫЙ БЛОК) ── */
.farm-demo-section {
  padding: 56px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  width: 100%;
  box-sizing: border-box;
}

.farm-demo-title {
  font-size: clamp(22px, 3.5vw, 36px);
  font-weight: 900;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-align: left;  /* ← было center, стало left */
}

.farm-demo-sub {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 32px;
  text-align: left;  /* ← было center, стало left */
}

.farm-demo-video {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  background: #000;
}

        .farm-demo-video iframe {
          display: block;
        }

        /* ── SLIDES ── */
        .farm-slides-section {
          padding: 56px 0 100px;
          border-top: 1px solid rgba(255,255,255,0.06);
          width: 100%;
          box-sizing: border-box;
        }

        .farm-slides-title {
          font-size: clamp(22px, 3.5vw, 36px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .farm-slides-sub {
          font-size: 12px;
          color: #334155;
          margin-bottom: 20px;
        }

        .farm-slides-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 540px) {
          .farm-slides-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (min-width: 800px) {
          .farm-slides-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }

        .farm-slide-wrap {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .farm-slide-wrap img {
          width: 100%;
          height: auto;
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
          padding: 3px 7px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.55);
        }

        /* ── FINAL CTA ── */
        .farm-final {
          background: linear-gradient(135deg,rgba(34,197,94,0.1),rgba(22,163,74,0.04));
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 20px;
          padding: 36px 24px;
          text-align: center;
          margin-top: 16px;
          box-sizing: border-box;
          width: 100%;
        }
        @media (min-width: 768px) {
          .farm-final { padding: 52px 72px; }
        }

        .farm-final h3 {
          font-size: clamp(20px, 3vw, 30px);
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
          margin-bottom: 22px;
        }

        .farm-final-btn {
          display: block;
          max-width: 360px;
          margin: 0 auto;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff;
          font-size: 15px;
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
      `}</style>

      <div className="farm-root">
        <div className="farm-container">

          {/* HERO */}
          <section className="farm-hero">
            <div className="farm-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              Content Hunter
            </div>

            <h1>
              Вы недополучаете ×10–30 охвата<br />
              <span style={{ color: '#4ade80' }}>с каждого ролика</span>
            </h1>

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
              onClick={handleCtaClick}
              label="Рассчитать для моей ниши"
              stickyLabel="Рассчитать для моей ниши"
            />
          </section>

          {/* CEILING */}
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
              onClick={handleCtaClick}
              label="Сделать расчёты"
              stickyLabel="Сделать расчёты"
            />
          </section>

          {/* DEMO VIDEO — НОВЫЙ БЛОК ПЕРЕД СЛАЙДАМИ */}
          <section className="farm-demo-section">
            <div className="farm-divider" />
            <h2 className="farm-demo-title">
              Как работает<br />
              <span style={{ color: '#4ade80' }}>платформа</span>
            </h2>
            <p className="farm-demo-sub">
              Настройка системы, загрузка роликов и аналитика
            </p>

            <div className="farm-demo-video">
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                <iframe
                  src="https://player.vimeo.com/video/1181500890?badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="Как работает платформа Content Hunter"
                />
              </div>
            </div>
          </section>

          {/* SLIDES */}
          <section className="farm-slides-section">
            <div className="farm-divider" />
            <h2 className="farm-slides-title">
              Экскурсия на<br />
              <span style={{ color: '#4ade80' }}>контент-ферму</span>
            </h2>
            <p className="farm-slides-sub">{slideUrls.length} слайдов</p>

            <div className="farm-slides-grid">
              {slideUrls.map((url, i) => (
                <div key={i} className="farm-slide-wrap">
                  <img
                    src={url}
                    alt={`Слайд ${i + 1}`}
                    loading={i < 6 ? 'eager' : 'lazy'}
                  />
                  <div className="farm-slide-num">{i + 1}</div>
                </div>
              ))}
            </div>

            <div className="farm-final">
              <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
              <h3>
                Готовы запустить<br />
                <span style={{ color: '#4ade80' }}>свою ферму?</span>
              </h3>
              <p>
                Построить такую ферму самостоятельно — ~20 000 000 ₽.<br />
                Аренда в Content Hunter — от 25 000 ₽ в месяц.<br />
                Настройка и установка — 0 ₽.
              </p>
              <a
                onClick={handleCtaClick}
  className="farm-final-btn"
  style={{ cursor: 'pointer' }}
              >
                Рассчитать для моей ниши →
              </a>
              <p className="farm-final-note">Бесплатно · Гарантия просмотров в договоре</p>
            </div>
          </section>

        </div>
      </div>

      {/* sticky — вне farm-container чтобы не обрезался */}
      <StickyCta
        onClick={handleCtaClick}
        label="Рассчитать для моей ниши"
        stickyLabel="Рассчитать для моей ниши"
        alwaysShowSticky
      />
    </>
  );
}
