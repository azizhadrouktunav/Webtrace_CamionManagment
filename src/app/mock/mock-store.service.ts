import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { alerts as seedAlerts } from 'app/mock/data/alerts';
import { drivers as seedDrivers } from 'app/mock/data/drivers';
import {
  pauseZones as seedPause,
  ports as seedPorts,
  routes as seedRoutes,
  stockZones as seedStock,
  workshops as seedWorkshops
} from 'app/mock/data/geo';
import { missions as seedMissions } from 'app/mock/data/missions';
import {
  alertRules as seedAlertRules,
  cycleDefaultsSeed,
  recipients as seedRecipients,
  shifts as seedShifts,
  users as seedUsers
} from 'app/mock/data/settings';
import { ships as seedShips } from 'app/mock/data/ships';
import { trucks as seedTrucks } from 'app/mock/data/trucks';
import {
  DrawnPlace,
  DrawnPolygon,
  DrawnWay,
  drawnPlacesSeed,
  drawnPolygonsSeed,
  drawnWaysSeed
} from 'app/mock/data/geo-shapes';
import {
  Driver,
  FixedSite,
  FleetAlert,
  Mission,
  Port,
  RouteLine,
  Ship,
  StockZone,
  Truck
} from 'app/mock/types/fleet';
import { AlertRecipient, AlertRule, CycleDefaults, ShiftConfig, UserAccount } from 'app/mock/types/settings';
import { cloneArray, indexBy, nextId, removeById, toggleActive, upsert } from 'app/mock/utils/collections';
import { missionDateTime, resolveTruckStatus, withResolvedStatus } from 'app/mock/utils/truck-status';

const FLEET_STORAGE_KEY = 'orient-fleet-v1';

interface FleetMemory {
  version: number;
  missions: Mission[];
  ships: Ship[];
  drivers: Driver[];
  trucks: Truck[];
}

function readFleetMemory(): FleetMemory | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(FLEET_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as FleetMemory;
    if (!parsed || parsed.version !== 1) {
      return null;
    }
    if (!Array.isArray(parsed.missions) || !Array.isArray(parsed.ships) || !Array.isArray(parsed.drivers) || !Array.isArray(parsed.trucks)) {
      return null;
    }
    return parsed;
  } catch (err) {
    return null;
  }
}

const fleetMemory = readFleetMemory();

@Injectable({ providedIn: 'root' })
export class MockStoreService {
  private trucks$ = new BehaviorSubject<Truck[]>(cloneArray(fleetMemory ? fleetMemory.trucks : seedTrucks));
  private drivers$ = new BehaviorSubject<Driver[]>(cloneArray(fleetMemory ? fleetMemory.drivers : seedDrivers));
  private missions$ = new BehaviorSubject<Mission[]>(cloneArray(fleetMemory ? fleetMemory.missions : seedMissions));
  private ships$ = new BehaviorSubject<Ship[]>(cloneArray(fleetMemory ? fleetMemory.ships : seedShips));
  private alerts$ = new BehaviorSubject<FleetAlert[]>(cloneArray(seedAlerts));
  private stockZones$ = new BehaviorSubject<StockZone[]>(cloneArray(seedStock));
  private ports$ = new BehaviorSubject<Port[]>(cloneArray(seedPorts));
  private routes$ = new BehaviorSubject<RouteLine[]>(cloneArray(seedRoutes));
  private workshops$ = new BehaviorSubject<FixedSite[]>(cloneArray(seedWorkshops));
  private pauseZones$ = new BehaviorSubject<FixedSite[]>(cloneArray(seedPause));
  private shifts$ = new BehaviorSubject<ShiftConfig[]>(cloneArray(seedShifts));
  private users$ = new BehaviorSubject<UserAccount[]>(cloneArray(seedUsers));
  private recipients$ = new BehaviorSubject<AlertRecipient[]>(cloneArray(seedRecipients));
  private alertRules$ = new BehaviorSubject<AlertRule[]>(cloneArray(seedAlertRules));
  private cycleDefaults$ = new BehaviorSubject<CycleDefaults>(cloneCycleDefaults(cycleDefaultsSeed));
  private drawnPlaces$ = new BehaviorSubject<DrawnPlace[]>(cloneArray(drawnPlacesSeed));
  private drawnPolygons$ = new BehaviorSubject<DrawnPolygon[]>(cloneArray(drawnPolygonsSeed));
  private drawnWays$ = new BehaviorSubject<DrawnWay[]>(cloneArray(drawnWaysSeed));

