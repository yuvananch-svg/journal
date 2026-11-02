export function sidebarTracks(leftOpen, rightOpen) {
  return `${leftOpen ? 'var(--desk-width)' : '32px'} minmax(0, 1fr) ${rightOpen ? 'var(--plan-width)' : '32px'}`;
}
