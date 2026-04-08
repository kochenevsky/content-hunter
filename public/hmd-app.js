var tg = null;
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

// ПРОСТЫЕ РАБОЧИЕ ВЕРСИИ ФУНКЦИЙ ОШИБОК

function showNetworkError() {
  console.log('🌐 showNetworkError');
  
  // Скрываем загрузку
  var loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
  
  // Находим контейнер
  var container = document.getElementById('patients-list');
  if (!container) {
    container = document.createElement('div');
    container.id = 'patients-list';
    document.body.appendChild(container);
  }
  
  // Показываем ошибку
  container.innerHTML = '<div style="text-align: center; padding: 50px 20px;">' +
    '<div style="font-size: 48px; margin-bottom: 20px;">🌐</div>' +
    '<div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Не удалось загрузить кабинет</div>' +
    '<div style="font-size: 14px; color: #666; margin-bottom: 20px;">Проверьте интернет-соединение</div>' +
    '<div style="background: #f5f5f5; padding: 15px; border-radius: 10px; margin: 20px auto; max-width: 300px; text-align: left;">' +
      '<div style="font-weight: bold; margin-bottom: 10px;">🔧 Что делать:</div>' +
      '<ul style="margin: 0; padding-left: 20px;">' +
        '<li>Обновите страницу (Ctrl+F5)</li>' +
        '<li>Проверьте интернет</li>' +
        '<li><strong>Если используете VPN</strong> — отключите его</li>' +
        '<li>Или добавьте домен <code>helpmedoctor.oxion-ezhkov.workers.dev</code> в исключения VPN</li>' +
      '</ul>' +
    '</div>' +
    '<button onclick="location.reload()" style="background: #2196f3; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">🔄 Перезагрузить</button>' +
    '</div>';
}

function showTimeoutError() {
  console.log('⏱️ showTimeoutError');
  
  var loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
  
  var container = document.getElementById('patients-list');
  if (!container) {
    container = document.createElement('div');
    container.id = 'patients-list';
    document.body.appendChild(container);
  }
  
  container.innerHTML = '<div style="text-align: center; padding: 50px 20px;">' +
    '<div style="font-size: 48px; margin-bottom: 20px;">⏱️</div>' +
    '<div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Слишком долгая загрузка</div>' +
    '<div style="font-size: 14px; color: #666; margin-bottom: 20px;">Сервер не отвечает</div>' +
    '<button onclick="location.reload()" style="background: #2196f3; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">🔄 Повторить</button>' +
    '</div>';
}

function showUnregistered() {
  console.log('showUnregistered вызвана');
  hide('loading');
  
  let container = document.getElementById('patients-list');
  if (!container) {
    container = document.createElement('div');
    container.id = 'patients-list';
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) activeScreen.appendChild(container);
  }
  
  container.innerHTML = `
    <div class="empty-screen" style="padding: 40px 20px; text-align: center;">
      <div class="empty-icon" style="font-size: 64px; margin-bottom: 16px;">🏥</div>
      <div class="empty-title" style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Help me, Doctor 👩‍⚕️</div>
      <div class="empty-sub" style="font-size: 14px; color: var(--text3); margin-bottom: 20px;">Пройдите регистрацию чтобы начать принимать пациентов</div>
      <button class="btn-primary" style="max-width: 260px; margin: 0 auto;" onclick="if(window.tg) tg.close()">Пройти регистрацию</button>
    </div>
  `;
}

