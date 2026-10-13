import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import { json2array } from 'app/main/helpers/must-match.validator';
import { decrypt } from 'app/main/parc/Parc';
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



@Component({
  selector: 'app-statisticsinworktimeresult',
  templateUrl: './statisticsinworktimeresult.component.html',
  styleUrls: ['./statisticsinworktimeresult.component.scss']
})
export class StatisticsinworktimeresultComponent implements OnInit,OnDestroy {

  car: any;
  startdate: any[];
  enddate: any[];
  emplacement: any;
  EnabledDayOfWeekes: any;
  holidays: any;
  result: any;
 
  summaryreportdata =[];
  datasource: MatTableDataSource<unknown>;
 
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
  legendTitle: string = '';
  legendPosition: string = 'below';
  displayedColumns: string[] = ['TrakingObjName', 'TotalDistance', 'DistanceInWorkTime', 'DistanceOutOfWorkTime',
  'PercentageInWorkTime','PercentageOutOfWorkTime'];

  cardColor: string = '#ffffff';

  colorScheme = {
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56']
  };

  barChartData: DataChart[];
  public loading = false;
  CarMatricule: any;
  docDefinition: any;
  data: any;
  customLoadingTemplate:any;
  worktimefrom: any;
  worktimeto: any;
  StatisticsInWorkReportResult:any;
  destroy: Subject<boolean> = new Subject<boolean>();

  constructor(    private _SharedreportdataService: SharedreportdataService,  private _authenticateService: AuthenticateService,
    private _ReportService: ReportService,  
    private translateService: TranslateService,

    
    ) {  }
 

    async ngOnInit() {
      this.loading = true;
    await this.getparams();
    

      let dataDet : Array<DataChart>=[];
      
    let datachar: Array<any> = [];

     
        
            
      this._ReportService.getReportStatisticsInWork( this.car , this.startdate,
        this.enddate,this.emplacement, this.EnabledDayOfWeekes,this.worktimefrom,this.worktimeto,this.holidays
        ).subscribe((result) => {
          this.loading = false;
        this.StatisticsInWorkReportResult=result;
        
        this.result = decrypt(result);
        
        this.translateService.get(['NAV.TrackingObject','NAV.DistanceInWorkTime',
        'NAV.DistanceOutOfWorkTime','NAV.PercentageInWorkTime','NAV.PercentageOutOfWorkTime','NAV.Details' ])
         .subscribe(data => {this.data = data}
              );
        this.legendTitle  = this.data["NAV.Details"];
        this.xAxisLabel = this.data["NAV.TrackingObject"];
        if(this.result != null)
        {
          let DistanceInWorkTime=0;
          let DistanceOutOfWorkTime =0;
          let PercentageInWorkTime=0;
          let PercentageOutOfWorkTime=0;
          let totalDis=0;
          this.result.forEach(element => {
            DistanceInWorkTime +=element["DistanceInWorkTime"];
            DistanceOutOfWorkTime +=element["DistanceOutOfWorkTime"];
           // DistanceInWorkTime +=element["DistanceInWorkTime"];
            totalDis+=DistanceInWorkTime+DistanceOutOfWorkTime;
          //  PercentageInWorkTime +=element["PercentageInWorkTime"];
           // PercentageOutOfWorkTime +=element["PercentageOutOfWorkTime"];
          });
          datachar.push({ 'name': this.data["NAV.DistanceInWorkTime"] , 'value': DistanceInWorkTime });
          datachar.push({ 'name': this.data["NAV.DistanceOutOfWorkTime"] , 'value':DistanceOutOfWorkTime});
          datachar.push({ 'name':this.data["NAV.PercentageInWorkTime"] , 'value': (DistanceInWorkTime *100) /(DistanceInWorkTime +DistanceOutOfWorkTime)});
          datachar.push({ 'name': this.data["NAV.PercentageOutOfWorkTime"] , 'value': (DistanceOutOfWorkTime *100) /(DistanceInWorkTime +DistanceOutOfWorkTime) });


          this.single = [...datachar]; 
         
           //  this.summaryreportdatathis.result );
  
              
        }
        
    },
    err => {
      console.log(err);
      this.loading = false;
  },
  () => { this.datasource = new MatTableDataSource(this.result);

        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator; 
    
  });
    

    
   
 
 
 
  }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();

  }
  getparams() {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.car =  params.param1 ;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4 ;
      this.EnabledDayOfWeekes = params.param6;
      this.worktimefrom = params.param7;
      this.worktimeto = params.param8;
      this.holidays = params.param11;
      this.CarMatricule = params.param10 ;
 
});  
}
downloadExcel()
  {  this.loading = true;

    this._ReportService.ExportReport(this.StatisticsInWorkReportResult,"excel",11).subscribe((data:any) => {
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
      titleReport = "StatisticsInWorReport"
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
  downloadPdf()
  { this.loading = true;
    this._ReportService.ExportReport(this.StatisticsInWorkReportResult,"pdf",11).subscribe((data:any) => {
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
      titleReport = "StatisticsInWorReport"
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

    });
  }
  
  
  
  
  
    
exportpdf() {
  var prepare=[];
this.summaryreportdata.forEach(e=>{
  var tempObj =[];
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
    head: [['Matricule','Driver','AlertOverSpeedNumber','OverSpeedNumber','StopTime',
    'RunTime','Distance','NearestPlaceFirstRun','NearestPlaceLastStop',
    'NbrOverSpeedMoreThan3shold','EngineRunPeriod']],
    body: prepare,
    startY: 20

});
doc.save('Cars_Statistics_data' + '.pdf');
}
exportexcel(){
  var prepare_to_excel=[];
  let tem =[];
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
  this.summaryreportdata.forEach(e=>{
    var tempObj =[];
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
