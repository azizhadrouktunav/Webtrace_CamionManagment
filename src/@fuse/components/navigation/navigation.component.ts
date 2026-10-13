import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';

@Component({
    selector       : 'fuse-navigation',
    templateUrl    : './navigation.component.html',
    styleUrls      : ['./navigation.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit
{
    @Input()
    layout = 'vertical';

    @Input()
    navigation = [];
    nav: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    isParcAuthorized: boolean;
    isAdminAuthorized: boolean;
    isSuiviAuthorized: boolean;
    isMonitoringTankAuthorized: boolean;
    
 

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService
    )
    {
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
        
        this.isParcAuthorized = localStorage.getItem("isParcAuthorized") =="isParcAuthorized";
        this.isSuiviAuthorized = localStorage.getItem("isSuiviAuthorized")=="isSuiviAuthorized"
        this.isMonitoringTankAuthorized = localStorage.getItem("isMonitoringTankAuthorized")=="isMonitoringTankAuthorized"
        // Load the navigation either from the input or from the service
        //
        this.nav = this.nav || this._fuseNavigationService.getCurrentNavigation();

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Load the navigation
                
                this.nav = this._fuseNavigationService.getCurrentNavigation();

               
                    this.nav.forEach(element => {
                        if(this.isParcAuthorized && element.id == "Parc" )
                        {
                          this.navigation.push(element);
                        }
                        else if(this.isSuiviAuthorized && element.id == "suivi")
                        {
                            this.navigation.push(element);
                        }
                        else if(this.isSuiviAuthorized && element.id == "monitoring")
                        {
                            this.navigation.push(element);
                        }
                        else if(this.isSuiviAuthorized && element.id == "dashboards")
                        {
                            this.navigation.push(element);
                        }
                        else if(this.isMonitoringTankAuthorized && element.id == "tank-monitoring")
                        {
                            this.navigation.push(element);
                        }
                    });
                

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
         .subscribe(() => {

             // Mark for check
             this._changeDetectorRef.markForCheck();
         });
    }
}
