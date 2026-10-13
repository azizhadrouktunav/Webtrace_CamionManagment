import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { TireManagement, DicoTransportation,CarTire } from '../interfaces/tire-management';
import { TireManagementService } from '../services/tire-management.service';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditAddTireComponent } from '../Dialogs/edit-add-tire/edit-add-tire.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../i18n/en';
import { locale as french } from '../i18n/fr';
import {locale as arabic } from '../i18n/ar'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { EditAxleComponent } from '../Dialogs/edit-axle/edit-axle.component';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { json2array } from 'app/main/helpers/must-match.validator';
@Component({
  selector: 'tire-management',
  templateUrl: './tire-management.component.html',
    styleUrls: ['./tire-management.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class TireManagementComponent implements OnInit {
    displayedColumns: string[] = ['TireId', 'Brand',  'Cost', 'PurchasedDateLocal',
        'DateExpiredWarrantyLocal',  'TireCarStatusName','ItCanUseOnCar', 
        'CurrentInstalledAxleNbrName','CurrentInstalledCarName', 'actions'];
    displayedColumns2:string[] = ['Icone', 'FullName','actions'];   
    // 'CurrentHeightOfTreadWearInMm','ContactNameDealer', 'TelDealer', 'MileageWhenPurchased','MileageExpiredWarranty','HowIsObtainedStr', 
    dataSource: MatTableDataSource<TireManagement>;
    dataSource2: MatTableDataSource<CarTire>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    ListTransportation: Array<DicoTransportation>;
    ListTires: Array<TireManagement>;
    searchkey: string;
    ListCarTire: Array<CarTire> = [];
    disabled;
    disabledAdd:boolean=false;
    
    constructor(private _TireManagementService: TireManagementService, public dialog: MatDialog, private _TranslateService: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService, private router: Router,
        public datepipe: DatePipe) {

        this._fuseTranslationLoaderService.loadTranslations(english, french, arabic);
    }

    ngOnInit() {
        this._TireManagementService.getTireParam().subscribe((data: any) => {
            this.ListTransportation = json2array(data.DicoTransportation);
            this.ListTransportation.forEach(row=>{
                this.ListCarTire.push({'FullName':row.FullName,'Icone':environment.iconUrl+row.UrlIconName,'Key':row.Key});
            });
            this.dataSource2 = new MatTableDataSource(this.ListCarTire);
            this.dataSource2.paginator = this.paginator;
            this.dataSource2.sort = this.sort;
       
        this._TireManagementService.getTires().subscribe((ListTires2: TireManagement[]) => {
            this.ListTires = ListTires2;
            this.ListTires.forEach(row => {
                let DateString: string = row.CreatedDateLocal.toString();
                row.CreatedDateLocal = new Date(parseInt(DateString.substr(6)));
                let purchaPurchasedDateString: string = row.PurchasedDateLocal.toString();
                row.PurchasedDateLocal = new Date(parseInt(purchaPurchasedDateString.substr(6)));
                let DateExpiredString = row.DateExpiredWarrantyLocal.toString();
                row.DateExpiredWarrantyLocal = new Date(parseInt(DateExpiredString.substr(6)));
                if (row.CurrentInstalledCar != 0 && (this.ListTransportation.findIndex(x => x.Key == row.CurrentInstalledCar)!=-1)) {
                  
                    row.CurrentInstalledCarName = this.ListTransportation.find(x => x.Key == row.CurrentInstalledCar).FullName;
                }
                row.CurrentInstalledAxleNbrName = this.GetCurrentInstalledAxleNbrName(row.CurrentInstalledAxleNbr);
                
                row.TireCarStatusName = this.GetStatusName(row.TireCarStatus);
                row.HowIsObtainedStr = this.GetHowIsObtainedStr(row.HowIsObtained);
              
               
            });
            this.dataSource = new MatTableDataSource(this.ListTires);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            });
         /* this._TireManagementService.TestMvtLog().subscribe((datatest: any) => {
               let test = datatest;
           });*/
            
        });
    }
    startEdit(row): void {


        const dialogRef = this.dialog.open(EditAddTireComponent, {
            panelClass: 'custom-dialog-container',
            // tslint:disable-next-line: max-line-length
            data: row
            
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            //console.log(result);
            this._TireManagementService.UpdateTire(result).subscribe((data: any) => {
               
                //this.ListTires.splice()
               // data.HowIsObtainedStr = this.GetHowIsObtainedStr(data.HowIsObtained);
            });
            
        });



    }
    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        if(tabChangeEvent.index ==0){
            this.disabledAdd=false;
        }
        else {
            this.disabledAdd=true;
        }
      }
    EditAxle(row): void {


        const dialogRef = this.dialog.open(EditAxleComponent, {
            panelClass: 'custom-dialog-container',
            // tslint:disable-next-line: max-line-length
            data: this.ListTransportation.find(x=>x.FullName== row.FullName)
            
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            this._TireManagementService.UpdateCarAxleWheelDef(result).subscribe((dataTrans:DicoTransportation)=>{
                console.log(dataTrans);

            });
           /* this._TireManagementService.UpdateTire(result).subscribe((data: any) => {
                console.log(this.ListTires);
             
            });*/
            
        });
    }
    
    applyfilter() {
        this.dataSource.filter = this.searchkey.trim().toLowerCase();
    }
    openAddTireDialog() {
       // const dialogConfig = new MatDialogConfig();
        let NewData: TireManagement;
        NewData = {
            Id: 0,
            TireId: null,
            Brand: null,
            Size: null,
            Type: null,
            Cost:0,
            MileageWhenPurchased: 0,
            MileageExpiredWarranty: 0,
            TireCarStatus: null,
            TireCarStatusName: null,
            HowIsObtained: null,
            ItCanUseOnCar: true,
            CurrentHeightOfTreadWearInMm: 0,
            Dealer: null,
            TelDealer: null,
            ContactNameDealer: null,
            CreatedDate: null,
            CreatedAccount: 0,
            CurrentInstalledCar: 0,
            CurrentInstalledAxleNbr: null,
            CurrentInstalledWheel:0,
            Customer: null,
            PurchasedDateLocal: null,
            DateExpiredWarrantyLocal: null,
            HowIsObtainedStr: null,
            CreatedDateLocal: null,
            TireStr: null
            
        };
        const dialogRef = this.dialog.open(EditAddTireComponent, {
            panelClass: 'custom-dialog-container',
            // tslint:disable-next-line: max-line-length
            data: NewData

        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            //console.log(result);
            this._TireManagementService.AddTire(result).subscribe((row: TireManagement) => {
               
                let DateString: string = row.CreatedDateLocal.toString();
                row.CreatedDateLocal = new Date(parseInt(DateString.substr(6)));
                let purchaPurchasedDateString: string = row.PurchasedDateLocal.toString();
                row.PurchasedDateLocal = new Date(parseInt(purchaPurchasedDateString.substr(6)));
                let DateExpiredString = row.DateExpiredWarrantyLocal.toString();
                row.DateExpiredWarrantyLocal = new Date(parseInt(DateExpiredString.substr(6)));
                if (row.CurrentInstalledCar != 0) {
                    row.CurrentInstalledCarName = this.ListTransportation.find(x => x.Key == row.CurrentInstalledCar).FullName;
                }
                row.CurrentInstalledAxleNbrName = this.GetCurrentInstalledAxleNbrName(row.CurrentInstalledAxleNbr);

                row.TireCarStatusName = this.GetStatusName(row.TireCarStatus);
                row.HowIsObtainedStr = this.GetHowIsObtainedStr(row.HowIsObtained);
                console.log(row);
                this.ListTires.push(row);
                this.dataSource = new MatTableDataSource(this.ListTires);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });

        });
    }
    startDelete(Id) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this._TireManagementService.DeleteTire(Id).subscribe(data => {
                    var index = index = this.ListTires.map(x => { return x.Id }).indexOf(Id);
                    this.ListTires.splice(index, 1);
                    this.dataSource = new MatTableDataSource(this.ListTires);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            }
        });
    }
    openLog(Id) {
        this.router.navigate(['/parc/tire-management/tire-management-log', Id]);
    }
    openLogByCar(Key){
        this.router.navigate(['/parc/tire-management/app-tire-log-by-car', Key]);
    }
    openDiagram(Key) {
        this.router.navigate(['/parc/tire-management/app-tire-diagram', Key]);
    }
    GetCurrentInstalledAxleNbrName(CurrentInstalledAxleNbr: number):string {
        switch (CurrentInstalledAxleNbr) { 
            case 0:
                return "PARC.LeftIn";
                break;
            case 1:
                return "PARC.LeftOut";
                break;
            case 2:
                return "PARC.RightIn";
                break;
            case 3:
                return "PARC.RightOut";
                break;
            default:
                return "";
                break;
        }
    }
    GetHowIsObtainedStr(HowIsObtained: number): string {
        switch (HowIsObtained) {
            case 0:
                return "PARC.ComeWithNewCar";
                break;
            case 1:
                return "PARC.ComeWithUsedCar";
                break;
            case 2:
                return "PARC.PurchasedAsUsed";
                break;
            case 3:
                return "PARC.PurchasedAsNew";
                break;
            default:
                return "";
                break;
        }
    }
    GetStatusName(Statut: number): string {
        switch (Statut) {
            case 0:
                return "PARC.Free";
                break;
            case 1:
                return "PARC.Occupied"
                break;
            default:
                return "";
                break;
        }
    }
    downloadPdf() {
        var prepare = [];
        this.ListTires.forEach(e => {
          
            var tempObj = [];
            this._TranslateService.get([e.TireCarStatusName, e.CurrentInstalledAxleNbrName]).subscribe(translations => {
                tempObj.push(e.TireId);
            tempObj.push(e.Brand);
            tempObj.push(e.Size);
            tempObj.push(e.Cost);
            tempObj.push(this.datepipe.transform(e.PurchasedDateLocal,'dd/MM/yyyy'));
            tempObj.push(this.datepipe.transform(e.DateExpiredWarrantyLocal, 'dd/MM/yyyy'));
                tempObj.push(translations[e.TireCarStatusName]);
            tempObj.push(e.ItCanUseOnCar);
                tempObj.push(translations[e.CurrentInstalledAxleNbrName]);
                tempObj.push(e.CurrentInstalledCarName);
            });
            prepare.push(tempObj);
        });
        const doc = new jsPDF('letter')
        this._TranslateService.get('PARC.TireManagement').subscribe((title: string) => {
            doc.text(title, 120, 16); //default
        });
        this._TranslateService.get(['PARC.Brand', 'PARC.Size', 'PARC.Cost', 'PARC.PurchasedDateLocal', 'PARC.DateExpiredWarrantyLocal', 'PARC.TireCarStatus',
            'PARC.ItCanUseOnCar', 'PARC.CurrentInstalledAxleNbrName', 'PARC.CurrentInstalledCarName']).subscribe(translations  => {
            doc.autoTable({
                head: [['ID', translations['PARC.Brand'], translations['PARC.Size'], translations['PARC.Cost'], translations['PARC.PurchasedDateLocal'],
                    translations['PARC.DateExpiredWarrantyLocal'], translations[ 'PARC.TireCarStatus'],
                    translations['PARC.ItCanUseOnCar'], translations['PARC.CurrentInstalledAxleNbrName'], translations[ 'PARC.CurrentInstalledCarName']]],
                body: prepare,
                startY: 20
            });
        });
        doc.save('Tire_List' + '.pdf');
    }
    exportExcel() {

        //var prepare_to_excel = [];

        let ListTireExc: Array<TireExcel>=[];
        this.ListTires.forEach(e => {
            ////var tempObj = [];
          
            this._TranslateService.get([e.TireCarStatusName, e.CurrentInstalledAxleNbrName]).subscribe(translations => {
                ListTireExc.push({
                    'TireId': e.TireId, 'Brand': e.Brand, 'Size': e.Size, 'Type': e.Type, 'Cost': e.Cost, 'MileageWhenPurchased': e.MileageWhenPurchased,
                    'MileageExpiredWarranty': e.MileageExpiredWarranty, 'TireCarStatusName': translations[e.TireCarStatusName], 'ItCanUseOnCar': e.ItCanUseOnCar,
                    'CurrentHeightOfTreadWearInMm': e.CurrentHeightOfTreadWearInMm, 'Dealer': e.Dealer, 'TelDealer': e.TelDealer, 'ContactNameDealer': e.ContactNameDealer,
                    'CreatedDate': e.CreatedDateLocal, 'CurrentInstalledWheel': e.CurrentInstalledWheel, 'PurchasedDateLocal': e.PurchasedDateLocal,
                    'DateExpiredWarrantyLocal': e.DateExpiredWarrantyLocal, 'HowIsObtainedStr': e.HowIsObtainedStr, 'CurrentInstalledAxleNbrName': translations[e.CurrentInstalledAxleNbrName],
                    'CurrentInstalledCarName':e.CurrentInstalledCarName
                });
            });
          
        });
        //prepare_to_excel.push(ListTireExc);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ListTireExc);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'Tire_List.xls', { bookType: 'xls', type: 'buffer' });
    }

}
export interface TireExcel {
    TireId: string;
    Brand: string;
    Size: string;
    Type: string;
    Cost: number;
    MileageWhenPurchased: number;
    MileageExpiredWarranty: number;
    TireCarStatusName: string;
    ItCanUseOnCar: boolean;
    CurrentHeightOfTreadWearInMm: number;
    Dealer: string;
    TelDealer: string;
    ContactNameDealer: string;
    CreatedDate: Date;
    CurrentInstalledWheel: number;
    PurchasedDateLocal: Date;
    DateExpiredWarrantyLocal: Date;
    HowIsObtainedStr: string;
    CurrentInstalledAxleNbrName?: string;
    CurrentInstalledCarName?: string;
}