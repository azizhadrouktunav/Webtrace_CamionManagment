import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import {  Router } from '@angular/router';
import { SnackbarMessageComponent } from 'app/main/helpers/snackbar-message/snackbar-message.component';
import DataSource from 'devextreme/data/data_source';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { CommandService } from '../commands/commandService ';
import { GlobalMap } from '../map/map';
import { SharedDataService } from '../shared-data.service';
import { ForcedStopComponent } from './forced-stop/forced-stop.component';
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';
import { RealTimeTrackingObject } from './RealTimeTrackingObject';
import { TrackingObjectService } from './tracking-objects.service';
import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from '../../../navigation/i18n/fr';
import { locale as arab } from '../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { exportDataGrid } from 'devextreme/excel_exporter';

import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { HttpClient, HttpClientModule, HttpHeaders, HttpRequest } from "@angular/common/http";
import { post } from 'jquery';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular'
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


//import { ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss'],
    // encapsulation: ViewEncapsulation.None
})
export class TrackingComponent implements OnInit, OnDestroy {
    id = Math.random();
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    Map: GlobalMap;
    CarInfoExmple: any = {};
    dataSource = new DataSource({

    })
    fuelResult = [{
        name: 'Fuel Level',
        value: 15
    }];
    distanceResult = [{
        name: 'Fuel Level',
        value: 450
    }];
    speedResult = [{
        name: 'Fuel Level',
        value: 90
    }];
    colorScheme = {
        domain: ['#0090d6']
    };
    subscription: Subscription;
    fullTrackingObjects  : RealTimeTrackingObject[] = [];
    trackingObjects: RealTimeTrackingObject[] = [];
    SortedType : string = "full";
    dialogRef: any;
    @Output() vehicleIdEvent = new EventEmitter < number > ();
    // for unsubscribe onPlaceChanged
    subscription$: Subscription;
    isDisabledBtn: boolean = true;
    isAdmin : boolean=false
    color = 'primary-50-bg';

    ConnectedCarsCount : number = 0;
    DisconnectedCarsCount : number = 0;
    NoEquipmentCarsCount : number = 0;
    isLoading: boolean = true;

    RefreshCounter : number = 30;
    storageKey: string = "datagrid-state";
    isMobileResolution: boolean;
   
    constructor(
        private _trakcingObjectService: TrackingObjectService,
        private _data: SharedDataService,
        private _commandService: CommandService,
        private _router: Router,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _TranslateService: TranslateService,
        private httpClient: HttpClient,
        private cd: ChangeDetectorRef
       
    ) {
        if (window.innerWidth < 768) {
            this.isMobileResolution = true;
          } else {
            this.isMobileResolution = false;
          }
        this.Map = GlobalMap.globalMap;

        this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
        this.StateGridLoad = this.StateGridLoad.bind(this);
        this.saveGridState= this.saveGridState.bind(this);

    }

    ngOnInit() {
        if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
            this.isAdmin= true;
          else
          this.isAdmin= false;
        this._trakcingObjectService.isLoading.subscribe( value => {
            this.isLoading = value;
        })
        let firstZoom = true;
        
        this.subscription = this._trakcingObjectService.onTrackingObjectsChanged.subscribe(response => {
            //console.log("tracking", response.length)
           // this._trakcingObjectService.isLoading.next(false);
            this.countCars(response);
            response.forEach(car => {
                if (car.CurrentEquipmentSerialNumber != "--") {
                    let element = this.trackingObjects.find(e => e.data.Key == car.Key);
                    if (element == undefined) {
                        this.trackingObjects.push(new RealTimeTrackingObject(car));
                    } else {
                        element.update(car)
                    }
                }
                this.cd.detectChanges()
            });

            let array = [];
            this.trackingObjects.forEach( (car, index) => {
                if(response.find(e => e.Key == car.data.Key) != undefined){
                    array.push(car);
                }else{
                    car.remove();
                }
            })
            this.trackingObjects = array;
            this.fullTrackingObjects = this.trackingObjects;
            if(!this.isMobileResolution)
            {firstZoom ? this.Map.focusOn(response.map(car => {
                return new L.LatLng(car.Latitude, car.Longitude)
            }), 0) : false;
            firstZoom = false;}
            let type = this.SortedType;
            this.SortTrackingUsing("full")
            this.SortTrackingUsing(type)
        })
           //this.StateGridLoad();

        // this.CarInfoExmple = decrypt(FakeResponse.Path);

        this.Map.toggleVehicleCluster(true);
        
    }
    saveGridState(state) {
        console.log('saving grid 0');
        if(state )
        {
            localStorage.setItem('StateGrid', JSON.stringify(state));
          //  localStorage.setItem(this.storageKey, JSON.stringify(state));
           this._trakcingObjectService.SaveWorkspaceParam(state).subscribe(response=>{ 
               let test= response;
           });
       }
      
    }
    
