import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service'; import { decrypt } from 'app/main/parc/Parc';
import { json2array } from 'app/main/helpers/must-match.validator';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { dayDiff, showSnackBar } from 'app/main/helpers/validators/validators';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-weigntreportform',
  templateUrl: './weigntreportform.component.html',
  styleUrls: ['./weigntreportform.component.scss']
})
export class WeigntreportformComponent implements OnInit {

  ReportingParam: any;
  trackingObjects: any;
  form: FormGroup;
  fb: any;
  trackingObject: number;
  CarMatricule: any;
  touchUi: any;
  showSpinners: any;
  showSeconds: any;
  stepHour: any;
  stepMinute: any;
  stepSecond: any;
  color: any;
  minDate: any;
  maxDate: any;
  Selected_chauffeur: any;
  data: any;
  filteredOptions: Observable<string[]>;


  dateObj = new Date(); noshrink: any;
  startdate: any;
  enddate: any;
  car: any;

  constructor(private _ReportService: ReportService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService, private _authenticateService: AuthenticateService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService,



  ) {
    this.getparams();
    this.form = this.createForm();

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
    });
  }
  createForm(): FormGroup {
    return new FormGroup({


      Car: new FormControl(this.car),
      StartDateGMT: new FormControl(new Date(this.startdate.getFullYear(),this.startdate.getMonth() ,this.startdate.getDate(),this.startdate.getHours(),this.startdate.getMinutes() ,this.startdate.getSeconds())) ,
      EndDateGMT: new FormControl(new Date(this.enddate.getFullYear(),this.enddate.getMonth() ,this.enddate.getDate(),this.enddate.getHours(),this.enddate.getMinutes() ,this.enddate.getSeconds())),
      Emplacement: new FormControl(1),

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
  GetReportParam() {
    var StartDateGMT = this.form.value.StartDateGMT._d != undefined ? this.form.value.StartDateGMT._d : this.form.value.StartDateGMT;

    var EndDateGMT = this.form.value.EndDateGMT._d != undefined ? this.form.value.EndDateGMT._d : this.form.value.EndDateGMT;

    if (dayDiff(StartDateGMT, EndDateGMT) > 31) {
      this.translateService.get(['NAV.Onemonth'])
        .subscribe(data => { this.data = data }
        );
      showSnackBar(this.data["NAV.Onemonth"], this._matSnackBar)
    }
    else {
      this.trackingObjects.forEach(e => {
        if (e.Key.toString() == this.form.value.Car.Key) {
          this.CarMatricule = e.FullName;
        }
      });
      /*this.trackingObject = this.form.value.Car;
      this.documentType = +data.Id;
      this.documentTypeString = +data.DocumentType;*/
      this._SharedreportdataService.sendParams(this.form.value.Car.Key, StartDateGMT,
        EndDateGMT, this.form.value.Emplacement, 0, 0,
        0, 0, 0, this.CarMatricule, []);

      this._authenticateService.GetConnexionState().subscribe((response) => {

        if (response) {

          this.router.navigate([
            "/reports/weightreport/Details"
          ]);
        }

        else {

          this.router.navigate(['app-auth']);
          return false;
        }
      });
    }
  }
  getparams() {
    const today = new Date();
    this.startdate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    this.enddate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    this._SharedreportdataService.fetchParams().subscribe(params => {
      if(Object.keys(params).length != 0 && params.param1 != null && params.param2 != null && params.param3 != null)
      {this.car = params.param1;
      this.startdate = params.param2;
      this.enddate = params.param3;
     
      }
      
    });  
  }
}
