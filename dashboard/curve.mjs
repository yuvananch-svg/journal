// Monotone cubic Hermite interpolation: smooth through observations, no overshoot.
export function monotonePath(points) {
  if (!points.length) return '';
  const f = (v) => String(+v.toFixed(4)),
    pair = (p) => p.map(f).join(',');
  let path = 'M' + pair(points[0]);
  if (points.length === 1) return path;
  const slopes = points.slice(1).map((p, i) => (p[1] - points[i][1]) / (p[0] - points[i][0]));
  const tangents = points.map((p, i) => {
    if (i === 0 || i === points.length - 1) return 0;
    const a = slopes[i - 1],
      b = slopes[i],
      h0 = p[0] - points[i - 1][0],
      h1 = points[i + 1][0] - p[0],
      v = (a * h1 + b * h0) / (h0 + h1);
    return (Math.sign(a) + Math.sign(b)) * Math.min(Math.abs(a), Math.abs(b), 0.5 * Math.abs(v));
  });
  tangents[0] = (3 * slopes[0] - tangents[1]) / 2;
  tangents[points.length - 1] = (3 * slopes.at(-1) - tangents.at(-2)) / 2;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1],
      [x1, y1] = points[i],
      dx = (x1 - x0) / 3;
    path +=
      'C' +
      [x0 + dx, y0 + dx * tangents[i - 1], x1 - dx, y1 - dx * tangents[i], x1, y1].map(f).join(',');
  }
  return path;
}