async function initApp() {
  console.log('🚀 initApp started');
  
  // Инициализация Telegram
  tg = window.Telegram && window.Telegram.WebApp;
  if (tg) { 
    tg.ready(); 
    tg.expand(); 
  }
  
  // Получаем UID
  try {
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
      myUid = String(tg.initDataUnsafe.user.id);
    } else {
      myUid = new URLSearchParams(location.search).get('uid');
    }
    
    console.log('📱 UID:', myUid);
    
    if (!myUid) {
      showUnregistered();
      return;
    }
    
    // ПРОСТАЯ ЗАГРУЗКА ДАННЫХ (без лишних проверок Worker'a)
    console.log('📡 Загружаем данные...');
    
    // Создаем таймаут
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏱️ Таймаут сработал');
      controller.abort();
    }, 15000);
    
    let response;
    try {
      response = await fetch(api('/mini-app/init?uid=' + myUid), {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log('📦 Ответ получен, status:', response.status);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ Ошибка запроса:', error);
      
      if (error.name === 'AbortError') {
        showTimeoutError();
      } else {
        showNetworkError();
      }
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Данные получены');
    
    if (data.not_registered) {
      showUnregistered();
      return;
    }
    
    // Сохраняем данные
    myProfile = data.profile;
    myPatients = data.patients;
    myTests = data.tests;
    
    // Рендерим
    renderPatients();
    renderProfile();
    renderTests();
    
    // Показываем нужный экран
    var screenParam = new URLSearchParams(location.search).get('screen');
    if (screenParam) showScreen(screenParam);
    
    // Скрываем загрузку
    hide('loading');
    console.log('🎉 Готово!');
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    showNetworkError();
  }
}

// ---- PATIENTS ----

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
    '<button class="btn-outline ' + (canAdd ? '' : 'disabled') + '" onclick="' + (canAdd ? 'newPatient()' : '') + '">' +
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
  var stripeClass = isAlien ? 'alien' : isClosed ? 'closed' : 'active';
  var tagClass = isAlien ? 'alien' : '';
  var tagText = isAlien ? '👽 Особый' : (p.specialization || '');
  var pid = esc(p.id);

  var cardBody = '';
  if (isClosed) {
    var lastCons = p.consultations && p.consultations.length ? p.consultations[p.consultations.length-1] : null;
    var rating = lastCons ? (lastCons.rating || 0) : 0;
    var stars = rating ? '⭐'.repeat(Math.min(Math.round(rating),5)) + ' ' + rating.toFixed(1) : '—';
    var diag = esc(p.true_diagnosis || 'Диагноз не установлен');

    cardBody =
      '<div class="card-top">' +
        '<div><div class="card-name">' + esc(p.name) + '</div>' +
        '<div class="card-age">' + esc(String(p.age)) + (isAlien?'':' лет') + ' · ' + (p.sex==='female'?'Жен.':p.sex==='male'?'Муж.':'?') + '</div></div>' +
        '<div class="card-tag ' + tagClass + '">' + esc(tagText) + '</div>' +
      '</div>' +
      '<div style="font-size:13px;color:var(--text2);margin-bottom:4px">🔬 ' + diag + '</div>' +
      '<div style="font-size:13px;font-weight:700;margin-bottom:10px">' + stars + '</div>' +
      '<div style="display:flex;gap:8px">' +
        '<button class="card-btn secondary" style="flex:1" onclick="openPatientTest(event,\'' + pid + '\')">📝 Тест</button>' +
        '<button class="card-btn" style="flex:1" onclick="repeatConsultation(event,\'' + pid + '\')">🔄 Заново</button>' +
      '</div>';
  } else {
    var hasResults = (p.test_results || []).length > 0;
    var lastCons = p.consultations && p.consultations.length ? 'Консультаций: ' + p.consultations.length : 'Первичный приём';
    cardBody =
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
      '<button class="card-btn" onclick="startConsultation(event, \'' + pid + '\')">▶️ Начать приём</button>';
  }

  return '<div class="patient-card" onclick="openPatient(event, \'' + pid + '\')">' +
    '<div class="card-inner">' +
      '<div class="card-stripe ' + stripeClass + '"></div>' +
      '<div class="card-body">' + cardBody + '</div>' +
    '</div></div>';
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

// ---- PATIENT PANEL ----

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

function openPatientTest(event, patId) {
  event.stopPropagation();
  fetch(api('/mini-app/action?uid=' + myUid + '&action=start_test&pat_id=' + patId));
  if (tg) tg.close();
}
window.openPatientTest = openPatientTest;

function closePanel() {
  document.getElementById('panel-overlay').classList.remove('visible');
  document.getElementById('patient-panel').classList.remove('open');
}

function renderPanel(pat) {
  var isAlien = pat.is_alien;
  var isClosed = pat.status === 'closed';
  var lastCons = pat.consultations && pat.consultations.length ? pat.consultations[pat.consultations.length - 1] : null;
  var tests = pat.test_results || [];
  var rating = lastCons && (lastCons.feedback && lastCons.feedback.rating || lastCons.rating) || 0;
  var starsHtml = rating ? renderStars(rating) : '';
  var pid = esc(pat.id);

  var testsHtml = tests.length ? tests.map(function(t, i) {
    return '<div class="test-item" id="test-' + i + '">' +
      '<div class="test-header" onclick="toggleTest(' + i + ')">' +
        '<div class="test-name">' + esc(t.test) + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px"><span>✅</span><span class="test-arrow">▾</span></div>' +
      '</div>' +
      '<div class="test-body">' + esc(t.result || '') + '</div>' +
    '</div>';
  }).join('') : '<div style="color:var(--text3);font-size:13px">Обследований не назначалось</div>';

  var feedbackHtml = '';
          if (lastCons && lastCons.feedback) {
            var fb = lastCons.feedback;
            // Новый формат
            if (fb.expert_text) {
              feedbackHtml += '<div class="feedback-block good" style="background:var(--surface2)">' +
                '<div style="font-size:12px;font-weight:800;color:var(--text3);margin-bottom:6px">РАЗБОР ЭКСПЕРТА</div>' +
                '<div class="feedback-text">' + esc(fb.expert_text) + '</div></div>';
            }
            if (fb.dialog_moments && fb.dialog_moments.length) {
              fb.dialog_moments.forEach(function(m) {
                feedbackHtml += '<div class="feedback-block missed">' +
                  '<div style="font-size:12px;font-style:italic;margin-bottom:4px">💬 «' + esc(m.quote) + '»</div>' +
                  '<div class="feedback-text">→ ' + esc(m.comment) + '</div></div>';
              });
            }
            // Старый формат для обратной совместимости
            if (!fb.expert_text) {
              if (fb.good && fb.good.length) feedbackHtml += fb.good.map(function(g) {
                return '<div class="feedback-block good"><span class="feedback-icon">✅</span><span class="feedback-text">' + esc(g) + '</span></div>';
              }).join('');
              if (fb.missed && fb.missed.length) feedbackHtml += fb.missed.map(function(m) {
                return '<div class="feedback-block missed"><span class="feedback-icon">⚠️</span><span class="feedback-text">' + esc(m) + '</span></div>';
              }).join('');
              if (fb.errors && fb.errors.length) feedbackHtml += fb.errors.map(function(e) {
                return '<div class="feedback-block error"><span class="feedback-icon">❌</span><span class="feedback-text">' + esc(e) + '</span></div>';
              }).join('');
            }
            // Оси
            if (fb.axes) {
              var axHtml = '<div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">';
              var axMap = {diagnosis:'🧠 Диагн.',communication:'🗣 Общение',treatment:'💊 Лечение'};
              Object.keys(axMap).forEach(function(k) {
                if (fb.axes[k] !== undefined) {
                  axHtml += '<div style="text-align:center">' +
                    '<div style="font-size:10px;color:var(--text3);font-weight:700">' + axMap[k] + '</div>' +
                    '<div style="font-size:16px">' + '⭐'.repeat(fb.axes[k]) + '☆'.repeat(5-fb.axes[k]) + '</div>' +
                  '</div>';
                }
              });
              axHtml += '</div>';
              feedbackHtml = axHtml + feedbackHtml;
            }
          }

  var consListHtml = (pat.consultations || []).map(function(c, i) {
    return '<div class="cons-item">' +
      '<div><div class="cons-num">Консультация №' + (i + 1) + '</div>' +
      '<div class="cons-date">' + formatDate(c.date) + '</div></div>' +
      (c.rating
        ? '<div class="cons-stars">' + renderStarsSmall(c.rating) + ' ' + c.rating.toFixed(1) + '</div>'
        : '<div class="cons-stars" style="color:var(--text3);font-size:12px">Анализ...</div>') +
    '</div>';
  }).join('') || '<div style="color:var(--text3);font-size:13px">Консультаций пока не было</div>';

  var statusClass = isClosed ? 'closed' : isAlien ? 'alien' : 'active';
  var statusText = isClosed ? '⚫ Завершён' : isAlien ? '👽 Особый' : '🟢 Активный';

  document.getElementById('panel-content').innerHTML =
    '<div class="panel-header">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">' +
        '<div><div class="panel-name">' + esc(pat.name) + '</div>' +
        '<div class="panel-sub">' + esc(String(pat.age)) + (isAlien ? '' : ' лет') + ' · ' + esc(pat.specialization || '') + '</div></div>' +
        '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
      '</div>' +
      '<div style="font-size:13px;color:var(--text2);font-style:italic;margin-top:8px">' + esc(pat.chief_complaint) + '</div>' +
    '</div>' +
    (!isClosed ? '<button class="btn-primary" style="margin-bottom:20px" onclick="startConsultation(event, \'' + pid + '\')">Начать приём</button>' : '') +
    (isClosed ? '<div style="background:var(--pink-pale);border-radius:var(--radius-sm);padding:14px;margin-bottom:20px">' +
      '<div style="font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--pink);margin-bottom:6px">Истинный диагноз</div>' +
      '<div style="font-size:15px;font-weight:700;color:var(--text)">' + esc(pat.true_diagnosis || 'Не установлен') + '</div>' +
    '</div>' : '') +
    (isClosed && pat.post_story ? '<div class="panel-section"><div class="panel-section-title">Что случилось дальше</div><div style="font-size:14px;line-height:1.6;color:var(--text2)">' + esc(pat.post_story) + '</div></div>' : '') +
    (starsHtml ? '<div class="panel-section"><div class="panel-section-title">Jценка</div>' + starsHtml + '</div>' : '') +
    (!isClosed ? '<div class="panel-section"><div class="panel-section-title">Консультации</div>' + consListHtml + '</div>' : '') +
    (!isClosed ? '<div class="panel-section"><div class="panel-section-title">Результаты обследований</div>' + testsHtml + '</div>' : '') +
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
  for (var i = 0; i < full; i++) html += '<span class="star filled">⭐</span>';
  if (half) html += '<span class="star filled">✨</span>';
  for (var i = 0; i < empty; i++) html += '<span class="star">☆</span>';
  html += '<span class="rating-num">' + rating.toFixed(1) + '</span></div>';
  return html;
}

function renderStarsSmall(rating) {
  return '⭐'.repeat(Math.min(Math.round(rating), 5));
}

// ---- PROFILE ----

function renderXpBar(p) {
  function getXpForLevel(l) { return Math.round(100 * l + 5 * l * (l - 1)); }
  function getTotalXpForLevel(l) { var t = 0; for (var i = 1; i < l; i++) t += getXpForLevel(i); return t; }
  var xp = p.xp || 0;
  var level = 1;
  while (level < 200 && xp >= getTotalXpForLevel(level + 1)) level++;
  var currentLevelXp = getTotalXpForLevel(level);
  var nextLevelXp = level < 200 ? getTotalXpForLevel(level + 1) : null;
  var progress = nextLevelXp ? Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100) : 100;
  var xpLeft = nextLevelXp ? nextLevelXp - xp : 0;
  return '<div style="margin-top:10px">' +
    '<div style="display:flex;justify-content:space-between;font-size:12px;opacity:0.85;margin-bottom:5px">' +
      '<span style="font-weight:800">Уровень ' + level + '</span>' +
      '<span>' + xp + ' XP' + (nextLevelXp ? ' · ещё ' + xpLeft + ' XP' : ' · макс') + '</span>' +
    '</div>' +
    '<div style="height:8px;background:rgba(255,255,255,0.3);border-radius:4px;overflow:hidden">' +
      '<div style="height:100%;width:' + progress + '%;background:white;border-radius:4px;transition:width 0.5s"></div>' +
    '</div>' +
  '</div>';
}

