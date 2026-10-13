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
import { CarGroup } from '../../project/project.component';
import * as _ from 'lodash';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';

@Component({
  selector: 'app-temperaturereportform',
  templateUrl: './temperaturereportform.component.html',
  styleUrls: ['./temperaturereportform.component.scss']
})
export class TemperaturereportformComponent implements OnInit {

  ReportingParam: any;
  ListCar:  any[];
  trackingObjects: any[]=[];
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
  isExpandCategory: boolean[] = [];
  stateRecord:any = [];
  CarGroupOptions: Observable<CarGroup[]>;
  listcargroup: CarGroup[]=[];
  lastFilter: string = '';
  selectedCars = [];
  dateObj = new Date(); noshrink: any;
  startdate: any;
  enddate: any;
  car: any;
  displayValue: string;

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

      // this.filteredOptions = this.form.get('Car').valueChanges.pipe(
      //   startWith(''),
      //   map(value => this._filter(value))
      // );
      this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
      this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
      );
    });
  }
  createForm(): FormGroup {
    return new FormGroup({


      Car:  new FormControl(''), //new FormControl(this.car),
      StartDateGMT: new FormControl(new Date(this.startdate.getFullYear(),this.startdate.getMonth() ,this.startdate.getDate(),this.startdate.getHours(),this.startdate.getMinutes() ,this.startdate.getSeconds())) ,
      EndDateGMT: new FormControl(new Date(this.enddate.getFullYear(),this.enddate.getMonth() ,this.enddate.getDate(),this.enddate.getHours(),this.enddate.getMinutes() ,this.enddate.getSeconds())),
      Emplacement: new FormControl(1),

    });


  }
  // private _filter(car: any) {
  //   let carName = car.FullName || car; //
  //   return this.ListCar.filter(car =>
  //     car.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  // }
  // displayCar(car) {
  //   return car ? car.FullName : '';
  // }
  displayCar(car) {
    return car ? car.FullName : '';
  }
  displayVehicle(v: Vehicle) {
    let test = v;
   if (Array.isArray(v)) {
    this.displayValue = '';
     v.forEach((v, index) => {
      if (index === 0) {
        this.displayValue = v.FullName + ' ';
      } else {
        this.displayValue += ', ' + v.FullName + ' ';
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
      console.log("this.stateRecord", this.stateRecord);
    } else {
      this.stateRecord = this.stateRecord.filter((x: any) => x !== name);
      console.log(this.stateRecord);
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
      
        console.log("filterGroup", this.listcargroup);
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
   let carName = val[0].FullName || val; 
   let test = opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
//  const filterValue = val.toLowerCase();
 return opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
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
      const i = this.selectedCars.findIndex(value => value.Key === car.Key );
      this.selectedCars.splice(i, 1);
    }
  
    this.form.get('Car').setValue(this.selectedCars);
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
      /*this.ListCar.forEach(e => {
        if (e.Key.toString() == this.form.value.Car.Key) {
          this.CarMatricule = e.FullName;
        }
      });
      this.trackingObject = this.form.value.Car;
      this.documentType = +data.Id;
      this.documentTypeString = +data.DocumentType;*/
      let ListkeyTrackingObject :number[]=[];
      let firstData = ""
      let matricules = []
    if(Object.prototype.toString.call(this.form.get('Car').value) === '[object Array]') {
      this.form.get('Car').value.forEach(e=>{
        ListkeyTrackingObject.push(e.Key);
        firstData = e.FullName;
        matricules.push(e.FullName);
      })
    }
    else{
      ListkeyTrackingObject.push(this.form.get('Car').value.Key);
    }
      this._SharedreportdataService.sendParams(ListkeyTrackingObject, StartDateGMT,
        EndDateGMT, this.form.value.Emplacement, 0, 0,
        0, 0, 0, "" , ListkeyTrackingObject.length == 1 ? [firstData] : matricules);

      this._authenticateService.GetConnexionState().subscribe((response) => {

        if (response) {

          this.router.navigate([
            "/reports/temperaturereport/Details"
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
