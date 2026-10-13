import { NgModule } from '@angular/core';
import {  MatIconModule, MatMenuModule, MatPaginator, MatPaginatorModule, MatTableModule, MatToolbar, MatToolbarModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseWidgetModule } from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { QuickPanelComponent } from 'app/layout/components/quick-panel/quick-panel.component';
import { TrackingObjectService } from 'app/main/monitoring/tracking/tracking-objects.service';

@NgModule({
    declarations: [
        QuickPanelComponent
    ],
    imports     : [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,

        FuseSharedModule,
        MatTableModule,
        TranslateModule,
        MatIconModule,
        MatPaginatorModule,
        MatToolbarModule,
        FuseWidgetModule,
        MatMenuModule,

    ],
    providers: [
        
        TrackingObjectService
      ],
    exports: [
        QuickPanelComponent
    ]
})
export class QuickPanelModule
{
}
