import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyreportformComponent } from './monthlyreportform/monthlyreportform.component';
import { MonthlyreportresultComponent } from './monthlyreportresult/monthlyreportresult.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatGridListModule, MatMenuModule, MatTabsModule, MatPaginatorModule, MatToolbarModule, MatChipsModule, MatNativeDateModule, MatSnackBarModule, MatAutocompleteModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SharedreportdataService } from '../services/sharedreportdata.service';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { FormsModule } from '@angular/forms';



const routes: Routes = [
  {
      path     : '',
      component: MonthlyreportformComponent,
      
  },
  {
    path     : 'Details',
    component: MonthlyreportresultComponent,
    
}
];
@NgModule({
  declarations: [MonthlyreportformComponent, MonthlyreportresultComponent],
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
    FormsModule,
    MatAutocompleteModule,
    
	NgxLoadingModule.forRoot({
    animationType: ngxLoadingAnimationTypes.wanderingCubes
    
})
  ],
  providers: [
    SharedreportdataService
  ],
})
export class MonthlyreportModule { }