  get trucks(): Observable<Truck[]> { return this.trucks$.asObservable(); }
  get drivers(): Observable<Driver[]> { return this.drivers$.asObservable(); }
  get missions(): Observable<Mission[]> { return this.missions$.asObservable(); }
  get ships(): Observable<Ship[]> { return this.ships$.asObservable(); }
  get alerts(): Observable<FleetAlert[]> { return this.alerts$.asObservable(); }
  get stockZones(): Observable<StockZone[]> { return this.stockZones$.asObservable(); }
  get ports(): Observable<Port[]> { return this.ports$.asObservable(); }
  get routes(): Observable<RouteLine[]> { return this.routes$.asObservable(); }
  get workshops(): Observable<FixedSite[]> { return this.workshops$.asObservable(); }
  get pauseZones(): Observable<FixedSite[]> { return this.pauseZones$.asObservable(); }
  get shifts(): Observable<ShiftConfig[]> { return this.shifts$.asObservable(); }
  get users(): Observable<UserAccount[]> { return this.users$.asObservable(); }
  get recipients(): Observable<AlertRecipient[]> { return this.recipients$.asObservable(); }
  get alertRules(): Observable<AlertRule[]> { return this.alertRules$.asObservable(); }
  get cycleDefaults(): Observable<CycleDefaults> { return this.cycleDefaults$.asObservable(); }
  get drawnPlaces(): Observable<DrawnPlace[]> { return this.drawnPlaces$.asObservable(); }
  get drawnPolygons(): Observable<DrawnPolygon[]> { return this.drawnPolygons$.asObservable(); }
  get drawnWays(): Observable<DrawnWay[]> { return this.drawnWays$.asObservable(); }

  snapshotTrucks(): Truck[] { return this.trucks$.value; }
  snapshotDrivers(): Driver[] { return this.drivers$.value; }
  snapshotMissions(): Mission[] { return this.missions$.value; }
  snapshotShips(): Ship[] { return this.ships$.value; }
  snapshotAlerts(): FleetAlert[] { return this.alerts$.value; }
  snapshotStockZones(): StockZone[] { return this.stockZones$.value; }
  snapshotPorts(): Port[] { return this.ports$.value; }
  snapshotRoutes(): RouteLine[] { return this.routes$.value; }
  snapshotWorkshops(): FixedSite[] { return this.workshops$.value; }
  snapshotPauseZones(): FixedSite[] { return this.pauseZones$.value; }
  snapshotDrawnPlaces(): DrawnPlace[] { return this.drawnPlaces$.value; }
  snapshotDrawnPolygons(): DrawnPolygon[] { return this.drawnPolygons$.value; }
  snapshotShifts(): ShiftConfig[] { return this.shifts$.value; }
  snapshotUsers(): UserAccount[] { return this.users$.value; }
  snapshotRecipients(): AlertRecipient[] { return this.recipients$.value; }
  snapshotAlertRules(): AlertRule[] { return this.alertRules$.value; }
  snapshotCycleDefaults(): CycleDefaults { return cloneCycleDefaults(this.cycleDefaults$.value); }

  truckById(id: string): Truck | undefined { return indexBy(this.trucks$.value)[id]; }
  driverById(id: string): Driver | undefined { return indexBy(this.drivers$.value)[id]; }
  missionById(id: string): Mission | undefined { return indexBy(this.missions$.value)[id]; }
  shipById(id: string): Ship | undefined { return indexBy(this.ships$.value)[id]; }

  upsertTruck(item: Truck): void {
    const resolved = withResolvedStatus(item, this.missions$.value);
    this.trucks$.next(upsert(this.trucks$.value, resolved));
    this.persistFleet();
  }
  removeTruck(id: string): void {
    this.trucks$.next(removeById(this.trucks$.value, id));
    this.persistFleet();
  }
  setTrucks(items: Truck[]): void {
    const missions = this.missions$.value;
    this.trucks$.next(items.map((t) => withResolvedStatus(t, missions)));
    this.persistFleet();
  }

  upsertDriver(item: Driver): void {
    this.drivers$.next(upsert(this.drivers$.value, item));
    this.persistFleet();
  }
  removeDriver(id: string): void {
    this.drivers$.next(removeById(this.drivers$.value, id));
    this.persistFleet();
  }
  setDrivers(items: Driver[]): void {
    this.drivers$.next(items.slice());
    this.persistFleet();
  }

  upsertMission(item: Mission): void {
    this.missions$.next(upsert(this.missions$.value, item));
    this.resyncTruckStatuses();
    this.persistFleet();
  }
  removeMission(id: string): void {
    this.missions$.next(removeById(this.missions$.value, id));
    this.resyncTruckStatuses();
    this.persistFleet();
  }
  setMissions(items: Mission[]): void {
    this.missions$.next(items.slice());
    this.resyncTruckStatuses();
    this.persistFleet();
  }

