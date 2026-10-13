import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { debounce } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

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

   getUIAccountManagementParam() : Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     return      this.http.post(this.API_URL +
          'AccountManagerWCFService.svc/GetUIAccountManagementParam',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    addOrUpdateAccount(formdata,AccessDepartment,AccessSpeciality, tree,CurrentCustomerId, AccountId) : Observable<any[]>
    {

       // Declare and Initialize Params Object
       /* if(formdata.Department.ViewAllTrackingObkjects == "2")
       {this.ViewAllTrackingObkjects =  false;}
       else{this.ViewAllTrackingObkjects =  true;
        } */
        let ViewDepartmentOrSpecialty = false;
       switch(formdata.Department.ViewAllTrackingObkjects)
       {
        case "1": 
        this.ViewAllTrackingObkjects =  true;
        break;
        case "2":
          this.ViewAllTrackingObkjects =  false;
          ViewDepartmentOrSpecialty=false;
          break;
          case "3":
            this.ViewAllTrackingObkjects =  false;
            ViewDepartmentOrSpecialty=true;
            break;
       }
     let params = {};
     //
     params['SessionId'] = localStorage.getItem('SessionId');
     params['IdAccount'] = AccountId;
     params['Login'] = formdata.User.Login;
     params['Password'] = formdata.Password.password;
     params['TabDepartmentId'] =  this.ViewAllTrackingObkjects== false && ViewDepartmentOrSpecialty== false   ?AccessDepartment  : []
     params['TabPagesAccesibleId'] = tree;
     params['ViewAllTrackingObkjects'] = this.ViewAllTrackingObkjects;
     params['RoleAccountEnum'] = 6;
     params['CustomerId'] = CurrentCustomerId;
     params['FirstName'] = formdata.User.FirstName;
     params['LastName'] = formdata.User.LastName;
     params['AdminAcc'] = null; 
     params['region']= formdata.regionId == null ? 0 :formdata.regionId;
     params['ViewDepartmentOrSpecialty']= ViewDepartmentOrSpecialty;
     params['TabSpecialtyId']=  this.ViewAllTrackingObkjects == false  && ViewDepartmentOrSpecialty == true ? AccessSpeciality  :[];
        
     return      this.http.post(this.API_URL +
          'AccountManagerWCFService.svc/AddOrUpdateAccount',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError(error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    IsLoginExiste(Login : string) : Observable<any[]>
    {
      //
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Login'] = Login;

     
        
     return      this.http.post(this.API_URL +
          'AccountManagerWCFService.svc/IsLoginExiste',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }

    IsMaxAllowedAccountAchieved() : Observable<any[]>
    {
      
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
    
        
     return      this.http.post(this.API_URL +
          'AccountManagerWCFService.svc/IsMaxAllowedAccountAchieved',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    ChangePassword(newPassword,login) : Observable<any[]>
    {
      
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['LoginAccount'] =login;
     params['LastPassword'] = "";
     params['NewPassword'] = newPassword;

     return this.http.post(this.API_URL +
          'AccountManagerWCFService.svc/ChangePassword',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    deleteAccount(Login : string) 
    {
      
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['LoginAccount'] = Login;

     
     return      this.http.post(this.API_URL +
          'AccountManagerWCFService.svc/DeleteAccount',
           JSON.stringify(params), this.httpOptions);
    }
    
    
  }