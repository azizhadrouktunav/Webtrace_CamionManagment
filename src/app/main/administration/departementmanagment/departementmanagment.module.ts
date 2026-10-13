import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentmanagmentComponent } from './departmentmanagment/departmentmanagment.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';
import { MatDialogModule, MatSnackBarModule, MatTabsModule, MatTableModule, MatSortModule, MatMenuModule, MatChipsModule, MatExpansionModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatListModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatToolbarModule, MatButtonModule, MatInputModule, MatTreeModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CdkTableExporterModule } from 'cdk-table-exporter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridModule } from '@angular/flex-layout';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import {MatPaginatorModule} from '@angular/material/paginator';

import {CdkTreeModule} from '@angular/cdk/tree';
import { DepartmentpopupComponent } from './departmentpopup/departmentpopup.component';
import { DepartmenttransfertComponent } from './departmenttransfert/departmenttransfert.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

const routes: Routes = [
  {
      path     : '',
      component: DepartmentmanagmentComponent,
      
  }
  
];

@NgModule({
  declarations: [DepartmentmanagmentComponent, DepartmentpopupComponent, DepartmenttransfertComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ResizableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FuseSharedModule,
    FuseWidgetModule,
    MatTableExporterModule,
    CdkTableExporterModule,
    MatMenuModule,
    NgxChartsModule,
    MatChipsModule,
    MatExpansionModule,
    GridModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatStepperModule,
    MatListModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule, 
    NgxMatNativeDateModule,
    FuseSidebarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatTreeModule,
    MatRadioModule,
    MatCheckboxModule ,
    CdkTreeModule,
    ScrollingModule

  ],
  
  entryComponents: [
    DepartmentpopupComponent,
    DepartmenttransfertComponent
  ]
})
export class DepartementmanagmentModule { }
