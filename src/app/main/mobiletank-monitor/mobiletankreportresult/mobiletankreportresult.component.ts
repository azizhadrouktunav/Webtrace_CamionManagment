export class dataMobileTanks
{
  date :string ;
  fuelLevel : number;
  temperature: number;
}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { decrypt } from 'app/main/parc/Parc';
import { SharedreportdataService } from 'app/main/reports/services/sharedreportdata.service';
import { Subject, Subscription } from 'rxjs';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MobiletankService } from '../mobiletank.service';
@Component({
  selector: 'app-mobiletankreportresult',
  templateUrl: './mobiletankreportresult.component.html',
  styleUrls: ['./mobiletankreportresult.component.scss']
})
export class MobiletankreportresultComponent implements OnInit {

  IdTank: any;
  startdate: any;
  emplacement: any;
  result: any;
  single: any[];
  FuelReportResult: any;
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
    domain: ['#2b5cc4', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  legend: boolean = true;
  legendPosition: string = 'below';

  destroy: Subject<boolean> = new Subject<boolean>();

  SubMonthlyReports: any;
  monthlyReportItems: any;
  datasource: any;
  displayedColumns: string[] = [ 'BeginDateLocalString', 'QuatityRefulingPer', 'QuatityRefulingLitre', 'VolumeSonde'];
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  NameTank: any;
  KeyTrackingObject: any;
  docDefinition: any;
  enddate: any;
  fuel: any;
  speed: any;
  rpm: any;
  stop: any;
  report: any;
  single2: any[];
  view2: any[] = [300, 400];
  customLoadingTemplate: any;

  public loading = false;
  colorScheme2 = {
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56']
  };
  cardColor: string = '#ffffff';
  subscription: Subscription;
  data: any;
  gpsData: any;
  histories: any;
  sonde1: any;
  SNSonde1: any;
  StatusConnectedSonde1 = false;
 
  tanks: any;
  dataMobileTank : dataMobileTanks[]=[];
  dataSource: dataMobileTanks[];
  datasourceRefuling: MatTableDataSource<unknown>;
  ListRemplisage: any;
  customizeTooltip(e) {
    return {
      html: `<div class='tooltip'>${e.description}</div>`,
    };
  }
  constructor(private _SharedreportdataService: SharedreportdataService,
    private _tanksService: MobiletankService,
    private _errorHandler: ErrorHandlerService,
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.getparams();

    let datachar: Array<any> = [];
  


    {

      this.translateService.get(['NAV.RealAvgFuelConsumption', 'NAV.RealSumFuelConsumption',
        'NAV.TraveledDistance'])
        .subscribe(data => { this.data = data });
        this._tanksService.getmobileTanks()
        .subscribe(data => {
        this.tanks = data;
        });
      this._tanksService.GetDataOfMobileTank(this.IdTank, this.startdate, this.enddate)
        .pipe(takeUntil(this.destroy))
        .subscribe(gpsData => {
          this.loading = false;
          this.FuelReportResult = gpsData;
          this.gpsData = decrypt(gpsData);
          this.gpsData["AllDataMobileTank"].forEach(elt=>{
            this.dataMobileTank.push({date:this.datePipe.transform(new Date(parseInt(elt["BeginDateLocal"].substr(6))), 'yyyy-MM-dd HH:mm:ss'),fuelLevel:elt.VolumeSonde,temperature:elt.TemperatureSonde});
          })
          this.dataSource=this.dataMobileTank;
          let ListRefuling = this.gpsData["AllRefulingMobileTank"];
        //  this.datasourceRefuling= ListRefuling;
          this.datasourceRefuling = new MatTableDataSource(ListRefuling);
  
          this.datasourceRefuling.paginator = this.paginator;


          this.ListRemplisage = this.gpsData["AllRefulingMobileTank"];
          this.ListRemplisage.forEach(elt => {

            const [day, month, year] = elt["BeginDateLocalString"].split('/');
            const [yeard, time] = year.split(' ');
            const [h, m,s] = time.split(':');
            
          //   let Date = new Date(parseInt(elt["BeginDateLocal"].substr(6)
             // Date = new Date(year.substring(0,4),month-1,day, h,m,s);
            let Remplissage = "Quantité Remplie " +  elt["QuatityRefulingLitre"]+" L";
            Object.assign(elt, { Time: new Date(parseInt(elt["BeginDateLocal"].substr(6)))});
            Object.assign(elt, { Remplissage: Remplissage});
         
          });
          //this.sonde1 = Object.assign([], this.gpsData["AllDataMobileTank"]).filter(gpsdata => gpsdata.VolumeSonde1 != 0 && gpsdata.TemperatureSonde1 != 0);

        /*  if (this.sonde1.length != 0) {
            if( this.tanks.findIndex(x=> x.SNSonde == this.sonde1[this.sonde1.length -1].SNSonde) >-1)
            {
                 this.SNSonde1 =  this.tanks.find(x=> x.SNSonde == this.sonde1[this.sonde1.length -1].SNSonde).Name;
            }
            else
            this.SNSonde1="";
          
            this.StatusConnectedSonde1 = this.sonde1[this.sonde1.length -1].StatusConnectedSonde;

            
          }*/
         
         /*  let r: Array<any> = [];
          let r1: Array<any> = [];

          this.sonde1.forEach(elt => {

            r.push({ 'name': this.datePipe.transform(new Date(parseInt(elt["BeginDateLocal"].substr(6))), 'yyyy-MM-dd HH:mm:ss'), 'value': elt["VolumeSonde"] });
            r1.push({ 'name': this.datePipe.transform(new Date(parseInt(elt["BeginDateLocal"].substr(6))), 'yyyy-MM-dd HH:mm:ss'), 'value': elt["TemperatureSonde"] });
          });
          datachar.push({ 'name': "Volume", 'series': r });
          datachar.push({ 'name': "Temperature", 'series': r1 });

          this.single = [...datachar]; */


        });



    }



  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();

  }
  getparams() {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.IdTank = params.param1;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.KeyTrackingObject= params.param4;
      this.NameTank = params.param10;
    });


  }
  downloadPdf()
  {
    this.loading = true;
    this._tanksService.ExportReport(this.FuelReportResult,"pdf",16).subscribe((data:any) => {
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
      titleReport = "FuelTankReport"
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
    this.loading = true;
    this._tanksService.ExportReport(this.FuelReportResult,"excel",16).subscribe((data:any) => {
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
      titleReport = "FuelTankReport"
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

}


