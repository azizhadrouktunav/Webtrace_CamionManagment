import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { decrypt } from '../Parc';
import { catchError, map } from 'rxjs/operators';
import { Supplier } from './model';
@Injectable({
  providedIn: 'root'
})
export class SupplierService implements Resolve<any> {
  
  suppliers: any = [];
  onSuppliersUpdated: Subject<any>;
  private REST_API_SERVER = environment.apiUrl
  // Http Header
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
   /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient
  ) {
    // Set the defaults
    this.onSuppliersUpdated = new Subject()
   }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :  Observable<any> | Promise<any> | any{
   return new Promise((resolve, reject) => {
     Promise.all([
        this.getSuppliers()
     ]).then(([suppliers] : [any]) => {
       resolve();
     },
     reject)
   })
  }

  getSuppliers() : Promise<any>
  { 
    let params = {}
    params["SessionId"] = localStorage.getItem('SessionId');
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(this.REST_API_SERVER + '/SupplierManagerWCFService.svc/GetObjectSupplierCompressedSession', params, this.httpOptions)
       .subscribe((response: any) => {
        this.suppliers = decrypt(response)
        this.onSuppliersUpdated.next(this.suppliers)
        resolve(this.suppliers)
      }, reject)
    })
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
    console.log(errorMessage);
    return throwError(errorMessage);
 }
 // add or update
 addOrUpdate(IsAdd: boolean , supplier? : Supplier):Observable<Supplier>
    {
  let params = {};
  params["IsAdd"] = IsAdd
  params["Supplier"] = supplier
  params["SessionId"] = localStorage.getItem('SessionId');
  return this._httpClient.post<any>(this.REST_API_SERVER + '/SupplierManagerWCFService.svc/AddOrUpdateSupplier', params, this.httpOptions)
  .pipe(
    map(res =>new Supplier(res)) ,
    catchError(this.handleError)
  );
   }
 // delete
delete(IdSupplier:number):Observable<Boolean>{
  let params = {};
  params["IdSupplier"] = IdSupplier;
  params["SessionId"] = localStorage.getItem('SessionId');
  return this._httpClient.post<Boolean>(this.REST_API_SERVER + '/SupplierManagerWCFService.svc/DeleteSupplier', params, this.httpOptions)
  .pipe(
     data => data 
   ,
    catchError(this.handleError)
  );
 }
}
