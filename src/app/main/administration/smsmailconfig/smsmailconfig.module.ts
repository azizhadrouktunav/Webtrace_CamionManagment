import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SmsmailconfigComponent } from './smsmailconfig/smsmailconfig.component';
import { MailComponent } from './mail/mail.component';
import { SmsComponent } from './sms/sms.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [
  {
      path     : '',
      component: SmsmailconfigComponent,
  },
  
     { 
       
      path     : 'config/:id/:CustomerId',
      component: ConfigurationComponent,
      
  }
  
];

@NgModule({
  declarations: [SmsmailconfigComponent, MailComponent, SmsComponent, ConfigurationComponent],
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
    MatAutocompleteModule

  ],
   
  entryComponents: [
    MailComponent,
    SmsComponent]
 
  
})
export class SmsmailconfigModule { }
