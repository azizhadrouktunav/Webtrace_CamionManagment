import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/en';
import { locale as arab } from '../../../../navigation/i18n/en';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
@Component({
  selector: 'app-general-section',
  templateUrl: './general-section.component.html',
  styleUrls: ['./general-section.component.scss']
})
export class GeneralSectionComponent implements OnInit {
  @Input() car : any;
  GeneralSection = new FormGroup({
    Doorstate: new FormControl(''),
    Contactstate: new FormControl(''),
    DepressedSOS: new FormControl(''),
    Towing: new FormControl(''),
    Batterydisconnected: new FormControl(''),
    RPMSelector: new FormControl(''),
    EngineSpeed: new FormControl(''),/* {disabled : this.GeneralSection.RPMSelector.value} */
    ActivationOfRemoteShutdown: new FormControl('')
  });   
  defaultParams;
  constructor(private _service: AlertConfigurationServiceService,
    private _translateService: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _errorHandle: ErrorHandlerService) {this._fuseTranslationLoaderService.loadTranslations(english, french, arab); }

  ngOnInit() {
    this._service.get_EquipementInfoData().subscribe((data)=>{
      if(data[0]){
        this.UpdateGeneral(data[0]['info']);
        this.defaultParams = data[0]['info'];
      }
    })
  }
  GeneralSabmit():void{
    if((this.defaultParams['IsDoorAlarmConfiguredByGPRS'])&&(this.defaultParams['HardwareSupportDoorAlarm']))
    this._service.ChangeDoorStatus(this.GeneralSection.value.Doorstate,this.defaultParams['key'])
    .subscribe(changeDoorData=>{
      if(changeDoorData != null){
        this._service.set_CommandResponceData(changeDoorData);
      }
    },
    (err: HttpErrorResponse)=> {
      this._errorHandle.handleError(err);
    });
    if((this.defaultParams['IsACCAlarmConfiguredByGPRS']))
    this._service.ChangeACCStatus(this.GeneralSection.value.Contactstate,this.defaultParams['key'])
    .subscribe(changeACCStatusData=>{
      if(changeACCStatusData != null){
        this._service.set_CommandResponceData(changeACCStatusData);
      }
    },
    (err: HttpErrorResponse)=> {
      this._errorHandle.handleError(err);
    });
    if((this.defaultParams['IsSOSAlarmCofiguredByGPRS'])&&(this.defaultParams['HardwareSupportSOSAlarm']))
    this._service.ChangeSOSStatus(this.GeneralSection.value.DepressedSOS,this.defaultParams['key'])
    .subscribe(changeSOSData=>{
      if(changeSOSData != null){
        this._service.set_CommandResponceData(changeSOSData);
      }
    },
    (err: HttpErrorResponse)=> {
      this._errorHandle.handleError(err);
    });
    if(this.defaultParams['HardwareSupportTowingAlarm']){
      this._service.ChangeTowingStatus(this.GeneralSection.value.Towing,this.defaultParams['key'])
      .subscribe(changeTowningData=>{
        if(changeTowningData != null){
          this._service.set_CommandResponceData(changeTowningData);
        }
      },
      (err: HttpErrorResponse)=> {
        this._errorHandle.handleError(err);
      }); 
    }
    if(this.defaultParams['IsExternalBattRemovedAlarmConfiguredByGPRS']&&(this.defaultParams['HardwareSupportExtBattRmvAlarm']))
    this._service.ChangeBattryHardwareStatus(this.GeneralSection.value.Batterydisconnected,this.defaultParams['key'])
    .subscribe(changeBattryData=>{
      if(changeBattryData != null){
        this._service.set_CommandResponceData(changeBattryData);
      }
    },
    (err: HttpErrorResponse)=> {
      this._errorHandle.handleError(err);
    });
    if(this.defaultParams['HardSoftSupportRPMOutOfRangeAlarm']){
      this._service.ChangeRPMOutOfRangeAlarm(this.GeneralSection.value.RPMSelector,this.defaultParams['key'],this.GeneralSection.value.EngineSpeed)
      .subscribe(changeRPMData=>{
        if(changeRPMData != null){
          this._service.set_CommandResponceData(changeRPMData);
        }
      },
      (err: HttpErrorResponse)=> {
        this._errorHandle.handleError(err);
      });
    }
  }
  UpdateGeneral(CurrentInfo):void{
    
    this.GeneralSection.patchValue({ Doorstate: CurrentInfo['IsEnableDoorAlarm'], Contactstate: CurrentInfo['IsEnableAccAlarm'], DepressedSOS: CurrentInfo['IsEnableSOSAlarm'], Towing: CurrentInfo['IsEnableTowingAlarm'], Batterydisconnected: CurrentInfo['IsEnableExternalBatRemovedHardAlarm'],RPMSelector: CurrentInfo['IsEnableRPMOutOfRangeAlarm'],EngineSpeed: CurrentInfo['DefaultOrRealRPMThreshold'],ActivationOfRemoteShutdown:''});
    this.inputsDefaultValue(CurrentInfo)
  }
  inputsDefaultValue(CurrentInfo: any) {
    CurrentInfo['IsDoorAlarmConfiguredByGPRS'] == false ? this.GeneralSection.controls['Doorstate'].disable() : this.GeneralSection.controls['Doorstate'].enable();
    CurrentInfo['IsACCAlarmConfiguredByGPRS'] == false ? this.GeneralSection.controls['Contactstate'].disable() : this.GeneralSection.controls['Contactstate'].enable();
    CurrentInfo['IsSOSAlarmCofiguredByGPRS'] == false ? this.GeneralSection.controls['DepressedSOS'].disable() :  this.GeneralSection.controls['DepressedSOS'].enable();
    CurrentInfo['IsExternalBattRemovedAlarmConfiguredByGPRS'] == false ? this.GeneralSection.controls['Batterydisconnected'].disable() : this.GeneralSection.controls['Batterydisconnected'].enable();
    CurrentInfo['IsEnableRPMOutOfRangeAlarm'] == false ? this.GeneralSection.controls['EngineSpeed'].disable() : this.GeneralSection.controls['EngineSpeed'].enable();
  }
  changeEngineSpeedAlertStatus(event):void{
    event.checked? this.GeneralSection.controls['EngineSpeed'].enable() : this.GeneralSection.controls['EngineSpeed'].disable();
  }
  GeneralDefault(){
    this.UpdateGeneral(this.defaultParams);
  }
}
