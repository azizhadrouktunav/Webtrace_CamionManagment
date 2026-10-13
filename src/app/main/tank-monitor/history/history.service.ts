import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TankMonitorService } from "../tank-monitor.service";

@Injectable()
export class HistoryService implements Resolve<any>
{
    routeParams: any;
    gpsData: any;
    onGpsDataChanged: BehaviorSubject<any>;
    private readonly API_URL = environment.apiUrl;
    // Http Header
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

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
        this.onGpsDataChanged = new BehaviorSubject([]);
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getHistory()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get order
     *
     * @returns {Promise<any>}
     */
     getHistory(): Promise<any>
    { 
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["serialNumber"] = this.routeParams.serialNumber;
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.API_URL+ '/TanksMonitoringWCFService.svc/GetHistory', params, this.httpOptions)
                .subscribe((response: any) => {
                    this.gpsData = response;
                    this.onGpsDataChanged.next(this.gpsData);
                    resolve(response);
                }, reject);
        });
    }


   
   
}
