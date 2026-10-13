import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import {Observable, BehaviorSubject} from 'rxjs';

import 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BorrowedRentalService {

     private readonly API_URL = environment.apiUrl + '/';
  borrowedRental: any[] = [];
  borrowedRentalCarContractManagementParam : any[] = [];
  onborrowedRentalChanged: BehaviorSubject<any>;
  onborrowedRentalCarContractManagementParamChanged: BehaviorSubject<any>;
  // tslint:disable-next-line: member-ordering
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
 

  constructor(private http: HttpClient) {
    this.onborrowedRentalChanged = new BehaviorSubject({});
    this.onborrowedRentalCarContractManagementParamChanged = new BehaviorSubject({});

   }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
            
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

   


  

    getBorrowedRentalCarContract(KeyTrackingObject: number)
    {
       // Declare and Initialize Params Object
     let params = {};
     params['keyTrackingObject'] = +KeyTrackingObject;
     params['SessionId'] = localStorage.getItem('SessionId');
     return      this.http.post(this.API_URL +
          'UIBorrowedRentalCarContractManagementService.asmx/GetBorrowedRentalCarContract', JSON.stringify(params), this.httpOptions);         
     
    }
    async  getBorrowedRentalCarContract2(KeyTrackingObject: number): Promise<any>
    {
       // Declare and Initialize Params Object
     let params = {};
     params['keyTrackingObject'] = +KeyTrackingObject;
     params['SessionId'] = localStorage.getItem('SessionId');        
     return await  new Promise((resolve, reject) => {
      this.http.post(this.API_URL +
        'UIBorrowedRentalCarContractManagementService.asmx/GetBorrowedRentalCarContract', JSON.stringify(params), this.httpOptions).subscribe((response: any) => {
                    this.borrowedRentalCarContractManagementParam = (response);
                    this.onborrowedRentalCarContractManagementParamChanged.next(this.borrowedRental);
                    resolve(response);
                }, reject);
        });
    }
    getUIBorrowedRentalCarContractManagementParam(): Promise<any>
    {
       // Declare and Initialize Params Object
     let params = {};
     params['SessionId'] = localStorage.getItem('SessionId');
        
     return new Promise((resolve, reject) => {
            this.http.post(this.API_URL + 'UIBorrowedRentalCarContractManagementWCFService.svc/GetUIBorrowedRentalCarContractManagementParam' , JSON.stringify(params) , this.httpOptions)
                .subscribe((response: any) => {
                    this.borrowedRentalCarContractManagementParam = (response);
                    this.onborrowedRentalCarContractManagementParamChanged.next(this.borrowedRental);
                    resolve(response);
                }, reject);
        });
    }
  addOrUpdateBorrowedRentalCarContract(KeyTrackingObject: number, BorrowedRentalCarContract: number,  data) : Observable<any>
  
  {
    let params = {};
   params['SessionId'] = localStorage.getItem('SessionId');
   params['keyTrackingObject'] = +KeyTrackingObject;
   params['BorrowedRentalCarContract'] = +BorrowedRentalCarContract;
   params['ContractTypeEnumInt'] = +data.Contract.ContractType;
   var ContractStartDateGMT = data.Contract.ContractStartDateGMT.getTime() + (1*60*60*1000);
   params['ContractStartDateGMT'] = '/Date(' + ContractStartDateGMT + ')/';
   var ContractEndDateGMT = data.Contract.ContractEndDateGMT.getTime() + (1*60*60*1000);
   params['ContractEndDateGMT'] = '/Date(' + ContractEndDateGMT + ')/';
   params['Cost'] = +data.Payment.ActivationCost;
   params['ActivationCost'] = +data.Payment.ActivationCost;
   params['FirstDriverInt'] = +data.Contract.FirstDriver;
   params['SecondDriverInt'] = +data.Contract.SecondDriver;
   params['WarnMeBeforeNDay'] = +data.Payment.WarnMeBeforeNDay;
   params['RecurringDateConfig'] = +data.Payment.foreach - 16;
   params['RecurringCost'] = +data.Payment.Paymentof;
   var Dateofentry = data.carentry.Dateofentry.getTime() + (1*60*60*1000);
   params['CarInDateGMT'] = '/Date(' + Dateofentry + ')/';
   params['OdometerInKm'] = +data.carentry.Mileage;
   var Dateofexit = data.carexit.Dateofexit.getTime() + (1*60*60*1000);
   params['CarOutDateGMT'] = '/Date(' + Dateofexit + ')/';
   params['OdometerOutKm'] = +data.carexit.Mileage2;
   params['ContractRef'] = + data.Contract.ContractRef;
   params['GazFuelLevelPercent'] = + data.Payment.GazFuelLevelPercent;
   params['EnableGenerateAlert'] = true;
   var Payment = data.Payment.From.getTime() + (1*60*60*1000);
   params['BeginStartRecurringDateGMT'] = '/Date(' + Payment + ')/';
   return     this.http.post(this.API_URL +
     'UIBorrowedRentalCarContractManagementWCFService.svc/AddOrUpdateBorrowedRentalCarContract', JSON.stringify(params), this.httpOptions);         

    }

    deleteCarContract(KeyTrackingObject:number ,BRCCId : number)
    {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["keyTrackingObject"] = +KeyTrackingObject;
      params["BRCCId"] = +BRCCId;
  
      
      return      this.http.post(this.API_URL +
        'UIBorrowedRentalCarContractManagementWCFService.svc/DeleteBRCC', JSON.stringify(params), this.httpOptions);         
  
    }

    confirmBorrowedRuntedEndOrRenewContractImplementation(KeyTrackingObject: number, BRCCId: number,  data)
    {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["keyTrackingObject"] = +KeyTrackingObject;
      params["idBRCC"] = +BRCCId;
      params["RenewdContract"] = data.buttonType;
      params["NextEndRenewdContractLocal"] =  '/Date(' + data.NextRenewDate.getTime() + ')/';

      
      return      this.http.post(this.API_URL +'UIBorrowedRentalCarContractManagementWCFService.svc/ConfirmBorrowedRuntedEndOrRenewContractImplementation', JSON.stringify(params), this.httpOptions);         
  
    }
    getBRCInvoice(KeyTrackingObject,BRCCId): Promise<any>
    {
       // Declare and Initialize Params Object
     let params = {};
     params['SessionId'] = localStorage.getItem('SessionId');
     params["keyTrackingObject"] = +KeyTrackingObject;
     params["BRCCId"] = +BRCCId; 
     return new Promise((resolve, reject) => {
            this.http.post(this.API_URL + 'UIBorrowedRentalCarContractManagementWCFService.svc/GetBRCInvoice' , JSON.stringify(params) , this.httpOptions)
                .subscribe((response: any) => {
                    this.borrowedRentalCarContractManagementParam = (response);
                    this.onborrowedRentalCarContractManagementParamChanged.next(this.borrowedRental);
                    resolve(response);
                }, reject);
        });
    }

   
    addBRCInvoice(KeyTrackingObject: number,idBRCC: number,  data)
    {let params = {};
     params['SessionId'] = localStorage.getItem('SessionId');
     params['keyTrackingObject'] = +KeyTrackingObject;
     params['idBRCC'] = +idBRCC;
     params['Cost'] = +data.Cost;
     params['DateInvoiceGMT'] = '/Date(' + data.DateInvoiceGMT.getTime() + ')/';
     params['InvoiceFromGMT'] = '/Date(' + data.InvoiceFromGMT.getTime() + ')/';
     params['InvoiceToGMT'] = '/Date(' + data.InvoiceToGMT.getTime() + ')/';
     params['OdometerInKm'] = +data.OdometerOutKm;
     params['PaidCost'] = +data.PaidCost;
     params['PaidDateGMT'] = '/Date(' + data.InvoiceFromGMT.getTime() + ')/';
     params['InvoiceRef'] = data.InvoiceRef;
    
     return     this.http.post(this.API_URL +
       'UIBorrowedRentalCarContractManagementWCFService.svc/AddBRCInvoice', JSON.stringify(params), this.httpOptions);         
  
      }
      updateBRCInvoice(KeyTrackingObject: number,idBRCC: number,  data, id: number)
      {let params = {};
       params['SessionId'] = localStorage.getItem('SessionId');
       params['keyTrackingObject'] = +KeyTrackingObject;
       params['idBRCC'] = +idBRCC;
       params['idBRCInvoice'] = +id;
       params['Cost'] = +data.Cost;
       params['DateInvoiceGMT'] = '/Date(' + data.DateInvoiceGMT.getTime() + ')/';
       params['InvoiceFromGMT'] = '/Date(' + data.InvoiceFromGMT.getTime() + ')/';
       params['InvoiceToGMT'] = '/Date(' + data.InvoiceToGMT.getTime() + ')/';
       params['OdometerInKm'] = +data.OdometerOutKm;
       params['PaidCost'] = +data.PaidCost;
       params['PaidDateGMT'] = '/Date(' + data.PaidDateGMT.getTime() + ')/';
       params['InvoiceRef'] = data.InvoiceRef;
      
       return     this.http.post(this.API_URL +
         'UIBorrowedRentalCarContractManagementWCFService.svc/UpdateBRCInvoice', JSON.stringify(params), this.httpOptions);         
    
        }  
        deleteBRCInvoice(KeyTrackingObject: number,idBRCC: number, id: number)
        {let params = {};
         params['SessionId'] = localStorage.getItem('SessionId');
         params['keyTrackingObject'] = +KeyTrackingObject;
         params['idBRCC'] = +idBRCC;
         params['idBRCInvoice'] = +id;
        
        
         return     this.http.post(this.API_URL +
           'UIBorrowedRentalCarContractManagementWCFService.svc/DeleteBRCInvoice', JSON.stringify(params), this.httpOptions);         
      
          } 
          
          adjustContract(KeyTrackingObject: number,idBRCC: number,  data): Observable<any>
             {   let params = {};
                  params['SessionId'] = localStorage.getItem('SessionId');
                  params['keyTrackingObject'] = +KeyTrackingObject;
                  params['idBRCC'] = +idBRCC;
                  params['Cost'] = +data.Cost;
                  params['DateInvoiceGMT'] = '/Date(' + data.DateInvoiceGMT.getTime() + ')/';
                  params['InvoiceFromGMT'] = '/Date(' + data.InvoiceFromGMT.getTime() + ')/';
                  params['InvoiceToGMT'] = '/Date(' + data.InvoiceToGMT.getTime() + ')/';
                  params['OdometerInKm'] = +data.OdometerOutKm;
                  params['PaidCost'] = +data.PaidCost;
                  params['PaidDateGMT'] = '/Date(' + data.PaidDateGMT.getTime() + ')/';
                  params['InvoiceRef'] = data.InvoiceRef;
      
       return this.http.post(this.API_URL +
         'UIBorrowedRentalCarContractManagementWCFService.svc/ConfirmBorrowedRuntedPaymentImplementation', JSON.stringify(params), this.httpOptions);         
    
        }  
}




