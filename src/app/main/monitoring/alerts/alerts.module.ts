import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { FuseSearchBarModule } from '@fuse/components';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CustomNgxDateTimeModule } from 'app/main/reports/custom-ngx-date-time-module/custom-ngx-date-time-module.module';
import { MatProgressSpinnerModule, MatCheckboxModule, MatProgressBarModule} from '@angular/material';
import { AlertparampopupComponent } from './alertparampopup/alertparampopup.component';
@NgModule({
  declarations: [AlertsComponent, AlertparampopupComponent,AlertparampopupComponent],
  imports: [
    CommonModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    FuseSharedModule,
    MatIconModule,
    MatSortModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule.forChild(),
    MatExpansionModule,
    FuseSearchBarModule,
    MatAutocompleteModule,
    CustomNgxDateTimeModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  exports : [
    AlertsComponent
  ],
  providers: [
    AlertsService
  ],
  entryComponents:[
    AlertparampopupComponent
  ]
})
export class AlertsModule { }
