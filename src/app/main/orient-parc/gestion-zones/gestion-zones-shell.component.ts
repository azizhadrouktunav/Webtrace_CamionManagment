import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, combineLatest } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { DrawType, FixedSite, GeoShape, Port, RouteLine, StockZone } from 'app/mock/types/fleet';
import { DrawnPlace, DrawnPolygon } from 'app/mock/data/geo-shapes';
import { exportTableExcel, exportTablePdf } from 'app/main/orient-shared/orient-export';
import { chipClass } from 'app/main/orient-shared/orient-ui';
import { GeoAssignKind } from 'app/main/orient-suivi/geo-factory';
import { GeoZoneAssignService } from 'app/main/monitoring/geo-zone-assign';
import { CartoNameDialogComponent } from './carto-name-dialog.component';
import { CartoAssignDialogComponent } from './carto-assign-dialog.component';

export type CartoKind = 'trajet' | 'port' | 'stock' | 'atelier' | 'pause' | 'none';
export type CartoOrigin = 'zone' | 'place' | 'polygon';

export interface CartoRow {
  id: string;
  name: string;
  kind: CartoKind;
  active: boolean;
  origin: CartoOrigin;
  source: RouteLine | Port | StockZone | FixedSite | DrawnPlace | DrawnPolygon;
}

@Component({
  selector: 'app-orient-parc-gestion-zones',
  templateUrl: './gestion-zones-shell.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss', './gestion-zones-shell.component.scss']
})
export class GestionZonesShellComponent implements OnInit, AfterViewInit, OnDestroy {
  rows: CartoRow[] = [];
  filteredRows: CartoRow[] = [];
  dataSource = new MatTableDataSource<CartoRow>([]);
  query = '';
  kindFilter = '';
  drawFilter = '';
  activeFilter = '';
  kindOptions: Array<{ id: CartoKind; label: string }> = [];
  drawOptions = ['Polygone', 'Emplacement', 'Trajet'];
  columns = ['name', 'kind', 'draw', 'active', 'actions'];
  chipClass = chipClass;
  kindLabel: { [key: string]: string } = {
    trajet: 'Trajet',
    port: 'Port',
    stock: 'Stock',
    atelier: 'Atelier',
    pause: 'Pause',
    none: 'Non affectée'
  };

