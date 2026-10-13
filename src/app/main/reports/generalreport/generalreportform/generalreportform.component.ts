import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { json2array } from  'app/main/helpers/must-match.validator';
import { decrypt } from 'app/main/parc/Parc';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/fr';
import { locale as arab } from '../../../../navigation/i18n/ar';
import { dayDiff, showSnackBar } from 'app/main/helpers/validators/validators';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataService } from 'app/main/monitoring/shared-data.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-generalreportform',
  templateUrl: './generalreportform.component.html',
  styleUrls: ['./generalreportform.component.scss']
})
export class GeneralreportformComponent implements OnInit {
  ReportingParam: any;
  trackingObjects: any;
  form: FormGroup;
  fb: any;
  trackingObject: number;
    CarMatricule: any;
    showSpinners: any;
    showSeconds: any;
    stepHour: any;
    stepMinute: any;
    stepSecond: any;
    touchUi: any;
    color: any;
    minDate: any;
    maxDate: any;
    Selected_chauffeur: any;
    data: any;
  IsContainProBUSCAN: any;
   dateObj = new Date();noshrink : any;

   filteredOptions: Observable<string[]>;
  Car = new FormControl();
  startdate: Date;
  car: any;
  enddate: Date;

 constructor(private _ReportService: ReportService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private _errorHandler: ErrorHandlerService) { 
      this.getparams();

      this.form = this.createForm();
      this._fuseTranslationLoaderService.loadTranslations(english, french, arab);

  }

   ngOnInit() {
    

    this._ReportService.getReportingParam().subscribe((result) => {
      this.trackingObjects = decrypt(result);
      this.ReportingParam = json2array(this.trackingObjects);
      this.trackingObjects = json2array(this.ReportingParam[3]);
      this.filteredOptions = this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
     
    },
    (err: HttpErrorResponse) => {
         //this.errorHandler.handleError(error);.handleError(err);
    });  
    /* this._sharedDataService.firstServiceResponse.subscribe(key => {
      this.form.controls['Car'].setValue(key);
      var today = new Date();
      this.form.controls['StartDateGMT'].setValue(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
      this.form.controls['EndDateGMT'].setValue(new Date());
      this.GetReportParam();
   }); */
    
  }
  private _filter(car) {
     
    let carName = car.FullName || car; //
    return this.trackingObjects.filter(car =>
      car.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  }
  displayCar(car) {
    return car ? car.FullName : '';
  }
  createForm(): FormGroup {
    return new FormGroup({
  
        Car: new FormControl(this.car),
        StartDateGMT: new FormControl(new Date(this.startdate.getFullYear(),this.startdate.getMonth() ,this.startdate.getDate(),this.startdate.getHours(),this.startdate.getMinutes() ,this.startdate.getSeconds())) ,
        EndDateGMT: new FormControl(new Date(this.enddate.getFullYear(),this.enddate.getMonth() ,this.enddate.getDate(),this.enddate.getHours(),this.enddate.getMinutes() ,this.enddate.getSeconds())),
        Emplacement: new FormControl(1),
        Fuel: new FormControl('0'),
        Speed: new FormControl('70'),
        RPM: new FormControl('0'),
        Stop: new FormControl('0'),
        Report: new FormControl(2),
    });

    
}
GetReportParam() {
  
  var StartDateGMT = this.form.value.StartDateGMT._d != undefined ? this.form.value.StartDateGMT._d : this.form.value.StartDateGMT; 

  var EndDateGMT = this.form.value.EndDateGMT._d != undefined ? this.form.value.EndDateGMT._d :   this.form.value.EndDateGMT; 
    
  
 if (dayDiff(StartDateGMT, EndDateGMT)>31)
 {
  this.translateService.get(['NAV.Onemonth'])
   .subscribe(data => {this.data = data}
        );
  showSnackBar( this.data["NAV.Onemonth"],this._matSnackBar)}
 else{
 this.trackingObjects.forEach(e=>{
  if(e.Key.toString() == this.form.value.Car.Key){
    
    this.CarMatricule = e.FullName;
    this.IsContainProBUSCAN = e.CurrentEquipmentElement.IsContainProBUSCAN;
  }
});

 this._SharedreportdataService.sendParams(this.form.value.Car, StartDateGMT,
  EndDateGMT,this.form.value.Emplacement,this.form.value.Fuel,this.form.value.Speed,
 this.form.value.RPM,this.form.value.Stop,this.form.value.Report, this.CarMatricule,this.IsContainProBUSCAN);
 this.router.navigate([
   "/reports/generalreport/Details/"  + this.form.value.Car
 ]);}

}
getparams() {
  const today = new Date();
  this.startdate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  this.enddate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  this._SharedreportdataService.fetchParams().subscribe(params => {
    if(Object.keys(params).length != 0)
    {this.car = params.param1;
    this.startdate = params.param2;
    this.enddate = params.param3;
   
    }
    
  });  
  //this._SharedreportdataService.clear();
}
}
