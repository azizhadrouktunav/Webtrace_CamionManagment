
import { ViewEncapsulation } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { uniqueValidator } from 'app/main/helpers/validators/uniqueName';
import { Fuel, Tank } from 'app/main/parc/tank/model';


@Component({
  selector: 'app-mobiletankformdialog',
  templateUrl: './mobiletankformdialog.component.html',
  styleUrls: ['./mobiletankformdialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MobiletankformdialogComponent implements OnInit  {

    action: string;
    tank: any;
    tankForm: FormGroup;
    dialogTitle: string;
    fuelOptions = Fuel;
    departments: any;
    names: string[];
    /**
     * Constructor
     *
     * @param {MatDialogRef<MobiletankformdialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<MobiletankformdialogComponent>,
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
            sn: [this.tank.SNSonde],
            capacity  : [this.tank.Capacity],
            equipment: [this.tank.Equipment]
        });
    }

}
