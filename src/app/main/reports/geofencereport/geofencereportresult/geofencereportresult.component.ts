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
@Component({
  selector: 'app-geofencereportresult',
  templateUrl: './geofencereportresult.component.html',
  styleUrls: ['./geofencereportresult.component.scss']
})
export class GeofencereportresultComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();
  loading: boolean;
  result: string;
  data = [];
  datasource: MatTableDataSource<unknown>;
  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
  startdate: any;
  car: any;
  
  enddate: any;
  displayedColumns: string[] = ['TrackingObject', 'AcquisitionTime', 'AlertType','GeofenceName ','NearAddress','Nchassis','Mileage'];

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

    
    
    this._ReportService.getgeofenceReport(this.car , this.startdate,
      this.enddate).pipe(takeUntil(this.destroy)).subscribe((result) => {
      
        this.loading = false;

      this.result = decrypt(result["GetAlertsElementManyTrackingObjectCompressedResult"]);
      this.data = Array.from(this.result);
       this.datasource = new MatTableDataSource(Array.from(this.result));
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
    tem.push("Description");
    tem.push("Adresse proche");
    tem.push("Numéro de châssis");
    tem.push("Kilométrage");

    prepare_to_excel.push(tem);
    this.data.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.TrackingObjectName);
      tempObj.push(e.AcquisitionTimeLocalString);
      tempObj.push(e.Description);
      tempObj.push(e.NearestPlaceString);
      tempObj.push(e.ChassisNumber);
      tempObj.push(e.Mileage);
      prepare_to_excel.push(tempObj);


    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Rapportdesgeofences.xls', { bookType: 'xls', type: 'buffer' });
}
downloadPdf()
{ 
  var prepare=[];
  this.data.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.TrackingObjectName);
    tempObj.push(e.AcquisitionTimeLocalString);
    tempObj.push(e.Description);
    tempObj.push(e.NearestPlaceString);
    tempObj.push(e.ChassisNumber);
    tempObj.push(e.Mileage);
   
    prepare.push(tempObj);
  });
  const doc = new jsPDF();
  doc.text('Rapport des geofences', 78, 16); //default

  doc.autoTable({
      head: [['Véhicule',"Temps d'acquisition ","Type d'alerte",'Adresse proche ','Numéro de châssis','Kilométrage']],
      body: prepare,
      startY: 20

  });
  doc.save('Rapportdegeofences' + '.pdf');
}
exportexcel()
{

}
exportpdf()
{}
}
