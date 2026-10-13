  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterModule, Routes } from '@angular/router';
  import { MatInputModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatCardModule, MatGridListModule, MatMenuModule, MatTabsModule, MatPaginatorModule, MatToolbarModule, MatChipsModule, MatNativeDateModule, MatSnackBarModule, MatAutocompleteModule, MatCheckboxModule,MatProgressBarModule } from '@angular/material';
  import { FuseSharedModule } from '@fuse/shared.module';
  import { NgxChartsModule } from '@swimlane/ngx-charts';
  import { FlipModule } from 'ngx-flip';
  import { SharedreportdataService } from '../services/sharedreportdata.service';
  import { ChartsModule } from 'ng2-charts';
  import { FuseWidgetModule } from '@fuse/components';
  import { TranslateModule } from '@ngx-translate/core';
import { StatisticreportformComponent } from './statisticreportform/statisticreportform.component';
import { StatisticreportresultComponent } from './statisticreportresult/statisticreportresult.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { FormsModule } from '@angular/forms';
import { CustomNgxDateTimeModule } from '../custom-ngx-date-time-module/custom-ngx-date-time-module.module';
import { ConfigAutoMailComponent } from './config-auto-mail/config-auto-mail.component';
  
  
  const routes: Routes = [
    {
        path     : '',
        component: StatisticreportformComponent,
        
    },
    {
      path     : 'Details',
      component: StatisticreportresultComponent,
      
  },
  {
    path     : 'ConfigMail',
    component: ConfigAutoMailComponent,
    
}
  ];
  @NgModule({
    declarations: [StatisticreportformComponent, StatisticreportresultComponent, ConfigAutoMailComponent],
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
      NgxLoadingModule.forRoot({
        animationType: ngxLoadingAnimationTypes.wanderingCubes
        
    }),
    CustomNgxDateTimeModule
    ],
    providers: [
      SharedreportdataService
    ],
  })
export class StatisticreportModule { }
