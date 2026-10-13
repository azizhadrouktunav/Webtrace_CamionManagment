export class FuellevelData {
  date: string;
  FuelLevel: number;
}
export class FuellevelDataSource {
  date: Date;
  FuelLevel: number;
  matricule : string;
}
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { decrypt,crypt } from 'app/main/parc/Parc';
import { Subscription, Subject } from 'rxjs';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../services/report.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-fuelreportresult',
  templateUrl: './fuelreportresult.component.html',
  styleUrls: ['./fuelreportresult.component.scss']
})
export class FuelreportresultComponent implements OnInit,OnDestroy {
  dataSource: FuellevelData[];
 

  wwdcDate ;

  tvAnnounceDate = new Date(2023, 1, 18);

  watchReleaseDate = new Date(2023, 1, 17,0,0,0);

  xReleaseDate = new Date(2023, 1, 16);

  seReleaseDate = new Date(2023, 1, 15);
  FuelData: FuellevelData[] = [];
  dataAllFuel: FuellevelDataSource[]=[];
  dataSource1: any;
  Remplissage: string;
  ListRemplisage: any;
  ListDelivery: any;
  Date: Date;
  maxY= 0;
  x: number;
  minY: number;
  chartReady: boolean = false;
   dataRefueling:any[]=[];
   datadelivery:any[]=[];
   refueligDeliveyData : FuelDataObject[] = [];

  customizeTooltip(e) {
    return {
      html: `<div class='tooltip'>${e.description}</div>`,
    };
  }
  
  cars: any[];
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
  progressbarValue=0;

  SubMonthlyReports: any;
  monthlyReportItems: any;
  datasource: MatTableDataSource<unknown>;
  datasourceDelivery:MatTableDataSource<unknown>;
  //datasourceDelivery:any;
  displayedColumns: string[] = ['CarMatricule','BeginDateLocalString', 'NearestPlaceString', 'Mileage', 'FilledQuantityString', 'FuelLevel','PriceOfFilledQuantityString'];
  displayedColumnsDelivery: string[] = ['CarMatricule','BeginDateLocalString', 'NearestPlaceString', 'Mileage', 'QuantityComing','FilledQuantityString','QuantityRes', 'PriceOfFilledQuantityString'];
  //@ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
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
  exportedData: any = [];
  public loading = false;
  colorScheme2 = {
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56']
  };
  cardColor: string = '#ffffff';
  subscription: Subscription;
  data: any;
  show:boolean=true;
  constructor(private _SharedreportdataService: SharedreportdataService,  
              private _ReportService: ReportService,
              private _errorHandler: ErrorHandlerService,
              private translateService: TranslateService,
              ) {
                this.dataSource = this.FuelData;
                

               }
              
