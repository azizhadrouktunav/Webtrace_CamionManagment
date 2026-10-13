import { LatLng } from 'app/mock/types/fleet';

export function coordsToJson(coords: LatLng[]): string {
  return JSON.stringify(coords);
}

export function parseCoordsJson(text: string): LatLng[] | null {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || !parsed.length) {
      return null;
    }
    const out: LatLng[] = [];
    for (let i = 0; i < parsed.length; i++) {
      const p = parsed[i];
      if (!p || p.length < 2) {
        return null;
      }
      out.push([Number(p[0]), Number(p[1])]);
    }
    return out;
  } catch (e) {
    return null;
  }
}
