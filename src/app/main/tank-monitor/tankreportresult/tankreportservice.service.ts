import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class TankreportserviceService 
{
    routeParams: any;
    gpsData: any;
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
    }

   

   
 
    getHistoryByDate( startdate,  enddate,fuel, fuelcost  )
    
    {
      let params = {};
      let cars = [];
      
      params['SessionId'] = localStorage.getItem('SessionId');
      params["serialNumber"] = 868789022534282;
      params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
      params['EndDateTimeGMT'] =  '/Date(' + enddate.getTime() + ')/';
      params['OnlyCustomerPlaceReference'] =false;
      params['FilledQuantityInPercentMoreThan'] = +fuel;
      params['PriceByLiter'] =+fuelcost;
     

      return      this._httpClient.post(this.API_URL+ '/TanksMonitoringWCFService.svc/GetHistory2',
            JSON.stringify(params), this.httpOptions).pipe(
              map((data: any[]) => {
                return data;
              }), catchError( error => {
                return throwError( 'data not found!' );
              })
           )                
 
    }

    getFuelTimeTank(tank , startdate,  enddate,fuel, fuelcost  ): Observable<any[]>
    
    {
      let params = {};
      let cars = [];
    
      
      params['SessionId'] = localStorage.getItem('SessionId');
      params['KeyTrackingObject'] = tank;
      params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
      params['EndDateTimeGMT'] =  '/Date(' + enddate.getTime() + ')/';
      params['OnlyCustomerPlaceReference'] =false;
      params['FilledQuantityInPercentMoreThan'] = fuel;
      params['PriceByLiter'] =fuelcost;
     

      return      this._httpClient.post(this.API_URL +
           '/ReportingWCFServiceNtSoft.svc/GetFuelTimeTankCompressed',
            JSON.stringify(params), this.httpOptions).pipe(
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
      
      return  this._httpClient.post(this.API_URL +
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

  
  
  