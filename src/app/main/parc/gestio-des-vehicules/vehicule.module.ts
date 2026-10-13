import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestioDesVehiculesComponent } from './gestio-des-vehicules.component';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import { AlertDialogComponent } from '../Dialogs/Alert_Dialogs/alert-dialog/alert-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GestionDesVehiculesService } from './gestion-des-vehicules.service';
import { CarLogComponent } from './car-log/car-log.component';
import { OperationService } from './car-log/operation.service';
import { OperationFormDialogComponent } from './car-log/operation-form-dialog/operation-form-dialog.component';
import { VehicleFormDialogComponent } from './vehicle-form-dialog/vehicle-form-dialog.component';
import { CommandsListComponent } from './commands-list/commands-list.component';
import { ProgressComponent } from './vehicle-form-dialog/progress/progress.component';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { MatExpansionModule,MatAutocompleteModule } from '@angular/material';

const routes : Routes = [
  {
    path : '',
    component : GestioDesVehiculesComponent,
    resolve : {
      vehicles: GestionDesVehiculesService
    }
  },
  {
    path:'car_log/:name/:id',
    component: CarLogComponent,
    resolve : {
      operations : OperationService
    }
  }
]

@NgModule({
  declarations: [GestioDesVehiculesComponent, CarLogComponent, AlertDialogComponent,
     OperationFormDialogComponent, VehicleFormDialogComponent, CommandsListComponent,
     ProgressComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatIconModule,
    MatToolbarModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    TranslateModule,
    MatSnackBarModule,
    PipeModule,
    MatExpansionModule,
    MatAutocompleteModule,
  ],
  providers: [
    GestionDesVehiculesService,
    OperationService
  ],
  entryComponents: [
    AlertDialogComponent,
    VehicleFormDialogComponent,
    OperationFormDialogComponent]
})
export class VehiculeModule { }
