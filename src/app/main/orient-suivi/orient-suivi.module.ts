import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AngularSplitModule } from 'angular-split';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SuiviComponent } from './suivi.component';
import { GeoAssignDialogComponent } from './geo-assign-dialog/geo-assign-dialog.component';
import { GeoManagePanelComponent } from './geo-manage-panel/geo-manage-panel.component';

const routes: Routes = [
  { path: '', component: SuiviComponent }
];

@NgModule({
  declarations: [
    SuiviComponent,
    GeoAssignDialogComponent,
    GeoManagePanelComponent
  ],
  entryComponents: [
    GeoAssignDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    AngularSplitModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule
  ]
})
export class OrientSuiviModule {}
