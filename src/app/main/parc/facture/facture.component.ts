import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as french } from'../i18n/fr';
import { locale as arab } from '../i18n/ar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FactureService } from './facture.service';
import { AddFactureComponent } from './add-facture/add-facture.component';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';  
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';


@Component({
    selector: 'facture',
    templateUrl: './facture.component.html',
    styleUrls: ['./facture.component.scss'],
})

export class FactureComponent implements OnInit {

    title = 'Facture Table';
    actions = [{
            id: 1,
            text: "My profile",
            icon: "user"
        },
        {
            id: 2,
            text: "Messages",
            icon: "email"
        },
        {
            id: 3,
            text: "Contacts",
            icon: "group"
        },
        {
            id: 4,
            text: "Log out",
            icon: "runner"
        }
    ];
    displayedColumns: string[] = ['Reference','Type','FactureDate','MvtTypeStr','Quantity','Object','fornisseur','Beneficiary','Etat','TotalTTC','TotalHT','MaturityAmount','TaxStamp','RegulationModelStr','RegulationConditionStr','RegulationModeStr','actions'];
    filterList = "0";
    dataSource:  MatTableDataSource<any>;
    searchkey;
    totalFactureList = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private service: FactureService,
        private dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _snackBar : MatSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.service.onFactureChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
            this.totalFactureList = data;
            this.totalFactureList.map(item => {
                if(item.FactureDate != null)
                item.FactureDate = getDateFromJson(item.FactureDate) ? getDateFromJson(item.FactureDate).toLocaleString() : item.FactureDate
                if(item.DueDate != null)
                  item.DueDate = getDateFromJson(item.DueDate) ? getDateFromJson(item.DueDate).toLocaleString() : item.DueDate
                if(item.NextDeadline != null)
                  item.NextDeadline = getDateFromJson(item.NextDeadline) ? getDateFromJson(item.NextDeadline).toLocaleString() : item.NextDeadline
            });
            this.dataSource = new MatTableDataSource(this.totalFactureList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
    }

    DeleteFacture(row) {
        
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'deleteMsg';
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
               
                var data = {
                    "ID": row.ID,
                    "Type": row.Type,
                    "SessionId": localStorage.getItem('SessionId')
                }
                this.service.deleteFacture(data).subscribe(deleted => {
                    if (deleted) {
                        this.service.deleteFactureFromLocalTable(row.ID);
                        this._snackBar.open('Facture suprimée!', '', {
                            duration: 5000,
                            verticalPosition: 'top',
                            horizontalPosition: 'right'
                        });
                    }else{
                        this._snackBar.open('erreur de connexion', '', {
                            duration: 5000,
                            verticalPosition: 'top',
                            horizontalPosition: 'right'
                        });
                    }
                });
            }
        });
    }

    UpdateFacture(facture){
        
    }

    ontypeSelected(event){
        switch(this.filterList) { 
            case '0': { 
                this.dataSource = new MatTableDataSource(this.totalFactureList);
               break; 
            } 
            case '1': { 
                this.dataSource = new MatTableDataSource(this.totalFactureList.filter(x => x.Type == 0));
               break; 
            } 
            case '2': { 
                this.dataSource = new MatTableDataSource(this.totalFactureList.filter(x => x.Type == 1));
                break; 
            }
            case '3': { 
                this.dataSource = new MatTableDataSource(this.totalFactureList.filter(x => x.Type == 2));
                break; 
            }  
            default: { 
                this.dataSource = new MatTableDataSource(this.totalFactureList);
               break; 
            } 
        } 
    }

    editBill(row){
        let dialog_variable = this.dialog.open(AddFactureComponent, {
            height: 'max-content',
            width: '80vw',
            panelClass: 'custom-dialog-container',
            data: row
        });
    }

    Add_Facture() {
        //const dialogConfig = new MatDialogConfig();
        let dialog_variable = this.dialog.open(AddFactureComponent, {
            height: 'max-content',
            width: '80vw',
            panelClass: 'custom-dialog-container'
        });
    }

    applyfilter() {
        this.dataSource.filter = this.searchkey.trim().toLowerCase();
    }
    // UpdateFacture(ID) {
    //     const dialogConfig = new MatDialogConfig();
    //     let dialog_variable = this.dialog.open(AddFactureComponent, {
    //         height: 'max-content',
    //         width: '80vw',
    //         panelClass: 'custom-dialog-container',
    //         data: {
    //             "update": true,
    //             "ID": ID
    //         }
    //     });
    // }
    exportExcel(){
        var prepare_to_excel=[];
        let tem =[];
        tem.push('Reference');
        tem.push('Date de bon');
        tem.push('Date de fin');
        tem.push('quantité des articles');
        tem.push('Type de bon');
        tem.push('Type de mouvement');
        tem.push('Mode');
        tem.push('Modele');
        tem.push('Condition');
        prepare_to_excel.push(tem);
        this.service.facture.forEach(e=>{
            var tempObj =[];
            tempObj.push(e.Reference);
            tempObj.push(e.FactureDate);
            tempObj.push(e.NextDeadline)
            tempObj.push(e.Quantity);
            tempObj.push(e.TypeStr);
            tempObj.push(e.MvtTypeStr);
            tempObj.push(e.RegulationModeStr);
            tempObj.push(e.RegulationModelStr);
            tempObj.push(e.RegulationConditionStr);
            prepare_to_excel.push(tempObj);
        });
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'Bon_Liste.xls', { bookType: 'xls', type: 'buffer' });
    }
    downloadPdf() {
        var prepare=[];
        this.service.facture.forEach(e=>{
            var tempObj =[];
            tempObj.push(e.Reference);
            tempObj.push(e.FactureDate);
            tempObj.push(e.NextDeadline)
            tempObj.push(e.Quantity);
            tempObj.push(e.TypeStr);
            tempObj.push(e.MvtTypeStr);
            tempObj.push(e.RegulationModeStr);
            tempObj.push(e.RegulationModelStr);
            tempObj.push(e.RegulationConditionStr);
            prepare.push(tempObj);
        });
        const doc = new jsPDF();
        doc.text('Liste des bons', 78, 16); //default
        doc.autoTable({
            head: [['Reference','Date de bon','Date de fin','quantité des articles','Type de bon','Type de mouvement','Mode','Modele','Condition']],
            body: prepare,
            startY: 20
        });
        doc.save('bill_List' + '.pdf');
    }
    processClick(data) {
       
    }
    
}












