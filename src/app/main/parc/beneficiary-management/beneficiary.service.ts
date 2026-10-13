import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { decrypt } from '../Parc';
import { BenefManagementParam, Beneficiary } from './model';
import { isNullOrUndefined } from 'util';
import { mapValues, reject } from 'lodash';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  beneficiaries: Beneficiary[];
  onBeneficiariesChanged: BehaviorSubject<Beneficiary[]>;
  private REST_API_SERVER = environment.apiUrl
   // Http Header
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(
    private _httpClient: HttpClient,
    private errorHandler : ErrorHandlerService
){

   // Set the defaults
   this.onBeneficiariesChanged = new BehaviorSubject([]);
}

  /**
     * Get Beneficiaries
     *
     * @returns {Promise<any>}
     */
    getBenefaciaries(): Promise<any>
    {
      let params = {};
     // params["EndDateGMT"] = convertToJSONDate(end);
     params["SessionId"] = localStorage.getItem('SessionId');
     // params["StartDateGMT"] = convertToJSONDate(start);
        return new Promise((resolve, reject) => {

          this._httpClient.post<any>(this.REST_API_SERVER + '/BenefacaryWCFServiceNtSoft.svc/GetObjectBenefaciaryCompressed', params , this.httpOptions)
                    .subscribe((response: any) => {
                         this.beneficiaries =  Array.from(decrypt(response)).map(it => new Beneficiary(it));
                         this.onBeneficiariesChanged.next(this.beneficiaries);
                        resolve(this.beneficiaries);
                   },
                   (error: HttpErrorResponse) => {
                          //this.errorHandler.handleError(error);
                   }, 
                   reject);
          });
    }
 //GetBenefManagementParam
 getBenefManagementParam():Observable<any>{
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  return this._httpClient.post<any>(this.REST_API_SERVER + '/BenefacaryWCFServiceNtSoft.svc/GetBenefManagementParam', params, this.httpOptions)
  .pipe(
    map(res => res) ,
    catchError(this.handleError)
  );
 }
 // DeleteBenefaciary
 delete(id:number):Observable<Boolean>{
  let params = {};
  params["ID"] = id;
  params["SessionId"] = localStorage.getItem('SessionId');
  return this._httpClient.post<Boolean>(this.REST_API_SERVER + '/BenefacaryWCFServiceNtSoft.svc/DeleteBenefaciary', params, this.httpOptions)
  .pipe(
     data => data 
   ,
    catchError(this.handleError)
  );
 }
 // add or update v2
 addOrUpdateBeneficiary(beneficiary: Beneficiary, beneficiaryID : number = 0):Observable<Beneficiary>{
  let params = {};
  params["ID"] = beneficiaryID;
  params["SessionId"] = localStorage.getItem('SessionId');
  params["FirstName"] = beneficiary.FirstName;
  params["Adresse"] = beneficiary.Adresse;
  params["Email"] = beneficiary.Email;
  params["Telephone"] = beneficiary.Telephone
  params["Web"] = beneficiary.Web
  params["IdCustomer"] = beneficiary.IdCustomer
  params["SaveDate"] = convertToJSONDate(new Date())  
  return this._httpClient.post<any>(this.REST_API_SERVER + '/BenefacaryWCFServiceNtSoft.svc/AddOrUpdateBenefaciaryParm', params, this.httpOptions)
  .pipe(
    map(res => new Beneficiary(res)) ,
    catchError(this.handleError)
  );
 }
  // Error handling
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //this.errorHandler.handleError(error);
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}