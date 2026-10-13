import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { Routes, RouterModule } from '@angular/router';
import { DepensesGeneralComponent } from './depenses-general.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { FlipModule } from 'ngx-flip';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { TranslateModule} from '@ngx-translate/core';
import { MatAutocompleteModule, MatCheckboxModule } from '@angular/material';
const routes: Routes = [
  {
    path : '',
    component: DepensesGeneralComponent
  }
];

@NgModule({
  declarations: [DepensesGeneralComponent],
  imports: [
    RouterModule.forChild(routes),
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CommonModule,
    FuseSharedModule,
    NgxChartsModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    FlipModule,
    TranslateModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ]
})
export class DepenseModule { }
