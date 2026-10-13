import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { environment } from 'environments/environment';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { json2array } from 'app/main/helpers/must-match.validator';
import { decrypt } from '../Parc';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FactureService implements Resolve<any>{
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
      
  httpOptions1 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'json'
    })
  }
  private MainURL = environment.apiUrl + "/BillsOrderAndDeliveryFormWCFServiceNtSoft.svc/";
  private getBillUrl = this.MainURL + 'GetListBillsCompressed'
  private getParamsUrl = this.MainURL + "GetBillsOrderAndDeliveryFormManagementParamSession"
  private deleteFactureUrl = this.MainURL + "DeleteBillsOrderAndDeliveryForm"
  private AddFactureUrl = this.MainURL + "AddOrUpdateBillsParm"
  onFactureChanged: BehaviorSubject<any>;
  onFactureParamChanged: BehaviorSubject<any>;
  facture: any[] = [];
  commands: any[] = [];
  params;
  Products:any[] = [];
  private data = {
      SessionId : localStorage.getItem('SessionId')
  };
  constructor(private http: HttpClient,private _httpClient: HttpClient, private _errorHandler : ErrorHandlerService, private _snackBar: MatSnackBar) { 
    this.onFactureChanged = new BehaviorSubject({});
    this.onFactureParamChanged = new BehaviorSubject({});
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getFactures(),
                //
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
  }
  errorHandler(error: HttpErrorResponse){
    // tslint:disable-next-line: deprecation
    return Observable.throw(error.message || 'Server Error');
  }

  getFactures():Promise<any>{
    return  new Promise((resolve, reject) => {
      this._httpClient.post(this.getBillUrl, JSON.stringify(this.data), this.httpOptions)
          .subscribe((response: any) => {

            this.facture = json2array(decrypt(response));
           // this.commands =  response['ListOrderForm'];
            /*this.commands.forEach(e =>{
              e['Reference'] = e['ReferenceOrderForm'];
              e['FactureDate'] = e['Date'];
            });
            this.facture = this.facture.concat(this.commands);*/
           
            this.onFactureChanged.next(this.facture);
            resolve(response);
            this.getParams()
          },
          (error: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);.handleError(error);
      }, reject);
    });
  }


  getParams(){
    return  new Promise((resolve, reject) => {
      this._httpClient.post(this.getParamsUrl, JSON.stringify(this.data), this.httpOptions)
          .subscribe((response: any) => {
           // let res =json2array(decrypt(response))
           let res= response;
            this.onFactureParamChanged.next(response);
            resolve(response);
          },
          (error: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);.handleError(error);
     }, reject);
    });
  }

  deleteFacture(data){ 
      return this.http.post(this.deleteFactureUrl,JSON.stringify(data),this.httpOptions)
  }
  deleteFactureFromLocalTable(data){// Check That...
    let index = this.facture.map(x => x.ID).indexOf(data);
    this.facture = this.facture.slice(index)
    this.onFactureChanged.next(this.facture);
  }
  addOrUpdateBill(data,oldBillData){
    return this.http.post(this.AddFactureUrl,JSON.stringify(data),this.httpOptions).subscribe(res =>{
      if(res) {
        if(oldBillData){
          this._snackBar.open('Facture modifiée !', '', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }else{
          this.facture.push(res);
          this.onFactureChanged.next(this.facture);
          this._snackBar.open('Facture ajoutée!', '', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
       this.getFactures();
      }
      else{
        this._snackBar.open('erreur de connexion', '', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

}
