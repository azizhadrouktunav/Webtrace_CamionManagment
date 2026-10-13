import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';
import { json2array } from 'app/main/helpers/must-match.validator';
import { showSnackBar } from 'app/main/helpers/showSnackBar';
import { dayDiff } from 'app/main/helpers/validators/validators';
import { decrypt } from 'app/main/parc/Parc';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import * as _ from 'lodash';
@Component({
  selector: 'app-trajetreportform',
  templateUrl: './trajetreportform.component.html',
  styleUrls: ['./trajetreportform.component.scss']
})
export class TrajetreportformComponent implements OnInit {

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
    CarGroupOptions: Observable<CarGroup[]>;
    displayValue: string;
    lastFilter: string = '';
    listcargroup: CarGroup[]=[];
    stateRecord:any = [];
    isExpandCategory: boolean[] = [];

 dateObj = new Date();noshrink : any;
 filteredOptions: Observable<string[]>;
  startdate: any;
  enddate: any;
 constructor(     private _ReportService: ReportService,
    private router: Router,
    private _SharedreportdataService: SharedreportdataService,  private _authenticateService: AuthenticateService,

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
      /*this.filteredOptions = this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );*/
      this.listcargroup =_.chain(this.trackingObjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
      this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
        startWith(''),
        map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
      );

    
    });  
  }
  createForm(): FormGroup {
    return new FormGroup({
   

        Car: new FormControl(''),
        StartDateGMT: new FormControl(new Date(this.startdate.getFullYear(),this.startdate.getMonth() ,this.startdate.getDate(),this.startdate.getHours(),this.startdate.getMinutes() ,this.startdate.getSeconds())) ,
        EndDateGMT: new FormControl(new Date(this.enddate.getFullYear(),this.enddate.getMonth() ,this.enddate.getDate(),this.enddate.getHours(),this.enddate.getMinutes() ,this.enddate.getSeconds())),
        Emplacement: new FormControl(1),
        Speed: new FormControl('70'),
        mindistance:new FormControl('0')
       
    });

    
}
_filter(opt: Vehicle[], val: any) {
  if(val=='')
  {
    let carName = val.FullName || val;
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
OnInputSelect(){
  this.form.get('Car').setValue(''); 
}
OnInputDisSelect(){
  this.form.get('Car').setValue(this.stateRecord);
}
toggleSelection2(event: any, name: any, group: any) {
  if (event.checked) {
    this.stateRecord.push(name);
    name.checked = true;
    this.form.get('Car').setValue(this.stateRecord);
    this.isExpandCategory[group.department] = true;
  } else {
    this.stateRecord = this.stateRecord.filter((x: any) => x !== name);
    console.log(this.stateRecord);
    this.form.get('Car').setValue(this.stateRecord);
    name.checked = false;
  }
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
expandDocumentTypes(group: any) {
 
  this.isExpandCategory[group.department] = !this.isExpandCategory[group.department];
  // expand only selected parent dropdown category with that childs
}
GetReportParam() {
  var StartDateGMT = this.form.value.StartDateGMT._d != undefined ? this.form.value.StartDateGMT._d : this.form.value.StartDateGMT; 

  var EndDateGMT = this.form.value.EndDateGMT._d != undefined ? this.form.value.EndDateGMT._d :   this.form.value.EndDateGMT; 
    
  if (dayDiff(StartDateGMT,EndDateGMT)>31)
  {
   this.translateService.get(['NAV.Onemonth'])
    .subscribe(data => {this.data = data}
         );
   showSnackBar( this.data["NAV.Onemonth"],this._matSnackBar)}
  else{
 /*this.trackingObjects.forEach(e=>{
  if(e.Key.toString() == this.form.value.Car.Key){
    this.CarMatricule = e.FullName;
  }
});*/
let ListkeyTrackingObject :number[]=[];
if(Object.prototype.toString.call(this.form.get('Car').value) === '[object Array]') {
  this.form.get('Car').value.forEach(e=>{
    ListkeyTrackingObject.push(e.Key);

  })
}
else{
  ListkeyTrackingObject.push(this.form.get('Car').value.Key);
}
 /*this.trackingObject = this.form.value.Car;
 this.documentType = +data.Id;
 this.documentTypeString = +data.DocumentType;*/
 this._SharedreportdataService.sendParams(ListkeyTrackingObject, StartDateGMT,
 EndDateGMT,this.form.value.Emplacement,0,this.form.value.Speed,
 this.form.value.mindistance,0,2,this.CarMatricule,[]);

  this._authenticateService.GetConnexionState().subscribe((response) => {
    
    if (response) {
  
      this.router.navigate([
        "/reports/trajetreport/Details"  
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
export interface CarGroup {
  department: string;
  car: Vehicle[];
}
