import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { json2array } from 'app/main/helpers/must-match.validator';
import { showSnackBar } from 'app/main/helpers/validators/validators';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import { decrypt } from 'app/main/parc/Parc';
import { environment } from 'environments/environment';
import { isEmpty } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, filter, repeatWhen, take } from 'rxjs/operators';
import { CommandService } from '../commands/commandService ';

@Injectable()
// ({
//   providedIn: 'root'
// })
export class GeofenceService {

  private REST_API_SERVER = environment.apiUrl
  // Http Header
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
  onVehiclesChanged: BehaviorSubject<any>;
  onZoneGeogenceChanged : BehaviorSubject<any>;
  onLeftSidenavViewChanged: Subject<any>;
  trakingObject: Subject<number>
  vehicles : any[];
  zoneGeogence : {'GetZoneGeofenceResult' :
    {
      Key : string ,
      Value : Object 
    }[]
  };
  /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
  constructor(
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private _commandService: CommandService,
    private _matSnackBar: MatSnackBar,
    private _router: Router) { 
      // Set the defaults
      this.onVehiclesChanged = new BehaviorSubject([]);
      this.onZoneGeogenceChanged = new BehaviorSubject([]);
      this.onLeftSidenavViewChanged = new Subject();
      this.trakingObject = new Subject();
  }

// AddGeofence
addGeofence(geofence): Promise<any>
{
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["TrakingObject"] = geofence.TrakingObject;
  params["GeofenceName"] = geofence.GeofenceName;
  params["GeofenceAlarmType"] = geofence.GeofenceAlarmType;
  params["GeofenceTypeInt"] = geofence.GeofenceTypeInt;
  params["Rayon"] = +geofence.circle.Rayon;
  params["RayonKm"] = +geofence.circle.Rayon;
  params["CentreLng"] = +geofence.circle.CentreLng;
  params["CenterLat"] = +geofence.circle.CenterLat;
  params["Lng1"] = +geofence.rectangle.Lng1;
  params["Lng2"] = +geofence.rectangle.Lng2;
  params["Lat1"] = +geofence.rectangle.Lat1;
  params["Lat2"] = +geofence.rectangle.Lat2;
  return new Promise((resolve, reject) => {
    // /Service/TrackingPageWCFService.svc/AddGeofence
    this._httpClient.post(this.REST_API_SERVER +'/TrackingPageWCFService.svc/AddGeofence',
      params , this.httpOptions)
        .subscribe((response: any) => {
          var msg:string = response.AddGeofenceResult;
          if(isEmpty(msg)){
            showSnackBar('Geofence is added',this._snackBar);
            this._commandService.getAddedOrChangedCommand();
          }
            resolve(response);
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
    }
        , reject);
});
}
// GetZoneGeofence
getZoneGeofence(KeyTrackingObject) : void{
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["KeyTrackingObject"] = KeyTrackingObject;
  this._httpClient.post(this.REST_API_SERVER +'/TrackingPageWCFService.svc/GetZoneGeofence',
  params , this.httpOptions).subscribe((data : any ) => {

    if(data) {
        this.zoneGeogence = data
        this.onZoneGeogenceChanged.next(this.zoneGeogence.GetZoneGeofenceResult);
    }
  },
    (err: HttpErrorResponse) => {
      console.log (err.name + ' ' + err.message);
      // Show the failure message 
       if(err.error == "Session was terminated")
        {
    this._matSnackBar.open("votre session est expirée!", "s'identifier", {
      duration: 10000
    }).afterDismissed().subscribe(()=>{
      this._router.navigate(['app-auth']);
    });
  } 
  });
}
// DeleteGeofence
deleteGeofence(GeofenceTypeInt: number,KeyGeofence : string ,TrakingObject: number) : void {
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["GeofenceTypeInt"] = GeofenceTypeInt;
  params["KeyGeofence"] = KeyGeofence;
  params["TrakingObject"] = TrakingObject;
  this._httpClient.post(this.REST_API_SERVER +'/TrackingPageWCFService.svc/DeleteGeofence',
  params , this.httpOptions).subscribe((data : any ) => {

        this._commandService.getAddedOrChangedCommand();
         this._commandService.onCommandsChanged.pipe(
           repeatWhen(obs => 
            obs.pipe(delay(15000))),
            filter(data => this.CheckStatus(data,KeyGeofence)),
            take(1)
             )
},
(err: HttpErrorResponse) => {
  console.log (err.name + ' ' + err.message);
  // Show the failure message 
   if(err.error == "Session was terminated")
    {
this._matSnackBar.open("votre session est expirée!", "s'identifier", {
  duration: 10000
}).afterDismissed().subscribe(()=>{
  this._router.navigate(['app-auth']);
});
} 
});
}
CheckStatus(data : any[], KeyGeofence: string) : boolean {
  let status : boolean;
  let index = this._commandService.commandIds[this._commandService.commandIds.length-1];
  status = data.find(it => it.key == index).StatusCommand == 1;
               if(status){
                const zoneIndex = this.zoneGeogence.GetZoneGeofenceResult.findIndex(it => it.Key == KeyGeofence);
                this.zoneGeogence.GetZoneGeofenceResult.splice(zoneIndex , 1);
                this.onZoneGeogenceChanged.next(this.zoneGeogence.GetZoneGeofenceResult);
                this._snackBar.open('Geofence zone is deleted', 'OK', {
                  duration: 5000,
                  // here specify the position
                  verticalPosition: 'top',
                  horizontalPosition: 'right'
                });
               }
               return status;
}

}
