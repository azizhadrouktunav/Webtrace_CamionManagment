import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowedcarmanagementComponent } from './borrowedcarmanagement/borrowedcarmanagement.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';
import { MatDialogModule, MatSnackBarModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatMenuModule, MatChipsModule, MatExpansionModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatListModule, MatAutocompleteModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CdkTableExporterModule } from 'cdk-table-exporter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ContractlogComponent } from './contractlog/contractlog.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { BorrowedpopupComponent } from '../Dialogs/borrowedpopup/borrowedpopup.component';
import { DatacService } from '../services/datac.service';
import { PaymentlogComponent } from '../Dialogs/paymentlog/paymentlog.component';
import { RenewContactComponent } from '../Dialogs/renew-contact/renew-contact.component';
import { ErrordialogComponent } from '../Dialogs/errordialog/errordialog.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SharedModule } from 'app/main/shared-module/shared.module';

const routes: Routes = [
  {
      path     : '',
      component: BorrowedcarmanagementComponent,
      
  },
  {
    path     : 'invoice/:trackingObject/:ContractId/:ContractTypeString/:CarMatricule',
    component: ContractlogComponent,
    
},
{
  path     :   'planning/:trackingObject/:CarMatricule',
  component: CalendarComponent,
  
}
];

@NgModule({
  declarations: [BorrowedcarmanagementComponent, ContractlogComponent, CalendarComponent, 
    BorrowedpopupComponent, 
    ErrordialogComponent ],
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
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatStepperModule,
    MatListModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule, 
    NgxMatNativeDateModule,
    FuseSidebarModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    PipeModule,
    MatInputModule,
    MatAutocompleteModule,
    AngularCalendarModule.forRoot({
      provide   : DateAdapter,
      useFactory: adapterFactory
  }),
  SharedModule
  ],
  providers: [
    DatacService
  ],
  entryComponents: [
    BorrowedpopupComponent,
    PaymentlogComponent,
    RenewContactComponent,
    ErrordialogComponent
  ]
})
export class BorrowedcarModule { }
