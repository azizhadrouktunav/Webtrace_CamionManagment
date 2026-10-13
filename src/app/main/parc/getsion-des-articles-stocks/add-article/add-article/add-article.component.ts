import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Angular Reactive Form
import { FormGroup, FormBuilder, Validators, DefaultValueAccessor } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MatAutocomplete, MatSnackBar } from '@angular/material';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { decrypt } from 'app/main/parc/Parc';
import { GestionStockService } from '../../gestion-stock.service';
import { stockParam,categoryModel,deptModel,ModelModel,fornisseursModel,CustomerProductModel } from 'app/main/parc/interfaces/gestion_stock_module';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../i18n/en';
import { locale as french } from '../../../i18n/fr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {
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

  constructor(public dialogRef: MatDialogRef<AddArticleComponent>,private _matSnackBar: MatSnackBar,private fb: FormBuilder,private _service: GestionStockService,private _fuseTranslationLoaderService: FuseTranslationLoaderService,private translate: TranslateService) {this._fuseTranslationLoaderService.loadTranslations(english, french); this._unsubscribeAll = new Subject(); }
  ActionType = 'Add';
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
  fornisseursList: fornisseursModel[] = [];
  selected_Fornisseur;
  DepartementList: deptModel[] = [];
  selected_departement;
  add_to_full_category_array : categoryModel;
  CostumerID;
  beneficierList;
  dis = true;
  
  @ViewChild('typeInput' , {read:ElementRef , static:true}) typeInput: ElementRef<HTMLInputElement>;
  @ViewChild('ModelInput' , {read:ElementRef , static:true}) ModelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto'  , {read:String , static:true}) matAutocomplete: MatAutocomplete;
  ngOnInit() {
    this.profileForm.get('Model').disable();
    this.profileForm.get('quantity').disable();

    this._service.onStockParamChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
    
    });
    this.CostumerID = this._service.CostumerID['Id'];
    this.DepartementList =  this._service.DepartementList;
    this.fornisseursList = this._service.FornisseursList;
    this.DefaultValue()
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
  }
  DefaultValue() {
    if(this.fornisseursList.length>0)
    {
    this.selected_Fornisseur = this.fornisseursList[0].ID;
    this.selected_departement = this.DepartementList[0].Id
    }
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
      this._matSnackBar.open('Error in category name','', {
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        duration        : 2000
      });
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
  onaccept(){
   
    //----- Gettting category ID ----//
    let CategoryID = 0;
    this.FullCategoryListe.forEach(e=>{
      if(e.NameCategory == this.profileForm.value.Category){
        CategoryID = e.ID;
      }
    });
    //----- Gettting Model ID ----//
    let ModelID = 0;
    this.FullModelListe.forEach(e=>{
      if(e.NameModel == this.profileForm.value.Model){
        ModelID = e.ID;
      }
    });
   
  
    this._service.AddUpdateProduct(-1,this.CostumerID,this.profileForm.value.Departement,this.profileForm.value.Constructeur,CategoryID,ModelID,this.profileForm.value.refrence,this.profileForm.value.Nom,0,this.profileForm.value.Serie,this.profileForm.value.Code,this.profileForm.value.Prix,this.profileForm.value.TVA,this.profileForm.value.Dimension,this.profileForm.value.vente,this.profileForm.value.lieu);
    this.dialogRef.close();

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