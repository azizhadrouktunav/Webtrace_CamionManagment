import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunStopStateComponent } from './run-stop-state.component';
import { RunStopStateService } from './run-stop-state.service';
import {MatGridListModule} from '@angular/material/grid-list';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {CdkTableModule} from '@angular/cdk/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseSearchBarModule } from '@fuse/components/search-bar/search-bar.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomNgxDateTimeModule } from 'app/main/reports/custom-ngx-date-time-module/custom-ngx-date-time-module.module';
import { MatProgressSpinnerModule,MatProgressBarModule } from '@angular/material';
import { RunstopparampopupComponent } from './runstopparampopup/runstopparampopup.component';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
@NgModule({
  declarations: [
    RunStopStateComponent,
    RunstopparampopupComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    FuseSharedModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    CdkTableModule,
    MatSlideToggleModule,
   // SharedDataModule
   TranslateModule.forChild(),
   MatExpansionModule,
   FuseSearchBarModule,
   MatToolbarModule,
   MatTooltipModule,
   MatAutocompleteModule,
   MatCheckboxModule,
   CustomNgxDateTimeModule,
   MatProgressSpinnerModule,
   NgxLoadingModule,
   MatProgressBarModule,
   NgxLoadingModule.forRoot({
    animationType: ngxLoadingAnimationTypes.wanderingCubes
    
}),
   
  ],
  exports: [
    RunStopStateComponent
  ],
  providers      : [
    RunStopStateService
],
entryComponents:[
  RunstopparampopupComponent
]
})
export class RunStopStateModule { }
