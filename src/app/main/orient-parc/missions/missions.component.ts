import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, combineLatest } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Mission, MissionStatus, Port, Ship, StockZone, Truck } from 'app/mock/types/fleet';
import { ShiftConfig } from 'app/mock/types/settings';
import { fmtDate, fmtInt } from 'app/mock/utils/format';
import { shiftLabel } from 'app/mock/utils/shifts';
import { missionStatusMeta } from 'app/mock/utils/status';
import { missionTrips } from 'app/mock/utils/trips';
import { exportTableExcel, exportTablePdf } from 'app/main/orient-shared/orient-export';
import { chipClass } from 'app/main/orient-shared/orient-ui';
import {
  MissionFormDialogComponent,
  MissionFormDialogResult
} from './mission-form-dialog.component';

export interface MissionStatusTab {
  id: 'all' | MissionStatus;
  label: string;
  count: number;
}

@Component({
  selector: 'app-orient-parc-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss']
})
export class MissionsComponent implements OnInit, AfterViewInit, OnDestroy {
  missions: Mission[] = [];
  filteredMissions: Mission[] = [];
  dataSource = new MatTableDataSource<Mission>([]);
  ships: Ship[] = [];
  trucks: Truck[] = [];
  stockZones: StockZone[] = [];
  ports: Port[] = [];
  shifts: ShiftConfig[] = [];
  statusTabs: MissionStatusTab[] = [];

  columns = ['name', 'mission', 'date', 'poste', 'stock', 'port', 'camions', 'trips', 'status', 'actions'];
  missionStatusMeta = missionStatusMeta;
  chipClass = chipClass;
  fmtDate = fmtDate;
  fmtInt = fmtInt;

  statusFilter: 'all' | MissionStatus = 'all';
  query = '';
  shiftFilter = '';
  shipFilter = '';
  portFilter = '';
  stockFilter = '';

