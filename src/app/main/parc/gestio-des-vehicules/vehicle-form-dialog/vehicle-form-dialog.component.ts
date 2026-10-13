import { Component, OnInit, Inject, OnChanges, AfterViewInit } from '@angular/core';
import { Vehicle } from '../model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fuel } from '../../tank/model';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { text } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-vehicle-form-dialog',
  templateUrl: './vehicle-form-dialog.component.html',
  styleUrls: ['./vehicle-form-dialog.component.scss']
})
export class VehicleFormDialogComponent implements OnInit {

    action: string;
    vehiclePerson: Vehicle;
    Form: FormGroup;
    dialogTitle: string;
    isTransportation: boolean;
    personIcons: any[];
    carIcons: any[];
    departments: any[];
    Specialities:any[];
    drivers: any[];
    accounts: any[];
    marques: any[];
    models: any[];
    models_: any[] = [];
    fuel = Fuel;
    UrlIconName : string;
    disabled: boolean;
    files: any[] = [];
    grayCards: any[] = [];
  data: any;
  edit = false;
  urlImgGratCard:any;
  urlImgCar:any;
  CanChangeSimNumber =  true;
  filteredOptions: Observable<string[]>;
   /**
     * Constructor
     *
     * @param {MatDialogRef<VehicleFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
      public matDialogRef: MatDialogRef<VehicleFormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private translateService: TranslateService,
  ){
            this.translateService.get(['NAV.Edit_Cars_dailog' , 'NAV.Add_car_title'])
    .subscribe(data => { this.data = data }
    );

     // Set the defaults
     this.action = _data.action;
     this.departments = _data.departments;
      this.Specialities=_data.Specialities;
    _data.drivers.unshift({Id:0,Name:""});
     this.drivers = _data.drivers;
     this.carIcons = _data.carIcons;
     this.personIcons = _data.personIcons;
     this.accounts = _data.accounts;
     this.marques = _data.types;
     this.models_ = _data.models;
     this.CanChangeSimNumber = _data.CanChangeSimNumber;

    if(this.action === 'edit'){
      this.disabled = true;
      this.isTransportation = _data.vehicleOrPerson.IsTransportation;
      this.vehiclePerson = _data.vehicleOrPerson;
      this.UrlIconName = this.vehiclePerson.UrlIconName.replace('.', environment.apiUrl);
      this.urlImgCar=this.vehiclePerson.ScannedCarUrl.replace('.', environment.iconUrl);
      this.urlImgGratCard = this.vehiclePerson.ScannedGrayCardUrl.replace('.', environment.iconUrl);
        if(this.isTransportation){
          this.dialogTitle = this.data['NAV.Edit_Cars_dailog'];
                this.models = _data.models[this.vehiclePerson.CurrentCarTypeEnum];   
                this.edit = true;         
        }
        else if(!this.isTransportation){
            this.dialogTitle = this.data['NAV.Edit'];;   
        }
    }
    else {
      this.dialogTitle = this.data['NAV.Add_car_title'];; ;
      this.vehiclePerson = new Vehicle();
      this.disabled = false;
      this.models = _data.models[0];
      this.edit = false;   
    }
    this.Form = this.createVehiclePersonForm();
    this.Form.clearValidators();
    this.Form.updateValueAndValidity();
 }
 ngOnInit(): void {
  this.Form.get('isTransportation').valueChanges
  .subscribe(value => {
    this.Form.clearValidators();
    if(value) {
      this.Form.get('FullName').setValidators([Validators.required]);
    } else {
      this.Form.get('FirstName').setValidators([Validators.required]);
      this.Form.get('LastName').setValidators([Validators.required]);
    }
    this.Form.updateValueAndValidity();
  });
  this.filteredOptions = this.Form.get('Driver').valueChanges.pipe(
    startWith(''),
    map(text => this._filter(text))
  );

 }
 private _filter(driver) {
     
  let DriverName = driver.Name || driver; //
  if(Number(DriverName))
  {
    return this.drivers.filter(driver => driver.Id ==DriverName )
  }
  else
  {
  return this.drivers.filter(driver =>
    driver.Name.toLowerCase().indexOf(DriverName.toLowerCase()) >= 0);
  }
}
displayDriver = (driver) => {
  if(this.drivers == undefined)
  this.drivers = this._data.drivers;
  let DriverFind =this.drivers.find(x => x.Id ==driver ); 
  if(DriverFind)
  return DriverFind.Name
  else
  return '';
  //? driver.Name : '';
}
 /**
     * Create vehicle form
     *
     * @returns {FormGroup}
     */