function renderDailyTask(p) {
  var task = p.daily_task;
  var today = new Date().toISOString().slice(0, 10);
  if (!task || task.date !== today) {
    return '<div style="width:100%;margin:12px 0">' +
      '<div class="section-label" style="margin:0 0 8px">Задание дня</div>' +
      '<div style="padding:12px;background:var(--surface2);border-radius:var(--radius-sm);font-size:13px;color:var(--text3);text-align:center">Появится после первой консультации</div>' +
    '</div>';
  }
  var pct = task.target > 1 ? Math.round(((task.progress || 0) / task.target) * 100) : (task.done ? 100 : 0);
  var progressBar = !task.done
    ? '<div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-top:10px">' +
      '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,var(--pink-light),var(--pink));border-radius:3px"></div></div>'
    : '';
  return '<div style="width:100%;margin:12px 0">' +
    '<div class="section-label" style="margin:0 0 8px">Задание дня</div>' +
    '<div style="padding:14px;background:' + (task.done ? 'var(--green-pale)' : 'var(--surface)') + ';border-radius:var(--radius-sm);border:1px solid ' + (task.done ? 'var(--green)' : 'var(--border)') + '">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:20px">' + (task.done ? '✅' : '🎯') + '</span>' +
        '<div style="flex:1">' +
          '<div style="font-size:14px;font-weight:800;color:' + (task.done ? 'var(--green)' : 'var(--text)') + '">' + esc(task.desc) + '</div>' +
          '<div style="font-size:11px;color:var(--text3);margin-top:2px">+' + task.xp + ' XP · ' + (task.progress || 0) + '/' + task.target + '</div>' +
        '</div>' +
      '</div>' + progressBar +
    '</div>' +
  '</div>';
}

