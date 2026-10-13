import { NgxMatDatetimePickerModule } from "@angular-material-components/datetime-picker";
import { NgModule } from "@angular/core";
import { MatIconModule, MatMenuModule, MatToolbarModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatSnackBarModule, MatSelectModule, MatBadgeModule, MatListModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatTooltipModule } from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { Routes, RouterModule } from "@angular/router";
import { FuseWidgetModule, FuseHighlightModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NgxLoadingModule } from "ngx-loading";
import { NgxPictureModule } from "ngx-picture";
import { ChildGuard } from "../authenticate/child.guard";
import { PipeModule } from "../helpers/pipe/pipe.module";
import { CustomNgxDateTimeModule } from "../reports/custom-ngx-date-time-module/custom-ngx-date-time-module.module";
import { PompemanagementComponent } from "./pompemanagement/pompemanagement.component";
import { PompetrackingComponent } from "./pompetracking/pompetracking.component";
import { PompistemanagmentComponent } from './pompistemanagment/pompistemanagment.component';
import { PompedialogComponent } from './pompedialog/pompedialog.component';
import { PompeMonitorService } from "./pompe-monitor.service";
import { PompistedialogComponent } from './pompistedialog/pompistedialog.component';
import { PompereportformComponent } from './pompereportform/pompereportform.component';
import { PompereportresultComponent } from './pompereportresult/pompereportresult.component';
import { SharedreportdataService } from "../reports/services/sharedreportdata.service";





const routes: Routes = [
    {
        path: 'monitorpompe',
        component: PompetrackingComponent,
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '70' }
    },
    {
        path: 'pompes', 
        component: PompemanagementComponent ,
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '71' }

    },
    {
        path: 'pompistes', 
        component: PompistemanagmentComponent ,
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '71' }

    },
    
    {
        path: 'report',
        component: PompereportformComponent,
    },
    {
        path: 'report/result',
        component: PompereportresultComponent,
    },
    {
        path: '**',
        redirectTo: 'monitorpompe'
    }
]
@NgModule({
  declarations: [PompetrackingComponent, PompemanagementComponent, PompistemanagmentComponent, PompedialogComponent, PompistedialogComponent, PompereportformComponent, PompereportresultComponent],
    imports: [
        RouterModule.forChild(routes),
        
        FuseSharedModule,
        FuseWidgetModule,
        MatIconModule,
        MatMenuModule,
        PipeModule,
        MatToolbarModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,

        MatBadgeModule,
        MatListModule,
        TranslateModule,
        FuseHighlightModule,
        NgxLoadingModule,
        NgxMatDatetimePickerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatAutocompleteModule,
        CustomNgxDateTimeModule,
        MatTooltipModule,
        NgxPictureModule
    ],
    entryComponents :
    [
        PompedialogComponent,
        PompistedialogComponent
        
    ],
    providers:
    [
        PompeMonitorService,
        SharedreportdataService
    ]
    
})
export class PompeMonitorModule { }
