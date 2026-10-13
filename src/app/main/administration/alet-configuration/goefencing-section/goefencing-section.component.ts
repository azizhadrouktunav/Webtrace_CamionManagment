import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { AlertConfigurationServiceService } from '../alert-configuration-service.service';

@Component({
  selector: 'app-goefencing-section',
  templateUrl: './goefencing-section.component.html',
  styleUrls: ['./goefencing-section.component.scss']
})
export class GoefencingSectionComponent implements OnInit {


  @Input() car : any;
 
  currentDate = new Date();
  GeofencingSection = new FormGroup({
    /*First Path element*/
    activateInOutWayOneAlarm: new FormControl(false),
    pathOneParams: new FormGroup({
      distanceThreasholdWayOne: new FormControl(100,Validators.required),
      areaWayOne: new FormControl(0, Validators.required),
      alarmDaysWayOne: new FormControl('', Validators.required),
      alarmTimeIntevalMinWayOne: new FormControl(new Date(2020, 11, 10, 0, 0, 0)),
      alarmTimeIntevalMaxWayOne: new FormControl(new Date(2020, 23, 59, 0, 0, 0)),
      placementWayOne: new FormControl(0)
    }),
    /*Second Path Elements*/
    activateInOutWayTwoAlarm: new FormControl(false),
    pathTwoParams: new FormGroup({
      distanceThreasholdWayTwo: new FormControl(100,Validators.required),
      areaWayTwo: new FormControl('',Validators.required),
      alarmDaysWayTwo: new FormControl(''),
      alarmTimeIntevalMinWayTwo: new FormControl(this.currentDate),
      alarmTimeIntevalMaxWayTwo: new FormControl(this.currentDate),
      placementWayTwo: new FormControl(0)
    }),
    /*City Elements*/ 
    activateInOutCityAlarm: new FormControl(false),
    cityParams: new FormGroup({
      distanceThreasholdCity: new FormControl(100,Validators.required),
      areaWayCity: new FormControl('',Validators.required),
      alarmDayCity: new FormControl(''),
      alarmTimeIntevalMinCity: new FormControl(this.currentDate),
      alarmTimeIntevalMaxCity: new FormControl(this.currentDate),
      placementCity: new FormControl(0),
      enableArming: new FormControl(false)
    }),
    /*Ploygon Elements*/ 
    activateInOutPolygonAlarm: new FormControl(false),
    polygonParams: new FormGroup({
      distanceThreasholdPolygon: new FormControl(100,Validators.required),
      areaWayPolygon: new FormControl('', Validators.required),
      alarmDayPolygon: new FormControl(''),
      alarmTimeIntevalMinPolygon: new FormControl(this.currentDate),
      alarmTimeIntevalMaxPolygon: new FormControl(this.currentDate),
      placementPolygon: new FormControl(0)
    }),
    /*PlaceOne Elements*/
    activateInOutlocationOneAlarm: new FormControl(false),
    locationOneParams: new FormGroup({
      distanceThreasholdlocationOne: new FormControl(100,Validators.required),
      areaWaylocationOne: new FormControl('',Validators.required),
      alarmDaylocationOne: new FormControl(''),
      alarmTimeIntevalMinlocationOne: new FormControl(this.currentDate),
      alarmTimeIntevalMaxlocationOne: new FormControl(this.currentDate),
      placementlocationOne: new FormControl(0)
    }),    
    activateInOutlocationTwoAlarm: new FormControl(false),
    locationTwoParams: new FormGroup({
      distanceThreasholdlocationTwo: new FormControl(100,Validators.required),
      areaWaylocationTwo: new FormControl('',Validators.required),
      alarmDaylocationTwo: new FormControl(''),
      alarmTimeIntevalMinlocationTwo: new FormControl(this.currentDate),
      alarmTimeIntevalMaxlocationTwo: new FormControl(this.currentDate),
      placementlocationTwo: new FormControl(0)
    })
  });
  WeekdaysList: Weekdays[] = 
  [{Id: 0,day:'Common.Sunday'},
  {Id: 1,day:'Common.Monday'},
  {Id: 2,day:'Common.Tuesday'},
  {Id: 3,day:'Common.Wednesday'},
  {Id: 4,day:'Common.Thursday'},
  {Id: 5,day:'Common.Friday'},
  {Id: 6,day:'Common.Saturday'}];

