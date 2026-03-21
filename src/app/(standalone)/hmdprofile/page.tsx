'use client';

import { useEffect } from 'react';

export default function HMDProfile() {
  useEffect(() => {
    const tgScript = document.createElement('script');
    tgScript.src = 'https://telegram.org/js/telegram-web-app.js';
    tgScript.onload = () => {
      if ((window as any).initApp) (window as any).initApp();
    };
    document.head.appendChild(tgScript);
    if ((window as any).Telegram?.WebApp && (window as any).initApp) {
      (window as any).initApp();
    }
  }, []);

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
          <div className="page-title">Тесты</div>
          <div className="page-sub">По завершённым пациентам</div>
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
          <div className="nav-icon">📝</div>
          <div className="nav-label">Тесты</div>
        </div>
      </nav>

      <script dangerouslySetInnerHTML={{ __html: `
        var tg = window.Telegram && window.Telegram.WebApp;
        var myUid = null;
        var myProfile = null;
        var myPatients = [];
        var myTests = [];
        var currentScreen = 'patients';

        function api(path) {
          return '/api/hmd' + path;
        }

        function esc(s) {
          return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }

        function hide(id) {
          var el = document.getElementById(id);
          if (el) el.classList.add('hidden');
        }

        function showScreen(name) {
          document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
          document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
          document.getElementById('screen-' + name).classList.add('active');
          document.getElementById('nav-' + name).classList.add('active');
          currentScreen = name;
        }

        function showUnregistered() {
          hide('loading');
          document.getElementById('patients-list').innerHTML =
            '<div class="empty-screen">' +
              '<div class="empty-icon">🏥</div>' +
              '<div class="empty-title">Help me, Doctor \uD83D\uDC69\u200D\u2695\uFE0F</div>' +
              '<div class="empty-sub">Пройдите регистрацию чтобы начать принимать пациентов</div>' +
              '<button class="btn-primary" style="max-width:260px;margin-top:8px" onclick="if(tg)tg.close()">Пройти регистрацию</button>' +
            '</div>';
        }

        async function initApp() {
          tg = window.Telegram && window.Telegram.WebApp;
          if (tg) { tg.ready(); tg.expand(); }
          try {
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
              myUid = String(tg.initDataUnsafe.user.id);
            } else {
              myUid = new URLSearchParams(location.search).get('uid');
            }
            if (!myUid) { showUnregistered(); return; }

            var results = await Promise.all([
              fetch(api('/mini-app/profile?uid=' + myUid)),
              fetch(api('/mini-app/patients?uid=' + myUid)),
              fetch(api('/mini-app/tests?uid=' + myUid)),
            ]);

            var prof = await results[0].json();
            if (prof.not_registered) { showUnregistered(); return; }
            myProfile = prof;
            myPatients = await results[1].json();
            myTests = await results[2].json();

            renderPatients();
            renderProfile();
            renderTests();
            hide('loading');
          } catch(e) {
            console.error(e);
            hide('loading');
            showUnregistered();
          }
        }

        function renderPatients() {
          var active = myPatients.filter(function(p) { return p.status !== 'closed'; });
          var closed = myPatients
            .filter(function(p) { return p.status === 'closed'; })
            .sort(function(a,b) { return (b.closed_at||0)-(a.closed_at||0); });

          document.getElementById('patients-title').textContent = 'Пациенты';
          document.getElementById('patients-sub').textContent =
            active.length ? active.length + ' активн' + (active.length === 1 ? 'ый' : 'ых') : 'Нет активных';

          var html = '';
          if (active.length === 0) {
            html += '<div style="text-align:center;padding:32px 20px;color:var(--text3)">' +
              '<div style="font-size:48px;margin-bottom:12px">🩺</div>' +
              '<div style="font-size:15px;font-weight:700;margin-bottom:6px">Очередь пуста</div>' +
              '<div style="font-size:13px">Примите нового пациента чтобы начать</div>' +
              '</div>';
          }

          active.forEach(function(p, i) { html += patientCard(p, i, false); });

          var canAdd = active.length < 6;
          html += '<div style="margin-top:8px;margin-bottom:24px">' +
            '<button class="btn-outline ' + (canAdd?'':'disabled') + '" onclick="' + (canAdd?'newPatient()':'') + '">' +
            (canAdd ? '+ Принять нового пациента' : '🔒 Максимум 6 пациентов') +
            '</button></div>';

          if (closed.length) {
            html += '<div class="section-label">Завершённые</div>';
            closed.forEach(function(p, i) { html += patientCard(p, active.length + i, true); });
          }

          document.getElementById('patients-list').innerHTML = html;
          document.querySelectorAll('.patient-card').forEach(function(el, i) {
            el.style.animationDelay = (i * 0.06) + 's';
          });
        }

        function patientCard(p, idx, isClosed) {
          var isAlien = p.is_alien;
          var hasResults = (p.test_results || []).length > 0;
          var stripeClass = isAlien ? 'alien' : isClosed ? 'closed' : 'active';
          var tagClass = isAlien ? 'alien' : '';
          var tagText = isAlien ? '👽 Особый' : (p.specialization || '');
          var lastCons = p.consultations && p.consultations.length ? 'Консультаций: ' + p.consultations.length : 'Первичный приём';
          var actionBtn = isClosed
            ? '<div style="display:flex;gap:8px">' +
              '<button class="card-btn secondary" style="flex:1" onclick="openPatient(event,\'' + esc(p.id) + '\')">📋 История</button>' +
              '<button class="card-btn" style="flex:1" onclick="repeatConsultation(event,\'' + esc(p.id) + '\')">🔄 Повторно</button>' +
              '</div>'
            : '<button class="card-btn" onclick="startConsultation(event,\'' + esc(p.id) + '\')">▶️ Начать приём</button>';

          return '<div class="patient-card" onclick="openPatient(event,\'' + esc(p.id) + '\')">' +
            '<div class="card-inner">' +
              '<div class="card-stripe ' + stripeClass + '"></div>' +
              '<div class="card-body">' +
                '<div class="card-top">' +
                  '<div><div class="card-name">' + esc(p.name) + '</div>' +
                  '<div class="card-age">' + esc(String(p.age)) + (isAlien?'':' лет') + ' · ' + (p.sex==='female'?'Жен.':p.sex==='male'?'Муж.':'?') + '</div></div>' +
                  '<div class="card-tag ' + tagClass + '">' + esc(tagText) + '</div>' +
                '</div>' +
                '<div class="card-complaint">' + esc(p.chief_complaint) + '</div>' +
                '<div class="card-meta">' +
                  '<div class="card-meta-item">' + lastCons + '</div>' +
                  (hasResults ? '<div class="card-meta-item has-results">✅ Результаты готовы</div>' : '') +
                '</div>' +
                actionBtn +
              '</div>' +
            '</div>' +
          '</div>';
        }

        function repeatConsultation(event, patId) {
          event.stopPropagation();
          fetch(api('/mini-app/action?uid=' + myUid + '&action=repeat_consultation&pat_id=' + patId));
          if (tg) tg.close();
        }

        function startConsultation(event, patId) {
          event.stopPropagation();
          fetch(api('/mini-app/action?uid=' + myUid + '&action=start_consultation&pat_id=' + patId));
          if (tg) tg.close();
        }

        function newPatient() {
          fetch(api('/mini-app/action?uid=' + myUid + '&action=new_patient'));
          if (tg) tg.close();
        }

        async function openPatient(event, patId) {
          if (event) event.stopPropagation();
          try {
            var r = await fetch(api('/mini-app/patient?id=' + patId));
            var pat = await r.json();
            renderPanel(pat);
            document.getElementById('panel-overlay').classList.add('visible');
            document.getElementById('patient-panel').classList.add('open');
          } catch(e) { console.error(e); }
        }

        function closePanel() {
          document.getElementById('panel-overlay').classList.remove('visible');
          document.getElementById('patient-panel').classList.remove('open');
        }

        document.getElementById('panel-overlay').addEventListener('click', closePanel);

        function renderPanel(pat) {
          var isAlien = pat.is_alien;
          var isClosed = pat.status === 'closed';
          var lastCons = pat.consultations && pat.consultations.length ? pat.consultations[pat.consultations.length-1] : null;
          var tests = pat.test_results || [];
          var rating = lastCons && (lastCons.feedback && lastCons.feedback.rating || lastCons.rating) || 0;
          var starsHtml = rating ? renderStars(rating) : '';

          var testsHtml = tests.length ? tests.map(function(t, i) {
            return '<div class="test-item" id="test-' + i + '">' +
              '<div class="test-header" onclick="toggleTest(' + i + ')">' +
                '<div class="test-name">' + esc(t.test) + '</div>' +
                '<div style="display:flex;align-items:center;gap:6px"><span class="test-check">✅</span><span class="test-arrow">▾</span></div>' +
              '</div>' +
              '<div class="test-body">' + esc(t.result||'') + '</div>' +
              '</div>';
          }).join('') : '<div style="color:var(--text3);font-size:13px">Обследований не назначалось</div>';

          var feedbackHtml = '';
          if (lastCons && lastCons.feedback) {
            var fb = lastCons.feedback;
            if (fb.good && fb.good.length) feedbackHtml += fb.good.map(function(g) {
              return '<div class="feedback-block good"><span class="feedback-icon">✅</span><span class="feedback-text">' + esc(g) + '</span></div>';
            }).join('');
            if (fb.missed && fb.missed.length) feedbackHtml += fb.missed.map(function(m) {
              return '<div class="feedback-block missed"><span class="feedback-icon">⚠️</span><span class="feedback-text">' + esc(m) + '</span></div>';
            }).join('');
            if (fb.errors && fb.errors.length) feedbackHtml += fb.errors.map(function(e) {
              return '<div class="feedback-block error"><span class="feedback-icon">❌</span><span class="feedback-text">' + esc(e) + '</span></div>';
            }).join('');
            if (fb.recommendation) feedbackHtml += '<div class="feedback-block missed" style="margin-top:6px"><span class="feedback-icon">📚</span><span class="feedback-text"><strong>Изучить:</strong> ' + esc(fb.recommendation) + '</span></div>';
            if (fb.missed_opportunity) feedbackHtml += '<div class="feedback-block error" style="margin-top:6px"><span class="feedback-icon">💡</span><span class="feedback-text"><strong>Упущено:</strong> ' + esc(fb.missed_opportunity) + '</span></div>';
          }

          var consListHtml = (pat.consultations||[]).map(function(c, i) {
            return '<div class="cons-item">' +
              '<div><div class="cons-num">Консультация №' + (i+1) + '</div><div class="cons-date">' + formatDate(c.date) + '</div></div>' +
              (c.rating ? '<div class="cons-stars">' + renderStarsSmall(c.rating) + ' ' + c.rating.toFixed(1) + '</div>' : '<div class="cons-stars" style="color:var(--text3);font-size:12px">Анализ...</div>') +
              '</div>';
          }).join('') || '<div style="color:var(--text3);font-size:13px">Консультаций пока не было</div>';

          var statusClass = isClosed ? 'closed' : isAlien ? 'alien' : 'active';
          var statusText = isClosed ? '⚫ Завершён' : isAlien ? '👽 Особый' : '🟢 Активный';

          document.getElementById('panel-content').innerHTML =
            '<div class="panel-header">' +
              '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">' +
                '<div><div class="panel-name">' + esc(pat.name) + '</div>' +
                '<div class="panel-sub">' + esc(String(pat.age)) + (isAlien?'':' лет') + ' · ' + esc(pat.specialization||'') + '</div></div>' +
                '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
              '</div>' +
              '<div style="font-size:13px;color:var(--text2);font-style:italic;margin-top:8px">' + esc(pat.chief_complaint) + '</div>' +
            '</div>' +
            (!isClosed ? '<button class="btn-primary" style="margin-bottom:20px" onclick="startConsultation(event,\'' + esc(pat.id) + '\')">Начать приём</button>' : '') +
            (isClosed ? '<div style="background:var(--pink-pale);border-radius:var(--radius-sm);padding:14px;margin-bottom:20px"><div style="font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--pink);margin-bottom:6px">Истинный диагноз</div><div style="font-size:15px;font-weight:700;color:var(--text)">' + esc(pat.true_diagnosis||'Не установлен') + '</div></div>' : '') +
            (starsHtml ? '<div class="panel-section"><div class="panel-section-title">Последняя оценка</div>' + starsHtml + '</div>' : '') +
            '<div class="panel-section"><div class="panel-section-title">Консультации</div>' + consListHtml + '</div>' +
            '<div class="panel-section"><div class="panel-section-title">Результаты обследований</div>' + testsHtml + '</div>' +
            (feedbackHtml ? '<div class="panel-section"><div class="panel-section-title">Разбор последней консультации</div>' + feedbackHtml + '</div>' : '');
        }

        function toggleTest(i) {
          var el = document.getElementById('test-' + i);
          if (el) el.classList.toggle('open');
        }

        function renderStars(rating) {
          var full = Math.floor(rating);
          var half = rating - full >= 0.5 ? 1 : 0;
          var empty = 5 - full - half;
          var html = '<div class="stars-row">';
          for (var i=0;i<full;i++) html += '<span class="star filled">⭐</span>';
          if (half) html += '<span class="star filled">✨</span>';
          for (var i=0;i<empty;i++) html += '<span class="star">☆</span>';
          html += '<span class="rating-num">' + rating.toFixed(1) + '</span></div>';
          return html;
        }

        function renderStarsSmall(rating) {
          return '⭐'.repeat(Math.min(Math.round(rating), 5));
        }

        function renderXpBar(p) {
          function getXpForLevel(l) { return Math.round(100*l + 5*l*(l-1)); }
          function getTotalXpForLevel(l) { var t=0; for(var i=1;i<l;i++) t+=getXpForLevel(i); return t; }
          var xp = p.xp || 0;
          var level = 1;
          while (level < 200 && xp >= getTotalXpForLevel(level+1)) level++;
          var currentLevelXp = getTotalXpForLevel(level);
          var nextLevelXp = level < 200 ? getTotalXpForLevel(level+1) : null;
          var progress = nextLevelXp ? Math.round(((xp-currentLevelXp)/(nextLevelXp-currentLevelXp))*100) : 100;
          var xpLeft = nextLevelXp ? nextLevelXp - xp : 0;
          return '<div style="margin-top:10px">' +
            '<div style="display:flex;justify-content:space-between;font-size:12px;opacity:0.85;margin-bottom:5px">' +
              '<span style="font-weight:800">Уровень ' + level + '</span>' +
              '<span>' + xp + ' XP' + (nextLevelXp?' · ещё '+xpLeft+' XP':' · макс') + '</span>' +
            '</div>' +
            '<div style="height:8px;background:rgba(255,255,255,0.3);border-radius:4px;overflow:hidden">' +
              '<div style="height:100%;width:' + progress + '%;background:white;border-radius:4px;transition:width 0.5s"></div>' +
            '</div>' +
          '</div>';
        }

        function renderDailyTask(p) {
          var task = p.daily_task;
          var today = new Date().toISOString().slice(0,10);
          if (!task || task.date !== today) {
            return '<div style="width:100%;margin:12px 0">' +
              '<div class="section-label" style="margin:0 0 8px">Задание дня</div>' +
              '<div style="padding:12px;background:var(--surface2);border-radius:var(--radius-sm);font-size:13px;color:var(--text3);text-align:center">Появится после первой консультации</div>' +
              '</div>';
          }
          var pct = task.target > 1 ? Math.round(((task.progress||0)/task.target)*100) : (task.done?100:0);
          var progressBar = !task.done
            ? '<div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-top:10px"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,var(--pink-light),var(--pink));border-radius:3px"></div></div>'
            : '';
          return '<div style="width:100%;margin:12px 0">' +
            '<div class="section-label" style="margin:0 0 8px">Задание дня</div>' +
            '<div style="padding:14px;background:' + (task.done?'var(--green-pale)':'var(--surface)') + ';border-radius:var(--radius-sm);border:1px solid ' + (task.done?'var(--green)':'var(--border)') + '">' +
              '<div style="display:flex;align-items:center;gap:10px">' +
                '<span style="font-size:20px">' + (task.done?'✅':'🎯') + '</span>' +
                '<div style="flex:1">' +
                  '<div style="font-size:14px;font-weight:800;color:' + (task.done?'var(--green)':'var(--text)') + '">' + esc(task.desc) + '</div>' +
                  '<div style="font-size:11px;color:var(--text3);margin-top:2px">+' + task.xp + ' XP · ' + (task.progress||0) + '/' + task.target + '</div>' +
                '</div>' +
              '</div>' + progressBar +
            '</div>' +
          '</div>';
        }

        function declDays(n) {
          var abs = Math.abs(n) % 100; var mod = abs % 10;
          if (abs>=11&&abs<=19) return 'дней';
          if (mod===1) return 'день';
          if (mod>=2&&mod<=4) return 'дня';
          return 'дней';
        }

        function renderProfile() {
          if (!myProfile) return;
          var p = myProfile;
          var initial = (p.name||'Д').charAt(0).toUpperCase();
          var avgRating = p.stats && p.stats.avg_rating || 0;
          var professions = ['Онколог','Терапевт','Кардиолог','Хирург','Педиатр','Невролог','Психиатр','Дерматолог','Анестезиолог','Скорая помощь','Другое'];
          var levelMap = {студент:'🎓 Студент',ординатор:'🩺 Ординатор',врач:'👨‍⚕️ Врач',специалист:'⭐ Специалист'};
          var levelOptions = ['студент','ординатор','врач','специалист'].map(function(l) {
            return '<option value="'+l+'"'+(p.level===l?' selected':'')+'>'+levelMap[l]+'</option>';
          }).join('');
          var profOptions = professions.map(function(pr) {
            return '<option value="'+esc(pr)+'"'+(p.profession===pr?' selected':'')+'>'+esc(pr)+'</option>';
          }).join('');
          var strengths = p.strengths && p.strengths.length
            ? '<div class="section-label" style="margin-top:20px">Сильные стороны</div><ul class="strengths-list">' + p.strengths.slice(0,5).map(function(s){return '<li>'+esc(s)+'</li>';}).join('') + '</ul>' : '';
          var weaknesses = p.weaknesses && p.weaknesses.length
            ? '<div class="section-label" style="margin-top:16px">Слабые стороны</div><ul class="weak-list">' + p.weaknesses.slice(0,5).map(function(w){return '<li>'+esc(w)+'</li>';}).join('') + '</ul>' : '';
          var recs = p.recommendations && p.recommendations.length
            ? '<div class="section-label" style="margin-top:16px">📚 Рекомендации</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">' + p.recommendations.slice(0,5).map(function(r){return '<span class="rec-chip">'+esc(r)+'</span>';}).join('') + '</div>' : '';

          document.getElementById('profile-content').innerHTML =
            '<div style="background:linear-gradient(135deg,#FFB5C8,#FF8FAB);border-radius:var(--radius);padding:24px 20px;margin-bottom:16px;text-align:center;color:white">' +
              '<div style="width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;margin:0 auto 12px">' + esc(initial) + '</div>' +
              '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:4px">' +
                '<div id="prof-name-display" style="font-size:20px;font-weight:900">' + esc(p.name) + '</div>' +
                '<button onclick="toggleEditName()" style="background:rgba(255,255,255,0.25);border:none;border-radius:8px;padding:4px 8px;cursor:pointer;font-size:13px;color:white">✏️</button>' +
              '</div>' +
              '<div id="prof-name-edit" style="display:none;margin-bottom:8px">' +
                '<input id="prof-name-input" value="' + esc(p.name) + '" style="border:2px solid white;border-radius:10px;padding:8px 12px;font-size:15px;font-weight:700;text-align:center;outline:none;width:180px;background:rgba(255,255,255,0.9);color:var(--text)">' +
                '<div style="display:flex;gap:8px;margin-top:8px;justify-content:center">' +
                  '<button onclick="saveName()" style="background:white;color:var(--pink);border:none;border-radius:10px;padding:8px 20px;font-size:13px;font-weight:800;cursor:pointer">Сохранить</button>' +
                  '<button onclick="toggleEditName()" style="background:rgba(255,255,255,0.25);border:none;border-radius:10px;padding:8px 16px;font-size:13px;color:white;cursor:pointer">Отмена</button>' +
                '</div>' +
              '</div>' +
              renderXpBar(p) +
              '<div style="margin-top:8px;font-size:14px;font-weight:700;opacity:0.95">🔥 Стрик: ' + (p.streak||0) + ' ' + declDays(p.streak||0) + ' подряд</div>' +
            '</div>' +
            '<div style="background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:16px;border:1px solid var(--border)">' +
              '<div style="font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">Настройки</div>' +
              '<div style="margin-bottom:14px"><div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px">Уровень подготовки</div>' +
                '<select onchange="saveLevel(this.value)" style="border:1.5px solid var(--pink-border);border-radius:10px;padding:8px 12px;font-size:13px;color:var(--text);background:var(--surface);outline:none;width:100%">' + levelOptions + '</select></div>' +
              '<div><div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px">Специализация</div>' +
                '<select id="prof-profession" onchange="saveProfession(this.value)" style="border:1.5px solid var(--pink-border);border-radius:10px;padding:8px 12px;font-size:13px;color:var(--text);background:var(--surface);outline:none;width:100%">' +
                  '<option value="">— Выбрать —</option>' + profOptions +
                '</select>' +
                '<div id="prof-custom-wrap" style="' + (p.profession==='Другое'?'':'display:none') + ';margin-top:8px">' +
                  '<input id="prof-custom-input" placeholder="Введите специализацию" value="' + esc(p.profession_custom||'') + '" style="border:1.5px solid var(--pink-border);border-radius:10px;padding:8px 12px;font-size:13px;width:100%;outline:none" onblur="saveCustomProfession(this.value)">' +
                '</div>' +
              '</div>' +
            '</div>' +
            renderDailyTask(p) +
            '<div class="stats-grid" style="margin-bottom:16px">' +
              '<div class="stat-card"><div class="stat-val pink">' + (p.stats&&p.stats.patients_total||0) + '</div><div class="stat-label">Пациентов</div></div>' +
              '<div class="stat-card"><div class="stat-val">' + (p.stats&&p.stats.consultations_total||0) + '</div><div class="stat-label">Консультаций</div></div>' +
              '<div class="stat-card"><div class="stat-val pink">' + (avgRating?avgRating.toFixed(1)+' ⭐':'—') + '</div><div class="stat-label">Ср. рейтинг</div></div>' +
              '<div class="stat-card"><div class="stat-val ' + ((p.stats&&p.stats.critical_outcomes||0)>0?'coral':'') + '">' + (p.stats&&p.stats.critical_outcomes||0) + '</div><div class="stat-label">Тяж. исходов</div></div>' +
            '</div>' +
            strengths + weaknesses + recs;
        }

        async function saveLevel(level) {
          await fetch(api('/mini-app/profile/edit?uid=' + myUid), {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({level: level})
          });
          if (myProfile) myProfile.level = level;
        }

        function toggleEditName() {
          var display = document.getElementById('prof-name-display');
          var edit = document.getElementById('prof-name-edit');
          var isHidden = edit.style.display === 'none';
          display.style.display = isHidden ? 'none' : '';
          edit.style.display = isHidden ? 'block' : 'none';
          if (isHidden) document.getElementById('prof-name-input').focus();
        }

        async function saveName() {
          var name = document.getElementById('prof-name-input').value.trim();
          if (!name) return;
          await fetch(api('/mini-app/profile/edit?uid=' + myUid), {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({name: name})
          });
          if (myProfile) myProfile.name = name;
          document.getElementById('prof-name-display').textContent = name;
          toggleEditName();
        }

        async function saveProfession(val) {
          document.getElementById('prof-custom-wrap').style.display = val === 'Другое' ? 'block' : 'none';
          if (val && val !== 'Другое') {
            var specMap = {
              'Онколог':['маммология','онкогинекология','онкоурология','опухоли ЖКТ','опухоли лёгких'],
              'Терапевт':['гастроэнтерология','пульмонология','эндокринология','ревматология'],
              'Кардиолог':['аритмология','ХСН','ИБС','гипертензия'],
              'Хирург':['абдоминальная хирургия','торакальная хирургия','сосудистая хирургия'],
              'Педиатр':['неонатология','детская инфекция','детская кардиология'],
              'Невролог':['инсульт','эпилепсия','нейродегенеративные заболевания'],
              'Психиатр':['депрессия','психоз','тревожные расстройства'],
              'Дерматолог':['дерматиты','онкодерматология','аутоиммунные заболевания кожи'],
              'Анестезиолог':['интенсивная терапия','болевые синдромы','реанимация'],
              'Скорая помощь':['политравма','острые состояния','сердечно-сосудистые катастрофы'],
            };
            var specs = specMap[val] || [val];
            await fetch(api('/mini-app/profile/edit?uid=' + myUid), {
              method: 'POST', headers: {'Content-Type':'application/json'},
              body: JSON.stringify({profession: val, specializations: specs})
            });
            if (myProfile) { myProfile.profession = val; myProfile.specializations = specs; }
          }
        }

        async function saveCustomProfession(val) {
          if (!val.trim()) return;
          await fetch(api('/mini-app/profile/edit?uid=' + myUid), {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({profession: val.trim(), profession_custom: val.trim()})
          });
          if (myProfile) { myProfile.profession = val.trim(); myProfile.profession_custom = val.trim(); }
        }

        function renderTests() {
          var pending = myTests.filter(function(t){return t.status!=='done';});
          var done = myTests.filter(function(t){return t.status==='done';});
          if (!myTests.length) {
            document.getElementById('tests-content').innerHTML =
              '<div style="text-align:center;padding:40px 20px;color:var(--text3)">' +
              '<div style="font-size:48px;margin-bottom:12px">📝</div>' +
              '<div style="font-size:15px;font-weight:700;margin-bottom:6px">Тестов пока нет</div>' +
              '<div style="font-size:13px">После завершения приёма появится тест по ошибкам</div>' +
              '</div>';
            return;
          }
          var html = '';
          if (pending.length) {
            html += '<div class="section-label">Пройти</div>';
            html += pending.map(function(t) {
              return '<div style="background:var(--surface);border-radius:var(--radius);box-shadow:0 2px 12px rgba(0,0,0,0.06);overflow:hidden;margin-bottom:12px">' +
                '<div style="width:100%;height:4px;background:var(--pink)"></div>' +
                '<div style="padding:14px">' +
                  '<div style="font-size:16px;font-weight:800;margin-bottom:4px">' + esc(t.pat_name) + '</div>' +
                  '<div style="font-size:12px;color:var(--text3);margin-bottom:12px">' + esc(t.specialization||'') + ' · 5 вопросов</div>' +
                  '<button class="btn-primary" onclick="startTest(\'' + esc(t.pat_id) + '\')">' + (t.status==='in_progress'?'▶️ Продолжить тест':'📝 Начать тест') + '</button>' +
                '</div></div>';
            }).join('');
          }
          if (done.length) {
            html += '<div class="section-label" style="margin-top:16px">Пройденные</div>';
            html += done.map(function(t) {
              var icons = t.answers ? t.answers.map(function(a){return a.is_correct?'✅':'❌';}).join('') : '';
              var score = t.score || 0;
              var color = score>=4?'var(--green)':score>=3?'var(--yellow)':'var(--coral)';
              return '<div style="background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);margin-bottom:10px;overflow:hidden">' +
                '<div style="width:100%;height:4px;background:var(--border)"></div>' +
                '<div style="padding:14px">' +
                  '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<div><div style="font-size:15px;font-weight:800">' + esc(t.pat_name) + '</div>' +
                    '<div style="font-size:12px;color:var(--text3);margin-top:2px">' + esc(t.specialization||'') + '</div></div>' +
                    '<div style="font-size:22px;font-weight:900;color:' + color + '">' + score + '/5</div>' +
                  '</div>' +
                  '<div style="font-size:16px;margin-top:8px;letter-spacing:2px">' + icons + '</div>' +
                '</div></div>';
            }).join('');
          }
          document.getElementById('tests-content').innerHTML = html;
        }

        function startTest(patId) {
          fetch(api('/mini-app/action?uid=' + myUid + '&action=start_test&pat_id=' + patId));
          if (tg) tg.close();
        }

        function formatDate(ts) {
          if (!ts) return '—';
          var d = new Date(ts); var now = new Date();
          var diff = Math.floor((now-d)/86400000);
          if (diff===0) return 'Сегодня';
          if (diff===1) return 'Вчера';
          return d.toLocaleDateString('ru',{day:'numeric',month:'short'});
        }

        window.showScreen = showScreen;
        window.openPatient = openPatient;
        window.closePanel = closePanel;
        window.startConsultation = startConsultation;
        window.repeatConsultation = repeatConsultation;
        window.newPatient = newPatient;
        window.startTest = startTest;
        window.toggleTest = toggleTest;
        window.toggleEditName = toggleEditName;
        window.saveName = saveName;
        window.saveLevel = saveLevel;
        window.saveProfession = saveProfession;
        window.saveCustomProfession = saveCustomProfession;
        window.initApp = initApp;
      `}} />
    </>
  );
}
