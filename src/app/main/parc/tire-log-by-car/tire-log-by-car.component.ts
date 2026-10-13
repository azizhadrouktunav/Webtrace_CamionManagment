import { Component, OnInit, ViewChild } from '@angular/core';
import { TireManagementService } from '../services/tire-management.service';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/fr';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TireLog } from '../interfaces/tire-management';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-tire-log-by-car',
  templateUrl: './tire-log-by-car.component.html',
  styleUrls: ['./tire-log-by-car.component.scss']
})
export class TireLogByCarComponent implements OnInit {

  constructor(private _TireManagementService: TireManagementService, private _Activatedroute: ActivatedRoute, private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _TranslateService: TranslateService,public datepipe: DatePipe ) 
  {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);

  }
  key: number;
  searchkey: string;
  displayedColumns: string[] = ['OperationDateLocal', 'OperationTypeName', 'OperationCost', 'OperationMileage'];
    dataSource: MatTableDataSource<TireLog>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    ListTiresLogByCar: Array<TireLog>;
    TotalCost = 0;

  ngOnInit() {
    this.key = Number(this._Activatedroute.snapshot.paramMap.get("Key"));
    this._TireManagementService.GetTireLogByCar(this.key).subscribe((ListTireLogBycar : TireLog[])=>{
      this.ListTiresLogByCar=ListTireLogBycar;
     // this.ListTiresLogByCar[0].Car
      this.ListTiresLogByCar.forEach(row=>{
        this.TotalCost=row.OperationCost;
        let DateString: string = row.OperationDateLocal.toString();
        row.OperationDateLocal = new Date(parseInt(DateString.substr(6)));
        row.OperationTypeName = this.GetOperationTypeName(row.OperationType);

      });
      this.dataSource = new MatTableDataSource(this.ListTiresLogByCar);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;


    });
  }
  getTotalCost() {

    return this.TotalCost;
}
applyfilter() {
  this.dataSource.filter = this.searchkey.trim().toLowerCase();
}
  GetOperationTypeName(OperationType: number): string {
    switch (OperationType) {
        case 0:
            return "PARC.NewEntry";
            break;
        case 1:
            return "PARC.Mount";
            break;
        case 2:
            return "PARC.Dismount";
            break;
        case 3:
            return "PARC.Rotation";
            break;
        case 4:
            return "PARC.Inspection";
            break;
        default:
            return "";
            break;
    }
}
downloadPdf(){
  var prepare = [];
  this.ListTiresLogByCar.forEach(e => {
    
      var tempObj = [];
     this._TranslateService.get([e.OperationTypeName]).subscribe(translations => {
         
          tempObj.push(this.datepipe.transform(e.OperationDateLocal,'dd/MM/yyyy'));
          tempObj.push(translations[e.OperationTypeName]); 
     
      tempObj.push(e.OperationCost); 
      tempObj.push(e.OperationMileage);
         
          tempObj.push(e.WorkOrderNumber);
      });
      prepare.push(tempObj);
  });
  const doc = new jsPDF('letter')
  this._TranslateService.get('PARC.ShowJournalByCar').subscribe((title: string) => {
      doc.text(title, 120, 16); //default
  });
  this._TranslateService.get(['PARC.OperationDate', 'PARC.OperationType', 'PARC.Cost', 'PARC.Mileage', 'PARC.WorkOrderNumber']).subscribe(translations  => {
      doc.autoTable({
          head: [[ translations['PARC.OperationDate'], translations['PARC.OperationType'], translations['PARC.Cost'], translations['PARC.Mileage'],
              translations['PARC.WorkOrderNumber']]],
          body: prepare,
          startY: 20
      });
  });
  doc.save('TireLogByCar_List' + '.pdf');

}

}
