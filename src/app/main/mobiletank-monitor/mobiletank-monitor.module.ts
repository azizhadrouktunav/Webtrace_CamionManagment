
import { NgxMatDatetimePickerModule } from "@angular-material-components/datetime-picker";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule, MatMenuModule, MatToolbarModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatSnackBarModule, MatSelectModule, MatBadgeModule, MatListModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatTooltipModule, MatFormFieldModule, MatGridListModule } from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { Routes, RouterModule } from "@angular/router";
import { FuseWidgetModule, FuseHighlightModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { LinearGaugeAllModule } from "@syncfusion/ej2-angular-lineargauge";
import { NgApexchartsModule } from "ng-apexcharts";
import { ClickOutsideModule } from "ng-click-outside";
import { ChartsModule } from "ng2-charts";
import { NgxGaugeModule } from "ngx-gauge";
import { NgxLoadingModule } from "ngx-loading";
import { CLOUDINARY_CONFIG, NgxPictureModule } from "ngx-picture";
import { ChildGuard } from "../authenticate/child.guard";
import { PipeModule } from "../helpers/pipe/pipe.module";
import { CustomNgxDateTimeModule } from "../reports/custom-ngx-date-time-module/custom-ngx-date-time-module.module";
import { MobiletankService } from "./mobiletank.service";
import { MobiletankrealtimeComponent } from "./mobiletankrealtime/mobiletankrealtime.component";
import { MobiletanksComponent } from "./mobiletanks/mobiletanks.component";
import { NgxLiquidGaugeModule } from '../../../../ngx-liquid-gauge-master/projects/ngx-liquid-gauge/src/lib/ngx-liquid-gauge.module';
import { MobiletankformdialogComponent } from './mobiletankformdialog/mobiletankformdialog.component';
import { MobiletankreportComponent } from './mobiletankreport/mobiletankreport.component';
import { SharedreportdataService } from "../reports/services/sharedreportdata.service";
import { MobiletankreportresultComponent } from "./mobiletankreportresult/mobiletankreportresult.component";
import { TankreportserviceService } from "../tank-monitor/tankreportresult/tankreportservice.service";
import { DxChartModule } from 'devextreme-angular';




const routes: Routes = [
    {
        path: 'monitor',
        component: MobiletankrealtimeComponent,
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '70' }
    },
    {
        path: 'tanks', 
        component: MobiletanksComponent ,
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '71' }

    },
    
    {
        path: 'report', 
        component: MobiletankreportComponent ,
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '71' }

    },
    
    
    {
        path: 'report/result', 
        component: MobiletankreportresultComponent ,
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '71' }

    }
    
]
@NgModule({
  declarations: [MobiletankrealtimeComponent, MobiletanksComponent, MobiletankformdialogComponent, MobiletankreportComponent, MobiletankreportresultComponent],
    imports: [
        RouterModule.forChild(routes),
        
        CommonModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseWidgetModule,
        NgxGaugeModule,
        MatIconModule,
        MatMenuModule,
        PipeModule,
        MatToolbarModule,
        MatDialogModule,
        ChartsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,

        // NgxD3LiquidFillGaugeModule,
        NgApexchartsModule,
        MatBadgeModule,
        MatListModule,
        ClickOutsideModule,
        TranslateModule,
        FuseHighlightModule,
        NgxLoadingModule,
        NgxLiquidGaugeModule,
        MatGridListModule,
        LinearGaugeAllModule,
        NgxMatDatetimePickerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatAutocompleteModule,
        CustomNgxDateTimeModule,
        MatTooltipModule,
        NgxPictureModule.forRoot(CLOUDINARY_CONFIG),
        DxChartModule,

    ],

    providers: [
        MobiletankService,
        SharedreportdataService,
    ],
    entryComponents:[
        MobiletankformdialogComponent
    ]
})
export class MobiletankMonitorModule { }
