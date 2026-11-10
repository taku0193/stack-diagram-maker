export interface Diagram {
  readonly id: string;
  readonly title: string;
  readonly filename: string;
}

export function isSafeFilename(value: unknown): value is string {
  return typeof value === 'string'
    && value === value.trim()
    && /^[A-Za-z0-9][A-Za-z0-9_-]*\.html$/.test(value);
}

export function parseManifest(value: unknown): Diagram[] {
  if (!Array.isArray(value)) throw new Error('図の一覧は配列で指定してください。');

  const ids = new Set<string>();
  return value.map((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error('構成図の情報が正しくありません。');
    }

    const { id, title, filename } = entry as Record<string, unknown>;
    if (typeof id !== 'string' || id !== id.trim() || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) {
      throw new Error('構成図のIDが正しくありません。');
    }
    if (ids.has(id)) throw new Error('構成図のIDが重複しています。');
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('構成図のタイトルがありません。');
    }
    if (!isSafeFilename(filename)) throw new Error('構成図のファイル名が正しくありません。');

    ids.add(id);
    return { id, title: title.trim(), filename };
  });
}

export async function loadManifest(fetcher: typeof fetch = fetch): Promise<Diagram[]> {
  const response = await fetcher('/diagrams/index.json');
  if (!response.ok) throw new Error('図の一覧を取得できませんでした。');
  return parseManifest(await response.json());
}
