import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sections, findSection } from '../src/lib/navigation.mjs';
test('all eight navigation destinations resolve and unknown URLs do not', () => {
  assert.deepEqual(
    sections.map((s) => s.label),
    ['Dashboard', 'Journal', 'Playbook', 'Master', 'Analytics', 'Account', 'AI', 'Community'],
  );
  for (const s of sections) assert.equal(findSection(s.slug)?.label, s.label);
  assert.equal(findSection('settings'), undefined);
  assert.equal(new Set(sections.map((s) => s.slug)).size, 8);
});