// result['ListBillsStockAndDeliveryForm'].forEach((item, index) => {
//     const tmp = {
//         'Reference': item['Reference'],
//         'Date': item['FactureDate'],
//         'Type': item['Type'],
//         'Id': item['ID'],
//         'movement': item['MvtTypeStr'],
//         'Quantity': item['Quantity'],
//         'Fournisseur': item['Supplier'] == undefined ? '' : item['Supplier']['Name'],
//         'Beneficiary': item['Beneficiary'] == undefined ? '' : item['Beneficiary']['FirstName'],
//         'Etat': item['State'],
//         'Total TTC': item['TotalHT'],
//         'Total HT': item['TotalHT'],
//         'Net à payé': item['NetToPay'],
//         'Timbre Fiscal': item['TaxStamp'],
//         'Conditions': item['RegulationConditionStr'],
//         'R-Model': item['RegulationModelStr'],
//         'Mode': item['RegulationModeStr'],
//         'Montant': item['RemainingCapital']
//     }
//     this.MyData[index] = tmp;
// })
// console.log(this.MyData)
// // this.listdata = new MatTableDataSource(this.TableData.ListBillsStockAndDeliveryForm);   MvtTypeStr
// // this.listdata.sort = this.sort;
// // this.listdata.paginator = this.paginator;
// this._alldata = this.MyData;






function getDateFromJson (stringJsonDate) {
    try {
  
        if (typeof stringJsonDate == "object" && typeof stringJsonDate.getDate == 'function') {
            return stringJsonDate;
        }
        else if (stringJsonDate.indexOf("/Date(") != -1 && stringJsonDate.indexOf(")/") != -1) {
  
            var stringDate = (stringJsonDate.split('(')[1]).split(')')[0];
            var intDate = parseInt(stringDate);
  
            // 
            var gmtCustomer = 0;
            var gmtServeur = 0;
            if (stringDate.indexOf('+') != -1) {
                var gmt_str = stringDate.split('+')[1];
                gmtServeur = parseInt(gmt_str) / 100;
            } else if (stringDate.indexOf('-') != -1) {
                var gmt_str = stringDate.split('-')[1];
                gmtServeur = (parseInt(gmt_str) / 100) * -1;
            }
            //Diff gmt in millisecond
            var gmtTotal = intDate + ((gmtServeur + (gmtCustomer * -1)) * 3600000);
            var myDate = new Date(gmtTotal);
            return myDate;
        } else
            return null;
    } catch (err) {
        return stringJsonDate;
    }
  }