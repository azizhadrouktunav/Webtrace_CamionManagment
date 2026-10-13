import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CardCoupon, MissionCardCoupon } from './model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'environments/environment';
import { isNullOrUndefined } from 'util';
import { Observable, throwError, Subject } from 'rxjs';
import { json2array } from 'app/main/helpers/must-match.validator';;
import { mapValues, reject } from 'lodash';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Tank} from '../tank/model';
import * as _ from 'lodash';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { FuseUtils } from '@fuse/utils';
import { showError } from 'app/main/helpers/show-error';
import { MatDialog } from '@angular/material';
import {  TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class CardCouponService implements Resolve<any> {
  
  private readonly REST_API_SERVER = environment.apiUrl
   // Http Header
   private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  cardCoupons: CardCoupon[] = []
  drivers: BehaviorSubject<any>;
  vehicles: BehaviorSubject<any>;
  departments:  BehaviorSubject<any>;
  places:  BehaviorSubject<any>;
  routeParams: any;
  onCouponsChanged: BehaviorSubject<any>;
  onSelectedCouponsChanged: BehaviorSubject<any>;   
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  searchText: string;
  filterBy: string;
  startDate: Date;
  endDate: Date;
  onTanksChanged: BehaviorSubject<any>;
  onTankDataChanged: BehaviorSubject<any>;
  tanks: any;
  tank : any;
  dataTranslate:any;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private httpClient: HttpClient,
              private errorHandler: ErrorHandlerService,
              private _matSnackBar: MatSnackBar,
              private _translate: TranslateService
              ) {
                  // set the defaults
                this.onTanksChanged = new BehaviorSubject([]);
                this.onTankDataChanged = new BehaviorSubject([]);
                this.onCouponsChanged = new BehaviorSubject([]);
                this.onSelectedCouponsChanged = new BehaviorSubject([]);
                this.onSearchTextChanged = new Subject();
                this.onFilterChanged = new Subject();
                //this.onDateChanged = new Subject();
                this.drivers = new BehaviorSubject([]);
                this.vehicles = new BehaviorSubject([]);
                this.departments = new BehaviorSubject([]);
                this.places = new BehaviorSubject([]);
                this._translate.get(['NAV.MsgAdd', 'NAV.MsgUpdate','MsgDelete' ]).subscribe(data => { this.dataTranslate = data })
                }
  
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
      this.routeParams = route.params;
        return new Promise<void>((resolve, reject) => {
          
            Promise.all([
              this.getCardCouponManagementParam(),
              this.getTanks()
            ]).then(
                ([files]) => {

                  this.onSearchTextChanged.subscribe(searchText => {
                    this.searchText = searchText;
                    //this.getCardOrCoupon();
                });
                this.onFilterChanged.subscribe(filter => {
                  this.filterBy = filter;
                  //this.getCardOrCoupon();
              });
                    resolve();
                },
                reject
            );
        });
    }
   /**
     * Get tanks
     *
     * @returns {Promise<any>}
     */
