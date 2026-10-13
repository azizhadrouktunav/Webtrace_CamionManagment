import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingComponent } from './tracking.component';
import { DxActionSheetModule, DxButtonModule, DxDataGridModule, DxDropDownButtonModule, DxSwitchModule } from 'devextreme-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxLoadingModule } from 'ngx-loading';
import { TrackingObjectService } from './tracking-objects.service';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ForcedStopComponent } from './forced-stop/forced-stop.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
@NgModule({
  declarations: [TrackingComponent, ForcedStopComponent, MaintenanceListComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxActionSheetModule,
    DxButtonModule,
    DxSwitchModule,
    DxDropDownButtonModule,
    NgxChartsModule,
    NgxLoadingModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatRadioModule,
    MatToolbarModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
    //FuseSharedModule
    MatSnackBarModule,
    MatListModule,
    PipeModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
  ],
  exports: [
    TrackingComponent
  ],
  providers: [
    TrackingObjectService,
  ],
  entryComponents: [
    ForcedStopComponent,
    MaintenanceListComponent
  ]
})
export class TrackingModule { }
