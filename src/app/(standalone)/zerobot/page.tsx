'use client';

import React, { useState, useEffect, useRef } from 'react';

const ZeroBotLanding = () => {
  const scrollToCTA = () => {
    window.location.href = "https://t.me/m/N0r_C6tjMTJi";
  };

  // Exit-intent popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [email, setEmail] = useState('');

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

  // Active workflow tab
  const [activeAgent, setActiveAgent] = useState(0);

  const agents = [
    {
      icon: '🧑‍💼',
      name: 'Support Agent',
      tagline: 'Handle customer queries 24/7 without hiring',
      description: 'Connects to your Notion, Google Docs, or website. Answers refund questions, troubleshoots issues, escalates to human when needed.',
      workflow: [
        { step: 'User asks question', detail: 'Via Telegram, your website, or any channel' },
        { step: 'AI searches knowledge base', detail: 'Reads your docs in real-time' },
        { step: 'Generates precise answer', detail: 'With source references' },
        { step: 'Escalates if unsure', detail: 'Human handoff with full context' },
      ],
      metrics: ['87% queries resolved automatically', '< 3 sec response time', '94% satisfaction rate'],
      color: '#6366f1',
    },
    {
      icon: '📊',
      name: 'Data Analysis Agent',
      tagline: 'Turn raw data into decisions — automatically',
      description: 'Pulls from Google Sheets, Airtable, or any database. Generates reports, sends alerts when KPIs drop, and suggests next actions.',
      workflow: [
        { step: 'Connects to data sources', detail: 'Sheets, Airtable, SQL, APIs' },
        { step: 'Runs scheduled analysis', detail: 'Daily, weekly, or on-trigger' },
        { step: 'Detects anomalies', detail: 'AI flags unusual patterns instantly' },
        { step: 'Sends report to Telegram', detail: 'Summary + actionable insights' },
      ],
      metrics: ['100+ data sources', 'Real-time alerts', '5x faster reporting'],
      color: '#8b5cf6',
    },
    {
      icon: '💰',
      name: 'Sales & CRM Agent',
      tagline: 'Never lose a lead due to slow follow-up',
      description: 'Qualifies inbound leads, books meetings, sends personalized follow-ups, and updates your CRM — all without lifting a finger.',
      workflow: [
        { step: 'Lead submits form', detail: 'Website, ads, or referral' },
        { step: 'AI qualifies in 30 seconds', detail: 'Scores lead by ICP match' },
        { step: 'Auto sends personalized DM', detail: 'Tailored to their industry' },
        { step: 'Books meeting + updates CRM', detail: 'HubSpot, Notion, or custom' },
      ],
      metrics: ['3x more meetings booked', '48h → 30s follow-up time', '+62% conversion rate'],
      color: '#ec4899',
    },
    {
      icon: '🤝',
      name: 'Meeting Prep Agent',
      tagline: 'Walk into every call fully briefed',
      description: 'Researches the company, pulls LinkedIn info, reads your past notes, and sends you a briefing 10 minutes before every call.',
      workflow: [
        { step: 'Calendar event detected', detail: 'Google Calendar or Calendly' },
        { step: 'AI researches the company', detail: 'Funding, news, key people' },
        { step: 'Pulls your CRM history', detail: 'Past deals, emails, notes' },
        { step: 'Sends briefing to Telegram', detail: '10 min before the call' },
      ],
      metrics: ['< 2 min briefing generation', 'LinkedIn + news + CRM merged', 'No prep time wasted'],
      color: '#f59e0b',
    },
  ];

  const pains = [
    {
      pain: 'You pay developers $150/hr to build bots that take weeks',
      solution: 'ZeroBot builds and deploys in under 60 seconds — no dev required',
    },
    {
      pain: 'Your team wastes hours on repetitive tasks that AI could handle',
      solution: 'Agents run 24/7, handle the boring stuff, and escalate when it matters',
    },
    {
      pain: 'Every no-code tool has limits — you hit them in week 2',
      solution: 'ZeroBot is built on real code. No ceiling. Full flexibility.',
    },
    {
      pain: 'You tried ChatGPT for business and got a mess of prompts',
      solution: 'Structured agents with memory, integrations, and actual deployments',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Rivet',
      role: 'Founder @ SalesFlow',
      avatar: 'AR',
      color: '#6366f1',
      quote: 'I built a fully functional lead qualification bot in 7 minutes. It now handles 300 inbound leads per week. We closed $80k ARR from those leads last month.',
      metric: '$80k ARR',
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Ops @ Growthlab',
      avatar: 'SC',
      color: '#8b5cf6',
      quote: 'ZeroBot replaced our entire support tier-1. 87% of tickets are resolved automatically now. My team finally focuses on complex issues instead of FAQ hell.',
      metric: '87% auto-resolved',
    },
    {
      name: 'Marcio Delgado',
      role: 'Indie Hacker',
      avatar: 'MD',
      color: '#ec4899',
      quote: 'I was about to spend $15k on a custom Telegram bot. ZeroBot did the same thing for $29/month. Launched in one afternoon. Legit game changer.',
      metric: 'Saved $14,971',
    },
  ];

  const faqs = [
    {
      q: 'Do I need coding skills?',
      a: 'Zero coding required. Describe what you want in plain English and ZeroBot handles the rest — architecture, logic, deployment, and monitoring.',
    },
    {
      q: 'What integrations are supported?',
      a: 'Telegram, WhatsApp, Google Sheets, Notion, HubSpot, Airtable, Slack, custom APIs, and 50+ more. New integrations added weekly.',
    },
    {
      q: 'How is this different from Zapier or Make?',
      a: 'Zapier connects tools. ZeroBot builds AI agents that think, decide, and act. The difference is like a conveyor belt vs an autonomous employee.',
    },
    {
      q: 'What happens if the bot makes a mistake?',
      a: 'Every action is logged. You can review, correct, and retrain your agent from the dashboard. Human-in-the-loop mode available for critical decisions.',
    },
    {
      q: 'Can I white-label bots for my clients?',
      a: 'Yes. Enterprise plan includes full white-label, custom domains, and your own branding. Many agencies resell ZeroBot-powered bots.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#ffffff', color: '#0f0f0f', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --indigo: #6366f1;
          --purple: #8b5cf6;
          --pink: #ec4899;
          --amber: #f59e0b;
          --bg: #ffffff;
          --text: #0f0f0f;
          --muted: #6b7280;
          --border: #e5e7eb;
        }

        html { scroll-behavior: smooth; }

        .hero-gradient {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%),
                      radial-gradient(ellipse 60% 40% at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 40% at 10% 30%, rgba(139,92,246,0.08) 0%, transparent 60%),
                      #ffffff;
        }

        .mesh-gradient {
          background: radial-gradient(ellipse 100% 80% at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%),
                      radial-gradient(ellipse 80% 60% at 80% 30%, rgba(236,72,153,0.1) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 50% at 50% 100%, rgba(245,158,11,0.08) 0%, transparent 60%),
                      #fafafa;
        }

        .floating-card {
          animation: float 6s ease-in-out infinite;
        }
        .floating-card:nth-child(2) { animation-delay: -2s; }
        .floating-card:nth-child(3) { animation-delay: -4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-fade-up { animation: fadeUp 0.7s ease forwards; }
        .animate-fade-up-delay-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .animate-fade-up-delay-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .animate-fade-up-delay-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .animate-fade-up-delay-4 { animation: fadeUp 0.7s 0.4s ease both; }

        .btn-primary {
          background: #0f0f0f;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover { background: #1f1f1f; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }

        .btn-secondary {
          background: transparent;
          color: #0f0f0f;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .btn-secondary:hover { border-color: #0f0f0f; background: #f9f9f9; }

        .nav-link {
          color: #4b5563;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
        }
        .nav-link:hover { color: #0f0f0f; }

        .section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--indigo);
        }

        .card {
          background: #fff;
          border: 1.5px solid #f3f4f6;
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
        }
        .card:hover { border-color: #e0e0ff; box-shadow: 0 20px 50px rgba(99,102,241,0.08); transform: translateY(-4px); }

        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          background: #f3f4ff;
          color: #6366f1;
          border: 1px solid #e0e0ff;
        }

        .workflow-step {
          display: flex;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.2s ease;
        }
        .workflow-step:last-child { border-bottom: none; }

        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #6366f1;
          flex-shrink: 0;
        }

        .agent-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: all 0.2s ease;
          border-radius: 0;
          background: none;
          border: none;
          border-left: 3px solid transparent;
          text-align: left;
          font-family: inherit;
          width: 100%;
        }
        .agent-tab.active { border-left-color: #6366f1; background: #f8f8ff; }
        .agent-tab:hover { background: #fafafa; }

        .metric-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 100px;
          background: #f0fdf4;
          color: #16a34a;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid #bbf7d0;
        }

        .logo-scroll {
          display: flex;
          gap: 48px;
          animation: scroll-x 20s linear infinite;
          width: max-content;
        }
        .logo-scroll-wrap {
          overflow: hidden;
          mask: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
        }

        .faq-item {
          border-bottom: 1px solid #f3f4f6;
        }
        .faq-q {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 16px;
          font-weight: 600;
          color: #0f0f0f;
          text-align: left;
          gap: 16px;
        }
        .faq-a {
          padding-bottom: 20px;
          color: #6b7280;
          line-height: 1.7;
          font-size: 15px;
        }

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        .popup-box {
          background: #fff;
          border-radius: 24px;
          padding: 48px;
          max-width: 480px;
          width: 90%;
          position: relative;
          animation: fadeUp 0.4s ease;
          box-shadow: 0 40px 80px rgba(0,0,0,0.15);
        }

        .input-field {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #6366f1; }

        .pain-card {
          padding: 32px;
          border-radius: 20px;
          background: #fff;
          border: 1.5px solid #f3f4f6;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .pain-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #ec4899);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .pain-card:hover::before { transform: scaleX(1); }
        .pain-card:hover { box-shadow: 0 20px 50px rgba(0,0,0,0.05); }

        .hero-dashboard {
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.08);
        }

        .chat-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          max-width: 85%;
        }
        .chat-bubble.bot {
          background: #f3f4ff;
          color: #0f0f0f;
          border-bottom-left-radius: 4px;
        }
        .chat-bubble.user {
          background: #6366f1;
          color: #fff;
          border-bottom-right-radius: 4px;
          margin-left: auto;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 40px !important; }
          .section-title { font-size: 32px !important; }
        }
      `}</style>

      {/* Exit Intent Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowPopup(false)}
              style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af' }}
            >
              ×
            </button>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎁</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Wait — before you go</h3>
            <p style={{ color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
              Get a <strong style={{ color: '#0f0f0f' }}>free bot blueprint</strong> tailored to your business. We'll build it — you just describe what you need.
            </p>
            <input
              className="input-field"
              placeholder="Your Telegram username or email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
              onClick={() => { scrollToCTA(); setShowPopup(false); }}
            >
              Get My Free Blueprint →
            </button>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>No spam. No credit card. Just value.</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 18, color: '#0f0f0f' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>Z</div>
            ZeroBot
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#workflow" className="nav-link">Workflow</a>
            <a href="#cases" className="nav-link">Cases</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={scrollToCTA} className="btn-secondary" style={{ padding: '10px 20px', fontSize: 14 }}>
              Book Demo
            </button>
            <button onClick={scrollToCTA} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient" style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div className="tag animate-fade-up" style={{ marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
            We raised a $5M Seed — building the future of bot infrastructure
          </div>

          <h1 className="hero-title animate-fade-up-delay-1" style={{ fontSize: 68, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24, fontFamily: "'DM Serif Display', serif" }}>
            AI bots built{' '}
            <span style={{ textDecoration: 'line-through', color: '#d1d5db', fontStyle: 'italic' }}>for</span>{' '}
            <span className="gradient-text">by your team.</span>
          </h1>

          <p className="animate-fade-up-delay-2" style={{ fontSize: 20, color: '#6b7280', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Describe any automation in plain English. ZeroBot builds, deploys, and runs AI agents that work 24/7 — without a single line of code.
          </p>

          <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <button onClick={scrollToCTA} className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
              Start Building Free →
            </button>
            <button onClick={scrollToCTA} className="btn-secondary" style={{ fontSize: 16, padding: '16px 32px' }}>
              See Live Demo
            </button>
          </div>

          {/* Hero visual */}
          <div className="animate-fade-up-delay-4" style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
            {/* Floating cards */}
            <div className="floating-card" style={{ position: 'absolute', top: -20, left: -40, background: '#fff', border: '1.5px solid #f3f4f6', borderRadius: 16, padding: '12px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', zIndex: 2, whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 700, marginBottom: 2 }}>✓ Bot deployed</div>
              <div style={{ fontSize: 13, color: '#0f0f0f', fontWeight: 600 }}>Support Agent • 2s ago</div>
            </div>
            <div className="floating-card" style={{ position: 'absolute', top: 40, right: -30, background: '#fff', border: '1.5px solid #f3f4f6', borderRadius: 16, padding: '12px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', zIndex: 2 }}>
              <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, marginBottom: 2 }}>📊 KPI Alert</div>
              <div style={{ fontSize: 13, color: '#0f0f0f', fontWeight: 600 }}>Revenue up 34% this week</div>
            </div>
            <div className="floating-card" style={{ position: 'absolute', bottom: 40, left: -20, background: '#fff', border: '1.5px solid #f3f4f6', borderRadius: 16, padding: '12px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', zIndex: 2 }}>
              <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, marginBottom: 2 }}>🤝 Lead qualified</div>
              <div style={{ fontSize: 13, color: '#0f0f0f', fontWeight: 600 }}>Meeting booked • $45k deal</div>
            </div>

            <div className="hero-dashboard">
              <div style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fca5a5' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fcd34d' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#86efac' }}></div>
                </div>
                <div style={{ flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
                  app.zerobot.io/dashboard
                </div>
              </div>
              <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Left - chat */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support Agent — Live</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="chat-bubble user">How do I get a refund for my last order?</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700 }}>Z</div>
                      <div className="chat-bubble bot">I found your order #4821 from March 12. You're eligible for a full refund. I've initiated it — you'll receive $67.50 within 3-5 business days. Anything else? ✓</div>
                    </div>
                    <div className="chat-bubble user">That's fast! Thanks 🙏</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700 }}>Z</div>
                      <div className="chat-bubble bot">Happy to help! I've also logged this case in your CRM. Is there anything about your experience you'd like to share? 😊</div>
                    </div>
                  </div>
                </div>
                {/* Right - stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Metrics</div>
                  {[
                    { label: 'Queries resolved today', value: '284', change: '+12%', color: '#6366f1' },
                    { label: 'Avg. response time', value: '1.8s', change: '-40%', color: '#8b5cf6' },
                    { label: 'CSAT Score', value: '94%', change: '+3%', color: '#16a34a' },
                  ].map((stat, i) => (
                    <div key={i} style={{ padding: '16px 20px', background: '#f9fafb', borderRadius: 12, border: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>{stat.label}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#0f0f0f' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>{stat.change}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 16px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                    ✓ Agent running — 99.98% uptime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo scroll */}
      <section style={{ padding: '40px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Trusted by teams at forward-thinking companies</span>
        </div>
        <div className="logo-scroll-wrap">
          <div className="logo-scroll">
            {['Shopify', 'HubSpot', 'Notion', 'Stripe', 'Linear', 'Vercel', 'Figma', 'Intercom', 'Shopify', 'HubSpot', 'Notion', 'Stripe', 'Linear', 'Vercel', 'Figma', 'Intercom'].map((name, i) => (
              <span key={i} style={{ fontSize: 18, fontWeight: 700, color: '#d1d5db', whiteSpace: 'nowrap' }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pain → Solution Section */}
      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>The Problem</div>
            <h2 className="section-title" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Building bots shouldn't feel like{' '}
              <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', color: '#6b7280' }}>this.</span>
            </h2>
            <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>
              Most teams give up on automation because every tool is either too simple or too complex.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {pains.map((item, i) => (
              <div key={i} className="pain-card">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginTop: 2 }}>✗</div>
                    <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, textDecoration: 'line-through' }}>{item.pain}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#16a34a', flexShrink: 0, marginTop: 2 }}>✓</div>
                    <p style={{ fontSize: 15, color: '#0f0f0f', lineHeight: 1.6, fontWeight: 500 }}>{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section ref={statsRef} className="mesh-gradient" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, textAlign: 'center' }}>
          {[
            { value: `${counts.bots.toLocaleString()}+`, label: 'Bots deployed', sub: 'across all industries' },
            { value: `${counts.users.toLocaleString()}+`, label: 'End users served', sub: 'by ZeroBot agents daily' },
            { value: `${counts.messages}M+`, label: 'Messages processed', sub: 'per month' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>{stat.value}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f0f0f', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 14, color: '#9ca3af' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Showcase / Workflow */}
      <section id="workflow" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>How It Works</div>
            <h2 className="section-title" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Roll out specialized agents in minutes
            </h2>
            <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>
              Pick from battle-tested archetypes or describe your own. Every agent is production-ready.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 0, background: '#f9fafb', borderRadius: 24, border: '1.5px solid #f3f4f6', overflow: 'hidden' }}>
            {/* Left tabs */}
            <div style={{ borderRight: '1px solid #f3f4f6' }}>
              {agents.map((agent, i) => (
                <button
                  key={i}
                  className={`agent-tab ${activeAgent === i ? 'active' : ''}`}
                  onClick={() => setActiveAgent(i)}
                >
                  <span style={{ fontSize: 24 }}>{agent.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f0f0f', marginBottom: 2 }}>{agent.name}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.4 }}>{agent.tagline}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right detail */}
            <div style={{ padding: 40 }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{agents[activeAgent].name}</h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{agents[activeAgent].description}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Workflow</div>
                {agents[activeAgent].workflow.map((step, i) => (
                  <div key={i} className="workflow-step">
                    <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f0f0f', marginBottom: 2 }}>{step.step}</div>
                      <div style={{ fontSize: 13, color: '#9ca3af' }}>{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {agents[activeAgent].metrics.map((m, i) => (
                  <span key={i} className="metric-pill">✓ {m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - 4 steps */}
      <section id="features" style={{ padding: '100px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>The Process</div>
            <h2 className="section-title" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>
              From idea to live in 4 steps
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
            {[
              { step: '01', title: 'Describe it', desc: 'Type what you want your bot to do in plain English. No jargon, no tech specs.', icon: '💬' },
              { step: '02', title: 'AI maps it', desc: 'Our engine designs the architecture — logic, state, integrations, error handling.', icon: '🧠' },
              { step: '03', title: 'Auto-deploys', desc: 'ZeroBot provisions a secure server and connects to Telegram, Slack, or any channel.', icon: '🚀' },
              { step: '04', title: 'You control it', desc: 'Monitor, fine-tune, and scale from the dashboard. No re-deploys needed.', icon: '📊' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '40px 32px', position: 'relative', borderRight: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Step {item.step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="cases" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Case Studies</div>
            <h2 className="section-title" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              If you can prompt it,{' '}
              <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>ZeroBot</span> builds it
            </h2>
            <p style={{ fontSize: 18, color: '#6b7280' }}>Real automations from real customers.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                category: 'E-commerce',
                title: 'Abandoned Cart Recovery Bot',
                desc: 'Shopify store owner built a Telegram bot that detects cart abandonment and sends personalized follow-ups with a discount code.',
                prompt: '"Monitor my Shopify, and if someone abandons a cart over $50, DM them in 1 hour with a 10% code."',
                result: '+23% cart recovery',
                color: '#6366f1',
              },
              {
                category: 'Finance',
                title: 'Crypto Whale Alert + Trading Signal Bot',
                desc: 'Quant trader set up a bot to monitor on-chain activity and send Telegram alerts with GPT-generated analysis when whales move.',
                prompt: '"Alert me when any wallet moves 100+ ETH and generate a market impact summary."',
                result: '3 profitable signals/week',
                color: '#8b5cf6',
              },
              {
                category: 'HR / Recruitment',
                title: 'CV Screening + Interview Scheduler',
                desc: 'Startup HR team automated their entire inbound hiring funnel — screening resumes, scoring candidates, and booking interviews.',
                prompt: '"Screen CVs from our email, score against our JD, and book the top 20% directly in Calendly."',
                result: '12h → 45min per hire',
                color: '#ec4899',
              },
              {
                category: 'Marketing',
                title: 'Competitor Intelligence Monitor',
                desc: 'SaaS marketing team gets a daily briefing on competitor pricing changes, new features, and press mentions — in Telegram.',
                prompt: '"Every morning, check competitor websites for changes and send me a summarized digest."',
                result: '2h research saved daily',
                color: '#f59e0b',
              },
              {
                category: 'Sales',
                title: 'LinkedIn Outreach + CRM Sync',
                desc: 'B2B SDR team automated personalized LinkedIn follow-ups based on prospect engagement signals, synced to HubSpot.',
                prompt: '"When a prospect visits our pricing page, send a personalized LinkedIn message within 5 minutes."',
                result: '4x response rate',
                color: '#10b981',
              },
              {
                category: 'Operations',
                title: 'Internal Knowledge Base Q&A',
                desc: 'Operations team built a company wiki bot that answers employee questions from Notion in real-time via Telegram.',
                prompt: '"Connect to our Notion and let any employee ask questions about company policies, get accurate answers."',
                result: '300 tickets/week eliminated',
                color: '#3b82f6',
              },
            ].map((c, i) => (
              <div key={i} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.color, background: `${c.color}15`, padding: '4px 10px', borderRadius: 100 }}>{c.category}</span>
                  <span className="metric-pill">{c.result}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>{c.desc}</p>
                <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#6b7280', fontStyle: 'italic', borderLeft: `3px solid ${c.color}` }}>
                  {c.prompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Testimonials</div>
            <h2 className="section-title" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Trusted by builders who ship fast
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: '#f59e0b', fontSize: 16 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 16, color: '#0f0f0f', lineHeight: 1.7, marginBottom: 24, flex: 1, fontWeight: 500 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: 100, border: '1px solid #bbf7d0' }}>{t.metric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Pricing</div>
            <h2 className="section-title" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Simple pricing, no surprises
            </h2>
            <p style={{ fontSize: 18, color: '#6b7280' }}>Start free. Scale when you're ready.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                name: 'Starter',
                price: '$0',
                period: 'forever',
                desc: 'For solo builders exploring automation.',
                features: ['1 Active Bot', 'Standard AI Engine', '1,000 messages/month', 'Community support', 'Telegram integration'],
                cta: 'Get Started Free',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                desc: 'For teams serious about automation.',
                features: ['10 Active Bots', 'Advanced AI Engine', '50k messages/month', 'All integrations', 'Priority support', 'Analytics dashboard', 'Custom workflows'],
                cta: 'Start Pro Trial',
                highlighted: true,
                badge: 'Most Popular',
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                desc: 'For companies automating at scale.',
                features: ['Unlimited Bots', 'Custom AI fine-tuning', 'Unlimited messages', 'White-label option', 'Dedicated account manager', 'SLA guarantees', 'Custom integrations'],
                cta: 'Talk to Sales',
                highlighted: false,
              },
            ].map((plan, i) => (
              <div key={i} style={{
                padding: 36,
                borderRadius: 20,
                border: plan.highlighted ? '2px solid #6366f1' : '1.5px solid #f3f4f6',
                background: plan.highlighted ? 'linear-gradient(135deg, #f8f8ff, #fdf4ff)' : '#fff',
                position: 'relative',
                boxShadow: plan.highlighted ? '0 20px 50px rgba(99,102,241,0.12)' : 'none',
                transform: plan.highlighted ? 'scale(1.03)' : 'none',
              }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 44, fontWeight: 900, color: '#0f0f0f', letterSpacing: '-0.02em' }}>{plan.price}</span>
                    <span style={{ fontSize: 15, color: '#9ca3af' }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#9ca3af' }}>{plan.desc}</div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: j < plan.features.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                      <span style={{ color: '#16a34a', fontSize: 14, fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: 14, color: '#4b5563' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={scrollToCTA}
                  className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>FAQ</div>
            <h2 className="section-title" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Common questions
            </h2>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 22, color: '#6b7280', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '120px 24px', background: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 20, fontFamily: "'DM Serif Display', serif" }}>
            Ready to deploy your first AI employee?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>
            Join 12,000+ teams who automated the boring stuff and focused on what actually matters.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={scrollToCTA} style={{ background: '#fff', color: '#0f0f0f', border: 'none', borderRadius: 12, padding: '18px 36px', fontSize: 17, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Start Building Free →
            </button>
            <button onClick={scrollToCTA} style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '18px 36px', fontSize: 17, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
            >
              Talk to Sales
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 24 }}>No credit card required • Free plan forever • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 16, color: '#fff' }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>Z</div>
            ZeroBot
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Features', 'Pricing', 'Docs', 'Blog', 'Privacy'].map((link, i) => (
              <a key={i} href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >{link}</a>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>© 2026 ZeroBot. Built by AI, for humans.</div>
        </div>
      </footer>
    </div>
  );
};

export default ZeroBotLanding;
