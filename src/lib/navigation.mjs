export const sections = [
  {
    slug: 'dashboard',
    label: 'Dashboard',
    group: 'Overview',
    description: 'A clear view of your trading.',
  },
  {
    slug: 'journal',
    label: 'Journal',
    group: 'Trading',
    description: 'Every trade. Every decision.',
  },
  {
    slug: 'playbook',
    label: 'Playbook',
    group: 'Trading',
    description: 'Your process, written down.',
  },
  {
    slug: 'master',
    label: 'Master',
    group: 'Workspace',
    description: 'A space to shape your next step.',
  },
  {
    slug: 'analytics',
    label: 'Analytics',
    group: 'Overview',
    description: 'Understand the patterns in your trading.',
  },
  {
    slug: 'account',
    label: 'Account',
    group: 'Connections',
    description: 'Your accounts, in one place.',
  },
  {
    slug: 'ai',
    label: 'AI',
    group: 'Assistant',
    description: 'A second perspective on your journal.',
  },
  {
    slug: 'community',
    label: 'Community',
    group: 'Connect',
    description: 'A space for traders to connect.',
  },
];
export const findSection = (slug) => sections.find((s) => s.slug === slug);