  upsertShip(item: Ship): void {
    this.ships$.next(upsert(this.ships$.value, item));
    this.persistFleet();
  }
  removeShip(id: string): void {
    this.ships$.next(removeById(this.ships$.value, id));
    this.persistFleet();
  }
  setShips(items: Ship[]): void {
    this.ships$.next(items.slice());
    this.persistFleet();
  }

  upsertAlert(item: FleetAlert): void { this.alerts$.next(upsert(this.alerts$.value, item)); }
  setAlerts(items: FleetAlert[]): void { this.alerts$.next(items.slice()); }

  upsertStockZone(item: StockZone): void { this.stockZones$.next(upsert(this.stockZones$.value, item)); }
  removeStockZone(id: string): void { this.stockZones$.next(removeById(this.stockZones$.value, id)); }
  setStockZones(items: StockZone[]): void { this.stockZones$.next(items.slice()); }
  toggleStockZone(id: string): void { this.stockZones$.next(toggleActive(this.stockZones$.value, id)); }

  upsertPort(item: Port): void { this.ports$.next(upsert(this.ports$.value, item)); }
  removePort(id: string): void { this.ports$.next(removeById(this.ports$.value, id)); }
  setPorts(items: Port[]): void { this.ports$.next(items.slice()); }
  togglePort(id: string): void { this.ports$.next(toggleActive(this.ports$.value, id)); }

  upsertRoute(item: RouteLine): void { this.routes$.next(upsert(this.routes$.value, item)); }
  removeRoute(id: string): void { this.routes$.next(removeById(this.routes$.value, id)); }
  setRoutes(items: RouteLine[]): void { this.routes$.next(items.slice()); }
  toggleRoute(id: string): void { this.routes$.next(toggleActive(this.routes$.value, id)); }

  upsertWorkshop(item: FixedSite): void { this.workshops$.next(upsert(this.workshops$.value, item)); }
  removeWorkshop(id: string): void { this.workshops$.next(removeById(this.workshops$.value, id)); }
  setWorkshops(items: FixedSite[]): void { this.workshops$.next(items.slice()); }
  toggleWorkshop(id: string): void { this.workshops$.next(toggleActive(this.workshops$.value, id)); }

  upsertPauseZone(item: FixedSite): void { this.pauseZones$.next(upsert(this.pauseZones$.value, item)); }
  removePauseZone(id: string): void { this.pauseZones$.next(removeById(this.pauseZones$.value, id)); }
  setPauseZones(items: FixedSite[]): void { this.pauseZones$.next(items.slice()); }
  togglePauseZone(id: string): void { this.pauseZones$.next(toggleActive(this.pauseZones$.value, id)); }

  setShifts(items: ShiftConfig[]): void { this.shifts$.next(items.slice()); }
  upsertUser(item: UserAccount): void { this.users$.next(upsert(this.users$.value, item)); }
  removeUser(id: string): void { this.users$.next(removeById(this.users$.value, id)); }
  setUsers(items: UserAccount[]): void { this.users$.next(items.slice()); }
  upsertRecipient(item: AlertRecipient): void { this.recipients$.next(upsert(this.recipients$.value, item)); }
  removeRecipient(id: string): void { this.recipients$.next(removeById(this.recipients$.value, id)); }
  setAlertRules(items: AlertRule[]): void { this.alertRules$.next(items.slice()); }
  setCycleDefaults(value: CycleDefaults): void { this.cycleDefaults$.next(cloneCycleDefaults(value)); }

  nextTruckId(): string { return nextId('TRK-', this.trucks$.value.map((t) => t.id)); }
  nextDriverId(): string { return nextId('DRV-', this.drivers$.value.map((d) => d.id)); }
  nextMissionId(): string { return nextId('NAVIRE-', this.missions$.value.map((m) => m.id)); }
  nextShipId(): string { return nextId('SHP-', this.ships$.value.map((s) => s.id), 2); }
  nextPortId(): string { return nextId('PRT-', this.ports$.value.map((p) => p.id), 2); }
  nextStockId(): string { return nextId('STK-', this.stockZones$.value.map((z) => z.id), 2); }
  nextRouteId(): string { return nextId('RTE-', this.routes$.value.map((r) => r.id), 2); }
  nextWorkshopId(): string { return nextId('WKS-', this.workshops$.value.map((w) => w.id), 2); }
  nextPauseId(): string { return nextId('PAU-', this.pauseZones$.value.map((p) => p.id), 2); }
  nextUserId(): string { return nextId('USR-', this.users$.value.map((u) => u.id), 2); }
  nextRecipientId(): string { return nextId('RCP-', this.recipients$.value.map((r) => r.id), 2); }
  nextDrawnPlaceId(): string { return nextId('DPL-', this.drawnPlaces$.value.map((p) => p.id), 2); }
  nextDrawnPolygonId(): string { return nextId('DPY-', this.drawnPolygons$.value.map((p) => p.id), 2); }
  nextDrawnWayId(): string { return nextId('DWY-', this.drawnWays$.value.map((w) => w.id), 2); }

