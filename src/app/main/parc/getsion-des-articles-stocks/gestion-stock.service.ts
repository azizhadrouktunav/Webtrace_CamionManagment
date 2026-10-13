import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Supplier } from '../supplier-mngmnt/model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MatSnackBar } from '@angular/material';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { decrypt } from '../Parc';
import { json2array } from 'app/main/helpers/must-match.validator';

@Injectable({
  providedIn: 'root'
})
export class GestionStockService implements Resolve<any> {// 
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  SessionId = [];
 
  private GeneralURL = environment.apiUrl + '/ProductWCFServiceNtSoft.svc';
  private GeneralMouvementURL = environment.apiUrl + '/MouvmentWCFServiceNtSoft.svc';
  onStockChanged: BehaviorSubject<any>;
  onStockParamChanged: BehaviorSubject<any>;
  FullModelListe: any;
  onCategoryChanges: BehaviorSubject<any>;
  onModelChanges: BehaviorSubject<any>;
  BeneficierList: any;
  remainingQuantitiesList: any;
  constructor(private http: HttpClient,
  private _httpClient: HttpClient,      
  private _errorHandler : ErrorHandlerService,
  private _matSnackBar: MatSnackBar) 
  { 
    // ------------ Set the defaults
    this.onStockChanged = new BehaviorSubject({});
    this.onStockParamChanged = new BehaviorSubject({});
    this.onCategoryChanges = new BehaviorSubject([]);
    this.onModelChanges= new BehaviorSubject([]);
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.get_product(),
                //
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
  }
  stock;
  Params;
  CostumerID = []
  fullCategoryListe = []
  FornisseursList = []
  DepartementList = []

