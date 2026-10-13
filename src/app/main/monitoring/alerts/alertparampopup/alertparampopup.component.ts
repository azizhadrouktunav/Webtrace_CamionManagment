
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, ThemePalette } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { DateMoreThan } from 'app/main/helpers/compareDate';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import { map, startWith } from 'rxjs/operators';
import { SharedDataService } from '../../shared-data.service';
import { Alert } from '../model';
import { CarGroup } from '../../run-stop-state/run-stop-state.component';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
interface Type {
  value: number;
  viewValue: string;
  color?: string
}
@Component({
  selector: 'app-alertparampopup',
  templateUrl: './alertparampopup.component.html',
  styleUrls: ['./alertparampopup.component.scss']
})
export class AlertparampopupComponent {
 
  @ViewChild('picker',{static: true}) picker: any;
  data: any;
  alertForm: FormGroup;
  dateObj = new Date();
  CarGroupOptions: Observable<CarGroup[]>;
  listcargroup: CarGroup[]=[];
  stateRecord:any = [];
  filteredOptions: Observable<string[]>;
  isExpandCategory: boolean[] = [];
  displayValue: string;
  alerts : Alert[];
  types_alert: any[] = [
    {value: -2, viewValue: 'Alert.AllAlerts', color: 'red-200', selected: false},
    {value:  101, viewValue: 'Alert.OverSpeed', color: 'purple-300', selected: false},
    {value: -3, viewValue: 'Alert.AllAlertGeofence', color: 'blue-500', selected: false},
    {value: -4, viewValue: 'Alert.CountryFenceAlarm', color: 'red-500', selected: false},
    {value: -8, viewValue: 'Alert.InOutOfWay', color: 'green-500', selected: false},
    {value: 138, viewValue: 'Alert.TowedAlarm', color: 'purple-300', selected: false},
    {value: 112, viewValue: 'Alert.BatteryAlarm', color: 'green-800', selected: false},
    {value: 279, viewValue: 'Alert.ReceivedMsgFromDevice', color: 'green-300', selected: false},
    {value: 255, viewValue: 'Alert.TemperatureRangeAlarm', color: 'blue-500', selected: false},
    {value: 102, viewValue: 'Alert.FuelAlarm', color: 'pink-500', selected: false},
    {value: 143, viewValue: 'Alert.AggressiveDriving', color: 'blue-600', selected: false},
    {value: 144, viewValue: 'Alert.SOS', color: 'pink-200', selected: false},
    {value: 145, viewValue: 'Alert.Taxi', color: 'purple-300', selected: false},
    {value: 146, viewValue: 'Alert.Contact', color: 'purple-500', selected: false},
    {value: 147, viewValue: 'Alert.Trunk', color: 'green-300', selected: false},
    {value: 148, viewValue: 'Alert.Hood', color: 'red-300', selected: false},
    {value: 149, viewValue: 'Alert.Door', color: 'blue-500', selected: false},
    {value: 150, viewValue: 'Alert.MaintenanceAlarm' , color: 'red-900', selected: false},
    {value: 151, viewValue: 'Alert.StopedAlarm', color: 'purple-300', selected: false},
    {value: 152, viewValue: 'Alert.GPSSignalAlarm', color: 'blue-300', selected: false},
    {value: 153, viewValue: 'Alert.StopLongPeriod', color: 'blue-700', selected: false},
    {value: 154, viewValue: 'Alert.ExceedingDrivingTime', color: 'blue-900', selected: false},
    {value: 155, viewValue: 'Alert.DriverIdentification', color: 'purple-300', selected: false},
    {value: 156, viewValue: 'Alert.ParKAlarm', color: 'green-900', selected: false},
    {value: 3092, viewValue: 'Alert.PhotoAlarm', color: 'orange-500', selected: false},
    {value: 1002, viewValue: 'Alert.TowedVehicle', color: 'orange-200', selected: false},
    {value: -1, viewValue: 'Alert.Unknown', color: 'green-800', selected: false},
    
  ];
  periods : Type[]  = [
    {value: 1, viewValue: 'Common.Yesterday'},
    {value: 2, viewValue: 'Common.Today'},
    {value: 3, viewValue: 'Common.CurrentWeek'},
    {value: 4, viewValue: 'Common.LastWeek'},
    {value: 5, viewValue: 'Common.SpecifyPeriod'}
  ];
  filteredVehicles: any;
  TO: any;
  lastFilter: string = '';
  types : any[] = [];
  old_types : any[] = [];
  selectedTypes : any[] = [];
  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              public matDialogRef: MatDialogRef<AlertparampopupComponent>,
              private translateService : TranslateService,
              private _formBuilder: FormBuilder,
              private _sharedDataService : SharedDataService
              )
             { 
              
             
              
              
             
              this.alertForm =this._formBuilder.group({
                Car: new FormControl(null),
                type : new FormControl([-2]),
                period: new FormControl(null),
                start  : new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),0,0,0)),
                end: new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),23,59,59))
        },
        { validator: DateMoreThan('start' , 'end')
          });
          this._sharedDataService.fetchTO().subscribe(params => {
   
            this.TO =  params.param1 ;

            /*this.filteredVehicles =  this.alertForm.get('trackingObject').valueChanges.pipe(
              startWith(''),
              map(value => this.filter(value))
            );*/
            this.listcargroup =_.chain(this.TO).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
            this.CarGroupOptions =  this.alertForm.get('Car').valueChanges.pipe(
              startWith(''),
              map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
            );
            
          });
          this.types = [];
          this.types.push(-2);
          this.types_alert.forEach(element => {
            this.selectedTypes.push(element.value);
            //this.alertForm.get('type').setValue(this.selectedTypes);
          });
              
              }
 /**
     *
     * @returns {FormGroup}
     */
    createdataForm(): FormGroup
    {  
        return new FormGroup({
          
        });
    }
    selectType(event){
      
      this.selectedTypes = [];
      this.types = event.value;
      //console.log("event",event.value);
      if(this.old_types.length > 0 && this.old_types.includes(-2) && !this.types.includes(-2)){
        this.types = [];
      }else{
        if(this.types.includes(-2))
        {
          this.types = [];
          this.types.push(-2);
          this.types_alert.forEach(element => {
            this.selectedTypes.push(element.value);
          });
        }else{
          this.types.forEach(element => {
            this.selectedTypes.push(element);
          });
        }
      }
      this.old_types = this.types;
      this.alertForm.get('type').setValue(this.selectedTypes);
    }
    filter(car) {
      
      let carName = "";
      if(car != "")
      { carName = car }
     
  
     
      if( this.TO != undefined )
      { return this.TO.filter(car =>
        car.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);}
     
     
     
     } 
   
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
        this.alertForm.get('Car').setValue(this.stateRecord);
        this.isExpandCategory[group.department] = true;
      } else {
        this.stateRecord = this.stateRecord.filter((x: any) => x !== name);
        this.alertForm.get('Car').setValue(this.stateRecord);
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
            this.listcargroup = _.chain(this.TO).groupBy("DepartmentName").map((value, key) => ({
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
     let carName = val[0].FullName || val; 
     let test = opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
  //  const filterValue = val.toLowerCase();
   return opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    }
  
    }
    displayType(value){
      console.log("value",value);
      
      return value ? value.viewValue : '';
    }
}

