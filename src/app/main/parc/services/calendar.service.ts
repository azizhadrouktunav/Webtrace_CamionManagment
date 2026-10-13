import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { PlanningModel } from '../interfaces/planning';
import { environment } from 'environments/environment';

@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any =[];
    onEventsUpdated: Subject<any>;
    private readonly API_URL = environment.apiUrl + '/';
    events1: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onEventsUpdated = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getEvents()
            ]).then(
                ([events]: [any]) => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get events
     *
     * @returns {Promise<any>}
     */
    getEvents(): Promise<any>
    {
        let params = {};
    params['keyTrackingObject'] = +1;
    params['SessionId'] ='';
        return new Promise((resolve, reject) => {

            this._httpClient.post(this.API_URL +
                'UIBorrowedRentalCarContractManagementService.asmx/GetBorrowedRentalCarContract', JSON.stringify(params))
                .subscribe((response: any) => {
                    this.events1 = response[Object.keys(response)[0]];
                    this.events1.forEach(elt => {
              this.events.push(new PlanningModel(elt));
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events);
                }, reject);
        });
    });
}

    /**
     * Update events
     *
     * @param events
     * @returns {Promise<any>}
     */
    updateEvents(events): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/calendar/events', {
                id  : 'events',
                data: [...events]
            })
                .subscribe((response: any) => {
                    this.getEvents();
                }, reject);
        });
    }

}
