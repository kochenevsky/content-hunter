'use client';

import { useState, useEffect, useRef } from 'react';

const QUESTIONS = [
  {
    id: 'niche',
    text: 'Какая у вас ниша?',
    options: [
      { label: 'Онлайн-образование / курсы', insight: '<strong>Отличная ниша.</strong> Онлайн-школы — одни из лучших результатов контент-фермы. Контент об обучении активно набирает органику в TikTok и Reels.' },
      { label: 'Эксперт / личный бренд', insight: '<strong>Идеально.</strong> Экспертный контент отлично масштабируется. Один сильный ролик в 100 аккаунтах — это 100 шансов попасть в рекомендации.' },
      { label: 'SaaS / IT-продукт', insight: '<strong>Хорошая ниша.</strong> SaaS с образовательным контентом показывает сильный рост. Главное — понятная аудитория.' },
      { label: 'Другое', insight: '<strong>Хорошо.</strong> Расскажете подробнее на следующем шаге — оценим потенциал индивидуально.' },
    ],
  },
  {
    id: 'reels_count',
    text: 'Сколько роликов вы снимаете в месяц?',
    options: [
      { label: '1–5 роликов', insight: '<strong>Можно запускать.</strong> Даже 5 роликов через ферму дают до 150 000 просмотров. Больше роликов — больше охват, но старт возможен уже сейчас.' },
      { label: '6–20 роликов', insight: '<strong>Хорошая база.</strong> С 10 роликами в месяц ферма обеспечит до 300 000 просмотров. Это уже стабильный поток внимания.' },
      { label: '20–50 роликов', insight: '<strong>Сильная позиция.</strong> 30 роликов × 100 аккаунтов = 3 000 публикаций в месяц. При средних просмотрах это 1–3 млн охвата.' },
      { label: 'Почти не снимаю', insight: '<strong>Сначала — контент.</strong> Ферма умножает то, что есть. Если роликов мало — начнём с рекомендаций по производству контента.' },
    ],
  },
  {
    id: 'current_views',
    text: 'Сколько просмотров в среднем набирает ваш ролик?',
    options: [
      { label: 'До 1 000', insight: '<strong>Алгоритмы режут охваты.</strong> Это не провал контента — это один аккаунт против системы. Ферма даёт десятки входов в рекомендации одновременно.' },
      { label: '1 000 – 10 000', insight: '<strong>Хороший старт.</strong> Ролики уже работают. С фермой этот результат умножается на количество аккаунтов — без изменений в контенте.' },
      { label: '10 000 – 100 000', insight: '<strong>Отличный контент.</strong> У вас уже есть доказательство, что ролики цепляют. Ферма превратит разовые успехи в стабильный поток.' },
      { label: 'Не знаю / не слежу', insight: '<strong>Разберёмся вместе.</strong> После запуска у вас будет полная аналитика по каждому ролику и аккаунту.' },
    ],
  },
  {
    id: 'clients_from_smm',
    text: 'Приходят ли клиенты с вашего контента сейчас?',
    options: [
      { label: 'Да, регулярно', insight: '<strong>Масштабируем то, что работает.</strong> Если контент уже конвертирует — увеличение охвата в 30 раз напрямую умножает поток заявок.' },
      { label: 'Редко, хотелось бы больше', insight: '<strong>Проблема в дистрибуции.</strong> Хороший контент с маленьким охватом = невидимый бизнес. Ферма решает именно это.' },
      { label: 'Нет, контент не конвертирует', insight: '<strong>Разберёмся.</strong> Иногда нужна небольшая корректировка воронки. Покажем на разборе — что изменить, чтобы просмотры давали заявки.' },
      { label: 'Контент только начал', insight: '<strong>Правильное время.</strong> Запускать ферму параллельно со стартом контента — самая выигрышная стратегия.' },
    ],
  },
  {
    id: 'geo',
    text: 'В каком регионе ваша аудитория?',
    options: [
      { label: 'Россия / СНГ', insight: '<strong>Большой рынок.</strong> Русскоязычная аудитория активна во всех платформах. Настроим аккаунты под ваш регион.' },
      { label: 'Дубай / ОАЭ', insight: '<strong>Дорогое гео.</strong> В Дубае внимание стоит дорого, органика — на вес золота. Ферма здесь окупается особенно быстро.' },
      { label: 'Таиланд / Бали / Азия', insight: '<strong>Экспат-рынок.</strong> Русскоязычная аудитория в Азии очень активна в соцсетях. Это одна из лучших ниш для фермы.' },
      { label: 'Европа / другое', insight: '<strong>Настроим под ваш рынок.</strong> Есть опыт работы с разными гео. Обсудим на разборе — подберём нужный подход.' },
    ],
  },
  {
    id: 'goal',
    text: 'Что важнее для вас прямо сейчас?',
    options: [
      { label: 'Больше просмотров и охватов', insight: '<strong>Ферма — именно для этого.</strong> Гарантия просмотров прописана в договоре. Минимум 60 000 просмотров в месяц на старте.' },
      { label: 'Больше заявок и клиентов', insight: '<strong>Заявки — через охваты.</strong> Ферма создаёт массовый поток внимания, который конвертируется в лиды. Покажем на примере вашей воронки.' },
      { label: 'Масштаб без роста бюджета', insight: '<strong>В точку.</strong> Ферма умножает эффект от контента без роста затрат на производство. Это и есть её главная ценность.' },
      { label: 'Хочу разобраться как это работает', insight: '<strong>Хороший подход.</strong> Покажем изнутри: инфраструктуру, механику уникализации и реальные кейсы — на бесплатном разборе.' },
    ],
  },
];

