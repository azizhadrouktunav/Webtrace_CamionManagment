
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
@Injectable({
  providedIn: 'root'
})
export class SmsmailconfigService {

  private readonly API_URL = environment.apiUrl + '/';
   empl = false;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
 
  

  constructor(private http: HttpClient) {
   

   }

   getAllTelNumbers() : Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/GetAllTelNumbers',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    getAllMails() : Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/GetAllMails',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    addMail(mail) : Observable<any[]>
    {
       // Declare and Initialize Params Object
       var Mail = { 
        MailAdress : mail.email , 
        Name: mail.Name 
        // DateDebut:mail.DateDebut,
        // DateFin:mail.DateFin
     }; 
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Mail'] = Mail;

     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/AddMail',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    updateMail(mail,idMail) : Observable<any[]>
    {
       // Declare and Initialize Params Object
       var Mail = { 
        MailAdress : mail.email , 
        Name: mail.Name 
     }; 
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Mail'] = Mail;
     params['idMail'] = idMail;

     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/UpdateMail',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'votre session est expirée!' );
            })
         )       
     
    }
    removeMail(mail) : Observable<any[]>
    {
       // Declare and Initialize Params Object
       var Mail = { 
        MailAdress : mail.email , 
        Name: mail.Name 
     }; 
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Mail'] = Mail;
     params['idMail'] = mail.Id;
     

     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/RemoveMail',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    addTelNumber(tel) : Observable<any[]>
    {
       // Declare and Initialize Params Object
       var TelNumber = { 
        Tel : tel.tel , 
        Name: tel.Name 
     }; 
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['TelNumber'] = TelNumber;

     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/AddTelNumber',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    updateTelNumber(tel,idTel) : Observable<any[]>
    {
       // Declare and Initialize Params Object
       var TelNumber = { 
        Tel : tel.tel , 
        Name: tel.Name 
     }; 
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['TelNumber'] = TelNumber;
     params['idTel'] = idTel;


     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/UpdateTelNumber',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    removeTelNumber(tel) : Observable<any[]>
    {
       // Declare and Initialize Params Object
       var TelNumber = { 
        Tel : tel.tel , 
        Name: tel.Name 
     }; 
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['TelNumber'] = TelNumber;
     params['idTel'] = tel.idTel;


     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/RemoveTelNumber',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }
    getAlertOrInputOptMailMailConfig(SerialNumber,IdMail)
    {
      
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Equipment'] = SerialNumber;
     params['IdMail'] = IdMail;

     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/GetConfAlertMail',
           JSON.stringify(params), this.httpOptions);
           
               
     
    }
    getAlertOrInputOptMailMailConfigManyEquip(SerialNumber,IdMail)
    {
      
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Equipment'] = SerialNumber;
     params['IdMail'] = IdMail;

     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/GetConfAlertMailManyEquip',
           JSON.stringify(params), this.httpOptions);
           
               
     
    }

    getCommonAlertOrInputOptTelSmsConfig(SerialNumber, IdTelNumber)
    {
      
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Equipment'] = SerialNumber;
     params['IdTelNumber'] = IdTelNumber;


     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/GetConfAlertSms',
           JSON.stringify(params), this.httpOptions);
           
               
     
    }
    getCommonAlertOrInputOptTelSmsConfigManyEquip(SerialNumber, IdTelNumber)
    {
      
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     params['Equipment'] = SerialNumber;
     params['IdTelNumber'] = IdTelNumber;


     return      this.http.post(this.API_URL +
           'TelMailManagementWCF.svc/GetConfAlertSmsManyEqui',
           JSON.stringify(params), this.httpOptions);
           
               
     
    }
    getAlertConfigurationParam() : Observable<any[]>
    {
       // Declare and Initialize Params Object
     let params = {};
     
     params['SessionId'] = localStorage.getItem('SessionId');
     return      this.http.post(this.API_URL +
          'AlertConfigurationWCFService.svc/GetUIAlertConfigurationParamCompressed',
           JSON.stringify(params), this.httpOptions).pipe(
            map((data: any[]) => {
              return data;
            }), catchError( error => {
              return throwError( 'data not found!' );
            })
         )       
     
    }

  UpdateOrSaveMailCfgList(ListConfigMailSms, ListSelectedEquip, idMail): Observable<any[]> {
    // Declare and Initialize Params Object
    let params = {};

    //

    params['SessionId'] = localStorage.getItem('SessionId');
    params['ListConfigMailSms'] = ListConfigMailSms;
    params['Equipments'] = ListSelectedEquip;
    params['idMail'] = idMail;

    return this.http.post(this.API_URL +
      'TelMailManagementWCF.svc/UpdateConfAlertMailSms',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  UpdateOrSaveSmsCfgList(ListConfigMailSms, ListSelectedEquip, idSms): Observable<any[]> {
    // Declare and Initialize Params Object
    let params = {};

    //

    params['SessionId'] = localStorage.getItem('SessionId');
    params['ListConfigMailSms'] = ListConfigMailSms;
    params['Equipments'] = ListSelectedEquip;
    params['idSms'] = idSms;

    return this.http.post(this.API_URL +
      'TelMailManagementWCF.svc/UpdateConfAlertSms',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  }