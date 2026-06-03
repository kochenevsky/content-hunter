"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { id: "how", label: "Как работает" },
  { id: "why", label: "Зачем это" },
  { id: "process", label: "Процесс" },
  { id: "faq", label: "FAQ" },
  { id: "docs", label: "Документы" },
];

const FAQ_ITEMS = [
  {
    q: "Это накрутка или реальный трафик?",
    a: "Это не накрутка и не боты. Мы создаём сеть реальных аккаунтов, которые публикуют ваш контент как обычные пользователи. За счёт этого ролики попадают в органическую выдачу TikTok, Instagram и YouTube и собирают реальные просмотры. Это масштабирование дистрибуции — не накрутка.",
  },
  {
    q: "А если ролики не наберут заявленные просмотры?",
    a: "Гарантия прописана в договоре. Если по итогам месяца ролики не добирают нужное количество просмотров — мы докручиваем их за свой счёт через дополнительные публикации, пока не выйдем на нужные цифры.",
  },
  {
    q: "Это будут мои клиенты или случайные люди?",
    a: "Просмотры идут из органики. Мы настраиваем аккаунты под вашу нишу, гео и язык, чтобы контент показывался максимально релевантной аудитории.",
  },
  {
    q: "А если аккаунты заблокируют?",
    a: "Если какие-то аккаунты блокируются, мы полностью берём это на себя — создаём новые и прогреваем их за свой счёт. На результат клиента это никак не влияет. Массовых банов нет, потому что система уже отработана.",
  },
  {
    q: "Сколько времени занимает запуск?",
    a: "Около 10 дней уходит на создание и прогрев аккаунтов. После этого вы начинаете загружать ролики, и система сразу начинает их публиковать и набирать просмотры.",
  },
  {
    q: "Что мне нужно делать со своей стороны?",
    a: "Только загружать готовые ролики в платформу. Всё остальное — создание инфраструктуры, публикации, распределение, аналитика — мы берём на себя.",
  },
  {
    q: "Это вместо SMM или как дополнение?",
    a: "Не замена SMM, а усиление. Если у вас уже есть контент и команда — мы просто кратно увеличиваем охват того же контента без увеличения затрат на производство.",
  },
  {
    q: "Почему я не могу сделать это сам?",
    a: "Технически можете, но это инфраструктура на десятки аккаунтов, устройства, прокси, софт и процессы. Самостоятельная сборка такой системы обходится в десятки миллионов рублей и требует постоянного обслуживания.",
  },
  {
    q: "Это затронет мой основной аккаунт?",
    a: "Нет. Основной аккаунт вообще не участвует в системе. Мы работаем через отдельную сеть аккаунтов — на ваш бренд-аккаунт это никак не влияет.",
  },
  {
    q: "Это вообще легально?",
    a: "Мы используем стандартные механики платформ — публикацию контента в аккаунтах. Никаких запрещённых методов нет.",
  },
  {
    q: "Если у меня слабый контент, это поможет?",
    a: "Если контент совсем слабый — нет. Мы усиливаем дистрибуцию, а не заменяем качество. Но если ролики хотя бы иногда набирают просмотры — масштабирование даёт кратный рост.",
  },
  {
    q: "Можно начать с небольшого теста?",
    a: "Да, можно начать с минимального тарифа и посмотреть результат за месяц, а дальше масштабироваться. Вы платите помесячно — нет долгосрочных обязательств.",
  },
  {
    q: "А если у меня B2B или сложный продукт?",
    a: "Работает, если есть понятная аудитория и контент. Но эффективность ниже, чем в массовых нишах — это нужно считать отдельно.",
  },
  {
    q: "Как быстро окупится?",
    a: "Это считается в калькуляторе. Он показывает, сколько аккаунтов нужно, какие будут охваты и сколько это стоит. Иногда расчёт показывает, что запуск невыгоден — и тогда мы прямо об этом говорим.",
  },
  {
    q: "Как я буду понимать, что всё работает?",
    a: "У вас есть доступ к аналитике, где видно количество публикаций, просмотров и динамику. Раз в неделю — подробный отчёт с топами просмотров и рекомендациями по контенту.",
  },
];

const WHO_FITS = [
  "Онлайн-школы",
  "Маркетплейсы и интернет-магазины",
  "Эксперты и консультанты",
  "Онлайн-сервисы и мобильные приложения",
  "Офлайн-бизнесы",
  "Личный бренд",
];

