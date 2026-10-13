import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { decrypt } from 'app/main/parc/Parc';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-passingknownplaceresult',
  templateUrl: './passingknownplaceresult.component.html',
  styleUrls: ['./passingknownplaceresult.component.scss']
})
export class PassingknownplaceresultComponent implements OnInit, OnDestroy {

  car: any[];
  startdate: any[];
  enddate: any[];
  emplacement: any;
  
  result: any;
 
  reportdata =[];
  datasource: MatTableDataSource<unknown>;
  customLoadingTemplate:any;
  Selected_emp:any;
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
  xAxisLabel: string = 'Cars';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Number';
  legendTitle: string = 'Details';
  displayedColumns: string[] = ['TarckingObjectName', 'DriverName', 'StandardPlaceReferenceName', 'NbrPassingKnownPlace'];
  PassagereportData : any;
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
  public loading = false;
  constructor(private _SharedreportdataService: SharedreportdataService,  
              private _ReportService: ReportService ) {  }
    getparams() {
      this._SharedreportdataService.fetchParams().subscribe(params => {
        this.car =  params.param1 ;
        this.startdate = params.param2;
        this.enddate = params.param3;
        this.emplacement = params.param4 ;
        this.emplacementlist = params.param5;
        this.passage = params.param6;
        this.rayon = params.param7;
   
  });  }
  async ngOnInit() {
        { this.loading = true;
          await this.getparams();
      //  this.car.forEach(elt => {

      this.subscription = this._ReportService.getPassagereport(this.car , this.startdate,
        this.enddate,this.emplacement, this.emplacementlist,this.passage , this.rayon
        ).subscribe((result) => {
        
          this.loading = false;

         this.PassagereportData = result;
        this.result = decrypt(result);
        

         
        if(this.result != null)

        {
          this.result.forEach(element => {
            
          
           //this.reportdata.push.apply(this.reportdata, (this.result["ListPassingKnownPlace"]));
           this.reportdata.push(...element["ListPassingKnownPlace"]);
          });
          }
        
      
    },
    err => {
      this.loading = false;
      console.log(err);
  },
  () => {
    this.datasource = new MatTableDataSource(this.reportdata);

    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator; 
   
       
  
  });
    

    
   
 // });
 
}
 

  }
  ngOnDestroy()
  {
    this.subscription.unsubscribe();

  }
  downloadExcel()
  { this.loading = true;
    this._ReportService.ExportReport(this.PassagereportData,"excel",5).subscribe((data:any) => {
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
      titleReport = "Passageparemplacements"
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
    this._ReportService.ExportReport(this.PassagereportData,"pdf",5).subscribe((data:any) => {
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
      titleReport = "Passageparemplacements"
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
  this.reportdata.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.TarckingObjectName);
    tempObj.push(e.DriverName);
    tempObj.push(e.StandardPlaceReferenceName);
    tempObj.push(e.NbrPassingKnownPlace);
   
    prepare.push(tempObj);
  });
  const doc = new jsPDF();
  doc.text('Passing known place Report', 78, 16); //default

  doc.autoTable({
      head: [['TarckingObjectName','DriverName','StandardPlaceReferenceName','NbrPassingKnownPlace']],
      body: prepare,
      startY: 20

  });
  doc.save('Passing_known_place_Report' + '.pdf');
  }
  exportexcel(){
    var prepare_to_excel=[];
    let tem =[];
    tem.push('TarckingObjectName');
    tem.push('DriverName');
    tem.push('StandardPlaceReferenceName');
    tem.push("NbrPassingKnownPlace");
    
    
    prepare_to_excel.push(tem);
    this.reportdata.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.TarckingObjectName);
      tempObj.push(e.DriverName);
      tempObj.push(e.StandardPlaceReferenceName);
      tempObj.push(e.NbrPassingKnownPlace);
      prepare_to_excel.push(tempObj);

     
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Passing_known_place_Report.xls', { bookType: 'xls', type: 'buffer' });
 }
  }