  private sub: Subscription;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private store: MockStoreService,
    private dialog: MatDialog,
    private geo: GeoZoneAssignService
  ) {
    const keys: CartoKind[] = ['trajet', 'port', 'stock', 'atelier', 'pause', 'none'];
    let i: number;
    for (i = 0; i < keys.length; i++) {
      this.kindOptions.push({ id: keys[i], label: this.kindLabel[keys[i]] });
    }
  }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.store.routes,
      this.store.ports,
      this.store.stockZones,
      this.store.workshops,
      this.store.pauseZones,
      this.store.drawnPlaces,
      this.store.drawnPolygons
    ]).subscribe((values) => {
      const packed = values as any[];
      const routes = packed[0] as RouteLine[];
      const ports = packed[1] as Port[];
      const stocks = packed[2] as StockZone[];
      const workshops = packed[3] as FixedSite[];
      const pauses = packed[4] as FixedSite[];
      const places = packed[5] as DrawnPlace[];
      const polygons = packed[6] as DrawnPolygon[];
      const rows: CartoRow[] = [];
      this.pushRows(rows, routes, 'trajet');
      this.pushRows(rows, ports, 'port');
      this.pushRows(rows, stocks, 'stock');
      this.pushRows(rows, workshops, 'atelier');
      this.pushRows(rows, pauses, 'pause');
      this.pushUnassignedPlaces(rows, places);
      this.pushUnassignedPolygons(rows, polygons);
      this.rows = rows;
      this.applyFilters();
    });
  }

  onQueryChange(value: string): void {
    this.query = value || '';
    this.applyFilters(true);
  }

  onKindChange(value: string): void {
    this.kindFilter = value || '';
    this.applyFilters(true);
  }

  onDrawChange(value: string): void {
    this.drawFilter = value || '';
    this.applyFilters(true);
  }

  onActiveChange(value: string): void {
    this.activeFilter = value || '';
    this.applyFilters(true);
  }

  exportPdf(): void {
    exportTablePdf('Cartographie', this.exportHeaders(), this.exportRows());
  }

  exportExcel(): void {
    exportTableExcel('Cartographie', this.exportHeaders(), this.exportRows());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  edit(row: CartoRow): void {
    if (row.kind === 'trajet') {
      return;
    }
    const ref = this.dialog.open(CartoNameDialogComponent, {
      width: '480px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'orient-form-dialog',
      data: { name: row.name, typeLabel: this.kindLabel[row.kind] }
    });
    ref.afterClosed().subscribe((name: string | null) => {
      if (!name || name === row.name) {
        return;
      }
      if (row.origin === 'place') {
        this.store.upsertDrawnPlace(Object.assign({}, row.source as DrawnPlace, { name: name }));
        return;
      }
      if (row.origin === 'polygon') {
        this.store.upsertDrawnPolygon(Object.assign({}, row.source as DrawnPolygon, { name: name }));
        return;
      }
      const updated = Object.assign({}, row.source, { name: name });
      if (row.kind === 'port') {
        this.store.upsertPort(updated as Port);
      } else if (row.kind === 'stock') {
        this.store.upsertStockZone(updated as StockZone);
      } else if (row.kind === 'atelier') {
        this.store.upsertWorkshop(updated as FixedSite);
      } else if (row.kind === 'pause') {
        this.store.upsertPauseZone(updated as FixedSite);
      }
      this.geo.renameLinked(row.id, name);
    });
  }

  assign(row: CartoRow): void {
    if (row.kind === 'trajet') {
      return;
    }
    const current = this.toAssignKind(row.kind);
    const ref = this.dialog.open(CartoAssignDialogComponent, {
      width: '480px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'orient-form-dialog',
      data: { kind: current }
    });
    ref.afterClosed().subscribe((kind: GeoAssignKind | null) => {
      if (!kind || kind === current) {
        return;
      }
      if (row.origin === 'place') {
        this.geo.assignDrawnPlace(row.source as DrawnPlace, kind);
        return;
      }
      if (row.origin === 'polygon') {
        this.geo.assignDrawnPolygon(row.source as DrawnPolygon, kind);
        return;
      }
      const shape = row.source as GeoShape;
      if (current) {
        this.geo.removeAssigned(current, row.id);
      }
      const drawType: DrawType = shape.drawType
        ? shape.drawType
        : (this.drawLabel(row) === 'Emplacement' ? 'marker' : 'polygon');
      const zoneId = this.geo.createAssignedZone(kind, row.name, shape.coords || [], drawType);
      this.geo.relinkDrawn(row.id, zoneId, kind, row.name);
    });
  }

  remove(row: CartoRow): void {
    if (row.origin === 'place') {
      this.store.removeDrawnPlace(row.id);
      return;
    }
    if (row.origin === 'polygon') {
      this.store.removeDrawnPolygon(row.id);
      return;
    }
    if (row.kind === 'trajet') {
      this.store.removeRoute(row.id);
    } else if (row.kind === 'port') {
      this.store.removePort(row.id);
    } else if (row.kind === 'stock') {
      this.store.removeStockZone(row.id);
    } else if (row.kind === 'atelier') {
      this.store.removeWorkshop(row.id);
    } else if (row.kind === 'pause') {
      this.store.removePauseZone(row.id);
    }
    this.geo.removeLinked(row.id);
  }

  toggle(row: CartoRow): void {
    if (row.kind === 'trajet') {
      this.store.toggleRoute(row.id);
    } else if (row.kind === 'port') {
      this.store.togglePort(row.id);
    } else if (row.kind === 'stock') {
      this.store.toggleStockZone(row.id);
    } else if (row.kind === 'atelier') {
      this.store.toggleWorkshop(row.id);
    } else if (row.kind === 'pause') {
      this.store.togglePauseZone(row.id);
    }
  }

  drawLabel(row: CartoRow): string {
    if (row.origin === 'place') {
      return 'Emplacement';
    }
    if (row.origin === 'polygon') {
      return 'Polygone';
    }
    const shape = row.source as GeoShape;
    const drawType = shape.drawType;
    if (row.kind === 'trajet' || drawType === 'polyline') {
      return 'Trajet';
    }
    if (drawType === 'marker') {
      return 'Emplacement';
    }
    if (drawType === 'polygon') {
      return 'Polygone';
    }
    const coords = shape.coords;
    if (!coords || coords.length <= 1) {
      return 'Emplacement';
    }
    return 'Polygone';
  }

  private exportHeaders(): string[] {
    return ['Nom', 'Type', 'Dessin', 'Actif'];
  }

  private exportRows(): string[][] {
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < this.filteredRows.length; i++) {
      const row = this.filteredRows[i];
      rows.push([
        row.name || '',
        this.kindLabel[row.kind] || '',
        this.drawLabel(row),
        row.active ? 'Actif' : 'Inactif'
      ]);
    }
    return rows;
  }

  private applyFilters(resetPage?: boolean): void {
    const q = (this.query || '').trim().toLowerCase();
    const out: CartoRow[] = [];
    let i: number;
    for (i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      if (q && (row.name || '').toLowerCase().indexOf(q) === -1) {
        continue;
      }
      if (this.kindFilter && row.kind !== this.kindFilter) {
        continue;
      }
      if (this.drawFilter && this.drawLabel(row) !== this.drawFilter) {
        continue;
      }
      if (this.activeFilter === 'active' && !row.active) {
        continue;
      }
      if (this.activeFilter === 'inactive' && row.active) {
        continue;
      }
      out.push(row);
    }
    this.filteredRows = out;
    this.dataSource.data = out;
    if (resetPage && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private pushRows(target: CartoRow[], items: Array<RouteLine | Port | StockZone | FixedSite>, kind: CartoKind): void {
    let i: number;
    for (i = 0; i < items.length; i++) {
      const item = items[i];
      target.push({
        id: item.id,
        name: item.name,
        kind: kind,
        active: item.active,
        origin: 'zone',
        source: item
      });
    }
  }

  private pushUnassignedPlaces(target: CartoRow[], places: DrawnPlace[]): void {
    let i: number;
    for (i = 0; i < places.length; i++) {
      const place = places[i];
      if (place.zoneKind) {
        continue;
      }
      target.push({
        id: place.id,
        name: place.name,
        kind: 'none',
        active: true,
        origin: 'place',
        source: place
      });
    }
  }

  private pushUnassignedPolygons(target: CartoRow[], polygons: DrawnPolygon[]): void {
    let i: number;
    for (i = 0; i < polygons.length; i++) {
      const polygon = polygons[i];
      if (polygon.zoneKind) {
        continue;
      }
      target.push({
        id: polygon.id,
        name: polygon.name,
        kind: 'none',
        active: true,
        origin: 'polygon',
        source: polygon
      });
    }
  }

  private toAssignKind(kind: CartoKind): GeoAssignKind | null {
    if (kind === 'port') {
      return 'port';
    }
    if (kind === 'stock') {
      return 'stock';
    }
    if (kind === 'atelier') {
      return 'workshop';
    }
    if (kind === 'pause') {
      return 'pause';
    }
    return null;
  }
}