  inOutStateList: InOutGeometricModel[] = 
  [{Id: 0,state:'Geofence.GeometricShapeStatusInOut'},
  {Id: 1,state:'Geofence.GeometricShapeStatusOut'},
  {Id: 2,state:'Geofence.GeometricShapeStatusIn'}];
  pathsList = []; countryList = []; polygonList = []; placesList = [];
  selectedMeltiWayOneValue = []; selectedMeltiWayTwoValue = []; selectedMeltiCountryValue = []; selectedMeltiPolygonValue = []; selectedMeltiLocationOneValue = []; selectedMeltiLocationTwoValue = [];
  selectedPolygon;selectedLocationOne;
  defaultParams;
  showSpinners = true; 
  showSeconds = false;
  isDisabled:boolean=false;
  constructor(private _service: AlertConfigurationServiceService,
              private _matSnackBar: MatSnackBar,
              private _errorHandler: ErrorHandlerService) {

   }

  ngOnInit() {
    this._service.getWayPolygonPlace().subscribe(data =>{
      this._service.paths = data['ListWay'];
      this._service.places = data['ListPlaceElement'];
      this._service.polygon = data['ListPolygon'];
      this._service.country = data['ListCountry'];
      this.pathsList = this._service.paths? this._service.paths:[];
      this.countryList = this._service.country? this._service.country:[];
      this.polygonList = this._service.polygon? this._service.polygon:[];
      this.placesList = this._service.places? this._service.places:[];
    });
    this._service.get_EquipementInfoData().subscribe((data)=>{
      if(data[0]){
       
       // this.setDefaultValueOfZonneId();
        this.UpdateGeofecing(data[0]['info']);
        this.defaultParams = data[0]['info'];
      }
    })
  }
  setDefaultValueOfZonneId() {
    var idPath =-1;
    var idCountry =-1;
    var idPolygon =-1;
    var idPlaces =-1;
    if(this.pathsList.length >0)
    {
      idPath = this.pathsList[0].Id
    }
    if(this.countryList.length >0)
      idCountry= this.countryList[0].Id;
    if(this.polygonList.length >0)
      idPolygon = this.polygonList[0].Id;
    if(this.placesList.length >0)
       idPlaces=this.placesList[0].Id;
   /* this.GeofencingSection.patchValue({
     
      pathOneParams: {areaWayOne: idPath},
      pathTwoParams: {areaWayTwo: idPath},
      cityParams: {areaWayCity: idCountry},
      polygonParams: {areaWayPolygon: idPolygon},
      locationOneParams: {areaWaylocationOne: idPlaces},
      locationTwoParams: {areaWaylocationTwo: idPlaces}
    });*/
  }
  UpdateGeofecing(currentInfo: any):void {
    this.GeofencingSection = new FormGroup({
    
      activateInOutWayOneAlarm: new FormControl(false),
      pathOneParams: new FormGroup({
        distanceThreasholdWayOne: new FormControl(100,Validators.required),
        areaWayOne: new FormControl(0, Validators.required),
        alarmDaysWayOne: new FormControl('', Validators.required),
        alarmTimeIntevalMinWayOne: new FormControl(new Date(2020, 11, 10, 0, 0, 0)),
        alarmTimeIntevalMaxWayOne: new FormControl(new Date(2020, 23, 59, 0, 0, 0)),
        placementWayOne: new FormControl(0)
      }),
     
      activateInOutWayTwoAlarm: new FormControl(false),
      pathTwoParams: new FormGroup({
        distanceThreasholdWayTwo: new FormControl(100,Validators.required),
        areaWayTwo: new FormControl('',Validators.required),
        alarmDaysWayTwo: new FormControl(''),
        alarmTimeIntevalMinWayTwo: new FormControl(this.currentDate),
        alarmTimeIntevalMaxWayTwo: new FormControl(this.currentDate),
        placementWayTwo: new FormControl(0)
      }),
      
      activateInOutCityAlarm: new FormControl(false),
      cityParams: new FormGroup({
        distanceThreasholdCity: new FormControl(100,Validators.required),
        areaWayCity: new FormControl('',Validators.required),
        alarmDayCity: new FormControl(''),
        alarmTimeIntevalMinCity: new FormControl(this.currentDate),
        alarmTimeIntevalMaxCity: new FormControl(this.currentDate),
        placementCity: new FormControl(0),
        enableArming: new FormControl(false)
      }),
     
      activateInOutPolygonAlarm: new FormControl(false),
      polygonParams: new FormGroup({
        distanceThreasholdPolygon: new FormControl(100,Validators.required),
        areaWayPolygon: new FormControl('', Validators.required),
        alarmDayPolygon: new FormControl(''),
        alarmTimeIntevalMinPolygon: new FormControl(this.currentDate),
        alarmTimeIntevalMaxPolygon: new FormControl(this.currentDate),
        placementPolygon: new FormControl(0)
      }),
     
      activateInOutlocationOneAlarm: new FormControl(false),
      locationOneParams: new FormGroup({
        distanceThreasholdlocationOne: new FormControl(100,Validators.required),
        areaWaylocationOne: new FormControl('',Validators.required),
        alarmDaylocationOne: new FormControl(''),
        alarmTimeIntevalMinlocationOne: new FormControl(this.currentDate),
        alarmTimeIntevalMaxlocationOne: new FormControl(this.currentDate),
        placementlocationOne: new FormControl(0)
      }),    
      activateInOutlocationTwoAlarm: new FormControl(false),
      locationTwoParams: new FormGroup({
        distanceThreasholdlocationTwo: new FormControl(100,Validators.required),
        areaWaylocationTwo: new FormControl('',Validators.required),
        alarmDaylocationTwo: new FormControl(''),
        alarmTimeIntevalMinlocationTwo: new FormControl(this.currentDate),
        alarmTimeIntevalMaxlocationTwo: new FormControl(this.currentDate),
        placementlocationTwo: new FormControl(0)
      })
    });



    if(currentInfo['InOutGeometricShapeParamWay1'] != null){
      this.GeofencingSection.patchValue({
        activateInOutWayOneAlarm: currentInfo['InOutGeometricShapeParamWay1']['IsEnable'],
        pathOneParams: {
            distanceThreasholdWayOne: currentInfo['InOutGeometricShapeParamWay1']['DistanceThreasholdM'],
           areaWayOne: currentInfo['InOutGeometricShapeParamWay1']['ZonneId'],
            alarmDaysWayOne: (currentInfo['InOutGeometricShapeParamWay1']['EnabledDayOfWeekStringId']).split(';'),
             alarmTimeIntevalMinWayOne: parseJsonDate(currentInfo['InOutGeometricShapeParamWay1']['StartTimeLocal']),
            alarmTimeIntevalMaxWayOne: parseJsonDate(currentInfo['InOutGeometricShapeParamWay1']['EndTimeLocal']),
            placementWayOne: currentInfo['InOutGeometricShapeParamWay1']['InOutGeometricShapeState']
        }
      });
      this.selectedMeltiWayOneValue = currentInfo['InOutGeometricShapeParamWay1']['EnabledDayOfWeekStringId'].split`;`.map(x=>+x);
    }
    else
    {
     /* this.GeofencingSection.patchValue({
        activateInOutWayOneAlarm: false,
        pathOneParams: {distanceThreasholdWayOne: 100, areaWayOne: '', alarmDaysWayOne: '',alarmTimeIntevalMinWayOne:new Date(2020, 11, 10, 0, 0, 0), alarmTimeIntevalMaxWayOne: new Date(2020, 23, 59, 0, 0, 0), placementWayOne: 0}
      }); */
    
      
    }
    
    if(currentInfo['InOutGeometricShapeParamWay2'] != null){
      this.GeofencingSection.patchValue({
        activateInOutWayTwoAlarm: currentInfo['InOutGeometricShapeParamWay2']['IsEnable'],
        pathTwoParams: {
          distanceThreasholdWayTwo: currentInfo['InOutGeometricShapeParamWay2']['DistanceThreasholdM'],
           areaWayTwo: currentInfo['InOutGeometricShapeParamWay2']['ZonneId'],
            alarmDaysWayTwo: currentInfo['InOutGeometricShapeParamWay2']['EnabledDayOfWeekStringId'].split(';'),
            alarmTimeIntevalMinWayTwo: parseJsonDate(currentInfo['InOutGeometricShapeParamWay2']['StartTimeLocal']), alarmTimeIntevalMaxWayTwo: parseJsonDate(currentInfo['InOutGeometricShapeParamWay2']['EndTimeLocal']), placementWayOne: currentInfo['InOutGeometricShapeParamWay2']['InOutGeometricShapeState']}
      });
      this.selectedMeltiWayTwoValue = currentInfo['InOutGeometricShapeParamWay2']['EnabledDayOfWeekStringId'].split`;`.map(x=>+x);
    }
    
    if(currentInfo['InOutGeometricShapeParamCountry'] != null){
     // console.log(currentInfo['InOutGeometricShapeParamCountry']);
      
      this.GeofencingSection.patchValue({
        activateInOutCityAlarm: currentInfo['InOutGeometricShapeParamCountry']['IsEnable'],
        cityParams: {distanceThreasholdCity: currentInfo['InOutGeometricShapeParamCountry']['DistanceThreasholdM'], areaWayCity: currentInfo['InOutGeometricShapeParamCountry']['ZonneId'],
         alarmDaysCity: currentInfo['InOutGeometricShapeParamCountry']['EnabledDayOfWeekStringId'].split(';'),
         alarmTimeIntevalMinCity: parseJsonDate(currentInfo['InOutGeometricShapeParamCountry']['StartTimeLocal']), alarmTimeIntevalMaxCity: parseJsonDate(currentInfo['InOutGeometricShapeParamCountry']['EndTimeLocal']), placementCity: currentInfo['InOutGeometricShapeParamCountry']['InOutGeometricShapeState'],
         enableArming: currentInfo['InOutGeometricShapeParamCountry']['EnableArming']}
      });
      this.selectedMeltiCountryValue = currentInfo['InOutGeometricShapeParamCountry']['EnabledDayOfWeekStringId'].split`;`.map(x=>+x);
    }
    
    if(currentInfo['InOutGeometricShapeParamPolygon'] != null){
      let days = currentInfo['InOutGeometricShapeParamPolygon']['EnabledDayOfWeekStringId'].split(';').map(x=>+x);
      this.GeofencingSection.patchValue({
        activateInOutPolygonAlarm: currentInfo['InOutGeometricShapeParamPolygon']['IsEnable'],
        polygonParams: {distanceThreasholdPolygon: currentInfo['InOutGeometricShapeParamPolygon']['DistanceThreasholdM'], areaWayPolygon: currentInfo['InOutGeometricShapeParamPolygon']['ZonneId'], alarmDaysPolygon: days ,alarmTimeIntevalMinPolygon: parseJsonDate(currentInfo['InOutGeometricShapeParamPolygon']['StartTimeGMT']), alarmTimeIntevalMaxPolygon: parseJsonDate(currentInfo['InOutGeometricShapeParamPolygon']['EndTimeGMT']), placementPolygon: currentInfo['InOutGeometricShapeParamPolygon']['InOutGeometricShapeState']}
      });
      this.selectedMeltiPolygonValue =  currentInfo['InOutGeometricShapeParamPolygon']['EnabledDayOfWeekStringId'].split`;`.map(x=>+x);
      this.selectedPolygon = currentInfo['InOutGeometricShapeParamPolygon']['ZonneId'];
    }
   
    if(currentInfo['InOutAreaDurnigPeriodParamPlace1'] != null){
      this.GeofencingSection.patchValue({
        activateInOutlocationOneAlarm: currentInfo['InOutAreaDurnigPeriodParamPlace1']['IsEnable'],
        locationOneParams: {distanceThreasholdlocationOne: currentInfo['InOutAreaDurnigPeriodParamPlace1']['DistanceThreasholdM'], areaWaylocationOne: ['InOutAreaDurnigPeriodParamPlace1']['ZonneId'], alarmDayslocationOne: '' ,alarmTimeIntevalMinlocationOne: parseJsonDate(currentInfo['InOutAreaDurnigPeriodParamPlace1']['StartTimeLocal']), alarmTimeIntevalMaxlocationOne: parseJsonDate(currentInfo['InOutAreaDurnigPeriodParamPlace1']['EndTimeLocal']), placementlocationOne: currentInfo['InOutAreaDurnigPeriodParamPlace1']['InOutGeometricShapeState']}
      });
      //this.selectedMeltiLocationOneValue = currentInfo['InOutAreaDurnigPeriodParamPlace1']['EnabledDayOfWeekStringId'].split`;`.map(x=>+x);
    }
   
    if(currentInfo['InOutAreaDurnigPeriodParamPlace2'] != null){
      this.GeofencingSection.patchValue({
        activateInOutlocationTwoAlarm: currentInfo['InOutAreaDurnigPeriodParamPlace2']['IsEnable'],
        locationTwoParams: {distanceThreasholdlocationTwo: currentInfo['InOutAreaDurnigPeriodParamPlace2']['DistanceThreasholdM'], areaWaylocationTwo: currentInfo['InOutAreaDurnigPeriodParamPlace2']['ZonneId'], 
        alarmDayslocationTwo: currentInfo['InOutAreaDurnigPeriodParamPlace2']['EnabledDayOfWeekStringId'].split(';'),
        alarmTimeIntevalMinlocationTwo: parseJsonDate(currentInfo['InOutAreaDurnigPeriodParamPlace2']['StartTimeLocal']), alarmTimeIntevalMaxlocationTwo: parseJsonDate(currentInfo['InOutAreaDurnigPeriodParamPlace2']['EndTimeLocal']), placementlocationTwo: currentInfo['InOutAreaDurnigPeriodParamPlace2']['InOutGeometricShapeState']}
      });
      this.selectedMeltiLocationTwoValue = currentInfo['InOutAreaDurnigPeriodParamPlace2']['EnabledDayOfWeekStringId'].split`;`.map(x=>+x);
    }
    this.inputsDefaultValue(currentInfo);
  }

