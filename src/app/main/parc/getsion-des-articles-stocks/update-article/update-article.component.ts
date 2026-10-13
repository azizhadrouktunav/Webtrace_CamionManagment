import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { categoryModel, CustomerProductModel, ModelModel, stockParam, fornisseursModel, deptModel } from 'app/main/parc/interfaces/gestion_stock_module';
import { Observable } from 'rxjs/internal/Observable';
import { MatAutocomplete } from '@angular/material';
import { GestionStockService } from 'app/main/parc/getsion-des-articles-stocks/gestion-stock.service';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../i18n/en';
import { locale as french } from '../../i18n/fr';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.scss']
})
export class UpdateArticleComponent implements OnInit {
  profileForm = this.fb.group({
    Category: ['' ,Validators.required],//
    Model: ['' ,Validators.required],//
    Nom: ['', Validators.required],//
    refrence: [''],//Validators.required
    quantity: [''],
    lieu: [''],
    Constructeur: [''],
    Departement:[''],
    Serie:[''],
    Code:[''],
    Prix:[0],
    vente: [0],
    Dimension: [0],
    TVA: [0]
  });
  private _unsubscribeAll: Subject<any>;

  constructor(public dialogRef: MatDialogRef<UpdateArticleComponent>,private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public indata: any,private _service: GestionStockService,private _fuseTranslationLoaderService: FuseTranslationLoaderService,private translate: TranslateService) 
  {this._fuseTranslationLoaderService.loadTranslations(english, french); 
    this._unsubscribeAll = new Subject();
  }
  ActionType = 'Update';
  dialogTitle = 'Update Article';
  CategoryListe = [];
  ModelListe = [];
  CustomerList : CustomerProductModel[] = [];
  FullCategoryListe: categoryModel[]= [];
  FullModelListe : ModelModel[] = [];
  prompt = 'Press <enter> to add "';
  prompt1 = 'Press <enter> to add "';
  filteredOptions: Observable<any[]>;
  filteredOptionsModel: Observable<any[]>;
  showAddButton: boolean = false;
  showAddButton1: boolean = false;
  decompersed: any = [];
  ParamsData: stockParam[] = [];
  FornisseursList: fornisseursModel[] = [];
  DepartementList: deptModel[] = [];
  add_to_full_category_array : categoryModel;
  DATAacess ;
  CostumerID;
  Recieved_Object;
  isDisabled = true;
  dis = true;

