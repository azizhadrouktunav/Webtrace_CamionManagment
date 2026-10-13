import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { json2array } from 'app/main/helpers/must-match.validator';
import { showSnackBar } from 'app/main/helpers/showSnackBar';
import { dayDiff } from 'app/main/helpers/validators/validators';
import { decrypt } from 'app/main/parc/Parc';
import { ReportService } from 'app/main/reports/services/report.service';
import { SharedreportdataService } from 'app/main/reports/services/sharedreportdata.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MobiletankService } from '../mobiletank.service';

@Component({
  selector: 'app-mobiletankreport',
  templateUrl: './mobiletankreport.component.html',
  styleUrls: ['./mobiletankreport.component.scss']
})
export class MobiletankreportComponent implements OnInit {

  ReportingParam: any;
  cars: any;
  form: FormGroup;
  fb: any;
  minDate: any;
  maxDate: any;
  showSpinners: any;
  showSeconds: any;
  stepHour: any;
  stepMinute: any;
  stepSecond: any;
  touchUi: any;
  color: any;
  Selected_chauffeur: any;
  data: any;

  dateObj = new Date(); noshrink: any;
  filteredOptions: Observable<string[]>;
  carname: any;
  ETBLE: any[];

  constructor(private _tanksService: MobiletankService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private _authenticateService: AuthenticateService,
    private _errorHandler: ErrorHandlerService) {
    this.form = this.createForm();

  }

  ngOnInit() {

    this._tanksService.getmobileTanks()
      .subscribe(data => {
         
        this.cars = json2array(data);
        this.filteredOptions = this.form.get('car').valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
        (err: HttpErrorResponse) => {
          //this.errorHandler.handleError(error);.handleError(err);

        });

  }
  private _filter(car: any) {
    this.ETBLE = [];
    this.cars.forEach(element => {
     // if (element.CurrentEquipmentElement.EquipementTypeEnumString == "ETBLE") {
        this.ETBLE.push(element);
      //}
    });
    let carName = car.Name || car; //
    return this.ETBLE.filter(car =>
      car.Name.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  }
  displayCar(car) {
    return car ? car.Name : '';
  }
  createForm(): FormGroup {
    return new FormGroup({


      car: new FormControl(''),
      StartDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 0, 0, 0)),
      EndDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 23, 59, 59)),

    });


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

      this.ETBLE.forEach(e => {
        if (e.Id.toString() == this.form.value.car.Id) {
          this.carname = e.Name;
        }
      });
      this._SharedreportdataService.sendParams(this.form.value.car.Id, StartDateGMT,
        EndDateGMT, this.form.value.car.TrackingTarget, 0, 0,
        0, 0, 0, this.carname, []);

      this._authenticateService.GetConnexionState().subscribe((response) => {
        if (response) {

          this.router.navigate([
            "/mobiletank-monitoring/report/result"
          ]);

        }

        else {

          this.router.navigate(['app-auth']);
          return false;
        }
      },
        (err: HttpErrorResponse) => {
          //this.errorHandler.handleError(error);.handleError(err);
        });
    }
  }
}
