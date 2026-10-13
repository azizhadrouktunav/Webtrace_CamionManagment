import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { json2array } from 'app/main/helpers/must-match.validator';
import { decrypt } from 'app/main/parc/Parc';
import { environment } from 'environments/environment';

import { Traject } from '../map/traject';
import { BehaviorSubject, Observable, Subject,throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrajectoryService {
  private REST_API_SERVER = environment.apiUrl;
 // Http Header
 httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

trajectories : BehaviorSubject<Traject[]>;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient
  )
  {
      // Set the defaults
      this.trajectories = new BehaviorSubject([]);

      // I dont have Animations Controls Buttons , so i use this function to hundle Traject Animation using inspector.
      // After Drawing a trajectory , pressing "p" will log the Traject Observable on the console , then i store it in a temp variable , then i can acess all its animation function for testing
    // document.addEventListener("keydown", (event) => {
    //     if(event.key == "p"){
    //         console.log(this.trajectories)
    //     }
    // })

  }

   // Service set trackingObject
  
  // GetTrajectoryCompressed
  getTrajectory(keyTrackingObject: number, startDateTimeGMT: Date, endDateTimeGMT: Date) : Observable<any>{
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["KeyTrackingObject"] = keyTrackingObject; //34721
    params["StartDateTimeGMT"] = convertToJSONDate(startDateTimeGMT); //"/Date(1597878000000)/"; 
    params["EndDateTimeGMT"] = convertToJSONDate(endDateTimeGMT); //"/Date(1598791868000)/";
    return this._httpClient.post(this.REST_API_SERVER + '/TrackingPageWCFServiceNewtonSoft.svc/GetTrajectoryCompressed',
      params , this.httpOptions);
}

deleteTraject(traject : Traject){
    let trajectories = this.trajectories.value
    let index = trajectories.indexOf(traject);
    if(index>-1) 
        trajectories.splice(index, 1)
    else
        return 0;
    this.trajectories.next(trajectories)
}

ExportReport (ReportDataSourceCompressed : string,TabColumnItem :any[],TypeExport:string):Observable<any>
{

 
  // Declare and Initialize Params Object
  let params = {};
  
  params['SessionId'] = localStorage.getItem('SessionId');
  params['ReportDataSourceCompressed'] = ReportDataSourceCompressed;
  params['TypeExport'] =  TypeExport;
  params['TabColumnItem']= TabColumnItem;
  
  return  this._httpClient.post(this.REST_API_SERVER +
       '/CommonWCFService.svc/ExportReportTrajectry', 
       JSON.stringify(params), this.httpOptions).pipe(
        map((data: string) => {
          return data;
        }),
       catchError(error => {
          console.log(error);
          return throwError( 'data not found!' );
        })
     )                
}
}
