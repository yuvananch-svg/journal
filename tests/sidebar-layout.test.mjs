import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sidebarTracks } from '../src/lib/sidebar-layout.mjs';
test('both tracks remain present so closed panels always have a reopen rail', () => {
  assert.equal(sidebarTracks(true, true), 'var(--desk-width) minmax(0, 1fr) var(--plan-width)');
  assert.equal(sidebarTracks(false, true), '32px minmax(0, 1fr) var(--plan-width)');
  assert.equal(sidebarTracks(true, false), 'var(--desk-width) minmax(0, 1fr) 32px');
  assert.equal(sidebarTracks(false, false), '32px minmax(0, 1fr) 32px');
});
