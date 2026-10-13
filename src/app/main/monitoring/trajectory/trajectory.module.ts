import { NgModule } from '@angular/core';
import { BottomSheetOverviewExampleSheet, TrajectoryComponent } from './trajectory.component';
import { TrajectoryService } from './trajectory.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { FuseDemoModule, FuseSearchBarModule } from '@fuse/components';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { WayDialogComponent } from '../places-geometric-shapes-management/ways/way-form/add-way-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from '@ngx-translate/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TrajectoryparampopupComponent } from './trajectoryparampopup/trajectoryparampopup.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DetailComponent } from './detail/detail.component';
@NgModule({
  declarations: [
    TrajectoryComponent,
    BottomSheetOverviewExampleSheet,
    WayDialogComponent,
    TrajectoryparampopupComponent,
    DetailComponent
   ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DxDataGridModule,
    FuseDemoModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatMenuModule,
    MatCheckboxModule,
    //NgxPrintModule,
    MatTooltipModule,
    DragDropModule,
   // NgxDaterangepickerMd.forRoot(),
    FlexLayoutModule,
    TranslateModule,
    FuseSearchBarModule,
    MatAutocompleteModule,
    MatTabsModule

  ],
  exports:[
    TrajectoryComponent,
    BottomSheetOverviewExampleSheet,
    WayDialogComponent
  ],
  providers: [
    TrajectoryService
  ],
  entryComponents: [
    BottomSheetOverviewExampleSheet,
    WayDialogComponent,
    TrajectoryparampopupComponent
  ]
})
export class TrajectoryModule { }
