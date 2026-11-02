import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monotonePath } from './curve.mjs';
test('curve preserves endpoints, uses cubic segments and handles sparse data', () => {
  assert.equal(monotonePath([]), '');
  assert.equal(monotonePath([[5, 10]]), 'M5,10');
  const path = monotonePath([
    [0, 80],
    [10, 20],
    [20, 60],
    [30, 10],
  ]);
  assert.ok(path.startsWith('M0,80C'));
  assert.ok(path.endsWith('30,10'));
  assert.equal((path.match(/C/g) || []).length, 3);
});
test('each cubic remains within its data segment without inventing extrema', () => {
  const pts = [
    [0, 100],
    [10, 10],
    [20, 11],
    [30, 80],
    [40, 0],
  ];
  const commands = monotonePath(pts).split('C').slice(1);
  commands.forEach((command, i) => {
    const [x1, y1, x2, y2, x, y] = command.split(',').map(Number),
      [x0, y0] = pts[i];
    for (let k = 0; k <= 100; k++) {
      let t = k / 100,
        u = 1 - t,
        v = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y;
      assert.ok(v >= Math.min(y0, y) - 1e-8 && v <= Math.max(y0, y) + 1e-8);
    }
  });
});
