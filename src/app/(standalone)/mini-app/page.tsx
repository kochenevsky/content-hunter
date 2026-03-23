"use client";

import { useState, useEffect } from "react";

// ─── Данные ────────────────────────────────────────────────────────────────────

const NICHES = [
  { id: "beauty",    label: "Бьюти / косметика" },
  { id: "food",      label: "Еда / рестораны" },
  { id: "fitness",   label: "Фитнес / здоровье" },
  { id: "realty",    label: "Недвижимость" },
  { id: "education", label: "Онлайн-образование" },
  { id: "retail",    label: "Интернет-магазин / WB" },
  { id: "services",  label: "Услуги / B2B" },
  { id: "personal",  label: "Личный бренд / эксперт" },
  { id: "saas",      label: "SaaS / приложения" },
  { id: "other",     label: "Другое" },
];

const AVG_CHECKS = [
  { id: "micro", label: "до 1 000 ₽" },
  { id: "low",   label: "1 000 – 5 000 ₽" },
  { id: "mid",   label: "5 000 – 15 000 ₽" },
  { id: "high",  label: "15 000 – 50 000 ₽" },
  { id: "top",   label: "50 000 – 200 000 ₽" },
  { id: "ultra", label: "от 200 000 ₽" },
];

const PLANS = [
  { id: "test",  name: "Быстрый тест",  pubs: 200,  phones: 1, accounts: 10, rent: 25000, warmup: 10, views: 60000,  pricePerPub: 125 },
  { id: "mini",  name: "Мини блог",     pubs: 400,  phones: 2, accounts: 20, rent: 46000, warmup: 10, views: 120000, pricePerPub: 115 },
  { id: "biz",   name: "Бизнес",        pubs: 600,  phones: 3, accounts: 30, rent: 60000, warmup: 10, views: 180000, pricePerPub: 100 },
  { id: "prime", name: "Оптимус прайм", pubs: 1000, phones: 5, accounts: 50, rent: 90000, warmup: 10, views: 300000, pricePerPub: 90  },
];

