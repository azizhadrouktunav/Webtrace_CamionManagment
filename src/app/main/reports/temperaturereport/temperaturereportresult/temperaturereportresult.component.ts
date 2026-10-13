import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DataChart } from 'app/main/parc/interfaces/depenses-general';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import { decrypt,crypt } from 'app/main/parc/Parc';
import { SummaryReport } from '../../Interfaces/SummaryReport';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { GPSData } from '../../Interfaces/generalreportGPSData';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { convertJsonDateToString } from 'app/main/helpers/date';
@Component({
  selector: 'app-temperaturereportresult',
  templateUrl: './temperaturereportresult.component.html',
  styleUrls: ['./temperaturereportresult.component.scss']
})
export class TemperaturereportresultComponent implements OnInit,OnDestroy {

  cars: any[];
  startdate: any;
  enddate: any;
  emplacement: any;
  speed: any;
  rpm: any;
  result: any;
  temperatureReportResult : any;
  summaryreportdata =[];
  datasource: MatTableDataSource<unknown>;
  allTemperatureRows: any[];
  single: DataChart[];
  result2: any[];
  multi: any[];
  view: any[] = [1000, 400];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator,null) paginator: MatPaginator;
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  legendTitle: string = 'Details';
  progressbarValue=0;
  ListTempManyCar : any[] = [];

  colorScheme = {
    //domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    //domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56', '#81ccff']
  };
  public loading = false;

  barChartData: DataChart[];
  
  CarMatricule: any[];
  docDefinition: any;
  gpsdata: any = [];
  temp: number;
  data: any;
  legendPosition:any;
  customLoadingTemplate:any;
  Selected_chauffeur:any;
  destroy: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = ['CarMatricule','BeginDateLocalString', 'MaxTemp', 'MinTemp', 'MaxHum', 'MinHum'];

  constructor(    private _SharedreportdataService: SharedreportdataService,  private _authenticateService: AuthenticateService,
    private _ReportService: ReportService,
    private translateService: TranslateService,
    private datePipe: DatePipe) {  }
  

    async ngOnInit() {
      this.loading = true;
    this.datePipe== new DatePipe('fr-FR');
    await this.getparams();
      let dataDet : Array<DataChart>=[];
      let datachar: Array<any> = [];
      if(this.cars != null){
          if (this.cars.length == 1) {
        this._ReportService.GetTemperatureTimeReport(this.cars[0] , this.startdate,
          this.enddate,this.emplacement).pipe(takeUntil(this.destroy)).subscribe((result) => {
            this.loading = false;

          this.temperatureReportResult= result;
          this.result = decrypt(result);
          //console.log(this.result);
         
          
          let r: Array<any> = [];
          let r1: Array<any> = [];
        this.translateService.get(['NAV.Temperature' ,'NAV.HumidityLevel']).subscribe(data => {this.data = data}    );

          if(this.result != null && this.result.ListTemperatureHunidityData != null)
          {
             this.result.ListTemperatureHunidityData.forEach(row=>{
              r.push({ 'name':new Date(parseInt((row.Date.toString()).substr(6))) , 'value':   row.Temperature});
              r1.push({ 'name':new Date(parseInt((row.Date.toString()).substr(6))) , 'value':   row.Humidity});
           
             })
           
            
          }
          datachar.push({ 'name': this.data['NAV.Temperature'], 'series': r });
          datachar.push({ 'name': this.data['NAV.HumidityLevel'], 'series': r1 });
          
          if(this.result != null ){
            this.allTemperatureRows = this.result.ListTemperatureHunidity;
            let t=  this.allTemperatureRows;
            this.allTemperatureRows.forEach(element => {
              element.Matricule = this.CarMatricule[0];
            });
            this.datasource = new MatTableDataSource(this.allTemperatureRows);
            this.datasource.paginator = this.paginator;
          }
    },
    err => {
      this.loading = false;

      console.log(err);
  },
  () => {
   
        this.single = [...datachar];
  });
}else{
  // for every car we will call the api using for loop and await for the result
  let result = null;
  this.allTemperatureRows = [];
  this.progressbarValue = 0;
  this.temperatureReportResult = "";
  for (let i = 0; i < this.cars.length; i++) {
    result = await this._ReportService.GetTemperatureTimeReportWithoutExtendedGpsData(this.cars[i] , this.startdate,
      this.enddate,this.emplacement).toPromise();
        this.loading = false;
        if(result != null && result != undefined){
          this.temperatureReportResult = this.temperatureReportResult + result;
          let decreptedData = decrypt(result);
          //console.log(decreptedData);
          
          if(decreptedData != null){
            this.ListTempManyCar.push(decreptedData);
            let rows : any[] = decreptedData.ListTemperatureHunidity;
            rows.forEach(element => {
              element.Matricule = this.CarMatricule[i];
              this.allTemperatureRows.push(element);
            });
            this.progressbarValue = (((i +1) * 100) / this.cars.length);
            //console.log(this.allTemperatureRows);
            this.datasource = new MatTableDataSource(this.allTemperatureRows);
            this.datasource.paginator = this.paginator;
           
           // this.refueligDeliveyData.push(({Car:this.CarMatricule[i],AllTemperatureHumidityList:[],AllTimeList:[],AllTemperatureList:[],Distance:0,EndDateLocal:this.enddate,StartDateLocal:this.startdate,temperatureRepportRow:rows}));
          }
        }
  }

}}//}
  }
  convertDate(date){
    return convertJsonDateToString(date);
  }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
    getparams() {
      this._SharedreportdataService.fetchParams().subscribe(params => {
        this.cars =  params.param1 ;
        this.startdate = params.param2;
        this.enddate = params.param3;
        this.emplacement = params.param4 ;
       
       
        this.CarMatricule = params.param11 ;        
      });
    }
    
    xAxisTickFormatting(val) {
      let datePipe2: DatePipe = new DatePipe('fr-FR')
        return  datePipe2.transform(val, 'short');
     
    }
    downloadExcel()
  {      this.loading = true;
    if(this.cars.length >1)
    {
      let CompressedData =crypt( this.ListTempManyCar);
      this._ReportService.ExportReport(CompressedData,"excel",15).subscribe((data:any) => {
        this.loading = false;
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
        titleReport = "TemperatureReport"
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
      })
    }
 else
 {
    this._ReportService.ExportReport(this.temperatureReportResult,"excel",7).subscribe((data:any) => {
      this.loading = false;
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
      titleReport = "TemperatureReport"
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
    err => {
      this.loading = false;

    }
    );
  }
  }
  downloadPdf()
  {      this.loading = true;
    if(this.cars.length >1)
    {
     
      let CompressedData =crypt( this.ListTempManyCar);
      this._ReportService.ExportReport(CompressedData,"pdf",15).subscribe((data:any) => {
        this.loading = false;
  
        let fileData64String= decrypt(data.ExportReportNewResult) ;//ExportReportNewResult
        var byteString = atob(fileData64String);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], { type: "application/pdf" });
        var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
        var titleReport = "";
        titleReport = "TemperatureReport"
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
  
      err => {
        this.loading = false;
  
      }
      );
    }else{
      this._ReportService.ExportReport(this.temperatureReportResult,"pdf",7).subscribe((data:any) => {
        this.loading = false;
  
        let fileData64String= decrypt(data.ExportReportNewResult) ;//ExportReportNewResult
        var byteString = atob(fileData64String);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], { type: "application/pdf" });
        var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
        var titleReport = "";
        titleReport = "TemperatureReport"
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
  
      err => {
        this.loading = false;
  
      }
      );
    }
    
  }

  }
  export class TemperatureReportSource
{
  AllTemperatureList :any[];
  AllTimeList:any[];
  Distance:number;
  EndDateLocal:Date;
  StartDateLocal:Date;
  AllTemperatureHumidityList:any[];
  temperatureRepportRow:any[];
  Car:string;
}
