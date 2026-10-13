import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { GestionStockService } from '../gestion-stock.service';
import { decrypt } from '../../Parc';
import { gestion_de_stock, stockParam, fornisseursModel, Beneficier, Beneficier1 } from '../../interfaces/gestion_stock_module';
import { Articles } from '../../../parc/interfaces/gestion_stock_module';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'protractor';
interface type {
  ID: string;
  Name: string;
}
@Component({
  selector: 'app-dailog-entrer-sortie-articles',
  templateUrl: './dailog-entrer-sortie-articles.component.html',
  styleUrls: ['./dailog-entrer-sortie-articles.component.scss']
})
export class DailogEntrerSortieArticlesComponent implements OnInit {
  typesList: type[]= [
    {ID: '1', Name: 'Entrée'},
    {ID: '2', Name: 'Sortie'}  
  ];
  ArticlesList: Articles[]=[];
  article: Articles[]=[
    {ID: '', Name: ''}
  ];
  ben: Beneficier[]=[
    {ID: '', Name: ''}
  ];
  profileForm = this.fb.group({
    type: ['1',Validators.required],
    Article: ['',Validators.required],
    Code: [''],
    Quantite: [0,Validators.min(1)],
    Beneficiaire: [''],
    Fournisseur: [''],
    prixUnitaire: ['',Validators.required],
    TVA: ['',Validators.required],
    Discount: ['',Validators.required]
  });
  private _unsubscribeAll: Subject<any>;
  constructor(public dialogRef: MatDialogRef<DailogEntrerSortieArticlesComponent>,@Inject(MAT_DIALOG_DATA) public indata: any,private _snackBar: MatSnackBar,private fb: FormBuilder,private _service: GestionStockService) {this._unsubscribeAll = new Subject();}
  decompersed: any = [];
  ProductList: gestion_de_stock[] = [];
  ParamsData: stockParam[] = [];
  FornisseursList: fornisseursModel[] = [];
  selected_Fornisseur;
  BeneficierList : Beneficier1[] = [];
  dialogTitle = 'Entrée/Sortie';
  Error_box = true;
  beneficiaireFournisseurTitle = false;
  initialData;
  costumerID;
  quantityItem = 0;

  ngOnInit() {
  this.profileForm.controls['Code'].disable();
  this.profileForm.controls['Article'].disable();
 
  this._service.onStockChanged
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe((data: any) => {
    this.ProductList = data;
    
  });
  this.BeneficierList = this._service.BeneficierList;
  this.FornisseursList = this._service.FornisseursList;
  this.costumerID = this._service.CostumerID['Id'];
  this.setDefaultFormData();
  }
  setDefaultFormData() {
    this.initialData = this.ProductList.filter(x => x.ID == this.indata.SendData)
    this.quantityItem = this._service.remainingQuantitiesList.filter(x => x.id == this.initialData[0]['ID'])
   
    this.profileForm.patchValue({
      Article: this.initialData[0]['ID'],
      Code: this.initialData[0]['BarCode'],
      Quantite: this.quantityItem[0]['value'],
      Beneficiaire: this.BeneficierList[0].ID,
      Fournisseur: this.FornisseursList[0].ID,
      prixUnitaire: this.initialData[0]['UnitPurchasePriceHT'],
      TVA: this.initialData[0]['TVAInPercents'],
      Discount: 0
    });
  }
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  closeDialog(){
    this.dialogRef.close();
  }
  onaccept(){
    let MvType;
    if(this.profileForm.value.type == '1'){
      MvType = 0;//Entree
    }else{
      MvType = 1;//Sortie
    }
    if((MvType == 1)&&(this.Check_if_quantities_enough(this.initialData[0]['ID']))){
      this.Error_box = false;
    }else{
      let beneficiaireId = 0
      let fournisseurId = 0
      MvType == 0 ? fournisseurId = this.profileForm.value.Fournisseur : beneficiaireId = this.profileForm.value.Beneficiaire
      this._service.AddMouvement(MvType,this.profileForm.value.Quantite,beneficiaireId,fournisseurId,this.costumerID,this.initialData[0]['ID'],this.profileForm.value.prixUnitaire,this.profileForm.value.TVA,this.profileForm.value.Discount).subscribe(data=>{
        if(data){
          MvType == 0 ? this._service.updateQuatities('add',this.profileForm.value.Quantite,this.initialData[0]['ID']) : this._service.updateQuatities('minus',this.profileForm.value.Quantite,this.initialData[0]['ID']);
          this.dialogRef.close(data);
        }else{
          this._snackBar.open('Try again plz! Error', '' , {
            duration: 2000,
             // here specify the position
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        } 
      },error=>{
        this._snackBar.open('Server Error', '' , {
          duration: 2000,
           // here specify the position
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      });
    }
    
  }
  Check_if_quantities_enough(product) {
    let test = false;
    if((this.quantityItem[0]['value'] - this.profileForm.value.Quantite) <= 0){
      test = true;
    }
    return test;
  }
  OnArticlechange(id){
    this.ProductList.forEach(e=>{
      if(id == e.ID){
        this.profileForm.patchValue({
          Code: e.BarCode,
          Quantite: e.RemainingQuantities,
        });
      }
    });
  }
  OnStatuschange(event){
    event == 0 ? this.beneficiaireFournisseurTitle = false : this.beneficiaireFournisseurTitle = true;
  }
  hide_alert_box(){
    this.Error_box = true;
  }
}
function json2array(json){
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function(key){
      result.push(json[key]);
  });
  return result;
}