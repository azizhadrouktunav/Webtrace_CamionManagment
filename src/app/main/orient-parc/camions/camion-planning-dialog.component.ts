import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Mission, Truck } from 'app/mock/types/fleet';
import { missionStatusMeta } from 'app/mock/utils/status';
import { chipClass } from 'app/main/orient-shared/orient-ui';

export interface CamionPlanningDialogData {
  truck: Truck;
}

@Component({
  selector: 'app-orient-camion-planning-dialog',
  templateUrl: './camion-planning-dialog.component.html',
  styleUrls: ['../_orient-form-dlg.scss']
})
export class CamionPlanningDialogComponent implements OnInit {
  truck: Truck;
  missions: Mission[] = [];
  missionStatusMeta = missionStatusMeta;
  chipClass = chipClass;

  constructor(
    private dialogRef: MatDialogRef<CamionPlanningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CamionPlanningDialogData,
    private store: MockStoreService
  ) {
    this.truck = data.truck;
  }

  ngOnInit(): void {
    const all = this.store.snapshotMissions();
    this.missions = all
      .filter((m) => m.truckIds && m.truckIds.indexOf(this.truck.id) >= 0)
      .slice()
      .sort((a, b) => {
        const da = (a.date || '') + (a.start || '');
        const db = (b.date || '') + (b.start || '');
        return da < db ? 1 : da > db ? -1 : 0;
      });
  }

  shipName(mission: Mission): string {
    const ship = this.store.shipById(mission.shipId);
    return ship ? ship.name : mission.shipId || '—';
  }

  shiftLabel(mission: Mission): string {
    if (!mission.shift) {
      return '—';
    }
    if (mission.shift === 'morning') {
      return 'Matin';
    }
    if (mission.shift === 'afternoon') {
      return 'Après-midi';
    }
    if (mission.shift === 'poste4') {
      return 'Poste 4';
    }
    if (mission.shift === 'poste5') {
      return 'Poste 5';
    }
    return 'Nuit';
  }

  close(): void {
    this.dialogRef.close();
  }
}
