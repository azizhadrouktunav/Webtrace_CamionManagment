import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatSnackBar, MatTableDataSource } from '@angular/material';
import { Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FactureService } from '../facture.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.scss']
})

export class AddFactureComponent implements OnInit {
    step = 0;
    listdata: MatTableDataSource<any>; 
    today:Date = new Date();
    dialogTitle : string;
    ActionType: string;
    disabled;
    color;
    touchUi;
    stepSecond;
    stepMinute;
    showSeconds;
    showSpinners;
    stepHour;
    panelOpenState;
   
    currentType = 0; currentProduct;
    MainForm = this.fb.group({
        MvtType: [0 ,Validators.required],
        FactureID: ["" ,Validators.required],//
        FactureDate: [new Date()],
        Beneficiary: [''],
        Supplier: [''],
        Fiscal: [0],//
        BonLivraison: [],
        BonCommands: [],
        Type:['2',Validators.required],
        Objet: [""],
        isSynchronisatedWhitStock: true
    });
    ProductsForm = this.fb.group({
        ID:[0],
        Piece:['',Validators.required],
        PieceName:['',],
        Quantity:[0,[Validators.required,Validators.min(1)]],
        PUHT:[0,[Validators.required,Validators.min(1)]],
        TVA:[0,Validators.required],
        PUTTC:[0,Validators.required],
        Remise:[0,Validators.required]
    });
    PrixTotal:any = 0;
    OtherForm = this.fb.group({
        state: [0],
        CDreglement: [0],
        deadLine:[new Date()],
        nextDeadLine:[new Date()],
        Rest:[0],
        Montant:[0],
        MDreglement: [0],
        ModeDeReglement:[0],
        Payed:[0]
    })
    ProductsTable:MatTableDataSource<any> = new MatTableDataSource<any>();
    private _unsubscribeAll: Subject<any>;
    displayedColumns: string[] = ['Piece', 'quantites', 'PUHT', 'Remise', 'TVA', 'PUTTC','actions'];
    customerInfo:any;

