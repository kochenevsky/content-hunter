'use client';

import dynamic from 'next/dynamic';

const HMDProfileContent = dynamic(
  () => import('./components/HMDProfileContent'),  // относительный путь
  { ssr: false }
);

export default function HMDProfilePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --pink: #FF8FAB; --pink-light: #FFB5C8; --pink-pale: #FFF0F4;
          --pink-dim: rgba(255,143,171,0.12); --pink-border: rgba(255,143,171,0.25);
          --coral: #FF6B7A; --coral-pale: #FFF2F3;
          --yellow: #FFB347; --yellow-pale: #FFF8EE;
          --green: #5CC8A0; --green-pale: #F0FAF6;
          --bg: #FAFAF8; --surface: #FFFFFF; --surface2: #F5F4F2; --border: rgba(0,0,0,0.07);
          --text: #2D2D2D; --text2: #666666; --text3: #AAAAAA;
          --font: -apple-system, 'SF Pro Text', 'Segoe UI', sans-serif;
          --nav-h: 68px; --safe-bottom: env(safe-area-inset-bottom, 0px);
          --radius: 18px; --radius-sm: 12px;
        }
        html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font); overflow: hidden; }
        .loading-screen { position: fixed; inset: 0; background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; z-index: 200; transition: opacity 0.35s; }
        .loading-screen.hidden { opacity: 0; pointer-events: none; }
        .loading-logo { font-size: 48px; animation: sway 2s ease-in-out infinite; }
        @keyframes sway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        .loading-title { font-size: 20px; font-weight: 800; color: var(--text); }
        .loading-sub { font-size: 13px; color: var(--text3); }
        .spinner { width: 28px; height: 28px; border: 3px solid var(--pink-pale); border-top-color: var(--pink); border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .screen { position: fixed; inset: 0; bottom: calc(var(--nav-h) + var(--safe-bottom)); overflow-y: auto; overflow-x: hidden; padding: 0 16px 24px; padding-top: max(16px, env(safe-area-inset-top)); display: none; z-index: 1; -webkit-overflow-scrolling: touch; }
        .screen.active { display: block; }
        .screen::-webkit-scrollbar { width: 0; }
        nav { position: fixed; bottom: 0; left: 0; right: 0; height: calc(var(--nav-h) + var(--safe-bottom)); padding-bottom: var(--safe-bottom); background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; z-index: 50; }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: transform 0.15s; }
        .nav-item:active { transform: scale(0.92); }
        .nav-icon { font-size: 22px; line-height: 1; }
        .nav-label { font-size: 10px; font-weight: 700; color: var(--text3); transition: color 0.2s; letter-spacing: 0.01em; }
        .nav-item.active .nav-label { color: var(--pink); }
        .nav-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--pink); opacity: 0; transition: opacity 0.2s; position: absolute; bottom: calc(var(--nav-h) - 8px + var(--safe-bottom)); }
        .nav-item.active .nav-dot { opacity: 1; }
        .empty-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; gap: 16px; text-align: center; padding: 32px; }
        .empty-icon { font-size: 72px; animation: sway 3s ease-in-out infinite; }
        .empty-title { font-size: 22px; font-weight: 900; color: var(--text); line-height: 1.3; }
        .empty-sub { font-size: 14px; color: var(--text2); line-height: 1.6; max-width: 260px; }
        .btn-primary { background: var(--pink); color: white; border: none; border-radius: var(--radius); padding: 15px 28px; font-family: var(--font); font-size: 15px; font-weight: 800; cursor: pointer; width: 100%; transition: all 0.15s; -webkit-tap-highlight-color: transparent; }
        .btn-primary:active { transform: scale(0.97); background: #FF7A9E; }
        .btn-outline { background: transparent; color: var(--pink); border: 2px dashed var(--pink-border); border-radius: var(--radius); padding: 14px 20px; font-family: var(--font); font-size: 14px; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.15s; -webkit-tap-highlight-color: transparent; }
        .btn-outline:active { background: var(--pink-pale); }
        .btn-outline.disabled { color: var(--text3); border-color: var(--border); cursor: default; }
        .page-header { padding: 16px 0 12px; }
        .page-title { font-size: 26px; font-weight: 900; color: var(--text); letter-spacing: -0.02em; }
        .page-sub { font-size: 13px; color: var(--text2); margin-top: 2px; font-weight: 500; }
        .patient-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .patient-card { background: var(--surface); border-radius: var(--radius); box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; animation: slideDown 0.3s forwards; opacity: 0; }
        .patient-card:active { transform: scale(0.98); box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .card-inner { display: flex; }
        .card-stripe { width: 5px; flex-shrink: 0; background: var(--pink-light); }
        .card-stripe.active { background: var(--pink); }
        .card-stripe.waiting { background: var(--yellow); }
        .card-stripe.closed { background: var(--border); }
        .card-stripe.alien { background: linear-gradient(180deg, #A78BFA, #C4B5FD); animation: alienGlow 3s ease-in-out infinite; }
        @keyframes alienGlow { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .card-body { padding: 14px 14px 14px 12px; flex: 1; }
        .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 6px; }
        .card-name { font-size: 16px; font-weight: 800; color: var(--text); }
        .card-age { font-size: 13px; color: var(--text2); font-weight: 500; }
        .card-tag { display: inline-flex; align-items: center; gap: 4px; background: var(--pink-pale); color: var(--pink); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.01em; flex-shrink: 0; }
        .card-tag.alien { background: #F3F0FF; color: #7C3AED; }
        .card-complaint { font-size: 13px; color: var(--text2); font-style: italic; margin-bottom: 10px; line-height: 1.4; }
        .card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
        .card-meta-item { font-size: 11px; color: var(--text3); font-weight: 600; display: flex; align-items: center; gap: 3px; }
        .card-meta-item.has-results { color: var(--green); }
        .card-btn { width: 100%; background: var(--pink); color: white; border: none; border-radius: var(--radius-sm); padding: 10px; font-family: var(--font); font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.15s; -webkit-tap-highlight-color: transparent; }
        .card-btn:active { background: #FF7A9E; transform: scale(0.98); }
        .card-btn.secondary { background: var(--surface2); color: var(--text2); }
        .section-label { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text3); margin: 20px 0 10px; }
        .panel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 100; opacity: 0; transition: opacity 0.25s; pointer-events: none; }
        .panel-overlay.visible { opacity: 1; pointer-events: all; }
        .panel { position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg); border-radius: 24px 24px 0 0; z-index: 101; padding: 0 16px 40px; max-height: 90vh; overflow-y: auto; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
        .panel.open { transform: translateY(0); }
        .panel::-webkit-scrollbar { width: 0; }
        .panel-handle { width: 40px; height: 4px; background: var(--border); border-radius: 2px; margin: 12px auto 16px; }
        .panel-header { margin-bottom: 16px; }
        .panel-name { font-size: 22px; font-weight: 900; color: var(--text); letter-spacing: -0.02em; }
        .panel-sub { font-size: 13px; color: var(--text2); margin-top: 2px; font-weight: 500; }
        .status-badge { display: inline-flex; align-items: center; gap: 5px; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; }
        .status-badge.active { background: var(--pink-pale); color: var(--pink); }
        .status-badge.closed { background: var(--surface2); color: var(--text3); }
        .status-badge.alien { background: #F3F0FF; color: #7C3AED; }
        .panel-section { margin-bottom: 20px; }
        .panel-section-title { font-size: 10px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text3); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
        .panel-section-title::after { content: ""; flex: 1; height: 1px; background: var(--border); }
        .cons-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface); border-radius: var(--radius-sm); margin-bottom: 6px; border: 1px solid var(--border); }
        .cons-num { font-size: 13px; font-weight: 700; }
        .cons-date { font-size: 12px; color: var(--text3); }
        .cons-stars { font-size: 13px; }
        .test-item { background: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 8px; overflow: hidden; }
        .test-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .test-name { font-size: 13px; font-weight: 700; }
        .test-body { padding: 0 14px; max-height: 0; overflow: hidden; transition: max-height 0.2s, padding 0.2s; font-size: 12px; color: var(--text2); line-height: 1.6; font-family: 'Courier New', monospace; background: var(--surface2); }
        .test-item.open .test-body { max-height: 300px; padding: 10px 14px 14px; }
        .test-arrow { font-size: 12px; color: var(--text3); transition: transform 0.2s; }
        .test-item.open .test-arrow { transform: rotate(180deg); }
        .feedback-block { border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 8px; }
        .feedback-block.good { background: var(--green-pale); }
        .feedback-block.missed { background: var(--yellow-pale); }
        .feedback-block.error { background: var(--coral-pale); }
        .feedback-icon { font-size: 14px; margin-right: 6px; }
        .feedback-text { font-size: 13px; line-height: 1.5; }
        .feedback-text strong { font-weight: 700; }
        .stars-row { display: flex; gap: 3px; align-items: center; margin-bottom: 12px; }
        .star { font-size: 18px; transition: transform 0.2s; }
        .star.filled { animation: starPop 0.2s ease; }
        @keyframes starPop { 0% { transform: scale(0); } 70% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .rating-num { font-size: 22px; font-weight: 900; color: var(--text); margin-left: 8px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .stat-card { background: var(--surface); border-radius: var(--radius-sm); padding: 16px 14px; border: 1px solid var(--border); text-align: center; }
        .stat-val { font-size: 28px; font-weight: 900; color: var(--text); line-height: 1; margin-bottom: 4px; }
        .stat-val.pink { color: var(--pink); }
        .stat-val.coral { color: var(--coral); }
        .stat-label { font-size: 11px; color: var(--text3); font-weight: 600; }
        .strengths-list, .weak-list { list-style: none; padding: 0; }
        .strengths-list li, .weak-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--text2); line-height: 1.5; padding: 6px 0; }
        .strengths-list li::before { content: "💚"; flex-shrink: 0; }
        .weak-list li::before { content: "⚠️"; flex-shrink: 0; }
        .rec-chip { display: inline-block; background: var(--pink-pale); color: var(--pink); border-radius: var(--radius-sm); padding: 6px 14px; font-size: 12px; font-weight: 700; margin: 4px 4px 0 0; }
        .closed-item { background: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 12px 14px; margin-bottom: 8px; }
        .closed-name { font-size: 14px; font-weight: 800; }
        .closed-diag { font-size: 12px; color: var(--text2); margin: 2px 0 6px; }
        .outcome-badge { display: inline-block; border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; }
        .outcome-badge.good { background: var(--green-pale); color: var(--green); }
        .outcome-badge.bad { background: var(--coral-pale); color: var(--coral); }
        .outcome-badge.neutral { background: var(--surface2); color: var(--text3); }
      `}</style>
      <HMDProfileContent />
            <div className="loading-screen" id="loading">
        <div className="loading-logo">🏥</div>
        <div className="loading-title">Help me, Doctor</div>
        <div className="loading-sub">Загружаем кабинет...</div>
        <div className="spinner"></div>
      </div>

      <div className="panel-overlay" id="panel-overlay"></div>
      <div className="panel" id="patient-panel">
        <div className="panel-handle"></div>
        <div id="panel-content"></div>
      </div>

      <div className="screen active" id="screen-patients">
        <div className="page-header">
          <div className="page-title" id="patients-title">Пациенты</div>
          <div className="page-sub" id="patients-sub"></div>
        </div>
        <div id="patients-list"></div>
      </div>

      <div className="screen" id="screen-profile">
        <div className="page-header"><div className="page-title">Мой профиль</div></div>
        <div id="profile-content"></div>
      </div>

      <div className="screen" id="screen-tests">
        <div className="page-header">
          <div className="page-title">Тарифы</div>
          <div className="page-sub">Подписка на безлимит</div>
        </div>
        <div id="tests-content"></div>
      </div>

      <nav>
        <div className="nav-item active" id="nav-patients" onClick={() => (window as any).showScreen('patients')}>
          <div className="nav-dot" id="dot-patients"></div>
          <div className="nav-icon">🏥</div>
          <div className="nav-label">Пациенты</div>
        </div>
        <div className="nav-item" id="nav-profile" onClick={() => (window as any).showScreen('profile')}>
          <div className="nav-dot" id="dot-profile"></div>
          <div className="nav-icon">👤</div>
          <div className="nav-label">Профиль</div>
        </div>
        <div className="nav-item" id="nav-tests" onClick={() => (window as any).showScreen('tests')}>
          <div className="nav-dot" id="dot-tests"></div>
          <div className="nav-icon">💎</div>
          <div className="nav-label">Тарифы</div>
        </div>
      </nav>
    </>
  );
}
