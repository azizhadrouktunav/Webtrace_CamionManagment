import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, interval, Observable, Subject, timer } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { Operation, Vehicle } from './model';
import { isNullOrUndefined } from 'util';
import { MatSnackBar } from '@angular/material';
import { json2array } from 'app/main/helpers/must-match.validator';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { TranslateService } from '@ngx-translate/core';
import { async } from '@angular/core/testing';
import { map, catchError, repeatWhen, delay, filter, take, takeUntil, exhaustMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class GestionDesVehiculesService implements Resolve<any> {
  private GeneralURL = environment.apiUrl + '/CarManagementWCFService.svc';
  private CommandeURL = environment.apiUrl + '/CommandWCFService.svc';
  private accidentURL = environment.apiUrl + '/CommonWCFService.svc';
  public myObservable = () : Observable<boolean> =>{
    console.log('retrieving the token in DB');
    return Observable.create(observer => {
        setTimeout(() => {
            observer.next(true);
            observer.complete();
        }, 5000);
    });
}
  routeParams: any;
  essionId = [];
  data = {SessionId: localStorage.getItem('SessionId')
  };
  onVehiclesChanged: BehaviorSubject<any>;//
  onOperationsChanged: BehaviorSubject<any>;
  onCommandListChanged: BehaviorSubject<any>;
  vehicles: Vehicle[];
  departments: any[];
  Specialities:any[];
  drivers: any[];
  acounts: any[];
  carTypes: any[];
  carModels: any[];
  carIcons: any[];
  personIcons : any[];
  operations: any[]= [];
  subscription: any;
  isAddCommandFirstCall = true;
  commandListKeys = [];
  commandList = [];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  private killTrigger: Subject < void > = new Subject();

  CanChangeSimNumber: any;
  commandListStandBY: any;
   /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient,
      private _errorHandler : ErrorHandlerService,
      private _matSnackBar: MatSnackBar,
      private _router : Router,
      private translateService: TranslateService,
  )
  {
    // Set the defaults
    this.onVehiclesChanged = new BehaviorSubject({});
    this.onOperationsChanged = new BehaviorSubject([]);
    this.onCommandListChanged = new BehaviorSubject([]);
    this.translateService.get(['NAV.Car_deleted_msg', 'NAV.Car_update_msg' , 'NAV.Car_add_msg'])
    .subscribe(data => { this.data = data }
    );
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
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getVehicles()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }
   /**
     * Get vehicles
     *
     * @returns {Promise<any>}
     */
  getVehicles(): Promise<any>
  { 
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params[""]
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.GeneralURL}/GetUICarManagementParam` , params, this.httpOptions)
          .subscribe((response: any) => {
            
            
            this.vehicles = response.ListTrackingObject
            this.vehicles = this.vehicles.map(item => {
              return new Vehicle(item);
            });
              this.onVehiclesChanged.next(this.vehicles);
              this.departments = response.ListDepartment;
              this.Specialities= response.Specialities;
              this.CanChangeSimNumber = response.CurrentAccountElement.Customer.CanChangeSimNumber
              this.departments =  this.departments.map(dep => {
                return {Id: dep.Id , Name: dep.Name}
              })
              this.drivers = response.ListDriverElement.map(driver => {
                return {Id: driver.key , Name: driver.FullName}
              });
              this.acounts = response.ListAccount.map(acount => {
                return {Id: acount.Id , Name: acount.Login}
              });
              this.carIcons = response.ListCarIconName.map (icon => {
                return { url: environment.iconUrl+'/images/TrackingObject/'+icon+'.png', IconName : icon, name : icon.toString().toLowerCase().replace(/-32x32|-32|32/g, '')}
              });
              this.personIcons = response.ListHumanGPSIconName.map(icon => {
               return { url: environment.iconUrl+'/images/TrackingObject/Human/'+icon+ '-32x32.png' , name : icon,  IconName: icon+'-32x32'}
              });
              this.carModels = response.DicoCarTypeWithLstModelEnum;
              this.carTypes = json2array(response.DicoCarTypeEnum);
              resolve(response);
          },
          (error: HttpErrorResponse) => {
            ////this.errorHandler.handleError(error);.handleError(error);
     }, reject);
  });
  }
  /**
     * Add Or update vehicle
     *
     * @param vehicle
     * @returns {Promise<any>}
     */
   addOrUpdateVehicle(vehicle, ScannedGrayCardUrl,ScannedImgCar) : Observable<any>{
  
      const vehicleIndex = this.vehicles.findIndex(x => x.Key === vehicle.Key);
      let msgSnack : string = '';
      let params = {}; 
    
      params["IdTrackingObject"]  = vehicle.Key;
      params["SessionId"] = localStorage.getItem('SessionId');
      params["IconName"] = vehicle.IconName;
      params["FullName"] = vehicle.FullName;
      params["FullName2"] = vehicle.FullName2;
      params["Department"] = vehicle.Department;
      params["Driver"] = vehicle.Driver ==""? 0:vehicle.Driver;
      params["CurrentCarTypeEnum"] = vehicle.CarType;
      params["CurrentCarModelEnum"] =  vehicle.CarModel;
      params["FuelContainerCapacity"] = vehicle.FuelContainerCapacity;
      params["SimCardNumber"] = vehicle.SimCardNumber;
      params["Mileage"] = vehicle.MileageFloat;
      params["FuelTypeEnum"] =  vehicle.FuelType;
      params["ModelYear"] = vehicle.ModelYear;
      params["FuelTheoreticalCosumptionAvg"] = vehicle.FuelTheoreticalCosumptionAvg;
      params["Weight"] = !isNullOrUndefined(vehicle.Weight) ? vehicle.Weight : '' ;
      params["Displacement"] =  vehicle.Displacement;
      if(ScannedGrayCardUrl!= null)
      params["ScannedGrayCardUrl"] = ScannedGrayCardUrl;
      if(ScannedImgCar!=null)
      params["ScannedCarUrl"] = ScannedImgCar;
      params["ChassisNumber"] = !isNullOrUndefined(vehicle.ChassisNumber) ? vehicle.ChassisNumber : '';
      params["DateOfCirculation"] = !isNullOrUndefined(vehicle.DateOfCirculation) ? convertToJSONDate(vehicle.DateOfCirculation) : "/Date(1603321200000)/";
      params["DateOfReform"] = !isNullOrUndefined(vehicle.DateOfReform) ? convertToJSONDate(vehicle.DateOfReform) : "/Date(1603321200000)/";
      params["NomberOfPlaces"] =  vehicle.NomberOfPlaces;
      params["FiscalPower"] = vehicle.FiscalPower;
      params["RealPower"] = vehicle.RealPower;
      params["Speciality"] = vehicle.Specialities;
    return  this._httpClient.post(`${this.GeneralURL}/AddOrUpdateCarTrackingObject`, params, this.httpOptions).pipe(
      map(data=>{
        //return data;

        if(data !== 'null'){
          let newCar = new Vehicle(data);
          if(vehicleIndex === -1){
            this.vehicles.unshift(newCar)
            msgSnack =this.data['NAV.Car_add_msg'];
          }
          else{
            this.vehicles.splice(vehicleIndex, 1, newCar);
            msgSnack = this.data['NAV.Car_update_msg'];
            this.GetAddedOrChangedCommand([]).subscribe((data)=>{ 
              this.commandListKeys = [];
              Object.keys(data).forEach(key=>{
                this.commandListKeys.push({alertkey: +key,iscomplete: false});
              });
              this.testValidation();
            });
          }
         
          this.onVehiclesChanged.next(this.vehicles);
               // Show the success message
          this._matSnackBar.open(msgSnack, 'sucess', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
            return this.vehicles;

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
      })
    )
  }
  
  /**
   * addOrUpdate person
   * @param person
   * @returns {Promise<any>}
   */
  addOrUpdatePerson(person) : Promise<any> {
    const personIndex = this.vehicles.findIndex(x => x.Key === person.Key);
    let msg: string = "";
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params['Department'] = person.Department;
    params['Email'] = person.Email;
    params['FirstName'] = person.FirstName;
    params['FixTelphoneNumber'] = person.FixTelphoneNumber.toString();
    params['IdTrackingObject'] = person.id;
    params['LastName'] = person.LastName;
    params['MobileTelephoneNumber'] = person.MobileTelephoneNumber.toString();
    params['IconName'] = person.IconName;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.GeneralURL}/AddOrUpdatePersonTrackingObject`, params, this.httpOptions)
          .subscribe(response => {
            if(response !== 'null'){
              let newPerson = new Vehicle(response);
              if(personIndex === -1){
                this.vehicles.unshift(newPerson)
                msg = 'Person was added';
              }
              else{
                this.vehicles.splice(personIndex, 1, newPerson);
                msg = 'Person is updated';
              }
              this.onVehiclesChanged.next(this.vehicles);
              resolve(this.onVehiclesChanged);
                   // Show the success message
              this._matSnackBar.open(msg, 'sucess', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
                });
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
    if(error.error == "Session was terminated")
        {
          this._matSnackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(()=>{
            this._router.navigate(['app-auth']);
          });
        } 
        else {
          // Show the failure message
          this._matSnackBar.open("votre session est expirée!", "s'identifier", {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });     }  
          })
        })
  }
    /**
       * Delete vehicle
       *
       * @param vehicle
       * @returns {Promise<any>}
       */
