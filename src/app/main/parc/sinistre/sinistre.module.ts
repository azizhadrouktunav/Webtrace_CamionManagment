import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentmanagementComponent } from './accidentmanagement/accidentmanagement.component';
import { AccidentfollowComponent } from './accidentfollow/accidentfollow.component';
import { AchievedmaintenanceComponent } from './achievedmaintenance/achievedmaintenance.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';
import { MatDialogModule, MatSnackBarModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatMenuModule, MatChipsModule, MatExpansionModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatListModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CdkTableExporterModule } from 'cdk-table-exporter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridModule } from '@angular/flex-layout';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { DatacService } from '../services/datac.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AddEditsinistreComponent } from '../Dialogs/add-editsinistre/add-editsinistre.component';
import { ProgressComponent } from '../Dialogs/add-editsinistre/progress/progress.component';
import { FollowsinistreComponent } from './followsinistre/followsinistre.component';
import {MatRadioModule} from '@angular/material/radio';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import { SinisterMapComponent } from './sinister-map/sinister-map.component';

const routes: Routes = [
  {
      path     : '',
      component: AccidentmanagementComponent,
      
  },
  {
    path     : 'accident/:trackingObject/:accidentReportRef/:CarMatricule',
    component: AccidentfollowComponent,
    
},
{
  path     : 'maintenance/:trackingObject/:accidentId/:CarMatricule',
  component: AchievedmaintenanceComponent
}
];



@NgModule({
  declarations: [AccidentmanagementComponent, AccidentfollowComponent, 
    AchievedmaintenanceComponent, AddEditsinistreComponent, ProgressComponent,FollowsinistreComponent, SinisterMapComponent
     
  ],
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
    MatSlideToggleModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    FormsModule,
    PipeModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  providers:[DatacService],
  entryComponents:[
    AddEditsinistreComponent,
    FollowsinistreComponent
    
  ]
})
export class SinistreModule { }
