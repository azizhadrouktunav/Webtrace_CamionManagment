import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, MatCheckboxChange, MatDialog, MatListOption, MatSnackBar, MatTabChangeEvent,MatTabGroup , MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { decrypt } from 'app/main/parc/Parc';
import {Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { GpsData, Trajectory } from './trajectory.model';
import { TrajectoryService } from './trajectory.service';
import { GlobalMap } from '../map/map'
import { TrackingObjectService } from '../tracking/tracking-objects.service';
import { fuseAnimations } from '@fuse/animations';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { PlacesGeometricShapesManagementService } from '../places-geometric-shapes-management/places-geometric-shapes-management.service';
import * as _ from 'lodash';
import { WayDialogComponent } from '../places-geometric-shapes-management/ways/way-form/add-way-dialog.component';
import { isEmpty, isNull } from 'lodash';
import { SharedDataService } from '../shared-data.service';
import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from '../../../navigation/i18n/fr';
import { locale as arab } from '../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Traject } from '../map/traject';
import { showSnackBar } from 'app/main/helpers/showSnackBar';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import { TrajectoryparampopupComponent } from './trajectoryparampopup/trajectoryparampopup.component';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as moment from 'moment';
import { of } from "rxjs";
@Component({
  selector: 'trajectory',
  templateUrl: './trajectory.component.html',
  styleUrls: ['./trajectory.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]), fuseAnimations
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
 
})
export class TrajectoryComponent implements OnInit, AfterViewInit, OnDestroy {


   title: string;
   // Private
   private _unsubscribeAll: Subject<any>;
   form: FormGroup;
   trackingObjects : {key : number , name: string}[];
   trackingObject : {key : number , name: string};
   trajectory: Trajectory;
   isLoading = false;
   dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
   displayedColumns = ['action','StopRunStatus', 'isAlert','isDefaut','StartDate' , 'Period', 'Speed', 'CumulativeDistanceString', 'Place', 'FuelLevel' ];
 //displayedColumns = ['StopRunStatus', 'StartDate'];
   minSpeed: number = 0;
   maxSpeed: number = 0;
   minTemperature : number = 0;
   maxTemperature : number = 0;
   maxEngineTemperature: number = 0
   minEngineTemperature: number = 0
   minFuelLevel: number = 0;
   maxFuelLevel: number = 0;
   engineOffAccount : number = 0;
   engineOnAccount: number = 0;
   contactOffAccount: number = 0;
   contactOnAccount: number = 0;
   gpsData : GpsData[] = [];
   disabledInfo: boolean = true;
   Map : GlobalMap = GlobalMap.globalMap;
   expandedElement: any;
   vehicles: Array<any>;
   name : string = '';
   carSelected = null;
  ReportDataSource : any
  allowedPageSizes = [];
  htmlToAdd: string='';
 
  
  dateObj = new Date();
  columnDefinitions = [
    //{column: 'action' , selected: true},
    {column: 'StopRunStatus' , selected: true,description:'Stop/Circulation/Ralenti'},
    {column: 'isAlert' , selected: true,description:'Alert'},
    {column: 'StartDate',  selected: true ,description:'Date de début' },
    {column: 'Place' ,  selected: true ,description:'Emplacement'},
    {column: 'Period' , selected: true ,description:'Période'},
    {column: 'FuelLevel' ,  selected: true ,description:'Niveau de carburant' },
    {column: 'CumulativeDistanceString' , selected: true ,description:'Distance' },
    {column: 'Speed' , selected: true ,description:'Vitesse' },
    {column: 'Direction' ,  selected: false ,description:'Direction' },
    {column: 'EngineHours' ,  selected: false ,description:'Heures de moteur' },
    {column: 'EngineTemperature' , selected: false ,description:'Heures de moteur' },
    {column: 'Engine' , selected: false },
    {column: 'BatteryLevel' , selected: false },
    {column: 'Latitude' , selected: false },
    {column: 'Longitude' ,  selected: false },
    {column: 'Temperature' , selected: false },
    {column: 'Mileage' ,   selected: false },
    {column: 'RPM' ,  selected: false },
    //{column: 'Report_Reason' ,  selected: false },
    {column: 'SealStatus' ,  selected: false },
    {column: 'LockStatus' ,  selected: false },
    {column: 'ElockBattery' ,  selected: false },
    {column: 'SN' ,  selected: false },
    {column: 'Volume' ,  selected: false },
    {column: 'TemperatureSonde' ,  selected: false },
    {column: 'BatterySonde' ,  selected: false },
    {column: 'StatusConnectedSonde' ,  selected: false },
    {column: 'AdBlueLevel' ,  selected: false },
    {column: 'AxleWeight1st' ,  selected: false },
    {column: 'AxleWeight' ,  selected: false },
    {column: 'AxleWeight3rd' ,  selected: false },
    {column: 'AxleWeight4th' ,  selected: false },
    {column: 'RapidBrackings' ,  selected: false },
    {column: 'RapidAccelerations' ,  selected: false },
    {column: 'HumidityLevel' ,  selected: false },

  
  ];
  columnDefinitionsFiltr = this.columnDefinitions;

  search = new FormControl();
  $search = this.search.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: string) => {
      if (!res) return of(this.columnDefinitions);
      res = res.toLowerCase();
      return of(
        this.columnDefinitions.filter(x => x.column.toLowerCase().indexOf(res) >= 0)
      );
    })
  );
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('accordion',  {static: true}) accordion: MatAccordion;
  @ViewChild(MatTabGroup,{static: true}) tabGroup: MatTabGroup;
  

  /* sos stops direction trajectory*/
  typeFilters = [
    {
      key: 1, value: 'NAV.showSOS', checked: true
    },
    {
      key: 2, value: 'NAV.showStops', checked: true
    },
    {
      key: 5, value: 'NAV.showAlerts', checked: false
    },
    {
      key: 3, value: 'NAV.showOtherTrajectories', checked: true
    },
    {
      key: 4, value: 'NAV.showDirection', checked: true
    }
  ];
  trajet: Traject;
  showStop: boolean = true;
  showDirection: boolean = true;
  showOtherTrajectory: boolean = true;
  showSOS: boolean = true;
  showAlerts: boolean = false;
  subscription: Subscription;
  test: Subject<any[]>;
  TO: any;
  filteredTrackingObjects: Observable<Observable<Vehicle[]>>;
  filterValue = "";
  lastDes: any;
  trajettosup: Traject;
  isMobileResolution: boolean;
  lengthData : number;
 
  /**
     * Constructor
     *
     * @param {TrajectoryService} _trajectoryService
     */
    constructor(
      private _trajectoryService: TrajectoryService,
      private _trackingObjectService: TrackingObjectService,
      private fb: FormBuilder,
      private _bottomSheet: MatBottomSheet,
      public _dialog: MatDialog,
      private _placesGeometricShapesManagementService: PlacesGeometricShapesManagementService,
      private _data: SharedDataService,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _snackBar: MatSnackBar,
      private translateService: TranslateService,
      private _errorHandler: ErrorHandlerService,
      private _matDialog : MatDialog,
      private changeDetectorRef: ChangeDetectorRef
      
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.dataSource = new MatTableDataSource([]);

      this._fuseTranslationLoaderService.loadTranslations(english, french, arab);

      if (window.innerWidth < 768) {
        this.isMobileResolution = true;
      } else {
        this.isMobileResolution = false;
      }
     
  }
