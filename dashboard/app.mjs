import { summarize, dailyTotals } from './metrics.mjs';
import { monotonePath } from './curve.mjs';
import { animate, countTo, cancelCount, entrance, revealChart } from './motion.mjs';
let previousScope = null;
function displayMoney(e, value) {
  if (hidden) {
    cancelCount(e);
    e.textContent = '••••';
  } else countTo(e, value, money);
}
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const now = new Date(),
  iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
  add = (d, n) => {
    let x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };
const amounts = [
  160, -85, 215, -60, 115, 95, -120, 270, -55, 190, -95, 145, 210, -75, 180, -110, 125, 230, -90,
  245,
];
const trades = amounts.map((p, i) => ({
  id: i,
  date: iso(add(now, -Math.floor((19 - i) * 1.3))),
  pnl: p,
  rr: p > 0 ? +(1 + p / 180).toFixed(2) : -1,
  symbol: i % 3 ? 'MNQ' : 'ES',
  direction: i % 2 ? 'Short' : 'Long',
}));
let scope = 'all',
  unit = 'money',
  month = new Date(now.getFullYear(), now.getMonth(), 1),
  hidden = false,
  scoreWindow = '30';
let goals = { daily: 200, weekly: 625, monthly: 1250 };
try {
  goals = { ...goals, ...JSON.parse(localStorage.getItem('journal-demo-goals') || '{}') };
} catch {}
const money = (v, dec = 0) =>
    `${v < 0 ? '−' : v > 0 ? '+' : ''}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`,
  safe = (v) => (hidden ? '••••' : money(v)),
  startWeek = (d) => {
    let x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  },
  filter = () =>
    trades.filter(
      (t) => scope === 'all' || t.date >= iso(scope === 'week' ? startWeek(now) : add(now, -30)),
    ),
  sum = (a) => a.reduce((x, t) => x + t.pnl, 0),
  days = (trades) => dailyTotals(trades),
  win = (arr) => Math.round(summarize(arr).winRate);
