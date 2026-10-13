import { Mission, Truck } from '../types/fleet';

/** Trips counted from GPS geofence cycles (stock → port → stock). */
export function missionTrips(m: Mission, trucks: Truck[]): number {
  if (m.status !== 'running') {
    return m.tripsDone || 0;
  }
  let live = 0;
  let i: number;
  for (i = 0; i < trucks.length; i++) {
    if (trucks[i].missionId === m.id) {
      live += trucks[i].tripsDone || 0;
    }
  }
  return Math.max(live, m.tripsDone || 0);
}