  get_product() :Promise<any>{

    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["FilteringType"] = 0;

  
    return  new Promise((resolve, reject) => {
      this._httpClient.post(`${this.GeneralURL}/GetObjectProductCompressed`, params, this.httpOptions)
          .subscribe((response: any) => {
            this.stock = decrypt(response);
            this.remainingQuantitiesList = this.stock.map(obj=> ({value: obj.RemainingQuantities, id: obj.ID}))
            this.onStockChanged.next(this.stock);                            
            resolve(response);
            this.get_Params()
          },
          (error: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);.handleError(error);
      }, reject);
    });
  }
  updateQuatities(staus,value,id){
    let newQuantity = 0;
    staus == 'add' ? newQuantity = this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value + value : newQuantity = this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value - value;
    this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value = newQuantity
  
    return newQuantity
  }
  updateQuatitiesFromUpdateMouvement(staus,value,id){
    staus == 'add' ? this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value  = this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value + value : this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value = this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value + value ;
    return this.remainingQuantitiesList[this.remainingQuantitiesList.findIndex(x => x.id == id)].value
  }
  get_DepObject(){
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    return this.http.post(`${this.GeneralURL}/GetObjectDepartmentCompressed`, params, this.httpOptions);
  }
  get_Params(){
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    return  new Promise((resolve, reject) => {
      this._httpClient.post(`${this.GeneralURL}/GetProductManagementParamSession`, params, this.httpOptions)
          .subscribe((response: any) => {

            this.Params = json2array(response);
            this.onStockParamChanged.next(this.Params);                
            this.CostumerID = this.Params[1]    
            this.DepartementList = this.Params[2]
            this.FornisseursList = this.Params[0]
            this.fullCategoryListe = this.Params[4]
            this.onCategoryChanges.next(this.fullCategoryListe);
            this.FullModelListe = this.Params[3]
            this.onModelChanges.next(this.FullModelListe);
            this.BeneficierList = this.Params[6];
            resolve(response);
          },
          (error: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);.handleError(error);
     }, reject);
    });
  }
  AddCategory(Name){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      Category :
      {Customer_ID: -1,
      ID: -1,
      NameCategory: Name}
    };
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.GeneralURL}/AddCategory`, JSON.stringify(data1), this.httpOptions)
          .subscribe(response => {
          if(response !== 'null'){
            
            this.fullCategoryListe.push(response);
            this.onCategoryChanges.next(this.fullCategoryListe);
            resolve(this.onCategoryChanges);
            this._matSnackBar.open('Caatégorie ajoutée avec succès','', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
          });
        }
        else{
                // Show the failure message
          this._matSnackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
          });
        }
      },
      error => {
        console.info(error);
        // Show the failure message
        this._matSnackBar.open('Server is Not Responding', 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
        });       
      })
    })
  }
  AddModel(NameModel,NameCategory,CategoryID){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      Model:{
      Category :
      {Customer_ID: -1,
      ID: CategoryID,
      NameCategory: NameCategory},
      Customer_ID: -1,
      ID: -1,
      NameModel: NameModel
      }   
      };
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.GeneralURL}/AddModel`, JSON.stringify(data1), this.httpOptions)
            .subscribe(response => {
              if(response !== 'null'){
                this.FullModelListe.push(response);
                this.onModelChanges.next(this.FullModelListe);
                resolve(this.onCategoryChanges);
                this._matSnackBar.open('Modèle ajouté avec succès','', {
                  // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
              });
              }
              else{
                  // Show the failure message
                this._matSnackBar.open('Server is Not Responding', 'OK', {
                    // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration        : 2000
                });
              }
            },
            error => {
              console.info(error);
              // Show the failure message
              this._matSnackBar.open('Server is Not Responding', 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
              });       
            })
      })
  }
  
  AddUpdateProduct(ID,IDCustomer,IDDepartement,IDSupplier,IDCategory,IDModel,reference,name,RQ,nbS,code,unitP,TVA,dim,unitS,place){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      Id: ID,
      IdCustomer: IDCustomer,
      IdDepartment: IDDepartement,
      IdSupplier: IDSupplier,
      IdCategory: IDCategory,
      IdModel: IDModel,
      Reference: reference,
      Name: name,
      RemainingQuantities: RQ,
      NumSerie: nbS,
      BarCode: code,
      UnitPurchasePriceTTC: unitP,
      TVAInPercents: TVA,
      Dimension: dim,
      UnitSellingPriceTTC: unitS,
      StoragePlace: place
      };
     
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.GeneralURL}/AddOrUpdateProductParm`, JSON.stringify(data1), this.httpOptions)
            .subscribe(response => {
              if(response !== 'null'){
               
                if(ID == -1){
                  this.stock.unshift(response);
                  this.onStockChanged.next(this.stock); 
                }else{
                  ///add here to update 
                  var index  = this.stock.map(x => {return x.ID}).indexOf(ID);
                  this.stock.splice(index, 1, response);
                  this.onStockChanged.next(this.stock); 
                }
                this._matSnackBar.open('Le produit a  été ajouté/modifié avec succès','', {
                  // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
              });
              }
              else{
                  // Show the failure message
                this._matSnackBar.open('Server is Not Responding', 'OK', {
                    // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  duration        : 2000
                });
              }
            },
            error => {
              console.info(error);
              // Show the failure message
              this._matSnackBar.open('Server is Not Responding', 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
              });       
            })
      })
  }
  DeleteProduct(Id){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      ID: Id
      };

    return this._httpClient.post(`${this.GeneralURL}/DeleteProduct`, JSON.stringify(data1), this.httpOptions).subscribe(data =>{
      
      if(data == true){
        var index  = this.stock.map(x => {return x.ID}).indexOf(Id);
        this.stock.splice(index, 1);
        this.onStockChanged.next(this.stock); 
        this._matSnackBar.open('Produit supprimé avec succès', '', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
        }); 
      }else{
        this._matSnackBar.open('Fail to delete the item try again', '', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
        });
      }
    },
    error => {
      console.info(error);
      // Show the failure message
      this._matSnackBar.open('Server is Not Responding', 'OK', {
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        duration        : 2000
      });       
    });
  }
  AddMouvement(type,quantity,Ben,Sup,Cost,Prod,prixUnitaire,TVA,Desc){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      MvtType: type,
      Quantity: quantity,
      IdBeneficiary: Ben,
      IdSupplier: Sup,
      IdProduct: Prod,
      IdMvt: 0,
      IdCustomer : Cost,
      PUHT: prixUnitaire,
      TVAInPercents: TVA,
      DiscountPercents: Desc
    };

    return this._httpClient.post(`${this.GeneralMouvementURL}/AddOrUpdateMouvmentParm`, JSON.stringify(data1), this.httpOptions);
  }
  updateMouvement(ID,type,quantity,Ben,Sup,Cost,Prod,prixUnitaire,TVA,Desc){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      MvtType: type,
      Quantity: quantity,
      IdBeneficiary: Ben,
      IdSupplier: Sup,
      IdProduct: Prod,
      IdMvt: ID,
      IdCustomer : Cost,
      PUHT: prixUnitaire,
      TVAInPercents: TVA,
      DiscountPercents: Desc
      };
     
    return this._httpClient.post(`${this.GeneralMouvementURL}/AddOrUpdateMouvmentParm`, JSON.stringify(data1), this.httpOptions);
  }
  GetMovement(Prod){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      Id_Product: Prod
    };

    return this._httpClient.post(`${this.GeneralMouvementURL}/GetMouvmentCompressed`, JSON.stringify(data1), this.httpOptions);
  }
  GetMovementbetween(Prod,Mouv,srtGMT,EndGMT){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      Id_Product: Prod,
      AllMovments: Mouv
      };

    return this._httpClient.post(`${this.GeneralMouvementURL}/GetMouvmentBetwenDateCompressed`, JSON.stringify(data1), this.httpOptions);
  }
  DeleteMouvment(Id){
    let data1 = {
      SessionId: localStorage.getItem('SessionId'),
      ID: Id
     };

    return this._httpClient.post(`${this.GeneralMouvementURL}/DeleteMouvment`, JSON.stringify(data1), this.httpOptions);
  }
}//MouvmentWCFServiceNtSoft   
