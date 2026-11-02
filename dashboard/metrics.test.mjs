import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize, dailyTotals } from './metrics.mjs';
test('summarizes wins and losses without counting zero as a win', () => {
  const s = summarize([{ pnl: 100, rr: 2 }, { pnl: -50, rr: -1 }, { pnl: 0 }]);
  assert.equal(s.pnl, 50);
  assert.equal(s.winRate, 50);
  assert.equal(s.profitFactor, 2);
});
test('daily totals are ordered and accumulated', () => {
  assert.deepEqual(
    dailyTotals([
      { date: '2026-01-02', pnl: -5 },
      { date: '2026-01-01', pnl: 10 },
    ]).map((x) => x.cumulative),
    [10, 5],
  );
});
