import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockStoreService } from 'app/mock/mock-store.service';
import {
  CycleStandard,
  Driver,
  Mission,
  MissionShift,
  MissionStatus,
  Port,
  Ship,
  StockZone,
  Truck
} from 'app/mock/types/fleet';
import { ShiftConfig, CycleDefaults } from 'app/mock/types/settings';
import { cycleTotal } from 'app/mock/utils/simulation';
import { inferShift } from 'app/mock/utils/shifts';
import { driverStatusMeta, truckStatusMeta } from 'app/mock/utils/status';
import { formatDateLocal } from 'app/mock/utils/truck-status';
import { driverDisplayName } from 'app/main/orient-shared/orient-ui';

export interface MissionFormDialogData {
  mission: Mission | null;
}

export interface MissionFormDialogResult {
  mission: Mission;
  launch: boolean;
}

export interface MissionWizardStep {
  title: string;
  hint: string;
}

export interface CycleStageField {
  key: keyof CycleStandard;
  label: string;
}

@Component({
  selector: 'app-orient-mission-form-dialog',
  templateUrl: './mission-form-dialog.component.html',
  styleUrls: ['./mission-form-dialog.component.scss']
})
export class MissionFormDialogComponent implements OnInit {
  steps: MissionWizardStep[] = [
    { title: 'Mission', hint: 'Navire, poste et trajet' },
    { title: 'Camions & chauffeurs', hint: 'Ajout à la mission' },
    { title: 'Temps de cycle', hint: 'Estimation et notes' }
  ];

  stages: CycleStageField[] = [
    { key: 'loading', label: 'Chargement' },
    { key: 'outbound', label: 'Trajet aller' },
    { key: 'unloading', label: 'Déchargement port' },
    { key: 'return', label: 'Retour' }
  ];

  step = 0;
  isEdit = false;
  dialogTitle = 'Nouvelle mission de chargement navire';

  ships: Ship[] = [];
  shifts: ShiftConfig[] = [];
  stockZones: StockZone[] = [];
  ports: Port[] = [];
  trucks: Truck[] = [];
  drivers: Driver[] = [];

  formId = '';
  formName = '';
  formShipId = '';
  formDate = '';
  formShift: MissionShift | '' = '';
  formStart = '';
  formEnd = '';
  formStockZoneId = '';
  formPortId = '';
  formTruckIds: string[] = [];
  formDriverIds: string[] = [];
  formTripsTarget = 0;
  formTripsDone = 0;
  formStatus: MissionStatus = 'planned';
  formNotes = '';
  formContingency = 0;
  formCycle: CycleStandard = { loading: 10, outbound: 10, unloading: 5, return: 10 };
  defaultsOpen = false;
  draftCycle: CycleStandard = { loading: 10, outbound: 10, unloading: 5, return: 10 };
  draftContingency = 0;
  formActualCycle: CycleStandard = { loading: 0, outbound: 0, unloading: 0, return: 0 };

