
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
import { PompeMonitorService } from '../pompe-monitor.service';

@Component({
  selector: 'app-pompereportform',
  templateUrl: './pompereportform.component.html',
  styleUrls: ['./pompereportform.component.scss']
})
export class PompereportformComponent implements OnInit {

  ReportingParam: any;
  pumps: any;
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
  pumpname: any;
  ETBLE: any[];
  Pompes: any;

  constructor(private _pumpService: PompeMonitorService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private _authenticateService: AuthenticateService,
    private _errorHandler: ErrorHandlerService) {
    this.form = this.createForm();

  }

  ngOnInit() {
    this._pumpService.getPompes()
    .subscribe(data => {
    this.Pompes = data;

    this.filteredOptions = this.form.get('pump').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
});
    

  }
  private _filter(pump: any) {
    
    let pumpName = pump.Name || pump; //
    return this.Pompes.filter(pump =>
      pump.Name.toLowerCase().indexOf(pumpName.toLowerCase()) >= 0);
  }
  displaypump(pump) {
    return pump ? pump.Name : '';
  }
  createForm(): FormGroup {
    return new FormGroup({


      pump: new FormControl(''),
      StartDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 0, 0, 0)),
      EndDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 23, 59, 59)),

    });


  }
  displayCar(pump) {
    return pump ? pump.Name : '';
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

   
      this._SharedreportdataService.sendParams(this.form.value.pump.Equipment, StartDateGMT,
        EndDateGMT, 0, 0, 0,
        0, 0, 0, this.form.value.pump.Name, []);

      this._authenticateService.GetConnexionState().subscribe((response) => {
        if (response) {

          this.router.navigate([
            "/pompe-monitoring/report/result"
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
