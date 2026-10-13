import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { TankreportserviceService } from './tankreportservice.service';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-tankreportresult',
  templateUrl: './tankreportresult.component.html',
  styleUrls: ['./tankreportresult.component.scss']
})
export class TankreportresultComponent implements OnInit {

  car: any;
  startdate: any;
  emplacement: any;
  result: any;
  single: any[];
  FuelReportResult:any;
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
  displayedColumns: string[] = ['BeginDateLocalString', 'NearestPlaceString', 'Mileage', 'FilledQuantityString', 'PriceOfFilledQuantityString'];
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  CarMatricule: any;
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
  constructor(private _SharedreportdataService: SharedreportdataService,  
              private _TankreportserviceService: TankreportserviceService,
              private _errorHandler: ErrorHandlerService,
              private translateService: TranslateService,
              private datePipe: DatePipe
              ) { }

  async ngOnInit() {
  this.loading = true;
    await this.getparams();
      
    let datachar: Array<any> = [];
    let datachar2: Array<any> = [];


    {
      
      this.translateService.get([ 'NAV.RealAvgFuelConsumption', 'NAV.RealSumFuelConsumption',
    'NAV.TraveledDistance'])
    .subscribe(data => { this.data = data });
    this._TankreportserviceService.getFuelTimeTank(this.car,this.startdate, this.enddate , 20,1)
    .pipe(takeUntil(this.destroy))
    .subscribe(gpsData => {
      this.loading = false;
      this.FuelReportResult=gpsData;
      this.gpsData = decrypt(gpsData);
      
       // this.histories =Object.assign([], this.gpsData).filter(gpsdata => gpsdata.FuelLevel != "NaN" && gpsdata.FuelLevel != "-32768" );
   
        let r: Array<any> = [];
        let r1: Array<any> = [];
        
         this.gpsData["AllExtendedGpsData"].forEach(elt => {
          
             r.push({ 'name':  this.datePipe.transform(new Date(parseInt(elt["BeginDateLocal"].substr(6))), 'yyyy-MM-dd HH:mm:ss') , 'value': elt["FuelLevel"] });
             r1.push({ 'name': this.datePipe.transform(new Date(parseInt(elt["BeginDateLocal"].substr(6))), 'yyyy-MM-dd HH:mm:ss') , 'value': elt["Temperature"] });
        });
        datachar.push({ 'name': "FuelLevel", 'series': r });
        datachar.push({ 'name': "Temperature", 'series': r1 });

        this.single = [...datachar];
        datachar2.push({ 'name': this.data["NAV.RealAvgFuelConsumption"], 'value': this.gpsData["FuelRealConsumptionAvgString"] });
            datachar2.push({ 'name': this.data["NAV.RealSumFuelConsumption"], 'value': this.gpsData["FuelRealConsumptionSumString"] });
            datachar2.push({ 'name': this.data["NAV.TraveledDistance"], 'value': this.gpsData["Distance"] });
             this.single2 = [...datachar2];
              this.datasource = new MatTableDataSource(this.gpsData["AllRefuelingExtendedGpsData"]);

                this.datasource.paginator = this.paginator;

      });
     /*    this.subscription = this._TankreportserviceService.getHistoryByDate().subscribe((result) => {
            this.loading = false;
            this.result = decrypt(result);
            let r: Array<any> = [];
            let r1: Array<any> = [];
            
            this.result["AllExtendedGpsData"].forEach(elt => {
             // if(elt["FuelLevel"] >5 && elt["Speed"] >5)
                 r.push({ 'name': elt["BeginDateLocalString"], 'value': elt["FuelLevel"] });
            });
            datachar.push({ 'name': "FuelLevel", 'series': r });
            datachar2.push({ 'name': this.data["NAV.RealAvgFuelConsumption"], 'value': this.result["FuelRealConsumptionAvgString"] });
            datachar2.push({ 'name': this.data["NAV.RealSumFuelConsumption"], 'value': this.result["FuelRealConsumptionSumString"] });
            datachar2.push({ 'name': this.data["NAV.TraveledDistance"], 'value': this.result["Distance"] });


            this.single = [...datachar];
            this.single2 = [...datachar2];
            

                this.datasource = new MatTableDataSource(this.result["AllRefuelingExtendedGpsData"]);

                this.datasource.paginator = this.paginator;
              



        },
          (err: HttpErrorResponse) => {
            this.loading = false;
              //this.errorHandler.handleError(error);.handleError(err);
          }); */





    }

   
    
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();

  }
  getparams()
  {
    this._SharedreportdataService.fetchParams().subscribe(params => {
    this.car =  params.param1 ;
    this.startdate = params.param2;
    this.enddate = params.param3;
    this.emplacement = params.param4 ;
    this.fuel =  params.param5 ;
    this.speed = params.param6;
    this.rpm = params.param7;
    this.stop = params.param8 ;
    this.report = params.param9 ;
    this.CarMatricule = params.param10 ;
    });

    
  }
    downloadPdf()
  {
    this.loading = true;
    this._TankreportserviceService.ExportReport(this.FuelReportResult,"pdf",6).subscribe((data:any) => {
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
      titleReport = "FuelReport"
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
 exportpdf() {
    var prepare = [];
    this.result["AllRefuelingExtendedGpsData"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Mileage);
      tempObj.push(e.FilledQuantityString);
      tempObj.push(e.PriceOfFilledQuantityString);

      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Fuel Filling data', 78, 16); //default

    doc.autoTable({
      head: [['Acquisition Time', 'NearestPlace', 'Mileage', 'FilledQuantity', 'PriceOfFilledQuantity']],
      body: prepare,
      startY: 20

    });
    doc.save('Fuelfilling_data' + '.pdf');
  }
 
  exportexcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('Acquisition Time');
    tem.push('NearestPlace');
    tem.push('Mileage');
    tem.push("FilledQuantity");
    tem.push('PriceOfFilledQuantity');

    prepare_to_excel.push(tem);
    this.result["AllRefuelingExtendedGpsData"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Mileage);
      tempObj.push(e.FilledQuantityString);
      tempObj.push(e.PriceOfFilledQuantityString);

      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Fuelfilling_data.xls', { bookType: 'xls', type: 'buffer' });
  }
}


