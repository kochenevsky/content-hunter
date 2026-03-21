'use client';

import { useEffect } from 'react';

export default function WFProfile() {
  useEffect(() => {
  const tgScript = document.createElement('script');
  tgScript.src = 'https://telegram.org/js/telegram-web-app.js';
  tgScript.async = true;
  document.head.appendChild(tgScript);
}, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --pink: #ff2d78; --pink-dim: rgba(255,45,120,0.15);
          --bg: #0d0d0d; --surface: #1a1a1a; --surface2: #222222; --border: rgba(255,255,255,0.07);
          --text: #ffffff; --muted: #666666; --muted2: #444444;
          --font-head: 'Unbounded', sans-serif;
          --font-body: 'Raleway', sans-serif;
          --safe-bottom: env(safe-area-inset-bottom, 0px); --nav-height: 64px;
        }
        html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }
        .bg-glow { position: fixed; top: -120px; left: 50%; transform: translateX(-50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,45,120,0.12) 0%, transparent 70%); pointer-events: none; z-index: 0; }
        .screen { position: fixed; inset: 0; bottom: calc(var(--nav-height) + var(--safe-bottom)); overflow-y: auto; overflow-x: hidden; padding: 24px 16px; padding-top: max(24px, env(safe-area-inset-top)); display: none; z-index: 1; -webkit-overflow-scrolling: touch; }
        .screen.active { display: block; }
        nav { position: fixed; bottom: 0; left: 0; right: 0; height: calc(var(--nav-height) + var(--safe-bottom)); padding-bottom: var(--safe-bottom); background: rgba(13,13,13,0.95); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; z-index: 50; }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: pointer; position: relative; transition: opacity 0.2s; -webkit-tap-highlight-color: transparent; }
        .nav-item.locked { opacity: 0.3; cursor: default; }
        .nav-icon { font-size: 20px; line-height: 1; transition: transform 0.2s; }
        .nav-item.active .nav-icon { transform: scale(1.15); }
        .nav-label { font-size: 8px; font-weight: 600; letter-spacing: 0.05em; color: var(--muted); transition: color 0.2s; }
        .nav-item.active .nav-label { color: var(--pink); }
        .nav-pip { position: absolute; top: 8px; width: 4px; height: 4px; border-radius: 50%; background: var(--pink); opacity: 0; transition: opacity 0.2s; }
        .nav-item.active .nav-pip { opacity: 1; }
        .loading-screen { position: fixed; inset: 0; background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; z-index: 200; transition: opacity 0.4s; }
        .loading-screen.hidden { opacity: 0; pointer-events: none; }
        .loading-logo { font-size: 13px; font-weight: 800; color: var(--text); }
        .loading-logo span { color: var(--pink); }
        .loader { width: 32px; height: 32px; border: 2px solid var(--surface2); border-top-color: var(--pink); border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .section-label { font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
        .profile-hero { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 16px; position: relative; overflow: hidden; }
        .profile-hero::before { content: ''; position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; background: radial-gradient(circle, var(--pink-dim) 0%, transparent 70%); pointer-events: none; }
        .profile-name { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }
        .profile-level { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; color: var(--pink); margin-bottom: 16px; }
        .progress-bar { height: 3px; background: var(--surface2); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--pink), #ff6b9d); border-radius: 2px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .progress-hint { font-size: 10px; color: var(--muted); font-weight: 300; }
        .sub-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--pink-dim); border: 1px solid rgba(255,45,120,0.2); border-radius: 8px; padding: 6px 10px; font-size: 11px; font-weight: 600; color: var(--pink); margin-top: 12px; }
        .sub-badge.inactive { background: var(--surface2); border-color: var(--border); color: var(--muted); }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 10px; text-align: center; }
        .stat-val { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 10px; color: var(--muted); font-weight: 500; }
        .actions-wrap { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .action-btn { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; color: var(--text); font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; transition: all 0.15s; -webkit-tap-highlight-color: transparent; display: flex; align-items: center; gap: 8px; }
        .action-btn:active { transform: scale(0.97); background: var(--surface2); }
        .action-btn.primary { background: var(--pink); border-color: var(--pink); color: white; grid-column: span 2; justify-content: center; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; padding: 16px; }
        .action-btn.primary:active { background: #e0245f; }
        .ach-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 20px; margin-bottom: 16px; }
        .ach-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .ach-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 6px 12px; font-size: 12px; font-weight: 500; }
        .ach-chip.earned { background: var(--pink-dim); border-color: rgba(255,45,120,0.25); }
        .ach-chip.locked-ach { opacity: 0.35; font-size: 11px; }
        .ach-divider { width: 100%; height: 1px; background: var(--border); margin: 10px 0; }
        .ach-locked-label { font-size: 9px; color: var(--muted2); letter-spacing: 0.15em; text-transform: uppercase; width: 100%; margin-bottom: 6px; }
        .ach-empty { font-size: 12px; color: var(--muted); font-style: italic; }
        .subs-header { margin-bottom: 20px; }
        .subs-title { font-size: 20px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; }
        .subs-sub { font-size: 12px; color: var(--muted); line-height: 1.5; }
        .subs-limit-notice { background: rgba(255,45,120,0.1); border: 1px solid rgba(255,45,120,0.3); border-radius: 14px; padding: 14px 16px; margin-bottom: 16px; font-size: 13px; line-height: 1.5; }
        .subs-limit-notice strong { color: var(--pink); display: block; margin-bottom: 4px; font-size: 12px; }
        .subs-features { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 4px 20px; margin-bottom: 20px; }
        .subs-feature { display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 13px; border-bottom: 1px solid var(--border); }
        .subs-feature:last-child { border-bottom: none; }
        .subs-feature-icon { color: var(--pink); font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
        .subs-plans { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .plan-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; cursor: pointer; transition: all 0.15s; -webkit-tap-highlight-color: transparent; display: flex; align-items: center; justify-content: space-between; }
        .plan-card:active { transform: scale(0.98); border-color: var(--pink); }
        .plan-card.featured { border-color: rgba(255,45,120,0.5); background: linear-gradient(135deg, var(--surface), rgba(255,45,120,0.06)); }
        .plan-badge { font-size: 8px; font-weight: 700; letter-spacing: 0.15em; color: var(--pink); margin-bottom: 6px; }
        .plan-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
        .plan-desc { font-size: 11px; color: var(--muted); }
        .plan-price { font-size: 22px; font-weight: 800; color: var(--pink); line-height: 1; }
        .plan-price-sub { font-size: 10px; color: var(--muted); text-align: right; margin-top: 2px; }
        .rating-header { margin-bottom: 20px; }
        .rating-title { font-size: 20px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }
        .rating-sub { font-size: 12px; color: var(--muted); }
        .rating-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .rating-item { display: flex; align-items: center; gap: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; animation: fadeUp 0.3s forwards; opacity: 0; }
        .rating-item.me { border-color: rgba(255,45,120,0.4); background: linear-gradient(135deg, var(--surface), rgba(255,45,120,0.05)); }
        .rating-rank { font-size: 14px; font-weight: 800; width: 28px; text-align: center; flex-shrink: 0; color: var(--muted); }
        .rating-name { flex: 1; font-size: 14px; font-weight: 600; }
        .rating-score { font-size: 12px; font-weight: 700; color: var(--pink); white-space: nowrap; }
        .rating-me-badge { font-size: 8px; font-weight: 600; letter-spacing: 0.1em; color: var(--pink); background: var(--pink-dim); border-radius: 4px; padding: 2px 6px; margin-left: 4px; }
        .rating-myplace { background: var(--surface); border: 1px solid rgba(255,45,120,0.3); border-radius: 14px; padding: 16px; text-align: center; font-size: 13px; color: var(--muted); margin-top: 4px; }
        .rating-myplace strong { color: var(--pink); font-size: 20px; font-weight: 800; display: block; margin: 4px 0; }
        .rating-update-note { font-size: 11px; color: var(--muted2); text-align: center; margin-top: 12px; padding-bottom: 8px; }
        .screen::-webkit-scrollbar { width: 0; }
      `}</style>

      <div className="bg-glow"></div>
      <div className="loading-screen" id="loading">
        <div className="loading-logo">Whata<span>Faaanfik</span></div>
        <div className="loader"></div>
      </div>

      <div className="screen active" id="screen-profile">
        <div className="profile-hero">
          <div className="profile-name" id="prof-name">—</div>
          <div className="profile-level" id="prof-level">НОВИЧОК</div>
          <div className="progress-bar"><div className="progress-fill" id="prof-progress" style={{width:'0%'}}></div></div>
          <div className="progress-hint" id="prof-progress-hint"></div>
          <div id="prof-sub"></div>
        </div>
        <div className="stats-row">
          <div className="stat-card"><div className="stat-val" id="stat-fanfics">0</div><div className="stat-label">фанфиков</div></div>
          <div className="stat-card"><div className="stat-val" id="stat-achs">0</div><div className="stat-label">достижений</div></div>
          <div className="stat-card"><div className="stat-val" id="stat-refs">0</div><div className="stat-label">друзей</div></div>
        </div>
        <div className="section-label">Действия</div>
        <div className="actions-wrap">
          <div className="action-row">
            <button className="action-btn primary" onClick={() => (window as any).handleFanficAction('new_fanfic')}>✨ Новый фанфик</button>
          </div>
          <div className="action-row">
            <button className="action-btn" onClick={() => (window as any).handleFanficAction('random_fanfic')}>🎲 Рандом</button>
            <button className="action-btn" onClick={() => (window as any).handleFanficAction('continue_fanfic')}>📖 Продолжить</button>
          </div>
        </div>
        <div className="section-label">Достижения</div>
        <div className="ach-wrap"><div className="ach-grid" id="ach-grid"><div className="ach-empty">Загрузка...</div></div></div>
      </div>

      <div className="screen" id="screen-subs">
        <div className="subs-header">
          <div className="subs-title">👑 Подписка</div>
          <div className="subs-sub">Безлимитные фанфики и эксклюзивные функции</div>
        </div>
        <div id="subs-limit-notice"></div>
        <div className="subs-features">
          <div className="subs-feature"><span className="subs-feature-icon">∞</span>Безлимитные генерации</div>
          <div className="subs-feature"><span className="subs-feature-icon">🎙</span>Голосовые сообщения</div>
          <div className="subs-feature"><span className="subs-feature-icon">📖</span>Увеличенный х3 размер фанфиков</div>
          <div className="subs-feature"><span className="subs-feature-icon">🧠</span>Улучшенная х5 память сюжетов</div>
          <div className="subs-feature"><span className="subs-feature-icon">✦</span>Социальный профиль</div>
          <div className="subs-feature"><span className="subs-feature-icon">📢</span>Доступ к каналу</div>
          <div className="subs-feature"><span className="subs-feature-icon">⚡</span>Новые привилегии <span style={{color:'var(--muted)',fontSize:'11px'}}>(скоро)</span></div>
        </div>
        <div className="subs-plans">
          <div className="plan-card" onClick={() => (window as any).buyPlan('day_unlim')}>
            <div><div className="plan-name">День</div><div className="plan-desc">Попробуй без риска</div></div>
            <div><div className="plan-price">15 ₽</div><div className="plan-price-sub">24 часа</div></div>
          </div>
          <div className="plan-card" onClick={() => (window as any).buyPlan('week_unlim')}>
            <div><div className="plan-name">Неделя</div><div className="plan-desc">Для активных читателей</div></div>
            <div><div className="plan-price">99 ₽</div><div className="plan-price-sub">7 дней</div></div>
          </div>
          <div className="plan-card featured" onClick={() => (window as any).buyPlan('month_unlim')}>
            <div><div className="plan-badge">★ ЛУЧШИЙ ВЫБОР</div><div className="plan-name">Месяц</div><div className="plan-desc">Экономия 10%</div></div>
            <div><div className="plan-price">350 ₽</div><div className="plan-price-sub">30 дней</div></div>
          </div>
          <div className="plan-card" onClick={() => (window as any).buyPlan('year_unlim')}>
            <div><div className="plan-name">Год</div><div className="plan-desc">Экономия 50%</div></div>
            <div><div className="plan-price">2450 ₽</div><div className="plan-price-sub">365 дней</div></div>
          </div>
        </div>
      </div>

      <div className="screen" id="screen-tasks">
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',minHeight:'300px',gap:'12px',textAlign:'center',padding:'40px 24px'}}>
          <div style={{fontSize:'48px',opacity:0.3}}>⚡</div>
          <div style={{fontSize:'16px',fontWeight:700,color:'var(--muted)'}}>Скоро</div>
          <div style={{fontSize:'13px',color:'var(--muted2)',lineHeight:1.5}}>Ежедневные задания<br/>за бонусные генерации</div>
        </div>
      </div>

      <div className="screen" id="screen-rating">
        <div className="rating-header">
          <div className="rating-title">Рейтинг</div>
          <div className="rating-sub">Топ по активности</div>
        </div>
        <div className="rating-list" id="rating-list"><div style={{color:'var(--muted)',fontSize:'13px',padding:'20px 0'}}>Загрузка...</div></div>
        <div id="rating-myplace"></div>
        <div className="rating-update-note">Рейтинг обновляется раз в сутки</div>
      </div>

      <nav>
        <div className="nav-item active" onClick={() => (window as any).showScreen('profile')} id="nav-profile">
          <div className="nav-pip"></div><div className="nav-icon">✦</div><div className="nav-label">Профиль</div>
        </div>
        <div className="nav-item" onClick={() => (window as any).showScreen('subs')} id="nav-subs">
          <div className="nav-pip"></div><div className="nav-icon">👑</div><div className="nav-label">Подписка</div>
        </div>
        <div className="nav-item locked" id="nav-tasks">
          <div className="nav-icon">⚡</div><div className="nav-label">Задания</div>
        </div>
        <div className="nav-item" onClick={() => (window as any).showScreen('rating')} id="nav-rating">
          <div className="nav-pip"></div><div className="nav-icon">★</div><div className="nav-label">Рейтинг</div>
        </div>
      </nav>

      <script dangerouslySetInnerHTML={{ __html: `
        var tg = window.Telegram && window.Telegram.WebApp;
        var myUid = null;
        var ratingLoaded = false;
        var profileData = null;

        var ACH_MAP = {
          beginner:{name:'Начинающий талант',e:'🍀'},universes_10:{name:'10 вселенных',e:'🌈'},
          anime_10:{name:'10 аниме',e:'👻'},cartoons_10:{name:'10 мультфильмов',e:'🥺'},
          games_10:{name:'10 игр',e:'🎨'},heroes_10:{name:'10 про героев',e:'⚡'},
          romance_30:{name:'Сердцеедка',e:'💕'},comedy_30:{name:'Шутник',e:'🎆'},
          drama_30:{name:'Словила печальку',e:'😭'},horror_30:{name:'Бесстрашная',e:'🚨'},
          action_30:{name:'Доменик Торетто',e:'🤕'},referral_5:{name:'Пригласила 5',e:'😵'},
          referral_15:{name:'Пригласила 15',e:'😖'},referral_30:{name:'Пригласила 30',e:'🌪'},
        };

        var LEVELS=[{min:0,name:'НОВИЧОК'},{min:10,name:'НАЧИНАЮЩАЯ'},{min:25,name:'ТИГРИЦА'},
          {min:50,name:'MEDIUM-RARE'},{min:75,name:'НОРМИС'},{min:100,name:'МАСТЕР'},
          {min:150,name:'NERD'},{min:200,name:'ГУРУ'},{min:250,name:'СЕНСЕЙ'},{min:300,name:'ЧЕРНЫЙ ПОЯС'}];

        function getNextLevel(n){for(var i=0;i<LEVELS.length;i++){if(n<LEVELS[i].min)return LEVELS[i];}return null;}
        function getPrevLevelMin(n){var p=0;for(var i=0;i<LEVELS.length;i++){if(n<LEVELS[i].min)return p;p=LEVELS[i].min;}return p;}
        function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

        function showScreen(name){
          document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
          document.querySelectorAll('.nav-item:not(.locked)').forEach(function(n){n.classList.remove('active');});
          document.getElementById('screen-'+name).classList.add('active');
          var nav=document.getElementById('nav-'+name);
          if(nav)nav.classList.add('active');
          if(name==='rating'&&!ratingLoaded)loadRating();
        }

        function handleFanficAction(action){
          if(!myUid)return;
          if(profileData&&profileData.can_generate===false){
            showScreen('subs');
            document.getElementById('subs-limit-notice').innerHTML='<div class="subs-limit-notice"><strong>Бесплатные генерации закончились</strong>Оформи подписку чтобы продолжить без ограничений.</div>';
            return;
          }
          fetch('/api/wf/action?uid='+myUid+'&action='+action).then(function(){if(tg)tg.close();});
        }

        async function buyPlan(planId){
          if(!myUid)return;
          try{
            var r=await fetch('/api/wf/action?uid='+myUid+'&action=buy_'+planId);
            var d=await r.json();
            if(d.url){if(tg){tg.openLink(d.url);}else{window.open(d.url,'_blank');}}
          }catch(e){alert('Ошибка создания платежа, попробуй позже');}
        }

        function initApp(){
          tg=window.Telegram&&window.Telegram.WebApp;
          if(tg){tg.ready();tg.expand();tg.setHeaderColor('#0d0d0d');tg.setBackgroundColor('#0d0d0d');}
          loadProfile();
        }

        async function loadProfile(){
          try{
            var uid=tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;
            if(!uid)uid=new URLSearchParams(window.location.search).get('uid');
            if(!uid){showError('Открой через Telegram бот');return;}
            myUid=uid;
            var r=await fetch('/api/wf/profile?uid='+uid+'&init='+encodeURIComponent((tg&&tg.initData)||''));
            if(!r.ok)throw new Error('failed');
            var d=await r.json();
            profileData=d;
            renderProfile(d);
          }catch(e){showError('Ошибка загрузки');}
          finally{document.getElementById('loading').classList.add('hidden');}
        }

        function renderProfile(d){
          document.getElementById('prof-name').textContent=d.name||'Пользователь';
          document.getElementById('prof-level').textContent=d.level||'НОВИЧОК';
          var fanfics=d.total_fanfics||0;
          var next=getNextLevel(fanfics);
          var prevMin=getPrevLevelMin(fanfics);
          if(next){
            document.getElementById('prof-progress').style.width=Math.round((fanfics-prevMin)/(next.min-prevMin)*100)+'%';
            document.getElementById('prof-progress-hint').textContent='До '+next.name+' — ещё '+(next.min-fanfics)+' фанфиков';
          }else{
            document.getElementById('prof-progress').style.width='100%';
            document.getElementById('prof-progress-hint').textContent='Максимальный уровень';
          }
          var subEl=document.getElementById('prof-sub');
          if(d.unlimited_until&&Date.now()<d.unlimited_until){
            var till=new Date(d.unlimited_until).toLocaleDateString('ru',{day:'numeric',month:'long'});
            subEl.innerHTML='<div class="sub-badge">👑 Подписка до '+till+'</div>';
          }else{
            subEl.innerHTML='<div class="sub-badge inactive">Бесплатный тариф</div>';
          }
          var achs=d.achievements||[];
          document.getElementById('stat-fanfics').textContent=fanfics;
          document.getElementById('stat-achs').textContent=achs.length;
          document.getElementById('stat-refs').textContent=d.referrals_count||0;
          var earnedHtml='',lockedHtml='';
          Object.keys(ACH_MAP).forEach(function(key){
            var a=ACH_MAP[key];
            if(achs.indexOf(key)!==-1){earnedHtml+='<div class="ach-chip earned">'+a.e+' '+a.name+'</div>';}
            else{lockedHtml+='<div class="ach-chip locked-ach">🔒 '+a.name+'</div>';}
          });
          var html='';
          if(!earnedHtml)html+='<div class="ach-empty">Пока нет достижений — создай первый фанфик!</div>';
          else html+=earnedHtml;
          if(lockedHtml)html+='<div class="ach-divider"></div><div class="ach-locked-label">Ещё не получены</div>'+lockedHtml;
          document.getElementById('ach-grid').innerHTML=html;
        }

        async function loadRating(){
          var listEl=document.getElementById('rating-list');
          var myPlaceEl=document.getElementById('rating-myplace');
          try{
            var r=await fetch('/api/wf/rating'+(myUid?'?uid='+myUid:''));
            if(!r.ok)throw new Error();
            var d=await r.json();
            ratingLoaded=true;
            var html='';
            for(var i=0;i<d.top.length;i++){
              var u=d.top[i];
              var rankText=i===0?'🥇':i===1?'🥈':i===2?'🥉':String(i+1);
              var isMe=u.uid===String(myUid);
              var score=Math.round(u.score||0);
              html+='<div class="rating-item'+(isMe?' me':'')+'" style="animation-delay:'+(i*0.05)+'s">';
              html+='<div class="rating-rank">'+rankText+'</div>';
              html+='<div class="rating-name">'+esc(u.name)+(isMe?' <span class="rating-me-badge">ТЫ</span>':'')+' </div>';
              html+='<div class="rating-score">'+score+' оч.</div>';
              html+='</div>';
            }
            listEl.innerHTML=html;
            var inTop=d.top.some(function(u){return u.uid===String(myUid);});
            if(!inTop&&d.my_place){
              myPlaceEl.innerHTML='<div class="rating-myplace">Твоё место<strong>#'+d.my_place+'</strong><span style="color:var(--muted);font-size:12px">'+Math.round(d.my_score||0)+' оч.</span></div>';
            }
          }catch(e){
            listEl.innerHTML='<div style="color:var(--muted);font-size:13px;padding:20px 0">Не удалось загрузить</div>';
          }
        }

        function showError(msg){document.getElementById('loading').classList.add('hidden');document.getElementById('prof-name').textContent=msg;}
        window.showScreen = showScreen;
        window.showScreen=showScreen;
        window.handleFanficAction=handleFanficAction;
        window.buyPlan=buyPlan;
        window.initApp = initApp;
        if (window.Telegram && window.Telegram.WebApp) {
          initApp();
        } else {
          // Ждём загрузки скрипта через polling
          var _tgCheck = setInterval(function() {
            if (window.Telegram && window.Telegram.WebApp) {
              clearInterval(_tgCheck);
              initApp();
            }
          }, 50);
          // Таймаут — если через 3 секунды tg не появился, запускаем без него
          setTimeout(function() {
            clearInterval(_tgCheck);
            if (!myUid) initApp();
          }, 3000);
        }
      `}} />
    </>
  );
}
