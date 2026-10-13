import { ViewEncapsulation } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { uniqueValidator } from 'app/main/helpers/validators/uniqueName';
import { Fuel, Tank } from 'app/main/parc/tank/model';


@Component({
  selector: 'app-tank-form-dialog',
  templateUrl: './tank-form-dialog.component.html',
  styleUrls: ['./tank-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TankFormDialogComponent implements OnInit  {

    action: string;
    tank: Tank;
    tankForm: FormGroup;
    dialogTitle: string;
    fuelOptions = Fuel;
    departments: any;
    names: string[];
    /**
     * Constructor
     *
     * @param {MatDialogRef<TankFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<TankFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _TranslateService: TranslateService
    )
    {
        this.names = _data.names;
        // Set the defaults
        this.action = _data.action;
       
        if ( this.action === 'edit' )
        {

            this._TranslateService.get('EditTank').subscribe(result => {
            
                this.dialogTitle = result;
              });
         
            
            this.tank = _data.tank;
        }
        else
        {

            this._TranslateService.get('AddTank').subscribe(result => {
            
                this.dialogTitle = result;
              });
           
            this.tank = new Tank({});
            //this.tank.DepartmentObj = new Departm()
        }

        this.tankForm = this.createTankForm();
        this.departments = _data.departments;
      
    }
    ngOnInit() :void {

        //this.tankForm.get('TotalFuelConsumptionInL').setValidators(Validators.max(this.tank.FuelLevelInL));
         this.tankForm.get('capacity').valueChanges.subscribe(data => {
            this.tankForm.get('fuelLevel').setValidators(Validators.max(data));
            this.tankForm.get('fuelLevel').updateValueAndValidity()
         });
         
       }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create tank form
     *
     * @returns {FormGroup}
     */
    createTankForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.tank.Id],
            name    : [this.tank.Name ,[Validators.required, uniqueValidator(this.names)]],
            fuelType: [this.tank.FuelType],
            capacity  : [this.tank.FuelContainerCapacityInL],
            fuelLevel: [this.tank.FuelLevelInL],
            // %
            threshold_Refuelling:  [this.tank.Threshold_Refuelling, [Validators.min(0),Validators.max(100)]],
        // %
             threshold_Draining:  [this.tank.Threshold_Draining, [Validators.min(0),Validators.max(100)]],
             DepartmentId: [this.tank.DepartmentObj.Id]
        });
    }

}
