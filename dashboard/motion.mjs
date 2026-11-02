const media = matchMedia('(prefers-reduced-motion: reduce)');
const ease = 'cubic-bezier(.22,1,.36,1)',
  running = new WeakMap(),
  numbers = new WeakMap();
export function animate(element, frames, options = {}) {
  if (!element) return;
  running.get(element)?.cancel();
  if (media.matches) return;
  const animation = element.animate(frames, { duration: 460, easing: ease, ...options });
  running.set(element, animation);
  animation.onfinish = () => {
    if (running.get(element) === animation) running.delete(element);
  };
}
export function countTo(element, value, format, { duration = 4000 } = {}) {
  const old = numbers.get(element);
  if (old) cancelAnimationFrame(old.frame);
  const from = old?.value ?? value * 0.5,
    state = { value: from, frame: 0 };
  numbers.set(element, state);
  if (media.matches || !Number.isFinite(value)) {
    element.textContent = format(value);
    state.value = value;
    return;
  }
  let start;
  const tick = (time) => {
    start ??= time;
    const t = Math.min(1, (time - start) / duration),
      k = 1 - Math.pow(1 - t, 2);
    state.value = from + (value - from) * k;
    element.textContent = format(state.value);
    if (t < 1) state.frame = requestAnimationFrame(tick);
    else state.value = value;
  };
  state.frame = requestAnimationFrame(tick);
}
export function cancelCount(element) {
  const old = numbers.get(element);
  if (old) cancelAnimationFrame(old.frame);
  numbers.delete(element);
}
export function entrance() {
  [
    ['.hero', 40],
    ['.performance', 150],
    ['.chart-section', 250],
    ['.two-columns', 340],
    ['.goals', 420],
    ['.bottom-grid', 490],
  ].forEach(([selector, delay]) =>
    animate(
      document.querySelector(selector),
      [
        { opacity: 0, transform: 'translateY(10px) scale(.994)' },
        { opacity: 1, transform: 'none' },
      ],
      { delay, fill: 'backwards' },
    ),
  );
  document.querySelectorAll('.mainhead h1,.mainhead p').forEach((e, i) =>
    animate(e, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0)' }], {
      duration: 620,
      delay: 90 + i * 150,
      fill: 'backwards',
    }),
  );
  document.querySelectorAll('.side,.right').forEach((e) =>
    animate(
      e,
      [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 500 },
    ),
  );
}
export function revealChart() {
  animate(
    document.querySelector('#equityChart'),
    [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
    { duration: 1100, delay: 0, fill: 'backwards' },
  );
}
