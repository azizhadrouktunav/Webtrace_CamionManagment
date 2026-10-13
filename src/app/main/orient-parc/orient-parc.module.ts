import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MissionsComponent } from './missions/missions.component';
import { MissionFormDialogComponent } from './missions/mission-form-dialog.component';
import { CamionsComponent } from './camions/camions.component';
import { CamionFormDialogComponent } from './camions/camion-form-dialog.component';
import { CamionPlanningDialogComponent } from './camions/camion-planning-dialog.component';
import { ChauffeursComponent } from './chauffeurs/chauffeurs.component';
import { ChauffeurFormDialogComponent } from './chauffeurs/chauffeur-form-dialog.component';
import { NaviresComponent } from './navires/navires.component';
import { NavireFormDialogComponent } from './navires/navire-form-dialog.component';
import { TrajetsComponent } from './trajets/trajets.component';
import { PortsComponent } from './ports/ports.component';
import { ZonesStockComponent } from './zones-stock/zones-stock.component';
import { ZonesAtelierComponent } from './zones-atelier/zones-atelier.component';
import { ZonesPauseComponent } from './zones-pause/zones-pause.component';
import { OrientGeoMapComponent } from './orient-geo-map/orient-geo-map.component';
import { GestionZonesShellComponent } from './gestion-zones/gestion-zones-shell.component';
import { CartoNameDialogComponent } from './gestion-zones/carto-name-dialog.component';
import { CartoAssignDialogComponent } from './gestion-zones/carto-assign-dialog.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'missions' },
  { path: 'missions', component: MissionsComponent },
  { path: 'camions', component: CamionsComponent },
  { path: 'chauffeurs', component: ChauffeursComponent },
  { path: 'navires', component: NaviresComponent },
  { path: 'zones/trajets', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones/ports', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones/stock', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones/atelier', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones/pause', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones', component: GestionZonesShellComponent },
  { path: 'trajets', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'ports', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones-stock', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones-atelier', redirectTo: 'zones', pathMatch: 'full' },
  { path: 'zones-pause', redirectTo: 'zones', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    MissionsComponent,
    MissionFormDialogComponent,
    CamionsComponent,
    CamionFormDialogComponent,
    CamionPlanningDialogComponent,
    ChauffeursComponent,
    ChauffeurFormDialogComponent,
    NaviresComponent,
    NavireFormDialogComponent,
    TrajetsComponent,
    PortsComponent,
    ZonesStockComponent,
    ZonesAtelierComponent,
    ZonesPauseComponent,
    OrientGeoMapComponent,
    GestionZonesShellComponent,
    CartoNameDialogComponent,
    CartoAssignDialogComponent
  ],
  entryComponents: [
    MissionFormDialogComponent,
    CamionFormDialogComponent,
    CamionPlanningDialogComponent,
    ChauffeurFormDialogComponent,
    NavireFormDialogComponent,
    CartoNameDialogComponent,
    CartoAssignDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule
  ]
})
export class OrientParcModule {}