const CASES: Record<string, { before: string; after: string; result: string }> = {
  beauty: {
    before: "Бьюти-студия из Казани публиковала 4 рилса в месяц — в среднем 300 просмотров на ролик, 2–3 новых клиента из соцсетей.",
    after:  "Подключили контент-ферму на 20 аккаунтов. Те же ролики — в 30 уникальных копиях в Reels, Shorts и TikTok. Каждый месяц — новая порция публикаций.",
    result: "Каждый месяц: 1 800 000+ просмотров, стабильно +40–50 новых клиентов из соцсетей. Стоимость 1 просмотра — 0,03 ₽. Ферма работает на подписке — результат накапливается.",
  },
  food: {
    before: "Кафе-пекарня в Москве снимала 5–6 роликов в месяц, набирала 200–500 просмотров каждый. Через соцсети приходило 5–7 гостей в месяц.",
    after:  "Подключили ферму: те же ролики, но каждый размножался в 30 копий на 30 аккаунтов. Каждый месяц — свежий пакет публикаций.",
    result: "Ежемесячно: 2 000 000+ просмотров, 50–70 новых броней через соцсети. Окупили ферму в первую неделю — и продолжают каждый месяц.",
  },
  fitness: {
    before: "Онлайн-тренер публиковал 8 роликов в неделю. Охват — 500–700 просмотров, 3–5 новых подписчиков в месяц.",
    after:  "Контент-ферма на 20 аккаунтов: 1 ролик → 20 уникальных публикаций. Подписка — каждый месяц новый пакет роликов уходит в сетку.",
    result: "Каждый месяц: 800 000–1 000 000 просмотров, +200–250 новых подписчиков в блоге, 15–20 продаж курса. Охваты растут с каждым месяцем.",
  },
  realty: {
    before: "Агентство недвижимости снимало 3–4 объекта в неделю, каждый ролик набирал 400–600 просмотров. Заявки из соцсетей — 3–5 в месяц.",
    after:  "Подключили ферму: видео-обзоры объектов выкладываются в 25 аккаунтов с живым прогревом. Ежемесячно — новые объекты, новые публикации.",
    result: "Каждый месяц: 1 000 000+ просмотров, 25–35 входящих запросов через директ. За 3 месяца подписки закрыли 11 сделок — воронка работает постоянно.",
  },
  education: {
    before: "Онлайн-школа по английскому публиковала обучающие рилсы. 600–900 просмотров на ролик, 10–15 заявок в месяц из соцсетей.",
    after:  "Те же ролики — на 30 аккаунтов ежемесячно. Алгоритмы показывают каждый ролик как новый. Архив накапливается — старые ролики продолжают набирать просмотры.",
    result: "Каждый месяц: 4 000 000+ просмотров, 300–400 заявок на пробный урок. Стоимость заявки — 135 ₽. Чем дольше подписка — тем больше архив и тем выше результат.",
  },
  retail: {
    before: "Магазин на Wildberries снимал 10 роликов в месяц про сумки. Переходов с TikTok на карточку — 50–100 в месяц.",
    after:  "Каждый ролик в 30 вариантах ежемесячно выходит в Reels, Shorts и TikTok. База аккаунтов прогрета — органика растёт месяц к месяцу.",
    result: "Каждый месяц: 3 000 000+ просмотров, выручка с органики стабильно +300 000–400 000 ₽. За полгода подписки трафик вырос в 8 раз.",
  },
  services: {
    before: "B2B-компания по автоматизации бизнеса пробовала контент. 1–2 ролика в неделю, охват — до 1 000, 2–3 входящих запроса в месяц.",
    after:  "Экспертный контент × 25 аккаунтов в нише предпринимателей. Каждый месяц — новый пакет роликов, аудитория прогревается постепенно.",
    result: "Каждый месяц: 700 000–900 000 просмотров, 20–25 входящих запросов от собственников. Средний чек сделки — 180 000 ₽. Подписка окупается с одной сделки.",
  },
  personal: {
    before: "Эксперт-нутрициолог публиковала контент 3 раза в неделю. Охват — 300–500, 5–8 новых подписчиков в месяц.",
    after:  "Личный бренд × контент-ферма: 1 ролик → 20 копий на 20 аккаунтов ежемесячно. Аудитория прогревается и возвращается на основной.",
    result: "Каждый месяц: 1 000 000+ просмотров, +800–1 000 подписчиков на основной, 20–30 продаж консультаций. За год подписки база выросла в 12 раз.",
  },
  saas: {
    before: "Приложение для знакомств публиковало 1–2 ролика в неделю, охват — 400–800. Из соцсетей приходило 30–50 регистраций в месяц.",
    after:  "Обзоры и кейсы пользователей × 20 аккаунтов ежемесячно. Каждый месяц — новые ролики, аудитория 20–35 лет прогревается и регистрируется.",
    result: "Каждый месяц: 1 500 000+ просмотров, 500–600 новых регистраций, 35–45 переходов на подписку. CAC снизился в 6 раз и продолжает падать.",
  },
  other: {
    before: "Магазин косметики публиковал 5–6 роликов в месяц, набирал 300–500 просмотров. Из соцсетей приходило 10–15 заказов в месяц.",
    after:  "Каждый рекламный ролик ежемесячно размножается в 30 уникальных копий на 30 аккаунтов. Архив растёт — старые ролики продолжают приносить трафик.",
    result: "Каждый месяц: 2 000 000+ просмотров, выручка с органики стабильно +250 000–300 000 ₽. Чем дольше подписка — тем больше накопленный охват.",
  },
};

// Текстовые карточки-фоллбэк пока не подключён /api/pdf-slides
const SLIDE_CARDS = [
  { tag: "01", title: "Контент-маркетинг — топ-1 канал 2026",    body: "Спрос на контент-фермы вырос в 10× за 2025 год. Органический охват без рекламного бюджета — единственный устойчивый канал.",                   accent: "×10 рост",  icon: "📈" },
  { tag: "02", title: "Аккаунты = Филиалы вашего бренда",         body: "Как Магнит или Детский мир: основной аккаунт — главный офис, а сеть аккаунтов работает по его стандартам и публикует контент автоматически.",    accent: "Сеть",      icon: "🏪" },
  { tag: "03", title: "Из 1 ролика — 30 уникальных копий",         body: "Программа меняет цвет, скорость, музыку, рамку, логотип — и создаёт 30 уникальных версий для 30 аккаунтов.",                                    accent: "1 → 30",    icon: "🎬" },
  { tag: "04", title: "Почему нельзя залить одно видео на все?",   body: "Алгоритм распознаёт дубли и обнуляет охват. Соцсетям нужны только новые уникальные ролики — поэтому уникализация обязательна.",                 accent: "Алгоритм",  icon: "🔍" },
  { tag: "05", title: "97 ₽ вместо 3 000 ₽ за публикацию",        body: "Платите 3 000 ₽ за ролик. Получаете 30 копий бесплатно. 3 000 ÷ 31 = 97 рублей за одну публикацию.",                                            accent: "97 ₽",      icon: "💡" },
  { tag: "06", title: "Прогрев: 10 дней до первых охватов",        body: "10 дней программа имитирует поведение живого пользователя, чтобы соцсети начали показывать аккаунт в рекомендациях.",                            accent: "10 дней",   icon: "🔥" },
  { tag: "07", title: "Аналитика: еженедельные отчёты",            body: "Система автоматически собирает просмотры каждый день. Раз в неделю — полный отчёт: топы, динамика, рекомендации.",                               accent: "Авто",      icon: "📊" },
  { tag: "08", title: "Ферма за 20 млн → аренда от 25 000 ₽",     body: "Построить самостоятельно — ~20 000 000 ₽. Аренда в Content Hunter — от 25 000 ₽ в месяц. Первичные вложения — 0 ₽.",                            accent: "0 ₽ старт", icon: "🏆" },
];

