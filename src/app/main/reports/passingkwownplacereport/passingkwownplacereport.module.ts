import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassingknownplaceformComponent } from './passingknownplaceform/passingknownplaceform.component';
import { PassingknownplaceresultComponent } from './passingknownplaceresult/passingknownplaceresult.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatGridListModule, MatMenuModule, MatTabsModule, MatPaginatorModule, MatToolbarModule, MatChipsModule, MatNativeDateModule, MatSnackBarModule, MatAutocompleteModule, MatCheckboxModule } from '@angular/material';
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
import { CustomNgxDateTimeModule } from '../custom-ngx-date-time-module/custom-ngx-date-time-module.module';


const routes: Routes = [
  {
      path     : '',
      component: PassingknownplaceformComponent,
      
  },
  {
    path     : 'Details',
    component: PassingknownplaceresultComponent,
    
}
];

@NgModule({
  declarations: [PassingknownplaceformComponent, PassingknownplaceresultComponent],

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
      NgxLoadingModule.forRoot({
        animationType: ngxLoadingAnimationTypes.wanderingCubes
        
    }),
    CustomNgxDateTimeModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [
    SharedreportdataService
  ],
})
export class PassingkwownplacereportModule { }