export default function KnowledgeBase() {
  const [activeNav, setActiveNav] = useState("how");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="ch-root">
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  :root {
    --bg: #080e1a;
    --surface: #0f1828;
    --surface2: #162035;
    --border: rgba(255,255,255,0.07);
    --accent: #22c55e;
    --accent2: #16a34a;
    --text: #f1f5f9;
    --muted: #94a3b8;
    --muted2: #64748b;
    --radius: 20px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  .ch-root {
    font-family: -apple-system, 'SF Pro Display', 'Inter', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
  }

  /* NAV */
  .ch-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(8, 14, 26, 0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 56px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ch-nav::-webkit-scrollbar { display: none; }

  .ch-logo {
    font-weight: 900;
    font-size: 15px;
    letter-spacing: -0.02em;
    color: var(--accent);
    white-space: nowrap;
    margin-right: 16px;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .ch-nav-btn {
    background: none;
    border: none;
    color: var(--muted);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  .ch-nav-btn:hover { color: #fff; background: var(--surface2); }
  .ch-nav-btn.active { 
    color: #fff; 
    background: rgba(34,197,94,0.12); 
    border: 1px solid rgba(34,197,94,0.25);
  }

  /* HERO */
  .ch-hero {
    padding: 32px 24px 20px;
    max-width: 720px;
    margin: 0 auto;
  }

  .ch-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
  }

  .ch-hero h1 {
    font-size: clamp(22px, 5.5vw, 36px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #fff;
    margin-bottom: 14px;
  }

  .ch-hero h1 span {
    color: var(--accent);
  }

  .ch-hero p {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.65;
    max-width: 520px;
    margin-bottom: 24px;
  }

  .ch-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  /* BUTTONS */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    padding: 14px 24px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.15s;
    letter-spacing: 0.02em;
    box-shadow: 0 8px 24px rgba(34,197,94,0.25);
  }
  .btn-primary:hover { opacity: 0.9; }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--surface2);
    color: var(--text);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 14px 24px;
    border-radius: 14px;
    border: 1px solid var(--border);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
  }
  .btn-secondary:hover { background: #1e2a42; border-color: rgba(34,197,94,0.25); color: #fff; }

  /* SECTION */
  .ch-section {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 24px 48px;
    scroll-margin-top: 72px;
  }

  .ch-section-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .ch-section h2 {
    font-size: clamp(20px, 5vw, 30px);
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 24px;
    color: #fff;
  }

  /* CARDS */
  .ch-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px 24px;
    transition: border-color 0.15s ease;
  }
  .ch-card:hover { border-color: rgba(34,197,94,0.25); }

  .ch-grid {
    display: grid;
    gap: 12px;
  }
  .ch-grid-2 { grid-template-columns: repeat(2, 1fr); }

  @media (max-width: 540px) {
    .ch-grid-2 { grid-template-columns: 1fr; }
    .ch-hero { padding: 24px 20px 16px; }
    .ch-section { padding: 0 20px 32px; }
  }

  /* STAT CARDS */
  .ch-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ch-stat-num {
    font-size: 36px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--accent);
    line-height: 1;
  }
  .ch-stat-label {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.4;
  }

  /* PROCESS STEPS */
  .ch-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ch-step {
    display: flex;
    gap: 20px;
    padding-bottom: 32px;
    position: relative;
  }

  .ch-step:last-child { padding-bottom: 0; }

  .ch-step-line {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .ch-step-num {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--accent);
    flex-shrink: 0;
    z-index: 1;
    position: relative;
  }

  .ch-step-num.free {
    background: rgba(34,197,94,0.12);
    border-color: rgba(34,197,94,0.25);
  }

  .ch-step-connector {
    width: 1px;
    flex: 1;
    background: var(--border);
    margin-top: 8px;
  }

  .ch-step-content {
    padding-top: 6px;
    padding-bottom: 8px;
  }

  .ch-step-content h3 {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }

  .ch-step-content p {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
  }

  .ch-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
  .ch-badge.free { background: rgba(34,197,94,0.15); color: var(--accent); }
  .ch-badge.paid { background: rgba(255,107,53,0.15); color: #ff6b35; }

  /* FAQ */
  .ch-faq-item {
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }

  .ch-faq-q {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 18px 0;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    transition: color 0.15s;
    background: none;
    border: none;
    color: var(--text);
    text-align: left;
    width: 100%;
    font-family: inherit;
  }
  .ch-faq-q:hover { color: var(--accent); }

  .ch-faq-icon {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
    transition: transform 0.3s, background 0.15s;
    color: var(--muted2);
  }
  .ch-faq-icon.open { 
    transform: rotate(45deg); 
    background: rgba(34,197,94,0.12); 
    color: var(--accent); 
  }

  .ch-faq-a {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    padding-bottom: 18px;
    padding-right: 40px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, padding 0.3s;
  }
  .ch-faq-a.open { max-height: 300px; }

  /* VIDEO */
  .ch-video-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    aspect-ratio: 16/9;
    position: relative;
  }

  .ch-video-wrap iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  /* WHO FITS */
  .ch-who-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (max-width: 400px) {
    .ch-who-grid { grid-template-columns: 1fr; }
  }

  .ch-who-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
  }
  .ch-who-item::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(34,197,94,0.4);
  }

  /* DOCS */
  .ch-doc-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    text-decoration: none;
    color: var(--text);
    font-size: 15px;
    font-weight: 600;
    transition: all 0.15s;
    margin-bottom: 10px;
  }
  .ch-doc-link:hover { border-color: rgba(34,197,94,0.25); background: var(--surface2); }

  .ch-doc-link span { color: var(--accent); font-size: 20px; }

  /* FORMULA */
  .ch-formula {
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: 14px;
    padding: 24px;
    text-align: center;
    margin-bottom: 12px;
  }

  .ch-formula-math {
    font-family: 'Inter', monospace;
    font-size: 20px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }

  .ch-formula-desc {
    font-size: 14px;
    color: var(--muted);
  }

  /* TG BUTTON FIXED */
  .ch-tg-fixed {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 200;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.25);
    backdrop-filter: blur(10px);
    color: #fff;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    padding: 12px 18px;
    border-radius: 100px;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(34,197,94,0.15);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ch-tg-fixed:hover { 
    transform: translateY(-2px); 
    background: rgba(34,197,94,0.2);
    box-shadow: 0 8px 32px rgba(34,197,94,0.25); 
  }

  .ch-tg-fixed svg { flex-shrink: 0; }

  /* DIVIDER */
  .ch-divider {
    height: 1px;
    background: var(--border);
    max-width: 720px;
    margin: 0 auto 48px;
  }

  /* PLATFORM INFO */
  .ch-info-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ch-info-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.5;
  }

  .ch-info-icon {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .ch-info-row strong {
    display: block;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 2px;
    color: #fff;
  }

  .ch-info-row p {
    color: var(--muted);
    font-size: 13px;
  }
`}</style>

      {/* NAV */}
      <nav className="ch-nav">
        <div className="ch-logo">CONTENT HUNTER</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`ch-nav-btn ${activeNav === item.id ? "active" : ""}`}
            onClick={() => scrollTo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* HERO */}
      <div className="ch-hero">
        <div className="ch-hero-tag">
          <span>●</span> База знаний
        </div>
        <h1>
          Контент-ферма —<br />
          <span>система умного</span><br />
          распространения
        </h1>
        <p>
          Один ролик → 30 копий → сотни тысяч просмотров. Без рекламного бюджета,
          без найма SMM-команды, на полном автомате.
        </p>
        <div className="ch-hero-actions">
          <a href="https://vimeo.com/1181500890?fl=ip&fe=ec" target="_blank" rel="noopener noreferrer" className="btn-primary">
            ▶ Смотреть видео о платформе
          </a>
          <a href="https://t.me/cpm_hunter" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Поговорить с командой
          </a>
        </div>
      </div>

      {/* STATS */}
      <div className="ch-section">
        <div className="ch-grid ch-grid-2">
          <div className="ch-stat">
            <div className="ch-stat-num">30×</div>
            <div className="ch-stat-label">больше просмотров с одного ролика</div>
          </div>
          <div className="ch-stat">
            <div className="ch-stat-num">от 0,01₽</div>
            <div className="ch-stat-label">стоимость одного просмотра в кейсах</div>
          </div>
          <div className="ch-stat">
            <div className="ch-stat-num">10 дней</div>
            <div className="ch-stat-label">до первых публикаций после запуска</div>
          </div>
          <div className="ch-stat">
            <div className="ch-stat-num">100%</div>
            <div className="ch-stat-label">гарантия просмотров прописана в договоре</div>
          </div>
        </div>
      </div>

      <div className="ch-divider" />

      {/* HOW IT WORKS */}
      <div id="how" className="ch-section">
        <div className="ch-section-label">// как работает</div>
        <h2>Один ролик — тысячи просмотров</h2>

        <div className="ch-card" style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "15px", lineHeight: "1.7", color: "var(--muted)", marginBottom: "20px" }}>
            Обычный SMM — это один аккаунт, один ролик, 300–500 просмотров. Контент-ферма
            берёт тот же ролик и размножает его на 20–30–100 аккаунтов. Каждый аккаунт
            набирает просмотры независимо, и один ролик суммарно получает в 10–30 раз больше охвата.
          </p>
          <div className="ch-formula">
            <div className="ch-formula-math">3 000 ₽ ÷ (1 + 30 копий) = 97 ₽ / ролик</div>
            <div className="ch-formula-desc">Вы уже заплатили за ролик — копии создаются бесплатно</div>
          </div>
        </div>

        <div className="ch-info-list">
          <div className="ch-info-row">
            <div className="ch-info-icon">🎬</div>
            <div>
              <strong>Уникализация контента</strong>
              <p>Ролик загружается в систему — автоматически меняется цвет, скорость, музыка, рамка, логотип. Получается 30 разных версий, которые алгоритм воспринимает как уникальный контент.</p>
            </div>
          </div>
          <div className="ch-info-row">
            <div className="ch-info-icon">📱</div>
            <div>
              <strong>Реальные аккаунты, не боты</strong>
              <p>Каждый аккаунт — на отдельном телефоне с уникальным IP, зарегистрирован на официальную sim-карту. Алгоритмы видят живого пользователя.</p>
            </div>
          </div>
          <div className="ch-info-row">
            <div className="ch-info-icon">🔥</div>
            <div>
              <strong>Прогрев аккаунтов</strong>
              <p>7–10 дней новый аккаунт «ходит» по конкурентам и ЦА, имитирует поведение живого пользователя, чтобы платформы начали доверять и показывать контент в рекомендациях.</p>
            </div>
          </div>
          <div className="ch-info-row">
            <div className="ch-info-icon">📊</div>
            <div>
              <strong>Автоматическая аналитика</strong>
              <p>Каждый день система собирает просмотры по всем аккаунтам. Раз в неделю — отчёт с топами просмотров, динамикой и рекомендациями по контенту.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ch-divider" />

      {/* VIDEO */}
      <div className="ch-section">
        <div className="ch-section-label">// видео</div>
        <h2>Видео о платформе</h2>
        <div className="ch-video-wrap">
          <iframe
            src="https://player.vimeo.com/video/1181500890"
            allow="autoplay; fullscreen; picture-in-picture"
            title="Content Hunter Platform"
          />
        </div>
      </div>

      <div className="ch-divider" />

      {/* WHY */}
      <div id="why" className="ch-section">
        <div className="ch-section-label">// зачем это</div>
        <h2>Кому подходит</h2>

        <div className="ch-who-grid" style={{ marginBottom: "32px" }}>
          {WHO_FITS.map((w) => (
            <div key={w} className="ch-who-item">{w}</div>
          ))}
        </div>

        <div className="ch-section-label" style={{ marginBottom: "12px" }}>// не подходит, если</div>
        <div className="ch-card">
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Контента нет совсем — сначала нужно наладить производство",
              "Меньше 20–30 роликов в месяц — системе нечего масштабировать",
              "Очень узкая B2B ниша без понятной массовой аудитории",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--muted)" }}>
                <span style={{ color: "var(--accent2)", flexShrink: 0 }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ch-divider" />

      {/* PROCESS */}
      <div id="process" className="ch-section">
        <div className="ch-section-label">// процесс</div>
        <h2>Как мы работаем</h2>

        <div className="ch-card" style={{ marginBottom: "24px", background: "rgba(232,255,71,0.04)", borderColor: "rgba(232,255,71,0.2)" }}>
          <div className="ch-badge free">Первый этап — бесплатно</div>
          <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>
            Настройка всей инфраструктуры, создание и прогрев аккаунтов, оформление под бренд — всё это мы делаем бесплатно.
            Оплату берём только за публикации с гарантией просмотров.
          </p>
        </div>

        <div className="ch-steps">
          {[
            {
              num: "01",
              free: true,
              title: "Заполняете информацию о бизнесе",
              desc: "Рассказываете о продукте, целевой аудитории, нише и гео. Это нужно для правильной настройки аккаунтов.",
            },
            {
              num: "02",
              free: true,
              title: "Создаём и прогреваем аккаунты",
              desc: "10 дней — и сеть готова. Аккаунты прогреты, оформлены под бренд, платформы доверяют.",
            },
            {
              num: "03",
              free: true,
              title: "Получаете доступ к платформе",
              desc: "Вы входите в личный кабинет — видите все аккаунты, настройки, аналитику.",
            },
            {
              num: "04",
              free: false,
              title: "Загружаете ролики в любое время",
              desc: "Просто загружаете рилс. Система сама уникализирует, размножает на копии и выкладывает по расписанию.",
            },
            {
              num: "05",
              free: false,
              title: "Смотрите аналитику и отчёты",
              desc: "Еженедельно получаете отчёт: публикации, просмотры, топы, рекомендации. Всё прозрачно.",
            },
          ].map((step, i, arr) => (
            <div key={step.num} className="ch-step">
              <div className="ch-step-line">
                <div className={`ch-step-num ${step.free ? "free" : ""}`}>{step.num}</div>
                {i < arr.length - 1 && <div className="ch-step-connector" />}
              </div>
              <div className="ch-step-content">
                <div className={`ch-badge ${step.free ? "free" : "paid"}`}>
                  {step.free ? "Бесплатно" : "После оплаты"}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ch-divider" />

      {/* FAQ */}
      <div id="faq" className="ch-section">
        <div className="ch-section-label">// частые вопросы</div>
        <h2>FAQ</h2>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="ch-faq-item">
              <button
                className="ch-faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {item.q}
                <span className={`ch-faq-icon ${openFaq === i ? "open" : ""}`}>+</span>
              </button>
              <div className={`ch-faq-a ${openFaq === i ? "open" : ""}`}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ch-divider" />

      {/* DOCS */}
      <div id="docs" className="ch-section">
        <div className="ch-section-label">// документы и ссылки</div>
        <h2>Всё, что нужно</h2>

        <a href="https://contenthunter.ru/price_rub" target="_blank" rel="noopener noreferrer" className="ch-doc-link">
          <div>
            <div style={{ marginBottom: "3px" }}>Тарифы (₽)</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "400" }}>Пакеты публикаций для российского рынка</div>
          </div>
          <span>→</span>
        </a>

        <a href="https://contenthunter.ru/price_usd" target="_blank" rel="noopener noreferrer" className="ch-doc-link">
          <div>
            <div style={{ marginBottom: "3px" }}>Тарифы ($)</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "400" }}>Пакеты публикаций для международного рынка</div>
          </div>
          <span>→</span>
        </a>

        <a href="https://t.me/cpm_hunter" target="_blank" rel="noopener noreferrer" className="ch-doc-link">
          <div>
            <div style={{ marginBottom: "3px" }}>Калькулятор бюджета</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "400" }}>Считаем охваты и стоимость конкретно для вашей ниши</div>
          </div>
          <span>→</span>
        </a>

        <a href="https://contenthunter.ru/offer" target="_blank" rel="noopener noreferrer" className="ch-doc-link">
          <div>
            <div style={{ marginBottom: "3px" }}>Оферта</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "400" }}>Условия сотрудничества, гарантии, оплата</div>
          </div>
          <span>→</span>
        </a>

        <a href="https://t.me/cpm_hunter" target="_blank" rel="noopener noreferrer" className="ch-doc-link" style={{ borderColor: "rgba(42,171,238,0.3)" }}>
          <div>
            <div style={{ marginBottom: "3px" }}>Поддержка в Telegram</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "400" }}>Ответим на любые вопросы перед стартом</div>
          </div>
          <span>→</span>
        </a>

        <div style={{ height: "80px" }} />
      </div>

      {/* FIXED TG BUTTON */}
      <a href="https://t.me/cpm_hunter" target="_blank" rel="noopener noreferrer" className="ch-tg-fixed">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.68l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.958.879z"/>
        </svg>
        Поддержка
      </a>
    </div>
  );
}
