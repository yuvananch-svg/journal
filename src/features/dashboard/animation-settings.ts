import { profitTiming } from './profit-motion.mjs';
// Durations are milliseconds. Change these values to tune the dashboard.
export const dashboardAnimation = {
  totalPnl: profitTiming.total,
  performance: 1500,
  cumulative: 1500,
  week: 1500,
  radar: 1500,
} as const;
