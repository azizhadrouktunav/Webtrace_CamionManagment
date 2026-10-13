import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeofenceFormComponent } from './geofence-form/geofence-form.component';
import { GeofenceService } from './geofence.service';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { ShowComponent } from './show/show.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [GeofenceFormComponent, ShowComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    FuseSharedModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule,
    MatTabsModule,
    MatCheckboxModule,
    MatListModule,
    TranslateModule
  ],
  exports: [
    ShowComponent
  ],
  providers: [
    GeofenceService
  ],
  entryComponents:[
    GeofenceFormComponent
  ]
})
export class GeofenceModule {}
