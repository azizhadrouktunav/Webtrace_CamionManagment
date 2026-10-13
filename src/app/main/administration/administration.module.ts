import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataService } from './accountmanagment/data.service';
import { ChildGuard } from '../authenticate/child.guard';


const routes: Routes = [
  {
    path        : 'accountmanagment',
    loadChildren: () =>
        import('./accountmanagment/accountmanagment.module').then(m => m.AccountmanagmentModule),
        canActivateChild : [ChildGuard],
        data: { preload: true, delay: true, role: '3' },
 },
 {
  path        : 'departementmanagment',
  loadChildren: () =>
      import('./departementmanagment/departementmanagment.module').then(m => m.DepartementmanagmentModule),
      canActivateChild : [ChildGuard],
      data: { preload: true, delay: true, role: '17' },
  
},
{
  path        : 'smsmailconfig',
  loadChildren: () =>
      import('./smsmailconfig/smsmailconfig.module').then(m => m.SmsmailconfigModule),
      canActivateChild : [ChildGuard],
      data: { preload: true, delay: true, role: '22' },
  
},
{
  path        : 'alet-configuration',
  loadChildren: () =>
      import('./alet-configuration/alert-configuration.module').then(m => m.AlertConfigurationModule),
      canActivateChild : [ChildGuard],
      data: { preload: true, delay: true, role: '22' },
  
}
]

 @NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [
    DataService,
    ChildGuard
  ],
})
export class AdministrationModule { }
