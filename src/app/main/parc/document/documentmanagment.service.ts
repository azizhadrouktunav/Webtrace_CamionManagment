import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { decrypt } from '../Parc';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { MatSnackBar } from '@angular/material';
import { Document } from './documentModel';
import { isNullOrUndefined } from 'util';
import { json2array } from 'app/main/helpers/must-match.validator';

@Injectable({
  providedIn: 'root'
})

export class DocumentmanagmentService implements Resolve<any> {

  
  private readonly API_URL = environment.apiUrl + '/';
  //dataR: { SessionId: any; keyTrackingObject: any; CarDocumentReminderId: any; };
 
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  documentslog: any[] = [];
  routeParams:any;
  id: number;
  onDocumentsChanged: BehaviorSubject<any>;
  documents: any = [];
  TrackingObject: BehaviorSubject<any>;
  documentmanagmentParam: any;
  trackingObject : any;
  types: number[]
  constructor(private http: HttpClient,
              private _errorHandler: ErrorHandlerService,
              private _matSnackBar : MatSnackBar,
              private _route : Router) {
    this.onDocumentsChanged = new BehaviorSubject([]);
    this.TrackingObject = new BehaviorSubject({});
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
      this.routeParams = route.paramMap;
        return this.getUICarDocumentManagementParam()
    } 
   // params
   getUICarDocumentManagementParam(): Observable<any>
   {
      // Declare and Initialize Params Object
    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    
    return this.http.post(this.API_URL + 'UICarDocumentManagementWCFService.svc/GetUICarDocumentManagementParam', params,
         this.httpOptions);
      
   }
 

     
changeTrackingObject(myChange) {
  this.TrackingObject.next(myChange);
}

getTrackingObject() {
  return this.TrackingObject.asObservable();
}
// get types
getTypes(): number[]{
  return this.types;
}
// get reminder
  getCarDocumentReminder(keyTrackingObject:number) : Promise<any>{
    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    params['keyTrackingObject'] = keyTrackingObject;
     return new Promise((resolve, reject) => {
      this.http.post(this.API_URL+'UICarDocumentManagementWCFService.svc/GetCarDocumentReminder',
      params, this.httpOptions)
      .subscribe((response: any) => {
        this.documents = response;      
        this.documents = this.documents.map(document => {
          return new Document(document);
        })
        this.types = this.documents.map(doc => {return doc.DocumentType})
        this.onDocumentsChanged.next(this.documents);
        //resolve(response);

      }, reject);
    });         
  }

  addOrUpdateCarDocumentReminder(data,document?) : Promise<any> {
    const Index = !isNullOrUndefined(document) ? this.documents.indexOf(document) : -1;
    let params = {};
    let keyTrackingObject ;
  this.getTrackingObject().subscribe(data => {
     keyTrackingObject = data
  });
      params["SessionId"] = localStorage.getItem('SessionId');
      params["keyTrackingObject"] = keyTrackingObject;
      params["DocumentTypeEnum"] = data.DocumentTypeEnum;
      params["RecurringMode"] = data.RecurringMode;
      params["BeginStartRecurringDateLocal"] =  data.BeginStartRecurringDateLocal ;
      params["WarnMeBeforeNDay"] = data.WarnMeBeforeNDay;
      params["EnableGenerateAlert"] = true;
      params["EnabledDayOfWeekes"] = data.EnabledDayOfWeekes;
      params["RecuringFrequencyNYearMonthWeekDay"] = data.number;
      return new Promise((resolve, reject) => {
        this.http.post(this.API_URL + 'UICarDocumentManagementWCFService.svc/AddOrUpdateCarDocumentReminder', params, this.httpOptions)
            .subscribe((response : any) => {
               if(typeof(response) === 'object' && response !== 'null') {
                  let newDocument = new Document(response);
                  if ( Index !== -1 ){
                    this.documents.splice(Index, 1, newDocument);
                    // Show the success message
                  this._matSnackBar.open('The document was updated', 'OK', {
                    // here specify the position
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right',
                    duration        : 2000
                    });
                    }
                    else {
                      this.documents.unshift(newDocument)
                      // Show the success message
                    this._matSnackBar.open('The document was added', 'OK', {
                      // here specify the position
                      verticalPosition: 'bottom',
                      horizontalPosition: 'right',
                      duration        : 2000
                      });
                    }
                this.onDocumentsChanged.next(this.documents);
                resolve(response);   
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
          error => {
            console.info(error);
            // Show the failure message
          if(error.error == "Session was terminated")
        {
          this._matSnackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(()=>{
            this._route.navigate(['app-auth']);
          });
        } 
        else {
            this._matSnackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });}
          });
    })
  }
  removeCarDocumentReminder(document) : Promise<any>
  {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["keyTrackingObject"] = document.Car;
    params["CarDocumentReminderId"] = document.Id;
    return new Promise((resolve, reject) => {
      this.http.post( this.API_URL + 'UICarDocumentManagementWCFService.svc/DeleteCarDocumentReminder', params, this.httpOptions)
          .subscribe((response: any) => {
            if(response){
              const Index = this.documents.indexOf(document);
              this.documents.splice(Index, 1);
              this.onDocumentsChanged.next(this.documents);
                 // Show the success message
             this._matSnackBar.open('The document was deleted', 'OK', {
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
                this._route.navigate(['app-auth']);
              });
            } 
            else {
           this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right' ,
            duration  : 8000
             });}
            })
      }) 
    }
                            
// adjust
  adjustCarDocumentLog(data, document: Document) : Promise<any>
    { const Index = !isNullOrUndefined(document) ? this.documents.indexOf(document) : -1;
      let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["keyTrackingObject"] = document.Car;
    params["IdCarDocumentReminder"] = document.Id;
    params["CostString"] = data.Cost;
    params["DateAvailableFromLocal"] ='/Date(' + data.DateAvailableFromLocal.getTime() + ')/';
    params["DateAvailableToLocal"] = '/Date(' + data.DateAvailableToLocal.getTime() + ')/';
    params["Description"] =data.Description;
    params["InvoiceReference"] = data.InvoiceReference;
    params["PaidCostString"] = data.PaidCost;
    params["PaidDateLocal"] = '/Date(' + data.PaidDateLocal.getTime() + ')/';
    params["Supplier"] = data.Supplier;
 return new Promise((resolve, reject) => {
  this.http.post(this.API_URL + 'UICarDocumentManagementWCFService.svc/ConfirmCarDocumentReminderImplementation', params, this.httpOptions)
      .subscribe((response : any) => {
         if(typeof(response) === 'object' && response !== 'null') {
               let newDocument = new Document(response);
               resolve(newDocument);
               this.documents.splice(Index, 1, newDocument);
               this.onDocumentsChanged.next(this.documents);
              // Show the success message
            this._matSnackBar.open('The document was adjusted successfully', 'OK', {
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
    (error: any) => {
      if(error instanceof HttpErrorResponse) {
         //this.errorHandler.handleError(error);.handleError(error);
      }
      reject
      // Show the failure message
      this._matSnackBar.open('Server is Not Responding', 'OK', {
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        duration        : 2000
        });
    });
})
    }
}


