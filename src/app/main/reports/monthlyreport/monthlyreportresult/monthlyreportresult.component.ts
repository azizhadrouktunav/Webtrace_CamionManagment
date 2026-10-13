

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import { decrypt } from 'app/main/parc/Parc';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Subscription, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-monthlyreportresult',
  templateUrl: './monthlyreportresult.component.html',
  styleUrls: ['./monthlyreportresult.component.scss']
})
export class MonthlyreportresultComponent implements OnInit,OnDestroy {
  car: any;
  startdate: any;
  emplacement: any;
  monthlyReportResult : string;
  result: any;
  single: any[];
  public view: any[] = [850, 400];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public showYAxisLabel = true;
  public graphDataChart: any[];
  public colorScheme = {
    domain: ['#2b5cc4', '#edc617', '#81ccff']
  };
  single2: any[];
  single3: any[];

  view2: any[] = [400, 400];
  legend: boolean = true;
  legendPosition: string = 'below';

  colorScheme2 = {
    domain: ['#81ccff', '#2b5cc4']

  };
 
  SubMonthlyReports: any;
  monthlyReportItems: any;
  datasource: any;
  displayedColumns: string[] = ['Day', 'CirculationTime', 'StopTimeString', 'KmTraversed', 'NearestPlaceStart', 'NearestPlaceEnd', 'NbreEscessSpeed','AVGFuelConsumption' ,'FuelConsumption'];
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  destroy: Subject<boolean> = new Subject<boolean>();
  CarMatricule: any;
  docDefinition: any;
  subscription: Subscription;
  enddate: string;
  data: any;
  customLoadingTemplate: any;
  public loading = false;
  constructor(private _SharedreportdataService: SharedreportdataService, 
    private _ReportService: ReportService,
    private translateService: TranslateService,
    private _errorHandler: ErrorHandlerService
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.getparams();
      let datachar: Array<any> = [];
      let datachar2: Array<any> = [];
      let datachar3: Array<any> = [];

      { 
        
       this.subscription = this._ReportService.getMonthlyReport(this.car , this.startdate,
       this.emplacement)
         .pipe(takeUntil(this.destroy))
         .subscribe((result) => {
          this.loading = false;
        this.monthlyReportResult= result;
        this.result = decrypt(result);
        this.SubMonthlyReports = this.result["SubMonthlyReports"][0];
        this.monthlyReportItems = this.SubMonthlyReports["monthlyReportItems"];
        let r: Array<any> = [];
        let r1: Array<any> = [];
        let r2: Array<any> = [];
        
        this.translateService.get(['NAV.TraveledDistance'
          , 'NAV.OverSpeedNbr', 'NAV.TotalFuelConsumed'])
          .subscribe(data => { this.data = data }
          );
        this.monthlyReportItems.forEach(elt => {
          r.push({ 'name': elt["Day"], 'value': elt["KmTraversed"] });
          r1.push({ 'name': elt["Day"], 'value': elt["NbreEscessSpeed"] });
          r2.push({ 'name': elt["Day"], 'value': elt["RealAvgFuelConsumption"] });

        });
        datachar.push({ 'name': this.data["NAV.TraveledDistance"], 'series': r });
        datachar.push({ 'name': this.data["NAV.OverSpeedNbr"], 'series': r1 });
        datachar.push({ 'name': this.data["NAV.TotalFuelConsumed"], 'series': r2 });
        datachar2.push({ 'name': "Average Speed", 'value': this.result["SpeedAvg"] });
        datachar3.push({ 'name': "Maximum Speed", 'value': this.result["SpeedMax"] });

        this.single = [...datachar];
        this.single2 = [...datachar2];
        this.single3 = [...datachar3];

        this.datasource = new MatTableDataSource(this.monthlyReportItems);
        this.datasource.paginator = this.paginator;
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
          console.log(err);
          //this.errorHandler.handleError(error);.handleError(err);
        });
}
 

}
getparams() {
  this._SharedreportdataService.fetchParams().subscribe(params => {
    this.car =  params.param1.Key ;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4 ;
    
      this.CarMatricule = params.param10 ;
  });
}
  ngOnDestroy() {
    this.subscription.unsubscribe(); this.destroy.next(true);
    this.destroy.unsubscribe();

  }

  rederGroupedBarChart(){
    html2canvas(document.getElementById('groupedBarChart'), {height: 600})
      .then((canvas) => {
        document.body.appendChild(canvas);
      });
  }
  downloadExcel()
  {this.loading = true;
    this._ReportService.ExportReport(this.monthlyReportResult,"excel",3).subscribe((data:any) => {
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
      titleReport = "MonthlyReport"
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
      this.loading = false;
      // console.log(err);
      //this.errorHandler.handleError(error);.handleError(err);
   });
  }
  downloadPdf()
  {this.loading = true;
    this._ReportService.ExportReport(this.monthlyReportResult,"pdf",3).subscribe((data:any) => {
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
      titleReport = "MonthlyReport"
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
      // console.log(err);
      //this.errorHandler.handleError(error);.handleError(err);
   });
  }


  exportpdf() {
    var prepare = [];
    this.monthlyReportItems.forEach(e => {
      var tempObj = [];
      tempObj.push(e.Day);
      tempObj.push(e.CirculationTimeString);
      tempObj.push(e.StopTimeString);
      tempObj.push(e.KmTraversed);
      tempObj.push(e.NearestPlaceAndDateLocalOfFirstRun);
      tempObj.push(e.NearestPlaceAndDateLocalOfLastStop);
      tempObj.push(e.NbreEscessSpeed);
      tempObj.push(e.RealAvgFuelConsumption);

      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Mensuel data', 78, 16); //default

    doc.autoTable({
      head: [['Day', 'CirculationTime', 'StopTime', 'KmTraversed', 'NearestPlaceFirstRun',
        'NearestPlaceLastStop', 'Overspeednbr',
        'RealAvgFuelConsumption']],
      body: prepare,
      startY: 20

    });
    doc.save('Mensuel_data' + '.pdf');
  }
  exportexcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('MatricDayule');
    tem.push('CirculationTime');
    tem.push('StopTime');
    tem.push("KmTraversed");
    tem.push('NearestPlaceFirstRun');
    tem.push("NearestPlaceLastStop");
    tem.push('Overspeednbr');
    tem.push('EngineRunPeriod');

    prepare_to_excel.push(tem);
    this.monthlyReportItems.forEach(e => {
      var tempObj = [];
      tempObj.push(e.Day);
      tempObj.push(e.CirculationTimeString);
      tempObj.push(e.StopTimeString);
      tempObj.push(e.KmTraversed);
      tempObj.push(e.NearestPlaceAndDateLocalOfFirstRun);
      tempObj.push(e.NearestPlaceAndDateLocalOfLastStop);
      tempObj.push(e.NbreEscessSpeed);
      tempObj.push(e.RealAvgFuelConsumption);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Mensuel_data.xls', { bookType: 'xls', type: 'buffer' });
  }
}
