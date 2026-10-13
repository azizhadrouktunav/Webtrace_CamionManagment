import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DataChart } from 'app/main/parc/interfaces/depenses-general';
import { MatSort, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import { decrypt } from 'app/main/parc/Parc';
import { GPSData } from '../../Interfaces/generalreportGPSData';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
declare var pdfMake: any;
import { TranslateService } from '@ngx-translate/core';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { RealTimeTrackingObject } from 'app/main/monitoring/tracking/RealTimeTrackingObject';
import { forEach } from 'lodash';
import { formatDate } from '@angular/common';

// Custom DataSource for server-side pagination
export class ServerSideDataSource extends DataSource<any> {
  private dataSubject = new Subject<any[]>();
  private loadingSubject = new Subject<boolean>();

  public loading$ = this.loadingSubject.asObservable();
  public data$ = this.dataSubject.asObservable();

  constructor() {
    super();
  }

  connect(): Observable<any[]> {
    return this.data$;
  }

  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadData(data: any[]) {
    this.dataSubject.next(data);
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }
}

@Component({
  selector: 'app-dashboarddefautreportresult',
  templateUrl: './dashboarddefautreportresult.component.html',
  styleUrls: ['./dashboarddefautreportresult.component.scss']
})

export class DashboarddefautreportresultComponent implements OnInit, OnDestroy, AfterViewInit {

  car: any;
  startdate: any;
  emplacement: any;
  customLoadingTemplate: any;
  CustomerGmt:number;
  public view: any[] = [850, 400];

  selectedAlerts : String[] = ["CoolantLevelLowIndicator", "BrakeFluidLowIndicator", "OilLevelLowIndicator", "AirBagIndicator", "CheckEngine", "EngineHotIndicator", "ABSFailureIndicator", "OilPressureIndicator", "BatteryIndicator", "Webcast"]

  alerts : any = [
    { type: 'Hood', icon: './assets/icons/FlatIcons/png/alarm.png', tooltip: 'Capot' , disable: true, cars: []},
    { type: 'Trunk', icon: './assets/icons/FlatIcons/png/trunk.png', tooltip: 'Coffre' , disable: true, cars: []},
    { type: 'FuelLow', icon: './assets/icons/FlatIcons/png/gas-pump.png', tooltip: 'Carburant bas' , disable: false, cars: []},
    { type: 'DriverSeatbelt', icon: './assets/icons/FlatIcons/png/seatbelt.png', tooltip: 'Ceinture de sécurité conducteur' , disable: false, cars: []},
    { type: 'AirConditioning', icon: './assets/icons/FlatIcons/png/fan.png', tooltip: 'Climatisation' , disable: true, cars: []},
    { type: 'CentralLock', icon: './assets/icons/FlatIcons/png/lock.png', tooltip: 'Fermeture centrale' , disable: true, cars: []},
    { type: 'RuningLight', icon: './assets/icons/FlatIcons/png/carlight.png', tooltip: 'Feux de position' , disable: true, cars: []},
    { type: 'RearFogLight', icon: './assets/icons/FlatIcons/png/fog-lamp.png', tooltip: 'Feu brouillard arrière' , disable: true, cars: []},
    { type: 'FrontFogLight', icon: './assets/icons/FlatIcons/png/fogleft-lamp.png', tooltip: 'Feu brouillard avant' , disable: true, cars: []},
    { type: 'LowBeams', icon: './assets/icons/FlatIcons/png/car-light.png', tooltip: 'Feux de croisement' , disable: true, cars: []},
    { type: 'HazardLight', icon: './assets/icons/FlatIcons/png/turn-signal.png', tooltip: 'Feux clignotants' , disable: true, cars: []},
    { type: 'HighBeams', icon: './assets/icons/FlatIcons/png/high-beam.png', tooltip: 'Feux de route' , disable: true, cars: []},
    { type: 'Handbrake', icon: './assets/icons/FlatIcons/png/frein.png', tooltip: 'Frein à main' , disable: true, cars: []},
    { type: 'ReverseGear', icon: './assets/icons/FlatIcons/png/gearshift.png', tooltip: 'Marche arrière' , disable: true, cars: []},
    { type: 'CruiseControl', icon: './assets/icons/FlatIcons/png/page-speed.png', tooltip: 'Régulateur de vitesse' , disable: false, cars: []},
    { type: 'BrakePedal', icon: './assets/icons/FlatIcons/png/pedal.png', tooltip: 'Frein à pied' , disable: true, cars: []},
    { type: 'ClutchPedal', icon: './assets/icons/FlatIcons/png/clutch.png', tooltip: 'Pédale embrayage' , disable: true, cars: []},
    { type: 'Doors', icon: './assets/icons/FlatIcons/png/car-door.png', tooltip: 'Portes' , disable: true, cars: []},
    { type: 'PassengerDoor', icon: './assets/icons/FlatIcons/png/doorleft.png', tooltip: 'Porte passager' , disable: true, cars: []},
    { type: 'DriverDoor', icon: './assets/icons/FlatIcons/png/doorright.png', tooltip: 'Porte du conducteur' , disable: true, cars: []},
    { type: 'RearRightDoor', icon: './assets/icons/FlatIcons/png/doorleft.png', tooltip: 'Porte arrière gauche' , disable: true, cars: []},
    { type: 'DriverDoor', icon: './assets/icons/FlatIcons/png/doorright.png', tooltip: 'Porte arrière droite' , disable: true, cars: []},
    { type: 'Webcast', icon: './assets/icons/FlatIcons/png/heating.png', tooltip: 'Système de chauffage de stationnement' , disable: false, cars: []},
    { type: 'BrakeFluidLowIndicator', icon: './assets/icons/FlatIcons/png/brake.png', tooltip: 'Indicateur de liquide de frein' , disable: false, cars: []},
    { type: 'CoolantLevelLowIndicator', icon: './assets/icons/FlatIcons/png/coolant.png', tooltip: 'Indicateur de niveau de liquide de refroidissement bas' , disable: false, cars: []},
    { type: 'BatteryIndicator', icon: './assets/icons/FlatIcons/png/battery.png', tooltip: 'Indicateur de batterie' , disable: false, cars: []},
    { type: 'BrakeFailureIndicator', icon: './assets/icons/FlatIcons/png/brake.png', tooltip: 'Indicateur de panne du système de freinage' , disable: false, cars: []},
    { type: 'OilPressureIndicator', icon: './assets/icons/FlatIcons/png/pressure-gauge.png', tooltip: 'Indicateur de pression huile' , disable: false, cars: []},
    { type: 'ABSFailureIndicator', icon: './assets/icons/FlatIcons/png/temperature.png', tooltip: 'Indicateur de moteur chaud' , disable: false, cars: []},
    { type: 'EngineHotIndicator', icon: './assets/icons/FlatIcons/png/abs.png', tooltip: 'Indicateur de panne ABS' , disable: false, cars: []},
    { type: 'CheckEngine', icon: './assets/icons/FlatIcons/png/car-engine.png', tooltip: 'Vérification moteur' , disable: false, cars: []},
    { type: 'AirBagIndicator', icon: './assets/icons/FlatIcons/png/airbag.png', tooltip: 'Indicateur airbags' , disable: false, cars: []},
    { type: 'ServiceCallIndicator', icon: './assets/icons/FlatIcons/png/call.png', tooltip: 'Indicateur appel de service' , disable: true, cars: []},
    { type: 'OilLevelLowIndicator', icon: './assets/icons/FlatIcons/png/engine-oil.png', tooltip: 'Indicateur de niveau huile bas' , disable: false, cars: []},
    { type: 'BatteryCharging', icon: './assets/icons/FlatIcons/png/batterycharging.png', tooltip: 'Recharge de batterie pour voitures électriques' , disable: true, cars: []},
    { type: 'FuelSource', icon: './assets/icons/FlatIcons/png/fuel.png', tooltip: 'Source de carburant' , disable: true, cars: []},
    { type: 'PTO', icon: './assets/icons/FlatIcons/png/pto.png', tooltip: 'Prise de force', disable: true, cars: []},
  ];
  
  cardData = []
  
  
  displayedColumns: string[] = ['TrackingObject', 'AcquisitionTime', 'Speed', 'NearAddress', 'OtherInfo'];
 
  
  datasource = new ServerSideDataSource();
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  
  public loading = false;
  destroy: Subject<boolean> = new Subject<boolean>();
  speed: any;
  enddate: any;
  result: string;
  stop: any;
  report: any;
  fuel: any;
  rpm: any;
  ListDefauts : Array<any>=  [];
  DashboardExtendedGpsDataList = [];
  trackingObjects;
  currentPage: number = 1;
  pageSize: number = 5; 
  totalAlerts: number = 0;
  allAlerts: any[] = [];
  currentCarIndex = 0;
  isInitialized: boolean = false;
  dataLoaded: boolean = false;
  alertTypes: string[] = [];
  allAlertsCache: any[] = [];



  constructor( private _SharedreportdataService: SharedreportdataService,  private _authenticateService: AuthenticateService,
    private translateService: TranslateService, 

    private _ReportService: ReportService) { }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  async ngOnInit() {
     this.loading = true;
    await this.getparams();

    this._ReportService.getReportingParam().subscribe((result) => {
      this.trackingObjects = decrypt(result);
      
    })
  
    // Don't load data here, wait for ngAfterViewInit
    // this.loadAlertsForCurrentCarPage();
  
     
   

//     this._ReportService.GetOuverSpeed(this.car , this.startdate,
//       this.enddate,this.emplacement,this.fuel, this.speed,this.rpm ,
//       this.stop,this.report).pipe(takeUntil(this.destroy)).subscribe((result) => {
      
//         this.loading = false;
    
//      let ListGeneralReport:any[] = decrypt(result);
//      console.log(ListGeneralReport)
//      ListGeneralReport.forEach(element => {
//       this.DashboardExtendedGpsDataList=element["DashboardExtendedGpsDataList"];
//       this.extractAlertsInfo(this.DashboardExtendedGpsDataList)
//       this.DashboardExtendedGpsDataList.forEach(row => {
//         Object.assign(row, { TrackingObject: element.Matricule});
//         this.ListDefauts.push(row);
//       });
       
//      });
    
//       this.datasource = new MatTableDataSource(this.ListDefauts);

//       this.datasource.paginator = this.paginator.toArray()[0];
//       console.log(this.datasource)


      
//   },
//   err => {
//     this.loading = false;

//     console.log(err);
// },
// () => {
 
// });
  

 
}

ngAfterViewInit() {
  // Initialize the paginator once after view is initialized
  setTimeout(() => {
    if (this.paginator && !this.isInitialized) {
      this.isInitialized = true;
      // Load initial data after paginator is ready
      if (!this.dataLoaded) {
        this.loadAlertsForCurrentCarPage();
        this.dataLoaded = true;
      }
    } else {
      // If paginator is not available, try to load data anyway
      if (!this.dataLoaded) {
        this.loadAlertsForCurrentCarPage();
        this.dataLoaded = true;
      }
    }
  });
}



updateTable(allAlerts: any[]) {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  const paginatedAlerts = allAlerts.slice(startIndex, endIndex);

  this.datasource.loadData(paginatedAlerts);
}



processVehicleData(data: any[], carId: any): any[] {
  const vehicleAlerts = [];

  // Clear previous
  this.alerts.forEach(alert => alert.cars = []);

  // Group alert occurrences
  const grouped = new Map<string, Map<string, { item: any, count: number }>>();

  data.forEach(item => {
    const alertType = item.AlertType;
    const matricule = item.Matricule || 'Inconnu';
    const alert = this.alerts.find(a => a.type === alertType);

    if (!alert) return;

    alert.disable = false;

    if (!grouped.has(alertType)) {
      grouped.set(alertType, new Map());
    }

    const alertGroup = grouped.get(alertType)!;

    if (!alertGroup.has(matricule)) {
      alertGroup.set(matricule, { item: item, count: 1 });
    } else {
      alertGroup.get(matricule)!.count++;
    }

    // For the table rows
    const timestamp = parseInt(item.Date.match(/\d+/)[0], 10);
    const parsedDate = new Date(timestamp);

    vehicleAlerts.push({
      Matricule: matricule,
      Date: formatDate(parsedDate, 'dd/MM/yyyy HH:mm', 'en-GB'),
      NearestPlaceString: item.NearestPlace,
      Speed: item.Speed,
      TypeAlert: alertType
    });
  });

  // Now populate alert.cars with Count and DateString
  this.alerts.forEach(alert => {
    const group = grouped.get(alert.type);
    alert.cars = [];

    if (group) {
      group.forEach(({ item, count }) => {
        const timestamp = parseInt(item.Date.match(/\d+/)[0], 10);
        const parsedDate = new Date(timestamp);

        alert.cars.push({
          Matricule: item.Matricule || 'Inconnu',
          DateString: formatDate(parsedDate, 'dd/MM/yyyy HH:mm', 'en-GB'),
          Count: count
        });
      });
    }
  });

  return vehicleAlerts;
}



loadAlertsForCurrentCarPage() {
  // If already cached, just paginate
  if (this.allAlertsCache.length > 0) {
    this.totalAlerts = this.allAlertsCache.length;
    this.updateTable(this.allAlertsCache);
    return;
  }

  this.loading = true;
  this.datasource.setLoading(true);

  this._ReportService
    .GetAlertsDashboardSingleCar(this.car, this.startdate, this.enddate)
    .pipe(
      map(res => decrypt(res)),
      takeUntil(this.destroy)
    )
    .subscribe({
      next: (res) => {
   if (res && res.length > 0) {
  this.alertTypes = Array.from(new Set(res.map(item => item.AlertType)));
}

        if (res && res.length > 0) {
          this.allAlertsCache = this.processVehicleData(res, this.car); 
        }

        this.totalAlerts = this.allAlertsCache.length;
        this.updateTable(this.allAlertsCache);
        this.loading = false;
        
      },
      error: (err) => {
        console.error(`Error loading alerts for vehicle ${this.car}:`, err);
        this.loading = false;
      }
    });
}





show(smthing){
  console.log(smthing)
}

setAlertFilter(){
  this.alerts.forEach(alert => {
    alert.disable = this.selectedAlerts.find(x => x == alert.type)? false : true
  })

}

/*extractAlertsInfo(data){

  try{
   
   let dataWithValue= data.filter(x=>x.Value.length>0);
   this.ListDefauts = []
   dataWithValue.forEach(row => {
        this.alerts.find(x=>x.type== row.Key).cars= row.Value;
     
        row.Value.forEach(item=>{
        
          this.ListDefauts.push(...item.ListAlertDashboardDetail);
        })
       
     
      
    });
    let t=this.alerts;
  } catch (err){
    console.log(err)
  }*/

  // fill the datasource using data
  //this.ListDefauts = []
  /*this.alerts.forEach(alert => {
    if(!alert.disable){
      alert.cars.forEach(car => {
        let object = {
          TrackingObject: car.Matricule,
          BeginDateLocalString: car.DateString,
          Speed: car.Speed,
          NearestPlaceString: car.NearestPlaceString}
          object[alert.type]= true
        this.ListDefauts.push(car.ListAlertDashboardDetail)
      })
    }
  });*/

  /*this.datasource = new MatTableDataSource(this.ListDefauts);
  this.datasource.paginator = this.paginator.toArray()[0];
  
 

}*/

onPageChange(event: PageEvent) {
  this.currentPage = event.pageIndex + 1;
  this.pageSize = event.pageSize;
  
  // Use cached alerts for pagination
  this.updateTable(this.allAlertsCache);
}

extractAlertsInfo(data: any[]) {
  try {
    this.ListDefauts = [];
    this.alerts.forEach(alert => alert.cars = []);

    data.forEach(item => {
      const alertType = item.AlertType;
      const matchingAlert = this.alerts.find(alert => alert.type === alertType);
      if (matchingAlert) {
        matchingAlert.cars.push(item);

        const timestamp = parseInt(item.Date.match(/\d+/)[0], 10);
        const parsedDate = new Date(timestamp);

        this.ListDefauts.push({
          Matricule: item.Matricule || 'Inconnu',
          Date: formatDate(parsedDate, 'dd/MM/yyyy HH:mm', 'en-GB'),
          NearestPlaceString: item.NearestPlace,
          Speed: item.Speed,
          TypeAlert: alertType
        });
      }
    });
    
    // Update the datasource with the processed data
    this.datasource.loadData(this.ListDefauts);

  } catch (err) {
    console.error('Error in extractAlertsInfo:', err);
  }
}




getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}

  getparams() 
  {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.car = params.param1;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4;
      this.speed = params.param6;
      this.CustomerGmt=params.param5;
 
});  
}




