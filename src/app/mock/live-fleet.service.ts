import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, combineLatest, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { IDLE_POINT, MAP_CENTER, OFFLINE_POINT, TRUCK_PARK } from 'app/mock/data/geo';
import { STANDARD_CYCLE } from 'app/mock/data/missions';
import { FixedSite, LatLng, LiveTruck, Mission, Port, RouteLine, StockZone, Truck } from 'app/mock/types/fleet';
import { centroid } from 'app/mock/utils/geo';
import { computeTruckState, lastUpdateSeconds, SimContext } from 'app/mock/utils/simulation';
import { MockStoreService } from './mock-store.service';

@Injectable({ providedIn: 'root' })
export class LiveFleetService implements OnDestroy {
  private tick$ = new BehaviorSubject<number>(0);
  private live$ = new BehaviorSubject<LiveTruck[]>([]);
  private sub: Subscription;

  constructor(private store: MockStoreService) {
    this.sub = combineLatest([
      this.store.trucks,
      this.store.missions,
      this.store.stockZones,
      this.store.ports,
      this.store.routes,
      this.store.workshops,
      this.store.pauseZones,
      this.tick$.asObservable()
    ]).subscribe((values) => {
      const trucks = values[0] as Truck[];
      const missions = values[1] as Mission[];
      const stockZones = values[2] as StockZone[];
      const ports = values[3] as Port[];
      const routes = values[4] as RouteLine[];
      const workshops = values[5] as FixedSite[];
      const pauseZones = values[6] as FixedSite[];
      const tick = values[7] as number;
      const missionById: { [id: string]: Mission } = {};
      for (let i = 0; i < missions.length; i++) {
        missionById[missions[i].id] = missions[i];
      }
      const live = trucks.map((tr) => {
        const ctx = this.buildContext(tr, missionById, stockZones, ports, routes, workshops, pauseZones);
        const state = computeTruckState(tr, tick, ctx);
        return Object.assign({}, tr, state, { lastUpdateSec: lastUpdateSeconds(tr, tick) }) as LiveTruck;
      });
      this.live$.next(live);
    });

    this.sub.add(
      interval(1000).pipe(startWith(0)).subscribe(() => {
        this.tick$.next(this.tick$.value + 1);
      })
    );
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  get live(): Observable<LiveTruck[]> {
    return this.live$.asObservable();
  }

  get tick(): Observable<number> {
    return this.tick$.asObservable();
  }

  snapshot(): LiveTruck[] {
    return this.live$.value;
  }

  liveById(id: string): LiveTruck | undefined {
    return this.live$.value.find((t) => t.id === id);
  }

  getTrail(id: string, points = 40): LatLng[] {
    const truck = this.store.snapshotTrucks().find((t) => t.id === id);
    if (!truck || truck.status !== 'mission' || truck.fixedStage) {
      return [];
    }
    const missions = this.store.snapshotMissions();
    const missionById: { [id: string]: typeof missions[0] } = {};
    for (let i = 0; i < missions.length; i++) {
      missionById[missions[i].id] = missions[i];
    }
    const ctx = this.buildContext(
      truck,
      missionById,
      this.store.snapshotStockZones(),
      this.store.snapshotPorts(),
      this.store.snapshotRoutes(),
      this.store.snapshotWorkshops(),
      this.store.snapshotPauseZones()
    );
    const tick = this.tick$.value;
    const out: LatLng[] = [];
    for (let k = points; k >= 0; k--) {
      out.push(computeTruckState(truck, tick - k * 4, ctx).position);
    }
    return out;
  }

  private buildContext(
    truck: Truck,
    missionById: { [id: string]: any },
    stockZones: any[],
    ports: any[],
    routes: any[],
    workshops: any[],
    pauseZones: any[]
  ): SimContext {
    const mission = truck.missionId ? missionById[truck.missionId] : undefined;
    let zone = stockZones[0];
    if (mission) {
      const found = stockZones.find((z) => z.id === mission.stockZoneId);
      if (found) { zone = found; }
    }
    let port = ports[0];
    if (mission) {
      const foundP = ports.find((p) => p.id === mission.portId);
      if (foundP) { port = foundP; }
    }
    const stock = zone ? centroid(zone.coords) : MAP_CENTER;
    const portC = port ? centroid(port.coords) : MAP_CENTER;
    const allerR = routes.find((r) => r.direction === 'aller');
    const retourR = routes.find((r) => r.direction === 'retour');
    return {
      stock: stock,
      port: portC,
      aller: [stock].concat(allerR ? allerR.coords : []).concat([portC]),
      retour: [portC].concat(retourR ? retourR.coords : []).concat([stock]),
      workshop: workshops[0] && workshops[0].coords[0] ? workshops[0].coords[0] : stock,
      pause: pauseZones[0] && pauseZones[0].coords[0] ? pauseZones[0].coords[0] : stock,
      park: TRUCK_PARK,
      idle: IDLE_POINT,
      offline: OFFLINE_POINT,
      cycle: mission && mission.standardCycle ? mission.standardCycle : STANDARD_CYCLE,
      workshopMax: workshops[0] ? workshops[0].maxMin : 60,
      pauseMax: pauseZones[0] ? pauseZones[0].maxMin : 30
    };
  }
}
