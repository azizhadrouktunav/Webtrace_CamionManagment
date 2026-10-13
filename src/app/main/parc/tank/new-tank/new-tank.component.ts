import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Tank, Fuel } from '../model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TankComponent } from '../tank.component';

@Component({
  selector: 'app-new-tank',
  templateUrl: './new-tank.component.html',
  styleUrls: ['./new-tank.component.scss']
})
export class NewTankComponent implements OnInit {

  action: string;
  tank: Tank;
  tankForm : FormGroup;
  dialogTitle: string;
  fuelOptions = Fuel;
  
    /**
     * Constructor
     *
     * @param {MatDialogRef<NewTankComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<NewTankComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
  ) {
   this.tank = _data.tank
   this.action = _data.action;
   if( this.action === 'edit'){
    this.dialogTitle = 'Edit ' + this.tank.Name;
   }
   else{
     this.dialogTitle = 'New Tank';
     this.tank = new Tank()
   }
   this.tankForm = this.createTankForm();
   }
   ngOnInit() :void {

    //this.tankForm.get('TotalFuelConsumptionInL').setValidators(Validators.max(this.tank.FuelLevelInL));
     this.tankForm.get('FuelLevelInL').valueChanges.subscribe(data => {
        this.tankForm.get('TotalFuelConsumptionInL').setValidators(Validators.max(data));
        this.tankForm.get('TotalFuelConsumptionInL').updateValueAndValidity()
     });
     
   }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the tank form
     *
     * @returns {FormGroup}
     */
    createTankForm(): FormGroup
    {
      return new FormGroup({
        TankId: new FormControl(this.tank.Id),
        Name: new FormControl(this.tank.Name, Validators.required),
        FuelType: new FormControl(this.tank.FuelType, Validators.required),
        FuelContainerCapacityInL: new FormControl(this.tank.FuelContainerCapacityInL, Validators.required),
        FuelLevelInL: new FormControl(this.tank.FuelLevelInL, Validators.max(this.tank.FuelContainerCapacityInL)),
        TotalFuelConsumptionInL: new FormControl(this.tank.TotalFuelConsumptionInL)
      })
    }
}
