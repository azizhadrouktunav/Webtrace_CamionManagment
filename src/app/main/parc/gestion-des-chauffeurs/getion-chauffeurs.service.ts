import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject,timer, Subject} from 'rxjs';
import { environment } from 'environments/environment';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Driver } from '../gestion-des-chauffeurs/model';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { isNull } from 'util';
import { ErrorDialogComponent } from '../Dialogs/error-dialog/error-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { map, catchError, repeatWhen, delay, filter, take, takeUntil, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetionChauffeursService implements Resolve<any> {
  
  private readonly REST_API_SERVER = environment.apiUrl
  // Http Header
  private readonly httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
  onDriversChanged: BehaviorSubject<any>;
  onEquipments: BehaviorSubject<any>;

  drivers: Driver[];  
  departments : any[];
  equipements:any[];
  commandListKeys = [];
  commandList = [];
  commandListStandBY: any;
  subscription: any;
  onCommandListChanged: BehaviorSubject<any>;
  private killTrigger: Subject < void > = new Subject();
  isAddCommandFirstCall = true;
  data = {SessionId: localStorage.getItem('SessionId')
  };
  private GeneralURL = environment.apiUrl + '/DriverManagementServiceWCF.svc';
  private CommandeURL = environment.apiUrl + '/CommandWCFService.svc';
  constructor(private _httpClient: HttpClient,
              private errorHandler: ErrorHandlerService,
              private _matSnackBar : MatSnackBar,
              private _matDialog: MatDialog,
              private translateService: TranslateService,
               private _router : Router) { 
    // set default
    
    this.onDriversChanged = new BehaviorSubject([]);
    this.onEquipments= new BehaviorSubject([]);
    this.onCommandListChanged = new BehaviorSubject([]);
    
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
        return new Promise<void>((resolve, reject) => {

            Promise.all([
               this.getDrivers()
            ]).then(
                ([]) => {

                    resolve();

                },
                reject
            );
        });
    }
  /**
     * Get drivers
     *
     * @returns {Promise<any>}
     */
  getDrivers(): Promise<any>
  {
    this.translateService.get(['NAV.DriverUpdateMsg','NAV.DriverAddMsg','NAV.DriverRemoveMsg'])
    .subscribe(data => { this.data = data }
    );

    let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.REST_API_SERVER + '/DriverManagementServiceWCF.svc/GetUIDriverManagementParam', params, this.httpOptions)
          .subscribe((response: any) => {
             
              this.drivers = response.GetUIDriverManagementParamResult.ListDriverElement;
              this.departments =  response.GetUIDriverManagementParamResult.ListDepartment;
             
              this.departments = this.departments.map(dep => {
                return {Id: dep.Id , Name: dep.Name}
              })
              this.drivers = this.drivers.map(driver => {
                  return new Driver(driver);
              });

              this.onDriversChanged.next(this.drivers);
              resolve([this.drivers, this.departments]);
            },
              (error: HttpErrorResponse) => {
                
                ////this.errorHandler.handleError(error);
                console.log (error.name + ' ' + error.message);
              }, reject);
  });
  }
  getEquipements( key) 
  {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["keyDriver"]= key;
    return this._httpClient.post(this.REST_API_SERVER + '/DriverManagementServiceWCF.svc/GetElementsFreeByDriver', params, this.httpOptions);
        
  }
  UpdateCarsCanDriveTheDriver(DriverKey,IsAddCommand,TrackingObjectKey):  Observable<any>
  {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["DriverKey"] =DriverKey;
    params["IsAddCommand"] =IsAddCommand;
    params["TrackingObjectKey"] =TrackingObjectKey;
    return this._httpClient.post(this.REST_API_SERVER+ '/DriverManagementServiceWCF.svc/UpdateCarsCanDriveTheDriver', params, this.httpOptions).pipe(
      map((result:any)=>{
        if(result.UpdateCarsCanDriveTheDriverResult =="")
        {
          this.GetAddedOrChangedCommand([]).subscribe((data)=>{ 
            this.commandListKeys = [];
            Object.keys(data).forEach(key=>{
              this.commandListKeys.push({alertkey: +key,iscomplete: false});
            });
            this.testValidation();
          });
         // this.testValidation();
        }
        else
        {
          this._matSnackBar.open(result.UpdateCarsCanDriveTheDriverResult, 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
      })
    )
     
   


  }
  updateDriver(driver): Promise<any>{
    
    
   // const Index = this.drivers.findIndex(driver => { return driver.key ===  driver.key });
    var Index = this.drivers.indexOf(this.drivers.find(it => it.key === driver.key));
    let params = {};
    params["sessionId"] = localStorage.getItem('SessionId');
    params['DriverId'] = driver.key;
    params['FirstName'] = driver.FirstName;
    params['LastName'] = driver.LastName;
    params['DepartmentId'] = driver.DepartmentId;
    params['Email'] = driver.Email;
    params['Telephone'] = driver.Tel;
    params['DriverCode'] = driver.DriverCode;
    params['ElockSealCardId'] = driver.Seal;
    params['ElockUnsealCardId'] = driver.UnSeal;

    params['Address'] = driver.Address;
    params['BirthDate'] = convertToJSONDate(driver.BirthDateLocal);
    params['BirthPlace'] = driver.BirthPlace;
    params['CIN'] = driver.CIN;
    params['DriverLicenseExpirationDate'] = !isNaN(driver.DriverLicenseExpirationDateLocal) ? convertToJSONDate(driver.DriverLicenseExpirationDateLocal) : null;
    params['DriverLicenseNumber'] = driver.DriverLicenseNumber;
    params['DriverLicenseType'] = driver.DriverLicenseType;
    params['UrlScannedCINFront'] = '';
    params['UrlScannedCINBack'] = '';
    params['UrlScannedDriverLicenseFront'] = '';
    params['UrlScannedDriverLicenseBack'] = '';
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.REST_API_SERVER+ '/DriverManagementServiceWCF.svc/UpdateDriverNewV2', params, this.httpOptions)
      .subscribe((response: any) => {
        var res = response.UpdateDriverNewV2Result
        if(!isNull(res)){
          this.drivers[Index]= new Driver(res);
          //.splice(Index, 1, new Driver(res));
          this.onDriversChanged.next(this.drivers);
            // Show the success message 
      this._matSnackBar.open( this.data["NAV.DriverUpdateMsg"], 'OK' ,{
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right' ,
        duration  : 8000
         });


        }
      },
      (err: HttpErrorResponse) => {
        
        if(err.status == 403){
          let msgError : string = err.error.Message;
          this.showError(msgError);
        }

         else if(err.error == "Session was terminated")
        {
          this._matSnackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(()=>{
            this._router.navigate(['app-auth']);
          });
        } 
        else {
        // Show the failure message 
       this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right' ,
        duration  : 8000
         });
        }
      })
    })
  }
  addDriver(driver): Promise<any>{
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params['FirstName'] = driver.FirstName;
    params['LastName'] = driver.LastName;
    params['DriverCode'] = driver.DriverCode.toString();
    params['Email'] = driver.Email;
    params['Tel'] = driver.Tel;
    params['DepartmentId'] = driver.DepartmentId.toString();
    params['Address'] = driver.Address;
    params['BirthDate'] = convertToJSONDate(driver.BirthDateLocal);
    params['BirthPlace'] = driver.BirthPlace;
    params['CIN'] = driver.CIN;
    params['DriverLicenseType'] = driver.DriverLicenseType;
    params['DriverLicenseNumber'] = driver.DriverLicenseNumber;
    params['DriverLicenseExpirationDate'] = !isNaN(driver.DriverLicenseExpirationDateLocal) ? convertToJSONDate(driver.DriverLicenseExpirationDateLocal) : null;
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.REST_API_SERVER+ '/DriverManagementServiceWCF.svc/AddDriverNew', params, this.httpOptions)
      .subscribe((response: any) => {
        var res = response.AddDriverNewResult
        if(!isNull(res)){
        this.drivers.unshift(new Driver(res));
        this.onDriversChanged.next(this.drivers);
              // Show the success message 
       this._matSnackBar.open(this.data["NAV.DriverAddMsg"], 'OK' ,{
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right' ,
        duration  : 8000
         });
        }
      },
      (err: HttpErrorResponse) => {
        if(err.status == 403){
          let msgError : string = err.error.Message;
          this.showError(msgError);
        }
        else if(err.error == "Session was terminated")
        {
          this._matSnackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(()=>{
            this._router.navigate(['app-auth']);
          });
        } 
        else {
        // Show the failure message 
        this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' ,{
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right' ,
          duration  : 8000
          });
        }
      },resolve)
    })
  }

  deleteDriver(driver){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),
      DriverKey: driver.key
     }
    return this._httpClient.post(`${this.GeneralURL}/DeleteDriver`, JSON.stringify(dataStruct), this.httpOptions)
    .subscribe((data: any) =>{
      let res = data.DeleteDriverResult;
      if(res == ""){
        const driverIndex = this.drivers.indexOf(driver);
        this.drivers.splice(driverIndex, 1);
        this.onDriversChanged.next(this.drivers);
           // Show the success message
       this._matSnackBar.open(this.data["NAV.DriverRemoveMsg"], 'OK', {
         // here specify the position
         verticalPosition: 'bottom',
         horizontalPosition: 'right',
         duration        : 2000
         });
       }
     else{
         this.showError(res);
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
             this._matSnackBar.open('Server is Not Responding', 'OK', {
               // here specify the position
               verticalPosition: 'bottom',
               horizontalPosition: 'right',
               duration        : 2000
               });}
     });
  }  
   // show error message
   showError(error : string, width: string = '250px') : void {
    this._matDialog.open(ErrorDialogComponent, {
      data: {errorMsg: error} ,width : width 
    });
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
      //this.subscription.unsubscribe();
      this.isAddCommandFirstCall = true;
    }
  }
  isEmptycommandListKeys() {
    return this.commandListKeys.map(x=> x.iscomplete).indexOf(false);
  }
  GetAddedOrChangedCommand(IdCommands){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      IdCommands: IdCommands
    }
    return this._httpClient.post(`${this.CommandeURL}/GetAddedOrChangedCommand`, JSON.stringify(dataStruct), this.httpOptions);
  }
}