  async ngOnInit() {
  this.loading = true;
    await this.getparams();
    let datachar: Array<any> = [];
    let datachar2: Array<any> = [];

    {
      
      this.translateService.get([ 'NAV.RealAvgFuelConsumption', 'NAV.RealSumFuelConsumption',
    'NAV.TraveledDistance'])
    .subscribe(data => { this.data = data });
      if(this.cars != null){
        if (this.cars.length == 1) {
          this.subscription = this._ReportService.getFuelTimeReport(this.cars[0], this.startdate,
            this.enddate, this.fuel, this.speed).subscribe((result) => {
              this.loading = false;
              this.FuelReportResult=result;
              this.result = decrypt(result);
              let r: Array<any> = [];
              let r1: Array<any> = [];
              let r2: Array<any> = [];
  
              this.result["AllExtendedGpsData"].forEach(elt => {
  
               
                if(elt["FuelLevel"] >5 && elt["Speed"] >5)
                   r.push({ 'name': elt["BeginDateLocalString"], 'value': elt["FuelLevel"] });
                   //r1.push({ 'name':elt["BeginDateLocalString"],'value':   elt["FilledQuantity"]});
                   r2.push({ 'name':elt["BeginDateLocalString"],'value':   elt["AdBlueLevel"]});
                 if(elt["FuelLevel"] >5 && elt["Speed"] >5)
                     this.FuelData.push({date : this.formatDate(elt["BeginDateLocalString"]), FuelLevel :elt["FuelLevel"] })
  
              });
              this.ListRemplisage = this.result["AllRefuelingExtendedGpsData"];
              this.ListRemplisage.forEach(elt => {
  
                const [day, month, year] = elt["BeginDateLocalString"].split('/');
                const [yeard, time] = year.split(' ');
                const [h, m,s] = time.split(':');
                
                this.Date = new Date(year.substring(0,4),month-1,day, h,m,s);
                this.Remplissage = "Quantité Remplie: " +  elt["FilledQuantityString"] + "  Emplacement: "  +  elt["NearestPlaceString"];
                Object.assign(elt, { Time: this.Date});
                Object.assign(elt, { Remplissage: this.Remplissage});
             
              });
              this.dataSource = this.FuelData;
              datachar.push({ 'name': "Niveau de carburant ", 'series': r });
             // datachar.push({ 'name': "Remplissage de carburant", 'series': r1 });
              datachar.push({ 'name': "Niveau AdBlue", 'series': r2 });
  
              datachar2.push({ 'name': this.data["NAV.RealAvgFuelConsumption"], 'value': this.result["FuelRealConsumptionAvgString"] });
              datachar2.push({ 'name': this.data["NAV.RealSumFuelConsumption"], 'value': this.result["FuelRealConsumptionSumString"] });
              datachar2.push({ 'name': this.data["NAV.TraveledDistance"], 'value': this.result["Distance"] });
  
  
              this.single = [...datachar];
              this.single2 = [...datachar2];
              let allExtendedGpsData = this.result["AllRefuelingExtendedGpsData"];
              
              let DeliveryFuel =this.result["AllDeliveryExtendedGpsData"];
              if(DeliveryFuel && DeliveryFuel.length >0)
                 this.show=true;
                else
                this.show=false;

              allExtendedGpsData.forEach(element => {
                element["CarMatricule"] = this.result["Matricule"];
                element["isTotal"] = false;
              });
              DeliveryFuel.forEach(element => {
                element["Matricule"] = this.result["Matricule"];
                element["isTotal"] = false;
              });
                  this.datasource = new MatTableDataSource(allExtendedGpsData);
  
                  this.datasource.paginator = this.paginator.toArray()[0];
                  this.datasourceDelivery = new MatTableDataSource(DeliveryFuel);
  
                  this.datasourceDelivery.paginator = this.paginator.toArray()[1];
                
              this.chartReady = true;
  
              this.exportedData = allExtendedGpsData;
          },
            (err: HttpErrorResponse) => {
              this.loading = false;
                //this.errorHandler.handleError(error);.handleError(err);
            });
  
  
          }
          else{
            // for every car we will call the api using for loop and await for the result
            let data = null;
            let allExtendedGpsDataRows = [];
            let allDatadelivery=[];
           let Matricule ="";
           let FuelRealConsumptionAvgString="";
           let FuelRealConsumptionSumString="";
           let TotalFilledQuantityString="";
           let TotalPriceOfFilledQuantityInLString="";
           let EndDateLocal="";
           let StartDateLocal="";
           let DataChart: Array<any> = [];
           
            for (let i = 0; i < this.cars.length; i++) {
              data = await this._ReportService.getFuelTimeReport(this.cars[i], this.startdate,this.enddate, this.fuel, this.speed).toPromise();
              this.loading = false;
              //this.FuelReportResult=result;
              this.dataRefueling=[];
              this.datadelivery=[];
             
              if(data != null && data != undefined){
                this.result = decrypt(data);
                let res= decrypt(data);
               /*  this.result["AllExtendedGpsData"].forEach(elt => {
                  DataChart.push({ this.result["Matricule"]: this.data["NAV.RealAvgFuelConsumption"], 'value': this.result["FuelRealConsumptionAvgString"] });
                }) */
               
                let allExtendedGpsData = this.result["AllRefuelingExtendedGpsData"];
                this.result["AllExtendedGpsData"].forEach(elt => {
  
            
                   if(elt["FuelLevel"] >5 && elt["Speed"] >5)
                   {
                    let date: Date =new Date(this.formatDate(elt["BeginDateLocalString"]));
                   
                   // let test =this.formatDate(elt["BeginDateLocalString"]);
                       this.dataAllFuel.push({date : new Date(date.getFullYear(),date.getMonth(),date.getDay(),date.getHours(),date.getMinutes(),0), FuelLevel :elt["FuelLevel"],matricule: this.result["Matricule"] })
                   }
                });
                let DeliveryData = this.result["AllDeliveryExtendedGpsData"];
                let newData =[];
                newData.push(res["AllRefuelingExtendedGpsData"]);
                
                newData.forEach(data=>{
                  data.forEach(row=>{
                    row["Matricule"]= res["Matricule"];
                    row["FuelTheoreticalConsumptionAvgString"] =res["FuelTheoreticalConsumptionAvgString"];
                    row["FuelRealConsumptionAvgString"]=res["FuelRealConsumptionAvgString"];
                    row["FuelRealConsumptionSumString"]=res["FuelRealConsumptionSumString"];
                   row["StartDateLocal"]=res["StartDateLocal"];
                    row["EndDateLocal"]=res["EndDateLocal"];
                  })
                  this.dataRefueling.push(...data);
          
                })
                let newdataDel=[];
                newdataDel.push(res["AllDeliveryExtendedGpsData"]);

                newdataDel.forEach(data=>{
                  data.forEach(row=>{
                    row["Matricule"]= res["Matricule"];
                    row["FuelTheoreticalConsumptionAvgString"] =res["FuelTheoreticalConsumptionAvgString"];
                    row["FuelRealConsumptionAvgString"]=res["FuelRealConsumptionAvgString"];
                    row["FuelRealConsumptionSumString"]=res["FuelRealConsumptionSumString"];
                   row["StartDateLocal"]=res["StartDateLocal"];
                    row["EndDateLocal"]=res["EndDateLocal"];
                  })
                  this.datadelivery.push(...data);
          
                })
                //this.datadelivery=DeliveryData;
                
               
                let total = 0;
                
                // pushing car matricule into allExtendedGpsData elements
                allExtendedGpsData.forEach(element => {
                  element["CarMatricule"] = this.result["Matricule"];
                  element["isTotal"] = false;
                  total += +element["FilledQuantity"];
                });
             
                // pushing total into allExtendedGpsData elements
                allExtendedGpsData.push({
                  BeginDateLocalString: "--",
                  CarMatricule: this.result["Matricule"],
                  NearestPlaceString: "--",
                  Mileage: "--",
                  FilledQuantity: total,
                  FilledQuantityString: total.toFixed(2).toString() ,
                  PriceOfFilledQuantityString: (total * this.speed).toFixed(2).toString() +  " Dt" ,
                  isTotal: true
                });
                // pushing allExtendedGpsData into allExtendedGpsDataRows
                allExtendedGpsDataRows.push(...allExtendedGpsData);
                allDatadelivery.push(...this.datadelivery);
              /*  allDatadelivery.forEach(element => {
                  element["CarMatricule"] = this.result["Matricule"];
                  element["isTotal"] = false;
                  total += +element["FilledQuantity"];
                });*/
                this.progressbarValue = (((i +1) * 100) / this.cars.length);
                if(this.progressbarValue == 100)
                  allExtendedGpsDataRows.push(this.getLastraw(allExtendedGpsDataRows));
                this.datasource = new MatTableDataSource(allExtendedGpsDataRows);
    
                this.datasource.paginator = this.paginator.toArray()[0];
                this.exportedData = allExtendedGpsDataRows;
                this.datasourceDelivery= new  MatTableDataSource(allDatadelivery);
                this.datasourceDelivery.paginator = this.paginator.toArray()[1];
                Matricule=  this.result["Matricule"];
                FuelRealConsumptionAvgString=this.result["FuelRealConsumptionAvgString"];
                FuelRealConsumptionSumString=this.result["FuelRealConsumptionSumString"];
                TotalFilledQuantityString= this.result["TotalFilledQuantityString"];
                TotalPriceOfFilledQuantityInLString=this.result["TotalPriceOfFilledQuantityInLString"];
                EndDateLocal=this.result["EndDateLocal"];
                StartDateLocal=this.result["StartDateLocal"];
                this.refueligDeliveyData.push(({Matricule:Matricule,FuelRealConsumptionAvgString:FuelRealConsumptionAvgString,FuelRealConsumptionSumString:FuelRealConsumptionSumString,AllRefuelingExtendedGpsData:this.dataRefueling,AllDeliveryExtendedGpsData:this.datadelivery,enddate:this.enddate,Begindate:this.startdate,TotalFilledQuantityString:TotalFilledQuantityString,TotalPriceOfFilledQuantityInLString:TotalPriceOfFilledQuantityInLString,StartDateLocal:StartDateLocal,EndDateLocal:EndDateLocal}));
              }
              else{
                this.progressbarValue = (((i +1) * 100) / this.cars.length);
                if(this.progressbarValue == 100)
                  allExtendedGpsDataRows.push(this.getLastraw(allExtendedGpsDataRows));
                this.datasource = new MatTableDataSource(allExtendedGpsDataRows);
                this.datasource.paginator = this.paginator.toArray()[0];
                this.datasourceDelivery= new  MatTableDataSource(allDatadelivery);
                this.datasourceDelivery.paginator = this.paginator.toArray()[1];
              }
              
              
            }
           let group=_.mapValues(_.groupBy(this.dataAllFuel,'date'),x=>x.map(data=>_.omit(data,'date')))  ;
          console.log(group);
           if(allDatadelivery.length>0)
             this.show=true;
            else
            this.show=false;
          }
          
      }
      


    }

   
    
  }