  inputsDefaultValue(currentInfo: any):void {
    currentInfo['InOutGeometricShapeParamWay1'] != null ? this.GeofencingSection.controls['pathOneParams'].enable() : this.GeofencingSection.controls['pathOneParams'].disable();
    currentInfo['InOutGeometricShapeParamWay2'] != null ? this.GeofencingSection.controls['pathTwoParams'].enable() : this.GeofencingSection.controls['pathTwoParams'].disable();
    currentInfo['InOutGeometricShapeParamCountry'] != null ? this.GeofencingSection.controls['cityParams'].enable() : this.GeofencingSection.controls['cityParams'].disable();
    currentInfo['InOutGeometricShapeParamPolygon'] != null ? this.GeofencingSection.controls['polygonParams'].enable() : this.GeofencingSection.controls['polygonParams'].disable();
    currentInfo['InOutAreaDurnigPeriodParamPlace1'] != null ? this.GeofencingSection.controls['locationOneParams'].enable() : this.GeofencingSection.controls['locationOneParams'].disable();
    currentInfo['InOutAreaDurnigPeriodParamPlace2'] != null ? this.GeofencingSection.controls['locationTwoParams'].enable() : this.GeofencingSection.controls['locationTwoParams'].disable();
  }

  changeInOutWayStatus(event):void{
    event.checked? this.GeofencingSection.controls['pathOneParams'].enable() : this.GeofencingSection.controls['pathOneParams'].disable();
  }

