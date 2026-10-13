import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { DataChart } from 'app/main/parc/interfaces/depenses-general';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
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
import { flatMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-speedreportresult',
  templateUrl: './speedreportresult.component.html',
  styleUrls: ['./speedreportresult.component.scss']
})
export class SpeedreportresultComponent implements OnInit,OnDestroy {

  car: any;
  startdate: any;
  emplacement: any;
  result: any;
  single: any[];
  customLoadingTemplate: any;
  public view: any[] = [850, 400];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel: "Years";
  public showYAxisLabel = true;
  public yAxisLabel: "Salary";
  public graphDataChart: any[];
  public colorScheme = {
    domain: ['#2b5cc4', '#edc617', '#ffed56']
  };
  single2: any[];
  single3: any[];

  view2: any[] = [400, 400];
  legend: boolean = true;
  legendPosition: string = 'below';
  displayedColumns: string[] = ['State', 'AcquisitionTime', 'Speed', 'Distance', 'NearestPlace', 'FuelLevel'];
  displayedColumns1: string[] = ['AcquisitionTime', 'Speed','Latitude' , 'Longitude', 'NearestPlaceString'];
  displayedColumns2: string[] = ['State', 'AcquisitionTime', 'Speed', 'NearestPlaceString'];
 
  colorScheme2 = {
    domain: ['#81ccff', '#2b5cc4']
  };
  SubMonthlyReports: any;
  monthlyReportItems: any;
  datasource: any;
  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
  enddate: any;
  fuel: any;
  speed: any;
  rpm: any;
  stop: any;
  report: any;
  gpsdata: any = [];
  datasource1: MatTableDataSource<unknown>;
  datasource2: MatTableDataSource<unknown>;
  CarMatricule: any;
  docDefinition: any;
  data: any;
  GeneralReportData : any;
  public loading = false;
  destroy: Subject<boolean> = new Subject<boolean>();

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

    let datachar: Array<any> = [];
    let datachar2: Array<any> = [];
    let datachar3: Array<any> = [];
    
    
    this._ReportService.GetSpeedData(this.car , this.startdate,
      this.enddate,this.emplacement, this.speed).pipe(takeUntil(this.destroy)).subscribe((result) => {
      
        this.loading = false;

      this.GeneralReportData= result;
      this.result = decrypt(result);
      if(this.result["SpeedTimeData"] != null)
      { this.result["SpeedTimeData"].forEach(elt => {
         this.gpsdata.push(new GPSData(elt,this.speed ));
        
       });
      }
      let r: Array<any> = [];
      let r1: Array<any> = [];
      this.translateService.get(['NAV.Speed'
      ,'NAV.SpeedThreshold' ])
       .subscribe(data => {this.data = data}
            );
      
      this.gpsdata.forEach(elt => {
      r.push({ 'name': elt["BeginDateLocalString"], 'value':  elt["Speed"]});
      r1.push({ 'name': elt["BeginDateLocalString"], 'value':  this.speed});
      });
       datachar.push({ 'name': this.data["NAV.Speed"], 'series': r });
       datachar.push({ 'name': this.data["NAV.SpeedThreshold"], 'series': r1 });

        datachar2.push({ 'name': "Average Speed", 'value': this.result["SpeedAvg"] });
        datachar3.push({ 'name': "Maximum Speed", 'value': this.result["SpeedMax"] });

       this.single = [...datachar];
       this.single2 = [...datachar2];
       this.single3 = [...datachar3];
       this.datasource = new MatTableDataSource(this.gpsdata);
       this.datasource.paginator = this.paginator.toArray()[0];
      
       this.datasource1 = new MatTableDataSource(this.result["OverSpeedExtendedGpsDataList"]);
       this.datasource1.paginator = this.paginator.toArray()[1]; 
       this.datasource2 = new MatTableDataSource(this.result["AlertOverSpeed"]);
       this.datasource2.paginator = this.paginator.toArray()[2]; 
  },
  err => {
    this.loading = false;

    console.log(err);
},
() => {
 
});
  
 
 
}
  getparams() {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.car = params.param1.Key;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4;
      this.fuel = params.param5;
      this.speed = params.param6;
      this.rpm = params.param7;
      this.stop = params.param8 ;
      this.report = params.param9 ;
      this.CarMatricule = params.param10 ;
 
});  }




 
  downloadExcel()
  {  this.loading = true;

    this._ReportService.ExportReport(this.GeneralReportData,"excel",4).subscribe((data:any) => {
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
      titleReport = "SpeedReport"
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
  
      console.log(err);
  },
    );
  }
  downloadPdf()
  {  this.loading = true;
    this._ReportService.ExportReport(this.GeneralReportData,"pdf",4).subscribe((data:any) => {
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
      titleReport = "SpeedReport"
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
     
    }, err => {
      this.loading = false;
  
      console.log(err);
  });
  }



  exportpdf() {
    var prepare = [];
    this.gpsdata.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.AcquisitionTime);
      tempObj.push(e.Speed);
      tempObj.push(e.CumulativeDistanceString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.FuelLevel);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Speed data', 78, 16); //default

    doc.autoTable({
      head: [['State', 'AcquisitionTime', 'Speed', 'Distance', 'NearestPlace', 'FuelLevel']],
      body: prepare,
      startY: 20

    });
    doc.save('Speeddata' + '.pdf');
  }
  exportexcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('State');
    tem.push('AcquisitionTime');
    tem.push('Speed');
    tem.push("Distance");
    tem.push('NearestPlace');
    tem.push("FuelLevel");

    prepare_to_excel.push(tem);
    this.gpsdata.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StopRunStatusEnumString);
      tempObj.push(e.AcquisitionTime);
      tempObj.push(e.Speed);
      tempObj.push(e.CumulativeDistanceString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.FuelLevel);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Speeddata.xls', { bookType: 'xls', type: 'buffer' });
  }
  exportpdf2() {
    var prepare = [];
    this.result["OverSpeedExtendedGpsDataList"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearestPlaceString);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Over Speed list', 78, 16); //default

    doc.autoTable({
      head: [['BeginDate', 'Speed', 'NearestPlace']],
      body: prepare,
      startY: 20

    });
    doc.save('Over_Speed_list' + '.pdf');
  }
  exportexcel2() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('BeginDate');
    tem.push('Speed');
    tem.push('NearestPlaceString');

    prepare_to_excel.push(tem);
    this.result["OverSpeedExtendedGpsDataList"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearestPlaceString);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Over_Speed_list.xls', { bookType: 'xls', type: 'buffer' });
  }
  exportpdf3() {
    var prepare = [];
    this.result["AlertOverSpeed"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearestPlaceString);

      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Alert Over Speed', 78, 16); //default

    doc.autoTable({
      head: [['BeginDate', 'Speed', 'NearestPlace']],
      body: prepare,
      startY: 20

    });
    doc.save('Alert_Over_Speed' + '.pdf');
  }
  exportexcel3() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('BeginDate');
    tem.push('Speed');
    tem.push('NearestPlaceString');


    prepare_to_excel.push(tem);
    this.result["AlertOverSpeed"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearestPlaceString);

    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Alert_Over_Speed.xls', { bookType: 'xls', type: 'buffer' });
  }
}
