import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { PipeModule } from './main/helpers/pipe/pipe.module';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './main/authenticate/auth.guard';


//import { SpinnerInterceptor } from './main/spinner-overlay/spinner-interceptor';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SharedModule } from './main/shared-module/shared.module';
import { SessionGuard } from './main/authenticate/session.guard';
import { LogService } from './log/log.service';
//import * as Sentry from "@sentry/angular";
import { LogPublishersService } from './log/log-publishers.service';
import { environment } from 'environments/environment.hmr';
import { SharedService } from './shared.service';

//import { SentryErrorHandler } from './sentry-error-handler.service';


// >= v2.0.0
//export function createConfig(): SignalRConfiguration {
//    const c = new SignalRConfiguration();
//    c.hubName = 'messagesHub';
//    //c.qs = { user: 'donald' };
//    c.url = 'http://localhost:61720';
//    c.logging = true;

//    // >= v5.0.0
//    c.executeEventsInZone = true; // optional, default is true
//    c.executeErrorsInZone = false; // optional, default is false
//    c.executeStatusChangeInZone = true; // optional, default is true
//    return c;
//}
const appRoutes: Routes = [
    { 
        path: '', 
        pathMatch: 'full',
        loadChildren: () =>
          import('./main/authenticate/authenticate.module').then(m => m.AuthenticateModule),
          canActivate  : [SessionGuard],
    },
    { path: '404',
    loadChildren: () =>
       import('./main/error-pages/404/error-404.module').then(m => m.Error404Module)
    },
   { path: '500', 
     loadChildren: () =>
       import('./main/error-pages/500/error-500.module').then(m => m.Error500Module)
   },
   { path: '403', 
   loadChildren: () =>
     import('./main/error-pages/403/error-403.module').then(m => m.Error403Module)
 },
    {
        path        : 'app-auth',
        loadChildren: () =>
          import('./main/authenticate/authenticate.module').then(m => m.AuthenticateModule),
          canActivate  : [SessionGuard],
    },
    {
        path        : 'Home',
        loadChildren: () =>
          import('./main/monitoring/monitoring.module').then(m => m.MonitoringModule),
          canActivate: [SessionGuard],
          data: {
            role: 'isSuiviAuthorized'
           } 
    },
    {
        path        : 'dashboard',
        loadChildren: () =>
          import('./main/orient-dashboard/orient-dashboard.module').then(m => m.OrientDashboardModule),
          canActivate: [AuthGuard],
          data: {
           role: 'isSuiviAuthorized'
          } 
    },
    {
        path        : 'parc',
        loadChildren: () =>
          import('./main/orient-parc/orient-parc.module').then(m => m.OrientParcModule),
          canActivate: [AuthGuard],
          data: {
           role: 'isParcAuthorized'
          } 
    },
    {
        path      : 'parametrage',
        loadChildren: () =>
            import('./main/orient-parametrage/orient-parametrage.module').then(m => m.OrientParametrageModule),
            canActivate: [AuthGuard],
            data: {
             role: 'isAdminAuthorized'
            }
    },
    {
        path      : 'administration',
        loadChildren: () =>
            import('./main/administration/administration.module').then(m => m.AdministrationModule),
            canActivate: [AuthGuard],
            data: {
             role: 'isAdminAuthorized'
            }
    },
    {
        path      : '**',
        redirectTo: '404', 
        pathMatch:  'full'
    } 
];
/* Sentry.init({
    dsn: "https://47e05ba4be214986939c8c10ea0353a3@o524881.ingest.sentry.io/5638068"
  }); */
  
@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

        HttpClientModule,
        RouterModule.forRoot(
           /*  appRoutes,
            { enableTracing: false, useHash: true,
                preloadingStrategy: QuicklinkStrategy
             }, */
             appRoutes, {
              enableTracing: false, useHash: true,
              preloadingStrategy: PreloadAllModules
            }
             
          ),
        SharedModule.forRoot(), // Here's the trick
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        MatIconModule,
        
        // App modules
        LayoutModule,
        

        PipeModule.forRoot(),
        MatProgressSpinnerModule,
        //signalR
       // SignalRModule.forRoot(createConfig)
    ],
    bootstrap   : [
        AppComponent,
       // SharedDataService
    ],
    providers:[
        DatePipe, 
        LogService, 
        LogPublishersService,
        {provide: LOCALE_ID, useValue: 'us' },
        {provide: LOCALE_ID, useValue: 'fr'},
        {provide: LOCALE_ID, useValue: 'ar'},
        SharedService,
        // {
        //     provide: ErrorHandler,
        //     useValue: Sentry.createErrorHandler({
        //       showDialog: true,
        //     }),
        //   },
      //  {provide: ErrorHandler, useClass: SentryErrorHandler},
        SessionGuard,
       // { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
            
          
    ],
    entryComponents: [
       // SpinnerOverlayComponent
    ],
    exports: [RouterModule]
})
export class AppModule {
  }
  