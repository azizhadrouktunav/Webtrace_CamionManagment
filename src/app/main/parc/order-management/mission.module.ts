import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderManagementComponent } from './order-management.component';
import { MissionComponent } from './mission/mission.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import { FuseSharedModule } from '@fuse/shared.module';
import { VerifyStatusDialogComponent } from './verify-status-dialog/verify-status-dialog.component';
import { OrderService } from './service.order';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
const routes: Routes = [
  {
    path: '',
    component: OrderManagementComponent,
  },
  {
    path     : 'missions',
    component: MissionComponent,
    resolve  : {
      data: OrderService
      }
    },
]

@NgModule({
  declarations: [OrderManagementComponent, MissionComponent, VerifyStatusDialogComponent ],
  imports: [
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FuseSharedModule,
    MatDatepickerModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    MatSnackBarModule,
    TranslateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    PipeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule

  ],
  providers: [
    OrderService
  ],
  entryComponents: [
    VerifyStatusDialogComponent
  ]
})
export class MissionModule { }
