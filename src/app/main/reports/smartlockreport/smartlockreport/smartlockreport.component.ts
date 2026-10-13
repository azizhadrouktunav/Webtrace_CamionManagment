import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';
import { decrypt } from 'app/main/parc/Parc';
import { json2array } from 'app/main/helpers/must-match.validator';
import { TranslateService } from '@ngx-translate/core';
import { MatOption, MatSnackBar } from '@angular/material';
import { dayDiff, showSnackBar } from 'app/main/helpers/validators/validators';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-smartlockreport',
  templateUrl: './smartlockreport.component.html',
  styleUrls: ['./smartlockreport.component.scss']
})
export class SmartlockreportComponent implements OnInit {

  ReportingParam: any;
  trackingObjects: any;
  form: FormGroup;
  fb: any;
  trackingObject: number;
  CarMatricule: any;
  stepSecond: any;
  showSpinners: any;
  showSeconds: any;
  stepHour: any;
  stepMinute: any;
  touchUi: any;
  color: any;
  minDate: any;
  maxDate: any;
  EndDateGMT: any;
  Selected_chauffeur: any;
  customLoadingTemplate: any;
  data: any;

  dateObj = new Date(); noshrink: any;
  filteredOptions: Observable<string[]>;
  constructor(private _ReportService: ReportService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService, private _authenticateService: AuthenticateService,

    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) {
    this.form = this.createForm();

  }

  ngOnInit() {

    this._ReportService.getReportingParam().subscribe((result) => {


      this.trackingObjects = decrypt(result);
      this.ReportingParam = json2array(this.trackingObjects);
      this.trackingObjects = json2array(this.ReportingParam[3]).filter(x=>x.CurrentEquipmentElement.EquipementTypeEnumString =="Elock");;
      this.filteredOptions = this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );


    });
  }
  createForm(): FormGroup {
    return new FormGroup({


      Car: new FormControl(''),
      StartDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 0, 0, 0)),
      EndDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 23, 59, 59)),
      Emplacement: new FormControl(1),
      Speed: new FormControl('70'),

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
        EndDateGMT, this.form.value.Emplacement, 0, this.form.value.Speed,
        0, 0, 2, this.CarMatricule, []);

      this._authenticateService.GetConnexionState().subscribe((response) => {

        if (response) {

          this.router.navigate([
        "/reports/smartlockreport/Details"  
          ]);

        }

        else {

          this.router.navigate(['app-auth']);
          return false;
        }
      });

    }
  }
}
