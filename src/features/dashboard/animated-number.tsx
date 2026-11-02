'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { money } from './demo-data';
import { dashboardAnimation } from './animation-settings';
import { profitFrame, profitValue } from './profit-motion.mjs';
export function useAnimatedNumber(value: number, duration = 1500, profit = false) {
  const reduced = useReducedMotion(),
    [display, setDisplay] = useState(value * 0.5),
    current = useRef(value * 0.5);
  useEffect(() => {
    if (reduced || !Number.isFinite(value)) {
      current.current = value;
      setDisplay(value);
      return;
    }
    let frame = 0,
      start: number | undefined;
    const from = current.current;
    const tick = (time: number) => {
      start ??= time;
      const progress = Math.min(1, (time - start) / duration);
      current.current = profit
        ? profitValue(from, value, progress)
        : from + (value - from) * (1 - (1 - progress) ** 3);
      setDisplay(profit ? profitFrame(from, value, progress) : current.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, reduced, profit]);
  return display;
}
export function AnimatedNumber({
  value,
  duration = dashboardAnimation.performance,
  format = money,
  profit = false,
}: {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  profit?: boolean;
}) {
  return <>{format(useAnimatedNumber(value, duration, profit))}</>;
}
export function AnimatedWinRate({ value }: { value: number }) {
  const display = useAnimatedNumber(value, dashboardAnimation.performance);
  return (
    <div
      className="donut"
      style={{ background: `conic-gradient(var(--text) ${display}%,var(--track) 0)` }}
    >
      <div>
        {display.toFixed(0)}
        <small>%</small>
      </div>
    </div>
  );
}
