import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { decrypt } from 'app/main/parc/Parc';
import { environment } from 'environments/environment';
import { isEmpty } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { GpsData } from '../trajectory/trajectory.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RunStopStateService {

 runStopStates: GpsData[] = [];
 response : any;
 private REST_API_SERVER = environment.apiUrl;
 // Http Header
 httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
  onRunStopStatesChanged: BehaviorSubject<any>;

   /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient,
      private _errorHandler: ErrorHandlerService
  )
   { 
      // Set the defaults
      this.onRunStopStatesChanged = new BehaviorSubject([]);
   }

    /**
     * Get RunStopStateCompressed
     *
     * @returns {Promise<any>}
     */
    getRunStopStates(keyTrackingObject: number, startDateTimeGMT: Date, endDateTimeGMT: Date): Promise<any>
    {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["KeyTrackingObject"] = keyTrackingObject;
      params["StartDateTimeGMT"] = convertToJSONDate(startDateTimeGMT); //"/Date(1597878000000)/"; 
      params["EndDateTimeGMT"] =  convertToJSONDate(endDateTimeGMT); 
        return new Promise((resolve, reject) => {
          return this._httpClient.post(this.REST_API_SERVER + '/TrackingPageWCFServiceNewtonSoft.svc/GetRunStopStateCompressed',params , this.httpOptions)
                .subscribe((response: any) => {
                   this.response = decrypt(response);
                   this.runStopStates = !isEmpty(this.response) ? this.response.AllExtendedGpsDataStopRunState : [];
                  this.onRunStopStatesChanged.next(this.runStopStates);
                    resolve(this.response);
                },
                (err : HttpErrorResponse) => {
                    //this.errorHandler.handleError(error);.handleError(err);
                },reject);
        });
    }
    getRunStopStatesManyCar(keyTrackingObject: number [], startDateTimeGMT: Date, endDateTimeGMT: Date): Observable<any>
    {
      
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["KeyTrackingObjects"] = keyTrackingObject;
      params["StartDateTimeGMT"] = convertToJSONDate(startDateTimeGMT); //"/Date(1597878000000)/"; 
      params["EndDateTimeGMT"] =  convertToJSONDate(endDateTimeGMT); 
      return this._httpClient.post(this.REST_API_SERVER + '/TrackingPageWCFServiceNewtonSoft.svc/GetRunStopStateManyrackingObjectsCompressed',params , this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError( error => {
          return throwError( 'data not found!' );
        })
     )                
 

     
    }
    ExportReport (ReportDataSourceCompressed : string,TypeExport:string,TypeReport : number):Observable<string>
    {

     
      // Declare and Initialize Params Object
      let params = {};
      
      params['SessionId'] = localStorage.getItem('SessionId');
      params['ReportDataSourceCompressed'] = ReportDataSourceCompressed;
      params['TypeExport'] =  TypeExport;
      params['TypeReport']= TypeReport;
      
      return  this._httpClient.post(this.REST_API_SERVER +
           '/CommonWCFService.svc/ExportReportNew', 
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: string) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )                
    }
}