  @ViewChild('typeInput' , {read:ElementRef , static:true}) typeInput: ElementRef<HTMLInputElement>;
  @ViewChild('ModelInput' , {read:ElementRef , static:true}) ModelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto'  , {read:String , static:true}) matAutocomplete: MatAutocomplete;
  ngOnInit() {
    //this.profileForm.get('Model').disable();
    this._service.onStockParamChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      this.CostumerID = this._service.CostumerID['Id'];
      this.DepartementList =  this._service.DepartementList;
    });

    this._service.onModelChanges
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      this.FullModelListe = data;
      this.ModelListe = this.FullModelListe.map(x => x.NameModel);
    });
    this._service.onCategoryChanges
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      this.FullCategoryListe = data;
      this.CategoryListe = this.FullCategoryListe.map(x => x.NameCategory);
    });
    this.FornisseursList = this._service.FornisseursList;
    
    this.filteredOptions = this.profileForm.get('Category').valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filter(value): this.CategoryListe.slice())
        );
    this.filteredOptionsModel = this.profileForm.get('Model').valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filterModel(value): this.ModelListe.slice())
        );  
      
      this.Recieved_Object=this.indata.SendData;
      this.patchForm(this.indata.SendData);
  }
  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  patchForm(object){
    
    this.profileForm.patchValue({
      Category: object[0]['Category'].NameCategory,
      Model: object[0]['Model'].NameModel,
      Nom: object[0]['Name'],
      refrence: object[0]['Reference'],
      quantity: '',
      lieu: object[0]['StoragePlace'],
      Constructeur: object[0]['Supplier'] != null ? object[0]['Supplier'].ID : '' , 
      Departement: object[0]['Department'] != null ? object[0]['Department'].Id  : '' ,
      Serie: object[0]['NumSerie'],
      Code: object[0]['BarCode'],
      Prix: object[0]['UnitPurchasePriceTTC'] || 0,
      vente: object[0]['UnitSellingPriceTTC'] || 0,
      Dimension: object[0]['Dimension'] || 0,
      TVA: object[0]['TVAInPercents'] || 0
    })
    this.profileForm.get('quantity').disable();
  }
  closeDialog(){
    this.dialogRef.close();
  }
  onaccept(){
     //----- Gettting category ID ----//
     let CategoryID = 0;
     CategoryID = this.FullCategoryListe.filter(x=> x.NameCategory === this.profileForm.value.Category)[0].ID;
     //----- Gettting Model ID ----//
     let ModelID = 0;
     ModelID = this.FullModelListe.filter(x=> x.NameModel === this.profileForm.value.Model)[0].ID;
    
    this._service.AddUpdateProduct(this.Recieved_Object[0]['ID'],this.CostumerID,this.profileForm.value.Departement,this.profileForm.value.Constructeur,CategoryID,ModelID,this.profileForm.value.refrence,this.profileForm.value.Nom,0,this.profileForm.value.Serie,this.profileForm.value.Code,this.profileForm.value.Prix,this.profileForm.value.TVA,this.profileForm.value.Dimension,this.profileForm.value.vente,this.profileForm.value.lieu);
      this.dialogRef.close();
  }
  optionSelected(option) {
    this.profileForm.get('Model').enable();
    for(let i =0;i<this.ModelListe.length;i++){
      this.ModelListe.splice(i,1);
    }
    this.FullModelListe.forEach(e=>{
      if(e.Category.NameCategory == option.value){
        this.ModelListe.push(e.NameModel);
      }
     console.log(); 
    });
    if (option.value.indexOf(this.prompt) === 0) {
      this.addOption();
    }
  }
  optionSelectedModel(option) {
    if (option.value.indexOf(this.prompt1) === 0) {
      this.addOptionModel();
    }
  }
  addOption() {
    let option = this.profileForm.get('Category').value;
    //this.removePromptFromOption(this.repairForm.get('MaintenanceType').value);
    if (!this.CategoryListe.some(entry => entry === option)) {
      this._service.AddCategory(option);
    }
  }
  addOptionModel() {
    let option = this.profileForm.get('Model').value;
    let CategoryNow = this.profileForm.get('Category').value;
    if(CategoryNow == ""){
    
    }else{
      if (!this.ModelListe.some(entry => entry === option)) {
       
        let nameCat;
        let IDCat;
        this.FullCategoryListe.forEach(e=>{
          if(e.NameCategory == CategoryNow){
            nameCat = e.NameCategory;
            IDCat = e.ID;
          }
        });
        this._service.AddModel(option,nameCat,IDCat);
      }
    }
  }
  private _filter(value: string): string[]{
    const filterValue = value.toLowerCase();
    let results =  this.CategoryListe.filter(option => option.toLowerCase().includes(filterValue));
    this.showAddButton = results.length === 0;
    return results
  }
  private _filterModel(value: string): string[]{
    const filterValue = value.toLowerCase();
    let results =  this.ModelListe.filter(option => option.toLowerCase().includes(filterValue));
    this.showAddButton1 = results.length === 0;
    return results
  }
  filterItems(name: string) {
    let results = this.CategoryListe.filter(item =>
      item.toLowerCase().indexOf(name.toLowerCase()) >= 0);

    this.showAddButton = results.length === 0;
    if (this.showAddButton) {
      results = [this.prompt + name + '"'];
    }

    return results;
  }
  filterItemsModel(name: string) {
    let results = this.ModelListe.filter(item =>
      item.toLowerCase().indexOf(name.toLowerCase()) >= 0);

    this.showAddButton1 = results.length === 0;
    if (this.showAddButton1) {
      results = [this.prompt1 + name + '"'];
    }

    return results;
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