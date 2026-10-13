import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { tripsPerHour } from 'app/mock/data/analytics';
import { MockStoreService } from 'app/mock/mock-store.service';
import {
  CycleStandard,
  Driver,
  FleetAlert,
  Mission,
  MissionShift,
  Ship,
  Truck
} from 'app/mock/types/fleet';
import { ShiftConfig } from 'app/mock/types/settings';
import { fmtDate } from 'app/mock/utils/format';
import { inferShift, shiftLabel } from 'app/mock/utils/shifts';
import { alertTypeLabel, missionStatusMeta } from 'app/mock/utils/status';
import { formatDateLocal } from 'app/mock/utils/truck-status';
import { cycleTotal } from 'app/mock/utils/simulation';
import { exportTableExcel, exportTablePdf } from 'app/main/orient-shared/orient-export';
import { driverDisplayName } from 'app/main/orient-shared/orient-ui';
import { MissionAlertLine, MissionAlertsDialogComponent } from './mission-alerts-dialog.component';
import { KpiDetailColumn, KpiDetailDialogComponent } from './kpi-detail-dialog.component';
import { DoneMissionLine, DoneMissionsDialogComponent } from './done-missions-dialog.component';
import { MissionDetail, MissionDetailDialogComponent } from './mission-detail-dialog.component';

export interface TruckRank {
  id: string;
  plate: string;
  driver: string;
  poste: string;
  ship: string;
  trips: number;
  cycleAvg: number;
  standard: number;
  stock: number;
  trajet: number;
  port: number;
  workshop: number;
  workshopVisits: number;
  alerts: number;
  alertMin: number;
}

export interface DriverRank {
  id: string;
  name: string;
  missions: number;
  trips: number;
  cycleAvg: number;
  alerts: number;
}

type DriverChartMetric = 'missions' | 'trips' | 'alerts';
type TruckChartMetric = 'trips' | 'workshop' | 'alerts';

interface RankChart<T> {
  title: string;
  metric: T;
  max: number;
  unit: string;
  tone: string;
}

export interface PosteBar {
  id: string;
  label: string;
  trips: number;
  avg: number;
  standard: number;
}

export interface HourBar {
  hour: string;
  trips: number;
  height: number;
  current: boolean;
  empty: boolean;
}

export interface StageBar {
  label: string;
  actual: number;
  standard: number;
  height: number;
  ok: number;
  warn: number;
  danger: number;
}

export type DashView = 'general' | 'mission' | 'driver' | 'truck' | 'shift' | 'ship';

export interface MissionRow {
  id: string;
  ship: string;
  poste: string;
  date: string;
  trips: number;
  cycleAvg: number;
  standard: number;
  trucks: number;
  status: string;
}

export interface MissionCard {
  id: string;
  name: string;
  status: string;
  statusClass: string;
  tone: 'ok' | 'light' | 'serious';
}

export interface MissionStatRow {
  id: string;
  name: string;
  truck: string;
  driver: string;
  trips: number;
  alerts: number;
  unjustified: number;
  cycle: number;
  standard: number;
  stock: number;
  trajet: number;
  port: number;
  workshop: number;
}

