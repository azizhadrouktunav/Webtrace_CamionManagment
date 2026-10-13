import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesGeometricShapesManagementService } from './places-geometric-shapes-management.service';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WaysComponent } from './ways/ways.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { PlacesComponent } from './places/places.component';
import { MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PlaceFormComponent } from './places/place-form/place-form.component';
import {MatSelectModule} from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PolygonsComponent } from './polygons/polygons.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
     WaysComponent, PlacesComponent, PlaceFormComponent, PolygonsComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    TranslateModule
  ],
  exports: [
    WaysComponent,
    PolygonsComponent,
    PlacesComponent
  ],
  providers :[
    PlacesGeometricShapesManagementService
  ],
  entryComponents: [
    PlaceFormComponent
  ]
})
export class PlacesGeometricShapesManagementModule { }
