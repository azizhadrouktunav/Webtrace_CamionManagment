import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from '../authenticate/session.guard';

const routes: Routes = [
  {
    path        : 'generalreport',
    loadChildren: () =>
        import('./generalreport/generalreport.module').then(m => m.GeneralreportModule),
    data: { preload: true, delay: true },

    canActivateChild : [SessionGuard],
 },
 {
  path        : 'configurablereport',
  loadChildren: () =>
      import('./configurablereport/configurablereport.module').then(m => m.ConfigurablereportModule),
  data: { preload: true, delay: true },

  canActivateChild : [SessionGuard],
},
 {
  path        : 'statisticreport',
  loadChildren: () =>
      import('./statisticreport/statisticreport.module').then(m => m.StatisticreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},

{
  path        : 'monthlyreport',
  loadChildren: () =>
      import('./monthlyreport/monthlyreport.module').then(m => m.MonthlyreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},

{
  path        : 'speedreport',
  loadChildren: () =>
      import('./speedreport/speedreport.module').then(m => m.SpeedreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'passingknownplacereport',
  loadChildren: () =>
      import('./passingkwownplacereport/passingkwownplacereport.module').then(m => m.PassingkwownplacereportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},

{
  path        : 'fuelreport',
  loadChildren: () =>
      import('./fuelreport/fuelreport.module').then(m => m.FuelreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'temperaturereport',
  loadChildren: () =>
      import('./temperaturereport/temperaturereport.module').then(m => m.TemperaturereportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'enginereport',
  loadChildren: () =>
      import('./enginereport/enginereport.module').then(m => m.EnginereportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'drivermissionreport',
  loadChildren: () =>
      import('./drivermission/drivermission.module').then(m => m.DrivermissionModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'drivingqualityreport',
  loadChildren: () =>
      import('./drivingqualityreport/drivingqualityreport.module').then(m => m.DrivingqualityreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},

{
  path        : 'statisticsinworktime',
  loadChildren: () =>
      import('./statisticsinworktime/statisticsinworktime.module').then(m => m.StatisticsinworktimeModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'project',
  loadChildren: () =>
      import('./project/project.module').then(m => m.ProjectDashboardModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'trajetreport',
  loadChildren: () =>
      import('./trajetreport/trajetreport.module').then(m => m.TrajetreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},

{
  path        : 'geofencereport',
  loadChildren: () =>
      import('./geofencereport/geofencereport.module').then(m => m.GeofencereportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'speedingreport',
  loadChildren: () =>
      import('./speedingreport/speedingreport.module').then(m => m.SpeedingreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},

{
  path        : 'smartlockreport',
  loadChildren: () =>
      import('./smartlockreport/smartlockreport.module').then(m => m.SmartlockreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'dashboarddefautreport',
  loadChildren: () =>
      import('./dashboarddefautreport/dashboarddefautreport.module').then(m => m.DashboarddefautreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
{
  path        : 'weightreport',
  loadChildren: () =>
      import('./weightreport/weightreport.module').then(m => m.WeightreportModule),
  data: { preload: true, delay: true },
  canActivateChild : [SessionGuard],
},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
    
  ],
  providers: [SessionGuard]
})
export class ReportsModule { }
