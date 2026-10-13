import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AlertConfigurationServiceService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  SessionId = [];
  //data = {SessionId: localStorage.getItem('SessionId')}
  private GeneralAlertURL = environment.apiUrl + '/AlertConfigurationWCFService.svc';
  private CommandeURL1 = environment.apiUrl + '/CommandWCFService.svc';

  onEquippementInfoCluster: BehaviorSubject<any>;
  public commandResponceData = new BehaviorSubject<any>({});
  FullCarList: any;
  paths = []; polygon = []; places = []; country = [];
  constructor( private _httpClient: HttpClient) {  this.onEquippementInfoCluster = new BehaviorSubject({});}

  get_Alerts() : Observable<any>{
    let data = {SessionId: localStorage.getItem('SessionId')}
    return this._httpClient.post(`${this.GeneralAlertURL}/GetUIAlertConfigurationParamCompressed`, JSON.stringify(data), this.httpOptions);
  }
  set_CommandResponceData(data){
    this.commandResponceData.next(data);
  }
  get_CommandResponceData(): Observable<boolean> {
    return this.commandResponceData.asObservable();
  }
  set_EquipementInfoData(data){
    this.onEquippementInfoCluster.next(data);
  }
  get_EquipementInfoData(): Observable<boolean> {
    return this.onEquippementInfoCluster.asObservable();
  }