@Component({
  selector: 'app-orient-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  ships: Ship[] = [];
  trucks: Truck[] = [];
  drivers: Driver[] = [];
  shiftList: ShiftConfig[] = [];
  missionOptions: Mission[] = [];

  views: Array<{ id: DashView; label: string }> = [
    { id: 'general', label: 'Général' },
    { id: 'mission', label: 'Mission' }
  ];
  view: DashView = 'general';
  entityFilter = '';
  dateFrom = this.startOfLastWeek();
  dateTo = this.startOfToday();

  tripTotal = 0;
  cycleAvg = 0;
  cycleStandard = 0;
  workshopVisits = 0;
  workshopMin = 0;
  alertCount = 0;
  alertCritical = 0;
  alertNormal = 0;
  alertMin = 0;
  alertLines: MissionAlertLine[] = [];
  doneMissionCount = 0;
  doneMissions: DoneMissionLine[] = [];

  hourBars: HourBar[] = [];
  posteBars: PosteBar[] = [];
  cycleBars: StageBar[] = [];
  zoneBars: StageBar[] = [];
  truckRanks: TruckRank[] = [];
  driverRanks: DriverRank[] = [];
  driverCharts: Array<RankChart<DriverChartMetric>> = [];
  truckCharts: Array<RankChart<TruckChartMetric>> = [];
  workshopRows: TruckRank[] = [];
  missionRows: MissionRow[] = [];
  missionStats: MissionStatRow[] = [];
  missionCards: MissionCard[] = [];
  cardAtStart = true;
  cardAtEnd = true;
  missionStatsSource = new MatTableDataSource<MissionStatRow>([]);
  truckRanksSource = new MatTableDataSource<TruckRank>([]);
  driverRanksSource = new MatTableDataSource<DriverRank>([]);
  missionRowsSource = new MatTableDataSource<MissionRow>([]);
  workshopSource = new MatTableDataSource<TruckRank>([]);

  truckColumns = [
    'plate', 'driver', 'poste', 'ship', 'trips', 'cycle', 'stock', 'trajet', 'port', 'workshop', 'alerts'
  ];
  driverColumns = ['name', 'missions', 'trips', 'alerts'];
  missionTruckColumns = ['plate', 'driver', 'trips', 'workshop', 'alerts'];
  workshopColumns = ['plate', 'driver', 'visits', 'time'];
  missionColumns = ['id', 'ship', 'poste', 'date', 'trucks', 'trips', 'cycle', 'status'];
  missionStatColumns = [
    'name', 'trucks', 'drivers', 'trips', 'alerts', 'unjustified',
    'cycle', 'standard', 'stock', 'trajet', 'port', 'workshop', 'actions'
  ];

  fmtDate = fmtDate;

  private missions: Mission[] = [];
  private alerts: FleetAlert[] = [];
  private shifts: ShiftConfig[] = [];
  private sub: Subscription;

  constructor(
    private store: MockStoreService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.store.missions,
      this.store.trucks,
      this.store.drivers,
      this.store.ships,
      this.store.alerts,
      this.store.shifts,
      this.store.cycleDefaults
    ]).subscribe((values) => {
      const packed = values as any[];
      const missions = packed[0] as Mission[];
      const trucks = packed[1] as Truck[];
      const drivers = packed[2] as Driver[];
      const ships = packed[3] as Ship[];
      const alerts = packed[4] as FleetAlert[];
      const shifts = packed[5] as ShiftConfig[];
      this.missions = missions.slice();
      this.trucks = trucks.slice();
      this.drivers = drivers.slice();
      this.ships = ships.slice();
      this.alerts = alerts.slice();
      this.shifts = shifts.slice();
      this.shiftList = shifts.slice();
      this.rebuild();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  setView(id: DashView): void {
    if (this.view === id) {
      return;
    }
    this.view = id;
    this.resetPages();
    if (id === 'mission') {
      if (!this.missionById(this.entityFilter) && this.missions.length) {
        this.entityFilter = this.missions[0].id;
      }
    } else {
      this.entityFilter = '';
    }
    this.rebuild();
  }

  onEntityChange(value: string): void {
    this.entityFilter = value || '';
    this.resetPages();
    this.rebuild();
  }

  onDateFromChange(value: Date): void {
    if (!value) {
      return;
    }
    this.dateFrom = value;
    if (formatDateLocal(this.dateTo) < formatDateLocal(this.dateFrom)) {
      this.dateTo = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }
    this.resetPages();
    this.rebuild();
  }

  onDateToChange(value: Date): void {
    if (!value) {
      return;
    }
    const next = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    if (formatDateLocal(next) < formatDateLocal(this.dateFrom)) {
      this.dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate());
    } else {
      this.dateTo = next;
    }
    this.resetPages();
    this.rebuild();
  }

  entityLabel(): string {
    if (this.view === 'driver') {
      return 'Chauffeur';
    }
    if (this.view === 'truck') {
      return 'Camion';
    }
    if (this.view === 'shift') {
      return 'Poste';
    }
    if (this.view === 'ship') {
      return 'Navire';
    }
    return 'Mission';
  }

  canExport(): boolean {
    if (this.view === 'mission') {
      return this.missionStats.length > 0;
    }
    if (this.view === 'general' || this.view === 'driver') {
      return this.driverRanks.length > 0;
    }
    if (this.view === 'ship') {
      return this.missionRows.length > 0;
    }
    return this.truckRanks.length > 0;
  }

  goSuivi(): void {
    this.router.navigate(['/Home']);
  }

  @ViewChild('cardStrip', { static: false }) cardStrip: ElementRef;

  scrollCards(direction: number): void {
    const el = this.cardStripElement();
    if (!el) {
      return;
    }
    const card = el.querySelector('.orient-mission-card') as HTMLElement;
    const gap = 16;
    const step = card ? card.offsetWidth + gap : 296;
    el.scrollLeft = el.scrollLeft + direction * step;
    this.onCardScroll();
  }

  onCardScroll(): void {
    const el = this.cardStripElement();
    if (!el) {
      this.cardAtStart = true;
      this.cardAtEnd = true;
      return;
    }
    this.cardAtStart = el.scrollLeft <= 1;
    this.cardAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
  }

  private cardStripElement(): HTMLElement | null {
    return this.cardStrip ? this.cardStrip.nativeElement as HTMLElement : null;
  }

  private syncCardArrows(): void {
    setTimeout(() => this.onCardScroll());
  }

  openMissionCard(card: MissionCard): void {
    const mission = this.missionById(card.id);
    if (!mission) {
      return;
    }
    const start = this.parseDate(mission.date);
    let end = mission.status === 'done' ? this.parseDate(mission.date) : this.startOfToday();
    if (formatDateLocal(end) < formatDateLocal(start)) {
      end = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    }
    this.view = 'mission';
    this.entityFilter = mission.id;
    this.dateFrom = start;
    this.dateTo = end;
    this.resetPages();
    this.rebuild();
  }

  openAlerts(): void {
    if (!this.alertLines.length) {
      return;
    }
    this.openAlertLines(this.alertLines, this.view === 'general');
  }

  openUnjustified(): void {
    const rows: { [key: string]: string }[] = [];
    let i: number;
    for (i = 0; i < this.alertLines.length; i++) {
      const line = this.alertLines[i];
      if (!(line.minutes > 0) || line.place === 'Atelier') {
        continue;
      }
      rows.push({
        when: line.when,
        driver: line.driver,
        truck: line.truck,
        minutes: line.minutes + ' min',
        place: line.place
      });
    }
    this.openDetail('Temps non justifié', [
      { key: 'when', label: 'Date et heure' },
      { key: 'driver', label: 'Chauffeur' },
      { key: 'truck', label: 'Camion' },
      { key: 'minutes', label: 'Temps non justifié' },
      { key: 'place', label: 'Où' }
    ], rows, 'Aucun temps non justifié.');
  }

  openCycleDetails(): void {
    if (!this.tripTotal) {
      return;
    }
    const mission = this.missionById(this.entityFilter);
    if (!mission) {
      return;
    }
    const actual = mission.actualCycle || { loading: 0, outbound: 0, unloading: 0, return: 0 };
    const standard = mission.standardCycle || { loading: 0, outbound: 0, unloading: 0, return: 0 };
    const rows: { [key: string]: string }[] = [];
    let i: number;
    for (i = 0; i < this.truckRanks.length; i++) {
      const rank = this.truckRanks[i];
      if (!(rank.trips > 0)) {
        continue;
      }
      const truck = this.truckById(rank.id);
      const start = this.tripStart(mission, truck);
      rows.push({
        when: start.when,
        whenMin: start.whenMin,
        whenDate: start.whenDate,
        truck: truck ? truck.plate : rank.plate,
        driver: rank.driver,
        trips: String(rank.trips),
        loading: this.num(actual.loading) + ' / ' + this.num(standard.loading),
        outbound: this.num(actual.outbound) + ' / ' + this.num(standard.outbound),
        unloading: this.num(actual.unloading) + ' / ' + this.num(standard.unloading),
        ret: this.num(actual.return) + ' / ' + this.num(standard.return),
        total: this.num(cycleTotal(actual)) + ' / ' + this.num(cycleTotal(standard)),
        loadA: String(actual.loading),
        outA: String(actual.outbound),
        unloadA: String(actual.unloading),
        retA: String(actual.return),
        loadS: String(standard.loading),
        outS: String(standard.outbound),
        unloadS: String(standard.unloading),
        retS: String(standard.return)
      });
    }
    this.openDetail('Voyages', [
      { key: 'when', label: 'Date et heure' },
      { key: 'truck', label: 'Camion' },
      { key: 'driver', label: 'Chauffeur' },
      { key: 'trips', label: 'Voyages' },
      { key: 'loading', label: 'Chargement' },
      { key: 'outbound', label: 'Trajet aller' },
      { key: 'unloading', label: 'Déchargement' },
      { key: 'ret', label: 'Retour' },
      { key: 'total', label: 'Total réel / standard' }
    ], rows, 'Aucun voyage.', true);
  }

  openGeneralTrips(): void {
    if (!this.tripTotal) {
      return;
    }
    const rows: { [key: string]: string }[] = [];
    let i: number;
    for (i = 0; i < this.truckRanks.length; i++) {
      const rank = this.truckRanks[i];
      if (!(rank.trips > 0)) {
        continue;
      }
      const truck = this.truckById(rank.id);
      const linked = truck ? this.missionsForTruck(truck, this.missions) : [];
      const mission = truck ? this.primaryMission(truck, linked) : null;
      const actual = mission && mission.actualCycle ? mission.actualCycle : { loading: 0, outbound: 0, unloading: 0, return: 0 };
      const standard = mission && mission.standardCycle ? mission.standardCycle : { loading: 0, outbound: 0, unloading: 0, return: 0 };
      rows.push({
        mission: mission ? (mission.name || mission.id) : '—',
        truck: truck ? truck.plate : rank.plate,
        driver: rank.driver,
        trips: String(rank.trips),
        loading: this.num(actual.loading) + ' / ' + this.num(standard.loading),
        outbound: this.num(actual.outbound) + ' / ' + this.num(standard.outbound),
        unloading: this.num(actual.unloading) + ' / ' + this.num(standard.unloading),
        ret: this.num(actual.return) + ' / ' + this.num(standard.return),
        total: this.num(cycleTotal(actual)) + ' / ' + this.num(cycleTotal(standard))
      });
    }
    this.openDetail('Voyages réalisés', [
      { key: 'mission', label: 'Mission' },
      { key: 'truck', label: 'Camion' },
      { key: 'driver', label: 'Chauffeur' },
      { key: 'trips', label: 'Voyages' },
      { key: 'loading', label: 'Chargement' },
      { key: 'outbound', label: 'Trajet aller' },
      { key: 'unloading', label: 'Déchargement' },
      { key: 'ret', label: 'Retour' },
      { key: 'total', label: 'Total réel / standard' }
    ], rows, 'Aucun voyage.');
  }

  openWorkshopDetails(): void {
    if (!this.workshopVisits) {
      return;
    }
    const rows: { [key: string]: string }[] = [];
    let i: number;
    for (i = 0; i < this.truckRanks.length; i++) {
      const rank = this.truckRanks[i];
      if (!(rank.workshopVisits > 0)) {
        continue;
      }
      const truck = this.truckById(rank.id);
      rows.push({
        when: this.workshopWhen(truck, rank.id),
        truck: truck ? truck.plate : rank.plate,
        driver: rank.driver,
        visits: String(rank.workshopVisits),
        time: this.num(rank.workshop) + ' min'
      });
    }
    this.openDetail('Passages atelier', [
      { key: 'when', label: 'Date et heure' },
      { key: 'truck', label: 'Camion' },
      { key: 'driver', label: 'Chauffeur' },
      { key: 'visits', label: 'Passages' },
      { key: 'time', label: 'Temps atelier' }
    ], rows, 'Aucun passage atelier.');
  }

  openDoneMissions(): void {
    if (!this.doneMissions.length) {
      return;
    }
    const ref = this.dialog.open(DoneMissionsDialogComponent, {
      width: '640px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'orient-dash-dialog',
      data: this.doneMissions.slice()
    });
    ref.afterClosed().subscribe((id: string) => {
      if (!id) {
        return;
      }
      this.entityFilter = id;
      this.setView('mission');
    });
  }

  openMissionDetail(row: MissionStatRow): void {
    const mission = this.missionById(row.id);
    if (!mission) {
      return;
    }
    const ids = this.matchingTruckIds(mission);
    const plates: string[] = [];
    let i: number;
    for (i = 0; i < ids.length; i++) {
      const truck = this.truckById(ids[i]);
      if (truck) {
        plates.push(truck.plate);
      }
    }
    const data: MissionDetail = {
      name: row.name,
      ship: this.shipName(mission.shipId),
      date: fmtDate(mission.date),
      start: mission.start || '—',
      poste: shiftLabel(mission, this.shifts),
      stock: this.zoneName(mission.stockZoneId),
      port: this.portName(mission.portId),
      trucks: this.joinList(plates),
      drivers: this.joinList(this.missionDriverNames(mission, ids)),
      trips: String(mission.tripsDone || 0),
      cycle: this.num(row.cycle) + ' / ' + this.num(row.standard) + ' min',
      notes: mission.notes || '—'
    };
    this.dialog.open(MissionDetailDialogComponent, {
      width: '520px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'orient-dash-dialog',
      data: data
    });
  }

  openMissionAlerts(row: MissionStatRow): void {
    const alerts = this.alerts.filter((alert) => alert.missionId === row.id);
    this.openAlertLines(this.buildAlertLines(alerts), false);
  }

  deltaClass(avg: number, standard: number): string {
    return avg <= standard ? 'orient-chip--ok' : 'orient-chip--warn';
  }

  num(value: number): string {
    if (!isFinite(value)) {
      return '0';
    }
    return String(Math.round(value * 10) / 10);
  }

  hasPositive(rows: object[], metric: string): boolean {
    let i: number;
    for (i = 0; i < rows.length; i++) {
      const value = (rows[i] as { [key: string]: number })[metric];
      if (value > 0) {
        return true;
      }
    }
    return false;
  }

  hasActivePoste(): boolean {
    let i: number;
    for (i = 0; i < this.posteBars.length; i++) {
      if (this.posteBars[i].trips > 0 || this.posteBars[i].avg > 0) {
        return true;
      }
    }
    return false;
  }

  axisTicks(bars: StageBar[]): number[] {
    let max = 1;
    let i: number;
    for (i = 0; i < bars.length; i++) {
      max = Math.max(max, bars[i].actual, bars[i].standard);
    }
    return [max, (max * 2) / 3, max / 3, 0];
  }

  exportPdf(): void {
    const built = this.exportTable();
    exportTablePdf('Dashboard', built.headers, built.rows);
  }

  exportExcel(): void {
    const built = this.exportTable();
    exportTableExcel('Dashboard', built.headers, built.rows);
  }

  private rebuild(): void {
    if (this.view === 'mission' && !this.missionById(this.entityFilter) && this.missions.length) {
      this.entityFilter = this.missions[0].id;
    }
    const scopedMissions = this.missions.filter((m) => this.missionInScope(m));
    const truckIds: { [id: string]: boolean } = {};
    let i: number;
    for (i = 0; i < scopedMissions.length; i++) {
      const ids = this.matchingTruckIds(scopedMissions[i]);
      let j: number;
      for (j = 0; j < ids.length; j++) {
        truckIds[ids[j]] = true;
      }
    }
    const scopedTrucks: Truck[] = [];
    for (i = 0; i < this.trucks.length; i++) {
      if (truckIds[this.trucks[i].id]) {
        scopedTrucks.push(this.trucks[i]);
      }
    }
    const missionIds: { [id: string]: boolean } = {};
    for (i = 0; i < scopedMissions.length; i++) {
      missionIds[scopedMissions[i].id] = true;
    }
    const scopedAlerts = this.alerts.filter((a) => this.alertInScope(a, missionIds, truckIds));

    this.truckRanks = this.buildTruckRanks(scopedTrucks, scopedMissions, scopedAlerts);
    this.driverRanks = this.buildDriverRanks(this.truckRanks, scopedAlerts, scopedMissions);
    this.driverCharts = (this.view === 'mission' ? [
      { title: 'Voyages par chauffeur', metric: 'trips' as DriverChartMetric, unit: 'voyages', tone: 'blue' },
      { title: 'Alertes par chauffeur', metric: 'alerts' as DriverChartMetric, unit: 'alertes', tone: 'red' }
    ] : [
      { title: 'Nombre de missions terminées par chauffeur', metric: 'missions' as DriverChartMetric, unit: 'missions', tone: 'green' },
      { title: 'Nombre de voyages par chauffeur', metric: 'trips' as DriverChartMetric, unit: 'voyages', tone: 'blue' },
      { title: 'Alertes par chauffeur', metric: 'alerts' as DriverChartMetric, unit: 'alertes', tone: 'red' }
    ]).map((chart) => ({
      title: chart.title,
      metric: chart.metric,
      unit: chart.unit,
      tone: chart.tone,
      max: Math.max(1, ...this.driverRanks.map((row) => row[chart.metric]))
    }));
    this.truckCharts = [
      { title: 'Voyages par camion', metric: 'trips' as TruckChartMetric, unit: 'voyages', tone: 'blue' },
      { title: 'Temps atelier par camion', metric: 'workshop' as TruckChartMetric, unit: 'min', tone: 'amber' },
      { title: 'Alertes par camion', metric: 'alerts' as TruckChartMetric, unit: 'alertes', tone: 'red' }
    ].map((chart) => ({
      title: chart.title,
      metric: chart.metric,
      unit: chart.unit,
      tone: chart.tone,
      max: Math.max(1, ...this.truckRanks.map((row) => row[chart.metric]))
    }));
    this.workshopRows = this.truckRanks
      .filter((r) => r.workshopVisits > 0 || r.workshop > 0)
      .slice()
      .sort((a, b) => b.workshop - a.workshop);

    this.tripTotal = 0;
    this.workshopVisits = 0;
    this.workshopMin = 0;
    for (i = 0; i < this.truckRanks.length; i++) {
      this.tripTotal += this.truckRanks[i].trips;
      this.workshopVisits += this.truckRanks[i].workshopVisits;
      this.workshopMin += this.truckRanks[i].workshop;
    }
    this.doneMissions = [];
    for (i = 0; i < scopedMissions.length; i++) {
      const mission = scopedMissions[i];
      this.doneMissions.push({
        id: mission.id,
        name: mission.name || mission.id
      });
    }
    this.doneMissionCount = this.doneMissions.length;
    this.alertCount = scopedAlerts.length;
    this.alertCritical = 0;
    this.alertNormal = 0;
    this.alertLines = this.buildAlertLines(scopedAlerts);
    this.alertMin = 0;
    for (i = 0; i < scopedAlerts.length; i++) {
      if (scopedAlerts[i].type !== 'workshop_excess') {
        this.alertMin += scopedAlerts[i].durationMin || 0;
      }
      if (scopedAlerts[i].level === 'critical') {
        this.alertCritical++;
      } else {
        this.alertNormal++;
      }
    }

    const cycle = this.averageCycles(scopedMissions);
    this.cycleAvg = cycle.actual;
    this.cycleStandard = cycle.standard;
    this.cycleBars = this.buildCycleBars(scopedMissions);
    this.zoneBars = this.buildZoneBars(this.truckRanks, scopedMissions);
    this.posteBars = this.buildPosteBars(scopedMissions, this.truckRanks);
    this.hourBars = this.buildHourBars(this.tripTotal);
    this.missionRows = this.buildMissionRows(scopedMissions);
    this.missionStats = this.buildMissionStats(scopedMissions);
    this.missionStatsSource.data = this.missionStats;
    this.truckRanksSource.data = this.truckRanks;
    this.driverRanksSource.data = this.driverRanks;
    this.missionRowsSource.data = this.missionRows;
    this.workshopSource.data = this.workshopRows;
    this.missionOptions = this.missions.slice();
  }

  @ViewChild('missionDriverPager', { static: false })
  set missionDriverPager(pager: MatPaginator) {
    this.attachPager(this.driverRanksSource, pager);
  }

  @ViewChild('missionPager', { static: false })
  set missionPager(pager: MatPaginator) {
    this.attachPager(this.missionStatsSource, pager);
  }

  @ViewChild('truckPager', { static: false })
  set truckPager(pager: MatPaginator) {
    this.attachPager(this.truckRanksSource, pager);
  }

  @ViewChild('driverPager', { static: false })
  set driverPager(pager: MatPaginator) {
    this.attachPager(this.driverRanksSource, pager);
  }

  @ViewChild('shipPager', { static: false })
  set shipPager(pager: MatPaginator) {
    this.attachPager(this.missionRowsSource, pager);
  }

  @ViewChild('workshopPager', { static: false })
  set workshopPager(pager: MatPaginator) {
    this.attachPager(this.workshopSource, pager);
  }

  private attachPager(source: MatTableDataSource<any>, pager: MatPaginator): void {
    if (!pager) {
      return;
    }
    setTimeout(() => {
      source.paginator = pager;
    });
  }

  private resetPages(): void {
    const sources = [
      this.missionStatsSource,
      this.truckRanksSource,
      this.driverRanksSource,
      this.missionRowsSource,
      this.workshopSource
    ];
    let i: number;
    for (i = 0; i < sources.length; i++) {
      if (sources[i].paginator) {
        sources[i].paginator.firstPage();
      }
    }
  }

  private missionInScope(m: Mission): boolean {
    if (this.view === 'mission') {
      return m.id === this.entityFilter;
    }
    const period = this.periodBounds();
    if (m.date < period.from || m.date > period.to) {
      return false;
    }
    if (!this.entityFilter) {
      return true;
    }
    if (this.view === 'ship') {
      return m.shipId === this.entityFilter;
    }
    if (this.view === 'shift') {
      return (m.shift || inferShift(m.start)) === this.entityFilter;
    }
    if (this.view === 'truck') {
      return !!(m.truckIds && m.truckIds.indexOf(this.entityFilter) >= 0);
    }
    return this.missionHasDriver(m, this.entityFilter);
  }

  private matchingTruckIds(m: Mission): string[] {
    const ids = m.truckIds || [];
    const out: string[] = [];
    let i: number;
    for (i = 0; i < ids.length; i++) {
      const truck = this.truckById(ids[i]);
      if (!truck) {
        continue;
      }
      if (this.view === 'truck' && this.entityFilter && truck.id !== this.entityFilter) {
        continue;
      }
      if (this.view === 'driver' && this.entityFilter && truck.driverId !== this.entityFilter) {
        continue;
      }
      out.push(truck.id);
    }
    return out;
  }

  private alertInScope(
    alert: FleetAlert,
    missionIds: { [id: string]: boolean },
    truckIds: { [id: string]: boolean }
  ): boolean {
    if (this.view === 'driver' && this.entityFilter && alert.driverId !== this.entityFilter) {
      return false;
    }
    if (alert.missionId && missionIds[alert.missionId]) {
      return true;
    }
    return !!(alert.truckId && truckIds[alert.truckId]);
  }

  private buildTruckRanks(trucks: Truck[], missions: Mission[], alerts: FleetAlert[]): TruckRank[] {
    const rows: TruckRank[] = [];
    let i: number;
    for (i = 0; i < trucks.length; i++) {
      const truck = trucks[i];
      const linked = this.missionsForTruck(truck, missions);
      const primary = this.primaryMission(truck, linked);
      const alertStats = this.alertStats(alerts, truck.id, '');
      const standards: number[] = [];
      const actuals: number[] = [];
      let j: number;
      for (j = 0; j < linked.length; j++) {
        standards.push(cycleTotal(linked[j].standardCycle));
        if (cycleTotal(linked[j].actualCycle) > 0) {
          actuals.push(cycleTotal(linked[j].actualCycle));
        }
      }
      const cycleFromTruck = truck.cycleAvg || 0;
      rows.push({
        id: truck.id,
        plate: truck.plate + ' · ' + truck.name,
        driver: this.driverName(truck.driverId),
        poste: primary ? shiftLabel(primary, this.shifts) : '—',
        ship: primary ? this.shipName(primary.shipId) : '—',
        trips: truck.tripsDone || 0,
        cycleAvg: cycleFromTruck || this.mean(actuals),
        standard: this.mean(standards),
        stock: truck.timeStock || 0,
        trajet: primary ? (primary.actualCycle.outbound || 0) + (primary.actualCycle.return || 0) : 0,
        port: truck.timePort || 0,
        workshop: truck.timeWorkshop || 0,
        workshopVisits: truck.workshopVisits || 0,
        alerts: alertStats.count,
        alertMin: alertStats.minutes
      });
    }
    rows.sort((a, b) => b.trips - a.trips);
    return rows;
  }

  private buildDriverRanks(trucks: TruckRank[], alerts: FleetAlert[], missions: Mission[]): DriverRank[] {
    const byDriver: { [id: string]: DriverRank } = {};
    let i: number;
    for (i = 0; i < this.trucks.length; i++) {
      const truck = this.trucks[i];
      const rank = this.findTruckRank(trucks, truck.id);
      if (!rank || !truck.driverId) {
        continue;
      }
      let row = byDriver[truck.driverId];
      if (!row) {
        row = {
          id: truck.driverId,
          name: this.driverName(truck.driverId),
          missions: 0,
          trips: 0,
          cycleAvg: 0,
          alerts: 0
        };
        byDriver[truck.driverId] = row;
      }
      row.trips += rank.trips;
      row.cycleAvg += rank.cycleAvg;
    }
    const rows: DriverRank[] = [];
    const ids = Object.keys(byDriver);
    for (i = 0; i < ids.length; i++) {
      const row = byDriver[ids[i]];
      const owned = this.trucks.filter((t) => t.driverId === row.id && this.findTruckRank(trucks, t.id));
      row.cycleAvg = owned.length ? row.cycleAvg / owned.length : 0;
      row.alerts = this.alertStats(alerts, '', row.id).count;
      row.missions = 0;
      let j: number;
      for (j = 0; j < missions.length; j++) {
        if (missions[j].status === 'done' && this.missionHasDriver(missions[j], row.id)) {
          row.missions++;
        }
      }
      rows.push(row);
    }
    rows.sort((a, b) => b.trips - a.trips);
    return rows;
  }

  private buildPosteBars(missions: Mission[], ranks: TruckRank[]): PosteBar[] {
    const order: MissionShift[] = ['morning', 'afternoon', 'night', 'poste4', 'poste5'];
    const buckets: { [id: string]: { trips: number; actual: number[]; standard: number[] } } = {};
    let i: number;
    for (i = 0; i < order.length; i++) {
      buckets[order[i]] = { trips: 0, actual: [], standard: [] };
    }
    for (i = 0; i < missions.length; i++) {
      const shift = missions[i].shift || inferShift(missions[i].start);
      if (!buckets[shift]) {
        buckets[shift] = { trips: 0, actual: [], standard: [] };
      }
      buckets[shift].trips += missions[i].tripsDone || 0;
      buckets[shift].standard.push(cycleTotal(missions[i].standardCycle));
      if (cycleTotal(missions[i].actualCycle) > 0) {
        buckets[shift].actual.push(cycleTotal(missions[i].actualCycle));
      }
    }
    for (i = 0; i < ranks.length; i++) {
      const shift = this.shiftIdByLabel(ranks[i].poste);
      if (shift && buckets[shift]) {
        buckets[shift].trips += ranks[i].trips;
      }
    }
    const bars: PosteBar[] = [];
    for (i = 0; i < order.length; i++) {
      const bucket = buckets[order[i]];
      bars.push({
        id: order[i],
        label: this.shiftName(order[i]),
        trips: bucket.trips,
        avg: this.mean(bucket.actual),
        standard: this.mean(bucket.standard)
      });
    }
    return bars;
  }

  private buildCycleBars(missions: Mission[]): StageBar[] {
    const actual = this.meanCycle(missions, 'actualCycle');
    const standard = this.meanCycle(missions, 'standardCycle');
    const stages = [
      { label: 'Chargement', actual: actual.loading, standard: standard.loading },
      { label: 'Trajet aller', actual: actual.outbound, standard: standard.outbound },
      { label: 'Déchargement port', actual: actual.unloading, standard: standard.unloading },
      { label: 'Retour', actual: actual.return, standard: standard.return },
      { label: 'Total cycle', actual: cycleTotal(actual), standard: cycleTotal(standard) }
    ];
    return this.toStageBars(stages);
  }

  private buildZoneBars(ranks: TruckRank[], missions: Mission[]): StageBar[] {
    const stock = this.mean(ranks.map((r) => r.stock));
    const workshop = this.mean(ranks.map((r) => r.workshop));
    const port = this.mean(ranks.map((r) => r.port));
    const trajetValues: number[] = [];
    let i: number;
    for (i = 0; i < missions.length; i++) {
      const cycle = missions[i].actualCycle;
      if (cycleTotal(cycle) > 0) {
        trajetValues.push((cycle.outbound || 0) + (cycle.return || 0));
      }
    }
    const stages = [
      { label: 'Zone de stock', actual: stock, standard: 0 },
      { label: 'Atelier', actual: workshop, standard: 0 },
      { label: 'Port', actual: port, standard: 0 },
      { label: 'Trajet', actual: this.mean(trajetValues), standard: 0 }
    ];
    return this.toStageBars(stages);
  }

  private buildHourBars(total: number): HourBar[] {
    let base = 0;
    let maxScaled = 1;
    let i: number;
    for (i = 0; i < tripsPerHour.length; i++) {
      if (tripsPerHour[i].trips != null) {
        base += tripsPerHour[i].trips as number;
      }
    }
    const factor = base > 0 ? total / base : 0;
    const scaled: number[] = [];
    for (i = 0; i < tripsPerHour.length; i++) {
      const raw = tripsPerHour[i].trips;
      const value = raw == null ? 0 : Math.round((raw as number) * factor * 10) / 10;
      scaled.push(value);
      if (value > maxScaled) {
        maxScaled = value;
      }
    }
    const bars: HourBar[] = [];
    for (i = 0; i < tripsPerHour.length; i++) {
      const empty = tripsPerHour[i].trips == null || total === 0;
      bars.push({
        hour: tripsPerHour[i].hour,
        trips: empty ? 0 : scaled[i],
        height: empty ? 8 : Math.max(8, Math.round((scaled[i] / maxScaled) * 140)),
        current: !!tripsPerHour[i].current,
        empty: empty
      });
    }
    return bars;
  }

  private averageCycles(missions: Mission[]): { actual: number; standard: number } {
    const actuals: number[] = [];
    const standards: number[] = [];
    let i: number;
    for (i = 0; i < missions.length; i++) {
      standards.push(cycleTotal(missions[i].standardCycle));
      if (cycleTotal(missions[i].actualCycle) > 0) {
        actuals.push(cycleTotal(missions[i].actualCycle));
      }
    }
    return { actual: this.mean(actuals), standard: this.mean(standards) };
  }

  private meanCycle(missions: Mission[], key: 'actualCycle' | 'standardCycle'): CycleStandard {
    const used: Mission[] = [];
    let i: number;
    for (i = 0; i < missions.length; i++) {
      if (key === 'standardCycle' || cycleTotal(missions[i].actualCycle) > 0) {
        used.push(missions[i]);
      }
    }
    if (!used.length) {
      return { loading: 0, outbound: 0, unloading: 0, return: 0 };
    }
    let loading = 0;
    let outbound = 0;
    let unloading = 0;
    let ret = 0;
    for (i = 0; i < used.length; i++) {
      const cycle = used[i][key];
      loading += cycle.loading || 0;
      outbound += cycle.outbound || 0;
      unloading += cycle.unloading || 0;
      ret += cycle.return || 0;
    }
    const n = used.length;
    return {
      loading: loading / n,
      outbound: outbound / n,
      unloading: unloading / n,
      return: ret / n
    };
  }

  private toStageBars(stages: Array<{ label: string; actual: number; standard: number }>): StageBar[] {
    let max = 1;
    let i: number;
    for (i = 0; i < stages.length; i++) {
      max = Math.max(max, stages[i].actual, stages[i].standard);
    }
    const bars: StageBar[] = [];
    for (i = 0; i < stages.length; i++) {
      const parts = this.barParts(stages[i].actual, stages[i].standard);
      const height = Math.max(8, Math.round((stages[i].actual / max) * 140));
      const sized = this.segmentPixels(parts, height);
      bars.push({
        label: stages[i].label,
        actual: stages[i].actual,
        standard: stages[i].standard,
        height: height,
        ok: sized.ok,
        warn: sized.warn,
        danger: sized.danger
      });
    }
    return bars;
  }

  private barParts(actual: number, standard: number): { ok: number; warn: number; danger: number } {
    if (!(actual > 0)) {
      return { ok: 1, warn: 0, danger: 0 };
    }
    const excess = Math.max(0, actual - standard);
    if (!(standard > 0) || excess <= 0) {
      return { ok: actual, warn: 0, danger: 0 };
    }
    return {
      ok: Math.min(actual, standard),
      warn: 0,
      danger: excess
    };
  }

  private segmentPixels(
    parts: { ok: number; warn: number; danger: number },
    height: number
  ): { ok: number; warn: number; danger: number } {
    const weights = [parts.ok, parts.warn, parts.danger];
    const total = weights[0] + weights[1] + weights[2];
    if (!(total > 0) || !(height > 0)) {
      return { ok: height, warn: 0, danger: 0 };
    }
    const minPx = 4;
    const active = [weights[0] > 0, weights[1] > 0, weights[2] > 0];
    const px = [0, 0, 0];
    let i: number;
    let sum = 0;
    for (i = 0; i < 3; i++) {
      if (!active[i]) {
        continue;
      }
      px[i] = Math.max(minPx, Math.round((weights[i] / total) * height));
      sum += px[i];
    }
    let guard = 0;
    while (sum > height && guard < height) {
      let idx = 0;
      if (px[1] > px[idx]) {
        idx = 1;
      }
      if (px[2] > px[idx]) {
        idx = 2;
      }
      if (px[idx] <= minPx) {
        break;
      }
      px[idx] = px[idx] - 1;
      sum = sum - 1;
      guard++;
    }
    guard = 0;
    while (sum < height && guard < height) {
      let idx = 0;
      if (px[1] >= px[idx]) {
        idx = 1;
      }
      if (px[2] >= px[idx]) {
        idx = 2;
      }
      px[idx] = px[idx] + 1;
      sum = sum + 1;
      guard++;
    }
    return { ok: px[0], warn: px[1], danger: px[2] };
  }

  private buildAlertLines(alerts: FleetAlert[]): MissionAlertLine[] {
    const lines: MissionAlertLine[] = [];
    let i: number;
    for (i = 0; i < alerts.length; i++) {
      const alert = alerts[i];
      lines.push({
        when: this.alertWhen(alert),
        mission: this.alertMission(alert),
        driver: this.driverName(alert.driverId),
        truck: this.alertTruck(alert),
        type: alertTypeLabel[alert.type] || alert.type,
        minutes: alert.durationMin || 0,
        place: this.alertPlace(alert.type)
      });
    }
    return lines;
  }

  private buildMissionCards(missions: Mission[]): MissionCard[] {
    const cards: MissionCard[] = [];
    let i: number;
    for (i = 0; i < missions.length; i++) {
      const mission = missions[i];
      cards.push({
        id: mission.id,
        name: mission.name || mission.id,
        status: this.cardStatus(mission.status),
        statusClass: this.cardStatusClass(mission.status),
        tone: this.missionTone(mission)
      });
    }
    return cards;
  }

  private cardStatus(status: Mission['status']): string {
    if (status === 'cancelled') {
      return 'Suspendu';
    }
    return missionStatusMeta[status].label;
  }

  private cardStatusClass(status: Mission['status']): string {
    if (status === 'running') {
      return 'orient-chip--brand';
    }
    if (status === 'done') {
      return 'orient-chip--ok';
    }
    if (status === 'cancelled') {
      return 'orient-chip--warn';
    }
    return 'orient-chip--neutral';
  }

  private missionTone(mission: Mission): 'ok' | 'light' | 'serious' {
    let unjustified = 0;
    let critical = false;
    let mild = false;
    let count = 0;
    let i: number;
    for (i = 0; i < this.alerts.length; i++) {
      const alert = this.alerts[i];
      if (alert.missionId !== mission.id) {
        continue;
      }
      count++;
      unjustified += alert.durationMin || 0;
      if (alert.level === 'critical') {
        critical = true;
      } else if (alert.level === 'warning' || alert.level === 'info') {
        mild = true;
      }
    }
    const actual = cycleTotal(mission.actualCycle);
    const standard = cycleTotal(mission.standardCycle);
    if (critical || unjustified >= 15) {
      return 'serious';
    }
    if (mild || count > 0 || actual > standard) {
      return 'light';
    }
    return 'ok';
  }

  private parseDate(value: string): Date {
    const parts = (value || '').split('-');
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    if (!year || !month || !day) {
      return this.startOfToday();
    }
    return new Date(year, month - 1, day);
  }

  private buildMissionStats(missions: Mission[]): MissionStatRow[] {
    const rows: MissionStatRow[] = [];
    let i: number;
    for (i = 0; i < missions.length; i++) {
      const mission = missions[i];
      const ids = this.matchingTruckIds(mission);
      const actual = mission.actualCycle || { loading: 0, outbound: 0, unloading: 0, return: 0 };
      const cycle = cycleTotal(mission.actualCycle);
      const standard = cycleTotal(mission.standardCycle);
      const trajet = (actual.outbound || 0) + (actual.return || 0);
      if (!ids.length) {
        rows.push(this.missionStatRow(mission, '—', '—', 0, 0, 0, cycle, standard, 0, trajet, 0, 0));
        continue;
      }
      let j: number;
      for (j = 0; j < ids.length; j++) {
        const truck = this.truckById(ids[j]);
        if (!truck) {
          continue;
        }
        let alerts = 0;
        let unjustified = 0;
        let k: number;
        for (k = 0; k < this.alerts.length; k++) {
          const alert = this.alerts[k];
          if (alert.missionId !== mission.id || alert.truckId !== truck.id) {
            continue;
          }
          alerts++;
          unjustified += alert.durationMin || 0;
        }
        rows.push(this.missionStatRow(
          mission,
          truck.plate,
          this.driverName(truck.driverId),
          truck.tripsDone || 0,
          alerts,
          unjustified,
          cycle,
          standard,
          truck.timeStock || 0,
          trajet,
          truck.timePort || 0,
          truck.timeWorkshop || 0
        ));
      }
    }
    return rows;
  }

  private missionStatRow(
    mission: Mission,
    truck: string,
    driver: string,
    trips: number,
    alerts: number,
    unjustified: number,
    cycle: number,
    standard: number,
    stock: number,
    trajet: number,
    port: number,
    workshop: number
  ): MissionStatRow {
    return {
      id: mission.id,
      name: mission.name || '—',
      truck: truck,
      driver: driver,
      trips: trips,
      alerts: alerts,
      unjustified: unjustified,
      cycle: cycle,
      standard: standard,
      stock: stock,
      trajet: trajet,
      port: port,
      workshop: workshop
    };
  }

  private missionDriverNames(mission: Mission, truckIds: string[]): string[] {
    const names: string[] = [];
    const seen: { [id: string]: boolean } = {};
    const listed = mission.driverIds && mission.driverIds.length ? mission.driverIds : [];
    let i: number;
    for (i = 0; i < listed.length; i++) {
      if (!seen[listed[i]]) {
        seen[listed[i]] = true;
        names.push(this.driverName(listed[i]));
      }
    }
    if (!names.length) {
      for (i = 0; i < truckIds.length; i++) {
        const truck = this.truckById(truckIds[i]);
        if (!truck || !truck.driverId || seen[truck.driverId]) {
          continue;
        }
        seen[truck.driverId] = true;
        names.push(this.driverName(truck.driverId));
      }
    }
    return names;
  }

  private joinList(values: string[]): string {
    return values.length ? values.join(', ') : '—';
  }

  private buildMissionRows(missions: Mission[]): MissionRow[] {
    const rows: MissionRow[] = [];
    let i: number;
    for (i = 0; i < missions.length; i++) {
      const mission = missions[i];
      const ids = this.matchingTruckIds(mission);
      let trips = 0;
      let j: number;
      for (j = 0; j < ids.length; j++) {
        const truck = this.truckById(ids[j]);
        trips += truck ? truck.tripsDone || 0 : 0;
      }
      const actual = cycleTotal(mission.actualCycle);
      rows.push({
        id: mission.id,
        ship: this.shipName(mission.shipId),
        poste: shiftLabel(mission, this.shifts),
        date: fmtDate(mission.date),
        trips: trips,
        cycleAvg: actual,
        standard: cycleTotal(mission.standardCycle),
        trucks: ids.length,
        status: missionStatusMeta[mission.status].label
      });
    }
    return rows;
  }

  private missionHasDriver(mission: Mission, driverId: string): boolean {
    const ids = mission.truckIds || [];
    let i: number;
    for (i = 0; i < ids.length; i++) {
      const truck = this.truckById(ids[i]);
      if (truck && truck.driverId === driverId) {
        return true;
      }
    }
    const drivers = mission.driverIds || [];
    return drivers.indexOf(driverId) >= 0;
  }

  private exportTable(): { headers: string[]; rows: string[][] } {
    if (this.view === 'mission') {
      return this.exportMissionStats();
    }
    if (this.view === 'general' || this.view === 'driver') {
      return this.exportDrivers();
    }
    if (this.view === 'ship') {
      return this.exportMissions();
    }
    return this.exportTrucks();
  }

  private exportMissionStats(): { headers: string[]; rows: string[][] } {
    const headers = [
      'Nom',
      'Camion',
      'Chauffeur',
      'Voyages',
      'Alertes',
      'Temps non justifié',
      'Cycle',
      'Standard',
      'Stock',
      'Trajet',
      'Port',
      'Atelier'
    ];
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < this.missionStats.length; i++) {
      const row = this.missionStats[i];
      rows.push([
        row.name,
        row.truck,
        row.driver,
        String(row.trips),
        String(row.alerts),
        this.num(row.unjustified),
        this.num(row.cycle),
        this.num(row.standard),
        this.num(row.stock),
        this.num(row.trajet),
        this.num(row.port),
        this.num(row.workshop)
      ]);
    }
    return { headers: headers, rows: rows };
  }

  private exportDrivers(): { headers: string[]; rows: string[][] } {
    const headers = ['Chauffeur', 'Missions terminées', 'Voyages', 'Alertes'];
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < this.driverRanks.length; i++) {
      const row = this.driverRanks[i];
      rows.push([row.name, String(row.missions), String(row.trips), String(row.alerts)]);
    }
    return { headers: headers, rows: rows };
  }

  private exportMissions(): { headers: string[]; rows: string[][] } {
    const headers = ['Mission', 'Navire', 'Poste', 'Date', 'Camions', 'Voyages', 'Cycle', 'Standard', 'Statut'];
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < this.missionRows.length; i++) {
      const row = this.missionRows[i];
      rows.push([
        row.id,
        row.ship,
        row.poste,
        row.date,
        String(row.trucks),
        String(row.trips),
        this.num(row.cycleAvg),
        this.num(row.standard),
        row.status
      ]);
    }
    return { headers: headers, rows: rows };
  }

  private exportTrucks(): { headers: string[]; rows: string[][] } {
    const headers = [
      'Camion',
      'Chauffeur',
      'Poste',
      'Navire',
      'Voyages',
      'Cycle moyen',
      'Standard',
      'Stock',
      'Trajet',
      'Port',
      'Atelier',
      'Passages atelier',
      'Alertes',
      'Durée alertes'
    ];
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < this.truckRanks.length; i++) {
      const row = this.truckRanks[i];
      rows.push([
        row.plate,
        row.driver,
        row.poste,
        row.ship,
        String(row.trips),
        this.num(row.cycleAvg),
        this.num(row.standard),
        this.num(row.stock),
        this.num(row.trajet),
        this.num(row.port),
        this.num(row.workshop),
        String(row.workshopVisits),
        String(row.alerts),
        this.num(row.alertMin)
      ]);
    }
    return { headers: headers, rows: rows };
  }

  private missionsForTruck(truck: Truck, missions: Mission[]): Mission[] {
    const out: Mission[] = [];
    let i: number;
    for (i = 0; i < missions.length; i++) {
      const ids = missions[i].truckIds || [];
      if (ids.indexOf(truck.id) >= 0) {
        out.push(missions[i]);
      }
    }
    return out;
  }

  private primaryMission(truck: Truck, missions: Mission[]): Mission | null {
    let i: number;
    for (i = 0; i < missions.length; i++) {
      if (missions[i].id === truck.missionId) {
        return missions[i];
      }
    }
    return missions.length ? missions[0] : null;
  }

  private alertStats(alerts: FleetAlert[], truckId: string, driverId: string): { count: number; minutes: number } {
    let count = 0;
    let minutes = 0;
    let i: number;
    for (i = 0; i < alerts.length; i++) {
      const alert = alerts[i];
      if (truckId && alert.truckId !== truckId) {
        continue;
      }
      if (driverId && alert.driverId !== driverId) {
        continue;
      }
      count++;
      minutes += alert.durationMin || 0;
    }
    return { count: count, minutes: minutes };
  }

  private startOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private startOfLastWeek(): Date {
    const start = this.startOfToday();
    start.setDate(start.getDate() - 6);
    return start;
  }

  private applyDriverDefault(): void {
    const driverId = this.driverOverStandard();
    if (!driverId || driverId === this.entityFilter) {
      return;
    }
    this.entityFilter = driverId;
    this.rebuild();
  }

  private driverOverStandard(): string {
    let bestId = '';
    let bestGap = -Infinity;
    let i: number;
    for (i = 0; i < this.truckRanks.length; i++) {
      const rank = this.truckRanks[i];
      const truck = this.truckById(rank.id);
      if (!truck || !truck.driverId) {
        continue;
      }
      const gap = rank.cycleAvg - rank.standard;
      if (gap > bestGap) {
        bestGap = gap;
        bestId = truck.driverId;
      }
    }
    return bestId;
  }

  private periodBounds(): { from: string; to: string } {
    const from = formatDateLocal(this.dateFrom);
    let to = formatDateLocal(this.dateTo);
    if (to < from) {
      to = from;
    }
    return { from: from, to: to };
  }

  private openAlertLines(lines: MissionAlertLine[], showMission: boolean): void {
    this.dialog.open(MissionAlertsDialogComponent, {
      width: '960px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'orient-dash-dialog',
      data: { lines: lines, showMission: showMission }
    });
  }

  private openDetail(
    title: string,
    columns: KpiDetailColumn[],
    rows: { [key: string]: string }[],
    empty: string,
    tripAction?: boolean
  ): void {
    if (!rows.length) {
      return;
    }
    this.dialog.open(KpiDetailDialogComponent, {
      width: '960px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'orient-dash-dialog',
      data: { title: title, columns: columns, rows: rows, empty: empty, tripAction: !!tripAction }
    });
  }

  private alertWhen(alert: FleetAlert): string {
    const mission = alert.missionId ? this.missionById(alert.missionId) : null;
    const date = mission ? fmtDate(mission.date) : '';
    const time = alert.time || '';
    if (date && time) {
      return date + ' · ' + time;
    }
    return date || time || '—';
  }

  private tripStart(mission: Mission, truck: Truck | null): { when: string; whenMin: string; whenDate: string } {
    const parts = (mission.start || '08:00').split(':');
    let totalMin = (Number(parts[0]) || 0) * 60 + (Number(parts[1]) || 0);
    const offset = truck && truck.cycleOffset ? truck.cycleOffset : 30;
    totalMin += offset % 120;
    const iso = mission.date || '';
    const base = new Date(iso + 'T00:00:00');
    let when = '—';
    if (!isNaN(base.getTime())) {
      const stamp = new Date(base.getTime() + totalMin * 60000);
      const date = stamp.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
      const hh = stamp.getHours();
      const mm = stamp.getMinutes();
      const hhs = hh < 10 ? '0' + hh : String(hh);
      const mms = mm < 10 ? '0' + mm : String(mm);
      when = date + ' · ' + hhs + ':' + mms;
    }
    return {
      when: when,
      whenMin: String(totalMin),
      whenDate: iso
    };
  }

  private workshopWhen(truck: Truck | null, truckId: string): string {
    let i: number;
    for (i = 0; i < this.alerts.length; i++) {
      const alert = this.alerts[i];
      if (alert.truckId === truckId && alert.type === 'workshop_excess') {
        return this.alertWhen(alert);
      }
    }
    const linked = truck ? this.missionsForTruck(truck, this.missions) : [];
    const mission = truck ? this.primaryMission(truck, linked) : null;
    if (!mission) {
      return '—';
    }
    const parts = (mission.start || '08:00').split(':');
    let totalMin = (Number(parts[0]) || 0) * 60 + (Number(parts[1]) || 0);
    const offset = truck && truck.cycleOffset ? truck.cycleOffset : 30;
    totalMin += offset % 120;
    const h = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    const hh = h < 10 ? '0' + h : String(h);
    const mm = m < 10 ? '0' + m : String(m);
    return fmtDate(mission.date) + ' · ' + hh + ':' + mm;
  }

  private alertMission(alert: FleetAlert): string {
    const mission = alert.missionId ? this.missionById(alert.missionId) : null;
    return mission ? (mission.name || mission.id) : '—';
  }

  private alertTruck(alert: FleetAlert): string {
    const truck = alert.truckId ? this.truckById(alert.truckId) : null;
    return truck ? truck.plate : '—';
  }

  private alertPlace(type: string): string {
    if (type === 'stock_excess') {
      return 'Chargement';
    }
    if (type === 'route_delay') {
      return 'Trajet aller';
    }
    if (type === 'port_excess') {
      return 'Déchargement';
    }
    if (type === 'long_stop') {
      return 'Retour';
    }
    if (type === 'workshop_excess') {
      return 'Atelier';
    }
    if (type === 'pause_excess') {
      return 'Pause';
    }
    return 'Autre';
  }

  private missionById(id: string): Mission | null {
    let i: number;
    for (i = 0; i < this.missions.length; i++) {
      if (this.missions[i].id === id) {
        return this.missions[i];
      }
    }
    return null;
  }

  private truckById(id: string): Truck | null {
    let i: number;
    for (i = 0; i < this.trucks.length; i++) {
      if (this.trucks[i].id === id) {
        return this.trucks[i];
      }
    }
    return null;
  }

  private findTruckRank(rows: TruckRank[], id: string): TruckRank | null {
    let i: number;
    for (i = 0; i < rows.length; i++) {
      if (rows[i].id === id) {
        return rows[i];
      }
    }
    return null;
  }

  private driverName(id: string | null): string {
    if (!id) {
      return '—';
    }
    let i: number;
    for (i = 0; i < this.drivers.length; i++) {
      if (this.drivers[i].id === id) {
        return driverDisplayName(this.drivers[i]);
      }
    }
    return id;
  }

  private shipName(id: string): string {
    let i: number;
    for (i = 0; i < this.ships.length; i++) {
      if (this.ships[i].id === id) {
        return this.ships[i].name;
      }
    }
    return '—';
  }

  private zoneName(id: string): string {
    const zones = this.store.snapshotStockZones();
    let i: number;
    for (i = 0; i < zones.length; i++) {
      if (zones[i].id === id) {
        const name = zones[i].name || '';
        const parts = name.split(' · ');
        return parts[0] || name || '—';
      }
    }
    return '—';
  }

  private portName(id: string): string {
    const ports = this.store.snapshotPorts();
    let i: number;
    for (i = 0; i < ports.length; i++) {
      if (ports[i].id === id) {
        return ports[i].name || '—';
      }
    }
    return '—';
  }

  private shiftName(id: MissionShift): string {
    let i: number;
    for (i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].id === id) {
        return this.shifts[i].label;
      }
    }
    return id;
  }

  private shiftIdByLabel(label: string): MissionShift | '' {
    let i: number;
    for (i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].label === label) {
        return this.shifts[i].id as MissionShift;
      }
    }
    return '';
  }

  private mean(values: number[]): number {
    if (!values.length) {
      return 0;
    }
    let sum = 0;
    let i: number;
    for (i = 0; i < values.length; i++) {
      sum += values[i] || 0;
    }
    return sum / values.length;
  }
}