    sendStorageRequest = sendStorageRequest

    StateGridLoad()
    {
       
       
        return new Promise( (resolve, reject) => {
  
            var data = localStorage.getItem('StateGrid');
            if (data) 
            {
              var state = JSON.parse(data);
             // console.log('load',state);
              
              resolve(state);
            }
            else
            {
                this._trakcingObjectService.GetWorkspaceParam().subscribe(response=>{
                    state = response['GetNewWorkspaceParamResult'];
                    state.columns.forEach((element, index) => {
                      if(element.visibleIndex ==0)
                        {
                           // element.visibleIndex= index;
                        }
                        if(index==1)
                        {
                            state.columns[index]={visibleIndex: 1, width: 130, visible: true};
                            element=  {visibleIndex: 1, width: 130, visible: true};
                        }
                    });
                    localStorage.setItem('StateGrid', JSON.stringify(state));
                    resolve(state);
        
                });

            }
        });
      
        //return state;
    }
    exportGrid(e) {
        const workbook = new Workbook(); 
        const worksheet = workbook.addWorksheet("Main sheet"); 
        exportDataGrid({ 
            worksheet: worksheet, 
            component: e.component
        }).then(function() {
            workbook.xlsx.writeBuffer().then(function(buffer: BlobPart) { 
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "ExplorateurDesVéhicules.xlsx"); 
            }); 
        }); 
        e.cancel = true; 
    }
    ngOnDestroy() {
        
       /*  this.trackingObjects.forEach(car => {
            car.remove();
        }) */
        this._trakcingObjectService.onDestroy();
        this.subscription.unsubscribe();
    }

    countCars(cars){
        this.ConnectedCarsCount = 0;
        this.DisconnectedCarsCount = 0;
        this.NoEquipmentCarsCount = 0;

        cars.forEach(car => {
            if(car.CurrentEquipmentElement){
                if(car.Connected){
                    this.ConnectedCarsCount++;
                }else{
                    this.DisconnectedCarsCount++;
                }
            }else{
                this.NoEquipmentCarsCount++;
            }
        });
    }

    SortTrackingUsing(type : string){
        this.trackingObjects = [];
        if(this.SortedType == type){
            type = "full";
        }
        this.SortedType = type;
        switch(type){
            case "connected" : {
                this.fullTrackingObjects.forEach( car => {
                    if(car.data.Connected) this.trackingObjects.push(car)
                })
            } break;
            case "disConnected" : {
                this.fullTrackingObjects.forEach( car => {
                    if(car.data.CurrentEquipmentElement)
                    if( car.data.CurrentEquipmentElement.IsAssignedToClient && !car.data.Connected) this.trackingObjects.push(car)
                })
            } break;
            case "unequiped" : {
                this.fullTrackingObjects.forEach( car => {
                    if(!car.data.CurrentEquipmentElement || !car.data.CurrentEquipmentElement.IsAssignedToClient) 
                    this.trackingObjects.push(car)
                })
            } break;
            case "full" : {
                this.trackingObjects = this.fullTrackingObjects;
            } break;
        }
    }

    isOpened(evt: any, car: RealTimeTrackingObject) {
        // set you flag here that you can use in ng-class for the button.
        var msg: string;
       
        this._TranslateService.get('msgNoEquipmentForThisCar').subscribe(value => {
            msg = value;
        })
        if (!isNullOrUndefined(car.data.CurrentEquipmentElement)) {
            this.isDisabledBtn = car.data.CurrentEquipmentElement.IsAssignedToClient;
            if (!car.data.CurrentEquipmentElement.IsAssignedToClient) {
                this._snackBar.openFromComponent(SnackbarMessageComponent, {
                    data: {
                        checkable: true,
                        text: msg,
                        action: 'Close',
                        icon: 'warning',
                    },
                    duration: 5000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center'
                });
            }
        } else {
            this.isDisabledBtn = false;
            this._snackBar.openFromComponent(SnackbarMessageComponent, {
                data: {
                    checkable: true,
                    text: msg,
                    action: 'Close',
                    icon: 'warning',
                },
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
            });
        }
    }
    // Not OK should send trackingObject to generalReport comp in other module
    openFullReport(car: RealTimeTrackingObject): void {
        //this._data.setFirstServiceResponse(car.Key);
        this._router.navigate(['/reports/generalreport/Details/' + car.Key]);
        this._data.changeIndex(0);
    }
    // Not OK should send trackingObject to alet-configuration comp in other module
    alertSettings(car: RealTimeTrackingObject): void {

        this._data.changeSettingsAlert(car.Key).then(() => {
            this._router.navigate(['/administration/alet-configuration']);
            this._data.changeIndex(0);
        });
    }
    drawTrajectory(car: RealTimeTrackingObject) {
        this._data.setThirdServiceResponse(car);
       // this._data.setcarServiceResponse(car.name);
        this._data.changeIndex(3);
    }
    // Ok
    openStops(car: RealTimeTrackingObject): void {
        this._data.setSecondServiceResponse(car.Key);
        this._data.changeIndex(2);
    }
    // OK
    getCurrentPosition(car: RealTimeTrackingObject): void {
        this._commandService.sendCommandeGetCurrentPosition(car.Key)
        this._data.changeIndex(4);
    }
    //OK
    overSpeedAlert(car: RealTimeTrackingObject): void {
        this._data.changeIndex(1);
        this._data.setFirstServiceResponse(car.Key);
    }
    // OK
    forcedStop(car: RealTimeTrackingObject): void {
        this.dialogRef = this._matDialog.open(ForcedStopComponent, {
            panelClass: 'app-forced-stop',
            data: {
                equipment: car.data.CurrentEquipmentSerialNumber,
                forcedAAD: car.data.CurrentEquipmentElement.HardwareSupportForcedAAD,
                outputArming: car.data.CurrentEquipmentElement.HardwareSupportOutputArming,
                cars: this.trackingObjects
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const confDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
                    disableClose: false
                  });
                  confDialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir envoyer la commande ?";
                  confDialogRef.afterClosed().subscribe((confirmed: boolean) => {
                    if (confirmed) {
                        if(!response[1]){
                    const formData: FormGroup = response[0];
                    var _response = formData.getRawValue();
                    if (_response.activatedAlert == true) {
                        this._commandService.tryToChangeForcedArming(_response.equipment, _response.activatedAlert);
                    } else if (_response.activatedAlert == 'activedArming') {
                        this._commandService.tryToChangeArming(_response.equipment, true);
                    } else {
                        this._commandService.tryToChangeArming(_response.equipment, false);
                    }
                    this._data.changeIndex(4);
                }else{
                    // check if the response[2] elements (list of cars name) exist in the trackingObjects list
                    // if yes, then call for each element tryToChangeArming function
                    const formData: FormGroup = response[0];
                    var _response = formData.getRawValue();
                    let cars = response[2];
                    console.log(cars);
                    
                    for(let i = 0; i < cars.length; i++){
                        if(cars[i].CurrentEquipmentSerialNumber){
                            if(_response.activatedAlert == 'activedArming'){
                                this._commandService.tryToChangeArming(cars[i].CurrentEquipmentSerialNumber +"", true);
                            }else{
                                this._commandService.tryToChangeArming(cars[i].CurrentEquipmentSerialNumber + "", false);
                            }
                        }
                    }
                    this._data.changeIndex(4);
                }
            }
        });
            });
                    
                
    }
    showOnMap(car: RealTimeTrackingObject): void {
        var msg: string;
        this._TranslateService.get('msgNoEquipmentForThisCar').subscribe(value => {
            msg = value;
        })
        if (!isNullOrUndefined(car.data.CurrentEquipmentElement)) {
            if (car.data.CurrentEquipmentElement.IsAssignedToClient) {
                this.Map.focusOn([car.position], 0, 16, true);
                car.Marker.openPopup(car.position);
            } else {
                this._snackBar.openFromComponent(SnackbarMessageComponent, {
                    data: {
                        checkable: true,
                        text: msg,
                        action: 'Close',
                        icon: 'warning',
                    },
                    duration: 5000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center'
                });
            }
        } else {
            this._snackBar.openFromComponent(SnackbarMessageComponent, {
                data: {
                    checkable: true,
                    text: msg,
                    action: 'Close',
                    icon: 'warning',
                },
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
            });
        }
    }
    dbClick(car: RealTimeTrackingObject) {
        car.Focus();
    }
    Entretien(cell, value: number, msg: string, img: string) {
        switch (value) {
            case 11: {
                //data.cell.key.data.FullName
                this.OpenListDialog(cell.key.data.MaintenanceReminderToDo, 11, cell.key.data.FullName, msg, "Maintenance.MaintenanceType", img);
                break;
            }
            case 22: {

                this.OpenListDialog(cell.key.data.BorrowedRentalCarContractExpiredJSONToDo, 22, cell.key.data.FullName, msg, "Alocation", img);
                break;
            }
            case 33: {
                this.OpenListDialog(cell.key.data.CarDocumentReminderJSONToDo, 33, cell.key.data.FullName, msg, "NAV.DocumentType", img);
                break;
            }
            case 44: {
                this.OpenListDialog(cell.key.data.AccidentDetailsReminderJSONToDo, 44, cell.key.data.FullName, msg, "Accident", img, cell.key.data.MileageFloat);
                break;
            }
            case 55: {
                this.OpenListDialog(cell.key.data.CardCouponReminderJSON, 55, cell.key.data.FullName, msg, "CardBon", img);
                break;
            }
            case 66: {
                this.OpenListDialog(cell.key.data.BorrowedRentalCarContractJSONToDo, 66, cell.key.data.FullName, msg, "NAV.ContractType", img);
                break;
            }
            case 77: {
                this.OpenListDialog(cell.key.data.BorrowedRentalCarContractExpiredJSONToDo, 77, cell.key.data.FullName, msg, "NAV.ContractType", img);
                break;
            }

        }
        //console.log(cell.key.data);
    }

    OpenListDialog(cell: Array < any > , id: number, matricule: string, title: string, type: string, img: string, mileageFloat ? : number) {
        const dialogRef = this._matDialog.open(MaintenanceListComponent, {
            panelClass: 'TrackingTableAlertsList',
            data: {
                cell,
                id,
                matricule,
                title,
                type,
                img,
                mileageFloat: mileageFloat
            }
        })
    }

}


function sendStorageRequest() {
    let url  = "http://localhost:61720/Service/TrackingPageWCFService.svc/GetNewWorkspaceParam";
    let req: HttpRequest<any> = new HttpRequest("Post", url, {
        headers: new HttpHeaders({
            "Accept": "text/html",
            "Content-Type": "text/html"
        }),
        responseType: "json"
        //body: data ? JSON.stringify(data) : null
    });
    return this.httpClient.request(req)
        .toPromise();
}