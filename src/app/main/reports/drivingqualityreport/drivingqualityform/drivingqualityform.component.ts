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
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { Globals } from '../../globals';
import { CarGroup } from '../../project/project.component';
import * as _ from 'lodash';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';

@Component({
  selector: 'app-drivingqualityform',
  templateUrl: './drivingqualityform.component.html',
  styleUrls: ['./drivingqualityform.component.scss']
})
export class DrivingqualityformComponent implements OnInit {

  ReportingParam: any;
  trackingObjects: any[]=[];
  form: FormGroup;
  fb: any;
  trackingObject: number;
  CarMatricule: any;
  equimelemt: any;
  allowedcars = [];
  hidedriver = true;
  types = [];
  drivers: any[];
  nametype = "NAV.TrackingObject";
  showSpinners: any;
  showSeconds: any;
  stepHour: any;
  stepMinute: any;
  stepSecond: any;
  touchUi: any;
  color: any;
  Selected_chauffeur: any;
  maxDate: any;
  minDate: any;
  EndDateGMT: any;
  data: any;
  dateObj = new Date(); noshrink: any;
  filteredOptions: Observable<string[]>;
  lastFilter: string = '';
  selectedCars = [];
  Cars = [];
  displayValue: string;
  selectByCar: boolean;
  selectedDrivers = [];
  startdate: any;
  enddate: any;
  car: any;
  isExpandCategory: boolean[] = [];
  stateRecord:any = [];
  CarGroupOptions: Observable<CarGroup[]>;
  listcargroup: CarGroup[]=[];
  ListCar: any[];
  ListDriver: any[];

