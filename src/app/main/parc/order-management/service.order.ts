import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { Mission, PlannedMission, StatusMission } from './model';
import { catchError, retry, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { isUndefined, mapValues } from 'lodash';
import { json2array } from 'app/main/helpers/must-match.validator';;
import { getMapValue } from 'app/main/helpers/must-match.validator';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import {  TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class OrderService implements Resolve<any> {
  routeParams: any;
  missions: Mission[] = [];
  mission:any
  onMissionChanged: BehaviorSubject<any>;
  onMissionsChanged: BehaviorSubject<any>;
  private sDate = new BehaviorSubject<Date>(new Date())
  private eDate = new BehaviorSubject<Date>(new Date())
  sharedSDate = this.sDate.asObservable();
  sharedEDate = this.sDate.asObservable();
  private missionList = new BehaviorSubject<Mission[]>([])
    // Http Header
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  private REST_API_SERVER = environment.apiUrl
  departments: any[] = [];
  places: any[] = [];
  drivers: any[] = [];
  vehicles: any[] =[];
  data: any;
  currentAccount: number
  constructor(
     private _httpClient: HttpClient,
     private _matSnackBar : MatSnackBar,
     private _translate: TranslateService,
)
{
   // Set the defaults
   this.onMissionChanged = new BehaviorSubject({});
   this.onMissionsChanged = new BehaviorSubject([]);
   this._translate.get(['NAV.Mission_add_msg', 'NAV.Mission_update_msg' , 'NAV.Mission_delete_msg'])
   .subscribe(data => { this.data = data }
   );
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
      this.routeParams = route.queryParamMap.get('id');

      return new Promise<void>((resolve, reject) => {

          Promise.all([
            this.getUIPlannedMissionParam(),
            this.getMission()
          ]).then(
              () => {
                  resolve();
              },
              reject
          );
      });
    }
    getUIPlannedMissionParam(): Promise<any>{
  
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/GetUIPlannedMissionParam', params , this.httpOptions)
        .subscribe((data : any) => {
        this.vehicles = json2array(data.DicoTrackingObjects);
        this.drivers = json2array(data.Drivers);
        this.places = json2array(data.PlaceElements)
        this.currentAccount = data.CurrentAccount.Id;
        this.vehicles = this.vehicles.map(obj => {
          return {id: obj.Key, name: obj.FullName}
          });
        this.drivers = this.drivers.map(obj => {
          return {id: obj.key, name: obj.FullName}
          });
          this.places = this.places.map(obj => {
            return {id: obj.Id, name: obj.NamePlace}
            });
            this.places.sort((a:any,b:any)=>a.name.localeCompare(b.name));
            resolve([this.vehicles, this.drivers, this.places, this.currentAccount])
        },reject)
      });
    }
    getDepartments(): any[] {
      return this.departments
     }
     getPlaces(): any[] {
       return this.places
      }
     getDrivers() : any[] {
        return this.drivers
     }
     getVehicles(): any[] {
        return this.vehicles
     }
     getCurrentAccount() : number {
       return this.currentAccount
     }
    nextMissionList(missions: Mission[]) {
      this.missionList.next(missions)
    }
   // CalculateRealTotalFuelConsumed
calculateRealTotalFuelConsumed(sDate:any , eDate:any , id:number):Observable<number>{
    sDate.setHours(0,0,0,0);
    eDate.setHours(0,0,0,0);
    let params = {};
    params["EndDateTimeGMT"] = convertToJSONDate(eDate);
    params["KeyTrackingObject"] = id;
    params["SessionId"] = localStorage.getItem('SessionId');
    params["StartDateTimeGMT"] = convertToJSONDate(sDate);
    return this._httpClient.post<number>(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/CalculateRealTotalFuelConsumed', params , this.httpOptions)
                .pipe( 
                map(res =>res),
                catchError(this.handleError)
              ); 
  }
  //isPlannedMissionAccomplished
  isPlannedMissionAccomplished(id:number , sDate: Date , eDate: Date, tabIdPlaceOfMission:Array<number>):Observable<Boolean>{
    let params = {};
    params["EndDateTimeGMT"] = convertToJSONDate(eDate);
    params["ForStop"] = true;
    params["KeyTrackingObject"] = id;
    params["ListIdPlaceOfMission"] = tabIdPlaceOfMission;
    params["MetreThresholdRadius"] = 300;
    params["SessionId"] = localStorage.getItem('SessionId');
    params["StartDateTimeGMT"] = convertToJSONDate(sDate);
    return this._httpClient.post<Boolean>(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/IsPlannedMissionAccomplished', params , this.httpOptions);
  }
  // GET
  getMissions(start: any , end : any): Promise<any>{
    let params = {};
    /*const fromDate = new Date();
    const toDate= new Date();
    const today = new Date();
    fromDate.setMonth(today.getMonth() - 1)
    toDate.setMonth(today.getMonth() + 1)*/
    if(start._d != undefined)
       start= start._d

    if(end._d != undefined)
      end= end._d
    
    let StarDate: Date = new Date(start.getFullYear(),start.getMonth(),start.getDate(),0,0,0);
    let EndDate: Date = new Date(end.getFullYear(),end.getMonth(),end.getDate(),23,59,59);
    params["EndDateGMT"] = convertToJSONDate(EndDate);
    params["StartDateGMT"] = convertToJSONDate(StarDate);
    params["SessionId"] = localStorage.getItem('SessionId');
           return new Promise((resolve, reject) => {
            this._httpClient.post<any>(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/GetPlannedMissionByEstimatedDateBetween', params , this.httpOptions)
                .subscribe((response: any) => {
                  this.missions = response
                  this.missions = this.missions.map(item => 
                    new Mission(item)
                  );
                    this.onMissionsChanged.next(this.missions);
                    
                    resolve(this.missions);
                }, reject);
        });
        
  }
  getMission(): Promise<any>{
    return new Promise((resolve, reject) => {
      if ( this.routeParams === 'new' || isNullOrUndefined(this.routeParams) )
      {
          this.onMissionChanged.next(false);
          resolve(false);
      }
      else
      {              
        this.mission = this.missions.find(x => x.Id == this.routeParams);
        this.onMissionChanged.next(this.mission);
        resolve(this.mission);
      }
  });
  }

  //updare PlannedMission
  update(mission, statusChanged:boolean = false, realTotalFuelConsumed?:number): Promise<Mission>{
    const Index = this.missions.findIndex(item => {return item.Id === mission.Id})
    let params = {};
    params["BeginMissionEstimatedDateGmt"] = convertToJSONDate(mission.EstimatedDateLocalOfStarting);
    params["BeginMissionRealDateGmt"] = convertToJSONDate(mission.RealDateLocalOfStarting);
    params["Cost"] = mission.Cost;
    params["EstimatedTotalFuelConsumed"] = mission.EstimatedTotalFuelConsumed;
    params["IdAccount"] = mission.Account;
    params["IdDestinationPlaceOfMission"] = mission.DestinationPlaceOfMission;
    params["IdDriver"] = mission.Driver;
    params["IdPlannedMission"] =  mission.Id ;    //mission.Id
    params["IdStartPlaceOfMission"] = mission.StartPlaceOfMission;
    params["IdTrackingObj"] = mission.TrackingTarget;
    if(!isNullOrUndefined(mission.MaxDateLocalOfMission))
    {
      params["MaxEndMissionDateGmt"] = convertToJSONDate(mission.MaxDateLocalOfMission);
    }
    params["OdometerIn"] = mission.OdometerIn;
    params["OdometerOut"] = mission.OdometerOut;
    params["PriceOfWeightLoaded"] = mission.PriceOfWeightLoaded;
    params["Purpose"] = mission.Purpose;
    params["RealTotalFuelConsumed"] = statusChanged ? realTotalFuelConsumed :mission.RealTotalFuelConsumed;
    params["SessionId"] = localStorage.getItem('SessionId');
    if(!isNullOrUndefined(mission.EstimatedDateLocalOfStarting))
    {
      params["StartingEstimatedDateGmt"] = convertToJSONDate(mission.EstimatedDateLocalOfStarting);
    }
    if(!isNullOrUndefined(mission.RealDateLocalOfStarting))
    {
      params["StartingRealDateGmt"] = convertToJSONDate(mission.RealDateLocalOfStarting);
    }
    params["StatusMissionInt"] = statusChanged ? 2 : mission.StatusMission;
    params["WeightLoaded"] = mission.WeightLoaded;
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/UpdatePlannedMission', params , this.httpOptions)
         .subscribe((response : any) => {
            if(typeof(response) === 'object' && response !== 'null') {
               let newMission = new Mission(response);
               if ( Index !== -1 ){
                 this.missions.splice(Index, 1, newMission);
                 this.onMissionsChanged.next(this.missions);
                 // Show the success message
               this._matSnackBar.open(this.data['NAV.Mission_update_msg'], 'OK', {
                 // here specify the position
                 verticalPosition: 'bottom',
                 horizontalPosition: 'right',
                 duration        : 2000
                 });
                 }
                 else {
                  // Show the failure message
                  this._matSnackBar.open('Server is Not Responding', 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration        : 2000
              });
                 }
             this.onMissionChanged.next(this.missions);
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
 });  
  }
  // DeletePlannedMission 
  delete(mission): void{
    const IndexMission = this.missions.indexOf(mission);
    let params = {};
    params["IdPlannedMission"] = mission.Id;
    params["SessionId"] = localStorage.getItem('SessionId');
        this._httpClient.post<Boolean>(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/DeletePlannedMission', params , this.httpOptions)
           .subscribe((data : boolean) => {
                 if(data == true){
                      this.missions.splice(IndexMission, 1);
                      this.onMissionsChanged.next(this.missions);
                    // Show the success message
                   this._matSnackBar.open(this.data['NAV.Mission_delete_msg'], 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right' ,
                    duration  : 2000
                      });
                  }
              else {
                // Show the failure message
               this._matSnackBar.open('Server not responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
                        }
                         },
                         error => {
                              alert(error)
                          });
                      }
                                  

  // exist : true else false
  ExistPlannedMissionNumberStr(NumberStr: string):Observable<boolean>{
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["Number"] = NumberStr;
        return this._httpClient.post<boolean>(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/ExistPlannedMissionNumberStr', params , this.httpOptions)
  }
  // AddManyPlannedMission (add new missions)
   add(mission: Mission): Observable<any>{
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["Number"] = mission.Number;
    params["BeginMissionEstimatedDateGmt"] = convertToJSONDate(mission.EstimatedDateLocalOfMission);
    params["BeginMissionRealDateGmt"] = null;
    params["Cost"] = mission.Cost;
    params["EstimatedTotalFuelConsumed"] = mission.EstimatedTotalFuelConsumed;
    params["IdAccount"] = mission.Account;
    params["IdDestinationPlaceOfMission"] = mission.DestinationPlaceOfMission;
    params["IdDriver"] = mission.Driver;
    params["IdStartPlaceOfMission"] = mission.StartPlaceOfMission;
    params["IdTrackingObj"] = mission.TrackingTarget;
    params["MaxEndMissionDateGmt"] = convertToJSONDate(mission.MaxDateLocalOfMission);
    params["OdometerIn"] = mission.OdometerIn;
    params["OdometerOut"] = mission.OdometerOut;
    params["PriceOfWeightLoaded"] = mission.PriceOfWeightLoaded;
    params["Purpose"] = mission.Purpose;
    params["RealTotalFuelConsumed"] = mission.RealTotalFuelConsumed;
    params["StartingEstimatedDateGmt"] = convertToJSONDate(mission.EstimatedDateLocalOfStarting);
    params["StartingRealDateGmt"] = null;
    params["StatusMissionInt"] = mission.StatusMission;
    params["WeightLoaded"] = mission.WeightLoaded; 
   return this._httpClient.post<any>(this.REST_API_SERVER + '/PlannedMissionWCFService.svc/AddManyPlannedMission', params , this.httpOptions)
      
   }
   ExportReport (TypeExport:string,MissionNum:string,DriverName:string,MissionFrom:Date,
    MissionTo:Date,Maticulation:string,StartMileage:number,EndMileage:number,Description:string,
    RealTotalFuelConsumed:number,EstimatedTotalFuelConsumed:number,WeightLoaded:number,
    WeightPriceCharged:number,StartPlace:string,EndPlace:string,Cost:number):Observable<string>
   {
     // Declare and Initialize Params Object
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['TypeExport'] =  TypeExport;
     params['MissionNum']= MissionNum;
     params['DriverName']= DriverName;
     params['MissionFrom']=convertToJSONDate( MissionFrom);
     params['MissionTo']=convertToJSONDate( MissionTo);
     params['Maticulation']= Maticulation;
     params['StartMileage']= StartMileage;
     params['EndMileage']= EndMileage;
     params['Description']= Description;
     params['RealTotalFuelConsumed']= RealTotalFuelConsumed;
     params['EstimatedTotalFuelConsumed']= EstimatedTotalFuelConsumed;
     params['WeightLoaded']= WeightLoaded;
     params['WeightPriceCharged']= WeightPriceCharged;
     params['StartPlace']= StartPlace;
     params['EndPlace']= EndPlace;
     params['Cost']= Cost;
     return  this._httpClient.post(this.REST_API_SERVER +
          '/CommonWCFService.svc/CreateXtraReportPrintMissionNew', 
          JSON.stringify(params), this.httpOptions).pipe(
           map((data: string) => {
             return data;
           }), catchError( error => {
             return throwError( 'data not found!' );
           })
        )                
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
}

function fromJson(data: any): any{

      let drivers = mapValues(data.Drivers, (value , key) => {
        return {
          key:  +key,
          FullName : value.FullName
         }
      })
      let places = mapValues(data.PlaceElements, (value , key) => {
        return {
         key: value.Id,
         FullName : value.NamePlace
        }
     })
      let currentAccount = data.CurrentAccount.Id
      let cars = mapValues(data.DicoTrackingObjects, (value , key) => {
        if(!isNullOrUndefined(value)){
        return {
            key:  +key,
            Car : value.FullName
          }      
        }
        else{
          return;
        }
      })
      var driverList =  _.pickBy(drivers, _.identity)
      return {cars, driverList, places, currentAccount}
    }
    export function serializeMission(itm) : Mission{
      itm.FullName = getMapValue(this.drivers , itm.Driver)['FullName']
      itm.Car = getMapValue(this.carList, itm.TrackingTarget)['Car']
      itm.StartPlace = getMapValue(this.places, itm.StartPlaceOfMission)['FullName']
      itm.DestinationPlace = getMapValue(this.places, itm.DestinationPlaceOfMission)['FullName']
      itm.StatusMissionStr = StatusMission[itm.StatusMission]
       return  new Mission(itm)
    }