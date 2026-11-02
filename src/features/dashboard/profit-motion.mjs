// First stage retains the original 4.3s quartic curve up to its midpoint.
// The longer tail matches its initial velocity, then settles continuously to zero.
export const profitTiming = {
  fast: 2150,
  tail: 3500,
  get total() {
    return this.fast + this.tail;
  },
};
export function profitValue(from, target, progress) {
  const t = Math.max(0, Math.min(1, progress));
  if (t === 1 || from === target) return target;
  const elapsed = t * profitTiming.total;
  const remaining =
    elapsed <= profitTiming.fast
      ? (1 - elapsed / (profitTiming.fast * 2)) ** 4
      : (1 / 16) *
        (1 - (elapsed - profitTiming.fast) / profitTiming.tail) **
          ((4 * profitTiming.tail) / profitTiming.fast);
  return from + (target - from) * (1 - remaining);
}
export function profitFrame(from, target, progress) {
  if (progress >= 1 || from === target) return target;
  const value = profitValue(from, target, progress);
  return target >= from
    ? Math.min(target - 1, Math.floor(value))
    : Math.max(target + 1, Math.ceil(value));
}
