import { NgModule } from '@angular/core';
import { BeneficiaryManagementComponent } from './beneficiary-management.component';
import { Routes, RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { BeneficiaryFormComponent } from './beneficiary-form/beneficiary-form.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
const routes : Routes = [
        {
          path : '',
          component : BeneficiaryManagementComponent
        }
]

@NgModule({
  declarations: [BeneficiaryManagementComponent, BeneficiaryFormComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule
  ],
  entryComponents: [
    BeneficiaryFormComponent
]
})
export class BeneficiaryModule { }