 createVehiclePersonForm(): FormGroup{
   
   return this._formBuilder.group({
      Key      : [this.vehiclePerson.Key],
      isTransportation: [{value :this.isTransportation, disabled: this.disabled}],
      IconName    : [this.vehiclePerson.IconMediumName],
      FullName: [this.vehiclePerson.FullName],
      Department  : [this.vehiclePerson.DepartmentId , Validators.required],
      Specialities:[this.vehiclePerson.Speciality ],
      Driver: [this.vehiclePerson.DriverId],
      CarModel: [this.vehiclePerson.CurrentCarModelEnum],
      CarType   : [this.vehiclePerson.CurrentCarTypeEnum],
      ModelYear   : [this.vehiclePerson.CurrentModelYear],
      FuelType : [this.vehiclePerson.FuelTypeEnum],
      MileageFloat : [this.vehiclePerson.MileageFloat],
      FuelContainerCapacity: [this.vehiclePerson.FuelContainerCapacity],
      FuelTheoreticalCosumptionAvg   : [this.vehiclePerson.FuelTheoreticalCosumptionAvg],
      SimCardNumber : [this.vehiclePerson.CurrentEquipmentElement != null ? this.vehiclePerson.CurrentEquipmentElement.SimCardNumber : ''],
      Weight : [this.vehiclePerson.Weight],
      Displacement : [this.vehiclePerson.Displacement],
      ChassisNumber : [this.vehiclePerson.ChassisNumber],
      DateOfCirculation : new FormControl(this.vehiclePerson.DateOfCirculation),
      DateOfReform : new FormControl(this.vehiclePerson.DateOfReform),
      NomberOfPlaces : [this.vehiclePerson.NomberOfPlaces],
      FiscalPower : [this.vehiclePerson.FiscalPower],
      RealPower : [this.vehiclePerson.RealPower],
      ScannedGrayCardUrl : [this.vehiclePerson.ScannedGrayCardUrl],
      FullName2 : [this.vehiclePerson.FullName2],
      Mileage: [this.vehiclePerson.MileageFloat],
      FirstName : [this.vehiclePerson.FirstName],
      LastName: [this.vehiclePerson.LastName],
      Email: [this.vehiclePerson.Email, Validators.email],
      MobileTelephoneNumber: [this.vehiclePerson.MobileTelephoneNumber],
      FixTelphoneNumber: [this.vehiclePerson.FixTelphoneNumber],
      UrlIconName : [this.vehiclePerson.UrlIconName]
    })
  }

 
  radioChange(e){
    this.isTransportation = JSON.parse(e.value)
  }
  onTypeSelection(e){
    this.models= this.models_[e.value];
  }
  onSaveForm(Form){
    
    let response = [Form, this.files, this.grayCards];
    this.matDialogRef.close(response);
  }
  onSaveFormEdit(Form){
    
    let response = ['save',Form, this.files, this.grayCards];
    this.matDialogRef.close(response);
  }
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
     
    }
    this.uploadFilesSimulator(0);
   
    const reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
     this.urlImgCar = reader.result; 
 }
    
  }
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
  grayCardBrowseHandler(files){
    this.prepareGrayCardList(files);
  }
  prepareGrayCardList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.grayCards.push(item);
    }
    this.uploadGrayCardsSimulator(0);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
     this.urlImgGratCard = reader.result; 
    }
  }
  uploadGrayCardsSimulator(index: number) {
    setTimeout(() => {
      if (index === this.grayCards.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.grayCards[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadGrayCardsSimulator(index + 1);
          } else {
            this.grayCards[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }
  deleteGrayCard(index){
    this.grayCards.splice(index, 1);
  }
}
