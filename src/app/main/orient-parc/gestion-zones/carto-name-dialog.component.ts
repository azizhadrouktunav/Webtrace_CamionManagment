import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CartoNameDialogData {
  name: string;
  typeLabel: string;
}

@Component({
  selector: 'app-orient-carto-name-dialog',
  templateUrl: './carto-name-dialog.component.html',
  styleUrls: ['../_orient-form-dlg.scss']
})
export class CartoNameDialogComponent {
  formName = '';

  constructor(
    private dialogRef: MatDialogRef<CartoNameDialogComponent, string | null>,
    @Inject(MAT_DIALOG_DATA) public data: CartoNameDialogData
  ) {
    this.formName = data && data.name ? data.name : '';
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    const name = (this.formName || '').trim();
    if (!name) {
      return;
    }
    this.dialogRef.close(name);
  }
}
