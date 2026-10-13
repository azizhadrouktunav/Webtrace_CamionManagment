import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/en';
import { locale as arab } from '../../../../navigation/i18n/en';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-speed-section',
  templateUrl: './speed-section.component.html',
  styleUrls: ['./speed-section.component.scss']
})
export class SpeedSectionComponent implements OnInit {
  @Input() car : any;
  SpeedSection = new FormGroup({
    activateOfOverSpeed: new FormControl(''),
    speedLimit: new FormControl(''),
    TimeOverSpeedLimit: new FormControl(''),
    activateOfAlarmSiren: new FormControl(''),
    activateOfAlarmSpeedRange: new FormControl(''),
    overSpeedValue: new FormControl(''),
  }); 
  defaultParams;
  constructor(private _service: AlertConfigurationServiceService,private _translateService: TranslateService,private _fuseTranslationLoaderService: FuseTranslationLoaderService) {this._fuseTranslationLoaderService.loadTranslations(english, french, arab); }

  ngOnInit() {
    this._service.get_EquipementInfoData().subscribe((data)=>{
      if(data[0]){
        this.UpdateSpeed(data[0]['info']);
        this.defaultParams = data[0]['info'];
      }
    })
  }
  UpdateSpeed(CurrentInfo: any):void {
    this.SpeedSection.patchValue({ activateOfOverSpeed: CurrentInfo['IsEnableOverSpeedAlarm'], speedLimit: CurrentInfo['DefaultOrRealOverSpeedAlarmThresholdInKmH'], TimeOverSpeedLimit: CurrentInfo['DefaultOrRealOverSpeedAlarmEnterDelayInS'], activateOfAlarmSiren: CurrentInfo['IsEnableOuputBuzzerOverSpeedFunction'], activateOfAlarmSpeedRange: CurrentInfo['IsEnableExceedingTheSpeedLimitOnTunisianRoadAlarm'],overSpeedValue: CurrentInfo['OverspeedMarginOnNetworkRoadKmh'] });
    this.inputsDefaultValue(CurrentInfo)
  }
  SpeedSabmit( form ){
    if(this.defaultParams['HardwareSupportOverSpeedAlarm'] && this.defaultParams['IsOverSpeedAlarmConfiguredByGPRS']){
      this._service.ChangeOverSpeedAlarm(form.getRawValue().activateOfOverSpeed,300,this.defaultParams['key'],form.getRawValue().IsEnableOuputBuzzerOverSpeedFunction,form.getRawValue().speedLimit,form.getRawValue().TimeOverSpeedLimit).subscribe((overSpeedAlarmValue) =>{
        if(overSpeedAlarmValue != null){
          this._service.set_CommandResponceData(overSpeedAlarmValue);
        }
      });
    }
    if(this.defaultParams['HardwareSupportOverSpeedAlarm']){
      this._service.ChangeExceedingTheSpeedLimitOnTunisianRoadAlarm(form.getRawValue().activateOfAlarmSpeedRange,this.defaultParams['key'],form.getRawValue().overSpeedValue).subscribe((speedLimitOnTunisianRoad)=>{
        if(speedLimitOnTunisianRoad) this._service.set_CommandResponceData(speedLimitOnTunisianRoad);
      })
    }
  }
  inputsDefaultValue(CurrentInfo: any) {
    if(CurrentInfo['IsOverSpeedAlarmConfiguredByGPRS']){
      this.SpeedSection.controls['activateOfOverSpeed'].enable();
      this.SpeedSection.controls['speedLimit'].enable();
      this.SpeedSection.controls['TimeOverSpeedLimit'].enable();
      this.SpeedSection.controls['activateOfAlarmSiren'].enable();
    }else{
      this.SpeedSection.controls['activateOfOverSpeed'].disable();
      this.SpeedSection.controls['speedLimit'].disable();
      this.SpeedSection.controls['TimeOverSpeedLimit'].disable();
      this.SpeedSection.controls['activateOfAlarmSiren'].disable();
    }
    if(this.SpeedSection.controls['activateOfOverSpeed'].value){
      this.SpeedSection.controls['speedLimit'].enable();
      this.SpeedSection.controls['TimeOverSpeedLimit'].enable();
      this.SpeedSection.controls['activateOfAlarmSiren'].enable();
    }else{
      this.SpeedSection.controls['speedLimit'].disable();
      this.SpeedSection.controls['TimeOverSpeedLimit'].disable();
      this.SpeedSection.controls['activateOfAlarmSiren'].disable();
    }
    this.SpeedSection.controls['activateOfAlarmSpeedRange'].value ? this.SpeedSection.controls['overSpeedValue'].enable() : this.SpeedSection.controls['overSpeedValue'].disable();
  }
  changeSpeedlimitStatus(event){
    if(event.checked){
      this.SpeedSection.controls['speedLimit'].enable();
      this.SpeedSection.controls['TimeOverSpeedLimit'].enable();
      this.SpeedSection.controls['activateOfAlarmSiren'].enable();
    }else{
      this.SpeedSection.controls['speedLimit'].disable();
      this.SpeedSection.controls['TimeOverSpeedLimit'].disable();
      this.SpeedSection.controls['activateOfAlarmSiren'].disable();
    }
  }
  changeSpeedlimitplusmoisStatus(event){
    event.checked ? this.SpeedSection.controls['overSpeedValue'].enable() : this.SpeedSection.controls['overSpeedValue'].disable();
  }
  SpeedDefault(){
    this.UpdateSpeed(this.defaultParams);    
  }
}