getTanks(): Promise<any>{
    
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      return new Promise((resolve, reject) => {
        this.httpClient.post(this.REST_API_SERVER + '/TankManagerWCFService.svc/GetTanks', params, this.httpOptions)
            .subscribe((response: any) => {
                
                this.tanks = response;
                this.onTanksChanged.next(this.tanks);
                resolve(this.tanks);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);
              console.log (error.name + ' ' + error.message);
            },
            reject);
    });
    }
  // FillTank
  fillTank(Tank: number ,OperationCapacityInL: number): Observable<Tank> {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["Tank"] = Tank;
    params["OperationCapacityInL"] = OperationCapacityInL;

    return this.httpClient.post<Tank>(this.REST_API_SERVER + '/TankManagerWCFService.svc/FillTank', params, this.httpOptions);
}
 //DeleteTank
 delete(TankId : number) : void{
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["TankId"] = TankId;
    this.httpClient.post(this.REST_API_SERVER + '/TankManagerWCFService.svc/DeleteTank', params, this.httpOptions)
     .subscribe(data => {
       if(data){
      const tankIndex = this.tanks.indexOf(data);
      this.tanks.splice(tankIndex, 1 );
      this.onTanksChanged.next(this.tanks);
         // Show the success message
     this._matSnackBar.open(this.dataTranslate['NAV.MsgDelete'], 'OK', {
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'right' ,
      duration  : 3000
       })
       }
       else{
        // Show the failure message
        this._matSnackBar.open('Could not delete', 'OK', {
         // here specify the position
         verticalPosition: 'bottom',
         horizontalPosition: 'right',
         duration        : 2000
         });
     }
     },
     (err: HttpErrorResponse) => {
      this.errorHandler.handleError(err);
      // Show the failure message 
     this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'right' ,
      duration  : 8000
       })
    });
}
 // Update Tank
 updateTank(tank: any): Observable<Tank> {
  let params = {};
  params['FuelContainerCapacityInL'] = tank.FuelContainerCapacityInL;
  params['FuelLevelInL'] = tank.FuelLevelInL;
  params['FuelType'] = tank.FuelType
  params['Name'] = tank.Name
  params["SessionId"] = localStorage.getItem('SessionId');
  params['TankId'] = tank.TankId;
  params['TotalFuelConsumptionInL'] = tank.TotalFuelConsumptionInL;
    return this.httpClient.post<Tank>(this.REST_API_SERVER +'/TankManagerWCFService.svc/UpdateTank', params, this.httpOptions);
}
 //Add Tank 
 addTank(tank: any) : void {
  let params = {};
  
  params['Name'] = tank.Name;
  params['FuelContainerCapacityInL'] = +tank.FuelContainerCapacityInL;
  params['FuelLevelInL'] = +tank.FuelLevelInL;
  params['FuelType'] = +tank.FuelType
  params["SessionId"] = localStorage.getItem('SessionId');
  params['TotalFuelConsumptionInL'] = +tank.TotalFuelConsumptionInL;
  this.httpClient.post(this.REST_API_SERVER +'/TankManagerWCFService.svc/AddTank', params, this.httpOptions)
  .subscribe(data => {
    this._matSnackBar.open(this.dataTranslate['NAV.MsgAdd'], '', {
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'right' ,
      duration  : 3000
       }
    )
  },
  (err: HttpErrorResponse) => {
    this.errorHandler.handleError(err);
    // Show the failure message 
   this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
    // here specify the position
    verticalPosition: 'bottom',
    horizontalPosition: 'right' ,
    duration  : 8000
     })
  })
}
   getAllCardAndCouponByValidationDateBetween(start?:Date , end?:Date, showCard?:boolean, ShowCoupon?:boolean ) : Promise<any>
  {
    let params = {};
  params["EndDateGMT"] = convertToJSONDate(end);
  params["SessionId"] = localStorage.getItem('SessionId');
  params["StartDateGMT"] = convertToJSONDate(start);
  params["showCard"] = showCard;
  params["ShowCoupon"] = ShowCoupon;
  var url : string =  this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/GetAllCardAndCouponByValidationDateBetween';
    return new Promise((resolve, reject) => {
      this.httpClient.post<CardCoupon[]>(url, params, this.httpOptions)
      .subscribe((response: any) => {
        this.cardCoupons = response;
        // if(this.filterBy === 'cards')
        // {
        //   this.cardCoupons = this.cardCoupons.filter(card => card.IsCard == true);
        // }
        // if(this.filterBy === 'coupons')
        // {
        //   this.cardCoupons = this.cardCoupons.filter(coupon => coupon.IsCoupon === true);
        // }
        this.cardCoupons = this.cardCoupons.map(card => {
         return new CardCoupon(card);
        })

        this.cardCoupons.forEach(item => {
          var driver = !isNullOrUndefined(item.Driver) ? this.getDrivers().find(driver => driver.Id === item.Driver) : undefined;
          var vehicle =  !isNullOrUndefined(item.Car)? this.getVehicles().find(vehicle => vehicle.Id === item.Car): undefined
          item.DriverString = driver !== undefined  ? driver.FullName : ''; 
          item.Vehicle = vehicle !== undefined ?  vehicle.FullName : '';
        })
        this.onCouponsChanged.next(this.cardCoupons);
        resolve(this.cardCoupons);
      }, 
      (error: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);
        console.log (error.name + ' ' + error.message);
      },reject);
    });
  }
  getCouponByValidationDateBetween(start?:Date , end?:Date ) : Promise<any> {
    let params = {};
    params["EndDateGMT"] = convertToJSONDate(end);
    params["SessionId"] = localStorage.getItem('SessionId');
    params["StartDateGMT"] = convertToJSONDate(start);

    var url : string =  this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/getCouponByValidationDateBetween';
      return new Promise((resolve, reject) => {
        this.httpClient.post<CardCoupon[]>(url, params, this.httpOptions)
        .subscribe((response: any) => {
          this.cardCoupons = response;
          this.cardCoupons = this.cardCoupons.map(card => {
           return new CardCoupon(card);
          })
  
          this.cardCoupons.forEach(item => {
            var driver = !isNullOrUndefined(item.Driver) ? this.getDrivers().find(driver => driver.Id === item.Driver) : undefined;
            var vehicle =  !isNullOrUndefined(item.Car)? this.getVehicles().find(vehicle => vehicle.Id === item.Car): undefined
            item.DriverString = driver !== undefined  ? driver.FullName : ''; 
            item.Vehicle = vehicle !== undefined ?  vehicle.FullName : '';
          })
          this.onCouponsChanged.next(this.cardCoupons);
          resolve(this.cardCoupons);
        },
        (error: HttpErrorResponse) => {
          //this.errorHandler.handleError(error);
          console.log (error.name + ' ' + error.message);
        }, reject);
      });
  }
  getAllCard() : Promise<any>{
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    var url : string =  this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/GetAllCard';
      return new Promise((resolve, reject) => {
        this.httpClient.post<CardCoupon[]>(url, params, this.httpOptions)
        .subscribe((response: any) => {
          this.cardCoupons = response;
          this.cardCoupons = this.cardCoupons.map(card => {
           return new CardCoupon(card);
          });
          this.cardCoupons.forEach(item => {
            var driver = !isNullOrUndefined(item.Driver) ? this.getDrivers().find(driver => driver.Id === item.Driver) : undefined;
            var vehicle =  !isNullOrUndefined(item.Car)? this.getVehicles().find(vehicle => vehicle.Id === item.Car): undefined
            item.DriverString = driver !== undefined  ? driver.FullName : ''; 
            item.Vehicle = vehicle !== undefined ?  vehicle.FullName : '';
          })
          this.onCouponsChanged.next(this.cardCoupons);
          resolve(this.cardCoupons);
        }, 
        (error: HttpErrorResponse) => {
          //this.errorHandler.handleError(error);
          console.log (error.name + ' ' + error.message);
        },reject);
      });
  }
  getDepartments(): any[] {
   return this.departments.value
  }
  getPlaces(): any[] {
    return this.places.value
   }
  getDrivers() : any[] {
     return this.drivers.value
  }
  getVehicles(): any[] {
     return this.vehicles.value
  }
   // Temporarily stores data from dialogs
   dialogData: any;
   getDialogData() {
    return this.dialogData;
  }
  get data(): CardCoupon[] {
    return this.onCouponsChanged.value;
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
   /** CRUD METHODS */
 // delete free card coupon reminder
  deleteCardCoupon(id:number): void{
    
    let arr = [];
    arr.push(id)
    let params = {};
    //UICardCouponManagementWCFService.svc/DeleteFreeCardCoupon
    params["ListCardCouponId"] = arr;
    params["SessionId"] = localStorage.getItem('SessionId');
    this.httpClient.post<CardCoupon>(this.REST_API_SERVER +  '/UICardCouponManagementWCFService.svc/DeleteFreeCardCouponSession', params, this.httpOptions)
    .subscribe(data => {
      if(data){
        const Index = this.cardCoupons.findIndex(x=>x.Id == id);
        this.cardCoupons.splice(Index, 1);
        this.onCouponsChanged.next(this.cardCoupons);
        // Show the success message
    this._matSnackBar.open(this.dataTranslate['NAV.MsgDelete'], 'OK', {
     // here specify the position
     verticalPosition: 'bottom',
     horizontalPosition: 'right' ,
     duration  : 3000
      })
      }
      else{
       // Show the failure message
       this._matSnackBar.open('Could not delete', 'OK', {
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        duration        : 2000
        });
    }
    },
    (err: HttpErrorResponse) => {
     // Show the failure message 
    this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
     // here specify the position
     verticalPosition: 'bottom',
     horizontalPosition: 'right' ,
     duration  : 8000
      })
   });

  }
  // GetUICardCouponManagementParamSession
  getCardCouponManagementParam(): Promise<any>{
  
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
 
  return new Promise((resolve , reject) => {
    this.httpClient.post(this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/GetUICardCouponManagementParamSession', params, this.httpOptions)
    .subscribe((response: any) => {
      let res = fromJson(response)
      this.drivers.next(json2array(res.driverList));
      this.vehicles.next(json2array(res.cars));
      this.departments.next(json2array(res.departments));
      this.places.next(json2array(res.places));
      resolve(response)
    },
    (error: HttpErrorResponse) => {
      //this.errorHandler.handleError(error);
      console.log (error.name + ' ' + error.message);
      }, reject)
  })
}

// UpdateCardCoupon
updateCardCoupon(cardCoupon: any , Id?: number): void{
  const foundIndex = this.cardCoupons.findIndex(x => x.Id === cardCoupon.Id);
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["CardCouponRef"] = cardCoupon.CardCouponRef_;
  params["DateCardCouponLocal"] = "/Date("+ cardCoupon.DateCardCouponLocal.getTime() + ")/";
  params["IdCardCoupon"] = Id;
  params["IdDepartment"] = cardCoupon.Department;
  params["IsCard"] = cardCoupon.IsCard;
  params["IsCardCouponWorkByMoney"] = cardCoupon.IsCardCouponWorkByMoney;
  if(cardCoupon.IsCardCouponWorkByMoney) {
    params["QuantityL"] = cardCoupon.QuantityL;
    params["TotalPrice"] = cardCoupon.QuantityLOrTotalPrice;
    params["PricePerL"] = cardCoupon.PricePerL;
  }
  else{
    params["QuantityL"] = cardCoupon.QuantityLOrTotalPrice;
    params["TotalPrice"] = cardCoupon.TotalPrice
    params["PricePerL"] = cardCoupon.PricePerL;
  }
params["SupplierFuelInt"] = cardCoupon.SupplierFuel;

   this.httpClient.post<CardCoupon>(this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/UpdateCardCouponSession', params, this.httpOptions)
   .subscribe(data => {
                  
    if(data)
    {
      this._matSnackBar.open(this.dataTranslate['NAV.MsgUpdate'], '' , {
        duration: 3000,
        // here specify the position
       verticalPosition: 'bottom',
       horizontalPosition: 'right'});
       var cardNew : CardCoupon = new CardCoupon(data)
       // let idx= this.cardCoupons.findIndex(x=>x.Id==Id);
       // this.cardCoupons.splice(idx,1 );
        this.cardCoupons.push(cardNew);
        this.onCouponsChanged.next(this.cardCoupons);
    }
    
      },
      (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' , {
          duration: 8000,
          // here specify the position
         verticalPosition: 'bottom',
         horizontalPosition: 'right'})
    });
}
// add cardCoupon
addCardCoupon(cardCoupon) : void{
  let refs = ListCardCouponRef(cardCoupon.to, cardCoupon.from, cardCoupon.ref);

  // if(FuseUtils.searchInArray(this.cardCoupons,refs)){
  //   showError('exit', this._matDialog);
  // }
 // else{
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["DateCardCouponLocal"] = "/Date("+ cardCoupon.DateCardCouponLocal.getTime() + ")/";
  params["IdDepartment"] = cardCoupon.Department;
  params["IsCard"] = cardCoupon.IsCard;
  params["IsCardCouponWorkByMoney"] = cardCoupon.IsCardCouponWorkByMoney;
  params["PricePerL"] = cardCoupon.PricePerL;
  if(cardCoupon.IsCardCouponWorkByMoney) {
    params["QuantityL"] = cardCoupon.QuantityL;
    params["TotalPrice"] = cardCoupon.QuantityLOrTotalPrice;
  }
  else{
    params["QuantityL"] = cardCoupon.QuantityLOrTotalPrice;
    params["TotalPrice"] = cardCoupon.TotalPrice
  }
  params["SupplierFuelInt"] = cardCoupon.SupplierFuel;
  params["ListCardCouponRef"] = refs
    this.httpClient.post<CardCoupon[]>(this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/AddCardCouponSession', params, this.httpOptions)
    .subscribe(value => {
      if(value) {
       value.forEach(item => {
         this.cardCoupons.push(new CardCoupon(item));
       })
       this.onCouponsChanged.next(this.cardCoupons);
       this._matSnackBar.open(this.dataTranslate['NAV.MsgAdd'], 'OK' , {
        duration: 3000,
        // here specify the position
       verticalPosition: 'bottom',
       horizontalPosition: 'right'})
      }
    },
    (err: HttpErrorResponse) => {
      this.errorHandler.handleError(err);
      this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' , {
        duration: 8000,
        // here specify the position
       verticalPosition: 'bottom',
       horizontalPosition: 'right'})
  });
