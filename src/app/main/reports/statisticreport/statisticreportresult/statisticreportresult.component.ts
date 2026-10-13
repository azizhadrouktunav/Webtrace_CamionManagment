

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service'; import { ReportService } from '../../services/report.service';
import { json2array } from 'app/main/helpers/must-match.validator';
import { crypt, decrypt } from 'app/main/parc/Parc';
import { GPSData } from '../../Interfaces/generalreportGPSData';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DataChart } from 'app/main/parc/interfaces/depenses-general';
import { SummaryReport } from '../../Interfaces/SummaryReport';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-statisticreportresult',
  templateUrl: './statisticreportresult.component.html',
  styleUrls: ['./statisticreportresult.component.scss']
})


export class StatisticreportresultComponent implements OnInit, OnDestroy {
  car: any[]=[];
  startdate: any[];
  enddate: any[];
  emplacement: any;
  speed: any;
  rpm: any;
  result: SummaryReport[]=[];
  summaryReportCompressed: string;

  summaryreportdata = [];
  datasource: MatTableDataSource<unknown>;

  single: DataChart[];
  result2: any[];
  multi: any[];
  view: any[] = [1000, 400];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  legendTitle: string = '';
  legendPosition: string = 'below';
  displayedColumns: string[] = ['Car', 'Driver', 'AlertOverSpeedNumber', 'OverSpeedNumber', 'StopTimeString', 'RunTimeString', 'Distance',
    'NearestPlaceAndDateLocalOfFirstRun', 'NearestPlaceAndDateLocalOfLastStop', 'NbrOverSpeedMoreThan3shold', 'EngineRunPeriodString'];
    destroy: Subject<boolean> = new Subject<boolean>();

  colorScheme = {
    
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56', '#81ccff']
  };

  barChartData: DataChart[];

