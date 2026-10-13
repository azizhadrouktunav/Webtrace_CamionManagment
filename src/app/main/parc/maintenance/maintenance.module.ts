import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';
import { RepairsComponent } from './repairs/repairs.component';
import { RepairMaintenanceLogComponent } from './repair-maintenance-log/repair-maintenance-log.component';
import { RepairMaintenanceLogService } from './repair-maintenance-log/repair-maintenance-log.service';
import { EventFormComponent } from './event-form/event-form.component';
import {MatButtonModule} from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RepairFormComponent } from './repairs/repair-form/repair-form.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MaintenanceService } from './maintenance.service';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { SharedModule } from 'app/main/shared-module/shared.module';
import { DatePickerFormatDirective } from "./date-picker-format.directive";
import { MatExpansionModule,MatAutocompleteModule } from '@angular/material';

const routes: Routes = [
  {
    path : '',
    component: MaintenanceComponent,
    resolve : { trackingObjects: MaintenanceService}
  },
  {
    path: 'repairs',
    component: RepairsComponent
  },
  {
    path     : 'repairs-log/:car/:maintenance/:MaintenanceType',
    component: RepairMaintenanceLogComponent,
    resolve  : {
      data: RepairMaintenanceLogService
             }
  }
];

@NgModule({
  declarations: [ MaintenanceComponent, RepairsComponent, EventFormComponent,
    RepairMaintenanceLogComponent ,DatePickerFormatDirective ],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    FuseSharedModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatCardModule,
    TranslateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule, 
    NgxMatNativeDateModule,
    PipeModule,
    SharedModule,
    MatExpansionModule
  ],
  providers : [
    RepairMaintenanceLogService,
   // MaintenanceService
  ],
  entryComponents: [
    EventFormComponent,
    RepairFormComponent 
]
})
export class MaintenanceModule { }