ngOnDestroy()
{
  this.commandResponceData.next([]);
}
  /*---------------------------------Alert Section-------------------------------------*/
  /*---------------------------------General Section-------------------------------------*/
  ChangeDoorStatus( enable,equipement ){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipement,  
      Enable: enable, 
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeDoorAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeACCStatus( enable,equipement ){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipement,  
      Enable: enable, 
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeAccAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeSOSStatus( enable,equipement ){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipement,  
      Enable: enable, 
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeSOSAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeTowingStatus( enable,equipement ){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipement,  
      Enable: enable, 
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeTowingAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeBattryHardwareStatus( enable,equipement ){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipement,  
      Enable: enable, 
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeExternalBatRemovedHardAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeRPMOutOfRangeAlarm( enable,equipement,rpm ){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipement,  
      Enable: enable, 
      RPMThreshold: rpm
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeRPMOutOfRangeAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
   //------------------------------------------Temperature Section------------------------------------//
   DetectEngineTempOutOfRangeAlarm(enable,equipement,engineTemperature){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipement,
      Enable : enable,
      EngineTemperatureThresholdC: engineTemperature
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeEngineTemperatureOutOfRangeAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  //------------------------------------------Fuel Section---------------------------------------------//
  ChangeFuelStolenAlarm(enable,equipment,fuelPercentThreshold){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipment,
      Enable : enable,
      FuelPercentThreshold: fuelPercentThreshold
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeFuelStolenDetectionAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeFuelFuelLvlPercentforFillingAlarm(equipment,fuelPercentThreshold){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipment,
      FuelPercentThreshold: fuelPercentThreshold
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeFuelLevelPercent4FillingAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeHighFuelConsumptionAlarm(equipment,enable,theoriticalConsumptionL100Km){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Equipment: equipment,
      Enable : enable,
      TheoriticalConsumptionL100Km: theoriticalConsumptionL100Km
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeHighFuelConsumptionAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  //------------------------------------------Speed Section---------------------------------------------//
  ChangeExceedingTheSpeedLimitOnTunisianRoadAlarm(enable,equipement,speedLimitRangeOnTunisianRoad){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Enable: enable,
      Equipment: equipement,
      SpeedLimitRangeOnTunisianRoad: speedLimitRangeOnTunisianRoad
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeExceedingTheSpeedLimitOnTunisianRoadAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeOverSpeedAlarm(enable,enterDelay,equipement,enableBuzzer,overSpeedKmH,overSpeedPeriodicitySendingS){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Enable: enable,    
      EnterDelayTimeS: enterDelay,
      Equipment: equipement,
      OptionalEnableBuzzer: enableBuzzer,
      OverSpeedKmH: overSpeedKmH,
      OverSpeedPeriodicitySendingS: overSpeedPeriodicitySendingS
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeOverSpeedAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  //------------------------------------------Stop Section---------------------------------------------//
  ChangeHardSoftLongStoppedAlarm(enable,equipment,generateLongStopAlarmIfNoPositionSent,stopDetectionThresholdInSec){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Enable: enable,          
      Equipment: equipment,    
      GenerateLongStopAlarmIfNoPositionSent: generateLongStopAlarmIfNoPositionSent,
      StopDetectionThresholdInSec: stopDetectionThresholdInSec
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeHardSoftLongStoppedAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeHardStoppedAlarm(enable,equipment,stoppedReportDelayS){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Enable: enable,          
      Equipment: equipment,    
      StoppedReportDelayS: stoppedReportDelayS,
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeHardStoppedAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeStopDetectionWithAccONOffAlam(enable,equipment,isAccOn,timeThresholdInSec){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      Enable: enable,          
      Equipment: equipment,    
      IsAccOn: isAccOn,
      TimeThresholdInSec: timeThresholdInSec,
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeStopDetectionWithAccOnOffAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  //------------------------------------------Conduct section------------------------------------//

  ChangeExccedDrivingDetectionAlarm(enableBuzzer,equipment,exceedDrivingTimeDetectionThresholdInSecbool){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      EnableBuzzer: enableBuzzer,          
      Equipment: equipment,    
      ExceedDrivingTimeDetectionThresholdInSecbool: exceedDrivingTimeDetectionThresholdInSecbool
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeExccedDrivingDetectionAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
  ChangeHarshBrakingAccelarationAlarm(enable,equipment,accelarationSensibility,accelerationValueG,brakingSensibility,optionalEnableBuzzer){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      AccelerationSensibility: accelarationSensibility,
      AccelerationValueG: accelerationValueG,
      BrakingSensibility: brakingSensibility,
      Enable: enable,
      Equipment: equipment,
      OptionalEnableBuzzer: optionalEnableBuzzer, 
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeHarshBrakingAccelerationAlarmWithParams`, JSON.stringify(dataStruct), this.httpOptions);
  }
  //-------------------------------------------Goefencing section---------------------------------//
  //-------------GetPolygon data
  getWayPolygonPlace(){
    let data = {SessionId: localStorage.getItem('SessionId')}
    return this._httpClient.post(`${this.GeneralAlertURL}/GetWayPolygonPlaceElementParamSession`, JSON.stringify(data), this.httpOptions);
  }
  //-------------WayInOUT
  ChangeInOutWayPrdAlarm(distanceInM, enable, enableArming, enableDays, endDateTimeGMT, equipment, geomatricSharp, geometricShapeStatus, index, stratDateTimeGMT){
    if(geomatricSharp=="")
    geomatricSharp =0;
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      DistanceInM: distanceInM,
      Enable: enable,
      EnableArming: enableArming,
      EnableDayOfWeek: enableDays,
      EndDateTimeGMT: convertToJSONDate(endDateTimeGMT),
      Equipment: equipment,
      IdPlaceOrGeometricShape: geomatricSharp, 
      InOutGeometricShapeStatus: geometricShapeStatus,
      Index: index,
      StartDateTimeGMT: convertToJSONDate(stratDateTimeGMT)
    }
    return this._httpClient.post(`${this.CommandeURL1}/TryToChangeInOutWayPrdAlarm`, JSON.stringify(dataStruct), this.httpOptions);
  }
    //-------------City/Polygon InOUT
    ChangeInOutPolygonPrdAlarm(distanceInM, enable, enableArming, enableDays, endDateTimeGMT, equipment, geomatricSharp, geometricShapeStatus, index, stratDateTimeGMT){
      if(geomatricSharp=="")
      geomatricSharp =0;
      let dataStruct = {
        SessionId: localStorage.getItem('SessionId'),   
        DistanceInM: distanceInM,
        Enable: enable,
        EnableArming: enableArming,
        EnableDayOfWeek: enableDays,
        EndDateTimeGMT: convertToJSONDate(endDateTimeGMT),
        Equipment: equipment,
       
        IdPlaceOrGeometricShape: geomatricSharp, 
        InOutGeometricShapeStatus: geometricShapeStatus,
        Index: index,
        StartDateTimeGMT: convertToJSONDate(stratDateTimeGMT)
      }
      return this._httpClient.post(`${this.CommandeURL1}/TryToChangeInOutPolygonPrdAlarm`, JSON.stringify(dataStruct), this.httpOptions);
    }
    //-------------PlaceInOUT
    ChangeInOutPlacePrdAlarm(distanceInM, enable, enableArming, enableDays, endDateTimeGMT, equipment, geomatricSharp, geometricShapeStatus, index, stratDateTimeGMT){
      if(geomatricSharp=="")
      geomatricSharp =0;
      let dataStruct = {
        SessionId: localStorage.getItem('SessionId'),   
        DistanceInM: distanceInM,
        Enable: enable,
        EnableArming: enableArming,
        EnableDayOfWeek: enableDays,
        EndDateTimeGMT: convertToJSONDate(endDateTimeGMT),
        Equipment: equipment,
        IdPlaceOrGeometricShape: geomatricSharp, 
        InOutGeometricShapeStatus: geometricShapeStatus,
        Index: index,
        StartDateTimeGMT: convertToJSONDate(stratDateTimeGMT)
      }
    
      return this._httpClient.post(`${this.CommandeURL1}/TryToChangeInOutPlacePrdAlarm`, JSON.stringify(dataStruct), this.httpOptions);
    }
  //------------------------------------------Get Command Status---------------------------------//
  GetAddedOrChangedCommand(IdCommands){
    let dataStruct = {
      SessionId: localStorage.getItem('SessionId'),   
      IdCommands: IdCommands
    }
    return this._httpClient.post(`${this.CommandeURL1}/GetAddedOrChangedCommand`, JSON.stringify(dataStruct), this.httpOptions);
  }
}
