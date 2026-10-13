import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snackbar-message',
  template: `
    <!-- <input *ngIf="data.checkable" type="checkbox" /> -->
    <div class="container">
        <mat-icon *ngIf="data.icon">{{ data.icon }}</mat-icon>
        <span>{{ data.text }}</span>
        <button mat-icon-button class="last-item" (click)="snackBarRef.dismiss()">
               <mat-icon>close</mat-icon>
        </button>
    </div>
    <!--<button
      mat-raised-button
      color="accent"
      (click)="snackBarRef.dismiss()"
    >
      {{ data.action }}
    </button> -->
  `,
  styleUrls: ['./snackbar-message.component.scss']
})
export class SnackbarMessageComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarMessageComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

}
