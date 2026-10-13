import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicreportformComponent } from './graphicreportform/graphicreportform.component';
import { GraphicreportresultComponent } from './graphicreportresult/graphicreportresult.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule, MatRadioModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatGridListModule, MatMenuModule, MatTabsModule, MatPaginatorModule, MatToolbarModule, MatChipsModule, MatNativeDateModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedreportdataService } from '../services/sharedreportdata.service';

const routes: Routes = [
  {
      path     : '',
      component: GraphicreportformComponent,
      
  },
  {
    path     : 'Details',
    component: GraphicreportresultComponent,
    
}
];
@NgModule({
  declarations: [GraphicreportformComponent, GraphicreportresultComponent],
  imports: [
    RouterModule.forChild(routes),
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CommonModule,
    FuseSharedModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatGridListModule,
    ChartsModule,
    NgxChartsModule,
    MatMenuModule,
    MatTabsModule,
    FuseWidgetModule,
    TranslateModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatChipsModule,
    NgxMatDatetimePickerModule,
      MatNativeDateModule,
    MatMomentDateModule ,
    NgxMatNativeDateModule,
    NgxLoadingModule,


    
  ],
  providers: [
    SharedreportdataService
  ],
})

export class GraphicreportModule { }
