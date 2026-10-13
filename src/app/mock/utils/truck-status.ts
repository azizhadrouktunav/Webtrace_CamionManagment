import { Mission, Truck, TruckStatus } from '../types/fleet';

const ACTIVE_MISSION: { [k: string]: boolean } = {
  planned: true,
  running: true
};

/** True if truck is assigned to an active (non done/cancelled) mission. */
export function truckHasActiveMission(truck: Truck, missions: Mission[]): boolean {
  if (truck.missionId) {
    let i: number;
    for (i = 0; i < missions.length; i++) {
      if (missions[i].id === truck.missionId && ACTIVE_MISSION[missions[i].status]) {
        return true;
      }
    }
  }
  let j: number;
  for (j = 0; j < missions.length; j++) {
    const m = missions[j];
    if (!ACTIVE_MISSION[m.status]) {
      continue;
    }
    if (m.truckIds && m.truckIds.indexOf(truck.id) >= 0) {
      return true;
    }
  }
  return false;
}

/**
 * Auto status:
 * 1. Assigned to an active mission → mission
 * 2. In workshop (fixedStage) → off_mission
 * 3. Otherwise → available
 */
export function resolveTruckStatus(truck: Truck, missions: Mission[]): TruckStatus {
  if (truckHasActiveMission(truck, missions)) {
    return 'mission';
  }
  if (truck.fixedStage === 'workshop') {
    return 'off_mission';
  }
  return 'available';
}

export function withResolvedStatus(truck: Truck, missions: Mission[]): Truck {
  const status = resolveTruckStatus(truck, missions);
  if (truck.status === status) {
    return truck;
  }
  return Object.assign({}, truck, { status: status });
}

/** Parse mission date + HH:mm into local Date, or null. */
export function missionDateTime(dateIso: string, timeHm: string): Date | null {
  if (!dateIso || !timeHm) {
    return null;
  }
  const parts = timeHm.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  if (isNaN(h) || isNaN(m)) {
    return null;
  }
  const d = new Date(dateIso + 'T00:00:00');
  if (isNaN(d.getTime())) {
    return null;
  }
  d.setHours(h, m, 0, 0);
  return d;
}

/** Mission window covers the given instant (handles overnight end < start). */
export function missionActiveAt(mission: Mission, at: Date): boolean {
  if (!ACTIVE_MISSION[mission.status]) {
    return false;
  }
  const start = missionDateTime(mission.date, mission.start);
  let end = missionDateTime(mission.date, mission.end);
  if (!start || !end) {
    return mission.date === formatDateLocal(at);
  }
  if (end.getTime() <= start.getTime()) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }
  const t = at.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return y + '-' + m + '-' + day;
}

export function formatDateTimeLocalValue(d: Date): string {
  const date = formatDateLocal(d);
  const h = ('0' + d.getHours()).slice(-2);
  const min = ('0' + d.getMinutes()).slice(-2);
  return date + 'T' + h + ':' + min;
}
