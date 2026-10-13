import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, from, interval, Observable, pipe, Subject, timer } from 'rxjs';
import { environment } from 'environments/environment';
import { decrypt } from 'app/main/parc/Parc';
import { json2array } from 'app/main/helpers/must-match.validator';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import { concatMapTo, exhaustMap, flatMap, mergeMap, switchMap, takeUntil, takeWhile, timeInterval } from 'rxjs/operators';
import { ISubscription } from 'rxjs/Subscription';
import { reject } from 'lodash';
import { Place } from '../places-geometric-shapes-management/model';
import { RouterModule, Routes, Router } from '@angular/router';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { RealTimeTrackingObject } from './RealTimeTrackingObject';
import { SharedDataService } from '../shared-data.service';
import { DEMO_MAP_CUSTOMER, DEMO_TRACKING_OBJECTS } from 'app/mock/data/tracking-demo';

@Injectable()
export class TrackingObjectService implements Resolve<any> {

    trackingObjects: any[];
    onTrackingObjectsChanged: Subject<any[]>;
    private REST_API_SERVER = environment.apiUrl
    private killTrigger: Subject<void> = new Subject();
    places: Place[] = [];
    onPlacesChanged: BehaviorSubject<any>;
    // Http Header
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
    subscription: ISubscription;
    RefreshPromise: Promise<any>;

    data: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    today = new Date();
    private Fake_API_SERVER = "http://localhost:3001";
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private router: Router,
        private _errorHandler: ErrorHandlerService,
        private _SharedDataService: SharedDataService
    ) {
        // Set the defaults
        this.onTrackingObjectsChanged = new Subject();
        this.onPlacesChanged = new BehaviorSubject([]);

    }
    onDestroy(): void {
        this.trackingObjects = []
        this.onTrackingObjectsChanged.next(this.trackingObjects);
        //console.log("destroy",this.trackingObjects)
        this.RefreshPromise
        this.killTrigger.next();
        //console.log("destroy", this.trackingObjects)
    }
    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        /* return new Promise<void>((resolve, reject) => {
           
            Promise.all([
              
               this.getUITrackingPageParamCompressed()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        }); */
    }
    //Dont use it
    private getTrackingObject(): Observable<any> {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');

        //console.log("request using id", localStorage.getItem('SessionId'))
        return this._httpClient.post(this.REST_API_SERVER + '/TrackingPageWCFServiceNewtonSoft.svc/GetTrackingObjectWithUpdateRefreshCompressed',
            params, this.httpOptions);
    }

    /**
     * Make an http call every 60s
     *
     * @returns {Promise<any>}
     */
    /** Publie les camions démo (environment.mock) sans appel WCF. */
    private publishDemoTrackingObjects(includeMapConf: boolean): Promise<any> {
        return new Promise((resolve) => {
            this.isLoading.next(true);
            if (includeMapConf) {
                RealTimeTrackingObject.CustomerGmt = DEMO_MAP_CUSTOMER.GMT;
                this.places = [];
                this.onPlacesChanged.next(this.places);
                this._SharedDataService.sendMapConf(DEMO_MAP_CUSTOMER);
            }
            this.trackingObjects = DEMO_TRACKING_OBJECTS.map(item => ({ ...item }));
            this.trackingObjects.map(it => new Vehicle(it));
            this._SharedDataService.sendTO(this.trackingObjects.filter(
                to => to.CurrentEquipmentElement != null));
            this.onTrackingObjectsChanged.next(this.trackingObjects);
            this.isLoading.next(false);
            resolve(this.trackingObjects);
        });
    }

    getTrackingObjectWithUpdateRefreshCompressed(): Promise<any> {
        if (environment.mock) {
            return this.publishDemoTrackingObjects(false);
        }
        const reloadInterval = 30000;
        return new Promise((resolve, reject) => {
            timer(0, reloadInterval)
                .pipe(takeUntil(this.killTrigger),

                    exhaustMap(() => this.getTrackingObject()))
                .subscribe((response: any) => {
                    this.isLoading.next(true)
                    this.trackingObjects = json2array(decrypt(response));
                    this.isLoading.next(false);

                    this.trackingObjects.map(it => new Vehicle(it));

                    this._SharedDataService.sendTO(this.trackingObjects.filter(
                        to => to.CurrentEquipmentElement != null));
                    this.onTrackingObjectsChanged.next(this.trackingObjects);
                    //console.log("refresh",this.trackingObjects.length)
                    resolve(this.trackingObjects);
                },

                    error => {
                        console.log('Error: ', error);
                        this.router.navigate(['/app-auth']);
                    },

                     () =>{
                        this.trackingObjects = [];
                        //console.log('Completed');
                    });
        });
    }
    getUITrackingPageParamCompressed(): Promise<any> {
        if (environment.mock) {
            return this.publishDemoTrackingObjects(true);
        }
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        //console.log("params using id", localStorage.getItem('SessionId'))
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER + '/TrackingPageWCFServiceNewtonSoft.svc/GetUITrackingPageParamCompressed', params, this.httpOptions)
                .subscribe((response: any) => {
                    this.data = decrypt(response);
                    RealTimeTrackingObject.CustomerGmt = this.data.account.Customer.GMT
                    //console.log(this.data)
                    this.places = [];
                    Object.keys(this.data.PlaceElementsOfCurrentCustomer).map(key => {
                        this.places.push(new Place(this.data.PlaceElementsOfCurrentCustomer[key]))
                        return this.places;
                    });
                    this.onPlacesChanged.next(this.places)
                    this.trackingObjects = json2array(this.data)[2];

                    this.trackingObjects.map(it => new Vehicle(it));

                    this._SharedDataService.sendTO(this.trackingObjects.filter(
                        to => to.CurrentEquipmentElement != null));
                    this._SharedDataService.sendMapConf(this.data.account.Customer);
                    this.onTrackingObjectsChanged.next(this.trackingObjects);

                    resolve(this.trackingObjects);

                },
                    (error: HttpErrorResponse) => {
                        this.router.navigate(['/app-auth']);

                        // console.log(error)
                        // //this.errorHandler.handleError(error);.handleError(error);
                    },
                    () => {
                        setTimeout(() => {
                            if (this.router.url == "/Home")
                                this.RefreshPromise = this.getTrackingObjectWithUpdateRefreshCompressed()
                        }, 30000);
                    }

                )


        });
    }

    getListReceivedAlerts(lastalertId, dateOpnedSession) {

        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params['AcquisitionTimeGMT'] =/* "/Date(1626408000000)/";//**/ "/Date(" + dateOpnedSession + ")/";
        params['IdLastAlert'] = lastalertId;

        return this._httpClient.post(this.REST_API_SERVER + "/TrackingPageWCFServiceNewtonSoft.svc/GetListReceivedAlerts"
            , JSON.stringify(params), this.httpOptions);
        // return    this._httpClient.get(this.Fake_API_SERVER+"/Alerts");
    }
    SaveWorkspaceParam(MyWorkspaceParam) {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["MyWorkspaceParam"] = MyWorkspaceParam;

        //console.log("request using id", localStorage.getItem('SessionId'))
        return this._httpClient.post(this.REST_API_SERVER + '/TrackingPageWCFService.svc/SaveNewWorkspaceParam',
            params, this.httpOptions);
    }
    public GetWorkspaceParam() {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');


        //console.log("request using id", localStorage.getItem('SessionId'))
        return this._httpClient.post(this.REST_API_SERVER + '/TrackingPageWCFService.svc/GetNewWorkspaceParam',
            params, this.httpOptions);
    }




}
