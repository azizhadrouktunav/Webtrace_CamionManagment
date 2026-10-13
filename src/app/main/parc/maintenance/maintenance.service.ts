import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError , BehaviorSubject, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import * as _ from 'lodash';
import { IMaintenance, RepairMaintenanceLog } from './department';
import { environment } from 'environments/environment';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { json2array } from 'app/main/helpers/must-match.validator';
import { MatSnackBar } from '@angular/material';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class MaintenanceService implements Resolve<any> {
  
    maintenances: IMaintenance[] = [];
    repairMaintenance:any[] = [];
    onRepairMaintenanceChanged: BehaviorSubject<any>;
    repairMaintenanceLog : any[] = [];
    onMaintenancesChanged: BehaviorSubject<IMaintenance[]> ;
    onRepairMaintenanceLogChanged: BehaviorSubject<any>;
    onMaintenanceUpdated: Subject<any>;
    carId = new BehaviorSubject<number>(null);
    name = new BehaviorSubject<string>(null);
    maintenanceId = new BehaviorSubject<number>(null);

    types : number[] = []; //ids
    dataTranslate:any;
    private $EnumType = new BehaviorSubject(this.types);
    // Http Header
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  private REST_API_SERVER = environment.apiUrl;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient,
      private errorHandler: ErrorHandlerService,
      private _matSnackBar : MatSnackBar,
      private translateService: TranslateService,
  )
  {
      // Set the defaults
      this.onMaintenancesChanged = new BehaviorSubject([]);
      this.onRepairMaintenanceLogChanged = new BehaviorSubject({});
      this.onRepairMaintenanceChanged = new BehaviorSubject({});
      this.onMaintenanceUpdated = new BehaviorSubject({});
      this.translateService.get(['NAV.Car_deleted_msg', 'NAV.Car_update_msg' , 'NAV.Car_add_msg'])
      .subscribe(data => { this.dataTranslate = data });
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
       return this.getMaintenanceManagementParam();
    }
    // get MaintenanceManagementParam
  getMaintenanceManagementParam(): Observable<any>{
  
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
   
      return this._httpClient.post(this.REST_API_SERVER + '/MaintenanceManagementWCFService.svc/GetUIMaintenanceManagementParam', 
      params, this.httpOptions);
  }
   /**
     * Get Maintenances
     *
     * @returns {Promise<any>}
     */
    getMaintenances(KeyTrackingObject:number): Promise<any>
    {
       // Declare and Initialize Params Object
     let params = {};
         params["SessionId"] = localStorage.getItem('SessionId');
         params["KeyTrackingObject"] = KeyTrackingObject;
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER+'/MaintenanceManagementWCFService.svc/GetMaintenance' , JSON.stringify(params) , this.httpOptions)
                .subscribe((response: any) => {
                    this.maintenances = json2array(response);
                    this.maintenances = this.maintenances.map(item => {
                       return new IMaintenance(item);
                    })
                    this.types = _.map(this.maintenances , 'MaintenanceTypeEnum');
                    this.setTypesEnum(this.types);                    
                    this.onMaintenancesChanged.next(this.maintenances);           
                    resolve(response);
                }, reject);
        });
    }
    // get maintenance by id
    getMaintenanceById(key: number) : IMaintenance{
       var result;
       this.onMaintenancesChanged.subscribe((data : IMaintenance[]) => {
            result = data.find(obj => obj.Id === key)
      })
      return result;
    }
    /**
     * Get RepairMaintenanceLog
     *
     * @returns {Promise<any>}
     */
    getRepairMaintenanceLog(): Promise<any>
    {
       // Declare and Initialize Params Object
     let params = {};
         params["SessionId"] = localStorage.getItem('SessionId');
        this.carId.subscribe(data => {
          params["KeyTrackingObject"] = data
         });
         params["MaintenanceId"] =  this.maintenanceId;
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER+'/MaintenanceManagementWCFService.svc/GetRepairMaintenanceLog' , JSON.stringify(params) , this.httpOptions)
                .subscribe((response: any) => {
                   
                    this.repairMaintenanceLog = json2array(response);
                    this.onRepairMaintenanceLogChanged.next(this.repairMaintenanceLog);
                    resolve(response);
                }, reject);
        });
    }
    // DELETE Maintenance
    DeleteMaintenance(maintenance ,KeyTrackingObject): Promise<any>{
      const Index = this.maintenances.findIndex(item => item.Id === maintenance.Id);
      let params = {};
     params["SessionId"] = localStorage.getItem('SessionId');
     params["MaintenanceId"] = maintenance.Id;
     params["KeyTrackingObject"] = KeyTrackingObject;
     return new Promise((resolve, reject) => {
      this._httpClient.post(this.REST_API_SERVER + '/MaintenanceManagementWCFService.svc/DeleteMaintenance' ,JSON.stringify(params), this.httpOptions)
          .subscribe((response: boolean) => {
                    if(response == true){
                      const index_type = this.types.indexOf(maintenance.MaintenanceTypeEnum)
                      this.types.splice(index_type, 1);
                      this.setTypesEnum(this.types);
                      this.maintenances.splice(Index, 1);
                      this._matSnackBar.open(maintenance.MaintenanceTypeString  + ' is deleted', 'OK' , {
                              duration: 2000,
                              //here specify the position
                             verticalPosition: 'bottom',
                             horizontalPosition: 'right'
                            });
                    }
                    this.onMaintenancesChanged.next(this.maintenances);
                    resolve(response);
          }, reject);
  });
     
}
   // AddOrUpdateMaintenanceByDate
   public AddOrUpdateMaintenanceByDate(maintenance, KeyTrackingObject?:number): Promise<IMaintenance>{
    const Index = this.maintenances.findIndex(item => {return item.Id === maintenance.Id});
    let params = {};
   params["SessionId"] = localStorage.getItem('SessionId');
   params["KeyTrackingObject"] = KeyTrackingObject;
   params["MaintenanceTypeEnum"] = maintenance.MaintenanceTypeEnum;
   params["RecurringMode"] = maintenance.Date.RecurringMode;
   params["BeginStartRecurringDateGMT"] = convertToJSONDate(maintenance.BeginStartRecurringDateGMT);
   params["WarnMeBeforeNDay"] = maintenance.WarnMeBeforeNDayKm;
   params["EnableGenerateAlert"] = true;
   params["EnabledDayOfWeekes"] = maintenance.Date.EnabledDayOfWeekes;
   params["RecuringFrequencyNYearMonthWeekDay"] = maintenance.Date.RecuringFrequencyNYearMonthWeekDay;
   return new Promise((resolve, reject) => {
     this._httpClient.post<any>(this.REST_API_SERVER + '/MaintenanceManagementWCFService.svc/AddOrUpdateMaintenanceByDate' ,JSON.stringify(params), this.httpOptions)
        .subscribe((response : any) => {
           if(typeof(response) === 'object' && response !== 'null') {
              let newMaintenance = new IMaintenance(response);
              if ( Index !== -1 ){
                this.maintenances.splice(Index, 1, newMaintenance);
                // Show the success message
              this._matSnackBar.open('The entretien was updated', 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
                });
                }
                else {
                  this.maintenances.unshift(newMaintenance);
                  this.types.push(newMaintenance.MaintenanceTypeEnum);
                  this.setTypesEnum(this.types);
                  // Show the success message
                this._matSnackBar.open('The entretien was added', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration        : 2000
                  });
                }
            this.onMaintenancesChanged.next(this.maintenances);
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
        this._matSnackBar.open('Server is Not Responding', 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
          });
      });
})
  }
  // AddOrUpdateMaintenanceByOdometerOrEngineHours
  public AddOrUpdateMaintenanceByOdometerOrEngineHours(maintenance, KeyTrackingObject?: number): Promise<IMaintenance>{

    const Index = this.maintenances.findIndex(item => {return item.Id === maintenance.Id})
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["KeyTrackingObject"] = KeyTrackingObject;
      params["MaintenanceTypeEnum"] = maintenance.MaintenanceTypeEnum;
      params["FrequencyInKm"] = maintenance.Odometer.MaintenanceFrequence;
      params["NextDueOdometer"] = maintenance.Odometer.NextDueMileage;
      params["WarnMeBeforeNKM"] = maintenance.WarnMeBeforeNDayKm;
      params["EnableGenerateAlert"] = true;
      params["IsReminderBy"] = maintenance.IsReminderBy;
      return new Promise((resolve, reject) => {
        this._httpClient.post<IMaintenance>(this.REST_API_SERVER + '/MaintenanceManagementWCFService.svc/AddOrUpdateMaintenanceByOdometerOrEngineHours' ,JSON.stringify(params), this.httpOptions)
           .subscribe((response : any) => {
              if(typeof(response) === 'object' && response !== 'null') {
                 let newMaintenance = new IMaintenance(response);
                 if ( Index !== -1 ){
                   this.maintenances.splice(Index, 1, newMaintenance);
                   // Show the success message
                 this._matSnackBar.open('The entretien was updated', 'OK', {
                   // here specify the position
                   verticalPosition: 'bottom',
                   horizontalPosition: 'right',
                   duration        : 2000
                   });
                   }
                   else {
                     this.maintenances.unshift(newMaintenance);
                   this.types.push(newMaintenance.MaintenanceTypeEnum);
                   this.setTypesEnum(this.types);
                     // Show the success message
                   this._matSnackBar.open('The entretien was added', 'OK', {
                     // here specify the position
                     verticalPosition: 'bottom',
                     horizontalPosition: 'right',
                     duration        : 2000
                     });
                   }
               this.onMaintenancesChanged.next(this.maintenances);
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
           this._matSnackBar.open('Server is Not Responding', 'OK', {
             // here specify the position
             verticalPosition: 'bottom',
             horizontalPosition: 'right',
             duration        : 2000
             });
         });
   })
  }
 
  
  confirmMaintenance(maintenance?:number, log?:any): Observable<IMaintenance> {  
   // Declare and Initialize Params Object
   let params = {};
   params["keyTrackingObject"] = log.Car;
   params["AccidentDetailsId"] = -1;
   params["Cost"] = +log.Cost;
   params["CostString"] = log.Cost.toString();
   params["MaintenanceId"] = maintenance;
   params["DateAvailableFromLocal"] = convertToJSONDate(new Date());
   params["DateAvailableToLocal"] = convertToJSONDate(new Date());
   params["DateCompletionGMT"] = convertToJSONDate(log.DateCompletionGMT);
   params["Description"] = log.Description;
   params["EngineHoursCompletion"] = +log.EngineHoursCompletion;
   params["IdAccidentDetails"] = -1;
   params['IdCarDocumentLog'] = -1;
   params["IdCarDocumentReminder"] = -1;
   params["IdMaintenance"] =  maintenance;
   params["InvoiceReference"] = log.InvoiceReference;
   params["KeyTrackingObject"] = log.Car;
   params["MileageComplectionString"] = log.MileageCompletion.toString();
   params["MileageCompletion"] = +log.MileageCompletion;
   params["PaidCost"] = +log.PaidCost;
   params["PaidCostString"] = log.PaidCost.toString();
   params["PaidDateGMT"] =  convertToJSONDate(log.PaidDateLocal);
   params["SessionId"] = localStorage.getItem('SessionId');
   params["Supplier"] = log.Supplier;
return this._httpClient.post<IMaintenance>(this.REST_API_SERVER+ '/MaintenanceManagementWCFService.svc/ConfirmMaintenanceImplementation' , JSON.stringify(params) , this.httpOptions)
                     .pipe(
                       map(res => new IMaintenance(res)),
                       catchError(this.handleError)
                     );
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
    return throwError(errorMessage);
 }
changeTrackingObject(myChange) {
  this.carId.next(myChange);
}
getTrackingObject() {
  return this.carId.asObservable();
}
// set matricule
changeName(myChange) {
  this.name.next(myChange);
}
// get matricule
getName() {
  return this.name.asObservable();
}
get EnumType(): Observable<number[]>
{
    return this.$EnumType.asObservable();
}

setTypesEnum(value: number[]): void
{
    this.$EnumType.next(value);
}
ngOnDestroy():void
{
  this.onMaintenancesChanged.next([]);
  this.onMaintenancesChanged.complete() ;
}

}
