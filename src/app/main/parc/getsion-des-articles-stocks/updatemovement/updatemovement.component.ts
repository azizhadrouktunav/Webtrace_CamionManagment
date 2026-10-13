import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Articles } from '../../../parc/interfaces/gestion_stock_module';
import { gestion_de_stock, stockParam, fornisseursModel, Beneficier, Beneficier1 } from '../../interfaces/gestion_stock_module';
import { FormBuilder, Validators } from '@angular/forms';
import { GestionStockService } from '../gestion-stock.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatSnackBar } from '@angular/material/snack-bar';
;

interface type {
  ID: any;
  Name: string;
}
@Component({
  selector: 'app-updatemovement',
  templateUrl: './updatemovement.component.html',
  styleUrls: ['./updatemovement.component.scss']
})
export class UpdatemovementComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  constructor(public dialogRef: MatDialogRef<UpdatemovementComponent>, @Inject(MAT_DIALOG_DATA) public indata: any,private _snackBar: MatSnackBar,private fb: FormBuilder,private _service: GestionStockService) { this._unsubscribeAll = new Subject();}
  Recieved_Object;
  typesList: type[]= [
    {ID: 0, Name: 'Entrée'},
    {ID: 1, Name: 'Sortie'}  
  ];
  ArticlesList: Articles[]=[];
  article: Articles[]=[
    {ID: '', Name: ''}
  ];
  ben: Beneficier[]=[
    {ID: '', Name: ''}
  ];
  decompersed: any = [];
  ProductList: gestion_de_stock[] = [];
  ParamsData: stockParam[] = [];
  FornisseursList: fornisseursModel[] = [];
  selected_Fornisseur;
  DATAacess ;
  CosID;
  BeneficierList : Beneficier1[] = [];
  dialogTitle = 'Entrée/Sortie';
  Error_box = true;
  isDisabled = true;
  quantityItem;
  profileForm = this.fb.group({
    type: ['',Validators.required],
    Article: ['',Validators.required],
    Code: [''],
    Quantite: ['',Validators.min(1)],
    Beneficiaire: ['',Validators.required],
    Fournisseur: ['',Validators.required],
    prixUnitaire: ['',Validators.required],
    TVA: ['',Validators.required],
    Discount: ['',Validators.required]
  });
  beneficiaireFournisseurSelector = false;
  oldQuantity;
  ngOnInit() {
    this.Recieved_Object=this.indata.SendData;
    
    this._service.onStockChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      this.ProductList = data;
    
    });
    this.BeneficierList = this._service.BeneficierList;
    this.FornisseursList = this._service.FornisseursList;
    this.quantityItem = this._service.remainingQuantitiesList.filter(x => x.id == this.indata.SendData.Product.ID)
    this.indata.SendData.Beneficiary ? this.patchFormBeneficiary() : this.patchFormSupplier();
    this.oldQuantity = this.indata.SendData.Quantity;
    this.profileForm.controls['Code'].disable();
    this.profileForm.controls['type'].disable();
    this.profileForm.controls['Article'].disable();
    this.setDefaultVue();
  }
  setDefaultVue() {
    this.indata.SendData.MvtType == 0 ? this.beneficiaireFournisseurSelector = false : this.beneficiaireFournisseurSelector=true;
  }
  OnStatuschange(event){
    event == 0 ? this.beneficiaireFournisseurSelector = false : this.beneficiaireFournisseurSelector = true;
  }
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  patchFormSupplier(){
    this.profileForm = this.fb.group({
      type: this.indata.SendData.MvtType,
      Article: this.indata.SendData.Product.ID,
      Code: this.indata.SendData.Product.BarCode,
      Quantite: this.indata.SendData.Quantity,
      Beneficiaire: this.BeneficierList[0].ID,
      Fournisseur: this.indata.SendData.Supplier.ID,
      prixUnitaire: this.indata.SendData.PUHT,
      TVA: this.indata.SendData.TVAInPercents,
      Discount: this.indata.SendData.DiscountPercents
    }); 
  }
  patchFormBeneficiary(){
    this.profileForm = this.fb.group({
      type: this.indata.SendData.MvtType,
      Article: this.indata.SendData.Product.ID,
      Code: this.indata.SendData.Product.BarCode,
      Quantite: this.indata.SendData.Quantity,
      Beneficiaire: this.indata.SendData.Beneficiary.ID,
      Fournisseur: this.FornisseursList[0].ID,
      prixUnitaire: this.indata.SendData.PUHT,
      TVA: this.indata.SendData.TVAInPercents,
      Discount: this.indata.SendData.DiscountPercents
    }); 
  }
  onaccept(){
    if(((this.profileForm.value.Quantite - this.indata.SendData.RequestedQuantities) > this.quantityItem[0]['value'])&&(this.profileForm.value.type == 1)){
      this.Error_box = false;
    }else{
      let beneficiaireId = 0
      let fournisseurId = 0
      this.indata.SendData.MvtType == 0 ? fournisseurId = this.profileForm.value.Fournisseur : beneficiaireId = this.profileForm.value.Beneficiaire
     
      this._service.updateMouvement(this.indata.SendData.ID,this.indata.SendData.MvtType,this.profileForm.value.Quantite,beneficiaireId,fournisseurId,this.indata.SendData.Customer.Id,this.indata.SendData.Product.ID,this.profileForm.value.prixUnitaire,this.profileForm.value.TVA,this.profileForm.value.Discount).subscribe(data=>{
        if(data){// Check update quantity 
          this.indata.SendData.MvtType == 0 ? this._service.updateQuatitiesFromUpdateMouvement('add', this.profileForm.value.Quantite-this.oldQuantity   ,this.indata.SendData.Product.ID) : this._service.updateQuatitiesFromUpdateMouvement('minus',this.profileForm.value.Quantite-this.oldQuantity ,this.indata.SendData.Product.ID);
        
          this.dialogRef.close(data);
        }else{
          this._snackBar.open('Try again plz! Error', '' , {
            duration: 2000,
             // here specify the position
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      },error =>{
        this._snackBar.open('Server Error', '' , {
          duration: 2000,
           // here specify the position
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      });
    }
  }
  closeDialog(){
    this.dialogRef.close();
  }
  hide_alert_box(){
    this.Error_box = true;
  }
}
