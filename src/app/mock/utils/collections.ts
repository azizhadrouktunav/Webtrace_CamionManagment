export function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  return items.some((i) => i.id === item.id)
    ? items.map((i) => (i.id === item.id ? item : i))
    : items.concat([item]);
}

export function removeById<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter((i) => i.id !== id);
}

export function toggleActive<T extends { id: string; active: boolean }>(items: T[], id: string): T[] {
  return items.map((i) => (i.id === id ? Object.assign({}, i, { active: !i.active }) : i));
}

export function nextId(prefix: string, ids: string[], pad = 3): string {
  let max = 0;
  for (let i = 0; i < ids.length; i++) {
    const n = parseInt(ids[i].replace(/\D/g, ''), 10);
    if (Number.isFinite(n) && n > max) {
      max = n;
    }
  }
  const num = String(max + 1);
  const padded = pad > num.length ? ('000000000' + num).slice(-pad) : num;
  return prefix + padded;
}

export function indexBy<T extends { id: string }>(items: T[]): { [id: string]: T } {
  const out: { [id: string]: T } = {};
  for (let i = 0; i < items.length; i++) {
    out[items[i].id] = items[i];
  }
  return out;
}

export function cloneArray<T>(items: T[]): T[] {
  return JSON.parse(JSON.stringify(items));
}