  upsertDrawnPlace(item: DrawnPlace): void {
    this.drawnPlaces$.next(upsert(this.drawnPlaces$.value, item));
  }
  removeDrawnPlace(id: string): void {
    this.drawnPlaces$.next(removeById(this.drawnPlaces$.value, id));
  }
  upsertDrawnPolygon(item: DrawnPolygon): void {
    this.drawnPolygons$.next(upsert(this.drawnPolygons$.value, item));
  }
  removeDrawnPolygon(id: string): void {
    this.drawnPolygons$.next(removeById(this.drawnPolygons$.value, id));
  }
  upsertDrawnWay(item: DrawnWay): void {
    this.drawnWays$.next(upsert(this.drawnWays$.value, item));
  }
  removeDrawnWay(id: string): void {
    this.drawnWays$.next(removeById(this.drawnWays$.value, id));
  }

  openAlertsCount(): Observable<number> {
    return this.alerts$.pipe(map((a) => a.filter((x) => x.status === 'open').length));
  }

  /** Promote planned missions whose start date and time have been reached. */
  syncScheduledLaunches(now?: Date): void {
    const at = now || new Date();
    const due: string[] = [];
    const missions = this.missions$.value;
    let i: number;
    for (i = 0; i < missions.length; i++) {
      const mission = missions[i];
      if (mission.status !== 'planned') {
        continue;
      }
      const start = missionDateTime(mission.date, mission.start);
      if (start && start.getTime() <= at.getTime()) {
        due.push(mission.id);
      }
    }
    for (i = 0; i < due.length; i++) {
      this.launchMission(due[i]);
    }
  }

  /** Launch a mission: mark running and assign trucks/ships. */
  launchMission(missionId: string): void {
    const mission = this.missionById(missionId);
    if (!mission) { return; }
    const updated = Object.assign({}, mission, { status: 'running' as const });
    this.missions$.next(upsert(this.missions$.value, updated));
    const trucks = this.trucks$.value.map((t) => {
      if (mission.truckIds.indexOf(t.id) >= 0) {
        return Object.assign({}, t, { missionId: mission.id });
      }
      return t;
    });
    this.setTrucks(trucks);
    const ship = this.shipById(mission.shipId);
    if (ship) {
      this.upsertShip(Object.assign({}, ship, { missionId: mission.id, status: 'loading' as const }));
    }
  }

  completeMission(missionId: string): void {
    const mission = this.missionById(missionId);
    if (!mission) { return; }
    this.missions$.next(
      upsert(this.missions$.value, Object.assign({}, mission, { status: 'done' as const }))
    );
    const trucks = this.trucks$.value.map((t) => {
      if (t.missionId === missionId) {
        return Object.assign({}, t, { missionId: null });
      }
      return t;
    });
    this.setTrucks(trucks);
    const ship = this.shipById(mission.shipId);
    if (ship) {
      this.upsertShip(Object.assign({}, ship, { status: 'departed' as const }));
    }
  }

  cancelMission(missionId: string): void {
    const mission = this.missionById(missionId);
    if (!mission) { return; }
    this.missions$.next(
      upsert(this.missions$.value, Object.assign({}, mission, { status: 'cancelled' as const }))
    );
    const trucks = this.trucks$.value.map((t) => {
      if (t.missionId === missionId) {
        return Object.assign({}, t, { missionId: null });
      }
      return t;
    });
    this.setTrucks(trucks);
  }

  /** Recompute truck.status from mission assignment + workshop stage. */
  resyncTruckStatuses(): void {
    const missions = this.missions$.value;
    const next = this.trucks$.value.map((t) => {
      const status = resolveTruckStatus(t, missions);
      if (t.status === status) {
        return t;
      }
      return Object.assign({}, t, { status: status });
    });
    this.trucks$.next(next);
    this.persistFleet();
  }

  private persistFleet(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      const payload: FleetMemory = {
        version: 1,
        missions: this.missions$.value,
        ships: this.ships$.value,
        drivers: this.drivers$.value,
        trucks: this.trucks$.value
      };
      localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      return;
    }
  }
}

function cloneCycleDefaults(value: CycleDefaults): CycleDefaults {
  return {
    cycle: Object.assign({}, value.cycle),
    contingency: value.contingency || 0,
    normalAlertMin: value.normalAlertMin,
    criticalAlertMin: value.criticalAlertMin
  };
}
