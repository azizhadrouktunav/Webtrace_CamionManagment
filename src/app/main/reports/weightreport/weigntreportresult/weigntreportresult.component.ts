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
import { GPSData } from '../../Interfaces/generalreportGPSData';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-weigntreportresult',
  templateUrl: './weigntreportresult.component.html',
  styleUrls: ['./weigntreportresult.component.scss']
})
export class WeigntreportresultComponent implements OnInit,OnDestroy {

  car: any;
  startdate: any[];
  enddate: any[];
  emplacement: any;
  speed: any;
  rpm: any;
  result: any;
  temperatureReportResult : any;
  summaryreportdata =[];
  datasource: MatTableDataSource<unknown>;
 
  single: DataChart[];
  multi: any[];
  fuel: any;
  stop: any;
  report: any;
  gpsdata: any = [];
  CarMatricule: any;
  data: any;
  GeneralReportData : any;
  destroy: Subject<boolean> = new Subject<boolean>();
  view: any[] = [1000, 400];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  legendPosition: string = 'below';
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
  legendTitle: string = 'Details';
  displayedColumns: string[] = [ 'AcquisitionTime', 'NearestPlace', 'AxleWeight1st', 'AxleWeight', 'AxleWeight3rd', 'AxleWeight4th'];

  colorScheme = {
    //domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    //domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#2b5cc4', '#81ccff', '#edc617', '#ffed56', '#81ccff']
  };
  public loading = false;


  constructor(    private _SharedreportdataService: SharedreportdataService,  private _authenticateService: AuthenticateService,
    private _ReportService: ReportService,
    private translateService: TranslateService,
    private datePipe: DatePipe) {  }
  

    async ngOnInit() {
      this.loading = true;
    this.datePipe== new DatePipe('fr-FR');
    await this.getparams();
      let dataDet : Array<DataChart>=[];
        let datachar: Array<any> = [];
        this._ReportService.getGeneralReport(this.car , this.startdate,
          this.enddate,this.emplacement,this.fuel, this.speed,this.rpm ,
          this.stop,this.report).pipe(takeUntil(this.destroy)).subscribe((result) => {
          
            this.loading = false;
    
          this.result = decrypt(result);
          this.GeneralReportData= this.result["AllExtendedGpsData"];

          let r: Array<any> = [];
          let r1: Array<any> = [];
          let r2: Array<any> = [];
          let r3: Array<any> = [];

          this.translateService.get(['NAV.Speed'
          ,'NAV.SpeedThreshold' ])
           .subscribe(data => {this.data = data}
                );
          
          this.GeneralReportData.forEach(elt => {
          if( elt["AxleWeight1st"] != -32768)
          r.push({ 'name': elt["BeginDateLocalString"], 'value':  elt["AxleWeight1st"]});
          if( elt["AxleWeight"] != -32768)
          r1.push({ 'name': elt["BeginDateLocalString"], 'value': elt["AxleWeight"]});
          if( elt["AxleWeight3rd"] != -32768)
          r2.push({ 'name': elt["BeginDateLocalString"], 'value':  elt["AxleWeight3rd"]});
          if( elt["AxleWeight4th"] != -32768)
          r3.push({ 'name': elt["BeginDateLocalString"], 'value':  elt["AxleWeight4th"]});

          });
           datachar.push({ 'name': "Poids esseui 1", 'series': r });
           datachar.push({ 'name': "Poids esseui 2", 'series': r1 });
           datachar.push({ 'name': "Poids esseui 3", 'series': r2 });
           datachar.push({ 'name': "Poids esseui 4", 'series': r3 });

    
           this.single = [...datachar];
           this.datasource = new MatTableDataSource(this.GeneralReportData);
           this.datasource.paginator = this.paginator;
          
          })

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
       
       
        this.CarMatricule = params.param10 ;
      });
    }
    

    downloadExcel()
  {     //this.loading = true;

   
  }
  downloadPdf()
  {      //this.loading = true;

    
  }
  exportpdf()
  {     //this.loading = true;

   
  }
  exportexcel()
  {      //this.loading = true;

    
  }
}