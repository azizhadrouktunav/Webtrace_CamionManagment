import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/en';
import { locale as arab } from '../../../../navigation/i18n/en';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
@Component({
  selector: 'app-fuel-section',
  templateUrl: './fuel-section.component.html',
  styleUrls: ['./fuel-section.component.scss']
})
export class FuelSectionComponent implements OnInit {
  @Input() car : any;
  FuelSection = new FormGroup({
    activateStolenThreshold: new FormControl(''),
    carburantStolenThresholdvalue:new FormControl(''),
    activateFuelOverOfLimiteAlert: new FormControl(''),
    fuelOverOfLimiteValue: new FormControl(''),
    activateFuelConsumptionAlert: new FormControl(''),
    fuelConsumptionValue: new FormControl(''),
  });
  defaultParams;
  constructor(private _service: AlertConfigurationServiceService,
    private _errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this._service.get_EquipementInfoData().subscribe((data)=>{
      if(data[0]){
        this.UpdateGeneral(data[0]['info']);
        this.defaultParams = data[0]['info'];
      }
    })
  }
  UpdateGeneral(CurrentInfo: any): void {
    this.FuelSection.patchValue({ activateStolenThreshold: CurrentInfo['IsEnableFuelStolenDetectionAlarm'], carburantStolenThresholdvalue: CurrentInfo['DefaultOrRealFuelPercentForStolenThreshold'], activateFuelOverOfLimiteAlert: CurrentInfo['IsEnableFuelLevelPercent4FillingAlarm'], fuelOverOfLimiteValue: CurrentInfo['DefaultOrRealFuelLevelPercent4FillingAlarm'], activateFuelConsumptionAlert: CurrentInfo['IsEnableHighFuelConsumptionAlarm'],fuelConsumptionValue: CurrentInfo['DefaultOrRealTheoriticalConsumptionL100Km'] });
    this.inputsDefaultValue(CurrentInfo)
  }
  inputsDefaultValue(CurrentInfo: any) {
    CurrentInfo['IsEnableFuelStolenDetectionAlarm'] == false ? this.FuelSection.controls['carburantStolenThresholdvalue'].disable() : this.FuelSection.controls['carburantStolenThresholdvalue'].enable();
    CurrentInfo['IsEnableFuelLevelPercent4FillingAlarm'] == false ? this.FuelSection.controls['fuelOverOfLimiteValue'].disable() : this.FuelSection.controls['fuelOverOfLimiteValue'].enable();
    CurrentInfo['IsEnableHighFuelConsumptionAlarm'] == false ? this.FuelSection.controls['fuelConsumptionValue'].disable() :  this.FuelSection.controls['fuelConsumptionValue'].enable();
  }
  changeStolenFuelStatus(event){
    event.checked? this.FuelSection.controls['carburantStolenThresholdvalue'].enable() : this.FuelSection.controls['carburantStolenThresholdvalue'].disable();
  }
  changeFillFuelStatus(event){
    event.checked? this.FuelSection.controls['fuelOverOfLimiteValue'].enable() : this.FuelSection.controls['fuelOverOfLimiteValue'].disable();
  }
  changeFuelConsumptionStatus(event){
    event.checked? this.FuelSection.controls['fuelConsumptionValue'].enable() : this.FuelSection.controls['fuelConsumptionValue'].disable();
  }
  FuelSabmit(){
    if(this.defaultParams['HardSoftSupportFuelStolenDetectionAlarm']){
      this._service.ChangeFuelStolenAlarm(this.FuelSection.value.activateStolenThreshold,
        this.defaultParams['key'],this.FuelSection.value.carburantStolenThresholdvalue)
      .subscribe(stolenThresholdData=>{
        if(stolenThresholdData != null){
          this._service.set_CommandResponceData(stolenThresholdData);
        }
      },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
    }
    if(this.defaultParams['HardwareSupportFuelLevelPercent4FillingAlarm']){
      this._service.ChangeFuelFuelLvlPercentforFillingAlarm(this.defaultParams['key'],
      this.FuelSection.value.fuelOverOfLimiteValue)
      .subscribe(fuelLvlPercentforFilling=>{
        if(fuelLvlPercentforFilling != null){
          this._service.set_CommandResponceData(fuelLvlPercentforFilling);
        }
      },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
    }
    if(this.defaultParams['HardSoftSupportHighFuelConsumptionAlarm']){
      this._service.ChangeHighFuelConsumptionAlarm(this.defaultParams['key'],
      this.FuelSection.value.activateFuelConsumptionAlert,
      this.FuelSection.value.fuelConsumptionValue)
        .subscribe(highFuelConsumption=>{
        if(highFuelConsumption != null){
          this._service.set_CommandResponceData(highFuelConsumption);
        }
      },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
    }
  }
  FuelDefault(){
    this.UpdateGeneral(this.defaultParams);
  }
}
