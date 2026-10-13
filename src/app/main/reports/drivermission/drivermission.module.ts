
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatGridListModule, MatMenuModule, MatTabsModule, MatPaginatorModule, MatToolbarModule, MatChipsModule, MatNativeDateModule, MatSnackBarModule, MatAutocompleteModule, MatCheckboxModule, MatProgressBarModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedreportdataService } from '../services/sharedreportdata.service';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { DrivermissionformComponent } from './drivermissionform/drivermissionform.component';
import { DrivermissionresultComponent } from './drivermissionresult/drivermissionresult.component';
import { FormsModule } from '@angular/forms';
import { CustomNgxDateTimeModule } from '../custom-ngx-date-time-module/custom-ngx-date-time-module.module';

const routes: Routes = [
  {
      path     : '',
      component: DrivermissionformComponent,
      
  },
  {
    path     : 'Details',
    component: DrivermissionresultComponent,
    
}
];
@NgModule({
  declarations: [DrivermissionformComponent, DrivermissionresultComponent],
  imports: [
    RouterModule.forChild(routes),
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CommonModule,
    FuseSharedModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatGridListModule,
    ChartsModule,
    NgxChartsModule,
    MatMenuModule,
    MatTabsModule,
    FuseWidgetModule,
    TranslateModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatChipsModule,
    NgxMatDatetimePickerModule,
      MatNativeDateModule,
    MatMomentDateModule ,
    NgxMatNativeDateModule,
    NgxLoadingModule,
    PipeModule,
    MatSnackBarModule,
    MatCheckboxModule,
    FormsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    CustomNgxDateTimeModule
    
  ],
  providers: [
    SharedreportdataService
  ],
})


export class DrivermissionModule { }

