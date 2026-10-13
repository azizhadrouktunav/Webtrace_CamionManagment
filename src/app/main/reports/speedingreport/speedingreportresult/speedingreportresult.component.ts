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
  selector: 'app-speedingreportresult',
  templateUrl: './speedingreportresult.component.html',
  styleUrls: ['./speedingreportresult.component.scss']
})

export class SpeedingreportresultComponent implements OnInit,OnDestroy {

  car: any;
  startdate: any;
  emplacement: any;
  customLoadingTemplate: any;
  public view: any[] = [850, 400];
  
  
  displayedColumns: string[] = ['TrackingObject', 'Driver', 'AcquisitionTime', 'Speed', 'NearAddress', 'Latitude' , 'Longitude'];
 
  
  datasource: any;
  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
  
  public loading = false;
  destroy: Subject<boolean> = new Subject<boolean>();
  speed: any;
  enddate: any;
  result: string;
  stop: any;
  report: any;
  fuel: any;
  rpm: any;
  ListOuverSpeed : Array<OuverSpped>=  [];

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

    this._ReportService.GetOuverSpeed(this.car , this.startdate,
      this.enddate,this.emplacement,this.fuel, this.speed,this.rpm ,
      this.stop,this.report).pipe(takeUntil(this.destroy)).subscribe((result) => {
      
        this.loading = false;
    
     let ListGeneralReport:any[] = decrypt(result);
     ListGeneralReport.forEach(element => {
       let OverSpeedExtendedGpsDataList :any[] =element["OverSpeedExtendedGpsDataList"];
       OverSpeedExtendedGpsDataList.forEach(row => {
         let rowouverSpeed : OuverSpped ={TrackingObject:element.Matricule,Driver:element.Driver,BeginDateLocalString:row.BeginDateLocalString,Speed: row.Speed,
          NearAddress:row.NearestPlaceString,Latitude:row.Latitude,Longitude:row.Longitude};
         
         this.ListOuverSpeed.push(rowouverSpeed);
        
       });
     });
    
      this.datasource = new MatTableDataSource(this.ListOuverSpeed);

      this.datasource.paginator = this.paginator.toArray()[0];


      
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
      this.car = params.param1;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4;
      this.speed = params.param6;
 
});  }




downloadExcel() {
    var prepare_to_excel = [];
    let tem = [];
    this.translateService.get(['NAV.TrackingObject','NAV.Driver','NAV.AcquisitionTime','NAV.Speed','NAV.NearAddress','NAV.Latitude','NAV.Longitude']).subscribe(translations  => {
      tem.push(translations['NAV.TrackingObject']);
      tem.push(translations['NAV.Driver']);
      tem.push(translations['NAV.AcquisitionTime']);
      tem.push(translations['NAV.Speed']);
      tem.push(translations['NAV.NearAddress']);
      tem.push(translations['NAV.Latitude']);
      tem.push(translations['NAV.Longitude']);
    
    });
    

    prepare_to_excel.push(tem);
    this.ListOuverSpeed.forEach(e => {
      var tempObj = [];
      tempObj.push(e.TrackingObject);
      tempObj.push(e.Driver);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearAddress);
      tempObj.push(e.Latitude);
      tempObj.push(e.Longitude);

      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Liste_excèsvitesse.xls', { bookType: 'xls', type: 'buffer' });
  }
  downloadPdf() {
    var prepare = [];
    this.ListOuverSpeed.forEach(e => {
      var tempObj = [];
     
      tempObj.push(e.TrackingObject);
      tempObj.push(e.Driver);
      tempObj.push(e.BeginDateLocalString);
      tempObj.push(e.Speed);
      tempObj.push(e.NearAddress);
      tempObj.push(e.Latitude);
      tempObj.push(e.Longitude);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des excès de vitesse', 78, 16); //default
    this.translateService.get(['NAV.TrackingObject','NAV.Driver','NAV.AcquisitionTime','NAV.Speed','NAV.NearAddress','NAV.Latitude','NAV.Longitude']).subscribe(translations  => {
      doc.autoTable({
        head: [[translations['NAV.TrackingObject'], translations['NAV.Driver'], translations['NAV.AcquisitionTime'], translations['NAV.Speed'],translations['NAV.NearAddress'],translations['NAV.Latitude'] , translations['NAV.Longitude']]],
        body: prepare,
        startY: 20
  
      });
     
    
    
    });
    
    doc.save('Liste_excèsvitesse' + '.pdf');
  } 
  
}
export interface OuverSpped
{
  TrackingObject:string,
  Driver:string,
  BeginDateLocalString:Date,
  Speed:number,
  NearAddress:string,
  Latitude:number,
  Longitude:number
}
