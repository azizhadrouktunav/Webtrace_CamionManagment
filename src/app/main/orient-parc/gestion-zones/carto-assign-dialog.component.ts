import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeoAssignKind } from 'app/main/orient-suivi/geo-factory';
import { ZONE_KIND_OPTIONS } from 'app/main/monitoring/geo-zone-assign';

export interface CartoAssignDialogData {
  kind: GeoAssignKind | null;
}

@Component({
  selector: 'app-orient-carto-assign-dialog',
  templateUrl: './carto-assign-dialog.component.html',
  styleUrls: ['../_orient-form-dlg.scss']
})
export class CartoAssignDialogComponent {
  kind: GeoAssignKind = 'pause';
  options = ZONE_KIND_OPTIONS;

  constructor(
    private dialogRef: MatDialogRef<CartoAssignDialogComponent, GeoAssignKind | null>,
    @Inject(MAT_DIALOG_DATA) data: CartoAssignDialogData
  ) {
    this.kind = data && data.kind ? data.kind : 'pause';
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.dialogRef.close(this.kind);
  }
}
