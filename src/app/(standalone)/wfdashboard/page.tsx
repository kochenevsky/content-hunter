export const metadata = { title: 'WhataFaaanfik Dashboard' };

export default function WFDashboard() {
  return (
    <>
      <script src="https://cdn..." />
      {<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WhataFaaanfik — Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;600;800&family=Golos+Text:wght@400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c27;
    --border: rgba(255,255,255,0.06);
    --accent: #c8ff00;
    --accent2: #ff6b6b;
    --accent3: #6b8cff;
    --text: #f0f0f0;
    --muted: #666680;
    --font-head: 'Unbounded', sans-serif;
    --font-body: 'Golos Text', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
    padding: 40px 24px 80px;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  body::after {
    content: '';
    position: fixed;
    bottom: -100px; right: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(107,140,255,0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .wrap { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

  /* HEADER */
  header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    font-family: var(--font-head);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .logo span {
    color: var(--accent);
    display: block;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-top: 4px;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
    font-family: var(--font-head);
    font-weight: 300;
  }

  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  /* GRID */
  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  /* CARDS */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }

  .card:hover {
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-1px);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }

  .card-label {
    font-family: var(--font-head);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }

  .card-value {
    font-family: var(--font-head);
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--text);
  }

  .card-value.accent { color: var(--accent); }
  .card-value.accent2 { color: var(--accent2); }
  .card-value.accent3 { color: var(--accent3); }

  .card-sub {
    font-size: 12px;
    color: var(--muted);
    margin-top: 8px;
    font-family: var(--font-body);
  }

  .card-accent-line {
    position: absolute;
    bottom: 0; left: 0;
    width: 40%;
    height: 2px;
    background: var(--accent);
    opacity: 0.4;
  }

  /* SECTION TITLE */
  .section-title {
    font-family: var(--font-head);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 32px 0 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* FUNNEL */
  .funnel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .funnel-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .funnel-label {
    font-size: 12px;
    color: var(--muted);
    width: 180px;
    flex-shrink: 0;
  }

  .funnel-bar-wrap {
    flex: 1;
    height: 6px;
    background: var(--surface2);
    border-radius: 3px;
    overflow: hidden;
  }

  .funnel-bar {
    height: 100%;
    border-radius: 3px;
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
  }

  .funnel-val {
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 600;
    width: 60px;
    text-align: right;
    flex-shrink: 0;
  }

  .funnel-pct {
    font-size: 11px;
    color: var(--muted);
    width: 40px;
    text-align: right;
    flex-shrink: 0;
  }

  /* SEGMENTS */
  .segments {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .seg-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--surface2);
    border-radius: 10px;
    border: 1px solid var(--border);
  }

  .seg-name {
    font-size: 13px;
    font-weight: 500;
  }

  .seg-desc {
    font-size: 11px;
    color: var(--muted);
    margin-top: 2px;
  }

  .seg-count {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 700;
  }

  /* TOP TABLE */
  .top-table { width: 100%; border-collapse: collapse; }

  .top-table th {
    font-family: var(--font-head);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    text-align: left;
    padding: 0 0 12px;
    border-bottom: 1px solid var(--border);
  }

  .top-table td {
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    vertical-align: middle;
  }

  .top-table tr:last-child td { border-bottom: none; }

  .rank {
    font-family: var(--font-head);
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    width: 32px;
  }

  .rank.gold { color: #ffd700; }
  .rank.silver { color: #c0c0c0; }
  .rank.bronze { color: #cd7f32; }

  .user-name { font-weight: 500; }

  .user-level {
    font-size: 10px;
    color: var(--muted);
    font-family: var(--font-head);
    font-weight: 300;
    letter-spacing: 0.05em;
  }

  .fanfic-count {
    font-family: var(--font-head);
    font-size: 16px;
    font-weight: 700;
    color: var(--accent);
    text-align: right;
  }

  /* LEVELS */
  .levels-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .level-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .level-name {
    font-family: var(--font-head);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    width: 140px;
    flex-shrink: 0;
  }

  .level-bar-wrap {
    flex: 1;
    height: 4px;
    background: var(--surface2);
    border-radius: 2px;
    overflow: hidden;
  }

  .level-bar {
    height: 100%;
    border-radius: 2px;
    background: var(--accent3);
    transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
  }

  .level-count {
    font-family: var(--font-head);
    font-size: 12px;
    font-weight: 600;
    width: 32px;
    text-align: right;
    flex-shrink: 0;
  }

  /* LOADING */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--muted);
    font-family: var(--font-head);
    font-size: 12px;
    letter-spacing: 0.15em;
  }

  .spinner {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 12px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* REFRESH */
  .refresh-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: var(--font-head);
    font-size: 10px;
    letter-spacing: 0.15em;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .refresh-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* ANIMATE IN */
  .card, .seg-row {
    opacity: 0;
    transform: translateY(12px);
    animation: fadeUp 0.4s forwards;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 600px) {
    .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
    .funnel-label { width: 120px; font-size: 11px; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="logo">
      Analytics
      <span>WhataFaaanfik</span>
    </div>
    <div style="display:flex;align-items:center;gap:16px">
      <button class="refresh-btn" onclick="load()">ОБНОВИТЬ</button>
      <div class="status">
        <div class="status-dot"></div>
        <span id="last-update">загрузка...</span>
      </div>
    </div>
  </header>

  <div id="content">
    <div class="loading"><div class="spinner"></div>ЗАГРУЗКА ДАННЫХ</div>
  </div>
</div>

<script>
async function load() {
  try {
    const r = await fetch('https://morning-wind-dc5e.oxion-ezhkov.workers.dev/dashboard-data');
    const d = await r.json();
    render(d);
    document.getElementById('last-update').textContent =
      new Date().toLocaleTimeString('ru', {hour:'2-digit',minute:'2-digit'});
  } catch(e) {
    document.getElementById('content').innerHTML =
      '<div class="loading">Ошибка загрузки данных</div>';
  }
}

function pct(a, b) {
  if (!b) return '0%';
  return (a / b * 100).toFixed(1) + '%';
}

function render(d) {
  const maxFunnel = d.users || 1;
  const maxSources = Math.max(...Object.values(d.sources || {}), 1);

  document.getElementById('content').innerHTML = [
    '<div class="grid-4">',
      '<div class="card" style="animation-delay:0.05s">',
        '<div class="card-label">Пользователей</div>',
        '<div class="card-value accent">' + d.users.toLocaleString('ru') + '</div>',
        '<div class="card-sub">Активны сегодня: ' + d.activeToday + '</div>',
        '<div class="card-accent-line"></div>',
      '</div>',
      '<div class="card" style="animation-delay:0.1s">',
        '<div class="card-label">Фанфиков создано</div>',
        '<div class="card-value">' + d.fanfics.toLocaleString('ru') + '</div>',
        '<div class="card-sub">Генераций всего: ' + d.gens.toLocaleString('ru') + '</div>',
      '</div>',
      '<div class="card" style="animation-delay:0.15s">',
        '<div class="card-label">Конверсия в фанфик</div>',
        '<div class="card-value accent3">' + d.conversion + '%</div>',
        '<div class="card-sub">' + d.withFanfics + ' из ' + d.users + ' написали хоть один</div>',
      '</div>',
      '<div class="card" style="animation-delay:0.2s">',
        '<div class="card-label">Оплат</div>',
        '<div class="card-value accent2">' + d.payments + '</div>',
        '<div class="card-sub">Конверсия: ' + d.pricingConversion + '% от потративших лимит</div>',
      '</div>',
    '</div>',

    '<div class="grid-3">',
      '<div class="card" style="animation-delay:0.25s">',
        '<div class="card-label">Активны сегодня</div>',
        '<div class="card-value">' + d.activeToday + '</div>',
        '<div class="card-sub">' + pct(d.activeToday, d.users) + ' от базы</div>',
      '</div>',
      '<div class="card" style="animation-delay:0.3s">',
        '<div class="card-label">Активны за неделю</div>',
        '<div class="card-value">' + d.activeWeek + '</div>',
        '<div class="card-sub">' + pct(d.activeWeek, d.users) + ' от базы</div>',
      '</div>',
      '<div class="card" style="animation-delay:0.35s">',
        '<div class="card-label">Видели тарифы</div>',
        '<div class="card-value">' + d.sawPricing + '</div>',
        '<div class="card-sub">' + pct(d.sawPricing, d.users) + ' от базы</div>',
      '</div>',
    '</div>',

    '<div class="section-title">Воронка</div>',
    '<div class="card" style="animation-delay:0.4s"><div class="funnel">',
      funnelRow('Зарегистрировались', d.users, maxFunnel, '#c8ff00'),
      funnelRow('Написали фанфик', d.withFanfics, maxFunnel, '#6b8cff'),
      funnelRow('Потратили дневной лимит', d.spentLimit || 0, maxFunnel, '#a78bfa'),
      funnelRow('Видели тарифы', d.sawPricing, maxFunnel, '#fb923c'),
      funnelRow('Оплатили', d.payments, maxFunnel, '#ff6b6b'),
    '</div></div>',

    '<div class="section-title">Сегменты пользователей</div>',
    '<div class="segments">',
      '<div class="seg-row" style="animation-delay:0.45s"><div><div class="seg-name">Новые — ни одного фанфика</div><div class="seg-desc">Получают retention на 4, 7, 14 день</div></div><div class="seg-count" style="color:var(--accent2)">' + d.seg0 + '</div></div>',
      '<div class="seg-row" style="animation-delay:0.5s"><div><div class="seg-name">Начинающие — 1-2 фанфика</div><div class="seg-desc">Получают смешные напоминания каждые 3 дня</div></div><div class="seg-count" style="color:var(--accent3)">' + d.seg12 + '</div></div>',
      '<div class="seg-row" style="animation-delay:0.55s"><div><div class="seg-name">Активные — 3+ фанфиков</div><div class="seg-desc">Получают грустные письма от бота каждые 3 дня</div></div><div class="seg-count" style="color:var(--accent)">' + d.seg3plus + '</div></div>',
    '</div>',

    '<div class="grid-2" style="margin-top:16px">',
      '<div>',
        '<div class="section-title">Топ пользователей</div>',
        '<div class="card" style="animation-delay:0.6s">',
          '<table class="top-table"><thead><tr>',
            '<th style="width:32px">#</th><th>Пользователь</th>',
            '<th style="text-align:right">Фанф.</th>',
            '<th style="text-align:right">Ген.</th>',
            '<th style="text-align:right">Реф.</th>',
          '</tr></thead><tbody>',
          d.topUsers.map(function(u, i) {
            var rankClass = i===0?'gold':i===1?'silver':i===2?'bronze':'';
            return '<tr>' +
              '<td class="rank ' + rankClass + '">' + (i+1) + '</td>' +
              '<td><div class="user-name">' + esc(u.name) + '</div><div class="user-level">' + u.level + '</div></td>' +
              '<td class="fanfic-count">' + u.fanfics + '</td>' +
              '<td style="text-align:right;color:var(--muted);font-size:12px">' + (u.gens || 0) + '</td>' +
              '<td style="text-align:right;color:var(--muted);font-size:12px">' + (u.refs || 0) + '</td>' +
              '</tr>';
          }).join(''),
          '</tbody></table>',
        '</div>',
      '</div>',

      '<div>',
        '<div class="section-title">Источники пользователей</div>',
        '<div class="card" style="animation-delay:0.65s"><div class="funnel">',
          Object.entries(d.sources || {})
            .sort(function(a,b){ return b[1]-a[1]; })
            .map(function(entry){ return funnelRow(entry[0], entry[1], maxSources, '#6b8cff'); })
            .join(''),
        '</div></div>',
      '</div>',
    '</div>',

    (d.paymentUsers || []).length > 0 ? (
      '<div class="section-title">Платящие пользователи</div>' +
      '<div class="card" style="animation-delay:0.7s">' +
        '<table class="top-table"><thead><tr>' +
          '<th>Пользователь</th><th>Тариф</th>' +
          '<th style="text-align:right">Оплат</th>' +
          '<th style="text-align:right">Фанфиков</th>' +
          '<th style="text-align:right">Генераций</th>' +
          '<th style="text-align:right">Рефералов</th>' +
        '</tr></thead><tbody>' +
        d.paymentUsers.map(function(u) {
          return '<tr>' +
            '<td class="user-name">' + esc(u.name) + '</td>' +
            '<td style="color:var(--accent);font-size:11px;font-family:var(--font-head)">' + esc(u.plan) + '</td>' +
            '<td style="text-align:right;font-weight:600">' + u.payments + '</td>' +
            '<td class="fanfic-count">' + u.fanfics + '</td>' +
            '<td style="text-align:right;color:var(--muted);font-size:12px">' + u.gens + '</td>' +
            '<td style="text-align:right;color:var(--muted);font-size:12px">' + u.refs + '</td>' +
            '</tr>';
        }).join('') +
        '</tbody></table>' +
      '</div>'
    ) : '',

  ].join('');
}

function funnelRow(label, val, max, color) {
  const w = max > 0 ? (val / max * 100) : 0;
  return \`
    <div class="funnel-row">
      <div class="funnel-label">\${label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar" style="width:\${w}%;background:\${color}"></div>
      </div>
      <div class="funnel-val">\${val.toLocaleString('ru')}</div>
      <div class="funnel-pct">\${(w).toFixed(1)}%</div>
    </div>
  \`;
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

load();
</script>
</body>
</html>}
    </>
  );
}
