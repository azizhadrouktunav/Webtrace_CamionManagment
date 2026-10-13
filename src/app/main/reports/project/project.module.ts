import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ProjectDashboardComponent } from './project.component';
import { ProjectDashboardService } from './project.service';
import { ChartsModule } from 'ng2-charts';
import { MatPaginatorModule, MatToolbarModule ,MatNativeDateModule, MatDatepickerModule, MatInputModule, MatAutocompleteModule, MatCheckboxModule, MatListModule} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { BottomSheetOverviewParcComponent } from './bottom-sheet-overview-parc/bottom-sheet-overview-parc.component';
import { DatePickerFormatDirective } from 'app/main/parc/maintenance/date-picker-format.directive';
import { CustomNgxDateTimeModule } from '../custom-ngx-date-time-module/custom-ngx-date-time-module.module';
import { DashboardparampopupComponentComponent } from './dashboardparampopup-component/dashboardparampopup-component.component';

const routes: Routes = [
    {
        path     : '**',
        component: ProjectDashboardComponent,
        resolve  : {
            data: ProjectDashboardService
        }
    }
];

@NgModule({
    declarations: [
        ProjectDashboardComponent,
        BottomSheetOverviewParcComponent,
        DashboardparampopupComponentComponent
        
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,

        NgxChartsModule,
        ScrollingModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        ChartsModule,
        MatPaginatorModule, 
        MatToolbarModule,
        NgxMatDatetimePickerModule,
        MatNativeDateModule,
      MatMomentDateModule ,
      NgxMatNativeDateModule,
      TranslateModule,
      MatDatepickerModule,
      MatInputModule,
      MatCheckboxModule,
      FormsModule,
      MatAutocompleteModule,
      MatListModule,
      MatBottomSheetModule,
      
      NgxLoadingModule.forRoot({
        animationType: ngxLoadingAnimationTypes.wanderingCubes
        
    }),
    CustomNgxDateTimeModule
    ],
    providers   : [
        ProjectDashboardService
    ],
    entryComponents: [
        BottomSheetOverviewParcComponent,
        DashboardparampopupComponentComponent
      ]
})
export class ProjectDashboardModule
{
}