  private sub: Subscription;
  private launchTimer: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private store: MockStoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.store.missions,
      this.store.ships,
      this.store.trucks,
      this.store.stockZones,
      this.store.ports,
      this.store.shifts
    ]).subscribe(([missions, ships, trucks, stockZones, ports, shifts]) => {
      this.missions = (missions as Mission[]).slice();
      this.ships = (ships as Ship[]).slice();
      this.trucks = (trucks as Truck[]).slice();
      this.stockZones = (stockZones as StockZone[]).slice();
      this.ports = (ports as Port[]).slice();
      this.shifts = (shifts as ShiftConfig[]).slice();
      this.rebuildTabs();
      this.applyFilters();
    });
    this.store.syncScheduledLaunches();
    this.launchTimer = setInterval(() => this.store.syncScheduledLaunches(), 30000);
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
    if (this.launchTimer) {
      clearInterval(this.launchTimer);
    }
  }

  setStatusFilter(id: 'all' | MissionStatus): void {
    this.statusFilter = id;
    this.applyFilters(true);
  }

  onQueryChange(value: string): void {
    this.query = value || '';
    this.applyFilters(true);
  }

  onShiftChange(value: string): void {
    this.shiftFilter = value || '';
    this.applyFilters(true);
  }

  onShipChange(value: string): void {
    this.shipFilter = value || '';
    this.applyFilters(true);
  }

  onPortChange(value: string): void {
    this.portFilter = value || '';
    this.applyFilters(true);
  }

  onStockChange(value: string): void {
    this.stockFilter = value || '';
    this.applyFilters(true);
  }

  get activeShifts(): ShiftConfig[] {
    const out: ShiftConfig[] = [];
    let i: number;
    for (i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].active) {
        out.push(this.shifts[i]);
      }
    }
    return out;
  }

  exportPdf(): void {
    exportTablePdf('Missions', this.exportHeaders(), this.exportRows());
  }

  exportExcel(): void {
    exportTableExcel('Missions', this.exportHeaders(), this.exportRows());
  }

  shipLabel(shipId: string): string {
    const ship = this.store.shipById(shipId);
    return ship ? ship.name : '—';
  }

  zoneName(zoneId: string): string {
    let i: number;
    for (i = 0; i < this.stockZones.length; i++) {
      if (this.stockZones[i].id === zoneId) {
        const name = this.stockZones[i].name || '';
        const parts = name.split(' · ');
        return parts[0] || name || '—';
      }
    }
    return '—';
  }

  portName(portId: string): string {
    let i: number;
    for (i = 0; i < this.ports.length; i++) {
      if (this.ports[i].id === portId) {
        return this.ports[i].name || '—';
      }
    }
    return '—';
  }

  posteLabel(row: Mission): string {
    return shiftLabel(row, this.shifts);
  }

  tripsDone(row: Mission): number {
    return missionTrips(row, this.trucks);
  }

  startAdd(): void {
    this.openForm(null);
  }

  startEdit(row: Mission): void {
    this.openForm(row);
  }

  remove(row: Mission): void {
    this.store.removeMission(row.id);
  }

  complete(row: Mission): void {
    this.store.completeMission(row.id);
  }

  cancel(row: Mission): void {
    this.store.cancelMission(row.id);
  }

  private openForm(mission: Mission | null): void {
    const ref = this.dialog.open(MissionFormDialogComponent, {
      width: '720px',
      maxWidth: '90vw',
      autoFocus: false,
      disableClose: false,
      panelClass: 'orient-mission-dialog',
      data: { mission: mission }
    });
    ref.afterClosed().subscribe((result: MissionFormDialogResult | null) => {
      if (!result || !result.mission) {
        return;
      }
      this.store.upsertMission(result.mission);
      this.store.syncScheduledLaunches();
    });
  }

  private rebuildTabs(): void {
    const statuses: MissionStatus[] = ['running', 'planned', 'done', 'cancelled'];
    const tabs: MissionStatusTab[] = [
      { id: 'all', label: 'Toutes', count: this.missions.length }
    ];
    let i: number;
    for (i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      tabs.push({
        id: status,
        label: missionStatusMeta[status].label,
        count: this.countByStatus(status)
      });
    }
    this.statusTabs = tabs;
  }

  private countByStatus(status: MissionStatus): number {
    let n = 0;
    let i: number;
    for (i = 0; i < this.missions.length; i++) {
      if (this.missions[i].status === status) {
        n++;
      }
    }
    return n;
  }

  private applyFilters(resetPage?: boolean): void {
    const q = (this.query || '').trim().toLowerCase();
    const out: Mission[] = [];
    let i: number;
    for (i = 0; i < this.missions.length; i++) {
      const m = this.missions[i];
      if (this.statusFilter !== 'all' && m.status !== this.statusFilter) {
        continue;
      }
      if (q) {
        const hay = (m.id + ' ' + (m.name || '') + ' ' + this.shipLabel(m.shipId)).toLowerCase();
        if (hay.indexOf(q) === -1) {
          continue;
        }
      }
      if (this.shiftFilter && m.shift !== this.shiftFilter) {
        continue;
      }
      if (this.shipFilter && m.shipId !== this.shipFilter) {
        continue;
      }
      if (this.portFilter && m.portId !== this.portFilter) {
        continue;
      }
      if (this.stockFilter && m.stockZoneId !== this.stockFilter) {
        continue;
      }
      out.push(m);
    }
    this.filteredMissions = out;
    this.dataSource.data = out;
    if (resetPage && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private exportHeaders(): string[] {
    return ['Nom', 'Mission', 'Navire', 'Date', 'Heure', 'Poste', 'Stock', 'Port', 'Camions', 'Voyages effectués', 'Statut'];
  }

  private exportRows(): string[][] {
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < this.filteredMissions.length; i++) {
      const m = this.filteredMissions[i];
      rows.push([
        m.name || '—',
        m.id,
        this.shipLabel(m.shipId),
        fmtDate(m.date),
        m.start || '',
        this.posteLabel(m),
        this.zoneName(m.stockZoneId),
        this.portName(m.portId),
        String(m.truckIds.length),
        String(this.tripsDone(m)),
        missionStatusMeta[m.status].label
      ]);
    }
    return rows;
  }
}
