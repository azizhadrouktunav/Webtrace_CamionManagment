import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import { decrypt } from 'app/main/parc/Parc';
import { GPSData } from '../../Interfaces/generalreportGPSData';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-enginereportresult',
  templateUrl: './enginereportresult.component.html',
  styleUrls: ['./enginereportresult.component.scss']
})
export class EnginereportresultComponent implements OnInit,OnDestroy {

  car: any;
  startdate: any;
  emplacement: any;
  result: any;
  single: any[];
  StateEnginReport:any;
  StopPeriod:any;
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
  isLegend = (event) => typeof event === 'string';

  public colorScheme = {
    domain: ['#3921b3', '#3a32bf', '#5073d9' ,'#58a1d9']
  };
  single2: any[];
  legend: boolean = true;
  legendPosition: string = 'below';
  displayedColumns: string[] = ['FromLocalTimeString', 'PeriodString', 'NearestPlace'];
  displayedColumns1: string[] = ['AcquisitionTime', 'Speed', 'NearestPlaceString'];
  displayedColumns2: string[] = ['State', 'AcquisitionTime', 'Speed', 'NearestPlaceString'];


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
  view2: any[] = [300, 400];
  public loading = false;
  destroy: Subject<boolean> = new Subject<boolean>();

  colorScheme2 = {
    domain: ['#2b5cc4', '#81ccff', '#edc617']
  };
  cardColor: string = '#ffffff';
  EngineOnInStop: any =[];
  EngineOnInStopMorethan0: any=[];
  SubStateEngineReports:any=[];
  subscription: Subscription;
  data: any;
  customLoadingTemplate: any;
  AllExtendedGpsData: any;
  EngineHour: number;
  EngineOnInStopStates: any;
  constructor(private _SharedreportdataService: SharedreportdataService, 
    private _ReportService: ReportService,
    private translateService: TranslateService,
    private _errHandler: ErrorHandlerService
  )
  {
   
   }

