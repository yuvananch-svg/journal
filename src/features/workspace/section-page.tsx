'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowRight,
  Link2,
  Layers,
  LockKeyhole,
  Check,
  LayoutTemplate,
} from 'lucide-react';
import { sections } from '@/lib/navigation.mjs';
import { icons } from '@/components/shell/navigation';
const content: Record<string, { eyebrow: string; title: string; body: string; areas: string[] }> = {
  journal: {
    eyebrow: 'THE TRADING RECORD',
    title: 'Every trade has a story.',
    body: 'The home for trade history, decisions and reflections. This page establishes the workspace; recording and sync are not connected yet.',
    areas: ['Trade history', 'Trade details', 'Daily reflections'],
  },
  playbook: {
    eyebrow: 'YOUR TRADING PROCESS',
    title: 'Make your process repeatable.',
    body: 'A reserved space for your Playbook. Setups, rules and review tools will be defined with you before we build the feature.',
    areas: ['Setups', 'Execution rules', 'Review process'],
  },
  master: {
    eyebrow: 'A SPACE TO DEFINE',
    title: 'Room for your next idea.',
    body: 'Master has its own place in the app. Its role is intentionally open until you define what belongs here.',
    areas: ['Purpose', 'Content structure', 'Workflow'],
  },
  analytics: {
    eyebrow: 'A CLEARER PERSPECTIVE',
    title: 'Find the patterns that matter.',
    body: 'Analytics will use the same trade records and calculation rules as your Dashboard. No separate totals, no competing sources of truth.',
    areas: ['Performance', 'Trading sessions', 'Setup breakdown'],
  },
  account: {
    eyebrow: 'YOUR CONNECTIONS',
    title: 'One home for your accounts.',
    body: 'Start with a personal CFD account on MT5. Exness Demo is the first planned connection; no account or credentials have been connected.',
    areas: ['Connection status', 'History import', 'Continuous sync'],
  },
  ai: {
    eyebrow: 'ANOTHER PERSPECTIVE',
    title: 'Reflect with more context.',
    body: 'A reserved home for the AI assistant. It is not connected to a model, and no trading data is sent to an AI service.',
    areas: ['Journal context', 'Trade review', 'Conversation history'],
  },
  community: {
    eyebrow: 'THE TRADING COMMUNITY',
    title: 'A place to grow together.',
    body: 'The Community workspace is ready for its next design phase. Posts, profiles and privacy controls have not been implemented.',
    areas: ['Community feed', 'Trader profiles', 'Privacy & moderation'],
  },
};
export function SectionPage({ section }: { section: (typeof sections)[number] }) {
  const c = content[section.slug],
    Icon = icons[sections.findIndex((s) => s.slug === section.slug)],
    reduced = useReducedMotion();
  return (
    <motion.div
      className="section-page"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="page-heading">
        <div>
          <h1>{section.label}</h1>
          <p>{section.description}</p>
        </div>
        <span className="pill neutral">FOUNDATION</span>
      </div>
      <div className="section-intro">
        <span className="section-symbol">
          <Icon size={26} strokeWidth={1.3} />
        </span>
        <span className="eyebrow">{c.eyebrow}</span>
        <h2>{c.title}</h2>
        <p>{c.body}</p>
        <div className="section-tags">
          <span>
            <Check size={12} /> Navigation ready
          </span>
          <span>
            <Layers size={12} /> Feature not connected
          </span>
        </div>
      </div>
      {section.slug === 'account' ? (
        <div className="account-foundation">
          <div className="connection-heading">
            <span className="connection-logo">MT5</span>
            <div>
              <h3>MetaTrader 5</h3>
              <p>Exness · Demo account</p>
            </div>
            <span className="pill neutral">NOT CONNECTED</span>
          </div>
          <div className="connection-steps">
            {c.areas.map((s, i) => (
              <div key={s}>
                <span>0{i + 1}</span>
                <strong>{s}</strong>
                <small>Planned</small>
              </div>
            ))}
          </div>
          <p className="connection-foot">
            <LockKeyhole size={14} /> Read-only access is planned. This prototype does not collect
            credentials.
          </p>
        </div>
      ) : (
        <div className="foundation-grid">
          {c.areas.map((s, i) => (
            <article key={s}>
              <span className="foundation-index">0{i + 1}</span>
              <LayoutTemplate size={18} />
              <h3>{s}</h3>
              <p>
                {section.slug === 'master' ? 'To be defined with you' : 'Planned workspace area'}
              </p>
            </article>
          ))}
        </div>
      )}
      <div className="foundation-footer">
        <span>
          <Link2 size={13} /> App structure first. Your data comes next.
        </span>
        <Link href="/dashboard">
          Explore the demo Dashboard <ArrowRight size={14} />
        </Link>
      </div>
      <Link
        className="section-next"
        href={
          '/' +
          sections[(sections.findIndex((s) => s.slug === section.slug) + 1) % sections.length].slug
        }
      >
        NEXT WORKSPACE <ArrowUpRight size={14} />
      </Link>
    </motion.div>
  );
}
