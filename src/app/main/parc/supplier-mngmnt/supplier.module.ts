import { NgModule } from '@angular/core';
import { SupplierMngmntComponent } from './supplier-mngmnt.component';
import { RouterModule, Routes } from '@angular/router';
import { SupplierService } from './supplier.service';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
const routes: Routes = [
  {
    path     : '',
    component: SupplierMngmntComponent,
    resolve : {
      data : SupplierService
    }
    
},
]

@NgModule({
  declarations: [SupplierMngmntComponent, SupplierFormComponent],
  imports: [

    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FuseSharedModule,
    TranslateModule,
    PipeModule
  ],
  providers : [
    SupplierService
  ],
  entryComponents: [
    SupplierFormComponent
]
})
export class SupplierModule { }
