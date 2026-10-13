import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringComponent } from './monitoring.component';
import { RouterModule, Routes } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatTabsModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, MatDialogRef, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeafletMarkerClusterModule  } from '@asymmetrik/ngx-leaflet-markercluster';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { GeofenceModule } from './geofence/geofence.module';
import { PlacesGeometricShapesManagementModule } from './places-geometric-shapes-management/places-geometric-shapes-management.module';
import { FuseDemoModule, FuseSidebarModule } from '@fuse/components';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TrajectoryModule } from './trajectory/trajectory.module';
import { CommandModule } from './commands/command.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { TrackingModule } from './tracking/tracking.module';
import { RunStopStateModule } from './run-stop-state/run-stop-state.module';
import { AngularSplitModule } from 'angular-split';
import { TrackingObjectService } from './tracking/tracking-objects.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PlacesService } from './places-geometric-shapes-management/places/places.service';
import {MatListModule} from '@angular/material/list';
//import { LeafletMapModule } from './leaflet/leafletmap.module';
import { NgxPrintModule } from 'ngx-print';
import { AlertsModule } from './alerts/alerts.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SnackbarMessageComponent } from '../helpers/snackbar-message/snackbar-message.component';
import { SessionGuard } from '../authenticate/session.guard';
const routes : Routes = [
  {
    path : '',
    component : MonitoringComponent,
    resolve: {
      trackingObj: TrackingObjectService
    }
    // outlet : 'Monitor',
  }
]

@NgModule({
  declarations: [
    MonitoringComponent,
  //  SnackbarMessageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FontAwesomeModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    LeafletModule,
    CommonModule,
    FlexLayoutModule,
    TranslateModule,
    MatTooltipModule,
    LeafletMarkerClusterModule,
    LeafletDrawModule,
    GeofenceModule,
    PlacesGeometricShapesManagementModule,
    FuseSidebarModule,
    TrajectoryModule,
    CommandModule,
    FuseSharedModule,
    TrackingModule,
    MatMenuModule,
    RunStopStateModule,
    AngularSplitModule,
    FuseDemoModule,
    MatSidenavModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatListModule,
    NgxPrintModule,
    AlertsModule,
    MatCheckboxModule
   // LeafletMapModule
  ],
providers: [
    TrackingObjectService,
    PlacesService
  ],
  entryComponents: [
    SnackbarMessageComponent
  ]
})
export class MonitoringModule { }

