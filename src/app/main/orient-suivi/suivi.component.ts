import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet-draw';
import { MAP_CENTER } from 'app/mock/data/geo';
import { LiveFleetService } from 'app/mock/live-fleet.service';
import { MockStoreService } from 'app/mock/mock-store.service';
import {
  FixedSite,
  FleetAlert,
  LatLng,
  LiveTruck,
  Port,
  RouteLine,
  StockZone
} from 'app/mock/types/fleet';
import {
  alertLevelMeta,
  alertStatusMeta,
  alertTypeLabel,
  stageMeta,
  truckStatusMeta
} from 'app/mock/utils/status';
import { chipClass } from 'app/main/orient-shared/orient-ui';
import { fmtAge, fmtAgo } from 'app/mock/utils/format';
import {
  createPauseZone,
  createPort,
  createRoute,
  createStockZone,
  createWorkshop
} from './geo-factory';
import {
  GeoAssignDialogComponent,
  GeoAssignDialogResult
} from './geo-assign-dialog/geo-assign-dialog.component';
import { GeoPanelMode } from './geo-manage-panel/geo-manage-panel.component';

@Component({
  selector: 'app-orient-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.scss']
})
export class SuiviComponent implements OnInit, OnDestroy, AfterViewInit {
  search = '';
  searchOpen = false;
  liveTrucks: LiveTruck[] = [];
  filteredTrucks: LiveTruck[] = [];
  alerts: FleetAlert[] = [];
  selectedTruckId: string | null = null;
  selectedTruck: LiveTruck | null = null;
  leftSize = 45;
  rightSize = 55;
  showOverlays = true;
  selectedTab = 0;
  healthCounts = { normal: 0, alert: 0, offline: 0 };
  menuTruck: LiveTruck | null = null;

  geoPanelMode: GeoPanelMode | null = null;
  highlightShapeId: string | null = null;

  truckStatusMeta = truckStatusMeta;
  stageMeta = stageMeta;
  alertTypeLabel = alertTypeLabel;
  alertLevelMeta = alertLevelMeta;
  alertStatusMeta = alertStatusMeta;
  chipClass = chipClass;
  fmtAgo = fmtAgo;
  fmtAge = fmtAge;

  private map: L.Map;
  private truckMarkers: { [id: string]: L.CircleMarker } = {};
  private overlayLayer: L.LayerGroup;
  private drawLayer: L.FeatureGroup;
  private trailLayer: L.Polyline;
  private drawHandler: any;
  private sub: Subscription;
  private mapReady = false;
  lastStock: StockZone[] = [];
  lastPorts: Port[] = [];
  lastWorkshops: FixedSite[] = [];
  lastPause: FixedSite[] = [];
  lastRoutes: RouteLine[] = [];
  private pendingLive: LiveTruck[] = [];
  private pendingDrawMode: 'polygon' | 'polyline' | 'marker' | null = null;