  async ngOnInit() {
    this.loading = true;

    await this.getparams();
     
      let datachar: Array<any> = [];
      let datachar2: Array<any> = [];
     
      let test =this.StopPeriod;
      this.subscription = this._ReportService.GetStateEngineReport(this.car , this.startdate,
        this.enddate,this.emplacement,this.StopPeriod).subscribe((result) => {
          this.loading = false;
        this.StateEnginReport= result;
        this.result = decrypt(result);
        console.log(this.result);
        
        this.SubStateEngineReports = this.result["SubStateEngineReports"];
        this.AllExtendedGpsData = this.result["AllExtendedGpsData"];
        this.EngineOnInStopStates = this.result["EngineOnInStopState"];

        
        let r: Array<any> = [];
        let r1: Array<any> = [];
        let r2: Array<any> = [];

        this.translateService.get(['NAV.RPM','NAV.TraveledDistance','NAV.NbrThreesholdRpm',
        'NAV.EngineRun','NAV.EngineRunInStop'])
         .subscribe(data => {this.data = data}
              );
         if(this.AllExtendedGpsData.length>0)
         {
          this.AllExtendedGpsData.forEach(elt => {
            let datePipe2: DatePipe = new DatePipe('fr-FR')
            let date = new Date(parseInt((elt["AcquisitionTime"].toString()).substr(6)));

  
              let datestring= datePipe2.transform(date, 'dd/MM/yyyy h:mm:ss').toString();
            r.push({ 'name':datestring , 'value':  elt["RPM"]});
            r1.push({ 'name':datestring, 'value':  elt["EngineHours"]});
            r2.push({ 'name':datestring, 'value':  elt["EngineTemperature"]});

            
            });
            this.EngineHour = this.AllExtendedGpsData[this.AllExtendedGpsData.length-1].EngineHours - this.AllExtendedGpsData[0].EngineHours;
            datachar2.push({ 'name': this.data["NAV.EngineRun"], 'value':this.SubStateEngineReports[0]["TotalEngineRunPeriodString"] });
            datachar2.push({ 'name': 'Nombre des heures moteur', 'value':  this.EngineHour });
            datachar2.push({ 'name': this.data["NAV.EngineRunInStop"], 'value': this.SubStateEngineReports[0]["EngineOnInStopStateString"] });
         datachar2.push({ 'name': this.data["NAV.TraveledDistance"], 'value': this.SubStateEngineReports[0]["Distance"] });
         this.datasource = new MatTableDataSource(this.EngineOnInStopStates);
         this.datasource.paginator = this.paginator.toArray()[0];

         }     
       
         datachar.push({ 'name': this.data["NAV.RPM"], 'series': r });
         datachar.push({ 'name':  "Heures de moteur", 'series': r1 });
         datachar.push({ 'name':  "Temperature de moteur", 'series': r2 });

         
         this.single = [...datachar];
         Object.assign(this, {datachar  });
         this.multi=  this.single;
         this.initMulti = JSON.parse(JSON.stringify(this.multi));
         this.single2 = [...datachar2];
       
         this.datasource1 = new MatTableDataSource();
         this.datasource1.paginator = this.paginator.toArray()[1]; 
        
    },
    (err: HttpErrorResponse) => {
          this._errHandler.handleError(err);
          this.loading = false;

    });
  }
  multi: any[];
  initMulti = [];
  isDataShown = (event) => {
    const selectedBar = this.multi.find(model => {
     
        return model.name != event && model.series[0] !== undefined;
      
    });
    


    return  selectedBar && selectedBar.series.length >0  ;
  }
  onSelect (event) {
    if (this.isLegend(event)) {  
      if(this.multi.find(x=>x.name == event).series.length ==0)
      {
        this.multi=this.initMulti;
      }
      const tempData = JSON.parse(JSON.stringify(this.multi));

      if (this.isDataShown(event)) {
      
        tempData.forEach(country => {
          if (country.name != event) {
            country.series=[];
            return true;

          }
          
        });
       
      } else {
        const pieToAdd = this.initMulti.filter(pie => {
         
  
            return pie.name != event;
        });
        tempData.some(pie => {
            
         
  
            if (pie.name != event) {
                pie.series =  this.initMulti.find(x=>x.name=== pie.name).series;
                
            }
        });
        
      }     
      this.multi = tempData;
      this.single=tempData;
      } else {
        console.log('emit event and do something else')
        // this.selection.emit(event);
      }
    }
    setChartDataBackToInitData = (country, yearName, yearDefValue) => {
      const tempData = JSON.parse(JSON.stringify(this.multi));
      tempData.find(_country => _country.name === country).series.find(_year => _year.name === yearName).value = yearDefValue;
      this.multi = tempData;
      this.single=tempData;
    }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  getparams() {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.car =  params.param1.Key ;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4 ;
      //this.fuel =  params.param5 ;
      this.speed = params.param6;
      this.rpm = params.param7;
      this.stop = params.param8 ;
      this.report = params.param9 ;
      this.CarMatricule = params.param10 ;
      this.StopPeriod= params.param5 ;
    });
  }

  exportpdf() {
    var prepare = [];
    this.result["StateEngineItems"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.FromLocalTimeString);
      tempObj.push(e.PeriodString);
      tempObj.push(e.NearestPlace);

      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('State engine', 78, 16); //default

    doc.autoTable({
      head: [['AcquisitionTime', 'Period', 'NearestPlace']],
      body: prepare,
      startY: 20

    });
    doc.save('Stateengine' + '.pdf');
  }
  exportexcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('AcquisitionTime');
    tem.push('Period');
    tem.push('NearestPlace');

    prepare_to_excel.push(tem);
    this.result["StateEngineItems"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.FromLocalTimeString);
      tempObj.push(e.PeriodString);
      tempObj.push(e.NearestPlace);

      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Stateengine.xls', { bookType: 'xls', type: 'buffer' });
 }
 downloadExcel()
  {   this.loading = true;

    this._ReportService.ExportReport(this.StateEnginReport,"excel",8).subscribe((data:any) => {
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
      titleReport = "EnginReport"
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
        this._errHandler.handleError(err);
        this.loading = false;

    });
  }
  downloadPdf()
  {this.loading = true;
    this._ReportService.ExportReport(this.StateEnginReport,"pdf",8).subscribe((data:any) => {
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
      titleReport = "EnginReport"
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

      this._errHandler.handleError(err);
    });
  }

}