// -----------------------------------------------------------------------------------------------------
// @ Lifecycle hooks
// -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
  ngOnInit() {
    this._trackingObjectService.onTrackingObjectsChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      this.vehicles = data;
    },
    (error: any) => {
      console.log(error);
    });
   this.subscription = this._data.currentIndex.subscribe(index => {
     if(index == 3) {
     this._data.thirdServiceResponse
     .subscribe(car => {
        var today = new Date();
        var dateTo = (new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        var dateFrom = (new Date());
        this.name =  car.name;
        this.carSelected= car;

        let result = {
            value : {
                trackingObject : car,
                start : dateTo,
                end : dateFrom
            }
        }
        this.prepareToGetTrajectory(result);

        this._data.changeIndex(null);
     });
    }
   });
 
   
    
  }
 
  onSearchChange(serchValue:string):void
  {
       this.columnDefinitionsFiltr=this.columnDefinitions;
        if(serchValue)
        this.columnDefinitionsFiltr= this.columnDefinitionsFiltr.filter(x => x.column.toLowerCase().indexOf(serchValue.toLowerCase()) >= 0)
  }
  generateTrajectory(): void {
    const dialogRef = this._matDialog.open(TrajectoryparampopupComponent, {
      panelClass: 'custom-dialog-container',  
      data      : {
        carSelected: this.carSelected
      },
      position: {
        bottom: '270px',
        left: '50px'
      }     
    });

    dialogRef.afterClosed().subscribe((result: any) => {
       
        this.prepareToGetTrajectory(result);
    })
  }

    prepareToGetTrajectory(result: any) {
        this.displayedColumns = ['action' ,'StopRunStatus', 'isAlert','isDefaut','StartDate' , 'Period', 'Speed', 'CumulativeDistanceString', 'Place', 'FuelLevel' ];
       // this.displayedColumns = ['StopRunStatus', 'StartDate'];
        for(let i=20 ; i<=26; i++) {
            this.columnDefinitions[i].selected = false;
        }

        if ( !result ){
            return;
        }

        let key = result.value.trackingObject.Key;
        this.name = result.value.trackingObject.FullName;

        if(result.value.trackingObject.CurrentEquipmentType == "ETBLE"){
            for(let i=20 ; i<=26; i++){
                this.columnDefinitions[i].selected = true;
            }
            this.displayedColumns.pop();
            this.displayedColumns.push('SN','Volume','TemperatureSonde','BatterySonde','StatusConnectedSonde','waterdetected1','action')
        }
        this.getTrajectory(key,result.value.start, result.value.end);
    }
    
   getTrajectory(key,start, end ){
    this.isLoading = true;
    this.dataSource.data =[];
     this._trajectoryService.getTrajectory(key,start, end)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(data => {
           this.isLoading = false;
           if(!isEmpty(data)) {
             this.ReportDataSource=data;
            // console.log(decrypt(data));
           
             this.trajectory = new Trajectory(decrypt(data));
             
               this.gpsData = this.trajectory.AllExtendedGpsData;
             //.map(item => {return new GpsData(item)});
             
             this.gpsData.forEach((row,index)=>{
              row.StopRunStatusEnumString2=row.StopRunStatusEnumString;
              //console.log(this.gpsData);
              

              if(row.StopRunStatusEnumString2=="")
              {
                row.DisabledStop=true;
                row.DisabledStar=true;

              }
              else
              {
                if(row.StopRunStatusEnumString2=="Stop")
                {
                  row.DisabledStop=false;
                  row.DisabledStar=true;

                }
                else
                if(row.StopRunStatusEnumString2=="Ralenti")
                {
                  row.DisabledStop=false;
                  row.DisabledStar=true;

                }
                else
                {
                if(row.StopRunStatusEnumString2=="Circulation")
                {
                  row.DisabledStop=true;
                  row.DisabledStar=false;

                }
                }
              }


               if(row.StopRunStatusEnumString=="")
               {
                
                if(index >0)
                {
                 row.StopRunStatusEnumString = this.gpsData[index -1].StopRunStatusEnumString;
                }
                
               }
              
               if(row.StopRunStatusEnumString =="Stop")
               {
               
                 row.IgnOn=false;
                
               }
                 else
                 {
                
                   row.IgnOn = true;
                 }
               // let date:Date= new Date(row.BeginDateLocalString);
                let parsedDate = moment(row.BeginDateLocalString,"DD/MM/YYYY hh:mm:ss");
              //  let date2:Date= parsedDate.format("YYYY/MM/DD hh:mm:ss");
                //let test = date.getMonth();
               //  row.BeginDateLocal=new Date(date.getFullYear(),date.getMonth()-1,date.getDay(),date.getHours(),date.getMinutes(),date.getSeconds());
               var year : number =parseInt( parsedDate.format('YYYY'));
               var month : number =parseInt( parsedDate.format('M'));
               var day : number =parseInt( parsedDate.format('D'));
               var hour : number =parseInt( parsedDate.format('H'));
               var minute : number =parseInt( parsedDate.format('m'));
               var secound : number =parseInt( parsedDate.format('s'));
               row.BeginDateLocal=new Date(year,month-1,day,hour,minute,secound);
                 //test=moment(row.BeginDateLocalString,"YYYY/MM/DD hh:mm:ss").y;
               
 
             });
             let customer = localStorage.getItem("Customer");
             if (customer == "2055") {
               this.gpsData.forEach((row, index) => {

                 if (row.IsAlert && row.DesAlert == "QlDigitalInput1Off") {
                   row.StopRunStatusEnumString = "Stop";
                   row.IgnOn=false;
                 }
               })
             }




             this.disabledInfo = !isEmpty(this.gpsData) ? false : this.disabledInfo;
             let IndexTab = this.tabGroup.selectedIndex;
             if(IndexTab==0)
             {
              this.allowedPageSizes= [100,200,500,this.gpsData.length]
             this.dataSource.data = this.gpsData
             }
             else
             {
              this.CreateChart();
             }
             this.maxSpeed = this.getMaxSpeed(this.trajectory.AllExtendedGpsData);
             this.minSpeed = this.getMinSpeed(this.trajectory.AllExtendedGpsData);
             this.maxTemperature = this.getMaxTemperature(this.trajectory.AllExtendedGpsData);
             this.minTemperature = this.getMinTemperature(this.trajectory.AllExtendedGpsData);
             this.maxEngineTemperature = this.getMaxEngineTemperature(this.trajectory.AllExtendedGpsData);
             this.minEngineTemperature = this.getMinEngineTemperature(this.trajectory.AllExtendedGpsData);
             this.maxFuelLevel = this.getMaxFuelLevel(this.trajectory.AllExtendedGpsData);
             this.minFuelLevel= this.getMinFuelLevel(this.trajectory.AllExtendedGpsData);
             this.dataSource.sort = this.sort;
             this.lengthData= this.gpsData.length;
           


             this.dataSource.paginator = this.paginator;
             this.changeDetectorRef.detectChanges();
             this.trajectory.AllExtendedGpsData.map(o => {o.IgnOn=== true ? this.engineOnAccount++ : this.engineOffAccount++;
                            o.IsRunning == true ? this.contactOnAccount++ : this.contactOffAccount++})
             //console.log(this.data.Matricule)           //   Error :/    Matricule is stored in MinutesOfOverspeed instead :(
 
             if(!isEmpty(this.trajectory.AllExtendedGpsData))
             {   var trajectories = [];
                 if(this.trajet != null && !this.showOtherTrajectory) {
                     this.trajet.remove();
                  }
                  
               this.trajet = this.Map.drawTrajectory(this.trajectory.AllExtendedGpsData, this.name ,  this.trajectory.id, this.showStop, this.showDirection,this.showSOS,this.showAlerts);
                     if(this.showOtherTrajectory) {
                         trajectories = this._trajectoryService.trajectories.getValue(); 
                     } 
                     const Index = trajectories.findIndex(x => x.name === this.trajet.name);

                     if (Index > -1)
                     { this.trajettosup = trajectories[Index];
                      this.trajettosup.remove(); 
                      trajectories.splice(Index, 1); 
                      }
                     trajectories.push(this.trajet);
                     this._trajectoryService.trajectories.next(trajectories); 
              
             }
             else {
               showSnackBar('Aucune position trouvée pour ce véhicule! Veuillez choisir une autre période', this._snackBar);
       
             }
           // this.title = 'Vehicle trajectory '+ this.trackingObjects.find(it => it.key == this.form.get('keyTrackingObject').value).name + ' between '+ this.form.get('dateTo').value+ this.form.get('dateFrom').value
           }
          },
          (error: HttpErrorResponse) => {
           //this.errorHandler.handleError(error);.handleError(error);
            this.isLoading = false;
          });
         




        }
        getRecord(row,expandedElement)
        {
          let test = row;
          let t= expandedElement;
          if(expandedElement != undefined )
          {
            this.htmlToAdd='<app-detail></app-detail>'
          }
          else
          {
            this.htmlToAdd='';
          }
        }
        tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        
          if(tabChangeEvent.index ==0)
          {
            let gpsData2 : GpsData[] = [];
            this.dataSource.data= gpsData2;
          
          this.dataSource.data = this.gpsData  ;
           this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.changeDetectorRef.detectChanges();
          }
            
             else
             {
              this.CreateChart();
             }

          //this.whichButton = tabChangeEvent.index;
       }
       CreateChart()
       {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("chartdiv", am4charts.XYChart);
       // chart.legend = new am4charts.Legend();
         chart.cursor = new am4charts.XYCursor();
         ​
         chart.scrollbarX = new am4core.Scrollbar();

         chart.scrollbarY = new am4core.Scrollbar();
        chart.dateFormatter.dateFormat = "yyyy/MM/dd HH:mm:ss";
       chart.data = this.gpsData ;
       
       
      
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dateFormatter = new am4core.DateFormatter();
        dateAxis.dateFormatter.dateFormat = "yyyy/MM/dd HH:mm:ss";
        dateAxis.renderer.grid.template.location = 0;
         dateAxis.renderer.minGridDistance = 40;
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text="Vitesse";
        valueAxis.title.fontWeight = "bold";

        valueAxis.events.on("startchanged", valueAxisZoomed);
         valueAxis.events.on("endchanged", valueAxisZoomed);
        
         dateAxis.events.on("startchanged", dateAxisChanged);
         dateAxis.events.on("endchanged", dateAxisChanged);
        let lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.dataFields.valueY = "Speed";
        lineSeries.dataFields.dateX = "BeginDateLocal";
        //lineSeries.name = "Sales";
        lineSeries.strokeWidth = 2;
        lineSeries.tooltipText = "{dateX}: [b]{valueY}[/]";
        
        let bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.propertyFields.disabled = "DisabledStop";
        

        bullet.tooltipText ="Arrêt";

        let image = bullet.createChild(am4core.Image);
        image.href = "./assets/images/stop-icon.png";
        image.width = 30;
        image.height = 30;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";

        let bulletStar = lineSeries.bullets.push(new am4charts.Bullet());
        bulletStar.propertyFields.disabled = "DisabledStar";
        bulletStar.tooltipText ="démarrage";

        let imageStar = bulletStar.createChild(am4core.Image);
        imageStar.href = "./assets/images/key.png";
        imageStar.width = 30;
        imageStar.height = 30;
        imageStar.horizontalCenter = "middle";
        imageStar.verticalCenter = "middle";
       }
  removeTable() {
   this.dataSource.data = [];
    //this.Map.drawer.removeMarkerStop();
   }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetectorRef.detectChanges();
  }

  exportExcel ()
  {
    let TabColumnItem :any[] =[];
    let col = this.displayedColumns;
    this.displayedColumns.forEach(row=>{
      if(row != 'action')
      {
       let name = row;
      this.translateService.get(name).subscribe(translations => {  
        if(row =='Place')
          row= 'NearestPlaceString';
        if(row== 'Period')
          row = 'PeriodString';
        if (row == 'StartDate')
        row ='BeginDateLocalString';
        if(row=='StopRunStatus')
         row ='StopRunStatusEnumString';
         if(row =='Engine')
         row='IgnOn';

        TabColumnItem.push({'Name':row,'Value':translations,'DataType':'string'});
      });
    }
    });
    this._trajectoryService.ExportReport(this.ReportDataSource,TabColumnItem,"excel")
    .subscribe((data:any) => {
      let fileData64String= decrypt(data.ExportReportTrajectryResult) ;
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "TrajectoryReport"
      titleReport += " " + "(" + dateString + ")";
 
 
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(blob); // For IE browser
     }
     const linkElement = document.createElement('a');
     const url = URL.createObjectURL(blob);
     linkElement.setAttribute('href', url);
     linkElement.setAttribute('download', titleReport+'.XLS');
     const clickEvent = new MouseEvent('click', {
       'view': window,
       'bubbles': true,
      'cancelable': false
     });
     linkElement.dispatchEvent(clickEvent);
     
    });
  }
  exportPdf ()
  {
    
    let TabColumnItem :any[] =[];
    let col = this.displayedColumns;
    this.displayedColumns.forEach(row=>{
      if(row != 'action')
      {
       let name = row;
      this.translateService.get(name).subscribe(translations => {  
        if(row =='Place')
          row= 'NearestPlaceString';
        if(row== 'Period')
          row = 'PeriodString';
        if (row == 'StartDate')
        row ='BeginDateLocalString';
        if(row=='StopRunStatus')
         row ='StopRunStatusEnumString';
         if(row =='Engine')
         row='IgnOn';

        TabColumnItem.push({'Name':row,'Value':translations,'DataType':'string'});
      });
    }
    });
    //let ReportDataSource : any;
   //ReportDataSource = {'TabColumnItem': TabColumnItem , 'GeneralReport':this.trajectory};
   
   //let dataSource : string =Encrypt(ReportDataSource);
    this._trajectoryService.ExportReport(this.ReportDataSource,TabColumnItem,"pdf").subscribe((data:any) => {
      let fileData64String= decrypt(data.ExportReportTrajectryResult) ;
      //ExportReportTrajectryResult
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/pdf" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "TrajectoryReport"
      titleReport += " " + "(" + dateString + ")";
 
 
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(blob); // For IE browser
     }
     const linkElement = document.createElement('a');
     const url = URL.createObjectURL(blob);
     linkElement.setAttribute('href', url);
     linkElement.setAttribute('download', titleReport+'.pdf');
     const clickEvent = new MouseEvent('click', {
       'view': window,
       'bubbles': true,
      'cancelable': false
     });
     linkElement.dispatchEvent(clickEvent);
     
    });

  }

 /**
     * On destroy
     */
    ngOnDestroy(): void
    {
      this.subscription.unsubscribe();
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next();
        // this._unsubscribeAll.complete();
    }

    applyFilter() {
     
      this.dataSource.filter = this.filterValue.trim().toLowerCase();

    }
   
  getMinSpeed(array : GpsData[]) : number {
    return Math.min.apply(Math , array.map( o => {return o.Speed}))
  }
  getMaxSpeed(array : GpsData[]) : number {
    return Math.max.apply(Math , array.map( o => {return o.Speed}))
  }

  getMinTemperature(array : GpsData[]) : number {
    return Math.min.apply(Math , array.map( o => {return o.Temperature}))
  }
  getMaxTemperature(array : GpsData[]) : number {
    return Math.max.apply(Math , array.map( o => {return o.Temperature}))
  }
  getMaxEngineTemperature(array : GpsData[]) : number {
    return Math.max.apply(Math , array.map( o => {return o.EngineTemperature}))
  }
  getMinEngineTemperature(array : GpsData[]) : number {
    return Math.min.apply(Math , array.map( o => {return o.EngineTemperature}))
  }
  getMinFuelLevel(array : GpsData[]) : number {
    return Math.min.apply(Math , array.map( o => {return o.FuelLevel}))
  }
  getMaxFuelLevel(array : GpsData[]) : number {
    return Math.max.apply(Math , array.map( o => {return o.FuelLevel}))
  }
  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet,
     {
      panelClass: 'custom-width',
      data: { driver: this.trajectory.Driver, 
              distance: this.trajectory.Distance,  
              speedMax: this.trajectory.SpeedMax,
              speedAvg: this.trajectory.SpeedAvg,
              stopNumber: this.trajectory.StopNumber,
              realAvgFuelConsumption: this.trajectory.RealAvgFuelConsumption,
              realSumFuelConsumption: this.trajectory.RealSumFuelConsumption,
              circulationRateInPercent: this.trajectory.CirculationRateInPercent,
              stopTime: this.trajectory.StopTimeString,
              runTimeString: this.trajectory.RunTimeString,
              //vehicle name
              minutesOfOverspeed: this.trajectory.MinutesOfOverspeed,
                }
    }); 
  }
  onGroupsChange(options: MatListOption[], e): void {
    // map these MatListOptions to their values
    var selectedColumns: string[] = options.map(o => o.value).map(o => o.column);

   this.displayedColumns = selectedColumns;
   this.displayedColumns.unshift('action');
   //this.displayedColumns.push('action');
  }
  onConfigChange(e : MatCheckboxChange): void {
    var checked = e.checked;
    var trajets : Traject[];
    this._trajectoryService.trajectories.subscribe(data => {
      trajets = data;
      trajets.forEach(item => {
        if (+e.source.value == 1) {
          this.showSOS = e.checked;
            item.SOSMarker.forEach(el => {
              if(!this.showSOS) {
                 el.removeFrom(this.Map.map);
              }
              else if(this.showSOS) {
                el.addTo(this.Map.map);
              }
             });
           
        }
       
        if (+e.source.value == 5) {
          this.showAlerts = e.checked;
            item.alertMarker.forEach(el => {
              if(!this.showAlerts) {
                 el.removeFrom(this.Map.map);
              }
              else if(this.showAlerts) {
                el.addTo(this.Map.map);
              }
             });
           
        }
        if(+e.source.value == 4) {
            this.showDirection = checked;
              item.ToggleFlow(this.showDirection);

          }
      });
      if(+e.source.value == 3) {
         this.showOtherTrajectory = e.checked;
         if(!this.showOtherTrajectory) {
          for (var i = 0; i < trajets.length -1; i++) {
            trajets[i].remove();
          } 
         }
      }
    })
    // if(!this.showOtherTrajectory && (+e.source.value == 3)) {
    //  // trajets.slice(0, trajets.length -1)
    //   var length = trajets.length >= 1 ? trajets.length -1 : trajets.length;
    //   this._trajectoryService.trajectories.next([trajets[length]]);
    // } 
  }
  addWay(): void {
    const dialogRef = this._dialog.open(WayDialogComponent, {
      disableClose: true,
      hasBackdrop : false,
      data: {
        action: 'new',
        title: 'Common.SaveTrajectory',
        names: [],
        msgError: 'Route with this name already exists. Try again with a new name.'
      }
    });

    dialogRef.afterClosed().subscribe((result: FormControl) => {
      if ( !result )
      {
          return;
      }
      var arrayLatLong : number[] = [];
     this.gpsData.forEach(it => {
        arrayLatLong.push(it.Latitude);
        arrayLatLong.push(it.Longitude);
      });
       this._placesGeometricShapesManagementService.addWay(result.value,arrayLatLong, false);
       
       
    });
  }

  AnimateTrajectory(){
      this.Map.AnimateTrajectory(
        this._trajectoryService.trajectories.getValue()[0]
      )
  }

  RemoveTrajectory(){
      this.trajet.remove()
  }

   show(position) : void {
    if(position.IsAlert && position.DesAlert != "Inconnu" && position.DesAlert != this.lastDes)
    {
      this.Map.drawer.showPosition(position);

    }
    else
    {
      this.Map.drawer.showPosition(position);

    }
   }
}
@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template:  `<mat-nav-list role="list">
            <mat-list-item role="listitem"><mat-icon class="fuse-navy-A400-fg"> directions_car</mat-icon> {{'NAV.TrackingObject' | translate }}: {{minutesOfOverspeed}}</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="fuse-navy-300-fg"> pin_drop</mat-icon> {{'NAV.TraveledDistance' | translate }}: {{distance}} km</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="indigo-400-fg">person</mat-icon>  {{'NAV.DriverName' | translate }} : {{driver}}</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="red-fg"> traffic</mat-icon> {{'NAV.StopTime' | translate }}: {{stopTime}}</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="green-fg"> traffic</mat-icon>{{'NAV.RunTime' | translate }}: {{runTimeString}}</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="red-fg"> traffic</mat-icon> {{'NAV.StopsNumber' | translate }} {{stopNumber}}</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="yellow-fg"> traffic</mat-icon>{{'NAV.TrafficRate' | translate }}: {{circulationRateInPercent}}</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="yellow-900-fg"> local_gas_station</mat-icon>{{'NAV.RealAvgFuelConsumption' | translate }} {{realAvgFuelConsumption}}</mat-list-item>
            <mat-list-item role="listitem">	<mat-icon class="green-400-fg"> local_gas_station</mat-icon> {{'NAV.RealSumFuelConsumption' | translate }} {{realSumFuelConsumption}}</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="lime-fg">shutter_speed</mat-icon> {{'NAV.SpeedMax' | translate }}: {{speedMax}} km</mat-list-item>
            <mat-list-item role="listitem"><mat-icon class="yellow-900-fg">shutter_speed</mat-icon> {{'NAV.SpeedAvg' | translate }} : {{speedAvg}}km</mat-list-item>
</mat-nav-list>`,
styleUrls: ['./trajectory.component.scss']
})
export class BottomSheetOverviewExampleSheet {
  driver: string;
  distance: number;
  speedMax: number;
  speedAvg: number;
  stopNumber: number;
  realAvgFuelConsumption: number;
  realSumFuelConsumption: number;
  circulationRateInPercent: number;
  stopTime: string;
  runTimeString: string;
  // vehicle name
  minutesOfOverspeed: string;
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
                 this.driver = this.data.driver;
                 this.distance = this.data.distance;
                 this.speedMax = this.data.speedMax;
                 this.speedAvg = this.data.speedAvg;
                 this.stopNumber = this.data.stopNumber;
                 this.realAvgFuelConsumption = this.data.realAvgFuelConsumption;
                 this.realSumFuelConsumption = this.data.realSumFuelConsumption;
                 this.circulationRateInPercent = this.data.circulationRateInPercent;
                 this.stopTime = this.data.stopTime;
                 this.runTimeString = this.data.runTimeString;
                 this.minutesOfOverspeed = this.data.minutesOfOverspeed;
              }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
function valueAxisZoomed(ev) {
  var start = ev.target.minZoomed;
  var end = ev.target.maxZoomed;
  //console.log("New range: " + start + " -- " + end);
}
function dateAxisChanged(ev) {
  var start = new Date(ev.target.minZoomed);
  var end = new Date(ev.target.maxZoomed);
 // console.log("New range: " + start + " -- " + end);
}