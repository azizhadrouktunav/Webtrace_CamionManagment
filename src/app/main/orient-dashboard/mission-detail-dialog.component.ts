import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface MissionDetail {
  name: string;
  ship: string;
  date: string;
  start: string;
  poste: string;
  stock: string;
  port: string;
  trucks: string;
  drivers: string;
  trips: string;
  cycle: string;
  notes: string;
}

@Component({
  selector: 'app-mission-detail-dialog',
  templateUrl: './mission-detail-dialog.component.html',
  styleUrls: ['./_dash-dialog.scss', './mission-detail-dialog.component.scss']
})
export class MissionDetailDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<MissionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MissionDetail
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