  changeInOutWayTwoStatus(event):void{
    event.checked? this.GeofencingSection.controls['pathTwoParams'].enable() : this.GeofencingSection.controls['pathTwoParams'].disable();
  }

  changeInOutCityStatus(event):void{
    event.checked? this.GeofencingSection.controls['cityParams'].enable() : this.GeofencingSection.controls['cityParams'].disable();
  }

  changeInOutPolygon(event):void{
    event.checked? this.GeofencingSection.controls['polygonParams'].enable() : this.GeofencingSection.controls['polygonParams'].disable();
  }

  changeInOutLocationOne(event):void{
    event.checked? this.GeofencingSection.controls['locationOneParams'].enable() : this.GeofencingSection.controls['locationOneParams'].disable();
  }

  changeLocationTwoStatus(event):void{
    event.checked? this.GeofencingSection.controls['locationTwoParams'].enable() : this.GeofencingSection.controls['locationTwoParams'].disable();
  }

  GeofencingSabmit(form):void{
    this._service.ChangeInOutWayPrdAlarm(form.getRawValue().pathOneParams.distanceThreasholdWayOne,form.getRawValue().activateInOutWayOneAlarm,false, form.getRawValue().pathOneParams.alarmDaysWayOne, form.getRawValue().pathOneParams.alarmTimeIntevalMaxWayOne,this.defaultParams['key'], form.getRawValue().pathOneParams.areaWayOne, form.getRawValue().pathOneParams.placementWayOne, 10, form.getRawValue().pathOneParams.alarmTimeIntevalMinWayOne)
    .subscribe((InOutWayAlarmValue)=>{
      if(InOutWayAlarmValue != null){
        this._service.set_CommandResponceData(InOutWayAlarmValue);
      }
    });
    this._service.ChangeInOutWayPrdAlarm(form.getRawValue().pathTwoParams.distanceThreasholdWayTwo,
    form.getRawValue().activateInOutWayTwoAlarm,false, form.getRawValue().pathTwoParams.alarmDaysWayTwo, 
    form.getRawValue().pathTwoParams.alarmTimeIntevalMaxWayTwo,this.defaultParams['key'], 
    form.getRawValue().pathTwoParams.areaWayTwo, form.getRawValue().pathTwoParams.placementWayTwo,
    11, form.getRawValue().pathTwoParams.alarmTimeIntevalMinWayTwo).subscribe((InOutWayTwoAlarmValue)=>{
      if(InOutWayTwoAlarmValue != null){
        this._service.set_CommandResponceData(InOutWayTwoAlarmValue);
      }
    },
    (err: HttpErrorResponse)=> {
      //this.errorHandler.handleError(error);.handleError(err);
    });
   
    this._service.ChangeInOutPolygonPrdAlarm(form.getRawValue().cityParams.distanceThreasholdCity,
    form.getRawValue().activateInOutCityAlarm,form.getRawValue().cityParams.enableArming, form.getRawValue().cityParams.alarmDayCity, 
    form.getRawValue().cityParams.alarmTimeIntevalMaxCity,
    this.defaultParams['key'], form.getRawValue().cityParams.areaWayCity, 
    form.getRawValue().cityParams.placementCity, 0, form.getRawValue().cityParams.alarmTimeIntevalMinCity)
    .subscribe((InOutCityAlarmValue)=>{
      if(InOutCityAlarmValue != null){
        this._service.set_CommandResponceData(InOutCityAlarmValue);
      }
    },
    (err: HttpErrorResponse) => {
      //this.errorHandler.handleError(error);.handleError(err);
    });
    this._service.ChangeInOutPolygonPrdAlarm(form.getRawValue().polygonParams.distanceThreasholdPolygon,form.getRawValue().activateInOutPolygonAlarm,false, form.getRawValue().polygonParams.alarmDayPolygon, form.getRawValue().polygonParams.alarmTimeIntevalMaxPolygon,this.defaultParams['key'], form.getRawValue().polygonParams.areaWayPolygon, form.getRawValue().polygonParams.placementPolygon, 1, form.getRawValue().polygonParams.alarmTimeIntevalMinPolygon).subscribe((InOutPolygonAlarmValue)=>{
      if(InOutPolygonAlarmValue != null){
        this._service.set_CommandResponceData(InOutPolygonAlarmValue);
      }
    });
    this._service.ChangeInOutPlacePrdAlarm(form.getRawValue().locationOneParams.distanceThreasholdlocationOne,
    form.getRawValue().activateInOutlocationOneAlarm,false, 
    form.getRawValue().locationOneParams.alarmDaylocationOne, 
    form.getRawValue().locationOneParams.alarmTimeIntevalMaxlocationOne,
    this.defaultParams['key'], form.getRawValue().locationOneParams.areaWaylocationOne, 
    form.getRawValue().locationOneParams.placementlocationOne, 0, 
    form.getRawValue().locationOneParams.alarmTimeIntevalMinlocationOne)
    .subscribe((InOutlocationOneAlarmValue)=>{
      if(InOutlocationOneAlarmValue != null){
        this._service.set_CommandResponceData(InOutlocationOneAlarmValue);
      }
    },
    (err: HttpErrorResponse) => {
      //this.errorHandler.handleError(error);.handleError(err);
    });
    this._service.ChangeInOutPlacePrdAlarm(form.getRawValue().locationTwoParams.distanceThreasholdlocationTwo,form.getRawValue().activateInOutlocationTwoAlarm,false, form.getRawValue().locationTwoParams.alarmDaylocationTwo, form.getRawValue().locationTwoParams.alarmTimeIntevalMaxlocationTwo,this.defaultParams['key'], form.getRawValue().locationTwoParams.areaWaylocationTwo, form.getRawValue().locationTwoParams.placementlocationTwo, 1, form.getRawValue().locationTwoParams.alarmTimeIntevalMinlocationTwo)
    .subscribe((InOutlocationTwoAlarmValue)=>{
      if(InOutlocationTwoAlarmValue != null){
        this._service.set_CommandResponceData(InOutlocationTwoAlarmValue);
      }
    },
    (err: HttpErrorResponse) => {
      //this.errorHandler.handleError(error);.handleError(err);
    });
  }
  GeofencingDefault(){
    this.UpdateGeofecing(this.defaultParams);
  }
  InOutChange(value)
  {
   
   if(value ==0)
   {
    this.GeofencingSection.patchValue({enableArming:false})
    let cityParams= this.GeofencingSection.controls.cityParams
    let enableArming=cityParams["controls"]["enableArming"]
    this.GeofencingSection.controls["cityParams"]["controls"]["enableArming"].setValue(false);
     
 
   // enableArming.value= false;
   // enableArming.disabled=true;
    this.isDisabled=true;
    

   }
   else
   {
    this.isDisabled=false;
   }
  }
}
interface Weekdays {
  Id: any;
  day: any;
}
interface InOutGeometricModel {
  Id: any;
  state: any;
}
export function parseJsonDate(jsonDateString){

  return new Date(parseInt(jsonDateString.replace('/Date(', '')));
}