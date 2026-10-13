import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, combineLatest } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Driver, Mission, Truck, TruckStatus } from 'app/mock/types/fleet';
import { truckStatusMeta } from 'app/mock/utils/status';
import {
  formatDateTimeLocalValue,
  missionActiveAt,
  resolveTruckStatus
} from 'app/mock/utils/truck-status';
import { exportTableExcel, exportTablePdf } from 'app/main/orient-shared/orient-export';
import { chipClass } from 'app/main/orient-shared/orient-ui';
import { CamionFormDialogComponent } from './camion-form-dialog.component';
import { CamionPlanningDialogComponent } from './camion-planning-dialog.component';

type StatusFilter = 'all' | TruckStatus;

@Component({
  selector: 'app-orient-parc-camions',
  templateUrl: './camions.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss']
})
export class CamionsComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource<Truck>([]);
  trucks: Truck[] = [];
  drivers: Driver[] = [];
  missions: Mission[] = [];
  columns = [
    'icon',
    'fullName',
    'department',
    'driver',
    'brand',
    'model',
    'year',
    'fuelType',
    'mileage',
    'fuelCapacity',
    'simCardNumber',
    'equipmentSerial',
    'actions'
  ];
  truckStatusMeta = truckStatusMeta;
  chipClass = chipClass;

  query = '';
  statusFilter: StatusFilter = 'all';
  filterAtValue = formatDateTimeLocalValue(new Date());
  statusTabs: { id: StatusFilter; label: string; count: number }[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private sub: Subscription;

  constructor(
    private store: MockStoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (row: Truck, filter: string) => {
      const q = (filter || '').toLowerCase().trim();
      if (!q) {
        return true;
      }
      const driver = this.driverName(row).toLowerCase();
      const hay = (
        row.id + ' ' + row.plate + ' ' + row.name + ' ' + (row.department || '') + ' ' +
        (row.brand || '') + ' ' + (row.model || '') + ' ' + driver + ' ' +
        (row.equipmentSerial || '') + ' ' + (row.simCardNumber || '')
      ).toLowerCase();
      return hay.indexOf(q) >= 0;
    };

    this.sub = combineLatest([
      this.store.trucks,
      this.store.missions,
      this.store.drivers
    ]).subscribe(([trucks, missions, drivers]) => {
      this.missions = missions.slice();
      this.drivers = drivers.slice();
      this.trucks = trucks.map((t) =>
        Object.assign({}, t, { status: resolveTruckStatus(t, this.missions) })
      );
      this.refreshTabs();
      this.applyFilter();
      this.bindTable();
    });
  }

  ngAfterViewInit(): void {
    this.bindTable();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onQueryChange(value: string): void {
    this.query = value;
    this.applyFilter();
  }

  setStatusFilter(id: StatusFilter): void {
    this.statusFilter = id;
    this.applyFilter();
  }

  onFilterAtChange(value: string): void {
    this.filterAtValue = value;
    this.applyFilter();
  }

  visibleTrucks(): Truck[] {
    return this.dataSource.filteredData || [];
  }

  exportPdf(): void {
    exportTablePdf('Véhicules', this.exportHeaders(), this.exportRows());
  }

  exportExcel(): void {
    exportTableExcel('Véhicules', this.exportHeaders(), this.exportRows());
  }

  driverName(truck: Truck): string {
    if (!truck.driverId) {
      return '—';
    }
    const d = this.drivers.find(x => x.id === truck.driverId);
    return d ? (d.firstName + ' ' + d.lastName) : '—';
  }

  startAdd(): void {
    this.openForm(null);
  }

  startEdit(row: Truck): void {
    this.openForm(row);
  }

  showPlanning(row: Truck): void {
    this.dialog.open(CamionPlanningDialogComponent, {
      width: '720px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'orient-form-dialog',
      data: { truck: row }
    });
  }

  remove(row: Truck): void {
    this.store.removeTruck(row.id);
  }

  private bindTable(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  private openForm(truck: Truck | null): void {
    const ref = this.dialog.open(CamionFormDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'orient-form-dialog',
      data: { truck: truck }
    });
    ref.afterClosed().subscribe((result: Truck | null) => {
      if (!result) {
        return;
      }
      this.store.upsertTruck(result);
    });
  }

  private refreshTabs(): void {
    const counts = { mission: 0, available: 0, off_mission: 0 };
    let i: number;
    for (i = 0; i < this.trucks.length; i++) {
      const s = this.trucks[i].status;
      if (s === 'mission') {
        counts.mission++;
      } else if (s === 'off_mission') {
        counts.off_mission++;
      } else {
        counts.available++;
      }
    }
    this.statusTabs = [
      { id: 'all', label: 'Tous', count: this.trucks.length },
      { id: 'mission', label: 'En mission', count: counts.mission },
      { id: 'available', label: 'Disponibles', count: counts.available },
      { id: 'off_mission', label: 'Hors mission', count: counts.off_mission }
    ];
  }

  private applyFilter(): void {
    const at = this.parseFilterAt();
    const filtered = this.trucks.filter((t) => {
      if (this.statusFilter !== 'all' && t.status !== this.statusFilter) {
        return false;
      }
      if (at) {
        return this.truckVisibleAt(t, at);
      }
      return true;
    });
    this.dataSource.data = filtered;
    this.dataSource.filter = (this.query || '').trim();
    this.bindTable();
  }

  private truckVisibleAt(truck: Truck, at: Date): boolean {
    const onMissionNow = this.missions.some(
      (m) =>
        m.truckIds &&
        m.truckIds.indexOf(truck.id) >= 0 &&
        missionActiveAt(m, at)
    );
    if (this.statusFilter === 'mission') {
      return onMissionNow;
    }
    if (this.statusFilter === 'off_mission') {
      return truck.fixedStage === 'workshop' && !onMissionNow;
    }
    if (this.statusFilter === 'available') {
      return !onMissionNow && truck.fixedStage !== 'workshop';
    }
    if (onMissionNow || truck.fixedStage === 'workshop' || !truck.missionId) {
      return true;
    }
    const hasMissionOnDay = this.missions.some((m) => {
      if (!m.truckIds || m.truckIds.indexOf(truck.id) < 0) {
        return false;
      }
      return m.date === formatDateFromAt(at);
    });
    return !hasMissionOnDay || onMissionNow;
  }

  private exportHeaders(): string[] {
    return [
      'Nom complet',
      'Nom de département',
      'Nom de chauffeur',
      'Marque',
      'Modèle',
      'Année',
      "Type d'énergie",
      'Kilométrage',
      'Capacité',
      'Numéro de puce',
      'Équipement'
    ];
  }

  private exportRows(): string[][] {
    const source = this.visibleTrucks();
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < source.length; i++) {
      const row = source[i];
      rows.push([
        row.plate + ' · ' + row.name,
        row.department || '',
        this.driverName(row),
        row.brand || '',
        row.model || '',
        row.year != null ? String(row.year) : '',
        row.fuelType || '',
        row.mileage != null ? String(row.mileage) : '',
        row.fuelCapacity != null ? String(row.fuelCapacity) : '',
        row.simCardNumber || '',
        row.equipmentSerial || ''
      ]);
    }
    return rows;
  }

  private parseFilterAt(): Date | null {
    if (!this.filterAtValue) {
      return null;
    }
    const d = new Date(this.filterAtValue);
    if (isNaN(d.getTime())) {
      return null;
    }
    return d;
  }
}

function formatDateFromAt(d: Date): string {
  const y = d.getFullYear();
  const m = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return y + '-' + m + '-' + day;
}
