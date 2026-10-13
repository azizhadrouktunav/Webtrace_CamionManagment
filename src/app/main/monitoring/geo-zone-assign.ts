import { Injectable } from '@angular/core';
import { LatLng } from 'app/mock/types/fleet';
import { MockStoreService } from 'app/mock/mock-store.service';
import {
  createPauseZone,
  createPort,
  createRoute,
  createStockZone,
  createWorkshop,
  GeoAssignKind
} from 'app/main/orient-suivi/geo-factory';
import { DrawType } from 'app/mock/types/fleet';
import { DrawnPlace, DrawnPolygon } from 'app/mock/data/geo-shapes';

export { GeoAssignKind };

export const ZONE_KIND_OPTIONS: { id: GeoAssignKind; label: string }[] = [
  { id: 'pause', label: 'Zone de pause' },
  { id: 'workshop', label: 'Zone Atelier' },
  { id: 'stock', label: 'Zone de stock' },
  { id: 'port', label: 'Port' }
];

export function zoneKindLabel(kind: GeoAssignKind | string | null | undefined): string {
  if (!kind) {
    return 'Non affectée';
  }
  const found = ZONE_KIND_OPTIONS.find(o => o.id === kind);
  return found ? found.label : String(kind);
}

/** Petit carré autour d’un point (emplacement → polygone stock/port). */
export function pointToSquare(center: LatLng, delta = 0.00035): LatLng[] {
  return [
    [center[0] - delta, center[1] - delta],
    [center[0] - delta, center[1] + delta],
    [center[0] + delta, center[1] + delta],
    [center[0] + delta, center[1] - delta]
  ];
}

/** Approximation polygone d’un cercle (géoperage). */
export function circleToPolygon(lat: number, lng: number, radiusKm: number, steps = 24): LatLng[] {
  const out: LatLng[] = [];
  const latRad = (lat * Math.PI) / 180;
  const dLat = radiusKm / 111.32;
  const dLng = radiusKm / (111.32 * Math.cos(latRad));
  for (let i = 0; i < steps; i++) {
    const a = (2 * Math.PI * i) / steps;
    out.push([lat + dLat * Math.sin(a), lng + dLng * Math.cos(a)]);
  }
  return out;
}

export function rectangleToPolygon(
  lat1: number, lng1: number, lat2: number, lng2: number
): LatLng[] {
  return [
    [lat1, lng1],
    [lat1, lng2],
    [lat2, lng2],
    [lat2, lng1]
  ];
}

@Injectable({ providedIn: 'root' })
export class GeoZoneAssignService {
  constructor(private store: MockStoreService) {}