downloadExcel() {
    var prepare_to_excel = [];
    let tem = [];
    this.translateService.get(['NAV.TrackingObject','NAV.AcquisitionTime','NAV.Speed','NAV.NearAddress']).subscribe(translations  => {
      tem.push(translations['NAV.TrackingObject']);
      tem.push(translations['NAV.AcquisitionTime']);
      tem.push(translations['NAV.Speed']);
      tem.push(translations['NAV.NearAddress']);
    
    });
    

    prepare_to_excel.push(tem);
    this.ListDefauts.forEach(e => {
      var tempObj = [];
      tempObj.push(e.TrackingObject);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearestPlaceString);

      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Liste_defauts.xls', { bookType: 'xls', type: 'buffer' });
  }
  downloadPdf() {
    var prepare = [];
    this.ListDefauts.forEach(e => {
      var tempObj = [];

     
      tempObj.push(e.TrackingObject);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearestPlaceString);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Rapport des indicateurs de tableau de bord', 78, 16); //default
    this.translateService.get(['NAV.TrackingObject','NAV.AcquisitionTime','NAV.Speed','NAV.NearAddress']).subscribe(translations  => {
      doc.autoTable({
        head: [[translations['NAV.TrackingObject'],  translations['NAV.AcquisitionTime'], translations['NAV.Speed'],translations['NAV.NearAddress'],translations['NAV.Latitude'] , translations['NAV.Longitude']]],
        body: prepare,
        startY: 20
  
      });
     
    
    
    });
    
    doc.save('Liste_defauts' + '.pdf');
  } 

  
  getTimeWithGMT(time : string){
    try{
        let stringDate = time.split('/Date(')[1].split(')/')[0];
        let gmt_Str :string='';
        let intDate=0;
        let gmtServeur : number =0;
        if(stringDate.indexOf('+') != -1)
        {
            gmt_Str = stringDate.split('+')[1];
            intDate=parseInt( stringDate.split('+')[0]);
            gmtServeur=parseInt(gmt_Str)/100;

        } else  if(stringDate.indexOf('-') != -1){
            gmt_Str = stringDate.split('-')[1];
            intDate=parseInt( stringDate.split('-')[0]);
            gmtServeur=parseInt(gmt_Str)/100 *-1;
        }
        let gmtTotal = intDate+((gmtServeur + (this.CustomerGmt * -1))* 3600000 );
        let myDate= new Date(gmtTotal);
        return myDate;

    }
    catch(err)
    {
        return null;

    }
    
}

getUniqueCars(cars: any[]): any[] {
  const seen = new Set();
  return cars.filter(car => {
    if (seen.has(car.Matricule)) {
      return false;
    }
    seen.add(car.Matricule);
    car.Count = car.Count || 1;
    car.DateString = car.DateString || new Date().toLocaleString();
    return true;
  });
}



  
}
