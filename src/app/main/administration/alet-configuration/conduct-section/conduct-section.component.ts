import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/en';
import { locale as arab } from '../../../../navigation/i18n/en';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
@Component({
  selector: 'app-conduct-section',
  templateUrl: './conduct-section.component.html',
  styleUrls: ['./conduct-section.component.scss']
})
export class ConductSectionComponent implements OnInit {
  @Input() car : any;
  ConductorSection = new FormGroup({
    agressiveDriving: new FormControl(''),
    activateSirenalarmAgressiveDriving: new FormControl(''),
    accelerationSensibility: new FormControl(''),
    brakingSensibility: new FormControl(''),
    activateExcessDrivingTime: new FormControl(''),
    condactPeriod: new FormControl(''),
    activateSirenAlarmExcessDrivingTime: new FormControl('')
  });
  defaultParams;
  currentDate = new Date();
  brakingList = [{id:0,name:'Haute sensibité'},{id:1,name:'Moyenne sensibité'},{id:2,name:'Faible sensibité'}]
  constructor(private _service: AlertConfigurationServiceService,
    private _translateService: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _errorHandler: ErrorHandlerService) {this._fuseTranslationLoaderService.loadTranslations(english, french, arab); } 

  ngOnInit() {
    this._service.get_EquipementInfoData().subscribe((data)=>{
      if(data[0]){
        this.UpdateConduct(data[0]['info']);
        this.defaultParams = data[0]['info'];
      }
    })
  }
  UpdateConduct(CurrentInfo):void {
    this.ConductorSection.patchValue({ agressiveDriving: CurrentInfo['IsEnableHarshBrakingAccelerationAlarm'], activateSirenalarmAgressiveDriving: CurrentInfo['IsBuzzerActivatedInHarshBrakingAccelerationAlarm'], accelerationSensibility: CurrentInfo['DefaultOrRealAccelerationSensiblity'], brakingSensibility: CurrentInfo['DefaultOrRealBrakingSensiblity'], activateExcessDrivingTime: CurrentInfo['IsEnableExccedDrivingDetectionAlarm'] ,condactPeriod: this.currentDate, activateSirenAlarmExcessDrivingTime: CurrentInfo['IsBuzzerActivatedInExccedDrivingDetectionAlarm']});
    this.inputsDefaultStatus(CurrentInfo)
    this.inputsConfiguredByGPSStatus(CurrentInfo);
  }
  inputsConfiguredByGPSStatus(CurrentInfo: any) {
    if(CurrentInfo['IsHarshBrakingAccelerationAlarmCofiguredByGPRS']){
      this.ConductorSection.controls['agressiveDriving'].enable();
      this.enablingExccedDrivingAlarm();
    }
  }
  inputsDefaultStatus(CurrentInfo: any):void {
    CurrentInfo['IsEnableHarshBrakingAccelerationAlarm'] ? this.enablingHarshBrakingAccAlarm() : this.disactivateHarshBrakingAccAlarm();
    CurrentInfo['IsEnableExccedDrivingDetectionAlarm'] ? this.enablingExccedDrivingAlarm() : this.disactivateExccedDrivingAlarm();
  }
  disactivateHarshBrakingAccAlarm(){
    this.ConductorSection.controls['activateSirenalarmAgressiveDriving'].disable();
    this.ConductorSection.controls['accelerationSensibility'].disable();
    this.ConductorSection.controls['brakingSensibility'].disable();
  }
  enablingHarshBrakingAccAlarm(){
    this.ConductorSection.controls['activateSirenalarmAgressiveDriving'].enable();
    this.ConductorSection.controls['accelerationSensibility'].enable();
    this.ConductorSection.controls['brakingSensibility'].enable();
  }
  enablingExccedDrivingAlarm(){
    this.ConductorSection.controls['condactPeriod'].enable();
    this.ConductorSection.controls['activateSirenAlarmExcessDrivingTime'].enable();
  }
  disactivateExccedDrivingAlarm(){
    this.ConductorSection.controls['condactPeriod'].disable();
    this.ConductorSection.controls['activateSirenAlarmExcessDrivingTime'].disable();
  }
  changeAgressivedrivingStatus(event){
    event.checked? this.enablingHarshBrakingAccAlarm() : this.disactivateHarshBrakingAccAlarm();
  }
  changeExceessDrivingStatus(event){
    event.checked? this.enablingExccedDrivingAlarm() : this.disactivateExccedDrivingAlarm();
  }
  ConductorSabmit(form){
   
    if(this.defaultParams['HardwareSupportHarshBrakingAccelerationAlarm'] && this.defaultParams['IsHarshBrakingAccelerationAlarmCofiguredByGPRS']){
      this._service.ChangeHarshBrakingAccelarationAlarm(form.getRawValue().agressiveDriving,this.defaultParams['key'],form.getRawValue().accelerationSensibility,0,form.getRawValue().brakingSensibility,form.getRawValue().activateSirenAlarmExcessDrivingTime)
      .subscribe((excessDrivingTimeData)=>{
        if(excessDrivingTimeData){
          this._service.set_CommandResponceData(excessDrivingTimeData[0]);
        }
      },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
    }
    if(this.defaultParams['HardwareSupportExccedDrivingDetectionAlarm']){
      let excessDrivingTimeTimerPickerValue : Date = form.getRawValue().condactPeriod;
      let excessDrivingTimeInsec = 0;
      excessDrivingTimeInsec = (excessDrivingTimeTimerPickerValue.getHours() * 3600) + (excessDrivingTimeTimerPickerValue.getMinutes() * 60)
      this._service.ChangeExccedDrivingDetectionAlarm(form.getRawValue().activateSirenAlarmExcessDrivingTime,
      this.defaultParams['key'],excessDrivingTimeInsec)
      .subscribe((exccedDrivingDetectionData)=>{
        if(exccedDrivingDetectionData){
          this._service.set_CommandResponceData(exccedDrivingDetectionData);
        }
      },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
    }
  }
  ConductorDefault(){
    this.UpdateConduct(this.defaultParams);
  }
}