  constructor(private _ReportService: ReportService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService,
    private _authenticateService: AuthenticateService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private _errorHandler: ErrorHandlerService) {
      this.getparams();

    this.form = this.createForm();

  }
  OnInputSelect(){
    this.form.get('Car').setValue(''); 
  }
  OnInputDisSelect(){
    this.form.get('Car').setValue(this.stateRecord);
  }
  ngOnInit() {


    this._ReportService.getReportingParam().subscribe((result) => {
      let trackingObjects2 = decrypt(result);

      //this.trackingObjects = decrypt(result);
      this.ReportingParam = json2array(trackingObjects2);
      this.ListCar = json2array(this.ReportingParam[3]);
      this.ListDriver = json2array(this.ReportingParam[6]);

      this.ListCar.map(e => {

        this.trackingObjects.push({ 'key': e.Key, 'value': e.FullName , 'selectBy': 'car', 'DepartmentName': e.DepartmentFullName  });


      })
      
      // this.filteredOptions = this.form.get('Car').valueChanges.pipe(
      //   startWith(''),
      //   map(value => typeof value === 'string' ? value : this.lastFilter),
      //   map(filter => this._filter(filter))
      // );
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
  createForm(): FormGroup {
    return new FormGroup({
      Car: new FormControl(''),
      StartDateGMT: new FormControl(new Date(this.startdate.getFullYear(),this.startdate.getMonth() ,this.startdate.getDate(),this.startdate.getHours(),this.startdate.getMinutes() ,this.startdate.getSeconds())) ,
      EndDateGMT: new FormControl(new Date(this.enddate.getFullYear(),this.enddate.getMonth() ,this.enddate.getDate(),this.enddate.getHours(),this.enddate.getMinutes() ,this.enddate.getSeconds())),
      Emplacement: new FormControl(1),
      report: new FormControl(1),

    });


  }
  /*private _filter(car: any) {
    this.lastFilter = car;

    let carName;
    if (car == '') {
      carName = car.value || car;
      return this.types.filter(car =>
        car.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    }

    else {

      carName = car[0].value || car;
      return this.types.filter(car =>
        car.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    }

  }



  displayCar(value) {
    this.Cars = [];
    if (Array.isArray(value)) {
      this.displayValue = '';
      value.forEach((v, index) => {
        if (index === 0) {
          this.displayValue = v.value + ' ';
          this.Cars.push(v.key);
        } else {
          this.displayValue += ', ' + v.value + ' ';
          this.Cars.push(v.key);
        }
      });
      Globals.Cars = this.Cars;
      return this.displayValue;
    } else {
      return this.displayValue;
    }

  }*/

  toggleSelection(car) {
    car.selected = !car.selected;
    if (car.selected) {
      if (car.selectBy == 'car') {
        this.selectByCar = true;
        this.selectedCars.push(car);
      }
      else {
        this.selectByCar = false;
        this.selectedDrivers.push(car);
      }
    } 
    else {
  
      if (car.selectBy == 'car') {
        this.selectByCar = true;
  
        const i = this.selectedCars.findIndex(value => value.key === car.key);
        this.selectedCars.splice(i, 1);
      }
      else {
        this.selectByCar = false;
        const i = this.selectedDrivers.findIndex(value => value.key === car.key);
        this.selectedDrivers.splice(i, 1);
      }
  
    }
    if (this.selectByCar) { 
      this.form.get('Car').setValue(this.selectedCars); 
    }
    else { 
      this.form.get('Car').setValue(this.selectedDrivers); 
    }
  }
  displayCar(car) {
    return car ? car.FullName : '';
  }
  displayVehicle(v: any) {
    
    let test = v;
   if (Array.isArray(v)) {
    this.displayValue = '';
     v.forEach((v, index) => {
      if (index === 0) {
        this.displayValue = v.value + ',';
      } else {
        this.displayValue += v.value + ',';
      }
    });
    return this.displayValue;
   } else {
    return v;
   };
  }

  toggleParent(event: any, group: any) {
    group.checked = event.checked;
    //group.selected = event.checked;
    group.car.forEach((x: any) => {
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
            // selected: this.stateRecord.some((vehicle: any) => vehicle.DepartmentName === key)
            selected : this.isDepartmentChecked(key)
          })).value();
        }
        return this.listcargroup;
  }

  isDepartmentChecked(departmentName : string){
    let result = true;
    // get the list of cars that contains to departement name
    let carList = this.trackingObjects.filter((x) => x.DepartmentName == departmentName);

    // check if all carList element into stateRecord list of not
    carList.forEach((car) => {
      if(!this.stateRecord.some((vehicle: any) => vehicle.key === car.key)){
        result = false;
      }
    });    
    return result
  }
  
  private _filter(opt: any[], val: any) {
  if(val=='')
  {
    let carName = val.FullName || val;
    let test = opt.filter(item => item.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    return opt.filter(item => item.value.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
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
 return opt.filter(item => item.value.toLowerCase().indexOf(userInput.toLowerCase()) >= 0);
  }

  }

  clearVehiculeInput() {
    this.stateRecord = [];
    this.selectedCars = [];
    this.selectedDrivers = [];
    this.form.get('Car').setValue('');
  }


  optionClicked(event: Event, car) {
    event.stopPropagation();
    this.toggleSelection(car);
  }

  
  onChangeType(type)
  {
    this.clearVehiculeInput();
    switch (type) {
      case '1': {
          this.trackingObjects = [];
          this.selectedCars = [];
          this.nametype = "NAV.TrackingObject";
          this.ListCar.map(e => {
            this.trackingObjects.push({ 'key': e.Key, 'value': e.FullName , 'selectBy': 'car', 'DepartmentName': e.DepartmentFullName  });
            });
       
          // this.filteredOptions = this.form.get('Car').valueChanges.pipe(
          //   startWith(''),
          //   map(value => typeof value === 'string' ? value : this.lastFilter),
          // map(filter => this._filter(filter))
          // );
          this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
          this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
            startWith(''),
            map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
          );
          break;
      }
      case '2': {
          this.trackingObjects = [];
         

          this.nametype = "NAV.Driver";
         // this.trackingObjects=this.ListDriver;
         this.ListDriver.map(e => {
           let test = e.key;
          this.trackingObjects.push({ 'key': e.key, 'value': e.FullName , 'selectBy': 'Driver', 'DepartmentName': e.DepartmentString  });
          });
          // this.filteredOptions = this.form.get('Car').valueChanges.pipe(
          //   startWith(''),
          //   map(value => typeof value === 'string' ? value : this.lastFilter),
          // map(filter => this._filter(filter))
          // );
          this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
          this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
            startWith(''),
            map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
          );
          break;
      }}

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
      /*this.trackingObjects.forEach(e => {
        if (e.Key.toString() == this.form.value.Car) {
          this.CarMatricule = e.FullName;
        }
      });*/

      let cars = this.stateRecord.map(e => e.key);
      
      this._SharedreportdataService.sendParams(cars, StartDateGMT,
        EndDateGMT, this.form.value.Emplacement, 0, 0,
        0, 0, this.form.value.report, this.CarMatricule, []);

      this._authenticateService.GetConnexionState().subscribe((response) => {
        if (response) {

          this.router.navigate([
            "/reports/drivingqualityreport/Details"
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

