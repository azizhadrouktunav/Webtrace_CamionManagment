import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GestionStockService } from 'app/main/parc/getsion-des-articles-stocks/gestion-stock.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';
import { decrypt } from 'app/main/parc/Parc';
import { gestion_de_stock, operation } from 'app/main/parc/interfaces/gestion_stock_module';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../../../navigation/i18n/en';
import { locale as french } from '../../../../../navigation/i18n/fr';
import { locale as arab } from '../../../../../navigation/i18n/ar';
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { UpdatemovementComponent } from '../../updatemovement/updatemovement.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DailogEntrerSortieArticlesComponent } from '../../dailog-entrer-sortie-articles/dailog-entrer-sortie-articles.component';
import { error } from 'protractor';
import { UserOptions } from 'jspdf-autotable';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { DatePipe } from '@angular/common';

interface jsPDFWithPlugin extends jsPDF{
  autotable: (options: UserOptions) => jsPDF; 
}
@Component({
  selector: 'app-movement-stock',
  templateUrl: './movement-stock.component.html',
  styleUrls: ['./movement-stock.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),fuseAnimations
  ],
})
export class MovementStockComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  constructor(private dialog: MatDialog,private snackBar: MatSnackBar,private _service: GestionStockService,private _Activatedroute:ActivatedRoute,private _fuseTranslationLoaderService: FuseTranslationLoaderService,private translate: TranslateService) {this._fuseTranslationLoaderService.loadTranslations(english, french, arab);// Set the private defaults
    this._unsubscribeAll = new Subject();  }
  id;
  displayedColumns: string[] = ['type','quantity','PUHT','Remise','TVA','PUTTC','Clienttype','actions'];//
  listdata: MatTableDataSource<any>;  
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator,null) paginator: MatPaginator;
  searchkey: string;
  decompersed: any = [];
  ProductTitle;
  encryptMode: boolean;
  textToConvert: string;
  password: string;
  conversionOutput: string;
  ngOnInit() {
    let cryptedID=this._Activatedroute.snapshot.paramMap.get("id");
    
     this.textToConvert = cryptedID + '';
     this.password = '22';
     this.conversionOutput = CryptoJS.AES.decrypt(this.textToConvert.trim(), this.password.trim()).toString(CryptoJS.enc.Utf8);
    this.id = this.conversionOutput;
    this._service.GetMovement(this.id).subscribe(data =>{
        this.decompersed = decrypt(data);
       
        if(this.decompersed.length > 0){
          this.listdata = new MatTableDataSource(this.decompersed);
          this.listdata.sort = this.sort;
          this.listdata.paginator = this.paginator;
          
          this.ProductTitle = this.decompersed[0]['Product']['Name'];
        }/*else{
        this.snackBar.open('Can not found any data', '' , {
          duration: 2000,
           // here specify the position
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }*/
    });
  }
  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
  onEdit(Id){
   
    const dialogConfig = new MatDialogConfig();
     let SendData;
     this.decompersed.forEach(e=>{
      if(e.ID == Id){
        SendData = e;
      }
    });
    let dialogupdate_variable = this.dialog.open(UpdatemovementComponent,{
      ...dialogConfig,
      panelClass: 'custom-dialog-container',
      data: {
         // data I want to pass into the dialog
          SendData
          
      }
   });
   dialogupdate_variable.afterClosed().subscribe(data=>{
     if(data){
        let index  = this.decompersed.map(x => {return x.ID}).indexOf(data.ID);
      this.decompersed.splice(index, 1, data);
      this.listdata = new MatTableDataSource(this.decompersed);
      let firsttxt;
      this.translate.get('NAV.edit_Mov_msg').subscribe((text:string) => {firsttxt =text});

      this.snackBar.open(firsttxt, '' , {
        duration: 2000,
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right'
      });
     }
    });
  }
  onDelete(key){
  
   var index = this.decompersed.map(x => {return x.ID}).indexOf(key);
   
    
    this._service.DeleteMouvment(key).subscribe(data=>{
      if(data){
        this.decompersed.splice(index, 1);
        this.listdata = new MatTableDataSource(this.decompersed);
       
        this.snackBar.open('L\'action a été supprimer', '' , {
          duration: 2000,
           // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      }else{
        this.snackBar.open('L\'action non compté', '' , {
          duration: 2000,
           // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      }
    }, error=>{
      this.snackBar.open('Error de serveur', '' , {
        duration: 2000,
         // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right'
      });
    });
  }
  onfilterClear(){
    this.searchkey = "";
  }
  applyfilter(){
    this.listdata.filter = this.searchkey.trim().toLowerCase();
  }
  openDialog(Id){
   
    let firsttxt,oui,nn;
    this.translate.get('NAV.supp_msg').subscribe((text:string) => {firsttxt =text});
    this.translate.get('NAV.Oui').subscribe((text:string) => {oui =text});
    this.translate.get('NAV.Non').subscribe((text:string) => {nn =text});

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent,{
      disableClose: false});
      dialogRef.componentInstance.confirmMessage = firsttxt;
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDelete(Id);
      }
    });
  }
  add_Out_in(){
    let SendData = this.id;
    const dialogConfig = new MatDialogConfig();
    let dialogupdate_variable = this.dialog.open(DailogEntrerSortieArticlesComponent,{...dialogConfig,
      panelClass: 'custom-dialog-container',
      data: {
        // data I want to pass into the dialog
        SendData
     }
    });
    dialogupdate_variable.afterClosed().subscribe(data=>{
      if(data != null){
        this.decompersed.push(data);
        this.listdata = new MatTableDataSource(this.decompersed);
      }
    });
  }
  downloadPdf(){
    var prepare=[];
    let ProductName = ''
    this.decompersed.forEach(e=>{
      //var ActionDate = new Date(parseInt(e.ActionDate.substr(6)));
      var tempObj =[];
      ProductName = e.Product.Name
      tempObj.push(e.MvtTypeStr);
      tempObj.push(e.RequestedQuantities);
      tempObj.push(e.PUHT);
      tempObj.push(e.TVAInPercents);
      tempObj.push(e.DiscountPercents);
      tempObj.push(e.PUTTC);
      const datepipe: DatePipe = new DatePipe('en-US')
     // tempObj.push(datepipe.transform(ActionDate, 'DD-MMM-YYYY HH:mm:ss'));
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des mouvement du ' + ProductName, 65, 16); //default
    doc.autoTable({
        head: [['Type','Quantité','Prix Unitaire','TVA(%)','Remise(%)','Prix total']],
        body: prepare,
        startY: 20
    });
    doc.save('Mouvement_List_of_'+ProductName+'.pdf');
  }
  exportExcel(){
    var prepare_to_excel=[];
    let tem =[];
    let ProductName = ''
    tem.push('Type');
    tem.push('Quantité');
    tem.push('Prix Unitaire');
    tem.push('TVA(%)');
    tem.push('Remise(%)');
    tem.push('Prix total');

    prepare_to_excel.push(tem);
    this.decompersed.forEach(e=>{
     // var ActionDate = new Date(parseInt(e.ActionDate.substr(6)));

      var tempObj =[];
      ProductName = e.Product.Name
      tempObj.push(e.MvtTypeStr);
      tempObj.push(e.RequestedQuantities);
      tempObj.push(e.PUHT);
      tempObj.push(e.TVAInPercents);
      tempObj.push(e.DiscountPercents);
      tempObj.push(e.PUTTC);

      const datepipe: DatePipe = new DatePipe('en-US')
      //tempObj.push(datepipe.transform(ActionDate, 'DD-MMM-YYYY HH:mm:ss'));
            prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Mouvement_List_of_'+ProductName+'.xls', { bookType: 'xls', type: 'buffer' });
  }
}
