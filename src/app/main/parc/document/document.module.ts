import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document/document.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CdkTableExporterModule } from 'cdk-table-exporter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridModule } from '@angular/flex-layout';
//import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { DocumenthistoryComponent } from './documenthistory/documenthistory.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LogDialogComponent } from './log-dialog/log-dialog.component';
import { DocumentmanagmentService } from './documentmanagment.service';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { AddeditdocumentComponent } from './addeditdocument/addeditdocument.component';
import { DocumentLogService } from './documenthistory/document-log.service';
import { SharedModule } from 'app/main/shared-module/shared.module';
import { MatAutocompleteModule } from '@angular/material';

const routes: Routes = [
  {
      path     : '',
      component: DocumentComponent,
      resolve : {trackingObjects: DocumentmanagmentService}
  },
  {
    path     : 'document-log/:car/:documentId/:documentType/:matricule',
    component: DocumenthistoryComponent,
    resolve: {logs : DocumentLogService }
  }

];

@NgModule({
  declarations: [DocumentComponent, DocumenthistoryComponent, 
    AddeditdocumentComponent],
  imports: [
    RouterModule.forChild(routes),
    MatAutocompleteModule,
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
    PipeModule,
    SharedModule,
    

  ],
  providers: [
    //DocumentmanagmentService,
    DocumentLogService
  ],
  entryComponents: [
    LogDialogComponent,
    AddeditdocumentComponent
  ]
})
export class DocumentModule { }