//}
}
// AffectCardCoupon
affectCardCoupon(cardCoupon, Id:number) : Observable<CardCoupon[]>{
  
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["Description"] = cardCoupon.Description;
  params["ForMissionEndDateGMT"] = "/Date("+ cardCoupon.Period.ForMissionEndDateGMT.getTime() + ")/";
  params["ForMissionStartDateGMT"] = "/Date("+ cardCoupon.Period.ForMissionStartDateGMT.getTime() + ")/";
  let arr = []
  arr.push(Id)
  params["IdsCardCouponToAffect"] = arr; // array
  params["PricePerL"] = cardCoupon.PricePerL;
  params["Tank"] = cardCoupon.Tank;
  params["idDriver"] = cardCoupon.idDriver;
  params["idUsedCar"] = cardCoupon.idUsedCar;
    return  this.httpClient.post<CardCoupon[]>(this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/AffectCardCouponSession', params, this.httpOptions);
}
// AddOrUpdateCardCouponReminder
reminder(form:any){
  
  let params = {}
  params["SessionId"] = localStorage.getItem('SessionId');
  params["BeginStartRecurringDateGMT"] = convertToJSONDate(form.value.BeginStartRecurringDateGMT)
  params["CardId"] = form.value.CardId
  params["DriverElementId"] = form.value.DriverElementId
  params["EnableGenerateAlert"] = form.value.EnableGenerateAlert
  params["EnabledDayOfWeekes"] =  form.value.EnabledDayOfWeekes // array
  params["IsRecuringByPriceWhenIsCoupon"] = form.value.IsRecuringByPriceWhenIsCoupon === 'true'
  params["RecuringFrequencyNYearMonthWeekDay"] = form.value.RecuringFrequencyNYearMonthWeekDay
  params["RecurringMode"] = form.value.RecurringMode
  params["RecurringQuantityInLOrPriceWhenIsCoupon"] = form.value.RecurringQuantityInLOrPriceWhenIsCoupon
  params["WarnMeBeforeNDay"] = form.value.WarnMeBeforeNDay

    return this.httpClient.post(this.REST_API_SERVER +'/UICardCouponManagementWCFService.svc/AddOrUpdateCardCouponReminderSession' , params , this.httpOptions)
}
// log  : MissionCardCoupon
getLog(Id?:number): Observable<MissionCardCoupon[]>{
   let params = {};
   
   params["SessionId"] = localStorage.getItem('SessionId');
   params["IdCardCoupon"] = Id;
  // params["IdCardCoupon"] = this.routeParams.couponId;
   return this.httpClient.post<MissionCardCoupon[]>(this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/GetCardCouponLogById', params, this.httpOptions)
}
// /UICardCouponManagementWCFService.svc/ReleaseCardCoupon
releaseCardCoupon(Id: number): Observable<Boolean>{
  
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["CardCouponId"] = Id;
    return this.httpClient.post<Boolean>(this.REST_API_SERVER + '/UICardCouponManagementWCFService.svc/ReleaseCardCouponSession', params, this.httpOptions)
}
}
function fromJson(data: any): any{
  
  let drivers = mapValues(data.DicoDriverElement, (value , key) => {
    return {
      Id:  +key,
      FullName : value.FullName
     }
  })
  let departments = mapValues(json2array(data.DicoDepartmentViewedByCurrentAccount), (value , key) => {
    return {
      Id:  +value.Id,
      FullName : value.Name
     }
  })
  let places = mapValues(data.DicoPlaceElementsCurrentCustomer, (value , key) => {
    return {
     Id: value.Id,
     FullName : value.NamePlace
    }
 })
  let currentAccount = data.CurrentAccount.Id
  let cars = mapValues(data.DicoTrackingObjects, (value , key) => {
    if(!isNullOrUndefined(value)){
    return {
        Id:  +key,
        FullName : value.FullName
      }      
    }
    else{
      return;
    }
  })
  var driverList =  _.pickBy(drivers, _.identity)
  return {cars, driverList, places, currentAccount , departments}
}
export function ListCardCouponRef(to: number, from:number, ref:string) : Array<string> {
  var refs: Array<string> = []
  var lg = from - to
   for(var i = 0 ; i <= lg ; i++) {
     let j = to+i

          refs.push(ref + j) 
   }
   return refs
}