function declDays(n) {
  var abs = Math.abs(n) % 100;
  var mod = abs % 10;
  if (abs >= 11 && abs <= 19) return 'дней';
  if (mod === 1) return 'день';
  if (mod >= 2 && mod <= 4) return 'дня';
  return 'дней';
}

function renderProfile() {
  if (!myProfile) return;
  var p = myProfile;
  var initial = (p.name || 'Д').charAt(0).toUpperCase();
  var avgRating = p.stats && p.stats.avg_rating || 0;
  var professions = ['Онколог','Терапевт','Кардиолог','Хирург','Педиатр','Невролог','Психиатр','Дерматолог','Анестезиолог','Скорая помощь','Другое'];
  var levelMap = {студент:'🎓 Студент', ординатор:'🩺 Ординатор', врач:'👨‍⚕️ Врач', специалист:'⭐ Специалист'};

  var levelOptions = ['студент','ординатор','врач','специалист'].map(function(l) {
    return '<option value="' + l + '"' + (p.level === l ? ' selected' : '') + '>' + levelMap[l] + '</option>';
  }).join('');

  var profOptions = professions.map(function(pr) {
    return '<option value="' + esc(pr) + '"' + (p.profession === pr ? ' selected' : '') + '>' + esc(pr) + '</option>';
  }).join('');

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
      '<div style="margin-top:8px;font-size:14px;font-weight:700;opacity:0.95">🔥 Стрик: ' + (p.streak || 0) + ' ' + declDays(p.streak || 0) + ' подряд</div>' +
    '</div>' +
    '<div style="background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:16px;border:1px solid var(--border)">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">Настройки</div>' +
      '<div style="margin-bottom:14px">' +
        '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px">Уровень подготовки</div>' +
        '<select onchange="saveLevel(this.value)" style="border:1.5px solid var(--pink-border);border-radius:10px;padding:8px 12px;font-size:13px;color:var(--text);background:var(--surface);outline:none;width:100%">' +
          levelOptions +
        '</select>' +
      '</div>' +
      '<div>' +
        '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px">Специализация</div>' +
        '<select id="prof-profession" onchange="saveProfession(this.value)" style="border:1.5px solid var(--pink-border);border-radius:10px;padding:8px 12px;font-size:13px;color:var(--text);background:var(--surface);outline:none;width:100%">' +
          '<option value="">— Выбрать —</option>' + profOptions +
        '</select>' +
        '<div id="prof-custom-wrap" style="' + (p.profession === 'Другое' ? '' : 'display:none') + ';margin-top:8px">' +
          '<input id="prof-custom-input" placeholder="Введите специализацию" value="' + esc(p.profession_custom || '') + '" style="border:1.5px solid var(--pink-border);border-radius:10px;padding:8px 12px;font-size:13px;width:100%;outline:none" onblur="saveCustomProfession(this.value)">' +
        '</div>' +
      '</div>' +
    '</div>' +
    renderDailyTask(p) +
    '<div class="stats-grid" style="margin-bottom:16px">' +
      '<div class="stat-card"><div class="stat-val pink">' + (p.stats && p.stats.patients_total || 0) + '</div><div class="stat-label">Пациентов</div></div>' +
      '<div class="stat-card"><div class="stat-val">' + (p.stats && p.stats.consultations_total || 0) + '</div><div class="stat-label">Консультаций</div></div>' +
      '<div class="stat-card"><div class="stat-val pink">' + (avgRating ? avgRating.toFixed(1) + ' ⭐' : '—') + '</div><div class="stat-label">Ср. рейтинг</div></div>' +
      '<div class="stat-card"><div class="stat-val ' + ((p.stats && p.stats.critical_outcomes || 0) > 0 ? 'coral' : '') + '">' + (p.stats && p.stats.critical_outcomes || 0) + '</div><div class="stat-label">Тяж. исходов</div></div>' +
    '</div>';
}

