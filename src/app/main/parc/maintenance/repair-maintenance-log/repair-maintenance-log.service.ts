import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';


@Injectable()
export class RepairMaintenanceLogService implements Resolve<any> {
  routeParams: any;
  repairMaintenanceLog : any;
  onRepairMaintenanceLogChanged: BehaviorSubject<any>;
   // Http Header
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  private REST_API_SERVER = environment.apiUrl;
 /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient,
      private errorHandler : ErrorHandlerService
  )
  {
      // Set the defaults
      this.onRepairMaintenanceLogChanged = new BehaviorSubject({});
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
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getRepairMaintenanceLog()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }
      /**
     * Get RepairMaintenanceLog
     *
     * @returns {Promise<any>}
     */
    getRepairMaintenanceLog(): Promise<any>
    { 
    // Declare and Initialize Params Object
     let params = {};
         params["SessionId"] = localStorage.getItem('SessionId');
         params["KeyTrackingObject"] = this.routeParams.car;
         params["MaintenanceId"] =  this.routeParams.maintenance;
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER+'/MaintenanceManagementWCFService.svc/GetRepairMaintenanceLog' , JSON.stringify(params) , this.httpOptions)
                .subscribe((response: any) => {
                    this.repairMaintenanceLog = response;
                    this.onRepairMaintenanceLogChanged.next(this.repairMaintenanceLog);
                    resolve(response);
                },
                       (error: HttpErrorResponse) => {
                            //this.errorHandler.handleError(error);
                            console.log (error.name + ' ' + error.message);
                    }, reject);
        });
    }
}
