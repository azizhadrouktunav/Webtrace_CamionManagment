
import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { decrypt } from 'app/main/parc/Parc';
import { DataChart } from 'app/main/parc/interfaces/depenses-general';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { GPSData } from '../../Interfaces/generalreportGPSData';
import pdfMake from "pdfmake/build/pdfmake";
import html2canvas from 'html2canvas';
declare var pdfMake: any;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-generalreportresult',
  templateUrl: './generalreportresult.component.html',
  styleUrls: ['./generalreportresult.component.scss']
})
export class GeneralreportresultComponent implements OnInit,OnDestroy {


  car: any;
  startdate: any;
  enddate: any;
  emplacement = true;
  fuel = 0;
  speed = 70;
  rpm = 110;
  stop = 0;
  report = 1;
  result: any;

  gaugeType = "semi";
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";

  singleStop: DataChart[];
  displayedColumns: string[] = ['State', 'AcquisitionTime', 'Speed', 'Distance', 'NearestPlace'];
  displayedColumns2: string[] = ['State','AcquisitionTime', 'NearestPlace', 'FuelLevel', 'Speed', 'Distance' , 'Latitude','Longitude'];
  displayedColumns3: string[] = ['State', 'AcquisitionTime', 'FuelLevel','Speed', 'Period','Distance', 'NearestPlace' , 'Latitude','Longitude'];

  extendedgpspositions: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();


  gpsdata: any = [];

  gpsdataPositions: MatTableDataSource<unknown>;
  gpsStops: MatTableDataSource<unknown>;
  docDefinition: any;
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  colorScheme = {
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56', '#81ccff']
  };
  CarMatricule: any;
  singleSpeed: any[];
  view2: any[] = [300, 400];

  colorScheme2 = {
    domain: ['#2b5cc4']
  };
  colorScheme3 = {
    domain: ['#81ccff']
  };
  colorScheme4 = {
    domain: ['#edc617']
  };
  cardColor: string = '#ffffff';
  stopposition: any = [];
  singleStatistic: DataChart[];
  singleStatistic2: DataChart[];
  singleStatistic3: DataChart[];
  SpeedAvg: string;
  data: any;
  chartData: string;
  chartData2: string;
  dateTime: Date;
  startdate2: string;
  enddate2: string;
  minDate: any;
  maxDate: any;
  showSpinners: any;
  showSeconds: any;
  stepHour: any;
  stepMinute: any;
  stepSecond: any;
  touchUi: any;
  color: any;
  customLoadingTemplate: any;
  destroy: Subject<boolean> = new Subject<boolean>();
  GpsDataStopRunState: string;
  IsContainProBUSCAN: any;
  GeneralReportResult:any;
  DataOfRunStopCrypy:any;
  public loading = false;
  constructor(private _SharedreportdataService: SharedreportdataService, 
              private _ReportService: ReportService,
              private translateService: TranslateService,
              public datepipe: DatePipe,
              public route : ActivatedRoute,
              private _errorHandler: ErrorHandlerService
  ) { }

