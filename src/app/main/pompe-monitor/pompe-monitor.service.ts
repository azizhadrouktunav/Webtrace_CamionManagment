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
import { Alert } from '../tank-monitor/tank-monitor.component';
const signalRServerEndPoint =
    environment.iconUrl+'signalr';
@Injectable()
export class PompeMonitorService  {


    public data = [];
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
           
            this.hub.on('displayPumps', (res) => {
                
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
                      this.getAllPompes().then(() => {
                          //this.GetAlerts();
                      });
         
                   })  
                   .fail(function (e) {
                     console.log('Error while establishing connection, retrying...', e); 
                 
                 });
               }, 3000);
                
           
         }
                  else {
            this.getAllPompes().then(() => {
                //this.GetAlerts();
            });
         }
      }  
    
    private getAllPompes() : Promise<any> {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');

        return new Promise((resolve, reject) => {
            this._http.post(this.API_URL+ '/PumpWCFService.svc/GetPumps', params, this.httpOptions)
            .pipe(shareReplay(1))
            .subscribe((res: any)=> {
            
                    //this.data = res.map(t => new Pompe(t))
                    this.signalReceived.emit(res);
                    resolve(res);
                },
                (error: HttpErrorResponse) => {
                    //this.errorHandler.handleError(error);
               },
                reject);
        });
    }
    
    public addPompe(Pompe: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Name"] = Pompe.name;
        params["GasStationAttendantId"] = Pompe.pompiste;
        params["Equipment"] = Pompe.equipment;

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/AddPump', params, this.httpOptions);
    }
    public editPompe(Pompe: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Id"] = Pompe.id;
        params["Name"] = Pompe.name;
        params["GasStationAttendantId"] = Pompe.pompiste;
        params["Equipment"] = Pompe.equipment;

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/EditPump', params, this.httpOptions);
    }
    public removePompe(Pompe: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Id"] = Pompe.Id;

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/DeletePump', params, this.httpOptions);
    }
    public getPompes(): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/GetPump', params, this.httpOptions);
    }
    public GetReportDatas(car,start,end) {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params['StartDateTimeGMT'] = '/Date(' + start.getTime() + ')/';
        params['EndDateTimeGMT'] =  '/Date(' + end.getTime() + ')/';
        params["serialNumber"] = car;

        
         return this._http.post(this.API_URL+ '/MobilePompesWCFService.svc/GetHistory', params, this.httpOptions);
            
    }
    getFuelTimeReport(Pompe , startdate,  enddate,fuel, fuelcost  ): Observable<any[]>
    
    {
      let params = {};
      let cars = [];
    
      
      params['SessionId'] = localStorage.getItem('SessionId');
      params['KeyTrackingObject'] = Pompe;
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

    public addPompiste(Pompiste: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["FirstName"] = Pompiste.firstname;
        params["LastName"] = Pompiste.lastname;
        params["CardId"] = Pompiste.CardId;
      
        return this._http.post(this.API_URL+ '/PumpWCFService.svc/AddGasStationAttendant', params, this.httpOptions);
    }
    public editPompiste(Pompiste: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Id"] = Pompiste.id;
        params["FirstName"] = Pompiste.firstname;
        params["LastName"] = Pompiste.lastname;
        params["CardId"] = Pompiste.CardId;

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/EditGasStationAttendant', params, this.httpOptions);
    }
    public removePompiste(Pompiste: any): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["Id"] = Pompiste.Id;

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/DeleteGasStationAttendant', params, this.httpOptions);
    }
    public getPompistes(): Observable<any> 
    {  
         
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/GetGasStationAttendant', params, this.httpOptions);
    }
    getPupmReport(serialNumber: any, startdate: any, enddate: any) {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
        params["serialNumber"] = serialNumber;
        params["startDate"] = '/Date(' + startdate.getTime() + ')/';;
        params["endDate"] = '/Date(' + enddate.getTime() + ')/';;

        return this._http.post(this.API_URL+ '/PumpWCFService.svc/GetHistory', params, this.httpOptions);      }
   

    
    
}

