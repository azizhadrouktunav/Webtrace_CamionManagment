import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/en';
import { locale as arab } from '../../../../navigation/i18n/en';
@Component({
  selector: 'app-tempurature-section',
  templateUrl: './tempurature-section.component.html',
  styleUrls: ['./tempurature-section.component.scss']
})
export class TempuratureSectionComponent implements OnInit {
  @Input() car : any;
  TempuratureSection = new FormGroup({
    activationEngineTemperatureAlert: new FormControl(''),
    engineTempurature: new FormControl(''),
    activationOftempuratureVoltage: new FormControl(''),
    temperature: new FormGroup({
      tempuratureValue: new FormControl(''),
      minTemp: new FormControl(''),
      maxTemp: new FormControl('')
    })
  });   
  defaultParams;
  constructor(private _service: AlertConfigurationServiceService) { }

  ngOnInit() {
    this._service.get_EquipementInfoData().subscribe((data)=>{
      if(data[0]){
       
        this.UpdateGeneral(data[0]['info']);
        this.defaultParams = data[0]['info'];
        
      }
    })
  }
  UpdateGeneral(CurrentInfo):void{
    this.TempuratureSection.patchValue({ activationEngineTemperatureAlert: CurrentInfo['IsEnableEngineTemperatureOutOfRangeAlarm'], engineTempurature: CurrentInfo['DefaultOrRealEngineTemperatureThresholdC'], activationOftempuratureVoltage: CurrentInfo['IsEnableTemperatureAlarm'], temperature: {tempuratureValue: CurrentInfo[''], minTemp: CurrentInfo['TemperatureMin'], maxTemp: CurrentInfo['TemperatureMax']}});
    this.inputsDefaultValue(CurrentInfo)
  }
  inputsDefaultValue(CurrentInfo: any): void {
    CurrentInfo['IsAlertEngineTemperatureOutOfRangeConfiguredByGPRS'] == false ? this.TempuratureSection.controls['activationEngineTemperatureAlert'].disable() : this.TempuratureSection.controls['activationEngineTemperatureAlert'].enable();
    CurrentInfo['IsAlertEngineTemperatureOutOfRangeConfiguredByGPRS'] == false ? this.TempuratureSection.controls['engineTempurature'].disable() : this.TempuratureSection.controls['engineTempurature'].enable();
    if(CurrentInfo['IsTemperatureAlarmConfiguredByGPRS'] == false){
      this.TempuratureSection.controls['activationOftempuratureVoltage'].disable();
      this.TempuratureSection.controls['temperature'].disable();
    }else{
      this.TempuratureSection.controls['activationOftempuratureVoltage'].enable();
      this.TempuratureSection.controls['temperature'].enable();
    }
  }
  TempuratureSabmit(){
    if((this.defaultParams['IsAlertEngineTemperatureOutOfRangeConfiguredByGPRS'])&&(this.defaultParams['HardSoftSupportEngineTemperatureOutOfRangeAlarm']))
    this._service.DetectEngineTempOutOfRangeAlarm(this.TempuratureSection.value.activationEngineTemperatureAlert,this.defaultParams['key'],this.TempuratureSection.value.engineTempurature).subscribe(engineTemperature=>{
      if(engineTemperature != null){
        this._service.set_CommandResponceData(engineTemperature);
      }
    });
  }
  changeTempLimitStatus(event){
    event.checked? this.TempuratureSection.controls['temperature'].enable() : this.TempuratureSection.controls['temperature'].disable();
  }
  changeOverrunTempStatus(event){
    event.checked? this.TempuratureSection.controls['engineTempurature'].enable() : this.TempuratureSection.controls['engineTempurature'].disable();
  }
  TempuratureDefault(){
    this.UpdateGeneral(this.defaultParams);
  }
}
