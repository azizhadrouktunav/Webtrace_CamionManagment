import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription, Subject } from 'rxjs';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import { decrypt, crypt } from 'app/main/parc/Parc';
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
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-drivermissionresult',
  templateUrl: './drivermissionresult.component.html',
  styleUrls: ['./drivermissionresult.component.scss']
})
export class DrivermissionresultComponent implements OnInit,OnDestroy {
  car: any;
  startdate: any[];
  enddate: any[];
  emplacement: any;
  MissionReportResult:any;
  result: any;
  destroy: Subject<boolean> = new Subject<boolean>();

  reportdata = [];
  exportedData : any[]=[];
  datasource: MatTableDataSource<unknown>;

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
  xAxisLabel: string = 'Cars';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Number';
  legendTitle: string = 'Details';
  displayedColumns: string[] = ['DriverElementFullName', 'Marticule',  'AcquisitionTime', 'EndTime', 'NearestPlaceAndDateLocalOfFirstRun', 'NearestPlaceAndDateLocalOfLastStop',"distance", 'fuel', "duree", 'AvgSpeed'];//'TrackingObjectFullName', 
  //startDate: any;
  //endDate: any;
  colorScheme = {
    //domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    //domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#8BB7F9', '#039BE5', '#115E87', '#184058', '#1E2129']
  };
  emplacementlist: any;
  passage: any;
  rayon: any;
  CarMatricule: any;
  subscription: Subscription;
  report: any;
  typeParam: any;
  customLoadingTemplate: any;
  public loading = false;
  progressbarValue=0;
  progressValueInPercent =0;
  constructor(private _SharedreportdataService: SharedreportdataService,
    private _ReportService: ReportService,
    private _errorHandler: ErrorHandlerService

  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.getparams();
    //console.log(this.car);
    
    this.progressValueInPercent = 100 / this.car.length;
    
    for (const elt of this.car) {
        try {
            
            const result = await this._ReportService.getMissionReport(
                elt,
                this.startdate,
                this.enddate,
                this.report,
                this.typeParam,
            ).pipe(takeUntil(this.destroy)).toPromise();
            

            this.progressbarValue += this.progressValueInPercent;
            this.loading = false;
            this.MissionReportResult = result;
            this.result = decrypt(result);
          //  console.log(this.result);
           

            if (this.result != null && this.result.ListMissions[0].SubGeneralReports.length>0) {

                this.reportdata.push(...this.result.ListMissions[0].SubGeneralReports);
                this.exportedData.push(this.result.ListMissions[0]);
                const totalFuelConsumption = this.result.ListMissions[0].SubGeneralReports.reduce((total, report) => {
                    return total + report.RealSumFuelConsumptionInL;
                }, 0).toFixed(2);

                const totalData = {
                    "DriverName": this.result.ListMissions[0].DriverName,
                    "Matricule": "--",
                    "Distance": this.result.ListMissions[0].Distance,
                    "FuelLevel": totalFuelConsumption,
                    "NearestPlaceAndDateLocalOfLastStop": "--",
                    "NearestPlaceAndDateLocalOfFirstRun": "--",
                    "m_EndDateLocal": this.result.EndDateLocal,
                    "StartDateLocal": this.result.StartDateLocal,
                    "StopNumber": this.result.ListMissions[0].NumberOfStops,
                    "StopTimeString": this.result.ListMissions[0].StopDuration,
                    "SpeedAvg": this.result.ListMissions[0].AvgSpeed,
                    "isTotal": true
                }
                this.reportdata.push(totalData);
              }
            this.reportdata.map(e => {
                Object.assign(e, { AcquisitionTimeLocal: new Date(parseInt(e.StartDateLocal.substr(6))) });
            });
          

            this.datasource = new MatTableDataSource(this.reportdata);
            this.datasource.sort = this.sort;
            this.datasource.paginator = this.paginator;

        } catch (error) {
            this.loading = false;
            this.progressbarValue += this.progressValueInPercent;
            // Handle errors here
        }
    }
}

parseJsonDate(value: string) {
    return new Date(parseInt(value.substr(6)));
}
seceltor : any = 0 ;
getparams() {
  this._SharedreportdataService.fetchParams().subscribe(params => {
    this.car = params.param1;
    this.startdate = params.param2;
    this.enddate = params.param3;
    this.typeParam = params.param5;
    this.report = params.param9;
    this.CarMatricule = params.param10;
    return true
    /*this.report = params.param9;

    this.CarMatricule = params.param10;*/
  });
}

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  exportpdf() { }
  exportexcel() { }
  downloadExcel()
  {this.loading = true;
    const exported = {
      "SubGeneralReports": this.exportedData,
      "StartDateLocal": this.startdate,
      "EndDateLocal": this.enddate,
    }
    let exportCrypted = crypt(this.exportedData) ;
    this._ReportService.ExportReport(exportCrypted,"excel",9).subscribe((data:any) => {
      this.loading = false;
      let fileData64String= decrypt(data.ExportReportNewResult) ;//.ExportReportNewResult
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "MissionReport"
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
      this.loading = false;
    });
  }
  downloadPdf()
  {this.loading = true;
    const exported = {
      "SubGeneralReports": this.exportedData,
      "StartDateLocal": this.startdate,
      "EndDateLocal": this.enddate,
    }
    let exportCrypted = crypt(this.exportedData) ;
    this._ReportService.ExportReport(exportCrypted,"pdf",9).subscribe((data:any) => {
      this.loading = false;
      let fileData64String= decrypt(data.ExportReportNewResult) ;//.ExportReportNewResult
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/pdf" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "MissionReport"
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
      //this.errorHandler.handleError(error);.handleError(err);
      this.loading = false;
    });
  }
 

}