async function saveLevel(level) {
  await fetch(api('/mini-app/profile/edit?uid=' + myUid), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level: level })
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name })
  });
  if (myProfile) myProfile.name = name;
  document.getElementById('prof-name-display').textContent = name;
  toggleEditName();
}

async function saveProfession(val) {
  document.getElementById('prof-custom-wrap').style.display = val === 'Другое' ? 'block' : 'none';
  if (val && val !== 'Другое') {
    var specMap = {
      'Онколог': ['маммология','онкогинекология','онкоурология','опухоли ЖКТ','опухоли лёгких'],
      'Терапевт': ['гастроэнтерология','пульмонология','эндокринология','ревматология'],
      'Кардиолог': ['аритмология','ХСН','ИБС','гипертензия'],
      'Хирург': ['абдоминальная хирургия','торакальная хирургия','сосудистая хирургия'],
      'Педиатр': ['неонатология','детская инфекция','детская кардиология'],
      'Невролог': ['инсульт','эпилепсия','нейродегенеративные заболевания'],
      'Психиатр': ['депрессия','психоз','тревожные расстройства'],
      'Дерматолог': ['дерматиты','онкодерматология','аутоиммунные заболевания кожи'],
      'Анестезиолог': ['интенсивная терапия','болевые синдромы','реанимация'],
      'Скорая помощь': ['политравма','острые состояния','сердечно-сосудистые катастрофы'],
    };
    var specs = specMap[val] || [val];
    await fetch(api('/mini-app/profile/edit?uid=' + myUid), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profession: val, specializations: specs })
    });
    if (myProfile) { myProfile.profession = val; myProfile.specializations = specs; }
  }
}

