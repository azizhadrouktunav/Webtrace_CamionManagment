import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TrackingObjectService } from 'app/main/monitoring/tracking/tracking-objects.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'quick-panel',
    templateUrl  : './quick-panel.component.html',
    styleUrls    : ['./quick-panel.component.scss'],

    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit , OnDestroy
{
    date: Date;
    events = [];
    notes: any[];
    settings: any;
    interval: NodeJS.Timer;
    address: any[];
    destroy: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor
     */
    constructor( private _trakcingObjectService: TrackingObjectService,
        private router: Router,
        )
    {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud : false,
            retro : true
        };
    }
    

    ngOnInit() { 
        

        
    
     
    }
    ngOnDestroy(): void {
        this.destroy.next(true);
    this.destroy.unsubscribe();
    }
}