import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { ReportService } from '../../services/report.service';
import {  decrypt } from 'app/main/parc/Parc';
import { GPSData } from '../../Interfaces/generalreportGPSData';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { resolve4 } from 'dns';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-graphicreportresult',
  templateUrl: './graphicreportresult.component.html',
  styleUrls: ['./graphicreportresult.component.scss',]
})
export class GraphicreportresultComponent implements OnInit {

  car: any;
  startdate: any;
  emplacement: any;
  result: any;
  single: any[];
  public view: any[] = [850, 400];
  public showXAxis = false;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = false;
  public xAxisLabel: "Years";
  public showYAxisLabel = true;
  public yAxisLabel: "Salary";
  public graphDataChart: any[];
  customLoadingTemplate : any;
  public colorScheme = {
    domain: ['#2b5cc4', '#edc617', '#ffed56']
  };
  single2: any[];
  view2: any[] = [400, 400];
  legend: boolean = true;
  legendPosition: string = 'below';
  displayedColumns: string[] = ['State', 'AcquisitionTime', 'Speed', 'Distance','NearestPlace','FuelLevel'];
  displayedColumns1: string[] = ['AcquisitionTime', 'Speed', 'NearestPlaceString'];
  displayedColumns2: string[] = ['State','AcquisitionTime', 'Speed', 'NearestPlaceString'];

  colorScheme2 = {
    domain: ['#81ccff','#2b5cc4']
  };
  SubMonthlyReports: any;
  monthlyReportItems: any;
  datasource: any;
  @ViewChildren(MatPaginator,null) paginator=new QueryList<MatPaginator>();
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
  loading = false;
  docDefinition: any;
  temp: number;
  single3: any[];
  single4: any[];
  constructor(private _SharedreportdataService: SharedreportdataService, 
               private _ReportService: ReportService,
               private _errorHandler: ErrorHandlerService) {  }

  ngOnInit() {
    this.loading = true;

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
     
      let datachar: Array<any> = [];
      let datachar2: Array<any> = [];
      
      let datachar3: Array<any> = [];
      let datachar4: Array<any> = [];
      this._ReportService.getGeneralReport(this.car , this.startdate,
        this.enddate,this.emplacement,0, 0,0 ,
        0,1).subscribe((result) => {
        this.loading = false;
        this.result = decrypt(result);
        if(this.result["AllExtendedGpsData"] != null)
        { this.result["AllExtendedGpsData"].forEach(elt => {
           this.gpsdata.push(new GPSData(elt,this.speed ));
          
         });
        }
        let r: Array<any> = [];
        let r1: Array<any> = [];
        let r2: Array<any> = [];
        let r3: Array<any> = [];
        let r4: Array<any> = [];
        let r5: Array<any> = [];

        this.gpsdata.forEach(elt => {
        r.push({ 'name': elt["BeginDateLocalString"], 'value':  elt["FuelLevel"]});
        r2.push({ 'name': elt["BeginDateLocalString"], 'value':  elt["RPM"]});
        if( elt["Temperature"]<0)
        {
          this.temp = 0
        }
        else{  this.temp =  elt["Temperature"]}
        r4.push({ 'name': elt["BeginDateLocalString"], 'value':  this.temp});
        r5.push({ 'name': elt["BeginDateLocalString"], 'value':   elt["Speed"]});

        });
         datachar.push({ 'name': "FuelLevel", 'series': r });

         datachar2.push({ 'name': "RPM", 'series': r2 });
         datachar3.push({ 'name': "Speed", 'series': r5 });
         datachar4.push({ 'name': "Temperature", 'series': r4 });
         this.single = [...datachar];
         this.single2 = [...datachar2];
         this.single3 = [...datachar3];
         this.single4 = [...datachar4];
    },
    (err: HttpErrorResponse) => {
     // console.log(err);
     //this.errorHandler.handleError(error);.handleError(err);
  });

}
 
  ); 
}



 
}
