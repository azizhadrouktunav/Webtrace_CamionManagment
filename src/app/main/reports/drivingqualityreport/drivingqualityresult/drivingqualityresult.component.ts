import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DataChart } from 'app/main/parc/interfaces/depenses-general';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import { decrypt } from 'app/main/parc/Parc';
import { SummaryReport } from '../../Interfaces/SummaryReport';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { TranslateService } from '@ngx-translate/core';

import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-drivingqualityresult',
  templateUrl: './drivingqualityresult.component.html',
  styleUrls: ['./drivingqualityresult.component.scss']
})
export class DrivingqualityresultComponent implements OnInit,OnDestroy {

  car: any;
  startdate: any[];
  enddate: any[];
  emplacement: any;
  speed: any;
  rpm: any;
  result: any;

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
  xAxisLabel: string = 'Véhicules';
  showYAxisLabel: boolean = true;
  //yAxisLabel: string = 'Number';
  legendTitle: string = 'Details';
  displayedColumns: string[] = ['TrackingObjectName', 'DriverName', 'Distance', 'AlertHarshAccelerationNumber',
    'AlertHarshBrakingNumber', 'SpeedMax', 'MinutesOfOverspeed', 'CurrentScore'];
  destroy: Subject<boolean> = new Subject<boolean>();
  public loading = false;
  colorScheme = {
    //domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    //domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56', '#81ccff']
  };

  barChartData: DataChart[];

  CarMatricule: any;
  docDefinition: any;
  subscription: Subscription;
  data: any;
  report: any;
  customLoadingTemplate:any;
  DrivingQualityReportResult:any;

  constructor(private _SharedreportdataService: SharedreportdataService, 
              private _ReportService: ReportService,
              private _errorHandler: ErrorHandlerService,
              private translateService: TranslateService,) { }

  async ngOnInit() {

    this.loading = true;
  
    await this.getparams();
      let dataDet : Array<DataChart>=[];
        let datachar: Array<any> = [];

      //{ 
        //this.car.forEach(elt => {
       
      
            
        this._ReportService.getDrivingQualityReportCompressed(this.car , this.startdate,
        this.enddate , this.report 
        ).pipe(takeUntil(this.destroy)).subscribe((result) => {
          this.loading = false;
        this.DrivingQualityReportResult=result;
        this.result = decrypt(result);
        let IsReportByDriver : boolean;
        IsReportByDriver= this.result["IsReportByDriver"];
        this.result = this.result["ListGeneralReport"];
        
        this.translateService.get(['NAV.AggressiveDrivingSuddenAcceleration','NAV.AggressiveDrivingSuddenBraking','NAV.OverEngineSpeed',
        'NAV.AggressiveDrivingAccelerationOrSuddenBraking','NAV.SpeedOverride' ])
         .subscribe(data => {this.data = data}
              );
        if(this.result != null)
        {
          this.result.forEach(elt => {
          let r: Array<any> = [];
        r.push({ 'name': this.data["NAV.AggressiveDrivingSuddenAcceleration"], 'value':  elt["AlertHarshAccelerationNumber"] });
        r.push({ 'name':  this.data["NAV.AggressiveDrivingSuddenBraking"], 'value':  elt["AlertHarshBrakingNumber"] });
        r.push({ 'name': this.data["NAV.OverEngineSpeed"], 'value': elt["AlertRPMOutOfRangeNumber"] });
        r.push({ 'name':  this.data["NAV.AggressiveDrivingAccelerationOrSuddenBraking"], 'value':  elt["AlertHarshAccelerationOrBrakingNumber"] });
        r.push({ 'name':  this.data["NAV.SpeedOverride"], 'value':  elt["AlertOverSpeedNumber"] });
        if(IsReportByDriver)
        {
          datachar.push({ 'name': elt["Driver"], 'series': r });
          this.xAxisLabel = 'Chauffeurs';
        }
        else
        {
          datachar.push({ 'name': elt["Matricule"], 'series': r });
        }

        // datachar.push({ 'name': elt["Matricule"], 'series': r });
      });

        }
      },
        (error: HttpErrorResponse) => {
          //this.errorHandler.handleError(error);.handleError(error);
          console.log(error.name + ' ' + error.message);
          this.loading = false;
        },
        () => {
          this.datasource = new MatTableDataSource(this.result);

          this.datasource.sort = this.sort;
          this.datasource.paginator = this.paginator;


          this.single = [...datachar];
        });
 
  
}
  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  getparams() {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.car =  params.param1 ;
      this.startdate = params.param2;
      this.enddate = params.param3;
     
      this.report = params.param9;
      
      this.CarMatricule = params.param10 ;
    });
  }




  exportpdf() {
    var prepare = [];
    this.result.forEach(e => {
      var tempObj = [];
      tempObj.push(e.TrackingObjectName);
      tempObj.push(e.DriverName);
      tempObj.push(e.AccelerationAlertCount);
      tempObj.push(e.AccelerationOrBrakingAlertCount);
      tempObj.push(e.AllManRPMOutOfRangeAlertCount);
      tempObj.push(e.BrakingAlertCount);
      tempObj.push(e.OverSpeedAlertCount);


      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Cars Statistics data', 78, 16); //default

    doc.autoTable({
      head: [['Matricule', 'Driver', 'AccelerationAlertCount', 'AccelerationOrBrakingAlertCount', 'AllManRPMOutOfRangeAlertCount',
        'BrakingAlertCount', 'OverSpeedAlertCount']],
      body: prepare,
      startY: 20

});
doc.save('Driving_quality_data' + '.pdf');
}
downloadExcel()
  {this.loading = true;
    this._ReportService.ExportReport(this.DrivingQualityReportResult,"excel",10).subscribe((data:any) => {
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
      titleReport = "DrivingQualityReport"
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
    err =>{
      this.loading = false;
    }
    );
  }
  downloadPdf()
  {this.loading = true;
    this._ReportService.ExportReport(this.DrivingQualityReportResult,"pdf",10).subscribe((data:any) => {
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
      titleReport = "DrivingQualityReport"
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
    err =>{
      this.loading = false;
    });
  }
exportexcel(){
  var prepare_to_excel=[];
  let tem =[];
  tem.push('Matricule');
  tem.push('Driver');
  tem.push('AccelerationAlertCount');
  tem.push("AccelerationOrBrakingAlertCount");
  tem.push('AllManRPMOutOfRangeAlertCount');
  tem.push("BrakingAlertCount");
  tem.push('OverSpeedAlertCount');
  
  
  prepare_to_excel.push(tem);
  this.summaryreportdata.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.TrackingObjectName);
    tempObj.push(e.DriverName);
    tempObj.push(e.AccelerationAlertCount);
    tempObj.push(e.AccelerationOrBrakingAlertCount);
    tempObj.push(e.AllManRPMOutOfRangeAlertCount);
    tempObj.push(e.BrakingAlertCount);
    tempObj.push(e.OverSpeedAlertCount);
   
    prepare_to_excel.push(tempObj);
  });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, 'Driving_quality_data.xls', { bookType: 'xls', type: 'buffer' });
}
  }