const dialog = (title, body) => {
  $('#dialogContent').innerHTML =
    `<h2>${title}</h2><p>${body}</p><button class="dialog-action" value="close">Got it</button>`;
  $('#dialog').showModal();
};
function chart(ts) {
  let d = days(ts);
  displayMoney($('#chartTotal'), sum(ts));
  $('#chartScope').textContent =
    scope === 'all' ? 'All time' : scope === 'week' ? 'This week' : 'Last 30 days';
  if (!d.length) {
    $('#line').setAttribute('d', '');
    $('#area').setAttribute('d', '');
    $('#chartDates').innerHTML = '';
    return;
  }
  let vals = d.map((x) => x.cumulative),
    min = Math.min(0, ...vals),
    max = Math.max(1, ...vals),
    pts = d.map((x, i) => [
      d.length === 1 ? 450 : (i / (d.length - 1)) * 900,
      185 - ((x.cumulative - min) / (max - min)) * 160,
    ]);
  let path = monotonePath(pts);
  $('.chart-y').innerHTML = [max, max - (max - min) / 3, max - (2 * (max - min)) / 3, min]
    .map((v) => `<span>${hidden ? '•••' : money(v).replace('+', '')}</span>`)
    .join('');
  $('#line').setAttribute('d', path);
  $('#area').setAttribute('d', `${path} L${pts.at(-1)[0]},185 L${pts[0][0]},185 Z`);
  $('#chartDates').innerHTML = d
    .filter(
      (_, i) => i === 0 || i === d.length - 1 || i % Math.max(1, Math.floor(d.length / 4)) === 0,
    )
    .map(
      (x) =>
        `<span>${new Date(x.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>`,
    )
    .join('');
}
function week(ts) {
  const start = startWeek(now),
    last = add(start, -7),
    end = iso(start);
  let curr = ts.filter((t) => t.date >= iso(start) && t.date <= iso(now)),
    prev = ts.filter((t) => t.date >= iso(last) && t.date < end);
  displayMoney($('#weekTotal'), sum(curr));
  $('#weekCount').textContent = curr.length;
  $('#weekRate').textContent = win(curr) + '%';
  $('#lastWeek').textContent = safe(sum(prev));
  let vals = Array.from({ length: 5 }, (_, i) =>
      sum(curr.filter((t) => t.date === iso(add(start, i)))),
    ),
    max = Math.max(...vals.map(Math.abs), 1);
  $('#weekBars').innerHTML = vals
    .map(
      (v, i) =>
        `<div class="week-col"><i class="${v < 0 ? 'negative' : ''}" style="height:${Math.max(3, (Math.abs(v) / max) * 75)}px"></i><span>${['M', 'T', 'W', 'T', 'F'][i]}</span></div>`,
    )
    .join('');
}
function score(ts) {
  let selected = scoreWindow === '30' ? ts.filter((t) => t.date >= iso(add(now, -29))) : ts;
  if (selected.length < 10 && scoreWindow === '30') selected = ts;
  const s = summarize(selected),
    ds = days(selected),
    cons =
      ds.length >= 3 && s.pnl > 0
        ? Math.round(
            Math.max(
              0,
              Math.min(100, ((1 - Math.max(...ds.map((d) => d.pnl)) / s.pnl) / 0.7) * 100),
            ),
          )
        : 50,
    p = s.winRate / 100,
    a = s.avgLoss ? s.avgWin / s.avgLoss : 0,
    b = a ? 1 / (1 + a) : null,
    wr = !b
      ? Math.round(p * 100)
      : p <= b
        ? Math.round((40 * p) / b)
        : Math.round(40 + 60 * Math.sqrt((p - b) / (1 - b))),
    pf = Math.min(
      100,
      Math.round(s.profitFactor <= 1 ? 40 * s.profitFactor : 40 + 60 * (s.profitFactor - 1)),
    ),
    ar = Math.max(0, Math.min(100, Math.round(40 + (s.avgR >= 0 ? 150 : 100) * s.avgR))),
    discipline = 80,
    scores = [wr, pf, ar, cons, discipline].map((v) =>
      Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 0,
    );
  $('#scoreValue').textContent = selected.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / 5)
    : '—';
  $('#scoreCount').textContent = `Demo estimate · ${selected.length} trades`;
  $('#scoreList').innerHTML = ['Win rate', 'Profit factor', 'Avg R', 'Consistency', 'Discipline*']
    .map((x, i) => `<div class="score-row"><i></i>${x}<b>${scores[i]}</b></div>`)
    .join('');
  let points = scores.map((v, i) => {
    let angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5,
      r = (75 * v) / 100;
    return `${100 + Math.cos(angle) * r},${95 + Math.sin(angle) * r}`;
  });
  $('#radarShape').setAttribute('points', points.join(' '));
}
function goalsView() {
  const weekStart = iso(startWeek(now)),
    monthStart = iso(new Date(now.getFullYear(), now.getMonth(), 1));
  let periods = [
    ['TODAY', 'daily', trades.filter((t) => t.date === iso(now))],
    ['THIS WEEK', 'weekly', trades.filter((t) => t.date >= weekStart)],
    ['THIS MONTH', 'monthly', trades.filter((t) => t.date >= monthStart)],
  ];
  $('#goalsGrid').innerHTML = periods
    .map(
      ([name, key, ts]) =>
        `<div class="goal"><div class="goal-head">${name}<button data-goal="${key}" aria-label="Edit ${name} goal">✎</button></div><strong>${safe(sum(ts))} <small>of ${hidden ? '••••' : money(goals[key]).replace('+', '')}</small></strong><div class="goal-bar"><i style="width:${Math.min(100, Math.max(0, (sum(ts) / goals[key]) * 100))}%"></i></div></div>`,
    )
    .join('');
  $$('[data-goal]').forEach(
    (b) =>
      (b.onclick = () => {
        let v = prompt(`Set ${b.dataset.goal} goal (USD)`, goals[b.dataset.goal]);
        if (v === null) return;
        let n = Number(v);
        if (Number.isFinite(n) && n > 0) {
          goals[b.dataset.goal] = n;
          try {
            localStorage.setItem('journal-demo-goals', JSON.stringify(goals));
          } catch {}
          render();
        } else alert('Enter a positive amount.');
      }),
  );
}
function calendar(ts) {
  let y = month.getFullYear(),
    m = month.getMonth(),
    first = new Date(y, m, 1),
    offset = first.getDay(),
    n = new Date(y, m + 1, 0).getDate();
  $('#monthTitle').textContent = first.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  let selected = ts.filter((t) => t.date.slice(0, 7) === iso(first).slice(0, 7));
  $('#monthTotal').textContent = safe(sum(selected));
  let html = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    .map((x) => `<div class="cal-head">${x}</div>`)
    .join('');
  for (let i = 0; i < 42; i++) {
    let day = i - offset + 1,
      d = new Date(y, m, day),
      t = ts.filter((x) => x.date === iso(d)),
      val =
        unit === 'r'
          ? t.reduce((a, x) => a + x.rr, 0)
          : unit === 'percent'
            ? (sum(t) / 50000) * 100
            : sum(t),
      label = hidden
        ? '••'
        : unit === 'money'
          ? money(val)
          : unit === 'r'
            ? `${val > 0 ? '+' : ''}${val.toFixed(1)}R`
            : `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
    html += `<button class="cal-day ${d.getMonth() !== m ? 'out' : ''} ${t.length ? 'has' : ''}" data-day="${iso(d)}" ${!t.length ? 'disabled' : ''}>${d.getDate()}${t.length ? `<b class="${val < 0 ? 'loss' : ''}">${label}</b>` : ''}</button>`;
  }
  $('#calendarGrid').innerHTML = html;
  $$('[data-day]:not([disabled])').forEach(
    (b) =>
      (b.onclick = () => {
        let t = ts.filter((x) => x.date === b.dataset.day);
        dialog(
          b.dataset.day,
          `${t.length} demo trade${t.length === 1 ? '' : 's'} · ${hidden ? 'P&L hidden' : money(sum(t), 2)}. These values are sample data.`,
        );
      }),
  );
}
function render() {
  let t = filter(),
    s = summarize(t);
  $('#accountValue').textContent = safe(sum(trades));
  $('#accountProgress').textContent =
    Math.min(100, Math.round((Math.max(0, sum(trades)) / 2500) * 100)) + '%';
  $('.account-progress i').style.width =
    Math.min(100, Math.round((Math.max(0, sum(trades)) / 2500) * 100)) + '%';
  $$('.recent-row strong').forEach((e, i) => {
    let x = [...trades].slice(-4).reverse()[i];
    e.textContent = hidden ? '••••' : money(x.pnl);
  });
  displayMoney($('#total'), s.pnl);
  $('#heroWins').textContent = `↗ ${s.wins}W / ${s.losses}L`;
  $('#heroTrades').textContent = `${t.length} trades`;
  $('#avgRR').textContent = s.avgWinR.toFixed(2) + 'R';
  $('#pf').textContent = Number.isFinite(s.profitFactor) ? s.profitFactor.toFixed(2) : '∞';
  $('#winPercent').textContent = s.winRate.toFixed(1) + '%';
  $('#ringStroke').style.strokeDashoffset = 226 * (1 - s.winRate / 100);
  $('#wl').textContent = `${s.wins}W / ${s.losses}L`;
  $('#tradeCount').textContent = `${t.length} demo trades`;
  $('#avgWin').textContent = hidden ? '••••' : money(s.avgWin).replace('+', '');
  $('#avgLoss').textContent = hidden ? '••••' : money(s.avgLoss).replace('+', '');
  chart(t);
  week(t);
  score(t);
  goalsView();
  calendar(t);
  if (previousScope !== scope) {
    revealChart();
    animate(
      $('#radarShape'),
      [
        { opacity: 0.1, transform: 'scale(.55)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 520 },
    );
    $$('.week-col i').forEach((e, i) =>
      animate(e, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
        duration: 460,
        delay: 250 + 30 * i,
        fill: 'backwards',
      }),
    );
    previousScope = scope;
  }
}
$('#date').textContent = now.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
$('#planDate').textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
$('#recent').innerHTML = [...trades]
  .slice(-4)
  .reverse()
  .map(
    (t) =>
      `<div class="recent-row"><div><b>${t.symbol} · ${t.direction}</b><small>${t.date}</small></div><strong class="${t.pnl < 0 ? 'loss' : ''}">${money(t.pnl)}</strong></div>`,
  )
  .join('');
$('#scopeButton').onclick = () => ($('#scopeMenu').hidden = !$('#scopeMenu').hidden);
$$('[data-scope]').forEach(
  (b) =>
    (b.onclick = () => {
      scope = b.dataset.scope;
      $('#scopeButton').innerHTML =
        `${scope === 'all' ? 'TOTAL P&L' : scope === 'week' ? 'THIS WEEK' : 'LAST 30 DAYS'} <span>⌄</span>`;
      $('#scopeMenu').hidden = true;
      render();
    }),
);
$('#hidePnl').onclick = () => {
  hidden = !hidden;
  $('#hidePnl').textContent = hidden ? '◉ Show P&L' : '◉ Hide P&L';
  render();
};
$('#theme').onclick = () => document.body.classList.toggle('light');
$('#dismiss').onclick = () => $('.notice').remove();
$('#prevMonth').onclick = () => {
  month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
  render();
};
$('#nextMonth').onclick = () => {
  month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  render();
};
$$('[data-unit]').forEach(
  (b) =>
    (b.onclick = () => {
      unit = b.dataset.unit;
      $$('[data-unit]').forEach((x) => x.classList.toggle('selected', x === b));
      render();
    }),
);
$$('[data-window]').forEach(
  (b) =>
    (b.onclick = () => {
      scoreWindow = b.dataset.window;
      $$('[data-window]').forEach((x) => x.classList.toggle('selected', x === b));
      render();
    }),
);
$$('[data-news]').forEach(
  (b) =>
    (b.onclick = () => {
      $$('[data-news]').forEach((x) => x.classList.toggle('selected', x === b));
      $('.news-controls span').textContent = b.dataset.news === 'day' ? 'Today' : 'This week';
    }),
);
$('.checklist').onchange = () =>
  ($('#checkCount').textContent = `${$$('.checklist input:checked').length} / 4`);
$('#share').onclick = () =>
  dialog(
    'Share profile',
    'Sharing is not connected in this demo. A production version should let you review exactly which information is included.',
  );
$('#shareWeek').onclick = () =>
  dialog('Share this week', 'This sample dashboard does not publish or upload data.');
$('#newsFilter').onclick = () =>
  dialog(
    'News filters',
    'A live economic calendar has not been connected. This panel intentionally contains no fabricated events.',
  );
$('#plan').onclick = $('#planLink').onclick = () =>
  dialog(
    'Pre-market plan',
    'Use the checklist on the right to explore the sample workflow. Your entries are temporary in this prototype.',
  );
$('#analyticsLink').onclick = () =>
  dialog('Full analytics', 'This prototype covers the dashboard only.');
$$('.nav a:not(.active),.mobile-nav a:not([href="#dashboard"])').forEach(
  (a) =>
    (a.onclick = (e) => {
      e.preventDefault();
      dialog('Dashboard demo', 'This prototype currently includes the dashboard only.');
    }),
);
render();
entrance();