  persistUnassignedPlace(name: string, lat: number, lng: number): void {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return;
    }
    this.store.upsertDrawnPlace({
      id: this.store.nextDrawnPlaceId(),
      name: trimmed,
      zoneKind: null,
      lat: lat,
      lng: lng,
      zoneId: null
    });
  }

  persistUnassignedPolygon(name: string, coords: LatLng[]): void {
    const trimmed = (name || '').trim();
    if (!trimmed || !coords || !coords.length) {
      return;
    }
    this.store.upsertDrawnPolygon({
      id: this.store.nextDrawnPolygonId(),
      name: trimmed,
      zoneKind: null,
      coords: coords.slice(),
      zoneId: null
    });
  }

  assignDrawnPlace(place: DrawnPlace, kind: GeoAssignKind): void {
    if (place.zoneId && place.zoneKind) {
      this.removeAssigned(place.zoneKind, place.zoneId);
    }
    const point: LatLng = [place.lat, place.lng];
    const coords = kind === 'workshop' || kind === 'pause' ? [point] : pointToSquare(point);
    const zoneId = this.createAssignedZone(kind, place.name, coords, 'marker');
    this.store.upsertDrawnPlace(Object.assign({}, place, { zoneKind: kind, zoneId: zoneId }));
  }

  assignDrawnPolygon(polygon: DrawnPolygon, kind: GeoAssignKind): void {
    if (polygon.zoneId && polygon.zoneKind) {
      this.removeAssigned(polygon.zoneKind, polygon.zoneId);
    }
    const zoneId = this.createAssignedZone(kind, polygon.name, polygon.coords || [], 'polygon');
    this.store.upsertDrawnPolygon(Object.assign({}, polygon, { zoneKind: kind, zoneId: zoneId }));
  }

  createAssignedZone(kind: GeoAssignKind, name: string, coords: LatLng[], drawType: DrawType): string {
    if (kind === 'port') {
      const id = this.store.nextPortId();
      this.store.upsertPort(createPort(id, name, coords, drawType));
      return id;
    }
    if (kind === 'stock') {
      const id = this.store.nextStockId();
      this.store.upsertStockZone(createStockZone(id, name, coords, drawType));
      return id;
    }
    if (kind === 'workshop') {
      const id = this.store.nextWorkshopId();
      this.store.upsertWorkshop(createWorkshop(id, name, coords, drawType));
      return id;
    }
    const id = this.store.nextPauseId();
    this.store.upsertPauseZone(createPauseZone(id, name, coords, drawType));
    return id;
  }

  removeAssigned(kind: GeoAssignKind, id: string): void {
    if (kind === 'port') {
      this.store.removePort(id);
    } else if (kind === 'stock') {
      this.store.removeStockZone(id);
    } else if (kind === 'workshop') {
      this.store.removeWorkshop(id);
    } else if (kind === 'pause') {
      this.store.removePauseZone(id);
    }
  }

  persistMockZone(kind: GeoAssignKind, name: string, coords: LatLng[]): void {
    const trimmed = (name || '').trim();
    if (!trimmed || !coords || !coords.length) {
      return;
    }
    const zoneId = this.createAssignedZone(kind, trimmed, coords, 'polygon');
    this.store.upsertDrawnPolygon({
      id: this.store.nextDrawnPolygonId(),
      name: trimmed,
      zoneKind: kind,
      coords: coords.slice(),
      zoneId: zoneId
    });
  }

  /** Emplacement (1 point) : atelier/pause = point ; stock/port = carré. */
  persistPlace(kind: GeoAssignKind, name: string, lat: number, lng: number): void {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return;
    }
    const point: LatLng = [lat, lng];
    const coords = kind === 'workshop' || kind === 'pause' ? [point] : pointToSquare(point);
    const zoneId = this.createAssignedZone(kind, trimmed, coords, 'marker');
    this.store.upsertDrawnPlace({
      id: this.store.nextDrawnPlaceId(),
      name: trimmed,
      zoneKind: kind,
      lat: lat,
      lng: lng,
      zoneId: zoneId
    });
  }

  renameLinked(zoneId: string, name: string): void {
    this.touchLinked(zoneId, (item) => Object.assign({}, item, { name: name }));
  }

  relinkDrawn(oldZoneId: string, newZoneId: string, kind: GeoAssignKind, name: string): void {
    this.touchLinked(oldZoneId, (item) => Object.assign({}, item, {
      name: name,
      zoneKind: kind,
      zoneId: newZoneId
    }));
  }

  removeLinked(zoneId: string): void {
    const places = this.store.snapshotDrawnPlaces();
    let i: number;
    for (i = 0; i < places.length; i++) {
      if (places[i].zoneId === zoneId) {
        this.store.removeDrawnPlace(places[i].id);
      }
    }
    const polygons = this.store.snapshotDrawnPolygons();
    for (i = 0; i < polygons.length; i++) {
      if (polygons[i].zoneId === zoneId) {
        this.store.removeDrawnPolygon(polygons[i].id);
      }
    }
  }

  private touchLinked(zoneId: string, mapItem: (item: DrawnPlace | DrawnPolygon) => DrawnPlace | DrawnPolygon): void {
    const places = this.store.snapshotDrawnPlaces();
    let i: number;
    for (i = 0; i < places.length; i++) {
      if (places[i].zoneId === zoneId) {
        this.store.upsertDrawnPlace(mapItem(places[i]) as DrawnPlace);
      }
    }
    const polygons = this.store.snapshotDrawnPolygons();
    for (i = 0; i < polygons.length; i++) {
      if (polygons[i].zoneId === zoneId) {
        this.store.upsertDrawnPolygon(mapItem(polygons[i]) as DrawnPolygon);
      }
    }
  }

  persistWay(name: string, coords: LatLng[]): void {
    const trimmed = (name || '').trim();
    if (!trimmed || !coords || !coords.length) {
      return;
    }
    this.store.upsertDrawnWay({
      id: this.store.nextDrawnWayId(),
      name: trimmed,
      coords: coords.slice()
    });
    this.store.upsertRoute(createRoute(this.store.nextRouteId(), trimmed, coords, 'aller'));
  }
}
