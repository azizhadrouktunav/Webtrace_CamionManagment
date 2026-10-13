import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/fr';
import { locale as arab } from '../../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators';
import { CarGroup } from '../../run-stop-state/run-stop-state.component';
import * as _ from 'lodash';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
@Component({
  selector: 'app-forced-stop',
  templateUrl: './forced-stop.component.html',
  styleUrls: ['./forced-stop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForcedStopComponent {

  dialogTitle : string = 'SendArming';
  equipmenent: string =  "";
  typeAlerts : any[] 
  alertForm: FormGroup;
  outputArming: boolean;
  forcedAAD: boolean;
  isMultipleDevices: boolean = false;

  //--AutoComplete--//
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  cars: string[] = [];
  allCars : any[] = [];
  allCarsString : string[] = [];
  isExpandCategory: boolean[] = [];
  lastFilter: string = '';
  displayValue: string;
  CarGroupOptions: Observable<CarGroup[]>;
  listcargroup: CarGroup[]=[];
  stateRecord:any = [];
  allCarsData : any[] = [];
  form: FormGroup;
  fb: any;

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  
  constructor(
    public matDialogRef: MatDialogRef<ForcedStopComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
    this.forcedAAD = _data.forcedAAD;
    this.outputArming = _data.outputArming;
    this.allCars = _data.cars;
    this.allCars = this.allCars.filter(x => x.Equipment != null);
    
    this.allCars.forEach(car => {
      this.allCarsData.push(car.data);
    });
    console.log(this.allCarsData);
    this.allCarsString = this.allCars.map(x => x.name);
    this.allCarsString.unshift('Tous les équipements');
    
   this.typeAlerts =  [
      {
       checked : !(this.outputArming),
        viewValue: 'DisableArming',
        value : 'desactivedArming'
      },
      {
       checked :  this.outputArming,
        viewValue: 'EnableArming',
        value : 'activedArming'
      }
    ];
    this.equipmenent = _data.equipment;
    this.cars.push(this.allCars.filter(car => car.Equipment == this.equipmenent)[0].name);
    this.alertForm = this._formBuilder.group({
      activatedAlert : [null , Validators.required],
      equipment : [this.equipmenent, Validators.required]
    });
   this.form = this.createForm();
  }

  valueChange(event){
    if(event.checked){
      this.isMultipleDevices = true;
    }else{
      this.isMultipleDevices = false;
    }
  }

  //---First methode call --//
  ngOnInit(): void {
    this.listcargroup =_.chain(this.allCarsData).groupBy("DepartmentName").map((value,key)=>({department:key,car:value})).value();
    this.CarGroupOptions =  this.form.get('Car').valueChanges.pipe(
      startWith(''),
      map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
    );
  }
  

  remove(car: string): void {
    const index = this.cars.indexOf(car);

    if (index >= 0) {
      this.cars.splice(index, 1);
    }
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
          this.listcargroup = _.chain(this.allCarsData).groupBy("DepartmentName").map((value, key) => ({
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
  createForm(): FormGroup {
    return new FormGroup({
      Car: new FormControl(''),
    });
  }
}