  constructor(
    private liveFleet: LiveFleetService,
    private store: MockStoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.liveFleet.live,
      this.store.alerts,
      this.store.stockZones,
      this.store.ports,
      this.store.workshops,
      this.store.pauseZones,
      this.store.routes
    ]).subscribe((values) => {
      const live = values[0] as LiveTruck[];
      const alerts = values[1] as FleetAlert[];
      const stock = values[2] as StockZone[];
      const ports = values[3] as Port[];
      const workshops = values[4] as FixedSite[];
      const pause = values[5] as FixedSite[];
      const routes = values[6] as RouteLine[];
      this.liveTrucks = live.slice();
      this.applyFilter();
      this.refreshHealthCounts();
      this.alerts = alerts.slice();
      this.lastStock = stock;
      this.lastPorts = ports;
      this.lastWorkshops = workshops;
      this.lastPause = pause;
      this.lastRoutes = routes;
      this.pendingLive = live.slice();
      if (this.selectedTruckId) {
        this.selectedTruck = live.find((t) => t.id === this.selectedTruckId) || null;
      }
      if (this.mapReady) {
        if (this.showOverlays) {
          this.refreshOverlays(stock, ports, workshops, pause, routes);
        }
        this.refreshTruckMarkers(live);
        this.refreshTrail();
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map('orientMap', { zoomControl: false }).setView(
      [MAP_CENTER[0], MAP_CENTER[1]],
      13
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);
    this.overlayLayer = L.layerGroup().addTo(this.map);
    this.drawLayer = new L.FeatureGroup();
    this.map.addLayer(this.drawLayer);

    const self = this;
    this.map.on(L.Draw.Event.CREATED, function(e: any) {
      self.onDrawCreated(e);
    });

    this.mapReady = true;
    this.refreshOverlays(
      this.lastStock,
      this.lastPorts,
      this.lastWorkshops,
      this.lastPause,
      this.lastRoutes
    );
    if (this.pendingLive.length) {
      this.refreshTruckMarkers(this.pendingLive);
    }
    setTimeout(function() {
      if (self.map) {
        self.map.invalidateSize();
      }
    }, 250);
  }

  ngOnDestroy(): void {
    this.stopDraw();
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  onSplitDragEnd(): void {
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 50);
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  selectTruck(truck: LiveTruck): void {
    this.selectedTruckId = truck.id;
    this.selectedTruck = truck;
    const marker = this.truckMarkers[truck.id];
    if (marker && this.map) {
      this.map.panTo(marker.getLatLng());
    }
    this.refreshTruckMarkers(this.liveTrucks);
    this.refreshTrail();
  }

  clearSelection(): void {
    this.selectedTruckId = null;
    this.selectedTruck = null;
    this.refreshTruckMarkers(this.liveTrucks);
    this.refreshTrail();
  }

  recenter(): void {
    if (!this.map) {
      return;
    }
    if (this.selectedTruck) {
      this.map.panTo(L.latLng(this.selectedTruck.position[0], this.selectedTruck.position[1]));
      return;
    }
    this.map.setView([MAP_CENTER[0], MAP_CENTER[1]], 13);
  }

  clearDrawing(): void {
    this.stopDraw();
    if (this.drawLayer) {
      this.drawLayer.clearLayers();
    }
  }

  toggleOverlays(): void {
    this.showOverlays = !this.showOverlays;
    if (!this.overlayLayer) {
      return;
    }
    if (this.showOverlays) {
      this.refreshOverlays(
        this.lastStock,
        this.lastPorts,
        this.lastWorkshops,
        this.lastPause,
        this.lastRoutes
      );
    } else {
      this.overlayLayer.clearLayers();
    }
  }

  startGeofence(): void {
    this.startDraw('polygon');
  }

  startRoute(): void {
    this.startDraw('polyline');
  }

  startGeoMarker(): void {
    this.startDraw('marker');
  }

  startGeoPolygon(): void {
    this.startDraw('polygon');
  }

  startGeoRoute(): void {
    this.startDraw('polyline');
  }

  openPanel(mode: GeoPanelMode): void {
    this.geoPanelMode = mode;
    this.highlightShapeId = null;
  }

  closePanel(): void {
    this.geoPanelMode = null;
    this.highlightShapeId = null;
  }

  onFocusShape(ev: { id: string; coords: LatLng[] }): void {
    this.highlightShapeId = ev.id;
    if (!this.map || !ev.coords || !ev.coords.length) {
      return;
    }
    const latlngs = ev.coords.map((c) => L.latLng(c[0], c[1]));
    if (latlngs.length === 1) {
      this.map.setView(latlngs[0], 16);
      return;
    }
    const bounds = L.latLngBounds(latlngs);
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  onToggleVisibility(ev: { id: string; kind: string }): void {
    if (ev.kind === 'port') {
      this.store.togglePort(ev.id);
    } else if (ev.kind === 'stock') {
      this.store.toggleStockZone(ev.id);
    } else if (ev.kind === 'workshop') {
      this.store.toggleWorkshop(ev.id);
    } else if (ev.kind === 'pause') {
      this.store.togglePauseZone(ev.id);
    } else if (ev.kind === 'route') {
      this.store.toggleRoute(ev.id);
    }
  }

  acknowledgeAlert(alert: FleetAlert): void {
    this.store.upsertAlert(Object.assign({}, alert, { status: 'acknowledged' as const }));
  }

  resolveAlert(alert: FleetAlert): void {
    this.store.upsertAlert(Object.assign({}, alert, { status: 'resolved' as const }));
  }

  missionLabel(truck: LiveTruck): string {
    if (!truck.missionId) {
      return '—';
    }
    const m = this.store.missionById(truck.missionId);
    return m ? m.id : truck.missionId;
  }

  ageToneClass(truck: LiveTruck): string {
    if (truck.health === 'alert' || truck.health === 'offline' || truck.lastUpdateSec >= 3600) {
      return 'suivi-table__age--alert';
    }
    if (truck.health === 'warning' || truck.lastUpdateSec >= 300) {
      return 'suivi-table__age--warn';
    }
    return 'suivi-table__age--ok';
  }

  private refreshHealthCounts(): void {
    let normal = 0;
    let alert = 0;
    let offline = 0;
    let i: number;
    for (i = 0; i < this.liveTrucks.length; i++) {
      const h = this.liveTrucks[i].health;
      if (h === 'alert') {
        alert++;
      } else if (h === 'offline' || h === 'warning') {
        offline++;
      } else {
        normal++;
      }
    }
    this.healthCounts = { normal: normal, alert: alert, offline: offline };
  }

  private startDraw(mode: 'polygon' | 'polyline' | 'marker'): void {
    this.stopDraw();
    this.pendingDrawMode = mode;
    this.geoPanelMode = null;
    if (!this.map) {
      return;
    }
    const DrawNS = (L as any).Draw;
    if (mode === 'polygon') {
      this.drawHandler = new DrawNS.Polygon(this.map, {});
    } else if (mode === 'polyline') {
      this.drawHandler = new DrawNS.Polyline(this.map, {});
    } else {
      this.drawHandler = new DrawNS.Marker(this.map, {});
    }
    this.drawHandler.enable();
  }

  private stopDraw(): void {
    if (this.drawHandler) {
      try {
        this.drawHandler.disable();
      } catch (e) {
        /* ignore */
      }
      this.drawHandler = null;
    }
    this.pendingDrawMode = null;
  }

  private onDrawCreated(e: any): void {
    const mode = this.pendingDrawMode || 'polygon';
    this.stopDraw();
    if (this.drawLayer) {
      this.drawLayer.clearLayers();
      this.drawLayer.addLayer(e.layer);
    }
    const coords = this.layerToCoords(e.layer, mode);
    if (!coords.length) {
      return;
    }
    const dialogMode = mode === 'marker' ? 'polygon' : mode;
    const dialogCoords =
      mode === 'marker'
        ? this.pointToSquare(coords[0])
        : coords;

    const ref = this.dialog.open(GeoAssignDialogComponent, {
      width: '420px',
      data: { coords: dialogCoords, mode: mode === 'polyline' ? 'polyline' : dialogMode }
    });
    ref.afterClosed().subscribe((result: GeoAssignDialogResult | null) => {
      if (this.drawLayer) {
        this.drawLayer.clearLayers();
      }
      if (!result) {
        return;
      }
      this.persistGeoResult(result);
    });
  }

  private persistGeoResult(result: GeoAssignDialogResult): void {
    if (result.kind === 'route') {
      const id = this.store.nextRouteId();
      this.store.upsertRoute(
        createRoute(id, result.name, result.coords, result.direction || 'aller')
      );
      return;
    }
    if (result.kind === 'port') {
      this.store.upsertPort(createPort(this.store.nextPortId(), result.name, result.coords));
    } else if (result.kind === 'stock') {
      this.store.upsertStockZone(createStockZone(this.store.nextStockId(), result.name, result.coords));
    } else if (result.kind === 'workshop') {
      this.store.upsertWorkshop(createWorkshop(this.store.nextWorkshopId(), result.name, result.coords));
    } else if (result.kind === 'pause') {
      this.store.upsertPauseZone(createPauseZone(this.store.nextPauseId(), result.name, result.coords));
    }
  }

  private layerToCoords(layer: any, mode: string): LatLng[] {
    const out: LatLng[] = [];
    if (mode === 'marker') {
      const ll = layer.getLatLng();
      out.push([ll.lat, ll.lng]);
      return out;
    }
    let latlngs: L.LatLng[] = [];
    if (mode === 'polygon') {
      const raw = layer.getLatLngs();
      if (raw.length && Array.isArray(raw[0])) {
        latlngs = raw[0] as L.LatLng[];
      } else {
        latlngs = raw as L.LatLng[];
      }
    } else {
      latlngs = layer.getLatLngs() as L.LatLng[];
    }
    let i: number;
    for (i = 0; i < latlngs.length; i++) {
      out.push([latlngs[i].lat, latlngs[i].lng]);
    }
    return out;
  }

  /** Approximate a small square around a point for marker-based places. */
  private pointToSquare(center: LatLng): LatLng[] {
    const d = 0.00035;
    return [
      [center[0] - d, center[1] - d],
      [center[0] - d, center[1] + d],
      [center[0] + d, center[1] + d],
      [center[0] + d, center[1] - d]
    ];
  }

  private applyFilter(): void {
    const q = (this.search || '').toLowerCase();
    if (!q) {
      this.filteredTrucks = this.liveTrucks.slice();
      return;
    }
    this.filteredTrucks = this.liveTrucks.filter((t) => {
      return (
        t.plate.toLowerCase().indexOf(q) >= 0 ||
        t.name.toLowerCase().indexOf(q) >= 0 ||
        t.id.toLowerCase().indexOf(q) >= 0
      );
    });
  }

  private refreshOverlays(
    stock: StockZone[],
    ports: Port[],
    workshops: FixedSite[],
    pause: FixedSite[],
    routes: RouteLine[]
  ): void {
    if (!this.overlayLayer) {
      return;
    }
    this.overlayLayer.clearLayers();
    let i: number;
    for (i = 0; i < stock.length; i++) {
      if (stock[i].active) {
        this.overlayLayer.addLayer(this.polygon(stock[i].coords, '#ea580c', 0.18));
      }
    }
    for (i = 0; i < ports.length; i++) {
      if (ports[i].active) {
        this.overlayLayer.addLayer(this.polygon(ports[i].coords, '#1e3a5f', 0.2));
      }
    }
    for (i = 0; i < workshops.length; i++) {
      if (workshops[i].active) {
        this.overlayLayer.addLayer(this.polygon(workshops[i].coords, '#475569', 0.18));
      }
    }
    for (i = 0; i < pause.length; i++) {
      if (pause[i].active) {
        this.overlayLayer.addLayer(this.polygon(pause[i].coords, '#64748b', 0.15));
      }
    }
    for (i = 0; i < routes.length; i++) {
      if (routes[i].active && routes[i].coords.length > 1) {
        const latlngs = routes[i].coords.map((c) => L.latLng(c[0], c[1]));
        const color = routes[i].direction === 'retour' ? '#fb8c00' : '#039be5';
        this.overlayLayer.addLayer(
          L.polyline(latlngs, { color: color, weight: 4, opacity: 0.75 })
        );
      }
    }
  }

  private polygon(coords: [number, number][], color: string, fillOpacity: number): L.Polygon {
    const latlngs = coords.map((c) => L.latLng(c[0], c[1]));
    return L.polygon(latlngs, {
      color: color,
      fillColor: color,
      fillOpacity: fillOpacity,
      weight: 2
    });
  }

  private refreshTrail(): void {
    if (!this.map) {
      return;
    }
    if (this.trailLayer) {
      this.map.removeLayer(this.trailLayer);
      this.trailLayer = null;
    }
    if (!this.selectedTruckId) {
      return;
    }
    const pts = this.liveFleet.getTrail(this.selectedTruckId, 30);
    if (!pts.length) {
      return;
    }
    const latlngs = pts.map((p) => L.latLng(p[0], p[1]));
    this.trailLayer = L.polyline(latlngs, {
      color: '#1e3a5f',
      weight: 3,
      opacity: 0.55,
      dashArray: '4 6'
    }).addTo(this.map);
  }

  private refreshTruckMarkers(live: LiveTruck[]): void {
    if (!this.map) {
      return;
    }
    const seen: { [id: string]: boolean } = {};
    let i: number;
    for (i = 0; i < live.length; i++) {
      const t = live[i];
      seen[t.id] = true;
      const latlng = L.latLng(t.position[0], t.position[1]);
      let color = '#43a047';
      if (t.id === this.selectedTruckId) {
        color = '#039be5';
      } else if (t.health === 'alert') {
        color = '#e53935';
      } else if (t.health === 'warning') {
        color = '#fb8c00';
      } else if (t.health === 'offline') {
        color = '#94a3b8';
      }
      if (this.truckMarkers[t.id]) {
        this.truckMarkers[t.id].setLatLng(latlng);
        this.truckMarkers[t.id].setStyle({ color: color, fillColor: color });
      } else {
        const m = L.circleMarker(latlng, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 0.9,
          weight: 2
        });
        m.bindTooltip(t.plate);
        m.on('click', (() => {
          const truck = t;
          return () => {
            const current = this.liveTrucks.find((x) => x.id === truck.id);
            if (current) {
              this.selectTruck(current);
            }
          };
        })());
        m.addTo(this.map);
        this.truckMarkers[t.id] = m;
      }
    }
    const ids = Object.keys(this.truckMarkers);
    for (i = 0; i < ids.length; i++) {
      if (!seen[ids[i]]) {
        this.map.removeLayer(this.truckMarkers[ids[i]]);
        delete this.truckMarkers[ids[i]];
      }
    }
  }
}