  CarMatricule: any;
  docDefinition: any;
  data: any;
  customLoadingTemplate: any;
  public loading = false;
    progressbarValue=0;
  constructor(private _SharedreportdataService: SharedreportdataService, private _authenticateService: AuthenticateService,
    private _ReportService: ReportService,
    private translateService: TranslateService,


  ) { }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();  }

  async ngOnInit() {
    this.loading = true;
    await this.getparams();
    let dataDet: Array<DataChart> = [];
    let datachar: Array<any> = [];
    
     for (let i = 0; i < this.car.length; i++) 
      {

        let keyCar: any[]=[];
        keyCar.push(this.car[i]);
      let result= await this._ReportService.getSummaryReport(keyCar, this.startdate,this.enddate, this.emplacement, this.speed, this.rpm, 'vehicule').toPromise();
       this.progressbarValue = (((i +1) * 100) / this.car.length);
      //  .pipe(takeUntil(this.destroy)).subscribe((result) => {
        this.loading = false;
        this.summaryReportCompressed = result;
        let dataSummary: any = decrypt(result);
        this.result.push( dataSummary[0]);
        dataSummary.forEach(row => {


          this.translateService.get(['NAV.TrackingObject', 'NAV.TraveledDistance',
            'NAV.StopsNumber', 'NAV.OverSpeedNbr', 'NAV.OverSpeedAlertsNbr', 'NAV.SpeedThreshold', 'NAV.Details'])
            .subscribe(data => { this.data = data }
            );
          this.legendTitle = this.data["NAV.Details"];
          this.xAxisLabel = this.data["NAV.TrackingObject"];
          if (row != null) {
            let r: Array<any> = [];
            r.push({ 'name': this.data["NAV.StopsNumber"], 'value': row.StopNumber });
            r.push({ 'name': this.data["NAV.OverSpeedNbr"], 'value': row.OverSpeedNumber });
            r.push({ 'name': this.data["NAV.TraveledDistance"], 'value': row.Distance });
            r.push({ 'name': this.data["NAV.OverSpeedAlertsNbr"], 'value': row.AlertOverSpeedNumber });
            r.push({ 'name': this.data["NAV.OverSpeedNbr"] + ">" + this.data["NAV.SpeedThreshold"], 'value': row.NbrOverSpeedMoreThan3shold });

            datachar.push({ 'name': row.Matricule, 'series': r });





          }

        })
          this.datasource = new MatTableDataSource(this.result);


          this.datasource.sort = this.sort;
          this.datasource.paginator = this.paginator;


          this.single = [...datachar];
      /* },
        err => {
          console.log(err);
          this.loading = false;
        },
        () => {
          this.datasource = new MatTableDataSource(this.result);

          this.datasource.sort = this.sort;
          this.datasource.paginator = this.paginator;


          this.single = [...datachar];
        }); */
      }


   
  }

  

 
  getparams() {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4;
      this.speed = params.param6;
      this.rpm = params.param7;
      this.car=params.param1;
      

    });
  }



  downloadExcel() {
    this.loading = true;
     let CompressedData =crypt( this.result);
    this._ReportService.ExportReport(CompressedData, "excel", 2).subscribe((data: any) => {
      this.loading = false;

      let fileData64String = decrypt(data.ExportReportNewResult);
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "SummaryReport"
      titleReport += " " + "(" + dateString + ")";


      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob); // For IE browser
      }
      const linkElement = document.createElement('a');
      const url = URL.createObjectURL(blob);
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('download', titleReport + '.XLS');
      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      });
      linkElement.dispatchEvent(clickEvent);

    },
    err => {
      console.log(err);
      this.loading = false;
    },);
  }
  downloadPdf() {
    this.loading = true;
    let CompressedData =crypt( this.result);
    this._ReportService.ExportReport(CompressedData, "pdf", 2).subscribe((data: any) => {
      this.loading = false;
      let fileData64String = decrypt(data.ExportReportNewResult);
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/pdf" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "SummaryReport"
      titleReport += " " + "(" + dateString + ")";


      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob); // For IE browser
      }
      const linkElement = document.createElement('a');
      const url = URL.createObjectURL(blob);
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('download', titleReport + '.pdf');
      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      });
      linkElement.dispatchEvent(clickEvent);

    },
    err => {
      console.log(err);
      this.loading = false;
    },);
  }


  exportpdf() {
    var prepare = [];
    this.summaryreportdata.forEach(e => {
      var tempObj = [];
      tempObj.push(e.Matricule);
      tempObj.push(e.Driver);
      tempObj.push(e.AlertOverSpeedNumber);
      tempObj.push(e.OverSpeedNumber);
      tempObj.push(e.StopTime);
      tempObj.push(e.RunTimeString);
      tempObj.push(e.Distance);
      tempObj.push(e.NearestPlaceAndDateLocalOfFirstRun);
      tempObj.push(e.NearestPlaceAndDateLocalOfLastStop);
      tempObj.push(e.NbrOverSpeedMoreThan3shold);
      tempObj.push(e.EngineRunPeriodString);

      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Cars Statistics data', 78, 16); //default

    doc.autoTable({
      head: [['Matricule', 'Driver', 'AlertOverSpeedNumber', 'OverSpeedNumber', 'StopTime',
        'RunTime', 'Distance', 'NearestPlaceFirstRun', 'NearestPlaceLastStop',
        'NbrOverSpeedMoreThan3shold', 'EngineRunPeriod']],
      body: prepare,
      startY: 20

    });
    doc.save('Cars_Statistics_data' + '.pdf');
  }
  exportexcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('Matricule');
    tem.push('Driver');
    tem.push('AlertOverSpeedNumber');
    tem.push("OverSpeedNumber");
    tem.push('StopTime');
    tem.push("RunTime");
    tem.push('Distance');
    tem.push('NearestPlaceFirstRun');
    tem.push('NearestPlaceLastStop');
    tem.push("NbrOverSpeedMoreThan3shold");
    tem.push('EngineRunPeriod');

    prepare_to_excel.push(tem);
    this.summaryreportdata.forEach(e => {
      var tempObj = [];
      tempObj.push(e.Matricule);
      tempObj.push(e.Driver);
      tempObj.push(e.AlertOverSpeedNumber);
      tempObj.push(e.OverSpeedNumber);
      tempObj.push(e.StopTime);
      tempObj.push(e.RunTimeString);
      tempObj.push(e.Distance);
      tempObj.push(e.NearestPlaceAndDateLocalOfFirstRun);
      tempObj.push(e.NearestPlaceAndDateLocalOfLastStop);
      tempObj.push(e.NbrOverSpeedMoreThan3shold);
      tempObj.push(e.EngineRunPeriodString);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Cars_Statistics_data.xls', { bookType: 'xls', type: 'buffer' });
  }
}