  truckAddIds: string[] = [];
  driverAddIds: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<MissionFormDialogComponent, MissionFormDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) public data: MissionFormDialogData,
    private store: MockStoreService
  ) {}

  ngOnInit(): void {
    this.ships = this.store.snapshotShips().slice();
    this.shifts = this.store.snapshotShifts().slice();
    this.stockZones = this.store.snapshotStockZones().slice();
    this.ports = this.store.snapshotPorts().slice();
    this.trucks = this.store.snapshotTrucks().slice();
    this.drivers = this.store.snapshotDrivers().slice();

    if (this.data && this.data.mission) {
      this.isEdit = true;
      this.bindFromMission(this.data.mission);
      this.dialogTitle = 'Modifier ' + this.data.mission.id;
    } else {
      this.isEdit = false;
      this.bindBlank();
      this.dialogTitle = 'Nouvelle mission de chargement navire';
    }
  }

  get isLast(): boolean {
    return this.step === this.steps.length - 1;
  }

  get cycleEstimate(): number {
    return cycleTotal(this.formCycle) + (this.formContingency || 0);
  }

  get canSave(): boolean {
    return this.stepValid(0) && this.stepValid(1) && this.stepValid(2);
  }

  get availableShifts(): ShiftConfig[] {
    const out: ShiftConfig[] = [];
    let i: number;
    for (i = 0; i < this.shifts.length; i++) {
      const s = this.shifts[i];
      if (s.active || s.id === this.formShift) {
        out.push(s);
      }
    }
    return out;
  }

  get availableTrucks(): Truck[] {
    const out: Truck[] = [];
    let i: number;
    for (i = 0; i < this.trucks.length; i++) {
      if (this.formTruckIds.indexOf(this.trucks[i].id) === -1) {
        out.push(this.trucks[i]);
      }
    }
    return out;
  }

  get availableDrivers(): Driver[] {
    const out: Driver[] = [];
    let i: number;
    for (i = 0; i < this.drivers.length; i++) {
      if (this.formDriverIds.indexOf(this.drivers[i].id) === -1) {
        out.push(this.drivers[i]);
      }
    }
    return out;
  }

  truckLabel(id: string): string {
    const t = this.findTruck(id);
    return t ? id + ' · ' + t.plate : id;
  }

  truckSecondary(id: string): string {
    const t = this.findTruck(id);
    return t ? t.type : '';
  }

  driverLabel(id: string): string {
    const d = this.findDriver(id);
    return d ? driverDisplayName(d) : id;
  }

  driverSecondary(id: string): string {
    const d = this.findDriver(id);
    if (!d) {
      return '';
    }
    const parts = [d.licenceCategory, d.licenceNumber].filter(Boolean);
    return parts.join(' · ');
  }

  selectionLabel(count: number): string {
    if (!count) {
      return '';
    }
    return count + ' sélectionné' + (count > 1 ? 's' : '');
  }

  truckOptionTitle(t: Truck): string {
    return t.plate;
  }

  truckOptionSub(t: Truck): string {
    const parts = [t.id, truckStatusMeta[t.status].label];
    if (t.missionId && t.missionId !== this.formId) {
      parts.push(t.missionId);
    }
    return parts.join(' · ');
  }

  driverOptionTitle(d: Driver): string {
    return driverDisplayName(d);
  }

  driverOptionSub(d: Driver): string {
    return d.id + ' · ' + driverStatusMeta[d.status].label;
  }

  stepValid(index: number): boolean {
    if (index === 0) {
      return !!(this.formName.trim() && this.formShipId && this.formDate && this.formStart && this.formShift && this.formStockZoneId && this.formPortId);
    }
    if (index === 1) {
      return this.formTruckIds.length > 0 && this.formDriverIds.length > 0;
    }
    if (index === 2) {
      let i: number;
      for (i = 0; i < this.stages.length; i++) {
        if (this.formCycle[this.stages[i].key] < 1) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  canGoToStep(index: number): boolean {
    if (index <= this.step) {
      return true;
    }
    let i: number;
    for (i = 0; i < index; i++) {
      if (!this.stepValid(i)) {
        return false;
      }
    }
    return true;
  }

  goToStep(index: number): void {
    if (this.canGoToStep(index)) {
      this.step = index;
    }
  }

  next(): void {
    if (!this.isLast && this.stepValid(this.step)) {
      this.step = this.step + 1;
    }
  }

  prev(): void {
    if (this.step > 0) {
      this.step = this.step - 1;
    }
  }

  selectShift(id: MissionShift | ''): void {
    this.formShift = id;
  }

  addTrucks(): void {
    if (!this.truckAddIds.length) {
      return;
    }
    const next = this.formTruckIds.slice();
    let i: number;
    for (i = 0; i < this.truckAddIds.length; i++) {
      if (next.indexOf(this.truckAddIds[i]) === -1) {
        next.push(this.truckAddIds[i]);
      }
    }
    this.formTruckIds = next;
    this.truckAddIds = [];
  }

  removeTruck(id: string): void {
    this.formTruckIds = this.formTruckIds.filter(function (x) { return x !== id; });
  }

  addDrivers(): void {
    if (!this.driverAddIds || !this.driverAddIds.length) {
      return;
    }
    const next = this.formDriverIds.slice();
    let i: number;
    for (i = 0; i < this.driverAddIds.length; i++) {
      if (next.indexOf(this.driverAddIds[i]) === -1) {
        next.push(this.driverAddIds[i]);
      }
    }
    this.formDriverIds = next;
    this.driverAddIds = [];
  }

  removeDriver(id: string): void {
    this.formDriverIds = this.formDriverIds.filter(function (x) { return x !== id; });
  }

  setCycle(key: keyof CycleStandard, raw: number | string): void {
    const n = Math.max(1, Number(raw) || 0);
    const next = Object.assign({}, this.formCycle);
    next[key] = n;
    this.formCycle = next;
  }

  setContingency(raw: number | string): void {
    this.formContingency = Math.max(0, Number(raw) || 0);
  }

  openDefaults(): void {
    const defaults = this.store.snapshotCycleDefaults();
    this.draftCycle = Object.assign({}, defaults.cycle);
    this.draftContingency = defaults.contingency || 0;
    this.defaultsOpen = true;
  }

  closeDefaults(): void {
    this.defaultsOpen = false;
  }

  setDraftCycle(key: keyof CycleStandard, raw: number | string): void {
    const n = Math.max(1, Number(raw) || 0);
    const next = Object.assign({}, this.draftCycle);
    next[key] = n;
    this.draftCycle = next;
  }

  setDraftContingency(raw: number | string): void {
    this.draftContingency = Math.max(0, Number(raw) || 0);
  }

  defaultsValid(): boolean {
    let i: number;
    for (i = 0; i < this.stages.length; i++) {
      if (this.draftCycle[this.stages[i].key] < 1) {
        return false;
      }
    }
    return this.draftContingency >= 0;
  }

  saveDefaults(): void {
    if (!this.defaultsValid()) {
      return;
    }
    const stored = this.store.snapshotCycleDefaults();
    const defaults: CycleDefaults = {
      cycle: Object.assign({}, this.draftCycle),
      contingency: this.draftContingency || 0,
      normalAlertMin: stored.normalAlertMin,
      criticalAlertMin: stored.criticalAlertMin
    };
    this.store.setCycleDefaults(defaults);
    this.defaultsOpen = false;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  finalize(launch: boolean): void {
    if (!this.canSave) {
      return;
    }
    const mission: Mission = {
      id: this.formId,
      name: this.formName.trim(),
      shipId: this.formShipId,
      date: this.formDate,
      shift: this.formShift ? this.formShift : undefined,
      start: this.formStart,
      end: this.formEnd,
      stockZoneId: this.formStockZoneId,
      portId: this.formPortId,
      truckIds: this.formTruckIds.slice(),
      driverIds: this.formDriverIds.slice(),
      tripsTarget: Number(this.formTripsTarget) || 0,
      tripsDone: this.formTripsDone || 0,
      status: this.formStatus,
      standardCycle: Object.assign({}, this.formCycle),
      actualCycle: Object.assign({}, this.formActualCycle),
      contingency: this.formContingency || 0,
      notes: this.formNotes || ''
    };
    this.dialogRef.close({ mission: mission, launch: launch });
  }

  private bindBlank(): void {
    const active = this.firstActiveShift();
    this.formId = this.store.nextMissionId();
    this.formName = '';
    this.formShipId = '';
    this.formDate = formatDateLocal(new Date());
    this.formShift = active ? active.id : '';
    this.formStart = '06:00';
    this.formEnd = '';
    this.formStockZoneId = '';
    this.formPortId = '';
    this.formTruckIds = [];
    this.formDriverIds = [];
    this.formTripsTarget = 0;
    this.formTripsDone = 0;
    this.formStatus = 'planned';
    this.formNotes = '';
    const defaults = this.store.snapshotCycleDefaults();
    this.formContingency = defaults.contingency || 0;
    this.formCycle = Object.assign({}, defaults.cycle);
    this.formActualCycle = { loading: 0, outbound: 0, unloading: 0, return: 0 };
    this.step = 0;
  }

  private bindFromMission(m: Mission): void {
    const shift = m.shift || inferShift(m.start);
    let driverIds: string[] = [];
    if (m.driverIds && m.driverIds.length) {
      driverIds = m.driverIds.slice();
    } else {
      driverIds = this.driversFromTrucks(m.truckIds);
    }
    this.formId = m.id;
    this.formName = m.name || '';
    this.formShipId = m.shipId;
    this.formDate = m.date;
    this.formShift = shift;
    this.formStart = m.start;
    this.formEnd = m.end;
    this.formStockZoneId = m.stockZoneId;
    this.formPortId = m.portId;
    this.formTruckIds = m.truckIds ? m.truckIds.slice() : [];
    this.formDriverIds = driverIds;
    this.formTripsTarget = m.tripsTarget || 0;
    this.formTripsDone = m.tripsDone || 0;
    this.formStatus = m.status;
    this.formNotes = m.notes || '';
    this.formContingency = m.contingency || 0;
    this.formCycle = Object.assign({}, m.standardCycle || this.store.snapshotCycleDefaults().cycle);
    this.formActualCycle = Object.assign({}, m.actualCycle || { loading: 0, outbound: 0, unloading: 0, return: 0 });
    this.step = 0;
  }

  private firstActiveShift(): ShiftConfig | null {
    let i: number;
    for (i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].active) {
        return this.shifts[i];
      }
    }
    return this.shifts.length ? this.shifts[0] : null;
  }

  private driversFromTrucks(truckIds: string[]): string[] {
    const ids: string[] = [];
    let i: number;
    for (i = 0; i < truckIds.length; i++) {
      const t = this.findTruck(truckIds[i]);
      if (t && t.driverId && ids.indexOf(t.driverId) === -1) {
        ids.push(t.driverId);
      }
    }
    return ids;
  }

  private findTruck(id: string): Truck | null {
    let i: number;
    for (i = 0; i < this.trucks.length; i++) {
      if (this.trucks[i].id === id) {
        return this.trucks[i];
      }
    }
    return null;
  }

  private findDriver(id: string): Driver | null {
    let i: number;
    for (i = 0; i < this.drivers.length; i++) {
      if (this.drivers[i].id === id) {
        return this.drivers[i];
      }
    }
    return null;
  }
}