async function saveCustomProfession(val) {
  if (!val.trim()) return;
  await fetch(api('/mini-app/profile/edit?uid=' + myUid), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profession: val.trim(), profession_custom: val.trim() })
  });
  if (myProfile) { myProfile.profession = val.trim(); myProfile.profession_custom = val.trim(); }
}

// ---- TESTS ----

function renderTests() {
  var p = myProfile;
  var hasSub = p && p.sub_until && (p.sub_until === -1 || Date.now() < p.sub_until);
  var subLabel = '';
  if (hasSub) {
    if (p.sub_until === -1) subLabel = 'Навсегда';
    else subLabel = 'до ' + new Date(p.sub_until).toLocaleDateString('ru', {day:'numeric',month:'long'});
  }

  var html = '';

  if (hasSub) {
    html += '<div style="background:linear-gradient(135deg,#FFB5C8,#FF8FAB);border-radius:var(--radius);padding:20px;margin-bottom:16px;color:white;text-align:center">' +
      '<div style="font-size:32px;margin-bottom:8px">💎</div>' +
      '<div style="font-size:18px;font-weight:900;margin-bottom:4px">Подписка активна</div>' +
      '<div style="font-size:14px;opacity:0.9">' + subLabel + '</div>' +
    '</div>';
  } else {
    html += '<div style="background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:16px;border:1px solid var(--border)">' +
      '<div style="font-size:15px;font-weight:800;margin-bottom:6px">Бесплатно</div>' +
      '<div style="font-size:13px;color:var(--text2);line-height:1.5">1 пациент в день. Результаты обследований, разбор приёма, тесты по ошибкам — всё включено.</div>' +
    '</div>';

    var plans = [
      {key:'day',    icon:'☀️', label:'1 день',   price:'30 ₽',   sub:'Попробовать без ограничений'},
      {key:'week',   icon:'📅', label:'1 неделя', price:'150 ₽',  sub:'21 ₽/день'},
      {key:'month',  icon:'🗓', label:'1 месяц',  price:'350 ₽',  sub:'12 ₽/день'},
      {key:'forever',icon:'♾️', label:'Навсегда', price:'1990 ₽', sub:'Единоразово'},
    ];

    plans.forEach(function(plan) {
  html += '<div style="background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;cursor:pointer" onclick="buyPlan(\'' + plan.key + '\')">' +
    '<div style="display:flex;align-items:center;gap:12px">' +
      '<span style="font-size:24px">' + plan.icon + '</span>' +
      '<div>' +
        '<div style="font-size:15px;font-weight:800">' + plan.label + '</div>' +
        '<div style="font-size:12px;color:var(--text3)">' + plan.sub + '</div>' +
      '</div>' +
    '</div>' +
    '<div id="buy-btn-' + plan.key + '" style="background:var(--pink);color:white;border-radius:20px;padding:8px 16px;font-size:14px;font-weight:800">' + plan.price + '</div>' +
  '</div>';
});

  html += '<div style="margin-top:20px;padding:16px;background:var(--surface2);border-radius:var(--radius-sm);text-align:center">' +
    '<div style="font-size:13px;color:var(--text2);margin-bottom:10px">Вопросы по подписке — пишите менеджеру</div>' +
    '<a href="https://t.me/oleg_ezhkov" target="_blank" style="display:inline-flex;align-items:center;gap:8px;background:var(--pink);color:white;border-radius:20px;padding:10px 20px;font-size:14px;font-weight:800;text-decoration:none">' +
      '✈️ Написать Олегу' +
    '</a>' +
  '</div>';

  document.getElementById('tests-content').innerHTML = html;
}
}

async function buyPlan(planKey) {
  var btn = document.getElementById('buy-btn-' + planKey);
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

  try {
    var r = await fetch(api('/mini-app/payment?uid=' + myUid + '&plan=' + planKey));
    var data = await r.json();
    if (data.link) {
      if (tg && tg.openLink) {
        tg.openLink(data.link);
      } else {
        window.open(data.link, '_blank');
      }
    } else {
      alert('Ошибка при создании платежа');
    }
  } catch(e) {
    alert('Ошибка: ' + e.message);
  }

  if (btn) { btn.textContent = getPlanPrice(planKey); btn.disabled = false; }
}

function getPlanPrice(key) {
  var prices = {day:'30 ₽', week:'150 ₽', month:'350 ₽', forever:'1990 ₽'};
  return prices[key] || '';
}

function startTest(patId) {
  fetch(api('/mini-app/action?uid=' + myUid + '&action=start_test&pat_id=' + patId));
  if (tg) tg.close();
}

// ---- HELPERS ----

function formatDate(ts) {
  if (!ts) return '—';
  var d = new Date(ts);
  var now = new Date();
  var diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  return d.toLocaleDateString('ru', { day: 'numeric', month: 'short' });
}

// ---- EXPOSE GLOBALS ----
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
