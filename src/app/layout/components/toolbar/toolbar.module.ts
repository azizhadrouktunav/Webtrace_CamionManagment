import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';

import { NgxPictureModule, CLOUDINARY_CONFIG } from 'ngx-picture';
//import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  } from '@angular/material-moment-adapter';
  import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatBadgeModule, MatCheckboxModule, MatListModule, MatTreeModule } from '@angular/material';
import { ClickOutsideModule } from 'ng-click-outside';
import { TankMonitorService } from 'app/main/tank-monitor/tank-monitor.service';
import { TrackingObjectService } from 'app/main/monitoring/tracking/tracking-objects.service';
import { AlertconfigurationComponent } from './alertconfiguration/alertconfiguration.component';
import { AlertconfigurationShowedInNotificationService } from './alertconfiguration/alertconfiguration-showed-in-notification.service';

@NgModule({
    declarations: [
        ToolbarComponent,
        AlertconfigurationComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        ClickOutsideModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        TranslateModule,
        MatBadgeModule,
        MatListModule,
        MatCheckboxModule,
        MatTreeModule,
        NgxPictureModule.forRoot(CLOUDINARY_CONFIG),
        //MultiTranslateHttpLoader
    ],
    providers: [
        // The locale would typically be provided on the root module of your application. We do it at
        // the component level here, due to limitations of our example generation script.
       {provide: MAT_DATE_LOCALE, useValue: 'Fr'},
   
        // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
        // `MatMomentDateModule` in your applications root module. We provide it at the component level
        // here, due to limitations of our example generation script.
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
        TankMonitorService,
        TrackingObjectService,
        AlertconfigurationShowedInNotificationService
      ],
    exports     : [
        ToolbarComponent
    ],
    entryComponents: [
      AlertconfigurationComponent
      
    ]
})
export class ToolbarModule
{
}
