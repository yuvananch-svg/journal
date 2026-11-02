'use client';
import { useEffect, useRef } from 'react';
import { Navigation } from './navigation';
import { AccountSidebar, PlanSidebar } from './sidebars';
import { useUI } from '@/lib/ui-store';
import { sidebarTracks } from '@/lib/sidebar-layout.mjs';
import { ShieldCheck, ChevronsLeft, ChevronsRight } from 'lucide-react';
function SidebarSlot({
  side,
  open,
  children,
  toggle,
}: {
  side: 'left' | 'right';
  open: boolean;
  children: React.ReactNode;
  toggle: () => void;
}) {
  const root = useRef<HTMLDivElement>(null),
    previous = useRef(open);
  useEffect(() => {
    if (previous.current === open) return;
    previous.current = open;
    const frame = requestAnimationFrame(() =>
      root.current
        ?.querySelector<HTMLButtonElement>(open ? '.rail-heading button' : '.rail-reopen')
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);
  return (
    <div ref={root} className={`sidebar-slot ${side}-slot ${open ? 'is-open' : 'is-closed'}`}>
      <div className="sidebar-content" inert={!open} aria-hidden={!open}>
        {children}
      </div>
      <button
        className="rail-reopen"
        aria-label={side === 'left' ? 'Open account sidebar' : 'Open plan sidebar'}
        aria-expanded={false}
        aria-controls={side === 'left' ? 'account-sidebar' : 'plan-sidebar'}
        tabIndex={open ? -1 : 0}
        onClick={toggle}
      >
        {side === 'left' ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        <span>{side === 'left' ? 'DESK' : 'THE SESSION'}</span>
      </button>
    </div>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const ui = useUI();
  return (
    <div className={'workspace ' + (ui.light ? 'theme-light' : '')}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navigation />
      <div
        className="workspace-grid"
        style={{ gridTemplateColumns: sidebarTracks(ui.leftOpen, ui.rightOpen) }}
      >
        <SidebarSlot side="left" open={ui.leftOpen} toggle={ui.toggleLeft}>
          <AccountSidebar />
        </SidebarSlot>
        <main id="main-content" tabIndex={-1} className="main-panel">
          {children}
        </main>
        <SidebarSlot side="right" open={ui.rightOpen} toggle={ui.toggleRight}>
          <PlanSidebar />
        </SidebarSlot>
      </div>
      <footer className="workspace-footer">
        <span>
          <i /> Demo workspace
        </span>
        <span className="footer-center">A little more clarity. Every session.</span>
        <span>
          <ShieldCheck size={12} /> No broker connected
        </span>
      </footer>
    </div>
  );
}
