
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Connection, hubConnection, Proxy, signalR } from 'signalr-no-jquery';
import { environment } from 'environments/environment'
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMessageComponent } from '../helpers/snackbar-message/snackbar-message.component';
import { ErrorHandlerService } from '../error-pages/error-handler.service';
import { isNullOrUndefined } from 'util';
import { filter, isEmpty } from 'lodash';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Alert, Tank } from '../tank-monitor/tank-monitor.component';
const signalRServerEndPoint =
    environment.iconUrl+'signalr';
@Injectable()
export class MobiletankService  {

    public data: Tank[];
    public alerts: Alert[];
    public signalrConnection: Connection = hubConnection(signalRServerEndPoint, { logging: true, useDefaultPath: false });
    public hub: Proxy = this.signalrConnection.createHubProxy('messagesHub');
    signalReceived: EventEmitter<any[]> = new EventEmitter<any[]>();
    showNotification: Subject<boolean>;
    onAlertsChanged: Subject<any>;
    private readonly API_URL = environment.apiUrl;
    // Http Header
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    constructor(private _http: HttpClient,
                private errorHandler : ErrorHandlerService)  {
        // create connection
       
        this.showNotification = new Subject();
        this.onAlertsChanged = new Subject();
     }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */

    

     startConnection() {
  
         if(isNullOrUndefined(this.signalrConnection.id)) {
           
            this.hub.on('displayMobileTank', (res) => {
                
                this.signalReceived.emit(res);
            });
    
            this.hub.on('sendAlert', (res) => {
            var alert = new Alert(res);
            var index = this.alerts.findIndex(x => x.Id == alert.Id);

             if(index == -1) {
                this.alerts.unshift(alert);
            
                this.onAlertsChanged.next(this.alerts);
                this.showNotification.next(true);

             }  

             else {
                console.log("object already exists");
             }
                  
            });
    
              
               setTimeout(() => {
                this.signalrConnection.start({ transport: ['serverSentEvents', 'longPolling'], withCredentials: false }).done(() => { 
                   
                     console.log('Now connected, connection ID=' + this.signalrConnection.id);
                      this.getAllTanks().then(() => {
                          //this.GetAlerts();
                      });
         
                   })  
                   .fail(function (e) {
                     console.log('Error while establishing connection, retrying...', e); 
                 
                 });
               }, 3000);
                
           
         }
                  else {
            this.getAllTanks().then(() => {
                //this.GetAlerts();
            });
         }
      }  
    
    private getAllTanks() : Promise<any> {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');

        return new Promise((resolve, reject) => {
            this._http.post(this.API_URL+ '/MobileTanksWCFService.svc/GetAllMobileTanks', params, this.httpOptions)
            .pipe(shareReplay(1))
            .subscribe((res: any)=> {
            
                    //this.data = res.map(t => new Tank(t))
                    this.signalReceived.emit(res);
                    resolve(res);
                },
                (error: HttpErrorResponse) => {
                    //this.errorHandler.handleError(error);
               },
                reject);
        });
    }
    public getCarsOfCustomer(): Observable<any> 
    {  
        
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        
        return this._http.post(this.API_URL+ '/MobileTanksWCFService.svc/GetCarsOfCustomer', params, this.httpOptions);
    }
    public addTank(tank: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Name"] = tank.name;
        params["Equipment"] = +tank.equipment;
        params["threshold_Refuelling"] = 0;
        params["threshold_Draining"] =0;
        params["SNSonde"] = tank.sn;
        params["Capacity"] = +tank.capacity;

        return this._http.post(this.API_URL+ '/MobileTanksWCFService.svc/AddMobileTank', params, this.httpOptions);
    }
    public editTank(tank: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Id"] = tank.id;
        params["Name"] = tank.name;
        params["Equipment"] = +tank.equipment;
        params["threshold_Refuelling"] = 0;
        params["threshold_Draining"] =0;
        params["SNSonde"] = tank.sn;
        params["Capacity"] = +tank.capacity;

        return this._http.post(this.API_URL+ '/MobileTanksWCFService.svc/EditMobileTank', params, this.httpOptions);
    }
    public removeTank(tank: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Id"] = tank.Id;

        return this._http.post(this.API_URL+ '/MobileTanksWCFService.svc/DeleteTank', params, this.httpOptions);
    }
    public getmobileTanks(): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');

        return this._http.post(this.API_URL+ '/MobileTanksWCFService.svc/GetMobileTanks', params, this.httpOptions);
    }
    public GetReportDatas(car,start,end) {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params['StartDateTimeGMT'] = '/Date(' + start.getTime() + ')/';
        params['EndDateTimeGMT'] =  '/Date(' + end.getTime() + ')/';
        params["serialNumber"] = car;

        
         return this._http.post(this.API_URL+ '/MobileTanksWCFService.svc/GetHistory', params, this.httpOptions);
            
    }
    getFuelTimeReport(tank , startdate,  enddate,fuel, fuelcost  ): Observable<any[]>
    
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
     

      return      this._http.post(this.API_URL +
           '/ReportingWCFServiceNtSoft.svc/GetFuelTimeReportCompressed',
            JSON.stringify(params), this.httpOptions).pipe(
              map((data: any[]) => {
                return data;
              }), catchError( error => {
                return throwError( 'data not found!' );
              })
           )                
 
    }

    GetDataOfMobileTank(tank , startdate,  enddate ): Observable<any[]>
    
    {
      let params = {};
      let cars = [];
    
      
      params['SessionId'] = localStorage.getItem('SessionId');
      
      params['IdTank'] = tank;
      params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
      params['EndDateTimeGMT'] =  '/Date(' + enddate.getTime() + ')/';
      
     

      return      this._http.post(this.API_URL +
           '/ReportingWCFServiceNtSoft.svc/GetDataOfMobileTankCompressed',
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
      
      return  this._http.post(this.API_URL +
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

