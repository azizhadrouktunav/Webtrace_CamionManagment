import { NgModule } from '@angular/core';
import { MatMenuModule, MatToolbarModule, MatBadgeModule, MatListModule, MatCheckboxModule, MatTreeModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { FuseNavigationModule, FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { NavbarHorizontalStyle1Component } from 'app/layout/components/navbar/horizontal/style-1/style-1.component';
import { SharedreportdataService } from 'app/main/reports/services/sharedreportdata.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { CLOUDINARY_CONFIG, NgxPictureModule } from 'ngx-picture';

@NgModule({
    declarations: [
        NavbarHorizontalStyle1Component
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule,
        NgxPictureModule.forRoot(CLOUDINARY_CONFIG),
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

    ],
    exports     : [
        NavbarHorizontalStyle1Component
    ],
    providers : [
        
    ]
})
export class NavbarHorizontalStyle1Module
{
}
