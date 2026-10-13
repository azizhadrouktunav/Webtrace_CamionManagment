import { GeoAssignKind } from 'app/main/orient-suivi/geo-factory';
import { LatLng } from 'app/mock/types/fleet';

export interface DrawnPlace {
  id: string;
  name: string;
  zoneKind: GeoAssignKind | null;
  lat: number;
  lng: number;
  zoneId?: string | null;
}

export interface DrawnPolygon {
  id: string;
  name: string;
  zoneKind: GeoAssignKind | null;
  coords: LatLng[];
  zoneId?: string | null;
}

export interface DrawnWay {
  id: string;
  name: string;
  coords: LatLng[];
}

export const drawnPlacesSeed: DrawnPlace[] = [];
export const drawnPolygonsSeed: DrawnPolygon[] = [];
export const drawnWaysSeed: DrawnWay[] = [];
