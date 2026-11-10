import { isSafeFilename, type Diagram } from './manifest';

export interface DiagramSelection {
  readonly diagram: Diagram;
  readonly url: string;
}

export function selectDiagram(diagrams: readonly Diagram[], id: string): DiagramSelection | null {
  const diagram = diagrams.find((entry) => entry.id === id);
  if (!diagram || !isSafeFilename(diagram.filename)) return null;
  return { diagram, url: `/diagrams/${diagram.filename}` };
}
