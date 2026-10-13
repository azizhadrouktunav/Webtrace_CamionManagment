import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Mission, Port, Ship, ShipStatus } from 'app/mock/types/fleet';
import { shipStatusMeta } from 'app/mock/utils/status';

export interface NavireFormDialogData {
  ship: Ship | null;
}

@Component({
  selector: 'app-orient-navire-form-dialog',
  templateUrl: './navire-form-dialog.component.html',
  styleUrls: ['../_orient-form-dlg.scss']
})
export class NavireFormDialogComponent implements OnInit {
  isEdit = false;
  dialogTitle = 'Ajouter un navire';
  ports: Port[] = [];
  missions: Mission[] = [];
  shipStatusMeta = shipStatusMeta;
  statusOptions: ShipStatus[] = ['expected', 'berthed', 'loading', 'departed'];

  base: Ship | null = null;
  formName = '';
  formImo = '';
  formFlag = '';
  formPortId = '';
  formStatus: ShipStatus = 'expected';
  formTonnage = 0;
  formNotes = '';
  formMissionId: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<NavireFormDialogComponent, Ship | null>,
    @Inject(MAT_DIALOG_DATA) public data: NavireFormDialogData,
    private store: MockStoreService
  ) {}

  ngOnInit(): void {
    this.ports = this.store.snapshotPorts().slice();
    this.missions = this.store.snapshotMissions().slice();
    if (this.data.ship) {
      this.isEdit = true;
      this.dialogTitle = 'Modifier le navire';
      this.base = Object.assign({}, this.data.ship);
      this.bindForm(this.base);
    } else {
      const sample = this.store.snapshotShips()[0];
      this.base = Object.assign({}, sample, {
        id: this.store.nextShipId(),
        name: '',
        imo: '',
        flag: '',
        portId: this.ports.length ? this.ports[0].id : '',
        missionId: null,
        tonnage: 0,
        notes: '',
        status: 'expected' as ShipStatus
      });
      this.bindForm(this.base);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (!this.base) {
      return;
    }
    const item = Object.assign({}, this.base, {
      name: this.formName,
      imo: this.formImo,
      flag: this.formFlag,
      portId: this.formPortId,
      status: this.formStatus,
      tonnage: Number(this.formTonnage),
      notes: this.formNotes,
      missionId: this.formMissionId
    });
    this.dialogRef.close(item);
  }

  private bindForm(s: Ship): void {
    this.formName = s.name;
    this.formImo = s.imo;
    this.formFlag = s.flag;
    this.formPortId = s.portId;
    this.formStatus = s.status;
    this.formTonnage = s.tonnage;
    this.formNotes = s.notes;
    this.formMissionId = s.missionId;
  }
}
