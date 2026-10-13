import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { decrypt } from 'app/main/parc/Parc';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GPSData } from '../../Interfaces/generalreportGPSData';
import { ReportService } from '../../services/report.service';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { dayDiff } from 'app/main/helpers/validators/validators';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-smartlocresult',
  templateUrl: './smartlocresult.component.html',
  styleUrls: ['./smartlocresult.component.scss']
})
export class SmartlocresultComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();
  loading: boolean;
  result: string;
  data = [];
  datasource: MatTableDataSource<unknown>;
  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
  startdate: any;
  car: any;
  
  enddate: any;
  displayedColumns: string[] = ['TrackingObject', 'AcquisitionTime', 'AlertType','Driver','NearAddress','Duration'];
  AcquisitionTime: string;

  constructor( private _SharedreportdataService: SharedreportdataService,
    private translateService: TranslateService,
    public datepipe: DatePipe,

    private _ReportService: ReportService) { }
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  async ngOnInit() {
     this.loading = true;
    await this.getparams();

    
    
    this._ReportService.getsmartlockReport(this.car , this.startdate,
      this.enddate).pipe(takeUntil(this.destroy)).subscribe((result) => {
      
        this.loading = false;
         
      this.result = decrypt(result["GetAlertsElementCompressedResult"]);
      this.data = Array.from(this.result);
      if(this.data.length >0)
      {for (let i = 0; i < this.data.length-1; i++) {
         
        var date1 = new Date(parseInt(this.data[i+1].AcquisitionTimeLocal.substr(6)));
        var date2 = new Date(parseInt(this.data[i].AcquisitionTimeLocal.substr(6)));

       Object.assign(this.data[i], { Duration: this.timeDiffCalc(date1, date2)});
       Object.assign(this.data[i], { AcquisitionTime: this.datepipe.transform(new Date(parseInt(this.data[i].AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss')});

     }}
     Object.assign(this.data[this.data.length-1], { Duration: this.timeDiffCalc(new Date(), new Date(parseInt(this.data[this.data.length-1].AcquisitionTimeLocal.substr(6))))});
     Object.assign(this.data[this.data.length-1], { AcquisitionTime: this.datepipe.transform(new Date(parseInt(this.data[this.data.length-1].AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss')});

       this.datasource = new MatTableDataSource(Array.from(this.data));
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
     
 
});  }
downloadExcel()
{  
  var prepare_to_excel=[];
    let tem =[];
    tem.push('Véhicule');
    tem.push("Temps d'acquisition ");
    tem.push("Type d'alerte");
    tem.push("Chauffeur");
    tem.push("Adresse proche");
    tem.push("Durée");

    prepare_to_excel.push(tem);
    this.data.forEach(e=>{
      this.AcquisitionTime =  this.datepipe.transform(new Date(parseInt(e.AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss');

      var tempObj =[];
      tempObj.push(e.TrackingObjectName);
      tempObj.push(this.AcquisitionTime);
      tempObj.push(e.AlertTypeFrenchString);

      tempObj.push(e.DriverName);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Duration);
      prepare_to_excel.push(tempObj);


    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'RapportSmartlock.xls', { bookType: 'xls', type: 'buffer' });
}
downloadPdf()
{ 
  var prepare=[];
  this.data.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.TrackingObjectName);
    this.AcquisitionTime =  this.datepipe.transform(new Date(parseInt(e.AcquisitionTimeLocal.substr(6))), 'yyyy-MM-dd HH:mm:ss');
    tempObj.push(this.AcquisitionTime);
    tempObj.push(e.AlertTypeFrenchString);

      tempObj.push(e.DriverName);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.Duration);
   
    prepare.push(tempObj);
  });
  const doc = new jsPDF();
  doc.text('Rapport ouverture et fermeture de Smartlock', 78, 16); //default

  doc.autoTable({
      head: [['Véhicule',"Temps d'acquisition ","Type d'alerte",'Chauffeur','Adresse proche ','Durée']],
      body: prepare,
      startY: 20

  });
  doc.save('RapportSmartlock' + '.pdf');
}
exportexcel()
{

}
exportpdf()
{}

 timeDiffCalc(dateFuture, dateNow) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    difference += (days === 1) ? `${days} jour, ` : `${days} jours, `;
  }

  difference += (hours === 0 || hours === 1) ? `${hours} heure, ` : `${hours} heures, `;

  difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`; 

  return difference;
}

}
