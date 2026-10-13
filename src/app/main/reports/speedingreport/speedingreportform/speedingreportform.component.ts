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
import { Globals } from '../../globals';
import { CarGroup } from '../../project/project.component';
import * as _ from 'lodash';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';


@Component({
  selector: 'app-speedingreportform',
  templateUrl: './speedingreportform.component.html',
  styleUrls: ['./speedingreportform.component.scss']
})
export class SpeedingreportformComponent implements OnInit {

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

    lastFilter: string = '';



 dateObj = new Date();noshrink : any;
  selectedCars = [];
  Cars : any;
  displayValue: string;
  startdate: any;
  enddate: any;
  CarGroupOptions: Observable<CarGroup[]>;
  listcargroup: CarGroup[]=[];
  stateRecord:any = [];
  filteredOptions: Observable<string[]>;
  isExpandCategory: boolean[] = [];

 constructor(     private _ReportService: ReportService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService,  private _authenticateService: AuthenticateService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService
    



    ) { 
      this.getparams();

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
//  const filterValue = val.toLowerCase();

 return opt.filter(item => item.FullName.toLowerCase().indexOf(userInput.toLowerCase()) >= 0);
  }

  }
  OnInputSelect(){
    this.form.get('Car').setValue(''); 
  }
  OnInputDisSelect(){
    this.form.get('Car').setValue(this.stateRecord);
  }
  createForm(): FormGroup {
    return new FormGroup({
   

        Car: new FormControl(''),
        StartDateGMT: new FormControl(new Date(this.startdate.getFullYear(),this.startdate.getMonth() ,this.startdate.getDate(),this.startdate.getHours(),this.startdate.getMinutes() ,this.startdate.getSeconds())) ,
        EndDateGMT: new FormControl(new Date(this.enddate.getFullYear(),this.enddate.getMonth() ,this.enddate.getDate(),this.enddate.getHours(),this.enddate.getMinutes() ,this.enddate.getSeconds())),
        Emplacement: new FormControl(1),
        Speed: new FormControl('70'),
        RPM: new FormControl('3000'),
    });

    
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

  var EndDateGMT = this.form.value.EndDateGMT._d != undefined ? this.form.value.EndDateGMT._d :   this.form.value.EndDateGMT; 
    
  if (dayDiff(StartDateGMT, EndDateGMT)>31)
  {
   this.translateService.get(['NAV.Onemonth'])
    .subscribe(data => {this.data = data}
         );
   showSnackBar( this.data["NAV.Onemonth"],this._matSnackBar)}
  else{
 this.trackingObjects.forEach(e=>{
  if(e.Key.toString() == this.form.value.Car){
    this.CarMatricule = e.FullName;
  }
});

  let cars = this.stateRecord.map(x => x.Key);



  this._SharedreportdataService.sendParams(cars, StartDateGMT,
  EndDateGMT,this.form.value.Emplacement,0,this.form.value.Speed,
  this.form.value.RPM,0,0,this.CarMatricule,[]);

  this._authenticateService.GetConnexionState().subscribe((response) => {
    
    if (response) {
  
      this.router.navigate([
        "/reports/speedingreport/Details"  
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
    {
    this.startdate = params.param2;
    this.enddate = params.param3;
   
    }
    
  });  
}
}
