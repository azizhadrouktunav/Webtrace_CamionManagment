import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardComponent } from './dashboard.component';
import { MissionAlertsDialogComponent } from './mission-alerts-dialog.component';
import { MissionDetailDialogComponent } from './mission-detail-dialog.component';
import { DoneMissionsDialogComponent } from './done-missions-dialog.component';
import { KpiDetailDialogComponent } from './kpi-detail-dialog.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

export function orientPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Éléments par page';
  intl.nextPageLabel = 'Page suivante';
  intl.previousPageLabel = 'Page précédente';
  intl.firstPageLabel = 'Première page';
  intl.lastPageLabel = 'Dernière page';
  intl.getRangeLabel = function (page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return '0 sur ' + length;
    }
    const start = page * pageSize;
    const end = Math.min(start + pageSize, length);
    return (start + 1) + ' – ' + end + ' sur ' + length;
  };
  return intl;
}

@NgModule({
  declarations: [DashboardComponent, MissionAlertsDialogComponent, MissionDetailDialogComponent, DoneMissionsDialogComponent, KpiDetailDialogComponent],
  entryComponents: [MissionAlertsDialogComponent, MissionDetailDialogComponent, DoneMissionsDialogComponent, KpiDetailDialogComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDialogModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: orientPaginatorIntl }
  ]
})
export class OrientDashboardModule {}
