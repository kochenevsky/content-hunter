'use client';

import React, { useState, useEffect, useRef } from 'react';

const CTA_LINK = "https://t.me/m/N0r_C6tjMTJi";

const ZeroBotLanding = () => {
  const scrollToCTA = () => { window.location.href = CTA_LINK; };

  // Exit-intent popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !popupShown) {
        setShowPopup(true);
        setPopupShown(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [popupShown]);

  // Animated counter
  const [counts, setCounts] = useState({ bots: 0, users: 0, messages: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated.current) {
        animated.current = true;
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          const eased = 1 - Math.pow(1 - progress, 3);
          setCounts({
            bots: Math.floor(eased * 12400),
            users: Math.floor(eased * 340000),
            messages: Math.floor(eased * 48),
          });
          if (step >= steps) clearInterval(timer);
        }, interval);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const [activeCase, setActiveCase] = useState(0);
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const cases = [
    {
      icon: '🛍️',
      name: 'E-commerce',
      title: 'Sales & Order Bot',
      desc: 'A bot that shows your catalog, processes orders, tracks delivery status, and sends personalised promo codes — all without leaving Telegram.',
      prompt: '"Create a Telegram shop bot for my clothing store. It should show categories, accept orders, integrate with Stripe, and notify me on every new purchase."',
      metrics: ['3× conversion vs website', 'Avg reply: 0.3 sec', 'Handles 500+ orders/day'],
    },
    {
      icon: '🏋️',
      name: 'Fitness & Health',
      title: 'Personal AI Coach',
      desc: 'Tracks calories and water intake, generates dynamic workout plans, sends morning motivation, and adapts to user feedback every week.',
      prompt: '"Build me a fitness bot that logs daily meals, suggests workouts based on my goals, and sends reminders at 7am and 9pm."',
      metrics: ['92% user retention (30 days)', 'Avg session: 4.2 min', '4.8★ user rating'],
    },
    {
      icon: '💬',
      name: 'Customer Support',
      title: '24/7 AI Support Agent',
      desc: 'Answers FAQs from your knowledge base, escalates complex issues to a human, and learns from every conversation to get smarter over time.',
      prompt: '"Build a support bot for my SaaS product. It should read our Notion docs, answer questions, and forward unsolved cases to our Slack channel."',
      metrics: ['78% tickets auto-resolved', '−40% support cost', 'Zero downtime'],
    },
    {
      icon: '📊',
      name: 'Finance & Crypto',
      title: 'Market Alert Bot',
      desc: 'Monitors wallets, tracks prices, detects whale movements, and sends instant alerts with charts to your private channel or group.',
      prompt: '"Alert my group when BTC moves more than 5% in one hour, or when a wallet holding 100+ ETH makes a transaction."',
      metrics: ['Real-time alerts < 1 sec', 'Multi-chain support', 'Custom threshold rules'],
    },
    {
      icon: '🎓',
      name: 'Education',
      title: 'Interactive Tutor Bot',
      desc: 'Sends daily lessons, quizzes students, tracks progress, and adapts difficulty based on performance. Perfect for online schools and language apps.',
      prompt: '"Create a Spanish language tutor bot that sends a lesson every morning, tests vocabulary, and adjusts the level after each quiz."',
      metrics: ['2× learning speed', '85% quiz completion', 'Full progress analytics'],
    },
    {
      icon: '🏢',
      name: 'Business & HR',
      title: 'Internal Team Assistant',
      desc: 'Handles employee onboarding, answers internal policy questions, books meeting rooms, and routes requests to the right department.',
      prompt: '"Build an internal bot for our 200-person company. It should answer HR questions, manage vacation requests, and integrate with our Google Calendar."',
      metrics: ['−60% HR ticket load', 'Onboarding in 15 min', 'GDPR-compliant'],
    },
  ];

  const workflows = [
    {
      step: '01',
      icon: '💬',
      title: 'You Write the Prompt',
      desc: 'Describe what your bot should do in plain language — no technical knowledge needed. The more detail you give, the smarter your bot will be.',
      detail: 'Natural language processing interprets intent, identifies required integrations, and maps out conversation trees automatically.',
    },
    {
      step: '02',
      icon: '🧠',
      title: 'AI Designs the Logic',
      desc: 'ZeroBot\'s engine generates the full conversation flow, command structure, state management, and API connection plan in seconds.',
      detail: 'Our model is trained on 50,000+ real bot architectures. It knows exactly what patterns work for your use case.',
    },
    {
      step: '03',
      icon: '⚙️',
      title: 'Structure is Reviewed',
      desc: 'You see a visual map of your bot: all commands, messages, logic branches, and integrations. Edit anything with one click before deploying.',
      detail: 'A simple visual editor lets you tweak responses, add conditions, and connect external APIs without writing a single line of code.',
    },
    {
      step: '04',
      icon: '🚀',
      title: 'One-Click Deployment',
      desc: 'ZeroBot registers the bot via Telegram Managed Bots API, spins up a dedicated server, and your bot goes live — in under 60 seconds.',
      detail: 'Auto-scaled infrastructure runs on EU/US cloud. Zero DevOps required. No server maintenance, ever.',
    },
    {
      step: '05',
      icon: '📈',
      title: 'Dashboard & Growth',
      desc: 'Monitor every message, user journey, and conversion in real time. Correct AI responses, A/B test flows, and scale with one click.',
      detail: 'Full analytics: retention, drop-off points, popular commands, revenue attribution, and export to CSV or Google Sheets.',
    },
  ];

  const pains = [
    {
      icon: '⏳',
      pain: 'Building a bot takes weeks',
      fix: 'ZeroBot deploys your bot in under 60 seconds — from the first word of your prompt to a live, working Telegram bot.',
    },
    {
      icon: '💸',
      pain: 'Developers cost $3,000–$15,000',
      fix: 'Start for free. Pro plan is $29/month. ZeroBot replaces a mid-level backend developer for your bot infrastructure entirely.',
    },
    {
      icon: '🔧',
      pain: 'Maintenance kills your momentum',
      fix: 'We handle servers, updates, Telegram API changes, and scaling. You focus on your product — not on keeping servers alive.',
    },
    {
      icon: '🤯',
      pain: 'No-code tools are too limited',
      fix: 'ZeroBot generates production-grade code with custom logic, webhooks, payments, and multi-step flows — not just simple reply bots.',
    },
    {
      icon: '📉',
      pain: 'You can\'t see what\'s happening inside your bot',
      fix: 'Our analytics dashboard shows every conversation, drop-off point, and user action in real time. Full transparency, always.',
    },
    {
      icon: '🔐',
      pain: 'Data security is unclear on other platforms',
      fix: 'Your bot runs on an isolated server. All data is encrypted. GDPR-compliant by default. You own your data — always.',
    },
  ];

  const forWhom = [
    { icon: '🧑‍💼', title: 'Entrepreneurs & Founders', desc: 'Launch an MVP chatbot for your product in hours, not months. Test demand before writing a single line of code.' },
    { icon: '🛒', title: 'E-commerce Owners', desc: 'Turn your Telegram channel into a full sales machine. Catalog, checkout, notifications — all automated.' },
    { icon: '🎓', title: 'Online Educators & Coaches', desc: 'Automate lessons, homework, quizzes, and student tracking. Spend time teaching, not managing.' },
    { icon: '📣', title: 'Marketing Agencies', desc: 'Build lead-gen and promo bots for clients in minutes. Package it as a service and multiply your revenue.' },
    { icon: '🏢', title: 'Operations & HR Teams', desc: 'Automate internal requests, onboarding, FAQs, and approvals. Reduce manual work by 60%.' },
    { icon: '👨‍💻', title: 'Developers & Indie Hackers', desc: 'Skip the boilerplate. Generate the scaffolding, deploy it, and focus only on the unique business logic.' },
    { icon: '💹', title: 'Traders & Crypto Projects', desc: 'Real-time alerts, wallet monitoring, price trackers, and community management bots — built in seconds.' },
    { icon: '🤝', title: 'Communities & Content Creators', desc: 'Engage your audience with interactive bots: polls, games, giveaways, scheduled content, and subscriber analytics.' },
  ];

  const reviews = [
    { name: 'Alex Morozov', role: 'SaaS Founder', text: 'I described my idea at 11pm and had a working lead-gen bot by midnight. No exaggeration. This platform is witchcraft.' },
    { name: 'Sarah Chen', role: 'Head of Product, Shopify store', text: 'Our order bot handles 600+ transactions per day. The analytics dashboard helped us cut drop-off by 35% in the first week.' },
    { name: 'Marcio Dias', role: 'Indie Hacker', text: 'I tried Botpress, ManyChat, and custom code. ZeroBot is the first tool that actually generates real logic, not toy examples.' },
    { name: 'Alina K.', role: 'Online School Owner', text: 'Students love the tutor bot. Lesson delivery, quizzes, progress tracking — all automated. I freed up 15 hours per week.' },
    { name: 'Denis V.', role: 'Crypto Community Manager', text: 'Whale alert bot, price notifications, and giveaway management — all running 24/7 since day one. Zero downtime.' },
    { name: 'Tobias R.', role: 'Marketing Agency CEO', text: 'We now offer "Telegram Bot Setup" as a $1,500 service. It takes us 20 minutes to deliver. ZeroBot is our secret weapon.' },
  ];

  const faqItems = [
    { q: 'Do I need to know how to code?', a: 'Not at all. ZeroBot is designed for non-technical users. If you can describe what you want in words, ZeroBot builds it.' },
    { q: 'How does the bot deployment work?', a: 'We use the Telegram Managed Bots API (launched April 2026). ZeroBot automatically registers your bot and hosts it on our cloud. You receive a live link instantly.' },
    { q: 'Can I connect my bot to external services?', a: 'Yes. ZeroBot supports Stripe (payments), Google Sheets, Notion, Airtable, Webhooks, and any REST API. More integrations are added weekly.' },
    { q: 'What happens to my data?', a: 'Your bot runs on an isolated server. Data is encrypted at rest and in transit. We are GDPR-compliant and you retain full data ownership.' },
    { q: 'Can I edit the bot after it\'s deployed?', a: 'Absolutely. From the dashboard you can change responses, add commands, update logic, and redeploy with one click — no downtime.' },
    { q: 'What if I need a very complex bot?', a: 'Our Pro and Enterprise plans support advanced logic: multi-step flows, conditional branches, memory, user segmentation, and custom integrations. Contact us for a consultation.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#030712', color: '#f1f5f9', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        ::selection { background: rgba(99,102,241,0.3); }
        html { scroll-behavior: smooth; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }

        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 28px; background: #6366f1; color: #fff;
          border: none; border-radius: 12px; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; text-decoration: none; white-space: nowrap;
        }
        .btn-primary:hover { background: #5558e3; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
        .btn-secondary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 28px; background: rgba(255,255,255,0.06); color: #fff;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }
        .card {
          background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; transition: all 0.25s;
        }
        .card:hover { border-color: rgba(99,102,241,0.3); transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .glow { box-shadow: 0 0 80px rgba(99,102,241,0.15); }
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25); border-radius: 100px;
          font-size: 12px; font-weight: 600; color: #818cf8; letter-spacing: 0.02em;
        }
        .section { padding: 96px 24px; }
        .section-sm { padding: 64px 24px; }
        .container { max-width: 1140px; margin: 0 auto; }
        .container-sm { max-width: 720px; margin: 0 auto; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0 24px; }

        /* Mobile */
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: 1fr 1fr; }
          .grid-3 { grid-template-columns: 1fr 1fr; }
          .grid-2 { grid-template-columns: 1fr; }
          .hero-title { font-size: 38px !important; line-height: 1.15 !important; }
          .hero-sub { font-size: 16px !important; }
          .section { padding: 64px 20px; }
          .section-sm { padding: 48px 20px; }
          .hide-mobile { display: none !important; }
          .hero-btns { flex-direction: column; align-items: stretch !important; }
          .hero-btns button, .hero-btns a { width: 100%; justify-content: center; }
          .workflow-row { flex-direction: column !important; }
          .nav-links-desktop { display: none !important; }
          .pricing-cards { flex-direction: column !important; align-items: center !important; }
          .pricing-card { width: 100% !important; max-width: 400px; }
          .case-tabs { flex-wrap: wrap !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .review-grid { grid-template-columns: 1fr !important; }
          .for-whom-grid { grid-template-columns: 1fr 1fr !important; }
          .pain-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; gap: 16px !important; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center !important; }
        }
        @media (max-width: 540px) {
          .grid-3 { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: 1fr; }
          .for-whom-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 30px !important; }
          .stats-row { grid-template-columns: 1fr !important; }
          .case-tabs { gap: 6px !important; }
          .case-tab { font-size: 12px !important; padding: 7px 12px !important; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 900, flexShrink: 0 }}>Z</div>
            ZeroBot
          </div>
          {/* Desktop nav */}
          <div className="nav-links-desktop" style={{ display: 'flex', gap: 32 }}>
            {[['#features', 'Features'], ['#for-whom', 'For Whom'], ['#workflow', 'Workflow'], ['#pricing', 'Pricing'], ['#faq', 'FAQ']].map(([href, label]) => (
              <a key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              >{label}</a>
            ))}
          </div>
          {/* Desktop CTA */}
          <button onClick={scrollToCTA} className="btn-primary hide-mobile" style={{ padding: '10px 22px', fontSize: 14, borderRadius: 10 }}>
            Get Started Free →
          </button>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 4 }} className="mobile-menu-btn">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px 20px' }}>
            {[['#features', 'Features'], ['#for-whom', 'For Whom'], ['#workflow', 'Workflow'], ['#pricing', 'Pricing'], ['#faq', 'FAQ']].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{label}</a>
            ))}
            <button onClick={scrollToCTA} className="btn-primary" style={{ marginTop: 16, width: '100%' }}>Get Started Free →</button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <div className="badge" style={{ marginBottom: 24 }}>
            <span>⚡</span> Powered by Telegram Bot API 9.6 — Managed Bots
          </div>
          <h1 className="hero-title gradient-text" style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Build any Telegram Bot<br />with one AI Prompt.
          </h1>
          <p className="hero-sub" style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
            Describe your idea. ZeroBot designs the logic, writes the code, and deploys it live — in under 60 seconds. No developers. No servers. No limits.
          </p>
          <div className="hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={scrollToCTA} className="btn-primary" style={{ fontSize: 16, padding: '16px 32px', borderRadius: 14 }}>
              🚀 Build My Bot for Free
            </button>
            <button onClick={scrollToCTA} className="btn-secondary" style={{ fontSize: 16, padding: '16px 32px', borderRadius: 14 }}>
              📞 Talk to a Human
            </button>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>No credit card required · Free forever plan · Live in 60 seconds</p>

          {/* Prompt demo box */}
          <div style={{ marginTop: 56, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '24px 28px', textAlign: 'left', maxWidth: 680, margin: '56px auto 0', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.6 }} />)}
              <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>zerobot.io — New Bot</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Your idea →</div>
            <div style={{ fontSize: 15, color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 20 }}>
              "Create a sales bot for my online clothing store. Show categories, accept orders via Telegram, send tracking updates, and notify me in a separate admin chat on every purchase."
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['✅ Flow mapped', '⚙️ Code generated', '🚀 Deployed', '📊 Dashboard ready'].map((step, i) => (
                <div key={i} style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '5px 12px' }}>{step}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="section-sm" ref={statsRef}>
        <div className="container">
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { value: `${counts.bots.toLocaleString()}+`, label: 'Bots Deployed', sub: 'across 40 countries' },
              { value: `${counts.users.toLocaleString()}+`, label: 'End Users Served', sub: 'via ZeroBot-powered bots' },
              { value: `${counts.messages}M+`, label: 'Messages / Month', sub: 'processed on our infrastructure' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginTop: 6 }}>{stat.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── PAIN POINTS ─── */}
      <section className="section" id="pains">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>😤 The Problem</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">Why is building a bot still this painful?</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto' }}>Every builder runs into the same walls. ZeroBot tears them all down.</p>
          </div>
          <div className="pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {pains.map((item, i) => (
              <div key={i} className="card" style={{ padding: '28px 32px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f87171', marginBottom: 6, textDecoration: 'line-through', opacity: 0.7 }}>{item.pain}</div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>{item.fix}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── FOR WHOM ─── */}
      <section className="section" id="for-whom">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>👥 Who It's For</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">ZeroBot is built for you.</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 540, margin: '0 auto' }}>Whether you have 0 or 10 years of tech experience — if you have an idea, ZeroBot delivers it.</p>
          </div>
          <div className="for-whom-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {forWhom.map((item, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={scrollToCTA} className="btn-primary">I want to build my bot →</button>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── USE CASES ─── */}
      <section className="section" id="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 16 }}>💼 Use Cases</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">What ZeroBot can build for you</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto' }}>From simple FAQ bots to enterprise-grade AI agents — one prompt is all it takes.</p>
          </div>
          {/* Tabs */}
          <div className="case-tabs" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            {cases.map((c, i) => (
              <button key={i} className="case-tab" onClick={() => setActiveCase(i)} style={{ padding: '9px 18px', borderRadius: 100, border: `1px solid ${activeCase === i ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: activeCase === i ? 'rgba(99,102,241,0.2)' : 'transparent', color: activeCase === i ? '#a5b4fc' : 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
          {/* Active case */}
          {cases[activeCase] && (
            <div className="card" style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#818cf8', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{cases[activeCase].name}</div>
                <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>{cases[activeCase].title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 28 }}>{cases[activeCase].desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                  {cases[activeCase].metrics.map((m, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{m}</span>
                    </div>
                  ))}
                </div>
                <button onClick={scrollToCTA} className="btn-primary">Build this bot →</button>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>The prompt that built it</div>
                <div style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '24px 20px', fontSize: 14, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.7 }}>
                  {cases[activeCase].prompt}
                </div>
                <div style={{ marginTop: 20, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>⚡</span>
                  <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>Average deploy time for this type: under 45 seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* ─── WORKFLOW ─── */}
      <section className="section" id="workflow">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>🔁 How It Works</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">From idea to live bot in 5 steps.</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto' }}>No DevOps. No config. No headaches. Just results.</p>
          </div>
          {/* Step pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {workflows.map((w, i) => (
              <button key={i} onClick={() => setActiveWorkflow(i)} style={{ padding: '9px 18px', borderRadius: 100, border: `1px solid ${activeWorkflow === i ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: activeWorkflow === i ? 'rgba(99,102,241,0.2)' : 'transparent', color: activeWorkflow === i ? '#a5b4fc' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{w.icon}</span> {w.step}. {w.title}
              </button>
            ))}
          </div>
          {/* Active step detail */}
          <div className="card" style={{ padding: '48px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 64, fontWeight: 900, color: 'rgba(99,102,241,0.15)', lineHeight: 1, marginBottom: 16, letterSpacing: '-0.04em' }}>{workflows[activeWorkflow].step}</div>
              <h3 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>{workflows[activeWorkflow].icon} {workflows[activeWorkflow].title}</h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 24 }}>{workflows[activeWorkflow].desc}</p>
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '16px 20px', fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                {workflows[activeWorkflow].detail}
              </div>
            </div>
            {/* Visual connector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {workflows.map((w, i) => (
                <div key={i} onClick={() => setActiveWorkflow(i)} style={{ padding: '16px 20px', borderRadius: 14, border: `1px solid ${activeWorkflow === i ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.05)'}`, background: activeWorkflow === i ? 'rgba(99,102,241,0.1)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: activeWorkflow === i ? '#6366f1' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, transition: 'all 0.2s' }}>{w.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: activeWorkflow === i ? '#e2e8f0' : 'rgba(255,255,255,0.45)' }}>{w.step}. {w.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── FEATURES GRID ─── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>✨ Platform Features</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">Everything you need. Nothing you don't.</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '🧠', title: 'AI Logic Engine', desc: 'Our model generates complete conversation trees, branching logic, and fallback handlers — not just linear chat scripts.' },
              { icon: '⚡', title: 'Instant Deployment', desc: 'Zero-config deploy to EU/US cloud. Your bot gets a dedicated server, HTTPS webhook, and auto-scaling out of the box.' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Track messages, user retention, command popularity, and conversion funnels. Export to Google Sheets or CSV anytime.' },
              { icon: '🔗', title: 'Integrations Hub', desc: 'Connect Stripe, Notion, Google Sheets, Airtable, any REST API, or custom webhooks. 40+ integrations available.' },
              { icon: '✏️', title: 'Live Editor', desc: 'Edit bot responses, add commands, or restructure flows from the dashboard — with one-click redeploy, zero downtime.' },
              { icon: '🔐', title: 'Security First', desc: 'Isolated server per bot, encrypted storage, GDPR compliance, and role-based access control for your team.' },
              { icon: '🌍', title: 'Multi-Language', desc: 'Your bot detects the user\'s Telegram language and responds accordingly. Full i18n support for global audiences.' },
              { icon: '👥', title: 'User Segmentation', desc: 'Tag users, create segments, and send targeted broadcasts to specific audience groups right from the dashboard.' },
              { icon: '🤖', title: 'AI Corrections', desc: 'When a user asks something unexpected, flag it in the dashboard. Teach your bot with one click, redeploy instantly.' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── REVIEWS ─── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>⭐ Reviews</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">"The only platform that makes<br />AI-built actually mean something."</h2>
          </div>
          <div className="review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {reviews.map((rev, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[...Array(5)].map((_, s) => <span key={s} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{rev.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                    {rev.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{rev.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── PRICING ─── */}
      <section className="section" id="pricing">
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>💳 Pricing</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">Start free. Scale as you grow.</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)' }}>No hidden fees. Cancel anytime. Upgrade in one click.</p>
          </div>
          <div className="pricing-cards" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Free */}
            <div className="pricing-card card" style={{ flex: '1 1 260px', maxWidth: 320, padding: '36px 28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Free</div>
              <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>$0</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>forever</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36, flex: 1 }}>
                {['1 active bot', 'Up to 500 users/month', 'Standard AI engine', 'Basic analytics', 'Community support'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
                    <span style={{ color: '#22c55e', fontSize: 15 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={scrollToCTA} className="btn-secondary" style={{ width: '100%' }}>Get Started Free</button>
            </div>
            {/* Pro */}
            <div className="pricing-card" style={{ flex: '1 1 260px', maxWidth: 340, background: 'rgba(15,23,42,0.95)', border: '2px solid #6366f1', borderRadius: 20, padding: '36px 28px', display: 'flex', flexDirection: 'column', boxShadow: '0 0 60px rgba(99,102,241,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 100, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Most Popular</div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#818cf8', marginBottom: 8 }}>Pro</div>
              <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>$29</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>per month</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36, flex: 1 }}>
                {['10 active bots', 'Unlimited users', 'Advanced AI + memory', 'Full analytics & exports', 'Integrations (Stripe, Notion, etc.)', 'Live editor & redeploy', 'Priority email support'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                    <span style={{ color: '#818cf8', fontSize: 15 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={scrollToCTA} className="btn-primary" style={{ width: '100%', fontSize: 16 }}>Start Pro Trial →</button>
            </div>
            {/* Enterprise */}
            <div className="pricing-card card" style={{ flex: '1 1 260px', maxWidth: 320, padding: '36px 28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Enterprise</div>
              <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>Custom</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>contact us</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36, flex: 1 }}>
                {['Unlimited bots', 'Dedicated infrastructure', 'White-label dashboard', 'Custom integrations', 'SLA & 24/7 support', 'Dedicated account manager', 'On-premise available'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
                    <span style={{ color: '#22c55e', fontSize: 15 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={scrollToCTA} className="btn-secondary" style={{ width: '100%' }}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── FAQ ─── */}
      <section className="section" id="faq">
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 16 }}>❓ FAQ</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }} className="gradient-text">Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqItems.map((item, i) => (
              <div key={i} style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${openFaq === i ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: '#f1f5f9', cursor: 'pointer', fontSize: 15, fontWeight: 600, textAlign: 'left', gap: 16 }}>
                  <span>{item.q}</span>
                  <span style={{ flexShrink: 0, fontSize: 20, color: openFaq === i ? '#818cf8' : 'rgba(255,255,255,0.3)', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Still have questions? Talk to a real human.</p>
            <button onClick={scrollToCTA} className="btn-secondary">💬 Open Telegram Chat</button>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── FINAL CTA ─── */}
      <section className="section">
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.25) 0%, transparent 70%)', borderRadius: 32, border: '1px solid rgba(99,102,241,0.2)', padding: '64px 40px' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }} className="gradient-text">
              Your next AI employee is one prompt away.
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 36, lineHeight: 1.6 }}>
              Join 12,000+ builders who stopped waiting for developers and started shipping bots today.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={scrollToCTA} className="btn-primary" style={{ fontSize: 17, padding: '18px 36px', borderRadius: 16 }}>
                🚀 Start Building Free
              </button>
              <button onClick={scrollToCTA} className="btn-secondary" style={{ fontSize: 17, padding: '18px 36px', borderRadius: 16 }}>
                📞 Book a Demo
              </button>
            </div>
            <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Free plan available · No credit card · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px' }}>
        <div className="container">
          <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 16, color: '#fff' }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 900 }}>Z</div>
              ZeroBot
            </div>
            <div className="footer-links" style={{ display: 'flex', gap: 28 }}>
              {[['#features', 'Features'], ['#for-whom', 'For Whom'], ['#pricing', 'Pricing'], ['#faq', 'FAQ'], [CTA_LINK, 'Support']].map(([href, label]) => (
                <a key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >{label}</a>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>© 2026 ZeroBot. Built by AI, for humans.</div>
          </div>
        </div>
      </footer>

      {/* ─── EXIT POPUP ─── */}
      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowPopup(false)}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 24, padding: '48px 40px', maxWidth: 460, width: '100%', textAlign: 'center', position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
            <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Wait — your bot idea is just one message away.</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28, lineHeight: 1.6 }}>Get a free consultation in Telegram. Our team will help you scope your bot and launch it today.</p>
            <button onClick={scrollToCTA} className="btn-primary" style={{ width: '100%', fontSize: 16, padding: '16px 0', borderRadius: 14 }}>
              💬 Get Free Consultation
            </button>
            <button onClick={() => setShowPopup(false)} style={{ marginTop: 12, width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer', padding: '8px 0' }}>
              No thanks, I'll figure it out myself
            </button>
          </div>
        </div>
      )}

      {/* ─── MOBILE HAMBURGER STYLE FIX ─── */}
      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-btn { display: flex !important; }
        }
        /* Cases & workflow card stacking */
        @media (max-width: 900px) {
          .card[style*="grid-template-columns"] {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ZeroBotLanding;
