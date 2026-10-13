import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TireManagement, TireLog,DicoTransportation ,AxleWheelDefItems} from '../interfaces/tire-management';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TireManagementService {

    GetUrl = environment.apiUrl;
    GetTireUrl = this.GetUrl+'/TireManagementWCFServiceNtSoft.svc/GetTires';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
   
    constructor(private http: HttpClient) { }
    getTires(): Observable<TireManagement[]> {
       let  data = {
            SessionId: localStorage.getItem('SessionId')
        };
        return this.http.post<TireManagement[]>(this.GetTireUrl, JSON.stringify(data), this.httpOptions);
    }
    GetTireParamUrl = this.GetUrl + '/TireManagementWCFServiceNtSoft.svc/GetUITireManagementParamSession';
   
    getTireParam() {
        let  data = {
            SessionId: localStorage.getItem('SessionId')
        };
        return this.http.post(this.GetTireParamUrl, JSON.stringify(data), this.httpOptions);
    }
    GetUpdateTireUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/UpdateTire';
    UpdateTire(dataUpdate: TireManagement) {
       let dataParUpdate = {
            SessionId: localStorage.getItem('SessionId'),
           Id: dataUpdate.Id,
           CurrentInstalledCar: dataUpdate.CurrentInstalledCar,
           TireId: dataUpdate.TireId,
           Brand: dataUpdate.Brand,
           Size: dataUpdate.Size,
           Type: dataUpdate.Type,
           Cost: dataUpdate.Cost,
           PurchasedDate: "/Date("+ dataUpdate.PurchasedDateLocal.getTime() +")/",
           MileageWhenPurchased: dataUpdate.MileageWhenPurchased,
           DateExpiredWarranty: "/Date(" + dataUpdate.DateExpiredWarrantyLocal.getTime() + ")/",
           MileageExpiredWarranty: dataUpdate.MileageExpiredWarranty,
           TireCarStatusEnum: dataUpdate.TireCarStatus,
           HowIsObtainedEnum: dataUpdate.HowIsObtained,
           ItCanUseOnCar: dataUpdate.ItCanUseOnCar,
           CurrentHeightOfTreadWearInMm: dataUpdate.CurrentHeightOfTreadWearInMm,
           Dealer: dataUpdate.Dealer,
           TelDealer: dataUpdate.TelDealer,
           ContactNameDealer: dataUpdate.ContactNameDealer,
           CurrentInstalledAxleNbr: dataUpdate.CurrentInstalledAxleNbr,
           CurrentInstalledWheelEnum: dataUpdate.CurrentInstalledWheel
        };
        return this.http.post(this.GetUpdateTireUrl, JSON.stringify(dataParUpdate), this.httpOptions);
    }
    GetNewTireUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/AddTire';
    AddTire(dataNew: TireManagement): Observable<TireManagement>  {
        let dataParNewTire = {
            SessionId: localStorage.getItem('SessionId'),
            CurrentInstalledCar: 0,
            TireId: dataNew.TireId,
            Brand: dataNew.Brand,
            Size: dataNew.Size,
            Type: dataNew.Type,
            Cost: dataNew.Cost,
            PurchasedDate: "/Date(" + dataNew.PurchasedDateLocal.getTime() + ")/",
            MileageWhenPurchased: dataNew.MileageWhenPurchased,
            DateExpiredWarranty: "/Date(" + dataNew.DateExpiredWarrantyLocal.getTime() + ")/",
            MileageExpiredWarranty: dataNew.MileageExpiredWarranty,
            TireCarStatusEnum: 0,
            HowIsObtainedEnum: dataNew.HowIsObtained,
            ItCanUseOnCar: true,
            CurrentHeightOfTreadWearInMm: dataNew.CurrentHeightOfTreadWearInMm,
            Dealer: dataNew.Dealer,
            TelDealer: dataNew.TelDealer,
            ContactNameDealer: dataNew.ContactNameDealer,
            CurrentInstalledAxleNbr: 0,
            CurrentInstalledWheelEnum: 0
        };
        return this.http.post<TireManagement>(this.GetNewTireUrl, JSON.stringify(dataParNewTire), this.httpOptions);
    }
    GetDeleteTireUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/DeleteTire';
    DeleteTire(id: number) {
        let dataDelete = {
            SessionId: localStorage.getItem('SessionId'),
            IdTire:id
        };
        return this.http.post(this.GetDeleteTireUrl, JSON.stringify(dataDelete), this.httpOptions);
    }
    GetDeleteTireLogUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/DeleteTireLog';
    DeleteTireLog(IdTire: number,IdTireLog: number)
    {
        let dataDelete = {
            SessionId: localStorage.getItem('SessionId'),
            IdTire:IdTire,
            IdTireLog:IdTireLog
        };
        
        return this.http.post(this.GetDeleteTireLogUrl, JSON.stringify(dataDelete), this.httpOptions);
    }

    AddTireLog(TireLogNew: TireLog): Observable<TireLog> {
        let GetTireLogUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/AddTireLog';
        let dataTrireLog = {
            SessionId: localStorage.getItem('SessionId'),
            
            Tire: TireLogNew.Tire,
            OperationDateGmt:"/Date(" + TireLogNew.OperationDateGmt.getTime() + ")/",
            OperationType:TireLogNew.OperationType,
            OperationMileage:TireLogNew.OperationMileage,
            OperationCost:TireLogNew.OperationCost,
            OperationHeightOfTreadWearInMm:TireLogNew.OperationHeightOfTreadWearInMm,
            OperationPressure:TireLogNew.OperationPressure,
            IdCar:TireLogNew.Car,
            AxleNumberEnum:TireLogNew.AxleNumberEnum,
            WheelPositionEnum:TireLogNew.WheelPositionEnum,
            WorkOrderNumber:TireLogNew.WorkOrderNumber,
            AccountServiceBy:TireLogNew.AccountServiceBy,
            AccountWorkedBy:TireLogNew.AccountWorkedBy,
            Description:TireLogNew.Description,
            Comment:TireLogNew.Comment
        };
        return this.http.post<TireLog>(GetTireLogUrl, JSON.stringify(dataTrireLog), this.httpOptions);
    }
    UpdateTireLog(TireLogUpd: TireLog): Observable<TireLog>{
        let GetTireLogUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/UpdateTireLog';
        let dataTrireLog = {
            SessionId: localStorage.getItem('SessionId'),
            IdTireLog:TireLogUpd.Id,
            Tire: TireLogUpd.Tire,
            OperationDateGmt:"/Date(" + TireLogUpd.OperationDateLocal.getTime() + ")/",
            OperationType:TireLogUpd.OperationType,
            OperationMileage:TireLogUpd.OperationMileage,
            OperationCost:TireLogUpd.OperationCost,
            OperationHeightOfTreadWearInMm:TireLogUpd.OperationHeightOfTreadWearInMm,
            OperationPressure:TireLogUpd.OperationPressure,
            IdCar:TireLogUpd.Car,
            AxleNumberEnum:TireLogUpd.AxleNumberEnum,
            WheelPositionEnum:TireLogUpd.WheelPositionEnum,
            WorkOrderNumber:TireLogUpd.WorkOrderNumber,
            AccountServiceBy:TireLogUpd.AccountServiceBy,
            AccountWorkedBy:TireLogUpd.AccountWorkedBy,
            Description:TireLogUpd.Description,
            Comment:TireLogUpd.Comment
        };
        return this.http.post<TireLog>(GetTireLogUrl, JSON.stringify(dataTrireLog), this.httpOptions);
    }
    GetTireLogByTire(Id: number): Observable<TireLog[]> {
        let GetTireLogUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/GetTireLogByTire';
        let dataTrireLog = {
            SessionId: localStorage.getItem('SessionId'),
            IdTire: Id
        };
        return this.http.post<TireLog[]>(GetTireLogUrl, JSON.stringify(dataTrireLog), this.httpOptions);
    }
   
    UpdateCarAxleWheelDef(Transportation:DicoTransportation):Observable<DicoTransportation>{
            let GetUpdateCarAxleUrl = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/UpdateCarAxleWheelDef';
            let AxleWheelDefItems:AxleWheelDefItems={ 
               Axle1Enabled :Transportation.Axle1Enabled,
               Axle2Enabled:Transportation.Axle2Enabled,
            Axle3Enabled:Transportation.Axle3Enabled,
            Axle4Enabled:Transportation.Axle4Enabled,
            Axle5Enabled:Transportation.Axle5Enabled,
            Axle6Enabled:Transportation.Axle6Enabled,
            DualWheelAxle1:Transportation.DualWheelAxle1,
            DualWheelAxle2:Transportation.DualWheelAxle2,
            DualWheelAxle3:Transportation.DualWheelAxle3,
            DualWheelAxle4:Transportation.DualWheelAxle4,
            DualWheelAxle5:Transportation.DualWheelAxle5,
            DualWheelAxle6:Transportation.DualWheelAxle6
            };
           

            let dataUpdateAxle = {
                AxleWheelDefItems:AxleWheelDefItems,
                IdTransportation:Transportation.Key,
                SessionId: localStorage.getItem('SessionId')    
            };
            return this.http.post<DicoTransportation>(GetUpdateCarAxleUrl, JSON.stringify(dataUpdateAxle), this.httpOptions);

    }
    TireMount(Id: number,IdCar:number,CurrentInstalledAxleNbr:number,CurrentInstalledWheelEnum:number): Observable<TireManagement> {
        let GetTireMount = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/TireMount';
        let dataTrieMount = {
            SessionId: localStorage.getItem('SessionId'),
            Id: Id,
            IdCar:IdCar,
            CurrentInstalledAxleNbr:CurrentInstalledAxleNbr,
            CurrentInstalledWheelEnum:CurrentInstalledWheelEnum
        };
        return this.http.post<TireManagement>(GetTireMount, JSON.stringify(dataTrieMount), this.httpOptions);
    }
    TireRotation(Id: number,CurrentInstalledAxleNbr:number,CurrentInstalledWheelEnum:number): Observable<TireManagement> {
        let GetTireRotation = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/TireRotation';
        let dataTrieMount = {
            SessionId: localStorage.getItem('SessionId'),
            Id: Id,
            
            CurrentInstalledAxleNbr:CurrentInstalledAxleNbr,
            CurrentInstalledWheelEnum:CurrentInstalledWheelEnum
        };
        return this.http.post<TireManagement>(GetTireRotation, JSON.stringify(dataTrieMount), this.httpOptions);
    }
    TireDismount(Id: number): Observable<TireManagement> {
        let GetTireDismount = this.GetUrl +'/TireManagementWCFServiceNtSoft.svc/TireDismount';
        let dataTrieMount = {
            SessionId: localStorage.getItem('SessionId'),
            Id: Id
           
        };
        return this.http.post<TireManagement>(GetTireDismount, JSON.stringify(dataTrieMount), this.httpOptions);
    }
    GetTireLogByCar(IdCar:number):Observable<TireLog[]>{
        let GetTireLogByCarUrl= this.GetUrl+'/TireManagementWCFServiceNtSoft.svc/GetTireLogByCar';
        let dataTireLogByCar = {
            SessionId: localStorage.getItem('SessionId'),
            IdCar: IdCar          
        };
        return this.http.post<TireLog[]>(GetTireLogByCarUrl, JSON.stringify(dataTireLogByCar), this.httpOptions);
    }
    TestMvtLog() {
        let urltest = this.GetUrl +'/TrackingPageWCFServiceNewtonSoft.svc/SatatSession';
        let datatest = {}
        return this.http.post(urltest, JSON.stringify(datatest), this.httpOptions);
    }


}