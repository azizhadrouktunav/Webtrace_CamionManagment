import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionDesChauffeursComponent } from './gestion-des-chauffeurs.component';
import { RouterModule, Routes } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DriverFormDialogComponent } from './driver-form-dialog/driver-form-dialog.component';
import { GetionChauffeursService } from './getion-chauffeurs.service';
import { MatCheckboxModule, MatMenuModule } from '@angular/material';
import { ListCarComponent } from './list-car/list-car.component';
import { CommandsDriverComponentComponent } from './commands-driver-component/commands-driver-component.component';

const routes : Routes = [
  {
    path : '',
    component: GestionDesChauffeursComponent,
    resolve : {
      drivers : GetionChauffeursService
    }
   
  }
]

@NgModule({
  declarations: [GestionDesChauffeursComponent,
     DriverFormDialogComponent, DriverFormDialogComponent, ListCarComponent, CommandsDriverComponentComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    FuseSharedModule,
    TranslateModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatCheckboxModule
    
    

  ],
  providers: [
    GetionChauffeursService
  ],

  
  entryComponents: [
    DriverFormDialogComponent,
    ListCarComponent,
    CommandsDriverComponentComponent
    ]
})
export class DriverModule { }
