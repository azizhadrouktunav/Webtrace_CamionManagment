import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GeneralreportformComponent } from './generalreportform/generalreportform.component';
import { GeneralreportresultComponent } from './generalreportresult/generalreportresult.component';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatCardModule, MatGridListModule, MatMenuModule, MatTabsModule, MatPaginatorModule, MatToolbarModule, MatChipsModule, MatNativeDateModule, MatSnackBarModule, MatCheckboxModule, MatAutocompleteModule, MatProgressBarModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FlipModule } from 'ngx-flip';
import { SharedreportdataService } from '../services/sharedreportdata.service';
import { ChartsModule } from 'ng2-charts';
import { FuseWidgetModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { FormsModule } from '@angular/forms';
import { CustomNgxDateTimeModule } from '../custom-ngx-date-time-module/custom-ngx-date-time-module.module';
const routes: Routes = [
  {
      path     : '',
      component: GeneralreportformComponent,
      
  },
  {
    path     : 'Details/:car',
    component: GeneralreportresultComponent,
    
}
];
@NgModule({
  declarations: [GeneralreportformComponent, GeneralreportresultComponent],
  imports: [
    RouterModule.forChild(routes),
    MatProgressBarModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CommonModule,
    MatSnackBarModule,
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
    SelectAutocompleteModule,

    FormsModule,
    MatAutocompleteModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes
      
  }),
  CustomNgxDateTimeModule
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [
    SharedreportdataService,
    DatePipe,
  ],
})
export class GeneralreportModule { }
