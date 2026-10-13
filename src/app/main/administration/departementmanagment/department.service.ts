
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private readonly API_URL = environment.apiUrl + '/';
   empl = false;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
 
  ViewAllTrackingObkjects: boolean;
  TabDepartmentId: any[];
    

  constructor(private http: HttpClient) {
   
   }

   
    getDepartmentManagementParam(): Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     return      this.http.post(this.API_URL +
          'DepartmentManagementWCFService.svc/GetUIDepartmentManagementParamCompressed'
          , JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )               
     
    }
    AddDepartmentByName(result): Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['DepartmentName'] = result.value.Name;
     params['Type'] = + result.value.type;
     params['ParentDep'] =  result.value.type2 === "1" ? + result.value.Parentdep : + result.value.type2;

     return      this.http.post(this.API_URL +
          'DepartmentManagementWCFService.svc/AddDepartmentByName'
          , JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )               
     
    }
    UpdateDepartment(result,Id): Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
    
     params['SessionId'] = localStorage.getItem('SessionId');
     params['DepartmentKey'] = Id;
     params['DepartmentName'] =  result.value.Name;
     params['Type'] = + result.value.type;
     params['ParentDep'] =  result.value.type2 === "1" ? + result.value.Parentdep : + result.value.type2;

     return      this.http.post(this.API_URL +
          'DepartmentManagementWCFService.svc/UpdateDepartment'
          , JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )               
     
    }
    DeleteDepartment(transfert,IdDepartmentDestination,IdDepartmentSource): Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
    
     params['SessionId'] = localStorage.getItem('SessionId');
     params['IdDepartmentSource'] = IdDepartmentSource;
     params['IdDepartmentDestination'] =  transfert === true ? +IdDepartmentDestination : -1;

     return      this.http.post(this.API_URL +
          'DepartmentManagementWCFService.svc/DeleteDepartment'
          , JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )               
     
    }
  }