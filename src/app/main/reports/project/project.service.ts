import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';
import {
    Observable, BehaviorSubject, throwError
} from 'rxjs';
import 'rxjs/operators';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ProjectDashboardService implements Resolve<any>
{
   
    projects: any[];
    widgets: any;
  
    private URL = environment.apiUrl + "/DashbordWCFServiceNtSoft.svc/GetTrackingObjectCompressed";
    private URL1 = environment.apiUrl + "/DashbordWCFServiceNtSoft.svc/GetListObjectDashbordCompressed";

    

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
    car = [];
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
   
    constructor(
        private _httpClient: HttpClient
    )
    {
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
        /* return new Promise((resolve, reject) => {

            Promise.all([
              this.getProjects(),
               this.getWidgets()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        }); */
    }

  
    GetParams(): Observable<any[]>{
        let params = {};
      
      params['SessionId'] = localStorage.getItem('SessionId');
/*       params['IdCustomer'] = 913;
 */
         
        return this._httpClient.post(this.URL,JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )  
    }
    GetListObjectDashbord(car,StartDateTimeGMT,EndDateGMT){
        
        let params = {};
        
     //this.car.push(38222);
       // this.car.push(38217);
     /*  this.car.push(9);      this.car.push(10);
      this.car.push(8); */
      var d=new Date();
       
        params['SessionId'] = localStorage.getItem('SessionId');
       
      params['StartDateTimeGMT'] = StartDateTimeGMT._d != undefined ? '/Date(' + StartDateTimeGMT._d.getTime() + ')/' : '/Date(' + StartDateTimeGMT.getTime() + ')/'; 
      params['EndDateTimeGMT'] =  EndDateGMT._d != undefined ? '/Date(' + EndDateGMT._d.getTime() + ')/' : '/Date(' + EndDateGMT.getTime() + ')/'; ;
        params['ListTrackingObjId'] =  car;

         
        return this._httpClient.post(this.URL1,JSON.stringify(params), this.httpOptions);
    }
}
