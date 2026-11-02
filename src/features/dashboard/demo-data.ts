// Explicit synthetic fixture. Never represents a connected brokerage account.
const amounts = [
  160, -85, 215, -60, 115, 95, -120, 270, -55, 190, -95, 145, 210, -75, 180, -110, 125, 230, -90,
  245,
];
export const demoTrades = amounts.map((pnl, i) => ({
  id: `demo-${i + 1}`,
  date: `2026-10-${String(29 - Math.floor((19 - i) * 1.3)).padStart(2, '0')}`,
  pnl,
  rr: pnl > 0 ? +(1 + pnl / 180).toFixed(2) : -1,
}));
export const curve = demoTrades.reduce<{ date: string; pnl: number }[]>(
  (a, t) => [...a, { date: t.date.slice(5), pnl: (a.at(-1)?.pnl ?? 0) + t.pnl }],
  [],
);
export const money = (v: number) =>
  `${v < 0 ? '−' : v > 0 ? '+' : ''}$${Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