function fmt(n: number) { return n.toLocaleString("ru-RU"); }

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 42px 13px 16px",
  borderRadius: 12,
  border: "2px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e2e8f0",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234ade80' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

// ─── Главный компонент ─────────────────────────────────────────────────────────

export default function MiniAppPage() {
  const [niche,      setNiche]      = useState("");
  const [avgCheck,   setAvgCheck]   = useState("");
  const [planId,     setPlanId]     = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const plan      = PLANS.find((p) => p.id === planId) ?? null;
  const nicheCase = niche ? CASES[niche] : null;
  const canCalc   = niche && avgCheck && planId;
  const SLIDE_URLS = Array.from({ length: 27 }, (_, i) =>
  `/slides/Content%20Hunter%20%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F_page-${String(i + 1).padStart(4, "0")}.jpg`
);
  return (
    <main style={{
      background: "#0b1220",
      minHeight: "100vh",
      fontFamily: "-apple-system,'SF Pro Display','Inter',system-ui,sans-serif",
      color: "#f1f5f9",
      maxWidth: 480,
      margin: "0 auto",
      overflowX: "hidden",
      paddingBottom: 100,
    }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        button{outline:none;-webkit-tap-highlight-color:transparent}
        a{-webkit-tap-highlight-color:transparent}
        select option{background:#1e293b;color:#f1f5f9}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
        .result-in{animation:fadeUp 0.35s ease forwards}
        .cta-pulse{animation:pulse 2.5s ease infinite}
      `}</style>

      {/* HERO */}
      <section style={{ padding: "36px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 260, height: 260,
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
        <h1 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 12 }}>
          УЗНАЙТЕ СТОИМОСТЬ<br />
          <span style={{ color: "#4ade80" }}>КОНТЕНТ-ФЕРМЫ</span><br />
          ДЛЯ ВАШЕГО БИЗНЕСА
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
          Система автоматического и массового распространения контента в соцсетях.
        </p>
      </section>

      {/* КАЛЬКУЛЯТОР */}
      <section style={{ padding: "0 20px 24px" }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: "22px 18px",
        }}>
          {/* 1 — Ниша */}
          <FieldLabel step="1" label="Ниша" />
          <select
            value={niche}
            onChange={(e) => { setNiche(e.target.value); setShowResult(false); }}
            style={{ ...selectStyle, marginBottom: 20, borderColor: niche ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)", color: niche ? "#e2e8f0" : "#475569" }}
          >
            <option value="" disabled>Выберите нишу...</option>
            {NICHES.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>

          {/* 2 — Средний чек */}
          <FieldLabel step="2" label="Средний чек" />
          <select
            value={avgCheck}
            onChange={(e) => { setAvgCheck(e.target.value); setShowResult(false); }}
            style={{ ...selectStyle, marginBottom: 20, borderColor: avgCheck ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)", color: avgCheck ? "#e2e8f0" : "#475569" }}
          >
            <option value="" disabled>Выберите средний чек...</option>
            {AVG_CHECKS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          {/* 3 — Пакет */}
          <FieldLabel step="3" label="Пакет публикаций" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPlanId(p.id); setShowResult(false); }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 14px", borderRadius: 12,
                  border: planId === p.id ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.08)",
                  background: planId === p.id ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: planId === p.id ? "#4ade80" : "#e2e8f0" }}>
                    {p.pubs} публикаций / мес
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{p.name}</div>
                </div>
                {/* radio dot */}
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  border: planId === p.id ? "none" : "2px solid rgba(255,255,255,0.15)",
                  background: planId === p.id ? "#22c55e" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {planId === p.id && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <polyline points="1.5,5.5 4,8 8.5,2" stroke="#052e16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => { if (canCalc) setShowResult(true); }}
            disabled={!canCalc}
            style={{
              width: "100%", padding: "16px", borderRadius: 14, border: "none",
              background: canCalc ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(255,255,255,0.06)",
              color: canCalc ? "#fff" : "#334155",
              fontSize: 16, fontWeight: 800, cursor: canCalc ? "pointer" : "not-allowed",
              letterSpacing: "-0.01em", transition: "all 0.2s",
            }}
          >
            {canCalc ? "Сделать расчёт →" : "Заполните все поля"}
          </button>
        </div>

        {/* РЕЗУЛЬТАТ */}
        {showResult && plan && nicheCase && (
          <div className="result-in" style={{ marginTop: 16 }}>
            {/* Метрики */}
            <div style={{
              background: "linear-gradient(135deg,rgba(34,197,94,0.1),rgba(22,163,74,0.05))",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 20, padding: "18px 18px 16px", marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  fontSize: 10, fontWeight: 800, color: "#052e16",
                  background: "#22c55e", borderRadius: 6, padding: "4px 10px",
                  display: "inline-block", letterSpacing: "0.05em", textTransform: "uppercase",
                  alignSelf: "flex-start",
                }}>
                  {plan.name}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 2 }}>Стоимость пакета</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {fmt(plan.rent)} ₽
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>в месяц</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Телефонов",         value: String(plan.phones)     },
                  { label: "Аккаунтов",          value: String(plan.accounts)   },
                  { label: "Публикаций",         value: fmt(plan.pubs)          },
                  { label: "Гарантия просмотров",         value: fmt(plan.views)         },
                  { label: "Цена публикации",    value: `${plan.pricePerPub} ₽` },
                  { label: "Цена оборудования",  value: "0 ₽"                  },
                ].map((m) => (
                  <div key={m.label} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 5, lineHeight: 1.3 }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#4ade80", lineHeight: 1 }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Кейс */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: 16, marginBottom: 12,
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
                📌 Кейс из вашей ниши
              </div>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65, marginBottom: 8 }}>
                <span style={{ color: "#475569", fontWeight: 700 }}>До: </span>{nicheCase.before}
              </p>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65, marginBottom: 10 }}>
                <span style={{ color: "#475569", fontWeight: 700 }}>Что сделали: </span>{nicheCase.after}
              </p>
              <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 10, padding: "10px 12px" }}>
                <span style={{ fontSize: 13, color: "#4ade80", fontWeight: 700, lineHeight: 1.6 }}>🏆 {nicheCase.result}</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://t.me/m/bqsD11vFZjVi"
              target="_blank" rel="noopener noreferrer"
              className="cta-pulse"
              style={{
                display: "block", padding: 17, borderRadius: 14,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#fff", fontSize: 16, fontWeight: 800,
                textAlign: "center", textDecoration: "none", letterSpacing: "-0.01em",
              }}
            >
              Получить консультацию →
            </a>
            <p style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 8 }}>
              Ответим на вопросы и поможем с запуском
            </p>
          </div>
        )}
      </section>

      {/* ЭКСКУРСИЯ */}
      <section style={{ padding: "0 20px 40px" }}>
  <SectionTitle label="Экскурсия по контент-ферме" />
  <p style={{ fontSize: 11, color: "#334155", marginBottom: 12, textAlign: "center" }}>
    Посмотрите как это работает
  </p>
  {SLIDE_URLS.map((url, i) => (
    <img
      key={i}
      src={url}
      alt={`Слайд ${i + 1}`}
      loading="lazy"
      style={{ display: "block", width: "100%", borderRadius: 12, marginBottom: 10 }}
    />
  ))}
</section>

      {/* STICKY CTA */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        padding: "10px 20px 24px",
        background: "linear-gradient(to top,#0b1220 55%,transparent)",
        zIndex: 100,
      }}>
        <a
          href="https://t.me/m/bqsD11vFZjVi"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "block", padding: 15, borderRadius: 14,
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "#fff", fontSize: 15, fontWeight: 800,
            textAlign: "center", textDecoration: "none",
            boxShadow: "0 6px 28px rgba(34,197,94,0.35)", letterSpacing: "-0.01em",
          }}
        >
          Получить консультацию →
        </a>
      </div>
    </main>
  );
}

// ─── Sub-компоненты ────────────────────────────────────────────────────────────

function FieldLabel({ step, label }: { step: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, color: "#4ade80", flexShrink: 0,
      }}>
        {step}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 3, height: 18, background: "#22c55e", borderRadius: 2 }} />
      <span style={{ fontSize: 12, fontWeight: 800, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}
