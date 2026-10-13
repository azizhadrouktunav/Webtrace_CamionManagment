import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { decrypt } from 'app/main/parc/Parc';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GPSData, GPSDataTrajet } from '../../Interfaces/generalreportGPSData';
import { ReportService } from '../../services/report.service';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-trajetreportresult',
  templateUrl: './trajetreportresult.component.html',
  styleUrls: ['./trajetreportresult.component.scss']
})
export class TrajetreportresultComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();
  loading: boolean;
  GeneralReportData: any[];
  result: any;
  gpsdata = [];
  data: any;
  single: any[];
  single2: any[];
  single3: any[];
  datasource: MatTableDataSource<unknown>;
  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
  CarMatricule: any;
  startdate: any;
  car: any;
  emplacement: any;
  fuel: any;
  stop: any;
  report: any;
  speed: any;
  distance:any;
  rpm: any;
  enddate: any;
  dataStop = [];
  dataCirculation : Array<TrajetManagement>= [];
  displayedColumns: string[] = ['Car','DateDeparture', 'DeparturePlace', 'ArrivalDate', 'ArrivalPlace','TripTime','SpeedAvg','SpeedMax','Distance','StopTime'];
  lastState: number;
  datasplit = [];
  first: boolean = true;
  speedMoy: number = 0;
  SpeedMax : number = 0;
  progressbarValue=0;
  progressValueInPercent =0;

  constructor( private _SharedreportdataService: SharedreportdataService,
    private translateService: TranslateService,

    private _ReportService: ReportService) { }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  async ngOnInit() {
     this.loading = true;
    await this.getparams();
 let  gpsdata2 = [];
 this.loading = false;
  this.progressValueInPercent = 100 / this.car.length;
    this.car.forEach( async row=>{

      this._ReportService.GetRunStopStateDistance(row , this.startdate,
        this.enddate,this.emplacement,this.distance).pipe(takeUntil(this.destroy)).subscribe( (result) => {
          this.progressbarValue += this.progressValueInPercent;
          this.result= decrypt(result);
          if(this.result != null && this.result!="" && this.result.ExtendedGpsDataStopRunStateRed != null)
          {
           
           for(let indx=0;indx<this.result.ExtendedGpsDataStopRunStateRed.length -1;indx++)
           {
             if(indx== 0 && this.result.ExtendedGpsDataStopRunStateRed[indx].StopRunStatusEnum==1)
                indx++;
             if(this.result.ExtendedGpsDataStopRunStateRed[indx].StopRunStatusEnum==0)
             {
               this.dataCirculation.push({'Car':this.result.Matricule,'DateDeparture':  this.result.ExtendedGpsDataStopRunStateRed[indx].BeginDateLocalString ,
               'DeparturePlace':this.result.ExtendedGpsDataStopRunStateRed[indx].NearestPlaceString,'ArrivalDate':this.result.ExtendedGpsDataStopRunStateRed[indx].EndDateLocalString ,'ArrivalPlace':this.result.ExtendedGpsDataStopRunStateRed[indx+1].NearestPlaceString,
               'TripTime':this.result.ExtendedGpsDataStopRunStateRed[indx].PeriodString,'SpeedAvg':this.result.ExtendedGpsDataStopRunStateRed[indx].SpeedAverageAtRunStatus,'SpeedMax':this.result.ExtendedGpsDataStopRunStateRed[indx].SpeedMax,'Distance':this.result.ExtendedGpsDataStopRunStateRed[indx].DistanceAtRunStatus,'StopTime':this.result.ExtendedGpsDataStopRunStateRed[indx+1].PeriodString});
 
             }
            
           }
           this.datasource = new MatTableDataSource(this.dataCirculation);
           this.datasource.paginator = this.paginator.toArray()[0];

          }
        },
        err => {
          //this.loading = false;
      
          console.log(err);
         
        }
        )
     
   
     
        
   /*   this.dataStop = this.dataStop.splice(1); 
       var i =0 ;
       this.gpsdata.forEach(elt => {
         if(this.first)
        {this.datasplit[i] = [];}
        
       this.datasplit[i].push(elt);
       this.first = false;
       if(elt.StopRunStatusEnum == 1)
       {i++;
        this.first = true;} 
      }); 
      this.datasplit = this.datasplit.splice(1); */

    /*  for (let i = 0; i < this.dataCirculation.length; i++) {
         var speedSom = 0;
        this.datasplit[i+1].forEach(element => {
          if(element.Speed > this.SpeedMax)
           this.SpeedMax = element.Speed;
          var nbrenreg = this.datasplit[i+1].length;
           speedSom = speedSom + element.Speed;
            this.speedMoy = speedSom/nbrenreg;
        });
        let SpeedMoy=0;
      if(this.datasplit[i+1].length >0 && this.datasplit[i+1]!= undefined)
      {
       this.SpeedMax = Math.max.apply(null,this.datasplit[i+1].map(function(o) { return o.Speed; }));
        SpeedMoy = this.datasplit[i+1].reduce((accumulator, object) => {
        return accumulator + object.Speed;
      }, 0);
    }
      
      
        Object.assign(this.dataCirculation[i], { DateArrival: this.dataStop[i].BeginDateLocalString});
        Object.assign(this.dataCirculation[i], { PlaceArrival: this.dataStop[i].NearestPlaceString});
        Object.assign(this.dataCirculation[i], { SpeedMoy: SpeedMoy.toFixed(2)});
        Object.assign(this.dataCirculation[i], { SpeedMax: this.SpeedMax});
        Object.assign(this.dataCirculation[i], { DurationStop: this.dataStop[i].PeriodString});
      }*/

      
     
       
    })
    
    
     
       
  

 
}
   getData(car) 
  {
    this._ReportService.GetRunStopState(car , this.startdate,
      this.enddate,this.emplacement).pipe(takeUntil(this.destroy)).subscribe(async (result) => {
        this.result= decrypt(result);
      },
      err => {
        //this.loading = false;
    
        console.log(err);
       
      }
      )
     

  }
  getparams() {
    this._SharedreportdataService.fetchParams().subscribe(params => {
      this.car = params.param1;
      this.startdate = params.param2;
      this.enddate = params.param3;
      this.emplacement = params.param4;
      this.fuel = params.param5;
      this.speed = params.param6;
      this.distance = params.param7;
      this.stop = params.param8 ;
      this.report = params.param9 ;
      this.CarMatricule = params.param10 ;
     // this.distance =
 
});  }
downloadExcel()
{
  var prepare_to_excel=[];
    let tem =[];
    tem.push('Matricule');
    tem.push('Date départ');
    tem.push('Lieu départ');
    tem.push("Date arrivée");
    tem.push("lieu arrivé");
    tem.push("Durée du trajet");
    tem.push("Vitesse moyenne");
    tem.push("Distance");
    tem.push("Durée de stop");

    
    prepare_to_excel.push(tem);
    this.dataCirculation.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.Car);
      tempObj.push(e.DateDeparture);
        tempObj.push(e.DeparturePlace);
        tempObj.push(e.ArrivalDate);
        tempObj.push(e.ArrivalPlace);
        tempObj.push(e.TripTime);
        tempObj.push(e.SpeedAvg);
        tempObj.push(e.Distance);
        tempObj.push(e.StopTime);
      prepare_to_excel.push(tempObj);

    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Rapportdestrajets.xls', { bookType: 'xls', type: 'buffer' });
}
downloadPdf()
{ 
  this.loading = true;
  var prepare=[];
  this.dataCirculation.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.Car);
    tempObj.push(e.DateDeparture);
      tempObj.push(e.DeparturePlace);
      tempObj.push(e.ArrivalDate);
      tempObj.push(e.ArrivalPlace);
      tempObj.push(e.TripTime);
      tempObj.push(e.SpeedAvg);
      tempObj.push(e.SpeedMax);
      tempObj.push(e.Distance);
      tempObj.push(e.StopTime);
   
    prepare.push(tempObj);
  });
  const doc =new jsPDF("landscape");
  let finalY = doc.lastAutoTable.finalY || 20; 
  var width = doc.internal.pageSize.getWidth();
  doc.text('Rapport des trajets', width/2, 20,{ align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(0);
  doc.setFontStyle('bold');
  doc.autoTable({
      head: [['Matricule','Date départ','Lieu départ','Date arrivée','Lieu arrivé','Durée du trajet','Vitesse moyenne','Vitesse Max','Distance','Durée de stop']],
      body: prepare,
      tableWidth: 'wrap',
     // Default for all columns
     styles: {overflow: 'linebreak', columnWidth: 'wrap', font: 'arial',overflowColumns: 'linebreak'},
     columnStyles: {
      0: { cellWidth: 10,
       
        halign: 'center',
      }, 
      1: {
        cellWidth: 10,
         
          halign: 'center', 
      },
      2: {
        cellWidth: 40,
         
          halign: 'center', 
      },
      3: {
        cellWidth: 10,
        
          halign: 'center', 
      },
      4: {
        cellWidth: 40,
       
        halign: 'center', 
    },
    5: {
      cellWidth: 10,
     
      halign: 'center', 
  },
    },
     startY: 35,


  });
  var pageCount = doc.internal.getNumberOfPages(); //Total Page Number
for(let i = 0; i < pageCount; i++) { 
  doc.setPage(i); 
  let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber; //Current Page
  doc.setFontSize(12);
  doc.text('page: ' + pageCurrent + '/' + pageCount, 10, doc.internal.pageSize.height - 10);
}

  doc.save('Rapportdestrajets' + '.pdf');
  this.loading = false;
}
exportexcel()
{

}
exportpdf()

{}
}
export interface TrajetManagement {
  Car: string;
  DateDeparture: string;
  DeparturePlace: string;
  ArrivalDate: string;
  ArrivalPlace: string;
  TripTime: string;
  SpeedAvg: number;
  SpeedMax:number;
  Distance:number;
  StopTime:number;
 
}
