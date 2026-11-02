'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, Wallet, Check, ArrowUpRight, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useUI } from '@/lib/ui-store';
export function AccountSidebar() {
  const ui = useUI();
  return (
    <aside className="sidebar account-sidebar" id="account-sidebar" aria-label="Trading accounts">
      <div className="rail-heading">
        DESK
        <button
          className="icon-btn"
          onClick={ui.toggleLeft}
          aria-label="Collapse account sidebar"
          aria-expanded={true}
          aria-controls="account-sidebar"
        >
          <ChevronLeft size={15} />
        </button>
      </div>
      <div className="rail-label">
        ACCOUNTS <span>0 connected</span>
      </div>
      <Link className="connect-card" href="/account">
        <span className="connect-icon">
          <Wallet size={19} />
        </span>
        <strong>Make room for your account.</strong>
        <p>Your balances and trading history will live here.</p>
        <span className="small-link">
          <Plus size={13} /> Account workspace
        </span>
      </Link>
      <div className="sidebar-note">
        <span className="status-dot" /> Viewing demo data
      </div>
      <div className="rail-bottom">
        <div className="rail-label">
          CONNECTION STATUS <Link2 size={13} />
        </div>
        <p>No broker connected</p>
        <small>MT5 · Exness demo planned</small>
        <div className="quiet-line" />
        <small>Connection setup comes after the app foundation.</small>
      </div>
    </aside>
  );
}
const checklist = [
  'Review the economic calendar',
  'Mark the key levels',
  'Define the risk before entry',
  'Write the trade thesis',
];
export function PlanSidebar() {
  const ui = useUI(),
    [checked, setChecked] = useState<string[]>([]);
  return (
    <aside className="sidebar plan-sidebar" id="plan-sidebar" aria-label="Trading plan">
      <div className="rail-heading">
        <button
          className="icon-btn"
          aria-label="Collapse plan sidebar"
          aria-expanded={true}
          aria-controls="plan-sidebar"
          onClick={ui.toggleRight}
        >
          <ChevronRight size={15} />
        </button>
        <span>THE SESSION</span>
      </div>
      <div className="rail-label">
        THE PLAN <span>Demo</span>
      </div>
      <Link href="/journal" className="plan-empty">
        Give the session a direction.
        <ArrowUpRight size={13} />
      </Link>
      <div className="rail-label divided">
        CHECKLIST{' '}
        <span>
          {checked.length} / {checklist.length}
        </span>
      </div>
      <div className="checklist">
        {checklist.map((t) => (
          <label key={t}>
            <input
              type="checkbox"
              checked={checked.includes(t)}
              onChange={() =>
                setChecked((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]))
              }
            />
            <span className="custom-check">{checked.includes(t) && <Check size={10} />}</span>
            <span>{t}</span>
          </label>
        ))}
      </div>
      <p className="rail-caption">Session preview · not saved</p>
      <div className="rail-label divided">
        RECENT TRADES <span>Demo</span>
      </div>
      {[
        { symbol: 'XAUUSD', side: 'Long', pnl: '+$245', date: 'Sample trade 03' },
        { symbol: 'EURUSD', side: 'Short', pnl: '−$90', date: 'Sample trade 02' },
        { symbol: 'GBPUSD', side: 'Long', pnl: '+$230', date: 'Sample trade 01' },
      ].map((t) => (
        <div className="recent-trade" key={t.symbol}>
          <div>
            <span className="symbol-chip">{t.symbol.slice(0, 1)}</span>
            <strong>{t.symbol}</strong>
            <b className={t.pnl.startsWith('−') ? 'negative' : 'positive'}>
              {ui.hideAmounts ? '••••' : t.pnl}
            </b>
          </div>
          <p>
            {t.side}
            <span>{t.date}</span>
          </p>
        </div>
      ))}
      <div className="rail-bottom">
        <small>Prepare. Execute. Reflect.</small>
      </div>
    </aside>
  );
}
