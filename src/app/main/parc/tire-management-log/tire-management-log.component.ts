import { Component, OnInit, ViewChild } from '@angular/core';
import { TireManagementService } from '../services/tire-management.service';
import { ActivatedRoute } from '@angular/router';
import { TireLog } from '../interfaces/tire-management';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import * as _ from 'lodash';
import { locale as english } from '../i18n/en';
import { locale as french } from '../i18n/fr';
import { locale as arabic } from '../i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
//import { EditAddTireLogComponent } from '../Dialogs/edit-add-tire-log/edit-add-tire-log.component';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditAddTireLogComponent } from '../Dialogs/edit-add-tire-log/edit-add-tire-log.component';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'tire-management-log',
  templateUrl: './tire-management-log.component.html',
  styleUrls: ['./tire-management-log.component.scss']
})
export class TireManagementLogComponent implements OnInit {

    constructor(private _TireManagementService: TireManagementService, private _Activatedroute: ActivatedRoute, private _fuseTranslationLoaderService: FuseTranslationLoaderService, public dialog: MatDialog ,
        private _TranslateService: TranslateService,public datepipe: DatePipe) {
        this._fuseTranslationLoaderService.loadTranslations(english, french, arabic);
    }
    displayedColumns: string[] = ['OperationDateLocal', 'OperationTypeName', 'OperationCost', 'OperationMileage', 'WheelPosition', 'WorkOrderNumber','actions'];
    dataSource: MatTableDataSource<TireLog>;
    Id: number;
    ListTiresLog: Array<TireLog>;
    TotalCost = 0;
    TireId: number =0;
    searchkey: string;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    ngOnInit() {
        this.Id = Number(this._Activatedroute.snapshot.paramMap.get("Id"));
        this._TireManagementService.GetTireLogByTire(this.Id).subscribe((ListTiresLog2: TireLog[]) => {
            this.ListTiresLog = ListTiresLog2;
            
            this.ListTiresLog.forEach(row => {
                this.TotalCost += row.OperationCost;
                let DateString: string = row.OperationDateLocal.toString();
                row.OperationDateLocal = new Date(parseInt(DateString.substr(6)));
                row.OperationTypeName = this.GetOperationTypeName(row.OperationType);
            });
            this.dataSource = new MatTableDataSource(this.ListTiresLog);
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
    openAddTireDialog() {
        // const dialogConfig = new MatDialogConfig();
        let NewData: TireLog;
        NewData = {
            Id: 0,
            Tire:  this.Id,
            OperationDateGmt: null,
            OperationDateLocal: null,
            OperationType: 4,
            OperationTypeName: null,
            OperationTypeEnum: 0,
            OperationMileage: 0,
            OperationCost:0,
            OperationHeightOfTreadWearInMm:0,
            OperationPressure:0,
            Car: 0,
            AxleNumber: 0,
            AxleNumberEnum: 0,
            WheelPosition: 0,
            WheelPositionEnum: 0,
            WorkOrderNumber: null,
            AccountServiceBy: 0,
            AccountWorkedBy: 0,
            Description:null,
            Comment: null,
            CreatedDate: null,
            CreatedDateLocal: null,
            LastEditDate:null,
            LastEditDateLocal:null,
            LastEditAccount: 0,
            Customer: 0,
           // ListCompt:

        };
        const dialogRef = this.dialog.open(EditAddTireLogComponent, {
            panelClass: 'custom-dialog-container',
            // tslint:disable-next-line: max-line-length
            data: NewData

        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            //console.log(result);
            result.OperationDateGmt = new Date(result.OperationDateGmt);
            this._TireManagementService.AddTireLog(result).subscribe((row: TireLog) => {
                this.TotalCost += row.OperationCost;
                let DateString: string = row.OperationDateLocal.toString();
                row.OperationDateLocal = new Date(parseInt(DateString.substr(6)));
                row.OperationTypeName = this.GetOperationTypeName(row.OperationType);
                this.ListTiresLog.push(row);
                this.dataSource = new MatTableDataSource(this.ListTiresLog);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

           
            });

        });
    }
    DeleteLog(row:TireLog):void
    {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this._TireManagementService.DeleteTireLog(row.Tire,row.Id).subscribe(data=>{
                    var index = index = this.ListTiresLog.map(x => { return x.Id }).indexOf(row.Id);
                    this.ListTiresLog.splice(index, 1);
                    this.dataSource = new MatTableDataSource(this.ListTiresLog);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            }
        });
    }
   
    startEdit(row): void {


        const dialogRef = this.dialog.open(EditAddTireLogComponent, {
            panelClass: 'custom-dialog-container',
            // tslint:disable-next-line: max-line-length
            data: row
            
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            //console.log(result);
            this._TireManagementService.UpdateTireLog(result).subscribe((data: TireLog) => {
               //console.log(data);
                //this.ListTires.splice()
               // data.HowIsObtainedStr = this.GetHowIsObtainedStr(data.HowIsObtained);
            });
            
        });



    }
    downloadPdf(){
        var prepare = [];
        this.ListTiresLog.forEach(e => {
          
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
        this._TranslateService.get('PARC.ShowJournalByTire').subscribe((title: string) => {
            doc.text(title +" N° "+this.Id, 120, 16); //default
        });
        this._TranslateService.get(['PARC.OperationDate', 'PARC.OperationType', 'PARC.Cost', 'PARC.Mileage', 'PARC.WorkOrderNumber']).subscribe(translations  => {
            doc.autoTable({
                head: [[ translations['PARC.OperationDate'], translations['PARC.OperationType'], translations['PARC.Cost'], translations['PARC.Mileage'],
                    translations['PARC.WorkOrderNumber']]],
                body: prepare,
                startY: 20
            });
        });
        doc.save('TireLog_List' + '.pdf');

    }

}