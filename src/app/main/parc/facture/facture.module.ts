import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactureComponent } from './facture.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { AddFactureComponent } from './add-facture/add-facture.component';
import { FactureService } from './facture.service';
import { DxDataGridModule , DxActionSheetModule, DxButtonModule, DxSwitchModule, DxDropDownButtonModule} from 'devextreme-angular';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';


const routes : Routes = [
  {
    path : '',
    component: FactureComponent,
    resolve  : {
      data: FactureService
    }
  }
]


@NgModule({
  declarations: [FactureComponent, AddFactureComponent ],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatRadioModule,
    MatPaginatorModule,
    NgxMatNativeDateModule,
    TranslateModule,
    DxDataGridModule,
    DxActionSheetModule,
    DxButtonModule,
    DxSwitchModule,
    DxDropDownButtonModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  entryComponents:[
    AddFactureComponent, 
  ],
  providers:[
    FactureService
  ]
})
export class FactureModule { }
