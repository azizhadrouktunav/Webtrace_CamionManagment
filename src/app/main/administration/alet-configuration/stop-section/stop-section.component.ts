import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/en';
import { locale as arab } from '../../../../navigation/i18n/en';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-stop-section',
  templateUrl: './stop-section.component.html',
  styleUrls: ['./stop-section.component.scss']
})
export class StopSectionComponent implements OnInit {
  @Input() car : any;
  StopSection = new FormGroup({
    activateStoplongperiodAlarm: new FormControl(''),
    stopTimeLimit: new FormControl(''),
    GenerateAlertWhitoutSendPosition: new FormControl(''),
    activateHardStoppedAlarm: new FormControl(''),
    stopPeriodTime: new FormControl(''),
    activateStopAlarmWithContactOnOff: new FormControl(''),
    StopWithContactOnOffPeriod: new FormControl(''),
    addMotorStatusOnAlarm: new FormControl('')
  });
  defaultParams;
  currentDate = new Date();
  constructor(private _service: AlertConfigurationServiceService,private _translateService: TranslateService,private _fuseTranslationLoaderService: FuseTranslationLoaderService) {this._fuseTranslationLoaderService.loadTranslations(english, french, arab); }

  ngOnInit() {
    this._service.get_EquipementInfoData().subscribe((data)=>{
      if(data[0]){
        this.UpdateStop(data[0]['info']);
        this.defaultParams = data[0]['info'];
      }
    })
  }
  UpdateStop(CurrentInfo):void {
    this.StopSection.patchValue({ activateStoplongperiodAlarm: CurrentInfo['IsEnableHardSoftLongStopAlarm'], stopTimeLimit: this.currentDate, GenerateAlertWhitoutSendPosition: CurrentInfo['GenerateLongStopAlarmIfNoPositionSent'], activateHardStoppedAlarm: CurrentInfo['IsEnableHardStopAlarm'], stopPeriodTime: CurrentInfo['DefaultOrRealHardStopAlarmDelayInMn'] ,activateStopAlarmWithContactOnOff: CurrentInfo['IsEnableStopDetectionWithAccOnAlarm'], StopWithContactOnOffPeriod: CurrentInfo['DefaultOrRealTimeThresholdStopRptWithACCOnInMn'],addMotorStatusOnAlarm: CurrentInfo['']});
    this.inputsDefaultStatus(CurrentInfo)
    this.inputsConfiguredByGPSStatus(CurrentInfo);
  }
  inputsConfiguredByGPSStatus(CurrentInfo: any):void {
    if(!CurrentInfo['IsStopAlarmConfiguredByGPRS']){
      this.StopSection.controls['activateHardStoppedAlarm'].disable();
      this.StopSection.controls['stopPeriodTime'].disable();
    }else{
      this.StopSection.controls['activateHardStoppedAlarm'].enable();
      this.StopSection.controls['stopPeriodTime'].enable();
    }
  }
  stopSabmit(form){
    if( this.defaultParams['HardSoftSupportLongStopAlarm'] ){
      let bigPerdioOfTimerPickerValue : Date = form.getRawValue().stopTimeLimit;
      let longStopperiodInSec = (bigPerdioOfTimerPickerValue.getHours() * 3600) + (bigPerdioOfTimerPickerValue.getMinutes() * 60)
      this._service.ChangeHardSoftLongStoppedAlarm(form.getRawValue().activateStoplongperiodAlarm,this.defaultParams['key'],form.getRawValue().GenerateAlertWhitoutSendPosition,longStopperiodInSec).subscribe((softLangStopData)=>{
        if(softLangStopData != null){
          this._service.set_CommandResponceData(softLangStopData);
        } 
      });
    }
    if(this.defaultParams['HardwareSupportHardStopAlarm'] && this.defaultParams['IsStopAlarmConfiguredByGPRS']){
      this._service.ChangeHardStoppedAlarm(form.getRawValue().activateHardStoppedAlarm,this.defaultParams['key'],form.getRawValue().stopPeriodTime).subscribe((hardStopData)=>{
        if(hardStopData){
          this._service.set_CommandResponceData(hardStopData);
        }
      });
    }
    if(this.defaultParams['HardSoftSupportStopDetectionWithAccOnAlarm'])
    this._service.ChangeStopDetectionWithAccONOffAlam(form.getRawValue().activateStopAlarmWithContactOnOff,this.defaultParams['key'],form.getRawValue().addMotorStatusOnAlarm,form.getRawValue().StopWithContactOnOffPeriod).subscribe((stopDetectionWithAccData)=>{
      if(stopDetectionWithAccData){
        this._service.set_CommandResponceData(stopDetectionWithAccData[0]);
      }
    });
  }
  inputsDefaultStatus(CurrentInfo: any):void {
    if(CurrentInfo['IsEnableHardSoftLongStopAlarm']){
      this.StopSection.controls['stopTimeLimit'].enable();
      this.StopSection.controls['GenerateAlertWhitoutSendPosition'].enable();
    }else{
      this.StopSection.controls['stopTimeLimit'].disable();
      this.StopSection.controls['GenerateAlertWhitoutSendPosition'].disable();
    }
    CurrentInfo['IsEnableHardStopAlarm'] ? this.StopSection.controls['stopPeriodTime'].enable() :  this.StopSection.controls['stopPeriodTime'].disable();
    CurrentInfo['IsEnableStopDetectionWithAccOnAlarm'] ? this.StopSection.controls['StopWithContactOnOffPeriod'].enable() :  this.StopSection.controls['StopWithContactOnOffPeriod'].disable();
    CurrentInfo['IsEnableStopDetectionWithAccOnAlarm'] ? this.StopSection.controls['addMotorStatusOnAlarm'].enable() :  this.StopSection.controls['addMotorStatusOnAlarm'].disable();
  }
  changeLongStopStatus(event):void{
    event.checked? this.StopSection.controls['stopTimeLimit'].enable() : this.StopSection.controls['stopTimeLimit'].disable();
    event.checked? this.StopSection.controls['GenerateAlertWhitoutSendPosition'].enable() : this.StopSection.controls['GenerateAlertWhitoutSendPosition'].disable();
  }
  changeStopPlusStatus(event):void{
    event.checked? this.StopSection.controls['stopPeriodTime'].enable() : this.StopSection.controls['stopPeriodTime'].disable();
  }
  changeStopInfStatus(event):void{
    event.checked? this.StopSection.controls['StopWithContactOnOffPeriod'].enable() : this.StopSection.controls['StopWithContactOnOffPeriod'].disable();
    event.checked? this.StopSection.controls['addMotorStatusOnAlarm'].enable() : this.StopSection.controls['addMotorStatusOnAlarm'].disable();
  }
  DefaultStop(){
    this.UpdateStop(this.defaultParams);
  }
}