deleteVehicle(vehicle): Promise<any>{
  const Index = this.vehicles.indexOf(vehicle);
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["IdTrackingObject"] = vehicle.Key;
  return new Promise((resolve, reject) => {
     this._httpClient.post(`${this.GeneralURL}/DeleteTrackingObject`, params, this.httpOptions)
    .subscribe((response: boolean) =>{
      if(response){
        this.vehicles.splice(Index, 1);
        this.onVehiclesChanged.next(this.vehicles);
          // Show the success message
            this._matSnackBar.open(this.data['NAV.Car_deleted_msg'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
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
             if(error.error == "Session was terminated")
             {
               this._matSnackBar.open("votre session est expirée!", "s'identifier", {
                 duration: 10000
               }).afterDismissed().subscribe(()=>{
                 this._router.navigate(['app-auth']);
               });
             } 
             else {
               // Show the failure message
               this._matSnackBar.open("votre session est expirée!", "s'identifier", {
                 // here specify the position
                 verticalPosition: 'bottom',
                 horizontalPosition: 'right',
                 duration        : 2000
                 });     }  
               })
             })
      } 
  /**
   * 
   * Add Operation
   * @param operation
  * @returns {Promise<any>}
   **/
addOperation(operation, vehicleId: number): void{
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params['Department'] = operation.department;
  params['AccountWorkedBy'] = operation.acountWorkedBy;
  params['CarOperationTypeEnum'] = operation.type;
  params['Driver'] = operation.driver;
  params['IdTrackingObject'] = vehicleId;
  params['OperationCost'] = operation.cost;
  params['OperationDateGmt'] = !isNullOrUndefined(operation.operationDate) ? convertToJSONDate(operation.operationDate): null;
  params['OperationMileage'] = operation.mileage;
  params['Comment'] = operation.comment;
  params['Description'] = operation.description;
        this._httpClient.post(`${this.GeneralURL}/AddCarLog`, params, this.httpOptions)
            .subscribe((response:any) => {
                this.operations.unshift(new Operation(response))
                this.onOperationsChanged.next(this.operations);
                  // Show the success message
                this._matSnackBar.open(this.data['NAV.Log_car_updated_msg'], 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration        : 2000
                  });
              //  else {
              //   // Show the failure message
              // this._matSnackBar.open('Server is Not Responding', 'OK', {
              //   // here specify the position
              //   verticalPosition: 'bottom',
              //   horizontalPosition: 'right',
              //   duration        : 2000
              //   });
              //  }
            },
            error => { 
              console.info(error);
                    // Show the failure message
                    if(error.error == "Session was terminated")
                    {
                      this._matSnackBar.open("votre session est expirée!", "s'identifier", {
                        duration: 10000
                      }).afterDismissed().subscribe(()=>{
                        this._router.navigate(['app-auth']);
                      });
                    } 
                    else {
                      // Show the failure message
                      this._matSnackBar.open("votre session est expirée!", "s'identifier", {
                        // here specify the position
                        verticalPosition: 'bottom',
                        horizontalPosition: 'right',
                        duration        : 2000
                        });     }    
    });
}
  GetAddedOrChangedCommand(IdCommands){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      IdCommands: IdCommands
    }
    return this._httpClient.post(`${this.CommandeURL}/GetAddedOrChangedCommand`, JSON.stringify(dataStruct), this.httpOptions);
  }
  testMileageFloatChanges(vehicule){
    if(this.isAddCommandFirstCall){
      const source = interval(20000);
      this.subscription = source.subscribe(val => this.testValidation());
      this.isAddCommandFirstCall = false;
    }
    
  }
  testValidation(): void {
    
    if(this.isEmptycommandListKeys() != -1){
      let filtredCommandListKeys = this.commandListKeys.map(x => x.alertkey);
    timer(0, 3000)
      .pipe(takeUntil(this.killTrigger),
              
          exhaustMap(() =>  this.GetAddedOrChangedCommand(filtredCommandListKeys))).subscribe((e)=>{ 
        this.commandList = [];
        Object.keys(e).forEach(key=>{
          this.commandList.push(e[key]);
          if(e[key]['StatusCommand'] != 0){//test if command status != wait
            var index  = this.commandListKeys.map(x => {return x.alertkey}).indexOf(Number(key));
            this.commandListKeys[index]['iscomplete'] = true;
            if(e[key]['StatusCommand'] == 1 || e[key]['StatusCommand'] == 2){
              //Change Vehicule Km
            }
          }
        });
        this.commandListStandBY =  this.commandList.find(x => x.StatusCommand == 0);
        if(this.commandListStandBY == undefined)
        {
          this.killTrigger.next();

        }
        this.onCommandListChanged.next(this.commandList);

      });

    }else{
     // this.subscription.unsubscribe();
      this.isAddCommandFirstCall = true;
    }
  }
  isEmptycommandListKeys() {
    return this.commandListKeys.map(x=> x.iscomplete).indexOf(false);
  }
  // show vehicles with equipment
  selectEquippedVehicles(slected: boolean) {
    var equippedVehicles : Vehicle[];
         if(slected) {
          equippedVehicles =  this.vehicles.filter(item =>  (item.CurrentEquipmentElement != null) && (item.CurrentEquipmentElement.IsAssignedToClient));
         }
         else if(!slected) {
          equippedVehicles =  this.vehicles.filter(item =>  (item.CurrentEquipmentElement == null) || (!item.CurrentEquipmentElement.IsAssignedToClient));
         }
         this.onVehiclesChanged.next(equippedVehicles);
      
  }
  uploadGrayCard(file: File,IdTrackingObject): Observable<any> {
    console.log(file);
    let formData: FormData = new FormData();  
    formData.append('uploadFile', file, file.name);
    console.log(formData.getAll('uploadFile'));
  
    return this._httpClient.post(`${this.GeneralURL}/UploadScannedGrayCard?SessionId=`+localStorage.getItem('SessionId')+'&IdTrackingObject='+IdTrackingObject+'', formData).pipe(
      map(data=>{
        return data;
      })
    )
    
    
   
  } 
  uploadImgCar(file: File,IdTrackingObject): Observable<string>{
    console.log(file);
    let formData: FormData = new FormData();  
    formData.append('uploadFile', file, file.name);
    console.log(formData.getAll('uploadFile'));
  
    return this._httpClient.post(`${this.GeneralURL}/UploadScannedCar?SessionId=`+localStorage.getItem('SessionId')+'&IdTrackingObject='+IdTrackingObject+'', formData).pipe(
      map((data: string)=>{
        return data;
      })
    )
  } 


  
}
 