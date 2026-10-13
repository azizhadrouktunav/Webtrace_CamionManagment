import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { Tank } from 'app/main/parc/tank/model';
import { environment } from 'environments/environment';
import { map } from 'lodash';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TanksService  implements Resolve<any> {

  private readonly API_URL = environment.apiUrl;
  // Http Header
  httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
  }
  tanks: any[];
  onTanksChanged: BehaviorSubject<any>;
  departments: any[];
  private _http: any;
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
    this.onTanksChanged = new BehaviorSubject([]);
    
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
     return new Promise((resolve, reject) => {

         Promise.all([
             this.getDepartmentsOfCustomer(),
             this.getTanks()
         ]).then(
             () => {
                 resolve();
             },
             reject
         );
     });
 }
 /**
     * Get tanks
     *
     * @returns {Promise<any>}
     */
  getTanks(): Promise<any>
  {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.API_URL+ '/TanksMonitoringWCFService.svc/GetTanks', params, this.httpOptions)
              .subscribe((response: any) => {
                  this.tanks = response;
                  this.onTanksChanged.next(this.tanks);
                  resolve(response);
              }, 
              (error: HttpErrorResponse) => {
                ////this.errorHandler.handleError(error);
         }, reject);
      });
  }

  
  
  /**
     * Get tanks
     *
     * @returns {Promise<any>}
     */
   getDepartmentsOfCustomer(): Promise<any>
   {
     let params = {};
     params["SessionId"] = localStorage.getItem('SessionId');
       return new Promise((resolve, reject) => {
         this._httpClient.post(this.API_URL+ '/TanksMonitoringWCFService.svc/GetDepartmentsOfCustomer', params, this.httpOptions)
               .subscribe((response: any) => {
                   this.departments = response
                   this.departments = this.departments.map(dep => {return {id: dep.Id, name: dep.FullName}})
                   resolve(response);
               },
          (error: HttpErrorResponse) => {
               // //this.errorHandler.handleError(error);
         }, reject);
       });
   }
  public addTank(tank: any): Observable<any> 
  {  
      
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["Name"] = tank.name;
      params["FuelType"] = +tank.fuelType;
      params["FuelContainerCapacityInL"] = +tank.capacity;
      params["FuelLevelInL"] = +tank.fuelLevel;
      params["threshold_Refuelling"] = +tank.threshold_Refuelling;
      params["threshold_Draining"] = +tank.threshold_Draining;
      params["DepartmentId"] = tank.DepartmentId;
      return this._httpClient.post(this.API_URL+ '/TanksMonitoringWCFService.svc/AddTank', params, this.httpOptions);
  }

  public deleteTank(tank: Tank): Observable<any> {

    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["IdTrackingObject"] = tank.Id;
   
    return this._httpClient.post(this.API_URL+ '/TanksMonitoringWCFService.svc/DeleteTank', params, this.httpOptions);
    //  .subscribe((data: boolean) => {
    //     if(data == true) {
    //       this._matSnackBar.open('Tank '+ tank.Name +' deleted successfully!', '', {duration: 2500});
    //       const Index = this.tanks.indexOf(tank);
    //       this.tanks.splice(Index, 1);

    //       this.onTanksChanged.next(this.tanks);
    //     }
    //     else if(data == false) {
    //       this._matSnackBar.open('Tank '+ tank.Name +' is equipped you cannot remove it!', '', {duration: 2500});
    //     }
    // },
    // (error: HttpErrorResponse) => {
    //   //this.errorHandler.handleError(error);
    // })
    }
 public editTank(tank: any) : Observable<any> {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["Id"] = tank.id;
    params["Name"] = tank.name;
    params["FuelType"] = +tank.fuelType;
    params["FuelContainerCapacityInL"] = +tank.capacity;
    params["FuelLevelInL"] = +tank.fuelLevel;
    params["threshold_Refuelling"] = +tank.threshold_Refuelling;
    params["threshold_Draining"] = +tank.threshold_Draining;
    params["DepartmentId"] = tank.DepartmentId;
    return this._httpClient.post(this.API_URL+ '/TanksMonitoringWCFService.svc/EditTank', params, this.httpOptions);
 }
}
