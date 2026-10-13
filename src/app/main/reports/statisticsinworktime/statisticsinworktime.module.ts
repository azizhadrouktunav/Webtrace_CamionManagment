import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsinworktimeformComponent } from './statisticsinworktimeform/statisticsinworktimeform.component';
import { StatisticsinworktimeresultComponent } from './statisticsinworktimeresult/statisticsinworktimeresult.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatInputModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatGridListModule, MatMenuModule, MatTabsModule, MatPaginatorModule, MatToolbarModule, MatChipsModule, MatNativeDateModule, MatSnackBarModule, MatCheckboxModule, MatAutocompleteModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterModule, Routes } from '@angular/router';
import { FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { ChartsModule } from 'ng2-charts';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { SharedreportdataService } from '../services/sharedreportdata.service';
import { FormsModule } from '@angular/forms';
import { CustomNgxDateTimeModule } from '../custom-ngx-date-time-module/custom-ngx-date-time-module.module';


const routes: Routes = [
  {
      path     : '',
      component: StatisticsinworktimeformComponent,
      
  },
  {
    path     : 'Details',
    component: StatisticsinworktimeresultComponent,
    
}
];
@NgModule({
  declarations: [StatisticsinworktimeformComponent, StatisticsinworktimeresultComponent],
  
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
      NgxMatTimepickerModule,
      MatSnackBarModule,
      MatCheckboxModule,
      FormsModule,
      MatAutocompleteModule,

      NgxLoadingModule.forRoot({
        animationType: ngxLoadingAnimationTypes.wanderingCubes
        
    }),

    ],
    providers: [
      SharedreportdataService
    ],
  
})
export class StatisticsinworktimeModule { }
