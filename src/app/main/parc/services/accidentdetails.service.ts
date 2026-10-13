import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RepairMaintenanceLog, TypeMaintenance, _TypeMaintenance } from '../maintenance/department';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccidentdetailsService {
  private readonly API_URL = environment.apiUrl + '/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient) { }

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });

  }
  
  getAccidentdetailsParam()
  {
    // Declare and Initialize Params Object
   let params = {};
   params['SessionId'] = localStorage.getItem('SessionId');
   return      this.http.post(this.API_URL +
        'UIAccidentDetailsManagementWCFService.svc/GetUIAccidentDetailsManagementParam', JSON.stringify(params), this.httpOptions);         
   
  }

  getAccidentdetails(KeyTrackingObject: number)
  {
     // Declare and Initialize Params Object
   let params = {};
   params['SessionId'] = localStorage.getItem('SessionId');
   params['KeyTrackingObject'] = +KeyTrackingObject;

   return      this.http.post(this.API_URL +
        'UIAccidentDetailsManagementWCFService.svc/GetAccidentDetails', JSON.stringify(params), this.httpOptions);         
   
  }
  addAccidentDetails(KeyTrackingObject,id,placeString,data,file)
  {
    
    // Declare and Initialize Params Object
  let params = {};
  params['SessionId'] = localStorage.getItem('SessionId');
  params['KeyTrackingObject'] = KeyTrackingObject;
  params['IdAccidentDetails'] = id;
  params['AccidentStatusEnum'] = 1;
  params['AccidentDateGMT'] ='/Date(' + data.AccidentDateGMT.getTime() + ')/';
  params['AccidentStandardPlaceLocation'] = + data.AccidentLocationFullName;
  params['AccidentLocationFullName'] = placeString;
  params['AccidentReportRef'] = data.DossierReference;
  params['AccidentTypeEnum'] = data.AccidentType;
  params['Dammage'] = data.Dammage;
  params['Details'] = data.Details;
  params['IdDriver'] = data.FirstDriver;
  params['Attachment'] = file;
  params['InsurerNameA'] = data.InsuranceName != "null" ? data.InsuranceName : "-1" ;
  params['InsurerNameB'] = data.InsuranceName2;
  params['Injured'] = data.Injured;
  params['Otherdamage'] = data.OtherDamage;
  params['DriverB'] = data.Driver2;
  params['DriverBAdress'] = '';
  params['DriverBLicenseNumber'] = data.DriverLicenseExpirationDate;
  params['DriverLicenseExpirationDate'] = '/Date(' + data.AccidentDateGMT.getTime() + ')/';
  params['CarBType'] = data.Matricule;
  params['Latitude']=data.Lat;
  params['Longitude']=data.Long;
  return      this.http.post(this.API_URL +
       'UIAccidentDetailsManagementWCFService.svc/AddOrUpdateAccidentDetails', JSON.stringify(params), this.httpOptions);         
  
 }
 addRepairMaintenanceLog(typeMaintenance:RepairMaintenanceLog , car?:number, maintenance?: number, idAccident?: number){  
  // Declare and Initialize Params Object
  let params = {};
  params["SessionId"] = localStorage.getItem('SessionId');
  params["KeyTrackingObject"] = +car;
  params["MaintenanceId"] =  maintenance;
  params["AccidentDetailsId"] = idAccident;
  params["Cost"] = typeMaintenance.Cost;
  params["DateCompletionGMT"] ='/Date(' + typeMaintenance.DateCompletionGMT.getTime() + ')/';
  params["Description"] = typeMaintenance.Description;
  params["InvoiceReference"] = typeMaintenance.InvoiceReference;
  params["MileageCompletion"] = typeMaintenance.MileageCompletion;
  params["PaidCost"] = typeMaintenance.PaidCost;
  params["PaidDateGMT"] =  '/Date(' + typeMaintenance.PaidDateLocal.getTime() + ')/';
  params["Supplier"] = typeMaintenance.Supplier;
  params["EngineHoursCompletion"] = typeMaintenance.EngineHoursCompletion;

  return this.http.post(this.API_URL+ 'MaintenanceManagementWCFService.svc/AddRepairMaintenanceLog' , JSON.stringify(params) , this.httpOptions);
                     
}
// CloseAccidentDetailsImplementation adjust
closeAccidentDetailsImplementation(data: any) : Observable<any> {
  let params = {};
  /*
   MaintenanceTypeStr: new FormControl({value: this.repair.MaintenanceTypeStr,disabled: this.isDisabled}), // type d'entreien
          MaintenanceType: new FormControl(this.repair.MaintenanceType), // Id type d'entreien
          DateCompletionGMT: new FormControl(this.repair.DateCompletionGMT), // date d'achévement
          MileageCompletion: new FormControl(this.repair.MileageCompletion, [ Validators_.positiveNumberValidator(), Validators.required]), // kilométrage d'achévement
          EngineHoursCompletion: new FormControl(this.repair.EngineHoursCompletion, [ Validators_.positiveNumberValidator(), Validators.required]), // heures d'achévement
          Cost: new FormControl(this.repair.Cost,  [ Validators_.positiveNumberValidator(), Validators.required]), //Cout
          PaidCost: new FormControl(this.repair.PaidCost, [ Validators_.positiveNumberValidator(), Validators.required]),// Montant payé
          PaidDateLocal: new FormControl(this.repair.PaidDateLocal), // Date de payement 
          Description : new FormControl(this.repair.Description), // Descrition
          InvoiceReference : new FormControl(this.repair.InvoiceReference), // référence facture
          Supplier   : new FormControl(this.repair.Supplier), // fournisseur   
          Id   : new FormControl(this.repair.Id),
          Car   : new FormControl(this.repair.Car),    
  */
  params["SessionId"] = localStorage.getItem('SessionId');
  params["AccidentDetailsId"] = data.Id;
  params["Cost"] = data.Cost;
  params["CostString"] = data.Cost.toString();
  params["DateAvailableFromLocal"] = "";
  params["DateAvailableToLocal"] = "";
  params["DateCompletionGMT"] = '/Date(' + data.DateCompletionGMT.getTime() + ')/';
  params["DateCompletionLocal"] = "";
  params["Description"] = data.Description;
  params["EngineHoursCompletion"] = data.EngineHoursCompletion;
  params["IdAccidentDetails"] = data.Id;
  params["IdCarDocumentLog"] = -1;
  params["IdCarDocumentReminder"] = -1;
  params["IdMaintenance"] = -1;
  params["InvoiceReference"] = -1;
  params["KeyTrackingObject"] = data.Car;
  params["MaintenanceId"] = -1;
  params["MileageComplectionString"] = data.MileageCompletion.toString();
  params["MileageCompletion"] = data.MileageCompletion;
  params["PaidCost"] = data.PaidCost;
  params["PaidCostString"] = data.PaidCost.toString();
  params["PaidDateGMT"] = '/Date(' + data.PaidDateLocal.getTime() + ')/';
  params["PaidDateLocal"] = "";
  params["Supplier"] = data.Supplier;
  params["keyTrackingObject"] = data.Car;
  return this.http.post(this.API_URL+ 'UIAccidentDetailsManagementWCFService.svc/CloseAccidentDetailsImplementation' , JSON.stringify(params) , this.httpOptions);

}

  handleError(handleError: any): import("rxjs").OperatorFunction<TypeMaintenance, any> {
    throw new Error("Method not implemented.");
  }
 uploadAttachments(Id,filename,CurrentCustomer)
  {
    // Declare and Initialize Params Object
  let params = {};
  params['SessionId'] = localStorage.getItem('SessionId');
  params['IdAccidentDetails'] = Id;
  params['FileName'] = filename;
  params['idCustomer'] = CurrentCustomer;
 
  return      this.http.post(this.API_URL +
       'UIAccidentDetailsManagementWCFService.svc/UploadAttachments', JSON.stringify(params), this.httpOptions);         
  
 }
 deleteReport(KeyTrackingObject,id)
{
  // Declare and Initialize Params Object
let params = {};
params['SessionId'] = localStorage.getItem('SessionId');
params['KeyTrackingObject'] = KeyTrackingObject;
params['IdAccidentDetails'] = id;
return      this.http.post(this.API_URL +
  'UIAccidentDetailsManagementWCFService.svc/DeleteAccidentDetails', JSON.stringify(params), this.httpOptions);         
}

