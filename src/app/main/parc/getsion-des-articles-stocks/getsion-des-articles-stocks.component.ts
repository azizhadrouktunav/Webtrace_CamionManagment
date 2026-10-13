import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';
import { GestionStockService } from './gestion-stock.service';
import { Parc,decrypt } from '../Parc';
import { gestion_de_stock } from '../interfaces/gestion_stock_module';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateArticleComponent } from './update-article/update-article.component';
import { AddArticleComponent } from './add-article/add-article/add-article.component';
import { DailogEntrerSortieArticlesComponent } from './dailog-entrer-sortie-articles/dailog-entrer-sortie-articles.component';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as french } from '../i18n/fr';
import { locale as arab } from '../i18n/ar';

import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

interface jsPDFWithPlugin extends jsPDF{
  autotable: (options: UserOptions) => jsPDF; 
}
@Component({
  selector: 'app-getsion-des-articles-stocks',
  templateUrl: './getsion-des-articles-stocks.component.html',
  styleUrls: ['./getsion-des-articles-stocks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),fuseAnimations
  ],
})
export class GetsionDesArticlesStocksComponent implements OnInit {

  title = "Article/Stock";
  indeterminate = true;
  encryptMode: boolean;
  textToConvert: string;
  password: string;
  conversionOutput: string;
  searchkey: string;
  private _unsubscribeAll: Subject<any>;

  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];
  decompersed: any = [];
  ProductList: gestion_de_stock[] = [];
  ProductListDisplays: gestion_de_stock[] = [];
  TableData : any;
  isDisabledDelete = true;
  constructor(private _service: GestionStockService,private _dialog: MatDialog,
    private _snackBar: MatSnackBar, 
    private _router: Router,private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _translate: TranslateService) {
      this._fuseTranslationLoaderService.loadTranslations(english, french, arab); 
      this._unsubscribeAll = new Subject();
    }
  public regExp = /\(([^)]+)\)/;
  visible = true;
  selectable = true;
  removable = true;

  ngOnInit() {
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
    this.encryptMode = true;
    this._service.onStockChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      this.ProductList = data;
      
      this.ProductListDisplays = data;
    });
  }
  ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
  addarticle(){
    const dialogConfig = new MatDialogConfig();

    let dialog_variable = this._dialog.open(AddArticleComponent,{...dialogConfig,panelClass: 'custom-dialog-container'});
    dialog_variable.afterClosed().subscribe(data=>{
    
      if(data != null){
      let firsttxt,Secondtxt;
      
      this._translate.get('NAV.add_article_msg1').subscribe((text:string) => {firsttxt =text});

        this._snackBar.open(firsttxt, '' , {
          duration: 2000,
          // here specify the position
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
      
    });
  }
  openLog(ID){
    this.textToConvert = ID + '';
    this.password = '22'
    this.conversionOutput = CryptoJS.AES.encrypt(this.textToConvert.trim(), this.password.trim()).toString();
   
    this._router.navigate(['/parc/app-articlestock/Movement_stock', this.conversionOutput]);//ID*/
   
  }
  onEdit(ID){
    const dialogConfig = new MatDialogConfig();
     let SendData = this.ProductList.filter(x => x.ID === ID);
     let dialogupdate_variable = this._dialog.open(UpdateArticleComponent,{
      ...dialogConfig,
      panelClass: 'custom-dialog-container',
      data: {
         // data I want to pass into the dialog
          SendData
      }
   });
  }
  openDialog(ID){
   
    const dialogRef = this._dialog.open(FuseConfirmDialogComponent,{
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = 'deleteMsg';
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDelete(ID);
        let Supptxt;
        this._translate.get('NAV.supp_article_msg').subscribe((text:string) => {Supptxt =text});
        /* this._snackBar.open(Supptxt, '' , {
          duration: 2000,
           // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        }); */
      }
    });
  }
  exportExcel(){
    var prepare_to_excel=[];
    let tem =[];
    tem.push('Nom du Produit');
    tem.push('Code a bar');
    tem.push('Categorie');
    tem.push('Modèle');
    tem.push('Référence');
    tem.push('Fournisseur');
    tem.push('Quantité');
    tem.push("Prix d'achat unitaire");
    tem.push('Prix de vente');
    tem.push('TVA(%)');
    prepare_to_excel.push(tem);
    this.ProductList.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.Name);
      tempObj.push(e.BarCode);
      e.Category != null ? tempObj.push(e.Category.NameCategory) : null;
      e.Model != null ? tempObj.push(e.Model.NameModel) : null;
      tempObj.push(e.Reference);
      e.Supplier != null ? tempObj.push(e.Supplier.Name) : null;
      tempObj.push(e.RemainingQuantities);
      tempObj.push(e.UnitPurchasePriceTTC);
      tempObj.push(e.UnitSellingPriceTTC);
      tempObj.push(e.TVAInPercents);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Product_List.xls', { bookType: 'xls', type: 'buffer' });
  }
  onDelete(Key){
    this._service.DeleteProduct(Key);
  }
  applyfilter(){
    //this.decompersed.filter = this.searchkey.trim().toLowerCase();
    if(this.searchkey != ''){
      this.ProductListDisplays = this.ProductList.filter(x => x.Name.trim().toLowerCase().includes(this.searchkey.trim().toLowerCase()));
      this.ProductListDisplays.length == 0 ? this.ProductListDisplays = this.ProductListDisplays.concat(this.ProductList.filter(x => x.Reference != null ? x.Reference.trim().toLowerCase().includes(this.searchkey.trim().toLowerCase()) : null)) : null;
      this.ProductListDisplays.length == 0 ? this.ProductListDisplays = this.ProductListDisplays.concat(this.ProductList.filter(x => x.Model != null ? x.Model.NameModel.trim().toLowerCase().includes(this.searchkey.trim().toLowerCase()) : null)) : null;
    }else{
      this.ProductListDisplays = this.ProductList
    }
  }
  downloadPdf() {
    var prepare=[];
    this.ProductList.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.Name);
      tempObj.push(e.BarCode);
      e.Category != null ? tempObj.push(e.Category.NameCategory) : null;
      e.Model != null ? tempObj.push(e.Model.NameModel) : null;
      tempObj.push(e.Reference);
      e.Supplier != null ? tempObj.push(e.Supplier.Name) : null;
      tempObj.push(e.RemainingQuantities);
      tempObj.push(e.UnitPurchasePriceTTC);
      tempObj.push(e.UnitSellingPriceTTC);
      tempObj.push(e.TVAInPercents);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des Produits', 78, 16); //default
    doc.autoTable({
        head: [['Nom du Produit','Code a bar','Categorie','Model','Reference','Fournisseur','Quantité',"Prix d'achat unitaire",
       'Prix de vente','TVA(%)']],
        body: prepare,
        startY: 20
    });
    doc.save('Product_List.pdf');
  }
}
