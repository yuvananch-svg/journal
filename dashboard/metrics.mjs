export function summarize(trades) {
  const wins = trades.filter((t) => t.pnl > 0),
    losses = trades.filter((t) => t.pnl < 0),
    gp = wins.reduce((a, t) => a + t.pnl, 0),
    gl = -losses.reduce((a, t) => a + t.pnl, 0),
    rs = trades.filter((t) => Number.isFinite(t.rr));
  return {
    pnl: trades.reduce((a, t) => a + t.pnl, 0),
    wins: wins.length,
    losses: losses.length,
    winRate: wins.length + losses.length ? (100 * wins.length) / (wins.length + losses.length) : 0,
    profitFactor: gl ? gp / gl : gp ? Infinity : 0,
    avgWin: wins.length ? gp / wins.length : 0,
    avgLoss: losses.length ? gl / losses.length : 0,
    avgWinR: wins
      .filter((t) => Number.isFinite(t.rr))
      .reduce((a, t, _, arr) => a + t.rr / arr.length, 0),
    avgR: rs.reduce((a, t) => a + t.rr / rs.length, 0),
  };
}
export function dailyTotals(trades) {
  const m = new Map();
  for (const t of trades) m.set(t.date, (m.get(t.date) || 0) + t.pnl);
  let sum = 0;
  return [...m]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pnl]) => ({ date, pnl, cumulative: (sum += pnl) }));
}
