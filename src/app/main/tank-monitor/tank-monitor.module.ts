import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TankMonitorService } from './tank-monitor.service';
import { TankMonitorComponent } from './tank-monitor.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { NgxGaugeModule } from 'ngx-gauge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PipeModule } from '../helpers/pipe/pipe.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { ChartsModule } from 'ng2-charts';
import { TanksComponent } from './tanks/tanks.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TankFormDialogComponent } from './tank-form-dialog/tank-form-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TanksService } from './tanks/tanks.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { NgxD3LiquidFillGaugeModule } from 'ngx-d3-liquid-fill-gauge';
import { NgApexchartsModule } from "ng-apexcharts";
//import { NgxLiquidGaugeModule } from 'ngx-liquid-gauge';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { ClickOutsideModule } from 'ng-click-outside';
import { ChildGuard } from '../authenticate/child.guard';
import { SnackbarMessageComponent } from '../helpers/snackbar-message/snackbar-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseHighlightModule } from '@fuse/components/highlight/highlight.module';
import { HistoryComponent } from './history/history.component';
import { HistoryService } from './history/history.service';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxLiquidGaugeModule } from '../../../../ngx-liquid-gauge-master/projects/ngx-liquid-gauge/src/lib/ngx-liquid-gauge.module';
import { MatAutocompleteModule, MatDatepickerModule, MatGridListModule, MatNativeDateModule, MatTooltipModule } from '@angular/material';
import { LinearGaugeAllModule } from '@syncfusion/ej2-angular-lineargauge';
import { TankfuelreportComponent } from './tankfuelreport/tankfuelreport.component';
import { NgxMatDatetimePicker, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SharedreportdataService } from '../reports/services/sharedreportdata.service';
import { CustomNgxDateTimeModule } from '../reports/custom-ngx-date-time-module/custom-ngx-date-time-module.module';
import { TankreportresultComponent } from './tankreportresult/tankreportresult.component';
import { TankreportserviceService } from './tankreportresult/tankreportservice.service';
//import { NgxD3LiquidFillGaugeModule } from 'ngx-d3-liquid-fill-gauge';
const routes: Routes = [
    {
        path: 'monitor',
        component: TankMonitorComponent,
        //resolve: { connection: TankMonitorService },
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '67' }
    },
    {
        path: 'monitor/:id/:serialNumber',
        component: HistoryComponent,
        resolve: {
            data: HistoryService
        }
    },
    {
        path: 'tanks', component: TanksComponent,
        resolve: { data: TanksService },
        canActivateChild: [ChildGuard],
        data: { preload: true, delay: true, role: '69' }

    },
    {
        path: 'report',
        resolve: { data: TanksService },
        component: TankfuelreportComponent,
    },
    {
        path: 'report/result',
        component: TankreportresultComponent,
    },
    {
        path: '**',
        redirectTo: 'monitor'
    }
]
@NgModule({
    declarations: [TankMonitorComponent, TanksComponent, TankFormDialogComponent, HistoryComponent, TankfuelreportComponent, TankreportresultComponent],
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
        MatTooltipModule
        //NgxD3LiquidFillGaugeModule
    ],
    exports: [
        TankMonitorComponent
    ],
    providers: [
        TankMonitorService,
        TanksService,
        HistoryService,
        SharedreportdataService,
        TankreportserviceService
    ],
    entryComponents: [
        TankFormDialogComponent,
        SnackbarMessageComponent
    ]
})
export class TankMonitorModule { }
