import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Operation } from '../model';
import { MatSnackBar } from '@angular/material';
import { GestionDesVehiculesService } from '../gestion-des-vehicules.service';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class OperationService implements Resolve<any> {

  routeParams: any;
  onOperationsChanged: BehaviorSubject<any>;
  operations: any[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  private GeneralURL = environment.apiUrl + '/CarManagementWCFService.svc';
  data: any;
   /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient,
      private errorHandler : ErrorHandlerService,
      private _matSnackBar: MatSnackBar,
      private _vehicleService: GestionDesVehiculesService,
      private translateService: TranslateService,
  )
  {
      // Set the defaults
      this.onOperationsChanged = new BehaviorSubject([]);

      this.translateService.get(['NAV.OperationEdit', 'NAV.OperationRemove'])
        .subscribe(data => { this.data = data }
        );
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
      
      this.routeParams = route.params;
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getOperations()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }
     /**
     * Get operations
     *
     * @returns {Promise<any>}
     */
  getOperations() : Promise<any>{
    
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["IdTrackingObj"] = +this.routeParams.id;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.GeneralURL}/GetCarLog` , params, this.httpOptions)
          .subscribe((response: any) => {
            this.operations = response.map(item => { return new Operation(item , 
              this._vehicleService.drivers, this._vehicleService.departments, this._vehicleService.acounts );});
              this.onOperationsChanged.next(this.operations);
              resolve(this.onOperationsChanged);
          },
          (error: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);
     }, reject);
  });
  }
   /**
     * Add operation
     *
     * @param operation
     * @returns {Promise<any>}
     */
    addOpration(operation: Operation){
     
    }
    /** It work perfectly
       * Edit operation
       * 
       * @param operation
       * @returns {Promise<any>}
       */
    editOperation(operation) : Promise<any>{
      const op = this.operations.find((_op) => {
        return _op.Id = operation.id;
      });
      const index = this.operations.indexOf(op);
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["IdTrackingObj"] = this.routeParams.id;
      params['IdCarLog'] = operation.id;
      params['CarOperationTypeEnum'] = operation.type;
      params['OperationMileage'] = operation.mileage;
      params['OperationCost'] = operation.cost;
      params['Driver'] = operation.driver;
      params['Department'] = operation.department;
      params['AccountWorkedBy'] = operation.accountWorkedBy;
      params['Description'] = operation.description;
      params['Comment'] = operation.comment;
      params['OperationDateGmt'] = !isNullOrUndefined(operation.operationDate) ? convertToJSONDate(operation.operationDate) : null;
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.GeneralURL}/UpdateCarLog` , params, this.httpOptions)
            .subscribe(response => {
              let operation = new Operation(response,  this._vehicleService.drivers, 
                this._vehicleService.departments, this._vehicleService.acounts);
        
                this.operations[index] = Object.assign(this.operations[index], operation);
                this.onOperationsChanged.next(this.operations);
                resolve(this.onOperationsChanged);
                      // Show the success message
                      this._matSnackBar.open(this.data['NAV.OperationEdit'], 'OK', {
                              // here specify the position
                              verticalPosition: 'bottom',
                              horizontalPosition: 'right',
                              duration        : 2000
                        });
            },
            error => {
              console.info(error);
              // Show the failure message
              this._matSnackBar.open('Server is Not Responding', 'OK', {
                    // here specify the position
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right',
                    duration        : 2000
                });   
            }, reject);
    });
    }
  /**
     * Delete operation
     *
     * @param operation
     * @returns {Promise<any>}
     */
    deleteOperation(operation: Operation): Promise<any>{  
      const index = this.operations.indexOf(operation);
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params['IdCarLog'] = operation.Id;
     return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.GeneralURL}/DeleteCarLog` , params, this.httpOptions)
      .subscribe((response: Boolean) => {
        if(response){
        this.operations.splice(index, 1);
        this.onOperationsChanged.next(this.operations);
        resolve(this.onOperationsChanged);
            // Show the success message
         this._matSnackBar.open('Operation was deleted', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
        });
        }
       else {
            // Show the failure message
       this._matSnackBar.open(this.data['NAV.OperationRemove'], 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
        });
        }
      },
      (error: HttpErrorResponse) => {
        console.info(error.message);
         // Show the failure message
         this._matSnackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
          });
     }, reject)
     });
    }
}
