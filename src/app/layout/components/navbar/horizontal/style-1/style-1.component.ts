import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EMPTY, Subject, timer } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DateAdapter, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertconfigurationShowedInNotificationService } from 'app/layout/components/toolbar/alertconfiguration/alertconfiguration-showed-in-notification.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';
import { TrackingObjectService } from 'app/main/monitoring/tracking/tracking-objects.service';
import { navigation } from 'app/navigation/navigation';
import { AlertconfigurationComponent } from 'app/layout/components/toolbar/alertconfiguration/alertconfiguration.component';
import { SharedDataService } from 'app/main/monitoring/shared-data.service';

@Component({
    selector     : 'navbar-horizontal-style-1',
    templateUrl  : './style-1.component.html',
    styleUrls    : ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarHorizontalStyle1Component implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;
    UserName = "User Name";

    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    alertsCount;
    // Private
    private _unsubscribeAll: Subject<any>;
    isAdminAuthorized: boolean;
    showNotification: boolean;
    alerts = [];
    EnableAlert: boolean;
    private killTrigger: Subject<void> = new Subject();
    isChecked: boolean;
    lastalertId = -1;
    dateOpnedSession: number;
    enabledAlertsId = [];
    // Private

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private authService: AuthenticateService,
        private router: Router,
        private _adapter: DateAdapter<any>,
        private _trakcingObjectService: TrackingObjectService,
        public  _matDialog: MatDialog, 
        private _AlertconfigurationShowedInNotificationService: AlertconfigurationShowedInNotificationService,
        private _data: SharedDataService,


    )
    {//this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon: 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon: 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon: 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'fr',
                title: 'Français',
                flag: 'fr'
            },
            {
                id: 'ar',
                title: 'العربية',
                flag: 'tn'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.isAdminAuthorized = localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized"

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        // this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});


        this.authService._Success.subscribe(value => {
            if (value)
                this.UpdateUserName();
        })

        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
    }

    /**
     * On destroy
     */
     UpdateUserName() {
        this.UserName = localStorage.getItem("UserName")
    }

    LogOut() {

         
        this.authService.LogOut().subscribe();
        //localStorage.setItem("RememberUser","false")
        this.authService.SetConnexionState(false);
        this._data.changeIndex(0);

    }
    navigateAccountManagement() {
        this.router.navigate(['/administration/accountmanagment']);
    }
    navigateDepManagement() {
        this.router.navigate(['/administration/departementmanagment']);
    }
    navigateAlertConfiguration() {
        this.router.navigate(['/administration/alet-configuration']);
    }
    navigateSMSmailconfig() {
        this.router.navigate(['/administration/smsmailconfig']);
    }
    navigatePostesManagement() {
        this.router.navigate(['/parametrage'], { queryParams: { section: 'postes' } });
    }
    navigateCartography() {
        this.router.navigate(['/parc/zones']);
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        //  console.log(value);
    }
    openNotification(state: boolean) {
        this.showNotification = state;
    }
    clearNotification() {
        this.alerts = [];
    }
    settingNotification() : void {
            const dialogRef = this._matDialog.open(AlertconfigurationComponent, {
              panelClass: 'custom-dialog-container',  
                 
            });
        
            dialogRef.afterClosed().subscribe((result: any) => {
              
              
                this.getCommonAlertWithDescriptionShowedInNotificationState();

              
            });
          }
    
    changeAlertStatus(event): void {

        event.checked ? this.EnableAlert = true : this.EnableAlert = false;
        localStorage.setItem("StateAlert", "" + this.EnableAlert);
        this.callAlert();

    }




    callAlert() {
        this.getCommonAlertWithDescriptionShowedInNotificationState();
        
        
        var reloadInterval = 30000;
        this.dateOpnedSession = new Date().getTime();
        timer(0, reloadInterval).pipe(takeUntil(this.killTrigger),
            mergeMap(_ => this._trakcingObjectService.getListReceivedAlerts(this.lastalertId, this.dateOpnedSession))
        ).subscribe((result: []) => {
            result.forEach(element => {
                const found = this.alerts.some(el => el['Id'] === element['Id']);
                if (!found)
                {const foundCommonAlert = this.enabledAlertsId.some(el => el === element['CommonAlert']);
                    if(foundCommonAlert || element['CommonAlert'] == 1006 ||  element['AlertType'] == 40104
                    || element['AlertType'] == 40102|| element['AlertType'] == 40103|| element['AlertType'] == 40105)
                    this.alerts.unshift(element);        
                }
            });


            this.alertsCount = this.alerts.length;
            if (this.alertsCount > 0)
                this.lastalertId = this.alerts[this.alertsCount - 1].Id;
                if (this.alertsCount > 50)
                this.alerts = this.alerts.slice(0, 50)

               
        });

    }
    getCommonAlertWithDescriptionShowedInNotificationState()
    {this._AlertconfigurationShowedInNotificationService.getCommonAlertWithDescriptionShowedInNotificationState().subscribe((data: any[]) => {
     
        data["GetCommonAlertWithDescriptionShowedInNotificationStateResult"].forEach(element => {
          
          if(element["Value"] == true)
          this.enabledAlertsId.push(element["Key"]["CommonAlertInt"]);
  
        });
    });}
    /**
     * Set the language
     *
     * @param lang
     */
    /*  setLanguage(lang): void
     {
         console.log(lang)
         // Set the selected language for the toolbar
         this.selectedLanguage = lang;
 
         // Use the selected language for translations
         
         this._translateService.use(lang.id);
         this._adapter.setLocale(lang.id);
     } */
}


