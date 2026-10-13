import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service'; import { decrypt } from 'app/main/parc/Parc';
import { json2array } from 'app/main/helpers/must-match.validator';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { dayDiff, showSnackBar } from 'app/main/helpers/validators/validators';
import { daysSaufWeeknd } from 'app/main/parc/maintenance/department';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Globals } from '../../globals';
import { CarGroup } from '../../project/project.component';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
@Component({
  selector: 'app-statisticsinworktimeform',
  templateUrl: './statisticsinworktimeform.component.html',
  styleUrls: ['./statisticsinworktimeform.component.scss']
})
export class StatisticsinworktimeformComponent implements OnInit {

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
  days = daysSaufWeeknd;
  dateObj = new Date(); noshrink: any;
  filteredOptions: Observable<string[]>;
  lastFilter: string = '';
  selectedCars = [];
  Cars = [];
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  public model = [

  ];
  isExpandCategory: boolean[] = [];
  listcargroup: CarGroup[]=[];
  stateRecord:any = [];
  CarGroupOptions: Observable<CarGroup[]>;

  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;

  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return ['selected'];
    }
    return [];
  }
  displayValue: any;

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(date);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
        // this._picker['_popupComponentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }


  OnInputSelect(){
    this.form.get('Car').setValue(''); 
  }
  OnInputDisSelect(){
    this.form.get('Car').setValue(this.stateRecord);
  }

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
      this.trackingObjects = json2array(this.ReportingParam[3]);
      this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
      this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
      );
    },
      (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });
  }
 
  displayCar(car) {
    return car ? car.FullName : '';
  }
  displayVehicle(v: Vehicle) {
    if (Array.isArray(v)) {
      this.displayValue = '';
       v.forEach((v, index) => {
        if (index === 0) {
          this.displayValue = v.FullName + ',';
        } else {
          this.displayValue += v.FullName + ',';
        }
      });
      return this.displayValue;
     } else {
      return this.displayValue;
     };
  }
  toggleParent(event: any, group: any) {
     
     
      group.checked = event.checked;
      group.selected = event.checked;
      group.car.forEach((x: Vehicle) => {
        this.toggleSelection2(event, x, group);
      })
    
  }
  toggleSelection2(event: any, name: any, group: any) {
    if (event.checked) {
      this.stateRecord.push(name);
      name.checked = true;
      this.form.get('Car').setValue(this.stateRecord);
      this.isExpandCategory[group.department] = true;
    } else {
      this.stateRecord = this.stateRecord.filter((x: any) => x !== name);
      this.form.get('Car').setValue(this.stateRecord);
      name.checked = false;
      // Reset the checked property of the checkbox
      //group.checked = this.stateRecord.includes(name);
      //this.states.setValue([]);
    }
  }
  expandDocumentTypes(group: any) {
 
    this.isExpandCategory[group.department] = !this.isExpandCategory[group.department];
    // expand only selected parent dropdown category with that childs
  }
  filterGroup(val: any) {
    this.lastFilter = val;
      
        if (typeof val === 'string' && val !== '' && val.length > 1) {
          // Filtering logic when val has more than 1 character
          let filtered = this.listcargroup.filter(group => ({ department: group.department, car: this._filter(group.car, val) }).car.length > 0);
          for (let index = 0; index < filtered.length; index++) {
            filtered[index].car = filtered[index].car.filter(item => this._filter(filtered[index].car, val).indexOf(item) > -1);
          }
          return filtered;
        } else {
          this.listcargroup = _.chain(this.trackingObjects).groupBy("DepartmentName").map((value, key) => ({
            department: key,
            car: value,
            // Set the 'selected' property based on the existence of selected vehicles
            selected: this.stateRecord.some((vehicle: Vehicle) => vehicle.DepartmentName === key && vehicle.FullName)
          })).value();
        }
      
        return this.listcargroup;
  
    
  }
  
  private _filter(opt: Vehicle[], val: any) {
  //   this.lastFilter = car;

  //   let carName ;
  //   if(car == '')
  
  //  {
  //    carName = car.FullName || car;
  //    return this.trackingObjects.filter(car =>
  //     car.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  //  } 
   
  //  else{
     
  //    carName = car[0].FullName || car; 
  //    return this.trackingObjects.filter(car =>
  //     car.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  //   }
  if(val=='')
  {
    let carName = val.FullName || val;
    let test = opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    return opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  }
  else
  {
    let userInput = "";
    if(val.includes(',')){
      let splitedArrays = val.split(',');
      userInput = splitedArrays[splitedArrays.length - 1];
    }
    else{
      userInput = val[0].value || val;
    }
 return opt.filter(item => item.FullName.toLowerCase().indexOf(userInput.toLowerCase()) >= 0);
  }

  }

  optionClicked(event: Event, car) {
    event.stopPropagation();
    this.toggleSelection(car);
  }

  toggleSelection(car) {
    car.selected = !car.selected;
    if (car.selected) {
      this.selectedCars.push(car);
    } else {
      const i = this.selectedCars.findIndex(value => value.Key === car.Key);
      this.selectedCars.splice(i, 1);
    }
    this.form.get('Car').setValue(this.selectedCars);
  }
  createForm(): FormGroup {
    return new FormGroup({


      Car: new FormControl(''),
      StartDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 0, 0, 0)),
      EndDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(), this.dateObj.getUTCMonth(), this.dateObj.getUTCDate(), 23, 59, 59)),
      Emplacement: new FormControl(1),
      EnabledDayOfWeekes: new FormControl(''),
      worktimefrom: new FormControl(new Date(2020, 11, 10, 8, 0, 0)),
      worktimeto: new FormControl(new Date(2020, 11, 10, 18, 0, 0)),
      holidays: new FormControl(''),
    });


  }
  changedDays(e) {
    //this.maintenance.EnabledDayOfWeekes = e.value;
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
      // this.trackingObjects.forEach(e => {
      //   if (e.Key.toString() == this.form.value.Car) {
      //     this.CarMatricule = e.FullName;
      //   }
      // });
      let cars = this.stateRecord.map((x: any) => x.Key);
      this._SharedreportdataService.sendParams(cars, StartDateGMT,
        EndDateGMT, this.form.value.Emplacement, 0, this.form.value.EnabledDayOfWeekes,
        this.form.value.worktimefrom, this.form.value.worktimeto, 0, this.CarMatricule, this.model);

      this._authenticateService.GetConnexionState().subscribe((response) => {

        if (response) {

          this.router.navigate([
            "/reports/statisticsinworktime/Details"
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
