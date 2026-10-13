import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TypeMaintenance, _TypeMaintenance, RepairMaintenanceLog } from '../department';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { isNull, isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { data } from 'jquery';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RepairsService {
   // Http Header
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
private REST_API_SERVER = environment.apiUrl;
  constructor(private http: HttpClient,
              private errorHandler : ErrorHandlerService){ }

  // AddTypeMaintenances
createTypeMaintenance(typeMaintenanceStr:String): Observable<TypeMaintenance> {  
       // Declare and Initialize Params Object
       let params = {};
       params["SessionId"] = localStorage.getItem('SessionId');
       params["typeMaintenanceStr"] = typeMaintenanceStr;
  return this.http.post<_TypeMaintenance>(this.REST_API_SERVER+ '/ObjectMaintenanceWCFService.svc/AddTypeMaintenances' , JSON.stringify(params) , this.httpOptions)
                          .pipe(
                            map(res => res.d),
                            catchError(this.handleError)
                          );
}
// UpdateRepairMaintenanceLog
updateRepairMaintenanceLog(typeMaintenance:any , car?:number, maintenance: number = -1, 
  accidentDetailsId: number = -1, IdCarDocumentReminder: number = -1): Observable<RepairMaintenanceLog> {  
   // Declare and Initialize Params Object
   let params = {};
   params["AccidentDetailsId"] = accidentDetailsId;
   params["IdAccidentDetails"] = accidentDetailsId;
   params["IdCarDocumentReminder"] = IdCarDocumentReminder;
   params["Cost"] = typeMaintenance.Cost;
   params["DateCompletionGMT"] ='/Date(' + new Date(typeMaintenance.DateCompletionGMT).getTime() + ')/';
   params["Description"] = typeMaintenance.Description;
   params["EngineHoursCompletion"] = typeMaintenance.EngineHoursCompletion;
   params["IdRepairMaintenanceLog"] = typeMaintenance.Id;
   params["InvoiceReference"] = typeMaintenance.InvoiceReference;
   params["keyTrackingObject"] = !isNullOrUndefined(typeMaintenance.Car) ? typeMaintenance.Car: car;
   params["MaintenanceType"] = !isNullOrUndefined(typeMaintenance.MaintenanceType) ? typeMaintenance.MaintenanceType: maintenance;
   params["MileageCompletion"] = typeMaintenance.MileageCompletion;
   params["PaidCost"] = typeMaintenance.PaidCost;
   params["PaidDateGMT"] =  '/Date(' + new Date(typeMaintenance.PaidDateLocal).getTime() + ')/';
   params["RepairMaintenanceLogId"] = typeMaintenance.Id;
   params["SessionId"] = localStorage.getItem('SessionId');
   params["Supplier"] = typeMaintenance.Supplier;
   params["keyTrackingObject"] = !isNullOrUndefined(typeMaintenance.Car) ? typeMaintenance.Car: car;
return this.http.post<any>(this.REST_API_SERVER+ '/RepairMaintenanceLogWCFService.svc/UpdateRepairMaintenanceLog' , JSON.stringify(params) , this.httpOptions)
                     .pipe(
                       catchError(this.handleError)
                     );
}
// getObjectMaintenances
getObjectMaintenances(): Observable<TypeMaintenance[]>{
       // Declare and Initialize Params Object
       let params = {};
       params["SessionId"] = localStorage.getItem('SessionId');
    return this.http.post<any>(this.REST_API_SERVER+ '/ObjectMaintenanceWCFService.svc/GetObjectMaintenances' , JSON.stringify(params) , this.httpOptions)
       .pipe(
         map(res => res.d),
         catchError(this.handleError)
       );  
}
// fetchAll RepairMaintenances
getRepairMaintenances(KeyTrackingObject:number, date1, date2): Observable<RepairMaintenanceLog[]>{
  // Declare and Initialize Params Object
  let params = {};
         params["SessionId"] = localStorage.getItem('SessionId');
         params["KeyTrackingObject"] = KeyTrackingObject;
         let startDate :Date;
         let EndtDate :Date;
         if(date1._d== undefined)
         {
          startDate  = new Date(date1.getFullYear(),date1.getMonth(),date1.getDate(),0,0,0);
          
        
        }
         else
         {
          startDate  = new Date(date1._d.getFullYear(),date1._d.getMonth(),date1._d.getDate(),0,0,0);
       
        
         }
         if(date2._d== undefined)
         {
          EndtDate  = new Date(date2.getFullYear(),date2.getMonth(),date2.getDate(),23,59,59);
         }
         else
         {
          EndtDate  = new Date(date2._d.getFullYear(),date2._d.getMonth(),date2._d.getDate(),23,59,59);
         }
  
         params["date1"] = '/Date(' +  new Date(startDate).getTime() + ')/';
         params["date2"] = '/Date(' + new Date(EndtDate).getTime() + ')/';
return this.http.post<RepairMaintenanceLog[]>(this.REST_API_SERVER +'/RepairMaintenanceLogWCFService.svc/GetRepairMaintenance', JSON.stringify(params) , this.httpOptions);
 /* .pipe( 
    map(res => res.d),
    catchError(this.handleError)
  );  */
}
// Add repairMaintenanceLog
addRepairMaintenanceLog(typeMaintenance:RepairMaintenanceLog, car?: number): Observable<TypeMaintenance> {  
  // Declare and Initialize Params Object
  let params = {};
  params["MaintenanceType"] = typeMaintenance.MaintenanceType;
  //typeMaintenance.MaintenanceType;
  params["AccidentDetailsId"] = null;
  params["Cost"] = typeMaintenance.Cost;
  // let test =typeMaintenance.DateCompletionGMT;
  //    let t= moment(test);
  //    let y= t.year();
  //    let m=t.get('month');
  //    let date= t.get('date');
  // let DateCompletionGMT : Date= new Date(t.year(),t.month(),t.day());
  params["DateCompletionGMT"] ='/Date(' + new Date(typeMaintenance.DateCompletionGMT).getTime() + ')/';
  params["Description"] = typeMaintenance.Description;
  params["MaintenanceReminder"] =  typeMaintenance.MaintenanceReminder;
  params["InvoiceReference"] =  typeMaintenance.InvoiceReference;
  params["KeyTrackingObject"] = isNullOrUndefined(typeMaintenance.Car) ? car : typeMaintenance.Car;
  params["EngineHoursCompletion"] = typeMaintenance.EngineHoursCompletion;
  params["MileageCompletion"] = typeMaintenance.MileageCompletion;
  params["PaidCost"] = typeMaintenance.PaidCost;
  params["PaidDateGMT"] =  '/Date(' + new Date(typeMaintenance.PaidDateLocal).getTime() + ')/';
  params["SessionId"] = localStorage.getItem('SessionId');
  params["Supplier"] = typeMaintenance.Supplier;
  //params["keyTrackingObject"] = !isNullOrUndefined(typeMaintenance.Car) ? typeMaintenance.Car: car;

return this.http.post<TypeMaintenance>(this.REST_API_SERVER+ '/RepairMaintenanceLogWCFService.svc/AddRepairMaintenanceLog' , JSON.stringify(params) , this.httpOptions);
                   
}
// DeleteRepairMaintenanceLog
deleteRepairMaintenanceLog(KeyTrackingObject: number,
  RepairMaintenanceLogId: number,MaintenanceId: number, AccidentDetailsId : number = -1): Observable<Boolean>{
       // Declare and Initialize Params Object
       let params = {};
       params["SessionId"] = localStorage.getItem('SessionId');
       params["KeyTrackingObject"] = KeyTrackingObject;
       params["RepairMaintenanceLogId"] = RepairMaintenanceLogId;
       params["AccidentDetailsId"] = AccidentDetailsId;
       params["MaintenanceId"] =  MaintenanceId;
    return this.http.post<Boolean>(this.REST_API_SERVER+ '/RepairMaintenanceLogWCFService.svc/DeleteRepairMaintenanceLog' , JSON.stringify(params) , this.httpOptions);
}

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    //this.errorHandler.handleError(error);
    return throwError(errorMessage);
 }
}
