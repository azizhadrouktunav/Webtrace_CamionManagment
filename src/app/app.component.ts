import { Component, Inject, OnDestroy, OnInit, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationFrench } from 'app/navigation/i18n/fr';
import { locale as navigationArabic } from 'app/navigation/i18n/ar';
import { AuthenticateService } from './main/authenticate/authenticate.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { environment } from 'environments/environment';
import { xor } from 'lodash';
import { identifierModuleUrl } from '@angular/compiler';
import { SharedService } from './shared.service';

interface ISessionId {
    SessionId: string;
}
@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        // The locale would typically be provided on the root module of your application. We do it at
        // the component level here, due to limitations of our example generation script.
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'Fr'
        },

        // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
        // `MatMomentDateModule` in your applications root module. We provide it at the component level
        // here, due to limitations of our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MAT_MOMENT_DATE_FORMATS
        },
    ]
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    public SessionId: ISessionId = {
        SessionId: ''
    };
    fuselayout: string;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private _authenticateService: AuthenticateService,
        private router: Router,
        private dateAdapter: DateAdapter<Date>,
        private _Shared : SharedService
    ) {
        if (window.innerWidth < 768) {
            this.fuselayout = 'vertical-layout-1';
          } else {
            this.fuselayout = 'horizontal-layout-1';
          }

        // Get default navigation (offline Orient mockup)
        this.navigation = navigation;
        this._fuseNavigationService.register('main', this.navigation);
        this._fuseNavigationService.setCurrentNavigation('main');
        this._Shared.sendParams(this.navigation);

        // Add languages
        this._translateService.addLangs(['en', 'fr', 'ar']);

        // Set the default language

        if (localStorage.getItem("lang") != null) { this._translateService.setDefaultLang(localStorage.getItem("lang")); }
        else {
            this._translateService.setDefaultLang("fr");
        }

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationFrench, navigationArabic);

        // Use a language


        if (localStorage.getItem("lang") != null) { this._translateService.use(localStorage.getItem("lang")); }
        else {
            this._translateService.use("fr");
        }

        setTimeout(() => {

            if (localStorage.getItem("lang") != null) { this._translateService.setDefaultLang(localStorage.getItem("lang")); }
            else {
                this._translateService.setDefaultLang("fr");
            }
            // this._translateService.setDefaultLang('fr');
        });

        if (localStorage.getItem("lang") != null) { this.dateAdapter.setLocale(localStorage.getItem("lang")); }
        else {
            this.dateAdapter.setLocale("fr");
        }
        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. french in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    firstName: string;


    /**
     * On init
     */
    ngOnInit(): void {

        console.log("appcomponent");
        this.firstName = 'John';

        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                } else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
        // Add Suivi nav item that opens the bar programmatically
        // Add reports nav item that opens the bar programmatically
        

        // var firstUseofAuthSuccess = false;
        //var RememberUser = JSON.parse(localStorage.getItem("RememberUser"))


        // if (RememberUser) {
        this._authenticateService.GetConnexionState().subscribe((response) => {
            if (response) {
                this._authenticateService.SetConnexionState(true);
            } else {
                this._authenticateService.SetConnexionState(false);
                this.router.navigate(['app-auth']);
            }
        });

        this._authenticateService._Success.subscribe(result => {
            // Offline mockup: no dynamic Reporting / Tank menus
            if (result === undefined) {
                return;
            }
            if (result) {
                if (this.router.routerState.snapshot.url === '/app-auth') {
                    this.router.navigate(['/Home']);
                    setTimeout(() => {
                        this._translateService.setDefaultLang('fr');
                    });
                }
            } else {
                this.router.navigate(['app-auth']);
            }
        });

    }

    /**
     * On destroy
     */
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
