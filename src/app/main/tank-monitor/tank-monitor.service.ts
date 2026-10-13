import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Connection, hubConnection, Proxy, signalR } from 'signalr-no-jquery';
import { environment } from 'environments/environment'
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alert, Tank } from './tank-monitor.component';
import { SnackbarMessageComponent } from '../helpers/snackbar-message/snackbar-message.component';
import { ErrorHandlerService } from '../error-pages/error-handler.service';
import { isNullOrUndefined } from 'util';
import { filter, isEmpty } from 'lodash';
import { catchError, map, shareReplay } from 'rxjs/operators';
const signalRServerEndPoint =
    environment.iconUrl+'signalr';
@Injectable()
export class TankMonitorService  {

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
       
       // this.signalrConnection = hubConnection(signalRServerEndPoint, { logging: true, useDefaultPath: false });
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
    // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  any {

    //     return new Promise((resolve, reject) => {

    //         Promise.all([
              
    //            this.startConnection()
    //         ]).then(
    //             (data) => {
    //                 resolve(data);
    //             },
    //             reject
    //         );
    //     });
    // }
    

     startConnection() {
  
         if(isNullOrUndefined(this.signalrConnection.id)) {
           
            this.hub.on('displayNotification', (res) => {
                
                this.data = res.map(t => new Tank(t))
                
                this.signalReceived.emit(this.data);
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
                    // this._matSnackBar.openFromComponent(SnackbarMessageComponent, {
                    //     data : {
                    //         checkable: true,
                    //         text: alert.Event+  ' ' + alert.FuelLevel + " % "
                    //                           +' Total fuel in '+ alert.TankName +' ' + alert.TotalFuel + " % "
                    //                           + ' at '+ alert.AcquisitionTime,
                    //         action: 'Close',
                    //         icon: 'warning',
                    //         verticalPosition: 'bottom',
                    //         horizontalPosition: 'right',
                    //     }
                    // });
            });
    
              
               setTimeout(() => {
                this.signalrConnection.start({ transport: ['serverSentEvents', 'longPolling'], withCredentials: false }).done(() => { 
                    // do some initialization once you know the connection has been started
                     // For instance, call a method on the server
                     // Call the Send method on the hub.
                     console.log('Now connected, connection ID=' + this.signalrConnection.id);
                      this.getAllTanks().then(() => {
                          this.GetAlerts();
                      });
         
                   })  
                   .fail(function (e) {
                     console.log('Error while establishing connection, retrying...', e); 
                     // this.signalrConnection.disconnected(() => {
                     //     this.signalrConnection.start({ transport: ['serverSentEvents', 'longPolling'], withCredentials: false });
                     //     });
     
                 });
               }, 3000);
                
           
         }
                  else {
            this.getAllTanks().then(() => {
                this.GetAlerts();
            });
         }
      }  
    
    private getAllTanks() : Promise<any> {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');

        return new Promise((resolve, reject) => {
            this._http.post(this.API_URL+ '/TanksMonitoringWCFService.svc/GetAllTanks', params, this.httpOptions)
            .pipe(shareReplay(1))
            .subscribe((res: any)=> {
            
                    this.data = res.map(t => new Tank(t))
                    console.log('getAllTanks');
                    this.signalReceived.emit(this.data);
                    resolve(res);
                },
                (error: HttpErrorResponse) => {
                    //this.errorHandler.handleError(error);
               },
                reject);
        });
    }

    public GetAlerts() {
        let params = {};
        params["SessionId"] = localStorage.getItem('SessionId');
         this._http.post(this.API_URL+ '/TanksMonitoringWCFService.svc/GetAlerts', params, this.httpOptions)
            .subscribe((res: any)=> {
        
                this.alerts = res.map(t => new Alert(t));
                this.onAlertsChanged.next(this.alerts);
            },
            (error: HttpErrorResponse) => {
                //this.errorHandler.handleError(error);
         });
    }

    
}

