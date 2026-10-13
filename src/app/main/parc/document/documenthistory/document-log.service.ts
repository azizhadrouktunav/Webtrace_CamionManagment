import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { DocumentLogModel } from '../documentModel';

@Injectable()
export class DocumentLogService implements Resolve<any>{

  routeParams: any;
  onDocumentLogChanged: BehaviorSubject<any>;
  documentlogs: any;
  private readonly API_URL = environment.apiUrl + '/';
  // Http Header
  private readonly httpOptions = {
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
      private _httpClient: HttpClient,
      private _matSnackBar : MatSnackBar,
      private _errorHandler: ErrorHandlerService,
      private _router: Router
  )
  {
      // Set the defaults
      this.onDocumentLogChanged = new BehaviorSubject([]);
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
                this.getDocumentLogs()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }
    // get log
    getDocumentLogs(): Promise<any>
    {
     let params = {};
     params["SessionId"] = localStorage.getItem('SessionId');
     params["keyTrackingObject"] = +this.routeParams.car;
     params["IdCarDocumentReminder"] = +this.routeParams.documentId;
     return new Promise((resolve, reject) => {
            this._httpClient.post(this.API_URL + 'UICarDocumentManagementWCFService.svc/GetCarDocumentLog' , params , this.httpOptions)
                .subscribe((response: any) => {
                    this.documentlogs = !isNullOrUndefined(response) ? response : [];
                    this.documentlogs = this.documentlogs.map(log => {
                      return new DocumentLogModel(log);
                    });
                    this.onDocumentLogChanged.next(this.documentlogs);
                    resolve(response);
                },
                (error: HttpErrorResponse) => {
                  //this.errorHandler.handleError(error);.handleError(error);
                  console.log (error.name + ' ' + error.message);
                },reject);
        });
    }
    // delete log 
  deleteCarDocumentLog(log) : Promise<any>
  {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["keyTrackingObject"] = log.Car;
    params["IdCarDocumentReminder"] = +this.routeParams.documentId;
    params["IdCarDocumentLog"] = log.Id;
    return new Promise((resolve, reject) => {
      this._httpClient.post( this.API_URL + 'UICarDocumentManagementWCFService.svc/DeleteCarDocumentLog', params, this.httpOptions)
          .subscribe((response: any) => {
            if(response){
              const Index = this.documentlogs.indexOf(log)
              this.documentlogs.splice(Index, 1);
              this.onDocumentLogChanged.next(this.documentlogs);
                 // Show the success message
             this._matSnackBar.open('The log was deleted', 'OK', {
               // here specify the position
               verticalPosition: 'bottom',
               horizontalPosition: 'right',
               duration        : 2000
               });
             }
           else{
                 // Show the failure message
                 this._matSnackBar.open('Server is Not Responding', 'OK', {
                   // here specify the position
                   verticalPosition: 'bottom',
                   horizontalPosition: 'right',
                   duration        : 2000
                   });
           }
          },
           (err: HttpErrorResponse) => {

            // Show the failure message 
             if(err.error == "Session was terminated")
        {
          this._matSnackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(()=>{
            this._router.navigate(['app-auth']);
          });
        } 
        else{
           this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right' ,
            duration  : 8000
             });}
            })
      }) 
    }
  // edit log
  editCarDocumentLog(data) : Promise<any[]>
  { const Index = this.documentlogs.indexOf(data);
    let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["keyTrackingObject"] = +this.routeParams.car;
  params["IdCarDocumentReminder"] = +this.routeParams.documentId;
  params["CostString"] = data.Cost.toString();
  params["DateAvailableFromLocal"] ='/Date(' + data.DateAvailableFromLocal.getTime() + ')/';
  params["DateAvailableToLocal"] = '/Date(' + data.DateAvailableToLocal.getTime() + ')/';
  params["Description"] = data.Description;
  params["InvoiceReference"] = data.InvoiceReference;
  params["PaidCostString"] = data.PaidCost.toString();
  params["PaidDateLocal"] = '/Date(' + data.PaidDateLocal.getTime() + ')/';
  params["Supplier"] = data.Supplier;
  params["IdCarDocumentLog"] = data.IdCarDocumentLog;
  return new Promise((resolve, reject) => {
      this._httpClient.post(this.API_URL+ 'UICarDocumentManagementWCFService.svc/UpdateCarDocumentLog', params, this.httpOptions)
          .subscribe((response: any) => {
            if(response !== 'null'){
              this.documentlogs.splice(Index, 1, new DocumentLogModel(response));
             
              this.onDocumentLogChanged.next(this.documentlogs);
                 // Show the success message
             this._matSnackBar.open('The log was updated', 'OK', {
               // here specify the position
               verticalPosition: 'bottom',
               horizontalPosition: 'right',
               duration        : 2000
               });
             }
           else{
                 // Show the failure message
                 this._matSnackBar.open('Server is Not Responding', 'OK', {
                   // here specify the position
                   verticalPosition: 'bottom',
                   horizontalPosition: 'right',
                   duration        : 2000
                   });
           }
          },
           (err: HttpErrorResponse) => {
            if(err.error == "Session was terminated")
            {
              this._matSnackBar.open("votre session est expirée!", "s'identifier", {
                duration: 10000
              }).afterDismissed().subscribe(()=>{
                this._router.navigate(['app-auth']);
              });
            } 
            else{
               this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right' ,
                duration  : 8000
                 });}
                
                })
          })                                            
         
  }
    // add log
    addCarDocumentLog(data) : Promise<any[]>
    {
     
    let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["keyTrackingObject"] = +this.routeParams.car;
  params["IdCarDocumentReminder"] = +this.routeParams.documentId;
  params["CostString"] = data.Cost.toString();
  params["DateAvailableFromLocal"] ='/Date(' + data.DateAvailableFromLocal.getTime() + ')/';
  params["DateAvailableToLocal"] = '/Date(' + data.DateAvailableToLocal.getTime() + ')/';
  params["Description"] = data.Description;
  params["InvoiceReference"] = data.InvoiceReference;
  params["PaidCostString"] = data.PaidCost.toString();
  params["PaidDateLocal"] = '/Date(' + data.PaidDateLocal.getTime() + ')/';
  params["Supplier"] = data.Supplier;

    return new Promise((resolve, reject) => {
      this._httpClient.post(this.API_URL+ 'UICarDocumentManagementWCFService.svc/AddCarDocumentLog', params, this.httpOptions)
          .subscribe((response: any) => {
            if(response !== 'null'){
              this.documentlogs.unshift(new DocumentLogModel(response));
              //this.documentlogs.splice(Index, 1, new DocumentLogModel(response));
             
              this.onDocumentLogChanged.next(this.documentlogs);
                 // Show the success message
             this._matSnackBar.open('The log was updated', 'OK', {
               // here specify the position
               verticalPosition: 'bottom',
               horizontalPosition: 'right',
               duration        : 2000
               });
             }
           else{
                 // Show the failure message
                 this._matSnackBar.open('Server is Not Responding', 'OK', {
                   // here specify the position
                   verticalPosition: 'bottom',
                   horizontalPosition: 'right',
                   duration        : 2000
                   });
           }
          },
           (err: HttpErrorResponse) => {
            // Show the failure message 

            if(err.error == "Session was terminated")
            {
              this._matSnackBar.open("votre session est expirée!", "s'identifier", {
                duration: 10000
              }).afterDismissed().subscribe(()=>{
                this._router.navigate(['app-auth']);
              });
            } 
            else{
               this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right' ,
                duration  : 8000
                 });}
                
            })
      })                                            
  }
}