type QuizStep = 'quiz' | 'loading' | 'contact' | 'success';

export default function FarmPageClient() {
  const [step, setStep] = useState<QuizStep>('quiz');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [visibleInsight, setVisibleInsight] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const lastScrollY = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const LOADING_STEPS = [
    'Анализируем вашу нишу',
    'Считаем потенциал охватов',
    'Подбираем тариф',
    'Формируем персональный расчёт',
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    params.forEach((v, k) => { utm[k] = v; });
    setUtmParams(utm);
  }, []);

useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    const hasStartedQuiz = Object.keys(answers).length > 0;
    const isAtContactOrLoading = step === 'contact' || step === 'loading';
    const isNotSuccess = step !== 'success';
    if (isNotSuccess && (hasStartedQuiz || isAtContactOrLoading)) {
      e.preventDefault();
      e.returnValue = 'Анкета не сохранена. Уверены, что хотите покинуть страницу?';
      return e.returnValue;
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [answers, step]);

  const getBotLink = () => {
    const url = new URL('https://sbsite.pro/ru_site_ch_1');
    Object.entries(utmParams).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  };

  const selectOption = (idx: number) => {
    if (isAnswering) return; // prevent double-tap
    setIsAnswering(true);
    setSelectedIdx(idx);

    const q = QUESTIONS[currentQ];
    const opt = q.options[idx];
    const newAnswers = { ...answers, [q.id]: opt.label };
    setAnswers(newAnswers);

    // Show insight immediately, then advance after short delay
    setVisibleInsight(opt.insight);

    setTimeout(() => {
      const next = currentQ + 1;
      if (next < QUESTIONS.length) {
        setCurrentQ(next);
        setSelectedIdx(null);
        setIsAnswering(false);
        if (cardRef.current) {
          cardRef.current.classList.remove('q-animate');
          void cardRef.current.offsetWidth;
          cardRef.current.classList.add('q-animate');
        }
      } else {
        setStep('loading');
        startLoading();
      }
    }, 500); // reduced from 1100ms to 500ms
  };

  const startLoading = () => {
    let progress = 0;
    let lStep = 0;
    const iv = setInterval(() => {
      progress += 2;
      setLoadingProgress(progress);
      if (progress >= 25 && lStep === 0) { setLoadingStep(1); lStep = 1; }
      if (progress >= 50 && lStep === 1) { setLoadingStep(2); lStep = 2; }
      if (progress >= 75 && lStep === 2) { setLoadingStep(3); lStep = 3; }
      if (progress >= 90 && lStep === 3) { setLoadingStep(4); lStep = 4; }
      if (progress >= 100) {
        clearInterval(iv);
        setTimeout(() => setStep('contact'), 400);
      }
    }, 60);
  };

  const progressPct = Math.round((currentQ / QUESTIONS.length) * 100);
  const q = QUESTIONS[currentQ];

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

        .quiz-root {
          background: #080e1a;
          min-height: 100vh;
          font-family: -apple-system, 'SF Pro Display', 'Inter', system-ui, sans-serif;
          color: #f1f5f9;
          overflow-x: hidden;
          -webkit-text-size-adjust: 100%;
        }

        .quiz-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 20px 60px;
          width: 100%;
          padding-top: 20px;
        }

        /* HEADER */
        .quiz-header {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-left { display: flex; align-items: center; gap: 8px; }
        .logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
        .logo-name {
          font-size: 11px; font-weight: 700;
          letter-spacing: .1em; color: #94a3b8;
          text-transform: uppercase;
        }
        .header-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 11px; font-weight: 600;
          color: #22c55e; text-transform: uppercase;
          letter-spacing: .06em; white-space: nowrap;
        }

        /* HERO */
        .quiz-hero {
          max-width: 600px; margin: 0 auto;
          padding: 32px 20px 20px;
        }
        .quiz-hero h1 {
          font-size: clamp(22px, 5.5vw, 36px);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -.02em; color: #fff;
          margin-bottom: 14px;
        }
        .quiz-hero h1 span { color: #22c55e; }
        .quiz-hero-sub {
          font-size: 15px; color: #94a3b8;
          line-height: 1.65; margin-bottom: 24px;
        }
        .quiz-hero-arrow { text-align: center; color: #64748b; font-size: 13px; margin-bottom: 4px; }

        /* PROGRESS — only shown during quiz */
        .progress-label {
          font-size: 12px; color: #64748b;
          margin-bottom: 10px;
          display: flex; justify-content: space-between;
        }
        .progress-bar {
          height: 3px; background: rgba(255,255,255,0.08);
          border-radius: 2px; margin-bottom: 24px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: #22c55e;
          border-radius: 2px; transition: width .4s ease;
        }

        /* INSIGHT */
        .insight-box {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 14px; padding: 16px 18px;
          margin-bottom: 16px;
          animation: fadeUp .3s ease;
        }
        .insight-label {
          font-size: 10px; font-weight: 700; color: #22c55e;
          text-transform: uppercase; letter-spacing: .07em; margin-bottom: 6px;
        }
        .insight-text { font-size: 14px; color: #94a3b8; line-height: 1.55; }
        .insight-text strong { color: #fff; }

        /* QUESTION CARD */
        .q-card {
          background: #0f1828;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 28px 24px;
        }
        .q-card.q-animate { animation: fadeUp .3s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .q-number {
          font-size: 11px; font-weight: 600; color: #22c55e;
          text-transform: uppercase; letter-spacing: .07em; margin-bottom: 12px;
        }
        .q-text {
          font-size: clamp(15px, 3.5vw, 19px);
          font-weight: 700; color: #fff; line-height: 1.25; margin-bottom: 22px;
        }
        .options { display: flex; flex-direction: column; gap: 10px; }
        .opt {
          background: #162035;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 18px;
          cursor: pointer; font-size: 15px; color: #94a3b8;
          transition: all .15s ease; text-align: left;
          font-family: inherit; display: flex; align-items: center; gap: 12px;
          width: 100%;
        }
        .opt:hover:not(:disabled) {
          border-color: rgba(34,197,94,0.35); color: #fff;
          background: rgba(34,197,94,0.06);
        }
        .opt.selected {
          border-color: #22c55e;
          background: rgba(34,197,94,0.12); color: #fff;
        }
        .opt:disabled { cursor: default; }
        /* Radio circle — no text inside, purely visual */
        .opt-icon {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
          transition: all .15s;
          position: relative;
        }
        .opt.selected .opt-icon {
          background: #22c55e; border-color: #22c55e;
        }
        .opt.selected .opt-icon::after {
          content: '';
          position: absolute;
          top: 3px; left: 6px;
          width: 4px; height: 7px;
          border: 2px solid #fff;
          border-top: none; border-left: none;
          transform: rotate(45deg);
        }

        /* LOADING */
        .loading-wrap { text-align: center; padding: 48px 0; animation: fadeUp .3s ease; }
        .loading-title { font-size: 18px; font-weight: 900; color: #fff; margin-bottom: 8px; }
        .loading-sub { font-size: 14px; color: #64748b; margin-bottom: 32px; }
        .loading-bar-wrap {
          height: 4px; background: rgba(255,255,255,0.08);
          border-radius: 2px; overflow: hidden; margin-bottom: 24px;
        }
        .loading-bar {
          height: 100%; background: #22c55e;
          border-radius: 2px; transition: width .1s linear;
        }
        .loading-steps { display: flex; flex-direction: column; gap: 10px; text-align: left; }
        .ls { font-size: 13px; color: #64748b; display: flex; align-items: center; gap: 10px; opacity: .4; transition: opacity .3s; }
        .ls.active { opacity: 1; color: #94a3b8; }
        .ls.done { opacity: .55; }
        .ls::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #64748b; flex-shrink: 0; }
        .ls.active::before { background: #22c55e; }
        .ls.done::before { background: #22c55e; opacity: .5; }

        /* CONTACT FORM */
        .contact-card {
          background: #0f1828;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 28px 24px;
          animation: fadeUp .3s ease;
           margin-top: 20px;
        }
        .contact-title {
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 8px;
        }
        .contact-title span { color: #22c55e; }
        .contact-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; line-height: 1.55; }
        .form-group { margin-bottom: 14px; }
        .form-label {
          font-size: 12px; font-weight: 600; color: #94a3b8;
          margin-bottom: 6px; display: block;
          text-transform: uppercase; letter-spacing: .04em;
        }
        .form-required { color: #ef4444; }
        .form-input {
          width: 100%; background: #162035;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px 16px;
          font-size: 15px; color: #fff; font-family: inherit;
          outline: none; transition: border-color .15s;
        }
        .form-input:focus { border-color: rgba(34,197,94,0.4); }
        .form-input::placeholder { color: #64748b; }
        .form-input.has-error { border-color: #ef4444; }
        .form-error { color: #ef4444; font-size: 13px; margin-top: 5px; }
        .form-hint { color: #64748b; font-size: 12px; margin-top: 5px; }
        /* Username prefix — fix white icon, keep it muted */
        .input-prefix-wrap { position: relative; display: flex; align-items: center; }
        .input-prefix {
          position: absolute; left: 16px; color: #64748b;
          font-size: 16px; pointer-events: none; z-index: 1;
          transition: color .15s;
        }
        .input-prefix-wrap:focus-within .input-prefix { color: #94a3b8; }
        .form-input.prefixed { padding-left: 30px; }
        .submit-btn {
          width: 100%; padding: 17px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: inherit; letter-spacing: .02em;
          border: none; border-radius: 14px; cursor: pointer;
          margin-top: 18px; box-shadow: 0 8px 24px rgba(34,197,94,0.25);
          transition: opacity .15s; display: flex; align-items: center;
          justify-content: center; gap: 8px;
        }
        .submit-btn:hover { opacity: .9; }
        .submit-btn:disabled { opacity: .5; cursor: not-allowed; }
        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; animation: spin 1s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .form-agreement { font-size: 11px; color: #64748b; text-align: center; margin-top: 10px; line-height: 1.5; }

        /* TG SECTION inside form */
        .tg-divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 24px 0; }
        .tg-section-label {
          font-size: 11px; font-weight: 700; color: #64748b;
          text-transform: uppercase; letter-spacing: .07em; margin-bottom: 12px;
        }
        .tg-section-text { font-size: 14px; color: #94a3b8; line-height: 1.55; margin-bottom: 16px; }
        /* Fixed TG button — was overflowing on mobile */
        .tg-open-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px 16px;
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 14px; background: rgba(34,197,94,0.12);
          color: #22c55e; font-family: inherit; font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none; transition: all .15s;
          word-break: break-word; text-align: center;
        }
        .tg-open-btn:hover { background: rgba(34,197,94,0.18); border-color: #22c55e; }

        /* SUCCESS — full-page replacement, hides header/hero */
        .success-page {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px;
          animation: fadeUp .4s ease;
          text-align: center;
        }
        .success-icon { font-size: 52px; margin-bottom: 20px; }
        .success-title { font-size: clamp(22px, 5vw, 32px); font-weight: 900; color: #fff; margin-bottom: 12px; }
        .success-sub { font-size: 15px; color: #94a3b8; margin-bottom: 32px; line-height: 1.6; max-width: 420px; }
        .success-tg-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 28px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff; border-radius: 14px; text-decoration: none;
          font-size: 15px; font-weight: 700;
          box-shadow: 0 8px 24px rgba(34,197,94,0.25);
        }
        /* TG ICON */
        .tg-icon {
          width: 22px; height: 22px; background: #2AABEE;
          border-radius: 50%; display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .tg-icon svg { fill: #fff; width: 12px; height: 12px; }
      `}</style>

      <div className="quiz-root">
        {/* SUCCESS replaces entire page */}
        {step === 'success' ? (
          <div className="success-page">
            <div className="success-icon">✅</div>
            <div className="success-title">Заявка отправлена!</div>
            <p className="success-sub">
              Менеджер свяжется с вами в течение часа.<br />
              А пока — переходите в бот: там экскурсия на ферму и расчёт охватов.
            </p>
            <a href={getBotLink()} target="_blank" rel="noopener noreferrer" className="success-tg-btn">
              <TgIcon /> Перейти в Telegram бот
            </a>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="quiz-header">
              <div className="header-left">
                <div className="logo-dot" />
                <span className="logo-name">Content Hunter</span>
              </div>
              <div className="header-badge">⚡ Бесплатный анализ</div>
            </div>

            {/* HERO — hide on contact step to reduce clutter */}
            {step === 'quiz' && (
              <div className="quiz-hero">
                <h1>
                  Узнайте, сколько просмотров теряет ваш контент{' '}
                  <span>прямо сейчас</span>
                </h1>
                <p className="quiz-hero-sub">
                  Ответьте на 6 вопросов — получите персональный расчёт охвата с контент-фермой в вашей нише.
                </p>
                <div className="quiz-hero-arrow">↓ Пройдите тест за 2 минуты</div>
              </div>
            )}

            <div className="quiz-container">
              {/* Progress bar — only during quiz, not on loading/contact */}
              {step === 'quiz' && (
                <>
                  <div className="progress-label">
                    <span>Вопрос {currentQ + 1} из {QUESTIONS.length}</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                </>
              )}

              {/* Insight — only during quiz */}
              {visibleInsight && step === 'quiz' && (
                <div className="insight-box">
                  <div className="insight-label">💡 Для вас</div>
                  <div className="insight-text" dangerouslySetInnerHTML={{ __html: visibleInsight }} />
                </div>
              )}

              {/* QUIZ */}
              {step === 'quiz' && (
                <div className="q-card q-animate" ref={cardRef}>
                  <div className="q-number">Вопрос {currentQ + 1}</div>
                  <div className="q-text">{q.text}</div>
                  <div className="options">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        className={`opt${selectedIdx === i ? ' selected' : ''}`}
                        onClick={() => selectOption(i)}
                        disabled={isAnswering}
                      >
                        <span className="opt-icon" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* LOADING */}
              {step === 'loading' && (
                <div className="loading-wrap">
                  <div className="loading-title">Готовим ваш анализ</div>
                  <div className="loading-sub">Считаем потенциал под вашу нишу...</div>
                  <div className="loading-bar-wrap">
                    <div className="loading-bar" style={{ width: `${loadingProgress}%` }} />
                  </div>
                  <div className="loading-steps">
                    {LOADING_STEPS.map((s, i) => (
                      <div
                        key={i}
                        className={`ls${loadingStep === i + 1 ? ' active' : ''}${loadingStep > i + 1 ? ' done' : ''}`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACT */}
              {step === 'contact' && (
                <ContactForm
                  answers={answers}
                  utmParams={utmParams}
                  onSuccess={() => setStep('success')}
                  getBotLink={getBotLink}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── CONTACT FORM ──────────────────────────────────────────────────────────────

function ContactForm({
  answers,
  utmParams,
  onSuccess,
  getBotLink,
}: {
  answers: Record<string, string>;
  utmParams: Record<string, string>;
  onSuccess: () => void;
  getBotLink: () => string;
}) {
  const [phone, setPhone] = useState('');
  const [tg, setTg] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string): string => {
    const hasPlus = value.startsWith('+');
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned.length) return hasPlus ? '+' : '';
    if (cleaned.length <= 1) return `+${cleaned}`;
    if (cleaned.length <= 4) return `+${cleaned[0]} (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  };

  // Внутри ContactForm компонента, в handleSubmit, после успешных запросов:

const handleSubmit = async () => {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) { setPhoneError('Введите номер телефона'); return; }
  if (cleaned.length < 10 || cleaned.length > 12) { setPhoneError('Введите корректный номер'); return; }
  setPhoneError('');
  setIsSubmitting(true);

  const formattedPhone = `+${cleaned}`;
  const cleanTg = tg.replace(/^@/, '');
  const payload = {
    phone: formattedPhone,
    telegram: cleanTg || null,
    utm: utmParams,
    answers,
    page: '/farm2',
    timestamp: new Date().toISOString(),
  };

  const results = await Promise.allSettled([
    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: formattedPhone,
        telegram: cleanTg || null,
        page: '/farm2',
        utm: utmParams,
        answers,
      }),
    }),
    fetch('/api/google-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    fetch('/api/amocrm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  ]);

  results.forEach((r, i) => {
    const names = ['telegram', 'google-sheets', 'amocrm'];
    if (r.status === 'rejected') {
      console.error(`[submit] ${names[i]} failed:`, r.reason);
    } else if (!r.value.ok) {
      r.value.text().then(t => console.error(`[submit] ${names[i]} HTTP ${r.value.status}:`, t));
    }
  });

  // ✅ ДОБАВЬТЕ ЭТОТ БЛОК:
  // Отправляем событие в Google Tag Manager
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'form_success',
      formType: 'farm_page_contact',
      formData: {
        phone: formattedPhone,
        hasTelegram: !!cleanTg,
      }
    });
  }

  setIsSubmitting(false);
  onSuccess();
};

  return (
    <div className="contact-card">
      <div className="contact-title">
        Анализ готов.<br /><span>Куда отправить результат?</span>
      </div>
      <div className="contact-sub">
        Укажите телефон — пришлём персональный расчёт и свяжемся в удобное время.
      </div>

      <div className="form-group">
        <label className="form-label">Номер телефона <span className="form-required">*</span></label>
        <input
          type="tel"
          className={`form-input${phoneError ? ' has-error' : ''}`}
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={e => { setPhone(formatPhone(e.target.value)); setPhoneError(''); }}
        />
        {phoneError && <div className="form-error">{phoneError}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Telegram username <span style={{ color: '#64748b', fontWeight: 400, textTransform: 'none', fontSize: '11px' }}>— необязательно</span></label>
        <div className="input-prefix-wrap">
          <span className="input-prefix">@</span>
          <input
            type="text"
            className="form-input prefixed"
            placeholder="username"
            value={tg}
            onChange={e => { let v = e.target.value; if (v.startsWith('@')) v = v.slice(1); setTg(v); }}
          />
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? <><span className="spinner" /> Отправляем...</> : 'Получить мой анализ →'}
      </button>
      <p className="form-agreement">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function TgIcon() {
  return (
    <span className="tg-icon">
      <svg viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.014 9.493c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.877.728z" />
      </svg>
    </span>
  );
}
