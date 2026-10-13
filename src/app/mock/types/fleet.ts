export type LatLng = [number, number];
export type HealthLevel = 'normal' | 'warning' | 'alert' | 'offline';
export type TruckStatus = 'mission' | 'available' | 'off_mission';
export type GpsStatus = 'online' | 'weak' | 'offline';
export type Stage = 'loading' | 'outbound' | 'unloading' | 'return' | 'workshop' | 'pause' | 'parked';
export type MissionStatus = 'planned' | 'running' | 'done' | 'cancelled';
export type AlertLevel = 'critical' | 'warning' | 'info';
export type AlertStatus = 'open' | 'acknowledged' | 'resolved';
export type AlertType =
'route_delay' |
'stock_excess' |
'port_excess' |
'workshop_excess' |
'pause_excess' |
'zone_exit' |
'off_mission' |
'gps_offline' |
'long_stop';
export type ShipStatus = 'expected' | 'berthed' | 'loading' | 'departed';
export type DriverStatus = 'on_duty' | 'break' | 'off_duty';

export interface CycleStandard {
  loading: number;
  outbound: number;
  unloading: number;
  return: number;
}

export interface Truck {
  id: string;
  plate: string;
  name: string;
  type: string;
  driverId: string | null;
  missionId: string | null;
  status: TruckStatus;
  health: HealthLevel;
  gps: GpsStatus;
  tripsDone: number;
  tripsTarget: number;
  cycleAvg: number;
  delays: number;
  timeStock: number;
  timePort: number;
  timeWorkshop: number;
  timePause: number;
  workshopVisits: number;
  cycleOffset: number;
  speedFactor: number;
  fixedStage?: 'workshop' | 'pause';
  axle3Weight?: number;
  engineHours?: string;
  axle4Weight?: number;
  department?: string;
  fastBrakes?: number;
  iconUrl?: string;
  brand?: string;
  model?: string;
  year?: number;
  fuelType?: string;
  mileage?: number;
  fuelCapacity?: number;
  simCardNumber?: string;
  equipmentSerial?: string;
}

export interface LiveTruck extends Truck {
  position: LatLng;
  stage: Stage;
  stageElapsed: number;
  stageExpected: number;
  stageDelay: number;
  lastUpdateSec: number;
}

export interface Driver {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  personnelCode: string;
  phone: string;
  smartLockCloseCard: string;
  smartLockOpenCard: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  department: string;
  cin: string;
  licenceCategory: string;
  licenceNumber: string;
  truckId: string | null;
  status: DriverStatus;
  trips: number;
  cycleAvg: number;
  delays: number;
  alerts: number;
  since: string;
}

export type MissionShift = 'morning' | 'afternoon' | 'night' | 'poste4' | 'poste5';

export interface Mission {
  id: string;
  name?: string;
  shift?: MissionShift;
  driverIds?: string[];
  contingency?: number;
  shipId: string;
  date: string;
  start: string;
  end: string;
  stockZoneId: string;
  portId: string;
  truckIds: string[];
  tripsTarget: number;
  tripsDone: number;
  status: MissionStatus;
  standardCycle: CycleStandard;
  actualCycle: CycleStandard;
  notes: string;
}

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  date: string;
  portId: string;
  missionId: string | null;
  tonnage: number;
  status: ShipStatus;
  notes: string;
}

export interface FleetAlert {
  id: string;
  time: string;
  truckId: string;
  driverId: string | null;
  missionId: string | null;
  type: AlertType;
  zone: string;
  durationMin: number;
  level: AlertLevel;
  status: AlertStatus;
  message: string;
}

export type DrawType = 'polygon' | 'marker' | 'polyline';

export interface GeoShape {
  id: string;
  name: string;
  coords: LatLng[];
  active: boolean;
  drawType?: DrawType;
}

export interface Port extends GeoShape {
  location: string;
  avgUnloading: number;
  berth: string;
}

export interface StockZone extends GeoShape {
  capacity: number;
  stockLevel: number;
  activity: 'loading' | 'idle' | 'saturated';
  loadingStatus: string;
}

export interface RouteLine extends GeoShape {
  origin: string;
  destination: string;
  distanceKm: number;
  expectedMin: number;
  direction: 'aller' | 'retour' | 'alternatif';
}

export interface FixedSite extends GeoShape {
  kind: 'workshop' | 'pause';
  radiusM: number;
  visitsToday: number;
  avgMin: number;
  totalVisits: number;
  maxMin: number;
  excessAlerts: number;
  description: string;
}

export interface SiteVisit {
  id: string;
  siteId: string;
  truckId: string;
  entry: string;
  exit: string | null;
  durationMin: number;
  reason: string;
}