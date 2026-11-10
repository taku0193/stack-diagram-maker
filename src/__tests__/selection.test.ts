import { describe, expect, it } from 'vitest';
import { parseManifest } from '../manifest';
import { selectDiagram } from '../selection';

const diagrams = parseManifest([
  { id: 'first', title: 'First diagram', filename: 'first.html' },
  { id: 'second', title: 'Second diagram', filename: 'second.html' },
]);

describe('selectDiagram', () => {
  it('selects only a manifest entry and builds its local path', () => {
    expect(selectDiagram(diagrams, 'second')).toEqual({
      diagram: diagrams[1],
      url: '/diagrams/second.html',
    });
  });

  it('does not resolve unknown IDs or an empty library', () => {
    expect(selectDiagram(diagrams, 'https://example.com')).toBeNull();
    expect(selectDiagram([], 'first')).toBeNull();
  });

  it('rejects unsafe paths even if an unvalidated entry reaches selection', () => {
    expect(selectDiagram([{ id: 'bad', title: 'Bad', filename: '../other.html' }], 'bad')).toBeNull();
  });
});
