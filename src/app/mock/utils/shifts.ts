import { Mission, MissionShift } from '../types/fleet';
import { ShiftConfig } from '../types/settings';

export function inferShift(start: string): MissionShift {
  const h = Number(start.split(':')[0]) || 0;
  if (h >= 22 || h < 6) {
    return 'night';
  }
  return h < 14 ? 'morning' : 'afternoon';
}

export function shiftLabel(m: Mission, shifts: ShiftConfig[]): string {
  const id = m.shift || inferShift(m.start);
  const found = shifts.find((s) => s.id === id);
  return found ? found.label : '—';
}
