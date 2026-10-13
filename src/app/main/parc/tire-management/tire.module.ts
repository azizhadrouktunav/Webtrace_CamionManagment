import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TireManagementComponent } from './tire-management.component';
import { TireManagementService } from '../services/tire-management.service';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import { EditAddTireComponent } from '../Dialogs/edit-add-tire/edit-add-tire.component';
import { TireManagementLogComponent } from '../tire-management-log/tire-management-log.component';
import { EditAddTireLogComponent } from '../Dialogs/edit-add-tire-log/edit-add-tire-log.component';
import { DatePipe } from '@angular/common';
import { EditAxleComponent } from '../Dialogs/edit-axle/edit-axle.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TireDiagramComponent } from '../tire-diagram/tire-diagram.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TireLogByCarComponent } from '../tire-log-by-car/tire-log-by-car.component';
const routes : Routes = [
  {
    path : '',
    component : TireManagementComponent
  
  },    
 {
    path: 'tire-management-log/:Id',
    component: TireManagementLogComponent
    
  },
  {
    path: 'app-tire-diagram/:Key',
    component: TireDiagramComponent
  },
  {
    path: 'app-tire-log-by-car/:Key',
    component: TireLogByCarComponent
  }
]
@NgModule({
  declarations: [TireManagementComponent, TireManagementLogComponent,
    EditAddTireComponent, EditAddTireLogComponent,EditAxleComponent,TireDiagramComponent,TireLogByCarComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatTableExporterModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    MatTabsModule,
    MatInputModule,
    MatToolbarModule,
    MatDialogModule,
    FuseSharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSidenavModule,
    DragDropModule

  ],
  providers:[
    TireManagementService,
    DatePipe ,
    MatCheckboxModule,
    MatInputModule
  ],
  entryComponents: [
    EditAddTireComponent,
    EditAddTireLogComponent,
    EditAxleComponent,
    TireDiagramComponent,
    TireLogByCarComponent
  ]
})
export class TireModule { }
