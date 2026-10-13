import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { decrypt } from 'app/main/parc/Parc';
import { json2array } from 'app/main/helpers/must-match.validator';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSnackBar } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { TranslateService } from '@ngx-translate/core';
import { dayDiff, showSnackBar } from 'app/main/helpers/validators/validators';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-monthlyreportform',
  templateUrl: './monthlyreportform.component.html',
  styleUrls: ['./monthlyreportform.component.scss'],
  providers: [
   
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class MonthlyreportformComponent implements OnInit {

  ReportingParam: any;
  trackingObjects: any;
  form: FormGroup;
  fb: any;
  trackingObject: number;
    CarMatricule: any;
    Selected_chauffeur: any;
    showSpinners: any;
    showSeconds: any;
    stepHour: any;
    stepMinute: any;
    stepSecond: any;
    touchUi: any;
    color: any;
    minDate: any;
    maxDate: any;
    data: any;

 dateObj = new Date();noshrink : any;
 filteredOptions: Observable<string[]>;
  car: any;
  startdate: Date;
  enddate: Date;

 constructor(private _ReportService: ReportService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService, 
    private _authenticateService: AuthenticateService,
    private _errorHandler: ErrorHandlerService
   ) { 
    this.getparams();

      this.form = this.createForm();
  }
  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
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
      // console.log(err);
      //this.errorHandler.handleError(error);.handleError(err);
   });  
  }
  private _filter(car: any) {
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
       date: new FormControl(''),
        Emplacement: new FormControl(1)
    });

    
}
GetReportParam() {
  
 /*this.trackingObject = this.form.value.Car;
 this.documentType = +data.Id;
 this.documentTypeString = +data.DocumentType;*/
 this.trackingObjects.forEach(e=>{
  if(e.Key.toString() == this.form.value.Car.Key){
    this.CarMatricule = e.FullName;
  }
});
 this._SharedreportdataService.sendParams(this.form.value.Car, this.date.value,
  this.date.value,this.form.value.Emplacement,0,0,
  0,0,0,this.CarMatricule,[]);

  this._authenticateService.GetConnexionState().subscribe((response) => {

    if (response) {
      this.router.navigate([
        "/reports/monthlyreport/Details"  
      ]);
    }
     
     else {
        
        this.router.navigate(['app-auth']);
        return false;
    }
  },
  (err: HttpErrorResponse) => {
    // console.log(err);
    //this.errorHandler.handleError(error);.handleError(err);
 });
 
}

getparams() {
  const today = new Date();
  this.startdate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  this.enddate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  this._SharedreportdataService.fetchParams().subscribe(params => {
    if(Object.keys(params).length != 0 )
    {this.car = params.param1;
    this.startdate = params.param2;
    this.enddate = params.param3;
   
    }
    
  });  
}
}

