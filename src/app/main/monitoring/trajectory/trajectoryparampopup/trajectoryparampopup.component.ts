
 
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, ThemePalette } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { DateMoreThan } from 'app/main/helpers/compareDate';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { Vehicle } from 'app/main/parc/gestio-des-vehicules/model';
import { map, startWith } from 'rxjs/operators';
import { SharedDataService } from '../../shared-data.service';
interface Type {
  value: number;
  viewValue: string;
  color?: string
}
@Component({
  selector: 'app-trajectoryparampopup',
  templateUrl: './trajectoryparampopup.component.html',
  styleUrls: ['./trajectoryparampopup.component.scss']
})
export class TrajectoryparampopupComponent {
 
  @ViewChild('picker',{static: true}) picker: any;
  data: any;
  form: FormGroup;
  dateObj = new Date();
  carSelected= null;
  trackingObject =null;

  filteredVehicles: any;
  TO: any;
  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              public matDialogRef: MatDialogRef<TrajectoryparampopupComponent>,
              private translateService : TranslateService,
              private _formBuilder: FormBuilder,
              private _sharedDataService : SharedDataService
              )
             { 
              
             
              
              this.carSelected= _data.carSelected;
             
              this.form =this._formBuilder.group({
                trackingObject: [this.carSelected != null ? this.carSelected : '' ],
                start  : new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),0,0,0)),
                end: new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),23,59,59))
        },
        { validator: DateMoreThan('start' , 'end')
          });
         this.form.get('trackingObject').setValue(this.carSelected);
          this._sharedDataService.fetchTO().subscribe(params => {
   
            this.TO =  params.param1 ;
            this.filteredVehicles =  this.form.get('trackingObject').valueChanges.pipe(
              startWith(''),
              map(value => this.filter(value))
            );
            
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
    displayVehicle(v: Vehicle) {
      return v ? v.FullName : '';
 }
 
    filter(car) {
      let carName = "";
      if(car != "")
      { carName = car }
     
  
     
      if( this.TO != undefined )
      { return this.TO.filter(car =>
        car.FullName.toLowerCase().indexOf(carName) >= 0);}
     
     
     
     } 
   


}