  getLastraw(allExtendedGpsDataRows){
    let total = 0;
    // get every row with isTotal = true and get it FilledQuantityString to calculate the total
    let lastRow = allExtendedGpsDataRows.filter(row => row.isTotal == true);
    lastRow.forEach(element => {
      total += +element["FilledQuantity"];
    });

    return {
      BeginDateLocalString: "--",
      CarMatricule: "Totale: ",
      NearestPlaceString: "--",
      Mileage: "--",
      FilledQuantity: total,
      FilledQuantityString: total.toFixed(2).toString() + " L",
      PriceOfFilledQuantityString: (total * this.speed).toFixed(2).toString() +  " Dt" ,
      isTotal: true
    }
  }

   formatDate(date) {
    const [day, month, year] = date.split('/');

     const result = [year.substring(0, 4), month, day].join('-') + " ";
     const time = year.substring(5, 13);
     return result + time;
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();

  }
  getparams()
  {
    this._SharedreportdataService.fetchParams().subscribe(params => {
    this.cars =  params.param1 ;
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
 exportpdf() {
    var prepare = [];
    /*this.result["AllRefuelingExtendedGpsData"].forEach(e => {
      var tempObj = [];
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Mileage);
      tempObj.push(e.FilledQuantityString);
      tempObj.push(e.PriceOfFilledQuantityString);

      prepare.push(tempObj);
    });*/
    
    this.exportedData.forEach(e => {
      console.log(e);
      var tempObj = [];

      tempObj.push(e.CarMatricule);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Mileage);
      tempObj.push(e.FilledQuantityString);
      tempObj.push(e.PriceOfFilledQuantityString);
      
      prepare.push(tempObj);
    });
    
    const doc = new jsPDF();
    
    doc.text('Données de remplissage de carburant', 50, 16); //default

    doc.autoTable({
      head: [['Matricule', "Temps d'acquisition", 'Lieu le plus proche', 'Kilométrage', 'Quantité remplie', 'Prix de la quantité remplie']],
      body: prepare,
      startY: 20,
      styles: { font: 'Amiri'} // Add this line
    });

    doc.save('Fuelfilling_data' + '.pdf');
  }
  downloadExcel()
  {
    this.loading = true;
    if(this.cars.length >1)
    {
      let CompressedData =crypt( this.refueligDeliveyData);
      
      this._ReportService.ExportReport(CompressedData,"excel",14).subscribe((data:any) => {
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
        titleReport = "FuelReport"
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
           //this.errorHandler.handleError(error);.handleError(err);
      });

    }
    else
    {
    this._ReportService.ExportReport(this.FuelReportResult,"excel",6).subscribe((data:any) => {
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
      titleReport = "FuelReport"
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
         //this.errorHandler.handleError(error);.handleError(err);
    });
  }
  }
  downloadPdf()
  {
    this.loading = true;
    if(this.cars.length >1)
    {
    
      let CompressedData =crypt( this.refueligDeliveyData);
      this._ReportService.ExportReport(CompressedData,"pdf",14).subscribe((data:any) => {
        this.loading = false;
        let fileData64String= decrypt(data.ExportReportNewResult) ;
        //ExportReportNewResult
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
    else
    {
   
    this._ReportService.ExportReport(this.FuelReportResult,"pdf",6).subscribe((data:any) => {
      this.loading = false;
      let fileData64String= decrypt(data.ExportReportNewResult) ;
      //ExportReportNewResult
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
  }
  exportexcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('Marticule');
    tem.push("Temps d'acquisition");
    tem.push('Lieu le plus proche');
    tem.push('Kilométrage');
    tem.push('Quantité remplie');
    tem.push('Prix de la quantité remplie');

    prepare_to_excel.push(tem);
    
    this.exportedData.forEach(e => {
var tempObj = [];
      tempObj.push(e.CarMatricule);
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
export class FuelDataObject
{
  AllRefuelingExtendedGpsData :any[];
  AllDeliveryExtendedGpsData:any[];
  Matricule:string;
  FuelRealConsumptionAvgString:string;
  FuelRealConsumptionSumString:string;
  Begindate:Date;
  enddate:Date;
  TotalFilledQuantityString: string;
TotalPriceOfFilledQuantityInLString:string;
EndDateLocal:string;
StartDateLocal:string;

}