GetRepairMaintenanceLog(KeyTrackingObject,  IdAccidentDetails)
{
  // Declare and Initialize Params Object
let params = {};
params['SessionId'] = localStorage.getItem('SessionId');
params['KeyTrackingObject'] = KeyTrackingObject;
params['IdAccidentDetails'] = IdAccidentDetails;
return      this.http.post(this.API_URL +
  'UIAccidentDetailsManagementWCFService.svc/GetRepairMaintenanceLog', JSON.stringify(params), this.httpOptions);         
}
  updateStatus(KeyTrackingObject,id, result)
  {
     // Declare and Initialize Params Object
   let params = {};
   params['SessionId'] = localStorage.getItem('SessionId');
   params['KeyTrackingObject'] = KeyTrackingObject;
   params['IdAccidentDetails'] = id;
   params['AccidentStatusEnum'] = 2;
   params['Expertisesdate'] = '/Date(' + result.Expertisedate.getTime() + ')/';
   params['ExpertDecision'] = + result.ExpertDécision;
   params['EstimatedDamageCost'] = + result.Estimatedindemnisation;
   params['Damages'] = result.Dammage;

   return      this.http.post(this.API_URL +
        'UIAccidentDetailsManagementWCFService.svc/UpdateAccidentDetails', JSON.stringify(params), this.httpOptions);         
   
  }
  updateStatusContreExpertise(KeyTrackingObject,id, result)
  {
     // Declare and Initialize Params Object
   let params = {};
   params['SessionId'] = localStorage.getItem('SessionId');
   params['KeyTrackingObject'] = KeyTrackingObject;
   params['IdAccidentDetails'] = id;
   params['AccidentStatusEnum'] =  3;
   params['ContreExpertisedate'] = '/Date(' + result.ContreExpertisedate.getTime() + ')/';
   params['ContreExpertDecision'] = + result.ContreExpertDécision;
   params['ContreEstimatedDamageCost'] = + result.Estimatedindemnisation2;
   params['DamagesContreExpert'] = result.Dammage2;
  
   return      this.http.post(this.API_URL +
        'UIAccidentDetailsManagementWCFService.svc/UpdateAccidentDetailsContreExpertise', JSON.stringify(params), this.httpOptions);         
   
  }

  updateStatusReglement(KeyTrackingObject,id, result)
  {
     // Declare and Initialize Params Object
   let params = {};
   params['SessionId'] = localStorage.getItem('SessionId');
   params['KeyTrackingObject'] = KeyTrackingObject;
   params['IdAccidentDetails'] = id;
   params['AccidentStatusEnum'] = 4;
   params['Reglementdate'] = '/Date(' + result.Reglementdate.getTime() + ')/';
   params['Reglementdescription'] =  result.Reglementdescription;
   
   return      this.http.post(this.API_URL +
        'UIAccidentDetailsManagementWCFService.svc/UpdateAccidentDetailsReglement', JSON.stringify(params), this.httpOptions);         
   
  }
  updateStatusAchieved(KeyTrackingObject,id)
  {
     // Declare and Initialize Params Object
   let params = {};
   params['SessionId'] = localStorage.getItem('SessionId');
   params['KeyTrackingObject'] = KeyTrackingObject;
   params['IdAccidentDetails'] = id;
   params['AccidentStatusEnum'] = 5;
  
   
   return      this.http.post(this.API_URL +
        'UIAccidentDetailsManagementWCFService.svc/UpdateAccidentAchieved', JSON.stringify(params), this.httpOptions);         
   
  }
  
  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }
}
