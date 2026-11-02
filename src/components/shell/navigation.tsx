'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  GraduationCap,
  ChartNoAxesCombined,
  Wallet,
  Sparkles,
  Users,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { sections } from '@/lib/navigation.mjs';
import { useUI } from '@/lib/ui-store';
export const icons = [
  LayoutDashboard,
  BookOpen,
  Bookmark,
  GraduationCap,
  ChartNoAxesCombined,
  Wallet,
  Sparkles,
  Users,
];
function RollingLabel({ label }: { label: string }) {
  return (
    <span className="nav-label" aria-hidden="true">
      {[...label].map((letter, i) => (
        <span key={i} className="nav-letter" style={{ '--letter-index': i } as CSSProperties}>
          <span className="nav-letter-track">
            <span>{letter === ' ' ? '\u00a0' : letter}</span>
            <span>{letter === ' ' ? '\u00a0' : letter}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
export function Navigation() {
  const path = usePathname(),
    [menu, setMenu] = useState(false),
    ui = useUI();
  return (
    <>
      <header className="topbar">
        <div className="top-tools">
          <button
            className="icon-btn mobile-menu"
            aria-label={menu ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={17} /> : <Menu size={17} />}
          </button>
          <span className="workspace-mark">
            <span /> Workspace
          </span>
        </div>
        <nav className="primary-nav" aria-label="Main navigation">
          {sections.map((s, i) => {
            const Icon = icons[i];
            return (
              <span className="nav-slot" key={s.slug}>
                {i === 4 && <span className="brand-space" aria-hidden="true" />}
                <Link
                  href={'/' + s.slug}
                  aria-label={s.label}
                  className={path === '/' + s.slug ? 'nav-link active' : 'nav-link'}
                  aria-current={path === '/' + s.slug ? 'page' : undefined}
                >
                  <Icon size={14} />
                  <RollingLabel label={s.label} />
                </Link>
              </span>
            );
          })}
        </nav>
        <div className="top-actions">
          <button
            className="icon-btn"
            onClick={ui.toggleTheme}
            aria-label={ui.light ? 'Use dark theme' : 'Use light theme'}
          >
            {ui.light ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <span className="avatar" title="Demo workspace — authentication not connected">
            D
          </span>
        </div>
      </header>
      {menu && (
        <nav className="mobile-menu-panel" aria-label="Mobile navigation">
          {sections.map((s, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={s.slug}
                href={'/' + s.slug}
                aria-current={path === '/' + s.slug ? 'page' : undefined}
                onClick={() => setMenu(false)}
              >
                <Icon size={18} />
                {s.label}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
