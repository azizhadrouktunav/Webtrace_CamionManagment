import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChildGuard } from '../authenticate/child.guard';
import { SessionGuard } from '../authenticate/session.guard';



const routes = [
  //  {path: '' , children: [
      {
        path        : 'document',
        loadChildren: () =>
            import('./document/document.module').then(m => m.DocumentModule),
            canActivateChild : [ChildGuard,SessionGuard],
             data: {
              role: '25'
             }
        //data: { preload: true, delay: true },
      },
    {
      path        : 'borrowedcar',
      loadChildren: () =>
          import('./borrowedcar/borrowedcar.module').then(m => m.BorrowedcarModule),
          canActivateChild : [ChildGuard,SessionGuard],
          data: {
           role: '29'
          }
      //data: { preload: true, delay: true },
    },
    {
      path        : 'sinistre',
      loadChildren: () =>
          import('./sinistre/sinistre.module').then(m => m.SinistreModule),
          canActivateChild : [ChildGuard,SessionGuard],
          data: {
           role: '27'
          }
      //data: { preload: true, delay: true },
    },
    {
      path: 'app-maintenance',
      loadChildren: () =>
          import('./maintenance/maintenance.module').then(m => m.MaintenanceModule),
          canActivateChild : [ChildGuard,SessionGuard],
          data: {
           role: '23'
          }
     // data: { preload: true, delay: true },
     },
     {
      path: 'app-depenses-general',
      loadChildren: () =>
         import('./depenses-general/depense.module').then(m => m.DepenseModule),
         canActivateChild : [ChildGuard,SessionGuard],
          data: {
           role: '65'
          }
    // data: { preload: true, delay: true },
    },
    {
      path: 'app-order-management',
      loadChildren : () => import('./order-management/mission.module').then(m => m.MissionModule),
      canActivateChild : [ChildGuard,SessionGuard],
          data: {
           role: '28'
          }
     // data: { preload: true, delay: true },
     },
     {
      path     : 'beneficiary-management',
      loadChildren : () => import('./beneficiary-management/beneficiary.module').then(m => m.BeneficiaryModule),
      canActivateChild : [ChildGuard,SessionGuard],
      data: {
       role: '62'
      }
      //data: { preload: true, delay: true }
    },
    {
      path : 'suppliers',
      loadChildren : () => import('./supplier-mngmnt/supplier.module').then(m => m.SupplierModule),
      canActivateChild : [ChildGuard,SessionGuard],
      data: {
       role: '61'
      }
      // data: { preload: true, delay: true }
    },
      {
          path: 'facture',
          loadChildren : () => import('./facture/facture.module').then(m => m.FactureModule),
          canActivateChild : [ChildGuard,SessionGuard],
          data: {
           role: '64'
          }
          //data: { preload: true, delay: true },
      },
      {
        path: 'tire-management',
        loadChildren : () => import('./tire-management/tire.module').then(m => m.TireModule),
        canActivateChild : [ChildGuard,SessionGuard],
        data: {
         role: '66'
        }
        // data: { preload: true, delay: true }
      },
      {
        path: 'app-gestion_des_chauffeurs',
        loadChildren : () => import('./gestion-des-chauffeurs/driver.module').then(m => m.DriverModule),
        canActivateChild : [ChildGuard,SessionGuard],
        data: {
         role: '14'
        }
        //data: { preload: true, delay: true },
      },
        {
        path: 'app-gestion_des_vehicules',
        loadChildren : () => import('./gestio-des-vehicules/vehicule.module').then(m => m.VehiculeModule),
        canActivateChild : [ChildGuard,SessionGuard],
        data: {
         role: '15'
        }
        //  data: { preload: true, delay: true },
     }, 
    {
        path: 'app-articlestock',
        loadChildren: () => import('./getsion-des-articles-stocks/stock.module').then(m => m.StockModule),
        canActivateChild : [ChildGuard,SessionGuard],
        data: {
         role: '63'
        }
        // data: { preload: true, delay: true },
    },
    {
      path: 'card-coupon',
      loadChildren: () => import('./card-coupon/card-coupon.module').then(m => m.CardCouponModule),
      canActivateChild : [ChildGuard,SessionGuard],
      data: {
       role: '26'
      }
      //  data: { preload: true, delay: true },
    }
    //]}
    
 ];
@NgModule({
    declarations: [],
  imports: [
    RouterModule.forChild(routes) 
  ],
  exports: [],
  providers: [ChildGuard,SessionGuard]
})
export class ParcModule { }
