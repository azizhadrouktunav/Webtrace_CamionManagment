import { DrawType, FixedSite, LatLng, Port, RouteLine, StockZone } from 'app/mock/types/fleet';

export type GeoAssignKind = 'port' | 'stock' | 'workshop' | 'pause';

export function createPort(id: string, name: string, coords: LatLng[], drawType: DrawType = 'polygon'): Port {
  return {
    id: id,
    name: name,
    coords: cloneCoords(coords),
    active: true,
    drawType: drawType,
    location: 'Sfax',
    avgUnloading: 5,
    berth: '—'
  };
}

export function createStockZone(id: string, name: string, coords: LatLng[], drawType: DrawType = 'polygon'): StockZone {
  return {
    id: id,
    name: name,
    coords: cloneCoords(coords),
    active: true,
    drawType: drawType,
    capacity: 10000,
    stockLevel: 5000,
    activity: 'idle',
    loadingStatus: 'Disponible'
  };
}

export function createWorkshop(id: string, name: string, coords: LatLng[], drawType: DrawType = 'polygon'): FixedSite {
  return {
    id: id,
    name: name,
    coords: cloneCoords(coords),
    active: true,
    drawType: drawType,
    kind: 'workshop',
    radiusM: 40,
    visitsToday: 0,
    avgMin: 0,
    totalVisits: 0,
    maxMin: 0,
    excessAlerts: 0,
    description: ''
  };
}

export function createPauseZone(id: string, name: string, coords: LatLng[], drawType: DrawType = 'polygon'): FixedSite {
  return {
    id: id,
    name: name,
    coords: cloneCoords(coords),
    active: true,
    drawType: drawType,
    kind: 'pause',
    radiusM: 40,
    visitsToday: 0,
    avgMin: 0,
    totalVisits: 0,
    maxMin: 0,
    excessAlerts: 0,
    description: ''
  };
}

export function createRoute(
  id: string,
  name: string,
  coords: LatLng[],
  direction: 'aller' | 'retour' | 'alternatif'
): RouteLine {
  return {
    id: id,
    name: name,
    coords: cloneCoords(coords),
    active: true,
    origin: 'Stock',
    destination: 'Port',
    distanceKm: 12,
    expectedMin: 25,
    direction: direction,
    drawType: 'polyline'
  };
}

function cloneCoords(coords: LatLng[]): LatLng[] {
  const out: LatLng[] = [];
  for (let i = 0; i < coords.length; i++) {
    out.push([coords[i][0], coords[i][1]]);
  }
  return out;
}
