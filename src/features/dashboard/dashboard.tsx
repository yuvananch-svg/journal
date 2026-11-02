'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';
import {
  ArrowUpRight,
  ChevronDown,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { curve, demoTrades, money } from './demo-data';
import { useUI } from '@/lib/ui-store';
import { AnimatedNumber, AnimatedWinRate } from './animated-number';
import { dashboardAnimation } from './animation-settings';
const ratioFormat = (v: number) => v.toFixed(2);
const percentFormat = (v: number) => v.toFixed(0) + '%';
const integerFormat = (v: number) => v.toFixed(0);
const unsignedMoney = (v: number) => money(v).replace('+', '');

const score = [
  { axis: 'Win rate', value: 78 },
  { axis: 'Profit factor', value: 100 },
  { axis: 'Avg R', value: 100 },
  { axis: 'Consistency', value: 100 },
  { axis: 'Discipline', value: 80 },
];
export function Dashboard() {
  const ui = useUI(),
    reduced = useReducedMotion(),
    [scope, setScope] = useState('all'),
    [calendarMonth, setCalendarMonth] = useState(9),
    [calendarYear, setCalendarYear] = useState(2026);
  const [animateChart, setAnimateChart] = useState(true);
  const previousRails = useRef([ui.leftOpen, ui.rightOpen]);
  useEffect(() => {
    if (previousRails.current[0] !== ui.leftOpen || previousRails.current[1] !== ui.rightOpen) {
      setAnimateChart(false);
      previousRails.current = [ui.leftOpen, ui.rightOpen];
    }
  }, [ui.leftOpen, ui.rightOpen]);
  useEffect(() => {
    setAnimateChart(true);
  }, [scope]);
  const selected = scope === 'week' ? demoTrades.slice(-4) : demoTrades,
    total = selected.reduce((a, t) => a + t.pnl, 0),
    win = selected.filter((t) => t.pnl > 0),
    loss = selected.filter((t) => t.pnl < 0),
    rate = (win.length / selected.length) * 100,
    pf = win.reduce((a, t) => a + t.pnl, 0) / -loss.reduce((a, t) => a + t.pnl, 0),
    values =
      scope === 'week'
        ? curve.slice(-4).map((t, i, a) => ({
            ...t,
            pnl: a.slice(0, i + 1).reduce((s, _, j) => s + selected[j].pnl, 0),
          }))
        : curve;
  const hidden = ui.hideAmounts;
  const reveal = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.46,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  });
  function moveMonth(n: number) {
    const d = new Date(calendarYear, calendarMonth + n, 1);
    setCalendarMonth(d.getMonth());
    setCalendarYear(d.getFullYear());
  }
  const offset = new Date(calendarYear, calendarMonth, 1).getDay(),
    monthDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  return (
    <div className="dashboard-content">
      <motion.div {...reveal(0)} className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Your trading, in perspective.</p>
        </div>
        <span className="pill">
          <span /> DEMO DATA
        </span>
      </motion.div>
      <motion.section {...reveal(1)} className="pnl-hero">
        <label className="scope-select">
          <select aria-label="P&L period" value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="all">TOTAL P&L</option>
            <option value="week">THIS WEEK</option>
          </select>
          <ChevronDown size={12} />
        </label>
        <div className="hero-amount">
          {hidden ? (
            '••••'
          ) : (
            <AnimatedNumber value={total} duration={dashboardAnimation.totalPnl} profit />
          )}
        </div>
        <div className="hero-caption">
          <span className="positive">
            <ArrowUpRight size={13} />
            {win.length}W / {loss.length}L
          </span>
          <span>{selected.length} sample trades</span>
          <Link href="/journal">
            Open your journal <ArrowRight size={12} />
          </Link>
        </div>
      </motion.section>
      <motion.section {...reveal(2)} className="performance-section">
        <div className="section-heading">
          <h2>PERFORMANCE</h2>
          <div>
            <Link href="/analytics">
              Full analytics <ArrowUpRight size={12} />
            </Link>
            <button className="small-button" onClick={ui.toggleAmounts}>
              {hidden ? <EyeOff size={12} /> : <Eye size={12} />} {hidden ? 'Show' : 'Hide'} P&L
            </button>
          </div>
        </div>
        <div className="metrics-grid">
          <article className="metric-card">
            <span>
              Avg Win RR <Info size={11} />
            </span>
            <strong>
              <AnimatedNumber
                value={win.reduce((a, t) => a + t.rr, 0) / win.length}
                format={ratioFormat}
              />
              R
            </strong>
            <p>
              Profit Factor{' '}
              <b>
                <AnimatedNumber value={pf} format={ratioFormat} />
              </b>
            </p>
          </article>
          <article className="metric-card win-card">
            <AnimatedWinRate value={rate} />
            <div>
              <span>
                Win Rate <Info size={11} />
              </span>
              <strong className="win-record">
                {win.length}W <i>/ {loss.length}L</i>
              </strong>
              <p>{selected.length} sample trades</p>
            </div>
          </article>
          <article className="metric-card">
            <span>
              Avg Win / Loss <Info size={11} />
            </span>
            <strong>
              {hidden ? (
                '••••'
              ) : (
                <AnimatedNumber
                  value={win.reduce((a, t) => a + t.pnl, 0) / win.length}
                  format={unsignedMoney}
                />
              )}
            </strong>
            <p>
              Avg loss{' '}
              <b>
                {hidden ? (
                  '••••'
                ) : (
                  <AnimatedNumber
                    value={-loss.reduce((a, t) => a + t.pnl, 0) / loss.length}
                    format={unsignedMoney}
                  />
                )}
              </b>
            </p>
          </article>
        </div>
      </motion.section>
      <motion.div {...reveal(3)} className="charts-grid">
        <section className="chart-panel cumulative">
          <div className="section-heading">
            <h2>CUMULATIVE P&L</h2>
            <strong>{hidden ? '••••' : money(total)}</strong>
          </div>
          <p className="chart-sub">{scope === 'all' ? 'All demo history' : 'Last 4 demo trades'}</p>
          <div className="equity-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={values} margin={{ top: 12, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="equity-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--chart)" stopOpacity={0.24} />
                    <stop offset="1" stopColor="var(--chart)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: 'var(--muted)' }}
                  minTickGap={30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 9, fill: 'var(--muted)' }}
                  tickFormatter={(v) => (hidden ? '••' : `$${v}`)}
                />
                {!hidden && (
                  <Tooltip
                    contentStyle={{
                      background: 'var(--panel)',
                      border: '1px solid var(--line)',
                      borderRadius: 10,
                      color: 'var(--text)',
                      fontSize: 12,
                    }}
                    formatter={(v) => [money(Number(v)), 'P&L']}
                  />
                )}
                <Area
                  key={scope}
                  type="monotone"
                  dataKey="pnl"
                  stroke="var(--chart)"
                  strokeWidth={2}
                  fill="url(#equity-fill)"
                  animationBegin={0}
                  animationDuration={dashboardAnimation.cumulative}
                  animationEasing="ease-out"
                  isAnimationActive={!reduced && animateChart}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="chart-panel week-panel">
          <div className="section-heading">
            <h2>THIS WEEK</h2>
            <span className="subtle">Demo</span>
          </div>
          <strong className="week-amount">
            {hidden ? '••••' : <AnimatedNumber value={510} duration={dashboardAnimation.week} />}
          </strong>
          <div className="week-stat">
            <span>Trades</span>
            <b>
              <AnimatedNumber value={4} duration={dashboardAnimation.week} format={integerFormat} />
            </b>
          </div>
          <div className="week-stat">
            <span>Win rate</span>
            <b>
              <AnimatedNumber
                value={75}
                duration={dashboardAnimation.week}
                format={percentFormat}
              />
            </b>
          </div>
          <div className="week-bars">
            {[125, 230, -90, 245, 0].map((v, i) => (
              <div key={i}>
                <motion.i
                  initial={reduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: dashboardAnimation.week / 1000, delay: 0.25 + i * 0.03 }}
                  className={v < 0 ? 'loss-bar' : ''}
                  style={{ height: Math.max(2, (Math.abs(v) / 245) * 100) }}
                />
                <small>{['M', 'T', 'W', 'T', 'F'][i]}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="chart-panel score-panel">
          <div className="section-heading">
            <h2>
              JOURNAL SCORE <Info size={11} />
            </h2>
            <strong className="score-total">
              <AnimatedNumber
                value={92}
                duration={dashboardAnimation.radar}
                format={integerFormat}
              />
            </strong>
          </div>
          <p className="chart-sub">Illustrative score · demo</p>
          <div className="radar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={score} outerRadius="67%">
                <PolarGrid stroke="var(--line)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: 'var(--soft)' }} />
                <Radar
                  animationBegin={0}
                  animationDuration={dashboardAnimation.radar}
                  dataKey="value"
                  stroke="var(--chart)"
                  fill="var(--chart)"
                  fillOpacity={0.12}
                  isAnimationActive={!reduced && animateChart}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </motion.div>
      <motion.section {...reveal(4)} className="goals-section">
        <div className="section-heading">
          <h2>GOALS</h2>
          <span className="subtle">Illustrative targets</span>
        </div>
        <div className="goals-grid">
          {[
            { label: 'TODAY', current: 245, target: 200 },
            { label: 'THIS WEEK', current: 510, target: 625 },
            { label: 'THIS MONTH', current: 1490, target: 1250 },
          ].map((g) => (
            <article key={g.label}>
              <span>{g.label}</span>
              <strong>
                {hidden ? '••••' : money(g.current)}{' '}
                <small>of {hidden ? '••••' : money(g.target).replace('+', '')}</small>
              </strong>
              <div className="progress-track">
                <i style={{ width: Math.min(100, (g.current / g.target) * 100) + '%' }} />
              </div>
            </article>
          ))}
        </div>
      </motion.section>
      <motion.section {...reveal(5)} className="calendar-section">
        <div className="section-heading">
          <h2>
            <CalendarDays size={13} /> P&L CALENDAR
          </h2>
          <div className="calendar-navigation">
            <button className="icon-btn" onClick={() => moveMonth(-1)} aria-label="Previous month">
              <ChevronLeft size={15} />
            </button>
            <span>
              {new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <button className="icon-btn" onClick={() => moveMonth(1)} aria-label="Next month">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((s, i) => (
            <span className="calendar-day-name" key={i}>
              {s}
            </span>
          ))}
          {Array.from({ length: Math.ceil((monthDays + offset) / 7) * 7 }, (_, i) => {
            const day = i - offset + 1,
              active = day > 0 && day <= monthDays,
              t = active
                ? demoTrades.find(
                    (t) =>
                      t.date ===
                      `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                  )
                : undefined;
            return (
              <div
                key={i}
                className={'calendar-cell ' + (!active ? 'outside ' : '') + (t ? 'traded' : '')}
              >
                <span>{active ? day : ''}</span>
                {t && (
                  <strong className={t.pnl < 0 ? 'negative' : 'positive'}>
                    {hidden ? '••••' : money(t.pnl)}
                  </strong>
                )}
              </div>
            );
          })}
        </div>
        <p className="calendar-caption">
          Sample history · October 2026. These results are synthetic.
        </p>
      </motion.section>
    </div>
  );
}
