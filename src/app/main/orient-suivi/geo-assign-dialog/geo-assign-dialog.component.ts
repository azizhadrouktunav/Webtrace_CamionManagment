import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LatLng } from 'app/mock/types/fleet';
import { GeoAssignKind } from '../geo-factory';

export interface GeoAssignDialogData {
  coords: LatLng[];
  mode: 'polygon' | 'polyline' | 'marker';
}

export interface GeoAssignDialogResult {
  name: string;
  kind: GeoAssignKind | 'route';
  direction?: 'aller' | 'retour' | 'alternatif';
  coords: LatLng[];
}

@Component({
  selector: 'app-orient-geo-assign-dialog',
  templateUrl: './geo-assign-dialog.component.html',
  styleUrls: ['./geo-assign-dialog.component.scss']
})
export class GeoAssignDialogComponent {
  name = '';
  kind: GeoAssignKind | 'route' = 'port';
  direction: 'aller' | 'retour' | 'alternatif' = 'aller';
  isRoute = false;

  kinds: { id: GeoAssignKind; label: string }[] = [
    { id: 'port', label: 'Port' },
    { id: 'stock', label: 'Zone de stock' },
    { id: 'workshop', label: 'Zone atelier' },
    { id: 'pause', label: 'Zone pause' }
  ];

  constructor(
    private dialogRef: MatDialogRef<GeoAssignDialogComponent, GeoAssignDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) public data: GeoAssignDialogData
  ) {
    this.isRoute = !!(data && data.mode === 'polyline');
    if (this.isRoute) {
      this.kind = 'route';
      this.name = 'Nouveau trajet';
    } else {
      this.name = 'Nouvelle zone';
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    const name = (this.name || '').trim();
    if (!name) {
      return;
    }
    if (this.isRoute) {
      this.dialogRef.close({
        name: name,
        kind: 'route',
        direction: this.direction,
        coords: this.data.coords
      });
      return;
    }
    this.dialogRef.close({
      name: name,
      kind: this.kind as GeoAssignKind,
      coords: this.data.coords
    });
  }
}