  async ngOnInit() {
    //
    this.loading = true;
    if (this.route.snapshot.params['car']) {
      this.car = +this.route.snapshot.params['car'];
    }

    await this.getparams();
    var today = new Date();
  
    this._ReportService.getGeneralReport(this.car, this.startdate,
      this.enddate, this.emplacement, this.fuel, this.speed, this.rpm,
      this.stop, this.report).subscribe((result) => {

        
        this.GeneralReportResult =result;
        
        this.result = decrypt(result);
        
         if(this.CarMatricule == null)
         {
           this.CarMatricule= this.result["Matricule"];
         }
        if (this.result["AllExtendedGpsData"] != null) {
          this.result["AllExtendedGpsData"].forEach(elt => {
            this.gpsdata.push(new GPSData(elt, this.speed));

          });
        }
        this._ReportService.GetRunStopState(this.car, this.startdate,
          //this.enddate, this.emplacement).pipe(takeUntil(this.destroy)).subscribe((data) => {
            this.enddate, this.emplacement).subscribe((data) => {

            this.loading = false;
            this.DataOfRunStopCrypy=data;
            this.GpsDataStopRunState = decrypt(data);
            this.gpsdataPositions = new MatTableDataSource(this.GpsDataStopRunState["AllExtendedGpsDataStopRunState"]);
            this.gpsdataPositions.paginator = this.paginator.toArray()[1];
            this.GpsDataStopRunState["AllExtendedGpsDataStopRunState"].forEach(elt => {
              
              if (elt.StopRunStatusEnum == 1) {
                Object.assign(elt, { EndDateLocalStringFromJson:  this.datepipe.transform(new Date(parseInt(elt.EndDateLocal.substr(6))) , 'dd/MM/yyyy HH:mm')});
                this.stopposition.push(elt);

              }

            });
            this.gpsStops = new MatTableDataSource(this.stopposition);

            this.gpsStops.paginator = this.paginator.toArray()[2];
          });

        this.extendedgpspositions = new MatTableDataSource(this.gpsdata);

        this.extendedgpspositions.paginator = this.paginator.toArray()[0];


        let datacharStop: Array<DataChart> = [];
        let datacharSpeed: Array<DataChart> = [];
        let datacharStatistic: Array<DataChart> = [];
        let datacharStatistic2: Array<DataChart> = [];

        let datacharStatistic3: Array<DataChart> = [];

        datacharStop.push({ 'name': "Run", 'value': this.result["CirculationRateInPercent"] });
      //  datacharStop.push({ 'name': "Ralenti", 'value': this.result["StandbyRateInPercent"] });
        datacharStop.push({ 'name': "Stop", 'value': 100 - this.result["CirculationRateInPercent"] });
        var title: string;

        this.translateService.get(['NAV.SpeedAvg', 'NAV.SpeedMax', 'NAV.TraveledDistance',
          'NAV.StopsNumber', 'NAV.OverSpeedAlertsNbrWithBr', 'NAV.RealAvgFuelConsumption', 'NAV.RealSumFuelConsumption',
          'NAV.StartDate', 'NAV.EndDate', 'NAV.TrackingObject',
          'NAV.GeneralReport', 'NAV.Carposition', 'NAV.CarRunStop'])
          .subscribe(data => { this.data = data });


        datacharSpeed.push({ 'name': this.data["NAV.SpeedAvg"], 'value': this.result["SpeedAvg"] });
        datacharSpeed.push({ 'name': this.data["NAV.SpeedMax"], 'value': this.result["SpeedMax"] });
        datacharStatistic.push({ 'name': this.data["NAV.TraveledDistance"], 'value': this.result["Distance"] });
        datacharStatistic.push({ 'name': this.data["NAV.StopsNumber"], 'value': this.result["StopNumber"] });
        datacharStatistic2.push({ 'name': this.data["NAV.OverSpeedAlertsNbrWithBr"], 'value': this.result["OverSpeedNumber"] });

        datacharStatistic3.push({ 'name': this.data["NAV.RealAvgFuelConsumption"], 'value': this.result["RealAvgFuelConsumption"] });
        datacharStatistic3.push({ 'name': this.data["NAV.RealSumFuelConsumption"], 'value': this.result["RealSumFuelConsumption"] }); 

        this.singleStop = [...datacharStop];
        this.singleSpeed = [...datacharSpeed];
        this.singleStatistic = [...datacharStatistic];
        this.singleStatistic2 = [...datacharStatistic2];
        this.singleStatistic3 = [...datacharStatistic3];

      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        //this.errorHandler.handleError(error);.handleError(err);
      });
    



  }
  downloadPdf()
  {
    this.loading = true;
    this._ReportService.ExportReport(this.GeneralReportResult,"pdf",1)
       .subscribe((data:any) => {
        this.loading = false;
          let fileData64String= decrypt(data.ExportReportNewResult) ;
          var byteString = atob(fileData64String);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/pdf" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "GeneralReport"
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
     
    },
    (err: HttpErrorResponse) => {
      this.loading = false;
      //this.errorHandler.handleError(error);.handleError(err);
    });
  }
  downloadPdfReportRunStop()
  {
    this.loading = true;
    this._ReportService.ExportReport(this.DataOfRunStopCrypy,"pdf",17)
       .subscribe((data:any) => {
        this.loading = false;
          let fileData64String= decrypt(data.ExportReportNewResult) ;//
          var byteString = atob(fileData64String);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/pdf" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "StopCirculationReport"
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
     
    },
    (err: HttpErrorResponse) => {
      this.loading = false;
      //this.errorHandler.handleError(error);.handleError(err);
    });
  }
  downloadExcel()
  {
    this._ReportService.ExportReport(this.GeneralReportResult,"excel",1)
      .subscribe((data:any) => {
          let fileData64String= decrypt(data.ExportReportNewResult) ;
          var byteString = atob(fileData64String);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
          }
      var blob = new Blob([ia], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "GeneralReport"
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
     
    },
    (err: HttpErrorResponse) => {
         //this.errorHandler.handleError(error);.handleError(err);
    });
  }
  downloadRunStopExcel()
  {
    this._ReportService.ExportReport(this.DataOfRunStopCrypy,"excel",17)
      .subscribe((data:any) => {
          let fileData64String= decrypt(data.ExportReportNewResult) ;
          var byteString = atob(fileData64String);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
          }
      var blob = new Blob([ia], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "StopCirculationReport"
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
     
    },
    (err: HttpErrorResponse) => {
         //this.errorHandler.handleError(error);.handleError(err);
    });
  }
  getparams() {
    const today = new Date();
    this.startdate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    this.enddate = new Date();
    this._SharedreportdataService.fetchParams().subscribe(params => {
      if(params != null)
      {this.car = params.param1.Key;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4;
      this.fuel = params.param5;
      this.speed = params.param6;
      this.rpm = params.param7;
      this.stop = params.param8;
      this.report = params.param9;
      this.CarMatricule = params.param10;
      this.IsContainProBUSCAN = params.param11;
      }
      if(this.IsContainProBUSCAN)
      {
        this.displayedColumns =  ['State', 'AcquisitionTime', 'Speed', 'Distance', 'NearestPlace', 'FuelLevel','RPM',
        'EngineTemperature','Acceleration','FuelConsumptionAvg', 'Latitude','Longitude'];
      }
      else{
        this.displayedColumns =  ['State', 'AcquisitionTime', 'Speed', 'Distance', 'NearestPlace'];

      }
    });  
    //this._SharedreportdataService.clear();
  }

  

  


  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();

  }
  exportpdf() {
    var prepare = [];
    this.gpsdata.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.CumulativeDistanceString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.FuelLevel);
      prepare.push(tempObj);
    });
    const doc = new jsPDF("landscape");
    doc.setFontSize(8);

    doc.text('Liste des positions', 20, 10); 
    doc.autoTable({
     
      head: [['Etat', 'Date', 'Vitesse', 'Distance', 'Emplacement', 'Niveau de carburant']],
      body: prepare,
        startY: 20
    });
    doc.save('Listesdespositions' + '.pdf');
  }
  exportexcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('Etat');
    tem.push('Date');
    tem.push('Vitesse');
    tem.push("Distance");
    tem.push('Emplacement');
    tem.push("Niveau de carburant");
    tem.push('Latitude');
    tem.push("Longitude");

    prepare_to_excel.push(tem);
    this.gpsdata.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.CumulativeDistanceString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.FuelLevel);
      tempObj.push(e.Latitude);
      tempObj.push(e.Longitude);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Listesdespositions.xls', { bookType: 'xls', type: 'buffer' });
  }
  exportpdf2() {
    var prepare = [];
    this.GpsDataStopRunState["AllExtendedGpsDataStopRunState"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.PeriodString);
      tempObj.push(e.Speed);
      tempObj.push(e.CumulativeDistanceString);
      prepare.push(tempObj);
    });
    const doc = new jsPDF("landscape");
    doc.setFontSize(8);

    doc.text('Liste des Stops/Circulations', 20, 10); 
    doc.autoTable({
     
      head: [['Etat', 'Date', 'Emplacement', 'Période', 'Vitesse', 'Distance']],
      body: prepare,
        startY: 20
    });

    doc.save('ListesdesStopsetCirculations' + '.pdf');
  }
  exportexcel2() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('Etat');
    tem.push('Date');
    tem.push('Emplacement');
    tem.push("Période");
    tem.push('Vitesse');
    tem.push("Distance");
    tem.push('Latitude');
    tem.push("Longitude");
    prepare_to_excel.push(tem);
    this.GpsDataStopRunState["AllExtendedGpsDataStopRunState"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.PeriodString);
      tempObj.push(e.Speed);
      tempObj.push(e.CumulativeDistanceString);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'ListesdesStopsetCirculations.xls', { bookType: 'xls', type: 'buffer' });
  }
  exportpdf3() {
    var prepare = [];
    this.stopposition.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.EndDateLocalStringFromJson);
      tempObj.push(e.Speed);
      tempObj.push(e.PeriodString);
      tempObj.push(e.CumulativeDistanceString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Latitude);
      tempObj.push(e.Longitude);
      prepare.push(tempObj);
    });
    const doc = new jsPDF("landscape");
                doc.setFontSize(8);

                doc.text("Liste des stops", 20, 10); 
                doc.autoTable({
                 
                  head: [['Etat', 'Date de début', 'Date de fin', 'Vitesse','Période de stop','Distance', 'Emplacement']],
                  body: prepare,
                    startY: 20
                });
    
    doc.save('Listedesstops' + '.pdf');
  }
  exportexcel3() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('Etat');
    tem.push('Date de début');
    tem.push('date de fin ');
    tem.push("Vitesse");
    tem.push("Période de stop");
    tem.push('Distance');
    tem.push("Emplacement");
    tem.push('Latitude');
    tem.push("Longitude");
    prepare_to_excel.push(tem);
    this.stopposition.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.EndDateLocalStringFromJson);
      tempObj.push(e.Speed);
      tempObj.push(e.PeriodString);
      tempObj.push(e.CumulativeDistanceString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Latitude);
      tempObj.push(e.Longitude);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Listesdesstops.xls', { bookType: 'xls', type: 'buffer' });
  }
}
