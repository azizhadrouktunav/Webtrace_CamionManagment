import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { DateMoreThan } from 'app/main/helpers/compareDate';
import { json2array } from 'app/main/helpers/must-match.validator';
import { decrypt } from 'app/main/parc/Parc';
import { isNull, startsWith } from 'lodash';
import { TrackingObjectService } from '../tracking/tracking-objects.service';
import { AlertsService } from './alerts.service';
import * as XLSX from "xlsx";
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Alert } from './model';
import { GlobalMap } from '../map/map';
import { environment } from 'environments/environment.prod';
import { SharedDataService } from '../shared-data.service';
import { from, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from '../../../navigation/i18n/fr';
import { locale as arab } from '../../../navigation/i18n/ar';
import { concatMap, debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {startWith} from 'rxjs/operators/startWith';
import { MatAccordion } from '@angular/material/expansion';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { AlertparampopupComponent } from './alertparampopup/alertparampopup.component';
interface Type {
  value: number;
  viewValue: string;
  color?: string
}
// export class Vehicle {
//   constructor(public name: string, public id: number) { }
// }
@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AlertsComponent implements OnInit, AfterViewInit, OnDestroy{

  alertForm: FormGroup;
  alerts : Alert[];
  
  displayedColumns: string[] = ['vehicle', 'date', 'type', 'address', 'Speed' ,'Mileage','ChassisNumber' ,'action'];
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('accordion',  {static: true}) accordion: MatAccordion;
  // @ViewChild('filter', {static: true})
  // filter: ElementRef;
  dataSource = new MatTableDataSource();
  trackingObjs : Vehicle[];
   /*mutiple filter by columns*/
   vehicleFilter = new FormControl();
   dateFilter = new FormControl();
   typeFilter = new FormControl();
   addressFilter = new FormControl();
   speedFilter = new FormControl();
   messageFilter = new FormControl();
   Map : GlobalMap = GlobalMap.globalMap;
   subscription: Subscription = new Subscription();
   dateObj = new Date();
   isLoading = false;

// Private
private _unsubscribeAll: Subject<any>;
  TO: Vehicle[];
  filteredVehicles: Observable<Vehicle[]>;
  filterValue: "";
  progressbarValue=0;
  progressValueInPercent =0;
   /**
     * Constructor
     *
     * @param {TrackingObjectService} _trackingObjectService
     * @param {AlertsService} _alertsService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {FormBuilder} _formBuilder
     * @param {SharedDataService} _sharedDataService
     */
  constructor(private _trackingObjectService: TrackingObjectService,
              private _alertsService : AlertsService,
              private _formBuilder: FormBuilder,
              private _sharedDataService: SharedDataService,
              private _fuseTranslationLoaderService: FuseTranslationLoaderService,
              private _TranslateService: TranslateService,
              private _errorHandler: ErrorHandlerService,
              public datepipe: DatePipe,
              public _matDialog : MatDialog) {

                 // Set the private defaults
                this._unsubscribeAll = new Subject();
                
                this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
               }

  ngOnInit() {
 
  this.alertForm = this._formBuilder.group({
          trackingObject: new FormControl(null),
          type : new FormControl(null),
          period: new FormControl(null),
          start  : new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),0,0,0)),
          end: new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),23,59,59))
  },
  { validator: DateMoreThan('start' , 'end')
    });

  this._TranslateService.get('Common.AllVehicles').subscribe((all: string) => {
    this.alertForm.controls['trackingObject'].setValue(new Vehicle({FullName: 'all', Key: -1}))
  });
  this.alertForm.patchValue({
        trackingObject: -1,
        type: -2,
        period: 2
  });
  this._sharedDataService.currentIndex.subscribe(index => {
    if(index == 1) {
       this._sharedDataService.firstServiceResponse.subscribe(key => {
        var today = new Date();
        //var vehicle: Vehicle = this.TO.find(it => it.Key == key)
        //this.alertForm.controls['trackingObject'].setValue(vehicle);
        var type = 101;
        var period= 2 ;
        var start=(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        var end = (today);
        this.getalerts(type,key, start,end);

      
      });
    }
 });


  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

   
  }
  
  compareFunction(o1: any, o2: any) {
        return o1 == o2;
   }
   /**
     * On form submit
     */
    generateAlerts(): void {
      const dialogRef = this._matDialog.open(AlertparampopupComponent, {
        panelClass: 'custom-dialog-container',  
       
        position: {
          bottom: '270px',
          left: '50px'
        }     
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        
        if ( !result )
        {
            return;
        }
        console.log(result);
        
        this.getalerts(result[1],result[0].value.Car, result[0].value.start,result[0].value.end);
      })
    }
    async getalerts(types,cars,start,end){
      this.dataSource.data = [];
      this.isLoading = true;
      this.progressbarValue = 0;
      // initialization of progress bar counter
      let progressbarCounter = 0;
      let data = [];
      this.alerts = [];
      // for(let i = 0; i < cars.length; i++) {
      //   this.subscription = this._alertsService.getAlerts(
      //               types,
      //               cars[i].Key,
      //               start,
      //               end
      //         ).subscribe((response : any) => {
      //         this.isLoading = false;
      //           this.alerts = [];
      //           this.alerts = json2array(decrypt(response.GetAlertsElementCompressedResult));
      //           console.log(this.alerts);

      //           for (let i = 0; i <  this.alerts.length; i++) {
                
      //           Object.assign(this.alerts[i], { AcquisitionTime: this.datepipe.transform(new Date(parseInt(this.alerts[i].AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss')});
          
      //         }
      //         if(this.alerts.length > 0){
      //           // featch alerts data
      //           this.alerts.forEach(alert => {
      //             data.push(alert);
      //           });
      //           //console.log(data);
      //           this.dataSource.data = data;
      //         }
      //           progressbarCounter++;
      //           this.progressbarValue = ((progressbarCounter * 100) / cars.length);
      //         },
      //   );
      // }
      this.subscription = from(cars).pipe(
        concatMap(car => {
          return this._alertsService.getAlerts(
            types,
            car['Key'],
            start,
            end
          ).pipe(
            finalize(() => {
              progressbarCounter++;
              this.progressbarValue = ((progressbarCounter * 100) / cars.length);
            })
          );
        })
      ).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.alerts = [];
          this.alerts = json2array(decrypt(response.GetAlertsElementCompressedResult));
          console.log(this.alerts);
      
          for (let i = 0; i < this.alerts.length; i++) {
            Object.assign(this.alerts[i], { AcquisitionTime: this.datepipe.transform(new Date(parseInt(this.alerts[i].AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss') });
          }
      
          if (this.alerts.length > 0) {
            // fetch alerts data
            this.alerts.forEach(alert => {
              data.push(alert);
            });
            // console.log(data);
            this.dataSource.data = data;
          }
        },
        (error) => {
          // Handle error here
          console.error('Error:', error);
        }
      );
    }

    removeTable() {
      this.dataSource.data = [];
     }
   
    exportPdf(dataSource) : void {
      var doc = new jsPDF();
      var col =  ['véhicle', 'Date', "Type d'alerte", 'Adresse', 'Vitesse', 'Message'];
      var rows = []; 

      rows = dataSource.data.map(alert => { return [
        alert.TrackingObjectName, this.datepipe.transform(new Date(parseInt(alert.AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss') , alert.AlertTypeFrenchString , alert.NearestPlaceString, alert.Speed, alert.ReceivedMessage
      ] });

    doc.setFontSize(10);
    let datedebut = this.datepipe.transform(this.alertForm.get('start').value, 'dd/MM/yyyy hh:mm:ss');
    let dateFin=this.datepipe.transform(this.alertForm.get('end').value, 'dd/MM/yyyy hh:mm:ss');
  
      doc.text('Liste des alertes'+' '+'de'+' '+datedebut+' '+'au'+' '+dateFin, 40, 16);
    //doc.text(20, 30,'Start date : '+ this.alertForm.get('start').value.toLocaleString() + ' End date : ' + this.alertForm.get('end').value.toLocaleString());
    //doc.addImage(imgData, 'JPEG', 90, 40, 20, 20);    
    doc.autoTable(col, rows,{startY: 40});
    // doc.setFontSize(8);
    // doc.setFontStyle('italic');
    // doc.text(80, 130, 'Total : ' + rows.length);
    doc.save('Suivi_Alertes('+ (new Date()).toLocaleString() +').pdf');   
    }
  
   exportCsv(dataSource) : void {
    var prepare_to_excel = [];
    let tem =   ['véhicle', 'Date', "Type d'alerte", 'Adresse', 'Vitesse', 'Message'];
    var rows = []; 
    var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
    var titleReport = "";
      titleReport = "Listedesalertes"
      titleReport += "(" + dateString + ").xls";
    prepare_to_excel.push(tem);
    rows = dataSource.data.map(alert => {  prepare_to_excel.push([
      alert.TrackingObjectName,  this.datepipe.transform(new Date(parseInt(alert.AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss'), alert.AlertTypeFrenchString , alert.NearestPlaceString, alert.Speed, alert.ReceivedMessage
    ] )});
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, titleReport, { bookType: 'xls', type: 'buffer' });
   }
   showAlert(alert: Alert) : void {
     var data = {
       date:  this.datepipe.transform(new Date(parseInt(alert.AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss'),
       type: alert.AlertTypeFrenchString,
       address: alert.NearestPlaceString,
       speed : alert.Speed
     }
     var coords = {lat: alert.Latitude , lng: alert.Longitude};
     // environment.iconUrl +'images/Others/warning-32.png'
    var iconUrl = 'assets/images/alert-icon.png' ;
    this.Map.drawer.showAlert(data, iconUrl, coords, alert.key)
   }

}