    Benifs : any[] = []
    Suppliers : any[] = []
    Products: any[] = []
    added : any
    disabled1 : any
    mvtType: any[] = [
        {
            name: 'Entrée',
            id: 0
        },
        {
            name: 'Sortie',
            id: 1
        }
    ]
    States : any[] = [
        {
            label : "Non payé",
            value: 0
        },
        {
            label : "Payé",
            value: 1
        },
        {
            label : "En attente de payement",
            value: 2
        },
        {
            label : "en cours de payement",
            value: 3
        },
        {
            label : "Livré",
            value: 4
        }]
    Reglement : any[] = [
        {
            label : "Payement immédiat",
            value: 0
        },
        {
            label : "15 jours",
            value: 1
        },
        {
            label : "30 jours",
            value: 2
        }]
    models : any[] = [
        {
            label : "Payement en une tranche",
            value: 0
        },
        {
            label : "Payement en 2 tranches",
            value: 1
        },
        {
            label : "Payement en 3 tranches",
            value: 2
        }]
    Modes : any[] = [
        {
            label : "Espèce",
            value: 0
        },
        {
            label : "Chéque",
            value: 1
        },
        {
            label : "Virement",
            value: 2
        }];
    livraisons :any[] = [];
    commands :any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public _billData: any,
      public dialog: MatDialog,
      private _service: FactureService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AddFactureComponent>,
      private _snackBar : MatSnackBar
      ) {
        this._unsubscribeAll = new Subject();
        }
    ngOnInit() {
       // let t= this._service.Products;
      this._service.onFactureParamChanged
       .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
           
            this.customerInfo = data.Customer;
            data["ListBeneficiary"].forEach((item , index)=>{
                var tmp = {
                    "name" : item["FirstName"],
                    "id" : item["ID"]
                }
                if(!this.Benifs.includes(tmp))
                this.Benifs[index] = tmp;
            })
            data["ListSupplier"].forEach((item , index)=>{
                var tmp = {
                    "name" : item["Name"],
                    "id" : item["ID"]
                }
                //if(!this.Suppliers.includes(tmp))
               // this.Suppliers[index] = tmp;
            })
            this.Suppliers=  data["ListSupplier"];
  
            data["ListProduct"].forEach((item,index)=>{
                var exist = false;
                this._service.Products.forEach((it,id)=>{
                    if(it.Reference == item.Reference){
                        exist = true;
                    }
                });
                if(!exist){
                    this._service.Products.push(item);
                }
                this.Products = this._service.Products;
               
            });
            console.log(this.Benifs)
            this.MainForm.patchValue({
              Beneficiary: this.Benifs[0].id,
              Supplier: this.Suppliers[0].id
            })
        })
        this._service.onFactureChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any[]) => {
            this.livraisons = data.filter(x => x.Type == 1);
            this.commands = data.filter(x => x.Type == 0);
        })
        if(this._billData != null){
            this.dialogTitle = "Modifier une facture";
            this.ActionType = "Modifier";
           
            this.setDefaultBillData();
        }else{
            this.dialogTitle = "Ajouter une facture";
            this.ActionType = "Ajouter";
        }
        let table;
        table = {
            "Reference" : "null"
        }
        this.listdata = new MatTableDataSource(table);
    }

    setDefaultBillData():void{
        let stringDate = this._billData.FactureDate + '';
        let t=  this._billData;
        this.MainForm.patchValue({MvtType: this._billData.MvtType,
            Beneficiary: this._billData.Beneficiary ? this._billData.Beneficiary.ID : 0,
            Supplier: this._billData.Supplier ? this._billData.Supplier.ID : 0,
            Fiscal: this._billData.TaxStamp,
            Type: this._billData.Type + '',
            Objet: this._billData.Object,
            isSynchronisatedWhitStock: this._billData.SynchronizationWithMovment,
            FactureID: this._billData.Reference,
            FactureDate: stringDate ? new Date(stringDate.substring(0,10)) : new Date(),
        })

        this._billData.ListDetailsBills.forEach(row=>{
            this.ProductsTable.data.push({
                "Id": row.ID,
                "Piece": row.Product.Name,
                "PieceId":row.Product.ID,
                "quantites": row.Quantity,
                "PUHT": row.PUHT,
                "Remise": row.DiscountPercents,
                "TVA": row.TVAInPercents,
                "PUTTC": row.PTTC
            });
        })
    }

    addProduct(e,data){
        e.stopPropagation();
        this.ProductsForm.controls['Piece'].enable();
        let prod=this._service.Products.find(x=>x.ID==data.value.Piece);
        let RemainingQuantities = this._service.Products.find(x=>x.ID==data.value.Piece).RemainingQuantities;
        let idx=this._service.Products.findIndex(x=>x.ID==data.value.Piece);
        if(data.value.ID !=0)
        {
           
           
            if(RemainingQuantities+this.ProductsTable.data.find(x=>x.PieceId==data.value.Piece).quantites>=data.value.Quantity ||this.MainForm.value.MvtType == 0)
            {
            this.ProductsTable.data[idx].quantites=data.value.Quantity;
            this.ProductsTable.data[idx].PUHT=data.value.PUHT;
            this.ProductsTable.data[idx].TVA=data.value.TVA;
            this.ProductsTable.data[idx].PUTTC=data.value.PUTTC;
            this.ProductsTable.data[idx].Remise=data.value.Remise;
            }
            else
            {
                this._snackBar.open('stock insuffisant !', '', {
                    duration: 5000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                });
            }
        }
        else
        {
            if(RemainingQuantities>=data.value.Quantity ||this.MainForm.value.MvtType == 0)
            {
                this.ProductsTable.data.push({
                    "Id": 0,
                    "Piece": prod.Name,
                    "PieceId":data.value.Piece,
                    "quantites": data.value.Quantity,
                    "PUHT": data.value.PUHT,
                    "Remise": data.value.Remise,
                    "TVA": data.value.TVA,
                    "PUTTC": data.value.PUTTC
                });
            }
            else
            {
                this._snackBar.open('stock insuffisant !', '', {
                    duration: 5000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                });
            }
        }
        this.MainForm.value.MvtType == 1 ? this._service.Products[idx]['RemainingQuantities'] -= this.ProductsForm.value.Quantity : this._service.Products[idx]['RemainingQuantities'] += this.ProductsForm.value.Quantity;
      
        
        this.PrixTotal+=(this.ProductsForm.value.PUTTC);
        this.ProductsTable.data = this.ProductsTable.data;
        this.ProductsForm.controls['Piece'].setValue(0);
        this.ProductsForm.controls['PieceName'].setValue('');
        this.ProductsForm.controls['Quantity'].setValue(0);
        this.ProductsForm.controls['PUHT'].setValue(0);
        this.ProductsForm.controls['TVA'].setValue(0);
        this.ProductsForm.controls['PUTTC'].setValue(0);
        this.ProductsForm.controls['Remise'].setValue(0);
       /* this.ProductsForm.value.Piece=0;
        this.ProductsForm.value.PieceName='';
        this.ProductsForm.value.Quantity=0;
        this.ProductsForm.value.PUHT=0;
        this.ProductsForm.value.TVA=0;
        this.ProductsForm.value.PUTTC=0;
        this.ProductsForm.value.Remise=0;*/

      /*  if((this.ProductsForm.value.Quantity <= this._service.Products[index]['RemainingQuantities'])||(this.MainForm.value.MvtType == 0)){
            this.ProductsTable.data.push({
                "Id": this.currentProduct[0]['ID'],
                "Piece": this.currentProduct[0]['Name'],
                "quantites": this.ProductsForm.value.Quantity,
                "PUHT": this.ProductsForm.value.PUHT,
                "Remise": this.ProductsForm.value.Remise,
                "TVA": this.ProductsForm.value.TVA,
                "PUTTC": this.ProductsForm.value.PUTTC
            });
            this.PrixTotal+=(this.ProductsForm.value.PUTTC);
            this.ProductsTable.data = this.ProductsTable.data;
            this.MainForm.value.MvtType == 1 ? this._service.Products[index]['RemainingQuantities'] -= this.ProductsForm.value.Quantity : this._service.Products[index]['RemainingQuantities'] += this.ProductsForm.value.Quantity;
        }else{
            this._snackBar.open('vous avez atteint les limites de votre stock', '', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
        }*/
    }
    editProduct(row)
    {
        //
        this.ProductsForm.patchValue({
            ID:row.Id,
            Piece:row.PieceId,
            PieceName:row.Piece,
        Quantity:row.quantites,
        PUHT:row.PUHT,
        TVA:row.TVA,
        PUTTC:row.PUTTC,
        Remise:row.Remise

           
        })
        this.ProductsForm.controls['Piece'].disable();
    }
    deleteProduct(row){
        this.PrixTotal-=(row.PUTTC);
        this.ProductsTable.data.splice(this.ProductsTable.data.indexOf(row),1)
        this.ProductsTable.data = this.ProductsTable.data;
    }
    onClear(){
        this.dialogRef.close(); 
    }
    addOrUpdateBill(){
        let listDetails = []
        this.ProductsTable.data.forEach(e => {
            listDetails.push(
                {
                Product_ID: e.PieceId,
                Quantity: e.quantites,
                TVAInPercents: e.TVA,
                PUHT: e.PUHT,
                DiscountPercents: e.Remise,
                ID:e.Id
            })    
        });
        let data = {
            "SessionId": localStorage.getItem('SessionId'),
            "type": +this.MainForm.value.Type,
            "Reference": this.MainForm.value.FactureID,
            "Object": this.MainForm.value.Objet,
            "MvtType": this.MainForm.value.MvtType,
            "IdBeneficiaryOrSupplier": this.MainForm.value.MvtType == 1 ? this.MainForm.value.Beneficiary : this.MainForm.value.Supplier,
            "SynchronizationWithMovment": this.MainForm.value.isSynchronisatedWhitStock,
            "Id": this._billData ? this._billData.ID : 0,
            "date": convertToJSONDate(this.MainForm.value.FactureDate),
            "IdDeliveryForm": this.MainForm.value.BonLivraison != null ? this.MainForm.value.BonLivraison : 0,
            "TaxStamp": this.MainForm.value.Fiscal,
            "ListDetails": listDetails,
            "OrderForm_ID": this.MainForm.value.BonCommands != null ? this.MainForm.value.BonCommands : 0,
            "IdCustomer": this.customerInfo.Id
        }
        this._service.addOrUpdateBill(data,this._billData);
        this.onClear()
    }
    changeMvtType(type){
        this.currentType = type;
    }
    onSelectProduct(product){
        this.currentProduct = this._service.Products.filter(x => x.ID == product);
        this.ProductsForm.patchValue({
            Quantity: this.currentProduct[0]['RemainingQuantities'] != null ? this.currentProduct[0]['RemainingQuantities'] : 0,
            PUHT: this.currentProduct[0]['UnitPurchasePriceHT'] != null ? this.currentProduct[0]['UnitPurchasePriceHT'] : 0,
            TVA: this.currentProduct[0]['TVAInPercents'] != null ? this.currentProduct[0]['TVAInPercents'] : 0,
            PUTTC: this.currentProduct[0]['UnitPurchasePriceTTC'] != null ? this.currentProduct[0]['UnitPurchasePriceTTC'] : 0
        })
    }
    typeChange(event){
      switch(event.value) { 
        case "0": { 
            this.MainForm.controls['BonLivraison'].disable()
            this.MainForm.controls['BonCommands'].disable()
           break; 
        } 
        case "1": { 
            this.MainForm.controls['BonLivraison'].disable()
            this.MainForm.controls['BonCommands'].enable()
           break; 
        } 
        default: { 
            this.MainForm.controls['BonLivraison'].enable()
            this.MainForm.controls['BonCommands'].enable()
           break; 
        } 
      } 
    }
    changeTTC(){
      if((this.ProductsForm.value.Quantity != null) && (this.ProductsForm.value.PUHT != null) && (this.ProductsForm.value.TVA != null) && (this.ProductsForm.value.Remise != null))
        this.ProductsForm.patchValue({PUTTC: ((this.ProductsForm.value.Quantity * this.ProductsForm.value.PUHT - ((this.ProductsForm.value.Quantity * this.ProductsForm.value.PUHT) * this.ProductsForm.value.Remise / 100)) + ((this.ProductsForm.value.Quantity * this.ProductsForm.value.PUHT) * this.ProductsForm.value.TVA / 100))})
    }
}
