import { test } from 'node:test';
import assert from 'node:assert/strict';
import { profitFrame } from '../src/features/dashboard/profit-motion.mjs';
test('profit moves quickly initially, slows down, and reaches target only at the end', () => {
  assert.equal(profitFrame(745, 1490, 0), 745);
  assert.ok(profitFrame(745, 1490, 0.25) > 1200);
  assert.ok(
    profitFrame(745, 1490, 0.5) - profitFrame(745, 1490, 0.25) >
      profitFrame(745, 1490, 0.75) - profitFrame(745, 1490, 0.5),
  );
  assert.equal(profitFrame(745, 1490, 0.999), 1489);
  assert.equal(profitFrame(745, 1490, 1), 1490);
  assert.equal(profitFrame(1490, 510, 0.999), 511);
  assert.equal(profitFrame(1490, 510, 1), 510);
});

test('extends only the tail while preserving the first 2.15 seconds and continuous speed', async () => {
  const { profitValue, profitTiming } = await import('../src/features/dashboard/profit-motion.mjs');
  assert.equal(profitTiming.total, 5650);
  for (const ms of [0, 500, 1500, 2150])
    assert.ok(Math.abs(profitValue(0, 1, ms / 5650) - (1 - (1 - ms / 4300) ** 4)) < 1e-10);
  const at = (ms) => profitValue(0, 1, ms / 5650),
    epsilon = 0.01;
  assert.ok(
    Math.abs(
      (at(2150) - at(2150 - epsilon)) / epsilon - (at(2150 + epsilon) - at(2150)) / epsilon,
    ) < 1e-8,
  );
  assert.ok(at(4300) < 1);
  assert.equal(at(5650), 1);
  assert.equal(profitValue(50, 50, 0.5), 50);
});
